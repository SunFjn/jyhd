///<reference path="../config/seven_day_cfg.ts"/>
///<reference path="../bag/bag_util.ts"/>
///<reference path="../config/half_month_cfg.ts"/>


/** 七日礼面板 */


namespace modules.halfMonthGift {

    import GiftViewUI = ui.SevenSignUI;
    import Event = laya.events.Event;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import SevenDayGiftItem = modules.sevenDayGift.SevenDayGiftItem;
    import BaseItem = modules.bag.BaseItem;
    import LayaEvent = modules.common.LayaEvent;
    import UpdateHalfMonthInfo = Protocols.UpdateHalfMonthInfo;
    import UpdateHalfMonthInfoFields = Protocols.UpdateHalfMonthInfoFields;
    import HalfMonthCfg = modules.config.HalfMonthCfg;
    import half_monthFields = Configuration.half_monthFields;
    import half_month = Configuration.half_month;
    import Items = Configuration.Items;
    import GiftState = Protocols.GiftState;
    import GiftStateFields = Protocols.GiftStateFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class HalfMonthGiftPanel extends GiftViewUI {
        private _iconImgTweenJS: TweenJS;
        // private _modelClipTweenJS: TweenJS;
        private _currSelectIndex: int = 0;  //当前选中下标
        private _items: SevenDayGiftItem[];           //七天数组
        private _topItems: Array<BaseItem>;  //上方三个item
        private _btnClip: CustomClip;        //按钮特效
        private _prizeEffect: CustomClip;      //奖品特效
        private _dayDescArr: string[];
        // private _modelClip: AvatarClip;//奖品模型
        private _skeletonClip: SkeletonAvatar;
        private _selectedItem: SevenDayGiftItem;
        private _dayTxts: Array<Laya.Text>;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._selectedItem) this._selectedItem = null;
            if (this._iconImgTweenJS) {
                this._iconImgTweenJS.stop();
                this._iconImgTweenJS = null;
            }
            // if (this._modelClipTweenJS) {
            //     this._modelClipTweenJS.stop();
            //     this._modelClipTweenJS = null;
            // }
            if (this._items) {
                this._items.length = 0;
                this._items = null;
            }
            if (this._topItems) {
                this._topItems.length = 0;
                this._topItems = null;
            }
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            if (this._prizeEffect) {
                this._prizeEffect.removeSelf();
                this._prizeEffect.destroy();
                this._prizeEffect = null;
            }
            // if (this._modelClip) {
            //     this._modelClip.removeSelf();
            //     this._modelClip.destroy();
            //     this._modelClip = null;
            // }
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            this.destroyElement(this._dayTxts);
            super.destroy(destroyChild);
        }


        protected initialize(): void {
            super.initialize();
            // this._modelClip = AvatarClip.create(1024, 1024, 1024);
            // this.addChildAt(this._modelClip, 4);
            // this._modelClip.pos(360, 820, true);
            // this._modelClip.anchorX = 0.5;
            // this._modelClip.anchorY = 0.5;
            // this._modelClip.mouseEnabled = false;

            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.pos(360, 820, true)
            this._skeletonClip.anchorX = 0.5;
            this._skeletonClip.anchorY = 0.5;
            this._skeletonClip.visible = false;

            this._currSelectIndex = -1;

            this.centerX = 0;
            this.centerY = 0;

            this.effectInit();

            this._topItems = [this.baseItem1, this.baseItem2, this.baseItem3];
            this._items = [this.item1, this.item2, this.item3, this.item4, this.item5, this.item6, this.item7];
            this._dayTxts = [this.dayTxt1, this.dayTxt2, this.dayTxt3, this.dayTxt4, this.dayTxt5, this.dayTxt6, this.dayTxt7];
            this._dayDescArr = ["第八天", "第九天", "第十天", "十一天", "十二天", "十三天", "十四天"];
            for (let i: int = 0, len: int = this._dayTxts.length; i < len; i++) {
                this._dayTxts[i].text = this._dayDescArr[i];
            }

            this.titleTxt.text = "半月礼";
            this.titleImg.skin = "seven_sign/banyueli.png";
        }

        private setAvatar(showId: number): void {
            let extercfg: Configuration.ExteriorSK = ExteriorSKCfg.instance.getCfgById(showId);
            if (!extercfg) return;
            // if (this._modelClip) {
            //     this._modelClip.avatarRotationY = extercfg[Configuration.ExteriorSKFields.deviationY] ? extercfg[Configuration.ExteriorSKFields.deviationY] : 180;
            //     this._modelClip.avatarScale = extercfg[Configuration.ExteriorSKFields.scale] ? (extercfg[Configuration.ExteriorSKFields.scale]) : 1;
            //     this._modelClip.avatarRotationX = extercfg[Configuration.ExteriorSKFields.deviationX] ? extercfg[Configuration.ExteriorSKFields.deviationX] : 0;
            //     this._modelClip.avatarX = extercfg[Configuration.ExteriorSKFields.deviationX] ? extercfg[Configuration.ExteriorSKFields.deviationX] : 0;
            //     this._modelClip.avatarY = extercfg[Configuration.ExteriorSKFields.deviationY] ? extercfg[Configuration.ExteriorSKFields.deviationY] : 0;
            // }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, Event.CLICK, this, this.sureFunc);
            for (let i: int = 0, len: int = this._items.length; i < len; i++) {
                this.addAutoListener(this._items[i].frameImg, LayaEvent.CLICK, this, this.itemClickHandler, [i]);
            }
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.HALF_MONTH_INFO_UPDATE, this, this.updateInfo);
        }

        protected removeListeners(): void {
            super.removeListeners();
            if (this._iconImgTweenJS != null) {
                this._iconImgTweenJS.stop();
                this._iconImgTweenJS = null;
            }
            // if (this._modelClipTweenJS != null) {
            //     this._modelClipTweenJS.stop();
            //     this._modelClipTweenJS = null;
            // }
        }

        protected onOpened(): void {
            super.onOpened();
            for (let i: int = 0, len: int = this._items.length; i < len; i++) {
                this._items[i].type = 2;
                this._items[i].cfg = HalfMonthCfg.instance.cfgs[i];
            }

            this.updateInfo();
        }

        private itemClickHandler(index: int): void {
            this.selectItem(index);

            // 点击位置的item换皮
            for (let i: int = 0, len: int = this._items.length; i < len; i++) {
                if (index == i) {
                    this._items[i].frameImg.skin = 'seven_sign/icon_qrl_klq.png';
                } else {
                    this._items[i].frameImg.skin = 'seven_sign/icon_qrl_wlq.png';
                }
            }
        }

        /**
         * 根据是否缓动 是否模型 判断  图片是否缓动
         */
        public isMoveIconImg(isMove: number, isModel: number) {
            if (isModel == 2) {
                if (isMove == 1) {
                    if (this._iconImgTweenJS) {
                        this._iconImgTweenJS.stop();
                    }
                    this.iconImg.y = 738;//重置下位置
                    this._iconImgTweenJS = TweenJS.create(this.iconImg).to({ y: this.iconImg.y - 7 },
                        1000).start().yoyo(true).repeat(99999999);
                } else {
                    if (this._iconImgTweenJS) {
                        this._iconImgTweenJS.stop();
                    }
                }
            } else {
                if (this._iconImgTweenJS) {
                    this._iconImgTweenJS.stop();
                }
            }

        }

        /**
         * 根据是否缓动 是否模型 判断  模型是否缓动
         */
        public isMoveModelClip(isMove: number, isModel: number) {
            if (isModel == 0) {
                if (isMove == 1) {
                    // if (this._modelClipTweenJS) {
                    //     this._modelClipTweenJS.stop();
                    // }
                    // this._modelClip.y = 820;//重置下位置
                    // this._modelClipTweenJS = TweenJS.create(this._modelClip).to({ y: this._modelClip.y - 20 },
                    //     1000).start().yoyo(true).repeat(99999999);
                } else {
                    // if (this._modelClipTweenJS) {
                    //     this._modelClipTweenJS.stop();
                    // }
                }
            } else {
                // if (this._modelClipTweenJS) {
                //     this._modelClipTweenJS.stop();
                // }
            }

        }

        private selectItem(index: int): void {
            if (index === -1) return;
            let info: UpdateHalfMonthInfo = HalfMonthGiftModel.instance.halfMonthInfo;
            if (!info) return;
            if (this._selectedItem) this._selectedItem.selected = false;
            this._selectedItem = this._items[index];
            this._selectedItem.selected = true;
            this._currSelectIndex = index;

            let day: number = index + 8;
            let cfg: half_month = HalfMonthCfg.instance.getCfgByDay(index + 8);
            let isModel: number = cfg[half_monthFields.isModel];
            let iconID: number = cfg[half_monthFields.iconID];
            let isMove: number = cfg[half_monthFields.isMove];
            this.isMoveIconImg(isMove, isModel);
            this.isMoveModelClip(isMove, isModel);
            let isTeXiao: number = cfg[half_monthFields.isTeXiao];
            if (isTeXiao == 1) {
                this._prizeEffect.visible = true;
                this._prizeEffect.play();
            } else {
                this._prizeEffect.visible = false;
                this._prizeEffect.stop();
            }
            if (isModel != 2) {
                this.soaringRankModelClip(iconID, isModel);
            } else {
                // this._modelClip.visible = false;
                this._skeletonClip.visible = false;
                this.iconImg.visible = true;
                this.iconImg.skin = `assets/icon/ui/seven_day/${iconID}.png`;
            }
            this.nameTxt.text = cfg[half_monthFields.name];

            let items: Array<Items> = HalfMonthCfg.instance.getCfgByDay(day)[half_monthFields.award];
            for (let i: int = 0; i < 3; i++) {
                this._topItems[i].dataSource = [items[i][ItemsFields.itemId], items[i][ItemsFields.count], 0, null];
            }

            //如果停留位置未领取
            let stateInfo: GiftState = HalfMonthGiftModel.instance.getDataByIndex(index);
            if (stateInfo && stateInfo[GiftStateFields.state] === 1) {
                this.sureBtn.visible = false;
                this.receiveImg.visible = true;
                this._btnClip.visible = false;
                this._btnClip.stop();
            } else {
                this.sureBtn.visible = true;
                this.receiveImg.visible = false;
                if (day <= info[UpdateHalfMonthInfoFields.day]) {
                    this._btnClip.visible = true;
                    this._btnClip.play();
                    this.sureBtn.label = "可领取";
                } else {
                    this._btnClip.visible = false;
                    this.sureBtn.label = "未达成";
                    this._btnClip.stop();
                }
            }

            this.dayTxt.text = this._dayDescArr[this._currSelectIndex];
        }
        public soaringRankModelClip(iconID: number, isModel: number) {
            this.iconImg.visible = false;

            this.setAvatar(iconID);
            let typeNum = Math.round(iconID / 1000);
            if (isModel == 1) {
                if (typeNum == 9 || typeNum == 10) {//法阵
                    // this._modelClip.visible = true;
                    // //this._skeletonClip = this.destroyElement(this._skeletonClip);
                    // this._modelClip.reset(0, 0, 0, 0, iconID);
                    // this._modelClip.y = 960;
                    // this._skeletonClip.reset(0, 0, 0, 0, iconID)
                    // this._skeletonClip.y = 820;
                }
            } else {
                this._skeletonClip.visible = true;
                this._skeletonClip.y = 820;
                // this._modelClip.reset(iconID);
                //this._modelClip = this.destroyElement(this._modelClip);

                if (typeNum == 11) {//鬼神之力特殊处理
                    this._skeletonClip.reset(0, 0, 0, 0, 0, iconID);
                } else {
                    this._skeletonClip.reset(iconID);
                }
                if (typeNum == 2) {  //宠物
                } else if (typeNum == 3) {//翅膀
                } else if (typeNum == 4) {//精灵
                } else if (typeNum == 5) {//幻武
                } else if (typeNum == 90) { //时装
                    // this._modelClip.y = 110;
                } else if (typeNum == 11) { //灵珠
                    // if (this._modelClip) {
                    //     this._modelClip.setActionType(ActionType.SHOW);
                    // }
                    if (this._skeletonClip) {
                        this._skeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.SHOW)
                    }
                    this._skeletonClip.y = 960;
                    // this._modelClip.y = 100;
                } else {
                }
            }
        }
        //点击领取按钮
        protected sureFunc(): void {
            if (this._currSelectIndex === -1) return;
            HalfMonthGiftCtrl.instance.getHalfMonthReward(this._currSelectIndex + 8);
        }

        //面板更新
        private updateInfo(): void {
            let info: UpdateHalfMonthInfo = HalfMonthGiftModel.instance.halfMonthInfo;
            if (!info) return;
            let index: number = 6;
            for (let i: int = 0, len: int = this._items.length; i < len; i++) {
                let data: GiftState = HalfMonthGiftModel.instance.getDataByIndex(i);
                this._items[i].data = data;
                if (index === 6 && data[GiftStateFields.state] === 0) {
                    index = i;
                }
            }
            this.selectItem(index);
        }

        //特效
        private effectInit(): void {
            this._btnClip = new CustomClip();
            this.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.loop = true;
            this._btnClip.pos(this.sureBtn.x - 9, this.sureBtn.y - 18);
            this._btnClip.scale(1.25, 1.25);

            this._prizeEffect = new CustomClip();
            this.addChildAt(this._prizeEffect, 2);
            this._prizeEffect.scale(2, 2);
            this._prizeEffect.skin = "assets/effect/ok_state.atlas";
            this._prizeEffect.frameUrls = ["ok_state/0.png", "ok_state/1.png", "ok_state/2.png", "ok_state/3.png", "ok_state/4.png",
                "ok_state/5.png", "ok_state/6.png", "ok_state/7.png"];
            this._prizeEffect.durationFrame = 5;
            this._prizeEffect.loop = true;
            this._prizeEffect.pos(104, 530);
        }

        public close(): void {
            super.close();

        }
    }
}