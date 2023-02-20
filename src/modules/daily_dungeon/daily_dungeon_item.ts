/** 日常副本单元项*/


///<reference path="../config/privilege_cfg.ts"/>
namespace modules.dailyDungeon {
    import DungeonUtil = modules.dungeon.DungeonUtil;
    import DailyDungeonItemUI = ui.DailyDungeonItemUI;
    import DungeonModel = modules.dungeon.DungeonModel;
    import CopyTimes = Protocols.CopyTimes;
    import CopyTimesFields = Protocols.CopyTimesFields;
    import Event = Laya.Event;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import CustomClip = modules.common.CustomClip;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BaseItem = modules.bag.BaseItem;
    import ShilianCfg = modules.config.ShilianCfg;
    import shilianFields = Configuration.shilianFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import BagModel = modules.bag.BagModel;
    import PrivilegeCfg = modules.config.PrivilegeCfg;
    import PrivilegeNode = Configuration.PrivilegeNode;
    import PrivilegeNodeFields = Configuration.PrivilegeNodeFields;
    import LayaEvent = modules.common.LayaEvent;
    export class DailyDungeonItem extends DailyDungeonItemUI {
        //private _strs: Array<string>;
        private _numStrs: Array<string>;
        private _btnClip: CustomClip;
        private _type: number;
        private _funcId: number;
        private _funcIsOpen: boolean;

        private _baseItems: Array<BaseItem>;
        private _mapId: number;
        private _openId: number;
        private _state: number;//当前状态 1 挑战 2 扫荡
        private _coinNum: number = 0;
        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            if (this._baseItems) {
                for (let index = 0; index < this._baseItems.length; index++) {
                    let element = this._baseItems[index];
                    if (element) {
                        element.removeSelf();
                        element.destroy();
                        element = null;
                    }
                }
                this._baseItems.length = 0;
                this._baseItems = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();

            //this._strs = ["简单", "普通", "困难", "噩梦", "炼狱", "深渊", "虚空"];
            this._numStrs = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

            this._btnClip = new CustomClip();
            this.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            let arr: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr[i] = `btn_light/${i}.png`;
            }
            this._btnClip.frameUrls = arr;
            this._btnClip.visible = false;
            this._btnClip.scale(0.98, 1, true);
            this._btnClip.pos(-6, -16, true);

            this._funcIsOpen = false;

