///<reference path="../../modules/config/exterior_sk_cfg.ts"/>

/**
 * 2D龙骨特效组件
 * author:杉木说
 */
namespace modules.common {
    import Skeleton = Laya.Skeleton;
    import Templet = Laya.Templet;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import Event = Laya.Event;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSK = Configuration.ExteriorSK;


    const enum labelEventFields {
        label = 0,
        caller = 1,
        callback = 2,
    }
    type labelEvent = [string, Object, Function];

    export class SkeletonEffect extends Laya.Image {
        private skeleTabs: Table<skeleData>;
        private labelEventTab: labelEvent;
        public ownerName: string;
        /** 技能id */
        public skillid: number;
        /** 技能特效是属于谁的 */
        public ownerid: number;

        /* 龙骨资源的id保存，加载错误的时候尝试重载使用 */
        private effect: number;

        // 属性，外部可设置和获取值
        private _errResetCount: number = 0;
        private _timeoutId: number = 0;
        private _hadRecycled: boolean = false;

        public static reuse_avatar_count: number = 0;
        public static real_avatar_count: number = 0;
        public static templetTabs: Table<any> = {};
        // 需要创建龙骨资源的队列
        private static needCreatedQueue: Table<any> = {};
        public static readonly skeletonRootPath = "res/skeleton";

        // 龙骨对象池
        public static skeleDataPools: Table<Array<skeleData>> = {};

        /**
         * 创建特效龙骨组件
         * 
         * @param ownerName 创建者的名字
         * @returns 创建好的龙骨对象
         */
        public static create(ownerName: string = null): SkeletonEffect {
            return new SkeletonEffect(ownerName);
        }

        /**
         * 构造器生成龙骨动画
         * 
         * @param ownerName 创建的名字
         */
        constructor(ownerName: string) {
            super();
            this.ownerName = ownerName;
            this.skeleTabs = {};
            this.alpha = 1;
            this.centerX = 0;
            this.centerY = 0;
            this.width = 1;
            this.height = 1;
            this.mouseEnabled = false;
            // console.log(ownerName, "创建龙骨特效动画!!!", SkeletonEffect.reuse_avatar_count, this.x, this.y);
        }

        /**
         * 角色整体方向 -1为镜像（左边） 1为正向（右边）
         */
        public set direction(vdir: -1 | 1) {
            this.scaleX = vdir;
        }

        /**
         * 获取对象池中的龙骨数据
         * 
         * @param idType id+大类
         * @returns 
         */
        private static getPoolSkeleData(idType: string): skeleData {

            let idTypeDatas: Array<skeleData> = SkeletonEffect.skeleDataPools[idType];
            if (!idTypeDatas) {
                return null;
            }

            let skele_data: skeleData = idTypeDatas.pop();
            if (!skele_data) {
                return null;
            }

            // console.log("取出对象！", idType, skele_data);
            return skele_data;
        }

        /**
         * 放入龙骨数据到对象池中
         * 
         * @param idType id+大类
         * @param skele_data 龙骨数据 
         */
        private static putPoolSkeleData(idType: string, skele_data: skeleData) {
            if (!skele_data) return;

            // 停止播放动画，隐藏节点
            Laya.stage.addChild(skele_data[skeleDataFields.skele]);
            skele_data[skeleDataFields.skele].stop();
            skele_data[skeleDataFields.skele].offAll();
            skele_data[skeleDataFields.skele].visible = false;

            if (!SkeletonEffect.skeleDataPools[idType]) {
                SkeletonEffect.skeleDataPools[idType] = new Array<skeleData>();
            }
            SkeletonEffect.skeleDataPools[idType].push(skele_data);

            // console.log("放特效入对象池！", idType, skele_data);
        }


