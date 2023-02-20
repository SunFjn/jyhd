/////<reference path="../$.ts"/>
/** 仙丹 */
namespace modules.xianDan {
    import GetXianDanInfoReply = Protocols.GetXianDanInfoReply;
    import GetXianDanInfoReplyFields = Protocols.GetXianDanInfoReplyFields;
    import MagicPositionModel = modules.magicPosition.MagicPositionModel;
    import xiandan = Configuration.xiandan;
    import xiandanFields = Configuration.xiandanFields;
    import XianDanCfg = modules.config.XianDanCfg;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import VipModel = modules.vip.VipModel;

    export class XianDanModel {
        private static _instance: XianDanModel;
        public static get instance(): XianDanModel {
            return this._instance = this._instance || new XianDanModel();
        }

        private _idsInfo: number[];
        private _useCount: Table<number>;
        private _items: Table<number>;

        private constructor() {
            this._idsInfo = [];
            this._useCount = {};
            this._items = {};
        }

        public updateInfo(tuple: GetXianDanInfoReply): void {
            let type: number = tuple[GetXianDanInfoReplyFields.type];
            this._useCount[type] = tuple[GetXianDanInfoReplyFields.useCount];
            let idList: Protocols.Pair[] = tuple[GetXianDanInfoReplyFields.useList];
            for (let ele of idList) {
                let id: number = ele[Protocols.PairFields.first];
                let count: number = ele[Protocols.PairFields.second];
                this._idsInfo[id] = count;
            }
            GlobalData.dispatcher.event(CommonEventType.XIANDAN_INFO_UPDATE);
            this.checkRP();
        }

        public set items(list: Protocols.Pair[]) {
            this._items = {};
            for (let ele of list) {
                let id: number = ele[Protocols.PairFields.first];
                let count: number = ele[Protocols.PairFields.second];
                this._items[id] = count;
            }
            GlobalData.dispatcher.event(CommonEventType.XIANDAN_ITEMS_UPDATE);
            this.checkRP();
        }

        public checkRP(): void {
           if (modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.xianDan)) {
                for (let sId of XianDanCfg.instance.sIds) {
                    let yetCount: number = this.getUseCountBySId(sId);
                    let canCount: number = this.getLimitByVipLv();
                    if (yetCount >= canCount) {
                        continue;
                    } else {
                        let ids: int[] = XianDanCfg.instance.getIdsBySId(sId);
                        for (let id of ids) {
                            let count: number = XianDanModel.instance.getItemCountById(id);
                            let useCount: number = XianDanModel.instance.getUseCountById(id);
                            let canCount: number = XianDanModel.instance.getLimit(id);
                            if (count > 0 && useCount < canCount) {
                                redPoint.RedPointCtrl.instance.setRPProperty("xianDanRP", true);
                                return;
                            }
                        }
                    }
                }
           }
            redPoint.RedPointCtrl.instance.setRPProperty("xianDanRP", false);
        }

        public getLimit(id: number): number {
            let cfg: xiandan = XianDanCfg.instance.getCfgById(id);
            let xwLv: number = MagicPositionModel.Instance.position;
            let limits: Array<Configuration.Pair> = cfg[xiandanFields.xianweiLimit];
            for (let ele of limits) {
                let id: number = ele[Configuration.PairFields.first];
                if (id === xwLv) {
                    return ele[Configuration.PairFields.second];
                }
            }
        }

        public getLimitByVipLv(): number {
            let vipLv: number = VipModel.instance.vipLevel;
            let params: number[] = BlendCfg.instance.getCfgById(50001)[blendFields.intParam];
            for (let i: int = 0, len: int = params.length; i < len; i += 2) {
                let tLv: number = params[i];
                if (vipLv < tLv) {
                    return params[i - 1];
                }
            }
            return params[params.length - 1];
        }

        public getUseCountById(id: number): number {
            return this._idsInfo[id] ? this._idsInfo[id] : 0;
        }

        public getUseCountBySId(sId: number): number {
            return this._useCount[sId] ? this._useCount[sId] : 0;
        }

        public getItemCountById(id: number): number {
            return this._items[id] ? this._items[id] : 0;
        }
    }
}