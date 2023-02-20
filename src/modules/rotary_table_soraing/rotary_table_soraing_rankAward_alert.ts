///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/duobao_rank_cfg.ts"/>
namespace modules.rotary_table_soraing {
    import DuobaoRankCfg = modules.config.DuobaoRankCfg;
    import duobao_rankFields = Configuration.duobao_rankFields;
    import Event = laya.events.Event;
    import CustomClip = modules.common.CustomClip;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;
    import DuobaoRankInfo = Protocols.DuobaoRankInfo;
    import DuobaoRankInfoFields = Protocols.DuobaoRankInfoFields;
    export class RotaryTableSoaringRankAwardAlert extends ui.RotaryTableSoaringRankAwardAlertUI {
        private _list: CustomList;
        private _showIds: Array<any>;
        /**按钮流光特效 */
        private _tenBtnBtnClip: CustomClip;
        /**按钮流光特效 */
        private _oneBtnBtnClip: CustomClip;
        private _btnGroup: BtnGroup;
        private _allMingCiArr: Array<number>;
        private _allMingCiArr2: Array<number>;
        public destroy(): void {
            if (this._tenBtnBtnClip) {
                this._tenBtnBtnClip.removeSelf();
                this._tenBtnBtnClip.destroy();
                this._tenBtnBtnClip = null;
            }
            if (this._oneBtnBtnClip) {
                this._oneBtnBtnClip.removeSelf();
                this._oneBtnBtnClip.destroy();
                this._oneBtnBtnClip = null;
            }
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }
        protected initialize(): void {
            super.initialize();
            this._showIds = new Array<any>();
            this._list = new CustomList();
            this._list.width = 589;
            this._list.height = 481;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.spaceY = 6;
            this._list.itemRender = RotaryTableSoaringRankAwardItem;
            this._list.x = 36;
            this._list.y = 172;
            this.addChild(this._list);
            this._allMingCiArr = new Array<number>();
            for (var index = 1; index <= 30; index++) {
                this._allMingCiArr.push(index);
            }
            this._allMingCiArr2 = new Array<number>();
            for (var index = 1; index <= 10; index++) {
                this._allMingCiArr2.push(index);
            }
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.rankBtn, this.gradeBtn);
            this.StatementHTML.color = "#b15315";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 22;
            this.StatementHTML.style.align = "center";
        }
        public onOpened(): void {
            super.onOpened();
            RotaryTableSoaringModel.instance._nowIndex = 0;
            this._btnGroup.selectedIndex = 0;
            this.titleTxt.text = "夺宝排名";
        }
        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }
        protected addListeners(): void {
            super.addListeners();
            this._btnGroup.on(Event.CHANGE, this, this.changeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_SOARING_MYLIST, this, this.showScore);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_SOARING_QULIST, this, this.showScore);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_SOARING_BROADCAST_LIST, this, this.showScore);
        }
        protected removeListeners(): void {
            super.removeListeners();
            this._btnGroup.off(Event.CHANGE, this, this.changeHandler);
        }
        private changeHandler(): void {
            if (this._btnGroup.selectedIndex === 0) {
                RotaryTableSoaringModel.instance._nowIndex = this._btnGroup.selectedIndex;
                this.showUI();
            } else if (this._btnGroup.selectedIndex === 1) {
                RotaryTableSoaringModel.instance._nowIndex = this._btnGroup.selectedIndex;
                this.showUI();
            }
        }
        public showUI() {
            if (this._btnGroup.selectedIndex === 0) {
                this.TipText.visible = true;
                this.StatementHTML.visible = false;
                this.TipText.pos(47, 759);
                this.StatementHTML.pos(47, 744);
                if (this._allMingCiArr) {
                    this._list.datas = this._allMingCiArr;
                }
                RotaryTableSoaringCtrl.instance.getDuobaoRankCharInfo(0);
            } else if (this._btnGroup.selectedIndex === 1) {
                this.TipText.visible = true;
                this.StatementHTML.visible = true;
                this.TipText.pos(47, 774);
                this.StatementHTML.pos(47, 744);
                if (this._allMingCiArr2) {
                    this._list.datas = this._allMingCiArr2;
                }
                RotaryTableSoaringCtrl.instance.getDuobaoRankCharInfo(1);
                RotaryTableSoaringCtrl.instance.GetDuobaoServerBroadcast();//获取全服记录数据
            }
            RotaryTableSoaringCtrl.instance.GetDuobaoInfo();
            this.showScore();
        }
        public showScore() {
            if (this._btnGroup.selectedIndex === 0) {
                this.showMySocre();
            } else if (this._btnGroup.selectedIndex === 1) {
                this.showQuSocre();
            }
        }
        public showMySocre() {
            let actorId = modules.player.PlayerModel.instance.actorId;
            let InfoDate: DuobaoRankInfo = RotaryTableSoaringModel.instance._myNodeListByObjId[actorId];
            if (InfoDate) {
                let rank = InfoDate[DuobaoRankInfoFields.rank];
                let param = InfoDate[DuobaoRankInfoFields.param];
                this.myRankNumText.text = `我的排名:${rank}`;
                this.myIntegralText.text = `我的积分:${param}`;
            } else {
                let shuju = DuobaoRankCfg.instance.getLaet(0, RotaryTableSoaringModel.instance.param);
                let condition = shuju[duobao_rankFields.condition];
                this.myRankNumText.text = `我的排名:未上榜`;
                this.myIntegralText.text = `我的积分:${RotaryTableSoaringModel.instance.score}积分`;
            }
        }
        public showQuSocre() {
            let serverPgId = modules.player.PlayerModel.instance.serverPgId;
            let shuju = DuobaoRankCfg.instance.getLaet(1, RotaryTableSoaringModel.instance.param);
            let condition = shuju[duobao_rankFields.condition];
            let conditionChar = shuju[duobao_rankFields.conditionChar];
            let InfoDate: DuobaoRankInfo = RotaryTableSoaringModel.instance._quNodeListByObjId[serverPgId];
            if (InfoDate) {
                let rank = InfoDate[DuobaoRankInfoFields.rank];
                let param = InfoDate[DuobaoRankInfoFields.param];
                this.myRankNumText.text = `区服排名:${rank}`;
                this.myIntegralText.text = `本区积分:${param}`;
            } else {
                this.myRankNumText.text = `区服排名:未上榜`;
                this.myIntegralText.text = `本区积分:${RotaryTableSoaringModel.instance._totalScore}积分`;
            }
            this.StatementHTML.innerHTML = `个人积分达到<span style='color:#b15315'>${conditionChar}</span>可领取区服排行奖励`;
        }
    }
}