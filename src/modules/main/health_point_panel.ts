/** 血条面板*/


///<reference path="../config/monster_res_cfg.ts"/>
///<reference path="../scene/scene_ctrl.ts"/>
///<reference path="../player/player_model.ts"/>

namespace modules.main {
    import BaseItem = modules.bag.BaseItem;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResFields = Configuration.MonsterResFields;
    import GameCenter = game.GameCenter;
    import LogUtils = game.misc.LogUtils;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import PlayerModel = modules.player.PlayerModel;
    import HealthPointViewUI = ui.HealthPointViewUI;
    import Layer = ui.Layer;
    import Property = game.role.Property;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import DropOwn = Protocols.DropOwn;
    import Role = game.role.Role;
    import DropOwnFields = Protocols.DropOwnFields;
    import MonsterCfg = modules.config.MonsterCfg;
    import monsterFields = Configuration.monsterFields;
    import BossDungeonModel = modules.bossDungeon.BossDungeonModel;

    export class HealthPointPanel extends HealthPointViewUI {
        constructor() {
            super();
        }

        private type: number;
        private totalLen: number;
        private maxHP: number;
        private nowHP: number;
        private num: number = 10000;
        private caseNum1: number = 11;
        private caseNum2: number = 12;
        // private _isPlay: boolean = false;
        private _isFristShow: boolean = true;
        private _showNum: number = 1;
        private _showColor: Array<number> = [6, 7, 8, 9, 10];//绿、蓝、紫、橙、红
        private _colorArr: Array<number>;
        private _colorIndex: number;
        private _colorLength: number;
        private _id: number;

        private _targetProperty: Property;

        private _monsterProFactTween: TweenJS;
        private _monsterProInterTween: TweenJS;
        private _playerProFactTween: TweenJS;
        private _playerProInterTween: TweenJS;
        private _bossProgressUpTween: TweenJS;
        private _bossProgressInterTween: TweenJS;
        private _bossProgressShowEffectTween: TweenJS;
        private _items: BaseItem[];

        protected initialize(): void {
            super.initialize();
            this._colorArr = new Array<number>();
            this.layer = Layer.BOTTOM_LAYER;
            this.closeByOthers = false;
            // LogUtils.enable(LogFlags.HealthPoint);
            this.top = 350;
            this.centerX = 0;
            this.zOrder = -1;
            this._colorIndex = 0;
            this._colorLength = 0;

            this._monsterProFactTween = TweenJS.create(this.monsterProFact).to({ width: 0 }, 100);
            this._monsterProInterTween = TweenJS.create(this.monsterProInter).to({ width: 0 }, 300).onComplete(this.checkHP.bind(this));

            this._playerProFactTween = TweenJS.create(this.playerProFact).to({ width: 0 }, 100);
            this._playerProInterTween = TweenJS.create(this.playerProInter).to({ width: 0 }, 300).onComplete(this.checkHP.bind(this));

            this._bossProgressUpTween = TweenJS.create(this.bossProgressUp);
            this._bossProgressInterTween = TweenJS.create(this.bossProgressInter).onComplete(this.checkHP.bind(this));
            this._bossProgressShowEffectTween = TweenJS.create(this.bossProgressUp);
        }

        protected resetTarget(target: Property): void {
            if (this._targetProperty != null) {
                this._targetProperty
                    .off("hp", this, this.updateProgress)
                    .off("destroyed", this, this.close);
            }
            this._targetProperty = target;
            if (this._targetProperty != null) {
                this._targetProperty
                    .on("hp", this, this.updateProgress)
                    .on("destroyed", this, this.close);
            }
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.resetTarget(null);
            this._monsterProFactTween.stop();
            this._monsterProInterTween.stop();
            this._playerProFactTween.stop();
            this._playerProInterTween.stop();
            this._bossProgressUpTween.stop();
            this._bossProgressInterTween.stop();
            this._bossProgressShowEffectTween.stop();
            LogUtils.info(LogFlags.HealthPoint, `___________________________关闭界面`);
        }

