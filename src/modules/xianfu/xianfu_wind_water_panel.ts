///<reference path="../config/xianfu_decorate_cfg.ts"/>
/** 风水面板 */
namespace modules.xianfu {
    import BaseItem = modules.bag.BaseItem;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;
    import XianfuWindWaterViewUI = ui.XianfuWindWaterViewUI;
    import CustomClip = modules.common.CustomClip;
    import xianfu_fengshui = Configuration.xianfu_fengshui;
    import xianfu_fengshuiFields = Configuration.xianfu_fengshuiFields;
    import XianfuDecorateCfg = modules.config.XianfuDecorateCfg;
    import xianfu_decorate = Configuration.xianfu_decorate;
    import xianfu_decorateFields = Configuration.xianfu_decorateFields;
    import CommonUtil = modules.common.CommonUtil;
    import attr = Configuration.attr;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attr_item = Configuration.attr_item;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import AttrUtil = modules.common.AttrUtil;

    export class XianfuWindWaterPanel extends XianfuWindWaterViewUI {

        // private _scheEff: CustomClip; //大师进度特效
        private _list: CustomList;
        private _btnGroup: BtnGroup;
        private _item: BaseItem;
        private _nameArr: Array<Laya.Text>;
        private _liftArr: Array<Laya.Text>;
        private _upImgsArr: Array<Laya.Image>;
        private _valueArr: Array<Laya.Text>;
        private _btnClip: CustomClip;
        private _ids: number[];
        private _btnGroupRPs: Laya.Image[];
        private _numDiff: number;

        public destroy(destroyChild: boolean = true): void {
            // this._scheEff = this.destroyElement(this._scheEff);
            this._list = this.destroyElement(this._list);
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;

            // this._scheEff = CommonUtil.creatEff(this.con, `wave`, 4);
            // this._scheEff.visible = true;
            // this._scheEff.pos(0, -20);

            this._list = new CustomList();
            this._list.pos(48, 485);
            this._list.scrollDir = 2;
            this._list.spaceX = 8;
            this._list.vCount = 1;
            this._list.width = 700;
            this._list.height = 236;
            this._list.itemRender = XianfuResItem;
            this.addChild(this._list);

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.btnGroup_0, this.btnGroup_1, this.btnGroup_2);

            this._item = new BaseItem();
            this.addChild(this._item);
            this._item.pos(320, 968);
            this._item.scale(0.8, 0.8);

            this._btnClip = CommonUtil.creatEff(this.upGradeBtn, `btn_light`, 15);
            this._btnClip.pos(-7, -14);
            this._btnClip.scale(1.1, 1.05);
            this._btnClip.visible = false;

            this._nameArr = [this.attNameTxt_0, this.attNameTxt_1];
            this._liftArr = [this.proAttTxt_0, this.proAttTxt_1];
            this._upImgsArr = [this.arrImg_0, this.arrImg_1];
            this._valueArr = [this.attValue_0, this.attValue_1];

