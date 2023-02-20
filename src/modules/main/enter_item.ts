namespace modules.main {
    import EnterItemUI = ui.EnterItemUI;
    import Event = Laya.Event;
    import action_openFields = Configuration.action_openFields;
    import ActionOpenCfg = modules.config.ActionOpenCfg;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import Sprite = Laya.Sprite;
    import AdventureModel = modules.adventure.AdventureModel;
    import Point = Laya.Point;
    import ClanModel = modules.clan.ClanModel;

    export class EnterItem extends EnterItemUI {

        protected _id: number;
        private _tween: TweenJS;
        private _con: Sprite;

        constructor(id: number) {
            super();

            this.iconImg.skin = `assets/icon/activity_icon/icon_${this._id = id}.png`;
            // this.nameTxt.skin = "assets/icon/activity_icon/" + ActionOpenCfg.instance.getCfgById(id)[action_openFields.uiName];

            if (this._id === ActionOpenId.copy) {     // 副本入口
                this.regGuideSpr(GuideSpriteId.RIGHT_BOTTOM_DUNGEON_ENTER_BTN, this.iconImg);
            } else if (this._id === ActionOpenId.boss) {       // Boss入口
                // this.regGuideSpr(GuideSpriteId.RIGHT_BOTTOM_BOSS_ENTER_BTN, this);
            } else if (this._id === ActionOpenId.daily) {      // 日常入口
                this.regGuideSpr(GuideSpriteId.RIGHT_BOTTOM_DAILY_ENTER_BTN, this.iconImg);
            } else if (this._id === ActionOpenId.adventureEnter) {    // 奇遇入口
                this.regGuideSpr(GuideSpriteId.RIGHT_BOTTOM_ADVENTURE_ENTER_BTN, this.iconImg);
            }
            /*else if (this._id === ActionOpenId.xianFuEnter) {    // 仙府-家园洞天
                this.regGuideSpr(GuideSpriteId.BOTTOM_XIANFU_BTN, this);
            }*/
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();

            this.on(Event.CLICK, this, this.clickHandler);

            if (this._id === ActionOpenId.adventureEnter) {
                this.addAutoListener(GlobalData.dispatcher, CommonEventType.ADVENTURE_HAS_NEW_EVENT_UPDATE, this, this.updateHasNewEvent);
            }
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RESIZE_UI, this, this.setActionPreviewPos);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ACTION_PREVIEW_RESIZE_UI, this, this.setActionPreviewPos);

            this.addRedPotListeners();
        }

        protected removeListeners(): void {

            this.off(Event.CLICK, this, this.clickHandler);
            RedPointCtrl.instance.retireRedPoint(this.dotImg);

            super.removeListeners();
        }

        protected onOpened(): void {
            super.onOpened();

            if (this._id === ActionOpenId.adventureEnter) {
                this.updateHasNewEvent();
                // 防止缓动造成飞入偏移，直接记录飞入目标
                AdventureModel.instance.flyTarget = this;
            }
            this.setActionPreviewPos();
        }

        /**
         * 存储对应功能预览 对应的飞入点
         */
        public setActionPreviewPos() {
            // Laya.timer.clear(this, this.setPosActionPreview);
            // Laya.timer.once(200, this, this.setPosActionPreview);
            this.callLater(this.setPosActionPreview);
        }

        /**
         * 右下脚 对应入口点 对应功能 注册 功能预览飞入点
         */
        public setPosActionPreview() {
            if (this._id === ActionOpenId.boss) {
                return;
                Point.TEMP.setTo(67, 27);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.boss, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.singleBossCopy, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.multiBoss, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.cloudlandCopy, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.threeWorldsBoss, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.bossHome, pos);
            } else if (this._id === ActionOpenId.copy) {
                Point.TEMP.setTo(67, 27);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.copy, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.dahuang, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.copperCopy, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.zqCopy, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.petCopy, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.rideCopy, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.runeCopy, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.teamCopy, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.shilian, pos);

                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.shenbingCopy, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.wingCopy, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.fashionCopy, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.tianzhuCopy, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.xilianCopy, pos);

            } else if (this._id === ActionOpenId.daily) {
                Point.TEMP.setTo(67, 27);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.daily, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.lilian, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.xiangyao, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.actionList, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.riches, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.swimming, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.fairy, pos);
            } else if (this._id === ActionOpenId.sports) {
                Point.TEMP.setTo(67, 27);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.sports, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.nineCopy, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.tianti, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.fairy, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.arenaCopy, pos);
            } else if (this._id === ActionOpenId.adventureEnter) {
                Point.TEMP.setTo(67, 27);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.adventureEnter, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.adventrue, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.adventureShop, pos);
            }
            else if (this._id === ActionOpenId.ClanEntry) {
                Point.TEMP.setTo(67, 27);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.ClanEntry, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.ClanIndex, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.ClanJoin, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.ClanLuckyField, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.ClanStore, pos);
            }
        }

        destroy(): void {
            if (this._con) {
                this._con.destroy(true);
                this._con = null;
            }
            super.destroy();
            this._tween = null;
        }

        close(): void {
            super.close();
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
            if (this._con) {
                this._con.removeSelf();
            }
            AdventureModel.instance.flyTarget = null;
        }
        private xfHandler(): void {       // 仙府-家园
            xianfu.XianfuCtrl.instance.enterScene();
        }
        public clickHandler(): void {
            let hasJoinClan = ClanModel.instance.hasJoinClan;
            if (this._id === ActionOpenId.xianFuEnter) {
                this.xfHandler();
            } else if (this._id === ActionOpenId.ClanEntry) {
                if (hasJoinClan) {
                    BottomTabCtrl.instance.openTabByFunc(ActionOpenId.ClanEntry);
                } else {
                    WindowManager.instance.open(WindowEnum.CLAN_LIST_PANEL);
                }
            } else {
                BottomTabCtrl.instance.openTabByFunc(this._id);
            }

        }

        private addRedPotListeners(): void {
            if (this._id === ActionOpenId.daily)  //历练副本红点
                RedPointCtrl.instance.registeRedPoint(this.dotImg, ["exerciseRP", "activityAllItemRP", "dailyDemonRP"]);
            else if (this._id === ActionOpenId.copy) //大荒副本红点
                RedPointCtrl.instance.registeRedPoint(this.dotImg, ["bigTowerRP", "dailyDungeonRP", "runeCopyRP", "teamBattleRP"]);
            else if (this._id === ActionOpenId.boss) {      //boss副本红点
                // RedPointCtrl.instance.registeRedPoint(this.dotImg, ["singleBossRP", "multiBossRP", "threeWorldsRP", "shenYuBossRP", "bossHomeRP", "yunMengBossRP"]);
            }
            else if (this._id === ActionOpenId.sports)       // 竞技红点
                RedPointCtrl.instance.registeRedPoint(this.dotImg, ["arenaRP", "ladderJoinAwardRP", "fairyRP", "tianTiRP", "XHMainAchievementRP"]);
            else if (this._id === ActionOpenId.adventureEnter)       // 奇遇红点
                RedPointCtrl.instance.registeRedPoint(this.dotImg, ["adventureRP", "adventureShopRP"]);
            else if (this._id === ActionOpenId.ClanEntry)  //战队红点
                RedPointCtrl.instance.registeRedPoint(this.dotImg, ["ClanGradeAwardRP", "ClanShopRP", "ClanApplyListRP"]);
        }

        private updateHasNewEvent(): void {
            let hasNewEvent: boolean = AdventureModel.instance.hasNewEvent;
            if (hasNewEvent) {
                if (!this._con) {
                    this._con = new Sprite();
                    let img: Laya.Image = new Laya.Image("common/txtbg_mainui_jt_1.png");
                    this._con.addChild(img);
                    let txt: Laya.Text = new Laya.Text();
                    txt.font = "SimHei";
                    txt.fontSize = 22;
                    txt.color = "#000000";
                    txt.width = img.width;
                    txt.align = "center";
                    txt.height = img.height;
                    txt.valign = `middle`;
                    txt.text = "触发新探险";
                    this._con.addChild(txt);
                    this._con.y = 7;
                }
                this.addChild(this._con);
                this._con.x = -150;
                if (!this._tween) {
                    this._tween = TweenJS.create(this._con).to({ x: -130 }, 200).yoyo(true).repeat(Number.MAX_VALUE).start().onUpdate(() => {
                        if (!this._con || !this._con._childs[0])
                            console.log(`箭头图片被回收---`);
                    });
                }
            } else {
                if (this._tween) {
                    this._tween.stop();
                    this._tween = null;
                }
                if (this._con) {
                    this._con.removeSelf();
                }
            }
        }
    }
}
