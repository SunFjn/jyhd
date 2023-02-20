/** 功能开启*/


namespace modules.funcOpen {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetActionOpenReply = Protocols.GetActionOpenReply;
    import UpdateActionOpen = Protocols.UpdateActionOpen;
    import ActionOpen = Protocols.ActionOpen;
    import UpdateActionOpenFields = Protocols.UpdateActionOpenFields;
    import ActionOpenFields = Protocols.ActionOpenFields;
    import GetActionStateReply = Protocols.GetActionStateReply;
    import GetActionStateReplyFields = Protocols.GetActionStateReplyFields;

    export class FuncOpenCtrl extends BaseCtrl {
        private static _instance: FuncOpenCtrl;
        public static get instance(): FuncOpenCtrl {
            return this._instance = this._instance || new FuncOpenCtrl();
        }

        private _funcReqTable: Table<[ActionOpenId, number, any]>;

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetActionOpenReply, this, this.getActionOpenReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateActionOpen, this, this.updateActionOpen);
            Channel.instance.subscribe(SystemClientOpcode.GetActionStateReply, this, this.getActionStateReply);

            this.requsetAllData();
        }
        public requsetAllData(): void {
            this.getActionOpen();
        }

        /** 获取功能开启*/
        public getActionOpen(): void {
            Channel.instance.publish(UserFeatureOpcode.GetActionOpen, null);
        }

        /** 获取功能开启返回*/
        private getActionOpenReply(tuple: GetActionOpenReply): void {
            // console.log(" 获取功能开启返回：", tuple);
            FuncOpenModel.instance.getActionOpenReply(tuple);
            FuncOpenModel.instance.LogTab();
        }

        /** 获取功能状态*/
        public getActionState(...ids: number[]): void {
            Channel.instance.publish(UserFeatureOpcode.GetActionState, [ids]);
        }

        /** 获取功能状态返回*/
        public getActionStateReply(tuple: GetActionStateReply): void {
            let states: Array<ActionOpen> = tuple[GetActionStateReplyFields.actions];
            for (let e of states) {
                let id: number = e[ActionOpenFields.id];
                let state: number = e[ActionOpenFields.state];
                FuncOpenModel.instance.setActionOpen(id, state);
            }
            GlobalData.dispatcher.event(CommonEventType.FUNC_OPEN_ASSIGN_UPDATE);
            FuncOpenModel.instance.LogTab();
        }

        // 更新功能开启
        private updateActionOpen(tuple: UpdateActionOpen): void {
            let funcs: Array<ActionOpen> = tuple[UpdateActionOpenFields.actions];
            for (let i: int = 0, len: int = funcs.length; i < len; i++) {
                let curState: number = funcs[i][ActionOpenFields.state];
                if (!FuncOpenModel.instance.getFuncIsOpen(funcs[i][ActionOpenFields.id]) && curState === ActionOpenState.open) {     // 判断功能是否刚开启，刚开启时发送绑定的请求协议
                    let req: [ActionOpenId, number, any] = this._funcReqTable[funcs[i][ActionOpenFields.id]];
                    if (req) {
                        Channel.instance.publish(req[1], req[2]);
                    }
                }
            }
            FuncOpenModel.instance.updateActionOpen(tuple);
            FuncOpenModel.instance.LogTab();
        }

        // 绑定功能开启对应的功能请求协议
        public registeFuncReq(funcId: ActionOpenId, req: number, param: any = null): void {
            this._funcReqTable = this._funcReqTable || {};
            this._funcReqTable[funcId] = [funcId, req, param];
        }
    }
}
