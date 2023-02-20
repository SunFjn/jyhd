/** 玄火副本等级和buff弹窗 */

namespace modules.xuanhuo {
    import XuanHuoLevelAndBuffAlertUI = ui.XuanHuoLevelAndBuffAlertUI;
    import EffectCfg = config.EffectCfg;
    import BlendCfg = config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import effect = Configuration.effect;
    import effectFields = Configuration.effectFields;

    export class XuanHuoLevelAndBuffAlert extends XuanHuoLevelAndBuffAlertUI {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, common.LayaEvent.CLICK, this, this.close);
        }

        onOpened(): void {
            super.onOpened();
            this.updateView();
        }

        public close(): void {
            super.close();
        }

        //刷新视图
        private updateView() {
            let level: number = XuanHuoModel.instance.getPowerLevel()
            let buffdesc = "全属性:+0%";

            if (level != 0) {
                let baseBuffId: number = BlendCfg.instance.getCfgById(62010)[blendFields.intParam][0];
                let realBuffId = baseBuffId + level - 1;
                let cfg: effect = EffectCfg.instance.getCfgById(realBuffId);
                buffdesc = cfg[effectFields.desc];
            }
            
            this.levelTxt.text = `玄火之力:${level}层`
            this.buffDescTxt.text = buffdesc;
        }
    }
}