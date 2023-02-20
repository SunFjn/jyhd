/** 竞技场排行榜单元项*/


namespace modules.arena {
    import ArenaRank = Protocols.ArenaRank;
    import ArenaRankItemUI = ui.ArenaRankItemUI;
    import ArenaRankFields = Protocols.ArenaRankFields;
    import ItemsFields = Protocols.ItemsFields;
    import arenaFields = Configuration.arenaFields;

    export class ArenaRankItem extends ArenaRankItemUI {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: any): void {
            super.setData(value);
            let rank: ArenaRank = value;
            let rankNum: number;
            if (!rank) {
                rankNum = this.index + 1;
                this.nameTxt.x = -10;
            } else {
                this.nameTxt.text = rank[ArenaRankFields.name];
                rankNum = rank[ArenaRankFields.rank];
                this.nameTxt.x = 152;
            }
            if (rankNum === 1) {
                this.rankImg.skin = "common/zs_tongyong_7.png";
            } else if (rankNum === 2) {
                this.rankImg.skin = "common/zs_tongyong_8.png";
            } else if (rankNum === 3) {
                this.rankImg.skin = "common/zs_tongyong_9.png";
            } else {
                this.rankImg.skin = "";
                let name: string;
                if (rankNum == 4) {
                    name = `第4~10名`;
                } else if (rankNum == 5) {
                    rankNum = 11;
                    name = `第11~50名`;
                } else if  (rankNum == 6){
                    rankNum = 51;
                    name = `第51~100名`;
                }
                else if  (rankNum == 7){
                    rankNum = 101;
                    name = `第101~200名`;
                }else if  (rankNum == 8){
                    rankNum = 201;
                    name = `第201~500名`;
                }
                else if  (rankNum == 9){
                    rankNum = 501;
                    name = `第501~1000名`;
                }
                else if  (rankNum == 10){
                    rankNum = 1001;
                    name = `第1001~1500名`;
                }
                else if  (rankNum == 11){
                    rankNum = 1501;
                    name = `第1501~2000名`;
                }
                else if  (rankNum == 12){
                    rankNum = 2001;
                    name = `第2001~5000名`;
                }
                else if  (rankNum == 13){
                    rankNum = 5001;
                    name = `第5001~10000名`;
                }
                this.nameTxt.text = name;
            }
            this.awardTxt1.text = `${ArenaCfg.instance.getCfgByRank(rankNum)[arenaFields.dailyItems][0][ItemsFields.count]}`;
            this.awardTxt2.text = `${ArenaCfg.instance.getCfgByRank(rankNum)[arenaFields.dailyItems][1][ItemsFields.count]}`;
            this.iconImg1.skin = "assets/icon/item/23_s.png";
            this.iconImg1.x = this.awardTxt1.x-40;//405 + (144 - this.awardTxt1.textWidth) * 0.5 - 40;
            // console.log("*****************************this.iconImg1.x = " + this.iconImg1.x);
            this.iconImg2.skin = "assets/icon/item/3_s.png";
            this.iconImg2.x = this.iconImg1.x;
        }
    }
}