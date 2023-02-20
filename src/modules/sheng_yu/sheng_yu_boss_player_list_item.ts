/**单人boss单元项*/
namespace modules.sheng_yu {
    import Layer = ui.Layer;
    import PlayerModel = modules.player.PlayerModel;
    import UpdateNameReply = Protocols.UpdateNameReply;
    import RenameModel = modules.rename.RenameModel;
    import UpdateNameReplyFields = Protocols.UpdateNameReplyFields;
    export class ShengYuBossPlayerListItemItem extends ui.PlayerListItemUI {
        constructor() {
            super();
        }
        private _playerId: number;
        // private _magicPart: number;
        private _infos: [number, string, number];
        protected initialize(): void {
            super.initialize();
            this.layer = Layer.BOTTOM_LAYER;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_NAME_UPDATE, this, this.updateName);
        }
        protected setSelected(value: boolean): void {
            if (this._playerId == PlayerModel.instance.actorId) {
                return;
            } else {
                if (CommonUtil.isTongXianMeng(this._playerId)) {
                    modules.notice.SystemNoticeManager.instance.addNotice("不可攻击同一公会玩家", true);
                    return;
                }
            }
            super.setSelected(value);
            this.selectShow();
        }
        private selectShow(): void {
            if (this.selected) {
                this.isSelect.visible = true;
                if (this._playerId) {
                    ShengYuBossModel.instance.setSelectTarget(this._playerId, false);
                }
            } else {
                this.isSelect.visible = false;
            }
        }
        protected setData(value: any): void {
            super.setData(value);
            if (!value) {
                this.visible = false;
                return;
            }
            this.isOwnTxt.visible = false;
            this.visible = true;
            this._infos = value as [number, string, number];
            // this._playerId = value[0] as number;
            this._playerId = this._infos[0];
            // this._magicPart = 0;
            // this.selectShow();
            if (this.selected) {
                this.isSelect.visible = true;
            } else {
                this.isSelect.visible = false;
            }
            this.updateName();
        }

        // 更新名字
        private updateName(): void {
            if (!this._infos) return;
            if (this._infos[2] == 0) {
                this.playerName.color = '#ffffff';
                this.isOwnTxt.visible = false;
            } else if (this._infos[2] == 1) {
                this.playerName.color = '#ffffff';
                this.isOwnTxt.visible = true;
            } else if (this._infos[2] == 2) {
                this.playerName.color = '#e6372e';
                this.isOwnTxt.visible = false;
            } else {
                this.playerName.color = '#e6372e';
                this.isOwnTxt.visible = true;
            }
            this.playerName.text = this._infos[1];
            let nameInfo: UpdateNameReply = RenameModel.instance.updateNameReply;
            if (nameInfo && nameInfo[UpdateNameReplyFields.roleID] === this._infos[0]) {
                this.playerName.text = nameInfo[UpdateNameReplyFields.name];
            }
        }
    }
}