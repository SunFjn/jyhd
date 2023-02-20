///<reference path="../../modules/config/exterior_sk_cfg.ts"/>

/**
 * 2D骨骼动画组件
 * author:杉木说
 * 【同一个资源模板动画使用一个，后期优化（大幅内存性能优化）】
 */
namespace modules.common {
    import Skeleton = Laya.Skeleton;
    import Templet = Laya.Templet;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import Event = Laya.Event;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSK = Configuration.ExteriorSK;


    /**
     * 骨骼数据字段
    */
    export const enum skeleDataFields {
        id = 0,
        skele = 1,
        templet = 2,
        cfg = 3,
        type = 4,
        lastUseTime = 5,
        buildArmature = 6,
    }
    export type skeleData = [number, Skeleton, Templet, ExteriorSK, string, number, string];

    export const enum offsetPointFields {
        offsetX = 0,
        offsetY = 1,
    }
    export type offsetPoint = [number, number];

    const enum useCfgScaleAndOffsetFields {
        useCfgScale = 0,
        useCfgOffset = 1,
    }
    type useCfgScaleAndOffset = [boolean, boolean];

    const enum templetDataFields {
        templet = 0,             // 模板
        loaded = 1,              // 是否加载完成
        usedCount = 2,           // 正在使用中的数量
        inPoolCount = 3,         // 对象池中使用的数量
    }
    type templetData = [Templet, boolean, number, number];

    const enum releaseDataArrFields {
        fullName = 0,            // 全名
        lastUseTime = 1,         // 最后使用的时间
        canRelease = 2,          // 是否可以释放(达到或超过长时间未使用的时间阈值)
        skeleData = 3,           // 数据
        idType = 4,              // 对象池的key
    }
    type releaseDataArr = [string, number, boolean, skeleData, string];

    /**
     * 时装上换装使用的插槽参数
     * 
     * solt: 插槽名字 default: 默认的贴图名字
     */
    const clothSoltParams: Table<Table<any>> = {
        weapon: { solt: ["5020", "5020A", "5020B"], default: "5001" },
        /** 翅膀幻武名字需要id+插槽后的后缀(a,b,c) 以美术资源给定为主 */
        wing: { solt: ["3001", "3001a", "3001b", "3001c"], exteral: ["", "a", "b", "c"], default: "3001" },
    };

    export class SkeletonAvatar extends Laya.Image {
        private skeleTabs: Table<skeleData>;
        private _skeleOffsets: Table<offsetPoint>;
        private _skeleZOrders: Table<number>;
        private _skeleUseCfgScale: Table<useCfgScaleAndOffset>;
        public ownerName: string;
        /**
         * 这个数组记录当前节点组件正在创建的骨骼动画 (类型+id)
         * 解决在极短的时间内部重复调用reset方法导致创建多个相同（不需要的）的同id的骨骼
         * 因为创建骨骼是异步处理,常规逻辑无法排除该意外。如果正在创建则跳过！
         */
        private resettingList: Array<string>
        /* 骨骼资源的id保存，加载错误的时候尝试重载使用 */
        private clothes: number;
        private weapon: number;
        private wing: number;
        private immortals: number;
        private aura: number;
        private tianZhu: number;
        private effect: number;
        private other: number;
        // 正在播放死亡动画中
        private _onDeathAnimation: boolean;
        private _onDeathAnimationID: number;
        public loadCompleteHandler: Function;
        // 属性，外部可设置和获取值
        private _skeleType: RoleType;
        private _errResetTable: Table<number>;
        private _createComponentByScene: boolean;
        // 创建的是否为面板
        private _isCreateShow: boolean;
        private _aniNameList: Table<Array<string>>;
        private _creatingCallback: Table<Function>;
        private _exteralScale: Table<number>;
        private _exteralPlaybackRate: Table<number>;
        private _timeoutFunc: Table<number>;
        // 当前播放的动画
        private _currentPlayAction: ActionType;

        /** 加载完骨骼资源,默认不播放动画 */
        public notPlayDefaultAnim: boolean = false;
        /** 
         * 加载完成骨骼资源,默认要播放的动画,一般只给只有一个骨骼资源的情况用
         * 因为这样修改的话,当前节点下所有的骨骼资源加载完成后都会默认播放当前设置的动画
         */
        public defaultPlayAnim: ActionType = ActionType.DAIJI;

        // 同一部位同时创建多个骨骼资源时，保留最后一个，其他资源全部回收到资源池
        // 防止同一部位同时加载多个骨骼，导致无法回收
        private _latestUseSkeletonIDTab: Table<number>;

        public static reuse_avatar_count: number = 0;
        public static pool_avatar_count: number = 0;
        public static release_check_count: number = 0;
        public static templetTabs: Table<templetData> = {};
        public static loadedList: Array<string> = [];
        public static readonly skeletonRootPath = "res/skeleton";

        // 面板和对话框骨骼
        public static viewSkelePools: Table<Array<SkeletonAvatar>> = {};
        // 骨骼对象池
        public static skeleDataPools: Table<Array<skeleData>> = {};
        // 回收数量检测阈值 >= 则会检测是否自动回收 默认n个
        private static checkThreshold: number = 8;
        // 回收时间检测阈值 >= 默认1分钟
        private static freeInterval: number = 1000 * 60 * 1;
        // 需要创建骨骼资源的队列
        private static needCreatedQueue: Table<any> = {};
        // 面板禁用换装模式
        private _notChangeSkin: boolean;

        /**
         * 外部调用创建，场景中加载使用
         * 
         * @param ownerName 创建者的名字
         * @param sceneUseComponent 创建的是场景【true=场景 false=UI】使用的骨骼组件
         * @param parent 父节点
         * @param alignCenter 居中对齐
         * @returns 创建好的骨骼对象
         */
        public static create(ownerName: string = null, sceneUseComponent: boolean = true, parent: Laya.Node = null, alignCenter: boolean = true): SkeletonAvatar {
            return new SkeletonAvatar(ownerName, sceneUseComponent, parent, alignCenter, -1);
        }

        /**
         * 外部调用创建-UI展示界面,关闭界面自动将骨骼资源放回对象池。
         * 面板类都建议调用该方法，关闭时有资源回收功能
         * 
         * @param viewOrDialog 骨骼资源所在的面板
         * @param parent 父节点
         * @param index 父节点中的兄弟间的位置
         * @returns 骨骼节点对象
         */
        public static createShow(viewOrDialog: Laya.Node, parent: Laya.Node = null, index: number = -1): SkeletonAvatar {
            let _gid = viewOrDialog["$_GID"];
            if (_gid == undefined || _gid == null || _gid == "") {
                console.error("面板节点错误!!!", viewOrDialog);
                return null;
            }
            _gid = "gid_" + _gid;
            return new SkeletonAvatar("view_skeleton:" + _gid, false, parent, false, index, _gid);
        }

