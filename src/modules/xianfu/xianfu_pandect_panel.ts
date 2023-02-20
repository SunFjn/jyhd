/////<reference path="../$.ts"/>
/** 仙府-家园总览面板 */
namespace modules.xianfu {
    import XianfuPandectViewUI = ui.XianfuPandectViewUI;
    import Event = Laya.Event;
    import GetBuildingInfoReplyFields = Protocols.GetBuildingInfoReplyFields;
    import xianfu = Configuration.xianfu;
    import XianfuCfg = modules.config.XianfuCfg;
    import xianfuFields = Configuration.xianfuFields;
    import XianfuAnimalCfg = modules.config.XianfuAnimalCfg;
    import UpdateSpiritAnimalTravel = Protocols.UpdateSpiritAnimalTravel;
    import UpdateSpiritAnimalTravelFields = Protocols.UpdateSpiritAnimalTravelFields;
    import xianfu_animal = Configuration.xianfu_animal;
    import xianfu_animalFields = Configuration.xianfu_animalFields;
    import attr = Configuration.attr;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import AttrUtil = modules.common.AttrUtil;
    import xianfu_build = Configuration.xianfu_build;
    import XianfuBuildCfg = modules.config.XianfuBuildCfg;
    import xianfu_buildFields = Configuration.xianfu_buildFields;
    import CustomSlide = common.CustomSlide;

    export class XianfuPandectPanel extends XianfuPandectViewUI {

        private _slide: CustomSlide;