            this._baseItems = [this.item1, this.item2, this.item3, this.item4];
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_TIMES_UPDATE, this, this.showUI);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_TIMES_UPDATE, this, this.timesUpdate);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FUNC_OPEN_UPDATE, this, this.funcOpenUpdate);
            this.addAutoListener(this.coinAddBtn, LayaEvent.CLICK, this, this.addHandler);
            this.addAutoListener(this.coinChallengeBtn, LayaEvent.CLICK, this, this.challengeHandler);
            // this.petAddBtn.on(Event.CLICK, this, this.addHandler);
            this.addAutoListener(this.petChallengeBtn, LayaEvent.CLICK, this, this.challengeHandler);
            this.addAutoListener(this.cleanBtn, LayaEvent.CLICK, this, this.cleanHandler);
            this.addAutoListener(this.lookBtn, LayaEvent.CLICK, this, this.lookHandler);
            this.addAutoListener(this.helpBtn, LayaEvent.CLICK, this, this.helpHandler);
        }

        private timesUpdate(): void {
            if (!this._mapId || !DungeonModel.instance.timesTable) return;
            let copyTimes: CopyTimes = DungeonModel.instance.timesTable[this._mapId];
            if (!copyTimes) return;
            //   challengeTotalTimes = 5,			/*挑战总次数*/
            // 	challengeRemainTimes = 6,			/*挑战剩余次数*/
            // 	sweepTotalTimes = 7,			/*扫荡总次数*/
            // 	sweepRemainTimes = 8,			/*扫荡剩余次数*/
            let challengeRemainTimes = copyTimes[CopyTimesFields.challengeRemainTimes];
            let challengeTotalTimes = copyTimes[CopyTimesFields.challengeTotalTimes];
            let sweepRemainTimes = copyTimes[CopyTimesFields.sweepRemainTimes];
            let sweepTotalTimes = copyTimes[CopyTimesFields.sweepTotalTimes];
            let sweepTimes = copyTimes[CopyTimesFields.sweepTimes];/*当天扫荡过的次数*/
            this.petChallengeBtn.gray = this.coinChallengeBtn.gray = false;
            this.coinOpenConditionImg.visible = this.petOpenConditionImg.visible = false;
            this.coinOpenConditionText.visible = this.petOpenConditionText.visible = false;
            this.petChallengeBtn.visible = this.coinChallengeBtn.visible = true;
            if (challengeRemainTimes > 0) {
                this._state = 1;
                this.coinXiaoHaoImg.visible = this.coinXiaoHaoText.visible = false;
                this.petXiaoHaoImg.visible = this.petXiaoHaoText.visible = false;
                this.coinChallengeBtn.label = this.petChallengeBtn.label = `挑战`;
                this.coinTimesTxt.text = this.petTimesTxt.text = `今日挑战次数:${challengeRemainTimes}/${challengeTotalTimes}`;
                if (copyTimes[CopyTimesFields.challengeRemainTimes] > 0 && this._funcIsOpen) {
                    this._btnClip.visible = true;
                    this._btnClip.play();
                    this.coinTimesTxt.visible = this.petTimesTxt.visible = this.remainBgImg.visible = true;
                    this.coinOpenConditionText.visible = this.petOpenConditionText.visible = false;
                    this.coinOpenConditionImg.visible = this.petOpenConditionImg.visible = false;
                } else {
                    this._btnClip.visible = false;
                    this._btnClip.stop();
                    this.coinTimesTxt.visible = this.petTimesTxt.visible = this.remainBgImg.visible = false;
                    this.coinOpenConditionText.visible = this.petOpenConditionText.visible = true;
                    this.coinOpenConditionImg.visible = this.petOpenConditionImg.visible = true;
                    let str = FuncOpenModel.instance.getFuncOpenTipById(this._openId);
                    this.coinOpenConditionText.text = this.petOpenConditionText.text = `${str}`;
                    this.coinOpenConditionImg.width = this.coinOpenConditionText.textWidth + 60;
                    this.petOpenConditionImg.width = this.petOpenConditionText.textWidth + 60;
                    this.coinOpenConditionImg.x = (this.coinBox.width - this.coinOpenConditionImg.width) + 10;
                    this.petOpenConditionImg.x = (this.petBox.width - this.petOpenConditionImg.width) + 10;
                    if (!this._funcIsOpen) {
                        this.petChallengeBtn.visible = this.coinChallengeBtn.visible = false;
                    }
                    else {
                        this.petChallengeBtn.visible = this.coinChallengeBtn.visible = true;
                    }
                }
            }
            else {
                this._state = 2;
                this.coinXiaoHaoImg.visible = this.coinXiaoHaoText.visible = true;
                this.petXiaoHaoImg.visible = this.petXiaoHaoText.visible = true;
                this._coinNum = DailyDungeonModel.instance.getNum(this._mapId, sweepTimes, sweepTotalTimes)[0];
                this.coinXiaoHaoText.text = this.petXiaoHaoText.text = `${this._coinNum}`;
                this.coinChallengeBtn.label = this.petChallengeBtn.label = `扫荡`;
                this.coinTimesTxt.text = this.petTimesTxt.text = `今日扫荡次数:${sweepRemainTimes}/${sweepTotalTimes}`;
                if (copyTimes[CopyTimesFields.sweepRemainTimes] > 0 && this._funcIsOpen) {
                    this._btnClip.visible = true;
                    this._btnClip.play();
                } else {
                    this._btnClip.visible = false;
                    this._btnClip.stop();
                    //扫荡次数为0时提示
                    let key = 61;
                    //let naemeStr = "";
                    if (this._mapId === SCENE_ID.scene_copper_copy) {
                        key = Privilege.copyCopperTicket;
                        //naemeStr = "哥布林王国 ：";
                    }
                    else if (this._mapId === SCENE_ID.scene_zq_copy) {
                        key = Privilege.copyZqTicket;
                        //naemeStr = "泰拉矿场 ：";
                    }
                    else if (this._mapId === SCENE_ID.scene_pet_copy) {
                        key = Privilege.copyPetTicket;
                        //naemeStr = "扭曲的次元空间 ：";
                    }
                    else if (this._mapId === SCENE_ID.scene_xianqi_copy) {
                        key = Privilege.copyRideTicket;
                        //naemeStr = "神之墟 ：";
                    }
                    else if (this._mapId === SCENE_ID.scene_shenbing_copy) {
                        key = Privilege.copySBTicket;
                        //naemeStr = "洛兰深处 ：";
                    }
                    else if (this._mapId === SCENE_ID.scene_wing_copy) {
                        key = Privilege.copyWingTicket;
                        //naemeStr = "苍穹落幕 ：";
                    }
                    else if (this._mapId === SCENE_ID.scene_fashion_copy) {
                        key = Privilege.copyFashionTicket;
                        //naemeStr = "永恒之森 ：";
                    }
                    else if (this._mapId === SCENE_ID.scene_tianzhu_copy) {
                        key = Privilege.copyTianzhuTicket;
                        //naemeStr = "旧忆·诅咒 ：";
                    }
                    else if (this._mapId === SCENE_ID.scene_xilian_copy) {
                        key = Privilege.copyXilianTicket;
                        //naemeStr = "异次元裂缝 ：";
                    } else if (this._mapId === SCENE_ID.scene_guanghuan_copy) {
                        key = Privilege.copyGuanghuanTicket;
                        //naemeStr = "光环副本 ：";
                    }
                    let shuju = PrivilegeCfg.instance.getCopyCiShuByLevelAndType(modules.vip.VipModel.instance.vipLevel, key);
                    //console.log(`${}：`, shuju);
                    if (shuju) {
                        this.coinTimesTxt.text = this.petTimesTxt.text = `svip${shuju[0]}增加扫荡次数:${shuju[1]}`;
                        this.coinTimesTxt.visible = this.petTimesTxt.visible = true;
                        this.petChallengeBtn.gray = this.coinChallengeBtn.gray = true;
                    }
                    else {
                        this.coinTimesTxt.visible = this.petTimesTxt.visible = true;
                        this.petChallengeBtn.gray = this.coinChallengeBtn.gray = true;
                        this.coinTimesTxt.text = this.petTimesTxt.text = `今日扫荡次数:${sweepRemainTimes}/${sweepTotalTimes}`;
                    }
                }
            }

            this.degreeTxt.text = ShilianCfg.instance.getCfgByLv(copyTimes[CopyTimesFields.diffcultLevel])[shilianFields.levelName] + "·" + this._numStrs[copyTimes[CopyTimesFields.star]] + "星";
            // this.cleanBtn.visible = copyTimes[CopyTimesFields.star] > 0;
            this.degreeTxt.color = CommonUtil.getColorByQuality(copyTimes[CopyTimesFields.diffcultLevel]);
            this.coinTxt.text = Math.ceil(copyTimes[CopyTimesFields.maxRecord]) + "";
            //展示奖励
            let items: Array<Items>;
            if (this._mapId === SCENE_ID.scene_pet_copy) {
                items = ShilianCfg.instance.getCfgByLv(copyTimes[CopyTimesFields.diffcultLevel])[shilianFields.petTipAwards];
            }
            else if (this._mapId === SCENE_ID.scene_xianqi_copy) {
                items = ShilianCfg.instance.getCfgByLv(copyTimes[CopyTimesFields.diffcultLevel])[shilianFields.rideTipAwards];
            }
            else if (this._mapId === SCENE_ID.scene_shenbing_copy) {
                items = ShilianCfg.instance.getCfgByLv(copyTimes[CopyTimesFields.diffcultLevel])[shilianFields.shenbingTipAwards];
            }
            else if (this._mapId === SCENE_ID.scene_wing_copy) {
                items = ShilianCfg.instance.getCfgByLv(copyTimes[CopyTimesFields.diffcultLevel])[shilianFields.wingTipAwards];
            }
            else if (this._mapId === SCENE_ID.scene_fashion_copy) {
                items = ShilianCfg.instance.getCfgByLv(copyTimes[CopyTimesFields.diffcultLevel])[shilianFields.fashionTipAwards];
            }
            else if (this._mapId === SCENE_ID.scene_tianzhu_copy) {
                items = ShilianCfg.instance.getCfgByLv(copyTimes[CopyTimesFields.diffcultLevel])[shilianFields.tianzhuTipAwards];
            }
            else if (this._mapId === SCENE_ID.scene_xilian_copy) {
                items = ShilianCfg.instance.getCfgByLv(copyTimes[CopyTimesFields.diffcultLevel])[shilianFields.xilianTipAwards];
            } else if (this._mapId === SCENE_ID.scene_guanghuan_copy) {
                items = ShilianCfg.instance.getCfgByLv(copyTimes[CopyTimesFields.diffcultLevel])[shilianFields.guanghuanTipAwards];
            }
            if (items) {
                for (let i: int = 0, len: int = items.length; i < len; i++) {
                    this._baseItems[i].visible = true;
                    this._baseItems[i].dataSource = [items[i][ItemsFields.itemId], items[i][ItemsFields.count], 0, null];
                }
            }
            for (let i: int = items ? items.length : 0, len: int = this._baseItems.length; i < len; i++) {
                this._baseItems[i].visible = false;
            }
        }

        private funcOpenUpdate(): void {
            this._funcIsOpen = FuncOpenModel.instance.getFuncNeedShow(this._funcId);
        }

        protected setData(value: any): void {
            super.setData(value);
            if (this._data) {
                this._mapId = this._data[0];
                this._openId = this._data[1];
                this.showUI()
            }
        }

        /**
         * showUI
         */
        public showUI() {
            let mapId: int = this._mapId;
            // this._mapId = mapId;
            this.bgImg.skin = `assets/others/daily_dungeon/${mapId}.jpg`;
            if (mapId === SCENE_ID.scene_copper_copy || mapId === SCENE_ID.scene_zq_copy) {    //51金币 61魔力 71精灵 81宠物
                this.coinBox.visible = true;
                this.petBox.visible = false;
                this.coinImg.skin = mapId === SCENE_ID.scene_copper_copy ? "common/icon_tongyong_1.png" : "common/icon_tongyong_10.png";
                this.coinChallengeBtn.addChild(this._btnClip);
                this._btnClip.pos(-6, -16, true);
            } else {
                this.coinBox.visible = false;
                this.petBox.visible = true;
                this.petChallengeBtn.addChild(this._btnClip);
                this._btnClip.pos(-6, -16, true);
            }

            switch (mapId) {
                case SCENE_ID.scene_copper_copy: {
                    this._type = 61;
                    this._funcId = ActionOpenId.copperCopy;
                    this.regGuideSpr(GuideSpriteId.COIN_DUNGEON_CHALLENGE_BTN, this.coinChallengeBtn);
                }
                    break;
                case SCENE_ID.scene_zq_copy: {
                    this._type = 62;
                    this._funcId = ActionOpenId.zqCopy;
                    this.regGuideSpr(GuideSpriteId.ZQ_DUNGEON_CHALLENGE_BTN, this.coinChallengeBtn);
                }
                    break;
                case SCENE_ID.scene_pet_copy: {
                    this._type = 63;
                    this._funcId = ActionOpenId.petCopy;
                    this.regGuideSpr(GuideSpriteId.MAGIC_PET_CHALLENGE_BTN, this.petChallengeBtn);
                }
                    break;
                case SCENE_ID.scene_xianqi_copy: {
                    this._type = 64;
                    this._funcId = ActionOpenId.rideCopy;
                    this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_CHALLENGE_BTN, this.petChallengeBtn);
                }
                    break;
                case SCENE_ID.scene_shenbing_copy: {
                    this._type = Privilege.copySBTicket;
                    this._funcId = ActionOpenId.shenbingCopy;
                }
                    break;
                case SCENE_ID.scene_wing_copy: {
                    this._type = Privilege.copyWingTicket;
                    this._funcId = ActionOpenId.wingCopy;
                }
                    break;
                case SCENE_ID.scene_fashion_copy: {
                    this._type = Privilege.copyFashionTicket;
                    this._funcId = ActionOpenId.fashionCopy;
                }
                    break;
                case SCENE_ID.scene_tianzhu_copy: {
                    this._type = Privilege.copyTianzhuTicket;
                    this._funcId = ActionOpenId.tianzhuCopy;
                }
                    break;
                case SCENE_ID.scene_xilian_copy: {
                    this._type = Privilege.copyXilianTicket;
                    this._funcId = ActionOpenId.xilianCopy;
                }
                    break;
            }
            this._state = 1;
            this.funcOpenUpdate();
            this.timesUpdate();
        }
        // 购买次数( 改版后 不能购买 所以没管这里)
        private addHandler(): void {
            let num = 0;
            let itemId = 0;
            switch (this._mapId) {
                case SCENE_ID.scene_copper_copy: {
                    itemId = 20730005;
                }
                    break;
                case SCENE_ID.scene_zq_copy: {
                    itemId = 20730006;
                }
                    break;
                case SCENE_ID.scene_pet_copy: {
                    itemId = 20730008;
                }
                    break;
                case SCENE_ID.scene_xianqi_copy: {
                    itemId = 20730007;
                }
                    break;
            }
            num = BagModel.instance.getItemCountById(itemId);
            if (num > 0) {
                let date: Array<Protocols.Item> = BagModel.instance.getItemsById(itemId);
                if (date) {
                    modules.bag.BagUtil.openBagItemTip(date[0]);
                } else {
                    WindowManager.instance.openDialog(WindowEnum.VIP_TIMES_ALERT, this._type);
                }
            } else {
                WindowManager.instance.openDialog(WindowEnum.VIP_TIMES_ALERT, this._type);
            }
        }

        // 挑战
        private challengeHandler(): void {
            if (this._state == 1) {
                if (this._mapId === SCENE_ID.scene_copper_copy || this._mapId === SCENE_ID.scene_zq_copy) {
                    if (this.coinChallengeBtn.gray) {
                        return;
                    }
                    if (!DungeonUtil.checkUseTicketBySceneId(this._mapId)) {
                        if (this._funcIsOpen) {
                            DungeonCtrl.instance.reqEnterScene(this._mapId);
                        } else {
                            SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(this._funcId), true);
                        }
                    }
                } else {
                    if (this.petChallengeBtn.gray) {
                        return;
                    }
                    if (!DungeonModel.instance.timesTable) return;
                    let copyTimes: CopyTimes = DungeonModel.instance.timesTable[this._mapId];
                    if (!DungeonUtil.checkUseTicketBySceneId(this._mapId)) {
                        if (this._funcIsOpen) {
                            DungeonCtrl.instance.reqEnterScene(this._mapId, copyTimes[CopyTimesFields.diffcultLevel]);

                        } else {
                            SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(this._funcId), true);
                        }
                    }
                }
            }
            else {
                if (this._mapId === SCENE_ID.scene_copper_copy || this._mapId === SCENE_ID.scene_zq_copy) {
                    if (this.coinChallengeBtn.gray) {
                        return;
                    }
                }
                else {
                    if (this.petChallengeBtn.gray) {
                        return;
                    }
                }
                this.cleanHandler();
            }
        }

        // 扫荡
        private cleanHandler(): void {
            if (!DungeonModel.instance.timesTable) return;
            // if (!DungeonUtil.checkUseTicketBySceneId(this._mapId)) {
            if (this._funcIsOpen) {
                if (modules.player.PlayerModel.instance.ingot >= this._coinNum) {
                    DungeonCtrl.instance.sweepCopy(this._mapId);
                }
                else {
                    CommonUtil.goldNotEnoughAlert();
                }
            } else {
                SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(this._funcId), true);
            }
            // }
        }

        private lookHandler(): void {
            if (!DungeonModel.instance.timesTable) return;
            let copyTimes: CopyTimes = DungeonModel.instance.timesTable[this._mapId];
            if (!copyTimes) return;
            WindowManager.instance.openDialog(WindowEnum.DUNGEON_DEGREE_ALERT, copyTimes);
        }

        private helpHandler(): void {
            if (this._mapId === SCENE_ID.scene_copper_copy) {
                CommonUtil.alertHelp(20008);
            }
            else if (this._mapId === SCENE_ID.scene_zq_copy) {
                CommonUtil.alertHelp(20009);
            }
            else if (this._mapId === SCENE_ID.scene_pet_copy) {
                CommonUtil.alertHelp(20011);
            }
            else if (this._mapId === SCENE_ID.scene_xianqi_copy) {
                CommonUtil.alertHelp(20010);
            }
            else if (this._mapId === SCENE_ID.scene_shenbing_copy) {
                CommonUtil.alertHelp(20057);
            }
            else if (this._mapId === SCENE_ID.scene_wing_copy) {
                CommonUtil.alertHelp(20058);
            }
            else if (this._mapId === SCENE_ID.scene_fashion_copy) {
                CommonUtil.alertHelp(20059);
            }
            else if (this._mapId === SCENE_ID.scene_tianzhu_copy) {
                CommonUtil.alertHelp(20060);
            }
            else if (this._mapId === SCENE_ID.scene_xilian_copy) {
                CommonUtil.alertHelp(20061);
            }
            else if (this._mapId === SCENE_ID.scene_guanghuan_copy) {
                CommonUtil.alertHelp(76012);
            }
        }
    }
}
