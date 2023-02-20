/** 血条面板*/


///<reference path="../config/monster_res_cfg.ts"/>
///<reference path="../scene/scene_ctrl.ts"/>
///<reference path="../player/player_model.ts"/>

namespace modules.main {
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResFields = Configuration.MonsterResFields;
    import GameCenter = game.GameCenter;
    import LogUtils = game.misc.LogUtils;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import Layer = ui.Layer;
    import Property = game.role.Property;
    import BelongViewUI = ui.BelongViewUI;
    import Role = game.role.Role;
    import DropOwnFields = Protocols.DropOwnFields;
    import SceneModel = modules.scene.SceneModel;
    import MonsterShow = Protocols.MonsterShow;
    import MonsterShowFields = Protocols.MonsterShowFields;
    import DropOwn = Protocols.DropOwn;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import BossInfo = Protocols.BossInfo;
    import BossInfoFields = Protocols.BossInfoFields;
    import BossStateFields = Protocols.BossStateFields;
    import BossState = Protocols.BossState;
    import BossDungeonModel = modules.bossDungeon.BossDungeonModel;
    import RealNameUI = ui.RealNameUI;
    export class BelongPanel extends BelongViewUI {

        private _playerTotalLen: number;
        private _bossTotalLen: number;

        private _bossNowHP: number;
        private _isFristShow: boolean = true;
        private _showNum: number = 1;
        private _showColor: Array<number> = [6, 7, 8, 9, 10];//绿、蓝、紫、橙、红
        private _colorArr: Array<number>;
        private _colorIndex: number;
        private _colorLength: number;

        private _bossTarget: Property;
        private _playerTarget: Property;

        private _playerProFactTween: TweenJS;
        private _playerProInterTween: TweenJS;
        private _bossProgressUpTween: TweenJS;
        private _bossProgressInterTween: TweenJS;
        private _bossProgressShowEffectTween: TweenJS;

