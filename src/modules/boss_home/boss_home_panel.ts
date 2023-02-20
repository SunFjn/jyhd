/**Boss之家面板 */


///<reference path="../config/monster_cfg.ts"/>


namespace modules.bossHome {
    import BossHomeViewUI = ui.BossHomeViewUI;
    import BtnGroup = modules.common.BtnGroup;
    import CommonUtil = modules.common.CommonUtil;
    import CustomList = modules.common.CustomList;
    import Button = Laya.Button;
    import scene_home_boss = Configuration.scene_home_boss;
    import scene_home_bossFields = Configuration.scene_home_bossFields;
    import MonsterResFields = Configuration.MonsterResFields;
    import Item = Protocols.Item;
    import ItemsFields = Protocols.ItemsFields;
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = modules.common.CustomClip;
    import BossInfo = Protocols.BossInfo;
    import BossStateFields = Protocols.BossStateFields;
    import Image = Laya.Image;
    import DungeonModel = modules.dungeon.DungeonModel;
    import FollowBoss = Protocols.FollowBoss;
    import FollowBossFields = Protocols.FollowBossFields;
    import monster = Configuration.monster;
    import MonsterCfg = modules.config.MonsterCfg;
    import monsterFields = Configuration.monsterFields;
    import BossInfoFields = Protocols.BossInfoFields;
    import SceneHomeBossCfg = modules.config.SceneHomeBossCfg;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import BornModel = modules.born.BornModel;
    import BossDungeonModel = modules.bossDungeon.BossDungeonModel;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    type Postion = {
        x: number,
        y: number
    }
    export class BossHomePanel extends BossHomeViewUI {

        private _btnGroup: BtnGroup;
        private _showAwards: Array<BaseItem>;
        private _awardList: CustomList;

        private _selectLayerIndex: number;
        private _layerShow: Array<Button>;
        private _layerGroup: BtnGroup;
        private _showBossId: number;
        private _showMapId: number;
        private _layerRPImgs: Array<Image>;
        private _btnClip: CustomClip;
        // private _modelClip: AvatarClip;
        private _openParam: any;
        private _boss_items
        private _defaultPos: Postion[];

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.universeBossBtn, this.shengYuBossBtn, this.bossHomeBtn);
            this._showAwards = new Array<BaseItem>();
            this._layerShow = new Array<Button>();
            this._layerRPImgs = new Array<Image>();
            this.layerShowPanel.vScrollBarSkin = "";
            this.initAwardsInfo();
            this._selectLayerIndex = -1;
            let childs = this.item_parent._childs
            this._boss_items = []
            for (let index = 0; index < 3; index++) {
                let item = new BossHomeItem();
                if (index == 0) {
                    item.scale(0.9, 0.9)
                } else {
                    item.scale(0.8, 0.8)
                }
                item.nowIndex = index;
                this.item_parent.addChild(item);
                item.pos(childs[index].x, childs[index].y);
                this._boss_items.push(item);
            }

