/**
 * 幻化数据
 */

namespace modules.illusion {

    export class IllusionModel {
        private static _instance: IllusionModel = new IllusionModel();
        public static get instance(): IllusionModel {
            return this._instance;
        }

        private _magicShowId: int;
        private _rideMagicShowId: int;

        public _magicSelectId: number;
        public _rideMagicSelectId: number;

        constructor() {
            this._magicSelectId = this._rideMagicSelectId = this._magicShowId = this._rideMagicShowId = -1;
        }

        public set magicShowId(showId: number) {
            this._magicShowId = showId;
            GlobalData.dispatcher.event(CommonEventType.MAGIC_PET_HUANHUA_SHOWID);
        }

        public get magicShowId(): number {
            return this._magicShowId;
        }

        public set rideMagicShowId(showId: number) {
            this._rideMagicShowId = showId;
            GlobalData.dispatcher.event(CommonEventType.MAGIC_WEAPON_HUANHUA_SHOWID);
        }

        public get rideMagicShowId(): number {
            return this._rideMagicShowId;
        }
    }
}