/** 重命名弹框*/


namespace modules.rename {
    import LayaEvent = modules.common.LayaEvent;
    import RenameAlertUI = ui.RenameAlertUI;
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
    import ActorBaseAttrFields = Protocols.ActorBaseAttrFields;

    export class RenameAlert extends RenameAlertUI {
        private _occ: OccType;
        private _itemId: number;
        constructor() {
            super();
        }
        // 按钮组
        private _btnGroup: BtnGroup;
        private _boxGroup: Array<Laya.Box>;
        private _tween: TweenJS;
        private _list: CustomList;
        private _attrNameTxts: Array<Text>;
        private _upAttrTxts: Array<Text>;
        private _arrowImgs: Array<Image>;

        protected initialize(): void {
            super.initialize();
            // 改名消耗道具
            this._itemId = BlendCfg.instance.getCfgById(52001)[blendFields.intParam][0];
            this.itemIcon.skin = CommonUtil.getIconById(this._itemId);
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.renameBtn, this.headBtn, this.headFromBtn, this.chatBtn);
            this._boxGroup = [this.renameBox, this.headBox];//, this.headBox, this.headFromBox, this.chatBox

            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2];
            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2];

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.width = 550;
            this._list.height = 300;
            this._list.vCount = 1;
            this._list.hCount = 6;
            this._list.itemRender = RenameItem;
            this._list.x = 0;
            this._list.y = 0;
            this._list.spaceX = 20;
            this._list.spaceY = 10;
            this.listBox.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            //头像部分 

            this.addAutoListener(this.upBtn, LayaEvent.CLICK, this, this.sendHandler);

            // 改名部分
            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.okHandler);
            this.addAutoListener(this.helpBtn, LayaEvent.CLICK, this, this.helpHandler);
            this.addAutoListener(this.maleBtn, LayaEvent.CLICK, this, this.selectOccHandler, [OccType.Man]);
            this.addAutoListener(this.femaleBtn, LayaEvent.CLICK, this, this.selectOccHandler, [OccType.Woman]);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateBag);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_INFO_UPDATE, this, this.updateInfo);
            this.addAutoListener(this._btnGroup, LayaEvent.CHANGE, this, this.changeBagHandler);
            this.addAutoListener(this._list, LayaEvent.SELECT, this, this.changeListHandler);
            this.addAutoListener(this.replaceBtn, LayaEvent.CLICK, this, this.replaceHandler);

            this._btnGroup.selectedIndex = 0;
            GlobalData.dispatcher.on(CommonEventType.HEADER_DATA_UPDATE, this, this.openHead);
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
            this.statusImg.skin = RenameModel.instance.getHeadLevel(headId) == 0 ? "common/txt_common_wjh.png" : "common/txt_common_yjh.png"
            this.powerNum.value = !cfg ? '0' : (onCfg[headFields.fighting]).toString();
            this.levelImg.value = !cfg ? '0' : level.toString();
            if (!cfg) cfg = [headId, '', '', 0, null, 0, []];
            this.setAttr(cfg, nextcfg)
            //nextcfg 为空 已满级
            this.maxMaterialsTxt.visible = !nextcfg;
            this.materialsBox.visible = !this.maxMaterialsTxt.visible;
            this.materialsTxt.text = '';
            //nextcfg 存在 显示材料
            if (nextcfg) {
                let data = nextcfg[headFields.items];
                this.materialsTxt.text = BagModel.instance.getItemCountById(Number(data[0])) + '/' + data[1]
                this.materialsTxt.color = BagModel.instance.getItemCountById(Number(data[0])) > Number(data[1]) ? '#393939' : '#ef320e'
            }
            this.nullMaterialsTxt.visible = !nextcfg && cfg[headFields.attrs].length == 0;
            //是否当前选择的头像
            this.replaceBtn.visible = RenameModel.instance.selectHeadId != this._headList[this._list.selectedIndex]
            this.replaceImg.visible = !this.replaceBtn.visible
            this.upBtn.visible = !this.maxMaterialsTxt.visible



        }
        //设置属性加成列表
        private setAttr(cfg: head, nextCfg: head): void {
            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._attrNameTxts,
                null,
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
            this.attrUpdate();
        }

        public attrUpdate() {
            this.id.text = PlayerModel.instance.actorId.toString() || "暂无";
            this.name1.text = this.name2.text = PlayerModel.instance.playerBaseAttr[ActorBaseAttrFields.name] || "暂无";
            this.uid.text = "暂无";
            this.server.text =  "暂无";
        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            Laya.timer.clear(this, this.loopHandler);
            this.nameTxt.text = "";
        }

        private setBox(box: Laya.Box) {
            for (const key in this._boxGroup) {
                this._boxGroup[key].visible = this._boxGroup[key] == box
            }
        }
        private _btnsSelectedIndex: number = -1
        // 切换功能
        private changeBagHandler(): void {
            if (this._btnsSelectedIndex == this._btnGroup.selectedIndex) return;
            this._btnsSelectedIndex = this._btnGroup.selectedIndex;
            switch (this._btnGroup.selectedIndex) {
                case 0:
                    this.setBox(this.renameBox);
                    this.openRename();
                    break;
                case 1:
                    this.setBox(this.headBox);
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


        //改名部分=====================
        private openRename() {
            this._occ = -1;
            this.selectOccHandler(PlayerModel.instance.occ);
            this.updateBag();
            this.updateInfo();
        }




        // 更新改名信息
        private updateInfo(): void {
            let info: GetSetNameInfoReply = RenameModel.instance.renameInfo;
            if (!info) return;
            Laya.timer.loop(1000, this, this.loopHandler);
            this.loopHandler();
        }

        // 选中性别
        private selectOccHandler(occ: OccType): void {
            if (this._occ === occ) return;
            this._occ = occ;
            this.maleBtn.selected = occ === OccType.Man;
            this.femaleBtn.selected = occ === OccType.Woman;
        }

        private updateBag(): void {
            let count: number = BagModel.instance.getItemCountById(this._itemId);
            this.itemNumTxt.text = `${count}/1`;
            this.itemNumTxt.color = count >= 1 ? "#393939" : "#ff3e3e";
        }
        private loopHandler(): void {
            let info: GetSetNameInfoReply = RenameModel.instance.renameInfo;
            let endTime: number = info[GetSetNameInfoReplyFields.cd];
            if (info[GetSetNameInfoReplyFields.times] === 0 || endTime < GlobalData.serverTime) {
                this.cdTxt.visible = false;
                this.okBtn.visible = true;
                Laya.timer.clear(this, this.loopHandler);
                return;
            } else {
                this.cdTxt.visible = true;
                this.okBtn.visible = false;
                this.cdTxt.text = `冷却中：${CommonUtil.timeStampToMMSS(endTime)}`;
            }
        }

        private okHandler(): void {
            // 优先判断改名卡数量是否足够
            let count: number = BagModel.instance.getItemCountById(this._itemId);
            if (count < 1) {
                BagUtil.openLackPropAlert(this._itemId, 1);
                return;
            }
            let name: string = this.nameTxt.text;
            if (!name) {
                SystemNoticeManager.instance.addNotice("名字不能为空", true);
                return;
            } else if (StringUtils.containSpace(name)) {
                SystemNoticeManager.instance.addNotice("名字不能包含空格", true);
                return;
            } else if (name.length < 1 || name.length > 6) {
                SystemNoticeManager.instance.addNotice("名字长度为1~6个字", true);
                return;
            } else if (!StringUtils.isValidWords(name)) {
                SystemNoticeManager.instance.addNotice("包含非法字符", true);
                return;
            }
            RenameCtrl.instance.setNameSex(name, this._occ);
        }

        private helpHandler(): void {
            CommonUtil.alertHelp(20064);
        }

    }
}