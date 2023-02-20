///<reference path="../config/faction_cfg.ts"/>
/** 加入仙盟item */
namespace modules.faction {
    import CommonEventType = modules.common.CommonEventType;
    import CommonUtil = modules.common.CommonUtil;
    import GlobalData = modules.common.GlobalData;
    import BlendCfg = modules.config.BlendCfg;
    import FactionCfg = modules.config.FactionCfg;
    import FactionJoinItemUI = ui.FactionJoinItemUI;
    import FactionInfo = Protocols.FactionInfo;
    import FactionInfoFields = Protocols.FactionInfoFields;
    import joinState = faction.joinState;
    import blendFields = Configuration.blendFields;

    export class FactionJoinItem extends FactionJoinItemUI {

        private _state: joinState;
        private _uUid: Uuid;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_REQUEST_LIST_UPDATE, this, this.updateState);
        }

        public setData(value: FactionInfo): void {
            let info: FactionInfo = value;
            let lv: number = info[FactionInfoFields.level];
            this.lvTxt.text = `Lv.${lv}`;
            this.nameTxt.text = `${info[FactionInfoFields.name]}`;
            this.bossTxt.text = `会长:${info[FactionInfoFields.leaderName]}`;
            let maxNum: number = FactionCfg.instance.getCfgByLv(lv)[Configuration.factionFields.memerLimit];
            this.numTxt.text = `人数:${info[FactionInfoFields.memberNum]}/${maxNum}`;
            this.limitTxt.text = `战力限制:${CommonUtil.bigNumToString(info[FactionInfoFields.fight])}`;
            let title: string = info[FactionInfoFields.title];
            if (title == ``) {
                title = BlendCfg.instance.getCfgById(36038)[blendFields.stringParam][0];
            }
            // this.taglineTxt.text = title;
            let iconIndex: number = info[FactionInfoFields.flagIndex];
            let iconName: string = BlendCfg.instance.getCfgById(36004)[Configuration.blendFields.stringParam][iconIndex];
            this.iconImg.skin = `faction/${iconName}.png`;

            this._uUid = info[FactionInfoFields.uuid];
            // let state: joinState = FactionModel.instance.getRequestJoinState(this._uUid);
            // this.btn.visible = this.limitTxt.visible = true;
            // this.state = state;
            this.updateState();
        }

        private updateState(): void {
            let result: boolean = FactionModel.instance.getStateByUuid(this._uUid);
            let state: joinState;
            if (!result) {          // 不在申请列表时判断是不是战力不够
                if(FactionModel.instance.getRequestJoinState(this._uUid) === faction.joinState.noFight){
                    state = faction.joinState.noFight;
                }else {
                    state = joinState.canRequest;
                }
            } else {
                state = joinState.requesting;
            }
            this.state = state;
        }

        private set state(state: joinState) {
            this._state = state;
            if (state == joinState.canRequest) {
                this.limitTxt.visible = false;
                // this.btn.skin = `common/btn_tonyong_35.png`;
                // this.btn.labelColors = `#9d5119`;
                this.btn.label = `申请`;
                this.btn.visible = true;
            } else if (state == joinState.requesting) {
                this.limitTxt.visible = false;
                // this.btn.skin = `common/btn_tonyong_36.png`;
                // this.btn.labelColors = `#465460`;
                this.btn.label = `取消`;
                this.btn.visible = true;
            } else {
                this.btn.visible = false;
                this.limitTxt.visible = true;
            }
        }

        private btnHandler(): void {
            FactionCtrl.instance.joinFaction([this._uUid, this._state == joinState.canRequest ? 0 : 1]);
        }
    }
}