/** 金身面板*/
///<reference path="../config/equip_suit_cfg.ts"/>
///<reference path="../equip_suit/equip_light_item.ts"/>
///<reference path="../equip_suit/equip_suit_model.ts"/>
///<reference path="../config/treasure_cfg.ts"/>

namespace modules.goldBody {
    import Event = Laya.Event;
    import Text = Laya.Text;
    import Image = Laya.Image;
    import GoldBodyViewUI = ui.GoldBodyViewUI;
    import CommonUtil = modules.common.CommonUtil;
    import CustomList = modules.common.CustomList;
    import soulRefine = Configuration.soulRefine;
    import soulRefineFields = Configuration.soulRefineFields;
    import SoulRefineInfo = Protocols.SoulRefineInfo;
    import SoulRefineInfoFields = Protocols.SoulRefineInfoFields;
    import SoulRefineFields = Protocols.SoulRefineFields;
    import CustomClip = modules.common.CustomClip;
    import BagUtil = modules.bag.BagUtil;
    import PlayerModel = modules.player.PlayerModel;
    import attr = Configuration.attr;
    import attrFields = Configuration.attrFields;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attr_itemFields = Configuration.attr_itemFields;
    import AttrUtil = modules.common.AttrUtil;
    import ActorBaseAttr = Protocols.ActorBaseAttr;
    import ActorBaseAttrFields = Protocols.ActorBaseAttrFields;

    import Dictionary = Laya.Dictionary;
    import BaseItem = modules.bag.BaseItem;
    import equip_suit = Configuration.equip_suit;
    import equip_suitFields = Configuration.equip_suitFields;
    import skill = Configuration.skill;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;
    import EquipSuitCfg = modules.config.EquipSuitCfg;
    import EquipSuitModel = modules.equipSuit.EquipSuitModel;
    import Item = Protocols.Item;
    import EquipLightItem = modules.equipSuit.EquipLightItem
    import LightState = modules.equipSuit.LightState
    import ItemFields = Protocols.ItemFields;
    import TreasureCfg = modules.config.TreasureCfg;
    import xunbao_weightFields = Configuration.xunbao_weightFields
    import ColorFilter = Laya.ColorFilter;



    export class GoldBodyPanel extends GoldBodyViewUI {
        constructor() {
            super();
        }
        private _list: CustomList;

        private _selectedId: int;
        private _nameTxts: Array<Text>;
        private _valueTxts: Array<Text>;
        private _upImgs: Array<Image>;
        private _upTxts: Array<Text>;
        private _showGoldBodys: Array<int>;
        private _btnClip: CustomClip;
        private _first: number;
        private _second: number;
        private _isLevelUp: boolean;
        private _curSoulLevel: number;
        private _tween: TweenJS;
        private _tweens: TweenJS[];

        private _partDic: Dictionary;
        private _parts: EquipCategory[]; //装备部位  从左到右
        private _items: EquipLightItem[];
        /**
         * 装备位置
         */
        private _equipsPos: Point[];
        private static _trainSuccessClipPool: CustomClip[];
        private _equipEffects: CustomClip[];

