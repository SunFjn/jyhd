/**
 * 玩家数据类
 */
///<reference path="../common/common_util.ts"/>
///<reference path="../clan/clan_model.ts"/>
///<reference path="../redpack/redpack_model.ts"/>

module modules.player {
    import Dictionary = Laya.Dictionary;
    import PartItemFields = Protocols.PartItemFields;
    import Skill = Protocols.Skill;
    import Unit = utils.Unit;
    import TypesAttr = Protocols.TypesAttr;
    import ActorBaseAttr = Protocols.ActorBaseAttr;
    import ActorBaseAttrFields = Protocols.ActorBaseAttrFields;
    import ClanModel = modules.clan.ClanModel;
    import Point = Laya.Point;
    import RedPackModel = modules.redpack.RedPackModel;
    import SkillFields = Protocols.SkillFields;

    export class PlayerModel {
        private static _instance: PlayerModel = new PlayerModel();

        public static get instance(): PlayerModel {
            return PlayerModel._instance;
        }

        // 玩家基本属性
        private _id: number;
        //当前所在的服务器ID
        private _serverPgId: number;
        private _playerBaseAttr: ActorBaseAttr;
        private _playerTotolAttrs: Array<TypesAttr>;
        // 战力
        private _fight: number;

        // 装备
        private _equipsDic: Dictionary = new Dictionary();

        private _skills: Array<Skill>;
        private _cooldowns: Array<Cooldwon> = [];

        //转升等级
        private _bornLev: number;

        // 血量
        private _hp: number = 1;
        // 最大血量
        private _maxHp: number = 1;
        //更新之前的战力值
        public beforefight: number = 0;

        //选中头像的id
        public selectHead: number = 0;

        public playerDeadTuple: Protocols.BroadcastDead = null;
        // 主角死亡时间
        public playerDeadTime: number = 0;

        private _pkMode: number = 0;
        private _day: number = 0;
        private _createTime: number = 0;//创建角色时间
        private _selectTargetType: SelectTargetType = SelectTargetType.Monster;  //选择的目标类型,0是没目标，1是怪物，2是玩家
        private _selectTargetId: number = -1;

        private _selfPgId: number = 1;

        private _autoAi: boolean = true;
        private _moveDirection: number = -1;
        private _customize: Point = null
        // 角色名字
        private _roleName: string;

        // 玩家信息已经初始化获取到
        private _userInfoInitGeted: boolean = false;
        // 玩家战力已经初始化获取到
        private _userFightInitGeted: boolean = false;
        // 已经首次登录上报
        private _alreadyUpReport: boolean = false;

        private constructor() {

        }

        /**
         * 创角服务器ID
         */
        public get selfPgId(): number {
            return this._selfPgId;
        }

        /**
         * 创建角色时间
         */
        public get createTime(): number {
            return this._createTime;
        }

        /**
         * 创建角色时间
         */
        public set createTime(value: number) {
            this._createTime = value;
        }

        /**
         * 角色是否创角大于七天（）
         */
        public getDay(): boolean {
            let createTime = modules.player.PlayerModel.instance.createTime;
            let chaNUM = GlobalData.serverTime - createTime;
            // console.log("创建角色时间：" + createTime);
            // console.log("服务器时间：" + GlobalData.serverTime);
            let oneDayNum = Unit.week;
            if (chaNUM > oneDayNum) {
                return true;
            }
            return false;
        }

        /**
         * 获取创角天数
         */
        public getDayNum(): number {
            let createTime = modules.player.PlayerModel.instance.createTime;
            let chaNUM = GlobalData.serverTime - createTime;
            let oneDayNum = Unit.day;
            let dayNum = 1;

            if (chaNUM < oneDayNum) {
                dayNum = 1;
                return dayNum;
            } else {
                let dayNum = 1 + chaNUM / oneDayNum;
                let dayNum1 = dayNum >> 0;
                if (dayNum1 < dayNum) {//如果有余数说明实际上已经算是下一天了天数加一
                    dayNum1 = dayNum1 + 1;
                }
                // console.log("实际天数：" + dayNum);
                // console.log("计算后天数：" + dayNum1);
                return dayNum1;

            }
        }

