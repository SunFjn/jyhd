///<reference path="../config/action_open_cfg.ts"/>


/** 功能开启*/


namespace modules.funcOpen {
    import GetActionOpenReply = Protocols.GetActionOpenReply;
    import UpdateActionOpen = Protocols.UpdateActionOpen;
    import ActionOpen = Protocols.ActionOpen;
    import GetActionOpenReplyFields = Protocols.GetActionOpenReplyFields;
    import ActionOpenFields = Protocols.ActionOpenFields;
    import UpdateActionOpenFields = Protocols.UpdateActionOpenFields;
    import action_open = Configuration.action_open;
    import ActionOpenCfg = modules.config.ActionOpenCfg;
    import action_openFields = Configuration.action_openFields;

    export class FuncOpenModel {
        private static _instance: FuncOpenModel;
        public static get instance(): FuncOpenModel {
            return this._instance = this._instance || new FuncOpenModel();
        }

        private _table: Table<ActionOpen>;

        constructor() {
            this._table = {};
        }

        /** 获取功能开启返回*/
        public getActionOpenReply(tuple: GetActionOpenReply): void {
            let arr: Array<ActionOpen> = tuple[GetActionOpenReplyFields.actions];
            let ids: Array<number> = [];
            // console.log("功能开启返回", tuple)
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let func: ActionOpen = arr[i];
                this._table[func[ActionOpenFields.id]] = func;
                ids.push(func[ActionOpenFields.id]);
            }
            this.specialOpera(ids);
            GlobalData.dispatcher.event(CommonEventType.FUNC_OPEN_UPDATE, [ids]);
            GlobalData.dispatcher.event(CommonEventType.FUNC_OPEN_ASSIGN_REPLY);

        }

        /** 更新功能开启*/
        public updateActionOpen(tuple: UpdateActionOpen): void {
            let arr: Array<ActionOpen> = tuple[UpdateActionOpenFields.actions];
            let ids: Array<number> = [];
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let func: ActionOpen = arr[i];
                let id: number = func[ActionOpenFields.id];
                this._table[id] = func;
                ids.push(id);
            }
            this.specialOpera(ids);
            GlobalData.dispatcher.event(CommonEventType.FUNC_OPEN_UPDATE, [ids]);
            GlobalData.dispatcher.event(CommonEventType.ACTION_PREVIEW_FUNC_OPEN_UPDATE, [ids]);
        }

        /** 根据功能ID获取功能是否开启*/
        public getFuncStateById(id: int): int {
            if (!this._table) return -1;
            if (!this._table[id]) return -1;

            return this._table[id][ActionOpenFields.state];
        }

        // 设置功能开启
        public setActionOpen(id: ActionOpenId, state: ActionOpenState): void {
            if (!this._table) this._table = {};
            let bolll = false;
            if (this._table[id]) {
                if (this._table[id][ActionOpenFields.state] == state) {
                    bolll = true;
                }
            }

            this._table[id] = [id, state, 0, 0];
            if (!bolll) {
                GlobalData.dispatcher.event(CommonEventType.FUNC_OPEN_UPDATE, [[id]]);
            }

        }
        public LogTab() {
            // console.log("LogTab", this._table)
        }

        // 根据功能ID获取功能是否需要显示
        public getFuncNeedShow(id: int): boolean {
            if (Main.instance.isWXiOSPay) {
                // wxios需要隐藏
                if(Main.instance.isWXiOSPayFunId.indexOf(id)>=0){
                    return false;
                }
            }
            let state: number = this.getFuncStateById(id);
            return state === -1 || state === ActionOpenState.show || state === ActionOpenState.open;
        }

        // 根据功能ID获取功能是否开启
        public getFuncIsOpen(id: int): boolean {
            if (Main.instance.isWXiOSPay) {
                // wxios需要隐藏
                if(Main.instance.isWXiOSPayFunId.indexOf(id)>=0){
                    return false;
                }
            }
            let state: number = this.getFuncStateById(id);
            return state === -1 || state === ActionOpenState.open;
        }

        // 根据功能ID获取功能未开启时的提示
        public getFuncOpenTipById(id: int): string {
            let str: string = "";
            let info: ActionOpen = this._table[id];
            let first: number = info[ActionOpenFields.first];
            let second: number = info[ActionOpenFields.second];
            if (first >= 0 && second >= 0) {
                let cfg: action_open = ActionOpenCfg.instance.getCfgById(id);
                if (cfg) {
                    str = cfg[action_openFields.tips][first][second];
                }
            }
            return str;
        }

        public specialOpera(ids: number[]): void {
            for (let id of ids) {
                if (id == ActionOpenId.faction || id == ActionOpenId.factionJoin
                    || id == ActionOpenId.factionMember || id == ActionOpenId.welfare
                    || id == ActionOpenId.skill) {
                    faction.FactionCtrl.instance.getFactionInfo();
                }
                this.doOperae(id);
            }
        }

        // 执行操作
        private doOperae(id: number) {
            //派对狂欢
            if (id == ActionOpenId.MissionPartyEnter) {
                // let data: ActionOpen = this._table[id];
                // console.log(data);
                // let curIndex: number = data[ActionOpenFields.state];
                // 根据服务器传过来的编号指定皮肤功能待实现
                modules.mission_party.MissionPartyModel.instance.setCurrentMissionLabel();
                GlobalData.dispatcher.event(CommonEventType.KUANGHAI2_LC_ACTION_OPEN_UPDATE);
            }
            //累充（周期活动）
            if (id == ActionOpenId.cumulatePay3) {
                // let data: ActionOpen = this._table[id];
                // console.log(data);
                // let curIndex: number = data[ActionOpenFields.state];
                // 根据服务器传过来的编号指定皮肤功能待实现
                modules.cumulate3_pay.CumulatePay3Model.instance.setCurrentActivityData();
                GlobalData.dispatcher.event(CommonEventType.KUANGHAI2_PD_ACTION_OPEN_UPDATE);
            }
        }
    }
}