        public setOpenParam(value: any): void {  //传进来id信息
            super.setOpenParam(value);
            this._id = value as number;
            WindowManager.instance.open(WindowEnum.BELONG_PANEL);
        }

        protected onOpened(): void {
            super.onOpened();
            LogUtils.info(LogFlags.HealthPoint, `___________________________打开界面`);
            if (this._bossProgressInterTween.isPlaying) {
                return;
            }
            let role = GameCenter.instance.getRole(this._id);
            if (!this.isSameMan(role)) return;
            if (!this.judgeCanContinue(role)) {
                this.close();
                return;
            }
            this.resetTarget(role.property);
            this.visible = true;
            this._isFristShow = true;
            if (this._items) {
                for (let e of this._items) {
                    e.visible = false;
                }
            }
            this.awardBgImg.visible = false;
            // 判断是否是玩家
            if (role.property.get("type") === RoleType.Player) {
                this.type = -1;     // -1表示玩家
                this.playerProEmpty.visible = this.playerProInter.visible = this.playerProFact.visible = this.playerHeadBg.visible = this.playerHeadIcon.visible = this.playerInfo.visible = true;
                this.monsterInfo.visible = this.monsterProEmpty.visible = this.monsterProFact.visible = this.monsterShow.visible = this.monsterProInter.visible = false;
                this.bossProgressUnder.visible = this.bossProgressUp.visible = this.bossShow.visible = this.bossIconImg.visible = this.bossProgressEmpty.visible =
                    this.bossInfo.visible = this.bossPercent.visible = this.bossProgressInter.visible = this.bossBloodNum.visible = false;
                this.top = 350;
                this.totalLen = 186;
                this.playerInfo.text = role.property.get("name");
                let occ: number = this._targetProperty.get("occ");
                this.playerHeadIcon.skin = `assets/icon/head/${occ}.png`;
            } else {
                let index = this._targetProperty.get("occ");
                let cfg: MonsterRes = MonsterResCfg.instance.getCfgById(index);//从表中读取数据
                this.type = cfg[MonsterResFields.type];  //0是怪物、1是boss
                let isBoss = this.type != 0;
                this.playerProEmpty.visible = this.playerProInter.visible = this.playerProFact.visible = this.playerHeadBg.visible = this.playerHeadIcon.visible = this.playerInfo.visible = false;
                this.monsterInfo.visible = this.monsterProEmpty.visible = this.monsterProFact.visible = this.monsterShow.visible = this.monsterProInter.visible = !isBoss;
                this.bossProgressUnder.visible = this.bossProgressUp.visible = this.bossShow.visible = this.bossIconImg.visible = this.bossProgressEmpty.visible =
                    this.bossInfo.visible = this.bossPercent.visible = this.bossProgressInter.visible = this.bossBloodNum.visible = isBoss;

                if (!isBoss) {//怪物
                    this.top = 350;
                    this.totalLen = 186;
                    let levelShow = Math.floor(index / this.num);
                    if (levelShow == this.caseNum1 || levelShow == this.caseNum2) {
                        this.monsterInfo.text = `${cfg[MonsterResFields.name]}    Lv.${PlayerModel.instance.level}`
                    } else {
                        this.monsterInfo.text = `${cfg[MonsterResFields.name]}    Lv.${role.property.get("level")}`;  //怪物等级赋值
                    }
                } else { //boss
                    this.top = 150;
                    this._showNum = cfg[MonsterResFields.hpNum];
                    let num: number = 0;
                    for (let i = 0; i < this._showNum; i++) {
                        let index = this._showNum - 1;
                        if (i == index) {
                            this._colorArr[0] = this._showColor[4];
                        } else {
                            this._colorArr[index - i] = this._showColor[num % 4];
                            num++;
                        }
                    }
                    this.totalLen = 378;
                    if (!cfg[MonsterResFields.icon]) {
                        this.bossIconImg.skin = `assets/icon/monster/310001.png`;
                    } else {
                        this.bossIconImg.skin = `assets/icon/monster/${cfg[MonsterResFields.icon]}.png`; //设置图标
                    }
                    this.bossInfo.text = `${cfg[MonsterResFields.name]}    Lv.${role.property.get("level")}`;  //等级设置

                    let awardItems: Configuration.Items[] = cfg[MonsterResFields.items];
                    if (!this._items) {
                        this._items = [];
                    }
                    if (awardItems) {
                        for (let i: int = 0, len: int = awardItems.length; i < len; i++) {
                            let itemId: number = awardItems[i][Configuration.ItemsFields.itemId];
                            let itemNum: number = awardItems[i][Configuration.ItemsFields.count];
                            if (!this._items[i]) {
                                let item: BaseItem = new BaseItem();
                                item._nameTxt.scale(1.4, 1.4, true);
                                item.scale(0.6, 0.6);
                                item.nameVisible = true;
                                item.needTip = false;
                                item.pos(212 + i * 91, 88, true);
                                this.addChild(item);
                                this._items[i] = item;

                            }
                            this._items[i].dataSource = [itemId, itemNum, 0, null];
                            this._items[i].visible = true;
                        }
                    }
                    this.awardBgImg.visible = awardItems && awardItems.length > 0;
                }
            }
            this.updateProgress();
        }

