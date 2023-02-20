/**单人boss面板*/


///<reference path="../config/scene_copy_single_boss_cfg.ts"/>


namespace modules.single_boss {
    import CustomList = modules.common.CustomList;
    import Event = Laya.Event;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import BtnGroup = modules.common.BtnGroup;
    import SingleBossCopy = Protocols.SingleBossCopy;
    import SingleBossCopyFields = Protocols.SingleBossCopyFields;
    import PlayerModel = modules.player.PlayerModel;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import VipModel = modules.vip.VipModel;
    import PrivilegeCfg = modules.config.PrivilegeCfg;
    import CustomClip = modules.common.CustomClip;
    import scene_copy_single_bossFields = Configuration.scene_copy_single_bossFields;
    import SceneCopySingleBossCfg = modules.config.SceneCopySingleBossCfg;
    import BagUtil = modules.bag.BagUtil;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import MonsterResFields = Configuration.MonsterResFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import sign_itemsFields = Configuration.sign_itemsFields;

    import BaseItem = modules.bag.BaseItem;
    type BossStateInfo = [number, BossState];

    export class SingleBossPanel extends ui.SingleBossViewUI {
        private _list: CustomList;
        private _showIds: Array<any>;
        private _singleBossArray: Array<any>;
        private bossDeadArr: Array<number>;
        private canChallengeArr: Array<number>;
        private _btnGroup: BtnGroup;
        private _sweepClip: CustomClip;
        // 选中的BOSS
        private _selectedBoss: any;
        private _skeletonClip: SkeletonAvatar;
        private _items: Array<BaseItem>;
        private _startPos: Point;
        private _interval: number;
        private _resurrectiontime: number;
        private _challengeCount: number;
        constructor() {
            super()
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }
            if (this._sweepClip) {
                this._sweepClip.removeSelf();
                this._sweepClip.destroy();
                this._sweepClip = null;
            }
            this._skeletonClip = this.destroyElement(this._skeletonClip);
            Laya.timer.clear(this, this.updatetime);
            super.destroy(destroyChild);
        }


        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._showIds = new Array<any>();
            this._singleBossArray = new Array<any>();
            this.bossDeadArr = Array<number>();
            this.canChallengeArr = Array<number>();
            this._interval = 102;
            this._resurrectiontime = null;
            this._challengeCount = null;
            this._list = new CustomList();
            // this._list.scrollDir = 2;
            this._list.width = 255;
            this._list.height = 596;
            this._list.hCount = 1;
            this._list.spaceY = 3;
            this._list.itemRender = SingleBossItem;
            this._list.x = 455;
            this._list.y = 112;
            this.addChild(this._list);
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.singleBoss, this.multiBoss, this.yunMengBoss);
            this._btnGroup.selectedIndex = 1;

            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.pos(260, 660, true);

            this._sweepClip = new CustomClip();
            this.sweepBtn.addChildAt(this._sweepClip, 0);
            this._sweepClip.pos(-5, -16, true);
            this._sweepClip.scale(0.98, 1);
            this._sweepClip.skin = "assets/effect/btn_light.atlas";
            this._sweepClip.frameUrls = [
                "btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png"
                , "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._sweepClip.durationFrame = 5;
            this._sweepClip.play();
            this._sweepClip.visible = false;

            this._items = new Array<BaseItem>();
            for (let i = 0; i < 3; i++) {
                let baseItem = new BaseItem();
                baseItem.pos(210 + i * this._interval, 810);
                baseItem.scale(0.9, 0.9);
                this._items.push(baseItem);
                this.addChild(baseItem);
            }
            this._challengeClip = new CustomClip();
            this.challengeBtn.addChildAt(this._challengeClip, 0);
            this._challengeClip.pos(-5, -16, true);
            this._challengeClip.scale(0.98,1);
            this._challengeClip.skin = "assets/effect/btn_light.atlas";
            this._challengeClip.frameUrls = [
                "btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png"
                , "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._challengeClip.durationFrame = 5;
            this._challengeClip.play();
            this._challengeClip.visible = true;

            this.regGuideSpr(GuideSpriteId.SINGLE_BOSS_TAB_BTN, this.singleBoss);
            this.regGuideSpr(GuideSpriteId.MULTI_BOSS_TAB_BTN, this.multiBoss);
            this.regGuideSpr(GuideSpriteId.SINGLE_BOSS_ITEM0_CHALLENGE_BTN, this.challengeBtn);

        }

        private updateList(): void {
            this._showIds.length = 0;
            this._singleBossArray.length = 0;
            this.bossDeadArr.length = 0;
            this.canChallengeArr.length = 0;

            let singleBossArr: Array<SingleBossCopy> = SingleBossModel.instance.SingleBossCopy;
            let singelDic = SingleBossModel.instance.getSingleBossDic();
            if (singleBossArr == null) return;
            for (let i = 0; i < singleBossArr.length; i++) {
                let singleBossCfg = singelDic.get(singleBossArr[i][SingleBossCopyFields.level]);
                let count: number = singleBossCfg[SingleBossCopyFields.level];

                let bossCfg = SceneCopySingleBossCfg.instance.getCfgByLv(count - 1);
                let bossInfo: BossStateInfo;

                if (PlayerModel.instance.eraLevel >= bossCfg[scene_copy_single_bossFields.eraLevel] && PlayerModel.instance.level >= bossCfg[scene_copy_single_bossFields.actorLevel]) {
                    if (singleBossCfg[SingleBossCopyFields.remainTimes] > 0) {
                        if (GlobalData.serverTime - singleBossCfg[SingleBossCopyFields.reviveTime] > 0) {
                            bossInfo = [count, BossState.challenge];
                        } else {
                            bossInfo = [count, BossState.bossdead];
                        }
                    } else {
                        bossInfo = [count, BossState.withoutcount];
                    }
                } else {
                    bossInfo = [count, BossState.cantchallenge];
                }
                this._showIds.push(bossInfo);
            }
            this._showIds.sort(((l: BossStateInfo, r: BossStateInfo): number => {
                if (l[1] == r[1] && r[1] == BossState.cantchallenge) {
                    return l[0] < r[0] ? -1 : 1
                } else if (r[1] == l[1]) {
                    return l[0] > r[0] ? -1 : 1
                }
                return l[1] < r[1] ? -1 : 1;
            }));
            this._list.datas = this._showIds;
            let vip = VipModel.instance.vipLevel;
            let needVip = PrivilegeCfg.instance.getVipInfoByLevel(vip, Privilege.copySingleSweep);

            if (needVip != null) {
                this.sweepBtn.label = "一键扫荡";
                this.vipTxt.visible = false;
                let flag = SingleBossModel.instance._redDot;
                if (flag == true) {
                    let num: number = 0;
                    let singleBossArr: Array<SingleBossCopy> = SingleBossModel.instance.SingleBossCopy;
                    let singelDic = SingleBossModel.instance.getSingleBossDic();
                    for (let i = 0; i < singleBossArr.length; i++) {
                        let singleBossCfg = singelDic.get(singleBossArr[i][SingleBossCopyFields.level]);
                        let count: number = singleBossCfg[SingleBossCopyFields.level];
                        if (PlayerModel.instance.eraLevel >= count - 1 && singleBossCfg[SingleBossCopyFields.remainTimes] > 0) {
                            if (singleBossCfg[SingleBossCopyFields.reviveTime] > 0 && GlobalData.serverTime - singleBossCfg[SingleBossCopyFields.reviveTime] > 0) {
                                num++;
                            }
                        }
                    }
                    if (num > 0) {
                        this._sweepClip.visible = flag
                    } else {
                        this._sweepClip.visible = false
                    }
                } else {
                    this._sweepClip.visible = false
                }
            } else {
                this.sweepBtn.label = "激活SVIP";
                this.vipTxt.visible = true;

            }
        }

        public onOpened(): void {
            super.onOpened();
            Channel.instance.publish(UserFeatureOpcode.GetSingleBossCopy, null);
            this._sweepClip.play();
            this._challengeClip.play();
            this.updateList();
            CustomList.showListAnim(modules.common.showType.HEIGHT, this._list);
            this._list.selectedIndex = 0;
        }

        public close(): void {
            super.close();
            this._sweepClip.stop();
            this._challengeClip.stop();
            Laya.timer.clear(this, this.updatetime);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sweepBtn, Event.CLICK, this, this.sweepHandler);
            this.addAutoListener(this._btnGroup, Event.CHANGE, this, this.changeHandler);
            this._btnGroup.selectedIndex = 0;
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GET_SINGLE_BOSS, this, this.updateList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_SINGLE_BOSS, this, this.updateList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BORN_UPDATE, this, this.updateList);
            this.addAutoRegisteRedPoint(this.singleBossDot, ["singleBossRP"]);
            this.addAutoRegisteRedPoint(this.multiBossDot, ["multiBossRP"]);
            this.addAutoRegisteRedPoint(this.yunMengBossDot, ["yunMengBossRP"]);
            this.addAutoListener(this._list, Event.SELECT, this, this.selectBossHandler);
            this.addAutoListener(this.challengeBtn, Event.CLICK, this, this.challengeHandler)
        }
        private _cfg: Array<any>;
        private _challengeClip: CustomClip;
        private _awardArr: BossItem;
        public updatetime() {
            this.resurrectionTime.text = "复活时间: " + CommonUtil.timeStampToMMSS(this._resurrectiontime);
            if (this._resurrectiontime - GlobalData.serverTime <= 0) {
                this._selectedBoss = this._list.selectedData;
                this._awardArr.status = this._selectedBoss[1];
                Laya.timer.clear(this, this.updatetime);
            }
        }
        
        private selectBossHandler(): void {
            this._selectedBoss = this._list.selectedData;
            for (const m of this._list.items) {
                (m as SingleBossItem).btnSelected.visible = false;
            }
            (this._list.selectedItem as SingleBossItem).btnSelected.visible = true;
            let count: number = this._selectedBoss[0] as int;
            this._cfg = SceneCopySingleBossCfg.instance.getCfgByLv(count - 1);
            let bossId = this._cfg[scene_copy_single_bossFields.occ];
            let monsterCfg = MonsterResCfg.instance.getCfgById(bossId);

            this._awardArr = new BossItem(this.challengeCount, this.resurrectionTime, this.lockImg, this.challengeBtn, this._challengeClip);
            this._awardArr.status = this._selectedBoss[1];
            this.nameTxt.text = monsterCfg[MonsterResFields.name];
            let singleBossDic = SingleBossModel.instance.getSingleBossDic();
            let single: SingleBossCopy = singleBossDic.get(count);

            if (PlayerModel.instance.eraLevel >= this._cfg[scene_copy_single_bossFields.eraLevel] && PlayerModel.instance.level >= this._cfg[scene_copy_single_bossFields.actorLevel]) {
                this._challengeCount = single[SingleBossCopyFields.remainTimes];
                this.challengeCount.text = this._challengeCount.toString();
            }

            if (this._awardArr.status == BossState.bossdead) {
                Laya.timer.clear(this, this.updatetime);
                Laya.timer.loop(1000, this, this.updatetime);
            }

            this._resurrectiontime = single[SingleBossCopyFields.reviveTime];

            this.eraLvPoint.text = this._cfg[scene_copy_single_bossFields.eraTips] + "开启";
            // let items: Array<Items> = this._selectedBoss[scene_cross_bossFields.tipsJoinAwards];
            // this._joinAward.dataSource = [items[0][ItemsFields.itemId], items[0][ItemsFields.count], 0, null];
            // items = this._selectedBoss[scene_cross_bossFields.tipsKillAwards];
            // this._killAward.dataSource = [items[0][ItemsFields.itemId], items[0][ItemsFields.count], 0, null];
            // items = this._selectedBoss[scene_cross_bossFields.tipsRankAwards];
            // for (let i: int = 0; i < 4; i++) {
            //     this._rankAwards[i].dataSource = [items[i][ItemsFields.itemId], items[i][ItemsFields.count], 0, null];
            // }
            // let bossId: number = this._selectedBoss[scene_cross_bossFields.occ];
            // this.nameTxt.text = MonsterResCfg.instance.getCfgById(bossId)[MonsterResFields.name];
            let tipsAward = this._cfg[scene_copy_single_bossFields.tipsAward];
            for (let i = 0; i < this._items.length; i++) {
                if (i < tipsAward.length) {
                    let baseItem = this._items[i];
                    let item: Protocols.Item = [tipsAward[i][sign_itemsFields.itemId], 0, 0, null];
                    baseItem.dataSource = item;
                }
            }
            this.updateBoss();
            let id: number = monsterCfg[MonsterResFields.res];
            this._skeletonClip.reset(id);
        }

        private challengeHandler(): void {
            let type = this._awardArr.status;
            switch (type) {
                case BossState.challenge: {

                    // let restNum = BagModel.instance.getBagEnoughById(1);
                    // let isShow: boolean = !(restNum > BlendCfg.instance.getCfgByTypeAndId(10007)[blendFields.intParam][0]);

                    if (BagUtil.checkNeedSmeltTip()) {
                        // CommonUtil.alert("温馨提示","装备背包格子不足，是否一键熔炼", true, Handler.create(BagModel.instance, BagModel.instance.quicklyOneKeySmelt));
                    } else {
                        DungeonCtrl.instance.reqEnterScene(this._cfg[scene_copy_single_bossFields.mapId], this._cfg[scene_copy_single_bossFields.level]);
                        //新手引导状态 第一次挑战 需要延迟关闭面板
                        // if (this.index === 0) {
                        //     Laya.timer.once(500, this, (): void => {
                            
                        //     })
                        // }
                    }
                    break;
                }
                case BossState.bossdead: {
                    SystemNoticeManager.instance.addNotice("BOSS已死亡，等待复活继续挑战", true);
                    break;
                }
                case BossState.cantchallenge: {
                    // SystemNoticeManager.instance.addNotice("抓生等级不足", "#00ff00");
                    break;
                }
                case BossState.withoutcount: {
                    // if(!dungeon.DungeonUtil.checkUseTicketBySceneType(SceneTypeEx.singleBossCopy, this._cfg[scene_copy_single_bossFields.level])){
                    SystemNoticeManager.instance.addNotice("Boss挑战次数不足", true);
                    // }
                    break;
                }
            }
        }

        private selectBossModel(): void {
            
        }

        private updateBoss() {

        }

        protected sweepHandler() {
            let vip = VipModel.instance.vipLevel;
            let needVip = PrivilegeCfg.instance.getVipInfoByLevel(vip, Privilege.copySingleSweep);
            // Privilege.copySingleSweep;
            if (needVip != null) {

                // let restNum = BagModel.instance.getBagEnoughById(1);
                // let isShow: boolean = !(restNum > BlendCfg.instance.getCfgByTypeAndId(10007)[blendFields.intParam][0]);

                if (BagUtil.checkNeedSmeltTip()) {
                    // CommonUtil.alert("温馨提示","装备背包格子不足，是否一键熔炼", true, Handler.create(BagModel.instance, BagModel.instance.quicklyOneKeySmelt));
                } else {
                    DungeonCtrl.instance.sweepCopy(2031);
                }
            } else {
                let intNum = 0;
                if (modules.vip.VipModel.instance.vipLevel >= 1) {
                    intNum = WindowEnum.VIP_PANEL;
                }
                else {
                    intNum = WindowEnum.VIP_NEW_PANEL;
                }
                let handler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.open, [intNum]);
                CommonUtil.alert("温馨提示", `一键扫荡需要SVIP${2},是否立即前往提升SVIP`, [handler]);
            }
        }

        private changeHandler(): void {
            if (this._btnGroup.selectedIndex === 1) {
                WindowManager.instance.open(WindowEnum.MULTI_BOSS_PANEL);
                this._btnGroup.selectedIndex = 0;
            } else if (this._btnGroup.selectedIndex === 2) {
                WindowManager.instance.open(WindowEnum.YUNMENGMIJING_PANLE);
                this._btnGroup.selectedIndex = 0;
            }
        }

    }

}