        /**
         * 构造器生成骨骼动画
         * 
         * @param ownerName 创建的名字
         * @param sceneUseComponent 创建的是场景【true=场景 false=UI】使用的骨骼组件
         * @param parent 父节点
         * @param alignCenter 居中对齐
         * @param index 当前节点位于兄弟节点的索引
         * @param panel_gid 面板gid
         */
        constructor(ownerName: string, sceneUseComponent: boolean, parent: Laya.Node, alignCenter: boolean, index: number, panel_gid: string = "") {
            super();
            this._createComponentByScene = sceneUseComponent;
            this._currentPlayAction = ActionType.NONE;
            this._skeleOffsets = {};
            this._skeleZOrders = {};
            this._skeleUseCfgScale = {};
            this._aniNameList = {};
            this._creatingCallback = {};
            this._exteralScale = {};
            this._exteralPlaybackRate = {};
            this._timeoutFunc = {};
            this._errResetTable = {};
            this._latestUseSkeletonIDTab = {};
            this.skeleTabs = {};
            this.resettingList = [];
            this.ownerName = ownerName;

            // 父节点
            if (parent) {
                if (index < 0) {
                    parent.addChild(this);
                } else {
                    parent.addChildAt(this, index);
                }
            }

            // 居中
            if (alignCenter) {
                this.centerX = 0;
                this.centerY = 0;
            }

            // 记录面板数据，关闭时释放资源到对象池
            if (panel_gid != "") {
                if (!SkeletonAvatar.viewSkelePools[panel_gid]) {
                    SkeletonAvatar.viewSkelePools[panel_gid] = [];
                }
                SkeletonAvatar.viewSkelePools[panel_gid].push(this);

                this._isCreateShow = true;
            } else {
                this._isCreateShow = false;
            }

            this.width = 1;
            this.height = 1;
            this.mouseEnabled = false;
            this._onDeathAnimation = false;
            this._skeleType = RoleType.Monster;
            // console.log(ownerName, "创建骨骼动画!!!", SkeletonAvatar.reuse_avatar_count, this.x, this.y);
        }

        /**
         * 设置骨骼角色类型
         */
        public set SkeleType(type: RoleType) {
            this._skeleType = type;
        }

        /**
         * 角色整体方向 -1为镜像（左边） 1为正向（右边）
         */
        public set direction(vdir: -1 | 1) {
            this.scaleX = vdir;
        }

        /**
         * 获取对象池中的骨骼数据
         * 
         * @param idType id+大类
         * @returns 
         */
        private static getPoolSkeleData(idType: string): skeleData {

            let idTypeDatas: Array<skeleData> = SkeletonAvatar.skeleDataPools[idType];
            if (!idTypeDatas) {
                SkeletonAvatar.skeleDataPools[idType] = [];
                return null;
            }

            let skele_data: skeleData = idTypeDatas.pop();
            if (!skele_data) {
                return null;
            }

            SkeletonAvatar.pool_avatar_count--;

            let templetTableKey: string = skele_data[skeleDataFields.skele].name;
            SkeletonAvatar.templetTabs[templetTableKey][templetDataFields.usedCount]++;
            SkeletonAvatar.templetTabs[templetTableKey][templetDataFields.inPoolCount]--;

            return skele_data;
        }

        /**
         * 放入骨骼数据到对象池中
         * 
         * @param idType id+大类
         * @param skele_data 骨骼数据 
         */
        private static putPoolSkeleData(idType: string, skele_data: skeleData, isChangeSkinModel: boolean = false) {
            if (!skele_data) {
                console.error("放回对象池失败,idType：" + idType + "对应的数据不存在!!!");
                return;
            }
            SkeletonAvatar.pool_avatar_count++;

            // 停止播放动画，隐藏节点
            skele_data[skeleDataFields.skele].removeSelf();
            skele_data[skeleDataFields.skele].stop();
            skele_data[skeleDataFields.skele].visible = false;

            SkeletonAvatar.skeleDataPools[idType].push(skele_data);

            let templetTableKey: string = skele_data[skeleDataFields.skele].name;
            SkeletonAvatar.templetTabs[templetTableKey][templetDataFields.usedCount]--;
            SkeletonAvatar.templetTabs[templetTableKey][templetDataFields.inPoolCount]++;
        }

        /**
         * update更新 3秒左右执行1次
         */
        public static slowUpdate() {
            SkeletonAvatar.release_check_count++;
            SkeletonAvatar.checkAndFreeSkeleton();
        }

        /**
         * 检查和释放长时间未使用的骨骼动画
         * 对象池数量超标且时间过长未使用则回收
         * 
         * @returns 
         */
        private static checkAndFreeSkeleton() {
            // 超出阈值
            let overflow: boolean = SkeletonAvatar.pool_avatar_count > SkeletonAvatar.checkThreshold;
            // 2分钟一次的全局检测，超时就应该释放,不论是否超出阈值
            let fullCheck: boolean = SkeletonAvatar.release_check_count % 40 == 0;

            if (!overflow && !fullCheck) {
                return;
            }

            // 服务器时间
            let serverTime = GlobalData.serverTime;
            let arr: Array<releaseDataArr> = [];
            // 遍历检查
            for (const key in SkeletonAvatar.skeleDataPools) {
                const skele_data_Array: Array<skeleData> = SkeletonAvatar.skeleDataPools[key];
                let lens = skele_data_Array.length - 1;
                for (let index = lens; index >= 0; index--) {
                    let sk_data: skeleData = skele_data_Array[index];
                    let canRelease: boolean = (serverTime - skele_data_Array[index][skeleDataFields.lastUseTime]) >= SkeletonAvatar.freeInterval;
                    let fullName = sk_data[skeleDataFields.skele].name;
                    arr.push([fullName, sk_data[skeleDataFields.lastUseTime], canRelease, sk_data, key]);
                }
            }

            // 根据最后使用时间进行排序,升序
            arr.sort((a: releaseDataArr, b: releaseDataArr) => {
                return a[releaseDataArrFields.lastUseTime] - b[releaseDataArrFields.lastUseTime];
            })

            // 开始释放资源
            for (let index = 0; index <= arr.length - 1; index++) {
                let release_data: releaseDataArr = arr[index];
                // 直接释放(按照时间排序,能释放的一定排在最前面)
                if (release_data[releaseDataArrFields.canRelease]) {
                    SkeletonAvatar.doReleaseSkele(release_data);
                }
                // 如果清理完所有应该清理的还是超出阈值则根据使用最早的进行清理
                else if (SkeletonAvatar.pool_avatar_count > SkeletonAvatar.checkThreshold) {
                    // console.log("超出阈值需要清理的!!!", [...release_data], SkeletonAvatar.pool_avatar_count, SkeletonAvatar.checkThreshold);
                    SkeletonAvatar.doReleaseSkele(release_data);
                } else {
                    break;
                }
            }
        }

