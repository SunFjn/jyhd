///<reference path="../config/immortals_cfg.ts"/>
///<reference path="../config/wing_cfg.ts"/>
///<reference path="../immortals/sb_item.ts"/>

namespace modules.wing {
    import BtnGroup = modules.common.BtnGroup;
    import Event = Laya.Event;
    import Text = Laya.Text;
    import CustomList = modules.common.CustomList;
    import CustomClip = modules.common.CustomClip;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import shenbing_magicShowFields = Configuration.shenbing_magicShowFields;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import BagModel = modules.bag.BagModel;
    import wing_magicShow = Configuration.wing_magicShow;
    import Image = Laya.Image;
    import WingCfg = modules.config.WingCfg;
    import wing_magicShowFields = Configuration.wing_magicShowFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import BaseItem = modules.bag.BaseItem;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import ItemFields = Protocols.ItemFields;
    import BagUtil = modules.bag.BagUtil;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import WingHuanhuaViewUI = ui.WingHuanhuaViewUI;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import ExplicitSuitModel = modules.explicit.ExplicitSuitModel;

    export class WingHuanhuaPanel extends WingHuanhuaViewUI {
        // 按钮组
        private _btnGroup: BtnGroup;
        private _btnGroup2: BtnGroup;

        //消耗品
        private _consumables: BaseItem;
        private btnClip: CustomClip;

        private _upAttrTxts: Array<Text>;
        private _attrNameTxts: Array<Text>;
        private _attrValueTxts: Array<Text>;

        private _list: CustomList;
        private _arrowImgs: Array<Image>;
        private _recordSelect: number[];
        private _recordShowId: number; // 记录选中的id

        // private _modelClip: AvatarClip;
        private _skeletonClip: SkeletonAvatar;
        private _numDiff: number;
        private _showId: number;
        private _tiaoZhuanItemId: number;
        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._btnGroup2 = this.destroyElement(this._btnGroup2);
            this._consumables = this.destroyElement(this._consumables);
            this.btnClip = this.destroyElement(this.btnClip);
            this._attrNameTxts = this.destroyElement(this._attrNameTxts);
            this._attrValueTxts = this.destroyElement(this._attrValueTxts);
            this._arrowImgs = this.destroyElement(this._arrowImgs);
            this._upAttrTxts = this.destroyElement(this._upAttrTxts);
            this._list = this.destroyElement(this._list);
            // this._modelClip = this.destroyElement(this._modelClip);

            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this._showId = -1;
            this.centerX = 0;
            this.centerY = 0;

            this._recordSelect = [0, 0];
            this.sumAttrBtn.underline = true;

            this.creatEffect();

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.upGradeTab, this.huanhuaTab, this.fuhunTab);
            this._btnGroup2 = new BtnGroup();
            this._btnGroup2.setBtns(this.zhenpinBtn, this.jipinBtn, this.juepinBtn, this.diancangBtn);// , this.diancangBtn

            this._consumables = new BaseItem();
            this._consumables.pos(318, 935);
            this._consumables.scale(0.8, 0.8);
            this._consumables.zOrder = 10;
            this.addChild(this._consumables);

            this._upAttrTxts = new Array<Text>();
            this._arrowImgs = new Array<Image>();

