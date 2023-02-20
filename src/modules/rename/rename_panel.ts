/** 重命名弹框*/
namespace modules.rename {
    import LayaEvent = modules.common.LayaEvent;
    import RenameViewUI = ui.RenameViewUI;
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

    export class RenamePanel extends RenameViewUI {
        private _occ: OccType;
        private _itemId: number;
        private _list :CustomList;
        constructor() {
            super();
        }
        
        private _attrNameTxts: Array<Text>;
        private _upAttrTxts: Array<Text>;
        private _arrowImgs: Array<Image>;

        protected initialize(): void {
            super.initialize();
            // 改名消耗道具
            this._itemId = BlendCfg.instance.getCfgById(52001)[blendFields.intParam][0];
            this.itemIcon.skin = CommonUtil.getIconById(this._itemId);
        }

        protected addListeners(): void {
            super.addListeners();
            // 改名部分
            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.okHandler);
            this.addAutoListener(this.helpBtn, LayaEvent.CLICK, this, this.helpHandler);
            this.addAutoListener(this.maleBtn, LayaEvent.CLICK, this, this.selectOccHandler, [OccType.Man]);
            this.addAutoListener(this.femaleBtn, LayaEvent.CLICK, this, this.selectOccHandler, [OccType.Woman]);
            this.addAutoListener(this.copyBtn, LayaEvent.CLICK, this, this.copyHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateBag);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_INFO_UPDATE, this, this.updateInfo);
            //this.addAutoListener(this._btnGroup, LayaEvent.CHANGE, this, this.changeBagHandler);
            //this._btnGroup.selectedIndex = 0;
            //GlobalData.dispatcher.on(CommonEventType.HEADER_DATA_UPDATE, this, this.openHead);

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

        onOpened(): void {
            super.onOpened();
            //this._btnGroup.selectedIndex = 0;
            this._occ = -1;
            this.selectOccHandler(PlayerModel.instance.occ);
            this.updateBag();
            this.updateInfo();
            this.attrUpdate();
        }

        public attrUpdate() {
            this.id.text = PlayerModel.instance.actorId.toString() || "暂无";
            this.name1.text = this.name2.text = PlayerModel.instance.playerBaseAttr[ActorBaseAttrFields.name] || "暂无";
            this.uid.text = "暂无";
            this.server.text =  "暂无";
        }

        //复制玩家信息
        private copyHandler(){
           let userData:string = `服务器：暂无\n角色名：${PlayerModel.instance.playerBaseAttr[ActorBaseAttrFields.name]}\n角色ID：${PlayerModel.instance.actorId.toString()}\n玩家UID：暂无`;
           CommonUtil.clipboardCopyValue(userData);
        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            Laya.timer.clear(this, this.loopHandler);
            this.nameTxt.text = "";
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