        protected initialize(): void {
            super.initialize();

            this.centerX = this.centerY = 0;
            this._slide = new CustomSlide(this.con, this.box);
            this._slide.initState();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_BUILD_UPDATE, this, this.updateBuild);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_PET_UPDATE, this, this.updatePet);
        }

        protected removeListeners(): void {
            this._slide.removeListeners();
            super.removeListeners();
        }

        public destroy(): void {
            this._slide = this.destroyElement(this._slide);
            super.destroy();
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updatePet(): void {
            let ids: number[] = XianfuAnimalCfg.instance.ids;
            this.show_5_To_8(ids[0], this.box_5);
            this.show_5_To_8(ids[1], this.box_6);
            this.show_5_To_8(ids[2], this.box_7);
            this.show_5_To_8(ids[3], this.box_8);
        }

        private updateBuild(): void {
            //0药草园 1粮食园 2炼丹炉 3炼器炉 4炼魂炉
            //1粮食园
            this.show_0_Or_1_(1, this.box_0);
            //0药草园
            this.show_0_Or_1_(0, this.box_1);
            //2炼丹炉
            this.show_2_To_4(2, this.box_2);
            // 3炼器炉
            // this.show_2_To_4(3, this.box_3);
            //4炼魂炉
            // this.show_2_To_4(4, this.box_4);
        }

        private updateView(): void {
            this.lvMsz.value = XianfuModel.instance.lv.toString();
        }

        private show_0_Or_1_(id: number, parentNode: Laya.Node) {
            let info = XianfuModel.instance.getBuildInfo(id);
            let lv = info[GetBuildingInfoReplyFields.level];
            (<Laya.Text>(parentNode.getChildByName('lvTxt'))).text = `Lv.${lv}`;
            let cfg: xianfu = XianfuCfg.instance.getCfgByBuildIdAndLv(id, lv);
            let nextCfg: xianfu = XianfuCfg.instance.getCfgByBuildIdAndLv(id, lv + 1);
            if (!nextCfg) { //满级
                (<Laya.Box>(parentNode.getChildByName('maxLvBox'))).visible = false;
                (<Laya.Text>(parentNode.getChildByName('maxLvTxt'))).visible = true;
            } else {
                let addNum: number = nextCfg[xianfuFields.produce][0][1];
                let currNum: number = cfg[xianfuFields.produce][0][1];
                let intervalNum: number = addNum - currNum;
                let needLv: number = nextCfg[xianfuFields.level];
                (<Laya.Text>(parentNode.getChildByName('maxLvBox').getChildByName("upAttTxt"))).text = intervalNum.toString();
                (<Laya.Text>(parentNode.getChildByName('maxLvBox').getChildByName("needLvTxt"))).text = `(家园达到${needLv}级开启)`;
            }
            let timeStr = modules.common.CommonUtil.getTimeTypeAndTime(XianfuModel.instance.intervalOutPutTime[id]);
            (<Laya.Text>(parentNode.getChildByName('desTxt'))).text = `每${timeStr}` +
                `${id == 0 ? `聚灵` : `出产`}一次,增加${cfg[xianfuFields.produce][0][1]}点${id == 0 ? `药草` : `粮食`}值`;
        }

        private show_2_To_4(id: number, parentNode: Laya.Node): void {
            let info = XianfuModel.instance.getBuildInfo(id);
            let lv: number = info ? info[GetBuildingInfoReplyFields.level] : 1;
            (<Laya.Text>(parentNode.getChildByName('lvTxt'))).text = `Lv.${lv}`;
            let currExp: number = info ? info[GetBuildingInfoReplyFields.exp] : 1;
            let currCfg: xianfu_build = XianfuBuildCfg.instance.getCfgByIdAndLv(id, lv);
            let nextCfg: xianfu_build = XianfuBuildCfg.instance.getCfgByIdAndLv(id, lv + 1);
            let needExp: number = currCfg[xianfu_buildFields.exp];
            if (!needExp) needExp = currExp;
            (<Laya.Image>(parentNode.getChildByName('barImg'))).width = 211 * (currExp / needExp);
            (<Laya.Text>(parentNode.getChildByName('barTxt'))).text = `${currExp}/${needExp}`;
            let attrs: Array<attr> = currCfg[xianfu_buildFields.attr];
            let nextAttrs: Array<attr> = !nextCfg ? null : nextCfg[xianfu_buildFields.attr];
            this.formatEle(attrs, nextAttrs, this.operatEle(parentNode, currCfg, nextCfg));
        }

        private show_5_To_8(id: number, parentNode: Laya.Node): void {
            let info: UpdateSpiritAnimalTravel = XianfuModel.instance.getPetInfos(id);
            let lv: number = info ? info[UpdateSpiritAnimalTravelFields.level] : 1;
            let currExp: number = info ? info[UpdateSpiritAnimalTravelFields.exp] : 0;
            (<Laya.Text>(parentNode.getChildByName('lvTxt'))).text = `Lv.${lv}`;
            let currCfg: xianfu_animal = XianfuAnimalCfg.instance.getCfgByIdAndLv(id, lv);
            let nextCfg: xianfu_animal = XianfuAnimalCfg.instance.getCfgByIdAndLv(id, lv + 1);
            let needExp: number = currCfg[xianfu_animalFields.exp];
            (<Laya.Image>(parentNode.getChildByName('barImg'))).width = 211 * (currExp / needExp);
            (<Laya.Text>(parentNode.getChildByName('barTxt'))).text = `${currExp}/${needExp}`;
            let attrs: Array<attr> = currCfg[xianfu_animalFields.attrs];
            let nextAttrs: Array<attr> = nextCfg ? nextCfg[xianfu_animalFields.attrs] : null;
            this.formatEle(attrs, nextAttrs, this.operatEle(parentNode, currCfg, nextCfg));
        }

        private operatEle(parentNode: Laya.Node, currCfg: any, nextCfg: any,): [Array<Laya.Text>, Array<Laya.Text>] {
            let attTxtArr: Array<Laya.Text> = [
                (<Laya.Text>(parentNode.getChildByName('attTxt_0'))),
                (<Laya.Text>(parentNode.getChildByName('attTxt_1')))
            ];

            let attUpTxtArr: Array<Laya.Text> = [
                (<Laya.Text>(parentNode.getChildByName('maxLvBox').getChildByName("upAttTxt_0"))),
                (<Laya.Text>(parentNode.getChildByName('maxLvBox').getChildByName("upAttTxt_1")))
            ];

            if (!nextCfg) { // 满级
                (<Laya.Box>(parentNode.getChildByName('maxLvBox'))).visible = false;
                (<Laya.Text>(parentNode.getChildByName('maxLvTxt'))).visible = true;
                nextCfg = currCfg;
            }
            return [attTxtArr, attUpTxtArr];
        }

        private formatEle(attrs: Array<attr>, nextAttrs: Array<attr>, txts: [Array<Laya.Text>, Array<Laya.Text>]): void {
            for (let i: int = 0, len: int = attrs.length; i < len; i++) {
                let attCfg: attr_item = AttrItemCfg.instance.getCfgById(attrs[i][attrFields.type]);
                let attrValue: number = attrs[i][attrFields.value];
                let isPercent: number = attCfg[attr_itemFields.isPercent];
                txts[0][i].text = `${attCfg[attr_itemFields.name]} ${isPercent ? AttrUtil.formatFloatNum(attrValue) + "%" : Math.round(attrValue)}`;
                if (!nextAttrs) continue;
                let offset: number = nextAttrs[i][attrFields.value] - attrValue;
                txts[1][i].text = `${isPercent ? AttrUtil.formatFloatNum(offset) + "%" : Math.round(offset)}`;
            }
        }
    }
}