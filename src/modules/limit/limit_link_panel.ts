///<reference path="../config/limit_continue_cfg.ts"/>
/**
 * 连充活动 - 面板
 */
namespace modules.limit {
    import CustomList = modules.common.CustomList;
    import XunbaoContinePayCfg = modules.config.LimitLinkCfg;
    import xunbao_continue_pay = Configuration.xunbao_continue_pay;
    import xunbao_continue_payFields = Configuration.xunbao_continue_payFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import GetLimitLinkInfoReply_reward = Protocols.GetLimitLinkInfoReply_reward;
    import GetLimitLinkInfoReply_rewardFields = Protocols.GetLimitLinkInfoReply_rewardFields;
    import Button = laya.ui.Button;
    import BtnGroup = modules.common.BtnGroup;
    import LayaEvent = modules.common.LayaEvent;

    export class LimitLinkPanel extends ui.LimitLinkViewUI {

        constructor() {
            super();
        }

        public destroy(): void {
            super.destroy();
        }
        private _list: CustomList;

        private grade: Array<number>;
        private tab_btn_arr: Array<Button>;
        private _scienceTabGroup: BtnGroup;

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

            let grade_arr = XunbaoContinePayCfg.instance.getGradeByType(this.bigtype);
            // 获取活动type
            for (let i = 0; i < 3; i++) {
                this.tabBtnBox._childs[i].label = grade_arr[i] + "元";
            }

            // 设置tab
            this._scienceTabGroup = new BtnGroup();
            this._scienceTabGroup.setBtns(...this.tabBtnBox._childs);
            this._scienceTabGroup.selectedIndex = 0;

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = this.listItemClass;
            this._list.hCount = 1;
            this._list.width = 673;
            this._list.height = 691;
            this.itemPanel.addChild(this._list);
        }

        protected get bigtype(): LimitBigType {
            return LimitBigType.fish;
        }

        protected get listItemClass() {
            return LimitLinkItem
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this._scienceTabGroup, LayaEvent.CHANGE, this, this.changeswitchBtnTabHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LIMIT_LINK_UPDATE, this, this.updateView);
            this.addAutoRegisteRedPoint(this.rpBox._childs[0], ["fishLinkRP_grade_1"]);
            this.addAutoRegisteRedPoint(this.rpBox._childs[1], ["fishLinkRP_grade_2"]);
            this.addAutoRegisteRedPoint(this.rpBox._childs[2], ["fishLinkRP_grade_3"]);
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();
            LimitLinkCtrl.instance.getInfo(this.bigtype);
            this.updateView();
        }

        /** 充值 档次 切换*/
        private changeswitchBtnTabHandler(): void {
            this.updatePanel();
        }

        private updateView(): void {
            //更新面板状态 和连充事件绑定
            this.setActivitiTime();
            this.setDayMoney();

            this._scienceTabGroup.selectedIndex = LimitLinkModel.instance.openindex(this.bigtype);

            this.updatePanel();
            // this.HeadMessage()
        }

        //顶部信息
        private HeadMessage() {
            let cfg = XunbaoContinePayCfg.instance.cfgs
            
            //连续天数
            // this.dayText.value  = `${cfg[6][xunbao_continue_payFields.serverDay] } +1`
            this.dayText.value  = `6`
            //道具信息
            this.continueBase   
            //充值金额
        }

        // 根据档位更新面板
        private updatePanel() {
            let arr = XunbaoContinePayCfg.instance.getCfgsByTypeGrade(this.bigtype, this._scienceTabGroup.selectedIndex);
            arr = arr.sort(this.sortFunc.bind(this));
            // console.log('vtz:arr', arr);
            this._list.datas = arr;

            let arrDate = XunbaoContinePayCfg.instance.getCfgsByTypeGrade(this.bigtype, this._scienceTabGroup.selectedIndex);

            // this.setRp();
            // let arrDate = CeremonyContinePayCfg.instance.getCfgsByGrade(grade);
            for (var index = 0; index < arrDate.length; index++) {
                var element = arrDate[index];
                if (element[xunbao_continue_payFields.serverDay] == 5) {
                    element = element;
                    this.payText.value = `${element[xunbao_continue_payFields.money]}`;
                    //this.payText.blendMode = BlendMode.ADD;
                    this.dayText.value = `${element[xunbao_continue_payFields.serverDay] + 1}`;
                    let awardArr: Array<Items> = [];
                    awardArr = element[xunbao_continue_payFields.reward];
                    this.continueBase.dataSource = [awardArr[0][ItemsFields.itemId], awardArr[0][ItemsFields.count], 0, null];
                    return;
                }
            }
        }

        //根据领取状态排序
        private sortFunc(a: xunbao_continue_pay, b: xunbao_continue_pay): number {
            let aDay: number = a[xunbao_continue_payFields.serverDay];
            let bDay: number = b[xunbao_continue_payFields.serverDay];
            let aGrade: number = a[xunbao_continue_payFields.grade];
            let bGrade: number = b[xunbao_continue_payFields.grade];
            let aReward: GetLimitLinkInfoReply_reward = LimitLinkModel.instance.getRewardByGradeAndDay(this.bigtype, aGrade, aDay);
            let bReward: GetLimitLinkInfoReply_reward = LimitLinkModel.instance.getRewardByGradeAndDay(this.bigtype, bGrade, bDay);
            let aState: number = aReward ? aReward[GetLimitLinkInfoReply_rewardFields.state] : 0;
            let bState: number = bReward ? bReward[GetLimitLinkInfoReply_rewardFields.state] : 0;

            aState = aState === 0 ? 1 : aState === 1 ? 0 : aState;
            bState = bState === 0 ? 1 : bState === 1 ? 0 : bState;
            if (aState === bState) {
                return aDay - bDay;
            } else {
                return aState - bState;
            }
        }

        private setDayMoney(): void {
            this.priceText.text = `${LimitLinkModel.instance.totalMoney(this.bigtype)}元`;
        }

        private setActivitiTime(): void {
            if (LimitLinkModel.instance.activityTime(this.bigtype) > GlobalData.serverTime) {
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.activityText.color = "#FF3e3e";
                this.activityText.text = "活动已结束";
            }
        }

        private activityHandler(): void {
            if (LimitLinkModel.instance.activityTime(this.bigtype) > GlobalData.serverTime) {
                this.activityText.color = "#50ff28";
                this.activityText.text = `${modules.common.CommonUtil.timeStampToDayHourMinSecond(LimitLinkModel.instance.activityTime(this.bigtype))}`;
            } else {
                this.activityText.color = "#FF3e3e";
                this.activityText.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }


    }
}