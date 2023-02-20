///<reference path=".//prevent_fool_model.ts"/>

namespace modules.prevent_fool_question{
    import BaseCtrl = modules.core.BaseCtrl;
    import PreventFoolModel = modules.prevent_fool_question.PreventFoolModel;

    import PreventFoolReplyFields=Protocols.GetPreventFoolReplyFields;
    import AnswerReply=Protocols.AnswerPreventFoolReplyFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    export class PreventFoolCtrl extends BaseCtrl{
        private static _instance:PreventFoolCtrl;
        public static get instance():PreventFoolCtrl{
            return this._instance=this._instance||new PreventFoolCtrl();
        }
        constructor(){
            super();
        }
        setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetPreventFoolReply,this,this.getPreventFoolReply);
            Channel.instance.subscribe(SystemClientOpcode.AnswerPreventFoolReply,this,this.answerPreventFoolReply);
           
            this.requsetAllData();
        }
        
        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.getPreventFool();
        }
        
        //获得信息返回
        private getPreventFoolReply(tuple:Protocols.GetPreventFoolReply):void{
            PreventFoolModel.instance.getPreventFoolReply(tuple);
        }

        //获得答案返回
        private  answerPreventFoolReply(tuple:Protocols.AnswerPreventFoolReply):void{
            PreventFoolModel.instance.getAnswerReply(tuple);
        }
        //请求获取问题
        public getPreventFool():void{
            Channel.instance.publish(UserFeatureOpcode.GetPreventFool,null);
        }
        //请求获得奖励
        public getAnswerAward(answer:number):void{
            Channel.instance.publish(UserFeatureOpcode.AnswerPreventFool,[answer]);
        }


    }

}