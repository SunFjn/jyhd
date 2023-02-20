
/**战队排行榜列表Item */
namespace modules.clan {
    import ClanListAlertItemUI = ui.ClanListAlertItemUI;
    import ClanListItemInfo = Protocols.ClanListItemInfo;
    import clanFields = Configuration.clanFields;
    import ClanCfg = modules.config.ClanCfg;
    import ClanListItemInfoFields = Protocols.ClanListItemInfoFields;

    export class ClanListAlertItem extends ClanListAlertItemUI {

        protected addListeners(): void {
            super.addListeners();

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
            this.levelTxt.text = `Lv.${value[ClanListItemInfoFields.level]}`;

            //排行（这里取得是索引，服务器没给排行字段?///?）
            this.afterthired.value = `${this.index + 1}`;
            this.rankOne.visible = this.index == 0;
            this.rankTwo.visible = this.index == 1;
            this.rankThree.visible = this.index == 2;
        }
    }
}