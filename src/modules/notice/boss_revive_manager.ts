/** BOSS复活提示管理器*/


namespace modules.notice {
    import BossInfo = Protocols.BossInfo;
    import BossInfoFields = Protocols.BossInfoFields;
    import BossStateFields = Protocols.BossStateFields;

    export class BossReviveManager {
        private static _instance: BossReviveManager;
        public static get instance(): BossReviveManager {
            return this._instance = this._instance || new BossReviveManager();
        }

        private _panel: BossRevivePanel;
        private _bossIds: Array<number>;

        constructor() {
            this._panel = new BossRevivePanel();
            this._bossIds = new Array<number>();

            // GlobalData.dispatcher.on(CommonEventType.DUNGEON_BOSS_UPDATE, this, this.check);
            GlobalData.dispatcher.on(CommonEventType.DUNGEON_BOSS_REVIVE_TIP, this, this.addBoss);
            GlobalData.dispatcher.on(CommonEventType.DUNGEON_BOSS_DEAD_REVIVE, this, this.deadHandler);
        }

        public addBoss(bossId: number): void {
            if (this._bossIds.indexOf(bossId) !== -1) return;
            let flag: boolean = false;
            for (let i: int = 0, len: int = this._bossIds.length; i < len; i++) {
                if (bossId < this._bossIds[i]) {
                    this._bossIds.splice(i, 0, bossId);
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                this._bossIds.push(bossId);
            }

            this.check();
        }

        private check(): void {
            if (!this._bossIds || this._bossIds.length === 0) {
                this._panel.removeSelf();
                return;
            }
            let bossId: number = this._bossIds[this._bossIds.length - 1];
            this._panel.setBoss(bossId);
            if (!this._panel.parent) {
                LayerManager.instance.addToNoticeLayer(this._panel);
                // 缓动
                this._panel.bottom = -304;
                TweenJS.create(this._panel).to({bottom: 200}, 150).start();
            }
        }

        private deadHandler(bossInfos: Array<BossInfo>): void {
            for (let i: int = 0, len: int = bossInfos.length; i < len; i++) {
                let bossInfo: BossInfo = bossInfos[i];
                if (bossInfo[BossInfoFields.bossState][BossStateFields.dead]) {   // BOSS死亡时去掉提示
                    let bossId: number = bossInfo[BossInfoFields.occ];
                    if (bossId === this._bossIds[this._bossIds.length - 1]) {
                        this.passOne();
                    } else if (this._bossIds.indexOf(bossId) !== -1) {
                        this._bossIds.splice(this._bossIds.indexOf(bossId), 1);
                    }
                }
            }
        }

        // pass一个BOSS
        public passOne(): void {
            if (this._bossIds && this._bossIds.length > 0) {
                this._bossIds.pop();
            }
            this.check();
        }

        // pass所有BOSS
        public passAll(): void {
            this._bossIds.length = 0;
            this.check();
        }

        // 显示
        public show(): void {
            this._panel.visible = true;
        }

        // 隐藏
        public hide(): void {
            this._panel.visible = false;
        }
    }
}