        /**
         * 释放所有龙骨动画资源到对象池
         */
        public putAllSkeletonToPool() {
            for (const key in this.skeleTabs) {
                const skdata: skeleData = this.skeleTabs[key];
                // 放入对象池
                if (skdata) {
                    let id: number = skdata[skeleDataFields.id];
                    let type: string = skdata[skeleDataFields.type];
                    SkeletonEffect.putPoolSkeleData(id + type, skdata);
                }
                this.skeleTabs[key] = null;
            }

            this.skeleTabs = {};
            clearTimeout(this._timeoutId);
            // 未回收资源，执行回收操作
            if (!this._hadRecycled) {
                this.recycleToPoolCB();
            }
            // Laya.timer.clear(this, this.dieFadeOut);
            Laya.timer.clearAll(this);
        }

        /**
         * 销毁时销毁创建的节点信息（资源放入节点池）
         * 
         * @param destroyChild 销毁子节点
         */
        public destroy(destroyChild?: boolean): void {
            this.putAllSkeletonToPool();
            this.labelEventTab = null;
            super.destroy(destroyChild);
        }

        /**
         * 检测是否存在该动画，无报错有则播放
         * 
         * @param skData 龙骨数据
         * @param actionType 动画名字
         * @param loop 是否循环
         * @param force 是否强制播放
         */
        private checkAndPlayAnim(skData: skeleData, actionType: ActionType, loop: boolean = true, force: boolean = false) {
            let skele = skData[skeleDataFields.skele];
            // 特效默认只有一个动画名
            skele.play(0, loop, force);
            this._hadRecycled = false;
            // 通知放回资源池
            let curTime = skele.player.playDuration;
            this._timeoutId = setTimeout(this.recycleToPoolCB.bind(this), curTime || 0);
        }

        /**
         * 通知回收到节点的对象池
         */
        private recycleToPoolCB() {
            this._hadRecycled = true;
            this.labelEventTab = null;
            GlobalData.dispatcher.event(CommonEventType.SKILL_EFFECT_RECYCLE, this);
        }

        /**
         * 创建龙骨动画 (参数为-1或0 则不创建对应位置的龙骨动画)  
         * 
         * @param effect effect技能特效id
         */
        public resetAndPlay(effect: number = 0) {
            this.effect = effect;
            // 技能特效
            this.judgeCreateSkele(effect, AvatarAniBigType.effect);
        }

        /**
         * label事件监听
         * 
         * @param label 事件名
         * @param callback 回调
         * @param caller 调用对象
         */
        public labelOn(label: string, callback: Function, caller: Object = null): void {
            let skele_data: skeleData = this.skeleTabs[AvatarAniBigType.effect];
            if (!skele_data) {
                this.labelEventTab = [label, caller, callback];
                return;
            }
            let skele: Skeleton = this.skeleTabs[AvatarAniBigType.effect][skeleDataFields.skele];
            if (!skele) {
                this.labelEventTab = [label, caller, callback];
                return;
            }
            // 以防万一  清理一波
            skele.offAll();
            skele.once(label, caller || this, callback);
        }

