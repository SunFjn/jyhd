/** 九天之巅*/


namespace modules.nine {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import GetNineCopyRankReply = Protocols.GetNineCopyRankReply;
    import UpdateNineCopy = Protocols.UpdateNineCopy;
    import GetNineCopyReply = Protocols.GetNineCopyReply;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetNineCopyRankReplyFields = Protocols.GetNineCopyRankReplyFields;
    import GetNineCopyReplyFields = Protocols.GetNineCopyReplyFields;
    import UserMapOpcode = Protocols.UserMapOpcode;
    import ReqSearchObjReply = Protocols.ReqSearchObjReply;
    import ScenePromote = Protocols.ScenePromote;
    import UpdateScore = Protocols.UpdateScore;
    import NineCopyJudgeAward = Protocols.NineCopyJudgeAward;
    import ScenePromoteFields = Protocols.ScenePromoteFields;
    import UpdateNineCopyFields = Protocols.UpdateNineCopyFields;
    import LogUtils = game.misc.LogUtils;
    import ReqSearchObjReplyFields = Protocols.ReqSearchObjReplyFields;
    import SceneModel = modules.scene.SceneModel;

    export class NineCtrl extends BaseCtrl {
        private static _instance: NineCtrl;
        public static get instance(): NineCtrl {
            return this._instance = this._instance || new NineCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetNineCopyRankReply, this, this.getNineCopyRankReply);
            Channel.instance.subscribe(SystemClientOpcode.GetNineCopyReply, this, this.getNineCopyReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateNineCopy, this, this.updateNineCopy);
            // 场景晋级
            Channel.instance.subscribe(SystemClientOpcode.ScenePromote, this, this.scenePromote);
            // 更新积分
            Channel.instance.subscribe(SystemClientOpcode.UpdateScore, this, this.updateScore);
            // 九天之巅副本结算
            Channel.instance.subscribe(SystemClientOpcode.NineCopyJudgeAward, this, this.nineCopyJudgeAward);
            // 搜索对象返回
            Channel.instance.subscribe(SystemClientOpcode.ReqSearchObjReply, this, this.reqSearchObjReply);

            
            // LogUtils.enable(LogFlags.Nine);
            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            this.getNineCopy();
        }

        // 获取九天排名
        public getNineCopyRank(): void {
            LogUtils.info(LogFlags.Nine, "获取九天排名......................");
            Channel.instance.publish(UserCenterOpcode.GetNineCopyRank, null);
        }

        // 获取九天排名返回
        private getNineCopyRankReply(value: GetNineCopyRankReply): void {
            LogUtils.info(LogFlags.Nine, "获取九天排名返回......................" + value);
            NineModel.instance.ranks = value[GetNineCopyRankReplyFields.ranks];
        }

        // 获取九天之巅个人数据
        public getNineCopy(): void {
            LogUtils.info(LogFlags.Nine, "获取九天之巅个人数据..............");
            Channel.instance.publish(UserFeatureOpcode.GetNineCopy, null);
        }

        // 获取九天之巅个人数据返回
        private getNineCopyReply(value: GetNineCopyReply): void {
            LogUtils.info(LogFlags.Nine, "获取九天之巅个人数据返回............." + value);
            NineModel.instance.nineCopy = value[GetNineCopyReplyFields.nineCopy];
        }

        // 更新九天副本
        private updateNineCopy(value: UpdateNineCopy): void {
            LogUtils.info(LogFlags.Nine, "更新九天副本............." + value);
            NineModel.instance.nineCopy = value[UpdateNineCopyFields.nineCopy];
        }

        // 搜索对象,type:1玩家 2怪物 3道具 4NPC
        public reqSearchObj(type: int): void {
            LogUtils.info(LogFlags.Nine, "搜索对象..................." + type);
            Channel.instance.publish(UserMapOpcode.ReqSearchObj, [type]);
        }

        // 搜索对象返回
        private reqSearchObjReply(value: ReqSearchObjReply): void {
            LogUtils.info(LogFlags.Nine, "搜索对象返回.................." + value);
            NineModel.instance.searchObj = value;
            let searchType: SearchType = value[ReqSearchObjReplyFields.type];
            if (searchType === SearchType.actor) {
                let objId: number = value[ReqSearchObjReplyFields.objId];
                if (!SceneModel.instance.getRoleByObjId(objId)) {
                    objId = -1;
                }
                PlayerModel.instance.selectTarget(SelectTargetType.Player, -1);
            } else if (searchType === SearchType.monster) {
                let objId: number = value[ReqSearchObjReplyFields.objId];
                if (!SceneModel.instance.getRoleByObjId(objId)) {
                    objId = -1;
                }
                PlayerModel.instance.selectTarget(SelectTargetType.Monster, -1);
            }

        }

        // 场景晋级
        private scenePromote(value: ScenePromote): void {
            LogUtils.info(LogFlags.Nine, "场景晋级......................." + value);
            NineModel.instance.scenePromote = value;
            let lv: number = value[ScenePromoteFields.level];
            if (lv === 8) {       // 通关最后一层
                WindowManager.instance.open(WindowEnum.IMG_TITLE_ALERT, 1);
            } else {      // 通关前几层
                WindowManager.instance.open(WindowEnum.IMG_TITLE_ALERT, 2);
            }
            PlayerModel.instance.selectTarget(SelectTargetType.Dummy, -1);
        }

        // 更新积分
        private updateScore(value: UpdateScore): void {
            LogUtils.info(LogFlags.Nine, "更新积分......................." + value);
            NineModel.instance.score = value;
        }

        // 九天之巅副本结算
        private nineCopyJudgeAward(value: NineCopyJudgeAward): void {
            LogUtils.info(LogFlags.Nine, "九天之巅副本结算......................." + value);
            WindowManager.instance.open(WindowEnum.NINE_RESULT_ALERT, value);
        }
    }

}