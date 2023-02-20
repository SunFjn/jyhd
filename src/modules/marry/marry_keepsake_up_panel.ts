/**
 * 姻缘 信物 进阶 面板
 */
namespace modules.marry {
    import MarryKeepsake2ViewUI = ui.MarryKeepsake2ViewUI;
    import Sprite = Laya.Sprite;
    import Event = Laya.Event;
    import Texture = Laya.Texture;
    import Layer = ui.Layer;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import BtnGroup = modules.common.BtnGroup;
    import LayaEvent = modules.common.LayaEvent;
    import CustomList = modules.common.CustomList;
    import marry_keepsake_grade = Configuration.marry_keepsake_grade;
    import marry_keepsake_gradeFields = Configuration.marry_keepsake_gradeFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import SkillInfo = Protocols.SkillInfo;
    import SkillItem = modules.immortals.SkillItem;
    import FeedSkillType = ui.FeedSkillType;
    import CustomClip = modules.common.CustomClip;
    import FeedAttrType = ui.FeedAttrType;
    import MarryMemberFields = Protocols.MarryMemberFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import SkillInfoFields = Protocols.SkillInfoFields;

    export class MarryKeepsakeUpPanel extends MarryKeepsake2ViewUI {

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
        private btnClip: CustomClip;

        private _tween: TweenJS;
        private _tween2: TweenJS;

        private _curItemId: number;
        protected initialize(): void {
            super.initialize();
            this._curItemId = -1;
            this.titleTxt.color = "#e26139"
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.upBtn, this.up2Btn);

            this.btnClip = new CustomClip();
            this.feedBtn.addChild(this.btnClip);
            this.btnClip.skin = "assets/effect/btn_light.atlas";
            this.btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this.btnClip.durationFrame = 5;
            this.btnClip.loop = true;
            this.btnClip.pos(-6, -16);
            this.btnClip.scale(1.23, 1.18);
            this.btnClip.visible = false;

            TweenJS.create(this.iconBg1).yoyo(true).repeat(99999999)
                .to({ y: 237 }, 1200)
                .to({ y: 240 }, 1000)
                .start()
            TweenJS.create(this.iconBg2).yoyo(true).repeat(99999999)
                .to({ y: 237 }, 1200)
                .to({ y: 240 }, 1000)
                .start()

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

