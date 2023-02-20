/** 全民狂嗨 数据*/



namespace modules.the_carnival{
    import KuanghaiTaskNode = Protocols.KuanghaiTaskNode;
    import KuanghaiGradeNode = Protocols.KuanghaiGradeNode;
    import GetKuanghaiInfoReplyFields = Protocols.GetKuanghaiInfoReplyFields;
    import KuanghaiTaskNodeFields = Protocols.KuanghaiTaskNodeFields;
    import KuanghaiGradeNodeFields = Protocols.KuanghaiGradeNodeFields;
    import UpdateKuanghaiTask = Protocols.UpdateKuanghaiTask;
    import GetKuanghaiInfoReply = Protocols.GetKuanghaiInfoReply;

    export class TheCarnivalModel {
        private _openState:number;/*活动状态(0关闭 1开启)*/
        private _taskList:Array<KuanghaiTaskNode>;/*任务列表*/
        private _gradeList:Array<KuanghaiGradeNode>;/*档次列表*/
        private _id:number;/*活动id*/
        private _exp:number;/*总嗨值*/
        private _restTm:number;/*剩余时间*/


        //单例
        private static _instance: TheCarnivalModel;
        public static get instance(): TheCarnivalModel {
            return this._instance = this._instance || new TheCarnivalModel();
        }
        //构造函数
        private constructor() {
            this._openState = 0;
            this._taskList  = [];
            this._gradeList = [];
            this._id  = 0;
            this._exp  = 0;
            this._restTm = 0;
        }
        //数据更新返回
        public getdateInfo(tuple:GetKuanghaiInfoReply){
            if (tuple) {
                this._openState = tuple[GetKuanghaiInfoReplyFields.openState];
                this._taskList  = tuple[GetKuanghaiInfoReplyFields.taskList];
                this._gradeList  = tuple[GetKuanghaiInfoReplyFields.gradeList];
                this._id  = tuple[GetKuanghaiInfoReplyFields.id];
                this._exp  = tuple[GetKuanghaiInfoReplyFields.exp];
                this._restTm = tuple[GetKuanghaiInfoReplyFields.restTm]+GlobalData.serverTime;
            }else{console.log("kuangHai Null Null Null Null Null Null Null ")};

            this.setFuncState();
            GlobalData.dispatcher.event(CommonEventType.THE_CARNIVAL_UPDATE);
        }
        public get openState(): number {
            return this._openState;
        }
        public get taskList(): Array<KuanghaiTaskNode> {
            return this._taskList;
        }
        public get gradeList(): Array<KuanghaiGradeNode> {
            return this._gradeList;
        }
        public get id(): number {
            return this._id;
        }
        public get exp(): number {
            return this._exp;
        }
        public get restTm(): number {
            return this._restTm;
        }
        //更新单个任务
        public singleTaskUpdate(tuple : UpdateKuanghaiTask){
            for(let i = 0;i<this._taskList.length;i++){
                if(this._taskList[i][KuanghaiTaskNodeFields.id] == tuple[0][KuanghaiTaskNodeFields.id]){
                    this._taskList[i] = tuple[0];
                }
            }
            this.setPayRewardRP();
            GlobalData.dispatcher.event(CommonEventType.THE_CARNIVAL_UPDATE);
        }
        // 根据id获取任务奖励信息
        public getNodeInfoById(id:int):KuanghaiTaskNode{
            let temp : KuanghaiTaskNode = null;
            if (this._taskList){
                for (let i: int = 0, len: int = this._taskList.length; i < len; i++) {
                    let node: KuanghaiTaskNode = this._taskList[i];
                    if (id === node[KuanghaiTaskNodeFields.id]) {
                        temp = node;
                        break;
                    }
                }
            }
            return temp;
        }
        // 根据id获取奖励信息
        public getRisrNodeInfoByGrade(grade:int):KuanghaiGradeNode{
            let temp : KuanghaiGradeNode = null;
            if (this._gradeList){
                for (let i: int = 0, len: int = this._gradeList.length; i < len; i++) {
                    let node: KuanghaiGradeNode = this._gradeList[i];
                    if (grade === node[KuanghaiGradeNodeFields.grade]) {
                        temp = node;
                        break;
                    }
                }
            }
            return temp;
        }
        //设置红点
        public setPayRewardRP() {
            let isTheCarnivalRP = this.getgRadeRP();
            redPoint.RedPointCtrl.instance.setRPProperty("theCarnivalRP", isTheCarnivalRP);
        }
        //狂嗨是否有可领取
        public getgRadeRP(): boolean {
            if(modules.funcOpen.FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.theCarnival)){
                if(this.taskList!=null){
                    for(let i =0;i<this.taskList.length;i++){
                        if(this.taskList[i][KuanghaiTaskNodeFields.state] == 1){
                            return true;
                        }
                    }
                }
                if(this.gradeList!=null){
                    for(let i =0;i<this.gradeList.length;i++){
                        if(this.gradeList[i][KuanghaiGradeNodeFields.state] == 1){
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        //关闭页签
        public setFuncState(): void {
            let _isOpen = this._openState == 1 ? ActionOpenState.open : ActionOpenState.close;
            modules.funcOpen.FuncOpenModel.instance.setActionOpen(ActionOpenId.theCarnivalEnter, _isOpen);
        }
    }
}