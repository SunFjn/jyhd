namespace modules.compose {

    import Item = Protocols.Item;
    import BagModel = modules.bag.BagModel;
    import ItemFields = Protocols.ItemFields;
    import item_composeFields = Configuration.item_composeFields;
    import item_compose = Configuration.item_compose;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import ComposeCfg = modules.config.ComposeCfg;
    import idCountFields = Configuration.idCountFields;
    import item_resolveFields = Configuration.item_resolveFields;
    import item_resolve = Configuration.item_resolve;

    export class ComposeModel {
        private static _instance: ComposeModel;
        private _composeReply: number;
        private _resolveReply: number;
        private _currEquipPic: int; //当前的装备槽
        private _currEquipId: Array<Item>;
        private _equipRPIndex: number;
        private _defaultDecomposeSelect: number;    //分解默认选取项

        //当前的添加的装备

        public static get instance(): ComposeModel {
            return this._instance = this._instance || new ComposeModel();
        }

        constructor() {
            this._currEquipId = new Array<Item>();
            this.defaultDecomposeSelect = 0;
        }

        public get ComposeReply(): number {
            return this._composeReply;
        }

        public set ComposeReply(value: number) {
            this._composeReply = value;
            GlobalData.dispatcher.event(CommonEventType.COMPOSE_REPLY)
        }

        public get ResolveReply(): number {
            return this._resolveReply;
        }

        public set ResolveReply(value: number) {
            this._resolveReply = value;
            this.defaultDecomposeSelect = 0;
            GlobalData.dispatcher.event(CommonEventType.RESOLVE_REPLY);
        }

        public set currEquipPic(index: int) {
            this._currEquipPic = index;
        }

        public get currEquipPic() {
            return this._currEquipPic;
        }

        public set currEquipId(indexs: Array<Item>) {
            this._currEquipId = indexs;
        }

        public get currEquipId(): Array<Item> {
            return this._currEquipId;
        }

        public getEquip(cfg: item_compose | item_resolve, type = 0): Array<Item> {
            let arr = new Array<Item>();
            let needId = 0;
            if (type == 0) {
                needId = cfg[item_composeFields.needItemId][0][0];
            } else {
                needId = cfg[item_resolveFields.itemId];
            }
            let frontId = (needId / 1000 >> 0) * 1000;
            let srandId = ((needId * 0.1 >> 0) % 100);
            // let lastId = needId%10;
            // console.log("frontId", frontId, srandId)
            let isChooseArr = ComposeModel.instance.currEquipId;
            switch (srandId.toString()) {
                case "99": {
                    for (let i = 1; i < 9; i++) {
                        for (let k = 1; k < 10; k++) {
                            let lastId = k;
                            let id = frontId + i * 10 + lastId;
                            let items: Array<Protocols.Item> = BagModel.instance.getItemsById(id);
                            for (let j = 0; j < items.length; j++) {
                                let count = items[j][ItemFields.count];
                                if (count > 0) {
                                    arr.push(items[j]);
                                }
                            }
                        }
                    }
                }
                    break;
                case "0": {
                    for (let i = 1; i < 11; i++) {
                        for (let k = 1; k < 10; k++) {
                            let lastId = k;
                            let id = frontId + i * 10 + lastId;
                            let items: Array<Protocols.Item> = BagModel.instance.getItemsById(id);
                            for (let j = 0; j < items.length; j++) {
                                let count = items[j][ItemFields.count];
                                if (count > 0) {
                                    arr.push(items[j]);
                                }
                            }
                        }

                    }
                }
                    break;
                case "88": {
                    for (let i = 9; i < 11; i++) {
                        for (let k = 1; k < 10; k++) {
                            let lastId = k;
                            let id: number;
                            if (i == 10) {
                                id = frontId + i + lastId;
                            } else {
                                id = frontId + i * 10 + lastId;
                            }
                            let items: Array<Protocols.Item> = BagModel.instance.getItemsByBagId(CommonUtil.getBagIdById(id));
                            for (let j = 0; j < items.length; j++) {
                                let count = items[j][ItemFields.count];
                                if (count > 0) {
                                    arr.push(items[j]);
                                }
                            }
                        }
                    }
                }
                    break;
                case "77": {
                    for (let i = 7; i < 9; i++) {
                        for (let k = 1; k < 10; k++) {
                            let lastId = k;
                            let id: number = frontId + i * 10 + lastId;
                            let items: Array<Protocols.Item> = BagModel.instance.getItemsById(id);
                            for (let j = 0; j < items.length; j++) {
                                let count = items[j][ItemFields.count];
                                if (count > 0) {
                                    arr.push(items[j]);
                                }
                            }
                        }
                    }
                }
                    break;

                case "66": {
                    for (let i = 1; i < 9; i++) {
                        for (let k = 1; k < 10; k++) {
                            let lastId = k;
                            let id: number = frontId + i * 10 + lastId;
                            let items: Array<Protocols.Item> = BagModel.instance.getItemsById(id);
                            for (let j = 0; j < items.length; j++) {
                                let count = items[j][ItemFields.count];
                                if (count > 0) {
                                    arr.push(items[j]);
                                }
                            }
                        }
                    }
                }
                    break;
            }
            if (type == 1) return arr;
            let i = arr.length;
            while (i--) {
                for (let j = 0; j < isChooseArr.length; j++) {
                    if (arr[i] == isChooseArr[j]) {
                        arr.splice(i, 1);
                    }
                }
            }
            return arr;
        }

        public setNum(needId: number) {
            let frontId = (needId / 1000 >> 0) * 1000;
            let srandId = ((needId * 0.1 >> 0) % 100);
            // let lastId = needId%10;

            let num: number = 0;
            switch (srandId.toString()) {
                case "99": {
                    for (let i = 1; i < 9; i++) {
                        for (let k = 1; k < 10; k++) {
                            let lastId = k;
                            let id = frontId + i * 10 + lastId;
                            let count = BagModel.instance.getItemCountById(id);
                            num += count;
                        }

                    }
                }
                    break;
                case "0": {
                    for (let i = 1; i < 11; i++) {
                        for (let k = 0; k < 10; k++) {
                            let lastId = k;
                            let id = frontId + i * 10 + lastId;
                            let count = BagModel.instance.getItemCountById(id);
                            num += count;
                        }

                    }
                }
                    break;
                case "88": {
                    for (let i = 9; i < 11; i++) {
                        for (let k = 0; k < 10; k++) {
                            let lastId = k;
                            let id: number;
                            if (i == 10) {
                                id = frontId + i + lastId;
                            } else {
                                id = frontId + i * 10 + lastId;
                            }
                            let count = BagModel.instance.getItemCountById(id);
                            num += count;
                        }
                    }
                }
                    break;
                case "77": {
                    for (let i = 7; i < 9; i++) {
                        for (let k = 0; k < 10; k++) {
                            let lastId = k;
                            let id: number = frontId + i * 10 + lastId;
                            let count = BagModel.instance.getItemCountById(id);
                            num += count;
                        }

                    }
                }
                    break;
                case "66": {
                    for (let i = 1; i < 9; i++) {
                        for (let k = 0; k < 10; k++) {
                            let lastId = k;
                            let id: number = frontId + i * 10 + lastId;
                            let count = BagModel.instance.getItemCountById(id);
                            num += count;
                        }
                    }
                }
                    break;
                default:
                    num += BagModel.instance.getItemCountById(needId);
                    break;
            }
            return num;
        }

        public setDotDic() {
            let arr: Array<any>;
            let equipFlag: boolean = false;
            let flag: boolean = false;
            let stoneBtn: boolean = false;
            let equipBtn: boolean = false;
            let itemBtn: boolean = false;
            for (let m = 1; m < 4; m++) {
                arr = [];
                // equipBtn = false;
                this._equipRPIndex = null;
                ComposeCfg.instance.getComposeTypeCfgs(m);
                arr = ComposeCfg.instance.composeCfgs;

                tag: for (let i = 0; i < arr[1].length; i++) {
                    let composeTclassCfgs: Array<any> = arr[1][i];
                    if (composeTclassCfgs == null) continue;
                    for (let j = 0; j < composeTclassCfgs.length; j++) {
                        let tempArr = arr[0];
                        if (tempArr[i] == null) continue;
                        let cfgs: Array<any> = tempArr[i][j];
                        if (cfgs == null) continue;
                        if (m == 2) {
                            //console.log("adad", cfgs[0][item_composeFields.alertType], cfgs.length, cfgs);
                            if (cfgs[0][item_composeFields.alertType] == 1) {
                                for (let k = 0; k < cfgs.length; k++) {
                                    let equipCfg = cfgs[k];
                                    let needId = equipCfg[item_composeFields.needItemId][0][0];
                                    let needNum = equipCfg[item_composeFields.needItemId][0][1];
                                    let count = ComposeModel.instance.setNum(needId);
                                    if (count >= needNum) {
                                        equipFlag = flag = true;
                                        equipBtn = true;
                                        // console.log("equipRED");
                                        RedPointCtrl.instance.setRPProperty("redEquipComposeRP", true);
                                        this._equipRPIndex = i - 1;
                                        break tag;
                                    }
                                }
                            } else {
                                for (let k = 0; k < cfgs.length; k++) {
                                    let equipCfg = cfgs[k];

                                    let params: Array<Configuration.idCount> = equipCfg[item_composeFields.params];
                                    let tempFlag: boolean = true;
                                    for (let l: int = 0; l < params.length; l++) {
                                        let needId: number = params[l][Configuration.idCountFields.id];
                                        let needNum: number = params[l][Configuration.idCountFields.count];
                                        let haveNum: number = CommonUtil.getPropCountById(needId);
                                        if (haveNum < needNum) { //条件不够合成
                                            tempFlag = false;
                                            break;
                                        }
                                    }
                                    if (tempFlag) {
                                        equipFlag = flag = true;
                                        equipBtn = true;
                                        this._equipRPIndex = i - 1;
                                        break tag;
                                    }
                                }
                            }
                        } else {
                            for (let i = 0; i < cfgs.length; i++) {
                                let stoneCfg = cfgs[i];
                                let arr = stoneCfg[item_composeFields.params];
                                let maxArr = new Array<number>();
                                for (let j = 0; j < arr.length; j++) {
                                    let id = arr[j][idCountFields.id];
                                    let count = BagModel.instance.getItemCountById(id);
                                    let needCount = arr[j][idCountFields.count];
                                    let num = count / needCount >> 0;
                                    maxArr.push(num);
                                }
                                maxArr.sort((l: number, r: number): number => {
                                    return l > r ? -1 : 1;
                                });
                                let maxNum = maxArr.pop();
                                if (maxNum > 0) {
                                    flag = true;
                                    if (m == 1) {
                                        stoneBtn = true;

                                    } else if (m == 3) {
                                        itemBtn = true;
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            RedPointCtrl.instance.setRPProperty("itemBtnRP", itemBtn);
            RedPointCtrl.instance.setRPProperty("stoneBtnRP", stoneBtn);
            RedPointCtrl.instance.setRPProperty("equipBtnRP", equipBtn);

            RedPointCtrl.instance.setRPProperty("redEquipComposeRP", equipFlag);
            RedPointCtrl.instance.setRPProperty("composeRP", flag);

            equipFlag = false;
            flag = false;
            equipBtn = false;
            itemBtn = false;
            for (let n = 1; n < 3; n++) {
                arr = [];
                ComposeCfg.instance.getResolveTypeCfgs(n);

                arr = ComposeCfg.instance.resolveCfgs;
                // console.log("arrrrrr", arr, arr[0], arr[1], n);

                tag: for (let i = 0; i < arr[1].length; i++) {
                    let resolveTclassCfgs: Array<any> = arr[1][i];
                    if (resolveTclassCfgs == null) continue;
                    for (let j = 0; j < resolveTclassCfgs.length; j++) {
                        if (arr[0][n] == null) continue;
                        let cfgs: Array<any> = (arr[0])[i][j];
                        if (cfgs == null) continue;
                        for (let k = 0; k < cfgs.length; k++) {
                            let equipCfg = cfgs[k];
                            let needId = equipCfg[item_resolveFields.itemId];
                            let count = ComposeModel.instance.setNum(needId);
                            if (count >= 1) {
                                flag = true;
                                if (n == 1) {
                                    itemBtn = true;
                                } else {
                                    equipBtn = true;
                                }
                                break tag;
                            }
                        }
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("resolveRP", flag);
            RedPointCtrl.instance.setRPProperty("itemReBtnRP", itemBtn);
            RedPointCtrl.instance.setRPProperty("equipReBtnRP", equipBtn);
        }

        public get equipRPIndex(): number {
            return this._equipRPIndex;
        }

        public checkPoint(index: number, selectIndex: number) {
            let redDot = false;
            if (ComposeModel.instance.composeType == 2) {
                let cfgs: Array<any> = ComposeCfg.instance.getComposeCfgBySclass(index + 1, selectIndex + 1);
                if (cfgs[0][item_composeFields.alertType] == 1) {
                    for (let i = 0; i < cfgs.length; i++) {
                        let equipCfg = cfgs[i];
                        let needId = equipCfg[item_composeFields.needItemId][0][0];
                        let needNum = equipCfg[item_composeFields.needItemId][0][1];
                        let count = ComposeModel.instance.setNum(needId);
                        if (count >= needNum) {
                            redDot = true;
                            return redDot;
                        } else {
                            redDot = false;
                        }
                    }
                } else {
                    for (let k = 0; k < cfgs.length; k++) {
                        let equipCfg = cfgs[k];

                        let params: Array<Configuration.idCount> = equipCfg[item_composeFields.params];
                        let tempFlag: boolean = true;
                        for (let l: int = 0; l < params.length; l++) {
                            let needId: number = params[l][Configuration.idCountFields.id];
                            let needNum: number = params[l][Configuration.idCountFields.count];
                            let haveNum: number = CommonUtil.getPropCountById(needId);
                            if (haveNum < needNum) { //条件不够合成
                                tempFlag = false;
                                break;
                            }
                        }
                        if (tempFlag) {
                            redDot = true;
                            return redDot;
                        } else {
                            redDot = false;
                        }
                    }
                }
            } else {
                let cfgs: Array<any> = ComposeCfg.instance.getComposeCfgBySclass(index + 1, selectIndex + 1);
                for (let i = 0; i < cfgs.length; i++) {
                    let stoneCfg = cfgs[i];
                    let arr = stoneCfg[item_composeFields.params];
                    let maxArr = new Array<number>();
                    for (let j = 0; j < arr.length; j++) {
                        let id = arr[j][idCountFields.id];
                        let count = BagModel.instance.getItemCountById(id);
                        let needCount = arr[j][idCountFields.count];
                        let num = count / needCount >> 0;
                        maxArr.push(num);
                    }
                    maxArr.sort((l: number, r: number): number => {
                        return l > r ? -1 : 1;
                    });
                    let maxNum = maxArr.pop();
                    if (maxNum > 0) {
                        redDot = true;
                        return redDot;
                    } else {
                        redDot = false;
                    }
                }
            }
            return redDot;
        }

        public checkPointResolve(index: number, selectIndex: number) {
            let redDot = false;
            let cfgs: Array<any> = ComposeCfg.instance.getResolveCfgBySclass(index + 1, selectIndex + 1);
            for (let i = 0; i < cfgs.length; i++) {
                let equipCfg = cfgs[i];
                let needId = equipCfg[item_resolveFields.itemId];
                let count = this.setNum(needId);
                if (count >= 1) {
                    redDot = true;
                    return redDot;
                } else {
                    redDot = false;
                }
            }
            return redDot;
        }

        /**
         * 分解默认选取项
         * @author VTZ vvtz@qq
         */
        public set defaultDecomposeSelect(n: number) {
            this._defaultDecomposeSelect = n;
        }

        public get defaultDecomposeSelect() {
            return this._defaultDecomposeSelect;
        }

        public set defaultDecomposeSelectJudgeZero(n: number) {
            if (this.defaultDecomposeSelect == 0) {
                this._defaultDecomposeSelect = n;
            }
        }
        private _composeType: number;

        public get composeType() {
            if (this._composeType) {
                return this._composeType;
            } else {
                return 1;
            }
        }

        public set composeType(compose: number) {
            this._composeType = compose;
        }

        private _resolveType: number;

        public get resolveType() {
            if (this._resolveType) {
                return this._resolveType;
            } else {
                return 1;
            }
        }

        public set resolveType(resolve: number) {
            this._resolveType = resolve;
        }
    }
}