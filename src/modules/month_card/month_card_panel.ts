///<reference path="../config/privilege_cfg.ts"/>
///<reference path="../config/recharge_cfg.ts"/>

namespace modules.monthCard {
    import MonthCardViewUI = ui.MonthCardViewUI;
    import Event = laya.events.Event;
    import CustomList = modules.common.CustomList;
    import PrivilegeCfg = modules.config.PrivilegeCfg;
    import GetMonthCardInfoReply = Protocols.GetMonthCardInfoReply;
    import GetMonthCardInfoReplyFields = Protocols.GetMonthCardInfoReplyFields;
    import recharge = Configuration.recharge;
    import RechargeCfg = modules.config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import privilege = Configuration.privilege;
    import privilegeFields = Configuration.privilegeFields;
    import PrivilegeNode = Configuration.PrivilegeNode;
    import PrivilegeNodeFields = Configuration.PrivilegeNodeFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;

    export class MonthCardPanel extends MonthCardViewUI {

        private _getWardItemlist: CustomList;
        private _info: GetMonthCardInfoReply;
        private _btnClip:CustomClip;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._getWardItemlist) {
                this._getWardItemlist.removeSelf();
                this._getWardItemlist.destroy();
                this._getWardItemlist = null;
            }
            if(this._btnClip){
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip=null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

            this._getWardItemlist = new CustomList();
            this._getWardItemlist.scrollDir = 1;
            this._getWardItemlist.width = 656;
            this._getWardItemlist.height = 670;
            this._getWardItemlist.hCount = 1;
            this._getWardItemlist.vCount = 1;
            this._getWardItemlist.spaceY = 5;
            this._getWardItemlist.pos(40, 320);
            this._getWardItemlist.itemRender = MonthCardItem;
            this.addChild(this._getWardItemlist);

            this.tipTxt.color = "#393939";
            this.tipTxt.style.fontFamily = "SimHei";
            this.tipTxt.style.fontSize = 24;
            this.tipTxt.style.align = "center";
            // this.tipTxt.style.lineHeight = 28;
            this.tipTxt.mouseEnabled = false;

            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.buyBtn.addChild(this._btnClip);
            this._btnClip.pos(-7, -15);
            this._btnClip.scaleY = 1.1;

        }

        protected addListeners(): void {
            super.addListeners();
            this.buyBtn.on(Event.CLICK, this, this.buyClickHandler);
            GlobalData.dispatcher.on(CommonEventType.GET_MONTH_CARD_INFO_REPLY, this, this.update);
            GlobalData.dispatcher.on(CommonEventType.UPDATE_MONTH_CARD_INFO, this, this.update);
        };

        protected removeListeners(): void {
            super.removeListeners();
            this.buyBtn.off(Event.CLICK, this, this.buyClickHandler);
            GlobalData.dispatcher.off(CommonEventType.GET_MONTH_CARD_INFO_REPLY, this, this.update);
            GlobalData.dispatcher.off(CommonEventType.UPDATE_MONTH_CARD_INFO, this, this.update);
        }

        protected onOpened() {
            super.onOpened();
            this._btnClip.play();
            this.update();
        }

        private buyClickHandler(): void {
            let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(1);
            PlatParams.askPay(cfg[rechargeFields.index], cfg[rechargeFields.price]);
            // WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
        }

        private update(): void {
            let info: GetMonthCardInfoReply = MonthCardModel.instance.MonthCardInfoReply;
            if (!info) {
                this.removeChild(this._getWardItemlist);
                return;
            } else {
                this.addChild(this._getWardItemlist);
            }

            let tCfg: privilege = PrivilegeCfg.instance.getCfgByType(101);
            let rewardArr:Array<Items>= RechargeCfg.instance.getRecharCfgByIndex(1)[rechargeFields.reward];
            let nodes: Array<PrivilegeNode> = tCfg[privilegeFields.nodes];
            if (info[GetMonthCardInfoReplyFields.flag] === 0) {     // 0未开启 1开启
                this.img1.visible = true;
                this.img2.visible = false;
                this.img3.visible = true;
                for (let i: int = 0, len: int = nodes.length; i < len; i++) {
                    if (nodes[i][PrivilegeNodeFields.type] === Privilege.openReward) {
                        this.tipTxt.innerHTML = `现在购买立即获得<span style="color:#168b17">${nodes[i][PrivilegeNodeFields.param2]}&nbsp;</span><img src='common/icon_tongyong_2.png'/>、<span style="color:#168b17">${rewardArr[0][ItemsFields.count]}&nbsp;</span><img src='common/shenghuyu.png'/>`;
                        break;
                    }
                }
                let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(1);
                this.buyBtn.label = `${cfg[rechargeFields.price]}元抢购`;
                this.buyBtn.visible = true;
            } else {
                this.img1.visible = false;
                this.img2.visible = true;
                this.img3.visible = false;
                let arr: Array<[number, number]> = [];       // 已领
                let arr1: Array<[number, number]> = [];      // 未领
                for (let i: int = 0, len: int = info[GetMonthCardInfoReplyFields.rewardList].length; i < len; i++) {
                    if (info[GetMonthCardInfoReplyFields.rewardList][i] === 2) {
                        arr.push([i, info[GetMonthCardInfoReplyFields.rewardList][i]]);
                    } else {
                        arr1.push([i, info[GetMonthCardInfoReplyFields.rewardList][i]]);
                    }
                }
                arr = arr1.concat(arr);
                this._getWardItemlist.datas = arr;

                let goldPerDay: number = 0;
                for (let i: int = 0, len: int = nodes.length; i < len; i++) {
                    if (nodes[i][PrivilegeNodeFields.type] === Privilege.goldPerDay) {
                        goldPerDay = nodes[i][PrivilegeNodeFields.param2];
                        break;
                    }
                }
                // 今日是否已领
                let t: number = info[GetMonthCardInfoReplyFields.rewardList][30 - info[GetMonthCardInfoReplyFields.restDay]] === 2 ? 1 : 0;
                let addCount: number = info[GetMonthCardInfoReplyFields.addCount];
                if (addCount > 0) {
                    let days: number = addCount * 30 + info[GetMonthCardInfoReplyFields.restDay];
                    this.tipTxt.innerHTML = `剩余1个月零<span style="color:#168A17">${info[GetMonthCardInfoReplyFields.restDay]}天</span>，可领<span style="color:#168A17">${(days - t) * goldPerDay}</span>代币券<br/>(当前月卡结束后自动激活下个月卡)`;
                    this.buyBtn.visible = this._btnClip.visible=false;
                } else {
                    let days: number = info[GetMonthCardInfoReplyFields.restDay];
                    let tipDayNum: int = BlendCfg.instance.getCfgById(10901)[blendFields.intParam][0];
                    if (days > tipDayNum) {
                        this.tipTxt.innerHTML = `剩余<span style="color:#168A17">${days}天</span>，可领<span style="color:#168A17">${(days - t) * goldPerDay}</span>代币券`;
                        this.buyBtn.visible = this._btnClip.visible= false;
                    } else {
                        this.tipTxt.innerHTML = `剩余<span style="color:#FF3E3E">${days}天</span>，可领<span style="color:#168A17">${(days - t) * goldPerDay}</span>代币券<span style="color:#FF3E3E">(月卡即将到期)</span>`;
                        this.buyBtn.visible = this._btnClip.visible= true;
                        this.buyBtn.label = "续费";
                    }
                }
            }
        }
    }
}