///<reference path="../notice/tips_notice_manager.ts"/>
import GetXuanhuoCopyReply = Protocols.GetXuanhuoCopyReply;
import GetXuanhuoCopyReplyFields = Protocols.GetXuanhuoCopyReplyFields;
import XuanhuoAllInspireReplyFields = Protocols.XuanhuoAllInspireReplyFields;
import XuanhuoAllInspireReply = Protocols.XuanhuoAllInspireReply;
import XuanHuoGetAwardReply = Protocols.XuanHuoGetAwardReply;
import GetXuanhuoTaskAwardReply = Protocols.GetXuanhuoTaskAwardReply;
import XuanhuoCopyJudgeAward = Protocols.XuanhuoCopyJudgeAward;
import GetXuanhuoTaskAwardReplyFields = Protocols.GetXuanhuoTaskAwardReplyFields;
import GetXuanhuoTaskAward = Protocols.GetXuanhuoTaskAward;
import LogUtils = game.misc.LogUtils;
import UserCenterOpcode = Protocols.UserCenterOpcode;
import UserFeatureOpcode = Protocols.UserFeatureOpcode;
import updateXuanhuoNum = Protocols.updateXuanhuoNum;
import XuanHuoAchievementListReply = Protocols.XuanHuoAchievementListReply;
import GetXuanhuoCopyDataReply = Protocols.GetXuanhuoCopyDataReply;
import GetXuanhuoAchiecemtnAward = Protocols.GetXuanhuoAchiecemtnAward;
import XuanHuoAchievementAwardReply = Protocols.XuanHuoAchievementAwardReply;
import XuanHuoAchievementAwardReplyFields = Protocols.XuanHuoAchievementAwardReplyFields;
import XuanhuoCopyNumData = Protocols.XuanhuoCopyNumData;
import BroadcastXuanhuoNotice = Protocols.BroadcastXuanhuoNotice;
import SpecifySearchObjReply = Protocols.SpecifySearchObjReply;
import TipsNoticeManager = modules.notice.TipsNoticeManager;
/** 玄火 */
namespace modules.xuanhuo {

    export class XuanHuoCtrl extends BaseCtrl {
        private static _instance: XuanHuoCtrl;
        public static get instance(): XuanHuoCtrl {
            return this._instance = this._instance || new XuanHuoCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            // 更新积分
            Channel.instance.subscribe(SystemClientOpcode.UpdateXuanhuoNum, this, this.updateScore);
            Channel.instance.subscribe(SystemClientOpcode.GetXuanhuoCopyReply, this, this.getXuanhuoCopyReply);
            Channel.instance.subscribe(SystemClientOpcode.GetXuanhuoCopyDataReply, this, this.getInfoCopyReply);
            Channel.instance.subscribe(SystemClientOpcode.XuanhuoAllInspireReply, this, this.getAllInspireReply);
            Channel.instance.subscribe(SystemClientOpcode.XuanhuoGetTaskAwardReply, this, this.getXuanhuoTaskAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetXuanhuoTaskAwardReply, this, this.getSingleXuanhuoTaskAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetXuanHuoAchievementAwardListReply, this, this.getXuanHuoAchievementAwardListReply);
            Channel.instance.subscribe(SystemClientOpcode.GetXuanHuoAchievementAwardReply, this, this.getXuanHuoAchievementAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.updateXuanhuoHumanDataReply, this, this.setCopyHumanData);
            Channel.instance.subscribe(SystemClientOpcode.BroadcastXuanhuoNotice, this, this.openTipsPanl);
            Channel.instance.subscribe(SystemClientOpcode.XuanhuoCopyJudgeAward, this, this.xuanhuoCopyJudgeAward);
            Channel.instance.subscribe(SystemClientOpcode.SpecifySearchObjReply, this, this.reqSearchObjReply);
            // this.onLoginSuccess();

            // GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.updateBag);
            // GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.updateBag);
            this.requsetAllData();
        }
        public requsetAllData(): void {
            this.getXuanhuoCopy();
            this.getInfoCopy();
            this.getAchievementListStatus();
        }

        // 获取玄火 玩家pos
        public getreqSearchObj(id: number): void {
            Channel.instance.publish(UserFeatureOpcode.SpecifySearchObj, [id]);
        }

        // 搜索对象返回
        private reqSearchObjReply(value: SpecifySearchObjReply): void {
            console.log("搜索对象返回.................." + value);
            XuanHuoModel.instance.actionTween = false
            XuanHuoModel.instance.selectTargetPos = value[1];
            PlayerModel.instance.selectTarget(SelectTargetType.Player, value[2]);

        }

