/** 
 * 仙娃 进补
*/


namespace modules.marry {
    import MarryDollEatViewUI = ui.MarryDollEatViewUI;
    import Sprite = Laya.Sprite;
    import Event = Laya.Event;
    import Texture = Laya.Texture;
    import Layer = ui.Layer;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import ItemsFields = Configuration.ItemsFields;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import LayaEvent = modules.common.LayaEvent;
    import UpdateFashionInfo = Protocols.UpdateFashionInfo;
    import UpdateFashionInfoFields = Protocols.UpdateFashionInfoFields;
    import BtnGroup = modules.common.BtnGroup;
    import marry_doll_refine = Configuration.marry_doll_refine;
    import marry_doll_refineFields = Configuration.marry_doll_refineFields;
    import CustomClip = modules.common.CustomClip;
    import CustomList = modules.common.CustomList;
    import attr = Configuration.attr;
    import attrFields = Configuration.attrFields;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import FeedAttrType = ui.FeedAttrType
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import blend = Configuration.blend;

    export class MarryDollEatPanel extends MarryDollEatViewUI {


        constructor() {
            super();
        }
        // 按钮组
        private _btnGroup: BtnGroup;
        private _btnGroup2: BtnGroup;

        private _List2: CustomList;
        private _attrNameTxts: Array<Text>;
        private _upAttrTxts: Array<Text>;
        private _arrowImgs: Array<Image>;
        private btnClip: CustomClip;
        protected initialize(): void {
            super.initialize();
            this.titleTxt.color = "#e26139"
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.function1Btn, this.function2Btn, this.function3Btn, this.function4Btn);

            this._List2 = new CustomList();
            this._List2.scrollDir = 2;
            this._List2.itemRender = MarryKeepsake2Item;

            this._List2.vCount = 1;

            this._List2.hCount = 7;

