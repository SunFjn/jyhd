/** 
 * 仙娃 进阶
*/


namespace modules.marry {
    import MarryDollPromotionViewUI = ui.MarryDollPromotionViewUI;
    import Sprite = Laya.Sprite;
    import Event = Laya.Event;
    import Texture = Laya.Texture;
    import Layer = ui.Layer;
    import Image = Laya.Image;
    import Text = Laya.Text;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import LayaEvent = modules.common.LayaEvent;
    import UpdateFashionInfo = Protocols.UpdateFashionInfo;
    import UpdateFashionInfoFields = Protocols.UpdateFashionInfoFields;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;

    import marry_doll_grade = Configuration.marry_doll_grade;
    import marry_doll_gradeFields = Configuration.marry_doll_gradeFields;

    import SkillInfo = Protocols.SkillInfo;
    import SkillItem = modules.immortals.SkillItem;
    import Skill2Item = modules.immortals.Skill2Item;
    import CustomClip = modules.common.CustomClip;
    import FeedSkillType = ui.FeedSkillType;
    import FeedAttrType = ui.FeedAttrType;
    import ItemsFields = Configuration.ItemsFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import SkillInfoFields = Protocols.SkillInfoFields;


    export class MarryDollPromotionPanel extends MarryDollPromotionViewUI {

        // private _modelClip: AvatarClip;//展示的模型
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
        private _skeletonClip: SkeletonAvatar;

        private btnClip: CustomClip;
        private _curItemId:number;
        protected initialize(): void {
            super.initialize();

            this._curItemId = -1;

            this.titleTxt.color = "#e26139"
            // this._modelClip = AvatarClip.create(720, 1024, 1024);
            // this.addChildAt(this._modelClip, 4);
            // this._modelClip.anchorX = 0.5;
            // this._modelClip.anchorY = 0.5;
            // this._modelClip.centerX = 0;
            // this._modelClip.pos(0, 460, true);
            // this._modelClip.mouseEnabled = true;
            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.pos(0, 480, true);
            this._skeletonClip.scale(0.3,0.3);
            this._skeletonClip.centerX = 0;

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.function1Btn, this.function2Btn, this.function3Btn, this.function4Btn);

            this._List = new CustomList();
            this._List.scrollDir = 2;
            this._List.itemRender = MarryItem;
            this._List.vCount = 1;
            this._List.hCount = 7;

