/////<reference path="../$.ts"/>
/** 仙盟副本右下角面板 */
namespace modules.faction {
    import FactionCopyRBViewUI = ui.FactionCopyRBViewUI;
    import GetFactionCopyDataReply = Protocols.GetFactionCopyDataReply;
    import GetFactionCopyDataReplyFields = Protocols.GetFactionCopyDataReplyFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import AutoInspire = Protocols.AutoInspire;
    import AutoInspireFields = Protocols.AutoInspireFields;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import scene = Configuration.scene;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    export class FactionCopyRBPanel extends FactionCopyRBViewUI {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.right = 0;
            this.bottom = 540;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_COPY_DATA, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_INFO, this, this.updateManCount);
            this.addAutoListener(this.luxianBtn, common.LayaEvent.CLICK, this, this.luxianBtnHandler);
            this.addAutoListener(this.allComeOnBtn, common.LayaEvent.CLICK, this, this.allComeOnBtnHandler);
            this.addAutoListener(this.comeOnBtn, common.LayaEvent.CLICK, this, this.comeOnBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
            this.updateManCount();
            let mapId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            let cfg = SceneCfg.instance.getCfgById(mapId);
            let auto: AutoInspire = DungeonModel.instance.getAutoInspire(cfg[sceneFields.type])
            if (auto[AutoInspireFields.copper] == 1) DungeonModel.instance.reqInspire(InspireType.copper, false, true, SceneTypeEx.faction);
            if (auto[AutoInspireFields.gold] == 1) DungeonModel.instance.reqInspire(InspireType.gold, false, true, SceneTypeEx.faction);
        }


        private updateManCount(): void {
            let needNum: number = BlendCfg.instance.getCfgById(36025)[blendFields.intParam][0];
            //判断buff
            if (FactionModel.instance.copyManCount >= needNum) {
                let value: number = BlendCfg.instance.getCfgById(36024)[blendFields.intParam][0] * 100;
                this.luxianTxt.text = `攻击+${value}%`;
                this.luxianTxt.color = `#168a17`;
            } else { //没有激活buff
                this.luxianTxt.text = `未激活`;
                this.luxianTxt.color = `#ff3e3e`;
            }
        }

        private updateView(): void {
            let data: GetFactionCopyDataReply = FactionModel.instance.copyData;
            if (!data) return;

            //全员鼓舞状态
            if (data[GetFactionCopyDataReplyFields.inspireBuffTime] <= GlobalData.serverTime) {
                this.allComeOnTxt.text = `攻击+0%`;
            } else {  //未鼓舞
                let params: number[] = BlendCfg.instance.getCfgById(36028)[blendFields.intParam];
                let value: number = params[1] * 100;
                this.allComeOnTxt.text = `攻击+${value}%`;
            }

            //个人鼓舞状态
            let value: number = 0;
            let coinCount: number = data[GetFactionCopyDataReplyFields.coinInspireCount];
            let goldCount: number = data[GetFactionCopyDataReplyFields.goldInspireCount];

            if (coinCount) { //金币有鼓舞次数
                let params: number[] = BlendCfg.instance.getCfgById(36026)[blendFields.intParam];
                value += params[1] * 100 * coinCount;
            }
            if (goldCount) {
                let params: number[] = BlendCfg.instance.getCfgById(36027)[blendFields.intParam];
                value += params[1] * 100 * goldCount;
            }
            this.comeOnTxt.text = `攻击+${value}%`;
        }

        private luxianBtnHandler(): void {
            let needNum: number = BlendCfg.instance.getCfgById(36025)[blendFields.intParam][0];
            let value: number = BlendCfg.instance.getCfgById(36024)[blendFields.intParam][0] * 100;
            let str: string = `正在进攻人数<span style='color:#168a17'>≥${needNum}</span>时,激活戮仙状态,<span style = 'color:#168a17'>全员攻击增加${value}%</span>!`;
            let tipStr: string;
            let tipColor: string;
            if (FactionModel.instance.copyManCount >= needNum) {
                tipStr = `当前已激活`;
                tipColor = `#168a17`;
            } else { //没有激活buff
                tipStr = `当前未激活`;
                tipColor = `#ff3e3e`;
            }
            CommonUtil.alert(`戮仙状态`, str, null, null, true, [tipStr, tipColor]);
        }

        //全员鼓舞
        private allComeOnBtnHandler(): void {
            let data: GetFactionCopyDataReply = FactionModel.instance.copyData;
            if (!data) return;

            let params: number[] = BlendCfg.instance.getCfgById(36028)[blendFields.intParam];
            let needItemCount: number = params[0];
            let value: number = params[1] * 100;
            let time: number = params[2];
            let content: string = `全员鼓舞需要消耗<img src="assets/icon/item/1_s.png" width="40" height="40"/><span style='color:#168a17'>${needItemCount}</span><br/>”<span style='color:#168a17'>全员攻击增加${value}%</span><br/>”<span style='color:#168a17'>鼓舞持续${CommonUtil.getTimeTypeAndTime(time)}</span>!`;
            if (data[GetFactionCopyDataReplyFields.inspireBuffTime] <= GlobalData.serverTime) {
                let handler: Handler;
                let myPropCount: number = common.CommonUtil.getPropCountById(MoneyItemId.glod);
                if (myPropCount >= needItemCount) {
                    handler = Handler.create(FactionCtrl.instance, FactionCtrl.instance.factionAllInspire);
                } else {
                    handler = Handler.create(this, () => {
                        CommonUtil.goldNotEnoughAlert();
                    });
                }
                CommonUtil.alert(`鼓舞`, content, [handler]);
            } else {  //鼓舞中
                let tipInfo: [string, string] = [`全员鼓舞生效中,无需重复`, `#ff3e3e`];
                CommonUtil.alert(`鼓舞`, content, null, null, true, tipInfo);
            }
        }

        //鼓舞
        private comeOnBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.FACTION_INSPIRE_ALERT);
        }
    }
}