            this._btnGroupRPs = [this.dotImg_0, this.dotImg_1, this.dotImg_2];
            this._numDiff = 0;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_WIND_WATER_UPTATE, this, this.setListDatas);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_UPDATE, this, this.updateFengshuiLv);
            this.addAutoListener(this._btnGroup, Laya.Event.CHANGE, this, this.updateView);
            this.addAutoListener(this._list, Laya.Event.SELECT, this, this.updateAttView);
            this.addAutoListener(this.upGradeBtn, Laya.Event.CLICK, this, this.upGradeBtnHandler);
            this.addAutoListener(this.aboutBtn, Laya.Event.CLICK, this, this.aboutBtnHandler);
            this.addAutoListener(this.attBtn, Laya.Event.CLICK, this, this.attBtnHandler);

            this.addAutoRegisteRedPoint(this.dotImg_0, ["xianfuArticleRP_0"]);
            this.addAutoRegisteRedPoint(this.dotImg_1, ["xianfuArticleRP_1"]);
            this.addAutoRegisteRedPoint(this.dotImg_2, ["xianfuArticleRP_2"]);
        }

        public onOpened(): void {
            super.onOpened();
            // this._scheEff.play();
            this._btnClip.play();

            this.updateFengshuiLv();
            this.searchOne();
        }

        private searchOne(): void {
            for (let i: int = 0; i < this._btnGroupRPs.length; i++) {
                if (this._btnGroupRPs[i].visible) {
                    this._btnGroup.selectedIndex = i;
                    return;
                }
            }
            this._btnGroup.selectedIndex = 0;
        }

        private setListDatas(): void {
            let ids: number[] = this._ids;
            let fengshuiResList: Array<number> = XianfuModel.instance.fengshuiResList;
            let atkValue: number = 0;
            for (let i: int = 0, len: int = fengshuiResList.length; i < len; i++) {
                let id: number = fengshuiResList[i];
                atkValue += XianfuDecorateCfg.instance.getCfgById(id)[Configuration.xianfu_decorateFields.fight];
                for (let j: int = 0; j < ids.length; j++) {
                    if (ids[j] / 100 >> 0 == id / 100 >> 0) {
                        ids[j] = id;
                    }
                }
            }
            this.atkMsz.value = atkValue.toString();
            this._list.datas = ids;
            if (this._list.selectedIndex == -1) {
                this._list.selectedIndex = 0;
            }
            this._list.selectedIndex = this._list.selectedIndex;
        }

        private updateFengshuiLv(): void {
            let fengshuiValue: number = XianfuModel.instance.treasureInfos(3);
            //判断风水是哪个等级
            let fengshuiLv: number = XianfuModel.instance.fengshuiLv;
            let currCfg: xianfu_fengshui = config.XianfuFengShuiCfg.instance.getCfgById(fengshuiLv);
            // this._attAddPer = currCfg[Configuration.xianfu_fengshuiFields.attrPer];
            let flagIcon: string = currCfg[xianfu_fengshuiFields.nameRes];
            this.flagImg.skin = `assets/icon/ui/xianfu_fengshui/${flagIcon}.png`;
            let lvIcon: string = currCfg[xianfu_fengshuiFields.lvRes];
            this.lvImg.skin = `assets/icon/ui/xianfu_fengshui/${lvIcon}.png`;
            let needUpExp: number = currCfg[xianfu_fengshuiFields.exp];
            if (!needUpExp) {
                needUpExp = config.XianfuFengShuiCfg.instance.getCfgById(fengshuiLv - 1)[xianfu_fengshuiFields.exp];
               // this._scheEff.y = -20;
               this.active_bar.height=0
            } else {
                let ratio: number = fengshuiValue / needUpExp;
                this.active_bar.height=fengshuiValue / needUpExp*144
               // this._scheEff.y = 120 - 140 * ratio;
            }
            this.scheduleTxt.text = `${fengshuiValue}/${needUpExp}`;
            //区间为 -20 ~ 120 =  140
            this.updateAttView();
        }

        private updateView(): void {

            let ids: number[] = this._ids = XianfuDecorateCfg.instance.getIdsByBigType(this._btnGroup.selectedIndex);
            this.setListDatas();

            //选中红点项
            for (let i: int = 0; i < ids.length; i++) {
                let id: number = ids[i];
                let cfg: Configuration.xianfu_decorate = config.XianfuDecorateCfg.instance.getCfgById(id);
                let nextCfg: Configuration.xianfu_decorate = config.XianfuDecorateCfg.instance.getCfgById(id + 1);
                let needItemId: number = cfg[Configuration.xianfu_decorateFields.items][Configuration.ItemsFields.itemId];
                let needItemNum: number = cfg[Configuration.xianfu_decorateFields.items][Configuration.ItemsFields.count];
                let hasItemNum: number = bag.BagModel.instance.getItemCountById(needItemId);
                if (hasItemNum >= needItemNum && nextCfg) {
                    this._list.selectedIndex = i;
                    return;
                }
            }
            this._list.selectedIndex = 0;
        }

        private updateAttView(): void {

            let id: number = this._list.selectedData;
            if (id == null) return;
            let lv: number = id % 100;
            if (!lv) {
                this.upGradeBtn.label = `激活`;
            } else {
                this.upGradeBtn.label = `升级`;
            }
            let currCfg: xianfu_decorate = XianfuDecorateCfg.instance.getCfgById(id);
            let nextCfg: xianfu_decorate = XianfuDecorateCfg.instance.getCfgById(id + 1);

            this.setAttr(currCfg, nextCfg);
            this.fengshuiAddAttr(currCfg, nextCfg);
            let needItem: Configuration.Items = currCfg[Configuration.xianfu_decorateFields.items];
            if (nextCfg) {
                this.fullLevelImg.visible = false;
                this._item.visible = true;
                this.upGradeBtn.visible = true;
                let hasItemNum: int = bag.BagModel.instance.getItemCountById(needItem[0]);
                this._item.dataSource = [needItem[0], 0, 0, null];
                this._numDiff = hasItemNum - needItem[1];
                this._btnClip.visible = this._numDiff >= 0;
                this._item.setNum(`${hasItemNum}/${needItem[1]}`, this._numDiff >= 0 ? "#FDFDFF" : "#ff7462");
            } else { //没有属性
                this._item.visible = false;
                this.upGradeBtn.visible = false;
                this.fullLevelImg.visible = true;
            }
            this._item.dataSource = [needItem[Configuration.ItemsFields.itemId], needItem[Configuration.ItemsFields.count], 0, null];
            CommonUtil.chainArr([this.attNameTxt_0, this.attValue_0, this.arrImg_0, this.proAttTxt_0]);
            CommonUtil.chainArr([this.attNameTxt_1, this.attValue_1, this.arrImg_1, this.proAttTxt_1]);
            CommonUtil.chainArr([this.attNameTxt_2, this.arrImg_2, this.proAttTxt_2]);
            CommonUtil.chainArr([this.attNameTxt_3, this.arrImg_3, this.proAttTxt_3]);
        }

        private fengshuiAddAttr(cfg: xianfu_decorate, nextCfg: xianfu_decorate): void {

            //0对指定建筑产出加成 1对所有建筑制作减少消耗% 2对所有建筑制作增加成功率% 3对所有建筑增加每日制作上限 4游历消费减少% 5游历经验增加% 6游历次数增加
            //0 每秒出产收益增加X点 每秒出产收益增加X% 每秒出产有X%概率X倍暴击 
            //0 每秒产药收益增加X点	每秒产药收益增加X% 每秒产药有X%概率X倍暴击 
            //1 炼制消耗药草值减少X% 
            //1 所有炼制成功率提升X%
            //1 所有炉子炼制上限增加X次
            //所有灵兽游历花费减少X%
            //所有灵兽游历经验增加X% 
            //所有灵兽游历次数增加X次

            //参数 对于类型0要配多个参数 建筑id#加成类型#加成参数值#额外值(暴击倍数) 加成类型：1固定点 2百分点 3暴击概率
            //0药草园 1粮食园 2炼丹炉 3炼器炉 4炼魂炉

            this.arrImg_2.visible = this.arrImg_3.visible = this.proAttTxt_2.visible = this.proAttTxt_3.visible = true;
            if (!nextCfg) { //没有下一级
                this.arrImg_2.visible = this.arrImg_3.visible = this.proAttTxt_2.visible = this.proAttTxt_3.visible = false;
                nextCfg = cfg;
            }

            let fengshuiValue: number = cfg[Configuration.xianfu_decorateFields.fengshuiValue];
            this.attNameTxt_2.text = `风水值：${fengshuiValue}`;
            if (nextCfg[Configuration.xianfu_decorateFields.fengshuiValue] - fengshuiValue <= 0) {
                this.arrImg_2.visible = this.proAttTxt_2.visible = false;
            } else {
                this.proAttTxt_2.text = (nextCfg[Configuration.xianfu_decorateFields.fengshuiValue] - fengshuiValue).toString();
            }

            let type: number = nextCfg[Configuration.xianfu_decorateFields.type];
            let param: number[] = cfg[Configuration.xianfu_decorateFields.param];
            let nextParam: number[] = nextCfg[Configuration.xianfu_decorateFields.param];
            let currValue: number = param[0]; //当前值
            if (!currValue) currValue = 0;
            let upValue: number = nextParam[0] - currValue; //提升值
            if (upValue <= 0) {
                this.arrImg_3.visible = this.proAttTxt_3.visible = false;
            } else {
                this.arrImg_3.visible = this.proAttTxt_3.visible = true;
            }
            let lv: number = cfg[Configuration.xianfu_decorateFields.id] % 100;
            if (!lv) {  //等级是0
                this.attNameTxt_3.text = `无加成`;
                if (type == 0) {  //对指定建筑产出加成
                    let buildId: number = nextParam[0];  //建筑id
                    let addType: number = nextParam[1];  //加成类型
                    upValue = nextParam[2]; //提升值
                    this.arrImg_3.visible = this.proAttTxt_3.visible = true;
                    this.proAttTxt_3.text = XianfuModel.instance.getType0AttAddStr(addType, buildId, upValue, nextParam);
                } else {
                    this.proAttTxt_3.text = XianfuModel.instance.getAttAddStr(type, upValue);
                }
            } else {
                if (type == 0) {  //对指定建筑产出加成
                    let buildId: number = nextParam[0];  //建筑id
                    let addType: number = nextParam[1];  //加成类型
                    currValue = param[2]; //当前值
                    if (!currValue) currValue = 0;
                    upValue = nextParam[2] - currValue; //提升值
                    if (upValue <= 0) {
                        this.arrImg_3.visible = this.proAttTxt_3.visible = false;
                    } else {
                        this.arrImg_3.visible = this.proAttTxt_3.visible = true;
                    }
                    this.attNameTxt_3.text = XianfuModel.instance.getType0AttAddStr(addType, buildId, currValue, param);
                    if (addType == 1) {//固定点
                        this.proAttTxt_3.text = upValue.toString();
                    } else if (addType == 2) {//百分点
                        this.proAttTxt_3.text = upValue + `%`
                    } else if (addType == 3) {//暴击概率
                        this.proAttTxt_3.text = upValue + `%`
                    }
                } else {
                    this.attNameTxt_3.text = XianfuModel.instance.getAttAddStr(type, currValue);
                    if (type == 1) { //对所有建筑制作减少消耗%
                        this.proAttTxt_3.text = upValue + `%`;
                    } else if (type == 2) {  //所有炼制成功率提升X%
                        this.proAttTxt_3.text = upValue + `%`;
                    } else if (type == 3) {  //所有炉子炼制上限增加X次%
                        this.proAttTxt_3.text = upValue.toString();
                    } else if (type == 4) { //所有灵兽游历花费减少X%
                        this.proAttTxt_3.text = upValue + `%`;
                    } else if (type == 5) { //所有灵兽游历经验增加X%
                        this.proAttTxt_3.text = upValue + `%`;
                    } else if (type == 6) { //所有灵兽游历次数增加X次%
                        this.proAttTxt_3.text = upValue.toString();
                    }
                }
            }
        }

        private setAttr(cfg: xianfu_decorate, nextCfg: xianfu_decorate, addPer: number = 1): void {
            for (var index = 0; index < this._nameArr.length; index++) {
                this._nameArr[index].visible = false;
                this._upImgsArr[index].visible = false;
                this._liftArr[index].visible = false;
                this._valueArr[index].visible = false;
            }

            let attrs: Array<attr> = nextCfg ? nextCfg[xianfu_decorateFields.attrs] : cfg[xianfu_decorateFields.attrs];
            let curAttrs: Array<attr> = cfg[xianfu_decorateFields.attrs];
            let nextAttrs: Array<attr> = nextCfg ? nextCfg[xianfu_decorateFields.attrs] : null;
            for (let i: int = 0, len: int = attrs.length; i < len; i++) {
                let attrCfg: attr_item = AttrItemCfg.instance.getCfgById(attrs[i][attrFields.type]);
                this._nameArr[i].visible = this._valueArr[i].visible = this._liftArr[i].visible = true;
                this._nameArr[i].text = attrCfg[attr_itemFields.name] + "：";
                let curValue: number = curAttrs[i] ? curAttrs[i][attrFields.value] : 0;
                let offset: number = nextAttrs ? nextAttrs[i][attrFields.value] - curValue : 0;
                if (nextCfg) {
                    this._upImgsArr[i].visible = this._liftArr[i].visible = true;
                    this._liftArr[i].text = attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(offset) + "%" : Math.round(offset) + "";
                } else {
                    this._upImgsArr[i].visible = this._liftArr[i].visible = false;
                }
                this._valueArr[i].text = attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(curValue) + "%" : Math.round(curValue) + "";;
            }
        }

        private attBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.XIANFU_FENGSHUI_ATT_ALERT);
        }

        private upGradeBtnHandler(): void {

            let id: number = this._item.itemData[Protocols.ItemFields.ItemId];
            if (this._numDiff >= 0) {
                XianfuCtrl.instance.upgradeFengShuiDecorate([this._list.selectedData]);
            } else {
                bag.BagUtil.openLackPropAlert(id, -this._numDiff);
            }
        }

        private aboutBtnHandler(): void {
            CommonUtil.alertHelp(20044);
        }
    }
}