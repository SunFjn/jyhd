/** 玄火争夺战面板*/


namespace modules.xuanhuo {
    import XuanHuoViewUI = ui.XuanHuoViewUI;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import BagItem = modules.bag.BagItem;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import XuanhuoCopy = Protocols.XuanhuoCopy;
    import NineCopyFields = Protocols.NineCopyFields;
    import GetXuanhuoCopyReply = Protocols.GetXuanhuoCopyReply;
    import GetXuanhuoCopyReplyFields = Protocols.GetXuanhuoCopyReplyFields;
    export class XuanHuoPanel extends XuanHuoViewUI {
        private _info: XuanhuoCopy;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this.timeTxt.text = BlendCfg.instance.getCfgById(62002)[blendFields.stringParam][0];

            let arr: Array<number> = BlendCfg.instance.getCfgById(62001)[blendFields.intParam];
            let items: Array<BagItem> = [this.item1, this.item2, this.item3, this.item4];
            let len: int = arr.length > items.length ? items.length : arr.length;
            for (let i: int = 0; i < len; i++) {
                items[i].dataSource = [arr[i], 1, 0, null];
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.helpBtn, Laya.Event.CLICK, this, this.helpHandler);
            this.addAutoListener(this.gotoBtn, Laya.Event.CLICK, this, this.gotoHandler);
            this.addAutoListener(this.zhuluBtn, Laya.Event.CLICK, this, this.zhuluBtnHandler);
            this.addAutoListener(this.rankAwardBtn, Laya.Event.CLICK, this, this.rankAwardHandler);
            this.addAutoListener(this.cjAwardBtn, Laya.Event.CLICK, this, this.cjAwardBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XUANHUO_COPY_INFO_UPDATE, this, this.updateHandler);

            this.addAutoRegisteRedPoint(this.achievementRPImg, ["XHMainAchievementRP"]);
            this.addAutoRegisteRedPoint(this.battleRP, ["ZhuluCjAwardeRP", "ZhuluDamageRP"]);
        }

        protected onOpened(): void {
            super.onOpened();
            //打开界面时查询是否有可领取的成就
            XuanHuoCtrl.instance.getAchievementListStatus();
            this.updateHandler();
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.loopHandler);
        }

        //帮助面板
        private helpHandler(): void {
            modules.common.CommonUtil.alertHelp(62003);
        }

        //切换到逐鹿面板
        private zhuluBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.ZHULU_PANEL);
        }

        //进入玄火争夺战场景
        private gotoHandler(): void {
            DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_xuanhuo_arena);
        }

        //排行奖励面板
        private rankAwardHandler(): void {
            WindowManager.instance.open(WindowEnum.XUANHUO_RANK_AWARD_ALERT);
        }

        //成就面板
        private cjAwardBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.XUANHUO_ACHIEVEMENT_ALERT);
        }

        private updateHandler(): void {
            this._info = XuanHuoModel.instance.XuanhuoCopy;
            if (!this._info) return;
            Laya.timer.loop(1000, this, this.loopHandler);
            this.loopHandler();
        }

        private loopHandler(): void {
            if (this._info[GetXuanhuoCopyReplyFields.reEnterTime] < GlobalData.serverTime) {
                this.gotoBtn.visible = true;
                this.enterTimeTxt.visible = false;
                Laya.timer.clear(this, this.loopHandler);
            } else {
                this.gotoBtn.visible = false;
                this.enterTimeTxt.visible = true;
                this.enterTimeTxt.text = `还需等待${Math.ceil((this._info[GetXuanhuoCopyReplyFields.reEnterTime] - GlobalData.serverTime) * 0.001)}秒才可进入`;
            }
        }
    }
}