/*活动列表*/
///<reference path="../config/activity_all_cfg.ts"/>
///<reference path="../config/scene_copy_single_boss_cfg.ts"/>
///<reference path="../activity_all/activity_all_model.ts"/>
namespace modules.activity_all {
    import CustomList = modules.common.CustomList;
    import activity_all = Configuration.activity_all;
    import activity_allFields = Configuration.activity_allFields;
    import ActivityAllModel = modules.activity_all.ActivityAllModel;
    type BossStateInfo = [number, BossState];

    export class ActivityAllPanel extends ui.ActivityAllViewUI {
        private _list: CustomList;
        private _activityAllArray: Array<activity_all>;
        private _activityAllStateArray: Array<number>;

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._list = new CustomList();
            this._list.width = 710;
            this._list.height = 995;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.spaceY = 2;
            this._list.itemRender = ActivityAllItem;
            this._list.x = 15;
            this._list.y = 138;
            this.addChildAt(this._list, 3);
        }

        public onOpened(): void {
            super.onOpened();
            this.updateList();
        }

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            super.destroy(destroyChild);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_SCENE_STATE_UPDATE, this, this.updateList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_EVENT_UPDATE, this, this.updateList);
        }

        //排序
        private overSort(A: activity_all, B: activity_all): number {
            let A_state = ActivityAllModel.instance.getState(A);
            let B_state = ActivityAllModel.instance.getState(B);

            let A_sortID = A[activity_allFields.sortID];
            let B_sortID = B[activity_allFields.sortID];
            let returnNum = 1;
            if (A_state == B_state) {
                A_sortID < B_sortID ? returnNum = -1 : returnNum = 1;
            } else {
                A_state > B_state ? returnNum = -1 : returnNum = 1;
            }
            return returnNum;
        };

        private updateList(): void {
            if (ActivityAllModel.instance.activityAllDate == undefined) {
                return;
            }
            if (ActivityAllModel.instance.activityAllDate.length > 0) {
                ActivityAllModel.instance.activityAllDate.sort(this.overSort);
                this._list.datas = ActivityAllModel.instance.activityAllDate;
            }
        }
    }
}