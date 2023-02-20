///<reference path="../bigtower/bigtower_model.ts"/>
///<reference path="../config/scene_copy_dahuang_cfg.ts"/>
///<reference path="../config/scene_copy_rune_cfg.ts"/>
///<reference path="../rune_copy/rune_copy_model.ts"/>
///<reference path="../ladder/ladder_model.ts"/>
///<reference path="../config/scene_cfg.ts"/>

/** 结算胜利面板*/
namespace modules.dungeon {
    import blendFields = Configuration.blendFields;
    import BagItem = modules.bag.BagItem;
    import BlendCfg = modules.config.BlendCfg;
    import WinViewUI = ui.WinViewUI;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import LevelCopyDataFields = Protocols.LevelCopyDataFields;
    import BigTowerModel = modules.bigTower.BigTowerModel;
    import SceneCopyDahuangCfg = modules.config.SceneCopyDahuangCfg;
    import Label = Laya.Label;
    import TeamBattleModel = modules.teamBattle.TeamBattleModel;
    import SceneCopyRuneCfg = modules.config.SceneCopyRuneCfg;
    import RuneCopyModel = modules.rune_copy.RuneCopyModel;
    import LadderModel = modules.ladder.LadderModel;
    import UpdateTiantiScoreAward = Protocols.UpdateTiantiScoreAward;
    import UpdateTiantiScoreAwardFields = Protocols.UpdateTiantiScoreAwardFields;
    import CustomList = modules.common.CustomList;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import LayaEvent = modules.common.LayaEvent;
    export class WinPanel extends WinViewUI {

