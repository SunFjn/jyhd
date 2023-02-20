namespace modules.shenqi {
    import GetShenQiInfoReply = Protocols.GetShenQiInfoReply;
    import GetShenQiInfoReplyFields = Protocols.GetShenQiInfoReplyFields;
    import Pair = Protocols.Pair;
    import PairFields = Protocols.PairFields;
    import Dictionary = Laya.Dictionary;
    import ShenqiCfg = modules.config.ShenqiCfg;
    import shenqi = Configuration.shenqi;
    import shenqiFields = Configuration.shenqiFields;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import UpdateFragmentList = Protocols.UpdateFragmentList;
    import TypesAttr = Protocols.TypesAttr;

    export class ShenqiModel {
        private _fragmentsDic: Dictionary;                    //碎片字典
        private _shenqi: Array<number>;             //神器数组
        private _equipFragmentsDic: Dictionary;          //放入碎片字典
        private _attr: Array<TypesAttr>;     //总属性
        private _fighting: number; //战力


        private _suiPianAll: Array<number>;
        private _suiPianYiXiangQianAll: Array<number>;
        private _isUpdateBoll: boolean;
        constructor() {
            this._fragmentsDic = new Dictionary();
            this._equipFragmentsDic = new Dictionary();
            this._suiPianAll = new Array<number>();
            this._suiPianYiXiangQianAll = new Array<number>();
            this._isUpdateBoll = false;
        }

        public get fragmentsDic(): Dictionary {
            return this._fragmentsDic;
        }

        public get shenqi(): Array<number> {
            return this._shenqi;
        }

        public get equipFragmentsDic(): Dictionary {
            return this._equipFragmentsDic;
        }

        public get fighting(): number {
            return this._fighting;
        }

        public get attr(): Array<TypesAttr> {
            return this._attr;
        }

        private static _instance: ShenqiModel;
        public static get instance(): ShenqiModel {
            return this._instance = this._instance || new ShenqiModel();
        }

        //获取碎片返回
        public updateFragmentList(tuple: UpdateFragmentList): void {
            //碎片字典
            this._fragmentsDic.clear();
            let fragments: Array<Pair> = tuple[0];
            this.isNemSuiPian(fragments);
            for (let i = 0; i < fragments.length; ++i) {
                this._fragmentsDic.set(fragments[i][PairFields.first], fragments[i][PairFields.second]);
            }
            this.refresh();
        }

        /**
         * 是否有新的碎片
         */
        public isNemSuiPian(tuple: Array<Pair>): void {
            let ifOpen = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.shenqi);
            if (!ifOpen) {
                return;
            }
            if (!this._isUpdateBoll)
                return;
            let fragmentList = tuple; //所有拥有的碎片
            for (let index = fragmentList.length - 1; index >= 0; index--) {//倒着取 取最新的那一个数据
                let element = fragmentList[index];
                if (!element) {
                    break;
                }
                let isHave = this._suiPianAll.indexOf(element[PairFields.first]);
                let isHave1 = this._suiPianYiXiangQianAll.indexOf(element[PairFields.first]);
                if (isHave == -1 && isHave1 == -1) {
                    modules.quickUse.QuickUseCtrl.instance.addShenQiItem(element[PairFields.first]);
                    for (let i = 0; i < fragmentList.length; ++i) {
                        this._suiPianAll.push(fragmentList[i][PairFields.first]);
                    }
                    return;
                }
            }
            for (let i = 0; i < fragmentList.length; ++i) {
                this._suiPianAll.push(fragmentList[i][PairFields.first]);
            }
        }
        public removeShenQisuibian() {
            if (!this._isUpdateBoll)
                return;
            for (let index = this._suiPianAll.length - 1; index >= 0; index--) {
                let element = this._suiPianAll[index];
                if (element) {
                    let isHave = this._suiPianYiXiangQianAll.indexOf(element);
                    if (isHave != -1) {
                        modules.quickUse.QuickUseCtrl.instance.removeShenQiItemHandler(element);
                    }
                }
            }

        }
        //获取神器信息
        public getShenQiInfoReply(tuple: GetShenQiInfoReply): void {
            //碎片字典
            this._isUpdateBoll = true;
            this._fragmentsDic.clear();
            let fragments: Array<Pair> = tuple[GetShenQiInfoReplyFields.fragmentList];
            for (let i = 0; i < fragments.length; ++i) {
                this._fragmentsDic.set(fragments[i][PairFields.first], fragments[i][PairFields.second]);
                this._suiPianAll.push(fragments[i][PairFields.first]);
            }
            //神器列表
            this._shenqi = tuple[GetShenQiInfoReplyFields.shenQiList];
            //放入碎片字典
            this._equipFragmentsDic.clear();
            let equipFragments: Array<number> = tuple[GetShenQiInfoReplyFields.equipFragment];
            this.removeShenQisuibian();
            this._suiPianYiXiangQianAll = equipFragments;
            for (let i = 0; i < equipFragments.length; ++i) {
                this._equipFragmentsDic.set(equipFragments[i], true);
            }
            //总属性
            this._attr = tuple[GetShenQiInfoReplyFields.totalAttr];
            //战力统计
            this._fighting = 0;
            //遍历已激活的神器
            for (let i = 0; i <= this.shenqi.length - 1; ++i) {
                let cfg: shenqi = ShenqiCfg.instance.getCfgById(i);
                if (cfg) {
                    //激活神器的技能
                    this._fighting += SkillCfg.instance.getCfgById(cfg[shenqiFields.skillId])[skillFields.fight];
                    //遍历已激活神器的碎片
                    for (let j = 0; j < cfg[shenqiFields.fragment].length; ++j) {
                        this._fighting += cfg[shenqiFields.fighting][j];
                    }
                }

            }
            //遍历放入的碎片
            let cfg: shenqi = ShenqiCfg.instance.getCfgById(this.shenqi.length);
            for (let i = 0; i < equipFragments.length; ++i) {
                this._fighting += cfg[shenqiFields.fighting][cfg[shenqiFields.fragment].indexOf(equipFragments[i])];
            }
            this.refresh();
        }

        private refresh(): void {
            let cfg: shenqi = ShenqiCfg.instance.getCfgById(this.shenqi.length);
            //如果cfg为undefined,证明神器已经解锁完毕，getCfgById将越界
            if (cfg) {
                //红点判断
                let RP: boolean = true;
                for (let i = 0; i < cfg[shenqiFields.fragment].length; ++i) {
                    let fragment: number = cfg[shenqiFields.fragment][i];
                    //如果碎片已放入则进入下一次循环
                    if (this.equipFragmentsDic.get(fragment)) {
                        continue;
                    }
                    //如果碎片列表里有碎片可放入，跳出循环
                    else if (this.fragmentsDic.get(fragment)) {
                        break;
                    }
                    RP = false;
                }
                if (RP) {
                    RedPointCtrl.instance.setRPProperty("shenqiRP", true);      //红点
                } else {
                    RedPointCtrl.instance.setRPProperty("shenqiRP", false);
                }
            }
            else {
                RedPointCtrl.instance.setRPProperty("shenqiRP", false);
            }

            GlobalData.dispatcher.event(CommonEventType.SHENQI_UPDATE);     //刷新ui
        }
    }
}