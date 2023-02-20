///<reference path="../config/limit_pack_cfg.ts"/>


namespace modules.limit_pack {

    import LayaEvent = modules.common.LayaEvent;
    import LimitPackCfg = modules.config.LimitPackCfg;
    import limit_pack = Configuration.limit_pack;
    import limit_packFields = Configuration.limit_packFields;
    import ItemsFields = Protocols.ItemsFields;
    import BaseItem = modules.bag.BaseItem;
    import ThreeNumber = Protocols.ThreeNumber;
    import Items = Protocols.Items;

    export enum LimitPackInfoFields {
        level = 0,            //等级
        noVipState = 1,       //非vip礼包状态 状态：0过期了，1已购买，其它数字表示剩下时间*/
        VipState = 2          //vip礼包状态 状态：0过期了，1已购买，其它数字表示剩下时间*/
    }

    export class LimitPackAlert extends ui.LimitPackAlertUI {
        constructor() {
            super();
        }

        private _infoRecord: Array<ThreeNumber>;        //记录页面打开后接收过的所有消息

        private _index: number;      //当前页面
        private get index(): number {
            return this._index;
        }
        private set index(value: number) {
            if (value < 0) { this._index = 0; }
            else if (value >= this._infoRecord.length) {
                this._index = this._infoRecord.length - 1;
            }
            else { this._index = value; }
        }

        protected initialize(): void {
            super.initialize();
            //激活按钮粒子效果
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LIMIT_PACK_UPDATE, this, this.updateHandler);       //画面刷新事件
            this.addAutoListener(this.buyBtn, LayaEvent.CLICK, this, this.buyBtnHandler);      //购买按钮
            this.addAutoListener(this.lastBtn, LayaEvent.CLICK, this, this.switchPage, [false]);        //向前切页
            this.addAutoListener(this.nextBtn, LayaEvent.CLICK, this, this.switchPage, [true]);         //向后切页
        }