        /**
         * 释放资源
         * 
         * @param release_data 
         */
        private static doReleaseSkele(release_data: releaseDataArr) {
            let key: string = release_data[releaseDataArrFields.idType];
            let skele_pool_data_Array: Array<skeleData> = SkeletonAvatar.skeleDataPools[key];
            let index: number = skele_pool_data_Array.indexOf(release_data[releaseDataArrFields.skeleData]);
            let sk_data: skeleData = skele_pool_data_Array.splice(index, 1)[0];
            let templetTableKey = sk_data[skeleDataFields.skele].name;
            // console.log("释放Skeleton资源:", fullName, " - 超出阈值:" + overflow, " - 全局检测:" + fullCheck);

            // 减少模板引用计数,如果合适则清理模板
            let templetData = SkeletonAvatar.templetTabs[templetTableKey];
            let totalUsed: number = 0;
            if (templetData) {
                templetData[templetDataFields.inPoolCount]--;
                totalUsed = templetData[templetDataFields.usedCount] + templetData[templetDataFields.inPoolCount];
                if (totalUsed == 0) {
                    templetData[templetDataFields.templet].destroy();
                    templetData[templetDataFields.templet] = null;
                    delete SkeletonAvatar.templetTabs[templetTableKey];
                    // console.log("清理模板:", fullName);
                } else if (totalUsed < 0) {
                    console.error(templetTableKey, ":计数错误! count:", totalUsed);
                }
            }

            sk_data[skeleDataFields.skele].destroy();
            sk_data[skeleDataFields.cfg] = null;
            sk_data = null;
            SkeletonAvatar.pool_avatar_count--;

            // 如果对象池没值且没有在使用中的 则删除对象中的字段
            if (skele_pool_data_Array.length == 0 && totalUsed == 0) {
                delete SkeletonAvatar.skeleDataPools[key];
            }
        }

        /**
         * 将所有展示面板(继承于base_view与base_dialog)中的骨骼放入对象池
         * 关闭面板或对话框时调用
         * 将关闭的面板的骨骼组件放入对象池 做优化用
         */
        public static clsoepPutAllShowSkeletonToPool(gid: number, desc: string = "面板关闭") {
            let key = "gid_" + gid;
            // 根据面板gid释放骨骼资源
            let skeleArr = SkeletonAvatar.viewSkelePools[key];
            if (!skeleArr) return;
            // 释放每个骨骼组件的骨骼动画到对象池
            for (let index = 0, len = skeleArr.length; index < len; index++) {
                const skeleAvatarImp = skeleArr[index];
                if (skeleAvatarImp) {
                    skeleAvatarImp.putAllSkeletonToPool();
                }
            }
        }

        /**
         * 面板销毁，移除引用
         * 
         * @param gid 系统记录的当前面板id
         */
        public static deleteViewKeyValue(gid: number) {
            let key = "gid_" + gid;
            SkeletonAvatar.clsoepPutAllShowSkeletonToPool(gid, "面板销毁")
            // 删除该键值对
            SkeletonAvatar.viewSkelePools[key] = null;
            delete SkeletonAvatar.viewSkelePools[key];
        }

        /**
         * 释放所有骨骼动画资源到对象池
         */
        public putAllSkeletonToPool() {
            for (const key in this.skeleTabs) {
                let skdata: skeleData = this.skeleTabs[key];
                // 放入对象池
                if (skdata) {
                    let id: number = skdata[skeleDataFields.id];
                    let type: string = skdata[skeleDataFields.type];
                    SkeletonAvatar.putPoolSkeleData(id + type, skdata, this.isChangeSkinModel(type as AvatarAniBigType));
                }
                this.skeleTabs[key] = null;
            }

            this.skeleTabs = {};
            this._skeleOffsets = {};
            this._skeleUseCfgScale = {};
            this._skeleZOrders = {};

            // 清理死亡动画状态和定时器
            clearTimeout(this._onDeathAnimationID);
            this._onDeathAnimation = false;

            Laya.timer.clearAll(this);
            this.celarTimeout();
        }

        /**
         * 销毁时销毁创建的节点信息（资源放入节点池）
         * 
         * @param destroyChild 销毁子节点
         */
        public destroy(destroyChild?: boolean): void {
            this.putAllSkeletonToPool();
            super.destroy(destroyChild);
        }

        /**
         * 清理定时回调
         * 
         * @param aniBigType 动画大类id =null清理所有,否则清理指定类型的
         */
        private celarTimeout(aniBigType: AvatarAniBigType = null) {
            for (const key in this._timeoutFunc) {
                if (aniBigType) {
                    if (aniBigType == key) {
                        this.doClearTimeout(key);
                    }
                } else {
                    this.doClearTimeout(key as AvatarAniBigType);
                }
            }
        }

        /**
         * 执行清理定时
         * 
         * @param aniBigType 动画大类id
         */
        private doClearTimeout(aniBigType: AvatarAniBigType) {
            let _tf = this._timeoutFunc[aniBigType];
            if (_tf) {
                clearTimeout(_tf);
                delete this._timeoutFunc[aniBigType];
            }
        }

        /**
         * 播放动画
         * 
         * @param aniType 大类
         * @param actionType 动画名
         * @param loop 是否循环播放
         * @param force 是否强制播放
         * @param callback 播放完动画的回调方法，回调不支持多重嵌套（否则会被覆盖）
         * @returns 
         */
        public playAnim(aniType: AvatarAniBigType, actionType: ActionType, loop: boolean = true, force: boolean = false, callback: Function = null, caller: any = null): number {
            let sData: skeleData = this.skeleTabs[aniType];

            // 骨骼正在创建则添加创建完成回调
            let isCreating = this.checkIsCreating(sData, aniType);
            if (isCreating) {
                this._creatingCallback[aniType] = () => {
                    this.playAnim(aniType, actionType, loop, force, callback);
                }
                return -1;
            }

            // 是否有正确的组件
            if (sData == null) {
                if (callback) !caller ? callback() : callback.call(caller)
                return -1;
            }

            let skele: Skeleton = sData[skeleDataFields.skele];
            if (skele == null) {
                if (callback) !caller ? callback() : callback.call(caller)
                return -1;
            }
            // 播放动画
            return this.checkAndPlayAnim(sData, actionType, aniType, loop, force, callback, caller);
        }

