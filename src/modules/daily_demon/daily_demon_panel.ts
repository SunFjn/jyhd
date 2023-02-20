///<reference path="../config/daily_demon_cfg.ts"/>


//每日降妖面板
namespace modules.dailyDemon {
    import Event = laya.events.Event;
    import CustomClip = modules.common.CustomClip;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import BaseItem = modules.bag.BaseItem;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import Text = Laya.Text;
    import MissionModel = modules.mission.MissionModel;
    import xiangyao = Configuration.xiangyao;
    import DailyDemonCfg = modules.config.DailyDemonCfg;
    import xiangyaoFields = Configuration.xiangyaoFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import CommonUtil = modules.common.CommonUtil;
    import LayaEvent = modules.common.LayaEvent;

    export class DailyDemonPanel extends ui.DailyDemonViewUI {

        private _btnClip: CustomClip;
        private _btnBossClip: CustomClip;
        private _widthSpace: number;
        private _commonAwardItems: Array<BaseItem>;
        private _bossAwardItems: Array<BaseItem>;
        private _commonBar: ProgressBarCtrl;
        private _bossBar: ProgressBarCtrl;
        private _fitTxtArr: Array<Text>;
        private _maxKillNum: number[];
        private _maxKillNumValue: number[];
        private _maxBossKillNum: number[];
        private _maxBossKillNumValue: number[];
        private _tipsArr: Array<Text>;
        private _tipsBossArr: Array<Text>;
        private _killNumTxtArr: Array<Text>;
        private _killBossNumTxtArr: Array<Text>;
        private tempPoint:any;
        private _skeleton:Laya.Skeleton;

        public destroy(destroyChild: boolean = true): void {
            this._btnClip = this.destroyElement(this._btnClip);
            this._btnBossClip = this.destroyElement(this._btnBossClip);
            this._commonAwardItems = this.destroyElement(this._commonAwardItems);
            this._bossAwardItems = this.destroyElement(this._bossAwardItems);
            this._commonBar = this.destroyElement(this._commonBar);
            this._bossBar = this.destroyElement(this._bossBar);
            this._fitTxtArr = this.destroyElement(this._fitTxtArr);
            this._tipsArr = this.destroyElement(this._tipsArr);
            this._tipsBossArr = this.destroyElement(this._tipsBossArr);
            this._killNumTxtArr = this.destroyElement(this._killNumTxtArr);
            this._killBossNumTxtArr = this.destroyElement(this._killBossNumTxtArr);
            this._skeleton = this.destroyElement(this._skeleton);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

            this._widthSpace = 35;

            this._commonAwardItems = new Array<BaseItem>();
            this._bossAwardItems = new Array<BaseItem>();
            this.addChild(this.tempPoint);
            for (let i: int = 0; i < 5; i++) {
                let item = new BaseItem();
                item.nameVisible = true;
                item.y = 365;
                this._commonAwardItems.push(item);
                this.addChild(item);

                item = new BaseItem();
                item.nameVisible = true;
                item.y = 840;
                this._bossAwardItems.push(item);
                this.addChild(item);
            }
            this._commonBar = new ProgressBarCtrl(this.progressImg, this.progressImg.width, this.progressTxt);
            this._bossBar = new ProgressBarCtrl(this.bossProgressImg, this.bossProgressImg.width, this.bossProgressTxt);

            this._fitTxtArr = [this.decTxt_0, this.decTxt_1, this.killNumberTxt, this.decTxt_2];
            this._tipsArr = [this.getDecTxt0, this.levelTxt, this.getDecTxt1, this.getDecTxt2, this.getDecTxt3];
            this._tipsBossArr = [this.getBossDecTxt0, this.bossLevelTxt, this.getBossDecTxt1, this.getBossDecTxt2, this.getBossDecTxt3];
            this._killNumTxtArr = [this.getDecTxt, this.getTimesTxt];
            this._killBossNumTxtArr = [this.getBossDecTxt, this.getBossTimesTxt];

            this._maxKillNum = [];
            this._maxKillNumValue = [];
            let param: number[] = BlendCfg.instance.getCfgById(25001)[blendFields.intParam];
            for (let i: int = 0, len: int = param.length; i < len; i++) {
                if (i % 2 == 0) { //偶数
                    this._maxKillNum.push(param[i]);
                } else {
                    this._maxKillNumValue.push(param[i]);
                }
            }

            this._maxBossKillNum = [];
            this._maxBossKillNumValue = [];
            param = BlendCfg.instance.getCfgById(25002)[blendFields.intParam];
            for (let i: int = 0, len: int = param.length; i < len; i++) {
                if (i % 2 == 0) { //偶数
                    this._maxBossKillNum.push(param[i]);
                } else {
                    this._maxBossKillNumValue.push(param[i]);
                }
            }

            this._btnClip = new CustomClip();
            this._btnBossClip = new CustomClip();
            this._btnClip.pos(-5, -7);
            this._btnBossClip.pos(-5, -7);
            this._btnClip.scale(1.24, 1.2);
            this._btnBossClip.scale(1.24, 1.2);
            this.creatEffect(this._btnClip, this.getBtn);
            this.creatEffect(this._btnBossClip, this.getBossBtn);
            this.initSk();

            this.regGuideSpr(GuideSpriteId.DAILY_DEMON_ON_HOOK_GET_BTN, this.getBtn);
            this.regGuideSpr(GuideSpriteId.DAILY_DEMON_BOSS_GET_BTN, this.getBossBtn);
        }