        public onOpened(): void {
            super.onOpened();
            this._infoRecord = LimitPackModel.instance.limitPackInfo;

            this._index = 0;
            this.refresh();
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.countdownHandler);
        }

        public destroy(): void {
            super.destroy();
        }

        private countdownHandler(): void {
            this.time.text = `${CommonUtil.timeStampToHHMMSS(this._infoRecord[this._index][LimitPackInfoFields.VipState] + LimitPackModel.instance.updateTime)}`;
        }

        private refresh(): void {
            Laya.timer.clear(this, this.countdownHandler);      //清理倒计时

            //翻页按钮
            if (this._index == 0 || this._infoRecord.length <= 1) {
                this.lastBtn.visible = false;
            }
            else {
                this.lastBtn.visible = true;
            }
            if (this._index >= this._infoRecord.length - 1) {
                this.nextBtn.visible = false;
            }
            else {
                this.nextBtn.visible = true;
            }

            let packInfo: ThreeNumber = this._infoRecord[this._index];        //当前页的礼包信息
            let cfg: limit_pack = LimitPackCfg.instance.getCfgByLevel(packInfo[LimitPackInfoFields.level]);        //当前页礼包配置

            if (!cfg) { return; }

            this.level.text = `(${packInfo[LimitPackInfoFields.level]}级)`;     //显示等级

            //按钮设置
            if (packInfo[LimitPackInfoFields.VipState] > 1) {
                this.buyBtn.skin = "common/17.png";
                this.buyBtn.label = "购买";
                this.descript.text = "后永久消失"
            }
            else if (packInfo[LimitPackInfoFields.VipState] == 1) {
                this.buyBtn.skin = "limit_pack/txt_common_ygm.png";
                this.buyBtn.label = "";
                this.descript.text = "已购买"
            }
            else {
                this.descript.text = "已结束"
                this.buyBtn.skin = "common/txt_commmon_yjies.png";
                this.buyBtn.label = "";
            }

            //礼包价格
            let oriPrice: number = (packInfo[LimitPackInfoFields.noVipState] > 1) ? cfg[limit_packFields.originalPrice] : cfg[limit_packFields.vipOriginalPrice];
            let disPrice: number = (packInfo[LimitPackInfoFields.noVipState] > 1) ? cfg[limit_packFields.price] : cfg[limit_packFields.vipPrice];

            this.originalPrice.text = oriPrice.toString();
            this.discountPrice.text = disPrice.toString();
            //代币券不足颜色变红
            if (disPrice <= PlayerModel.instance.ingot) {
                this.discountPrice.color = "#7c1d0c";
            }
            else { this.discountPrice.color = "#ff3e3e"; }

            //显示vip条件
            if (packInfo[LimitPackInfoFields.noVipState] > 1) {
                this.vip.text = "购买后解锁更低折扣";
            }
            else {
                this.vip.text = `SVIP${cfg[limit_packFields.vip]}可购买`;
            }

            //折扣图标
            let disIco: limit_packFields = (packInfo[LimitPackInfoFields.noVipState] > 1) ? limit_packFields.discountIcon : limit_packFields.VIPdiscountIcon;
            this.discount.skin = `assets/icon/ui/limit_pack/${cfg[disIco]}.png`;

            //时间显示
            if (packInfo[LimitPackInfoFields.VipState] > 1) {
                this.time.visible = true;
                this.time.text = `${CommonUtil.timeStampToHHMMSS(packInfo[LimitPackInfoFields.VipState] + LimitPackModel.instance.updateTime)}`;     //因为同等级的礼包共用一个时间，所以统一使用vip的时间
                Laya.timer.loop(1000, this, this.countdownHandler);      //启动倒计时
            }
            else {
                this.time.visible = false;
            }

            //初始化道具,并居中处理。最左边坐标136,最右528,间距98
            let baseItems: Array<BaseItem> = [this.baseItem0, this.baseItem1, this.baseItem2, this.baseItem3, this.baseItem4];
            let items: Array<Items> = cfg[(packInfo[LimitPackInfoFields.noVipState] > 1) ? limit_packFields.items : limit_packFields.vipItems];        //判断是否显示vip道具
            let startOffset: number = 196 - 49 * (items.length - 1);     //开始位置
            for (let i = 0; i < baseItems.length; ++i) {
                if (i < items.length) {
                    baseItems[i].visible = true;
                    baseItems[i].x = 136 + startOffset + 98 * i;
                    baseItems[i].dataSource = [items[i][ItemsFields.ItemId], items[i][ItemsFields.count], 0, null];
                    baseItems[i]._qualityBg.skin = "limit_pack/image_sc_c.png";       //修改底图
                }
                else { baseItems[i].visible = false; }
            }
        }

        //购买按钮
        private buyBtnHandler(): void {
            let packInfo: ThreeNumber = this._infoRecord[this._index];        //当前页的礼包信息
            let cfg: limit_pack = LimitPackCfg.instance.getCfgByLevel(packInfo[LimitPackInfoFields.level]);        //当前页礼包配置
            //如果礼包可购买
            if (packInfo[LimitPackInfoFields.VipState] > 1) {
                let buyType: number = (packInfo[LimitPackInfoFields.noVipState] > 1) ? 0 : 1;                //是否购买vip礼包
                //vip等级不足
                if (buyType) {
                    if (vip.VipModel.instance.vipLevel < cfg[limit_packFields.vip]) {
                        CommonUtil.alert('温馨提示', 'SVIP等级不足，是否前往提升SVIP？', [Laya.Handler.create(this, () => {
                            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                            WindowManager.instance.close(WindowEnum.LIMIT_PACK_ALERT);
                        })]);
                        return;
                    }
                }
                LimitPackCtrl.instance.buyLimitPack([packInfo[LimitPackInfoFields.level], buyType])
            }
        }

        //切页按钮
        private switchPage(dir: boolean): void {
            if (dir) {
                ++this.index;
            }
            else {
                --this.index;
            }
            this.refresh();
        }

        //数据更新回调
        private updateHandler(buyReply: boolean): void {
            let info: Array<ThreeNumber> = LimitPackModel.instance.limitPackInfo;
            //添加并记录
            for (let i = 0; i < info.length; ++i) {
                let cur: ThreeNumber = info[i];
                let found: boolean = false;     //是否找到对应的记录
                for (let j = 0; j < this._infoRecord.length; ++j) {
                    if (this._infoRecord[j][LimitPackInfoFields.level] == cur[LimitPackInfoFields.level]) {
                        this._infoRecord[j] = cur;
                        found = true;
                        break;
                    }
                }
                //没找到就添加
                if (!found) {
                    this._infoRecord.push(cur);
                }
            }

            //遍历所有无法购买的记录，并将相应的状态修改为已过时
            for (let i = 0; i < this._infoRecord.length; ++i) {
                let found: boolean = false;
                for (let j = 0; j != info.length; ++j) {
                    if (this._infoRecord[i][LimitPackInfoFields.level] == info[j][LimitPackInfoFields.level]) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    if (this._infoRecord[i][LimitPackInfoFields.noVipState] > 1) { this._infoRecord[i][LimitPackInfoFields.noVipState] = 0; }
                    this._infoRecord[i][LimitPackInfoFields.VipState] = 0;
                }
            }

            let lastLevel: number = this._infoRecord[this.index][LimitPackInfoFields.level];
            let available: boolean = false;        //是否可购买
            for (let i = 0; i < info.length; ++i) {
                if (info[i][LimitPackInfoFields.level] == lastLevel) {
                    available = true;
                    break;
                }
            }

            if (!available) {
                if (buyReply) {
                    this._infoRecord[this.index][LimitPackInfoFields.noVipState] = 1;
                    this._infoRecord[this.index][LimitPackInfoFields.VipState] = 1;
                }
                else {
                    this._infoRecord[this.index][LimitPackInfoFields.VipState] = 0;
                }
                //找到最小可购买等级
                if (info.length > 0) {
                    for (let j = 0; j < this._infoRecord.length; ++j) {
                        if (this._infoRecord[j][LimitPackInfoFields.level] == info[0][LimitPackInfoFields.level]) {
                            this.index = j;
                            break;
                        }
                    }
                }
            }
            this.refresh();
        }
    }
}