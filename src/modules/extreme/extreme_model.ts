/** 圣装数据 */
namespace modules.extreme {
    import GetZhizhunInfoReply = Protocols.GetZhizhunInfoReply;
    import GetZhizhunInfoReplyFields = Protocols.GetZhizhunInfoReplyFields;
    import BlendCfg = modules.config.BlendCfg;
    import ZhizhunInfo = Protocols.ZhizhunInfo;
    import ZhizhunInfoFields = Protocols.ZhizhunInfoFields;
    import GetHolyRechargeInfoReply = Protocols.GetHolyRechargeInfoReply;
    import HolyRechargeInfoSingleFields = Protocols.HolyRechargeInfoSingleFields;
    import RechargeCfg = modules.config.RechargeCfg;
    import recharge = Configuration.recharge;
    import SkillInfo = Protocols.SkillInfo;
    import BagModel = modules.bag.BagModel;
    import zhizun_feedFields = Configuration.zhizun_feedFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    interface IEquipData {
        /**
         * 装备id
         */
        value: number
    }
    /**
     *
     *
     * @export
     * @class extremeModel
     */
    export class extremeModel {
        private static _instance: extremeModel = new extremeModel();
        public static get instance(): extremeModel {
            return this._instance;
        }
        private _nowsSelect: number = 0;
        private _lastSelect: number = 0;
        public equipDatas: IEquipData[] = [];
        public RPs: boolean[] = [];
        constructor() {
            this.dataInit();
            this.buyData = new Map<number, Array<[number, number, number]>>();
        }
        public get nowsSelect() {
            return this._nowsSelect
        }
        public set nowsSelect(nowsSelect) {
            this._nowsSelect = nowsSelect
        }
        public get lastSelect() {
            return this._lastSelect
        }
        public set lastSelect(lastSelect) {
            this._lastSelect = lastSelect
        }
        /**
         * 初始化需要的数据
         */
        public dataInit() {
            let icons = [
                ["shenjian", "天御·神剑"],
                ["toukui", "天御·头盔"],
                ["kaijia", "天御·铠甲"],
                ["huwan", "天御·护腕"],
                ["xiezi", "天御·战靴"],
                ["yaodai", "天御·腰带"],
                ["xianglian", "天御·项链"],
                ["shouzhuo", "天御·手镯"],
                ["jiezhi", "天御·戒指"],
                ["yupei", "天御·玉佩"],
            ]

            for (let id = 1; id <= 10; id++) {
                this.EquipData.set(id, [id, 1, [], [icons[id - 1][0], icons[id - 1][1]]])
            }


        }

        public getIcon(id: number): [string, string] {
            if (!this.EquipData.has(id)) return null
            return this.EquipData.get(id)[3]
            //返回 资源索引和名字
        }
        /**
         * 根据名字读ID
         * @param name 
         * @returns id -1 为没找到
         */
        public getId(name: string) {
            let id = -1
            this.EquipData.forEach((value, key) => {
                if (value[3][1] === name) id = value[0]
            });
            return id
        }

        public getLevel(id: number) {
            if (!this.EquipData.has(id)) return 0
            return this.EquipData.get(id)[1]
        }
        public skillKing: [number, number] = [0, 0]
        // ID,ID 当前等级 [ 技能列表  技能ID 技能等级 ]  [ 资源索引 资源名]
        public EquipData: Map<number, [number, number, Array<SkillInfo>, [string, string]]> = new Map<number, [number, number, Array<SkillInfo>, [string, string]]>();
        // public EquipData: Array<[number, number, Array<[number, number]>]>
        public setData(tuple: GetZhizhunInfoReply) {
            //[ID,LV]
            // ID 当前等级 [ 技能列表  技能ID 技能等级 ] 
            tuple[GetZhizhunInfoReplyFields.list].forEach((value: ZhizhunInfo, key: number) => {
                let id = value[ZhizhunInfoFields.id]
                let item = this.EquipData.get(id)
                item[ZhizhunInfoFields.feedLevel] = value[ZhizhunInfoFields.feedLevel]
                item[ZhizhunInfoFields.feedSkillList] = value[ZhizhunInfoFields.feedSkillList]
                let tempData: IEquipData = {
                    value: value[0]
                }
                this.equipDatas.push(tempData)
            })
            this.skillKing = tuple[GetZhizhunInfoReplyFields.specialSkill]

            this.setRP()
            GlobalData.dispatcher.event(CommonEventType.LuxuryEquip_ZhiZun_UPDATE);

        }
        public getSkill(id: number) {
            return this.EquipData.get(id)[ZhizhunInfoFields.feedSkillList]
        }

        public getInfo(id: number) {
            return this.EquipData.get(id) || null
        }
        public getKingSkill(): number {
            let info: Array<number> = modules.config.BlendCfg.instance.getCfgById(64013)[2]
            for (const key in info) {
                let level = info[key]
                for (let id = 1; id <= 10; id++) {
                    let lev = this.EquipData.get(id)[1]
                    if (lev < level) return level;
                }
            }
            return -1;
        }