            this._List2.width = 85 * 4;
            this._List2.height = 85;
            this._List2.x = 0;
            this._List2.y = 0;
            this.itemBox.addChild(this._List2)

            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2, this.nameTxt_3, this.nameTxt_4];
            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2, this.liftTxt_3, this.liftTxt_4];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2, this.upArrImg_3, this.upArrImg_4];
            this._List.scrollBtn = [this.pageupBtn, this.pagedownBtn]


            this.playerName1Txt.text = PlayerModel.instance.roleName;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.upBtn, LayaEvent.CLICK, this, this.openUpPanl);
            this.addAutoListener(this.getTxt, LayaEvent.CLICK, this, this.openUpPanl);
            this.addAutoListener(this.feedBtn, LayaEvent.CLICK, this, this.sendFeed);
            this.pageupBtn.on(Event.CLICK, this, this.pageUpHandler);
            this.pagedownBtn.on(Event.CLICK, this, this.pageDownHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_Keepsake_GRADE_UPDATE, this, this.updataList);
            this._List.on(Event.SELECT, this, this.selectHandler);
            this.addAutoListener(this.mindsImg, LayaEvent.CLICK, this, this.openMinds);



        }

        private openMinds() {
            let itemId = this._List.selectedData[0]
            let name = CommonUtil.getNameByItemId(itemId)
            WindowManager.instance.open(WindowEnum.MARRY_MINDS_ALERT, { _name: name, _itemId: itemId, _lv: MarryModel.instance.getheartLevelLevel(itemId) });
        }
        //打开升级面板
        private openUpPanl(): void {
            WindowManager.instance.open(WindowEnum.MARRY_KEEPSAKE_PANEL, { index: this._List.selectedIndex, pos: this._List.scrollPos });
        }
        protected removeListeners(): void {
            super.removeListeners();
            this.pageupBtn.off(Event.CLICK, this, this.pageUpHandler);
            this.pagedownBtn.off(Event.CLICK, this, this.pageDownHandler);
        }
        // 相应向上翻页按钮
        private pageUpHandler(): void {
            this._List.scroll(-500);
        }

        // 相应向下翻页按钮
        private pageDownHandler(): void {
            this._List.scroll(500);
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
        private selectHandler(): void {
            let itemId = this._List.selectedData[0]
            let lv = MarryModel.instance.getKeepsakeLevel2(itemId);
            let cfg = MarryKeepsakeCfg.instance.getGradeMapItemCfg(itemId, lv)
            let nextcfg = MarryKeepsakeCfg.instance.getGradeMapItemCfg(itemId, lv + 1)
            let items = cfg[marry_keepsake_gradeFields.items];
            let nextItems = nextcfg[marry_keepsake_gradeFields.items];
            // console.log("ITEMS", items, itemId, lv, nextcfg);
            this.setAttr(cfg, nextcfg)
            this.feedBtn.visible = !!nextcfg;
            if (nextItems.length > 0) {
                this.feedBtn.visible = true;
            } else {
                // notice.SystemNoticeManager.instance.addNotice(`已满阶`, true);
                this.feedBtn.visible = false;
            }
            this._List2.width = [items].length * 85;
            this._List2.x = [items].length * 85 / 2 * -1;
            this._List2.datas = [items]
            if (MarryModel.instance.materialsMeet([items])) {
                this.btnClip.visible = true;
                this.btnClip.play();
            } else {
                this.btnClip.visible = false;
                this.btnClip.stop();
            }

            if (lv == 0) {
                this.upBox.visible = false;
                this.upBox2.visible = true;
            } else {
                this.upBox.visible = true;
                this.upBox2.visible = false;
            }


            // 设置技能
            let arr: number[] = MarryKeepsakeCfg.instance.getGradeSkill(itemId);
            for (let i: int = 0, len = arr.length; i < len; i++) {
                if (this.skillBox._childs.length > i) {
                    let lv = MarryModel.instance.getSkillLevel(arr[i])
                    let id = CommonUtil.getSkillIdByPureIdAndLv(arr[i], lv > 0 ? lv : 1);
                    let _item: SkillInfo = [id, lv, MarryModel.instance.getUpLevelStart(FeedSkillType.XinWuUp, lv, id)];
                    this.skillBox._childs[i].skillId = id;
                    this.skillBox._childs[i].skillInfo = _item;
                    (this.skillBox._childs[i] as SkillItem).type = FeedSkillType.XinWuUp;
                    (this.skillBox._childs[i] as SkillItem).stopUpgradeCallBack = () => {
                        let skillItem = this.filterOneSkillItem()
                        if (skillItem) {
                            skillItem.clickHandler();
                        }
                    };
                }
            }
            this.powerNum.value = MarryModel.instance.getfighting(FeedAttrType.XinWuUp).toString()
            this.iconBg1.skin = CommonUtil.getIconById(itemId, false);
            this.lv1Txt.value = MarryModel.instance.getKeepsakeLevel2(itemId).toString()
            this.levelTxt.text = "Lv." + MarryModel.instance.getheartLevelLevel(itemId).toString()
            if (MarryModel.instance.isHave) {
                this.iconBg2.skin = CommonUtil.getIconById(itemId, false);
                this.playerName2Txt.text = MarryModel.instance.intimacyer[MarryMemberFields.name]
                this.lv2Txt.visible = true
                this.lv2Txt.value = MarryModel.instance.getcoupleGradeLevel(itemId).toString()
            } else {
                this.iconBg2.skin = ""
                this.playerName2Txt.text = "暂无"
                this.lv2Txt.visible = false
            }
            this.tab1RP.visible = MarryModel.instance.getKeepsakeRP_level()
            this.tab2RP.visible = MarryModel.instance.getKeepsakeRP_grade()
            this.testingRP()
        }

        // 筛选能够升级Skill
        private filterOneSkillItem(): SkillItem {
            for (let i: int = 0, len = this.skillBox._childs.length; i < len; i++) {
                let skillItem: SkillItem = this.skillBox._childs[i];
                if (skillItem.skillInfo && skillItem.skillInfo[SkillInfoFields.point] > 0) {
                    return skillItem;
                }
            }
            return null;
        }


        private testingRP() {
            let items = this._List.items
            for (const key in items) {
                let itemId = items[key].data[0]
                let lv = MarryModel.instance.getKeepsakeLevel2(itemId);
                let cfg = MarryKeepsakeCfg.instance.getGradeMapItemCfg(itemId, lv)
                //let items = cfg[marry_keepsake_gradeFields.items]
                let obj = items[key] as MarryKeepsakeItem
                obj.setRP(MarryModel.instance.materialsMeet([cfg[marry_keepsake_gradeFields.items]]))
            }
        }
        private sendFeed() {
            let itemId = this._List.selectedData[0]
            let lv = MarryModel.instance.getKeepsakeLevel(itemId);
            let cfg = MarryKeepsakeCfg.instance.getItemCfg(itemId, lv)
            let items = cfg[marry_keepsake_gradeFields.items]
            if (MarryModel.instance.materialsMeet(items) || items.length != 1) {
                MarryCtrl.instance.GradeMarryKeepsake(itemId)
            } else {
                SystemNoticeManager.instance.addNotice("材料不足!", true);
                WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [items[0][0], 0, true]);
            }
            this._curItemId = itemId;
        }

        //设置属性加成列表
        private setAttr(cfg: marry_keepsake_grade, nextCfg: marry_keepsake_grade): void {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._attrNameTxts,
                null,
                this._arrowImgs,
                this._upAttrTxts,
                marry_keepsake_gradeFields.attrs
            );
        }
        protected onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 1
            this.initList();
            this._List.selectedIndex = this._selectedIndex;
            this._List.scrollPos = this._selectedPos;
            this.selectHandler()
        }
        private initList() {
            let ItemsData = MarryKeepsakeCfg.instance.getAllgrade()
            let arr = []
            ItemsData.forEach(e => {
                arr.push([e, MarryModel.instance.getKeepsakeLevel2(e), 2])
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
        private filterOneData(): any {
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
        private checkRedPoint(itemId: number): boolean {
            let lv = MarryModel.instance.getKeepsakeLevel2(itemId);
            let cfg = MarryKeepsakeCfg.instance.getGradeMapItemCfg(itemId, lv);
            if (MarryModel.instance.materialsMeet([cfg[marry_keepsake_gradeFields.items]])) {
                return true;
            }
            return false;
        }
    }
}