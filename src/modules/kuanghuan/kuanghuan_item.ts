///<reference path="../../ui/layaUI.max.all.ts"/>
///<reference path="../../../libs/generate/configuration.d.ts"/>
///<reference path="../../../libs/generate/protocols.d.ts"/>
///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../bag/bag_util.ts"/>
///<reference path="../common/custom_clip.ts"/>
///<reference path="../notice/system_notice_manager.ts"/>
/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.kuanghuan {
    import KuangHuanItemUI = ui.KuangHuanItemUI;
    import kuanghuan = Configuration.kuanghuan;
    import Items = Configuration.Items;
    import kuanghuanFields = Configuration.kuanghuanFields;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import KuanghuanNote = Protocols.KuanghuanNote;
    import KuanghuanNoteFields = Protocols.KuanghuanNoteFields;
    import KuanghuanTask = Protocols.KuanghuanTask;
    import KuanghuanTaskFields = Protocols.KuanghuanTaskFields;
    import Event = Laya.Event;
    import Item = Protocols.Item;
    import BagUtil = modules.bag.BagUtil;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class KuangHuanItem extends KuangHuanItemUI {
        /*全民狂欢配置*/
        private _cfg: kuanghuan;
        /*任务ID*/
        private _taskId: number;
        /*狂欢类型(1-8)*/
        private _type: number;
        /*任务名*/
        private _name: string;
        /*达成条件*/
        private _condition: number;
        /*跳转功能Id*/
        private _skipActionId: number;
        /*任务描述*/
        private _describe: string;
        /*流光特效*/
        private _btnClip: CustomClip;
        private _taskList: Array<KuanghuanTask>;
        /*按钮状态*/
        private getState: number;
        /*进度参数*/
        private _param: number;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {

            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            //this.WholeText.color = "#b15315";
            this.WholeText.style.fontFamily = "SimHei";
            this.WholeText.style.fontSize = 26;
            this.creatEffect();
        }

        protected addListeners(): void {
            super.addListeners();
            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_FIGHT, this, this._updateView);
            // this.addAutoListener();
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.sureBtn.off(Event.CLICK, this, this.sureBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();
            this._btnClip.play();
        }

        private _updateView(): void {
            if (this._type == 9) {
                this.showUI();
            }
        }

        protected setData(value: any): void {
            this._cfg = value as kuanghuan;
            this.showUI();
        }

        /**
         * showUI
         */
        public showUI() {
            let awardArr: Array<Items> = [];
            this._taskId = this._cfg[kuanghuanFields.taskId];
            this._type = this._cfg[kuanghuanFields.type];
            this._name = this._cfg[kuanghuanFields.name];
            this._condition = this._cfg[kuanghuanFields.condition];
            this._skipActionId = this._cfg[kuanghuanFields.skipActionId];
            this._describe = this._cfg[kuanghuanFields.describe];
            let showIdArr: number[] = [];
            this.WholeText.innerHTML = `${this._describe}，可领取！`;
            awardArr = this._cfg[kuanghuanFields.reward];
            for (let i: int = 0; i < awardArr.length; i++) {
                showIdArr.push(awardArr[i][ItemsFields.itemId]);
            }
            let count: number = showIdArr.length;
            let KuangHuanBase: modules.bag.BaseItem[] = [];
            KuangHuanBase.push(this.WholeItem1);
            KuangHuanBase.push(this.WholeItem2);
            KuangHuanBase.push(this.WholeItem3);
            KuangHuanBase.push(this.WholeItem4);
            for (let i: int = 0; i < 4; i++) {
                if (i < count) {
                    KuangHuanBase[i].visible = true;
                    KuangHuanBase[i].dataSource = [awardArr[i][ItemsFields.itemId], awardArr[i][ItemsFields.count], 0, null];
                } else {
                    KuangHuanBase[i].visible = false;
                }
            }
            let nodeList: Array<KuanghuanNote> = KuangHuanModel.instance.nodeList;
            for (let i: int = 0; i < nodeList.length; i++) {
                if (this._type == nodeList[i][KuanghuanNoteFields.type]) {
                    this._taskList = nodeList[i][KuanghuanNoteFields.taskList];
                }
            }
            if (this._taskList) {
                for (let i: int = 0; i < this._taskList.length; i++) {
                    if (this._taskId == this._taskList[i][KuanghuanTaskFields.taskId]) {
                        this.getState = this._taskList[i][KuanghuanTaskFields.state];
                        this._param = this._taskList[i][KuanghuanTaskFields.param];
                    }
                }
            }
            if (this._type === 9) {
                this._param = player.PlayerModel.instance.fight;
            }
            this.scheduleText.text = `(${this._param}/${this._condition})`;
            if (this._param >= this._condition) {
                this._param = this._condition;
                this.scheduleText.color = "#16ba17";
            } else {
                this.scheduleText.color = "#FF3e3e";
            }
            this.updateBtnState();
        }
        // 更新按钮状态
        private updateBtnState(): void {
            if (this.getState !== 0) {
                this.sureBtn.label = "领取";
                this.sureBtn.skin = "common/btn_tongyong_23.png";
                if (this.getState == 1) {
                    this._btnClip.visible = true;
                    this.sureBtn.visible = true;
                    this.receivedImg.visible = false;
                } else {
                    this.sureBtn.visible = false;
                    this.receivedImg.visible = true;
                }
            } else {
                if (this._skipActionId == 0) {
                    this.sureBtn.skin = "common/btn_tongyong_23.png";
                    this.sureBtn.label = "领取";
                } else {
                    this.sureBtn.skin = "common/btn_tongyong_24.png";
                    this.sureBtn.labelColors = "#465460";
                    this.sureBtn.label = "前往";
                }
                this.sureBtn.visible = true;
                this.receivedImg.visible = false;
                this._btnClip.visible = false;
            }
        }

        private sureBtnHandler(): void {
            if (this.getState == 0) {
                if (this._skipActionId == 0) {
                    SystemNoticeManager.instance.addNotice("条件不足，领取失败", true);
                } else {
                    WindowManager.instance.openByActionId(this._skipActionId);
                    WindowManager.instance.close(WindowEnum.KUANGHUAN_PANLE);
                }
            }
            if (this.getState == 1) {
                let rewards: Array<Items> = this._cfg[kuanghuanFields.reward];
                let items: Array<Item> = [];
                for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                    let item: Items = rewards[i];
                    items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                }
                if (BagUtil.canAddItemsByBagIdCount(items)) {
                    KuangHuanCtrl.instance.getKuangHuanReward([this._taskId]);
                }
            }
        }

        private creatEffect(): void {
            this._btnClip = new CustomClip();
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.play();
            this._btnClip.loop = true;
            this._btnClip.pos(-5, -10);
            this._btnClip.scale(0.8, 0.8);
            this._btnClip.visible = false;
        }

        public close(): void {
            super.close();
        }
    }
}