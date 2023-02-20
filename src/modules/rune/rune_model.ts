namespace modules.rune {
    import RuneSlot = Protocols.RuneSlot;
    import RuneSlotFields = Protocols.RuneSlotFields;
    import RuneCollectInfoReply = Protocols.RuneCollectInfoReply;
    import RuneCollectInfoReplyFields = Protocols.RuneCollectInfoReplyFields;
    import RuneCollectRiseFields = Protocols.RuneCollectRiseFields;
    import RuneCollectGradeInfo = Protocols.RuneCollectGradeInfo;
    import RuneCollectGradeInfoFields = Protocols.RuneCollectGradeInfoFields;
    import RuneCollectSingleInfoReply = Protocols.RuneCollectSingleInfoReply;
    import RuneCollectSingleInfoReplyFields = Protocols.RuneCollectSingleInfoReplyFields;
    import BagModel = modules.bag.BagModel;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import rune_collect_grade = Configuration.rune_collect_grade;
    import rune_collect_gradeFields = Configuration.rune_collect_gradeFields;
    import RuneCopyModel = modules.rune_copy.RuneCopyModel;
    import runeRefine = Configuration.runeRefine;
    import RuneRefineCfg = modules.config.RuneRefineCfg;
    import RuneCollectCfg = modules.config.RuneCollectCfg;
    import runeRefineFields = Configuration.runeRefineFields;
    import ItemsFields = Configuration.ItemsFields;
    import item_runeFields = Configuration.item_runeFields;
    import rune_compose = Configuration.rune_compose;
    import rune_composeFields = Configuration.rune_composeFields;
    import item_rune = Configuration.item_rune;
    import RuneComposeCfg = modules.config.RuneComposeCfg;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class RuneModel {
        private static _instance: RuneModel;
        public static get instance(): RuneModel {
            return this._instance = this._instance || new RuneModel();
        }

        private _rflags: number[];                                      /*分解标记勾选列表*/
        private _exp: number;                                           /*玉荣经验*/
        private _slots: Table<number>;                                  /*玉荣槽镶嵌列表 0表示没镶嵌*/
        private _commonPitTypeRecode: Table<number>;                    /*普通玉荣槽 类型镶嵌记录*/
        private _specialPitTypeRecode: Table<number>;                   /*特殊玉荣槽 类型镶嵌记录 */
        private _currClickPit: number;                                  //当前点击的玉荣槽
        private _currPitType: number;                                   //0代表普通玉荣槽 1特殊
        private _pitchRune: number;                                     //选中的玉荣
        private _firstSelect: number;                                   //打开面板第一个选中的
        private _isSearchFirst: boolean;                                //是否搜索第一个
        private _collcet_list: Array<RuneCollectGradeInfo>;             //收集箱数据列表
        private _collcet_jie_level: number;                             //收集箱阶级等级
        private _collcet_jie_process: [number, number];                 //收集箱阶级进度
        private _is_collect_maxed: boolean;                             //是否满阶
        private _current_collect_item_data: RuneCollectGradeInfo;       //更新后的当前的收集箱升级选择的数据

        public resolveList: Table<number>;                              //玉荣分解列表  key 是Uid value 是count
        public compsoeRPTab: Table<any>;                                //玉荣合成红点
        public tips: string[];                                          //开启层数

        constructor() {
            this._rflags = [];
            this._exp = 0;
            this._slots = {};
            this._commonPitTypeRecode = {};
            this._specialPitTypeRecode = {};
            this._currClickPit = -1;
            this._currPitType = 0;
            this.compsoeRPTab = {};
            this.resolveList = {};
            this._pitchRune = -1;
            this.tips = BlendCfg.instance.getCfgById(23001)[blendFields.stringParam];
            this._firstSelect = -1;
            this._isSearchFirst = true;
        }

        public saveData(tuple: Array<RuneSlot>): void {
            this._commonPitTypeRecode = {};
            this._specialPitTypeRecode = {};
            for (let i: int = 0, len: int = tuple.length; i < len; i++) {
                let itemId: number = tuple[i][RuneSlotFields.itemId];
                if (itemId == 0) continue;
                let indexId: number = tuple[i][RuneSlotFields.id];
                this._slots[indexId] = itemId;
                if (indexId <= 8) {
                    this._commonPitTypeRecode[CommonUtil.getStoneTypeById(itemId)] = itemId;
                } else {
                    this._specialPitTypeRecode[CommonUtil.getStoneTypeById(itemId)] = itemId;
                }
            }
            GlobalData.dispatcher.event(CommonEventType.RUNE_UPDATE);
        }

        /**
         * 收集箱数据更新
         * 
         * @param tuple 数据
         */
        public set runeCollectData(tuple: RuneCollectInfoReply) {
            // console.log("玉荣收集箱信息获取:", tuple);
            this._collcet_jie_level = tuple[RuneCollectInfoReplyFields.rise][RuneCollectRiseFields.level];
            this._collcet_jie_process = tuple[RuneCollectInfoReplyFields.rise][RuneCollectRiseFields.rate];
            this._is_collect_maxed = tuple[RuneCollectInfoReplyFields.rise][RuneCollectRiseFields.isMaxed] == 1;

            this._collcet_list = tuple[RuneCollectInfoReplyFields.refine];
            // 触发红点
            this.setTotalCollcetRP(this.setCollectRP());

            GlobalData.dispatcher.event(CommonEventType.RUNE_COLLECT_UPDATE_INFO);
            GlobalData.dispatcher.event(CommonEventType.RUNE_UPDATE_SP_INFO);
        }

        /**
         * 更新单个收集箱数据(收集箱玉荣升级后)
         * 
         * @param tuple 数据
         */
        public set updateCollectData(tuple: RuneCollectSingleInfoReply) {
            // console.log("更新单个收集箱数据:", tuple);
            this._collcet_jie_level = tuple[RuneCollectSingleInfoReplyFields.rise][RuneCollectRiseFields.level];
            this._collcet_jie_process = tuple[RuneCollectSingleInfoReplyFields.rise][RuneCollectRiseFields.rate];
            this._is_collect_maxed = tuple[RuneCollectSingleInfoReplyFields.rise][RuneCollectRiseFields.isMaxed] == 1;
            this._current_collect_item_data = tuple[RuneCollectSingleInfoReplyFields.refine];

            // 将新数据替换到收集箱列表
            for (let index = 0; index < this._collcet_list.length; index++) {
                const runeData: RuneCollectGradeInfo = this._collcet_list[index];
                if (runeData[RuneCollectGradeInfoFields.id] == this._current_collect_item_data[RuneCollectGradeInfoFields.id]) {
                    this._collcet_list[index] = this._current_collect_item_data;
                    break;
                }
            }
            // 触发红点
            this.setTotalCollcetRP(this.setCollectRP());

            GlobalData.dispatcher.event(CommonEventType.RUNE_COLLCET_REFRESH_ITEM_DATA);
            GlobalData.dispatcher.event(CommonEventType.RUNE_UPDATE_SP_INFO);
        }

        /**
         * 检测收集箱当前玉荣升级红点
         */
        private checkCollectUpLevelRP(curItemData: RuneCollectGradeInfo) {
            let rpState: boolean = false;
            let id: number = curItemData[RuneCollectGradeInfoFields.id];
            let level = curItemData[RuneCollectGradeInfoFields.level];
            let runeData: rune_collect_grade = RuneCollectCfg.instance.getCfgByIdLevel(id, level);
            let nextRuneData: rune_collect_grade = RuneCollectCfg.instance.getNextCfgByIdLevel(id, level);

            // 升级消耗
            let refineItem = runeData[rune_collect_gradeFields.refineItem];
            if ((refineItem as Array<number>).length != 0) {
                let total_count = RuneModel.instance.getRuneCountByDimID(refineItem[0]);
                // 升级数量足够且没满级的需要显示红点
                rpState = ((refineItem[1] <= total_count) && nextRuneData != null);
                curItemData[RuneCollectGradeInfoFields.rpState] = rpState;
            } else {
                curItemData[RuneCollectGradeInfoFields.rpState] = false;
            }


            return rpState;
        }

        /**
         * 设置收集箱的红点
         */
        private setCollectRP(): boolean {
            let trigger = false;
            for (let index = 0; index < this._collcet_list.length; index++) {
                const curItemData: RuneCollectGradeInfo = this._collcet_list[index];
                let rp = this.checkCollectUpLevelRP(curItemData);
                if (!trigger && rp) {
                    trigger = true;
                }
            }

            // 是否可升阶
            if (this._collcet_jie_process[0] >= this._collcet_jie_process[1]) {
                if (!this.isCollectMaxed) {
                    trigger = true;
                }
            }

            return trigger;
        }

        /***
         * 激活收集箱红点
         */
        private setTotalCollcetRP(active: boolean) {
            if (!FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.runeCollect)) {
                active = false;
            }
            RedPointCtrl.instance.setRPProperty("runeCollectRP", active);
        }

        /**
         * 收集箱是否满阶
         */
        public get isCollectMaxed(): boolean {
            return this._is_collect_maxed;
        }

        /**
         * 更新后的选择的收集箱的数据
         */
        public get currentCollectItemData(): RuneCollectGradeInfo {
            return this._current_collect_item_data;
        }

        /**
         * 收集箱收集等级
         */
        public get collcetLevel(): number {
            return this._collcet_jie_level;
        }

        /**
         * 收集箱当前经验进度
         */
        public get collcetProcess(): [number, number] {
            return this._collcet_jie_process;
        }

        /**
         * 收集箱当前经验进度
         */
        public get collcetList(): Array<RuneCollectGradeInfo> {
            return this._collcet_list;
        }

        //玉荣红点检测
        public checkRP(): void {
            this.checkComposeRP();

            let arr: number[] = [];
            for (let key in this.slots) {
                arr.push(parseInt(key));
            }
            if (arr.length == 0) {
                this._firstSelect = -1;  //没有镶嵌玉荣
                this._isSearchFirst = false;
            } else {
                this._firstSelect = arr[0];
            }

            //能镶嵌  能升级  能替换
            for (let i: int = 1; i <= 10; i++) {
                let intArr: string[] = this.tips[i - 1].split("#");
                let needUnlockLayer: number = parseInt(intArr[intArr.length - 1]);
                let pitType: number = i > 8 ? 1 : 0;
                let currLayer: number = RuneCopyModel.instance.finishLv;
                //已解锁
                if (currLayer >= needUnlockLayer) {
                    let runeItems: Item[] = this.canInlayRunes(pitType);
                    if (!runeItems) return;
                    let currInlayId: number = this._slots[i];
                    let currType: number = CommonUtil.getStoneTypeById(currInlayId);
                    //首先要筛选出其他玉荣槽镶嵌了哪些类型的玉荣
                    //收集其他玉荣槽镶嵌过的类型
                    let othersType: Table<number> = pitType == 0 ? this._commonPitTypeRecode : this._specialPitTypeRecode;

                    //未镶嵌玉荣
                    if (!currInlayId) {
                        //是否能镶嵌玉荣
                        for (let j: int = 0, len: int = runeItems.length; j < len; j++) {
                            let id: number = runeItems[j][ItemFields.ItemId];
                            let dimId: number = (id * 0.0001 >> 0) * 10000;  //模糊Id
                            let dimCfg: item_rune = config.ItemRuneCfg.instance.getCfgById(dimId);
                            let needUnLockLv: number = dimCfg[item_runeFields.layer];
                            if (currLayer < needUnLockLv) continue;
                            let type: number = CommonUtil.getStoneTypeById(id);
                            if (othersType[type]) continue;//遇到相同类型跳过
                            RedPointCtrl.instance.setRPProperty("runeRP", true);
                            if (this._slots[i]) {
                                this._firstSelect = i;
                            }
                            return;
                        }
                    } else {  //已经镶嵌玉荣
                        //可以替换成更高级的
                        let currQuality: number = CommonUtil.getItemQualityById(currInlayId);

                        for (let j: int = 0, len: int = runeItems.length; j < len; j++) {
                            let id: number = runeItems[j][ItemFields.ItemId];
                            let dimId: number = (id * 0.0001 >> 0) * 10000;  //模糊Id
                            let dimCfg: item_rune = config.ItemRuneCfg.instance.getCfgById(dimId);
                            let type: number = CommonUtil.getStoneTypeById(id);
                            if (othersType[type] && type != currType) continue;
                            let needUnLockLv: number = dimCfg[item_runeFields.layer];
                            let quality: number = CommonUtil.getItemQualityById(id);
                            if (currLayer < needUnLockLv || quality < currQuality) continue;
                            let lv: number = id % 10000;
                            let currlv: number = currInlayId % 10000;
                            if (type == currType) {
                                if ((quality == currQuality && lv > currlv) || quality > currQuality) {  //相同类型 品质相同等级高或者 品质高
                                    RedPointCtrl.instance.setRPProperty("runeRP", true);
                                    if (this._slots[i]) {
                                        this._firstSelect = i;
                                    }
                                    return;
                                }
                            }
                        }
                        let cfg: runeRefine = RuneRefineCfg.instance.getCfgById(currInlayId);
                        let nextCfg: runeRefine = RuneRefineCfg.instance.getCfgById(currInlayId + 1);
                        if (nextCfg) {
                            let currExp: number = RuneModel.instance.exp;
                            let needExp: number = cfg[runeRefineFields.refineItem][ItemsFields.count];
                            if (currExp >= needExp) {
                                RedPointCtrl.instance.setRPProperty("runeRP", true);
                                if (this._slots[i]) {
                                    this._firstSelect = i;
                                }
                                return;
                            }
                        }
                    }
                } else {

                }
            }
            RedPointCtrl.instance.setRPProperty("runeRP", false);
        }

        /**
         * 获取合成有红点的一个item的数据【大小类别】
         * 
         * @param big_class 大类 [1 2 3]，-1表示查找所有类别
         */
        public getComposeHasRPItemData(big_class: number = -1) {
            let ret_bc = big_class;
            let ret_sc = -1;
            if (big_class == -1) {
                for (const bc in this.compsoeRPTab) {
                    const tab = this.compsoeRPTab[bc];
                    let canQuit = false;
                    if (typeof tab == 'object') {
                        for (const id in tab) {
                            const id_bool = tab[id];
                            if (id_bool) {
                                ret_bc = +bc;
                                ret_sc = +id;
                                canQuit = true;
                                break;
                            }
                        }
                    }
                    // 找到合适的退出循环
                    if (canQuit) {
                        break;
                    }
                }
            } else {
                let tab = this.compsoeRPTab[big_class];
                for (const id in tab) {
                    const id_bool = tab[id];
                    if (id_bool) {
                        ret_sc = +id;
                        break;
                    }
                }
            }
            // 返回大类和小类
            return { ret_bc, ret_sc };
        }

        /**
         * 玉荣合成红点检测
         */
        private checkComposeRP() {
            let trigger: boolean = false;
            let big_class_arr = RuneComposeCfg.instance.getBigClassArr();
            // 遍历大类
            for (let index = 0; index < big_class_arr.length; index++) {
                const big_class_id = big_class_arr[index][0];
                let big_class_state = false;
                if (!this.compsoeRPTab[big_class_id]) {
                    this.compsoeRPTab[big_class_id] = {};
                }
                let small_arr: Array<rune_compose> = RuneComposeCfg.instance.getCfgByCategory(big_class_id);
                // 判断需要的2个小类是否都在背包或者镶嵌在身上，找到一个合适的就触发总的红点并存取所有子红点的状态
                for (let i = 0; i < small_arr.length; i++) {
                    const id = small_arr[i][rune_composeFields.id];
                    const need_runes = small_arr[i][rune_composeFields.needRunes];
                    let need_id = small_arr[i][rune_composeFields.needItems][0];
                    let need_count = small_arr[i][rune_composeFields.needItems][1];

                    // 合成花费是否足够
                    let moneyEnough = modules.bag.BagModel.instance.getItemCountById(need_id) >= need_count;
                    // 合成材料是否拥有
                    let rune1State = this.hasTheRune(need_runes[0][0]);
                    let rune2State = this.hasTheRune(need_runes[1][0]);

                    let rpState = rune1State && rune2State && moneyEnough && this.composedAtBody(id);
                    // 2个需要子玉荣都有的状态才判定为有红点
                    this.compsoeRPTab[big_class_id][id] = rpState;
                    if (!trigger && rpState) {
                        trigger = true;
                    }
                    if (!big_class_state && rpState) {
                        big_class_state = true;
                    }
                }
                // 大类状态
                this.compsoeRPTab["bigClass" + big_class_id] = big_class_state;
            }

            // 设置红点状态
            if (!FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.runeCompose)) {
                trigger = false;
            }
            RedPointCtrl.instance.setRPProperty("runeComposeRP", trigger);
            GlobalData.dispatcher.event(CommonEventType.RUNE_COMPOSE_RP_UPDATE);
            // console.log("玉荣合成红点:", this.compsoeRPTab);
        }

        /**
         * 镶嵌在身上的不需要显示红点
         * 
         * @param inputDimId 模糊id
         * @returns 
         */
        public composedAtBody(inputDimId: number) {
            // 只判断镶嵌在身上的玉荣
            for (const id in this._slots) {
                let dimId: number = (this._slots[id] * 0.0001 >> 0) * 10000;  //模糊Id
                if (dimId == inputDimId) {
                    return false;
                }
            }
            return true;
        }

        /**
         * 当前玉荣是否镶嵌在身上，模糊id
         * 
         * @param inputDimId 模糊id
         * @returns 
         */
        public currentRuneAtBody(inputDimId: number) {
            for (const id in this._slots) {
                let dimId: number = (this._slots[id] * 0.0001 >> 0) * 10000;  //模糊Id
                if (dimId == inputDimId) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 如果有了该玉荣或镶嵌在身上了，合成的时候需要提示
         * @param inputDimId 模糊id
         */
        public needComposeWarn(inputDimId: number) {
            return this.hasTheRune(inputDimId);
        }

        /**
         * 检测是否拥有某个玉荣（模糊id）
         * 
         * @param inputDimId 模糊id
         * @returns 
         */
        public hasTheRune(inputDimId: number): boolean {
            //玉荣仓库列表
            let runeItems: Array<Protocols.Item> = BagModel.instance.getItemsByBagId(BagId.rune);
            for (let j: int = 0, len: int = runeItems.length; j < len; j++) {
                let dimId: number = (runeItems[j][ItemFields.ItemId] * 0.0001 >> 0) * 10000;  //模糊Id
                if (dimId == inputDimId) {
                    return true;
                }

            }
            // 镶嵌的玉荣
            for (const id in this._slots) {
                let dimId: number = (this._slots[id] * 0.0001 >> 0) * 10000;  //模糊Id
                if (dimId == inputDimId) {
                    return true;
                }
            }
            return false;
        }


        public set rflags(value: number[]) {
            this._rflags = value;
        }

        public get rflags(): number[] {
            return this._rflags;
        }

        public set exp(value: number) {
            this._exp = value;
        }

        public get exp(): number {
            return this._exp;
        }

        public get slots(): Table<number> {
            return this._slots;
        }

        /**
         * 卸下插槽的玉荣
         * 
         * @param arr 
         */
        public unInstallSlots(arr: Array<number>): void {
            console.log("卸下符文", arr);

            for (let index = 0; index < arr.length; index++) {
                const soleID = arr[index];
                delete this._slots[soleID];
            }
            this._currClickPit = -1;
        }

        public get commonPitTypeRecode(): Table<number> {
            return this._commonPitTypeRecode;
        }

        public get specialPitTypeRecode(): Table<number> {
            return this._specialPitTypeRecode;
        }

        public set currClickPit(index: number) {
            this._currClickPit = index;
        }

        public get currClickPit(): number {
            return this._currClickPit;
        }

        public set currPitType(value: number) {
            this._currPitType = value;
        }

        public get currPitType(): number {
            if (this._currPitType <= 8) return 0;
            else return 1;
        }

        public set pitchRune(type: number) {
            this._pitchRune = type;
        }

        public get pitchRune(): number {
            return this._pitchRune;
        }

        public get firstSelect(): number {
            return this._firstSelect;
        }

        public get isSearchFirst(): boolean {
            return this._isSearchFirst;
        }

        //可以镶嵌的玉荣 0普通槽玉荣 1特殊槽玉荣
        public canInlayRunes(type: number): Item[] {

            let canInlayRunes: Item[] = [];
            //玉荣仓库列表
            let runeItems: Array<Protocols.Item> = BagModel.instance.getItemsByBagId(BagId.rune);
            if (!runeItems) return;
            for (let i: int = 0, len: int = runeItems.length; i < len; i++) {
                let itemId: number = runeItems[i][ItemFields.ItemId];
                //过滤精华玉荣
                if (CommonUtil.getStoneTypeById(itemId) === config.ItemRuneCfg.instance.resolveRuneSubTypeId) {
                    continue;
                }
                if (type == 0 && CommonUtil.getStoneTypeById(itemId) < 90) {
                    canInlayRunes.push(runeItems[i]);
                } else if (type == 1 && CommonUtil.getStoneTypeById(itemId) >= 90) {
                    canInlayRunes.push(runeItems[i]);
                }
            }
            return canInlayRunes;
        }

        //仅限特殊玉荣镶嵌判断 有镶嵌返回另一个玉荣id 都无镶嵌返回null
        public get getOtherSpecial(): number {
            //阳玉荣是否镶嵌
            let yangType: number = CommonUtil.getStoneTypeById(RuneRefineCfg.instance.yang);
            let yangId: ItemId = this._specialPitTypeRecode[yangType];
            let yinType: number = CommonUtil.getStoneTypeById(RuneRefineCfg.instance.yin);
            let yinId: ItemId = this._specialPitTypeRecode[yinType];
            if (!yangId && !yinId) return null;
            else {
                return yangId ? RuneRefineCfg.instance.yin : RuneRefineCfg.instance.yang;
            }
        }

        /**
         * 获取玉荣的数量根据模糊id
         * 不区分等级，镶嵌的不需要
         * 
         * @param dimID 
         * @returns 
         */
        public getRuneCountByDimID(dimID: number) {
            let count = 0;
            let runeItems: Array<Protocols.Item> = BagModel.instance.getItemsByBagId(BagId.rune);
            for (let j: int = 0, len: int = runeItems.length; j < len; j++) {
                let id: number = runeItems[j][ItemFields.ItemId];
                let dimId: number = (id * 0.0001 >> 0) * 10000;  //模糊Id
                if (dimId == dimID) {
                    count += runeItems[j][ItemFields.count];
                }
            }
            return count;
        }

        /**
         * 获取当前模糊id玉荣的最高等级的真实玉荣id
         * 
         * @param inputDimId 模糊id
         * @returns 【真实id】0为没有找到任何一个
         */
        public getMaxLVCanComposeRuneID(inputDimId: number): number {
            let maxLevelID: number = 0;
            //玉荣仓库列表
            let runeItems: Array<Protocols.Item> = BagModel.instance.getItemsByBagId(BagId.rune);
            for (let j: int = 0, len: int = runeItems.length; j < len; j++) {
                let id: number = runeItems[j][ItemFields.ItemId];
                let dimId: number = (id * 0.0001 >> 0) * 10000;  //模糊Id
                let currLV: number = id % 10000;
                if (dimId == inputDimId) {
                    if (!maxLevelID || currLV > maxLevelID % 10000) {
                        maxLevelID = runeItems[j][0];
                    }
                }
            }

            // 如果找到了则不在去玉荣插槽里去找
            // if (maxLevelID) return maxLevelID;

            // 镶嵌的玉荣
            for (const id in this._slots) {
                const currID = this._slots[id];
                let dimId: number = (currID * 0.0001 >> 0) * 10000;  //模糊Id
                let currLV: number = currID % 10000;
                if (dimId == inputDimId) {
                    if (!maxLevelID || currLV > maxLevelID % 10000) {
                        maxLevelID = currID;
                    }
                }
            }
            return maxLevelID;
        }

        public getComposeUseSendID(real_id: number) {
            let ret_id: number = -1;
            //玉荣仓库列表
            let runeItems: Array<Protocols.Item> = BagModel.instance.getItemsByBagId(BagId.rune);
            for (let j: int = 0, len: int = runeItems.length; j < len; j++) {
                let id: number = runeItems[j][ItemFields.ItemId];
                if (id == real_id) {
                    ret_id = runeItems[j][ItemFields.uid]
                }
            }
            // 镶嵌的玉荣
            for (const id in this._slots) {
                const currID = this._slots[id];
                if (currID == real_id) {
                    ret_id = +id;
                }
            }

            return ret_id;
        }
    }
}