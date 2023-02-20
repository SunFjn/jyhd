/**
 * 姻缘 信物 面板
 */
namespace modules.marry {
    import MarryKeepsakeViewUI = ui.MarryKeepsakeViewUI;
    import Sprite = Laya.Sprite;
    import Event = Laya.Event;
    import Texture = Laya.Texture;
    import Layer = ui.Layer;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import BtnGroup = modules.common.BtnGroup;
    import LayaEvent = modules.common.LayaEvent;
    import CustomList = modules.common.CustomList;
    import marry_keepsake = Configuration.marry_keepsake;
    import marry_keepsakeFields = Configuration.marry_keepsakeFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import FeedSkillType = ui.FeedSkillType;
    import CustomClip = modules.common.CustomClip;
    import item_materialFields = Configuration.item_materialFields;
    import FeedAttrType = ui.FeedAttrType;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class MarryKeepsakePanel extends MarryKeepsakeViewUI {

        constructor() {
            super();
        }
        // 按钮组
        private _btnGroup: BtnGroup;
        private _List: CustomList;
        private _List2: CustomList;

        private _attrNameTxts: Array<Text>;
        private _upAttrTxts: Array<Text>;
        private _arrowImgs: Array<Image>;
        private _tween: TweenJS;
        private btnClip: CustomClip;
        private _curItemId:number;
        protected initialize(): void {
            super.initialize();
            this._curItemId = -1;
            this.titleTxt.color = "#e26139"
            this.itemImg.skin = "assets/icon/item/1_s.png"

            this.btnClip = new CustomClip();
            this.feedBtn.addChild(this.btnClip);
            this.btnClip.skin = "assets/effect/btn_light.atlas";
            this.btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this.btnClip.durationFrame = 5;
            this.btnClip.loop = true;
            this.btnClip.pos(-9, -14);
            this.btnClip.scale(1.25,1.2)
            this.btnClip.visible = false;
            this._tween = EffUtil.createTw1(this.iconBg, 200, 240, 1200, 1000)


            this._List = new CustomList();
            this._List.scrollDir = 2;
            this._List.itemRender = MarryKeepsakeItem;

            this._List.vCount = 1;

            this._List.hCount = 7;

            this._List.width = 500;
            this._List.height = 150;
            this._List.x = 35;
            this._List.y = 0;
            this.list.addChild(this._List)


            this._List2 = new CustomList();
            this._List2.scrollDir = 2;
            this._List2.itemRender = MarryKeepsake2Item;

            this._List2.vCount = 1;

            this._List2.hCount = 7;
            this._List2.spaceX = 7;
            this._List2.width = 96;
            this._List2.height = 96;
            this._List2.x = 0;
            this._List2.y = 0;
            this.itemBox.addChild(this._List2)

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.upBtn, this.up2Btn);

            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2, this.nameTxt_3, this.nameTxt_4];
            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2, this.liftTxt_3, this.liftTxt_4];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2, this.upArrImg_3, this.upArrImg_4];
            this._List.scrollBtn = [this.pageupBtn, this.pagedownBtn]
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.up2Btn, LayaEvent.CLICK, this, this.openUpPanl);
            this.addAutoListener(this.feedBtn, LayaEvent.CLICK, this, this.sendFeed);
            this.pageupBtn.on(Event.CLICK, this, this.pageUpHandler);
            this.pagedownBtn.on(Event.CLICK, this, this.pageDownHandler);
            this._List.on(Event.SELECT, this, this.selectHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_Keepsake_UPDATE, this, this.updataList);
            this.addAutoListener(this.attrAddAllText, LayaEvent.CLICK, this, this.openSumAttr);
        }
        /**
          *总属性
          */
        private openSumAttr(): void {
            //总有属性有 新的额外属性 （标识 方便修改）
            MarryModel.instance.openAttr("宝匣总属性", FeedAttrType.XinWu)
        }
        // 相应向上翻页按钮
        private pageUpHandler(): void {
            this._List.scroll(-500);
        }

        // 相应向下翻页按钮
        private pageDownHandler(): void {
            this._List.scroll(500);
        }

        private selectHandler(): void {
            let itemId = this._List.selectedData[0]
            let lv = MarryModel.instance.getKeepsakeLevel(itemId);
            let cfg = MarryKeepsakeCfg.instance.getItemCfg(itemId, lv)
            let nextcfg = MarryKeepsakeCfg.instance.getItemCfg(itemId, lv + 1)
            let items = cfg[marry_keepsakeFields.items]
            this.feedBtn.visible = !!nextcfg;
            if (!nextcfg) {
                // 已满级
                this.itemImg.visible = false;
                this.nunTxt.text = "";
                this._List2.datas = []
                this.feedBtn.label = "已满级";
                this.feedBtn.disabled = true
            } else {
                this.feedBtn.disabled = false
                this.iconBg.skin = CommonUtil.getIconById(itemId, false);
                let yb = items[items.length - 1]
                let data = []
                for (let index = 0; index < items.length - 1; index++) {
                    data.push(items[index])
                }
                if (yb) {
                    data.push([yb[0], yb[1]]);
                    yb = null
                }
                this._List2.width = data.length * 100;
                this._List2.x = data.length * 85 / 2 * -1;
                this._List2.datas = data

                if (!yb) {
                    this.itemImg.visible = false;
                    this.nunTxt.text = "";
                } else {
                    this.itemImg.visible = true;
                    this.nunTxt.text = yb[1].toString();
                }

                this.feedBtn.label = lv == 0 ? "激活" : "升级";
                if (MarryModel.instance.materialsMeet(items)) {
                    this.btnClip.visible = true;
                    this.btnClip.play();
                } else {
                    this.btnClip.visible = false;
                    this.btnClip.stop();
                }
                this.nameTxt.text = CommonUtil.getItemCfgById(itemId)[item_materialFields.name].toString()

            }
            this.jieMsz.text = lv.toString();


            this.setAttr(cfg, nextcfg)

            this.powerNum.value = MarryModel.instance.getfighting(FeedAttrType.XinWu).toString()
            this.tab1RP.visible = MarryModel.instance.getKeepsakeRP_level()
            this.tab2RP.visible = MarryModel.instance.getKeepsakeRP_grade()
            this.testingRP()
        }
        private testingRP() {
            let items = this._List.items
            for (const key in items) {
                let itemId = items[key].data[0]
                let lv = MarryModel.instance.getKeepsakeLevel(itemId);
                let cfg = MarryKeepsakeCfg.instance.getItemCfg(itemId, lv)
                let obj = items[key] as MarryKeepsakeItem
                obj.setRP(MarryModel.instance.materialsMeet(cfg[marry_keepsakeFields.items]))
            }
        }



        private sendFeed() {
            let itemId = this._List.selectedData[0]
            let lv = MarryModel.instance.getKeepsakeLevel(itemId);
            let cfg = MarryKeepsakeCfg.instance.getItemCfg(itemId, lv)
            let items = cfg[marry_keepsakeFields.items]
            if (MarryModel.instance.materialsMeet(items) || items.length != 1) {
                MarryCtrl.instance.AddMarryKeepsake(itemId)
            } else {
                SystemNoticeManager.instance.addNotice("材料不足!", true);
                WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [items[0][0], 0, true]);
            }
            this._curItemId = itemId;
        }





        //设置属性加成列表
        private setAttr(cfg: marry_keepsake, nextCfg: marry_keepsake): void {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._attrNameTxts,
                null,
                this._arrowImgs,
                this._upAttrTxts,
                marry_keepsakeFields.attrs
            );
        }
        //打开进阶面板
        private openUpPanl(): void {
            WindowManager.instance.open(WindowEnum.MARRY_KEEPSAKE_Up_PANEL, { index: this._List.selectedIndex, pos: this._List.scrollPos });
        }
        protected removeListeners(): void {
            super.removeListeners();
            this.pageupBtn.off(Event.CLICK, this, this.pageUpHandler);
            this.pagedownBtn.off(Event.CLICK, this, this.pageDownHandler);
        }
        private _selectedIndex: number = 0
        private _selectedPos: number = 0
        //设置面板打开信息
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            console.log('研发测试_chy:测试赋值', value);
            if (value && value.pos != 0) {
                this._selectedIndex = value.index
                this._selectedPos = value.pos
            }
        }
        protected onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 0
            this.initList();
            this._List.selectedIndex = this._selectedIndex;
            this._List.scrollPos = this._selectedPos;
        }
        private initList() {
            let ItemsData = MarryKeepsakeCfg.instance.getAllItems()
            let arr = []
            ItemsData.forEach(e => {
                arr.push([e, MarryModel.instance.getKeepsakeLevel(e), 1])
            });
            this._List.datas = arr
        }

        private updataList() {
            let index = this._List.selectedIndex;
            let pos = this._List.scrollPos;
            this.initList()

            if (this._curItemId != -1 && !this.checkRedPoint(this._curItemId)) {
                let filterData = this.filterOneData();
                if (filterData) {
                    this._List.selectedIndex = filterData[0];
                    this._List.scrollToIndex(index);
                    return;
                }
            }

            this._List.selectedIndex = index;
            this._List.scrollPos = pos;
        }

        public close(): void {
            super.close();
        }

        protected resizeHandler(): void {
        }

        //筛选一个可以升级的道具
        private filterOneData():any{
            let items = this._List.items;
            let index = 0;
            for (const key in items) {
                let itemId = items[key].data[0];
                if (this.checkRedPoint(itemId)) {
                    return [index]; 
                }
                index++;
            }
            return null;
        }

         //检测是否含有红点
         private checkRedPoint(itemId:number):boolean{
            let lv = MarryModel.instance.getKeepsakeLevel(itemId);
                let cfg = MarryKeepsakeCfg.instance.getItemCfg(itemId, lv);
                if (MarryModel.instance.materialsMeet(cfg[marry_keepsakeFields.items])) {
                    return true; 
                }
            return false;
        }
    }
}