            this._attrValueTxts = [this.valueTxt_1, this.valueTxt_2, this.valueTxt_3, this.valueTxt_4, this.valueTxt_5, this.valueTxt_6];
            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2, this.nameTxt_3, this.nameTxt_4, this.nameTxt_5, this.nameTxt_6];
            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2, this.liftTxt_3, this.liftTxt_4, this.liftTxt_5, this.liftTxt_6];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2, this.upArrImg_3, this.upArrImg_4, this.upArrImg_5, this.upArrImg_6];

            this._list = new CustomList();
            this._list.spaceX = 25;
            this._list.scrollDir = 2;
            this._list.width = 500;
            this._list.height = 152;
            this._list.vCount = 1;
            this._list.itemRender = WingSkinItem;
            this._list.x = 120;
            this._list.y = 800;
            this._list.scrollBtn = [this.preBtn, this.nextBtn]
            this.huanhuaPanel.addChild(this._list);

            this._numDiff = 0;
            this._recordShowId = -1;

            this.bgImg0.skin = "immortal/bg_gs_huanhua.png";
        }

        protected onOpened(): void {
            super.onOpened();
            this.btnClip.play();
            this.btnClip.visible = false;
            this._btnGroup.selectedIndex = 1;
            if (this._tiaoZhuanItemId) {
                let weizhi = WingModel.instance.panDuanpingzhi(this._tiaoZhuanItemId);
                if (weizhi != -1) {
                    this._btnGroup2.selectedIndex = weizhi;
                    this.selectQualityById(this._tiaoZhuanItemId);
                }
                else {
                    this.searchOne();
                }
            }
            else {
                this.searchOne();
            }
            this._tiaoZhuanItemId = null;
        }
        public setOpenParam(value: number): void {
            super.setOpenParam(value);
            this._tiaoZhuanItemId = value;

        }
        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._btnGroup, common.LayaEvent.CHANGE, this, this.changeHandler);
            this.addAutoListener(this._btnGroup2, common.LayaEvent.CHANGE, this, this.selectBtnGroup2, [true]);
            this.addAutoListener(this.aboutBtn, common.LayaEvent.CLICK, this, this.openAbout);
            this.addAutoListener(this.goBtn, common.LayaEvent.CLICK, this, this.goBtnFunc);
            this.addAutoListener(this.changeImg, common.LayaEvent.CLICK, this, this.changefunc);
            this.addAutoListener(this.sumAttrBtn, common.LayaEvent.CLICK, this, this.openSumAttr);
            this.addAutoListener(this.preBtn, common.LayaEvent.CLICK, this, this.pageUpHandler);
            this.addAutoListener(this.nextBtn, common.LayaEvent.CLICK, this, this.pageDownHandler);
            this.addAutoListener(this.wxBtn, common.LayaEvent.CLICK, this, this.wxBtnFunc);
            this.addAutoListener(this.fxBtn, common.LayaEvent.CLICK, this, this.fxBtnFunc);
            this.addAutoListener(this.tzBtn, common.LayaEvent.CLICK, this, this.tzBtnFunc);

            this.addAutoListener(this._list, common.LayaEvent.SELECT, this, this.selectSkinItem);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.WING_UPDATE, this, this.changeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.changeHandler, [2]);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_DATA_INITED, this, this.changeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XYHUANHUA_UPDATA, this, this.showEffect1);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XYCHANGE_HUANHUA, this, this.selectBtnGroup2, [false]);

            this.addAutoRegisteRedPoint(this.dotImg_1, ["wingShengjiRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_2, ["wingHuanhuaJipinRP", "wingHuanhuaZhenpinRP", "wingHuanhuaJuepinRP", "wingHuanhuaDianchangRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_3, ["wingFuhunRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_4, ["wingHuanhuaJipinRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_5, ["wingHuanhuaZhenpinRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_6, ["wingHuanhuaJuepinRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_7, ["wingHuanhuaDianchangRP"]);
            this.addAutoRegisteRedPoint(this.wxRP, ["ExplicitSuitBest", "ExplicitSuitUnique", "ExplicitSuitCollection"]);
        }

        private showEffect1(): void {
            let id = WingModel.instance._huanhuaActId;
            for (let i: int = 0, len: int = WingModel.instance.huanhuaList.keys.length; i < len; i++) {
                if (id == WingModel.instance.huanhuaList.keys[i] &&
                    WingModel.instance.huanhuaList.get(id)[MagicShowInfoFields.star] > 1)
                    SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong7.png");
            }
        }

        private searchOne(): void {

            let selectIndex: number = 0;
            if (this.dotImg_4.visible) {
            } else if (this.dotImg_5.visible) {
                selectIndex = 1;
            } else if (this.dotImg_6.visible) {
                selectIndex = 2;
            } else if (this.dotImg_7.visible) {
                selectIndex = 3;
            }

            this._btnGroup2.selectedIndex = selectIndex;
            this.selectQuality();
        }


        private changeHandler(data: number = 0): void {

            if (this._btnGroup.selectedIndex == 0) {
                WindowManager.instance.open(WindowEnum.WING_SHENGJI_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 2) {
                WindowManager.instance.open(WindowEnum.WING_FUHUN_PANEL);
                return;
            }

            //设置阶级居中
            let width = this.jieCharMsz.width + 5 + this.jieMsz.width;
            let x = (this.width - width) / 2;
            this.jieMsz.x = x;
            this.jieCharMsz.x = x + this.jieMsz.width + 5;
            this.atkMsz.value = WingModel.instance.otherValue["幻化战力"].toString();
            this.selectSkinItem();

            if ((data && data == 2) && this._showId != -1) {
                let check = this.checkRedPoint(this._showId);
                if (!check) {
                    let data = this.filterOneData();//筛选一个能够升级的武器
                    if (data) {
                        this._btnGroup2.selectedIndex = data[0];
                        this._list.selectedIndex = data[1];
                    }
                }
            }
        }

        private selectSkinItem(): void {
            if (this._list.selectedData) {
                this._showId = this._list.selectedData;
            }
            let _pitchId: number = this._list.selectedData;
            if (!_pitchId) {
                if (this._recordShowId === -1) {
                    return;
                } else {
                    _pitchId = this._recordShowId;
                }
            }
            this._recordShowId = _pitchId;

            let modelCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(_pitchId);
            // this._modelClip.reset(_pitchId);
            // if (this._skeletonClip) {
            //     this._skeletonClip.removeChildren();
            // }
            this._skeletonClip.reset(_pitchId);
            this._skeletonClip.resetScale(AvatarAniBigType.clothes, 1.3);
            // this._modelClip.setActionType(ActionType.SHOW, 0);
            this._skeletonClip.playAnimThenDaiji(AvatarAniBigType.clothes, ActionType.SHOW);
            // this._modelClip.avatarRotationX = modelCfg[ExteriorSKFields.rotationX];
            // this._modelClip.avatarRotationY = modelCfg[ExteriorSKFields.rotationY];
            // this._modelClip.avatarScale = modelCfg[ExteriorSKFields.scale] ? modelCfg[ExteriorSKFields.scale] : 1;
            // this._modelClip.avatarY = modelCfg[ExteriorSKFields.deviationY];
            // this._modelClip.avatarX = modelCfg[ExteriorSKFields.deviationX];
            this.NameTxt.text = modelCfg[ExteriorSKFields.name];

            let currShowId: number = WingModel.instance.otherValue["幻化id"];
            if (_pitchId === currShowId) {
                this.changeImg.visible = false;
                this.useImg.visible = true;
            } else {
                if (WingModel.instance.huanhuaList.get(_pitchId)) {
                    this.changeImg.visible = true;
                } else {
                    this.changeImg.visible = false;
                }
                this.useImg.visible = false;
            }

            if (WingModel.instance.huanhuaList.get(_pitchId)) {
                this.jieMsz.visible = true;
                this.jieCharMsz.visible = true;
                this.noActImg.visible = false;
                this.tipBox.visible = false;
                this.goBtn.label = "升阶";
                this.jieMsz.value = WingModel.instance.huanhuaList.get(_pitchId)[MagicShowInfoFields.star];

            } else {
                this.jieMsz.visible = false;
                this.jieCharMsz.visible = false;
                this.noActImg.visible = true;
                this.tipBox.visible = true;
                this.goBtn.label = "激活";
                this.showTip(_pitchId);
            }

            let charNum: number = this.jieMsz.value.length;
            let charWidth: number = 22 * charNum + (this.atkMsz.spaceX) * (charNum - 1);
            let width = this.jieCharMsz.width + 5 + charWidth;
            let x = (this.width - width) / 2;
            this.jieMsz.x = x;
            this.jieCharMsz.x = x + charWidth + 5;

            let _lev: number = 0;
            for (let i: int = 0, len: int = WingModel.instance.huanhuaList.keys.length; i < len; i++) {
                if (_pitchId == WingModel.instance.huanhuaList.keys[i])
                    _lev = WingModel.instance.huanhuaList.get(WingModel.instance.huanhuaList.keys[i])[MagicShowInfoFields.star];
            }

            let cfg = WingCfg.instance.getHuanhuaCfgByIdAndLv(_pitchId, _lev);
            let nextCfg = WingCfg.instance.getHuanhuaCfgByIdAndLv(_pitchId, _lev + 1);

            let count: int = cfg[shenbing_magicShowFields.items][1];
            let itemId: int = cfg[shenbing_magicShowFields.items][0];

            this.btnClip.visible = BagModel.instance.getItemCountById(itemId) >= count;

            this.setAttr(cfg, nextCfg);

            if (this._list.selectedIndex != -1) {
                this._recordSelect = [this._btnGroup2.selectedIndex, this._list.selectedIndex];
            }

            //
            this.tzBtn.visible = ExplicitSuitModel.instance.checkHaveExplicitSuitById(this._showId, true);
            this.wxBtn.visible = ExplicitSuitModel.instance.checkHaveExplicitSuitById(this._showId);
        }

        private showTip(pitchId: int): void {
            let cfg = WingCfg.instance.getHuanhuaCfgByIdAndLv(pitchId, 0);
            let str: string = cfg[shenbing_magicShowFields.getWay];
            let str1: string = "", str2: string = "";
            let j = str.length;
            for (let i: int = 0, len: int = str.length; i < len; i++) {
                if (str[i] === '#') {
                    str2 += '+';
                    j = i;
                    continue;
                }
                i < j == true ? str1 += str[i] : str2 += str[i];
            }
            this.tipTxt_1.text = str1;
            this.tipTxt_2.text = str2;
        }

        private selectBtnGroup2(click: boolean): void {
            let _arr: Array<wing_magicShow> = new Array<wing_magicShow>();
            if (this._btnGroup2.selectedIndex == 0) {
                _arr = WingCfg.instance.getSkinCfgByType(3);
            } else if (this._btnGroup2.selectedIndex == 1) {
                _arr = WingCfg.instance.getSkinCfgByType(4);
            } else if (this._btnGroup2.selectedIndex == 2) {
                _arr = WingCfg.instance.getSkinCfgByType(5);
            } else {
                _arr = WingCfg.instance.getSkinCfgByType(6);
            }

            //设置list居中
            let num = _arr.length;
            let width = num * 100 + this._list.spaceX * (num - 1);
            if (width >= 500) {
                width = 500;
            }
            this._list.x = (this.width / 2) - (width / 2);

            let _data: number[] = [];

            for (let j: int = 0; j < num; j++) {
                _data.push(_arr[j][wing_magicShowFields.showId]);
            }
            this._list.datas = _data;
            if (this._list.selectedData) {
                this._showId = this._list.selectedData;
            }
            // if (this._btnGroup2.selectedIndex == this._recordSelect[0]) this._list.selectedIndex = this._recordSelect[1];
            // else this._list.selectedIndex = -1;

            // 如果list少于四个则去掉左右滑动键
            if (this._list.datas.length <= 4) {
                this.preBtn.visible = this.nextBtn.visible = false;
            } else {
                this.preBtn.visible = this.nextBtn.visible = true;
            }

            // 切换品级时将选择第一个进行预览或跳至拥有的物品
            if (!click) {
                this.selectSkinItem();
                return;
            }
            let weared = -1;
            for (let i = 0; i < _arr.length; i++) {
                if (_arr[i][wing_magicShowFields.showId] == WingModel.instance.otherValue["幻化id"]) {
                    weared = i;
                }
            }
            if (weared !== -1) {
                this._list.selectedIndex = weared;
                this._list.scrollToIndex(weared);
            } else {
                this._list.selectedIndex = 0;
            }
        }

        private selectQuality(): void {

            for (let i: int = 0, len: int = this._list.datas.length; i < len; i++) {
                let lev: int = WingModel.instance.huanhuaList.get(this._list.datas[i]) ?
                    WingModel.instance.huanhuaList.get(this._list.datas[i])[MagicShowInfoFields.star] : 0;
                let cfg = WingCfg.instance.getHuanhuaCfgByIdAndLv(this._list.datas[i], lev);
                let itemId: int = cfg[shenbing_magicShowFields.items][0];
                let count: int = cfg[shenbing_magicShowFields.items][1];

                if (BagModel.instance.getItemCountById(itemId) >= count) {
                    this._list.selectedIndex = i;
                    this._recordSelect = [this._btnGroup2.selectedIndex, this._list.selectedIndex];
                    return;
                }
            }
            this._list.selectedIndex = 0;
            this._recordSelect = [this._btnGroup2.selectedIndex, this._list.selectedIndex];
        }
        private selectQualityById(id: number): void {

            for (let i: int = 0, len: int = this._list.datas.length; i < len; i++) {
                let lev: int = WingModel.instance.huanhuaList.get(this._list.datas[i]) ?
                    WingModel.instance.huanhuaList.get(this._list.datas[i])[MagicShowInfoFields.star] : 0;
                let cfg = WingCfg.instance.getHuanhuaCfgByIdAndLv(this._list.datas[i], lev);
                let itemId: int = cfg[shenbing_magicShowFields.items][0];
                let count: int = cfg[shenbing_magicShowFields.items][1];

                if (itemId == id) {
                    this._list.selectedIndex = i;
                    this._recordSelect = [this._btnGroup2.selectedIndex, this._list.selectedIndex];
                    return;
                }
            }
            this._list.selectedIndex = 0;
            this._recordSelect = [this._btnGroup2.selectedIndex, this._list.selectedIndex];
        }

        private creatEffect(): void {
            // 2d模型资源
            this._skeletonClip = SkeletonAvatar.createShow(this, this, 3);
            this._skeletonClip.pos(360, 480);
            this._skeletonClip.resetScale(AvatarAniBigType.wing, 0.8);

            this.btnClip = CommonUtil.creatEff(this.goBtn, `btn_light`, 15);
            this.btnClip.pos(-10, -15);
            this.btnClip.scale(0.9, 0.9);

            // this._modelClip = AvatarClip.create(1024, 1024, 1024);
            // this.huanhuaPanel.addChildAt(this._modelClip, 2);
            // this._modelClip.anchorX = 0.5;
            // this._modelClip.anchorY = 0.5;
            // this._modelClip.centerX = 0;
            // this._modelClip.y = 450;
        }

        //外显套装按钮
        private wxBtnFunc(): void {
            ExplicitSuitModel.instance.openExplicitSuitPanel(this._showId);
        }

        //套装属性按钮
        private tzBtnFunc(): void {
            ExplicitSuitModel.instance.openExplicitSuitAttrAlert(this._showId);
        }

        //分享按钮
        private fxBtnFunc(): void {
            CommonUtil.noticeError(16)
        }

        //升级按钮
        private goBtnFunc(): void {

            let id = this._consumables.itemData[ItemFields.ItemId];

            if (this._numDiff >= 0) {
                WingModel.instance._huanhuaActId = this._showId;
                WingCtrl.instance.magicLev([this._showId]);

            } else {
                BagUtil.openLackPropAlert(id, -this._numDiff);
            }
        }

        private changefunc(): void {
            WingCtrl.instance.changeMagic([this._showId]);
        }

        //设置属性加成列表
        private setAttr(cfg: wing_magicShow, nextCfg: wing_magicShow): void {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._attrNameTxts,
                this._attrValueTxts,
                this._arrowImgs,
                this._upAttrTxts,
                wing_magicShowFields.attrs
            );

            // if (t <= 2) this.img_line0.y = 40;
            // else if (t <= 4) this.img_line0.y = 80;
            // else if (t <= 6) this.img_line0.y = 120;

            let items: Array<number>;

            items = (<wing_magicShow>cfg)[wing_magicShowFields.items];

            this.fullLevelImg.visible = false;

            if (nextCfg) {    //可以升级
                this._consumables.visible = true;
                this.goBtn.visible = true;
                let hasItemNum: int = BagModel.instance.getItemCountById(items[0]);
                this._consumables.dataSource = [items[0], 0, 0, null];
                //消耗道具 颜色判定修改
                let colorStr = "#ff7462";
                if (hasItemNum < items[1]) {
                    this._consumables.setNum(`${hasItemNum}/${items[1]}`, colorStr);
                } else {
                    colorStr = "#ffffff";
                    this._consumables.setNum(`${hasItemNum}/${items[1]}`, colorStr);
                }
                this._numDiff = hasItemNum - items[1];
                this.btnClip.visible = this._numDiff >= 0;
            } else {          //没有下一级
                this._consumables.visible = false;
                this.goBtn.visible = false;
                this.fullLevelImg.visible = true;
                this.btnClip.visible = false;
            }
        }

        private openSumAttr(): void {
            // console.log('vtz:aaaaaaaaaaaaaa');
            //总有属性有 新的额外属性 （标识 方便修改）
            WindowManager.instance.openDialog(WindowEnum.ATTR_ALERT,
                ["幻化修炼总属性",
                    WingModel.instance.otherValue["幻化战力"],
                    WingModel.instance.attr["幻化总属性"],
                    WingCfg.instance.huanhuaAttrIndices
                ]);
        }

        //关于
        private openAbout(): void {
            CommonUtil.alertHelp(20017);
        }

        // 相应向上翻页按钮
        private pageUpHandler(): void {
            this._list.scroll(-100);
        }

        // 相应向下翻页按钮
        private pageDownHandler(): void {
            this._list.scroll(100);
        }

        //筛选一个能够升级或激活的幻化单元
        private filterOneData(): any {
            let _allArr: Array<Array<wing_magicShow>> = new Array<Array<wing_magicShow>>();
            _allArr.push(WingCfg.instance.getSkinCfgByType(3));
            _allArr.push(WingCfg.instance.getSkinCfgByType(4));
            _allArr.push(WingCfg.instance.getSkinCfgByType(5));
            _allArr.push(WingCfg.instance.getSkinCfgByType(6));
            for (let index = 0, len = _allArr.length; index < len; index++) {
                const arr = _allArr[index];
                for (let idx = 0, gen = arr.length; idx < gen; idx++) {
                    let data: wing_magicShow = arr[idx];
                    let isRedPoint = this.checkRedPoint(data[wing_magicShowFields.showId]);
                    if (isRedPoint) {
                        return [index, idx, data];
                    }
                }
            }

            return null;
        }

        //检测是否含有红点
        private checkRedPoint(showId: number): boolean {
            let star: int = 0;
            let isRedPoint: boolean = false;
            let _showInfo: MagicShowInfo = WingModel.instance.huanhuaList.get(showId);

            if (_showInfo) {
                star = _showInfo[MagicShowInfoFields.star];
            }

            let cfg = WingCfg.instance.getHuanhuaCfgByIdAndLv(showId, star);
            let nextCfg = WingCfg.instance.getHuanhuaCfgByIdAndLv(showId, star + 1);

            if (!cfg) {
                return false;
            }

            let itemId: int = cfg[wing_magicShowFields.items][0];
            let count: int = cfg[wing_magicShowFields.items][1];

            if (star == 0) //未激活
            {
                // 判断材料，材料够显示可激活，材料不够显示获取途径
                if (BagModel.instance.getItemCountById(itemId) >= count) {
                    isRedPoint = true;
                }
            } else {    //已经激活
                isRedPoint = nextCfg && BagModel.instance.getItemCountById(itemId) >= count;
            }

            return isRedPoint;
        }
    }
}