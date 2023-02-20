///<reference path="./zhizun_model.ts"/>
/** 至尊特权面板 */
namespace modules.zhizun {
    import CommonEventType = modules.common.CommonEventType;
    import PrivilegeCfg = modules.config.PrivilegeCfg;
    import ZhizunModel = modules.zhizun.ZhizunModel;
    import CommonUtil = modules.common.CommonUtil;
    import BlendCfg = modules.config.BlendCfg;
    import ZhizunViewUI = ui.ZhizunViewUI;
    import privilege = Configuration.privilege;
    import privilegeFields = Configuration.privilegeFields;
    import RechargeCfg = modules.config.RechargeCfg;
    import recharge = Configuration.recharge;
    import rechargeFields = Configuration.rechargeFields;
    import DesignationCfg = modules.config.DesignationCfg;
    import designationFields = Configuration.designationFields;
    import CustomSlide = common.CustomSlide;
    import CustomClip = modules.common.CustomClip;
    import EquipLightItem = modules.equipSuit.EquipLightItem
    import LightState = modules.equipSuit.LightState
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class ZhizunPanel extends ZhizunViewUI {

        private _isCan: boolean;
        private _btnClip: CustomClip;
        private _items: EquipLightItem[];
        private _skeletonClip: SkeletonAvatar;
        /**
        * 装备位置
        */
        private _equipsPos: Point[];
        constructor() {
            super();
        }


        protected initialize(): void {
            super.initialize();

            this.createAvatar();
            this._equipsPos = []
            let temp = this.equip_parent._childs as Laya.Image[]
            temp.forEach(element => {
                let temp: Point = { x: element.x, y: element.y }
                this._equipsPos.push(temp)
            });

            let fight: number = BlendCfg.instance.getCfgById(43001)[Configuration.blendFields.intParam][0];
            this.fightMsz.value = fight.toString();

            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.btn.addChild(this._btnClip);
            this._btnClip.pos(-5, -22);
            this._btnClip.scale(1.23, 1.3);
            this._btnClip.visible = false;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.closeBtn, common.LayaEvent.CLICK, this, this.closeDilog);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHIZUN_UPDATE, this, this.updateView);
            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public destroy(): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            super.destroy();
        }

        public onOpened(): void {
            super.onOpened();
            this._btnClip.play();
            this.showSk()
            ZhizunCtrl.instance.getZhizunCardInfo();
            this.updateView();
        }
        private createAvatar() {
            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.pos(160, 1050, true);
            this._skeletonClip.scale(1.75, 1.75);//统一进行一次缩放来控制大小
            this._skeletonClip.zOrder = 0;
        }
        private showSk() {
            // 这里直接展示在第一个位置，不区分部位
            this._skeletonClip.reset(2013);
            this._skeletonClip.resetOffset(AvatarAniBigType.clothes, 0, 0);
            this._skeletonClip.resetScale(AvatarAniBigType.clothes, 1);
        }
        private updateView(): void {
            let restDay: number = ZhizunModel.instance.restDay;
            if (restDay == null) return;

            let state: number = ZhizunModel.instance.state;
            if (state) { //特权开启
                let restDay: number = ZhizunModel.instance.restDay;
                let termDay: number = BlendCfg.instance.getCfgById(10951)[Configuration.blendFields.intParam][0];
                let count: number = ZhizunModel.instance.count;
                // if (count > 0) { //续费过
                //     this.dayTxt.text = `特权剩余1个月零${restDay}天!`;
                // } else {
                //     this.dayTxt.text = `特权剩余${restDay}天!`;
                // }
                if (restDay <= termDay && !count) { //达到续费条件
                    this._isCan = true;
                    this.btn.visible = this._btnClip.visible = true;
                    this.goneImg.visible = false;
                    this.btn.label = `续费`;
                } else { // 不可续费
                    this._isCan = false;
                    this.btn.visible = this._btnClip.visible = false;
                    this.goneImg.visible = true;
                    this.btn.label = `已激活`;
                }

                this.active_panel.visible = true;
                this.noActive_panel.visible = false;
                this.closeShowEquip()
            } else { //未开启

                this.active_panel.visible = false;
                this.noActive_panel.visible = true;
                let termDay: number[] = BlendCfg.instance.getCfgById(43003)[Configuration.blendFields.intParam];


                this.showEquip([termDay[0], termDay[2], termDay[4]], [termDay[1], termDay[3], termDay[5]])

                this._isCan = true;
                this.btn.visible = true;
                this._btnClip.visible = true;
                this.goneImg.visible = false;
                // this.dayTxt.text = `早买早享受~~特权持续30天!`;
                this.btn.label = `98元即享`;
            }
        }




        public close(): void {
            super.close();

        }
        private closeDilog() {
            console.log("closeDilog")
            WindowManager.instance.closeAllDialog()
        }
        /**
        * 展示赠送装备
        */
        private showEquip(equipIds: number[], counts: number[]) {
            this._items = []
            for (let i = 0; i < 3; i++) {
                let item: EquipLightItem = new EquipLightItem();
                this.addChild(item);
                item.pos(this._equipsPos[i].x, this._equipsPos[i].y);
                item.scale(0.8, 0.8)
                this._items.push(item)
            }
            for (let i = 0; i < equipIds.length; i++) {
                this._items[i].dataSource = [equipIds[i], 1, 0, null]
                this._items[i].state = LightState.yet;
                this._items[i].setNum(counts[i] + "")
            }
        }
        /**
         * 关闭赠送装备展示
         */
        private closeShowEquip() {
            if (!this._items) {
                return
            }
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].removeSelf()
            }
        }
        private btnHandler(): void {
            if (this._isCan) {
                let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(RechargeId.zhizunCard);
                PlatParams.askPay(cfg[rechargeFields.index], cfg[rechargeFields.price]);
            } else {
                CommonUtil.noticeError(ErrorCode.ZhizunCardNotAdd);
            }
        }
    }
}