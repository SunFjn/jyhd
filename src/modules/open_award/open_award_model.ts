/////<reference path="../$.ts"/>
/** 开服活动数据 */
namespace modules.openAward {
    import UpdateOpenReward = Protocols.UpdateOpenReward;
    import OpenGift = Protocols.OpenGift;
    import UpdateOpenRewardFields = Protocols.UpdateOpenRewardFields;
    import OpenGiftFields = Protocols.OpenGiftFields;

    export class OpenAwardModel {
        private static _instance: OpenAwardModel;
        public static get instance(): OpenAwardModel {
            return this._instance = this._instance || new OpenAwardModel();
        }

        private _time: number;
        private _states: Table<number>;

        private constructor() {

        }

        //更新
        public update(tuple: UpdateOpenReward) {
            this._time = tuple[UpdateOpenRewardFields.left_tick];
            this.states = tuple[UpdateOpenRewardFields.dayStates];
            GlobalData.dispatcher.event(CommonEventType.OPEN_AWARD_UPDATE);
        }

        public get time(): number {
            return this._time;
        }

        public set states(list: Array<OpenGift>) {
            this._states = {};
            for (let e of list) {
                let id: number = e[OpenGiftFields.rewardId];
                this._states[id] = e[OpenGiftFields.state];
            }
        }

        public getStateById(id: number): number {
            if (!this._states) return null;
            return this._states[id];
        }
    }
}