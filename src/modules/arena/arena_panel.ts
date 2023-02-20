/** 竞技场面板*/



namespace modules.arena {
    import ArenaCtrl = modules.arena.ArenaCtrl;
    import ArenaTimes = Protocols.ArenaTimes;
    import ArenaObj = Protocols.ArenaObj;
    import ArenaViewUI = ui.ArenaViewUI;
    import LayaEvent = modules.common.LayaEvent;
    import ArenaTimesFields = Protocols.ArenaTimesFields;
    import ArenaObjFields = Protocols.ArenaObjFields;
    // import AvatarClip = modules.common.AvatarClip;
    import ActorRankShow = Protocols.ActorRankShow;
    import ActorRankShowFields = Protocols.ActorRankShowFields;
    import FontClip = Laya.FontClip;
    import arenaFields = Configuration.arenaFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import Rectangle = Laya.Rectangle;
    import CustomClip = modules.common.CustomClip;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class ArenaPanel extends ArenaViewUI {
        // private _avatar1: AvatarClip;
        // private _avatar2: AvatarClip;
        // private _avatar3: AvatarClip;
        private _skeletonClip1: SkeletonAvatar;
        private _skeletonClip2: SkeletonAvatar;
        private _skeletonClip3: SkeletonAvatar;

        private _skeletonClips: Array<SkeletonAvatar>;
        // private _avatars: Array<AvatarClip>;
        private _nameTxts: Array<Laya.Text>;
        private _rankClips: Array<FontClip>;
        private _rankImgs: Array<Laya.Image>;
        private _fightClips: Array<FontClip>;
        private _rankXArr: Array<number>;
        private _attClip1: CustomClip;
        private _attClip2: CustomClip;
        private _attClip3: CustomClip;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = this.centerY = 0;

            this.cdTxt.text = "";


            this._skeletonClip1 = SkeletonAvatar.createShow(this, this, 3);
            this._skeletonClip1.pos(146, 500, true);
            this._skeletonClip1.scale(0.5, 0.5);

            this._skeletonClip2 = SkeletonAvatar.createShow(this, this, 3);
            this._skeletonClip2.pos(346, 370, true);
            this._skeletonClip2.scale(0.5, 0.5);

            this._skeletonClip3 = SkeletonAvatar.createShow(this, this, 3);
            this._skeletonClip3.pos(552, 500, true);
            this._skeletonClip3.scale(0.5, 0.5);

            this._skeletonClips = [this._skeletonClip1, this._skeletonClip2, this._skeletonClip3];

            // this._avatar1 = AvatarClip.create(1024, 1024, 1024, false);
            // this.addChildAt(this._avatar1, 3);
            // this._avatar1.pos(146, 540, true);
            // this._avatar1.anchorX = 0.5;
            // this._avatar1.anchorY = 0.5;
            // this._avatar1.avatarRotationY = 180;
            // this._avatar1.hitArea = new Rectangle(-100 + this._avatar1.pivotX, -200 + this._avatar1.pivotY, 200, 200);

            // this._avatar2 = AvatarClip.create(1024, 1024, 1024, false);
            // this.addChildAt(this._avatar2, 3);
            // this._avatar2.pos(366, 400, true);
            // this._avatar2.anchorX = 0.5;
            // this._avatar2.anchorY = 0.5;
            // this._avatar2.avatarRotationY = 180;
            // this._avatar2.hitArea = new Rectangle(-100 + this._avatar2.pivotX, -200 + this._avatar2.pivotY, 200, 200);

            // this._avatar3 = AvatarClip.create(1024, 1024, 1024, false);
            // this.addChildAt(this._avatar3, 3);
            // this._avatar3.pos(582, 540, true);
            // this._avatar3.anchorX = 0.5;
            // this._avatar3.anchorY = 0.5;
            // this._avatar3.avatarRotationY = 180;
            // this._avatar3.hitArea = new Rectangle(-100 + this._avatar3.pivotX, -200 + this._avatar3.pivotY, 200, 200);

            // this._avatars = [this._avatar1, this._avatar2, this._avatar3];
            this._nameTxts = [this.nameTxt1, this.nameTxt2, this.nameTxt3];
            this._rankClips = [this.rankClip1, this.rankClip2, this.rankClip3];
            this._rankImgs = [this.rankImg1, this.rankImg2, this.rankImg3];
            this._fightClips = [this.fightClip1, this.fightClip2, this.fightClip3];
            this._rankXArr = [146, 346, 552];

            this._attClip1 = CommonUtil.creatEff(this, `fight_effect`, 5);
            this._attClip1.pos(90, 430, true);
            this._attClip2 = CommonUtil.creatEff(this, `fight_effect`, 5);
            this._attClip2.pos(295, 300, true);
            this._attClip3 = CommonUtil.creatEff(this, `fight_effect`, 5);
            this._attClip3.pos(500, 435, true);
            this._attClip1.scale(1.5, 1.5, true);
            this._attClip2.scale(1.5, 1.5, true);
            this._attClip3.scale(1.5, 1.5, true);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.honorBtn, LayaEvent.CLICK, this, this.honorHandler);
            this.addAutoListener(this.recordsBtn, LayaEvent.CLICK, this, this.recordsHandler);
            this.addAutoListener(this.rankBtn, LayaEvent.CLICK, this, this.rankHandler);
            this.addAutoListener(this.addBtn, LayaEvent.CLICK, this, this.addHandler);
            this.addAutoListener(this.resetCDBtn, LayaEvent.CLICK, this, this.resetCDHandler);
            this.addAutoListener(this.refreshBtn, LayaEvent.CLICK, this, this.refreshHandler);
            this.addAutoListener(this._attClip1, LayaEvent.CLICK, this, this.avatarClickHandler, [0]);
            this.addAutoListener(this._attClip2, LayaEvent.CLICK, this, this.avatarClickHandler, [1]);
            this.addAutoListener(this._attClip3, LayaEvent.CLICK, this, this.avatarClickHandler, [2]);
            this.addAutoListener(this.ladderBtn, LayaEvent.CLICK, this, this.ladderHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ARENA_TIMES_UPDATE, this, this.updateTimes);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ARENA_OBJS_UPDATE, this, this.updateObjs);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_FIGHT, this, this.updateFight);
            this.addAutoRegisteRedPoint(this.tianTiRP, ["tianTiRP"]);
            this.addAutoRegisteRedPoint(this.jingjiRP, ["arenaRP"]);
        }
        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.loopHandler);
        }
        protected onOpened(): void {
            super.onOpened();

            ArenaCtrl.instance.getArena();

            this.updateTimes();
            this.updateObjs();
            this.updateFight();


            this._attClip1.play();
            this._attClip2.play();
            this._attClip3.play();
        }

        // 更新次数
        private updateTimes(): void {
            let times: ArenaTimes = ArenaModel.instance.arenaTimes;
            if (!times) return;
            let count: number = times[ArenaTimesFields.remainTimes];
            this.timesTxt.text = `${count}/${times[ArenaTimesFields.totalTimes]}`;
            this.timesTxt.color = count > 0 ? `#e36d6d` : `#ff3e3e`;
            this.maxRankTxt.text = `${times[ArenaTimesFields.bestRank]}`;
            if (times[ArenaTimesFields.reEnterTime] > GlobalData.serverTime) {
                Laya.timer.loop(1000, this, this.loopHandler);
                this.cdTxt.visible = this.resetCDBtn.visible = true;
                this.refreshBtn.visible = false;
                this.loopHandler();
            } else {
                this.cdTxt.visible = this.resetCDBtn.visible = false;
                this.refreshBtn.visible = true;
                Laya.timer.clear(this, this.loopHandler);
            }
        }

        // 更新挑战对象
        private updateObjs(): void {
            let objs: Array<ArenaObj> = ArenaModel.instance.objs;
            if (!objs) return;
            let mineObj: ArenaObj = objs[3];

            //自己的东西
            let rank: number = mineObj[ArenaObjFields.rank];
            this.curRankTxt.text = `${rank}`;
            let awards: Array<Items> = ArenaCfg.instance.getCfgByRank(rank)[arenaFields.dailyItems];
            this.item1.dataSource = [awards[0][ItemsFields.itemId], awards[0][ItemsFields.count], 0, null];
            this.item2.dataSource = [awards[1][ItemsFields.itemId], awards[1][ItemsFields.count], 0, null];

            for (let i: int = 0, len: int = objs.length - 1; i < len; i++) {
                let obj: ArenaObj = objs[i];
                let show: ActorRankShow = obj[ArenaObjFields.show];
                // this._avatars[i].reset(show[ActorRankShowFields.fashion], show[ActorRankShowFields.shenbing]);
                this._skeletonClips[i].reset(show[ActorRankShowFields.fashion], show[ActorRankShowFields.shenbing]);
                this._nameTxts[i].text = obj[ArenaObjFields.name];
                this._rankClips[i].value = `${obj[ArenaObjFields.rank]}`;
                this._fightClips[i].value = `${obj[ArenaObjFields.fight]}`;
                let tmpW: number = this._rankClips[i].value.length * 38 * 0.6;
                this._rankClips[i].x = this._rankXArr[i] - (tmpW + 27) * 0.5;
                this._rankImgs[i].x = this._rankClips[i].x + tmpW - 5;
            }
        }

        // 更新战力
        private updateFight(): void {
            this.myFightTxt.text = `${PlayerModel.instance.fight}`;
        }

        // 购买次数
        private addHandler(): void {
            WindowManager.instance.openDialog(WindowEnum.VIP_TIMES_ALERT, Privilege.copyArenaTicket);
        }

        // 重置cd
        private resetCDHandler(): void {
            let times: ArenaTimes = ArenaModel.instance.arenaTimes;
            if (!times) return;
            // 计算价格
            let price: number = BlendCfg.instance.getCfgById(37002)[blendFields.intParam][0];
            price = price * Math.ceil((times[ArenaTimesFields.reEnterTime] - GlobalData.serverTime) * 0.001);
            CommonUtil.alert("提示", `消除CD需要消耗<img src="${CommonUtil.getIconById(MoneyItemId.glod, true)}" width="40" height="40"/>${price}，是否消除？`, [Handler.create(this, this.confirmResetCDHandler)]);
        }

        private confirmResetCDHandler(): void {
            ArenaCtrl.instance.resetEnterCD();
        }

        // 荣誉商店
        private honorHandler(): void {
            WindowManager.instance.open(WindowEnum.HONOR_STORE_PANEL);
        }

        // 竞技记录
        private recordsHandler(): void {
            WindowManager.instance.open(WindowEnum.ARENA_RECORDS_ALERT);
        }

        // 竞技场排行
        private rankHandler(): void {
            WindowManager.instance.open(WindowEnum.ARENA_RANK_ALERT);
        }

        // 刷新挑战对象
        private refreshHandler(): void {
            ArenaCtrl.instance.flushArena();
        }

        private loopHandler(): void {
            let timeStamp: number = ArenaModel.instance.arenaTimes[ArenaTimesFields.reEnterTime];
            if (timeStamp > GlobalData.serverTime) {
                this.cdTxt.text = CommonUtil.msToHHMMSS(timeStamp - GlobalData.serverTime);
                this.cdTxt.visible = this.resetCDBtn.visible = true;
                this.refreshBtn.visible = false;
            } else {
                this.cdTxt.visible = this.resetCDBtn.visible = false;
                this.refreshBtn.visible = true;
                Laya.timer.clear(this, this.loopHandler);
            }
        }

        // 点击挑战对象
        private avatarClickHandler(index: int): void {
            let objs: Array<ArenaObj> = ArenaModel.instance.objs;
            if (!objs) return;
            ArenaCtrl.instance.challengeArena(objs[index][ArenaObjFields.objId]);
        }

        // 天梯跳转
        private ladderHandler(): void {
            WindowManager.instance.open(WindowEnum.LADDER_PANEL);
        }

        public close(): void {
            super.close();
            this._attClip1.stop();
            this._attClip2.stop();
            this._attClip3.stop();
        }

        destroy(destroyChild: boolean = true): void {
            // this._avatar1 = this.destroyElement(this._avatar1);
            // this._avatar2 = this.destroyElement(this._avatar2);
            // this._avatar3 = this.destroyElement(this._avatar3);
            // this._avatars = null;
            this._skeletonClip1 = this.destroyElement(this._skeletonClip1);
            this._skeletonClip2 = this.destroyElement(this._skeletonClip2);
            this._skeletonClip3 = this.destroyElement(this._skeletonClip3);
            this._skeletonClips = null;
            this._nameTxts = null;
            this._rankClips = null;
            this._rankImgs = null;
            this._fightClips = null;
            this._rankXArr = null;
            super.destroy(destroyChild);
        }
    }
}