        private clearRes() {
            if (this._tweens) {
                this._tweens.forEach(element => {
                    element.stop();
                });
            }
            if (this._equipEffects) {
                this._equipEffects.forEach(element => {
                    element.destroy();
                });
            }
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
            this.clearRes();
            this._list = this.destroyElement(this._list);
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this.bottom = 0;
            this._curSoulLevel = 0;
            this._nameTxts = [this.attrName0, this.attrName1, this.attrName2, this.attrName3, this.attrName4, this.attrName5];
            this._valueTxts = [this.attrValue0, this.attrValue1, this.attrValue2, this.attrValue3, this.attrValue4, this.attrValue5];
            this._upImgs = [this.attrUpImg0, this.attrUpImg1, this.attrUpImg2, this.attrUpImg3, this.attrUpImg4, this.attrUpImg5];
            this._upTxts = [this.attrUpTxt0, this.attrUpTxt1, this.attrUpTxt2, this.attrUpTxt3, this.attrUpTxt4, this.attrUpTxt5];

            this._partDic = new Dictionary();
            this._equipsPos = []
            let temp = this.equipParent._childs as Image[]
            temp.forEach(element => {
                let temp: Point = { x: element.x - 20, y: element.y + 80 }
                this._equipsPos.push(temp)
            });
            this.createAllEquips()
            this._list = new CustomList();
            this._list.scrollDir = 2;
            this._list.width = 650;
            this._list.height = 178;
            this._list.vCount = 1;
            this._list.hCount = 4;
            this._list.spaceY = 3;
            this._list.itemRender = GoldBodyItem;
            this._list.x = 32;
            this._list.y = 660;
            this._isLevelUp = false;
            this._showGoldBodys = [0, 1, 2, 3, 4, 5, 6, 7];
            this._list.datas = this._showGoldBodys;
            this._list.selectedIndex = 0;
            this._selectedId = 0;
            this._btnClip = new CustomClip();
            this.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png",
                "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.scaleY = 1.3;
            this._btnClip.scaleX = 1.2;
            this._btnClip.pos(250 - 8, 1071 - 22, true);
            this._first = -1;
            this._second = -1;
            GoldBodyPanel._trainSuccessClipPool = [];
            // this.initTrainEffect();

            this.updateGoldBodyInfo();
            this.addChildAt(this._list, 5);
            this._tween = TweenJS.create(this.bodyText).yoyo(true);
            this.regGuideSpr(GuideSpriteId.GOLD_BODY_TRAINING_BTN, this.trainingBtn);
            this._parts = EquipSuitModel.instance.parts;

            for (let i = 8; i < 9; i++) {
                let urlArr = new Array<string>();
                let clip = new CustomClip();
                console.log()
                this.equipParent._childs[i].addChild(clip);
                clip.pos(-14, -22, true);
                clip.skin = "assets/effect/item_effect2.atlas";
                for (let i = 0; i < 8; i++) {
                    let str = `item_effect2/${i}.png`;
                    urlArr.push(str);
                }
                clip.frameUrls = urlArr;
                clip.durationFrame = 6;
                clip.visible = false;
                clip.name = "clip";
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.unbeatenBtn.on(Event.CLICK, this, this.unbeatenHandler);
            this.tipsBtn.on(Event.CLICK, this, this.tipsHandler);
            this.trainingBtn.on(Event.CLICK, this, this.trainingHandler);
            this._list.on(Event.SELECT, this, this.selectHandler);
            this.pageupBtn.on(Event.CLICK, this, this.pageUpHandler);
            this.pagedownBtn.on(Event.CLICK, this, this.pageDownHandler);
            GlobalData.dispatcher.on(CommonEventType.GOLD_BODY_UPDATE, this, this.updateSoulInfo)
                .on(CommonEventType.PLAYER_UPDATE_MONEY, this, this.trainingRedPoint)//红点控制
                .on(CommonEventType.PLAYER_BASE_ATTR_UPDATE, this, this.trainingRedPoint);

        }

        protected removeListeners(): void {
            super.removeListeners();
            this.unbeatenBtn.off(Event.CLICK, this, this.unbeatenHandler);
            this.tipsBtn.off(Event.CLICK, this, this.tipsHandler);
            this.trainingBtn.off(Event.CLICK, this, this.trainingHandler);
            this._list.off(Event.SELECT, this, this.selectHandler);
            this.pageupBtn.off(Event.CLICK, this, this.pageUpHandler);
            this.pagedownBtn.off(Event.CLICK, this, this.pageDownHandler);
            GlobalData.dispatcher.off(CommonEventType.GOLD_BODY_UPDATE, this, this.updateSoulInfo)
                .off(CommonEventType.PLAYER_UPDATE_MONEY, this, this.trainingRedPoint)
                .off(CommonEventType.PLAYER_BASE_ATTR_UPDATE, this, this.trainingRedPoint);
        }

        // 初始化金身面板
        /*private initPanel(): void {
            this.updateOneSoulInfo();
            this.updateGoldBodyInfo();
        }*/

        // 相应向上翻页按钮
        private pageUpHandler(): void {
            this._list.scroll(-720);
        }

        // 相应向下翻页按钮
        private pageDownHandler(): void {
            this._list.scroll(720);
        }

        // 更新金身信息
        private updateSoulInfo(): void {
            let second = this.updateOneSoulInfo(false);
            this.updateGoldBodyInfo();
            this.playEffects(second)
        }
        /**
         * 播放特效
         */
        private playEffects(second: number) {
            let delayTime: number = 0;
            this._tweens = [];
            for (let i = 0; i < second; i++) {
                this._equipEffects[i].on(Event.COMPLETE, this, () => {
                    this._equipEffects[i].visible = false;
                });
                let temp = TweenJS.create(this._equipEffects[i]).delay(delayTime).onComplete(() => {
                    this._equipEffects[i].visible = true
                    this._equipEffects[i].play()
                }).start()
                delayTime += 100;
                this._tweens.push(temp)
            }
        }

        //设置面板打开信息
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            GoldBodyModel.instance.checkRefineCanTraining();
            this._list.datas = this._showGoldBodys;
            if (GoldBodyModel.instance.selectIndex) {
                this._list.selectedIndex = GoldBodyModel.instance.selectIndex;
                this._list.scrollToIndex(this._list.selectedIndex);
                this._selectedId = GoldBodyModel.instance.selectIndex;
            } else {
                this._list.selectedIndex = 0;
                this._selectedId = 0;
            }
            this.updateOneSoulInfo(true);
            this.loadEff()
        }

