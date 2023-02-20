/**单人boss单元项*/
///<reference path="../config/pay_reward_weight_cfg.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
namespace modules.yunmeng {
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import BossState = Protocols.BossState;
    import BossStateFields = Protocols.BossStateFields;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResFields = Configuration.MonsterResFields;
    import YunMengMiJingModel = modules.yunmeng.YunMengMiJingModel;
    import Event = laya.events.Event;
    export class YunMengMiJingBossItem extends ui.YunMengMiJingBossItemUI {
        private _proCtrl: ProgressBarCtrl;
        private _bossId: number;
        private _reviveTime: number;
        private _isDead: boolean;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._proCtrl = new ProgressBarCtrl(this.proCtrlImg, 145);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this, Event.CLICK, this, () => {
                GlobalData.dispatcher.event(CommonEventType.YUNMENGMIJING_CLICK);
            });
            GlobalData.dispatcher.on(CommonEventType.DUNGEON_BOSS_UPDATE, this, this.updateState);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.loopHandler);
            GlobalData.dispatcher.off(CommonEventType.DUNGEON_BOSS_UPDATE, this, this.updateState);
        }

        protected onOpened(): void {
            super.onOpened();
        }

        protected setData(value: any): void {
            super.setData(value);
            if (!value) {
                return;
            }
            this._bossId = value as number;
            this._reviveTime = 0;
            this.selectShow();
            let cfg: MonsterRes = YunMengMiJingModel.instance.getCfgByid(this._bossId);
            this.nameText.text = cfg[MonsterResFields.name];//读数据
            this.bossLevel.text = `Lv.${cfg[MonsterResFields.level]}`;
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
            // if (this._reviveTime - GlobalData.serverTime > 0) {
            //     return;
            // }
            super.setSelected(value);
            this.selectShow();
        }

        private selectShow(): void {
            if (this.selected) {
                this.xuanZeImg.visible = true;
                // console.log("找相应的boss: " + this._bossId);
                if (this._bossId) {
                    YunMengMiJingModel.instance.setSelectTarget(this._bossId, true);
                }
            } else {
                this.xuanZeImg.visible = false;
            }
        }

        private updateState(): void {
            let bossstate: Protocols.BossInfo = YunMengMiJingModel.instance.getBossSeversInfoById(this._bossId);
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
            // console.log("目标类型： " + PlayerModel.instance.selectTargetType);
            // console.log("目标id： " + PlayerModel.instance.selectTargetId);
            // if (PlayerModel.instance.selectTargetType == 1) {
            //     if (PlayerModel.instance.selectTargetId == this._bossId) {
            //         this.xuanZeImg.visible = true;
            //     }
            // }
        }

        private loopHandler(): void {
            let time = this._reviveTime - GlobalData.serverTime;
            if (time <= 0) {
                this._proCtrl.maxValue = 10000;
                this._proCtrl.value = 10000;
                this.valueText.text = "100%";
                this.remainTime.visible = false;
                this.proImg.visible = true;
                this.valueText.visible = true;
                Laya.timer.clear(this, this.loopHandler);
                return;
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

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.loopHandler);
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
            this._proCtrl.destroy();
            this._proCtrl = null;

        }
    }
}