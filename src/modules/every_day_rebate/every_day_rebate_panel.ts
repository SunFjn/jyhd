///<reference path="../config/everyday_rebate_cfg.ts"/>
/**
 * 天天返利 （封神榜）
 */
namespace modules.every_day_rebate {
    import ItemsFields = Configuration.ItemsFields;
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = modules.common.CustomClip;
    import CustomList = modules.common.CustomList;
    import Items = Configuration.Items;
    import BlendMode = Laya.BlendMode;
    import EverydayRebateNodeFields = Protocols.EverydayRebateNodeFields;
    import EverydayRebateNode = Protocols.EverydayRebateNode;
    import EveryDayRebateCfg = modules.config.EveryDayRebateCfg;
    import everyday_rebate = Configuration.everyday_rebate;
    import everyday_rebateFields = Configuration.everyday_rebateFields;

    export class EveryDayRebatePanel extends ui.EveryDayreBateViewUI {
        private _list: CustomList;
        private _taskBaseOne: Array<BaseItem>;
        private _taskBaseTwo: Array<BaseItem>;
        private _clipArr: Array<CustomClip>;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._taskBaseOne = [this.continueBase1, this.continueBase2, this.continueBase3, this.continueBase4, this.continueBase5];
            this._taskBaseTwo = [this.continueBase6, this.continueBase7, this.continueBase8, this.continueBase9, this.continueBase10];
            this._list = new CustomList();
            this._list.width = 640;
            this._list.height = 489;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.spaceY = 6;
            this._list.x = 40;
            this._list.y = 646 - 9;
            this._list.itemRender = EveryDayRebateItem;
            this.addChildAt(this._list, 4);
            this.StatementHTML.color = "#ffffff";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 24;
            this.StatementHTML.style.align = "left";

            this._clipArr = new Array<CustomClip>();
            for (let i = 0; i < this._taskBaseOne.length; i++) {
                let urlArr = new Array<string>();
                let clip = new CustomClip();
                // clip.blendMode = BlendMode.ADD;
                this._taskBaseOne[i].addChild(clip);
                clip.pos(-14, -22, true);
                clip.skin = "assets/effect/item_effect2.atlas";
                // for (let i = 0; i < 16; i++) {
                for (let i = 0; i < 8; i++) {
                    let str = `item_effect2/${i}.png`;
                    urlArr.push(str);
                }
                clip.frameUrls = urlArr;
                clip.durationFrame = 6;
                clip.stop();
                clip.visible = false;
                clip.name = "clip";
                this._clipArr.push(clip);
            }
            for (let i = 0; i < this._taskBaseTwo.length; i++) {
                let urlArr = new Array<string>();
                let clip = new CustomClip();
                // clip.blendMode = BlendMode.ADD;
                this._taskBaseTwo[i].addChild(clip);
                clip.pos(-14, -22, true);
                clip.skin = "assets/effect/item_effect2.atlas";
                // for (let i = 0; i < 16; i++) {
                for (let i = 0; i < 8; i++) {
                    let str = `item_effect2/${i}.png`;
                    urlArr.push(str);
                }
                clip.frameUrls = urlArr;
                clip.durationFrame = 6;
                clip.stop();
                clip.visible = false;
                clip.name = "clip";
                this._clipArr.push(clip);
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_EVERTDATREDATE_UPDATE, this, this.showUI);
        }

        public onOpened(): void {
            super.onOpened();
            EveryDayRebateCtrl.instance.GetEverydayRebateInfo();
            this.showTaskReward();
        }

        public showUI() {
            let shuju = EveryDayRebateCfg.instance.getArrDate();
            shuju.sort(this.sortFunc.bind(this));
            this._list.datas = shuju;

        }