        // 单个金身信息更新----------------------------设置底图/类型图-----------------
        private updateOneSoulInfo(tab: boolean): number {
            // 修炼列表
            let infos: Array<SoulRefineInfo> = GoldBodyModel.instance._refine[SoulRefineFields.list];
            let soulLevel: number = 0;
            let first: number = 1;
            let second: number = 0;
            if (infos.length > 0) {
                for (let i = 0; i < infos.length; i++) {
                    if (this._selectedId == infos[i][SoulRefineInfoFields.type]) {
                        soulLevel = infos[i][SoulRefineInfoFields.level];
                        break;
                    }
                }
            }
            if (soulLevel <= 10) {
                second = soulLevel;
            } else {
                second = soulLevel % 10;
                if (second == 0) {
                    first = Math.floor(soulLevel / 10);
                    second = 10;
                } else {
                    first = Math.floor(soulLevel / 10) + 1;
                }
            }
            this.showEquip(this._list.selectedIndex, second)
            this.bodyText.text = first + '阶' + second + '重';
            if (this._first < 0 || tab) {
                this._first = first;
                this._second = second;
            } else if (this._first != first || this._second != second) {
                this._first = first;
                this._second = second;
                this._isLevelUp = true;
            }
            if (tab) {
                this._curSoulLevel = soulLevel;
            }
            // 属性加成
            let cfg: soulRefine = GoldBodyModel.instance.getAttrByIdAndLevel(this._selectedId, soulLevel);
            let nextCfg: soulRefine = GoldBodyModel.instance.getAttrByIdAndLevel(this._selectedId, soulLevel + 1);
            this.setAttrs(cfg, nextCfg);
            this.powerNum.value = cfg[soulRefineFields.fighting].toString();

            //设置消耗金币数量
            if (nextCfg) {
                this.costNum.visible = true;
                this.costItem.visible = true;
                this.costNum.text = cfg[soulRefineFields.copper].toString();
                if (GoldBodyModel.instance.checkCanTrainingById(this._selectedId)) {
                    this.costNum.color = '#905a20';
                } else {
                    this.costNum.color = '#e5070b';
                }
                this.maxShow.visible = false;
                //加入等级限制
                if (GoldBodyModel.instance.checkIsFitCondition(this._selectedId)) {
                    this.conditionShow.visible = false;
                    this.trainingBtn.visible = true;
                    if (GoldBodyModel.instance.checkCanTrainingById(this._selectedId)) {
                        this._btnClip.play();
                        this._btnClip.visible = true;
                    } else {
                        this._btnClip.stop();
                        this._btnClip.visible = false;
                    }
                } else {
                    let level = GoldBodyModel.instance.getNowLvById(this._selectedId);
                    let minTransformLv = GoldBodyModel.instance.getAttrByIdAndLevel(this._selectedId, level)[soulRefineFields.promoteLevel];
                    if (minTransformLv != 0) {
                        let fir: int = Math.floor(minTransformLv / 100);
                        let sec: int = minTransformLv % 100;
                        this.conditionShow.text = fir + "转" + sec + "重开启";
                        this.conditionShow.visible = true;
                    } else {
                        this.conditionShow.visible = false;
                    }
                    this.trainingBtn.visible = false;
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                }
            } else {//没有next数据即达到最大等级
                this.trainingBtn.visible = false;
                this._btnClip.stop();
                this._btnClip.visible = false;
                this.costItem.visible = false;
                this.costNum.visible = false;
                this.maxShow.visible = true;
                this.conditionShow.visible = false;
            }
            return second
        }


