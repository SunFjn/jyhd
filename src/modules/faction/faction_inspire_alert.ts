/////<reference path="../$.ts"/>
/** 仙盟鼓舞 */
namespace modules.faction {
    import InspireAlert = modules.dungeon.InspireAlert;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import PlayerModel = modules.player.PlayerModel;
    import CommonUtil = modules.common.CommonUtil;
    import GetFactionCopyDataReply = Protocols.GetFactionCopyDataReply;
    import GetFactionCopyDataReplyFields = Protocols.GetFactionCopyDataReplyFields;
    import LayaEvent = modules.common.LayaEvent;

    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import AutoInspire = Protocols.AutoInspire;
    import AutoInspireFields = Protocols.AutoInspireFields;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;

    export class FactionInspireAlert extends InspireAlert {

        private _coinParams: number[];
        private _ingotParams: number[];

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._coinParams = BlendCfg.instance.getCfgById(36026)[blendFields.intParam];
            this._ingotParams = BlendCfg.instance.getCfgById(36027)[blendFields.intParam];

            this.coinTxt.text = `${this._coinParams[0]}/次`;
            this.ingotTxt.text = `${this._ingotParams[0]}/次`;

            let max: number = this._coinParams[2];
            max += this._ingotParams[2];//
            let value: number = Math.floor(this._coinParams[1] * 100);
            this.decTxt.text = `每次鼓舞增加角色${value}%攻击 (上限${value * max}%)`;
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_COPY_DATA, this, this.inspireUpdate);
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


        protected inspireHandler(type: number): void {
            // if (this._btnGroup.selectedIndex === 0) {
            //     if (PlayerModel.instance.copper < this._coinParams[0]) {
            //         CommonUtil.noticeError(12106);
            //         return;
            //     }
            // } else if (this._btnGroup.selectedIndex === 1) {
            //     if (PlayerModel.instance.ingot < this._ingotParams[0]) {
            //         CommonUtil.noticeError(12107);
            //         return;
            //     }
            // } else return;
            // FactionCtrl.instance.factionReqInspire([this._btnGroup.selectedIndex]);
            let auto = false;
            if (type == 1) {
                auto = this.toggleCopperBtn.selected;
            } else if(type == 2){
                auto = this.toggleGoldBtn.selected;
            }
          
            DungeonModel.instance.reqInspire(type, true, auto,SceneModel.instance.currentScene);
        }

        protected inspireUpdate(): void {
            let auto: AutoInspire = DungeonModel.instance.getAutoInspire(this.sceneEx)
            this.toggleGoldBtn.selected = auto[AutoInspireFields.gold] == 1
            this.toggleCopperBtn.selected = auto[AutoInspireFields.copper] == 1

            let data: GetFactionCopyDataReply = FactionModel.instance.copyData;
            if (!data) return;
            let value: number = 0;
            let coinCount: number = data[GetFactionCopyDataReplyFields.coinInspireCount];
            let goldCount: number = data[GetFactionCopyDataReplyFields.goldInspireCount];

            if (coinCount) { //金币有鼓舞次数
                value += this._coinParams[1] * 100 * coinCount;
            }
            if (goldCount) {
                value += this._ingotParams[1] * 100 * goldCount;
            }
            this.curInspireTxt.text = `当前鼓舞：攻击+${value}%`;
        }
    }
}
