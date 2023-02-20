///<reference path="../config/fishing_cfg.ts"/>
///<reference path="../fish/fish_model.ts"/>
///<reference path="../limit/limit_reap_model.ts"/>
///<reference path="../ceremony_geocaching/ceremony_geocaching_text.ts"/>
/**新春 主界面*/
namespace modules.year {
    import FishCtrl = modules.fish.FishCtrl;
    import FishModel = modules.fish.FishModel;
    import FishingCfg = modules.fish.FishingCfg;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import BagModel = modules.bag.BagModel;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import LimitReapCtrl = modules.limit.LimitReapCtrl;
    import LimitReapModel = modules.limit.LimitReapModel;
    import CustomList = modules.common.CustomList;
    import CeremonyGeocachingItemText = modules.ceremony_geocaching.CeremonyGeocachingItemText;
    import BtnGroup = modules.common.BtnGroup;
    import LimitXunbaoNote = Protocols.LimitXunbaoNote;
    import LimitXunbaoNoteFields = Protocols.LimitXunbaoNoteFields;
    import Event = laya.events.Event;
    const PRICE_ARR = [1, 9, 45];

    export class YearPanel extends ui.YearCjViewUI {

        constructor() {
            super();
        }
        private static _instance:YearPanel
        public static get instance(): YearPanel {
            return this._instance = this._instance || new YearPanel();
        }
        private _bar: ProgressBarCtrl;
        private _personalList: CustomList;
        private _sevTextArr: Array<any>;
        private _sevStringArr: Array<any>;
        private severListLen: number;
        private _btnGroup: BtnGroup;

        protected initialize(): void {
            super.initialize();
            this.centerX = this.centerY = 0;
            this._bar = new ProgressBarCtrl(this.scoreBar, this.scoreBar.width, this.scoreTxt);

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.severList, this.selfList);

            this._personalList = new CustomList();
            this._personalList.itemRender = CeremonyGeocachingItemText;
            this._personalList.hCount = 1;
            this._personalList.spaceY = 8;
            this._personalList.width = 500;
            this._personalList.height = 112;
            this._personalList.x = 0;
            this._personalList.y = 0;
            this.selfPanel.addChild(this._personalList);

            this._sevTextArr = new Array<any>();
            this._sevStringArr = new Array<any>();

