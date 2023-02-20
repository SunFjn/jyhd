///<reference path="../config/gauntlet_cfg.ts"/>


/** 辅助装备*/


namespace modules.gloves {
    import GetGauntletReply = Protocols.GetGauntletReply;
    import GetGauntletReplyFields = Protocols.GetGauntletReplyFields;
    import PairFields = Protocols.PairFields;
    import gauntlet = Configuration.gauntlet;
    import GauntletCfg = modules.config.GauntletCfg;
    import gauntletFields = Configuration.gauntletFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import BagModel = modules.bag.BagModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class GlovesModel {
        private static _instance: GlovesModel;
        public static get instance(): GlovesModel {
            return this._instance = this._instance || new GlovesModel();
        }

        // 装备信息
        private _glovesInfo: GetGauntletReply;
        public state: number;

        constructor() {

        }

        // 装备信息
        public get glovesInfo(): GetGauntletReply {
            return this._glovesInfo;
        }
        public set glovesInfo(value: GetGauntletReply) {
            this._glovesInfo = value;
            this.state = value[Protocols.GetGauntletReplyFields.state];
            GlobalData.dispatcher.event(CommonEventType.GLOVES_INFO_UPDATE);
            this.checkRP();
        }

        // 红点
        public checkRP():void{
            let flag:boolean = false;
            if(this._glovesInfo){
                RedPointCtrl.instance.setRPProperty("glovesBuyRP", this._glovesInfo[GetGauntletReplyFields.state] === 0);
                RedPointCtrl.instance.setRPProperty("glovesStoneBuyRP", this._glovesInfo[GetGauntletReplyFields.draw_index] !== 0);
                let arr:Array<Protocols.Pair> = this._glovesInfo[GetGauntletReplyFields.jewels];
                for(let i:int = 0, len:int = arr.length; i < len; i++){
                    let stoneId:number = arr[i][PairFields.second];
                    if(stoneId % 1000 === 0) stoneId += 1;
                    let items:Array<Items> = GauntletCfg.instance.getCfgById(stoneId)[gauntletFields.material];
                    if(!GauntletCfg.instance.getCfgById(stoneId + 1)){      // 最后一级不用判断材料
                        continue;
                    }
                    let t:boolean = true;
                    for(let j:int = 0, len1:int = items.length; j < len1; j++){
                        let itemId:number = items[j][ItemsFields.itemId];
                        let count:number = items[j][ItemsFields.count];
                        t = t && BagModel.instance.getItemCountById(itemId) >= count;
                        if(!t){
                            break;
                        }
                    }
                    if(t){
                        flag = true;
                        break;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("glovesRP", flag);
        }
    }
}