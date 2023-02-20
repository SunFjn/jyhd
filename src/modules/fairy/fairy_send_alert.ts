/////<reference path="../$$.ts"/>
/** 护送拦截面板 */
namespace modules.fairy {
    import BlendCfg = modules.config.BlendCfg;
    import FairyEscore = Protocols.FairyEscore;
    import FairyEscoreFields = Protocols.FairyEscoreFields;
    import CommonUtil = modules.common.CommonUtil;
    import ActorBaseAttrFields = Protocols.ActorBaseAttrFields;
    import LayaEvent = modules.common.LayaEvent;

    export class FairySendAlert extends ui.FairySendAlertUI {

        private _remainTime: number;
        private _playerId: number;
        private _maxLootTime: number;
        private _info: any;

        protected initialize(): void {
            super.initialize();

            this._remainTime = 0;

            this.contentTxt.color = "#2d2d2d";
            this.contentTxt.style.fontFamily = "SimHei";
            this.contentTxt.style.fontSize = 24;
            this.contentTxt.style.wordWrap = false;
            this.contentTxt.mouseEnabled = false;
            this.contentTxt.mouseThrough = true;

            this.notHintTxt.color = "#2d2d2d";
            this.notHintTxt.style.fontFamily = "SimHei";
            this.notHintTxt.style.fontSize = 24;
            this.notHintTxt.style.wordWrap = false;
            this.notHintTxt.mouseEnabled = false;
            this.notHintTxt.mouseThrough = true;

            this._maxLootTime = BlendCfg.instance.getCfgById(31007)[Configuration.blendFields.intParam][0];
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.goBtn, LayaEvent.CLICK, this, this.goBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CURR_LOOK_PLAYER_UPDATE, this, this.updateOtherInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FAIRY_UPDATE, this, this.updateView);
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.loopHandler);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

            this._info = value;
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {
            this.contentTxt.visible = true;
            this.loopHandler();

            if (!this._info) { //自己护送的仙女
                this.updateMine();
            } else {
                this.updateOthers();
                FairyCtrl.instance.getFairyPanelInfo([PlayerModel.instance.actorId, PlayerModel.instance.serverPgId, this._playerId]);
            }
        }

        private updateOtherInfo(): void {
            let playerId: number = FairyModel.instance.currLookPlayerInfo[Protocols.UpdateOtherFairyInfoFields.targetId];
            let lootTime: number = FairyModel.instance.currLookPlayerInfo[Protocols.UpdateOtherFairyInfoFields.looting];
            if (this._playerId == playerId) {
                this.BlcokedTimeTxt.text = `${lootTime}/${this._maxLootTime}`;
                this.BlcokedTimeTxt.color = lootTime >= this._maxLootTime ? `#ff3e3d` : `#168a17`;
            }
        }

        private updateMine(): void {
            this._playerId = 0;
            let playerName: string = PlayerModel.instance.playerBaseAttr[ActorBaseAttrFields.name];
            let playerLv: number = PlayerModel.instance.level;
            let fairyId: number = FairyModel.instance.fairyId;
            let cfg: Configuration.fairy = config.FairyCfg.instance.getCfgById(fairyId);
            let fairyName: string = cfg[Configuration.fairyFields.name];
            this.sendObjTxt.text = `${fairyName}`;
            this.sendObjTxt.color = CommonUtil.getColorByQuality(fairyId);
            let per: number = FairyModel.instance.per;
            this.BlcokedTimeTxt.text = `${FairyModel.instance.looting}/${this._maxLootTime}`;
            this.BlcokedTimeTxt.color = FairyModel.instance.looting >= this._maxLootTime ? `#ff3e3d` : `#168a17`;
            this._remainTime = FairyModel.instance.endTime;
            this.remainTimeTxt.text = `${CommonUtil.timeStampToMMSS(this._remainTime)}`;
            this.remainTimeTxt.color = `#3a5385`;
            this.nameAndLvTxt.text = `${playerName} Lv.${playerLv}`;
            this.showTxt(cfg, per, FairyModel.instance.isDouble);
            this.yieldHintTxt.text = `这是你所护送的神女`;
            this.cantHold();
        }

