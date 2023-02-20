/** 九天之巅副本中击杀信息面板*/


namespace modules.nine {
    import NineDefeatViewUI = ui.NineDefeatViewUI;
    import BroadcastDead = Protocols.BroadcastDead;
    import BroadcastDeadFields = Protocols.BroadcastDeadFields;
    import SceneModel = modules.scene.SceneModel;
    import ItemShow = Protocols.ItemShow;
    import MonsterShow = Protocols.MonsterShow;
    import NpcShow = Protocols.NpcShow;
    import HumanShow = Protocols.HumanShow;
    import HumanShowFields = Protocols.HumanShowFields;
    import ActorShowFields = Protocols.ActorShowFields;
    import MonsterShowFields = Protocols.MonsterShowFields;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import MonsterResFields = Configuration.MonsterResFields;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;

    export class NineDefeatPanel extends NineDefeatViewUI {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.closeByOthers = false;
            this.centerX = 0;
            this.top = 200;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.NINE_DEFEAT_UPDATE, this, this.updateDefeat);
        }

        private updateDefeat(): void {
            Laya.timer.once(3000, this, this.close);
            let info: BroadcastDead = NineModel.instance.defeatInfo;
            let killerId: number = info[BroadcastDeadFields.killerId];
            let deadId: number = info[BroadcastDeadFields.objId];
            this.myHeadImg.skin = this.getSkin(SceneModel.instance.getRoleByObjId(killerId));
            this.otherHeadImg.skin = this.getSkin(SceneModel.instance.getRoleByObjId(deadId));
            let t: [SearchType, ItemShow | MonsterShow | HumanShow | NpcShow] = SceneModel.instance.getRoleByObjId(deadId);
            if (!t) {
                // console.log("不在同屏中的玩家或怪物................." + info);
                return;
            }
            if (t[0] === SearchType.actor) {
                this.otherHeadBg.visible = true;
                this.monsterHeadBg.visible = false;
            } else if (t[0] === SearchType.monster) {
                this.otherHeadBg.visible = false;
                this.monsterHeadBg.visible = true;
            }
        }

        private getSkin(value: [SearchType, ItemShow | MonsterShow | HumanShow | NpcShow]): string {
            if (!value) return "";
            let str: string = "";
            if (value[0] === SearchType.actor) {
                let occ: number = (<HumanShow>value[1])[HumanShowFields.actorShow][ActorShowFields.occ];
                str = `assets/icon/head/${occ}.png`;
            } else if (value[0] === SearchType.monster) {
                let occ: number = value[1][MonsterShowFields.occ];
                let cfg: MonsterRes = MonsterResCfg.instance.getCfgById(occ);
                if (cfg[MonsterResFields.icon])
                    str = `assets/icon/monster/${cfg[MonsterResFields.icon]}.png`;
                else {
                    let tCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(cfg[MonsterResFields.res]);
                    str = `assets/icon/item/${tCfg[ExteriorSKFields.icon]}.png`;
                }
            }
            return str;
        }

        protected onOpened(): void {
            super.onOpened();
            this.updateDefeat();
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.close);
        }
    }
}