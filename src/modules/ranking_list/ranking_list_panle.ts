///<reference path="../config/lilian_rise_cfg.ts"/>
///<reference path="../faction/faction_rank_list_item.ts"/>
namespace modules.rankingList {
    import FactionCtrl = modules.faction.FactionCtrl;
    import FactionRankListItem = modules.faction.FactionRankListItem;
    import FactionModel = modules.faction.FactionModel;
    import Event = laya.events.Event;
    // import AvatarClip = modules.common.AvatarClip;
    import CustomList = modules.common.CustomList;
    import AmuletRiseCfg = modules.config.AmuletRiseCfg;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import LilianRiseCfg = modules.config.LilianRiseCfg;
    import XianweiRiseCfg = modules.config.XianweiRiseCfg;
    import PlayerModel = modules.player.PlayerModel;
    import Rank = Protocols.Rank;
    import RankingListViewUI = ui.RankingListViewUI;
    import RankFields = Protocols.RankFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import PetMagicShowCfg = modules.config.PetMagicShowCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import RideMagicShowCfg = modules.config.RideMagicShowCfg;
    import ExteriorSK = Configuration.ExteriorSK;
    import FactionRankShow = Protocols.FactionRankShow;
    import FactionRankShowFields = Protocols.FactionRankShowFields;
    import FactionRank = Protocols.FactionRank;
    import FactionRankFields = Protocols.FactionRankFields;
    import CommonUtil = modules.common.CommonUtil;
    import GetActorRankShowReplyFields = Protocols.GetActorRankShowReplyFields;
    import ActorRankShowFields = Protocols.ActorRankShowFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    export class RankListPlane extends RankingListViewUI {
        private _list: CustomList;
        private _rankList: CustomList;
        // private _avatar: AvatarClip;
        private _tweenAvatar: TweenJS;
        private _factionList: CustomList;
        private _skipType: RankType;
        private _skeletonClip: SkeletonAvatar;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._rankList) {
                this._rankList.removeSelf();
                this._rankList.destroy();
                this._rankList = null;
            }
            // if (this._avatar) {
            //     this._avatar.removeSelf();
            //     this._avatar.destroy();
            //     this._avatar = null;
            // }
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            if (this._factionList) {
                this._factionList.removeSelf();
                this._factionList.destroy();
                this._factionList = null;
            }
            if (this._tweenAvatar) {
                // this._tweenAvatar.stop();
                this._tweenAvatar = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = this.centerY = 0;

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.width = 180;
            this._list.height = 475;
            this._list.hCount = 1;
            this._list.spaceY = 0;
            this._list.selectedIndex = 0;
            this._list.itemRender = RankingListBtn;
            this._list.datas = [
                RankType.fight,
                RankType.level,
                RankType.faction,
                RankType.petFight,
                RankType.rideFight,
                RankType.shenbingFight,
                RankType.wingFight,
                RankType.magicWeaponFight,
                RankType.lilianGrade,
                RankType.xianweiGrade,
                RankType.equipFight,
            ];
            this._list.x = 15;
            this._list.y = 615;
            this.addChild(this._list);

            // this._avatar = AvatarClip.create(1024, 1024, 768);
            // this._avatar.anchorX = 0.5;
            // this._avatar.anchorY = 0.5;
            // this._tweenAvatar = TweenJS.create(this._avatar);
            // this.addChildAt(this._avatar, 4);
            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.pos(368, 460);
            this._skeletonClip.scale(0.8, 0.8, true);

            this._rankList = new CustomList();
            this._rankList.scrollDir = 1;
            this._rankList.width = 500;
            this._rankList.height = 432;
            this._rankList.hCount = 1;
            this._rankList.vCount = 1;
            this._rankList.spaceY = 3;
            this._rankList.pos(196, 620);
            this._rankList.itemRender = PlayerRankingItem;
            this.addChild(this._rankList);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._list, Event.SELECT, this, this.selectTypeHandler);
            this.addAutoListener(this.rulerBtn, common.LayaEvent.CLICK, this, this.showRuler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_RANK_LIST, this, this.updateFactionShow);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GET_ACTOR_RANK_DATA_REPLY, this, this.updateDataPlane);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GET_ACTOR_RANK_SHOW_REPLY, this, this.updateshowplane);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RANK_UPDATE, this, this.updateRank);
        }

        protected removeListeners(): void {
            Laya.timer.clear(this, this.showAvatar);
            super.removeListeners();
        }

        public close(): void {
            this.stopAvatar();
            super.close();
        }

        protected onOpened() {
            super.onOpened();
            FactionCtrl.instance.getFactionRankList();
            if (this._skipType == RankType.faction) {
                this._list.selectedData = RankType.faction;
            } else {
                this._list.selectedIndex = 0;
            }
        }

        protected setOpenParam(skipType: RankType): void {
            super.setOpenParam(skipType);

            this._skipType = skipType;
        }

        private updateFactionShow(): void {
            if (this._list.selectedData != RankType.faction) return;
            // this._avatar.visible = this.showOthers = false;
            this._skeletonClip.visible = this.showOthers = false;
            let leaderInfo: FactionRankShow = FactionModel.instance.rankFirst;
            this.myranktxt.text = `按公会战力进行排名`;
            let max: number = 5;
            if (!leaderInfo) {
                this.creatFactionList();
                this.showFaction = false;
                this.vipBg.visible = false;
                this.firstvipnum.visible = this._factionList.visible = true;
                this.firstplayernametxt.text = `虚位以待···`;

                let _rankDate = new Array<Array<number>>();
                for (var index = 2; index <= max; index++) {
                    _rankDate.push([RankType.faction, index]);
                }
                this._factionList.datas = _rankDate;
                return;
            }
            let list: FactionRank[] = FactionModel.instance.ranklist.concat();
            this.leaderTxt.text = `会长:${leaderInfo[FactionRankShowFields.name]}`;
            let fight: string = CommonUtil.bigNumToString(list[0][FactionRankFields.fight]);
            this.factionFightTxt.text = fight;
            this.firstplayernametxt.text = `${list[0][FactionRankFields.name]} Lv.${list[0][FactionRankFields.level]}`;
            list.shift();
            this.creatFactionList();
            // this.setSVIPandVIP(leaderInfo[FactionRankShowFields.vipf], leaderInfo[FactionRankShowFields.vip]);

            let w = this.firstplayernametxt.textWidth;
            let posx = (this.width - w) / 2;
            this.firstplayernametxt.x = posx;


            this.firstplayernametxt.visible = true;
            let _rankDate = new Array<Array<number>>();
            for (var index = 2; index <= max; index++) {
                _rankDate.push([RankType.faction, index]);
            }
            this._factionList.datas = _rankDate;

            let shenbing: number = leaderInfo[FactionRankShowFields.sbId];
            let xianqi: number = leaderInfo[FactionRankShowFields.rideId];
            let xianyi: number = leaderInfo[FactionRankShowFields.wingId];
            let occ: number = leaderInfo[FactionRankShowFields.occ];
            let clothes: number = leaderInfo[FactionRankShowFields.fashionId];

            this._skeletonClip.reset(clothes, shenbing, xianyi);
            this.showAvatar();
        }

        private creatFactionList(): void {
            if (!this._factionList) {
                this._factionList = new CustomList();
                this._factionList.scrollDir = 1;
                this._factionList.width = 497;
                this._factionList.height = 432;
                this._factionList.hCount = 1;
                this._factionList.vCount = 1;
                this._factionList.pos(191, 635);
                this._factionList.itemRender = FactionRankListItem;
                this.addChild(this._factionList);
            }
        }

        protected selectTypeHandler(): void {
            let data: RankType = PlayerRankingModel.instance.selectedRankType = this._list.selectedData;
            this.showOthers = true;
            // this._avatar.visible = false;
            this._skeletonClip.visible = false;
            Laya.timer.clear(this, this.showAvatar);
            if (data != RankType.faction) {
                PlayerRankingCtrl.instance.getRank(data);
            } else {
                this.updateFactionShow();
            }
        }

        private set showFaction(b: boolean) {
            this.leaderBox.visible = this.factionFightBox.visible = b;
            if (this._factionList) {
                this._factionList.visible = b;
            }
        }

        private set showOthers(b: boolean) {
            this.nameimage.visible = this.firstplayervalue.visible = this.tupleFontClip.visible = this.amulet.visible = this.levelImg.visible = this.leveltxt.visible =
                this.vipBg.visible = this.chongImg.visible = this.nameBox.visible = this.firstvipnum.visible = this.fightBgImg.visible = this._rankList.visible = b;
            this.showFaction = !b;
        }

        private showRuler(): void {
            CommonUtil.alertHelp(20019);
        }

        private updateRank(): void {
            let type: RankType = this._list.selectedData;
            let ranks: Array<Rank> = PlayerRankingModel.instance.getRanksByType(type);
            if (!ranks) return;
            let max: number = BlendCfg.instance.getCfgById(401)[blendFields.intParam][0];//排行最大显示个数

            //修改
            let _rankDate = new Array<Array<number>>();
            for (var index = 2; index <= max; index++) {
                _rankDate.push([type, index]);
            }
            this._rankList.datas = _rankDate;
            //原始
            // let arr: Array<Rank> = [];
            // for (let i: int = 1, len: int = ranks.length <= max ? ranks.length : max; i < len; i++) {
            //     arr[i - 1] = ranks[i];
            // }
            // for (let i: int = ranks.length; i < max; i++) {        // 不足配置数量凑一下
            //     arr[i - 1] = [0, 0, null, 0, i + 1, 0];
            // }

            // this._rankList.datas = arr;

            this.chongImg.visible = this.tupleFontClip.visible = this.nameimage.visible = this.levelImg.visible = this.leveltxt.visible = false;

            this.myranktxt.text = "我的排名:未上榜";

            if (ranks.length === 0) {
                this.stopAvatar();
                this.nameBox.visible = this.amulet.visible = false;
                // this._avatar.visible = false;
                this._skeletonClip.visible = false;
                this.firstplayervalue.visible = false;
                this.vipBg.visible = this.firstvipnum.visible = false;
                this.firstplayernametxt.text = "虚位以待...";
                this.fightBgImg.visible = false;
                return;
            }
            this.fightBgImg.visible = true;
            this.firstplayervalue.visible = true;
            this.vipBg.visible = this.firstvipnum.visible = true;

            // Channel.instance.publish(UserCenterOpcode.GetActorRankShow, [rank[0][Protocols.RankFields.objId]]);

            let info: Rank = PlayerRankingModel.instance.getRanksByTypeAndMingCi(type, 1);
            if (!info) {
                return;
            }
            PlayerRankingCtrl.instance.getActorRankShow(info[RankFields.objId]);
            if (type === RankType.lilianGrade || type === RankType.xianweiGrade || type === RankType.level) {
                // let rank1: Array<Rank> = PlayerRankingModel.instance.tuple[Protocols.GetRankReplyFields.RankList][0][Protocols.RankListFields.ranks];
                // Channel.instance.publish(UserCenterOpcode.GetActorRankShow, [rank1[0][Protocols.RankFields.objId]]);
                // PlayerRankingCtrl.instance.getActorRankShow(info[RankFields.objId]);
                let firstid: number = info[RankFields.objId];
                if (type === (RankType.lilianGrade)) {
                    this.getlilianSourceByParam(info[RankFields.param]);
                    this.firstplayernametxt.text = info[RankFields.name];
                } else if (type === RankType.xianweiGrade) {
                    this.getxianweisourceByParam(info[Protocols.RankFields.param]);
                    this.firstplayernametxt.text = info[Protocols.RankFields.name];
                } else {
                    let str: string = PlayerRankingItem.getDateByType(type, info[Protocols.RankFields.param]);
                    PlayerRankingCtrl.instance.getActorRankData(firstid, RankType.fight);
                    this.firstplayernametxt.text = info[Protocols.RankFields.name];
                    this.leveltxt.text = str + "级";
                    this.levelImg.visible = this.leveltxt.visible = true;
                }
                let myrank: number = PlayerRankingModel.instance.actorrank(ranks, PlayerModel.instance.actorId)[0];
                if (myrank != 0) {
                    this.myranktxt.text = "我的排名:" + "第" + myrank.toString() + "名";
                }

                this.firstplayernametxt.valign = "middle";
                // this.firstvipnum.value = `${info[Protocols.RankFields.vip]}`;
                this.setSVIPandVIP(info[Protocols.RankFields.vipF], info[Protocols.RankFields.vip]);
            } else {
                this.firstplayernametxt.text = info[Protocols.RankFields.name];
                this.firstplayervalue.value = info[Protocols.RankFields.param].toString();
                // this.firstvipnum.value = `${info[Protocols.RankFields.vip]}`;
                this.setSVIPandVIP(info[Protocols.RankFields.vipF], info[Protocols.RankFields.vip]);
                let myrank: number = PlayerRankingModel.instance.actorrank(ranks, PlayerModel.instance.actorId)[0];
                if (myrank != 0) {
                    this.myranktxt.text = "我的排名:" + "第" + myrank.toString() + "名";
                }
            }
            // let w: number = this.firstvipnum.value.length * 35 * 0.7;
            // let initX: number = (this.width - w - this.firstplayernametxt.width) / 2;
            // this.firstvipnum.x = initX;
            // this.firstplayernametxt.x = initX + w + 8;
        }
        /**
           * 设置SVIP和VIP  初步处理
           */
        public setSVIPandVIP(vip: number, svip: number) {
            if (svip >= 1) {
                this.vipBg.skin = `common/image_common_svip.png`;
                this.firstvipnum.skin = `common/num_common_svip.png`;
                this.firstvipnum.sheet = `0123456789`;
                this.firstvipnum.value = svip.toString();
                this.firstvipnum.x = 65;
            }
            else {
                this.vipBg.skin = `common/image_common_vip.png`;
                this.firstvipnum.skin = `common/num_common_vip.png`;
                this.firstvipnum.sheet = `0123456789`;
                this.firstvipnum.value = vip.toString();
                this.firstvipnum.x = 61;
            }
            this.vipBg.visible = this.firstvipnum.visible = true;
            let w = this.vipBg.width + this.firstplayernametxt.textWidth;
            let posx = (this.width - w) / 2;
            this.vipBg.x = posx;
            this.firstplayernametxt.x = this.vipBg.x + this.vipBg.width;
        }
        private updateshowplane(): void {
            Laya.timer.clear(this, this.showAvatar);
            let showtuple: Protocols.GetActorRankShowReply = PlayerRankingModel.instance.rankShowRely;
            this.getShowRank(showtuple);
        }

        private updateDataPlane(): void {
            let showdata: Protocols.GetActorRankDataReply = PlayerRankingModel.instance.RankData;
            this.getRankData(showdata);
        }

        //根据数据获取资源
        private getlilianSourceByParam(param: number): void {
            let level: number = Math.floor(param / 100);
            if (level != 0) {
                this.nameimage.visible = true;
                this.nameimage.skin = `assets/icon/ui/lilian/${level}.png`;
                this.nameimage.centerX = 0;
            }
            let tuple: number = Math.floor(param % 100);
            if (tuple != 0) {
                this.tupleFontClip.visible = true;
                this.chongImg.visible = true;
                if (tuple == 10) {
                    tuple = 0;
                }
                this.tupleFontClip.value = tuple.toString();
            }
            let lilianrise: Configuration.lilian_rise = LilianRiseCfg.instance.getLilianRiseCfgByRiseLevel(param);
            this.firstplayervalue.value = lilianrise[Configuration.lilian_riseFields.fighting].toString();
        }

        private getxianweisourceByParam(param: number): void {

            if (param == 0) {
                // console.log("=================成就未开启");
                let fighting: number = 0;
                this.firstplayervalue.value = fighting.toString();
            } else {
                this.nameimage.visible = true;
                let xianweicfg: Configuration.xianwei_rise = XianweiRiseCfg.instance.getXianweiRiseByLevel(param);
                let fight: number = xianweicfg[Configuration.xianwei_riseFields.fighting];
                let resName = xianweicfg[Configuration.xianwei_riseFields.resName];
                this.nameimage.skin = `assets/icon/ui/position_name/${resName}.png`;
                this.firstplayervalue.value = fight.toString();
                this.nameimage.centerX = 0;
            }
        }

        private getShowRank(showtuple: Protocols.GetActorRankShowReply): void {
            //this.removeSource();
            let act: Protocols.ActorRankShow = showtuple[GetActorRankShowReplyFields.show];
            let occ: number = act[ActorRankShowFields.occ];
            let petStar: number = act[ActorRankShowFields.petStar];
            let rideStar: number = act[ActorRankShowFields.rideStar];

            // this.stopAvatar();
            this.nameBox.visible = this.amulet.visible = false;
            // this._avatar.visible = false;
            // this._avatar.avatarRotationY = 180;
            // this._avatar.avatarRotationX = 0;
            // this._avatar.avatarScale = 1;
            // this._avatar.avatarY = 0;
            // this._avatar.avatarX = 0;

            let clothes: number = act[ActorRankShowFields.fashion];
            let shenbing: number = act[Protocols.ActorRankShowFields.shenbing];
            let wing: number = act[Protocols.ActorRankShowFields.wing];
            let immortal: number = act[Protocols.ActorRankShowFields.ride];

            this._skeletonClip.visible = true;
            this._skeletonClip.clearAllResetParams(ClearSkeletonParamsEnum.All);
            this._skeletonClip.reset(0,0,0,0,0,0,0)
            this._skeletonClip.pos(368, 497);
            switch (this._list.selectedData) {
                case RankType.fight:       //战力榜
                    // this._avatar.pos(368, 497);
                    // this._avatar.reset(clothes, act[Protocols.ActorRankShowFields.shenbing], act[Protocols.ActorRankShowFields.wing], act[Protocols.ActorRankShowFields.ride]);
                    // Laya.timer.once(300, this, this.showAvatar);
                    // this.showAvatar();
                    this._skeletonClip.reset(clothes, shenbing, wing);
                    this._skeletonClip.resetOffset(AvatarAniBigType.wing, -180, -30);
                    CustomList.showListAnim(modules.common.showType.HEIGHT,this._rankList);
                    break;
                case RankType.level:       //等级榜
                    // this._avatar.pos(368, 512);
                    // this._avatar.reset(clothes, act[Protocols.ActorRankShowFields.shenbing], act[Protocols.ActorRankShowFields.wing], act[Protocols.ActorRankShowFields.ride]);
                    // this.showAvatar();
                    this._skeletonClip.reset(clothes, shenbing, wing);
                    this._skeletonClip.resetOffset(AvatarAniBigType.wing, -180, -30);
                    CustomList.showListAnim(modules.common.showType.HEIGHT,this._rankList);
                    break;
                case RankType.equipFight:       //装备榜   //显示时装,幻武，翅膀
                    // this._avatar.pos(368, 497);
                    // this._avatar.reset(clothes, act[Protocols.ActorRankShowFields.shenbing], act[Protocols.ActorRankShowFields.wing], act[Protocols.ActorRankShowFields.ride]);
                    // Laya.timer.once(300, this, this.showAvatar);
                    // this.showAvatar();
                    this._skeletonClip.reset(clothes, shenbing, wing);
                    this._skeletonClip.resetOffset(AvatarAniBigType.wing, -180, -30);
                    CustomList.showListAnim(modules.common.showType.HEIGHT,this._rankList);
                    break;
                case RankType.lilianGrade:         //活跃值榜 显示时装 幻武 翅膀 活跃值名称
                    // this._avatar.pos(368, 534);
                    // this._avatar.reset(clothes, act[Protocols.ActorRankShowFields.shenbing], act[Protocols.ActorRankShowFields.wing], act[Protocols.ActorRankShowFields.ride]);
                    // Laya.timer.once(300, this, this.showAvatar);
                    // this.showAvatar();
                    this._skeletonClip.reset(clothes, shenbing, wing);
                    this._skeletonClip.resetOffset(AvatarAniBigType.wing, -180, -30);
                    CustomList.showListAnim(modules.common.showType.HEIGHT,this._rankList);
                    break;
                case RankType.xianweiGrade:         //成就榜  显示时装 幻武 翅膀 成就名称
                    // this._avatar.pos(368, 558);
                    // this._avatar.reset(clothes, act[Protocols.ActorRankShowFields.shenbing], act[Protocols.ActorRankShowFields.wing], act[Protocols.ActorRankShowFields.ride]);
                    // Laya.timer.once(300, this, this.showAvatar);
                    // this.showAvatar();
                    this._skeletonClip.reset(clothes, shenbing, wing);
                    this._skeletonClip.resetOffset(AvatarAniBigType.wing, -180, -30);
                    CustomList.showListAnim(modules.common.showType.HEIGHT,this._rankList);
                    break;
                case RankType.petFight:       //宠物榜 显示宠物
                    // this._avatar.pos(368, 436);
                    // this._avatar.reset(act[Protocols.ActorRankShowFields.pet]);
                    // this.setAvatar(act[Protocols.ActorRankShowFields.pet]);
                    // Laya.timer.once(300, this, this.showAvatar);
                    // this.showAvatar();
                    this._skeletonClip.reset(act[Protocols.ActorRankShowFields.pet]);
                    this.setModelName(0, act[Protocols.ActorRankShowFields.pet], petStar);
                    CustomList.showListAnim(modules.common.showType.HEIGHT,this._rankList);
                    break;
                case RankType.rideFight:       //精灵榜 显示精灵
                    // this._avatar.pos(368, 389);
                    // this.setAvatar(act[Protocols.ActorRankShowFields.ride]);
                    // this._avatar.reset(act[Protocols.ActorRankShowFields.ride]);
                    // this.setAvatar(act[Protocols.ActorRankShowFields.ride]);
                    // Laya.timer.once(300, this, this.showAvatar);
                    // this.showAvatar();
                    this._skeletonClip.reset(0, 0, 0, immortal);
                    this._skeletonClip.resetScale(AvatarAniBigType.immortals,0.7)
                    this._skeletonClip.resetOffset(AvatarAniBigType.immortals,0,-22)


                    this.setModelName(1, act[Protocols.ActorRankShowFields.ride], rideStar);
                    CustomList.showListAnim(modules.common.showType.HEIGHT,this._rankList);
                    break;
                case RankType.shenbingFight:       //幻武榜 显示幻武
                    // this._avatar.pos(376, 419);
                    // this.setAvatar(act[Protocols.ActorRankShowFields.shenbing]);
                    // this._avatar.reset(act[Protocols.ActorRankShowFields.shenbing]);
                    // this.setAvatar(act[Protocols.ActorRankShowFields.shenbing]);
                    // Laya.timer.once(300, this, this.showAvatar);
                    // this.showAvatar();
                    this.upAndDown();
                    this._skeletonClip.reset(0, shenbing);
                    this._skeletonClip.resetOffset(AvatarAniBigType.weapon, 0);
                    this._skeletonClip.resetScale(AvatarAniBigType.weapon,1.4)

                    this.setModelName(2, act[Protocols.ActorRankShowFields.shenbing]);
                    CustomList.showListAnim(modules.common.showType.HEIGHT,this._rankList);
                    break;
                case RankType.wingFight:        //翅膀榜
                    // this._avatar.pos(368, 431);
                    // this.setAvatar(act[Protocols.ActorRankShowFields.wing]);
                    // this._avatar.reset(act[Protocols.ActorRankShowFields.wing]);
                    // this.setAvatar(act[Protocols.ActorRankShowFields.wing]);
                    // Laya.timer.once(300, this, this.showAvatar);
                    // this.showAvatar();
                    this._skeletonClip.reset(0, 0, wing);
                    this._skeletonClip.resetScale(AvatarAniBigType.wing,1.2)
                    this.setModelName(3, act[Protocols.ActorRankShowFields.wing]);
                    CustomList.showListAnim(modules.common.showType.HEIGHT,this._rankList);
                    break;
                case RankType.magicWeaponFight:        //圣物榜 显示圣物属性和时装
                    //修为
                    let amulet: Configuration.amuletRise = AmuletRiseCfg.instance.getCfgBylevel(showtuple[0][Protocols.ActorRankShowFields.amulet]);
                    if (amulet[Configuration.amuletRiseFields.level] != 0) {
                        this.amulet.visible = true;
                        let n: number = amulet[Configuration.amuletRiseFields.cultivatIcon];
                        this.amulet.skin = `assets/icon/ui/amulet/${amulet[Configuration.amuletRiseFields.cultivatIcon]}.png`;
                    }
                    // this._avatar.pos(368, 497, false);
                    // this._avatar.reset(clothes, act[Protocols.ActorRankShowFields.shenbing], act[Protocols.ActorRankShowFields.wing], act[Protocols.ActorRankShowFields.ride]);
                    // Laya.timer.once(200, this, this.showAvatar);
                    // this.showAvatar();
                    this._skeletonClip.reset(clothes, shenbing, wing);
                    // this._skeletonClip.resetOffset(AvatarAniBigType.wing, -180, -30);
                    CustomList.showListAnim(modules.common.showType.HEIGHT,this._rankList);
                    break;
                case RankType.faction:
                    this.updateFactionShow();
                    CustomList.showListAnim(modules.common.showType.HEIGHT,this._rankList);
                    break;
            }
        }

        private setModelName(type: number, modelId: number, star: number = 0): void {
            let cfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(modelId);
            if (!cfg) return;
            this.nameBox.visible = true;
            let name: string = cfg[ExteriorSKFields.name];
            // 0宠物 1精灵 2幻武 3翅膀  先传进阶外观表 再传幻化
            if (star % 10 !== 0) {
                star = Math.floor(star / 10);
            } else if (star != 0) {
                star = (star / 10) - 1;
            }
            if (type === 0) {
                if (PetMagicShowCfg.instance.getCfgsById(modelId)) {
                    this.nameTxt.text = `幻化·${name}`;
                } else {
                    this.nameTxt.text = `${CommonUtil.numToUpperCase(star + 1)}阶·${name}`;
                }
            } else if (type === 1) {
                if (RideMagicShowCfg.instance.getCfgsById(modelId)) {
                    this.nameTxt.text = `幻化·${name}`;
                } else {
                    this.nameTxt.text = `${CommonUtil.numToUpperCase(star + 1)}阶·${name}`;
                }
            } else if (type === 2 || type === 3) {
                let quality: int = cfg[ExteriorSKFields.quality];
                this.nameTxt.text = `${quality === 3 ? "珍·" : quality === 4 ? "极·" : quality === 5 ? "绝·" : ""}${name}`;
            }
        }

        private showAvatar(): void {
            // this._avatar.visible = true;
            this._skeletonClip.visible = true;
        }

        private getRankData(showdata: Protocols.GetActorRankDataReply): void {
            this.firstplayervalue.value = showdata[0][0][Protocols.RankDataFields.param].toString();
        }

        private setAvatar(showId: number): void {
            let extercfg: Configuration.ExteriorSK = ExteriorSKCfg.instance.getCfgById(showId);
            if (!extercfg) return;
            // this._avatar.avatarRotationY = extercfg[Configuration.ExteriorSKFields.rotationY] ? extercfg[Configuration.ExteriorSKFields.rotationY] : 180;
            // this._avatar.avatarScale = extercfg[Configuration.ExteriorSKFields.scale] ? (extercfg[Configuration.ExteriorSKFields.scale] * 768 / 1280) : 1;
            // this._avatar.avatarRotationX = extercfg[Configuration.ExteriorSKFields.rotationX] ? extercfg[Configuration.ExteriorSKFields.rotationX] : 0;
            // this._avatar.avatarX = extercfg[Configuration.ExteriorSKFields.deviationX] ? extercfg[Configuration.ExteriorSKFields.deviationX] : 0;
            // this._avatar.avatarY = extercfg[Configuration.ExteriorSKFields.deviationY] ? extercfg[Configuration.ExteriorSKFields.deviationY] : 0;
        }

        private upAndDown(): void {
            // this._tweenAvatar.to({ y: this._avatar.y - 20 }, 1000).start().yoyo(true).repeat(Number.POSITIVE_INFINITY);
        }

        private stopAvatar(): void {
            // this._tweenAvatar.stop();
        }
    }
}
