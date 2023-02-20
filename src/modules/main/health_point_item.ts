/** 血条面板*/


///<reference path="../config/monster_res_cfg.ts"/>
///<reference path="../scene/scene_ctrl.ts"/>
///<reference path="../player/player_model.ts"/>

namespace modules.main {
    import HealthPointItemUI = ui.HealthPointItemUI;

    export class HealthPointItem extends HealthPointItemUI {
        constructor() {
            super();
        }
        private _playerProFactTween: TweenJS;
        private _playerProInterTween: TweenJS;


        protected initialize(): void {
            super.initialize();
            this._playerProFactTween = TweenJS.create(this.playerProFact).to({ width: 0 }, 100);
            this._playerProInterTween = TweenJS.create(this.playerProInter).to({ width: 0 }, 300)
        }
        protected removeListeners(): void {
            super.removeListeners();
            this._playerProFactTween.stop();
            this._playerProInterTween.stop();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }

        protected onOpened(): void {
            super.onOpened();
        }

        public updateProgress(hp: number, maxHp: number): void {//更新血量显示
            let endWidth = Math.floor((hp / maxHp) * 186);
            this.bossPercent.text = ((hp / maxHp) * 100).toFixed(2) + '%';
            this._playerProFactTween.stop();
            this._playerProInterTween.stop();
            this._playerProFactTween.property.width = endWidth;
            this._playerProInterTween.property.width = endWidth;
            this._playerProFactTween.start();
            this._playerProInterTween.start();
        }

        public setVisible(visible: boolean) {
            if (visible == this.visible) return;
            this.visible = visible;
        }

        public destroy(): void {
            super.destroy();
        }

    }
}
