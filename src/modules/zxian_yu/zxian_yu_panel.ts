///<reference path="../config/treasure_cfg.ts"/>
namespace modules.zxian_yu {
    import Event = laya.events.Event;
    import List = laya.ui.List;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import BagModel = modules.bag.BagModel;
    import ItemFields = Protocols.ItemFields;
    import Item = Protocols.Item;
    import BagUtil = modules.bag.BagUtil;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CommonUtil = modules.common.CommonUtil;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;
    import BlendCfg = modules.config.BlendCfg;
    import CustomClip = modules.common.CustomClip;
    import FirstPayModel = modules.first_pay.FirstPayModel;

    export class ZXianYuPanel extends ui.ZXianYuViewUI {

        // private _list: CustomList;
        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            // this._list = new CustomList();
            // this._list.width = 550;
            // this._list.height = 590;
            // this._list.hCount = 1;
            // this._list.spaceX = 0;
            // this._list.itemRender = ZXianYuItem;
            // this.listImg.addChild(this._list);
            // this._list.x = 0;
            // this._list.y = 14;
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.tipsBtn, Event.CLICK, this, this.tipsBtnHandler);

            this.addAutoListener(this.goBottomBtn, Event.CLICK, this, this.goBottomBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZXIANYU_UPDATE, this, this.setTodayTipsText);

        }
        protected onOpened(): void {
            super.onOpened();

            // this._list.datas = ZXianYuModel.instance._biLiArr;
            this.tipsText.style.align = "center";
            this.tipsText.style.font = "SimHei";
            this.tipsText.style.fontSize = 23;
            this.tipsText.innerHTML = `<span style="color:#197c03">代币券充值</span><span style="color:black">可得点券每日最大获取上限为</span><span style="color:#50ff28">${ZXianYuModel.instance._everydayMaxLimit}</span>`;

            ZXianYuCtrl.instance.GetXianYuInfo();
        }
        private goBottomBtnHandler(): void {
            //如果已首充(最低档位)
            if (FirstPayModel.instance._lowestRechargeShift) {
                WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
            }
            else {
                WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);      //首充页面
            }
        }
        public setTodayTipsText() {
            this.TodayTipsText.text = `${ZXianYuModel.instance.xianyuLimit}`;
            // this.TodayTipsText.text = `点券:${ZXianYuModel.instance.xianyu}`;
        }
        private tipsBtnHandler(): void {
            if (BlendCfg.instance.getCfgById(20063)) {
                CommonUtil.alertHelp(20063);
            } else {
                CommonUtil.alert("说明", "无法获取说明配置");
            }
        }
        public destroy(destroyChild: boolean = true): void {
            // this._list = this.destroyElement(this._list);
            super.destroy(destroyChild);
        }

    }
}