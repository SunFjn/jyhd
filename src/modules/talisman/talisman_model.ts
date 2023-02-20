/** 法术数据 */
///<reference path="../bag/bag_model.ts"/>
///<reference path="../config/talisman_cfg.ts"/>
///<reference path="../magic_art/magic_art_ctrl.ts"/>

import GetAmuletInfoReply = Protocols.GetAmuletInfoReply;

namespace modules.talisman {
    import Dictionary = Laya.Dictionary;
    import GetAmuletInfoReplyFields = Protocols.GetAmuletInfoReplyFields;
    import AmuletRefineInfo = Protocols.AmuletRefineInfo;
    import AmuletRefineInfoFields = Protocols.AmuletRefineInfoFields;
    import AmuletRise = Protocols.AmuletRise;
    import AmuletRefine = Protocols.AmuletRefine;
    import AmuletRefineFields = Protocols.AmuletRefineFields;
    import RefineAmuletReply = Protocols.RefineAmuletReply;
    import UpdateAmuletInfo = Protocols.UpdateAmuletInfo;
    import amuletRefine = Configuration.amuletRefine;
    import TalismanCfg = modules.config.TalismanCfg;
    import amuletRefineFields = Configuration.amuletRefineFields;
    import BagModel = modules.bag.BagModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import MagicArtCtrl = modules.magicArt.MagicArtCtrl;


    export class TalismanModel {

        private static _instance: TalismanModel;
        public static get instance(): TalismanModel {
            return this._instance = this._instance || new TalismanModel();
        }

        private refine: AmuletRefine;
        private rise: AmuletRise;
        private _refineAmuletReplay: RefineAmuletReply;

        private _amuletInfoReply: GetAmuletInfoReply;
        private _updateAmuletInfo: UpdateAmuletInfo;

        private _amuletInfoArray: Array<AmuletRefineInfo>;

        private _amuletRefineQualityArray: Array<Array<amuletRefine>>;
        private _dotVisible: boolean;
        private _btnRedDotArr: Array<boolean>;
        private _maxLevel: number = 50;
        // 圣物字典
        private _mwIdToUidItems: Dictionary = new Dictionary();
        public _itemId: number = 0;//当前升级的圣物ID
        constructor() {
            this._dotVisible = false;
            this._btnRedDotArr = [false, false, false, false];

            this._amuletRefineQualityArray = new Array<Array<amuletRefine>>();
            for (let i = 0; i < 4; i++) {
                let items = new Array<amuletRefine>();
                items = TalismanCfg.instance.getCfgByQuality(i + 2);
                this._amuletRefineQualityArray[i] = items;
            }
        }

        public updateTalisman(): void {
            for (let k = 0; k < this._amuletRefineQualityArray.length; k++) {
                let refineArr = new Array<amuletRefine>();
                refineArr = this._amuletRefineQualityArray[k];
                for (let j = 0; j < refineArr.length; j++) {
                    let itemCfg = refineArr[j];
                    let id = itemCfg[amuletRefineFields.id];
                    let level = itemCfg[amuletRefineFields.level];
                    let items = TalismanModel.instance.GetAmuletById(id);
                    if (items != null) {
                        level = items[AmuletRefineInfoFields.level]
                    }
                    refineArr[j] = TalismanCfg.instance.getCfgByIdLevel(id, level);
                }
            }

        }

        public setDotDis(): void {
            this.updateTalisman();
            for (let k = 0; k < this._amuletRefineQualityArray.length; k++) {
                let refineArr = new Array<amuletRefine>();
                refineArr = this._amuletRefineQualityArray[k];
                for (let j = 0; j < refineArr.length; j++) {
                    let itemCfg = refineArr[j];
                    let id = itemCfg[amuletRefineFields.id];
                    let level = itemCfg[amuletRefineFields.level];
                    let count = BagModel.instance.getItemCountById(id) + BagModel.instance.getItemCountById(itemCfg[amuletRefineFields.universalId]);
                    let num = itemCfg[amuletRefineFields.items][1];
                    if (count / num >= 1 && level != this._maxLevel) {
                        this._btnRedDotArr[k] = true;
                        break;
                    } else {
                        this._btnRedDotArr[k] = false;
                    }
                }
            }
            let num: number = 0;
            for (let i = 0; i < this._btnRedDotArr.length; i++) {
                if (this._btnRedDotArr[i] == false) {
                    num++;
                }
            }
            RedPointCtrl.instance.setRPProperty("talismanRP", num < this._btnRedDotArr.length);
        }

        public getAmuletRefineQualityArray(quality: number): Array<amuletRefine> {
            return this._amuletRefineQualityArray[quality];
        }

        public getRedDot(): Array<boolean> {
            return this._btnRedDotArr;
        }

        public GetAmuletById(id: number) {
            return this._mwIdToUidItems.get(id);
        }

        public getAmuletRefine(): AmuletRefine {
            return this.refine;
        }

        public getAmuletRise(): AmuletRise {
            return this.rise;
        }

        public get UpdateAmuletInfoReply(): UpdateAmuletInfo {
            return this._amuletInfoReply
        }

        public set UpdateAmuletInfoReply(value: UpdateAmuletInfo) {
            this._amuletInfoReply = value;
            this.refine = this._amuletInfoReply[GetAmuletInfoReplyFields.refine];
            this.rise = this._amuletInfoReply[GetAmuletInfoReplyFields.rise];
            this._amuletInfoArray = this.refine[AmuletRefineFields.list];
            for (let i = 0; i < this._amuletInfoArray.length; i++) {
                this._mwIdToUidItems.set(this._amuletInfoArray[i][AmuletRefineInfoFields.id], this._amuletInfoArray[i]);
            }
            this.setDotDis();
            GlobalData.dispatcher.event(CommonEventType.UPDATE_AMULET_INFO_REPLAY);
        }

        public get GetAmuletInfoReply(): GetAmuletInfoReply {
            return this._amuletInfoReply
        }

        public set GetAmuletInfoReply(value: GetAmuletInfoReply) {
            this._amuletInfoReply = value;
            this.refine = this._amuletInfoReply[GetAmuletInfoReplyFields.refine];
            this.rise = this._amuletInfoReply[GetAmuletInfoReplyFields.rise];
            this._amuletInfoArray = this.refine[AmuletRefineFields.list];
            for (let i = 0; i < this._amuletInfoArray.length; i++) {
                this._mwIdToUidItems.set(this._amuletInfoArray[i][AmuletRefineInfoFields.id], this._amuletInfoArray[i]);
            }
            this.setDotDis();
            MagicArtCtrl.instance.setMaxLevel();
            GlobalData.dispatcher.event(CommonEventType.GET_AMULET_INFO_REPLAY);
        }

        public get RefineAmuletReplay(): RefineAmuletReply {
            return this._refineAmuletReplay;
        }

        public set RefineAmuletReplay(value: RefineAmuletReply) {
            this._refineAmuletReplay = value;
            GlobalData.dispatcher.event(CommonEventType.REFINE_AMULET_REPLAY);
        }

        // // 根据圣物ID获取圣物列表
        // public getItemsByBagId(mwId: number): Array<Protocols.Item> {
        //     let t: Dictionary = this._mwIdToUidItems.get(mwId);
        //     return t ? t.values : null;
        // }
        //
        // public getItemByBagIdUid(mwId: number, uid: number): Protocols.Item {
        //     return this._mwIdToUidItems.get(mwId).get(uid);
        // }
        //
    }
}