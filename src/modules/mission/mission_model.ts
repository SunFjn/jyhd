/*
 * @Author: yuyongyuan 1784394982@qq.com
 * @Date: 2022-12-19 13:17:15
 * @LastEditors: yuyongyuan 1784394982@qq.com
 * @LastEditTime: 2023-01-18 17:10:25
 * @FilePath: \jyhd_hengban\src\modules\mission\mission_model.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** 天关数据*/
///<reference path="../red_point/red_point_ctrl.ts"/>


namespace modules.mission {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class MissionModel {
        private static _instance: MissionModel;
        public static get instance(): MissionModel {
            return this._instance = this._instance || new MissionModel();
        }

        // 当前层数
        private _curLv: int;
        // 当前波数
        private _curWare: int;
        // 当前可以领奖的层数数组
        private _awardLvs: Array<int>;

        // 自动
        private _auto: boolean = false;
        // 进入游戏开始层数
        private _startLv: int = -1;

        constructor() {

        }

        // 当前层数
        public get curLv(): int {
            return this._curLv;
        }

        public set curLv(value: int) {
            let isChange = this._curLv != value;
            this._curLv = value;
            if (this._startLv == -1) {
                this._startLv = value;
            }
            if (isChange) {
                GlobalData.dispatcher.event(CommonEventType.MISSION_UPDATE_LV);
            }
        }

        // 进入游戏开始层数
        public get startLv(): int {
            return this._startLv;
        }
        
        // 当前波数
        public get curWare(): int {
            return this._curWare;
        }

        public set curWare(value: int) {
            this._curWare = value;
            GlobalData.dispatcher.event(CommonEventType.MISSION_UPDATE_WARE);
        }

        // 当前应该领奖层数
        public get awardLvs(): Array<int> {
            return this._awardLvs;
        }

        public set awardLvs(value: Array<int>) {
            this._awardLvs = value;
            GlobalData.dispatcher.event(CommonEventType.MISSION_UPDATE_AWARD_LV);
            RedPointCtrl.instance.setRPProperty("missionRP", value && value.length > 0);
        }

        // 领奖成功删除可领数组第一个
        public getCopyAwardReply(): void {
            // if (this._awardLvs) this._awardLvs.shift();
            GlobalData.dispatcher.event(CommonEventType.MISSION_UPDATE_AWARD_LV);
        }

        // 自动
        public get auto(): boolean {
            return this._auto;
        }

        public set auto(value: boolean) {
            this._auto = value;
            GlobalData.dispatcher.event(CommonEventType.MISSION_UPDATE_AUTO);
        }
    }
}