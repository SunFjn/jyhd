namespace modules.rename {
    export enum SetName {
        isHideSelfGSZL = "isHideSelfGSZL",
        isHideSelfSpirit = "isHideSelfSpirit",
        isHideSelfWing = "isHideSelfWing",
        isHideSelfPet = "isHideSelfPet",
        isHideSelfSkillEffect = "isHideSelfSkillEffect",
        isHideSelfPetSkillEffect = "isHideSelfPetSkillEffect",
        isHideSelfGuangHuan = "isHideSelfGuangHuan",
        isHideBossSkillEffect = "isHideBossSkillEffect",
        isHideOtherPalyerAllExtents = "isHideOtherPalyerAllExtents",
        isHideOtherPalyerAllEffects = "isHideOtherPalyerAllEffects",
    }
    export class SetCtrl {
        private static _instance: SetCtrl;
        public static get instance(): SetCtrl {
            return this._instance = this._instance || new SetCtrl();
        }

        private _isHideSelfGSZL = false;//是否隐藏自己鬼神之力
        private _isHideSelfSpirit = false;//是否隐藏自己精灵
        private _isHideSelfWing = false;//是否隐藏自己翅膀
        private _isHideSelfPet = false;//是否隐藏自己宠物
        private _isHideSelfSkillEffect = false;//是否隐藏自己技能特效
        private _isHideSelfGuangHuan = false;//是否隐藏自己光环
        private _isHideSelfPetSkillEffect = false;//是否隐藏自己宠物技能特效
        private _isHideBossSkillEffect = false;//是否隐藏boss技能特效
        private _isHideOtherPalyerAllExtents = false;//是否隐藏其他玩家的所有外显
        private _isHideOtherPalyerAllEffects = false;//是否隐藏其他玩家的所有特效

        //是否隐藏自己鬼神之力
        public get isHideSelfGSZL() {
            this._isHideSelfGSZL = CommonUtil.localStorageGetItem(SetName.isHideSelfGSZL) ? parseInt(CommonUtil.localStorageGetItem(SetName.isHideSelfGSZL)) == 1 : false;
            return this._isHideSelfGSZL;
        }

        //是否隐藏自己精灵
        public get isHideSelfSpirit() {
            this._isHideSelfSpirit = CommonUtil.localStorageGetItem(SetName.isHideSelfSpirit) ? parseInt(CommonUtil.localStorageGetItem(SetName.isHideSelfSpirit)) == 1 : false;
            return this._isHideSelfSpirit;
        }

        //是否隐藏自己翅膀
        public get isHideSelfWing() {
            this._isHideSelfWing = CommonUtil.localStorageGetItem(SetName.isHideSelfWing) ? parseInt(CommonUtil.localStorageGetItem(SetName.isHideSelfWing)) == 1 : false;
            return this._isHideSelfWing;
        }

        //是否隐藏自己宠物
        public get isHideSelfPet() {
            this._isHideSelfPet = CommonUtil.localStorageGetItem(SetName.isHideSelfPet) ? parseInt(CommonUtil.localStorageGetItem(SetName.isHideSelfPet)) == 1 : false;
            return this._isHideSelfPet;
        }

        //是否隐藏自己技能特效
        public get isHideSelfSkillEffect() {
            this._isHideSelfSkillEffect = CommonUtil.localStorageGetItem(SetName.isHideSelfSkillEffect) ? parseInt(CommonUtil.localStorageGetItem(SetName.isHideSelfSkillEffect)) == 1 : false;
            return this._isHideSelfSkillEffect;
        }

        //是否隐藏自己宠物技能特效
        public get isHideSelfPetSkillEffect() {
            this._isHideSelfPetSkillEffect = CommonUtil.localStorageGetItem(SetName.isHideSelfPetSkillEffect) ? parseInt(CommonUtil.localStorageGetItem(SetName.isHideSelfPetSkillEffect)) == 1 : false;
            return this._isHideSelfPetSkillEffect;
        }

        //是否隐藏boss技能特效
        public get isHideBossSkillEffect() {
            this._isHideBossSkillEffect = CommonUtil.localStorageGetItem(SetName.isHideBossSkillEffect) ? parseInt(CommonUtil.localStorageGetItem(SetName.isHideBossSkillEffect)) == 1 : false;
            return this._isHideBossSkillEffect;
        }

        //是否隐藏其他玩家的所有外显
        public get isHideOtherPalyerAllExtents() {
            this._isHideOtherPalyerAllExtents = CommonUtil.localStorageGetItem(SetName.isHideOtherPalyerAllExtents) ? parseInt(CommonUtil.localStorageGetItem(SetName.isHideOtherPalyerAllExtents)) == 1 : false;
            return this._isHideOtherPalyerAllExtents;
        }

        //是否隐藏其他玩家的所有特效
        public get isHideOtherPalyerAllEffects() {
            this._isHideOtherPalyerAllEffects = CommonUtil.localStorageGetItem(SetName.isHideOtherPalyerAllEffects) ? parseInt(CommonUtil.localStorageGetItem(SetName.isHideOtherPalyerAllEffects)) == 1 : false;
            return this._isHideOtherPalyerAllEffects;
        }

        //是否隐藏其他玩家的所有特效
        public get isHideSelfGuangHuan() {
            this._isHideSelfGuangHuan = CommonUtil.localStorageGetItem(SetName.isHideSelfGuangHuan) ? parseInt(CommonUtil.localStorageGetItem(SetName.isHideSelfGuangHuan)) == 1 : false;
            return this._isHideSelfGuangHuan;
        }

        /**
         * 过滤外显不需要的参数
         * @param exterior 外显参数[clothes: number, weapon: number, wing: number, ride: number,rideFazhen:number, tianZhu: number]
         * @param type 角色类型
         * @returns 
         */
        filterRoleExterior(exterior: number[], type: RoleType): any {
            let pExterior = exterior;
            if (type == RoleType.Master) {
                //鬼神之力
                if (SetCtrl.instance.isHideSelfGuangHuan) {
                    pExterior[6] = 0;
                }
                //鬼神之力
                if (SetCtrl.instance.isHideSelfGSZL) {
                    pExterior[5] = 0;
                }
                //翅膀
                if (SetCtrl.instance.isHideSelfWing) {
                    pExterior[2] = 0;
                }
                //精灵
                if (SetCtrl.instance.isHideSelfSpirit) {
                    pExterior[3] = 0;
                }
            } else if (SetCtrl.instance.isHideOtherPalyerAllExtents && type == RoleType.Player) {
                //光环
                //鬼神之力
                //翅膀
                //精灵
                pExterior[6] = 0;
                pExterior[5] = 0;
                pExterior[2] = 0;
                pExterior[3] = 0;
            }
            return pExterior;
        }

        /**
         * 是否能够播放技能特效
         * @param type 角色类型
         * @param isPet 是否是宠物
         */
        isPlaySkillEffect(type: RoleType, isPet): boolean {
            if (type == RoleType.Master) {
                if (SetCtrl.instance.isHideSelfSkillEffect && !isPet) {
                    return false;
                }
                if ((SetCtrl.instance.isHideSelfPet || SetCtrl.instance.isHideSelfPetSkillEffect) && isPet) {
                    return false;
                }
            } else if (type == RoleType.Player) {
                if (SetCtrl.instance.isHideOtherPalyerAllEffects || SetCtrl.instance.isHideSelfSkillEffect) {
                    return false;
                }
            } else if (type == RoleType.Monster) {
                if (SetCtrl.instance.isHideBossSkillEffect) {
                    return false;
                }
            }
            return true;
        }
    }
}