        public getDayNum1(): number {
            let createTime = modules.player.PlayerModel.instance.createTime;
            let chaNUM = GlobalData.serverTime - createTime;
            let oneDayNum = Unit.day;
            let dayNum = 1;

            let date: Date = new Date(createTime);
            let hours = date.getHours();
            let day = date.getDate();

            let dateNow: Date = new Date(GlobalData.serverTime);
            let hoursNow = dateNow.getHours();
            let dayNow = dateNow.getDate();
            //必须凌晨5点之后才算 过一天
            if (chaNUM < oneDayNum) {
                if (dayNow == day) {
                    if (hours < 5) {
                        if (hoursNow >= 5) {
                            dayNum = 2;
                        } else {
                            dayNum = 1;
                        }
                    } else {
                        dayNum = 1;
                    }
                } else {
                    if (hours < 5) {
                        if (hoursNow >= 5) {
                            dayNum = 3;
                        } else {
                            dayNum = 2;
                        }
                    } else {
                        if (hoursNow >= 5) {
                            dayNum = 2;
                        } else {
                            dayNum = 1;
                        }
                    }
                }
                return dayNum;
            } else {
                let dayNum = chaNUM / oneDayNum;
                let dayNum1 = dayNum >> 0; //算出天数的整数这个是必定要加的天数
                if (hours < 5) {
                    if (hoursNow >= 5) {
                        dayNum1 += 2;
                    } else {
                        dayNum1 += 1;
                    }
                } else {
                    if (hoursNow >= 5) {
                        dayNum1 += 1;
                    }
                }
                return dayNum1;
            }
        }

        /**
         * 开服天数
         */
        public get openDay(): number {
            return this._day;
        }

        /**
         * 开服天数
         */
        public set openDay(value: number) {
            this._day = value;
        }

        public set bornLev(lev: int) {
            this._bornLev = lev;
            this._playerBaseAttr[ActorBaseAttrFields.eraLvl] = Math.floor(lev * 0.01);
            this._playerBaseAttr[ActorBaseAttrFields.eraNum] = lev % 100;
            GlobalData.dispatcher.event(CommonEventType.PLAYER_BORN_LEV);
        }

        public get bornLev(): int {
            return this._bornLev;
        }

        public get actorId(): number {
            return this._id;
        }

        public set actorId(value: number) {
            this._id = value;
        }

        public get playerBaseAttr(): ActorBaseAttr {
            return this._playerBaseAttr;
        }

        public set playerBaseAttr(value: ActorBaseAttr) {
            this._playerBaseAttr = value;
            this.roleName = this._playerBaseAttr[ActorBaseAttrFields.name];
            this.occ = this._playerBaseAttr[ActorBaseAttrFields.occ];
            this.selectHead = this._playerBaseAttr[ActorBaseAttrFields.headImg] || 0;
            // console.log(`玩家等级为--->${this._playerBaseAttr[ActorBaseAttrFields.level] }`);
            // console.log(`玩家经验为--->${this._playerBaseAttr[ActorBaseAttrFields.exp] }`);
            this._serverPgId = value[ActorBaseAttrFields.serverPgId];
            this._createTime = value[ActorBaseAttrFields.createTime];
            this._selfPgId = value[ActorBaseAttrFields.selfPgId];
            this.initUpReport(false);
            GlobalData.dispatcher.event(CommonEventType.PLAYER_BASE_ATTR_UPDATE);
        }

        // 玩家总属性
        public get playerTotolAttrs(): Array<TypesAttr> {
            return this._playerTotolAttrs;
        }

        public set playerTotolAttrs(value: Array<TypesAttr>) {
            this._playerTotolAttrs = value;
            GlobalData.dispatcher.event(CommonEventType.PLAYER_TOTAL_ATTR_UPDATE);
        }

        public get serverPgId(): number {
            return this._serverPgId;
        }

        // 血量
        public get hp(): number {
            return this._hp;
        }

        public set hp(value: number) {
            if (this._hp === value) return;
            this._hp = value;
            GlobalData.dispatcher.event(CommonEventType.PLAYER_UPDATE_HP);
        }

        // 最大血量
        public get maxHp(): number {
            return this._maxHp;
        }

        public set maxHp(value: number) {
            this._maxHp = value;
            GlobalData.dispatcher.event(CommonEventType.PLAYER_UPDATE_MAX_HP);
        }

        // 更新玩家等级
        public updateLevel(level: number): void {
            if (this.level === level) return;
            if (this.level !== level) {       // 升级
                PlatParams.playerLevelUp();
                RedPackModel.instance.checkRP(true);
            }
            this._playerBaseAttr[ActorBaseAttrFields.level] = level;
            GlobalData.dispatcher.event(CommonEventType.PLAYER_UPDATE_LEVEL);
        }

        // 获取玩家等级
        public get level(): number {
            return this._playerBaseAttr[ActorBaseAttrFields.level];
        }

        // 获取玩家代币券
        public get ingot(): number {
            return this._playerBaseAttr[ActorBaseAttrFields.gold];
        }