        /**
         * 播放指定动画后播放待机动画
         * 
         * @param aniType 动画大类
         * @param actionType 动画名
         */
        public playAnimThenDaiji(aniType: AvatarAniBigType, actionType: ActionType) {
            this.playAnim(aniType, actionType, false, true, () => {
                this.playAnim(aniType, ActionType.DAIJI, true, true);
            });
        }
        /**
         * 检测是否正在创建当前骨骼
         */
        private checkIsCreating(sData: skeleData, aniType: AvatarAniBigType): boolean {
            if (sData == null) {
                // 检查是否正在创建该骨骼
                for (let index = 0, len = this.resettingList.length; index < len; index++) {
                    const typeID = this.resettingList[index];
                    if (typeID.split("#")[0] == aniType) {
                        return true;
                    }
                }
            }
            return false;
        }

        // 是否正在播放死亡动画
        public get onDeathAnimation(): boolean {
            return this._onDeathAnimation;
        }

        // 当前正在播放的动画
        public get currentPlayAction(): ActionType {
            return this._currentPlayAction;
        }

        /**
         * 检测是否存在该动画，无报错有则播放
         * 
         * @param skData 骨骼数据
         * @param actionType 动画名字
         * @param aniBigType 大类
         * @param loop 是否循环
         * @param force 是否强制播放
         * @param callback 播放完动画的回调方法
         */
        private checkAndPlayAnim(skData: skeleData, actionType: ActionType, aniBigType: AvatarAniBigType, loop: boolean = true, force: boolean = false, callback: Function = null, caller: any = null): number {
            let id = skData[skeleDataFields.id];
            let skele = skData[skeleDataFields.skele];
            let skele_name = skData[skeleDataFields.cfg][ExteriorSKFields.name];
            let self = this;
            let defaultName: ActionType = ActionType.NONE;
            if (this._aniNameList[id] && this._aniNameList[id].length > 0) defaultName = <ActionType>this._aniNameList[id][0]

            // 对默认适配
            if (actionType == ActionType.Default) {
                actionType = defaultName
            }
            // 对第三方资源适配
            if (actionType == ActionType.DAIJI && this._aniNameList[id] && this._aniNameList[id].indexOf(actionType) == -1) {
                if (defaultName == ActionType.Animation)
                    actionType = defaultName
            }

            // 播放指定的动画
            if (this._aniNameList[id] && this._aniNameList[id].indexOf(actionType) != -1) {
                skele.play(actionType, loop, force);
                // 清理上次的播放该动画的回调
                if (this._timeoutFunc[aniBigType]) {
                    clearTimeout(this._timeoutFunc[aniBigType]);
                }
                // 记录当前播放的动画
                this._currentPlayAction = actionType;
                // 当前动画播放的时间
                let curTime = skele.player.playDuration;

                // 怪物死亡动画播放状态
                if (actionType == ActionType.SIWANG && this._skeleType == RoleType.Monster) {
                    this._onDeathAnimation = true;
                    this._onDeathAnimationID = setTimeout(() => {
                        this._onDeathAnimation = false;
                    }, curTime || 0);
                }

                // 执行回调，清理当前播放的动画
                let tmpFunc = function () {
                    // 重置当前播放的动画的状态，如果是重复播放则不重置
                    if (!loop) {
                        self._currentPlayAction = ActionType.NONE;
                    }

                    callback();
                }

                // 动画播放完成的回调
                if (callback) {
                    let id = setTimeout(tmpFunc.bind(caller || this), curTime || 0);

                    // 记录动画延时回调id
                    this._timeoutFunc[aniBigType] = id;
                }
                return curTime || 0;
            }
            // 播放时没有指定的动画则再处理
            else {
                console.error(`${skele_name} - (${id}-${aniBigType}-"角色类型：${this._skeleType}"),没有["${actionType}"]动画`, "拥有的动画:", this._aniNameList[id]);
                if (callback) callback();
                return 0;
            }
        }

        /**
         * 死亡清理所有播放动画的回调
         */
        public deadClearAllPlayAnimTimeout(): void {
            this.celarTimeout();
        }

        /**
         * 创建骨骼动画 (参数为-1或0 则不创建对应位置的骨骼动画)  
         * 
         * @param clothes 衣服/怪物
         * @param weapon 幻武(手上拿的)
         * @param wing 翅膀wing
         * @param immortals 精灵immortals
         * @param aura 法阵aura
         * @param tianZhu 神兽 tianZhu 鬼神之力
         * @param other 其他骨骼  位置层级[默认为最低层]可以自定义
         */
        public reset(clothes: number = 0, weapon: number = 0, wing: number = 0, immortals: number = 0, aura: number = 0, tianZhu: number = 0, guangHuan: number = 0, other: number = 0) {
            this.clothes = clothes;
            this.weapon = weapon;
            this.wing = wing;
            this.immortals = immortals;
            this.aura = aura;
            this.tianZhu = tianZhu;
            this.other = other;
            // 衣服（模型）
            this.judgeCreateSkele(clothes, AvatarAniBigType.clothes);
            // 幻武 - 翅膀 - 有衣服的时候，幻武，翅膀...是和衣服在同一个骨骼资源，使用换肤功能实现幻武切换
            //      - 没有衣服的时候才单独加载幻武，翅膀...的骨骼资源
            if (this.clothes <= 0) {
                this.judgeCreateSkele(weapon, AvatarAniBigType.weapon);
            }
            // 翅膀 
            if (this.clothes <= 0) {
                this.judgeCreateSkele(wing, AvatarAniBigType.wing);
            }
            // 精灵
            this.judgeCreateSkele(immortals, AvatarAniBigType.immortals);
            // 阵法 
            this.judgeCreateSkele(aura, AvatarAniBigType.aura);
            // 神兽 -（鬼神之力）分为身前身后
            this.judgeCreateSkele(tianZhu, AvatarAniBigType.tianZhuFront);
            this.judgeCreateSkele(tianZhu, AvatarAniBigType.tianZhuBack);
            // 其他骨骼  位置层级可以自定义
            this.judgeCreateSkele(other, AvatarAniBigType.other);
        }