        private updateOthers(): void {
            //对应数据下标来取数据
            let info: FairyEscore = this._info;
            this._playerId = info[FairyEscoreFields.agentId];
            let playerName: string = info[FairyEscoreFields.name];
            let playerLv: number = info[FairyEscoreFields.level];
            let fairyId: number = info[FairyEscoreFields.id];
            let cfg: Configuration.fairy = config.FairyCfg.instance.getCfgById(fairyId);
            this.BlcokedTimeTxt.text = `${info[FairyEscoreFields.looting]}/${this._maxLootTime}`;
            this.BlcokedTimeTxt.color = info[FairyEscoreFields.looting] >= this._maxLootTime ? `#ff3e3d` : `#168a17`;
            this._remainTime = info[FairyEscoreFields.time];
            this.nameAndLvTxt.text = `${playerName} Lv.${playerLv}`;
            let fairyName: string = cfg[Configuration.fairyFields.name];
            this.sendObjTxt.text = `${fairyName}`;
            this.sendObjTxt.color = CommonUtil.getColorByQuality(fairyId);
            if (this._remainTime - GlobalData.serverTime > 0) {
                this.remainTimeTxt.text = `${CommonUtil.timeStampToMMSS(this._remainTime)}`;
                this.remainTimeTxt.color = `#3a5385`;
            } else {
                this.remainTimeTxt.color = `#168a17`;
            }
            this.initElementPos();
            if (FairyModel.instance.intercept >= config.BlendCfg.instance.getCfgById(31006)[Configuration.blendFields.intParam][0]) {
                this.yieldHintTxt.text = `您的拦截次数不足`;
                this.cantHold();
            } else if (info[FairyEscoreFields.looting] >= config.BlendCfg.instance.getCfgById(31007)[Configuration.blendFields.intParam][0]) {
                this.yieldHintTxt.text = `对方被拦截次数已满,当前为保护状态`;
                this.cantHold();
            } else {
                //文档要求 双方的等级差=拦截方等级 - 被拦截方等级
                let per: number = this.calcPer(info[FairyEscoreFields.level]);
                let isDouble: boolean = info[FairyEscoreFields.isDouble];
                this.showTxt(cfg, per, isDouble);
                this.yieldHintTxt.text = `目标等级越低,拦截收益越少`;
                this.notHintTxt.innerHTML = `是否拦截<span style='color:#ff3e3e'>【${playerName}】</span>的<span style='color:${CommonUtil.getColorByQuality(fairyId)}'>${config.FairyCfg.instance.getCfgById(fairyId)[Configuration.fairyFields.name]}</span>?`;
            }
        }

        private initElementPos(): void {
            for (let i: int = 0, len: int = this._childs.length; i < len; i++) {
                this._childs[i].visible = true;
            }
            this.fgxImg_0.y = 340;
            this.fgxImg_1.y = 440;
            this.yieldHintTxt.y = 350;
            this.hintTxt.y = 625;
            this.bgImg.height = this.height = 575;
            this.frameBgImg.height = 280;
            this.yieldHintTxt.color = `#3a5385`;
        }

        //不能拦截
        private cantHold(): void {
            this.fgxImg_0.y = 285;
            this.yieldHintTxt.y = 300;
            this.frameBgImg.height = 230;
            this.fgxImg_1.visible = this.goBtn.visible = this.contentTxt.visible = this.notHintTxt.visible = false;
            this.bgImg.height = this.height = 380;
            this.hintTxt.y = 430;
            this.yieldHintTxt.color = `#ff3e3e`;
        }

        private calcPer(targetLv: number): number {
            let lvDiff: number = PlayerModel.instance.level - targetLv;
            let lvDiffList: number[] = config.BlendCfg.instance.getCfgById(31014)[Configuration.blendFields.intParam];
            let per: number = 0;
            for (let i: int = 0, len: int = lvDiffList.length; i < len; i++) {
                if (!(i % 2)) {  //范围键值
                    let key: number = lvDiffList[i];
                    if (lvDiff >= key) { //大于等于当前key
                        let nextkey: number = lvDiffList[i + 2];
                        if (nextkey != null) { //如果有下一级配置
                            if (lvDiff < nextkey) {
                                per = lvDiffList[i + 1];
                                return per;
                            } else {

                            }
                        } else if (nextkey == null) { //没有下一级配置
                            per = lvDiffList[i + 1];
                            return per;
                        }
                    }
                }
            }
        }

        private showTxt(cfg: Configuration.fairy, per: number, isDouble: boolean): void {
            let imgStr: string = ``;
            let items: Configuration.Items[] = cfg[Configuration.fairyFields.items];
            for (let i: int = 0, len: int = items.length; i < len; i++) {
                let itemId: number = items[i][Protocols.ItemsFields.ItemId];
                imgStr += `<img src='${CommonUtil.getIconById(itemId, true)}' width="40" height="40"/>${items[i][Protocols.ItemsFields.count] * per * (isDouble ? 2 : 1)}&nbsp;&nbsp;`;
            }
            let typeStr: string = this._info ? `拦劫` : `护送`;
            this.contentTxt.innerHTML = `${typeStr}获得:${imgStr}`;
        }

        private loopHandler(): void {
            if (this._remainTime - GlobalData.serverTime <= 0) {
                this.remainTimeTxt.text = `已送达`;
                this.remainTimeTxt.color = `#168a17`;
                return;
            } else {
                this.remainTimeTxt.text = `${CommonUtil.timeStampToMMSS(this._remainTime)}`;
                this.remainTimeTxt.color = `#3a5385`;
            }
        }

        private goBtnHandler(): void {
            FairyCtrl.instance.interceptFairy([this._playerId]);
            this.close();
        }

        public close(): void {
            super.close();
            FairyCtrl.instance.delFairyPanelInfoRecord([PlayerModel.instance.actorId, this._playerId]);
        }
    }
}