            this._List2.width = 85;
            this._List2.height = 85;
            this._List2.x = 0;
            this._List2.y = 0;
            this.itemBox.addChild(this._List2)
            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2, this.nameTxt_3, this.nameTxt_4, this.nameTxt_5, this.nameTxt_6];
            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2, this.liftTxt_3, this.liftTxt_4, this.liftTxt_5, this.liftTxt_6];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2, this.upArrImg_3, this.upArrImg_4, this.upArrImg_5, this.upArrImg_6];
            this.btnClip = EffUtil.creatBtnEff1(this.feedBtn);
            this.btnClip.pos(-5, -10);
            this.btnClip.scale(0.97, 0.9);
        }



        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.icon1img, LayaEvent.CLICK, this, this.selectHandler, [1]);
            this.addAutoListener(this.icon2img, LayaEvent.CLICK, this, this.selectHandler, [2]);
            this.addAutoListener(this.icon3img, LayaEvent.CLICK, this, this.selectHandler, [3]);
            this.addAutoListener(this.icon4img, LayaEvent.CLICK, this, this.selectHandler, [4]);
            this.addAutoListener(this.tipsBtn, LayaEvent.CLICK, this, this.openTips);

            this.addAutoListener(this.function1Btn, LayaEvent.CLICK, this, this.openPanl, [WindowEnum.MARRY_CHILDREN_PANEL, null]);
            this.addAutoListener(this.function2Btn, LayaEvent.CLICK, this, this.openPanl, [WindowEnum.MARRY_CHILDREN_Up_PANEL, null]);
            //this.addAutoListener(this.function3Btn, LayaEvent.CLICK, this, this.openPanl, [WindowEnum.MARRY_CHILDREN_Eat_PANEL, null]);
            this.addAutoListener(this.function4Btn, LayaEvent.CLICK, this, this.openPanl, [WindowEnum.MARRY_CHILDREN_Skill_PANEL, null]);

            this.addAutoListener(this.feedBtn, LayaEvent.CLICK, this, this.sendFeed);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_DOLL_EAT_UPDATE, this, this.updataList);

            this.addAutoListener(this.attrAddAllText, LayaEvent.CLICK, this, this.openSumAttr);
        }
        /**
          *总属性
          */
        private openSumAttr(): void {
            //总有属性有 新的额外属性 （标识 方便修改）
            MarryModel.instance.openAttr("进补总属性", FeedAttrType.eat)
        }
        private openTips() {
            CommonUtil.alertHelp(70009)
        }
        private openPanl(id: number) {
            WindowManager.instance.open(id);
        }


        private _feedId: number;
        private _selectIndex: number = -1;
        private selectHandler(index: number) {
            let name = ['朱果', '紫花槐', '金钱参', '七彩莲']
            this['select' + index + 'img'].visible = true;
            if (this._selectIndex != -1)
                this['select' + this._selectIndex + 'img'].visible = false;
            this._selectIndex = index;

            let total = MarryModel.instance.getDollTotalLv();
            let lv = MarryModel.instance.getDollEatLevel(index - 1);
            let cfg = MarryDollCfg.instance.getEatCfg(index - 1, MarryModel.instance.getDollEatLevel(index - 1))
            this._feedId = cfg[marry_doll_refineFields.items][ItemsFields.itemId];
            this['num' + index + 'img'].text = lv + "/" + cfg[marry_doll_refineFields.level]
            let attr: Array<attr> = []
            let nextaAtr: Array<attr> = []
            this.btnClip.visible = false;
            this.btnClip.stop();
            cfg[marry_doll_refineFields.attrs].forEach(e => {
                attr.push([e[attrFields.type], e[attrFields.value] * lv])
                nextaAtr.push([e[attrFields.type], e[attrFields.value] * (lv + 1)])
            });
            if (cfg[marry_doll_refineFields.doollLevel] > total) {
                //不满足要求
                this.conditionTxt.visible = true;
                this.itemBox.visible = false;
                if (MarryModel.instance.getDollTotalLv() <= 0) {
                    this.conditionTxt.text = '请先激活任意仙娃';
                } else {
                    this.conditionTxt.text = name[index - 1] + '进补已达上限,仙龄总等级' + cfg[marry_doll_refineFields.doollLevel] + '级后可突破上限';
                }

            } else if (lv >= cfg[marry_doll_refineFields.level]) {
                //已经达到最高等级
                this.conditionTxt.visible = true;
                this.itemBox.visible = false;
                this.conditionTxt.text = name[index - 1] + '进补已达最高等级';
                nextaAtr = [];
            } else {
                this.conditionTxt.visible = false;
                this.itemBox.visible = true;
                this._List2.datas = [cfg[marry_doll_refineFields.items]]

                if (MarryModel.instance.materialsMeet([cfg[marry_doll_refineFields.items]])) {
                    this.btnClip.visible = true;
                    this.btnClip.play();
                }

            }


            this.setAttr([attr], [nextaAtr])
            this.powerNum.value = MarryModel.instance.getfighting(FeedAttrType.eat).toString()
            this.function1RP.visible = MarryModel.instance.getDollRP_level()
            this.function2RP.visible = MarryModel.instance.getDollRP_grade()
            this.function3RP.visible = MarryModel.instance.getDollRP_eat()
        }
        private initData(index: number) {
            let lv = MarryModel.instance.getDollEatLevel(index - 1);
            let cfg = MarryDollCfg.instance.getEatCfg(index - 1, MarryModel.instance.getDollEatLevel(index - 1))
            this['num' + index + 'img'].text = lv + "/" + cfg[marry_doll_refineFields.level]
        }

        //设置属性加成列表
        private setAttr(cfg: any, nextCfg: any): void {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._attrNameTxts,
                null,
                this._arrowImgs,
                this._upAttrTxts,
                0,
            );
        }
        protected removeListeners(): void {
            super.removeListeners();

        }

        protected onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 2
            let arr = MarryDollCfg.instance.getEatAll();
            arr.forEach(e => {
                this.initData((e + 1))
            })
            this.selectHandler(1)

        }

        private updataList() {
            let arr = MarryDollCfg.instance.getEatAll();
            arr.forEach(e => {
                this.initData((e + 1))
            })
            this.selectHandler(this._selectIndex)

        }
        public close(): void {
            super.close();
        }

        private sendFeed() {
            let conut = MarryModel.instance.getItemCountById(this._feedId)
            if (MarryModel.instance.getDollTotalLv() == 0) {
                let cfg: blend = BlendCfg.instance.getCfgById(70114);
                let itemId: number = cfg[blendFields.intParam][0];
                SystemNoticeManager.instance.addNotice("仙娃未激活!", true);
                WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [itemId, 0, true]);
            } else if (conut <= 0) {
                SystemNoticeManager.instance.addNotice("材料不足!", true);
                WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [this._feedId, 0, true]);
            } else {
                let type = this._selectIndex - 1
                MarryCtrl.instance.RiseMarryDollRefine(type)
            }


        }

        protected resizeHandler(): void {
        }
    }
}