        /**
         * 根据大类设置是否使用(强制)配置表的缩放和偏移
         * 外部配置的缩放 > 本配置
         * 
         * @param aniBigType 大类
         * @param useCfgScale 使用配置表缩放（无论场景还是UI都会使用配置表）
         * @param useCfgOffset 使用配置表偏移（无论场景还是UI都会使用配置表）
         * @returns 
         */
        public setUseCfgScaleAndOffset(aniBigType: AvatarAniBigType, useCfgScale: boolean = true, useCfgOffset: boolean = true) {
            let status: useCfgScaleAndOffset = this.getUseCfgScaleAndOffsetStatus(aniBigType);
            status[useCfgScaleAndOffsetFields.useCfgScale] = useCfgScale;
            status[useCfgScaleAndOffsetFields.useCfgOffset] = useCfgOffset;

            // 立即处理缩放和偏移
            let skdata: skeleData = this.skeleTabs[aniBigType];
            if (skdata && skdata[skeleDataFields.skele]) {
                this.doHandleOffsetAndScale(skdata[skeleDataFields.skele], skdata[skeleDataFields.cfg], aniBigType);
            }
        }

        /**
         * 获取使用配置表的偏移和缩放的状态
         * 
         * @param aniBigType 大类
         * @returns 
         */
        private getUseCfgScaleAndOffsetStatus(aniBigType: AvatarAniBigType): useCfgScaleAndOffset {
            let cfg: useCfgScaleAndOffset = this._skeleUseCfgScale[aniBigType];
            if (!cfg) {
                let defaultScaleCfg: boolean = this._createComponentByScene;
                let defaultOffsetCfg: boolean = !this._createComponentByScene;
                cfg = this._skeleUseCfgScale[aniBigType] = [defaultScaleCfg, defaultOffsetCfg];
            }

            return cfg;
        }

        /**
         * 根据大类设置动画位置的偏移
         * 
         * @param aniBigType 大类
         * @param zOrder 层级值 1-100
         * @returns 
         */
        public resetZOrder(aniBigType: AvatarAniBigType, zOrder: number) {
            const skdata: skeleData = this.skeleTabs[aniBigType];

            this._skeleZOrders[aniBigType] = zOrder;

            if (skdata && skdata[skeleDataFields.skele]) {
                skdata[skeleDataFields.skele].zOrder = zOrder;
            }
        }

        /**
         * 根据大类设置动画位置的偏移
         * 
         * @param aniBigType 大类
         * @param offsetY y偏移量 =
         * @param offsetX x偏移量 =
         * @returns 
         */
        public resetOffset(aniBigType: AvatarAniBigType, offsetX: number | null = null, offsetY: number | null = null) {
            const skdata: skeleData = this.skeleTabs[aniBigType];

            this._skeleOffsets[aniBigType] = [offsetX || 0, offsetY || 0];

            if (skdata == null || skdata[skeleDataFields.skele] == null) return;

            if (offsetX != null) {
                skdata[skeleDataFields.skele].x = offsetX;
            }

            if (offsetY != null) {
                skdata[skeleDataFields.skele].y = -offsetY;
            }
        }

        /**
         * 根据大类设置动画的缩放
         * 
         * @param aniBigType 大类
         * @param scale 缩放值 =
         * @returns 
         */
        public resetScale(aniBigType: AvatarAniBigType, scale: number) {
            const skdata: skeleData = this.skeleTabs[aniBigType];

            // 设置缩放时骨骼未加载完成处理
            let isCreating: boolean = this.checkIsCreating(skdata, aniBigType);
            if (isCreating) {
                this._exteralScale[aniBigType] = scale;
                return;
            }

            if (skdata == null) return;

            let skele = skdata[skeleDataFields.skele];

            skele.scale(scale, scale, true);
        }

        /**
         * 根据大类设置动画的缩放
         * 
         * @param aniBigType 大类
         * @param rate 速率 =
         * @returns 
         */
        public resetPlaybackRate(aniBigType: AvatarAniBigType, rate: number) {
            const skdata: skeleData = this.skeleTabs[aniBigType];

            // 设置缩放时骨骼未加载完成处理
            let isCreating: boolean = this.checkIsCreating(skdata, aniBigType);
            if (isCreating) {
                this._exteralPlaybackRate[aniBigType] = rate;
                return;
            }
            if (skdata == null) return;
            let skele = skdata[skeleDataFields.skele];
            skele.playbackRate(rate);
        }

        /**
         * 清理当前骨骼组件【指定骨骼动画】重置时设置的缩放和位移参数参数
         * 
         * @param cspe 清理1缩放、2偏移、3当前动画所有的
         * @param aniBigType 
         */
        public clearResetParams(cspe: ClearSkeletonParamsEnum, aniBigType: AvatarAniBigType,) {
            switch (cspe) {
                case ClearSkeletonParamsEnum.Scale:
                    this._exteralScale[aniBigType] = null;
                    break;
                case ClearSkeletonParamsEnum.Offest:
                    this._skeleOffsets[aniBigType] = null;
                    break;
                case ClearSkeletonParamsEnum.PlaybackRate:
                    this._exteralPlaybackRate[aniBigType] = 1;
                    break;
                case ClearSkeletonParamsEnum.All:
                    this._exteralScale[aniBigType] = null;
                    this._skeleOffsets[aniBigType] = null;
                    break;
            }
        }

        /**
         * 清理当前骨骼组件下【所有骨骼】重置时设置的所以的缩放和位移参数参数
         * 
         * @param cspe 清理1缩放、2偏移、3当前动画所有的
         */
        public clearAllResetParams(cspe: ClearSkeletonParamsEnum) {
            switch (cspe) {
                case ClearSkeletonParamsEnum.Scale:
                    if (this._exteralScale) {
                        for (const key in this._exteralScale) this._exteralScale[key] = null;
                    }
                    break;
                case ClearSkeletonParamsEnum.Offest:
                    if (this._skeleOffsets) {
                        for (const key in this._skeleOffsets) this._skeleOffsets[key] = null;
                    }
                    break;
                case ClearSkeletonParamsEnum.All:
                    if (this._exteralScale) {
                        for (const key in this._exteralScale) this._exteralScale[key] = null;
                    }
                    if (this._skeleOffsets) {
                        for (const key in this._skeleOffsets) this._skeleOffsets[key] = null;
                    }
                    break;
            }
        }

