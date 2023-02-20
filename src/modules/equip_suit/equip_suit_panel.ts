///<reference path="../config/equip_suit_cfg.ts"/>
///<reference path="../config/attr_skill_cfg.ts"/>
/** 套装面板 */
namespace modules.equipSuit {
    import EquipSuitModel = modules.equipSuit.EquipSuitModel;
    import CommonEventType = modules.common.CommonEventType;
    import GlobalData = modules.common.GlobalData;
    import PlayerModel = modules.player.PlayerModel;
    import CommonUtil = modules.common.CommonUtil;
    import CustomList = modules.common.CustomList;
    import EquipSuitCfg = modules.config.EquipSuitCfg;
    import EquipSuitViewUI = ui.EquipSuitViewUI;
    import equip_suit = Configuration.equip_suit;
    import equip_suitFields = Configuration.equip_suitFields;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import skill = Configuration.skill;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import AttrUtil = modules.common.AttrUtil;
    import attr_item = Configuration.attr_item;
    import attr_itemFields = Configuration.attr_itemFields;
    import AttrItemCfg = modules.config.AttrItemCfg;

    export class EquipSuitPanel extends EquipSuitViewUI {

        private _items: EquipLightItem[];
        private _itmePoss: Point[];
        private _bClass: number;
        private _list: CustomList;
        private _flagImgs: Image[];
        private _attrNames: Text[];
        private _attValues: Text[];
        private _arrImgs: Image[];
        private _attProValues: Text[];
        private _sIndex: number;
        private _parts: EquipCategory[]; //装备部位  从左到右

        protected initialize(): void {
            super.initialize();

            this.centerY = this.centerX = 0;

            this._itmePoss = [];
            for (let i: int = 0; i < 8; i++) {
                let point: Point = {
                    x: 55 + Math.floor(i / 4) * 510,
                    y: 165 + (i % 4) * 115,
                };
                this._itmePoss.push(point);
            }

            this._items = [];
            this._parts = EquipSuitModel.instance.parts;

            this._list = new CustomList();
            this._list.scrollDir = 2;
            this._list.x = 60;
            this._list.y = 1000;
            this._list.height = 140;
            this._list.vCount = 1;
            this._list.itemRender = EquipSuitTclassItem;
            this._list.spaceX = 20;
            this.addChild(this._list);

            this._flagImgs = [this.flagImg_0, this.flagImg_1, this.flagImg_2, this.flagImg_3,
            this.flagImg_4, this.flagImg_5, this.flagImg_6, this.flagImg_7];

            this.requestTxt.color = "white";
            this.requestTxt.style.fontFamily = "SimHei";
            this.requestTxt.style.fontSize = 24;
            this.requestTxt.style.wordWrap = false;

            this._attrNames = [this.attNameTxt_0, this.attNameTxt_1,];
            this._attValues = [this.attValueTxt_0, this.attValueTxt_1,];
            this._arrImgs = [this.arrImg_0, this.arrImg_1];
            this._attProValues = [this.attProValueTxt_0, this.attProValueTxt_1];
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._list, common.LayaEvent.SELECT, this, this.selectView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.EQUIP_SUIT_UPDATE, this, this.updateView);
            this.addAutoListener(this.getBtn, common.LayaEvent.CLICK, this, this.getBtnHandler);
            this.addAutoListener(this.aboutBtn, common.LayaEvent.CLICK, this, this.aboutBtnHandler);
        }

        public setOpenParam(index: number) {
            super.setOpenParam(index);
            if (index == null) {
                this._sIndex = 0;
            } else {
                this._sIndex = index;
            }
        }

        public onOpened(): void {
            super.onOpened();
            this.checkType();
        }

        private selectView(): void {
            let id: number = this._list.selectedData;
            EquipSuitModel.instance.selectId = id;
            this.updateView();
        }

        private updateView(): void {
            //当该部位未点亮时 显示穿戴的装备 并根据该装备来判断状态
            this.setAttr();
            this.judgeItemState();
            this.calcFight();
            let id: number = this._list.selectedData;
            let cfg: equip_suit = EquipSuitCfg.instance.getCfgById(id);
            let condition: number[] = cfg[equip_suitFields.light];
            /*点亮条件 阶数#品质#星级*/
            let stage: number = condition[0];
            let quality: number = condition[1];
            let star: number = condition[2] - 1;
            let color: string = CommonUtil.getColorByQuality(quality);
            let str: string = `点亮条件:穿戴装备阶数≥${CommonUtil.formatHtmlStrByColor(color, `${stage}阶`)},品质≥${CommonUtil.formatHtmlStrByColor(color, `${CommonUtil.getColorNameByQuality(quality)}品`)},星数≥${CommonUtil.formatHtmlStrByColor(color, `${star}星`)}`;
            this.requestTxt.innerHTML = str;
            CommonUtil.centerChainArr(this.width, [this.requestTxt]);
        }