        private sortFunc(a: everyday_rebate, b: everyday_rebate): number {
            let nodeList: Array<EverydayRebateNode> = EveryDayRebateModel.instance.nodeList;
            let aID: number = a[everyday_rebateFields.id];
            let bID: number = b[everyday_rebateFields.id];
            let aDay: number = a[everyday_rebateFields.day];
            let bDay: number = b[everyday_rebateFields.day];
            let aState: number = nodeList[aDay] ? nodeList[aDay][EverydayRebateNodeFields.state] : 0;
            let bState: number = nodeList[bDay] ? nodeList[bDay][EverydayRebateNodeFields.state] : 0;
            aState = aState === 0 ? 1 : aState === 1 ? 0 : aState;
            bState = bState === 0 ? 1 : bState === 1 ? 0 : bState;
            if (aState === bState) {     // 状态相同按ID排
                return aID - bID;
            } else {
                return aState - bState;
            }
        }

        public showTaskReward() {
            for (var index = 0; index < this._taskBaseOne.length; index++) {
                let element = this._taskBaseOne[index];
                element.visible = false;
            }
            for (var index = 0; index < this._taskBaseTwo.length; index++) {
                let element = this._taskBaseTwo[index];
                element.visible = false;
            }
            // //第一行奖励
            let shuju: everyday_rebate = EveryDayRebateCfg.instance.getCfgById(1001);
            let allAwardOne = new Array<BaseItem>();
            let rewardsOne: Array<Items> = shuju[everyday_rebateFields.rewardOne];
            for (var index = 0; index < rewardsOne.length; index++) {
                let element = rewardsOne[index];
                let _taskBase: BaseItem = this._taskBaseOne[index];
                if (_taskBase) {
                    _taskBase.dataSource = [rewardsOne[index][ItemsFields.itemId], rewardsOne[index][ItemsFields.count], 0, null];
                    _taskBase.visible = true;
                    allAwardOne.push(_taskBase);
                    _taskBase.isbtnClipIsPlayer = false;
                    let _clip: CustomClip = _taskBase.getChildByName("clip") as CustomClip;
                    _clip.play();
                    _clip.visible = true;
                }
            }
            let lengNum = allAwardOne.length * 100 + (allAwardOne.length - 1) * 10;
            let startPosX = (this.width - lengNum) / 2;
            for (let index = 0; index < allAwardOne.length; index++) {
                let element = allAwardOne[index];
                element.x = startPosX;
                startPosX += (element.width) + 10;
            }
            //第二行奖励
            let allAwardTwo = new Array<BaseItem>();
            let rewardsTwo: Array<Items> = shuju[everyday_rebateFields.rewardTwo];
            for (var index = 0; index < rewardsTwo.length; index++) {
                let element = rewardsTwo[index];
                let _taskBase: BaseItem = this._taskBaseTwo[index];
                if (_taskBase) {
                    _taskBase.dataSource = [rewardsTwo[index][ItemsFields.itemId], rewardsTwo[index][ItemsFields.count], 0, null];
                    _taskBase.visible = true;
                    allAwardTwo.push(_taskBase);
                    _taskBase.isbtnClipIsPlayer = false;
                    let _clip: CustomClip = _taskBase.getChildByName("clip") as CustomClip;
                    _clip.play();
                    _clip.visible = true;
                }
            }
            lengNum = allAwardTwo.length * 100 + (allAwardTwo.length - 1) * 10;
            startPosX = (this.width - lengNum) / 2;
            for (let index = 0; index < allAwardTwo.length; index++) {
                let element = allAwardTwo[index];
                element.x = startPosX;
                startPosX += (element.width) + 10;
            }
            this.StatementHTML.innerHTML = `活动规则:即日起每日充值<span style='color:#ffec7c'>任意</span>金额，即可领取豪礼，每隔<span style='color:#ffec7c'>6天</span>还可获取海量代币券，最多可达<span style='color:#ffec7c'>10万代币券</span>`;
        }


        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._clipArr = this.destroyElement(this._clipArr);
            this._taskBaseOne = this.destroyElement(this._taskBaseOne);
            this._taskBaseTwo = this.destroyElement(this._taskBaseTwo);
            super.destroy(destroyChild);
        }
    }
}