        /**
         * 判断是否创建骨骼还是只播放动画
         * 
         * @param id 唯一id
         * @param aniBigType 大类
         * @returns 
         */
        private judgeCreateSkele(id: number, aniBigType: AvatarAniBigType) {
            // 清理当前骨骼类型的定时动画(动画回调)
            this.celarTimeout(aniBigType);
            // 清理创建完成播放动画的回调
            if (this._creatingCallback[aniBigType]) {
                delete this._creatingCallback[aniBigType];
            }
            // id为 <=0 不创建,且如果之前有则回收到资源池
            if (id <= 0) {
                let skdata: skeleData = this.skeleTabs[aniBigType];
                // 放入对象池
                if (skdata) {
                    let id: number = skdata[skeleDataFields.id];
                    let type: string = skdata[skeleDataFields.type];
                    SkeletonAvatar.putPoolSkeleData(id + type, skdata, this.isChangeSkinModel(type as AvatarAniBigType));
                    this.skeleTabs[aniBigType] = null;
                    this._skeleOffsets[aniBigType] = null;
                    this._exteralScale[aniBigType] = null;
                    this._skeleZOrders[aniBigType] = null;
                }
                return;
            }

            let skele_data: skeleData = this.skeleTabs[aniBigType];

            // 判断是否需要创建
            if (skele_data) {
                // 与上一次创建的不同才创建新的，然后释放当前对象到对象池
                if (skele_data && skele_data[skeleDataFields.id] != id) {
                    this.doCreateSkele(id, aniBigType, true);
                } else {
                    let skele: Skeleton = skele_data[skeleDataFields.skele];
                    let cfg: ExteriorSK = skele_data[skeleDataFields.cfg];
                    // 与上次创建的相同,只处理偏移与缩放!!!
                    this.doHandleOffsetAndScale(skele, cfg, aniBigType);
                    // 如果有幻武则切换幻武对应的衣服图标
                    this.clothPartOfTheChange(skele, aniBigType);
                }
            }
            // 没创建过，直接创建
            else {
                this.doCreateSkele(id, aniBigType, false);
            }
        }

        /**
         * 执行创建
         * 
         * @param id 骨骼资源唯一id
         * @param aniBigType 要创建的动画类型AavatarAniBigType
         * @param free 是否释放上一个同类（AavatarAniBigType）骨骼资源到对象池
         * @returns 
         */
        private doCreateSkele(id: number, aniBigType: AvatarAniBigType, free: boolean) {
            // 释放之前引用的对象,将其归还对象池
            if (free) {
                let skdata: skeleData = this.skeleTabs[aniBigType];
                // 放入对象池
                if (skdata) {
                    let old_id = skdata[skeleDataFields.id];
                    SkeletonAvatar.putPoolSkeleData(old_id + aniBigType, skdata, this.isChangeSkinModel(aniBigType));
                }
                this.skeleTabs[aniBigType] = null;
            }

            // 鬼神之力后层背景添加 +=900
            if (AvatarAniBigType.tianZhuBack == aniBigType) {
                id += 900;
            }

            // 对象池获取当前指定的空闲的数据
            let poolSKeleData: skeleData = SkeletonAvatar.getPoolSkeleData(id + aniBigType);

            // 直接复用对象池的对象数据
            if (poolSKeleData != null) {
                this.reUseComplete(aniBigType, poolSKeleData);
            }
            // 对象池没有多余的该骨骼资源，需要新创建
            else {
                if (this.resettingList.indexOf(aniBigType + "#" + id) != -1) {
                    // console.log(`同一节点:跳过正在创建同id的骨骼动画:${id}`);
                    return;
                }
                // console.log("正在创建列表：", [...this.resettingList]);
                this._latestUseSkeletonIDTab[aniBigType] = id;
                // console.log("创建骨骼资源", id, aniBigType, free);
                let skincfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(id);
                if (!skincfg) {
                    console.error(`配置表 “exterior_sk.xlsx” 找不到对应的骨骼动画配置信息!!! Unique-id: “${id}”, AvatarAniBigType: “${aniBigType}”`);
                    return;
                }
                let skinName: string = skincfg[ExteriorSKFields.path];

                if (skinName == undefined || skinName == "" || skinName == null) {
                    console.error(`外观配置文件路径错误 Unique-id:${id}-${aniBigType}, ${skinName}`);
                    return;
                }

                // 旧的3d资源不用加载 - 暂定
                if (skinName.endsWith(".j")) {
                    console.log("旧的3d资源不用加载! path:", skinName);
                    return;
                }

                // 正在创建的骨骼的id
                this.resettingList.push(aniBigType + "#" + id);

                let fullName = `${SkeletonAvatar.skeletonRootPath}/${skinName}`;
                let templetTableKey: string = this.getTempletTableKey(id, aniBigType, fullName);

                if (!SkeletonAvatar.needCreatedQueue[fullName]) {
                    SkeletonAvatar.needCreatedQueue[fullName] = [];
                }

                // 同一个资源共用一个模板
                let factory: Templet;
                let tempTempletData: templetData = SkeletonAvatar.templetTabs[templetTableKey];

                if (tempTempletData) {
                    factory = tempTempletData[templetDataFields.templet];
                    tempTempletData[templetDataFields.usedCount]++;
                    if (tempTempletData[templetDataFields.loaded]) {
                        this.parseComplete(factory, fullName, aniBigType, skincfg, id);
                    } else {
                        SkeletonAvatar.needCreatedQueue[fullName].push([this, factory, fullName, aniBigType, skincfg, id]);
                    }
                    return;
                } else {
                    factory = new Templet();
                    SkeletonAvatar.templetTabs[templetTableKey] = [factory, false, 1, 0];
                    SkeletonAvatar.needCreatedQueue[fullName].push([this, factory, fullName, aniBigType, skincfg, id]);
                }



                factory.on(Event.COMPLETE, this, this.parseCompleteOriginal, [fullName]);
                factory.on(Event.ERROR, this, this.onError, [id, fullName, factory, aniBigType]);
                factory.loadAni(fullName);
            }
        }

        /**
         * 创建骨骼动画错误提示，尝试重新加载
         * 
         * @param id 骨骼资源唯一id
         * @param fullName 完整名字
         * @param factory 创建骨骼的模板
         * @returns 
         */
        private onError(id: number, fullName: string, factory: Templet, aniBigType: AvatarAniBigType): void {
            // 移除正在创建的骨骼的状态
            this.removeResettingData(aniBigType, id);

            if (!this._errResetTable[aniBigType]) this._errResetTable[aniBigType] = 0;
            this._errResetTable[aniBigType]++;

            // 错误提示(一定次数的尝试再次加载)
            if (this._errResetTable[aniBigType] >= 6) {
                console.error(this.ownerName + " 骨骼动画加载错误!!! id:" + id + " 再次加载尝试次数:" + this._errResetTable[aniBigType]);
                this._errResetTable[aniBigType] = 0;
                return;
            }
            factory.loadAni(fullName);
        }

