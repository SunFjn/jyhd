/** npc数据*/
namespace modules.npc {
    export class NpcModel {
        private static _instance: NpcModel;
        public static get instance(): NpcModel {
            return this._instance = this._instance || new NpcModel();
        }

        // 触发的NPCID
        private _triggeredNpcId: number;
        // 是否正在采集
        private _isGathering: boolean;
        // 是否正在传送
        private _isTransfer: boolean;
        constructor() {

        }

        // 触发的NPCID
        public get triggeredNpcId(): number {
            return this._triggeredNpcId;
        }

        public set triggeredNpcId(value: number) {
            this._triggeredNpcId = value;
            GlobalData.dispatcher.event(CommonEventType.SCENE_TRIGGERED_NPC_UPDATE);
        }

        // 是否正在采集
        public get isGathering(): boolean {
            return this._isGathering;
        }

        public set isGathering(value: boolean) {
            this._isGathering = value;
            GlobalData.dispatcher.event(CommonEventType.SCENE_NPC_GATHER_STATE_UPDATE);
        }


        // 是否正在传送
        public get isTransfer(): boolean {
            return this._isTransfer;
        }

        public set isTransfer(value: boolean) {
            this._isTransfer = value;
        }

    }
}