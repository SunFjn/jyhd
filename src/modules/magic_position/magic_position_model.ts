/** 成就数据 */


///<reference path="../config/xianwei_task_cfg.ts"/>


namespace modules.magicPosition {
    import GetXianweiInfoReplyFields = Protocols.GetXianweiInfoReplyFields;
    import UpdateXianweiAllFields = Protocols.UpdateXianweiAllFields;
    import XianweiTaskNode = Protocols.XianweiTaskNode;
    import XianweiTaskNodeFields = Protocols.XianweiTaskNodeFields;
    import XianweiTaskCfg = modules.config.XianweiTaskCfg;
    import xianwei_taskFields = Configuration.xianwei_taskFields;
    import XianweiWageNode = Protocols.XianweiWageNode;
    import XianweiWageNodeFields = Protocols.XianweiWageNodeFields;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import XianweiRiseCfg = modules.config.XianweiRiseCfg;
    import Point = Laya.Point;

    export class MagicPositionModel {
        private static _instance = new MagicPositionModel();

        public static get Instance(): MagicPositionModel {
            return this._instance;
        }

        constructor() {
            this._tasks = [];
        }

        //目前达到的成就
        public position: number;
        //可领取的每日俸禄目前显示id
        public dailyAward: Array<XianweiWageNode>;
        //是否升级
        public isLevelUp: boolean;
        //玩家现有仙力值
        public haveNum: number;
        //最低获取俸禄等级
        public minPos: number;
        //最高获取俸禄等级
        public maxPos: number;

        private _tasks: Array<XianweiTaskNode>;

        public showPoint: Point;

        /**
         * 初始化需要的数据
         */
        public dataInit(tuple: Protocols.GetXianweiInfoReply) {
            this.position = tuple[GetXianweiInfoReplyFields.riseId];
            this.dailyAward = tuple[GetXianweiInfoReplyFields.wages];
            this.haveNum = tuple[GetXianweiInfoReplyFields.riseExp];
            this.tasks = tuple[GetXianweiInfoReplyFields.list];
            this.isLevelUp = false;
            this.checkHasRP();
            this.setMaxAndMin();
        }

        //设置最高和最低的部分
        private setMaxAndMin(): void {
            this.minPos = this.getMinDaily();
            if (this.minPos == -1 || this.minPos == this.position) {
                this.maxPos = this.minPos;
            } else {
                this.maxPos = this.getMaxDaily();
            }
        }

