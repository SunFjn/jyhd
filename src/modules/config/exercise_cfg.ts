namespace modules.config {
    import Dictionary = Laya.Dictionary;
    import lilian_task = Configuration.lilian_task;
    import lilian_day = Configuration.lilian_day;
    import lilian_rise = Configuration.lilian_rise;
    import lilian_taskFields = Configuration.lilian_taskFields;
    import lilian_dayFields = Configuration.lilian_dayFields;
    import lilian_riseFields = Configuration.lilian_riseFields;

    export class ExerciseCfg {

        private static _instance: ExerciseCfg;
        public static get instance(): ExerciseCfg {
            return this._instance = this._instance || new ExerciseCfg();
        }

        private _dic1: Dictionary;
        private _dic2: Dictionary;
        private _keysArr2: number[];
        private _dic3: Dictionary;
        private _tabArr: Array<Table<lilian_day>>;
        private _maxJie: number;
        private _maxLLDayCfg: lilian_day;

        constructor() {
            this.init();
        }

        private init(): void {

            this._dic1 = new Dictionary();  //任务
            this._dic2 = new Dictionary();  //每日历练
            this._keysArr2 = [];
            this._dic3 = new Dictionary();  //总历练
            this._tabArr = new Array<Table<lilian_day>>(); //觉醒和档次配置
            this._maxJie = 0;

            let _arr1: Array<lilian_task> = GlobalData.getConfig("lilian_task");
            let _arr2: Array<lilian_day> = GlobalData.getConfig("lilian_day");
            let _arr3: Array<lilian_rise> = GlobalData.getConfig("lilian_rise");

            for (let i: int = 0, len: int = _arr2.length; i < len; i++) {
                this._tabArr[_arr2[i][lilian_dayFields.eraLevel]] = {};
            }

            for (let i: int = 0, len: int = _arr1.length; i < len; i++) {
                this._dic1.set(_arr1[i][lilian_taskFields.id], _arr1[i])
            }

            for (let i: int = 0, len: int = _arr2.length; i < len; i++) {
                this._dic2.set(_arr2[i][lilian_dayFields.id], _arr2[i]);
                this._keysArr2.push(_arr2[i][lilian_dayFields.id]);
                this._tabArr[_arr2[i][lilian_dayFields.eraLevel]][_arr2[i][lilian_dayFields.grade]] = _arr2[i];
                this._maxLLDayCfg = _arr2[i];
            }

            for (let i: int = 0, len: int = _arr3.length; i < len; i++) {
                this._dic3.set(_arr3[i][lilian_riseFields.riseLevel], _arr3[i]);
                this._maxJie = _arr3[i][lilian_riseFields.riseLevel];
            }
        }

        //根据id取任务配置
        public getTaskCfgById(id: int): lilian_task {
            return this._dic1.get(id);
        }

        //根据id取每日历练
        /*public getLLDayCfgById(id:int):lilian_day{
            return this._dic2.get(id);
        }*/

        //根据觉醒等级和档次取每日历练
        public getLLDayCfgByEraLevAndLev(eraLev: int, grade: int): lilian_day {
            return this._tabArr[eraLev][grade];
        }
        //根据觉醒等级取每日历练
        public getLLDayCfgByLevel(eraLev: int): Table<lilian_day> {
            return this._tabArr[eraLev];
        }

        //根据觉醒等级取最大档次
        public getLLDayCfgByEraLev(eraLev: int): lilian_day {

            for (let i: int = 0, len: int = this._keysArr2.length; i < len; i++) {
                if (this._dic2.get(this._keysArr2[i])[lilian_dayFields.eraLevel] > eraLev)
                    return this._dic2.get(this._keysArr2[i - 1]);
            }
        }

        public getMaxLLDayCfg(): lilian_day {
            return this._maxLLDayCfg;
        }

        //根据等级取总历练配置
        public getZLLCfgByLev(lev: int): lilian_rise {
            return this._dic3.get(lev);
        }

        //历练最大阶数
        public get maxLLJie(): number {
            return this._maxJie;
        }

        //根据当前等级取下一等级配置
        public getNextCfgByCurrLev(lev: int): lilian_rise {
            for (let i: int = 0, len: int = this._dic3.keys.length; i < len; i++) {
                if (this._dic3.get(this._dic3.keys[i])[lilian_riseFields.riseLevel] == lev)
                    return this._dic3.get(this._dic3.keys[i + 1]);
            }
        }

        public getBeforeCfgByCurrLev(lev: int): lilian_rise {
            for (let i: int = 0, len: int = this._dic3.keys.length; i < len; i++) {
                if (this._dic3.get(this._dic3.keys[i])[lilian_riseFields.riseLevel] == lev)
                    return this._dic3.get(this._dic3.keys[i - 1]);
            }
        }

        //根据阶数取重数
        public getChongByJie(jie: int): number {
            let _count: int = 0;
            for (let i: int = 0, len: int = this._dic3.keys.length; i < len; i++) {
                if (Math.floor((this._dic3.get(this._dic3.keys[i])[lilian_riseFields.riseLevel]) / 100) == jie)
                    _count++;
            }
            return _count;
        }
    }
}