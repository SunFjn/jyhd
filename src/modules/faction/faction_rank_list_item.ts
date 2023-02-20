/////<reference path="../$.ts"/>
/** 仙盟排行榜item */
namespace modules.faction {
    import CommonUtil = modules.common.CommonUtil;
    import PlayerRankingItemUI = ui.PlayerRankingItemUI;
    import FactionRank = Protocols.FactionRank;
    import FactionRankFields = Protocols.FactionRankFields;

    export class FactionRankListItem extends PlayerRankingItemUI {

        constructor() {
            super();
        }
        private _tpye: number;
        private _mingci: number;
        protected initialize(): void {
            super.initialize();
            this.StatementHTML.color = "#585858";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 22;
            this.StatementHTML.style.align = "left";
            this.headBgImg.visible = false;

        }

        public setData(vlaue: Array<number>): void {
            this._tpye = vlaue[0];
            this._mingci = vlaue[1];
            if (this._mingci == 0) {
                this.rankImg.skin = `common/zs_tongyong_8.png`;
                this.rankMsz.value = ``;
            } else if (this._mingci == 1) {
                this.rankImg.skin = `common/zs_tongyong_9.png`;
                this.rankMsz.value = ``;
            } else {
                this.rankImg.skin = `common/dt_tongyong_15.png`;
                this.rankMsz.value = `${this._mingci}`;
            }
            this.vipBg.visible = false;
            let info: FactionRank = faction.FactionModel.instance.getRanksByTypeAndMingCi(this._mingci);
            if (!info) {
                this.vipBg.visible = this.headImg.visible = this.playerName.visible =
                    this.valueTxt.visible = false;
                this.noTxt.visible = true;
                let conTion = modules.rankingList.PlayerRankingModel.instance.getContison(this._tpye);
                // this.StatementHTML.innerHTML = `上榜条件:${this.getStr22(conTion)}`;
                return;
            }
            this.headImg.visible = this.playerName.visible = this.valueTxt.visible = true;
            this.StatementHTML.visible = this.noTxt.visible = false;

            this.playerName.text = info[FactionRankFields.name];
            let iconIndex: number = info[FactionRankFields.flagIndex];
            let iconName: string = config.BlendCfg.instance.getCfgById(36004)[Configuration.blendFields.stringParam][iconIndex];
            this.headImg.skin = `assets/icon/ui/faction/${iconName}.png`;
            this.headImg.width = 100;
            this.headImg.height = 100;
            let fight: string = CommonUtil.bigNumToString(info[FactionRankFields.fight]);
            this.valueTxt.text = `公会战力:${fight}`;
        }
        public getStr22(conTion: number): string {

            // return `仙盟总战力达到${conTion}`;
            //不需要显示 条件了  
            return ``;
        }
    }
}