            this._List.width = 500;
            this._List.height = 110;
            this._List.x = 35;
            this._List.y = 0;
            this.list.addChild(this._List)

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

            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2, this.nameTxt_3, this.nameTxt_4];
            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2, this.liftTxt_3, this.liftTxt_4];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2, this.upArrImg_3, this.upArrImg_4];
            this._List.scrollBtn = [this.lastBtn, this.nextBtn]

            this.btnClip = new CustomClip();
            this.feedBtn.addChild(this.btnClip);
            this.btnClip.skin = "assets/effect/btn_light.atlas";
            this.btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this.btnClip.durationFrame = 5;
            this.btnClip.loop = true;
            this.btnClip.pos(-5, -10);
            this.btnClip.scale(0.97, 0.9);
            this.btnClip.visible = false;

        }

        private playExterior(id) {
            let modelCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(id);
            // this._modelClip.avatarScale = modelCfg[ExteriorSKFields.scale] ? modelCfg[ExteriorSKFields.scale] : 1;
            // this._modelClip.avatarRotationX = modelCfg[ExteriorSKFields.rotationX];
            // this._modelClip.avatarRotationY = modelCfg[ExteriorSKFields.rotationY];
            // this._modelClip.avatarY = modelCfg[ExteriorSKFields.deviationY];
            // this._modelClip.avatarX = modelCfg[ExteriorSKFields.deviationX];
            // this._modelClip.reset(id)
            // this._modelClip.setActionType(ActionType.SHOW, 0)
            this._skeletonClip.reset(id);
            this._skeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.SHOW, false);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.tipsBtn, LayaEvent.CLICK, this, this.openTips);

            this.addAutoListener(this.function1Btn, LayaEvent.CLICK, this, this.openPanlUp);
            //this.addAutoListener(this.function2Btn, LayaEvent.CLICK, this, this.openPanl, [WindowEnum.MARRY_CHILDREN_Up_PANEL, null]);
            this.addAutoListener(this.function3Btn, LayaEvent.CLICK, this, this.openPanl, [WindowEnum.MARRY_CHILDREN_Eat_PANEL, null]);
            this.addAutoListener(this.function4Btn, LayaEvent.CLICK, this, this.openPanl, [WindowEnum.MARRY_CHILDREN_Skill_PANEL, null]);
            this.addAutoListener(this.feedBtn, LayaEvent.CLICK, this, this.sendFeed);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_DOLL_GRADE_UPDATE, this, this.updataList);
            this.lastBtn.on(Event.CLICK, this, this.pageUpHandler);
            this.nextBtn.on(Event.CLICK, this, this.pageDownHandler);
            this._List.on(Event.SELECT, this, this.selectHandler);
            this.addAutoListener(this.attrAddAllText, LayaEvent.CLICK, this, this.openSumAttr);
        }
        /**
          *总属性
          */
        private openSumAttr(): void {
            //总有属性有 新的额外属性 （标识 方便修改）
            MarryModel.instance.openAttr("仙娃进阶总属性", FeedAttrType.dollUp)
        }


        // 相应向上翻页按钮
        private pageUpHandler(): void {
            this._List.scroll(-500);
        }

        // 相应向下翻页按钮
        private pageDownHandler(): void {
            this._List.scroll(500);
        }
        private feedId: number = 0;
        private feedNum: number = 0;
        private selectHandler(): void {
            //let itemId = this._List.selectedData[0]
            let itemId = this._List.selectedData[0]
            this.playExterior(itemId)
            //this.playExterior(itemId)
            let lv = MarryModel.instance.getDollClassLevel(itemId);
            let cfg = MarryDollCfg.instance.getGradeCfg(itemId, lv)
            let nextcfg = MarryDollCfg.instance.getGradeCfg(itemId, lv + 1)
            let exteriorSKCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(itemId);
            this.petNameTxt.text = exteriorSKCfg[ExteriorSKFields.name];
            this.lvTxt.value = lv.toString();
            this.notImg.visible = lv <= 0;
            this.lvTxt.visible = !this.notImg.visible
            this.feedBtn.visible = !!nextcfg;
            this.setAttr(cfg, nextcfg);

            if (!nextcfg) {
                //已满级
                this.feedBtn.label = "已满级";
                this.feedBtn.disabled = true;
                this._List2.datas = []
            } else {
                this.feedBtn.label = "一键培养";
                this.feedBtn.disabled = false;
                if (lv == 0) {
                    this.feedBtn.label = "激活";
                }
                let items = nextcfg[marry_doll_gradeFields.items]
                this._List2.datas = [items]
                this.feedId = items[ItemsFields.itemId]
                this.feedNum = items[ItemsFields.count]
                if (MarryModel.instance.materialsMeet([items])) {
                    this.btnClip.visible = true;
                    this.btnClip.play();
                } else {
                    this.btnClip.visible = false;
                    this.btnClip.stop();
                }
            }



            // 设置技能
            let arr: number[] = MarryDollCfg.instance.getAllSkill(itemId, 3);
            for (let i: int = 0, len = arr.length; i < len; i++) {
                if (this.skillBox._childs.length > i) {
                    let lv = MarryModel.instance.getSkillLevel(arr[i])
                    let id = CommonUtil.getSkillIdByPureIdAndLv(arr[i], lv > 0 ? lv : 1);
                    let _item: SkillInfo = [id, lv, MarryModel.instance.getUpLevelStart(FeedSkillType.dollUp, lv, id)];
                    this.skillBox._childs[i].skillId = id;
                    this.skillBox._childs[i].skillInfo = _item;
                    (this.skillBox._childs[i] as Skill2Item).type = FeedSkillType.dollUp;
                    (this.skillBox._childs[i] as SkillItem).stopUpgradeCallBack = ()=>{
                        let skillItem = this.filterOneSkillItem()
                        if (skillItem) {
                            skillItem.clickHandler();
                        }
                    };
                }
            }
            this.skillBox._childs[0].left = arr.length > 1 ? 20 : 180;
            this.skillBox._childs[1].visible = arr.length > 1;

            this.powerNum.value = MarryModel.instance.getfighting(FeedAttrType.dollUp).toString()
            this.function1RP.visible = MarryModel.instance.getDollRP_level()
            this.function2RP.visible = MarryModel.instance.getDollRP_grade()
            this.function3RP.visible = MarryModel.instance.getDollRP_eat()
            this.testingRP()
        }

        // 筛选能够升级Skill
        private filterOneSkillItem():SkillItem{
            for (let i: int = 0, len = this.skillBox._childs.length; i < len; i++) {
                let skillItem:SkillItem = this.skillBox._childs[i];
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
                let lv = MarryModel.instance.getDollClassLevel(itemId);
                let cfg = MarryDollCfg.instance.getGradeCfg(itemId, lv)
                let nextcfg = MarryDollCfg.instance.getGradeCfg(itemId, lv + 1)
                let obj = items[key] as MarryItem
                if (!nextcfg) {
                    obj.setRP(false)
                } else {
                    let k = nextcfg[marry_doll_gradeFields.items]
                    obj.setRP(MarryModel.instance.materialsMeet([k]))
                }


            }

        }
        //设置属性加成列表
        private setAttr(cfg: marry_doll_grade, nextCfg: marry_doll_grade): void {
            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._attrNameTxts,
                null,
                this._arrowImgs,
                this._upAttrTxts,
                marry_doll_gradeFields.attrs
            );
        }
        private sendFeed() {

            if (MarryModel.instance.getItemCountById(this.feedId) < this.feedNum) {
                SystemNoticeManager.instance.addNotice("材料不足!", true);
                WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [this.feedId, 0, true]);
            } else {
                let itemId = this._List.selectedData[0]
                MarryCtrl.instance.GradeMarryDoll(itemId)
            }
            this._curItemId = this._List.selectedData[0];
        }
        private openPanl(id: number) {
            WindowManager.instance.open(id);
        }
        private openTips() {
            CommonUtil.alertHelp(70008)
        }

        private openPanlUp() {
            WindowManager.instance.open(WindowEnum.MARRY_CHILDREN_PANEL, { index: this._List.selectedIndex, pos: this._List.scrollPos });
        }

        protected removeListeners(): void {
            super.removeListeners();

        }


        private _selectedIndex: number = 0
        private _selectedPos: number = 0
        //设置面板打开信息
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            if (value && value.pos != 0) {
                this._selectedIndex = value.index
                this._selectedPos = value.pos
            }
        }

        protected onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 1
            this.initList();
            this._List.selectedIndex = this._selectedIndex;
            this._List.scrollPos = this._selectedPos;

        }

        private initList() {
            let arr = []
            let data = MarryDollCfg.instance.getAllItems()
            data.forEach((value, key) => {
                arr.push([value, 2])
            })
            this._List.datas = arr;
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
                let itemId = items[key].data[0]
                if (this.checkRedPoint(itemId)) {
                    return [index];
                }
                index++;
            }
            return null;
        }

         //检测是否含有红点
         private checkRedPoint(itemId:number):boolean{
            let lv = MarryModel.instance.getDollClassLevel(itemId);
            let nextcfg = MarryDollCfg.instance.getGradeCfg(itemId, lv + 1)
            if (!nextcfg) {
                return false;
            }
            let k = nextcfg[marry_doll_gradeFields.items]
            if (MarryModel.instance.materialsMeet([k])) {
                return true;
            }
            return false;
        }
    }
}