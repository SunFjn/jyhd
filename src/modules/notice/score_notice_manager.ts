/** 获得积分、奇遇点时的通知管理器*/


namespace modules.notice {
    import ScoreNoticeInfo = ui.ScoreNoticeInfo;
    import FontClip = Laya.FontClip;
    import ScoreNoticeType = ui.ScoreNoticeType;
    import ScoreNoticeInfoFields = ui.ScoreNoticeInfoFields;
    import Component = Laya.Component;

    export class ScoreNoticeManager {
        private static _instance: ScoreNoticeManager;
        public static get instance(): ScoreNoticeManager {
            return this._instance = this._instance || new ScoreNoticeManager();
        }

        // 获得记录数组
        private _queue: Array<ScoreNoticeInfo>;
        private _isPlaying: boolean;
        private _skin: string;
        private _con: Component;
        private _typeImg: Laya.Image;
        private _valueClip: FontClip;
        private _tween: TweenJS;

        constructor() {
            this._queue = [];
            this._con = new Component();
            this._con.centerX = 0;
            this._con.y = 360;
            this._con.anchorX = this._con.anchorY = 0.5;
        }

        public isPlaying() {
            return this._isPlaying
        }
        public queueLenght() {
            return this._queue.length
        }
        // 添加一个提示
        public addNotice(type: ScoreNoticeType, value: number): void {
            this._queue.push([type, value]);
            this.check();
        }

        // 检查是否需要播放
        private check(): void {
            if (this._isPlaying) return;
            if (this._queue.length === 0) return;
            this.playEffect();
        }

        // 播放特效
        private playEffect(): void {
            this._isPlaying = true;
            let info: ScoreNoticeInfo = this._queue.pop();
            if (info) {
                let type: ScoreNoticeType = info[ScoreNoticeInfoFields.type];
                this._typeImg = this._typeImg || new Laya.Image();
                this._typeImg.skin = `assets/others/score_notice/${type}.png`;
                this._typeImg.x = -36;
                this._con.addChild(this._typeImg);
                if (!this._valueClip) {
                    this._valueClip = new FontClip("common/num_common_7.png", "0123456789");
                    this._con.addChild(this._valueClip);
                }
                let valueStr: string = info[ScoreNoticeInfoFields.value] + "";
                this._valueClip.value = valueStr;
                if (type === ScoreNoticeType.nineScore) {
                    this._valueClip.x = 214 + this._typeImg.x - 30;
                    this._con.width = this._valueClip.x + valueStr.length * 38;
                    this._con.height = 124;
                    this._valueClip.y = (this._con.height - 48) * 0.5;
                } else if (type === ScoreNoticeType.adventurePoint) {
                    this._valueClip.x = 249 + this._typeImg.x - 30;
                    this._con.width = this._valueClip.x + valueStr.length * 38;
                    this._con.height = 130;
                    this._valueClip.y = (this._con.height - 48) * 0.5;
                } else if (type === ScoreNoticeType.Xuanhuo) {
                    this._valueClip.x = 214 + this._typeImg.x - 30;
                    this._con.width = this._valueClip.x + valueStr.length * 38;
                    this._con.height = 124;
                    this._valueClip.y = (this._con.height - 48) * 0.5;
                }
                LayerManager.instance.addToNoticeLayer(this._con);
                this._con.scaleX = 2;
                this._con.scaleY = 2;
                if (!this._tween) {
                    this._tween = TweenJS.create(this._con).to({
                        scaleX: 1,
                        scaleY: 1
                    }, 200).onComplete(this.tweenEndHandler.bind(this));
                }
                this._tween.start();
            }
        }

        // 缓动结束后停留一秒消失
        private tweenEndHandler(): void {
            Laya.timer.once(1000, this, this.delayHandler);
        }

        private delayHandler(): void {
            this._typeImg.skin = "";
            this._con.removeSelf();

            // 动画结束
            this._isPlaying = false;
            this.check();
        }
    }
}