/**单人boss单元项*/
///<reference path="../config/pay_reward_weight_cfg.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
namespace modules.xuanhuo {
    import BossState = Protocols.BossState;
    import BossStateFields = Protocols.BossStateFields;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResFields = Configuration.MonsterResFields;
    import scene_temple_bossFields = Configuration.scene_temple_bossFields;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import scene_xuanhuo_arena = Configuration.scene_xuanhuo_arena;
    import scene_xuanhuo_arenaFields = Configuration.scene_xuanhuo_arenaFields;
    export class XuanhuoBossListItemItem extends ui.XuanHuoBossItemUI {
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this._proCtrl = new ProgressBarCtrl(this.proCtrlImg, this.proCtrlImg.width, this.valueText);
            this.updateState();
        }
        private _bossId: number;
        private _reviveTime: number;
        private _isDead: boolean;
        private _proCtrl: ProgressBarCtrl;

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BOSS_UPDATE, this, this.updateInfo);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.loopHandler);
        }
        protected setData(value: scene_xuanhuo_arena): void {
            super.setData(value);
            if (!value) {
                return;
            }
            this._bossId = value[scene_xuanhuo_arenaFields.occ] as number;
            this._reviveTime = 0;
            this.selectShow();
            let cfg: MonsterRes = XuanhuoBossModel.instance.getCfgByid(this._bossId);
            this.bossName.text = cfg[MonsterResFields.name];//读数据
            this.bossLevel.text = `Lv.${cfg[MonsterResFields.level]}`;
            this.bossLevel.text = ``;
            this.proImg.visible = true;
            this.valueText.visible = true;
            this.remainTime.visible = false;
            this._isDead = false;
            this._proCtrl.maxValue = 10000;
            this._proCtrl.value = 10000;
            this.valueText.text = "100%";
            this.updateState();
        }
        protected setSelected(value: boolean): void {
            console.log(DungeonModel.instance.bossIsLive(this._bossId), this._bossId)
            // if (DungeonModel.instance.bossIsLive(this._bossId)) {

            //     return;

            // }
            super.setSelected(value);
            this.selectShow();
        }
        private selectShow(): void {
            if (this.selected) {
                this.isSelect.visible = true;
                if (this._bossId) {
                    XuanHuoModel.instance.setSelectTarget(this._bossId, true);
                    // WindowManager.instance.open(WindowEnum.BELONG_PANEL);
                }
            } else {
                this.isSelect.visible = false;
            }
        }
        private updateInfo(): void {
            this.updateState();
        }
        private updateState(): void {
            let bossstate: Protocols.BossInfo = XuanhuoBossModel.instance.getBossSeversInfoById(this._bossId);
            if (bossstate) {
                let info: BossState = bossstate[Protocols.BossInfoFields.bossState];
                if (info[BossStateFields.dead]) {
                    Laya.timer.clear(this, this.loopHandler);
                    this._reviveTime = info[BossStateFields.reviveTime];
                    let time = this._reviveTime - GlobalData.serverTime;

                    if (time <= 0) {
                        return;
                    }
                    this.setTime(time);
                    this._isDead = true;
                    this.proImg.visible = false;
                    this.valueText.visible = false;
                    this.remainTime.visible = true;
                    this._proCtrl.maxValue = 10000;
                    this._proCtrl.value = 100;
                    this.valueText.text = "100%";
                    Laya.timer.loop(1000, this, this.loopHandler);
                } else if (!info[BossStateFields.dead]) {
                    Laya.timer.clear(this, this.loopHandler);
                    this._isDead = false;
                    this.proImg.visible = true;
                    this.valueText.visible = true;
                    this.remainTime.visible = false;
                    //显示血量比例
                    let hpPer = info[Protocols.BossStateFields.hpPer];
                    this._proCtrl.maxValue = 10000;
                    this._proCtrl.value = 10000 * hpPer;
                    this.valueText.text = ((hpPer * 100) >> 0) + "%";
                }
            }
        }

        private loopHandler(): void {
            let time = this._reviveTime - GlobalData.serverTime;
            if (time <= 0) {
                this.remainTime.visible = false;
                this.hasRefreshTxt.visible = true;
                Laya.timer.clear(this, this.loopHandler);
                return;
            } else {
                if (this.hasRefreshTxt.visible) this.hasRefreshTxt.visible = false;
            }
            this.setTime(time);
        }

        private setTime(time: number): void {
            let hour = Math.floor(time / (60 * 60 * 1000));
            let miuter = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
            let sec = Math.floor((time % (60 * 1000)) / 1000);
            this.remainTime.text = this.formateData(hour) + ":" + this.formateData(miuter) + ":" + this.formateData(sec);
        }

        private formateData(input: number): string {
            let str: string = "";
            let t = input.toString();
            if (t.length < 2) {
                str = "0" + t;
                return str;
            }
            return t;
        }
    }
}