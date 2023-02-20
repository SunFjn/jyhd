/*九霄令激活九霄金令弹窗*/
///<reference path="./jiuxiaoling_award_cfg.ts"/>
namespace modules.jiuxiaoling {
    import JiuXiaoLingActivteGoldAlertUI = ui.JiuXiaoLingActivteGoldAlertUI;
    import CustomList = modules.common.CustomList;
    import jiuXiaoLingAward = Configuration.jiuXiaoLingAward;
    import jiuXiaoLingAwardFields = Configuration.jiuXiaoLingAwardFields;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import BaseItem = modules.bag.BaseItem;
    import JiuXiaoLingAwardCfg = modules.config.JiuXiaoLingAwardCfg;
    import RechargeCfg = modules.config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;

    export class JiuXiaoLingActivteGoldAlert extends JiuXiaoLingActivteGoldAlertUI {
        private _list: CustomList;
        // private _modelClip: AvatarClip;
        private _skeletonClip: SkeletonAvatar;

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.width = 575;
            this._list.height = 295;
            this._list.spaceX = 8;
            this._list.hCount = 5;
            this._list.itemRender = BaseItem;
            this._list.x = 70;
            this._list.y = 395;
            this._list.zOrder = 10;
            this._list.selectedIndex = -1;
            
            this.addChildAt(this._list, 1);
            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.y = 370;
            this._skeletonClip.centerX = 0;
            this._skeletonClip.zOrder = 5;
       

            
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.btn, Laya.Event.CLICK, this, this.activateBtnHandler);


        }

        public onOpened(): void {
            super.onOpened();
            this.updateShow();
        }

        private showAwardModel() {
            // this._modelClip = AvatarClip.create(1024, 1024, 1024);
            // this.addChildAt(this._modelClip, 2);
            // this._modelClip.anchorX = 0.5;
            // this._modelClip.anchorY = 0.5;
            // this._modelClip.centerX = 0;
            // this._modelClip.zOrder = 2;
       
            let final_award: Items = JiuXiaoLingAwardCfg.instance.getFinalAward();
            let itemCfg = CommonUtil.getItemCfgById(final_award[ItemsFields.itemId])
            let modelCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(itemCfg[item_materialFields.showId]);
            // this._modelClip.y = 420;
            // this._modelClip.avatarRotationX = modelCfg[ExteriorSKFields.rotationX];
            // this._modelClip.avatarRotationY = modelCfg[ExteriorSKFields.rotationY];
            // this._modelClip.avatarScale = modelCfg[ExteriorSKFields.scale] ? modelCfg[ExteriorSKFields.scale] : 1;
            // this._modelClip.avatarY = modelCfg[ExteriorSKFields.deviationY];
            // this._modelClip.avatarX = modelCfg[ExteriorSKFields.deviationX];
            // this._modelClip.reset(modelCfg[ExteriorSKFields.id]);
            // this._modelClip.setActionType(ActionType.SHOW);
            // this._modelClip.visible = true;
            this._skeletonClip.reset(0,0,0,0,0,modelCfg[ExteriorSKFields.id]);
            this._skeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.DAIJI);
            this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.5);
            this._skeletonClip.visible = true;
            // 领取的奖励的名字
            this.awardTxt.text = modelCfg[ExteriorSKFields.name];
            this.levelTxt.text = `${JiuXiaoLingAwardCfg.instance.level}级即可领取`;

            this.finalTxt.text = modelCfg[ExteriorSKFields.name];
            this.finalDescTxt.innerHTML = `<div style="fontSize:23; color:white; width:200px;">达到最高等级可获得<span style="color:orange">SSSR</span><span style="color:white">绝版外显</span><span style="color:orange">${modelCfg[ExteriorSKFields.name]}</span></div>`;
        }

        private updateShow() {
            let datas = JiuXiaoLingModel.instance.getPreviewAwardList();
            this._list.datas = datas[1];
            this.showAwardModel();
        }


        //激活
        private activateBtnHandler(): void {
            PlatParams.askPay(140, RechargeCfg.instance.getRecharCfgByIndex(140)[rechargeFields.price]);
        }

        public close(): void {
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
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
            this._list = this.destroyElement(this._list);
        }

    }
}