        //检测红点
        private checkHasRP(): void {
            if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.xianwei)) {
                if (this.checkReward()) {
                    RedPointCtrl.instance.setRPProperty("magicPositionRP", true);
                    return;
                }
                for (let e of this._tasks) {
                    if (e[XianweiTaskNodeFields.state] == 1) {
                        RedPointCtrl.instance.setRPProperty("magicPositionRP", true);
                        return;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("magicPositionRP", false);
        }

        //判断是否能有奖励
        private checkReward(): boolean {
            for (let i = 0; i <= this.position; i++) {
                if (this.checkHasDaily(i)) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 更新数据
         */
        public updateData(tuple: Protocols.UpdateXianweiAll) {
            let id = tuple[UpdateXianweiAllFields.riseId];
            if (id > this.position) {
                this.isLevelUp = true;
                WindowManager.instance.openDialog(WindowEnum.MAGIC_POSITION_ALTER, id);
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong8.png");
            } else {
                this.isLevelUp = false;
            }
            this.position = id;
            this.dailyAward = tuple[GetXianweiInfoReplyFields.wages];
            this.haveNum = tuple[UpdateXianweiAllFields.riseExp];
            this.tasks = tuple[UpdateXianweiAllFields.list];
            this.setMaxAndMin();
            GlobalData.dispatcher.event(CommonEventType.MAGIC_POSITION_UPDATE);
            this.checkHasRP();
        }

        /**
         * 成就任务更新
         */
        public updataXianweiTask(tuple: XianweiTaskNode): void {
            let task: XianweiTaskNode = tuple;
            this.searchTaskElement(task);
            GlobalData.dispatcher.event(CommonEventType.MAGIC_POSITION_TASK_UPDATE);
            this.checkHasRP();
        }

        public searchTaskElement(task: XianweiTaskNode): void {
            let taskId: number = task[XianweiTaskNodeFields.id];
            for (let i: int = 0, len: int = this._tasks.length; i < len; i++) {
                let id: number = this._tasks[i][XianweiTaskNodeFields.id];
                if (id == taskId) {
                    this._tasks[i] = task;
                    this._tasks = this._tasks.sort(this.sortFunc.bind(this));
                    return;
                }
            }
            this._tasks.push(task);
            this._tasks = this._tasks.sort(this.sortFunc.bind(this));
        }

        public get tasks(): XianweiTaskNode[] {
            return this._tasks;
        }

        public set tasks(tasks: XianweiTaskNode[]) {
            for (let i: int = 0; i < tasks.length; i++) {
                let id: number = tasks[i][XianweiTaskNodeFields.id];
                let cfg: Configuration.xianwei_task = XianweiTaskCfg.instance.getXianweiTaskDataById(id);
                if (!cfg) {
                    tasks.splice(i, 1);
                    i--;
                }
            }
            this._tasks = tasks;
            this._tasks = this._tasks.sort(this.sortFunc.bind(this));
            GlobalData.dispatcher.event(CommonEventType.MAGIC_POSITION_TASK_UPDATE);
        }

        private sortFunc(a: XianweiTaskNode, b: XianweiTaskNode): number {
            let aId: number = a[XianweiTaskNodeFields.id];
            let bId: number = b[XianweiTaskNodeFields.id];
            let aState: number = a[XianweiTaskNodeFields.state];
            let bState: number = b[XianweiTaskNodeFields.state];
            if (aState == bState) { //状态相同 判断成就类型 成就类型相同判断id
                return this.typeSortFunc(a, b);
            } else {
                if (aState == 1) {
                    return -1;
                } else if (bState == 1) {
                    return 1;
                } else {
                    if (aState == 0) {
                        return -1;
                    } else if (bState == 0) {
                        return 1;
                    } else {
                        if (aId > bId) {
                            return 1;
                        } else if (aId < bId) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                }
            }
        }

        private typeSortFunc(a: XianweiTaskNode, b: XianweiTaskNode): number {
            let aId: number = a[XianweiTaskNodeFields.id];
            let bId: number = b[XianweiTaskNodeFields.id];
            let aCfg: Configuration.xianwei_task = XianweiTaskCfg.instance.getXianweiTaskDataById(aId);
            let bCfg: Configuration.xianwei_task = XianweiTaskCfg.instance.getXianweiTaskDataById(bId);
            let aRank: number = aCfg[xianwei_taskFields.rank];
            let bRank: number = bCfg[xianwei_taskFields.rank];
            if (aRank < 100 && bRank > 100) {  //小于100是高级
                return -1;
            } else if (aRank > 100 && bRank < 100) {
                return 1;
            } else {
                if (aId > bId) {
                    return 1;
                } else if (aId < bId) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }

        //最低可领取
        public getMinDaily(): number {
            let ids: number[] = XianweiRiseCfg.instance.ids;
            let index: number = ids.indexOf(this.position);
            for (let i = 0; i <= index; i++) {
                let id: number = ids[i];
                if (this.checkHasDaily(id)) {
                    return id;
                }
            }
            return -1;
        }

        //最高可领取
        public getMaxDaily(): number {
            let ids: number[] = XianweiRiseCfg.instance.ids;
            let index: number = ids.indexOf(this.position);
            for (let i = index; i >= 0; i--) {
                let id: number = ids[i];
                if (this.checkHasDaily(id)) {
                    return id;
                }
            }
            return -1;
        }

        /**
         * 是否处于可领取的状态
         */
        public checkHasDaily(id: number): boolean {
            if (this.dailyAward && this.dailyAward.length > 0) {
                for (let i = 0; i < this.dailyAward.length; i++) {
                    let data: XianweiWageNode = this.dailyAward[i];
                    if (data[XianweiWageNodeFields.riseId] == id) {
                        if (data[XianweiWageNodeFields.state] == 1) { //处于可领取的状态
                            return true;
                        }
                        break;
                    }
                }
            }
            return false;
        }
    }
}