        // 保存骨骼数据
        private recordSkeletonData(skele: Skeleton, aniBigType: AvatarAniBigType, id: number, skincfg: ExteriorSK, factory: Templet, create_type: string = null): void {
            if (!this.skeleTabs) this.skeleTabs = {};
            if (!this.skeleTabs[aniBigType]) {
                this.skeleTabs[aniBigType] = [0, null, null, null, null, -1, null];
            }
            this.skeleTabs[aniBigType][skeleDataFields.id] = id;
            this.skeleTabs[aniBigType][skeleDataFields.cfg] = skincfg;
            this.skeleTabs[aniBigType][skeleDataFields.templet] = factory;
            this.skeleTabs[aniBigType][skeleDataFields.skele] = skele;
            this.skeleTabs[aniBigType][skeleDataFields.type] = aniBigType;
            this.skeleTabs[aniBigType][skeleDataFields.lastUseTime] = GlobalData.serverTime;
            if (create_type != null) {
                this.skeleTabs[aniBigType][skeleDataFields.buildArmature] = create_type;
            }
        }

        // 移除正在创建的骨骼的状态
        private removeResettingData(aniBigType: AvatarAniBigType, id: number): void {
            let curIndex = this.resettingList.indexOf(aniBigType + "#" + id);
            if (curIndex != -1) {
                this.resettingList.splice(curIndex, 1);
            }
        }

        /**
         * 根据配置表和外部设置骨骼缩放和位移
         * 
         * @param skele 需要设置的骨骼资源
         * @param skincfg 配置表
         * @param aniBigType 动画骨骼动画大类
         */
        private doHandleOffsetAndScale(skele: Skeleton, skincfg: ExteriorSK, aniBigType: AvatarAniBigType): void {
            // 拿到配置表中的数据 位置偏移量 缩放
            let offset_x: number = skincfg[ExteriorSKFields.deviationX];
            let offset_y: number = skincfg[ExteriorSKFields.deviationY];
            let scale: number = skincfg[ExteriorSKFields.scale];
            let useCfgStatus: useCfgScaleAndOffset = this.getUseCfgScaleAndOffsetStatus(aniBigType);

            // 1.设置偏移量 （配置表中的偏移只有在UI面包中生效）
            //       如果有外部设置的偏移则以外部为,主配置表为辅
            //       否则使用配置表的偏移
            let offsetParams: offsetPoint = this._skeleOffsets && this._skeleOffsets[aniBigType];
            if (offsetParams) {
                skele.x = offsetParams[offsetPointFields.offsetX];
                skele.y = -offsetParams[offsetPointFields.offsetY];
            }
            // 配置表中的偏移只有在UI界面(或强制设置使用)才生效
            else if (useCfgStatus[useCfgScaleAndOffsetFields.useCfgOffset]) {
                skele.x = offset_x;
                skele.y = -offset_y;
            }

            // 2.设置缩放  (缩放只有在场景中才生效,UI面板中的缩放需要每个使用到的时候UI单独配置)
            //      如果有外部设置【UI和场景都可配置】的缩放则以外部为主配置表为辅
            //      否则配置表(只对场景中的生效)缩放为主
            let exterScale: number = this._exteralScale[aniBigType];
            if (exterScale != null) {
                skele.scaleX = exterScale;
                skele.scaleY = exterScale;
            }
            // 配置表中的缩放只有在场景界面(或强制设置使用)才生效
            else if (useCfgStatus[useCfgScaleAndOffsetFields.useCfgScale]) {
                skele.scaleX = scale;
                skele.scaleY = scale;
            }

            if (scale == 0) console.log("模型缩放为0???", skele.name);
        }

        // 记录数据-释放骨骼对象池资源
        private completeHanlderOp(reuse: boolean, aniBigType: AvatarAniBigType, id: number, skele: Skeleton): void {
            // 记录数据
            if (reuse) {
                SkeletonAvatar.reuse_avatar_count++;
            }

            // 移除正在创建的骨骼的状态
            this.removeResettingData(aniBigType, id);

            this._aniNameList[id] = [];
            let aniCount: number = skele.getAnimNum();
            // 获取该骨骼拥有的动画的名字
            for (let index = 0; index < aniCount; index++) {
                const aniName = skele.getAniNameByIndex(index);
                this._aniNameList[id].push(aniName);
            }
        }

        // 设置精灵alpha
        private setShiShenAlpha(skele: Skeleton, aniBigType: AvatarAniBigType): void {
            // 场景中的精灵为半透明的
            if (this._createComponentByScene && aniBigType == AvatarAniBigType.immortals) {
                skele.alpha = 0.8;
            } else {
                skele.alpha = 1;
            }
        }

        // 角色时装上的部分换装(暂时这样写，后期幻武配套完成)
        private clothPartOfTheChange(skele: Skeleton, aniBigType: AvatarAniBigType): void {
            if (!this.isChangeSkinModel(aniBigType) || this._notChangeSkin) return;
            if (this.clothes <= 0) return;

            // 切换幻武 空武器id是5000
            if (this.weapon <= 0) this.weapon = 5000;
            clothSoltParams.weapon.solt.forEach((solt: string) => {
                let originalName = clothSoltParams.weapon.default;
                let curuentName = this.weapon.toString();
                // console.log(`时装替换幻武[${solt}]: ${originalName} => ${curuentName}`);
                skele.replaceSlotSkinName(solt, originalName, curuentName);
            });

            // 切换翅膀 空翅膀id是3000
            if (this.wing <= 0) this.wing = 3000;
            clothSoltParams.wing.solt.forEach((solt: string, index: number) => {
                let originalName = clothSoltParams.wing.default + clothSoltParams.wing.exteral[index];
                let curuentName = this.wing + clothSoltParams.wing.exteral[index];
                // console.log(`时装替换翅膀[${solt}]: ${originalName} => ${curuentName}`);
                skele.replaceSlotSkinName(solt, originalName, curuentName);
            });
        }


