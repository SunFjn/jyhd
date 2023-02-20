///<reference path="../config/guide_cfg.ts"/>


/** 引导*/


namespace modules.guide {
    import guide = Configuration.guide;
    import GuideCfg = modules.config.GuideCfg;
    import guideFields = Configuration.guideFields;
    import Sprite = Laya.Sprite;

    export class GuideModel {
        private static _instance: GuideModel;
        public static get instance(): GuideModel {
            return this._instance = this._instance || new GuideModel();
        }

        private _restGuids: Array<guide>;
        private _spriteTable: Table<Sprite>;
        // 当前引导
        private _curGuide: guide;

        constructor() {
            this._spriteTable = {};
        }

        // 初始化引导，根据服务器返回的已完成的引导过滤出未完成的引导
        public initGuides(value: Array<number>): void {
            this._restGuids = [];
            let cfgs: Array<guide> = GuideCfg.instance.cfgs;
            if (!cfgs) return;
            for (let i: int = 0, len: int = cfgs.length; i < len; i++) {
                let cfg: guide = cfgs[i];
                if (value.indexOf(cfg[guideFields.id]) !== -1) {        // 已完成的
                    continue;
                }
                this._restGuids.push(cfg);
            }
            GlobalData.dispatcher.event(CommonEventType.GUIDE_REST_INITED);
        }

        // 完成一个引导
        public completeGuides(ids: Array<number>): void {
            for (let i: int = 0; i < this._restGuids.length; i++) {
                if (ids.indexOf(this._restGuids[i][guideFields.id]) !== -1) {
                    this._restGuids.splice(i, 1);
                    i--;
                }
            }
            // GlobalData.dispatcher.event(CommonEventType.GUIDE_COMPLETE, [ids]);
        }

        // 获取剩余引导
        public get restGuides(): Array<guide> {
            return this._restGuids;
        }

        // 当前引导
        public get curGuide(): guide {
            return this._curGuide;
        }

        public set curGuide(value: guide) {
            this._curGuide = value;
            //console.log("引导", value)
            GlobalData.dispatcher.event(CommonEventType.GUIDE_CUR_UPDATE);
        }

        // 注册一个UI
        public registeUI(id: GuideSpriteId, spr: Sprite): void {
            if (!this._spriteTable[id]) {
                this._spriteTable[id] = spr;
                GlobalData.dispatcher.event(CommonEventType.GUIDE_REGISTE_UI, id);
            }
        }

        // 删除一个UI
        public removeUI(id: GuideSpriteId): void {
            if (this._spriteTable[id]) {
                this._spriteTable[id] = null;
                GlobalData.dispatcher.event(CommonEventType.GUIDE_REMOVE_UI, id);
            }
        }

        // 根据翅膀id获取翅膀
        public getUIByid(id: GuideSpriteId): Sprite {
            return this._spriteTable[id];
        }
    }
}