        private setAttr(): void {

            let id: number = this._list.selectedData;
            let cfg: equip_suit = EquipSuitCfg.instance.getCfgById(id);

            let currLightNum: number = EquipSuitModel.instance.getLightCountById(id);
            let params: number[][] = cfg[equip_suitFields.attr];
            let index: number;
            for (let i: int = 0, len: int = params.length; i < len; i++) {
                let num: number = params[i][0];
                if (currLightNum === num) {
                    index = i;
                }
            }

            let name: string;
            let value: string;
            let proValue: string;
            let count: number = 0;

            if (index == null) {  //一件都未激活  取下一等
                this.currNumTxt.text = `0`;
                this.lightNumTxt.text = `1`;
                this.nextLightBox.visible = true;
                let nextParam: number[] = params[0]; //第一等
                for (let i: int = 1, len: int = nextParam.length; i < len; i += 2) {
                    let attrId: number = nextParam[i];
                    name = this.getAttrById(attrId)[0];
                    let isPer: boolean = this.getAttrById(attrId)[1];
                    value = `0`;
                    proValue = isPer ? `${AttrUtil.formatFloatNum(nextParam[i + 1])}%` : `${nextParam[i + 1]}`;
                    this.setAttrElement(count, name, value, proValue);
                    count++;
                }
            } else {
                this.currNumTxt.text = `${params[index][0]}`;
                if (index >= params.length - 1) {
                    this.nextLightBox.visible = false;
                } else {
                    this.nextLightBox.visible = true;
                    this.lightNumTxt.text = `${params[index][0] + 1}`
                }
                this.lightNumTxt.text = `${params[index][0] + 1}`;
                let param: number[] = params[index];  //当前参数
                for (let i: int = 1, len: int = param.length; i < len; i += 2) {
                    let attrId: number = param[i];
                    name = this.getAttrById(attrId)[0];
                    let isPer: boolean = this.getAttrById(attrId)[1];
                    value = isPer ? `${AttrUtil.formatFloatNum(param[i + 1])}%` : `${param[i + 1]}`;
                    if (index < params.length - 1) {//八件没满
                        let nextParam: number[] = params[index + 1];
                        let nextValue: number = nextParam[i + 1];
                        proValue = isPer ? `${AttrUtil.formatFloatNum(nextValue - param[i + 1])}%` : `${nextValue - param[i + 1]}`;
                    }
                    this.setAttrElement(count, name, value, proValue);
                    count++;
                }
            }
            for (let i: int = count; i < this._attrNames.length; i++) {
                this._attrNames[count].visible = this._attValues[count].visible =
                    this._arrImgs[count].visible = this._attProValues[count].visible = false;
            }
        }

        private setAttrElement(index: number, name: string, value: string, proValue: string): void {
            this._attrNames[index].text = name;
            this._attValues[index].text = value;
            this._attrNames[index].visible = this._attValues[index].visible = true;
            if (proValue) {
                this._arrImgs[index].visible = this._attProValues[index].visible = true;
                this._attProValues[index].text = proValue;
            }
        }

        //名字 是否百分比
        private getAttrById(attrId: number): [string, boolean] {
            let attrCfg: attr_item = AttrItemCfg.instance.getCfgById(attrId);
            let name: string = attrCfg[attr_itemFields.name];
            let isPer: number = attrCfg[attr_itemFields.isPercent];
            return [name, isPer == 1];
        }

        private calcFight(): void {
            let id: number = this._list.selectedData;
            let index: number = EquipSuitModel.instance.ids.indexOf(id);
            let fight: number = 0;
            if (index == -1) {  //未点亮
                let parts: number[] = EquipSuitModel.instance.lightPartsById(id);
                if (parts) {
                    let cfg: equip_suit = EquipSuitCfg.instance.getCfgById(id);
                    let fights: Array<[number, number]> = cfg[equip_suitFields.fight];
                    for (let e of parts) {
                        for (let i: int = 0, len: int = fights.length; i < len; i++) {
                            if (e == fights[i][Configuration.PairFields.first]) {
                                fight += fights[i][Configuration.PairFields.second];
                                break;
                            }
                        }
                    }
                }
            } else {
                let cfg: equip_suit = EquipSuitCfg.instance.getCfgById(id);
                let fights: Array<[number, number]> = cfg[equip_suitFields.fight];
                for (let e of fights) {
                    fight += e[Configuration.PairFields.second];
                }
            }
            this.fightMsz.value = fight.toString();
        }