            this.severListLen = 4;
            for (let i = 0; i < this.severListLen; i++) {
                let text = new laya.html.dom.HTMLDivElement();
                text.width = 499;
                text.style.height = 20;
                text.pos(0, i * 28);
                this._sevTextArr.push(text);
                this.severPanel.addChild(text);
            }
        }

        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }

        protected get weighttype(): LimitWeightType {
            return LimitWeightType.year;
        }

        protected get prize(): ItemId {
            return 15650003;
        }

        protected get tasksmalltype(): LimitTaskSmallType {
            return LimitTaskSmallType.cjjf;
        }

        public onOpened(): void {
            super.onOpened();
            FishCtrl.instance.getLoginInfo(this.weighttype);
            LimitReapCtrl.instance.GetLimitXunBaoCumulativeTaskInfo(LimitBigType.year, LimitTaskSmallType.cjjf);
            FishCtrl.instance.GetLimitXunbaoLog(this.weighttype);

            Laya.timer.frameLoop(1, this, this.updateList);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FISH_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.setPrizeNun);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LIMIT_REAP_UPDATE, this, this.initCode);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LIMIT_XUNBAO_LOG, this, this.updateSeverList);

            this.addAutoListener(this.getTaskBtn, Laya.Event.CLICK, this, this.getTaskBtnHandler);
            this.addAutoListener(this.oneBtn, Laya.Event.CLICK, this, this.getBtnHandler, [0]);
            this.addAutoListener(this.tenBtn, Laya.Event.CLICK, this, this.getBtnHandler, [1]);
            this.addAutoListener(this.fiftyBtn, Laya.Event.CLICK, this, this.getBtnHandler, [2]);
            this.addAutoRegisteRedPoint(this.getedRPImg, ["YearCjTaskRP"]);
            this._btnGroup.on(Event.CHANGE, this, this.changeList);
            this._btnGroup.selectedIndex = 0;
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        private updateView() {
            this.setActivitiTime();
            this.initItem();
            this.initPrize();
            this.initCode();
            this.updateSelfList();
        }

        private initCode() {
            // 刷新红点
            FishModel.instance.judgeCode(this.weighttype, this.tasksmalltype);
            // 积分
            this._bar.maxValue = LimitReapModel.instance.getLeastCode(this.bigtype, this.tasksmalltype);
            // console.log('vtz:.this._bar.maxValue', this._bar.maxValue);
            this._bar.value = FishModel.instance.getScoreByType(this.weighttype);
            // console.log('vtz:this._bar.value ', this._bar.value );
        }

        // 设置消耗道具
        private initPrize() {
            let i_s = CommonUtil.getIconById(this.prize, true);
            this.priceTxt.text = CommonUtil.getNameByItemId(this.prize);

            let p_c: Image[] = this.priceImgBox._childs;
            for (let i = 0; i < p_c.length; i++) {
                p_c[i].skin = i_s;
            }

            this.setPrizeNun();
        }

        private setPrizeNun() {
            let have = BagModel.instance.getItemCountById(this.prize);
            let i_n: Text[] = this.priceNumBox._childs;
            for (let i = 0; i < i_n.length; i++) {
                i_n[i].text = have + "/" + PRICE_ARR[i];
                i_n[i].color = have < PRICE_ARR[i] ? "#be242" : "#ffffff";
            }
        }

        // 奖品赋值
        private initItem() {
            let item_arr: Array<Items> = FishingCfg.instance.getItemShowByTypeGrade(this.weighttype, FishModel.instance.getGradeByType(this.weighttype));
            // console.log('vtz:item_arr', item_arr);
            for (let i = 0; i < this.itemBox._childs.length && i < item_arr.length; i++) {
                // let it:BaseItem = this.itemBox._childs[i];   // 给类型BaseItem.dataSource报错
                let it = this.itemBox._childs[i];
                it.dataSource = item_arr[i];
                if (i >= this.itemBox._childs.length - 2) {
                    it.hintTxt.text = CommonUtil.getNameByItemId(item_arr[i][ItemsFields.itemId]);
                    // it.hintTxt.color = "#820200";
                    it.hintTxt.y = 120;
                    it.hintTxt.x = -40;
                    it.hintTxt.width = 180;
                }
            }
        }
        private setActivitiTime(): void {
            // 拿到活动结束时间
            if (FishModel.instance.endTime > GlobalData.serverTime) {
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.downcountTxt.text = "活动已结束";
                this.downcountTxt.color = "#cc0000";
            }
        }

        // 活动倒计时
        private activityHandler(): void {
            if (FishModel.instance.endTime > GlobalData.serverTime) {
                this.downcountTxt.color = "#2ad200";
                this.downcountTxt.text = `${modules.common.CommonUtil.timeStampToDayHourMinSecond(FishModel.instance.endTime)}`;
            } else {
                this.downcountTxt.text = "活动已结束";
                this.downcountTxt.color = "#cc0000";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        // 抽奖
        public getBtnHandler(i: number) {
            // 判断本钱够不够
            if (BagModel.instance.getItemCountById(this.prize) < PRICE_ARR[i]) {
                WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [this.prize, 0, true]);
                SystemNoticeManager.instance.addNotice("材料不足!", true);
                return;
            }

            FishCtrl.instance.GainFish(this.weighttype, i);
        }

        // 领取奖励/开打积分奖励榜
        private getTaskBtnHandler() {
            let max = LimitReapModel.instance.getLeastCode(this.bigtype, this.tasksmalltype);
            let has = FishModel.instance.getScoreByType(this.weighttype);

            // 开打积分奖励榜
            if (has < max) {
                WindowManager.instance.open(WindowEnum.YEAR_SCORE_ALERT);
            } else {
                let id = LimitReapModel.instance.getLeastId(this.bigtype, this.tasksmalltype);
                if (!id) {
                    id = LimitReapCfg.instance.getLeastId(this.bigtype, this.tasksmalltype, id)
                }
                LimitReapCtrl.instance.getLimitReap([this.bigtype, id, this.tasksmalltype])
            }
        }

        private changeList(): void {
            // console.log('vtz:changelist');
            switch (this._btnGroup.selectedIndex) {
                case 0: {
                    this.severPanel.visible = true;
                    this.selfPanel.visible = false;
                }
                    break;
                case 1: {
                    this.severPanel.visible = false;
                    this.selfPanel.visible = true;
                }
                    break;
            }
        }

        private updateList(): void {
            for (let i = 0; i < this._sevTextArr.length; i++) {
                this._sevTextArr[i].y -= 1 * (Laya.stage.frameRate === Laya.Stage.FRAME_SLOW ? 2 : 1);
                if (this._sevTextArr[i].y <= -10) {
                    this._sevTextArr[i].y = 102;
                    if (this.severListLen < this._sevStringArr.length) {
                        this.severListLen++;
                        if (!this._sevStringArr[this.severListLen - 1]) return;
                        this._sevTextArr[i].innerHTML = this._sevStringArr[this.severListLen - 1];
                    } else {
                        this.severListLen = 1;
                        if (!this._sevStringArr[this.severListLen - 1]) return;
                        this._sevTextArr[i].innerHTML = this._sevStringArr[this.severListLen - 1];
                    }
                }
            }
        }

        // 更新全服列表数据
        private updateSeverList(type: LimitWeightType, list: LimitXunbaoNote[]) {
            // console.log('vtz:type,list', type, list);
            if (list != null) {
                if (list.length > 0) {
                    if (this._sevStringArr.length > 0) {
                        this._sevStringArr.length = 0;
                    }
                    for (let i = 0; i < list.length; i++) {
                        let name = list[i][LimitXunbaoNoteFields.name];
                        let itemId = list[i][LimitXunbaoNoteFields.itemId];
                        let itemName = CommonUtil.getNameByItemId(itemId);
                        let itemColor = CommonUtil.getColorById(itemId);
                        var html: string = "<span style='color:#2d2d2d;font-size: 20px'>天赐鸿福,</span>";
                        html += `<span style='color:rgb(13,121,255);font-size: 20px;'>${name}</span>`;
                        html += "<span style='color:#2d2d2d;font-size: 20px'>获得了</span>";
                        html += `<span style='color:${itemColor};font-size: 20px;'>${itemName}</span>`;
                        this._sevStringArr.push(html);
                    }
                }

            }
        }

        private updateSelfList() {
            let ap: LimitXunbaoNote[] = FishModel.instance.getSelfLog(this.weighttype);
            let data = new Array();
            if (ap && ap.length > 0) {
                for (let key in ap) {
                    data.push([ap[key][LimitXunbaoNoteFields.itemId], ap[key][LimitXunbaoNoteFields.grade]]);
                }
                this._personalList.datas = data;
                this._personalList.scrollTo(this._personalList.datas.length * 28);
            }
        }

        public close(): void {
            super.close();
        }
        public destroy(destroyChild?: boolean): void {
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._personalList = this.destroyElement(this._personalList);
        }
    }
}