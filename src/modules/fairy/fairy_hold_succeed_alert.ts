/////<reference path="../$.ts"/>
/** 仙女被拦截失败通知面板 */
namespace modules.fairy {
    import FairyholdSucceedAlertUI = ui.FairyholdSucceedAlertUI;

    export class FairyHoldSucceedAlert extends FairyholdSucceedAlertUI {

        protected initialize(): void {
            super.initialize();

            this.contentTxt.color = "#2d2d2d";
            this.contentTxt.style.fontFamily = "SimHei";
            this.contentTxt.style.fontSize = 28;
            this.contentTxt.style.leading = 10;
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {

            let list: Array<Protocols.FairyLog> = FairyModel.instance.logList;
            let info: Protocols.FairyLog = list[list.length - 1];
            let per: number = info[Protocols.FairyLogFields.awardPer];
            console.log(`奖励扣除百分比${per}`);
            let playerName: string = info[Protocols.FairyLogFields.name];
            let fairyId: number = info[Protocols.FairyLogFields.id];
            let cfg: Configuration.fairy = config.FairyCfg.instance.getCfgById(fairyId);
            let fairyName: string = cfg[Configuration.fairyFields.name];
            this.contentTxt.innerHTML = `<span style='color:#ff3e3e'>【${playerName}】</span>对您护送的` +
                `<span style='color:${modules.common.CommonUtil.getColorByQuality(fairyId)}'>【${fairyName}】</span>发起拦劫并胜利,您被掠夺了:`;
            let items: Configuration.Items[] = cfg[Configuration.fairyFields.items];
            let itemId: number = items[0][Protocols.ItemsFields.ItemId];
            this.iconImg_0.skin = CommonUtil.getIconById(itemId, true);
            this.numTxt_0.text = `${items[0][Protocols.ItemsFields.count] * per * (FairyModel.instance.isDouble ? 2 : 1)}`;
            itemId = items[1][Protocols.ItemsFields.ItemId];
            this.iconImg_1.skin = CommonUtil.getIconById(itemId, true);
            this.numTxt_1.text = `${items[1][Protocols.ItemsFields.count] * per * (FairyModel.instance.isDouble ? 2 : 1)}`;
            this.timeTxt.text = FairyModel.instance.formatDate(info[Protocols.FairyLogFields.time]);
        }
    }
}