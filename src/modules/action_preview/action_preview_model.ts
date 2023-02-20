/** */
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/action_preview_cfg.ts"/>
namespace modules.action_preview {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import AcitonPreviewCfg = modules.config.AcitonPreviewCfg;
    import action_preview = Configuration.action_preview;
    import action_previewFields = Configuration.action_previewFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import Point = Laya.Point;
    import Dictionary = Laya.Dictionary;

    export class actionPreviewModel {
        private static _instance: actionPreviewModel;
        public static get instance(): actionPreviewModel {
            return this._instance = this._instance || new actionPreviewModel();
        }

        private _selectedActionID: int;//當前選中的功能id
        public _selectedActionIndex: int;//
        private _actionIDList: Array<number>;//
        private _actionPreviewAllDate: Array<action_preview>;//数据列表
        public _posSprite: Dictionary;//数据列表
        public _action_previewDate: action_preview;//记录不在挂机场景开启的功能
        public _tianGuaIsUp: boolean = false;//记录天关是否过挂

        public _allState: Array<any> = new Array<any>();//是否有开启表里的功能开启 vip是否升级 挂机手机是否提升

        constructor() {
            let _AllArray: Array<action_preview> = AcitonPreviewCfg.instance.get_arr();
            this._actionPreviewAllDate = _AllArray;
            this._actionIDList = new Array<number>();
            this._posSprite = new Dictionary();
        }

        public get activityAllDate(): Array<action_preview> {
            return this._actionPreviewAllDate;
        }

        public get selectedActionID(): int {
            return this._selectedActionID;
        }

        public set selectedActionID(value: int) {
            this._selectedActionID = value;
            GlobalData.dispatcher.event(CommonEventType.ACTION_PREVIEW_AWARD_UPDATE);
        }

        public get actionIDList(): Array<number> {
            return this._actionIDList;
        }

        public set actionIDList(value: Array<number>) {
            this._actionIDList = value;
            this.showRp();
        }

        /**
         * 根据功能id获取需要飞入的点
         */
        public getPosSprite(id: number): Point {
            return this._posSprite.get(id);
        }
        /**
         * 如果存的是
         */
        public getPosSpriteAny(id: number): any {
            return this._posSprite.get(id);
        }
        /**
         * 该功能是否已领取
         */
        public isHave(id: number): boolean {
            for (let index = 0; index < this.actionIDList.length; index++) {
                let element = this.actionIDList[index];
                if (element == id) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 该功能是否 在 活动预览表内
         */
        public isHaveAction(id: number): action_preview {
            for (let index = 0; index < this._actionPreviewAllDate.length; index++) {
                let element = this._actionPreviewAllDate[index][action_previewFields.id];
                if (element == id) {
                    return this._actionPreviewAllDate[index];
                }
            }
            return undefined;
        }

        /**
         * 0已领取 1未激活 2 可领取
         * @param element
         */
        public getState(element: action_preview): number {
            let funcId: number = element[action_previewFields.id];
            if (funcId !== ActionOpenId.begin) {  // 判断功能是否开启
                if (!FuncOpenModel.instance.getFuncIsOpen(funcId)) {
                    return 1;
                }
            }
            let typeNum = element[action_previewFields.id];
            let stateNum = 2;
            if (this.isHave(typeNum)) {
                stateNum = 0;
            }
            return stateNum;
        }

        /**
         * 判断红点
         */
        public showRp() {
            for (let index = 0; index < this._actionPreviewAllDate.length; index++) {
                let element = this._actionPreviewAllDate[index];
                let num = this.getState(element);
                if (num == 2) {
                    RedPointCtrl.instance.setRPProperty("actionPreviewEnterRP", true);
                    return;
                }
            }
            RedPointCtrl.instance.setRPProperty("actionPreviewEnterRP", false);
        }

        /**
         * 获取 第一个可以领取的 下标 如果没有默认0
         */
        public getIsKeLingQuIndex(): number {
            for (let index = 0; index < this._actionPreviewAllDate.length; index++) {
                let element = this._actionPreviewAllDate[index];
                let num = this.getState(element);
                if (num == 2) {
                    let id = element[action_previewFields.id];
                    if (id) {
                        return id;
                    }
                }
            }
            for (let index = 0; index < this._actionPreviewAllDate.length; index++) {
                let element = this._actionPreviewAllDate[index];
                let num = this.getState(element);
                if (num == 1) {
                    let id = element[action_previewFields.id];
                    if (id) {
                        return id;
                    }
                }
            }
            return 0;
        }

        /**
         * 获取第一个还未开启的功能数据(用于入口处图标更换)
         */
        public getNotActionDate(): action_preview {
            for (let index = 0; index < this._actionPreviewAllDate.length; index++) {
                let element = this._actionPreviewAllDate[index];
                let num = this.getState(element);
                if (num == 1) {
                    return element;
                }
            }
            return this._actionPreviewAllDate[this._actionPreviewAllDate.length - 1];
        }

        /**
         * 判断是否所有奖励都已经领取  (用于是否显示入口)
         */
        public isNotAward(): boolean {
            for (let index = 0; index < this._actionPreviewAllDate.length; index++) {
                let element = this._actionPreviewAllDate[index][action_previewFields.id];
                if (!this.isHave(element)) {
                    return false;
                }
            }
            return true;
        }
    }
}