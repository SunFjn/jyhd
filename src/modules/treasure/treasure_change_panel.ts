namespace modules.treasure {
    import CustomList = modules.common.CustomList;
    import Button = laya.ui.Button;
    import Event = laya.events.Event;
    import TreasureCfg = modules.config.TreasureCfg;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import Image = laya.ui.Image;
    import CommonUtil = modules.common.CommonUtil;

    class ButtonItem extends ItemRender {
        private static buttonLabels = ["神器兑换", "晋升兑换", "进阶兑换", "未央兑换", "洞穴兑换"];
        private btn: Button;
        private img: Image;
        public _type: number;

        protected initialize(): void {
            super.initialize();
            this.btn = new Button();
            this.btn.skin = "common/btn_tongyong_1.png";
            this.btn.stateNum = 2;
            this.btn.labelFont = "SimHei";
            this.btn.labelSize = 26;
            this.btn.labelColors = "#c9724b, #ffffff";
            this.addChild(this.btn);
            this.scale(0.8, 0.8);
            this.img = new Image("common/image_common_xhd.png");
            this.img.pos(125, 0);
            this.img.visible = false;
            this.addChild(this.img);
        }

        protected setData(value: any): void {
            super.setData(value);
            this._type = value;
            this.btn.label = ButtonItem.buttonLabels[value];
        }

        public set RedDot(value: boolean) {
            this.img.visible = value;
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.btn.selected = value;
        }
    }

    export class TreasureChangePanel extends ui.TreasureChangeViewUI {
        private _buttonList: CustomList;
        private _list: CustomList;
        private _type: number;

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._list = new CustomList();
            this._list.hCount = 2;
            this._list.itemRender = TreasureChangeItem;
            this._list.spaceX = 14;
            this._list.spaceY = 11;
            this._list.width = 687;
            this._list.height = 850;
            this._list.x = 16;
            this._list.y = 126;
            this.addChild(this._list);

            this._buttonList = new CustomList();
            this._buttonList.scrollDir = 2;
            this._buttonList.vCount = 1;
            this._buttonList.itemRender = ButtonItem;
            this._buttonList.spaceX = -23;
            this._buttonList.width = 670;
            this._buttonList.height = 100;
            this._buttonList.x = 44;
            this._buttonList.y = 1090;
            this.addChildAt(this._buttonList, 5);
            // this._buttonList.datas = TreasureCfg.instance.getExchangeType();
            this._buttonList.datas = TreasureModel.instance._xunBaoListIndex;
            this._buttonList.selectedIndex = 0;
        }

        private setRedDot(): void {
            let redDotTabel = TreasureModel.instance.getRedDot();
            let items = <Array<ButtonItem>>this._buttonList.items;
            for (let i = 0; i < items.length; i++) {
                let redDot = redDotTabel[items[i]._type];
                items[i].RedDot = redDot ? redDot : false;
            }
        }

        private selectHandler(): void {
            this._type = this._buttonList.selectedData;
            if (this._type == null) return;
            Channel.instance.publish(UserFeatureOpcode.GetXunbaoInfo, [this._type]);
            Channel.instance.publish(UserFeatureOpcode.GetXunBaoHint, null);
            this._list.datas = TreasureCfg.instance.getCfgsByType(this._type);
            this.updateCoupon();
        }

        private TipsHandler(): void {
            CommonUtil.alertHelp(20005);
        }

        private updateCoupon(): void {
            let str: string;
            switch (this._type) {
                case 0:
                    str = "神器探索积分：";
                    break;
                case 1:
                    str = "晋升探索积分：";
                    break;
                case 2:
                    str = "进阶探索积分：";
                    break;
                case 3:
                    str = "玉荣碎片：";
                    this.countImg.skin="assets/icon/item/11_s.png"
                    break;
                case 4:
                    str = "洞穴探险积分：";
                    break;
            }
            this.countImg.visible = this._type == 3;
            let coupon = TreasureModel.instance.getCoupon(this._type);
            this.count.text = str + (coupon ? coupon : 0).toString();
            let w = this.countImg.width + this.count.textWidth + 60;
            let posX = this.width - w;
            this.countImg.x = posX;
            this.count.x = this.countImg.x + this.countImg.width;
        }

        protected addListeners(): void {
            super.addListeners();
            this._buttonList.on(Event.CLICK, this, this.selectHandler);
            GlobalData.dispatcher
                .on(CommonEventType.XUNBAO_EXCHANGE_REPLY, this, this.puchaseReply)
                .on(CommonEventType.UPDATE_XUNBAOINFO, this, this.updateCoupon)
                .on(CommonEventType.XUNBAO_HINTLIST, this, this.setRedDot);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this._buttonList.off(Event.CLICK, this, this.selectHandler);
            GlobalData.dispatcher
                .off(CommonEventType.XUNBAO_EXCHANGE_REPLY, this, this.puchaseReply)
                .off(CommonEventType.UPDATE_XUNBAOINFO, this, this.updateCoupon)
                .off(CommonEventType.XUNBAO_HINTLIST, this, this.setRedDot);
        }
        public lastBtnHandler() {
            let idx = 0;// [0, 4, 3, 1, 2];
            idx = 0;
            this._buttonList.scrollToIndex(idx);
        }

        public nextBtnHandler() {
            let idx = 0;// [0, 4, 3, 1, 2];
            idx = this._buttonList.datas.length - 1
            this._buttonList.scrollToIndex(idx);
        }
        private puchaseReply() {
            let result = TreasureModel.instance.xunBaoExchangeReply;
            if (result != 0) {
                CommonUtil.noticeError(result);
            }
        }
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            if (value) {
                this._buttonList.selectedData = value;
            }
        }
        protected onOpened(): void {
            super.onOpened();
            this.selectHandler();
            CustomList.showListAnim(modules.common.showType.WIDTH, this._list);
        }
    }
}