        public buyShow: Array<boolean> = []
        private buyData: Map<number, Array<[number, number, number]>>;
        //key 类型 [礼包id 购买次数 最大次数]
        public setBuyData(tuple: GetHolyRechargeInfoReply) {
            this.buyData = new Map<number, Array<[number, number, number]>>();
            let isShow8 = false
            let isShow9 = false
            let isShow10 = false
            let buyMax = BlendCfg.instance.getCfgById(64001)[Configuration.blendFields.intParam][0];
            if (tuple && tuple.length > 0) {
                tuple.forEach((value, key) => {
                    let type = value[HolyRechargeInfoSingleFields.type]
                    let item = this.buyData.get(type) || new Array<[number, number, number]>();
                    this.buyData.set(type, item)
                    item.push([value[HolyRechargeInfoSingleFields.index], value[HolyRechargeInfoSingleFields.num], buyMax])

                    switch (type) {
                        case 8:
                            if (value[HolyRechargeInfoSingleFields.state] == 1) isShow8 = true
                            break;
                        case 9:
                            if (value[HolyRechargeInfoSingleFields.state] == 1) isShow9 = true
                            break;
                        case 10:
                            if (value[HolyRechargeInfoSingleFields.state] == 1) isShow10 = true
                            break;
                    }

                    // item.push([value[HolyRechargeInfoSingleFields.index] + 1, value[HolyRechargeInfoSingleFields.num], 8])
                    // item.push([value[HolyRechargeInfoSingleFields.index] + 2, value[HolyRechargeInfoSingleFields.num], 8])
                    // item.push([value[HolyRechargeInfoSingleFields.index] + 3, value[HolyRechargeInfoSingleFields.num], 8])
                })
            }
            this.buyShow = [isShow8, isShow9, isShow10]





            this.setRP()
            GlobalData.dispatcher.event(CommonEventType.LuxuryEquip_ZhiZun_BuyUPDATE);
        }
        /**
         * 根据type返回所有list
         * @param type 8 9 10 至尊 雷霆  梵天
         */
        public getBuyInfo(type: number) {
            let item = this.buyData.get(type) || []
            return item
            //返回结构 Array[礼包id 购买次数 最大次数]
        }

        public getBuyId(id: number) {
            //根据礼包id 获取礼包data
            let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(id);
            // index = 0,			/*档位*/
            // name = 1,			/*档位名称*/
            // price = 2,			/*档位价格*/
            // describe = 3,		/*档位描述*/
            // ico = 4,			/*图标ID*/
            // baseId = 5,			/*底图id*/
            // reward = 6,			/*奖励 [itemId#count]#[itemId#count]*/
            // exReward = 7,			/*额外赠送奖励 [itemId#count]#[itemId#count]*/
            // type = 8,			/*充值类型 0：特卖，1：普通*/
            // sortId = 9,			/*排序id*/
            // visible = 10,			/*档位购买后是否隐藏 0：隐藏，1：不隐藏*/
            // descriptive = 11,			/*档位描述2*/

            return cfg;
        }


        public setRP() {
            let uprp = false//升级红点
            let skillrp = false//技能升级红点\
            //默认打开那个装备的面板
            let nowSeclect: number = 0;
            this.RPs = [];
            for (let id = 1; id <= 10; id++) {
                let lev: number = extremeModel.instance.getLevel(id);
                let cfg = ExtremeCfg.instance.getInfo(id, lev)
                let nextCfg = ExtremeCfg.instance.getInfo(id, lev + 1)
                let isRp = false
                if (nextCfg != null) {
                    let haveCount = BagModel.instance.getItemCountById(nextCfg[zhizun_feedFields.items][0]);
                    if (haveCount >= nextCfg[zhizun_feedFields.items][1]) {
                        if (nowSeclect === 0 || this.nowsSelect === (id - 1)) {
                            nowSeclect = id;
                        }
                        uprp = true;
                        isRp = true;
                    }
                }
                let skills = extremeModel.instance.getSkill(id)
                for (let i = 1; i <= skills.length; i++) {
                    let skiId = skills[i - 1][0]
                    let skiLevel = skills[i - 1][1]
                    let skillinfo = ExtremeCfg.instance.getSkillUp(skiId, skiLevel + 1, id)
                    if (skillinfo && Number(extremeModel.instance.getLevel(skillinfo[0])) >= Number(skillinfo[1])) {
                        if (nowSeclect === 0 || this.nowsSelect === (id - 1)) {
                            nowSeclect = id;
                        }
                        skillrp = true;
                        isRp = true;
                    }
                }
                this.RPs.push(isRp);
            }
            if ((nowSeclect - 1) <= 0) {
                this.nowsSelect = 0;
            } else {
                this.nowsSelect = nowSeclect - 1;
            }
            RedPointCtrl.instance.setRPProperty("zzRP", uprp || skillrp);
            RedPointCtrl.instance.setRPProperty("zzskillRP", skillrp);
            if (!modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.HolyEquip)) {
                RedPointCtrl.instance.setRPProperty("zzRP", false);
            }
            // if (!modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.HolyEquip)) {
            //     RedPointCtrl.instance.setRPProperty("zzskillRP", false);
            // }
        }

    }
}