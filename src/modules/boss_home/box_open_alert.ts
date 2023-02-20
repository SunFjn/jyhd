/**Boss之家珍宝箱子打开弹窗 */


///<reference path="../npc/npc_ctrl.ts"/>

namespace modules.bossHome {
    import BoxOpenAlertUI = ui.BoxOpenAlertUI;
    import Item = Protocols.Item;
    import scene_home_boss = Configuration.scene_home_boss;
    import scene_home_bossFields = Configuration.scene_home_bossFields;
    import Items = Protocols.Items;
    import ItemsFields = Protocols.ItemsFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import BagModel = modules.bag.BagModel;
    import BaseItem = modules.bag.BaseItem;
    import GameCenter = game.GameCenter;
    import Property = game.role.Property;
    import NpcCtrl = modules.npc.NpcCtrl;
    import SceneHomeBossCfg = modules.config.SceneHomeBossCfg;
    import BagUtil = modules.bag.BagUtil;
    import CommonUtil = modules.common.CommonUtil;
    import LayaEvent = modules.common.LayaEvent;

    export class BoxOpenAlert extends BoxOpenAlertUI {

        private _showAward: Array<BaseItem>;
        private _bossCfg: scene_home_boss;
        private _commonCostNum: number;
        private _reviveTime: number;
        private _bigCostItemId: number;
        private _bigCostNeed: number;
        private _targetProperty: Property;

        protected initialize(): void {
            super.initialize();
            this._showAward = new Array<BaseItem>();
            this.initAward();
        }

        public destroy(): void {
            this._showAward = this.destroyElement(this._showAward);
            super.destroy();
        }

        private initAward(): void {
            for (let i = 0; i < 6; i++) {
                this._showAward[i] = new BaseItem();
                this.addChild(this._showAward[i]);
                let x = 72 + i * 90;
                this._showAward[i].pos(x, 250);
                this._showAward[i].scale(0.8, 0.8);
                this._showAward[i].dataSource = null;
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.addBtn, LayaEvent.CLICK, this, this.addTimesHandler);
            this.addAutoListener(this.commonBtn, LayaEvent.CLICK, this, this.commonBtnHandler);
            this.addAutoListener(this.bigBtn, LayaEvent.CLICK, this, this.bigBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BOSS_HOME_UPDATE_TIMES, this, this.updateTimes);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateTimes);
        }

        protected resetTarget(target: Property): void {
            if (this._targetProperty != null) {
                this._targetProperty
                    .off("destroyed", this, this.close);
            }
            this._targetProperty = target;
            if (this._targetProperty != null) {
                this._targetProperty
                    .on("destroyed", this, this.close);
            }
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            if (!value) {
                return;
            }

            let role = GameCenter.instance.getRole(value);
            if (role == null) {
                this.close();
                return;
            }

            this.resetTarget(role.property);
            this._bossCfg = SceneHomeBossCfg.instance.getCfgByNpcId(this._targetProperty.get("occ"));
            let arr: Array<Items> = this._bossCfg[scene_home_bossFields.boxAwardTips];
            //根据index获得对应箱子内容,重新设置数据
            for (let i = 0; i < 6; i++) {
                let data: Item = [arr[i][ItemsFields.ItemId], arr[i][ItemsFields.count], 0, null];
                this._showAward[i].dataSource = data;
            }
            this._commonCostNum = BlendCfg.instance.getCfgById(10602)[blendFields.intParam][0];
            this.commonCost.text = this._commonCostNum.toString();
            this._bigCostNeed = BlendCfg.instance.getCfgById(10603)[blendFields.intParam][1];
            this._bigCostItemId = BlendCfg.instance.getCfgById(10603)[blendFields.intParam][0];
            if (CommonUtil.getItemCfgById(this._bigCostItemId)) {
                this.bigIcon.skin = CommonUtil.getIconById(this._bigCostItemId);
            }
            this.updateTimes();
            let liveTime = this._targetProperty.get("liveTime") || 0;
            Laya.timer.clear(this, this.loopHandler);
            this._reviveTime = liveTime;
            let time = this._reviveTime - GlobalData.serverTime;
            this.setTime(time);
            this.remainTime.visible = true;
            Laya.timer.loop(1000, this, this.loopHandler);

            // let temp = SceneCtrl.instance.getNpcIdInfoByType(2);
            // if (temp && temp.length > 0) {
            //     Laya.timer.clear(this, this.loopHandler);
            //     let data: [number, number] = temp[0];
            //     this._reviveTime = data[1];
            //     this._boxId = data[0];
            //     let time = this._reviveTime - GlobalData.serverTime;
            //     this.setTime(time);
            //     this.remainTime.visible = true;
            //     Laya.timer.loop(1000, this, this.loopHandler);
            // }
            // else {
            //     this.close();
            // }
        }

