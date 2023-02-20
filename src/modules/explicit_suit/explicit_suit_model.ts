///<reference path="../config/exterior_suit_cfg.ts"/>
///<reference path="../config/exterior_suit_feed_cfg.ts"/>
namespace modules.explicit {
    import BagModel = modules.bag.BagModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import AutoSC_ShowSuitInfo = Protocols.AutoSC_ShowSuitInfo;
    import AutoSC_ShowSuitInfoFields = Protocols.AutoSC_ShowSuitInfoFields;
    import AutoSC_ShowSuitLevel = Protocols.AutoSC_ShowSuitLevel;
    import AutoSC_ShowSuitLevelFields = Protocols.AutoSC_ShowSuitLevelFields;
    import AutoSC_ShowSuitPosLevel = Protocols.AutoSC_ShowSuitPosLevel;
    import AutoSC_ShowSuitPosLevelFields = Protocols.AutoSC_ShowSuitPosLevelFields;
    import AutoSC_ShowSuitPosHallucinationID = Protocols.AutoSC_ShowSuitPosHallucinationID;
    import exterior_suit = Configuration.exterior_suit;
    import exterior_suit_Field = Configuration.exterior_suit_Field;
    import exterior_suit_feed = Configuration.exterior_suit_feed;
    import exterior_suit_feed_Field = Configuration.exterior_suit_feed_Field;
    import ExteriorSuitCfg = modules.config.ExteriorSuitCfg;
    import ExteriorSuitFeedCfg = modules.config.ExteriorSuitFeedCfg;
    import ExteriorSuitClass = modules.config.ExteriorSuitClass;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import FashionModel = modules.fashion.FashionModel;
    import ImmortalsModel = modules.immortals.ImmortalsModel;
    import WingModel = modules.wing.WingModel;

    export class ExplicitSuitModel {
        private static _instance: ExplicitSuitModel;
        public static get instance(): ExplicitSuitModel {
            return this._instance = this._instance || new ExplicitSuitModel();
        }

        // 外显套装信息
        private _suitInfo: AutoSC_ShowSuitInfo;
        // 激活、升级幻化Id
        public addFashionMagicShowId: number;

        // 修炼类型
        public refineType:number;

        constructor() {

        }

        // 外显套装信息
        public get suitInfo(): AutoSC_ShowSuitInfo {
            return this._suitInfo;
        }

        public set suitInfo(value: AutoSC_ShowSuitInfo) {
            this._suitInfo = value;
            //GlobalData.dispatcher.event(CommonEventType.FASHION_INFO_UPDATE);
            //this.checkRP();
        }
        
        //完美升级信息
        public getShowSuitLevelInfo(id:number):AutoSC_ShowSuitLevel{
            let showSuitLevels = ExplicitSuitModel.instance.suitInfo[AutoSC_ShowSuitInfoFields.level];
            for (let index = 0; index < showSuitLevels.length; index++) {
                let cfg = showSuitLevels[index];
                if (cfg[AutoSC_ShowSuitLevelFields.id] == id) {
                    return cfg;
                }
            }
            return null;
        }

        //部件获得信息
        public getShowSuitPosLevelInfo(id:number):AutoSC_ShowSuitPosLevel{
            let showSuitPosLevels = ExplicitSuitModel.instance.suitInfo[AutoSC_ShowSuitInfoFields.posLevel];
            for (let index = 0; index < showSuitPosLevels.length; index++) {
                let cfg = showSuitPosLevels[index];
                if (cfg[AutoSC_ShowSuitPosLevelFields.id] == id) {
                    return cfg;
                }
            }
            return null;
        }
        