        //全部金身更新，不败金身红点显示
        private updateGoldBodyInfo() {
            let scroll = this._list.scrollPos;
            this._list.datas = this._showGoldBodys;
            this._list.scroll(scroll);
            if (GoldBodyModel.instance.checkRiseCanTraining())
                this.riseRedImg.visible = true;
            else {
                this.riseRedImg.visible = false;
            }

        }

        // 设置属性加成列表
        private setAttrs(cfg: soulRefine, nextCfg: soulRefine) {
            let t: int = 0;
            let attrs: Array<attr> = nextCfg ? nextCfg[soulRefineFields.attrs] : cfg[soulRefineFields.attrs];
            let curAttrs: Array<attr> = cfg[soulRefineFields.attrs];
            let nextAttrs: Array<attr> = nextCfg ? nextCfg[soulRefineFields.attrs] : null;
            for (let i: int = 0, len = attrs.length; i < len; i++) {
                let attrCfg: attr_item = AttrItemCfg.instance.getCfgById(attrs[i][attrFields.type]);
                this._nameTxts[t].visible = this._valueTxts[t].visible = this._upImgs[t].visible = this._upTxts[t].visible = true;
                this._nameTxts[t].text = attrCfg[attr_itemFields.name];
                let attrValue: number = curAttrs[i] ? curAttrs[i][attrFields.value] : 0;
                this._valueTxts[t].text = attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(attrValue) + "%" : Math.round(attrValue) + "";
                if (nextAttrs) {
                    this._upImgs[t].visible = this._upTxts[t].visible = true;
                    let offset: number = nextAttrs[i][attrFields.value] - attrValue;
                    this._upTxts[t].text = attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(offset) + "%" : Math.round(offset) + "";
                } else {
                    this._upImgs[t].visible = this._upTxts[t].visible = false;
                }
                t++;
            }
            for (let i: int = t, len: int = this._nameTxts.length; i < len; i++) {
                this._nameTxts[i].visible = this._valueTxts[i].visible = this._upImgs[i].visible = this._upTxts[i].visible = false;
            }
        }

        // 关闭
        private closeHandler(): void {
            this.close();
        }

        public close(): void {
            super.close();
            this.clearRes();
        }


