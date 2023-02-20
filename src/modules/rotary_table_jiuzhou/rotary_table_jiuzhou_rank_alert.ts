///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/jz_duobao_reward_cfg.ts"/>
///<reference path="../config/jz_duobao_weight_cfg.ts"/>
namespace modules.rotary_table_jiuzhou {
    import JzDuobaoRewardCfg = modules.config.JzDuobaoRewardCfg;
    import jzduobao_reward = Configuration.jzduobao_reward;
    import jzduobao_rewardFields = Configuration.jzduobao_rewardFields;
    import CustomList = modules.common.CustomList;
    import Point = laya.maths.Point;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    export class RotaryTableJiuZhouRankAlert extends ui.RotaryTableRewardRankAlertUI {
        private _list: CustomList;
        private _pos: Point;
        private _type: number;
        constructor() {
            super();
        }
        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }
        protected initialize(): void {
            super.initialize();
            this._pos = new Point(60, 70);
            this._list = new CustomList();
            this._list.width = 593;
            this._list.height = 635;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.spaceY = 6;
            this._list.itemRender = RotaryTableJiuZhouRankItem;
            this._list.x = 33;
            this._list.y = 116;
            this.addChild(this._list);
        }
        public onOpened(): void {
            super.onOpened();
            this.titleTxt.text = "积分奖励";
            this.updateList();
        }
        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_JIUZHOU_UPDATE, this, this.updateList);
        }
        protected removeListeners(): void {
            super.removeListeners();
        }
        //排序
        private overSort(A: jzduobao_reward, B: jzduobao_reward): number {
            let A_grade = A[jzduobao_rewardFields.id];
            let B_grade = B[jzduobao_rewardFields.id];
            let A_state = RotaryTableJiuZhouModel.instance.getRewardStart(A_grade);
            let B_state = RotaryTableJiuZhouModel.instance.getRewardStart(B_grade);
            let returnNum = 1;
            if (A_state == B_state) {
                if (A_grade < B_grade) {
                    returnNum = -1;
                } else {
                    returnNum = 1;
                }
            } else {
                if (A_state == 2 && B_state != 2) {
                    returnNum = 1;
                } else if (A_state != 2 && B_state == 2) {
                    returnNum = -1;
                }
            }
            return returnNum;
        };
        /**
         * 根据当前对应活动类型 去拿对应的数据 判断活动的 开启,是|否进行中
         */
        public updateList(): void {
            let date: Array<jzduobao_reward> = JzDuobaoRewardCfg.instance.getDateArr();
            date.sort(this.overSort);
            this._list.datas = date;
            this.changDrawNum();
        }
        public changDrawNum() {
            let _money = BlendCfg.instance.getCfgById(15501)[blendFields.intParam];
            this.TipsText.text = `每次抽奖可获得10点积分,积分每日0点重置`;
        }
    }
}