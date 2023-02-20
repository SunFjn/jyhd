
/**战队列表Item */
namespace modules.clan {
    import ClanListItemUI = ui.ClanListItemUI;
    import ClanActorBaseAttrFields = Protocols.ClanActorBaseAttrFields;
    import ClanActorBaseAttr = Protocols.ClanActorBaseAttr;
    import ClanListItemInfo = Protocols.ClanListItemInfo;
    import ClanListItemInfoFields = Protocols.ClanListItemInfoFields;
    import ClanCfg = modules.config.ClanCfg;
    import clanFields = Configuration.clanFields;

    export class ClanListItem extends ClanListItemUI {
        private isApplyStatus: boolean = true;

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.applyBtn, common.LayaEvent.CLICK, this, this.applyBtnHandler, [1]);
        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: ClanListItemInfo): void {
            super.setData(value);
            let level: number = value[ClanListItemInfoFields.level];
            let maxNum = ClanCfg.instance.getCfgByLv(level)[clanFields.memerLimit];
            let server: string = value[ClanListItemInfoFields.leaderName].split(".")[0];
            this.nameTxt.text = `[${server}]${value[ClanListItemInfoFields.name]}`;
            this.numTxt.text = `人数：${value[ClanListItemInfoFields.memberNum]}/${maxNum}`;
            this.leaderTxt.text = `队长：${value[ClanListItemInfoFields.leaderName]}`;
            this.levelTxt.text = `Lv.${level}`;

            //战力显示和申请按钮限制
            let myFight = PlayerModel.instance.fight;
            let limit = (value[ClanListItemInfoFields.fightLimit]);
            let fight: string = CommonUtil.bigNumToString(limit);
            this.limitText.text = ` 战力限制:${fight}`;
            this.applyBtn.visible = (myFight >= limit);
            this.limitText.visible = (myFight < limit);

            let isApplied = ClanModel.instance.getIsAppliedClan(value[ClanListItemInfoFields.uuid]);
            if (isApplied) {
                this.applyBtn.label = "取消";
                this.isApplyStatus = false;
            } else {
                this.applyBtn.label = "申请";
                this.isApplyStatus = true;
            }

            //排行（这里取得是索引，服务器没给排行字段）
            this.afterthired.value = `${this.index + 1}`;
            this.rankOne.visible = this.index == 0;
            this.rankTwo.visible = this.index == 1;
            this.rankThree.visible = this.index == 2;
        }


        //申请/取消申请加入战队
        private applyBtnHandler(): void {
            let uuid: string = this._data[ClanListItemInfoFields.uuid];
            /*0-加入 1-取消加入*/
            let opt: number = this.isApplyStatus == true ? 0 : 1;
            ClanCtrl.instance.applyJoinClan([uuid, opt]);
        }
    }
}