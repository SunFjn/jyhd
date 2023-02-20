///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/scene_riches_cfg.ts"/>
///<reference path="../config/blend_cfg.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
namespace modules.kunlun {
    import Point = laya.maths.Point;
    import KunLunModel = modules.kunlun.KunLunModel;

    export class KunLunTipAlert extends ui.KunLunTipAlertUI {
        private _pos: Point;
        private _type: number;
        private _timer: number = 0;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        public onOpened(): void {
            super.onOpened();
            this.tipHtml.mouseEnabled = false;
            this.tipHtml.color = "#FFFFFF";
            this.tipHtml.style.fontFamily = "SimHei";
            this.tipHtml.style.fontSize = 24;
            // this.tipHtml.style.align = "center";
            let bufftime = KunLunModel.instance.buffMaxTime / 1000 >> 0;
            this.tipHtml.innerHTML = `<span style="color:#585858">双倍奖励BUFF:游泳速度提升50%，瑶池内获得的奖励翻倍，每个BUFF持续${bufftime}秒，多个BUFF的持续时间可叠加</span>`;//
            // let kuanNum = this.tipHtml.width;
            // this.tipHtml.y = (this.HlMLImg.height - kuanNum) / 2;
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }

        public destroy(): void {
            super.destroy();
        }
    }
}