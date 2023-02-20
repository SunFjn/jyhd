/////<reference path="../$.ts"/>
/** 仙盟功能入口item */
namespace modules.faction {
    import FactionFuncEnterItemUI = ui.FactionFuncEnterItemUI;
    import BlendCfg = modules.config.BlendCfg;
    import GetBoxInfoReply = Protocols.GetBoxInfoReply;
    import GetBoxInfoReplyFields = Protocols.GetBoxInfoReplyFields;
    import blendFields = Configuration.blendFields;
    import GetFactionCopyInfoReply = Protocols.GetFactionCopyInfoReply;
    import GetFactionCopyInfoReplyFields = Protocols.GetFactionCopyInfoReplyFields;

    export class FactionFuncEnterItem extends FactionFuncEnterItemUI {

        private _type: string;

        constructor() {
            super();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAOZANG_INFO_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_COPY_INFO, this, this.updateView);

        }

        public setData(param: string): void {
            this._type = param;
            this.updateView();
        }

        private updateView(): void {
            let str: string;
            let redPro: Array<keyof ui.RedPointProperty>;
            if (this._type == `baozang`) {
                this.txtBg.visible = true;
                this.bgImg.skin = `faction/image_xm_bzbg.png`;
                // lv = BlendCfg.instance.getCfgById(36009)[Configuration.blendFields.intParam][0];
                let info: GetBoxInfoReply = FactionModel.instance.boxInfo;
                if (!info) return;
                let maxTime: number = BlendCfg.instance.getCfgById(36014)[blendFields.intParam][0];
                let remainTime: number = maxTime - info[GetBoxInfoReplyFields.openCount];
                str = `剩余挖掘次数：${remainTime}`;
                redPro = ["mineBaozangListRP", "helpBaozangListRP"];
            } else if (this._type == `zhuxian`) {
                this.bgImg.skin = `faction/image_xm_zhuxbg.png`;
                this.txtBg.visible = true;
                // lv = BlendCfg.instance.getCfgById(36022)[Configuration.blendFields.intParam][0];
                let info: GetFactionCopyInfoReply = FactionModel.instance.copyInfo;
                if (!info) return;
                let time: number = info[GetFactionCopyInfoReplyFields.time];
                str = `剩余挑战时长 ${CommonUtil.msToMMSS(time)}`;
                redPro = ["factionHurtAwardRP"];
            } else if (this._type == null) {
                this.txtBg.visible = false;
                this.bgImg.skin = `faction/image_xm_jqqd.jpg`;
                str = ``;
            }
            this.txt.text = str;
            if (redPro) {
                this.addAutoRegisteRedPoint(this.rpImg, redPro);
            } else {
                this.rpImg.visible = false;
            }
        }

        protected clickHandler(): void {
            if (this._type == `baozang`) {
                WindowManager.instance.open(WindowEnum.BAOZANG_LIST_PANEL);
            } else if (this._type == `zhuxian`) {
                WindowManager.instance.open(WindowEnum.FACTION_COPY_PANEL);
            }
        }
    }
}
