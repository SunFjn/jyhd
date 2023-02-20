/////<reference path="../config/wing_cfg.ts"/>
/////<reference path="../wing/wing_model.ts"/>

/** 风水加成Item */
namespace modules.xianfu {
    import FengshuiAttItemUI = ui.FengshuiAttItemUI;

    export class FengshuiAttItem extends FengshuiAttItemUI {

        private _type: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._type = -1;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_WIND_WATER_UPTATE, this, this.setList);
        }

        public onOpened(): void {
            super.onOpened();
            this.setList();
        }

        private setList(): void {
            let resList: number[] = XianfuModel.instance.fengshuiResList;
            for (let i: int = 0, len: int = resList.length; i < len; i++) {
                let dimId: number = resList[i] / 100 >> 0;
                if (dimId === this._type) {
                    this.updateView(resList[i]);
                    return;
                }
            }
            this.lvTxt.text = `(未激活)`;
            this.lvTxt.color = `#ff3e3e`;
            this.desTxt.text = `效果:无加成`;
        }

        private updateView(resId: number): void {
            let currCfg: Configuration.xianfu_decorate = config.XianfuDecorateCfg.instance.getCfgById(resId);
            let type: number = currCfg[Configuration.xianfu_decorateFields.type];
            let param: number[] = currCfg[Configuration.xianfu_decorateFields.param];
            let currValue: number = param[0]; //当前值
            this.lvTxt.text = `Lv.${(resId % 100).toString()}`;

            if (type == 0) {  //对指定建筑产出加成
                let buildId: number = param[0];  //建筑id
                let addType: number = param[1];  //加成类型
                currValue = param[2]; //当前值
                this.desTxt.text = `效果:` + XianfuModel.instance.getType0AttAddStr(addType, buildId, currValue, param);
            } else {
                this.desTxt.text = `效果:` + XianfuModel.instance.getAttAddStr(type, currValue);
            }
            this.lvTxt.color = this.desTxt.color = `#168a17`;
        }

        public set type(type: number) {
            let name: string;
            if (type == 0) {//福盈门、 11
                name = `fym`;
                this._type = 11;
            } else if (type == 1) {//八宝柜、12
                name = `bbg`;
                this._type = 12;
            } else if (type == 2) {//纳财瓶、21
                name = `ncp`;
                this._type = 21;
            } else if (type == 3) {//星罗棋、22
                name = `xlq`;
                this._type = 22;
            } else if (type == 4) {//粮食壁、31
                name = `fgb`;
                this._type = 31;
            } else if (type == 5) {//风水山 32
                name = `fss`;
                this._type = 32;
            } else if (type == 6) {//长岁灯、13
                name = `csd`;
                this._type = 13;
            } else if (type == 7) {//锦绣花、23
                name = `jxh`;
                this._type = 23;
            } else if (type == 8) {//转运亭 33
                name = `zyt`;
                this._type = 33;
            } else if (type == 9) {//如意屏 14
                name = `ryp`;
                this._type = 14;
            } else if (type == 10) {//山河图、24
                name = `sht`;
                this._type = 24;
            } else if (type == 11) {//镇宅狮 34
                name = `zzs`;
                this._type = 34;
            }
            this.iconImg.skin = `assets/icon/ui/xianfu_decorate/txt_xf_${name}.png`;
        }
    }
}