        /**
         * 判断是否创建龙骨还是只播放动画
         * 
         * @param id 唯一id
         * @param aniBigType 大类
         * @returns 
         */
        private judgeCreateSkele(id: number, aniBigType: AvatarAniBigType) {
            // id为-1或0不创建,且如果之前有则回收到资源池
            if (id == 0 || id == -1) {
                const skdata: skeleData = this.skeleTabs[aniBigType];
                // 放入对象池
                if (skdata) {

                    let old_id: number = skdata[skeleDataFields.id];
                    let type: string = skdata[skeleDataFields.type];
                    console.log("effect 回收：：：：" + old_id);
                    SkeletonEffect.putPoolSkeleData(old_id + type, skdata);
                    this.skeleTabs[aniBigType] = null;
                }
                return;
            }

            let skele_data: skeleData = this.skeleTabs[aniBigType];
            // 已经创建过 需要判断
            if (skele_data) {
                // 与上一次创建的不同才创建新的，然后释放当前对象到对象池
                if (skele_data && skele_data[skeleDataFields.id] != id) {
                    this.doCreateSkele(id, aniBigType, true);
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
         * @param id 龙骨资源唯一id
         * @param aniBigType 要创建的动画类型AavatarAniBigType
         * @param free 是否释放上一个同类（AavatarAniBigType）龙骨资源到对象池
         * @returns 
         */
        private doCreateSkele(id: number, aniBigType: AvatarAniBigType, free: boolean) {
            // 释放之前引用的对象,将其归还对象池
            if (free) {
                let skdata: skeleData = this.skeleTabs[aniBigType];
                // 放入对象池
                if (skdata) {
                    let old_id = skdata[skeleDataFields.id];
                    SkeletonEffect.putPoolSkeleData(old_id + aniBigType, skdata);
                }
                this.skeleTabs[aniBigType] = null;
            }
            // 对象池获取当前指定的空闲的数据
            let poolSKeleData: skeleData = SkeletonEffect.getPoolSkeleData(id + aniBigType);
            // 直接复用对象池的对象数据
            if (poolSKeleData != null) {
                this.reUseComplete(aniBigType, poolSKeleData);
            }
            // 对象池没有多余的该对象，需要新创建
            else {
                let skincfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(id);
                if (!skincfg) {
                    console.error(`配置表 “exterior_sk.xlsx” 找不到对应的龙骨动画配置信息!!! Unique-id: “${id}”, AvatarAniBigType: “${aniBigType}”`);
                    return;
                }
                let skinName: string = skincfg[ExteriorSKFields.path];

                if (skinName == undefined || skinName == "" || skinName == null) {
                    console.error(`外观配置文件路径错误 Unique-id:${id}-${aniBigType}, ${skinName}`);
                    return;
                }

                let fullName = `${SkeletonEffect.skeletonRootPath}/${skinName}`;

                if (!SkeletonEffect.needCreatedQueue[fullName]) {
                    SkeletonEffect.needCreatedQueue[fullName] = [];
                }

                // 同一个资源共用一个模板
                let factory: Templet;
                if (SkeletonEffect.templetTabs[fullName]) {
                    factory = SkeletonEffect.templetTabs[fullName][0];
                    if (SkeletonEffect.templetTabs[fullName][1]) {
                        this.parseComplete(factory, fullName, aniBigType, skincfg, id);
                    } else {
                        SkeletonEffect.needCreatedQueue[fullName].push([this, factory, fullName, aniBigType, skincfg, id]);
                    }
                    return;
                } else {
                    factory = new Templet();
                    SkeletonEffect.templetTabs[fullName] = [factory, false];
                    SkeletonEffect.needCreatedQueue[fullName].push([this, factory, fullName, aniBigType, skincfg, id]);
                }

                factory.on(Event.COMPLETE, this, this.parseCompleteOriginal, [fullName]);
                factory.on(Event.ERROR, this, this.onError, [id, fullName, factory, aniBigType]);
                factory.loadAni(fullName);
            }
        }

        /**
         * 创建龙骨动画错误提示，尝试重新加载
         * 
         * @param id 龙骨资源唯一id
         * @param fullName 完整名字
         * @param factory 创建龙骨的模板
         * @returns 
         */
        private onError(id: number, fullName: string, factory: Templet): void {
            factory.destroy();
            this._errResetCount++;
            // 错误提示(一定次数的尝试再次加载)
            if (this._errResetCount >= 6) {
                console.error(this.ownerName + " 龙骨动画加载错误!!! id:" + id + " 再次加载尝试次数:" + this._errResetCount);
                this._errResetCount = 0;
                return;
            }
            this.resetAndPlay(this.effect);
        }

        /**
         * 解析或复用完成回调（赋值操作）
         * 
         * @param reuse 是否为复用的对象池的龙骨资源 
         * @param skele 龙骨资源
         * @param aniBigType 资源大类
         * @param id 唯一id
         * @param skincfg 配置表当前龙骨配置信息
         * @param factory 模板
         * @param skele_name 名字
         */
        private completeHandler(reuse: boolean, skele: Skeleton, aniBigType: AvatarAniBigType, id: number, skincfg: ExteriorSK, factory: Templet = null, skele_name: string = null) {

            if (!this.skeleTabs) this.skeleTabs = {};
            if (!this.skeleTabs[aniBigType]) {
                this.skeleTabs[aniBigType] = [0, null, null, null, null, -1, null];
            }
            this.skeleTabs[aniBigType][skeleDataFields.id] = id;
            this.skeleTabs[aniBigType][skeleDataFields.cfg] = skincfg;
            // this.skeleTabs[aniBigType][skeleDataFields.templet] = factory;
            this.skeleTabs[aniBigType][skeleDataFields.skele] = skele;
            this.skeleTabs[aniBigType][skeleDataFields.type] = aniBigType

            // 位置偏移量 缩放 名字
            let offset_x: number = skincfg[ExteriorSKFields.deviationX];
            let offset_y: number = skincfg[ExteriorSKFields.deviationY];
            let scale: number = skincfg[ExteriorSKFields.scale];

            // 添加父节点
            this.addChild(skele);
            this.skillid = id;

            skele.x = offset_x;
            skele.y = -offset_y;

            skele.scaleX = scale;
            skele.scaleY = scale;

            skele.name = skele_name;
            skele.visible = true;

            if (scale == 0) console.error("特效缩放为0!!!", skele.name);
            this._errResetCount = 0;
            // 记录数据
            if (reuse) {
                SkeletonEffect.reuse_avatar_count++;
            } else {
                // console.log("创建特效龙骨：" + aniBigType + ":" + id);
                SkeletonEffect.real_avatar_count++;
            }
            this._errResetCount = 0;

            if (this.labelEventTab != null) {
                this.labelOn(this.labelEventTab[labelEventFields.label],
                    this.labelEventTab[labelEventFields.callback], this.labelEventTab[labelEventFields.caller]);
            }

            this.checkAndPlayAnim(this.skeleTabs[aniBigType], ActionType.SKILL, false, true);
        }

        /**
         * 遍历创建队列，开始创建资源
         * 
         * @param fullName 资源名
         */
        private parseCompleteOriginal(fullName: string) {
            SkeletonEffect.needCreatedQueue[fullName].forEach((arr: any[]) => {
                arr[0].parseComplete(arr[1], arr[2], arr[3], arr[4], arr[5]);
            });
            // 清理队列
            SkeletonEffect.needCreatedQueue[fullName] = [];
        }

        /**
         * 创建龙骨动画，解析完成回调
         * 
         * @param factory 模板
         * @param fullName 名字
         * @param aniBigType 大类
         * @param skincfg 配置表当前龙骨配置
         * @param id 唯一id
         */
        private parseComplete(factory: Templet, fullName: string, aniBigType: AvatarAniBigType, skincfg: ExteriorSK, id: number): void {
            SkeletonEffect.templetTabs[fullName][1] = true;
            // 创建模式为0，不可以启用换装
            let skele: Skeleton = factory.buildArmature(0);
            let name = `id:${id} => ${fullName}`;
            this.completeHandler(false, skele, aniBigType, id, skincfg, factory, name);
        }

        /**
         * 对象池复用龙骨
         * 
         * @param aniBigType 大类
         * @param skele_data 当前大类的龙骨数据（id,skeleton,templet...）
         */
        private reUseComplete(aniBigType: AvatarAniBigType, skele_data: skeleData): void {

            let skele: Skeleton = skele_data[skeleDataFields.skele];
            if (!this.skeleTabs) this.skeleTabs = {};
            if (!this.skeleTabs[aniBigType]) {
                this.skeleTabs[aniBigType] = [0, null, null, null, null, -1, null];
            }

            let skincfg = skele_data[skeleDataFields.cfg];
            let id = skele_data[skeleDataFields.id];
            // let factory = skele_data[skeleDataFields.templet];
            let fullName = `skeleton-tx-reuse-${id}-${skincfg[ExteriorSKFields.name]}`;

            this.completeHandler(true, skele, aniBigType, id, skincfg, null, fullName);
        }
    }
}