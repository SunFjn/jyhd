///<reference path="../config/recharge_cfg.ts"/>
///<reference path="../config/privilege_cfg.ts"/>
namespace modules.recharge {

    import Event = laya.events.Event;
    import CustomList = modules.common.CustomList;
    import VipModel = modules.vip.VipModel;
    import VipNewModel = modules.vip_new.VipNewModel;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import RechargeCfg = modules.config.RechargeCfg;
    import PrivilegeCfg = modules.config.PrivilegeCfg;

    export class RechargePanel extends ui.RechargeViewUI {
        private _list: CustomList;
        private _vipLevel: number;
        private _progressBar: ProgressBarCtrl;
        private _array: Array<number>;
        private _vipSort: Array<number>;
        private _listData: Array<Protocols.RechargeInfo>;
        private _type: number;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }

        protected onOpened() {
            super.onOpened();
            this._type = RechargeModel.instance.type;
            this.initPanel();
            this.updateRechargePanel();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._vipLevel = VipModel.instance.vipLevel;
            this._array = new Array<number>();
            this._vipSort = new Array<number>();
            this._listData = new Array<Protocols.RechargeInfo>();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.width = 640;
            this._list.height = 760;
            this._list.hCount = 3;
            this._list.vCount = 1;
            this._list.spaceY = 10;
            this._list.spaceX = 5;
            this._list.pos(65, 270);
            this._list.itemRender = RechargeItem;
            this.addChild(this._list);

            this._progressBar = new ProgressBarCtrl(this.proImg, this.proImg.width, this.vipExpTxt);
        }

        protected addListeners(): void {
            super.addListeners();
            this.closeBtn.on(Event.CLICK, this, this.close);
            this.vipBtn.on(Event.CLICK, this, this.openVipPanel);
            GlobalData.dispatcher.on(CommonEventType.UPDATE_RECHARGE_INFO, this, this.upateRecharge);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.closeBtn.off(Event.CLICK, this, this.close);
            this.vipBtn.off(Event.CLICK, this, this.openVipPanel);
            GlobalData.dispatcher.off(CommonEventType.UPDATE_RECHARGE_INFO, this, this.upateRecharge);
        }

        private openVipPanel(): void {
            if (modules.vip.VipModel.instance.vipLevel >= 1) {
                WindowManager.instance.open(WindowEnum.VIP_PANEL);
            }
            else {
                WindowManager.instance.open(WindowEnum.VIP_NEW_PANEL);
            }
        }

        private upateRecharge(): void {
            this.initPanel();
            this.updateRechargePanel();

        }

        private updateRechargePanel(): void {
            this.listData(this._listData, this._type);
            this._list.datas = this._listData;
        }

        private initPanel(): void {
            if (VipModel.instance.vipLevel >= 1) {
                if (VipModel.instance.vipLevel < PrivilegeCfg.instance.getVipMaxLevel()) {
                    this._progressBar.maxValue = VipModel.instance.needNum;
                    this.tipBox.visible = true;
                    this.txtImg.visible = true;
                    this.needMoneyTxt.text = `${(VipModel.instance.needNum - VipModel.instance.haveNum)}元`;
                    this.nextVipLvTxt.text = `SVIP${VipModel.instance.vipLevel + 1}`;
                    this.needMoneyTxt.width = this.needMoneyTxt.textWidth;
                    this.nextVipLvTxt.width = this.nextVipLvTxt.textWidth;

                    modules.common.CommonUtil.chainArr([this.tipTxt_0, this.needMoneyTxt, this.tipTxt_1, this.nextVipLvTxt]);
                } else {
                    this.tipBox.visible = false;
                    this._progressBar.maxValue = VipModel.instance.haveNum;
                }
                this._progressBar.value = VipModel.instance.haveNum;
                this.vipBg.skin = `recharge/image_svip_dt.png`;
                this.vipBg.pos(45, 139);
                this.vipLevel.value = VipModel.instance.vipLevel.toString();
            }
            else {
                if (VipNewModel.instance.vipLevel < PrivilegeCfg.instance.getVipFMaxLevel()) {
                    this._progressBar.maxValue = VipNewModel.instance.needNum;
                    this.tipBox.visible = true;
                    this.txtImg.visible = true;
                    this.needMoneyTxt.text = `${(VipNewModel.instance.needNum - VipNewModel.instance.haveNum)}元`;
                    let vipLevel = VipNewModel.instance.vipLevel + 1;
                    vipLevel = vipLevel > VipNewModel.instance.maxVipLevel ? VipNewModel.instance.maxVipLevel - 50 : vipLevel - 50
                    this.nextVipLvTxt.text = `VIP${vipLevel}`;
                    this.needMoneyTxt.width = this.needMoneyTxt.textWidth;
                    this.nextVipLvTxt.width = this.nextVipLvTxt.textWidth;

                    modules.common.CommonUtil.chainArr([this.tipTxt_0, this.needMoneyTxt, this.tipTxt_1, this.nextVipLvTxt]);
                } else {
                    this.tipBox.visible = false;
                    this._progressBar.maxValue = VipNewModel.instance.haveNum;
                }
                this._progressBar.value = VipNewModel.instance.haveNum;
                this.vipBg.skin = `recharge/image_vip_dt.png`;
                this.vipBg.pos(46, 132);
                this.vipLevel.value = VipNewModel.instance.getVipLevelTrue().toString();
            }


            this._array.length = 0;
            this._vipSort.length = 0;
            this._listData.length = 0;
            this.getType(this._array, this._vipSort);
        }

        //获取充值档位
        private getType(arr: Array<number>, viplevel: Array<number>): void {
            let array: Array<Configuration.recharge> = RechargeCfg.instance.onSaleArr;

            for (let i: number = 0; i < array.length; i++) {
                arr.push(array[i][Configuration.rechargeFields.index]);
            }
            //获取普通档位排序
            for (let j: number = 0, len: number = PrivilegeCfg.instance.getCfgByType(VipModel.instance.vipLevel)[Configuration.privilegeFields.rechargesort].length; j < len; j++) {
                viplevel.push(PrivilegeCfg.instance.getCfgByType(VipModel.instance.vipLevel)[Configuration.privilegeFields.rechargesort][j]);
            }

        }

        //list数据
        private listData(listData: Array<Protocols.RechargeInfo>, type: number): void {
            listData.length = 0;
            //特卖档位
            for (let i: number = 0; i < this._array.length; i++) {
                let index: number = this._array[i];
                let count: number = RechargeModel.instance.getRechargeCountByIndex(index);
                let rechCfg: Configuration.recharge = RechargeCfg.instance.getRecharCfgByIndex(index);
                if (count && count > 0 && rechCfg[Configuration.rechargeFields.visible] === 0) {

                } else {
                    listData.push([this._array[i], count]);
                    if (listData.length === 6) break;
                }
            }
            //普通档位
            for (let j: number = 0; j < this._vipSort.length; j++) {
                let buyCount: number = RechargeModel.instance.getRechargeCountByIndex(this._vipSort[j]);
                listData.push([this._vipSort[j], buyCount || 0]);
            }
        }
    }
}