        public getCurrencyById(id: MoneyItemId): number {
            let num: number;
            switch (id) {
                case MoneyItemId.glod: {
                    num = this._playerBaseAttr[ActorBaseAttrFields.gold];
                }
                    break;
                case MoneyItemId.bind_gold: {
                    num = this._playerBaseAttr[ActorBaseAttrFields.bind_gold];
                }
                    break;
                case MoneyItemId.copper: {
                    num = this._playerBaseAttr[ActorBaseAttrFields.copper];
                }
                    break;
                case MoneyItemId.zq: {
                    num = this._playerBaseAttr[ActorBaseAttrFields.zq];
                }
                    break;
                case MoneyItemId.exp: {
                    num = this._playerBaseAttr[ActorBaseAttrFields.exp];
                }
                    break;
                case MoneyItemId.honor: {
                    num = this._playerBaseAttr[ActorBaseAttrFields.tiantiHonor];
                }
                    break;
                case MoneyItemId.lingqi: {
                    num = xianfu.XianfuModel.instance.treasureInfos(0);
                }
                    break;
                case MoneyItemId.fugui: {
                    num = xianfu.XianfuModel.instance.treasureInfos(1);
                }
                    break;
                case MoneyItemId.clanCoin: {
                    num = this._playerBaseAttr[ActorBaseAttrFields.clanCoin];
                }
                    break;
                case MoneyItemId.FairyCoin: {
                    num = modules.zxian_yu.ZXianYuModel.instance.xianyu
                }
                    break;
            }
            return num;
        }

        // 获取玩家觉醒等级
        public get eraLevel(): number {
            if (!this._playerBaseAttr) {
                return 0;
            }
            return this._playerBaseAttr[ActorBaseAttrFields.eraLvl];
        }

        public get exp(): number {
            return this._playerBaseAttr ? this._playerBaseAttr[ActorBaseAttrFields.exp] : 0;
        }

        // 获取玩家金币
        public get copper(): number {
            return this._playerBaseAttr[ActorBaseAttrFields.copper];
        }

        // 更新玩家经验
        public updateExp(exp: number): void {
            this._playerBaseAttr[ActorBaseAttrFields.exp] = exp;
            GlobalData.dispatcher.event(CommonEventType.PLAYER_UPDATE_EXP);
        }

        // 更新货币
        public UpdateMoney(tuple: Protocols.UpdateMoney): void {
            this._playerBaseAttr[ActorBaseAttrFields.copper] = tuple[Protocols.UpdateMoneyFields.copper];
            this._playerBaseAttr[ActorBaseAttrFields.gold] = tuple[Protocols.UpdateMoneyFields.gold];
            this._playerBaseAttr[ActorBaseAttrFields.bind_gold] = tuple[Protocols.UpdateMoneyFields.bind_gold];
            GlobalData.dispatcher.event(CommonEventType.PLAYER_UPDATE_MONEY);
        }

        // 更新魔力
        public updateZQ(zq: number): void {
            this._playerBaseAttr[ActorBaseAttrFields.zq] = zq;
            GlobalData.dispatcher.event(CommonEventType.PLAYER_UPDATE_ZQ);
        }

        // 天梯荣誉
        public get tiantiHonor(): number {
            if (!this._playerBaseAttr) return 0;
            return this._playerBaseAttr[ActorBaseAttrFields.tiantiHonor];
        }

        public set tiantiHonor(value: number) {
            if (this._playerBaseAttr) {
                this._playerBaseAttr[ActorBaseAttrFields.tiantiHonor] = value;
                GlobalData.dispatcher.event(CommonEventType.PLAYER_UPDATE_HONOR);
            }
        }

        // 战队币
        public get clanCoin(): number {
            if (!this._playerBaseAttr) return 0;
            return this._playerBaseAttr[ActorBaseAttrFields.clanCoin];
        }

        public set clanCoin(value: number) {
            if (this._playerBaseAttr) {
                this._playerBaseAttr[ActorBaseAttrFields.clanCoin] = value;
                GlobalData.dispatcher.event(CommonEventType.UPDATE_CLAN_COIN);
            }
        }

        // 更新战力
        public UpdateFight(fight: number): void {
            this.beforefight = this._fight;
            this._fight = fight;
            this.initUpReport(true);
            GlobalData.dispatcher.event(CommonEventType.PLAYER_UPDATE_FIGHT);
        }

        // 登录上报，只会执行一次
        private initUpReport(isFight: boolean) {
            if (this._alreadyUpReport) return;
            if (isFight && !this._userFightInitGeted) this._userFightInitGeted = true;
            if (!isFight && !this._userInfoInitGeted) this._userInfoInitGeted = true;
            // 登录上报，只会执行一次
            if (this._userInfoInitGeted && this._userFightInitGeted) {
                // console.log("首次登录上报！");
                this._alreadyUpReport = true;
                PlatParams.playerLogin();
            }
        }

