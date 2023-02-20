///<reference path="../config/tian_zhu_magic_show_cfg.ts"/>


/** 时装幻化面板*/


namespace modules.tianZhu {
    import ImmortalHuanhuaViewUI = ui.ImmortalHuanhuaViewUI;
    import LayaEvent = modules.common.LayaEvent;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import TianZhuMagicShowCfg = modules.config.TianZhuMagicShowCfg;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import BagModel = modules.bag.BagModel;
    import CustomClip = modules.common.CustomClip;
    import BtnGroup = modules.common.BtnGroup;
    import BaseItem = modules.bag.BaseItem;
    import Image = Laya.Image;
    import CustomList = modules.common.CustomList;
    // import AvatarClip = modules.common.AvatarClip;
    import ItemFields = Protocols.ItemFields;
    import BagUtil = modules.bag.BagUtil;
    import UpdateTianZhuInfoFields = Protocols.UpdateTianZhuInfoFields;
    import UpdateTianZhuInfo = Protocols.UpdateTianZhuInfo;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import tianzhu_magicShowFields = Configuration.tianzhu_magicShowFields;
    import tianzhu_magicShow = Configuration.tianzhu_magicShow;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class TianZhuHuanHuaPanel extends ImmortalHuanhuaViewUI {
        // 按钮组
        private _btnGroup2: BtnGroup;
        //消耗品
        private _consumables: BaseItem;

        private btnClip: CustomClip;

        private _attrNameTxts: Array<Laya.Text>;
        private _attrValueTxts: Array<Laya.Text>;
        private _arrowImgs: Array<Image>;
        private _upAttrTxts: Array<Laya.Text>;

        private _list: CustomList;
        private _recordSelect: number[];  // 1珍极绝 2list下标
        private _recordShowId: number; // 记录选中的id

        private _numDiff: number;
        // private _modelClip: AvatarClip;
        // private _modelClipTween: TweenJS;

        private _needMatCount: number;

        private _showId: number;
        private _tiaoZhuanItemId: number;
        private _skeletonClip: SkeletonAvatar;
        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            this._attrNameTxts.length = 0;
            this._attrNameTxts = null;
            this._attrValueTxts.length = 0;
            this._attrValueTxts = null;
            this._upAttrTxts.length = 0;
            this._upAttrTxts = null;
            this._arrowImgs.length = 0;
            this._arrowImgs = null;
            if (this._recordSelect) {
                this._recordSelect.length = 0;
                this._recordSelect = null;
            }

            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            if (this.btnClip) {
                this.btnClip.removeSelf();
                this.btnClip.destroy();
                this.btnClip = null;
            }
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            // if (this._modelClip) {
            //     this._modelClip.removeSelf();
            //     this._modelClip.destroy();
            //     this._modelClip = null;
            // }
            if (this._btnGroup2) {
                this._btnGroup2.destroy();
                this._btnGroup2 = null;
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

            this.huanhuaTab.selected = true;
            this._btnGroup2 = new BtnGroup();
            this._btnGroup2.setBtns(this.zhenpinBtn, this.jipinBtn, this.juepinBtn, this.diancangBtn);

            this._consumables = new BaseItem();
            this._consumables.pos(318, 935);
            this._consumables.scale(0.8, 0.8);
            this._consumables.zOrder = 120;
            this.addChild(this._consumables);

            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2, this.nameTxt_3, this.nameTxt_4, this.nameTxt_5, this.nameTxt_6];
            this._attrValueTxts = [this.valueTxt_1, this.valueTxt_2, this.valueTxt_3, this.valueTxt_4, this.valueTxt_5, this.valueTxt_6];
            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2, this.liftTxt_3, this.liftTxt_4, this.liftTxt_5, this.liftTxt_6];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2, this.upArrImg_3, this.upArrImg_4, this.upArrImg_5, this.upArrImg_6];

            this._list = new CustomList();
            this._list.spaceX = 25;
            this._list.scrollDir = 2;
            this._list.width = 650;
            this._list.height = 152;
            this._list.vCount = 1;
            this._list.itemRender = TianZhuHuanHuaItem;
            this._list.x = 65;
            this._list.y = 800;

            this.huanhuaPanel.addChild(this._list);

            this._numDiff = 0;

            this._recordShowId = -1;

            this.titleTxt.text = "鬼神之力";
            this.bgImg0.skin = "immortal/bg_gs_huanhua.png";
            this.title_txt.skin = "immortal/txt_bw.png"
        }

        protected onOpened(): void {
            super.onOpened();
            if (this._tiaoZhuanItemId) {
                this.btnClip.visible = false;
                let weizhi = TianZhuModel.instance.panDuanpingzhi(this._tiaoZhuanItemId);
                if (weizhi != -1) {
                    this._btnGroup2.selectedIndex = weizhi;
                    this.selectQualityById(this._tiaoZhuanItemId);
                }
                else {
                    this._showId = -1;
                    this.searchOne();
                }
                // this._modelClip.y = 580;
                this.updateTianZhuInfo();
            }
            else {
                this.btnClip.visible = false;
                this._showId = -1;
                this.searchOne();
                // this._modelClip.y = 580;
                // this._modelClipTween = TweenJS.create(this._modelClip).to({y: this._modelClip.y - 20},
                //     1000).yoyo(true).repeat(99999999);
                // this._modelClipTween.start();
                this.updateTianZhuInfo();
            }
            this._tiaoZhuanItemId = null;
            this.upGradeTab.label = "升级";
            this.huanhuaTab.label = "幻化";
            this.fuhunTab.label = "唤醒";
        }
        public setOpenParam(value: number): void {
            super.setOpenParam(value);
            this._tiaoZhuanItemId = value;
        }
        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.upGradeTab, LayaEvent.CLICK, this, this.shengjiHandler);
            this.addAutoListener(this.fuhunTab, LayaEvent.CLICK, this, this.fuhunHandler);
            this.addAutoListener(this._btnGroup2, LayaEvent.CHANGE, this, this.selectBtnGroup2);
            this.addAutoListener(this.aboutBtn, LayaEvent.CLICK, this, this.openAbout);
            this.addAutoListener(this.goBtn, LayaEvent.CLICK, this, this.goBtnFunc);
            this.addAutoListener(this.wxBtn, LayaEvent.CLICK, this, this.wxBtnFunc);
            this.addAutoListener(this.fxBtn, LayaEvent.CLICK, this, this.fxBtnFunc);
            this.addAutoListener(this.tzBtn, LayaEvent.CLICK, this, this.tzBtnFunc);
            this.addAutoListener(this.changeImg, LayaEvent.CLICK, this, this.changeShow);
            this.addAutoListener(this._list, LayaEvent.SELECT, this, this.selectSkinItem);
            this.addAutoListener(this.sumAttrBtn, LayaEvent.CLICK, this, this.openSumAttr);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TIAN_ZHU_INFO_UPDATE, this, this.updateTianZhuInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateTianZhuInfo,[2]);

            this.addAutoRegisteRedPoint(this.dotImg_1, ["tianZhuShengJiRP", "tianZhuShengJiMatRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_2, ["tianZhuHuanHuaJiPinRP", "tianZhuHuanHuaZhenPinRP", "tianZhuHuanHuaJuePinRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_3, ["tianZhuFuHunRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_4, ["tianZhuHuanHuaZhenPinRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_5, ["tianZhuHuanHuaJiPinRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_6, ["tianZhuHuanHuaJuePinRP"]);
        }

        protected removeListeners(): void {
            super.removeListeners();
            // if (this._modelClipTween) {
            //     this._modelClipTween.stop();
            // }
        }

        private shengjiHandler(): void {
            WindowManager.instance.open(WindowEnum.TIAN_ZHU_SHENG_JI_PANEL);
        }

        private fuhunHandler(): void {
            WindowManager.instance.open(WindowEnum.TIAN_ZHU_FU_HUN_PANEL);
        }

        private updateTianZhuInfo(data:number = 0): void {
            let tianZhuInfo: UpdateTianZhuInfo = TianZhuModel.instance.tianZhuInfo;
            if (!tianZhuInfo) return;
            this.atkMsz.value = TianZhuModel.instance.tianZhuInfo[UpdateTianZhuInfoFields.magicShowFighting].toString();

            let width = this.jieCharMsz.width + 5 + this.jieMsz.width;
            let x = (this.width - width) / 2;
            this.jieMsz.x = x;
            this.jieCharMsz.x = x + this.jieMsz.width + 5;
            this.selectSkinItem();

            if ((data && data == 2) && this._showId != -1) {
                let check = this.checkRedPoint(this._showId);
                if (!check){
                   let data = this.filterOneData();//筛选一个能够升级的武器
                   if (data) {
                        this._btnGroup2.selectedIndex = data[0];
                        this._list.selectedIndex = data[1];
                   }
                }
            }
        }

        private showClip(): void {
            // this._modelClip.visible = true;
        }

        private selectSkinItem(): void {
            if (this._list.selectedData) this._showId = this._list.selectedData;
            if (!this._showId) return;
            let modelCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(this._showId);
            // this._modelClip.avatarRotationX = modelCfg[ExteriorSKFields.rotationX];
            // this._modelClip.avatarRotationY = modelCfg[ExteriorSKFields.rotationY];
            // this._modelClip.avatarScale = modelCfg[ExteriorSKFields.scale] ? modelCfg[ExteriorSKFields.scale] : 1;
            // this._modelClip.avatarY = modelCfg[ExteriorSKFields.deviationY];
            // this._modelClip.avatarX = modelCfg[ExteriorSKFields.deviationX];
            // this._modelClip.reset(modelCfg[ExteriorSKFields.id]);
            // this._modelClip.setActionType(ActionType.SHOW);
            // if (this._skeletonClip) {
            //     this._skeletonClip.removeChildren();
            // }
            this._skeletonClip.reset(0, 0, 0, 0, 0, modelCfg[ExteriorSKFields.id]);
            this._skeletonClip.resetScale(AvatarAniBigType.tianZhu, 0.6);
            this._skeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.SHOW);
            // this._modelClip.visible = false;
            // Laya.timer.frameOnce(3, this, this.showClip);
            this.NameTxt.text = modelCfg[ExteriorSKFields.name];

            let currShowId: number = TianZhuModel.instance.tianZhuInfo[UpdateTianZhuInfoFields.curShowId];
            this.useImg.visible = this._showId === currShowId;
            let shows: Array<MagicShowInfo> = TianZhuModel.instance.tianZhuInfo[UpdateTianZhuInfoFields.showList];
            let showInfo: MagicShowInfo;             // 对应的服务器幻化列表中的信息
            for (let i: int = 0, len: int = shows.length; i < len; i++) {
                if (shows[i][MagicShowInfoFields.showId] === this._showId) {
                    showInfo = shows[i];
                    break;
                }
            }

            if (showInfo) {
                this.jieMsz.visible = true;
                this.jieCharMsz.visible = true;
                this.noActImg.visible = false;
                this.tipBox.visible = false;
                this.goBtn.label = "升阶";
                this.jieMsz.value = showInfo[MagicShowInfoFields.star].toString();
                this.changeImg.visible = this._showId !== currShowId;
            } else {
                this.jieMsz.visible = false;
                this.jieCharMsz.visible = false;
                this.noActImg.visible = true;
                this.tipBox.visible = true;
                this.goBtn.label = "激活";
                this.showTip(this._showId);
                this.changeImg.visible = false;
            }

            //设置阶级居中
            let charNum: number = this.jieMsz.value.length;
            let charWidth: number = 22 * charNum + (this.atkMsz.spaceX) * (charNum - 1);
            let width = this.jieCharMsz.width + 5 + charWidth;
            let x = (this.width - width) / 2;
            this.jieMsz.x = x;
            this.jieCharMsz.x = x + charWidth + 5;

            let lev: number = showInfo ? showInfo[MagicShowInfoFields.star] : 0;
            let cfg = TianZhuMagicShowCfg.instance.getCfgByShowIdAndLevel(this._showId, lev);
            let nextCfg = TianZhuMagicShowCfg.instance.getCfgByShowIdAndLevel(this._showId, lev + 1);

            this.setAttr(cfg, nextCfg);
            if (this._list.selectedIndex != -1) {
                this._recordSelect = [this._btnGroup2.selectedIndex, this._list.selectedIndex];
            }
        }

        private showTip(pitchId: int): void {
            let cfg = TianZhuMagicShowCfg.instance.getCfgByShowIdAndLevel(pitchId, 0);
            let str: string = cfg[tianzhu_magicShowFields.getWay];
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

        private selectBtnGroup2(): void {
            let arr: Array<tianzhu_magicShow> = new Array<tianzhu_magicShow>();
            arr = TianZhuMagicShowCfg.instance.getCfgsByQuality(this._btnGroup2.selectedIndex + 3);
            //设置list居中
            if (!arr) {
                SystemNoticeManager.instance.addNotice(ErrorCodeCfg.instance.getErrorCfgById(44008)[erorr_codeFields.msg_ZN]);

                this._btnGroup2.selectedIndex = 0;
                arr = TianZhuMagicShowCfg.instance.getCfgsByQuality(this._btnGroup2.selectedIndex + 3);
            }

            let num = arr.length;
            let width = num * 100 + this._list.spaceX * (num - 1);
            this._list.x = (this.width / 2) - (width / 2);

            let _data: number[] = [];

            for (let j: int = 0; j < num; j++) {
                _data.push(arr[j][tianzhu_magicShowFields.showId]);
            }
            this._list.datas = _data;
            // if (this._btnGroup2.selectedIndex == this._recordSelect[0]) this._list.selectedIndex = this._recordSelect[1];
            // else if (this._showId === -1) this._list.selectedIndex = 0;
            // else this._list.selectedIndex = -1;

            // 如果list少于四个则去掉左右滑动键
            if (this._list.datas.length <= 4) {
                this.preBtn.visible = this.nextBtn.visible = false;
            } else {
                this.preBtn.visible = this.nextBtn.visible = true;
            }

            // 切换品级时将选择第一个进行预览或跳至拥有的物品
            if (this._list.items.length) {
                let weared = -1;
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i][tianzhu_magicShowFields.showId] == TianZhuModel.instance.tianZhuInfo[UpdateTianZhuInfoFields.curShowId]) {
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
        }

        private selectQuality(): void {
            for (let i: int = 0, len: int = this._list.datas.length; i < len; i++) {
                let shows: Array<MagicShowInfo> = TianZhuModel.instance.tianZhuInfo[UpdateTianZhuInfoFields.showList];
                let lev: int = 0;
                for (let j: int = 0, len1: int = shows.length; j < len1; j++) {
                    if (this._list.datas[i] === shows[j][MagicShowInfoFields.showId]) {
                        lev = shows[j][MagicShowInfoFields.star];
                        break;
                    }
                }
                let cfg = TianZhuMagicShowCfg.instance.getCfgByShowIdAndLevel(this._list.datas[i], lev);
                let arr: Array<number> = cfg[tianzhu_magicShowFields.items];
                if (BagModel.instance.getItemCountById(arr[0]) >= arr[1]) {
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
                let shows: Array<MagicShowInfo> = TianZhuModel.instance.tianZhuInfo[UpdateTianZhuInfoFields.showList];
                let lev: int = 0;
                for (let j: int = 0, len1: int = shows.length; j < len1; j++) {
                    if (this._list.datas[i] === shows[j][MagicShowInfoFields.showId]) {
                        lev = shows[j][MagicShowInfoFields.star];
                        break;
                    }
                }
                let cfg = TianZhuMagicShowCfg.instance.getCfgByShowIdAndLevel(this._list.datas[i], lev);
                let arr: Array<number> = cfg[tianzhu_magicShowFields.items];
                if (arr[0] == id) {
                    this._list.selectedIndex = i;
                    this._recordSelect = [this._btnGroup2.selectedIndex, this._list.selectedIndex];
                    return;
                }
            }
            this._list.selectedIndex = 0;
            this._recordSelect = [this._btnGroup2.selectedIndex, this._list.selectedIndex];
        }
        //设置属性加成列表
        private setAttr(cfg: tianzhu_magicShow, nextCfg: tianzhu_magicShow): void {
            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._attrNameTxts,
                this._attrValueTxts,
                this._arrowImgs,
                this._upAttrTxts,
                tianzhu_magicShowFields.attrs
            );

            // if (t <= 2) this.img_line0.y = 80;
            // else if (t <= 4) this.img_line0.y = 120;
            // else if (t <= 6) this.img_line0.y = 160;

            let items: Array<number> = cfg[tianzhu_magicShowFields.items];

            this.fullLevelImg.visible = false;

            if (nextCfg) {    //可以升级
                this._consumables.visible = true;
                this.goBtn.visible = true;
                let hasItemNum: int = BagModel.instance.getItemCountById(items[0]);
                this._needMatCount = items[1];
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
                this._numDiff >= 0 ? this.btnClip.play() : this.btnClip.stop();
            } else {          //没有下一级
                this._consumables.visible = false;
                this.goBtn.visible = false;
                this.fullLevelImg.visible = true;
                this.btnClip.visible = false;
                this.btnClip.stop();
            }

            // for (let i: int = t, len: int = this._nameArr.length; i < len; i++) {
            //     this._nameArr[i].visible = this._valueArr[i].visible = this._upImgsArr[i].visible = this._liftArr[i].visible = false;
            // }
        }

        private creatEffect(): void {
            // 2d模型资源
            this._skeletonClip = SkeletonAvatar.createShow(this, this, 3);
            this._skeletonClip.pos(360, 570)

            this.btnClip = new CustomClip();
            this.goBtn.addChild(this.btnClip);
            this.btnClip.skin = "assets/effect/btn_light.atlas";
            this.btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this.btnClip.durationFrame = 5;
            this.btnClip.loop = true;
            this.btnClip.pos(-10, -15);
            this.btnClip.scale(0.9, 0.9);
            this.btnClip.visible = false;

            // this._modelClip = AvatarClip.create(1024, 1024, 1024);
            // this.huanhuaPanel.addChildAt(this._modelClip, 2);
            // this._modelClip.anchorX = 0.5;
            // this._modelClip.anchorY = 0.5;
            // this._modelClip.centerX = 0;

        }

        //升级按钮
        private goBtnFunc(): void {
            let id = this._consumables.itemData[ItemFields.ItemId];
            if (this._numDiff >= 0) {
                TianZhuCtrl.instance.addTianZhuMagicShow(this._showId);
            } else {
                BagUtil.openLackPropAlert(id, -this._numDiff);
            }
        }

        //外显套装按钮
        private wxBtnFunc(): void {
            CommonUtil.noticeError(16)
        }

        //套装属性按钮
        private tzBtnFunc(): void {
            CommonUtil.noticeError(16)
        }

        //分享按钮
        private fxBtnFunc(): void {
            CommonUtil.noticeError(16)
        }

        private changeShow(): void {
            TianZhuCtrl.instance.changeTianZhuMagicShow(this._showId);
        }

        //关于
        private openAbout(): void {
            CommonUtil.alertHelp(20051);
        }

        private openSumAttr(): void {
            //总有属性有 新的额外属性 （标识 方便修改）
            WindowManager.instance.openDialog(WindowEnum.ATTR_ALERT,
                ["幻化总属性",
                    TianZhuModel.instance.tianZhuInfo[UpdateTianZhuInfoFields.magicShowFighting],
                    TianZhuModel.instance.tianZhuInfo[UpdateTianZhuInfoFields.magicShowAttr],
                    TianZhuMagicShowCfg.instance.attrIndices
                ]);
        }

        //筛选一个能够升级或激活的幻化单元
        private filterOneData():any{
            let _allArr: Array<Array<tianzhu_magicShow>> = new Array<Array<tianzhu_magicShow>>();
            _allArr.push(TianZhuMagicShowCfg.instance.getCfgsByQuality(3));
            _allArr.push(TianZhuMagicShowCfg.instance.getCfgsByQuality(4));
            _allArr.push(TianZhuMagicShowCfg.instance.getCfgsByQuality(5));
           //_allArr.push(TianZhuMagicShowCfg.instance.getCfgsByQuality(6));
            for (let index = 0,len = _allArr.length; index < len; index++) {
                const arr = _allArr[index];
                for (let idx = 0,gen = arr.length; idx < gen; idx++) {
                    let data:tianzhu_magicShow = arr[idx];
                    let isRedPoint = this.checkRedPoint(data[tianzhu_magicShowFields.showId]);
                    if (isRedPoint) {
                        return [index,idx,data];
                    }
                }
            }

            return null;
         }

        //检测是否含有红点
        private checkRedPoint(showId:number):boolean{
            let info: UpdateTianZhuInfo = TianZhuModel.instance.tianZhuInfo;
            if (!info) {
                return false;
            }
            let star: int = 0;
            let isRedPoint:boolean = false;
            let showInfo: MagicShowInfo = TianZhuModel.instance.getMagicShowInfoById(showId);
            if (showInfo) {
                star = showInfo[MagicShowInfoFields.star];
            }

            let cfg: tianzhu_magicShow = TianZhuMagicShowCfg.instance.getCfgByShowIdAndLevel(showId, star);
            let nextCfg: tianzhu_magicShow = TianZhuMagicShowCfg.instance.getCfgByShowIdAndLevel(showId, star + 1);
            if (!cfg) {
                return false;
            }
            let itemId: int = cfg[tianzhu_magicShowFields.items][0];
            let count: int = cfg[tianzhu_magicShowFields.items][1];

            if (star == 0) { //未激活
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