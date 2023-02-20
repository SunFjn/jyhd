namespace modules.rename {
    import LayaEvent = modules.common.LayaEvent;
    import HeadViewUI = ui.HeadViewUI;
    import BagModel = modules.bag.BagModel;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BagUtil = modules.bag.BagUtil;
    import GetSetNameInfoReply = Protocols.GetSetNameInfoReply;
    import GetSetNameInfoReplyFields = Protocols.GetSetNameInfoReplyFields;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;
    import head = Configuration.head;
    import headFields = Configuration.headFields;
    import Text = Laya.Text;
    import Image = Laya.Image;
    import CustomClip = modules.common.CustomClip;

    export class HeadPanel extends HeadViewUI {
        private _occ: OccType;
        private _itemId: number;
        constructor() {
            super();
        }
        // 按钮组
        private _btnGroup: BtnGroup;
        private upBtnClip: CustomClip;
        //private _boxGroup: Array<Laya.Box>;
        private _tween: TweenJS;
        private _list: CustomList;
        private _list2: CustomList;
        private _attrNameTxts: Array<Text>;
        private _upAttrTxts: Array<Text>;
        private _attrValueTxts: Array<Text>;
        private _arrowImgs: Array<Image>;
        private _attTitlImgs: Array<Image>;
        //private _btnsSelectedIndex: number = -1;

        protected initialize(): void {
            super.initialize();
            // 改名消耗道具
            this._itemId = BlendCfg.instance.getCfgById(52001)[blendFields.intParam][0];
            //this.itemIcon.skin = CommonUtil.getIconById(this._itemId);
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.headBtn);
            //this._boxGroup = [this.renameBox, this.headBox];//, this.headBox, this.headFromBox, this.chatBox

            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2];
            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2];
            this._attrValueTxts = [this.value_txt_1,this.value_txt_2];
            this._attTitlImgs = [this.attr_title_img_0,this.attr_title_img_1];

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.width = 550;
            this._list.height = 400;
            this._list.vCount = 1;
            this._list.hCount = 6;
            this._list.x = 85;
            this._list.y = 450;
            this._list.spaceX = 20;
            this._list.spaceY = 10;
            this._list.itemRender = RenameItem;
            this.addChild(this._list);

            this.upBtnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16, false);
            this.upBtn.addChild(this.upBtnClip);
            this.upBtnClip.pos(-10, -25);
            this.upBtnClip.scale(1.3, 1.4);
            this.upBtnClip.visible = false;
            this.upBtnClip.play();
        }
        
        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this.upBtnClip = this.destroyElement(this.upBtnClip);
            super.destroy(destroyChild);
        }


        protected addListeners(): void {
            super.addListeners();
            //头像部分 

            this.addAutoListener(this.upBtn, LayaEvent.CLICK, this, this.sendHandler);

            // // 改名部分
            // this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.okHandler);
            // this.addAutoListener(this.helpBtn, LayaEvent.CLICK, this, this.helpHandler);
            this.addAutoListener(this.headFromBtn, LayaEvent.CLICK, this, this.headFromBtnHandler);
            this.addAutoListener(this.chatBtn, LayaEvent.CLICK, this, this.chatBtnHandler);
            //this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateBag);
            //this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_INFO_UPDATE, this, this.updateInfo);
            this.addAutoListener(this._btnGroup, LayaEvent.CHANGE, this, this.changeBagHandler);
            this.addAutoListener(this._list, LayaEvent.SELECT, this, this.changeListHandler);
            this.addAutoListener(this.replaceBtn, LayaEvent.CLICK, this, this.replaceHandler);

            this._btnGroup.selectedIndex = 0;
            this.addAutoListener(GlobalData.dispatcher,CommonEventType.HEADER_DATA_UPDATE, this, this.openHead);
            this.addAutoRegisteRedPoint(this.headRPImg, ["HeadCanActiveRP"]);
        }
        //列表选择
        private changeListHandler(): void {
            let headId = this._headList[this._list.selectedIndex];
            this._selectHeadId = headId;
            let level = RenameModel.instance.getHeadLevel(headId)
            let cfg = HeadCfg.instance.getLevelConfig(headId, level);
            let nextcfg = HeadCfg.instance.getLevelConfig(headId, level + 1);
            let onCfg = !cfg ? nextcfg : cfg;
            this.headNameTxt.text = onCfg[headFields.name];
            this.descTxt.text = onCfg[headFields.desc];
            if (headId == 0) this.headImg.skin = `assets/icon/head/${headId + PlayerModel.instance.occ}.png`
            else this.headImg.skin = `assets/icon/head/${headId + PlayerModel.instance.occ}.jpg`
            this.materialsImg.skin = this.headImg.skin
            this.replaceBtn.disabled = RenameModel.instance.getHeadLevel(headId) == 0
            this.upBtn.label = RenameModel.instance.getHeadLevel(headId) == 0 ? "激活" : "升阶";
            this.statusImg.visible = RenameModel.instance.getHeadLevel(headId) == 0;
            this.statusImg.skin = RenameModel.instance.getHeadLevel(headId) == 0 ? "common/txt_common_wjh.png" : "common/txt_common_yjh.png";
            this.powerNum.value = !cfg ? '0' : (onCfg[headFields.fighting]).toString();
            this.level_txt.text = !cfg ? '0阶' : level.toString() + "阶";
            if (!cfg) cfg = [headId, '', '', 0, null, 0, []];
            this.tip_txt.visible = !nextcfg && cfg[headFields.attrs].length == 0;
            this.setAttr(cfg, nextcfg)
            //nextcfg 为空 已满级
            this.maxMaterialsTxt.visible = !nextcfg;
            this.materialsBox.visible = !this.maxMaterialsTxt.visible;
            this.materialsTxt.text = '';
            //nextcfg 存在 显示材料
            if (nextcfg) {
                let data = nextcfg[headFields.items];
                this.materialsTxt.text = BagModel.instance.getItemCountById(Number(data[0])) + '/' + data[1];
                this.materialsTxt.color = BagModel.instance.getItemCountById(Number(data[0])) > Number(data[1]) ? '#393939' : '#ef320e';
            }
            //是否当前选择的头像
            this.replaceBtn.visible = RenameModel.instance.selectHeadId != this._headList[this._list.selectedIndex] && RenameModel.instance.getHeadLevel(headId) != 0;
            this.replaceImg.visible = !this.replaceBtn.visible;
            this.upBtn.visible = !this.maxMaterialsTxt.visible;
            this._attTitlImgs[0].visible = this._attTitlImgs[1].visible = headId != 0;

            let activecfg = HeadCfg.instance.getLevelConfig(headId, 1);
            let data = activecfg[headFields.items];
            let canActive = BagModel.instance.getItemCountById(Number(data[0])) >= data[1] && nextcfg != null;
            this.upBtnClip.visible = canActive && nextcfg != null;
            canActive && nextcfg != null ? this.upBtnClip.play():this.upBtnClip.stop();
        }
        //设置属性加成列表
        private setAttr(cfg: head, nextCfg: head): void {
            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._attrNameTxts,
                this._attrValueTxts,
                this._arrowImgs,
                this._upAttrTxts,
                headFields.attrs
            );
        }


        //发送激活请求
        private sendHandler(): void {
            RenameCtrl.instance.ActiveHeadImg(this._headList[this._list.selectedIndex]);

        }

        onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 0;
        }

        // 切换功能
        private changeBagHandler(): void {
            //this._btnsSelectedIndex = this._btnGroup.selectedIndex;
            switch (this._btnGroup.selectedIndex) {
                case 0:
                    this.openHead();
                    break;
            }
        }


        //头像列表
        private _headList: Array<number>;
        private _selectHeadId: number = 0;
        private openHead() {
            if (!this._tween) {
                this._tween = TweenJS.create(this.headBG).yoyo(true).repeat(99999999);
                this._tween.to({ y: 246 }, 1200).start().onComplete(() => {
                    this._tween.to({ y: 256 }, 1000).start().onComplete(() => {

                    });
                });
            }
            let arr = HeadCfg.instance.getAllHeadId()
            this._headList = [];
            let have = []
            let nohave = []
            for (let index = 0; index < arr.length; index++) {
                if (arr[index] == RenameModel.instance.selectHeadId) {
                    this._headList.push(arr[index])
                } else {
                    if (RenameModel.instance.getHeadLevel(arr[index]) > 0) {
                        have.push(arr[index])
                    } else {
                        nohave.push(arr[index])
                    }
                }

            }
            this._headList = this._headList.concat(have, nohave)
            this._list.datas = this._headList
            let _tag = this._headList.indexOf(this._selectHeadId)
            this._list.selectedIndex = _tag == -1 ? 0 : _tag;
        }

        //更换头像
        private replaceHandler(): void {
            RenameCtrl.instance.SetHeadImg(this._headList[this._list.selectedIndex]);
        }

       //头像框
       private headFromBtnHandler(){
            CommonUtil.noticeError(16);
       }
       //聊天框
       private chatBtnHandler(){
            CommonUtil.noticeError(16);
       }

        private helpHandler(): void {
            CommonUtil.alertHelp(20064);
        }

    }
    
}