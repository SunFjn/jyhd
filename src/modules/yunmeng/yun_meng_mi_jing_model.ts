/** */
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/pay_reward_weight_cfg.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
///<reference path="../config/blend_cfg.ts"/>
///<reference path="../config/scene_home_boss_cfg.ts"/>
///<reference path="../config/monster_res_cfg.ts"/>
///<reference path="../dungeon/dungeon_model.ts"/>
///<reference path="../../utils/table_utils.ts"/>
///<reference path="../config/item_material_cfg.ts"/>
namespace modules.yunmeng {
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import BossInfo = Protocols.BossInfo;
    import BossInfoFields = Protocols.BossInfoFields;
    import Pos = Protocols.Pos;
    import Item = Protocols.Item;
    import DungeonModel = modules.dungeon.DungeonModel;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import CopySceneState = Protocols.CopySceneState;
    import CopySceneStateFields = Protocols.CopySceneStateFields;
    import BossJudgeAward = Protocols.BossJudgeAward;
    import BossJudgeAwardFields = Protocols.BossJudgeAwardFields;

    export class YunMengMiJingModel {
        private static _instance: YunMengMiJingModel;
        public static get instance(): YunMengMiJingModel {
            return this._instance = this._instance || new YunMengMiJingModel();
        }

        private _selectTargetPos: Pos;  //需要移动到的点
        private _totalTimes: number = 0;/*总次数*/
        private _remainTimes: number = 0;/*剩余次数*/
        private _buyTimes: number = 0;/*购买的次数*/
        private _addTimes: number = 0;/*虚拟道具、卷轴加的次数*/
        private _ItemDate: Array<Item>;/*掉落的道具*/
        private _allBoss: Array<BossInfo>;/*所有boss信息*/
        private _lastBossOcc: number;
        private _state: boolean;
        private _totalCiShu: number;
        public _nameYunMeng: string = "深渊邀请函:";
        private _allBossJudgeAward: Array<BossJudgeAward>;/*所有BOSS结算奖励信息*/
        constructor() {
            this.totalCiShu = BlendCfg.instance.getCfgById(29101)[blendFields.intParam][0];//云梦之境每日次数
            let itemCfg: item_material = ItemMaterialCfg.instance.getItemCfgById(92630001);
            if (itemCfg) {
                this._nameYunMeng = itemCfg[item_materialFields.name] + ":";
            }
            // this.xianLingId = BlendCfg.instance.getCfgById(29102)[blendFields.intParam][0];//云梦之境总次数
        }

        /**
         * 所有BOSS结算奖励信息
         */
        public get allBossJudgeAward(): BossJudgeAward {
            if (this._allBossJudgeAward == undefined) {
                this._allBossJudgeAward = new Array<BossJudgeAward>();
            }
            let shuju = this._allBossJudgeAward.shift();
            return shuju;
        }

        public get getAllBossJudgeAward(): Array<BossJudgeAward> {
            if (this._allBossJudgeAward == undefined) {
                this._allBossJudgeAward = new Array<BossJudgeAward>();
            }
            return this._allBossJudgeAward;
        }

        public set allBossJudgeAward(value: BossJudgeAward) {
            if (this._allBossJudgeAward == undefined) {
                this._allBossJudgeAward = new Array<BossJudgeAward>();
            }
            if (value) {
                let typeNum = value[BossJudgeAwardFields.type];///*0:正常结算 1:最后一击 2:MVP 3:参与 4:排名结算 5:开宝箱*/
                this._allBossJudgeAward.push(value);
                // console.log("云梦秘境 boss死亡数据：   ", value);
                if (typeNum == 3) {
                    GlobalData.dispatcher.event(CommonEventType.YUNMENGMIJING_JUDGE_AWARD_UPDATE);
                } else if (typeNum == 1) {
                    GlobalData.dispatcher.event(CommonEventType.YUNMENGMIJING_JUDGE_AWARD_FINALLY);
                }
            }
        }

        /**
         * 云梦秘境 活动开启状态
         */
        public get totalCiShu(): number {
            return this._totalCiShu;
        }

        public set totalCiShu(value: number) {
            this._totalCiShu = value;
        }

        /**
         * 云梦秘境 活动开启状态
         */
        public get state(): boolean {
            return this._state;
        }

        public set state(value: boolean) {
            this._state = value;
        }

        /**
         * 总次数
         */
        public get totalTimes(): int {
            return this._totalTimes;
        }

        public set totalTimes(value: int) {
            this._totalTimes = value;
        }

        /**
         * 剩余次数
         */
        public get remainTimes(): int {
            return this._remainTimes;
        }

        public set remainTimes(value: int) {
            this._remainTimes = value;
        }

        /**
         * 购买的次数
         */
        public get buyTimes(): int {
            return this._buyTimes;
        }

        public set buyTimes(value: int) {
            this._buyTimes = value;
        }

        /**
         * 购买的次数
         */
        public get addTimes(): int {
            return this._addTimes;
        }

        public set addTimes(value: int) {
            this._addTimes = value;
        }

        /**
         * 掉落的道具
         */
        public get ItemDate(): Array<Item> {
            return this._ItemDate;
        }

        public set ItemDate(value: Array<Item>) {
            this._ItemDate = value;
        }

        // public set allBoss(value: Array<BossInfo>) {
        //     this._allBoss = value;
        // }
        //根据BOSSID获取服务器BOSS信息
        public getBossSeversInfoById(bossId: int): BossInfo {
            return DungeonModel.instance.getBossInfoById(bossId);
        }

        //根据对应id获取总boss表中信息
        public getCfgByid(id: number): MonsterRes {
            return MonsterResCfg.instance.getCfgById(id);
        }

        //获取需要移动到的地点
        public get selectTargetPos(): Pos {
            return this._selectTargetPos;
        }

        public get lastBossOcc(): number {
            return this._lastBossOcc;
        }

        //设置选择的目标
        public setSelectTarget(id: number, isBoss: boolean): void {
            let model = PlayerModel.instance;
            model.selectTarget(SelectTargetType.Monster, id);
            this._lastBossOcc = id;
            if (DungeonModel.instance.getBossInfoById(id)) {
                this._selectTargetPos = DungeonModel.instance.getBossInfoById(id)[BossInfoFields.pos];
            }
        }

        public showDrawNum() {
            GlobalData.dispatcher.event(CommonEventType.YUNMENGMIJING_UPDATE);
        }

        public getState(): boolean {
            if (!FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.cloudlandCopy)) {
                return false;
            }
            if (DungeonModel.instance.sceneStates) {
                let states: CopySceneState = DungeonModel.instance.getCopySceneStateByType(SceneTypeEx.cloudlandCopy);
                if (states) {
                    let state = states[CopySceneStateFields.state];
                    return (state == 2 && YunMengMiJingModel.instance.remainTimes > 0);
                }
            }
            return false;
        }
    }
}