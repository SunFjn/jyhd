///<reference path="../config/lilian_rise_cfg.ts"/>
namespace modules.rankingList {
    import PlayerRankingItemUI = ui.PlayerRankingItemUI;
    import LilianRiseCfg = modules.config.LilianRiseCfg;
    import XianweiRiseCfg = modules.config.XianweiRiseCfg;
    import Rank = Protocols.Rank;
    import RankFields = Protocols.RankFields;
    import xianwei_rise = Configuration.xianwei_rise;
    import xianwei_riseFields = Configuration.xianwei_riseFields;

    export class PlayerRankingItem extends PlayerRankingItemUI {
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
            // this.StatementHTML.innerHTML = `上榜条件:<span style='color:#168a17'>${}</span>积分`;
        }

        public setData(vlaue: Array<number>): void {
            this._tpye = vlaue[0];
            this._mingci = vlaue[1];
            let rankIndex: number = this._mingci;
            if (rankIndex == 2) {
                this.rankImg.skin = `common/zs_tongyong_8.png`;
                this.rankMsz.value = ``;
            } else if (rankIndex == 3) {
                this.rankImg.skin = `common/zs_tongyong_9.png`;
                this.rankMsz.value = ``;
            } else {
                this.rankImg.skin = `common/dt_tongyong_15.png`;
                this.rankMsz.value = `${rankIndex}`;
            }
            let info: Rank = PlayerRankingModel.instance.getRanksByTypeAndMingCi(this._tpye, this._mingci);
            if (!info) {
                this.vipBg.visible = this.headBgImg.visible =
                    this.headImg.visible = this.playerName.visible =
                    this.valueTxt.visible = false;
                this.noTxt.visible = true;
                let conTion = PlayerRankingModel.instance.getContison(this._tpye);
                // this.StatementHTML.innerHTML = `上榜条件:${this.getStr22(this._tpye, conTion)}`;
                return;
            }
            // if (!info[RankFields.objId]) {
            //     this.headBgImg.visible = this.headImg.visible = this.vipBox.visible = this.playerName.visible =
            //         this.valueTxt.visible = false;
            //     this.StatementHTML.visible = this.noTxt.visible = true;
            //     return;
            // }
            this.headBgImg.visible = this.headImg.visible = this.playerName.visible =
                this.valueTxt.visible = true;
            this.StatementHTML.visible = this.noTxt.visible = false;

            let type: number = rankingList.PlayerRankingModel.instance.selectedRankType;
            if (type == (RankType.xianweiGrade) || type == (RankType.lilianGrade)) {
                this.valueTxt.text = PlayerRankingItem.getDateByType(type, info[Protocols.RankFields.param]);
            } else {
                let str: string = this.getStr(type);
                let num: number = info[RankFields.param];
                this.valueTxt.text = `${str}:${num}`;
            }
            this.playerName.text = `${info[RankFields.name]}`;
            this.headImg.skin = `assets/icon/head/${CommonUtil.getHeadUrl(info[Protocols.RankFields.headImg] + info[Protocols.RankFields.occ])}`;
            let vip: number = info[Protocols.RankFields.vip];
            CommonUtil.setSVIPandVIP(info[Protocols.RankFields.vipF], vip, this.vipBg, this.vipMsz);
            this.vipBg.visible = this.vipMsz.visible = true;
        }

        public getStr(num: number): string {
            let str: string = "";
            switch (num) {
                case RankType.fight:
                    str = "战力";
                    break;
                case RankType.level:
                    str = "等级";
                    break;
                case RankType.petFight:
                    str = "宠物战力";
                    break;
                case RankType.rideFight:
                    str = "精灵战力";
                    break;
                case RankType.shenbingFight:
                    str = "幻武战力";
                    break;
                case RankType.wingFight:
                    str = "翅膀战力";
                    break;
                case RankType.magicWeaponFight:
                    str = "圣物战力";
                    break;
                case RankType.lilianGrade:
                    str = "";
                    break;
                case RankType.xianweiGrade:
                    str = "";
                    break;
                case RankType.equipFight:
                    str = "装备战力";
                    break;
            }
            return str;
        }
        public getStr22(num: number, conTion: number): string {
            let str: string = "";
            // switch (num) {
            //     case RankType.fight:
            //         str = `玩家总战力达到${conTion}`;
            //         break;
            //     case RankType.level:
            //         str = `玩家等级达到${conTion}级`;
            //         break;
            //     case RankType.petFight:
            //         str = `宠物总战力达到${conTion}`;
            //         break;
            //     case RankType.rideFight:
            //         str = `精灵总战力达到${conTion}`;
            //         break;
            //     case RankType.shenbingFight:
            //         str = `幻武总战力达到${conTion}`;
            //         break;
            //     case RankType.wingFight:
            //         str = `翅膀总战力达到${conTion}`;
            //         break;
            //     case RankType.magicWeaponFight:
            //         str = `圣物总战力达到${conTion}`;
            //         break;
            //     case RankType.lilianGrade:
            //         let shuju = modules.config.LilianRiseCfg.instance.getLilianNameByRiseLevel(conTion);
            //         str = `	活跃值达到${shuju}`;
            //         break;
            //     case RankType.xianweiGrade:
            //         let maxNum = XianweiRiseCfg.instance.maxLv;
            //         if (conTion == maxNum) {
            //             str = `成就达到至尊`;
            //         } else {
            //             let cfg: xianwei_rise = XianweiRiseCfg.instance.getXianweiRiseByLevel(conTion);
            //             let name: string = cfg[xianwei_riseFields.name];
            //             str = `成就达到${name}`;
            //         }
            //         break;
            //     case RankType.equipFight:
            //         str = `装备总战力达到${conTion}`;
            //         break;
            //     case RankType.faction:
            //         str = `仙盟总战力达到${conTion}`;
            //         break;
            // }
            return str;
        }
        //根据排行榜类型获取数据
        public static getDateByType(type: number, pram: number): string {
            let str: string = "";
            if (type == (RankType.lilianGrade)) {
                let lilianrise: Configuration.lilian_rise = LilianRiseCfg.instance.getLilianRiseCfgByRiseLevel(pram);
                if (lilianrise[Configuration.lilian_riseFields.name] == '0') {
                    str += "无";
                } else {
                    str += lilianrise[Configuration.lilian_riseFields.name];
                }
            }
            if (type == (RankType.xianweiGrade)) {
                if (pram == 0) {
                    str += "无";
                } else {
                    let xianwei: Configuration.xianwei_rise = XianweiRiseCfg.instance.getXianweiRiseByLevel(pram);
                    str += xianwei[Configuration.xianwei_riseFields.name];
                }
            }
            if (type == (RankType.level)) {
                str += pram.toString();
            }
            return str;
        }
    }
}