        private judgeItemState(): void {
            let id: number = this._list.selectedData;
            console.log("当前显示", id)
            let cfg: equip_suit = EquipSuitCfg.instance.getCfgById(id);
            let skillId: number = cfg[equip_suitFields.skillId];
            let skillCfg: skill = SkillCfg.instance.getCfgById(skillId);
            let skillName: string = skillCfg[skillFields.name];
            let des: string = skillCfg[skillFields.des];
            //判断套装激活没 没激活点亮没
            let index: number = EquipSuitModel.instance.ids.indexOf(id);
            if (index == -1) { //未激活
                //判断装备  判断是否点亮
                for (let i: int = 0, len: int = this._parts.length; i < len; i++) {
                    let part: EquipCategory = this._parts[i];
                    let myEquip: Item = PlayerModel.instance.getEquipByPart(part);
                    let item: EquipLightItem = this._items[i];
                    // console.log("套装有装备",myEquip)
                    if (myEquip) {  //有装备
                        if (!item) {
                            item = this.creatBaseItem(i);
                        }
                        let itemData: Item = this.showConditionEquip(part);
                        item.dataSource = itemData;
                        item.grayFilter = false;
                        let parts: number[] = EquipSuitModel.instance.lightPartsById(id);
                        if (parts) {    // 装备是点亮需要的
                            let resule: boolean = parts.indexOf(part) !== -1;
                            if (resule) {
                                // let itemData: Item = this.showConditionEquip(part);
                                // item.dataSource = itemData;
                                item.state = LightState.yet;
                                this._flagImgs[i].skin = `equip_suit/txt_zbtz_ydl.png`;
                                continue;
                            }
                        }
                        let isMeetLight: boolean = EquipSuitModel.instance.compareResult(myEquip[ItemFields.ItemId], id);
                        item.grayFilter = true;
                        if (isMeetLight) {  //可以点亮
                            item.state = LightState.can;
                            this._flagImgs[i].skin = `equip_suit/txt_zbtz_kdl.png`;
                        } else {
                            item.state = LightState.cant;
                            this._flagImgs[i].skin = `equip_suit/txt_zbtz_wdc.png`;
                        }
                    }
                }
                this.lightImg.visible = false;
                this.desTxt.visible = this.getBtn.visible = true;
                this.lightBox.x = 190;
                this.attrBox.x = 152;
                this.tipTxt.y = 914;
            } else {
                //已经激活了 所有的都是点亮了的装备
                for (let i: int = 0, len: int = this._parts.length; i < len; i++) {
                    let part: EquipCategory = this._parts[i];
                    let item: EquipLightItem = this._items[i];
                    if (!item) {
                        item = this.creatBaseItem(i);
                    }
                    let itemData: Item = this.showConditionEquip(part);
                    item.dataSource = itemData;
                    item.state = LightState.yet;
                    item.grayFilter = false;
                    this._flagImgs[i].skin = `equip_suit/txt_zbtz_ydl.png`;
                }
                this.tipTxt.y = 930;
                this.lightImg.visible = true;
                this.desTxt.visible = this.getBtn.visible = false;
                CommonUtil.centerChainArr(this.width, [this.lightBox]);
                CommonUtil.centerChainArr(this.width, [this.attrBox]);
            }
            this.tipTxt.text = `${skillName}: ${des}`;
        }

        private creatBaseItem(index: number): EquipLightItem {
            let item: EquipLightItem = new EquipLightItem();
            this.addChild(item);
            this._items[index] = item;
            let point: Point = this._itmePoss[index];
            item.pos(point.x, point.y);
            return item;
        }

        //点亮了 显示条件装备
        private showConditionEquip(part: EquipCategory): Item {
            let id: number = this._list.selectedData;
            let cfg: equip_suit = EquipSuitCfg.instance.getCfgById(id);
            let condition: number[] = cfg[equip_suitFields.light];
            /*点亮条件 阶数#品质#星级*/
            let stage: number = condition[0];
            let quality: number = condition[1];
            let star: number = condition[2];
            let needId: number = CommonUtil.getEquipIdByCondition(stage, quality, star, part);
            return [needId, 1, 0, null];
        }

        private checkType(): void {
            let index: number = EquipSuitUtil.panels.indexOf(this.panelId);
            if (index == -1) {
                throw new Error(`装备套装大类数量配置错误---`);
            }
            this._bClass = EquipSuitCfg.instance.bClassIds[index];

            let sIds: number[] = EquipSuitCfg.instance.getIdsBybClass(this._bClass);
            this.setListWidth(sIds.length);
            this._list.datas = sIds;
            this._list.selectedIndex = this._sIndex;
        }

        private setListWidth(len: number): void {
            let sumWidth: number = 114 * len + (len - 1) * this._list.spaceX;
            this._list.width = sumWidth > 600 ? 600 : sumWidth;
            CommonUtil.centerChainArr(this.width, [this._list]);
        }

        private getBtnHandler(): void {
            let id: number = this._list.selectedData;
            let cfg: equip_suit = EquipSuitCfg.instance.getCfgById(id);
            WindowManager.instance.open(WindowEnum.EQUIP_SUIT_GET_ALERT, cfg);
        }

        private aboutBtnHandler(): void {
            CommonUtil.alertHelp(20056);
        }

        public destroy(): void {
            this._items = this.destroyElement(this._items);
            this._itmePoss = null;
            this._parts = null;
            this._list = this.destroyElement(this._list);
            this._flagImgs = this.destroyElement(this._flagImgs);
            this._attrNames = this.destroyElement(this._attrNames);
            this._attProValues = this.destroyElement(this._attProValues);
            this._arrImgs = this.destroyElement(this._arrImgs);
            this._attProValues = this.destroyElement(this._attProValues);
            super.destroy();
        }
    }
}