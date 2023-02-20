namespace modules.fight_talisman {
    import UpdateTalismanState = Protocols.UpdateTalismanState;
    import UpdateTalismanStateFields = Protocols.UpdateTalismanStateFields;
    import GetTalismanInfoReply = Protocols.GetTalismanInfoReply;
    import GetTalismanInfoReplyFields = Protocols.GetTalismanInfoReplyFields;
    import ActiveTalismanReply = Protocols.ActiveTalismanReply;
    import ActiveTalismanReplyFields = Protocols.ActiveTalismanReplyFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    export class FightTalismanModel {
        constructor() { }

        private static _instance: FightTalismanModel;
        public static get instance(): FightTalismanModel {
            return this._instance = this._instance || new FightTalismanModel();
        }

        private _state: boolean;     //护符激活状态,只要有未购买的都会返回false
        private _allState: Array<boolean>;      //总购买状态组

        public get state(): boolean {
            return this._state;
        }

        public get allState(): Array<boolean> {
            return this._allState;
        }

        private _actived: number;        //未激活将返回-1
        public get actived(): number {
            this._actived = this.replyValue[GetTalismanInfoReplyFields.activated_era][this.selected];
            return this._actived;
        }

        private _canActived: number;
        public get canActived(): number {
            this._canActived = this.replyValue[GetTalismanInfoReplyFields.unactive_era][this.selected];
            return this._canActived;
        }

        // 所有的激活状态
        private _allActived: Array<number>;
        public get allActived() {
            this._allActived = this.replyValue[GetTalismanInfoReplyFields.activated_era];
            return this._allActived;
        }

        // 设置当前选中项
        private _seleted: number = 0;
        public get selected() {
            return this._seleted;
        }
        public set selected(value: number) {
            this._seleted = value;
        }

        //护符状态更新
        public updateTalismanState(state: Array<boolean>): void {
            if (!state) return;
            this._allState = state;
            this._state = true;
            state.forEach((ele) => {
                if (ele == false) {
                    this._state = false;
                }
            })
            //红点
            this.checkRP();

            GlobalData.dispatcher.event(CommonEventType.FIGHT_TALISMAN_UPDATE);
            // console.log("护符状态更新: ",this._state);
        }

        private replyValue: GetTalismanInfoReply;
        //护符信息返回
        public getTalismanInfoReply(value: GetTalismanInfoReply): void {
            this.replyValue = value;
            // this._canActived = value[GetTalismanInfoReplyFields.unactive_era][this.selected];
            //红点
            this.checkRP();

            GlobalData.dispatcher.event(CommonEventType.FIGHT_TALISMAN_UPDATE);
            //调试输出
            // console.log("已激活的护符: ",this._actived);
            // console.log("未激活的护符: ",this._canActived);
        }

        // 当前弹窗的勋章类型
        public currMedalType() {
            let openType = this.allState;
            let medalNum: number = 4;// 初始为全开状态
            // console.log("ARRAYBOOLEAN", this.replyValue);

            // 根据开启项得到当前的购买情况
            if (openType[0] == false) {
                medalNum = 1;
            } else if (openType[1] == false) {
                medalNum = 2;
            } else if (openType[2] == false) {
                medalNum = 3;
            } else {
                medalNum = 4;
            }
            return medalNum;
        }

        private checkRP() {
            if (!this.replyValue) return;
            let act = this.replyValue[GetTalismanInfoReplyFields.activated_era];
            let canAct = this.replyValue[GetTalismanInfoReplyFields.unactive_era];
            let temp: boolean = false;
            let tempBuy: boolean = false;

            for (let i = 0; i < 4; i++) {
                if (act[i] != -1 && act[i] < canAct[i]) {
                    this.rpMedalsState(i, true)
                    temp = true;
                } else {
                    this.rpMedalsState(i, false)
                }

                if (this.allState[i] == true && act[i] == -1) {
                    this.rpMedalsState(i, true)
                    temp = true;
                    tempBuy = true;
                }
            }

            RedPointCtrl.instance.setRPProperty("fightTalismanBuyRP", tempBuy);
            RedPointCtrl.instance.setRPProperty("fightTalismanRP", temp);
        }

        private rpMedalsState(i: number, showState: boolean) {
            switch (i) {
                case 0:
                    RedPointCtrl.instance.setRPProperty("fightTalismanYeShouRP", showState);
                    break;
                case 1:
                    RedPointCtrl.instance.setRPProperty("fightTalismanZhuFuRP", showState);
                    break;
                case 2:
                    RedPointCtrl.instance.setRPProperty("fightTalismanJueXingRP", showState);
                    break;
                case 3:
                    RedPointCtrl.instance.setRPProperty("fightTalismanTuTengRP", showState);
                    break;
                default:
                    break;
            }
        }
    }
}