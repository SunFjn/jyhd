/////<reference path="../$.ts"/>
/** 宝藏协助列表 */
namespace modules.faction {
    import BaozangHelpListViewUI = ui.BaozangHelpListViewUI;
    import GetBoxInfoReply = Protocols.GetBoxInfoReply;
    import CustomList = modules.common.CustomList;
    import GetBoxInfoReplyFields = Protocols.GetBoxInfoReplyFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import FactionBox = Protocols.FactionBox;
    import FactionBoxFields = Protocols.FactionBoxFields;

    export class BaozangHelpListPanel extends BaozangHelpListViewUI {

        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 40;
            this._list.y = 185;
            this._list.width = 636;
            this._list.height = 940;
            this._list.hCount = 1;
            this._list.itemRender = BaozangItem;
            this._list.spaceY = 5;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();

            // this.addAutoListener();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAOZANG_INFO_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAOZANG_HELP_LIST_UPDATE, this, this.updateList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAOZANG_LIST_UPDATE, this, this.updateList);
        }

        public onOpened(): void {
            super.onOpened();

            FactionCtrl.instance.getBoxInfo();
            FactionCtrl.instance.getBoxList();
            FactionCtrl.instance.getAssistBoxList();

            this.updateView();
            this.updateList();
        }

        private updateView(): void {

            let info: GetBoxInfoReply = FactionModel.instance.boxInfo;
            if (!info) return;
            let maxCount: number = BlendCfg.instance.getCfgById(36020)[blendFields.intParam][0];
            this.countTxt.text = (maxCount - info[GetBoxInfoReplyFields.assistCount]).toString();
        }

        private updateList(): void {
            let tempList: Array<FactionBox> = FactionModel.instance.boxHelpList;
            if (!tempList) return;
            tempList = tempList.concat().sort(FactionModel.instance.sortByState.bind(this));
            let box: FactionBox = FactionModel.instance.tempBox;
            let myId: number = PlayerModel.instance.actorId;
            let type: BAOZANG_ITEM_TYPE = !box ? BAOZANG_ITEM_TYPE.HELP_LIST : BAOZANG_ITEM_TYPE.CANT_HELP;
            let list: Array<[FactionBox, BAOZANG_ITEM_TYPE]> = box ? [[box, BAOZANG_ITEM_TYPE.HELP_LIST]] : [];
            for (let e of tempList) {
                if (e[FactionBoxFields.agentId] == myId) {
                    continue;
                }
                list.push([e, type]);
            }
            this.noBox.visible = !(list.length > 0);
            this._list.datas = list;
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);

            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
        }
    }
}
