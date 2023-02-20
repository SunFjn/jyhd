/** 争夺战副本结算弹窗 */

///<reference path="../common/custom_list.ts"/>

namespace modules.zhulu {
    import ZhuluCopyFinishAlert2UI = ui.ZhuluCopyFinishAlert2UI;
    import CustomList = modules.common.CustomList;
    import xuanhuoRankAward = Configuration.xuanhuoRankAward;
    import updateXuanhuoNumFields = Protocols.updateXuanhuoNumFields;
    import ClanModel = modules.clan.ClanModel
    import updateXuanhuoNum = Protocols.updateXuanhuoNum;
    import XuanhuoCopyJudgeAwardFields = Protocols.XuanhuoCopyJudgeAwardFields;
    import XuanhuoCopyJudgeAward = Protocols.XuanhuoCopyJudgeAward;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import BagItem = modules.bag.BagItem;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;

    import TeamBattleCopyFinishReply = Protocols.TeamBattleCopyFinishReply;
    import TeamBattleCopyFinishReplyFields = Protocols.TeamBattleCopyFinishReplyFields;

    import TeamBattleRank = Protocols.TeamBattleRank;
    import TeamBattleRankFields = Protocols.TeamBattleRankFields;

    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;


    export class ZhuluCopyFinishAlert2 extends ZhuluCopyFinishAlert2UI {
        private _exitTime: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, common.LayaEvent.CLICK, this, this.close);
        }

        onOpened(): void {
            super.onOpened();
            this._exitTime = 11;
            Laya.timer.loop(1000, this, this.loopHandler);
            this.loopHandler();
            this.updateUI();
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.loopHandler);
            DungeonCtrl.instance.reqEnterScene(0);
        }

        private loopHandler(): void {
            this._exitTime--;
            this.okBtn.label = `确定(${this._exitTime})`;

            if (this._exitTime == 0) {
                this.close();
            }
        }



        private updateUI() {
            this.hurtTxt.text = `累计伤害:0`
            this.scoreTxt.text = `获得积分:0`
            let value: number = ZhuLuModel.instance.hurt;
            if (value == null) return;
            let str: string = CommonUtil.bigNumToString(value);
            this.hurtTxt.text = `累计伤害:${str}`;
            let score = BlendCfg.instance.getCfgById(73003)[blendFields.intParam][0];
            this.scoreTxt.text = `获得积分:${Math.ceil(value / score)}`;
        }


    }
}