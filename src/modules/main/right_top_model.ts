
namespace modules.main {
    import blendFields = Configuration.blendFields;
    export class RightTopModel {
        private static _instance: RightTopModel;
        public static get instance(): RightTopModel {
            return this._instance = this._instance || new RightTopModel();
        }

        // 开服冲榜 每天对应的最大战力
        private _kaiFuRankList: Array<number>;
        private _feiShengRankList: Array<number>;

        private _kaiFuTimeList: Array<number>;
        private _kaiFuTimeList1: Array<number>;

        private _feiShengTimeList: Array<number>;
        private _feiShengTimeList1: Array<number>;

        public _lastTime: number;//上次弹的时间戳
        public _isshibai: boolean;//是否失败退出副本
        public _isshouci: boolean;//是否首次满足条件
        public _isshouciLv: boolean;//是否首次满足等级条件

        public _lastTime1: number;//上次弹的时间戳
        public _isshibai1: boolean;//是否失败退出副本
        public _isshouci1: boolean;//是否首次满足条件
        public _isshouciLv1: boolean;//是否首次满足等级条件

        public _isCloseShouDong: boolean;//是否手动关闭了
        public _isCloseShouDongTTime: number;//是否手动关闭 多久恢复
        constructor() {

            this._isCloseShouDong = false;
            this._isCloseShouDongTTime = 5 * utils.Unit.minute;
            this._lastTime = GlobalData.serverTime;
            this._isshouci = false;
            this._isshouciLv = false;

            this._lastTime1 = GlobalData.serverTime;
            this._isshouci1 = false;
            this._isshouciLv1 = false;

            this._kaiFuRankList = new Array<number>();
            this._feiShengRankList = new Array<number>();
            this._kaiFuTimeList = new Array<number>();
            this._kaiFuTimeList1 = new Array<number>();
            this._feiShengTimeList = new Array<number>();
            this._feiShengTimeList1 = new Array<number>();
            let jiangLi = modules.config.BlendCfg.instance.getCfgById(56001)[blendFields.intParam];
            for (let index = 0; index < jiangLi.length; index += 2) {
                let element = jiangLi[index];
                let element1 = jiangLi[index + 1];
                if (element && element1) {
                    this._kaiFuRankList[element] = element1;
                }

            }
            jiangLi = modules.config.BlendCfg.instance.getCfgById(56002)[blendFields.intParam];
            for (let index = 0; index < jiangLi.length; index += 2) {
                let element = jiangLi[index];
                let element1 = jiangLi[index + 1];
                if (element && element1) {
                    this._feiShengRankList[element] = element1;
                }
            }
            this._kaiFuTimeList = modules.config.BlendCfg.instance.getCfgById(56003)[blendFields.intParam];

            this._feiShengTimeList = modules.config.BlendCfg.instance.getCfgById(56004)[blendFields.intParam];

            this._kaiFuTimeList1 = modules.config.BlendCfg.instance.getCfgById(56005)[blendFields.intParam];

            this._feiShengTimeList1 = modules.config.BlendCfg.instance.getCfgById(56006)[blendFields.intParam];
        }
        /**
         * typeNum 0开服冲榜  1 封神榜  
         */
        public getZhanLiByType(typeNum: number, type: number): number {
            let zhanLiNum = 0;
            if (typeNum == 0) {
                zhanLiNum = this._kaiFuRankList[type];
                zhanLiNum = zhanLiNum ? zhanLiNum : 0;
            }
            else if (typeNum == 1) {
                zhanLiNum = this._feiShengRankList[type];
                zhanLiNum = zhanLiNum ? zhanLiNum : 0;
            }
            return zhanLiNum;
        }
        public getTimeList(type: number): Array<number> {
            let zhanLiNum = [3000, 20000, 600000];
            if (type == 0) {
                let state: number = modules.sprint_rank.SprintRankModel.instance.openState;
                let restTm: number = modules.sprint_rank.SprintRankModel.instance.restTm;
                let endFlag: number = modules.soaring_rank.SoaringRankModel.instance.endFlag;/*活动结束标志 0开启中 1结束*/
                if (modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.sprintRank) && state == 1 && restTm != 0 && restTm >= GlobalData.serverTime) {
                    zhanLiNum = this._kaiFuTimeList ? this._kaiFuTimeList : [3000, 20000, 600000];
                }
                else if (modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.soaringRank) && endFlag == 0) {
                    zhanLiNum = this._feiShengTimeList ? this._feiShengTimeList : [1500, 10000, 300000];
                }
            }
            else if (type == 1) {
                let state: number = modules.sprint_rank.SprintRankModel.instance.openState;
                let restTm: number = modules.sprint_rank.SprintRankModel.instance.restTm;
                let endFlag: number = modules.soaring_rank.SoaringRankModel.instance.endFlag;/*活动结束标志 0开启中 1结束*/
                if (modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.sprintRank) && state == 1 && restTm != 0 && restTm >= GlobalData.serverTime) {
                    zhanLiNum = this._kaiFuTimeList1 ? this._kaiFuTimeList1 : [3000, 20000, 600000];
                }
                else if (modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.soaringRank) && endFlag == 0) {
                    zhanLiNum = this._feiShengTimeList1 ? this._feiShengTimeList1 : [1500, 10000, 300000];
                }
            }
            return zhanLiNum;
        }


        public closeTipsShouDongHar() {
            if (!this._isCloseShouDong) {
                this._isCloseShouDong = true;
                Laya.timer.once(this._isCloseShouDongTTime, this, () => {
                    this._isCloseShouDong = false;
                });
            }
        }

        public getState(): boolean {
            let bollll = false;
            let state: number = modules.sprint_rank.SprintRankModel.instance.openState;
            let restTm: number = modules.sprint_rank.SprintRankModel.instance.restTm;
            let endFlag: number = modules.soaring_rank.SoaringRankModel.instance.endFlag;/*活动结束标志 0开启中 1结束*/
            if (modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.sprintRank) && state == 1 && restTm != 0 && restTm >= GlobalData.serverTime) {
                bollll = true;
            }
            else if (modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.soaringRank) && endFlag == 0) {
                bollll = true;
            }
            return bollll;
        }
    }
}