            this._defaultPos = []
            this._boss_items.forEach(element => {
                let temp: Postion = {
                    x: element.x,
                    y: element.y
                }
                this._defaultPos.push(temp)
            });
            this._btnClip = new CustomClip();
            this.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            let arr: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr[i] = `btn_light/${i}.png`;
            }
            this._btnClip.frameUrls = arr;
            this._btnClip.visible = false;
            this._btnClip.pos(238, 805, true);
            this._btnClip.scale(1.23, 1.3, true);

            this._awardList = new CustomList();
            this._awardList.scrollDir = 2;
            this._awardList.itemRender = BaseItem;
            this._awardList.width = 800;
            this._awardList.spaceX = 10;
            this._awardList.height = 100;
            this._awardList.x = 40;
            this._awardList.y = 840;
            this._awardList.scale(0.8, 0.8)
            this.addChild(this._awardList);

            this.conditionTxt.color = "#2d2d2d";
            this.conditionTxt.style.fontFamily = "SimHei";
            this.conditionTxt.style.fontSize = 26;
            this.conditionTxt.mouseEnabled = false;
            this.conditionTxt.style.wordWrap = false;

            BossHomeModel.instance.bossSeletIndex = 1;
            BossHomeModel.instance.bossLastSeletIndex = 1;

            this.regGuideSpr(GuideSpriteId.THREE_WORLDS_TAB_BTN, this.universeBossBtn);
            this.regGuideSpr(GuideSpriteId.BOSS_HOME_TAB_BTN, this.bossHomeBtn);
            this.regGuideSpr(GuideSpriteId.BOSS_HOME_CHALLENGE_BTN, this.goBtn);
        }

        //初始化奖励以及按钮的位置等信息
        private initAwardsInfo(): void {
            for (let i = 0; i < BossHomeModel.instance.getTotalLayer(); i++) {
                this._layerShow[i] = new Button('boss_home/btn_lc.png', BossHomeModel.instance.getBtnNameByLayer(i));
                this.layerShowPanel.addChild(this._layerShow[i]);
                let xl = i * 100;
                this._layerShow[i].pos(10, xl);
                this._layerShow[i].stateNum = 2;
                this._layerShow[i].labelColors = '#ffffff, #ffffff';
                this._layerShow[i].labelFont = 'SimHei';
                this._layerShow[i].labelSize = 16;
                this._layerShow[i].labelPadding = 30 + ""
                this._layerRPImgs[i] = new Image("image_xz/btn_lc.png");
                this.layerShowPanel.addChild(this._layerRPImgs[i]);
                this._layerRPImgs[i].zOrder = 1;
                this._layerRPImgs[i].pos(4, xl + 124, true);
                this._layerRPImgs[i].visible = false;
            }
            this._layerGroup = new BtnGroup();
            this._layerGroup.setBtns(...this._layerShow);
        }

        protected onOpened(): void {
            super.onOpened();

            if (this._openParam) {
                this._layerGroup.selectedIndex = this._openParam[0];
                this.layerSelectHandler();
                let id = this._openParam[1];
                let index = BossHomeModel.instance.getIndexByBossId(id);
                if (index != -1) {
                    BossHomeModel.instance.bossSeletIndex = index;
                    this.bossSelectHandler();
                }
            } else {
                if (this._layerGroup.selectedIndex == -1) {
                    let vipCanIndex: int = BossHomeModel.instance.getSelectLayerIndex();
                    if (vipCanIndex === -1) {
                        this._layerGroup.selectedIndex = 0;
                    } else { //vip满足判断觉醒
                        let eraCanIndex: int = BossHomeModel.instance.getIndexByEra();
                        if (vipCanIndex === eraCanIndex) {
                            this._layerGroup.selectedIndex = eraCanIndex;
                        } else {
                            this._layerGroup.selectedIndex = 0;
                        }
                    }
                    this.layerSelectHandler();
                } else {
                    this.updateLayerInfo();
                }
            }

            this.checkRP();
            setTimeout(() => {
                this.layerShowPanel.scrollTo(0, this._layerGroup.selectedIndex * 116);
            }, 20);
        }

        public close(): void {
            super.close();
            for (let i: int = 0, len: int = this._layerRPImgs.length; i < len; i++) {
                this._layerRPImgs[i].visible = false;
            }
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._btnGroup.selectedIndex = 2;
            this._openParam = value;
        }
        private reSetArrPos(defaultPos: Postion[], nodes: ItemRender[], nowsSelect: number, lastSelect: number) {
            // 公式推演出点击项距离初始位置的距离，Xleft为左边间隔数，Xright为右边间隔数
            let arrLength = nodes.length
            let Xleft = lastSelect - nowsSelect > 0 ? arrLength - lastSelect + nowsSelect : nowsSelect - lastSelect;
            let Xright = arrLength - Xleft;
            let turnNum = Xleft >= Xright ? -Xright : Xleft;

            for (let i = 0; i < arrLength; i++) {
                // LDis是指初始位置据目标点的距离，即index - 0, preDis是值每个当前项要移动的目标项,0是tempArr的默认初始位置
                let Ldis = nowsSelect - 0;
                let preDis = i - Ldis >= 0 ? i - Ldis : arrLength + i - Ldis;
                for (let m = 0; m < Math.abs(turnNum); m++) {
                    let dism = Math.abs(turnNum) - m - 1;
                    let rightTurn = preDis - dism >= 0 ? preDis - dism : arrLength + preDis - dism;
                    let leftTurn = preDis + dism >= arrLength ? preDis + dism - arrLength : preDis + dism;
                    let dis = turnNum > 0 ? leftTurn : rightTurn;
                    setTimeout(() => {
                        if (dis == 0) {
                            this._boss_items[i].zOrder = 2
                            TweenJS.create(this._boss_items[i]).to({ scaleX: 0.9, scaleY: 0.9 }, 500 / Math.abs(turnNum))
                                .easing(utils.tween.easing.linear.None)
                                .start()
                        } else {
                            this._boss_items[i].zOrder = 1
                            TweenJS.create(this._boss_items[i]).to({ scaleX: 0.8, scaleY: 0.8 }, 500 / Math.abs(turnNum))
                                .easing(utils.tween.easing.linear.None)
                                .start()
                        }
                        TweenJS.create(nodes[i]).to({ x: defaultPos[dis].x, y: defaultPos[dis].y }, 500 / Math.abs(turnNum))
                            .easing(utils.tween.easing.linear.None)
                            .start()
                    }, (m * 500 / Math.abs(turnNum)));
                }
            }
            BossHomeModel.instance.bossLastSeletIndex = BossHomeModel.instance.bossSeletIndex;
        }
        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.goBtn, common.LayaEvent.CLICK, this, this.goBtnHanlder);
            this.addAutoListener(this._btnGroup, common.LayaEvent.CHANGE, this, this.changeBtnHandler);
            this.addAutoListener(this.followBtn, common.LayaEvent.CLICK, this, this.followHandler);
            this.addAutoListener(this.tipsBtn, common.LayaEvent.CLICK, this, this.tipsBtnHandler);
            // this.addAutoListener(this._list, common.LayaEvent.SELECT, this, this.bossSelectHandler);
            this.addAutoListener(this._layerGroup, common.LayaEvent.CHANGE, this, this.layerSelectHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_LEVEL, this, this.checkPlayerLevel);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BOSS_HOME_SELECT, this, this.bossSelectHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BOSS_UPDATE, this, this.bossUpdateHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MULTI_BOSS_FOLLOWS_UPDATE, this, this.followsUpdateHandler);

            this.addAutoRegisteRedPoint(this.threeWorldsRP, ["threeWorldsRP"]);
            this.addAutoRegisteRedPoint(this.bossHomeRP, ["bossHomeRP"]);
            this.addAutoRegisteRedPoint(this.shengYuBossRP, ["shenYuBossRP"]);
        }

        //选择按钮相应
        private changeBtnHandler(): void {
            if (this._btnGroup.selectedIndex === 0) {
                WindowManager.instance.open(WindowEnum.THREE_WORLDS_PANEL);
                this._btnGroup.selectedIndex = 2;
            } else if (this._btnGroup.selectedIndex === 1) {
                WindowManager.instance.open(WindowEnum.SHENGYU_BOSS_PANEL);
                this._btnGroup.selectedIndex = 2;
            }
        }

        //点击前往按钮后相应
        private goBtnHanlder(): void {
            let vipCondition: boolean = BossHomeModel.instance.checkSvipCondition(this._selectLayerIndex);
            let layer: int = this._selectLayerIndex + 1;
            let eraCondition: boolean = this.checkEraCondition(layer);

            if (!eraCondition) {
                let condition: int = SceneHomeBossCfg.instance.getCfgByFirstLayer(layer)[scene_home_bossFields.eraLv][0];
                notice.SystemNoticeManager.instance.addNotice(`${CommonUtil.numToUpperCase(condition)}阶以上可进入`, true);
            } else if (!vipCondition) {
                // CommonUtil.vipLvNotEnoughAlert();
                let datas = BossHomeModel.instance.getBossInfoByLayer(this._selectLayerIndex)
                let handler: Handler = Handler.create(this, this.joinGame);
                CommonUtil.alert('温馨提示', 'SVIP等级不足，是否消耗' + datas[0][scene_home_bossFields.Moneyconsumption][0][1] + '点卷进入副本？', [handler]);
            } else {
                this.joinGame()
            }
        }
        private joinGame() {
            let layer: int = this._selectLayerIndex + 1;
            BossDungeonModel.instance.searchBossIds = BossHomeModel.instance.getBossIdsByLayer(this._selectLayerIndex);
            let searchBossId: int = DungeonModel.instance.searchBoss(this._showBossId, BossDungeonModel.instance.searchBossIds);
            BossHomeModel.instance.setSelectTarget(searchBossId, true);
            BossDungeonModel.instance.searchBossType = SCENE_ID.scene_home_boss;
            BossHomeCtrl.instance.reqEnterScene(this._showMapId, layer);
        }

        //检测觉醒条件
        private checkEraCondition(layer: number): boolean {
            let eraLv: int = Math.floor(BornModel.instance.lv / 100);
            let cfg: scene_home_boss = SceneHomeBossCfg.instance.getCfgByFirstLayer(layer);
            let eras: int[] = cfg[scene_home_bossFields.eraLv];
            return (eraLv >= eras[0] && eraLv <= eras[1]);
        }

        private getEraConditionByLayer(layer: int): string {
            let cfg: scene_home_boss = SceneHomeBossCfg.instance.getCfgByFirstLayer(layer);
            let condition: int = cfg[scene_home_bossFields.eraLv][0];
            if (condition === 0) {
                return ``;
            } else {
                return `且达到${CommonUtil.formatHtmlStrByColor(`#b15315`, `${CommonUtil.numToUpperCase(condition)}阶`)}以上`;
            }
        }

        //关注按钮
        private followHandler(): void {
            this.followBtn.selected = !this.followBtn.selected;
            BossHomeCtrl.instance.setFollowBoss(this._showBossId, this.followBtn.selected);
        }

        //tips按钮
        private tipsBtnHandler(): void {
            CommonUtil.alertHelp(20027);
        }

        //boss选择处理
        private bossSelectHandler(): void {
            this.reSetArrPos(this._defaultPos, this._boss_items, BossHomeModel.instance.bossSeletIndex, BossHomeModel.instance.bossLastSeletIndex);
            this.updateSelectBoss();
            this.checkRP();
        }

        //层数选择处理
        private layerSelectHandler(): void {

            if (this._selectLayerIndex != this._layerGroup.selectedIndex) {
                this._selectLayerIndex = this._layerGroup.selectedIndex;
                this.updateLayerInfo();
            }
        }

        //左按钮点击处理
        private leftBtnHandler(): void {
            this.layerShowPanel.scrollTo(0, 0);
        }

        //右按钮点击处理
        private rightBtnHandler(): void {
            this.layerShowPanel.scrollTo(600, 0);
        }

        //刷新选择的层数信息
        private updateLayerInfo(): void {
            //根据选择的层数读取数据
            let datas = BossHomeModel.instance.getBossInfoByLayer(this._selectLayerIndex)
            let needVipLv = BossHomeModel.instance.getVipByLayer(this._selectLayerIndex);
            let needEra: string = this.getEraConditionByLayer(this._selectLayerIndex + 1);
            this.conditionTxt.innerHTML = `${CommonUtil.formatHtmlStrByColor(`#b15315`, `${datas[0][scene_home_bossFields.Moneyconsumption][0][1]}`)}${needEra}可进入，${CommonUtil.formatHtmlStrByColor(`#b15315`, `SVIP${needVipLv}`)}免费`;
            // 消耗【点卷图标】 60 且达到十一阶以上可以进入，SVIP 15 免费
            let x = CommonUtil.centerChainArr(720, [this.conditionTxt], 0, this.h5_parent.width);
            this.h5_parent.x = x - this.h5_parent.width - 10
            this._boss_items.forEach((element, index) => {
                element.data = datas[index]
            });

            BossHomeModel.instance.getBossInfoByLayer(this._selectLayerIndex);
            BossHomeModel.instance.bossSeletIndex = 0;   //选择第一个boss
            this.bossSelectHandler();
        }

        //刷新选择的boss信息
        private updateSelectBoss(): void {
            let bossCfg: scene_home_boss = BossHomeModel.instance.getBossInfoByIndex(BossHomeModel.instance.bossSeletIndex);
            this._showBossId = bossCfg[scene_home_bossFields.occ];  //设置选择的bossId;
            this._showMapId = bossCfg[scene_home_bossFields.mapId];
            this.powerNum.value = bossCfg[scene_home_bossFields.bossFight].toString();  //根据boss选择对应战力
            let showAward = bossCfg[scene_home_bossFields.dropTips];
            let tempItems: Item[] = []
            for (let i = 0; i < 8; i++) {
                let data: Item = [showAward[i][ItemsFields.ItemId], showAward[i][ItemsFields.count], 0, null];
                tempItems.push(data);
            }
            this._awardList.datas = tempItems;
            this.checkPlayerLevel();
            this.followBtn.selected = BossHomeModel.instance.checkIsFollowBoss(this._showBossId);
            let id: number = BossHomeModel.instance.getCfgByid(this._showBossId)[MonsterResFields.res];
            // //模型的显示！！！
            // this.selectBossModel();
        }

        private selectBossModel(): void {
            let id: number = BossHomeModel.instance.getCfgByid(this._showBossId)[MonsterResFields.res];
            // let modelCfg: Exterior = ExteriorSKCfg.instance.getCfgById(id);

            // this._modelClip.reset(id);
            // this._modelClip.avatarScale = modelCfg[ExteriorSKFields.scale] ? modelCfg[ExteriorSKFields.scale] : 1;
            // this._modelClip.avatarRotationX = modelCfg[ExteriorSKFields.rotationX];
            // this._modelClip.avatarRotationY = modelCfg[ExteriorSKFields.rotationY];
            // this._modelClip.avatarY = modelCfg[ExteriorSKFields.deviationY];
            // this._modelClip.avatarX = modelCfg[ExteriorSKFields.deviationX];
        }

        //判断玩家等级是否太高
        private checkPlayerLevel(): void {
            // if (BossHomeModel.instance.checkPlayerLevelHeigh(this._showBossId)) {
            //     this.fightNotice.visible = true;
            // } else {
            //     this.fightNotice.visible = false;
            // }
        }

        // BOSS更新
        private bossUpdateHandler(): void {
            this.checkRP();
        }

        // 关注更新
        private followsUpdateHandler(): void {
            this.checkRP();
        }

        // 检测红点
        private checkRP(): void {
            for (let i: int = 0, len: int = this._layerRPImgs.length; i < len; i++) {
                this._layerRPImgs[i].visible = false;
            }
            let follows: Array<FollowBoss> = DungeonModel.instance.follows;
            let flag: boolean = false;
            for (let i: int = 0, len: int = follows.length; i < len; i++) {
                let follow: FollowBoss = follows[i];
                if (follow[FollowBossFields.follow]) {
                    let bossId: number = follow[FollowBossFields.occ];
                    let cfg: monster = MonsterCfg.instance.getMonsterById(bossId);
                    if (cfg[monsterFields.bossType] === BossType.homeBoss) {  // 关注的BOSS之家才处理
                        let bossInfo: BossInfo = DungeonModel.instance.getBossInfoById(bossId);
                        if (bossInfo && !bossInfo[BossInfoFields.bossState][BossStateFields.dead]) {
                            let layer: number = SceneHomeBossCfg.instance.getCfgByBossId(bossId)[scene_home_bossFields.level];
                            this._layerRPImgs[layer - 1].visible = true;
                            if (bossId === this._showBossId) flag = true;
                        }
                    }
                }
            }
            if (flag) {
                this._btnClip.visible = true;
                this._btnClip.play();
            } else {
                this._btnClip.visible = false;
                this._btnClip.stop();
            }
        }

        public destroy(destroyChild: boolean = true): void {
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._showAwards = this.destroyElement(this._showAwards);
            this._layerShow = this.destroyElement(this._layerShow);
            this._layerGroup = this.destroyElement(this._layerGroup);
            this._layerRPImgs = this.destroyElement(this._layerRPImgs);
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }
    }
}