        private updateTimes(): void {
            let remain = BossHomeModel.instance.remainTimes;//读取剩余次数
            this.remainTimes.text = `剩余次数:${remain}`;
            let bigCostHave = BagModel.instance.getItemCountById(this._bigCostItemId);
            let len = (4 - bigCostHave.toString().length) * 12;
            this.bigCostHave.text = bigCostHave.toString();
            this.bigCostNeed.text = '/' + this._bigCostNeed;
            this.bigCostHave.x = 452 - len;
            this.bigCostNeed.x = 504 - len;
            if (bigCostHave < this._bigCostNeed) {
                this.bigCostHave.color = '#e6372e';
            } else {
                this.bigCostHave.color = '#2d2d2d';
            }
        }

        private loopHandler(): void {
            let time = this._reviveTime - GlobalData.serverTime;
            if (time <= 0) {
                this.remainTime.visible = false;
                Laya.timer.clear(this, this.loopHandler);
                this.close();
                return;
            }
            this.setTime(time);
        }

        private setTime(time: number): void {
            let hour = Math.floor(time / (60 * 60 * 1000));
            let miuter = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
            let sec = Math.floor((time % (60 * 1000)) / 1000);
            this.remainTime.text = this.formateData(hour) + ":" + this.formateData(miuter) + ":" + this.formateData(sec);
        }

        private formateData(input: number): string {
            let str: string = "";
            let t = input.toString();
            if (t.length < 2) {
                str = "0" + t;
                return str;
            }
            return t;
        }

        //增加次数按钮
        private addTimesHandler(): void {
            WindowManager.instance.openDialog(WindowEnum.VIP_TIMES_ALERT, Privilege.homeBossRewardCount);
        }

        //普通开启按钮
        private commonBtnHandler(): void {
            //发送请求，普通开启
            if (BossHomeModel.instance.remainTimes > 0) {
                // 检测是否需要熔炼
                if (!BagUtil.checkNeedSmeltTip()) {
                    let awardAlert = WindowManager.instance.getDialogById(WindowEnum.BOX_AWARD_ALERT);
                    if (awardAlert != null) {
                        awardAlert.close();
                    }
                    NpcCtrl.instance.gather(this._targetProperty.get("id"), 0);
                }
            } else {
                WindowManager.instance.openDialog(WindowEnum.VIP_TIMES_ALERT, Privilege.homeBossRewardCount);
            }
        }

        public onClosed(): void {
            super.onClosed();
            Laya.timer.clear(this, this.loopHandler);
            this.resetTarget(null);
        }

        //至尊开启按钮
        private bigBtnHandler(): void {
            //发送请求，至尊开启
            if (BossHomeModel.instance.remainTimes > 0) {
                // 检测是否需要熔炼
                if (!BagUtil.checkNeedSmeltTip()) {
                    let awardAlert = WindowManager.instance.getDialogById(WindowEnum.BOX_AWARD_ALERT);
                    if (awardAlert != null) {
                        awardAlert.close();
                    }
                    let bigCostHave = BagModel.instance.getItemCountById(this._bigCostItemId);
                    if (bigCostHave >= this._bigCostNeed) {
                        NpcCtrl.instance.gather(this._targetProperty.get("id"), 1);
                    } else {
                        BagUtil.openLackPropAlert(this._bigCostItemId, 1);
                    }
                }
            } else {
                WindowManager.instance.openDialog(WindowEnum.VIP_TIMES_ALERT, Privilege.homeBossRewardCount);
            }
        }
    }
}