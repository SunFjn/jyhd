/////<reference path="../$.ts"/>
/** 仙女日志item */
namespace modules.fairy {
    import FairyLogItemUI = ui.FairyLogItemUI;
    import FairyLog = Protocols.FairyLog;
    import FairyLogFields = Protocols.FairyLogFields;

    export class FairyLogItem extends FairyLogItemUI {

        protected initialize(): void {
            super.initialize();
            this.contentTxt.color = "#2d2d2d";
            this.contentTxt.style.fontFamily = "SimHei";
            this.contentTxt.style.fontSize = 24;
            this.contentTxt.style.valign = "middle";
            this.contentTxt.style.leading = 5;
        }

        public setData(value: any): void {

            if (!value) { //完成最后一条日志
                let fairyId: number = FairyModel.instance.fairyId;
                let cfg: Configuration.fairy = config.FairyCfg.instance.getCfgById(fairyId);
                let fairyName: string = cfg[Configuration.fairyFields.name];
                let fairyColor = CommonUtil.getColorByQuality(fairyId);
                let items: Configuration.Items[] = cfg[Configuration.fairyFields.items];
                let per: number = FairyModel.instance.per;
                let date = FairyModel.instance.formatDate(FairyModel.instance.endTime);
                let content: string = `您护送的<span style='color:${fairyColor}'>【${fairyName}】</span>抵达终点,获得收益:<br/>`;
                let imgStr: string = ``;
                for (let i: int = 0, len: int = items.length; i < len; i++) {
                    let itemId: number = items[i][Protocols.ItemsFields.ItemId];
                    imgStr += `<img src='${CommonUtil.getIconById(itemId, true)}' width="40" height="40"/>${items[i][Protocols.ItemsFields.count] * per * (FairyModel.instance.isDouble ? 2 : 1)}&nbsp;&nbsp;`;
                }
                this.contentTxt.innerHTML = content + imgStr;
                this.dateTxt.text = date;
                this.fitView();
                this.fgxImg.visible = false;
                return;
            }
            let logInfo: FairyLog = value as FairyLog;

            let fairyId: number = logInfo[FairyLogFields.id];
            let date = FairyModel.instance.formatDate(logInfo[FairyLogFields.time]);
            let playerName: string = logInfo[FairyLogFields.name];
            let result: number = logInfo[FairyLogFields.result];/*拦截结果 0失败，1成功*/
            let cfg: Configuration.fairy = config.FairyCfg.instance.getCfgById(fairyId);
            let fairyName: string = cfg[Configuration.fairyFields.name];
            let awardPer: number = logInfo[FairyLogFields.awardPer];
            let fairyColor: string = CommonUtil.getColorByQuality(fairyId);
            if (!result) { //失败 无损失
                this.contentTxt.innerHTML = `<span style='color:#ff3e3e'>【${playerName}】</span>对您护送的` +
                    `<span style='color:${fairyColor}'>【${fairyName}】</span>发起拦截但失败了,您无损失。`;
            } else {
                let content: string = `<span style='color:#ff3e3e'>【${playerName}】</span>对您护送的` +
                    `<span style='color:${fairyColor}'>【${fairyName}】</span>发起拦截并胜利,你被掠夺了:<br/>`;
                let items: Configuration.Items[] = cfg[Configuration.fairyFields.items];
                let imgStr: string = ``;
                for (let i: int = 0, len: int = items.length; i < len; i++) {
                    imgStr += `<img src='${CommonUtil.getIconById(items[i][Protocols.ItemsFields.ItemId])}' width="40" height="40"/>${items[i][Protocols.ItemsFields.count] * awardPer * (FairyModel.instance.isDouble ? 2 : 1)}&nbsp;&nbsp;`;
                }
                this.contentTxt.innerHTML = content + imgStr;
            }
            this.dateTxt.text = date;
            this.fitView();
            this.fgxImg.visible = true;
        }

        //底部适配
        private fitView(): void {
            this.contentTxt.style.height = this.contentTxt.contextHeight;
            this.dateBox.y = this.contentTxt.y + this.contentTxt.height;
            this.fgxImg.y = this.dateBox.y + 5;
            this.height = this.fgxImg.y + 7;
        }
    }
}