        // 跑马灯提示
        public openTipsPanl(value: BroadcastXuanhuoNotice): void {
            console.log(LogFlags.Xuanhuo, "怪物复活提示.............." + value);
            TipsNoticeManager.instance.addItem([value[0], value[1]]);
            XuanHuoModel.instance.vulcanId = value[2]
            GlobalData.dispatcher.event(CommonEventType.XUANHUO_COPY_VULCAN_UPDATE);
            // WindowManager.instance.open(WindowEnum.XUANHUO_tips_ALERT, { name: value[0], desc: value[1] });
        }
        // 获取玄火副本材料数量
        public setCopyHumanData(value: XuanhuoCopyNumData): void {
            // console.log(LogFlags.Xuanhuo, "获取玄火副本材料数量..............");
            XuanHuoModel.instance.setCopyHumanData(value)
        }
        // 获取玄火副本数据
        public getInfoCopy(): void {
            // console.log(LogFlags.Xuanhuo, "获取玄火副本信息..............");
            Channel.instance.publish(UserFeatureOpcode.GetXuanhuoCopyData, null);
        }
        // 获取玄火个人数据
        public getXuanhuoCopy(): void {
            // console.log(LogFlags.Xuanhuo, "获取玄火个人数据..............");
            Channel.instance.publish(UserFeatureOpcode.GetXuanhuoCopy, null);
        }
        // 获取玄火个人数据返回
        private getXuanhuoCopyReply(value: GetXuanhuoCopyReply): void {
            // console.log(LogFlags.Xuanhuo, "获取玄火数据返回............." + value);
            XuanHuoModel.instance.XuanhuoCopy = value;
        }
        // 获取玄火副本数据返回
        private getInfoCopyReply(value: GetXuanhuoCopyDataReply): void {
            // console.log(LogFlags.Xuanhuo, "获取玄火副本返回............." + value);
            XuanHuoModel.instance.copyData = value;
        }
        public sendAllInspire() {
            //全队鼓舞
            Channel.instance.publish(UserFeatureOpcode.XuanhuoAllInspire, null);
        }

        public getAllInspireReply(value: XuanhuoAllInspireReply): void {
            //全队鼓舞
            // console.log(LogFlags.Xuanhuo, "获取玄火鼓舞返回............." + value);
            if (value[XuanhuoAllInspireReplyFields.result] != 0)
                CommonUtil.noticeError(value[XuanhuoAllInspireReplyFields.result]);
        }
        // 更新积分
        private updateScore(value: updateXuanhuoNum): void {
            // console.log(LogFlags.Nine, "更新积分......................." + value);
            XuanHuoModel.instance.score = value;
        }

        /*获取玄火成就列表领取状态*/
        public getAchievementListStatus(): void {
            Channel.instance.publish(UserFeatureOpcode.GetXuanHuoAchievementAwardList, null);
        }
        /*获取玄火成就列表返回*/
        public getXuanHuoAchievementAwardListReply(data: XuanHuoAchievementListReply): void {
            // console.log("玄火列表返回:", data);
            XuanHuoModel.instance.achievementList = data;
        }
        /*获取玄火副本内获取任务领取状态*/
        public getGetAwardStatus(): void {
            Channel.instance.publish(UserFeatureOpcode.XuanhuoGetTaskAward, null);
        }

        /*领取玄火成就*/
        public getAchievementAward(data: GetXuanhuoAchiecemtnAward): void {
            Channel.instance.publish(UserFeatureOpcode.GetXuanHuoAchievementAward, data);
        }
        // 领取玄火成就返回
        private getXuanHuoAchievementAwardReply(data: XuanHuoAchievementAwardReply): void {
            let code: number = data[XuanHuoAchievementAwardReplyFields.result];
            CommonUtil.codeDispose(code, `领取成功`);
            if (code == 0) {
                this.getAchievementListStatus();
            }
        }

        // 获取玄火副本内获取任务领取返回
        private getXuanhuoTaskAwardReply(value: XuanHuoGetAwardReply): void {
            XuanHuoModel.instance.xuanhuoGetAwardList = value;
        }
        // 获取一个玄火奖励请求
        public getSingleXuanHuoAward(taskId: GetXuanhuoTaskAward): void {
            Channel.instance.publish(UserFeatureOpcode.GetXuanhuoTaskAward, taskId);
        }

        // 获取一个玄火奖励请求返回
        private getSingleXuanhuoTaskAwardReply(data: GetXuanhuoTaskAwardReply): void {
            let code: number = data[GetXuanhuoTaskAwardReplyFields.result];
            CommonUtil.codeDispose(code, `领取成功`);
            if (code == 0) {
                this.getGetAwardStatus();
            }
        }
        // 玄火副本结算
        private xuanhuoCopyJudgeAward(data: XuanhuoCopyJudgeAward): void {
            XuanHuoModel.instance.xuanhuoCopySettlementData = data;
            WindowManager.instance.open(WindowEnum.XUANHUO_COPY_SETTLEMENT_ALERT);
        }

    }
}