        private _restTm: number = 0;
        private _bossOcc: number = 0;
        protected initialize(): void {
            super.initialize();
            this._colorArr = new Array<number>();
            this.layer = Layer.BOTTOM_LAYER;
            this.closeByOthers = false;
            this.top = 150;
            this.centerX = 0;
            this.zOrder = -1;
            this._colorIndex = 0;
            this._colorLength = 0;
            this._playerTotalLen = 242;
            this._bossTotalLen = 378;

            this._playerProFactTween = TweenJS.create(this.playerProFact).to({ width: 0 }, 100);
            this._playerProInterTween = TweenJS.create(this.playerProInter).to({ width: 0 }, 300).onComplete(this.checkHP.bind(this));

            this._bossProgressUpTween = TweenJS.create(this.bossProgressUp);
            this._bossProgressInterTween = TweenJS.create(this.bossProgressInter).onComplete(this.checkHP.bind(this));
            this._bossProgressShowEffectTween = TweenJS.create(this.bossProgressUp);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BOSS_OWN_UPDATE, this, this.updateBelong);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_TARGET_CHANGE, this, this.updateBelong);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BOSS_ATTACK_UPDATE, this, this.updateBelong);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BOSS_UPDATE, this, this.updateBossState);
            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
        }

        private resetBossTarget(target: Property): void {
            if (this._bossTarget != null) {
                this._bossTarget
                    .off("hp", this, this.updateBoss)
                    .off("destroyed", this, this.close);
            }
            this._bossTarget = target;
            if (this._bossTarget != null) {
                this._bossTarget
                    .on("hp", this, this.updateBoss)
                    .on("destroyed", this, this.close);
            }
        }

        private resetPlayerTarget(target: Property): void {
            if (this._playerTarget != null) {
                this._playerTarget.off("hp", this, this.updatePlayer);
            }
            this._playerTarget = target;
            if (this._playerTarget != null) {
                this._playerTarget.on("hp", this, this.updatePlayer);
            }
        }

        /**
         * name
         */
        public closeRestTm() {
            Laya.timer.clear(this, this.activityHandler);
            this.bossBuffTextBox.visible = this.bossBuffText.visible = false;
            this.bossNameTxt.visible = true;
            this._restTm = 0;
        }
        protected onOpened(): void {
            super.onOpened();
            this.closeRestTm();
            LogUtils.info(LogFlags.HealthPoint, `___________________________打开界面`);

            let monsters: Array<MonsterShow> = SceneModel.instance.monsters;
            this._bossOcc = BossDungeonModel.instance.selectLastBoss;
            let bossId: int;

            for (let ele of monsters) {
                let occ: int = ele[MonsterShowFields.occ];
                if (occ === this._bossOcc) {
                    bossId = ele[MonsterShowFields.objId];
                    break;
                }
            }
            let bossRole: Role = GameCenter.instance.getRole(bossId);
            if (bossRole == null) {
                this.close();
                return;
            }
            this.resetBossTarget(bossRole.property);
            this.visible = true;
            this._isFristShow = true;

            //刷新归属者
            this.updateBelong();

            let cfg: MonsterRes = MonsterResCfg.instance.getCfgById(this._bossOcc);//从表中读取数据
            //1是boss
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
            if (!cfg[MonsterResFields.icon]) {
                this.bossHeadImg.skin = `assets/icon/monster/310001.png`;
            } else {
                this.bossHeadImg.skin = `assets/icon/monster/${cfg[MonsterResFields.icon]}.png`; //设置图标
            }
            this.bossNameTxt.text = `${cfg[MonsterResFields.name]}    Lv.${this._bossTarget.get("level")}`;  //等级设置
            this.updateBoss();
            this.updatePlayer();
            this.updateBossState();
        }


        private updateBoss(): void {
            if(this._bossProgressInterTween.isPlaying || this._bossProgressUpTween.isPlaying)return;
            let health = this._bossTarget.get("hp");
            this._bossNowHP = health[0];   //设置当前血量
            let maxHp: number = health[1];
            if(this._bossNowHP == maxHp){
                this.bossProgressUp.width = this.bossProgressInter.width = this._bossTotalLen;
                this._isFristShow = true;
            }
            let percent: number = this._bossNowHP / maxHp;
            let showPercent = (percent * 100).toFixed(2);
            this.bossPercentTxt.text = showPercent + '%';
            let colorIndex: number = 0;

            if (percent == 1) {
                colorIndex = this._showNum - 1;
                this._colorLength = this._bossTotalLen;
            } else {
                let temp = percent * this._showNum;
                colorIndex = Math.floor(temp);
                this._colorLength = (temp - colorIndex) * this._bossTotalLen;
            }
            if (this._isFristShow) {
                this._isFristShow = false;
                this._colorIndex = colorIndex;
                // console.log(`_isFristShow--->${this._colorLength}`);
                this.bossProgressInter.width = this.bossProgressUp.width = this._colorLength;
                this.setColor(colorIndex);
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

        private updatePlayer(): void {
            if (!this._playerTarget) return;
            let health = this._playerTarget.get("hp");
            let nowHp: number = health[0];   //设置当前血量
            let maxHp: number = health[1];

            let endWidth = Math.floor((nowHp / maxHp) * this._playerTotalLen);
            if (this._isFristShow) {
                this._isFristShow = false;
                this.playerProInter.width = this.playerProFact.width = this._playerTotalLen;
            }
            this._playerProFactTween.stop();
            this._playerProInterTween.stop();
            this._playerProFactTween.property.width = endWidth;
            this._playerProInterTween.property.width = endWidth;
            this._playerProFactTween.start();
            this._playerProInterTween.start();
        }


        private updateBelong(): void {
            let bossOcc: int = this._bossTarget.get("occ");
            if (!bossOcc) return;
            let dropOwn: DropOwn = BossDungeonModel.instance.getOwnByBossId(bossOcc);
            let playerId: int;
            if (dropOwn) {
                playerId = dropOwn[DropOwnFields.objId];
            }
            let playerRole: Role = GameCenter.instance.getRole(playerId);
            this.resetPlayerTarget(playerRole ? playerRole.property : null);

            if (!this._playerTarget) { //没有归属者
                this.playerBox.visible = false;
            } else {
                this.playerBox.visible = true;
                let mineId: int = PlayerModel.instance.actorId;
                let id: int = this._playerTarget.get("id");
                if (id === mineId) { //归属者是自己
                    this.btn.visible = false;
                    this.setTxtShow(`当前归属自己`, `#50ff28`);
                }
                else {
                    if (BossDungeonModel.instance.playerIsMeAttackGuiShu(id)) {
                        this.btn.visible = false;
                        this.setTxtShow(`正在抢夺归属`, `#ff3e3e`);
                    }
                    else {
                        this.btn.visible = true;
                        this.tipTxt.visible = false;
                    }
                }
                this.nameTxt.text = this._playerTarget.get("name");
                let occ: number = this._playerTarget.get("occ");
                this.headImg.skin = `assets/icon/head/${occ}.png`;
            }
        }

        private setTxtShow(content: string, color: string): void {
            this.tipTxt.visible = true;
            this.tipTxt.text = content;
            this.tipTxt.color = color;
        }

        private showEffect(times: number, inter: number): void {
            let temp = times - 1;
            this.interColor(this._colorIndex + times);
            this._bossProgressShowEffectTween.stop();
            this._bossProgressShowEffectTween.to({ width: 0 }, inter).onComplete((): void => {
                this.bossProgressUp.width = this._bossTotalLen;
                if (temp > 0) {
                    this.showEffect(temp, inter);
                } else {
                    this.endEffect(true, inter);
                }
            }).start();
        }


        private endEffect(isEffect: boolean, inter: number): void {
            if (isEffect) {
                this.bossProgressInter.width = this._bossTotalLen;
            }
            this.setColor(this._colorIndex);
            this.bossProgressInter.visible = true;
            this._bossProgressUpTween.stop();
            this._bossProgressInterTween.stop();
            let len: number = this._colorLength > this._bossTotalLen ? this._bossTotalLen : this._colorLength;
            this._bossProgressUpTween.to({ width: len }, inter).start();
            this._bossProgressInterTween.to({ width: len }, inter * 3).start();
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
            if (this._bossNowHP <= 0) {
                this.close();
            }
        }

        private btnHandler(): void {
            if (!this._playerTarget) {
                notice.SystemNoticeManager.instance.addNotice(`找不到归属者`, true);
                return;
            }

            let id: int = this._playerTarget.get("id");
            if (!id) {
                throw new Error(`归属者没有id`);
            }
            if (CommonUtil.isTongXianMeng(id)) {
                modules.notice.SystemNoticeManager.instance.addNotice("不可攻击同一公会玩家", true);
                return;
            }
            let mapId: int = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            if (mapId === SCENE_ID.scene_home_boss) {
                BossHomeModel.instance.setSelectTarget(id, false);
            }
            else if (mapId === SCENE_ID.scene_temple_boss) {
                modules.sheng_yu.ShengYuBossModel.instance.setSelectTarget(id, false);
            }
        }


        public updateBossState() {
            if (this._bossOcc != 0) {
                let _bossInfo: BossInfo = DungeonModel.instance.getBossInfoById(this._bossOcc);
                if (_bossInfo) {
                    let _bossState: BossState = _bossInfo[BossInfoFields.bossState];
                    if (_bossState) {
                        // console.log("当前BOSS 无敌剩余时间：" + _bossState[BossStateFields.wudiTime]);
                        let bolll = this._restTm != (_bossState[BossStateFields.wudiTime]);
                        if (bolll) {
                            this._restTm = _bossState[BossStateFields.wudiTime];
                        }
                        this.setActivitiTime();
                        return;
                    }
                }
            }
            this.bossBuffTextBox.visible = this.bossBuffText.visible = false;
            this.bossNameTxt.visible = true;
        }
        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            if (this._restTm != 0 && this._restTm >= GlobalData.serverTime) {//
                this.bossBuffTextBox.visible = this.bossBuffText.visible = true;
                this.bossNameTxt.visible = false;
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.bossBuffTextBox.visible = this.bossBuffText.visible = false;
                this.bossNameTxt.visible = true;
                this._restTm = 0;
            }
        }

        private activityHandler(): void {
            this.bossBuffText.text = `无敌:BOSS开始无敌，持续${CommonUtil.timeStampToSS(this._restTm)}秒`;
            if (this._restTm < GlobalData.serverTime) {
                this.bossBuffTextBox.visible = this.bossBuffText.visible = false;
                this.bossNameTxt.visible = true;
                this._restTm = 0;
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        public close(): void {
            this.resetBossTarget(null);
            this.resetPlayerTarget(null);
            this._playerProFactTween && this._playerProFactTween.stop();
            this._playerProInterTween && this._playerProInterTween.stop();
            this._bossProgressUpTween && this._bossProgressUpTween.stop();
            this._bossProgressInterTween && this._bossProgressInterTween.stop();
            this._bossProgressShowEffectTween && this._bossProgressShowEffectTween.stop();
            this.closeRestTm();
            super.close();
            Laya.timer.clear(this, this.activityHandler);
        }

        public destroy(): void {
            this._playerProFactTween && (this._playerProFactTween = null);
            this._playerProInterTween && (this._playerProInterTween = null);
            this._bossProgressUpTween && (this._bossProgressUpTween = null);
            this._bossProgressInterTween && (this._bossProgressInterTween = null);
            this._bossProgressShowEffectTween && (this._bossProgressShowEffectTween = null);
            super.destroy();
        }
    }
}
