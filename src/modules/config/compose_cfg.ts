namespace modules.config {
    import Dictionary = laya.utils.Dictionary;
    import item_composeFields = Configuration.item_composeFields;
    import item_compose = Configuration.item_compose;
    import idNameFields = Configuration.idNameFields;
    import item_resolve = Configuration.item_resolve;
    import item_resolveFields = Configuration.item_resolveFields;
    import gemRefine = Configuration.gemRefine;
    import gemRefineFields = Configuration.gemRefineFields;
    export class ComposeCfg {
        private static _instance: ComposeCfg;
        public static get instance(): ComposeCfg {
            return this._instance = this._instance || new ComposeCfg();
        }

        private _resolveCfgs: Array<any>;
        private _composeCfgs: Array<Array<item_compose>>;
        private _tsClassComposeCfgs: Table<Table<Array<item_compose>>>;
        private _tsClassResolveCfgs: Table<Table<Array<item_resolve>>>;

        private _allClassComposeCfgs: Table<Table<Array<item_compose>>>;
        private _allClassResolveCfgs: Table<Table<Array<item_resolve>>>;

        private _idDic: Dictionary;
        private _deIdDic: Dictionary;
        private _gemIdDic: Dictionary;

        private _tab: Table<item_compose>;
        private _tabFake: Table<item_compose>;

        constructor() {
            this.init();
        }

        private init() {
            this._resolveCfgs = new Array<any>();
            this._idDic = new Dictionary();
            this._deIdDic = new Dictionary();
            this._gemIdDic = new Dictionary();
            this._tsClassComposeCfgs = {};
            this._allClassComposeCfgs = {};
            this._tsClassResolveCfgs = {};
            this._allClassResolveCfgs = {};
            this._composeCfgs = [];
            this._tab = {};
            this._tabFake = {};

            let cfgs: Array<item_compose> = GlobalData.getConfig("item_compose");

            for (let i: number = 0, len = cfgs.length; i < len; i++) {
                let cfg = cfgs[i];
                let tId = cfg[item_composeFields.sClass][idNameFields.id];
                let sId = cfg[item_composeFields.name][idNameFields.id];
                if (!this._tsClassComposeCfgs[tId]) {
                    this._tsClassComposeCfgs[tId] = {};
                    this._composeCfgs[tId] = [];
                }
                if (!this._allClassComposeCfgs[tId]) {
                    this._allClassComposeCfgs[tId] = {};
                }
                if (!this._allClassComposeCfgs[tId][sId]) {
                    this._allClassComposeCfgs[tId][sId] = [];
                }
                if (!this._tsClassComposeCfgs[tId][sId]) {
                    this._tsClassComposeCfgs[tId][sId] = [];
                }
                this._tsClassComposeCfgs[tId][sId].push(cfg);
                this._allClassComposeCfgs[tId][sId].push(cfg);

                this._composeCfgs[tId].push(cfg);
                this._idDic.set(tId, this._composeCfgs[tId]);
                this._tab[cfg[item_composeFields.id]] = cfg;
                this._tabFake[cfg[item_composeFields.id]] = cfg;
            }

            let deCfgs: Array<any> = GlobalData.getConfig("item_resolve");
            for (let i: number = 0, len = deCfgs.length; i < len; i++) {
                let cfg1 = deCfgs[i];
                let tid = cfg1[item_resolveFields.name][idNameFields.id];
                let sid = cfg1[item_resolveFields.sClass][idNameFields.id];
                if (!this._tsClassResolveCfgs[tid]) {
                    this._tsClassResolveCfgs[tid] = {};
                    this._resolveCfgs[tid] = [];
                }
                if (!this._tsClassResolveCfgs[tid][sid]) {
                    this._tsClassResolveCfgs[tid][sid] = [];
                }
                if (!this._allClassResolveCfgs[tid]) {
                    this._allClassResolveCfgs[tid] = {};
                    this._resolveCfgs[tid] = [];
                }
                if (!this._allClassResolveCfgs[tid][sid]) {
                    this._allClassResolveCfgs[tid][sid] = [];
                }
                this._resolveCfgs[tid].push(cfg1);
                this._tsClassResolveCfgs[tid][sid].push(cfg1);
                this._allClassResolveCfgs[tid][sid].push(cfg1);
                this._deIdDic.set(tid, this._resolveCfgs[tid]);
            }

            let gemCfgs: Array<gemRefine> = GlobalData.getConfig("gem_refine");
            for (let i: number = 0; i < gemCfgs.length; i++) {
                let cfg = gemCfgs[i];
                this._gemIdDic.set(cfg[gemRefineFields.id], cfg);
            }
        }

        //根据大小类获取分解配置
        public getResolveCfgBySclass(tid: number, sid: number) {
            if (!this._tsClassResolveCfgs[tid]) {
                return null;
            }
            return this._tsClassResolveCfgs[tid][sid];
        }

        //小类Id获取配置
        public getComposeCfgBySclass(tid: number, id: number): Array<item_compose> {
            if (!this._tsClassComposeCfgs[tid]) {
                return null;
            }
            return this._tsClassComposeCfgs[tid][id];
        }

        // 获取分解全种类数据
        public getAllResolveCfgBySclass(tid: number, sid: number) {
            if (!this._allClassResolveCfgs[tid]) {
                return null;
            }
            return this._allClassResolveCfgs[tid][sid];
        }

        // 获取合成全种类数据
        public getAllComposeCfgBySclass(tid: number, id: number): Array<item_compose> {
            if (!this._allClassComposeCfgs[tid]) {
                return null;
            }
            return this._allClassComposeCfgs[tid][id];
        }


        public getComposeTclassLength(): Array<Array<item_compose>> {
            return this._composeCfgs;
        }

        public getResolveTclassLength(): Array<item_resolve> {
            return this._resolveCfgs;
        }

        public getGemRefineCfgById(id: number) {
            return this._gemIdDic.get(id);
        }

        public getCfgById(id: number) {
            if (Object.prototype.hasOwnProperty.call(this._tabFake, id)) {
                return this._tabFake[id];
            }
            console.error("error:", { ... this._tabFake });
            return null;
        }

        public getComposeTypeCfgs(num: number) {
            let cfgs: Array<item_compose> = GlobalData.getConfig("item_compose");
            let tempArr: item_compose[] = [];
            let tempClassComoposeCfgs: any[][] = [];
            let tempComposeCfgs: item_compose[][] = []
            for (let m = 0; m < cfgs.length; m++) {
                let cfg = cfgs[m];
                if (cfg[item_composeFields.tClass][idNameFields.id] == num) {
                    tempArr.push(cfg);
                }
            }
            for (let i: number = 0, len = tempArr.length; i < len; i++) {
                let cfg = tempArr[i];
                let tId = cfg[item_composeFields.sClass][idNameFields.id];
                let sId = cfg[item_composeFields.name][idNameFields.id];
                if (!tempClassComoposeCfgs[tId]) {
                    tempClassComoposeCfgs[tId] = [];
                    tempComposeCfgs[tId] = [];
                }
                if (!tempClassComoposeCfgs[tId][sId]) {
                    tempClassComoposeCfgs[tId][sId] = [];
                }
                tempClassComoposeCfgs[tId][sId].push(cfg);
                tempComposeCfgs[tId].push(cfg);
            }
            this._tempClassComoposeCfgs = tempClassComoposeCfgs;
            this._tempComposeCfgs = tempComposeCfgs;
        }

        private _tempClassComoposeCfgs: any[][] = [];
        private _tempComposeCfgs: item_compose[][] = []

        public get composeCfgs() {
            return [this._tempClassComoposeCfgs, this._tempComposeCfgs]
        }


        public getResolveTypeCfgs(num: number) {
            let deCfgs: Array<item_resolve> = GlobalData.getConfig("item_resolve");
            let tempArr: item_resolve[] = [];
            let tempClassResolveCfgs: any[][] = [];
            let tempResolveCfgs: item_resolve[][] = []
            for (let m = 0; m < deCfgs.length; m++) {
                let cfg = deCfgs[m];
                if (cfg[item_resolveFields.tClass][idNameFields.id] == num) {
                    tempArr.push(cfg);
                }
            }
            for (let i: number = 0, len = tempArr.length; i < len; i++) {
                let cfg = tempArr[i];
                let tId = cfg[item_resolveFields.name][idNameFields.id];
                let sId = cfg[item_resolveFields.sClass][idNameFields.id];
                if (!tempClassResolveCfgs[tId]) {
                    tempClassResolveCfgs[tId] = [];
                    tempResolveCfgs[tId] = [];
                }
                if (!tempClassResolveCfgs[tId][sId]) {
                    tempClassResolveCfgs[tId][sId] = [];
                }
                tempClassResolveCfgs[tId][sId].push(cfg);
                tempResolveCfgs[tId].push(cfg);
            }
            this._tempClassResolveCfgs = tempClassResolveCfgs;
            this._tempResolveCfgs = tempResolveCfgs;
        }

        private _tempClassResolveCfgs: any[][] = [];
        private _tempResolveCfgs: item_resolve[][] = []

        public get resolveCfgs() {
            return [this._tempClassResolveCfgs, this._tempResolveCfgs]
        }


        // 重置这的最初数组，变为根据点击而改变 this._tsClassComposeCfgs等值的逻辑
        public resetData() {
            this._tsClassComposeCfgs = {};
            this._composeCfgs = [];
                
            let cfgs: Array<item_compose> = GlobalData.getConfig("item_compose");
            let tempArr: item_compose[] = [];
            let com = modules.compose.ComposeModel.instance.composeType;
            for (let m = 0; m < cfgs.length; m++) {
                let cfg = cfgs[m];
                if (cfg[item_composeFields.tClass][idNameFields.id] == com) {
                    tempArr.push(cfg);
                }
            }

            for (let i: number = 0, len = tempArr.length; i < len; i++) {
                let cfg = tempArr[i];
                let tId = cfg[item_composeFields.sClass][idNameFields.id];
                let sId = cfg[item_composeFields.name][idNameFields.id];
                if (!this._tsClassComposeCfgs[tId]) {
                    this._tsClassComposeCfgs[tId] = {};
                    this._composeCfgs[tId] = [];
                }
                if (!this._tsClassComposeCfgs[tId][sId]) {
                    this._tsClassComposeCfgs[tId][sId] = [];
                }
                this._tsClassComposeCfgs[tId][sId].push(cfg);
                this._composeCfgs[tId].push(cfg);
                this._idDic.set(tId, this._composeCfgs[tId]);
                this._tab[cfg[item_composeFields.id]] = cfg;
            }

            let gemCfgs: Array<gemRefine> = GlobalData.getConfig("gem_refine");
            for (let i: number = 0; i < gemCfgs.length; i++) {
                let cfg = gemCfgs[i];
                this._gemIdDic.set(cfg[gemRefineFields.id], cfg);
            }
        }

        public resetDataResolve() {
            this._tsClassResolveCfgs = {};
            this._resolveCfgs = [];
            this._tab = {};
            let deCfgs: Array<item_resolve> = GlobalData.getConfig("item_resolve");
            let tempArr: item_resolve[] = [];
            let resolve = modules.compose.ComposeModel.instance.resolveType;

            // 这里把tclass对应的下标拿出，如果和model里的resolve一样，就放入对应的temoparr里，作为初始数组
            for (let m = 0; m < deCfgs.length; m++) {
                let cfg = deCfgs[m];
                if (cfg[item_resolveFields.tClass][idNameFields.id] == resolve) {
                    tempArr.push(cfg);
                }
            }


            for (let i: number = 0, len = tempArr.length; i < len; i++) {
                let cfg1 = tempArr[i];
                let tid = cfg1[item_resolveFields.name][idNameFields.id];
                let sid = cfg1[item_resolveFields.sClass][idNameFields.id];
                if (!this._tsClassResolveCfgs[tid]) {
                    this._tsClassResolveCfgs[tid] = {};
                    this._resolveCfgs[tid] = [];
                }
                if (!this._tsClassResolveCfgs[tid][sid]) {
                    this._tsClassResolveCfgs[tid][sid] = [];
                }
                this._resolveCfgs[tid].push(cfg1);
                this._tsClassResolveCfgs[tid][sid].push(cfg1);
                this._deIdDic.set(tid, this._resolveCfgs[tid]);
            }

            let gemCfgs: Array<gemRefine> = GlobalData.getConfig("gem_refine");
            for (let i: number = 0; i < gemCfgs.length; i++) {
                let cfg = gemCfgs[i];
                this._gemIdDic.set(cfg[gemRefineFields.id], cfg);
            }
        }
    }
}