        private updateProgress(): void {//更新血量显示
            let health = this._targetProperty.get("hp");
            this.nowHP = health[0];   //设置当前血量
            this.maxHP = health[1];
            // if(this.nowHP>=this.maxHP)this.nowHP = this.maxHP;
            if (this.type == 0) {
                let endWidth = Math.floor((this.nowHP / this.maxHP) * this.totalLen);
                // this._isPlay = true;
                if (this._isFristShow) {
                    this._isFristShow = false;
                    this.monsterProInter.width = this.monsterProFact.width = this.totalLen;
                }
                this._monsterProFactTween.stop();
                this._monsterProInterTween.stop();
                this._monsterProFactTween.property.width = endWidth;
                this._monsterProInterTween.property.width = endWidth;
                this._monsterProFactTween.start();
                this._monsterProInterTween.start();
            } else if (this.type === -1) {
                let endWidth = Math.floor((this.nowHP / this.maxHP) * this.totalLen);
                // this._isPlay = true;
                if (this._isFristShow) {
                    this._isFristShow = false;
                    this.playerProInter.width = this.playerProFact.width = this.totalLen;
                    console.log(` ---------------------- firstShow-----------`);
                }
                this._playerProFactTween.stop();
                this._playerProInterTween.stop();
                this._playerProFactTween.property.width = endWidth;
                this._playerProInterTween.property.width = endWidth;
                this._playerProFactTween.start();
                this._playerProInterTween.start();
            } else {
                let percent: number = this.nowHP / this.maxHP;
                let showPercent = (percent * 100).toFixed(2);
                this.bossPercent.text = showPercent + '%';
                let colorIndex: number = 0;
                if (percent == 1) {
                    colorIndex = this._showNum - 1;
                    this._colorLength = this.totalLen;
                } else {
                    let temp = percent * this._showNum;
                    colorIndex = Math.floor(temp);
                    this._colorLength = (temp - colorIndex) * this.totalLen;
                }
                // this._isPlay = true;
                if (this._isFristShow) {
                    this._isFristShow = false;
                    this._colorIndex = colorIndex;
                    this.bossProgressInter.width = this.bossProgressUp.width = this._colorLength;
                    this.setColor(colorIndex);
                    // Laya.timer.once(100, this, this.checkHP);
                } else {
                    let times = this._colorIndex - colorIndex;
                    this._colorIndex = colorIndex;
                    let inter: number = 100;
                    if (times != 0) {
                        inter = Math.floor(100 / times);
                        this.bossProgressInter.visible = false;
                        this.showEffect(times, inter);
                    } else {
                        this.endEffect(false, inter);
                    }
                }
            }
        }

