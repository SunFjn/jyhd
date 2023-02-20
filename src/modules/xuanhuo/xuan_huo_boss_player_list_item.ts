/**单人boss单元项*/
namespace modules.xuanhuo {
    import Layer = ui.Layer;
    import PlayerModel = modules.player.PlayerModel;
    import UpdateNameReply = Protocols.UpdateNameReply;
    import RenameModel = modules.rename.RenameModel;
    import UpdateNameReplyFields = Protocols.UpdateNameReplyFields;
    export class XuanhuoBossPlayerListItemItem extends ui.XuanhuoRBPlayerItemUI {
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
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.Xuanhuo_SCORE_UPDATE, this, this.updateName);
        }
        protected setSelected(value: boolean): void {
            if (this._playerId == PlayerModel.instance.actorId) {
                return;
            } else {
                // if (CommonUtil.isTongXianMeng(this._playerId)) {
                //     modules.notice.SystemNoticeManager.instance.addNotice("不可攻击同一仙盟玩家", true);
                //     return;
                // } else
                if (CommonUtil.isSameTeam(this._playerId)) {
                    modules.notice.SystemNoticeManager.instance.addNotice("不可攻击同一战队玩家", true);
                }
            }
            super.setSelected(value);
            this.selectShow();
        }
        private selectShow(): void {
            if (this.selected) {
                this.isSelect.visible = true;
                if (this._playerId) {
                    XuanHuoModel.instance.setSelectTarget(this._playerId, false);
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

            this.visible = true;
            this._infos = value as [number, string, number];
            // this._playerId = value[0] as number;
            this._playerId = this._infos[0];
            // this._magicPart = 0;
            // this.selectShow();

            if (PlayerModel.instance.selectTargetId == this._playerId) {
                this.isSelect.visible = true;
            } else {
                this.isSelect.visible = false;
            }
            this.updateName();
        }

        // 更新名字
        private updateName(): void {
            if (!this._infos) return;
            this.gradeTxt.text = XuanHuoModel.instance.getHumanNum(this._playerId) + ""
            this.nameTxt.color = '#ffffff';
            // if (this._infos[2] == 0) {
            //     this.nameTxt.color = '#ffffff';
            // } else if (this._infos[2] == 1) {
            //     this.nameTxt.color = '#ffffff';
            // } else if (this._infos[2] == 2) {
            //     this.nameTxt.color = '#e6372e';
            // } else {
            //     this.nameTxt.color = '#e6372e';
            // }
            this.nameTxt.text = this._infos[1];
            let nameInfo: UpdateNameReply = RenameModel.instance.updateNameReply;
            if (nameInfo && nameInfo[UpdateNameReplyFields.roleID] === this._infos[0]) {
                this.nameTxt.text = nameInfo[UpdateNameReplyFields.name];
            }
        }
    }
}