        private _duration: number;
        private _isSpecialCopy: boolean;
        private _tipTxt: Label;
        private _list: CustomList;
        private _skeletons: Laya.Skeleton[];
        /**
         * 特效数组
         */
        private _tweens: TweenJS[]

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._isSpecialCopy = false;
            this.closeOnSide = false;
            //修改為列表顯示
            this._list = new CustomList();
            this._list.width = 461;
            this._list.height = 427;
            this._list.hCount = 4;
            this._list.spaceX = 8;
            this._list.itemRender = BagItem;
            this._list.x = 150;
            this._list.y = 547;
            this._list.spaceY = 8;
            this.addChild(this._list);
            this.regGuideSpr(GuideSpriteId.WIN_PANEL_LEAVE_BTN, this.leaveBtn);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.close);
            this.addAutoListener(this.gotoBtn, LayaEvent.CLICK, this, this.nextLevel);
            this.addAutoListener(this.leaveBtn, LayaEvent.CLICK, this, this.levelPlane);
            Laya.timer.loop(1000, this, this.loopHandler);
            GlobalData.dispatcher.on(CommonEventType.CashEquip_Merge_Awards, this, this.updataCashEquip);
        }
        protected removeAutoListeners(): void {
            super.removeAutoListeners()
            if (this._tweens) {
                this._tweens.forEach(element => {
                    element.stop();
                });
            }
            if (this._skeletons) {
                this._skeletons.forEach(element => {
                    element.destroy();
                });
            }
        }
        public onOpened(): void {
            super.onOpened();
            let type = SceneCfg.instance.getCfgById(SceneModel.instance.enterScene[EnterSceneFields.mapId])[sceneFields.type];
            if (type === SceneTypeEx.dahuangCopy) {      // 大荒古塔倒计时
                this._duration = BlendCfg.instance.getCfgById(35001)[blendFields.intParam][0];
            } else if (type === SceneTypeEx.runeCopy) {      // 未央幻境倒计时
                this._duration = BlendCfg.instance.getCfgById(35002)[blendFields.intParam][0];
            } else {
                this._duration = BlendCfg.instance.getCfgById(10303)[blendFields.intParam][0];
            }
            this.loopHandler();
            this.initEffect()
        }

        private showAward(list: CustomList) {
            for (const m of list.items) {
                m.scaleX = m.scaleY = 1.2;
                m.visible = false;
            }
            let delta = 0;
            // for (const n of list.items) {
            this._tweens = []
            for (let index = 0; index < this._list.items.length; index++) {
                let n = list.items[index]
                let temp: TweenJS = TweenJS.create(n).to({ scaleX: 0.9, scaleY: 0.9 }, 300)
                    .easing(utils.tween.easing.circular.InOut)
                    .onComplete(() => {
                        if (this._list.items[index].parent && n && this._skeletons[index]) {
                            this._skeletons[index].pos(n.x + n.width / 2 - 6, n.y + n.height / 2)
                            this._skeletons[index].playbackRate(0.31);
                            this._list.items[index].parent.addChild(this._skeletons[index]);
                            this._skeletons[index].play(0, false)
                        }
                    })
                    .delay(delta)
                    .start()
                setTimeout(() => {
                    n.visible = true;
                }, delta);

                delta += 50
                this._tweens.push(temp)
            }
        }

        private rewardData: Array<Protocols.Item>;
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            if (!value) return;
            console.log("结算胜利。。。。。" + value);
            let items: Array<Protocols.Item> = value;
            let shuju = new Array<Protocols.Item>();
            for (let index = 0; index < items.length; index++) {
                let element = items[index];
                if (element) {
                    if (94040001 !== element[0]) { //天关剔除 vip经验
                        shuju.push(element);
                    }
                }
            }
            this._list.height = 424;
            this._list.y = 547;
            if (value) {
                this.rewardData = shuju;
                this._list.datas = shuju;
            }
            if (SceneModel.instance.enterScene[EnterSceneFields.mapId] === SCENE_ID.scene_dahuang) {
                let maxLV: number = SceneCopyDahuangCfg.instance.cfgs.length;
                let nextLv: number = BigTowerModel.instance.copyData[LevelCopyDataFields.finishLevel] + 1;
                this.sceneTypeDistinguish(nextLv, maxLV);
            } else if (SceneModel.instance.enterScene[EnterSceneFields.mapId] === SCENE_ID.scene_rune_copy) {
                let maxLV: number = SceneCopyRuneCfg.instance.maxLv;
                let nextLv: number = RuneCopyModel.instance.currLv;
                this.sceneTypeDistinguish(nextLv, maxLV);
            } else {
                this.dahuangBox.visible = false;
                this.okBtn.visible = true;
                this._isSpecialCopy = false;

                let mapId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
                if (mapId === SCENE_ID.scene_team_copy) { //组队副本
                    if (!this._tipTxt) {
                        this._tipTxt = new Label();
                        this._tipTxt.fontSize = 28;
                        this._tipTxt.font = "SimHei";
                    }
                    this._tipTxt.color = "#b15315";
                    this._tipTxt.pos(129, 545);
                    this.addChild(this._tipTxt);
                    if (TeamBattleModel.Instance.isMaxWave) {
                        this._tipTxt.text = `恭喜您刷完所有波数的怪物`;
                    } else {
                        this._tipTxt.text = `刷怪波数:${TeamBattleModel.Instance.doneWave}`;
                    }
                    this._list.height = 396;
                    this._list.y = 575;
                    if (value) {
                        this._list.datas = items;
                    }
                } else if (mapId === SCENE_ID.scene_homestead) {
                    this._isSpecialCopy = true;
                } else if (mapId === SCENE_ID.scene_tianti_copy) {     // 天梯
                    if (!this._tipTxt) {
                        this._tipTxt = new Label();
                        this._tipTxt.fontSize = 28;
                        this._tipTxt.font = "SimHei";
                    }
                    this._tipTxt.color = "#168a17";
                    this._tipTxt.pos(130, 700, true);
                    this.addChild(this._tipTxt);
                    let str: string = "积分详情：\n";
                    let award: UpdateTiantiScoreAward = LadderModel.instance.tiantiScoreAward;
                    if (award) {
                        str += "胜利:" + award[UpdateTiantiScoreAwardFields.winScore];
                        if (award[UpdateTiantiScoreAwardFields.continueWinScore]) {
                            str += "    连胜:" + award[UpdateTiantiScoreAwardFields.continueWinScore];
                        }
                        if (award[UpdateTiantiScoreAwardFields.jumpScore]) {
                            str += "    越阶:" + award[UpdateTiantiScoreAwardFields.jumpScore];
                        }
                    }
                    this._tipTxt.text = str;
                } else {
                    if (this._tipTxt) {
                        this._tipTxt.removeSelf();
                    }
                }
            }
        }
        private _item: Protocols.Item
        private updataCashEquip(item: Protocols.Item) {
            if (this.rewardData && this._list) {
                this.rewardData.unshift(item)
                this._list.datas = this.rewardData;
                this._item = item

            }
        }


        private nextLevel(): void {
            if (this._isSpecialCopy) {
                let cfg = SceneCfg.instance.getCfgById(MapUtils.currentID);
                if (cfg[sceneFields.type] == SceneTypeEx.dahuangCopy || cfg[sceneFields.type] == SceneTypeEx.runeCopy) {
                    MapUtils.waitTransition = WaitTransitionType.WaitTransitionThree;
                    this.close(null, false);
                    return;
                }
                DungeonCtrl.instance.reqEnterNextLevel();
            }
            this.close(null, false);
        }

        private sceneTypeDistinguish(nextLv: number, maxLv: number): void {  //场景类型区分

            this.dahuangBox.visible = true;
            this.okBtn.visible = false;
            this._isSpecialCopy = true;
            if (nextLv > maxLv) {
                this.dahuangBox.visible = false;
                this.okBtn.visible = true;
                this._isSpecialCopy = false;
            }
        }

        private levelPlane(): void {
            DungeonCtrl.instance.reqEnterScene(0);
            this.close(null, false);

        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            this.clearRes();
            Laya.timer.clear(this, this.loopHandler);
            if (!this._isSpecialCopy) {
                DungeonCtrl.instance.reqEnterScene(0);
            }
            if (this._item) GlobalData.dispatcher.event(CommonEventType.CashEquip_Completion_Callback, [this._item]);

        }

        private loopHandler(): void {
            if (this._duration === 0) {
                if (this._isSpecialCopy) {
                    this.nextLevel();
                } else {
                    this.close();
                }
                Laya.timer.clear(this, this.loopHandler);
            }
            this.gotoBtn.label = `下一层(${this._duration / 1000})`;
            this.okBtn.label = `确定(${this._duration / 1000})`;
            this._duration -= 1000;
        }
        /**
         * 初始化胜利的道具特效
         */
        private initEffect() {
            let nowTime = 0;
            let needTime = this._list.items.length;
            this._skeletons = []
            for (let index = 0; index < needTime; index++) {
                let skeleton = new Laya.Skeleton();
                skeleton.load("assets/effect/success/uitx2.sk", Laya.Handler.create(this, () => {
                    this._skeletons.push(skeleton)
                    nowTime++
                    if (this && nowTime >= needTime) {
                        this.showAward(this._list);
                    }
                }));
            }

        }

        clearRes() {
            if (this._tweens) {
                this._tweens.forEach(element => {
                    element.stop();
                });
            }
            if (this._skeletons) {
                this._skeletons.forEach(element => {
                    element.destroy();
                });
            }
        }

        public destroy(): void {
            super.destroy();
            this.clearRes();
            this._tipTxt = this.destroyElement(this._tipTxt);
            if (this._list) {
                this._list = this.destroyElement(this._list);
            }
        }
    }

}