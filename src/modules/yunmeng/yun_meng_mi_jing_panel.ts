/**单人boss面板
 * 云梦秘境 -> 蓬莱仙径
*/
///<reference path="../config/scene_copy_single_boss_cfg.ts"/>
///<reference path="../config/scene_copy_cloudland.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>

namespace modules.yunmeng {
    import CustomList = modules.common.CustomList;
    import Event = Laya.Event;
    import BtnGroup = modules.common.BtnGroup;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import CustomClip = modules.common.CustomClip;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import SceneCopyCloudlandCfg = modules.config.SceneCopyCloudlandCfg;
    import YunMengMiJingModel = modules.yunmeng.YunMengMiJingModel;

    type BossStateInfo = [number, BossState];

    export class YunMengMiJingPanel extends ui.YunMengMiJingViewUI {
        private _list: CustomList;
        private _btnGroup: BtnGroup;
        private _tenBtnBtnClip: CustomClip;

        constructor() {
            super()
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.singleBoss, this.multiBoss, this.yunMengBoss);
            this._list = new CustomList();
            this._list.width = 620;
            this._list.height = 125;
            this._list.hCount = 5;
            this._list.spaceX = 20;
            this._list.spaceY = 5;
            // this._list.scrollDir = 1;
            this._list.itemRender = YunMengItem1;
            this._list.x = 49;
            this._list.y = 664 - 9;
            this.addChild(this._list);
            this.initializeClip();

            this.regGuideSpr(GuideSpriteId.SINGLE_BOSS_TAB_BTN, this.singleBoss);
            this.regGuideSpr(GuideSpriteId.MULTI_BOSS_TAB_BTN, this.multiBoss);
        }

        public onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 2;
            this.showHdTime();
            this.showRewardList();
            this.showDrawNum();
            RedPointCtrl.instance.setRPProperty("yunMengBossRP", YunMengMiJingModel.instance.getState());
        }

        public close(): void {
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._tenBtnBtnClip) {
                this._tenBtnBtnClip.removeSelf();
                this._tenBtnBtnClip.destroy();
                this._tenBtnBtnClip = null;
            }
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }

            super.destroy(destroyChild);
        }

        protected addListeners(): void {
            super.addListeners();
            this._btnGroup.on(Event.CHANGE, this, this.changeHandler);
            this.addBtn.on(Event.CLICK, this, this.addBtnHandler);
            this.joinBtn.on(Event.CLICK, this, this.joinBtnHandler);
            RedPointCtrl.instance.registeRedPoint(this.singleBossDot, ["singleBossRP"]);
            RedPointCtrl.instance.registeRedPoint(this.multiBossDot, ["multiBossRP"]);
            RedPointCtrl.instance.registeRedPoint(this.yunMengBossDot, ["yunMengBossRP"]);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.YUNMENGMIJING_UPDATE, this, this.showDrawNum);

        }

        protected removeListeners(): void {
            super.removeListeners();
            this._btnGroup.off(Event.CHANGE, this, this.changeHandler);
            this.addBtn.off(Event.CLICK, this, this.addBtnHandler);
            this.joinBtn.off(Event.CLICK, this, this.joinBtnHandler);
            RedPointCtrl.instance.retireRedPoint(this.singleBossDot);
            RedPointCtrl.instance.retireRedPoint(this.multiBossDot);
            RedPointCtrl.instance.retireRedPoint(this.yunMengBossDot);
        }

        private changeHandler(): void {
            if (this._btnGroup.selectedIndex === 0) {
                WindowManager.instance.open(WindowEnum.SINGLE_BOSS_PANEL);
                this._btnGroup.selectedIndex = 2;
            } else if (this._btnGroup.selectedIndex === 1) {
                WindowManager.instance.open(WindowEnum.MULTI_BOSS_PANEL);
                this._btnGroup.selectedIndex = 2;
            }
            // if (this._btnGroup.selectedIndex === 2) {

            // }
        }

        private joinBtnHandler(): void {
            // console.log("进入场景");
            DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_cloudland_copy);
        }

        private addBtnHandler(): void {
            WindowManager.instance.openDialog(WindowEnum.VIP_TIMES_ALERT, Privilege.copyCloudlandTicket);
        }

        /**
         * 显示云梦令个数
         */
        private showDrawNum(): void {
            let totalTimes = YunMengMiJingModel.instance.totalTimes;
            let totalCiShu = YunMengMiJingModel.instance.totalCiShu;
            let remainTimes = YunMengMiJingModel.instance.remainTimes;
            this.drawNum.text = `${remainTimes}/${totalCiShu}`;
            let colorStr = "#ff3e3e";
            remainTimes == 0 ? colorStr = "#ff3e3e" : colorStr = "#168a17";
            this.drawNum.color = colorStr;
            let wight = this.addBtn.width + this.drawNum.width + this.Img1.width + this.Text1.width;
            let X = (this.width - wight) / 2;
            this.Text1.x = X;
            this.Text1.text = YunMengMiJingModel.instance._nameYunMeng;
            this.Img1.x = this.Text1.x + this.Text1.width;
            this.drawNum.x = this.Img1.x + this.Img1.width;
            this.addBtn.x = this.drawNum.x + this.drawNum.width + 2;
            if (YunMengMiJingModel.instance.getState()) {
                this._tenBtnBtnClip.visible = true;
                this._tenBtnBtnClip.play();
            } else {
                this._tenBtnBtnClip.visible = false;
                this._tenBtnBtnClip.stop();
            }
        }

        /**
         * 設置活動時間
         */
        private showHdTime(): void {
            this.hdNameText.text = BlendCfg.instance.getCfgById(29103)[blendFields.stringParam][0];
            let wight = this.hdNameText.width + this.hdTimeText.width;
            let X = (this.width - wight) / 2;
            this.hdNameText.x = X;
            this.hdTimeText.x = this.hdNameText.x + this.hdNameText.width;
        }

        /**
         * 显示奖励列表羽然
         */
        public showRewardList(): void {
            this._list.datas = SceneCopyCloudlandCfg.instance.getAwade;
            let leng = this._list.datas.length;
            leng = leng > 5 ? 5 : leng;
            let chagndu = leng * 100 + (leng - 1) * this._list.spaceX;
            this._list.x = (this.width - chagndu) / 2;
        }

        /**
         * 初始化特效
         */
        public initializeClip() {
            this._tenBtnBtnClip = new CustomClip();
            this.addChild(this._tenBtnBtnClip);
            this._tenBtnBtnClip.skin = "assets/effect/btn_light.atlas";
            let arr1: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr1[i] = `btn_light/${i}.png`;
            }
            this._tenBtnBtnClip.frameUrls = arr1;
            this._tenBtnBtnClip.scale(1, 1.3, true);
            this._tenBtnBtnClip.pos(265 - 5, 868, true);
        }
    }
}