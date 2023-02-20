/** 单项鼓舞弹框(金币和代币券鼓舞只有一个)*/


namespace modules.dungeon {
    import SingleInspireAlertUI = ui.SingleInspireAlertUI;
    import Event = Laya.Event;
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

    export class SingleInspireAlert extends SingleInspireAlertUI {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.inspireBtn, LayaEvent.CLICK, this, this.inspireHandler);
            this.addAutoListener(this.toggleBtn, LayaEvent.CLICK, this, this.setAutoinspire);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_INSPIRE_UPDATE, this, this.inspireUpdate);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.COPY_AUTO_INSPIRE, this, this.inspireUpdate);

        }
        private sceneEx: SceneTypeEx = SceneTypeEx.common;
        public onOpened(): void {
            super.onOpened();
            let mapId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            let cfg = SceneCfg.instance.getCfgById(mapId);
            this.sceneEx = cfg[sceneFields.type]
            this.inspireUpdate();

        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            let type: int = value;       // 1金币2代币券
            this.dataSource = type;
            if (type === 1) {
                this.coinImg.skin = "common/icon_tongyong_1.png";
                this.coinTxt.text = `${BlendCfg.instance.getCfgById(10304)[blendFields.intParam][0]}`;
            } else if (type === 2) {
                this.coinImg.skin = "common/icon_tongyong_2.png";
                this.coinTxt.text = `${BlendCfg.instance.getCfgById(10305)[blendFields.intParam][0]}`;
            }
            let offset: number = (120 - this.coinTxt.textWidth) * 0.5;
            this.coinTxt.x = 280 + offset;
            this.coinImg.x = 236 + offset;
        }

        private inspireHandler(): void {
            DungeonModel.instance.reqInspire(this.dataSource, true, this.toggleBtn.selected);
        }
        private setAutoinspire(): void {
            this.toggleBtn.selected = !this.toggleBtn.selected
            DungeonCtrl.instance.setAutoInspire(this.sceneEx, 2, this.toggleBtn.selected)
        }


        private openRecharge(): void {
            this.close();
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
        }
        private inspireUpdate(): void {
            let auto: AutoInspire = DungeonModel.instance.getAutoInspire(this.sceneEx)
            this.toggleBtn.selected = auto[AutoInspireFields.gold] == 1

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