        //
        public checkRedPoint(id:number):boolean{
            let suitId = id;
            let curShowSuitLevel = ExplicitSuitModel.instance.getShowSuitLevelInfo(suitId);
            let suitFeedInfo = ExteriorSuitFeedCfg.instance.getCfgById(suitId);
            let suitInfo = ExteriorSuitCfg.instance.getCfgById(suitId);
            let curShowSuitPosLevel = ExplicitSuitModel.instance.getShowSuitPosLevelInfo(suitId);
            let showSuitPosHallucinationIDs:AutoSC_ShowSuitPosHallucinationID = ExplicitSuitModel.instance.suitInfo[AutoSC_ShowSuitInfoFields.posHallucinationID];
            let curLevel = curShowSuitLevel[AutoSC_ShowSuitLevelFields.level];
            let count = 0;//激活部件数量
            let star = 0;
            let showInfo: MagicShowInfo = ImmortalsModel.instance.huanhuaList.get(suitInfo[exterior_suit_Field.partsShowId][0]);//武器
            if (showInfo) {
                star = showInfo[MagicShowInfoFields.star];
                count = star > 0 ? count+=1:count;
            }
            showInfo = FashionModel.instance.getMagicShowInfoById(suitInfo[exterior_suit_Field.partsShowId][1]);//时装
            if (showInfo) {
                star = showInfo[MagicShowInfoFields.star];
                count = star > 0 ? count+=1:count;
            }
            showInfo = WingModel.instance.huanhuaList.get(suitInfo[exterior_suit_Field.partsShowId][2]);//翅膀
            if (showInfo) {
                star = showInfo[MagicShowInfoFields.star];
                count = star > 0 ? count+=1:count;
            }
            let haveRed = (curShowSuitLevel[AutoSC_ShowSuitLevelFields.level] == -2 && count >= 2) || (curShowSuitLevel[AutoSC_ShowSuitLevelFields.level] == -1 && count == 3);//能否激活
            if (haveRed) {
                return true;
            }
            //进阶条件
            let condCount = 0;
            let condition = suitFeedInfo[curLevel + 1] ? suitFeedInfo[curLevel + 1][exterior_suit_feed_Field.condition]:[];
            if (condition.length) {
                for (let index = 0,len = showSuitPosHallucinationIDs.length; index < len; index++) {
                    if (curShowSuitPosLevel[1][index] >= condition[1]) {
                        condCount++;
                    }
                }
            }

            //消耗道具
            let items = suitFeedInfo[curLevel + 1] ? suitFeedInfo[curLevel + 1][exterior_suit_feed_Field.items]:[];
            if (items.length) {
                let hasItemNum: int = BagModel.instance.getItemCountById(items[0]);
                let numDiff = hasItemNum - items[1];
                haveRed = numDiff >= 0 && condCount == 3;
            }

            return haveRed;
        }

        public checkAllRedPoint(){
            RedPointCtrl.instance.setRPProperty("ExplicitSuitBest",false);
            RedPointCtrl.instance.setRPProperty("ExplicitSuitUnique",false);
            RedPointCtrl.instance.setRPProperty("ExplicitSuitCollection",false);
            if (!ExplicitSuitModel.instance.suitInfo) {
                return;
            }
            let showSuitLevels = ExplicitSuitModel.instance.suitInfo[AutoSC_ShowSuitInfoFields.level];
            for (let index = 0,len = showSuitLevels.length; index < len ;index++) {
                let suitId = showSuitLevels[index][0];
                let suitInfo = ExteriorSuitCfg.instance.getCfgById(suitId);
                let haveRed = this.checkRedPoint(suitId);
                if (suitInfo[exterior_suit_Field.quality] == ExteriorSuitClass.best && haveRed) {
                    RedPointCtrl.instance.setRPProperty("ExplicitSuitBest",true);
                }else if (suitInfo[exterior_suit_Field.quality] == ExteriorSuitClass.unique && haveRed) {
                    RedPointCtrl.instance.setRPProperty("ExplicitSuitUnique",true);
                }else if (suitInfo[exterior_suit_Field.quality] == ExteriorSuitClass.collection && haveRed) {
                    RedPointCtrl.instance.setRPProperty("ExplicitSuitCollection",true);
                }
            }
          
        }

        //打开外显套装
        public openExplicitSuitPanel(id:number){
            let data = ExteriorSuitCfg.instance.getCfgByPartId(id);
            let selectIndex = 0;
            let type = -1;
            if (data) {
                selectIndex = data[0];
                type = data[1][exterior_suit_Field.quality];
            }
            if (type == ExteriorSuitClass.best) {
                WindowManager.instance.open(WindowEnum.EXPLICIT_SUIT_BEST_PANEL,[selectIndex])
            }else  if (type == ExteriorSuitClass.unique) {
                WindowManager.instance.open(WindowEnum.EXPLICIT_SUIT_UNIQUE_PANEL,[selectIndex])
            }else  if (type == ExteriorSuitClass.collection) {
                WindowManager.instance.open(WindowEnum.EXPLICIT_SUIT_COLLECTION_PANEL,[selectIndex])
            }
        }

        //打开外显套装属性
        public openExplicitSuitAttrAlert(id:number){
            let data = ExteriorSuitCfg.instance.getCfgByPartId(id);
            if (data) {
                WindowManager.instance.open(WindowEnum.EXPLICIT_SUIT_ATTR_ALERT,[data[1]]); ;
            }
        }

        //检查部件是否有外显套装
        public checkHaveExplicitSuitById(id:number,isAlert:boolean = false):boolean{
            let data = ExteriorSuitCfg.instance.getCfgByPartId(id);
            // if (data) {
            //      if (isAlert) {
            //         let curShowSuitLevel = ExplicitSuitModel.instance.getShowSuitLevelInfo(data[1][exterior_suit_Field.id]);
            //         return data != null;
            //      }else{
            //         return data != null;
            //      }
            // }
            // return false;
            return data != null;
        }
        
    }
}