/**姻缘 姻缘墙item */

namespace modules.marry {
    import MarryWallInfo = Protocols.MarryWallInfo;
    import MarryWallInfoFields = Protocols.MarryWallInfoFields;
    import LayaEvent = modules.common.LayaEvent;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    export class MarryCoupleItem extends ui.MarryCoupleItemUI {

        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();

        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.goBtn, LayaEvent.CLICK, this, this.sendMarry);
        }
        private sendMarry() {
            if (this._agentId == PlayerModel.instance.actorId) {
                SystemNoticeManager.instance.addNotice(`结缘失败,不可以和自己结缘！`, true);
            } else if (MarryModel.instance.getRingCount() <= 0) {
                WindowManager.instance.openByActionId(ActionOpenId.marryGift)
            } else {
                MarryCtrl.instance.CreateMarry(this._agentId);
            }
        }
        public onOpened(): void {
            super.onOpened();

        }
        private _agentId: number = 0
        protected setData(value: MarryWallInfo): void {
            super.setData(value);
            let vipLv: number = Number(value[MarryWallInfoFields.vip]);
            let vipf: number = Number(value[MarryWallInfoFields.vipf]);
            this._agentId = Number(value[MarryWallInfoFields.agentId]);
            this.numTxt.text = value[MarryWallInfoFields.cashGift].toString();
            this.nameTxt.text = value[MarryWallInfoFields.name].toString();
            this.headIcon.skin = `assets/icon/head/${CommonUtil.getHeadUrl(Number(value[MarryWallInfoFields.headImg]) + Number(value[MarryWallInfoFields.occ]))}`;
            CommonUtil.setSVIPandVIP(vipf, vipLv, this.vipBg, this.vipLvMSZ);
            this.descTxt.text = value[MarryWallInfoFields.msg].toString();



        }


        public close(): void {
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
    }
}