/** 鼓舞弹框*/


namespace modules.dungeon {
    import InspireAlertUI = ui.InspireAlertUI;
    import Event = Laya.Event;
    import BtnGroup = modules.common.BtnGroup;
    import Inspire = Protocols.Inspire;
    import InspireFields = Protocols.InspireFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import PlayerModel = modules.player.PlayerModel;
    import CommonUtil = modules.common.CommonUtil;
    import LayaEvent = modules.common.LayaEvent;

    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import AutoInspire = Protocols.AutoInspire;
    import AutoInspireFields = Protocols.AutoInspireFields;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;

    export class InspireAlert extends InspireAlertUI {
        protected _btnGroup: BtnGroup;

        constructor() {
            super();
        }

        public destroy(): void {
            this._btnGroup = this.destroyElement(this._btnGroup);
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            // this._btnGroup = new BtnGroup();
            // this._btnGroup.setBtns(this.coinBtn, this.ingotBtn);

            let coinParams: number[] = BlendCfg.instance.getCfgById(10304)[blendFields.intParam];
            let ingotParams: number[] = BlendCfg.instance.getCfgById(10305)[blendFields.intParam];

            this.coinTxt.text = `${coinParams[0]}/次`;
            this.ingotTxt.text = `${ingotParams[0]}/次`;

            let max: number = coinParams[2];
            max += ingotParams[2];//
            let value: number = Math.floor(coinParams[1] * 100);
            this.decTxt.text = `每次鼓舞增加角色${value}%攻击 (上限${value * max}%)`;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.inspireCopperBtn, LayaEvent.CLICK, this, this.inspireHandler, [1]);
            this.addAutoListener(this.inspireGoldBtn, LayaEvent.CLICK, this, this.inspireHandler, [2]);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_INSPIRE_UPDATE, this, this.inspireUpdate);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.COPY_AUTO_INSPIRE, this, this.inspireUpdate);
            this.addAutoListener(this.toggleCopperBtn, LayaEvent.CLICK, this, this.setAutoinspire, [1]);
            this.addAutoListener(this.toggleGoldBtn, LayaEvent.CLICK, this, this.setAutoinspire, [2]);
        }
        protected setAutoinspire(type): void {
            if (type == 1) {
                this.toggleCopperBtn.selected = !this.toggleCopperBtn.selected
                DungeonCtrl.instance.setAutoInspire(this.sceneEx, type, this.toggleCopperBtn.selected)
            } else {
                this.toggleGoldBtn.selected = !this.toggleGoldBtn.selected
                DungeonCtrl.instance.setAutoInspire(this.sceneEx, type, this.toggleGoldBtn.selected)
            }


        }

        public sceneEx: SceneTypeEx = SceneTypeEx.common;
        public onOpened(): void {
            super.onOpened();
            let mapId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            let cfg = SceneCfg.instance.getCfgById(mapId);
            this.sceneEx = cfg[sceneFields.type]

            this.inspireUpdate();
        }

        protected inspireHandler(type: number): void {
            // if (this._btnGroup.selectedIndex === 0) {
            //     if (PlayerModel.instance.copper < BlendCfg.instance.getCfgById(10304)[blendFields.intParam][0]) {
            //         CommonUtil.noticeError(12106);
            //         return;
            //     }
            // } else if (this._btnGroup.selectedIndex === 1) {
            //     if (PlayerModel.instance.ingot < BlendCfg.instance.getCfgById(10305)[blendFields.intParam][0]) {
            //         CommonUtil.noticeError(12107);
            //         return;
            //     }
            // } else return;
            // DungeonCtrl.instance.reqInspire(this._btnGroup.selectedIndex + 1);
            let auto = false;
            if (type == 1) {
                auto = this.toggleCopperBtn.selected;
            } else if(type == 2){
                auto = this.toggleGoldBtn.selected;
            }
            DungeonModel.instance.reqInspire(type, true,auto,SceneModel.instance.currentScene)

        }

        protected inspireUpdate(): void {
            let auto: AutoInspire = DungeonModel.instance.getAutoInspire(this.sceneEx)
            this.toggleGoldBtn.selected = auto[AutoInspireFields.gold] == 1
            this.toggleCopperBtn.selected = auto[AutoInspireFields.copper] == 1

            let inspires: Array<Inspire> = DungeonModel.instance.inspires;
            if (!inspires) return;
            let per: number = 0;
            for (let i: int = 0, len: int = inspires.length; i < len; i++) {
                per += inspires[i][InspireFields.per];
            }
            this.curInspireTxt.text = `当前鼓舞：攻击+${(per * 100).toFixed(0)}%`;
        }
    }
}