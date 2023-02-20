namespace modules.config {
    import first_pay = Configuration.first_pay;
    import first_payFields = Configuration.first_payFields;

    export class FirstPayCfg {
        private static _instance: FirstPayCfg;
        public static get instance(): FirstPayCfg {
            return this._instance = this._instance || new FirstPayCfg();
        }

        // 根据档位(充值金額)和天数存取的数据
        private _newTab: Table<any>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._newTab = {};
            let arr: Array<first_pay> = GlobalData.getConfig("first_pay");

            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let shift = arr[i][first_payFields.money];
                let day = arr[i][first_payFields.day];

                let tempTab = this._newTab[shift];
                if (!tempTab) this._newTab[shift] = {};
                this._newTab[shift][day.toString()] = arr[i];
            }
        }

        // 根据档位和天数获取奖励列表
        public getCfgByShiftAndDay(shift: number, day: number): first_pay {
            let shiftTab = this._newTab[shift];
            if (!shiftTab) return null;
            let dayTab = shiftTab[day];
            return dayTab;
        }
        // 获取初始展示的数据
        public getCfgDefaultData(): first_pay {
            return this.getCfgByShiftAndDay(10, 1);
        }
        //获取所有的数据
        public getNewTab(){
            return this._newTab;
        }

    }
}