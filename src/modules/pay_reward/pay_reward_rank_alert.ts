///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
namespace modules.pay_reward {
    import CustomList = modules.common.CustomList;
    import Point = laya.maths.Point;
    import PayRewardModel = modules.pay_reward.PayRewardModel;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import PayRewardCfg = modules.config.PayRewardCfg;
    import pay_reward_reward = Configuration.pay_reward_reward;
    import pay_reward_rewardFields = Configuration.pay_reward_rewardFields;

    export class PayRewardRankAlert extends ui.PayRewardRankAlertUI {
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
            this._list.width = 560;
            this._list.height = 713;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.itemRender = PayRewardRankItem;
            this._list.x = 48;
            this._list.y = 100;
            this.addChild(this._list);
        }

        public onOpened(): void {
            super.onOpened();
            this.titleTxt.text = "财富值奖励";
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
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PAYREWARD_UPDATE, this, this.updateList);

        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        //排序
        private overSort(A: pay_reward_reward, B: pay_reward_reward): number {
            let A_grade = A[pay_reward_rewardFields.grade];
            let B_grade = B[pay_reward_rewardFields.grade];

            let A_state = PayRewardModel.instance.getRewardStart(A_grade);
            let B_state = PayRewardModel.instance.getRewardStart(B_grade);
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
            let date: Array<pay_reward_reward> = PayRewardCfg.instance._cfgs;
            date.sort(this.overSort);
            this._list.datas = date;
            this.changDrawNum();
        }

        public changDrawNum() {
            let _money = BlendCfg.instance.getCfgById(15501)[blendFields.intParam];
            this.TipsText.text = `每充值${_money}元获得1点财富值, 财富值每日0点重置`;
        }
    }
}