        // 金身修炼按钮上红点控制，同时控制金钱的颜色
        private trainingRedPoint(): void {
            let enoughCopper: boolean = GoldBodyModel.instance.checkCanTrainingById(this._selectedId);
            if (GoldBodyModel.instance.checkIsFitCondition(this._selectedId)) {
                this.conditionShow.visible = false;
                if (enoughCopper) {
                    this._btnClip.play();
                } else {
                    this._btnClip.stop();
                }
            } else {
                let attr: ActorBaseAttr = PlayerModel.instance.playerBaseAttr;
                let transformFir: number = attr[ActorBaseAttrFields.eraLvl];
                let transformSec: number = attr[ActorBaseAttrFields.eraNum];
                let level = GoldBodyModel.instance.getNowLvById(this._selectedId);
                let minTransformLv = GoldBodyModel.instance.getAttrByIdAndLevel(this._selectedId, level)[soulRefineFields.promoteLevel];
                let fir: int = Math.floor(minTransformLv / 100);
                let sec: int = minTransformLv % 100;
                if (transformFir > fir) {  //觉醒等级大于限制等级;
                    this.conditionShow.visible = false;
                } else if (transformFir == fir && transformSec >= sec) {
                    this.conditionShow.visible = false;
                } else {
                    this.conditionShow.visible = true;
                    this.conditionShow.text = fir + "转" + sec + "重开启";
                }
                this._btnClip.stop();
            }
            if (enoughCopper)
                this.costNum.color = '#905a20';
            else {
                this.costNum.color = '#e5070b';
            }
        }

        //不败金身按钮
        private unbeatenHandler(): void {
            WindowManager.instance.openDialog(WindowEnum.GOLD_BODY_UNDEATEN_ALERT);
        }

        //金身提示
        private tipsHandler(): void {
            CommonUtil.alertHelp(20037);
        }

        //修炼按钮点击事件
        private trainingHandler(): void {
            let enoughCopper: boolean = GoldBodyModel.instance.checkCanTrainingById(this._selectedId);
            if (enoughCopper) {
                GoldBodyCtrl.instance.refineSoul(this._selectedId);
            } else {
                BagUtil.openLackPropAlert(MoneyItemId.copper, 1);
            }

        }

        //选择某个页签,开放则刷新显示页面
        private selectHandler(): void {
            if (GoldBodyModel.instance.checkOpenById(this._list.selectedIndex, true)) {
                this._selectedId = this._list.selectedIndex;
                this.updateOneSoulInfo(true);
            } else {
                this._list.selectedIndex = this._selectedId;
            }

        }

        //从帧动画对象池获得对象
        private getTrainSuccessClipPool(): CustomClip {
            if (GoldBodyPanel._trainSuccessClipPool.length == 0) {
                return new CustomClip();
            } else {
                return GoldBodyPanel._trainSuccessClipPool.shift();
            }
        }
        //加入对象池
        private pushTrainSuccessClipPool(clip: CustomClip): void {
            clip.removeSelf();
            GoldBodyPanel._trainSuccessClipPool.push(clip);
        }


        /**
         * 加载铸魂特效
         */
        private loadEff() {
            this._equipEffects = []
            for (let index = 0; index < this.equipParent._childs.length; index++) {
                let _eff = new CustomClip();
                _eff.skin = "assets/effect/activate.atlas";
                _eff.frameUrls = ["activate/0.png", "activate/1.png", "activate/2.png", "activate/3.png"];
                _eff.durationFrame = 5;
                _eff.loop = false;
                _eff.pos(this.equipParent._childs[index].x - 100, this.equipParent._childs[index].y)
                this.addChild(_eff)
                _eff.zOrder = 1
                _eff.visible = false;
                this._equipEffects.push(_eff)
            }

        }
        private createAllEquips() {
            this._items = []
            for (let i = 0; i < 10; i++) {
                let item: EquipLightItem = new EquipLightItem();
                this.addChild(item);
                item.pos(this._equipsPos[i].x, this._equipsPos[i].y);
                this._items.push(item)
            }
        }
        /**
         * 展示套装
         * @param index 
         * @param level 
         */
        private showEquip(index: number, level: number) {
            level--
            for (let i = 0; i < 10; i++) {
                this._items[i].dataSource = [GoldBodyModel.instance._equipIds[index][i], 1, 0, null]
                this._items[i].state = LightState.yet;
                if (i <= level) {
                    this._items[i].setXingLevel(1, true)
                } else {
                    this._items[i].setXingLevel(1, false)
                }
            }
        }

    }
}