        /**
         * 解析或复用完成回调（赋值操作）
         * 
         * @param reuse 是否为复用的对象池的骨骼资源 
         * @param skele 骨骼资源
         * @param aniBigType 资源大类
         * @param id 唯一id
         * @param skincfg 配置表当前骨骼配置信息
         * @param factory 模板
         * @param skele_name 名字
         */
        private completeHandler(reuse: boolean, skele: Skeleton, aniBigType: AvatarAniBigType, id: number, skincfg: ExteriorSK, factory: Templet, skele_name: string = null, create_type: string = null) {
            // 当前组件记录当前大类的骨骼数据
            this.recordSkeletonData(skele, aniBigType, id, skincfg, factory, create_type);

            skele.name = skele_name;
            skele.visible = true;

            // 设置精灵alpha
            this.setShiShenAlpha(skele, aniBigType);

            // 时装部分换装
            this.clothPartOfTheChange(skele, aniBigType);

            // 添加父节点
            this.addChild(skele);

            // 设置位移和缩放
            this.doHandleOffsetAndScale(skele, skincfg, aniBigType);

            // 设置骨骼的相对渲染层级
            this.setZOrder(aniBigType, skele);

            // 创建/加载完成需要处理
            this.completeHanlderOp(reuse, aniBigType, id, skele);

            // 重置错加载错误次数
            this._errResetTable[aniBigType] = 0;

            // 播放动画 :创建时播放动画，需手动调用播放
            if (this._creatingCallback[aniBigType]) {
                this._creatingCallback[aniBigType]();
                delete this._creatingCallback[aniBigType];
            }
            // 播放默认动画
            else if (!this.notPlayDefaultAnim) {
                // skele.play(0, false, true);
                this.checkAndPlayAnim(this.skeleTabs[aniBigType], this.defaultPlayAnim, aniBigType, true, true);
            }

            // 加载完成回调
            if (this.loadCompleteHandler) {
                this.loadCompleteHandler();
            }
        }

        /**
         * 该类型的骨骼资源是否为换装模式
         * 
         * @param aniBigType 骨骼资源类型
         * @returns 换装-true 非换装-false
         */
        private isChangeSkinModel(aniBigType: AvatarAniBigType): boolean {
            return aniBigType == AvatarAniBigType.clothes && (this._skeleType == RoleType.Master || this._skeleType == RoleType.Player || this._isCreateShow)
        }

        /**
         * 直接禁用换装模式，特殊衣服面板[翅膀,精灵,宠物...]使用
         * 
         * @param val 值
         */
        public set notChangeSkinModel(val: boolean) {
            this._notChangeSkin = val;
        }

        /**
         * 遍历创建队列，开始创建资源
         * 
         * @param fullName 资源名
         */
        private parseCompleteOriginal(fullName: string) {
            SkeletonAvatar.needCreatedQueue[fullName].forEach((arr: any[]) => {
                arr[0].parseComplete(arr[1], arr[2], arr[3], arr[4], arr[5]);
            });
            // 清理队列
            SkeletonAvatar.needCreatedQueue[fullName] = [];
        }

        /**
         * 获取模板对象的key值(方便调试)
         * 模板key只考虑资源地址 只要一样都公用一个模板
         * 
         * @param id 模型id
         * @param type 类型
         * @param fullPath 资源路径全名
         * @returns 
         */
        private getTempletTableKey(id: number, type: string, fullPath: string) {
            return `$skleton path - ${fullPath}`;
        }

        /**
         * 创建骨骼动画，解析完成回调
         * 
         * @param factory 模板
         * @param fullName 名字
         * @param aniBigType 大类
         * @param skincfg 配置表当前骨骼配置
         * @param id 唯一id
         */
        private parseComplete(factory: Templet, fullName: string, aniBigType: AvatarAniBigType, skincfg: ExteriorSK, id: number): void {
            SkeletonAvatar.templetTabs[this.getTempletTableKey(id, aniBigType, fullName)][templetDataFields.loaded] = true;

            let cur_creating_id = this._latestUseSkeletonIDTab[aniBigType];
            // 移除正在创建的骨骼的状态
            if ((cur_creating_id && cur_creating_id != id) || cur_creating_id == undefined) {
                this.removeResettingData(aniBigType, id);
                return;
            } else {
                delete this._latestUseSkeletonIDTab[aniBigType];
            }

            // 角色的衣服需要启用换装模式(1,2)创建，其他都是用非换装模式(0)
            // 2为官方最不推荐的方式
            let skele: Skeleton;
            let create_type = "buildArmature:";

            if (this.isChangeSkinModel(aniBigType)) {
                skele = factory.buildArmature(1);
                create_type += 1;
            } else {
                skele = factory.buildArmature(0);
                create_type += 0;
            }

            let name = this.getTempletTableKey(id, aniBigType, fullName);
            this.completeHandler(false, skele, aniBigType, id, skincfg, factory, name, create_type);
        }

        /**
         * 对象池复用骨骼
         * 
         * @param aniBigType 大类
         * @param skele_data 当前大类的骨骼数据（id,skeleton,templet...）
         */
        private reUseComplete(aniBigType: AvatarAniBigType, skele_data: skeleData): void {
            let skele: Skeleton = skele_data[skeleDataFields.skele];
            let skincfg = skele_data[skeleDataFields.cfg];
            let id = skele_data[skeleDataFields.id];
            let factory = skele_data[skeleDataFields.templet];

            this._latestUseSkeletonIDTab[aniBigType] = id;

            this.completeHandler(true, skele, aniBigType, id, skincfg, factory, skele.name);
        }

        /**
         * 设置骨骼的相对渲染层级
         * 只有一个骨骼组件同时加载多个不同大类的资源时生效
         * 
         * @param aniBigType 大类
         * @param skele 骨骼资源
         */
        private setZOrder(aniBigType: AvatarAniBigType, skele: Skeleton) {
            // 自定义的层级设置
            let customZOrder: number = this._skeleZOrders[aniBigType];
            if (customZOrder) {
                this.resetZOrder(aniBigType, customZOrder);
                return;
            }

            // 默认的层级
            switch (aniBigType) {
                case AvatarAniBigType.other: skele.zOrder = 10; break;
                case AvatarAniBigType.tianZhuBack: skele.zOrder = 40; break;
                case AvatarAniBigType.immortals: skele.zOrder = 45; break;
                case AvatarAniBigType.clothes: skele.zOrder = 50; break;
                case AvatarAniBigType.weapon: skele.zOrder = 55; break;
                case AvatarAniBigType.tianZhuFront: skele.zOrder = 60; break;
                case AvatarAniBigType.tianZhu: skele.zOrder = 70; break;
                case AvatarAniBigType.aura: skele.zOrder = 75; break;
                case AvatarAniBigType.wing: skele.zOrder = 80; break;
                case AvatarAniBigType.effect: skele.zOrder = 90; break;
            }
        }
    }
}