        public get fight(): number {
            return this._fight;
        }

        // 根据部位获取装备
        public getEquipByPart(part: int): Protocols.Item {
            return this._equipsDic.get(part);
        }

        public setEquips(value: Array<Protocols.Item>): void {
            for (let i: int = 0, len = value.length; i < len; i++) {
                let part: int = modules.common.CommonUtil.getPartById(value[i][Protocols.ItemFields.ItemId]);
                this._equipsDic.set(part, value[i]);
            }
            GlobalData.dispatcher.event(CommonEventType.PLAYER_EQUIPS_INITED);
        }

        public get equipsDic(): Dictionary {
            return this._equipsDic;
        }

        // 穿戴装备
        public wearEquip(item: Protocols.Item): void {
            let part: int = modules.common.CommonUtil.getPartById(item[Protocols.ItemFields.ItemId]);
            this._equipsDic.set(part, item);
            GlobalData.dispatcher.event(CommonEventType.PLAYER_WEAR_EQUIP, item);
        }

        // 穿戴多个装备
        public wearEquips(items: Array<Protocols.PartItem>): void {
            for (let i: int = 0, len = items.length; i < len; i++) {
                this._equipsDic.set(items[i][PartItemFields.part], items[i][PartItemFields.item]);
            }
            GlobalData.dispatcher.event(CommonEventType.PLAYER_WEAR_EQUIPS, [items]);
        }

        public get skills(): Array<Protocols.Skill> {
            return this._skills;
        }

        public set skills(value: Array<Protocols.Skill>) {
            this._skills = value;
        }

        public getInfoBySkill(id: number) {
            for (let skill of this._skills) {
                let skillClass = skill[SkillFields.skillId];
                let id = skillClass * 10000 + skill[SkillFields.level];
                if (id == skillClass) return id;
            }
            return 0;
        }

        public get cooldowns(): Array<Cooldwon> {
            return this._cooldowns;
        }

        public get pkMode(): number {
            return this._pkMode;
        }

        public set pkMode(value: number) {
            if (this._pkMode == value) {
                return;
            }
            this._pkMode = value;
            GlobalData.dispatcher.event(CommonEventType.PLAYER_UPDATE_PK_MODE);
        }

        // 职业
        public get occ(): number {
            return this._playerBaseAttr[ActorBaseAttrFields.occ];
        }
        public set occ(value: number) {
            if (value === this._playerBaseAttr[ActorBaseAttrFields.occ]) return;
            this._playerBaseAttr[ActorBaseAttrFields.occ] = value;
            GlobalData.dispatcher.event(CommonEventType.PLAYER_UPDATE_OCC);
        }

        // 角色名字
        public get roleName(): string {
            return this._playerBaseAttr[ActorBaseAttrFields.name];
        }
        public set roleName(value: string) {
            // 运营 在屏蔽字库加了s为屏蔽字 这里会把玩家名字 sf.xxx 变成 *f.xxx
            // let regName: string = StringUtils.replaceFilterWords(value, "*");
            // if (regName === this._playerBaseAttr[ActorBaseAttrFields.name]) return;
            let regName: string = value
            if (regName === this._playerBaseAttr[ActorBaseAttrFields.name]) return;
            this._playerBaseAttr[ActorBaseAttrFields.name] = regName;
            GlobalData.dispatcher.event(CommonEventType.PLAYER_UPDATE_NAME);
        }

        public selectTarget(type: SelectTargetType, id: number): void {
            this._selectTargetType = type;
            this._selectTargetId = id;
            GlobalData.dispatcher.event(CommonEventType.PLAYER_TARGET_CHANGE);
        }

        public get selectTargetType(): SelectTargetType {
            return this._selectTargetType;
        }

        public set selectTargetType(value: SelectTargetType) {
            this._selectTargetType = value;
        }

        //根本目标类型不同含义不同，当目标类型为Player时为角色id,当目标类型为Monster和Npc时为occ
        public get selectTargetId(): number {
            return this._selectTargetId;
        }

        public set autoAi(value: boolean) {
            if (value) {
                // 设置 行为树控制 关闭控制立即生效 开启控制延迟2秒
                Laya.timer.once(2000, this, this.setAuto)
                return;
            }
            Laya.timer.clear(this, this.setAuto)
            this._autoAi = value;
        }

        private setAuto() {
            this._autoAi = true
        }
        public get autoAi(): boolean {
            return this._autoAi;
        }



        public set moveDirection(value: number) {
            this._moveDirection = value;
        }
        public get moveDirection(): number {
            return this._moveDirection;
        }

        public set customizePoint(value: Point) {
            this._customize = value;
        }
        public get customizePoint(): Point {
            return this._customize;
        }

    }
}
