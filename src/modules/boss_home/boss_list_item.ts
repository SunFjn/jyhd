/**Boss显示单元项 */


namespace modules.bossHome {
    import BossListItemUI = ui.BossListItemUI;
    import BossState = Protocols.BossState;
    import BossStateFields = Protocols.BossStateFields;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResFields = Configuration.MonsterResFields;

    export class BossListItem extends BossListItemUI {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.updateState();
        }

        private _bossId: number;
        private _reviveTime: number;
        private _isDead: boolean;

        protected addListeners(): void {
            super.addListeners();
            GlobalData.dispatcher.on(CommonEventType.DUNGEON_BOSS_UPDATE, this, this.updateInfo);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.loopHandler);
            GlobalData.dispatcher.off(CommonEventType.DUNGEON_BOSS_UPDATE, this, this.updateInfo);
        }

        protected setSelected(value: boolean): void {
            // if (this._reviveTime - GlobalData.serverTime > 0) {
            //     return;
            // }
            super.setSelected(value);
            this.selectShow();
        }

        private updateInfo(): void {
            this.updateState();
        }

        private selectShow(): void {
            if (this.selected) {
                this.isSelect.visible = true;
            } else {
                this.isSelect.visible = false;
            }
        }

        private updateState(): void {
            let bossstate: Protocols.BossInfo = BossHomeModel.instance.getBossSeversInfoById(this._bossId);
            if (bossstate) {
                let info: BossState = bossstate[Protocols.BossInfoFields.bossState];
                if (info[BossStateFields.dead] && !this._isDead) {
                    Laya.timer.clear(this, this.loopHandler);
                    this._reviveTime = info[BossStateFields.reviveTime];
                    let time = this._reviveTime - GlobalData.serverTime;
                    if (time <= 0) {
                        return;
                    }
                    this.setTime(time);
                    this._isDead = true;
                    this.hasRefreshTxt.visible = false;
                    this.remainTime.visible = true;
                    Laya.timer.loop(1000, this, this.loopHandler);
                } else if (!info[BossStateFields.dead] && this._isDead) {
                    this._isDead = false;
                    this.hasRefreshTxt.visible = true;
                    this.remainTime.visible = false;
                }
            }
        }

        protected setData(value: any): void {
            super.setData(value);
            if (!value) {
                return;
            }
            this._bossId = value as number;
            this._reviveTime = 0;
            this.selectShow();
            let cfg: MonsterRes = BossHomeModel.instance.getCfgByid(this._bossId);
            // 此处怪物名字若大于4，则名字改为取前三个字加上省略号表示
            if (this.bossName.text.length > 4) {
                let tempName = cfg[MonsterResFields.name];
                this.bossName.text = tempName.substring(0,3) + "..."
            } else {
                this.bossName.text = cfg[MonsterResFields.name];//读数据
            }
            this.bossLevel.text = `Lv.${cfg[MonsterResFields.level]}`;
            this.hasRefreshTxt.visible = true;
            this.remainTime.visible = false;
            this._isDead = false;
            this.updateState();
        }

        private loopHandler(): void {
            let time = this._reviveTime - GlobalData.serverTime;
            if (time <= 0) {
                this.remainTime.visible = false;
                this.hasRefreshTxt.visible = true;
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
    }
}