        private initSk() {
            if (this._skeleton) return;
            this._skeleton = new Laya.Skeleton();
            this._skeleton.scale(1.55, 1.55)
            this._skeleton.pos(150, 890);
            this.addChild(this._skeleton);
            this._skeleton.load("res/skeleton/other/SLY.sk");
        }


        public onOpened(): void {
            super.onOpened();

            Channel.instance.publish(UserFeatureOpcode.GetXiangyaoState, null);
            this._btnClip.play();
            this._btnBossClip.play();
            this.updatePanel();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.getBtn, LayaEvent.CLICK, this, this.getRewords);
            this.addAutoListener(this.getBossBtn, LayaEvent.CLICK, this, this.getBossRewords);
            this.addAutoListener(this.dailyRulerBtn, LayaEvent.CLICK, this, this.openDailyRuler);
            this.addAutoListener(this.bossRulerBtn, LayaEvent.CLICK, this, this.openBossRuler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DAILY_DEMON_UPDATE, this, this.updatePanel);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_BORN_LEV, this, this.updatePanel);
        }

        private updatePanel(): void {

            let earLv: number = DailyDemonModel.instance.bornLv;

            //小怪 模块
            let currTime: number = DailyDemonModel.instance.receivedTimes[XiangyaoType.monster];
            let index: number = this.maxNum(this._maxKillNum);
            let maxTime: number = DailyDemonModel.instance.maxReceivedTimes[XiangyaoType.monster];
            let currkillNum: number = DailyDemonModel.instance.killNumber[XiangyaoType.monster];
            let grade: number = DailyDemonModel.instance.grade[XiangyaoType.monster];
            if (currTime >= maxTime) {                //领奖次数已达上限
                this.getMonsterBox0.visible = false;
                this.getMonsterBox1.visible = true;
                if (index == this._maxKillNumValue.length - 1) { //达到最大层数
                    this.getDecTxt0.visible = this.getDecTxt1.visible = this.getDecTxt2.visible = this.getDecTxt3.visible = this.levelTxt.visible = false;
                } else {
                    this.levelTxt.text = `${this._maxKillNum[index + 1]}关`;
                    // this.fitFunc(0, this._tipsArr, this._tipsArr.length);
                    --grade;
                }
            } else {
                this.getMonsterBox0.visible = true;
                this.getMonsterBox1.visible = false;
            }
            this.getTimesTxt.text = `${currTime}/${maxTime}`;
            let cfg: xiangyao = DailyDemonCfg.instance.getLittleCfgByEraLvAndGrade(earLv, grade);
            if (!cfg) {
                cfg = DailyDemonCfg.instance.getLittleCfgByEraLvAndGrade(earLv, grade - 1);
            }
            if (!cfg) {
                return;
                // throw new Error(`降妖出错 觉醒等级是--->${earLv}, 档次是--->${grade}`);
            }
            let maxNum: number = cfg[xiangyaoFields.param];
            let awardArr: Array<Items> = cfg[xiangyaoFields.reward];
            if (currkillNum >= maxNum) {  //    杀怪封顶
                this.getBtn.visible = this._btnClip.visible = true;
                this.cantGetImg.visible = false;
            } else if (currkillNum < maxNum) {                  //杀怪不够 不够领取
                this.getBtn.visible = this._btnClip.visible = false;
                this.cantGetImg.visible = true;
            }
            this._commonBar.maxValue = maxNum;
            this._commonBar.value = currkillNum;
            this.killNumberTxt.text = `${maxNum}` + "只怪物";
            this.showAwardItems(this._commonAwardItems, awardArr);
            this.fitFunc(1, this._commonAwardItems, awardArr.length);

            //Boss 模块
            currTime = DailyDemonModel.instance.receivedTimes[XiangyaoType.boss];
            index = this.maxNum(this._maxBossKillNum);
            maxTime = DailyDemonModel.instance.maxReceivedTimes[XiangyaoType.boss];
            currkillNum = DailyDemonModel.instance.killNumber[XiangyaoType.boss];
            grade = DailyDemonModel.instance.grade[XiangyaoType.boss];
            if (currTime >= maxTime) {        //领奖次数已达上限
                this.getBossBox0.visible = false;
                this.getBossBox1.visible = true;
                if (index == this._maxBossKillNumValue.length - 1) { //达到最大层数
                    this.getBossDecTxt0.visible = this.getBossDecTxt1.visible = this.getBossDecTxt2.visible = this.getBossDecTxt3.visible = this.bossLevelTxt.visible = false;
                } else {
                    this.bossLevelTxt.text = `${this._maxBossKillNum[index + 1]}关`;
                    // this.fitFunc(0, this._tipsBossArr, this._tipsBossArr.length);
                    --grade;
                }
            } else {
                this.getBossBox0.visible = true;
                this.getBossBox1.visible = false;
            }
            this.getBossTimesTxt.text = `${currTime}/${maxTime}`;
            cfg = DailyDemonCfg.instance.getBossCfgByEraLvAndGrade(earLv, grade);
            if (!cfg) {
                cfg = DailyDemonCfg.instance.getBossCfgByEraLvAndGrade(earLv, grade - 1);
            }
            maxNum = cfg[xiangyaoFields.param];
            awardArr = cfg[xiangyaoFields.reward];
            if (currkillNum >= maxNum) {               // 杀怪封顶
                this.getBossBtn.visible = this._btnBossClip.visible = true;
                this.cantGetBossImg.visible = false;
            } else if (currkillNum < maxNum) {               //杀怪不够 不够领取
                this.getBossBtn.visible = this._btnBossClip.visible = false;
                this.cantGetBossImg.visible = true;
            }
            this._bossBar.maxValue = maxNum;
            this._bossBar.value = currkillNum;
            this.killBossNumTxt.text = `${maxNum}` + "只首领";
            this.showAwardItems(this._bossAwardItems, awardArr);

            this.fitFunc(1, this._bossAwardItems, awardArr.length);
            // this.fitFunc(0, this._fitTxtArr, this._fitTxtArr.length);
            // this.fitFunc(0, this._bossFitTxtArr, this._bossFitTxtArr.length);
            // this.fitFunc(0, this._killNumTxtArr, this._killNumTxtArr.length);
            // this.fitFunc(0, this._killBossNumTxtArr, this._killBossNumTxtArr.length);

        }

        private showAwardItems(awardItems: Array<BaseItem>, awardArr: Array<Items>): void {
            let awardLen: number = awardArr.length;
            for (let i: int = 0, len: int = awardItems.length; i < len; i++) {
                awardItems[i].visible = false;
                if (awardLen > i) {
                    awardItems[i].dataSource = [awardArr[i][ItemsFields.itemId], awardArr[i][ItemsFields.count], 0, null];
                    awardItems[i].visible = true;
                }
            }
        }

        private fitFunc(type: number, conArr: Array<BaseItem | Text>, len: number): void {

            let temp: number = 0;
            type == 0 ? temp = 5 : temp = this._widthSpace;
            if (type == 1 && len == 5) temp = 20;
            let sumWidth: number = -temp;
            for (let i: int = 0; i < len; i++) {
                sumWidth += conArr[i].width + temp;
            }
            let startX: number = 319;
            for (let i: int = 0; i < len; i++) {
                if (i == 0) conArr[i].x = startX;
                else conArr[i].x = conArr[i - 1].x + conArr[i - 1].width + temp;
            }
        }

        private maxNum(key: number[]): number {    //返回下标
            let currMission: number = MissionModel.instance.curLv;  //当前天关天数
            let len: number = key.length;
            for (let i: int = 0; i < len; i++) {
                if (currMission <= key[i]) {
                    return i - 1;
                }
            }
            return len - 1;
        }


        private openDailyRuler(): void {
            CommonUtil.alertHelp(20028);
        }

        private openBossRuler(): void {
            CommonUtil.alertHelp(20029);
        }

        private getRewords(): void {
            DailyDemonCtrl.instance.getXiangyaoReward([XiangyaoType.monster]);
        }

        private getBossRewords(): void {
            DailyDemonCtrl.instance.getXiangyaoReward([XiangyaoType.boss]);
        }

        private creatEffect(btnClip: CustomClip, btn: Laya.Button): void {

            btnClip.visible = true;
            btn.addChild(btnClip);
            btnClip.skin = "assets/effect/btn_light.atlas";
            btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];

            btnClip.durationFrame = 5;
            btnClip.loop = true;
            btnClip.pos(-5, -18);
        }
    }
}