        //攻击对象是归属者时不显示血条
        private judgeCanContinue(role: Role): boolean {
            if (!role) return false;
            let type: RoleType = role.property.get("type");
            let mapId: SCENE_ID = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            if (type === RoleType.Monster) {
                let occ: int = role.property.get('occ');
                let tType: int = MonsterCfg.instance.getMonsterById(occ)[monsterFields.bossType];
                if (tType && (mapId === SCENE_ID.scene_home_boss || mapId === SCENE_ID.scene_temple_boss)) {
                    return false;
                }
            }
            if (type === RoleType.Player) {
                let bossOcc: int = BossDungeonModel.instance.selectLastBoss;
                let dropOwn: DropOwn = BossDungeonModel.instance.getOwnByBossId(bossOcc);
                let playerId: int;
                if (dropOwn) {
                    playerId = dropOwn[DropOwnFields.objId];
                    if (playerId === role.property.get(`id`)) { //归属者是挨打的人
                        if (BossDungeonModel.instance.playerIsMeAttack(playerId)) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        private isSameMan(role: Role): boolean {
            // if (role.property && this._targetProperty) {
            //     let roleType: int = role.property.get("type");
            //     let recordType: int = this._targetProperty.get("type");
            //     if (roleType === RoleType.Player && recordType === RoleType.Player) {
            //         if (this._targetProperty.get("id") === role.property.get("id")) {
            //             console.log(`同一个玩家return 掉`);
            //             return false;
            //         }
            //     }
            // }
            return true;
        }

        private showEffect(times: number, inter: number): void {
            let temp = times - 1;
            this.interColor(this._colorIndex + times);
            this._bossProgressShowEffectTween.stop();
            this._bossProgressShowEffectTween.to({ width: 0 }, inter).onComplete((): void => {
                this.bossProgressUp.width = this.totalLen;
                if (temp > 0) {
                    this.showEffect(temp, inter);
                } else {
                    this.endEffect(true, inter);
                }
            }).start();
        }

        private endEffect(isEffect: boolean, inter: number): void {
            if (isEffect) {
                this.bossProgressInter.width = this.totalLen;
            }
            this.setColor(this._colorIndex);
            this.bossProgressInter.visible = true;
            this._bossProgressUpTween.stop();
            this._bossProgressInterTween.stop();
            this._bossProgressUpTween.to({ width: this._colorLength }, inter).start();
            this._bossProgressInterTween.to({ width: this._colorLength }, inter * 3).start();
        }

        //设置过渡的颜色（不可能出现最后一行的情况）
        private interColor(colorIndex: number): void {
            if (this._colorArr[colorIndex] != null) {
                this.bossProgressUp.skin = `health_point/dt_guaiwu_${this._colorArr[colorIndex]}.png`;
            }
            if (this._colorArr[colorIndex - 1] != null) {
                this.bossProgressUnder.skin = `health_point/dt_guaiwu_${this._colorArr[colorIndex - 1]}.png`;
            }
            this.bossBloodNum.text = '×' + (colorIndex + 1).toString();
        }

        //设置颜色显示
        private setColor(colorIndex: number): void {
            this.bossProgressUp.skin = `health_point/dt_guaiwu_${this._colorArr[colorIndex]}.png`;
            if (colorIndex != 0) {
                this.bossProgressUnder.visible = true;
                this.bossProgressUnder.skin = `health_point/dt_guaiwu_${this._colorArr[colorIndex - 1]}.png`;
            } else {
                this.bossProgressUnder.visible = false;
            }
            this.bossBloodNum.text = '×' + (colorIndex + 1).toString();
        }

        private checkHP(): void {
            if (this.nowHP == 0) {
                this.close();
            }
        }

        public destroy(): void {
            this._items = this.destroyElement(this._items);
            super.destroy();
        }

        //
        // private hideShow(): void {
        //     LogUtils.info(LogFlags.HealthPoint, `_________+++++++++++++++++++++++++++++++++++++离开场景`);
        //     Laya.timer.clear(this, this.checkHP);
        //     this.close();
        //     this._isPlay = false;
        // }
    }
}
