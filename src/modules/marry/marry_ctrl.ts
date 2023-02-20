/////<reference path="../$.ts"/>
/** 姻缘 */
namespace modules.marry {
    import GetMarryInfoReply = Protocols.GetMarryInfoReply;
    import GetMarryWallListReply = Protocols.GetMarryWallListReply;
    import ReleaseMarryWallReply = Protocols.ReleaseMarryWallReply;
    import MarryDissolutionReply = Protocols.MarryDissolutionReply;
    import GetMarryWallListReplyFields = Protocols.GetMarryWallListReplyFields;
    import ReleaseMarryWallFields = Protocols.ReleaseMarryWallFields;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import CreateMarryReply = Protocols.CreateMarryReply;


    import GetLevelAwardListReply = Protocols.GetLevelAwardListReply;
    import GetLevelAwardListReplyFields = Protocols.GetLevelAwardListReplyFields;
    import GetLevelAwardReply = Protocols.GetLevelAwardReply;
    import GetLevelAwardReplyFields = Protocols.GetLevelAwardReplyFields;

    import GetMarryRingInfoReply = Protocols.GetMarryRingInfoReply;
    import GetMarryRingInfoReplyFields = Protocols.GetMarryRingInfoReplyFields;

    import FeedMarryRingReply = Protocols.FeedMarryRingReply;
    import FeedMarryRingReplyFields = Protocols.FeedMarryRingReplyFields;

    import GetMarryTaskInfoReply = Protocols.GetMarryTaskInfoReply;
    import GetMarryTaskInfoReplyFields = Protocols.GetMarryTaskInfoReplyFields;

    import FeedMarryReply = Protocols.FeedMarryReply;
    import FeedMarryReplyFields = Protocols.FeedMarryReplyFields;

    import GetMarryKeepsakeInfoReply = Protocols.GetMarryKeepsakeInfoReply;
    import GetMarryKeepsakeInfoReplyFields = Protocols.GetMarryKeepsakeInfoReplyFields;

    import AddMarryKeepsakeReply = Protocols.AddMarryKeepsakeReply;
    import AddMarryKeepsakeReplyFields = Protocols.AddMarryKeepsakeReplyFields;


    import GradeMarryKeepsakeReply = Protocols.GradeMarryKeepsakeReply;
    import GradeMarryKeepsakeReplyFields = Protocols.GradeMarryKeepsakeReplyFields;


    import GetMarryDollInfoReply = Protocols.GetMarryDollInfoReply;
    import GetMarryDollInfoReplyFields = Protocols.GetMarryDollInfoReplyFields;

    import FeedMarryDollReply = Protocols.FeedMarryDollReply;
    import FeedMarryDollReplyFields = Protocols.FeedMarryDollReplyFields;

    import GradeMarryDollReply = Protocols.GradeMarryDollReply;
    import GradeMarryDollReplyFields = Protocols.GradeMarryDollReplyFields;


    import AddMarryRingFeedSkillLevelReply = Protocols.AddMarryRingFeedSkillLevelReply;
    import AddMarryRingFeedSkillLevelReplyFields = Protocols.AddMarryRingFeedSkillLevelReplyFields;

    import AddMarryKeepsakeGradeSkillLevelReply = Protocols.AddMarryKeepsakeGradeSkillLevelReply;
    import AddMarryKeepsakeGradeSkillLevelReplyFields = Protocols.AddMarryKeepsakeGradeSkillLevelReplyFields;

    import AddMarryDollFeedSkillLevelReply = Protocols.AddMarryDollFeedSkillLevelReply;
    import AddMarryDollFeedSkillLevelReplyFields = Protocols.AddMarryDollFeedSkillLevelReplyFields;

    import AddMarryDollGradeSkillLevelReply = Protocols.AddMarryDollGradeSkillLevelReply;
    import AddMarryDollGradeSkillLevelReplyFields = Protocols.AddMarryDollGradeSkillLevelReplyFields;

    import MarryCopyMonsterWare = Protocols.MarryCopyMonsterWare;
    import MarryCopyMonsterWareFields = Protocols.MarryCopyMonsterWareFields;


    import RiseMarryDollRefineReply = Protocols.RiseMarryDollRefineReply;
    import RiseMarryDollRefineReplyFields = Protocols.RiseMarryDollRefineReplyFields;

    import PetFazhen = Protocols.PetFazhen;
    import PetFazhenFields = Protocols.PetFazhenFields;


    import GetMarryCopyTimesReply = Protocols.GetMarryCopyTimesReply;
    import GetMarryCopyTimesReplyFields = Protocols.GetMarryCopyTimesReplyFields;

    import UpdateMarryCopyTimes = Protocols.UpdateMarryCopyTimes;
    import UpdateMarryCopyTimesFields = Protocols.UpdateMarryCopyTimesFields;

    import ChangeMarryDollShowReply = Protocols.ChangeMarryDollShowReply;
    import ChangeMarryDollShowReplyFields = Protocols.ChangeMarryDollShowReplyFields;

    import BuyMarryPackageReply = Protocols.BuyMarryPackageReply;
    import BuyMarryPackageReplyFields = Protocols.BuyMarryPackageReplyFields;


    import GetMarryTaskAwardReply = Protocols.GetMarryTaskAwardReply;
    import GetMarryTaskAwardReplyFields = Protocols.GetMarryTaskAwardReplyFields;

    import UpdateMarryTask = Protocols.UpdateMarryTask;
    import UpdateMarryTaskFields = Protocols.UpdateMarryTaskFields;


    import UpdateMarryRingInfo = Protocols.UpdateMarryRingInfo;
    import UpdateMarryRingInfoFields = Protocols.UpdateMarryRingInfoFields;

    import UpdateMarryKeepsakeInfo = Protocols.UpdateMarryKeepsakeInfo;
    import UpdateMarryKeepsakeInfoFields = Protocols.UpdateMarryKeepsakeInfoFields;

    import UpdateMarryDollInfo = Protocols.UpdateMarryDollInfo;
    import UpdateMarryDollInfoFields = Protocols.UpdateMarryDollInfoFields;

    import UpdateMallInfo = Protocols.UpdateMallInfo;
    import UpdateMallInfoFields = Protocols.UpdateMallInfoFields;


    export class MarryCtrl extends BaseCtrl {
        private static _instance: MarryCtrl;
        public static get instance(): MarryCtrl {
            return this._instance = this._instance || new MarryCtrl();
        }

        public setup(): void {

            // AddMarryKeepsake = 0x2021d2,						/*激活/升级信物*/
            // GetMarryKeepsakeInfo = 0x2021d3,					/*获取信物信息*/
            // GradeMarryKeepsake = 0x2021d4,						/*进阶信物*/
            // AddMarryKeepsakeGradeSkillLevel = 0x2021d5,			/*信物升级技能*/

            // GetMarryCopyTimes = 0x2021d6,						/*获取姻缘副本次数*/
            // GetMarryTaskInfo = 0x2021d7,						/*获取姻缘任务信息*/
            // GetLevelAwardList = 0x2021d8,						/*获取等级奖励列表*/
            // GetLevelAward = 0x2021d9,							/*领取等级奖励*/
            // FeedMarryRing = 0x2021da,							/*喂养仙义戒指*/
            // FeedMarryDoll = 0x2021db,							/*喂养姻缘娃娃*/
            // GetMarryRingInfo = 0x2021dc,						/*获取仙义戒指信息*/
            // GetMarryDollInfo = 0x2021dd,						/*获取姻缘娃娃信息*/
            // AddMarryRingFeedSkillLevel = 0x2021de,				/*激活/升级技能*/
            // FeedMarry = 0x2021df,								/*喂养姻缘*/

            Channel.instance.subscribe(SystemClientOpcode.GetMarryInfoReply, this, this.GetMarryInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetMarryWallListReply, this, this.GetMarryWallListReply);
            Channel.instance.subscribe(SystemClientOpcode.ReleaseMarryWallReply, this, this.ReleaseMarryWallReply);
            Channel.instance.subscribe(SystemClientOpcode.MarryDissolutionReply, this, this.MarryDissolutionReply);
            Channel.instance.subscribe(SystemClientOpcode.CreateMarryReply, this, this.CreateMarryReply);

            Channel.instance.subscribe(SystemClientOpcode.GetLevelAwardListReply, this, this.GetLevelAwardListReply);
            Channel.instance.subscribe(SystemClientOpcode.GetLevelAwardReply, this, this.GetLevelAwardReply);

            Channel.instance.subscribe(SystemClientOpcode.FeedMarryRingReply, this, this.FeedMarryRingReply);


            Channel.instance.subscribe(SystemClientOpcode.FeedMarryReply, this, this.FeedMarryReply);


            Channel.instance.subscribe(SystemClientOpcode.AddMarryKeepsakeReply, this, this.AddMarryKeepsakeReply);
            Channel.instance.subscribe(SystemClientOpcode.GradeMarryKeepsakeReply, this, this.GradeMarryKeepsakeReply);


            Channel.instance.subscribe(SystemClientOpcode.FeedMarryDollReply, this, this.FeedMarryDollReply);
            Channel.instance.subscribe(SystemClientOpcode.GradeMarryDollReply, this, this.GradeMarryDollReply);
            Channel.instance.subscribe(SystemClientOpcode.AddMarryRingFeedSkillLevelReply, this, this.AddMarryRingFeedSkillLevelReply);
            Channel.instance.subscribe(SystemClientOpcode.AddMarryKeepsakeGradeSkillLevelReply, this, this.AddMarryKeepsakeGradeSkillLevelReply);
            Channel.instance.subscribe(SystemClientOpcode.RiseMarryDollRefineReply, this, this.RiseMarryDollRefineReply);
            Channel.instance.subscribe(SystemClientOpcode.GetMarryCopyTimesReply, this, this.GetMarryCopyTimesReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateMarryCopyTimes, this, this.UpdateMarryCopyTimes);


            Channel.instance.subscribe(SystemClientOpcode.BuyMarryPackageReply, this, this.BuyMarryPackageReply);
            Channel.instance.subscribe(SystemClientOpcode.GetMarryTaskAwardReply, this, this.GetMarryTaskAwardReply);

            Channel.instance.subscribe(SystemClientOpcode.AddMarryDollGradeSkillLevelReply, this, this.AddMarryDollGradeSkillLevelReply);
            Channel.instance.subscribe(SystemClientOpcode.ChangeMarryDollShowReply, this, this.ChangeMarryDollShowReply);

            Channel.instance.subscribe(SystemClientOpcode.AddMarryDollFeedSkillLevelReply, this, this.AddMarryDollFeedSkillLevelReply);

            Channel.instance.subscribe(SystemClientOpcode.UpdateMarryTask, this, this.UpdateMarryTask);
            Channel.instance.subscribe(SystemClientOpcode.GetMarryTaskInfoReply, this, this.GetMarryTaskInfoReply);

            Channel.instance.subscribe(SystemClientOpcode.UpdateMarryRingInfo, this, this.UpdateMarryRingInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetMarryRingInfoReply, this, this.GetMarryRingInfoReply);


            Channel.instance.subscribe(SystemClientOpcode.UpdateMarryKeepsakeInfo, this, this.UpdateMarryKeepsakeInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetMarryKeepsakeInfoReply, this, this.GetMarryKeepsakeInfoReply);

            Channel.instance.subscribe(SystemClientOpcode.UpdateMarryDollInfo, this, this.UpdateMarryDollInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetMarryDollInfoReply, this, this.GetMarryDollInfoReply);


            // Channel.instance.subscribe(SystemClientOpcode.GetMarryWallListReply, this, this.GetMarryWallListReply);
            // Channel.instance.subscribe(SystemClientOpcode.GetMarryInfoReply, this, this.GetMarryInfoReply);
            // Channel.instance.subscribe(SystemClientOpcode.MarryDissolutionReply, this, this.MarryDissolutionReply);
            //Channel.instance.subscribe(SystemClientOpcode.CreateMarryReply, this, this.CreateMarryReply);
           
            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.GetMarryCopyTimes();
            this.GetMarryInfo();
            this.GetMarryWallList('');
            this.GetLevelAwardList();
            this.GetMarryRingInfo();
            this.GetMarryTaskInfo();
            this.GetMarryKeepsakeInfo();
            this.GetMarryDollInfo();        
        }

        public UpdateMarryRingInfo(tuple: UpdateMarryRingInfo): void {
            // ** console.log('研发测试_chy:UpdateMarryRingInfo', tuple);
            // this.GetMarryRingInfo();
            MarryModel.instance.setRingInfo(tuple)
        }

        public UpdateMarryKeepsakeInfo(tuple: UpdateMarryKeepsakeInfo): void {
            // ** console.log('研发测试_chy:UpdateMarryKeepsakeInfo', tuple);
            // this.GetMarryKeepsakeInfo();
            MarryModel.instance.setKeepsakeLevel(tuple[UpdateMarryKeepsakeInfoFields.feed])
            MarryModel.instance.setKeepsakeLevel2(tuple[UpdateMarryKeepsakeInfoFields.rank])

        }


        public UpdateMarryDollInfo(tuple: UpdateMarryDollInfo): void {
            // ** console.log('研发测试_chy:UpdateMarryDollInfo', tuple);
            //this.GetMarryDollInfo();
            MarryModel.instance.curDoll = tuple[UpdateMarryDollInfoFields.curShowId]
            MarryModel.instance.setDollLevel(tuple[UpdateMarryDollInfoFields.feed])
            MarryModel.instance.setDollClassLevel(tuple[UpdateMarryDollInfoFields.grade])
            MarryModel.instance.setDollEatLevel(tuple[UpdateMarryDollInfoFields.refine])

        }

        public UpdateMallInfo(tuple: UpdateMallInfo): void {
            // ** console.log('研发测试_chy:UpdateMallInfo', tuple);
            this.GetMarryInfo();

        }



        public GetLevelAwardListReply(tuple: GetLevelAwardListReply): void {
            // ** console.log('研发测试_chy:GetLevelAwardListReply', tuple);
            MarryModel.instance.setRewardMap(tuple[GetLevelAwardListReplyFields.list])

        }
        public GetLevelAwardReply(tuple: GetLevelAwardReply): void {
            // ** console.log('研发测试_chy:GetLevelAwardReply', tuple);
            if (tuple[0] == 0) {
                this.GetMarryInfo();
            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
        }


        public GetMarryInfoReply(tuple: GetMarryInfoReply): void {
            // ** console.log('研发测试_chy:GetMarryInfoReply', tuple);
            // uuid = 0,			/*姻缘id*/
            // level = 1,
            // exp = 2,
            // member = 3,			/*姻缘成员信息*/
            MarryModel.instance.setInfo(tuple);
        }

        public GetMarryWallListReply(tuple: GetMarryWallListReply): void {
            // ** console.log('研发测试_chy:GetMarryWallListReply', tuple);
            //搜索返回
            if (tuple[0] == 0) {
                MarryModel.instance.wallList = tuple[GetMarryWallListReplyFields.list]
            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
        }

        public ReleaseMarryWallReply(tuple: ReleaseMarryWallReply): void {
            // ** console.log('研发测试_chy:ReleaseMarryWallReply', tuple);
            if (0 == tuple[ReleaseMarryWallFields.result]) this.GetMarryWallList('');
            if (tuple[0] == 0) {

            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
        }

        public MarryDissolutionReply(tuple: MarryDissolutionReply): void {
            // ** console.log('研发测试_chy:MarryDissolutionReply', tuple);
            if (tuple[0] == 0) {

            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
        }

        public CreateMarryReply(tuple: CreateMarryReply): void {
            // ** console.log('研发测试_chy:CreateMarryReply', tuple);
            if (tuple[0] == 0) {
                WindowManager.instance.close(WindowEnum.MARRY_Wall_PANEL);
                WindowManager.instance.open(WindowEnum.MARRY_PANEL);
            } else {
                CommonUtil.codeDispose(tuple[0], "");
            }
        }

        public GetMarryWallList(name: string): void {
            // ** console.log('研发测试_chy:GetMarryWallList', name);
            Channel.instance.publish(UserCenterOpcode.GetMarryWallList, [name]);
        }

        public MarryDissolution(): void {
            Channel.instance.publish(UserCenterOpcode.MarryDissolution, null);
        }

        public CreateMarry(playerId: number): void {
            // ** console.log('研发测试_chy:CreateMarry', playerId);
            Channel.instance.publish(UserCenterOpcode.CreateMarry, [playerId]);
        }

        public ReleaseMarryWall(msg: string, index: number): void {
            // ** console.log('研发测试_chy:ReleaseMarryWall', msg, index);
            Channel.instance.publish(UserCenterOpcode.ReleaseMarryWall, [msg, index]);
        }

        public GetMarryInfo(): void {
            // ** console.log('研发测试_chy:GetMarryInfo',);
            Channel.instance.publish(UserCenterOpcode.GetMarryInfo, null);
        }

        public GetLevelAward(level: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetLevelAward, [level]);

        }

        public GetLevelAwardList(): void {
            Channel.instance.publish(UserFeatureOpcode.GetLevelAwardList, null);
        }

        public GetMarryRingInfo(): void {
            // ** console.log('研发测试_chy:GetMarryRingInfo',);
            Channel.instance.publish(UserFeatureOpcode.GetMarryRingInfo, null);
        }

        public GetMarryRingInfoReply(tuple: GetMarryRingInfoReply): void {
            // ** console.log('研发测试_chy:GetMarryRingInfoReply', tuple);
            MarryModel.instance.setRingInfo(tuple)

        }

        public FeedMarryRing(): void {
            // ** console.log('研发测试_chy:FeedMarryRing',);
            Channel.instance.publish(UserFeatureOpcode.FeedMarryRing, null);
        }

        public FeedMarryRingReply(tuple: FeedMarryRingReply): void {
            if (tuple[0] == 0) {
                this.GetMarryRingInfo();
            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
            // ** console.log('研发测试_chy:FeedMarryRingReply', tuple);
        }


        public GetMarryTaskInfo(): void {
            // ** console.log('研发测试_chy:GetMarryTaskInfo',);
            Channel.instance.publish(UserFeatureOpcode.GetMarryTaskInfo, null);
        }
        public GetMarryTaskInfoReply(tuple: GetMarryTaskInfoReply): void {
            // ** console.log('研发测试_chy:GetMarryTaskInfoReply', tuple);
            MarryModel.instance.setTask(tuple)

        }

        public UpdateMarryTask(tuple: UpdateMarryTask): void {
            // ** console.log('研发测试_chy:UpdateMarryTask', tuple);
            MarryModel.instance.updateTask(tuple)


        }

        public FeedMarry(): void {
            // ** console.log('研发测试_chy:FeedMarry',);
            Channel.instance.publish(UserFeatureOpcode.FeedMarry, null);
        }
        public FeedMarryReply(tuple: FeedMarryReply): void {
            if (tuple[0] == 0) {
                this.GetMarryInfo()
            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
            // ** console.log('研发测试_chy:FeedMarryReply', tuple);


        }

        public GetMarryKeepsakeInfo(): void {
            //获取信物信息
            // ** console.log('研发测试_chy:GetMarryKeepsakeInfo',);
            Channel.instance.publish(UserFeatureOpcode.GetMarryKeepsakeInfo, null);
        }
        public GetMarryKeepsakeInfoReply(tuple: GetMarryKeepsakeInfoReply): void {
            // ** console.log('研发测试_chy:GetMarryKeepsakeInfoReply 获取信物信息', tuple);
            if (tuple == null) {
                console.log('研发测试_chy:GetMarryKeepsakeInfoReply 获取信物信息', tuple);
                return;
            }
            MarryModel.instance.setKeepsakeLevel(tuple[GetMarryKeepsakeInfoReplyFields.feed])
            MarryModel.instance.setKeepsakeLevel2(tuple[GetMarryKeepsakeInfoReplyFields.rank])
        }

        public AddMarryKeepsake(itemId: number): void {
            // ** console.log('研发测试_chy:AddMarryKeepsake', itemId);
            Channel.instance.publish(UserFeatureOpcode.AddMarryKeepsake, [itemId]);
        }
        public GradeMarryKeepsake(itemId: number): void {
            // ** console.log('研发测试_chy:GradeMarryKeepsake', itemId);
            Channel.instance.publish(UserFeatureOpcode.GradeMarryKeepsake, [itemId]);
        }
        public AddMarryKeepsakeReply(tuple: AddMarryKeepsakeReply): void {
            if (tuple[0] == 0) {
                // ** console.log('研发测试_chy: 姻缘信物升级',);
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
                // MarryModel.instance.setData(tuple[FeedMarryReplyFields.level], tuple[FeedMarryReplyFields.exp])
                this.GetMarryKeepsakeInfo();
            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
            // ** console.log('研发测试_chy:AddMarryKeepsakeReply', tuple);
        }

        public GradeMarryKeepsakeReply(tuple: GradeMarryKeepsakeReply): void {
            if (tuple[0] == 0) {
                // ** console.log('研发测试_chy: 姻缘信物进阶',);
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong.png");
                // MarryModel.instance.setData(tuple[FeedMarryReplyFields.level], tuple[FeedMarryReplyFields.exp])
                this.GetMarryKeepsakeInfo();
            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
            // ** console.log('研发测试_chy:GradeMarryKeepsakeReplyFields', tuple);
        }


        public GetMarryDollInfo(): void {
            //获取仙娃
            // ** console.log('研发测试_chy:GetMarryDollInfo',);
            Channel.instance.publish(UserFeatureOpcode.GetMarryDollInfo, null);
        }
        public GetMarryDollInfoReply(tuple: GetMarryDollInfoReply): void {
            MarryModel.instance.curDoll = tuple[GetMarryDollInfoReplyFields.curShowId]
            MarryModel.instance.setDollLevel(tuple[GetMarryDollInfoReplyFields.feed])
            MarryModel.instance.setDollClassLevel(tuple[GetMarryDollInfoReplyFields.grade])
            MarryModel.instance.setDollEatLevel(tuple[GetMarryDollInfoReplyFields.refine])

            // ** console.log('研发测试_chy:GetMarryDollInfoReply', tuple);
        }

        public FeedMarryDoll(id: number): void {
            //仙娃培养
            // ** console.log('研发测试_chy:FeedMarryDoll', id);
            Channel.instance.publish(UserFeatureOpcode.FeedMarryDoll, [id]);
        }
        public FeedMarryDollReply(tuple: FeedMarryDollReply): void {


            if (tuple[1] == 0) {
                // ** console.log('研发测试_chy: 姻缘仙娃升级',);
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
                // MarryModel.instance.setData(tuple[FeedMarryReplyFields.level], tuple[FeedMarryReplyFields.exp])
                this.GetMarryDollInfo();
            }
            else {
                CommonUtil.codeDispose(tuple[1], "");
            }
            // ** console.log('研发测试_chy:FeedMarryDollReply', tuple);
        }

        public GradeMarryDoll(id: number): void {
            //仙娃进阶培养
            // ** console.log('研发测试_chy:GradeMarryDoll', id);
            Channel.instance.publish(UserFeatureOpcode.GradeMarryDoll, [id]);
        }
        public GradeMarryDollReply(tuple: GradeMarryDollReply): void {
            if (tuple[0] == 0) {
                //进阶成功
                // ** console.log('研发测试_chy: 姻缘仙娃进阶',);
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
                this.GetMarryDollInfo();
            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
            // ** console.log('研发测试_chy:GradeMarryDollReply', tuple);
        }


        public AddMarryRingFeedSkillLevel(id: number): void {
            //戒指技能升级
            // ** console.log('研发测试_chy:AddMarryRingFeedSkillLevel', id);
            Channel.instance.publish(UserFeatureOpcode.AddMarryRingFeedSkillLevel, [id]);
        }
        public AddMarryRingFeedSkillLevelReply(tuple: AddMarryRingFeedSkillLevelReply): void {
            if (tuple[0] == 0) {
                // ** console.log('研发测试_chy: 姻缘义戒培养',);
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
                this.GetMarryRingInfo();
            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
            // ** console.log('研发测试_chy:AddMarryRingFeedSkillLevelReply', tuple);
        }


        public AddMarryKeepsakeGradeSkillLevel(id: number): void {
            //信物技能升级
            // ** console.log('研发测试_chy:AddMarryKeepsakeGradeSkillLevel', id);
            Channel.instance.publish(UserFeatureOpcode.AddMarryKeepsakeGradeSkillLevel, [id]);
        }
        public AddMarryKeepsakeGradeSkillLevelReply(tuple: AddMarryKeepsakeGradeSkillLevelReply): void {
            if (tuple[0] == 0) {
                // ** console.log('研发测试_chy: 姻缘信物技能',);
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
                this.GetMarryKeepsakeInfo();
            } else {
                CommonUtil.codeDispose(tuple[0], "");
            }
            // ** console.log('研发测试_chy:AddMarryKeepsakeGradeSkillLevelReply', tuple);
        }


        public AddMarryDollFeedSkillLevel(id: number): void {
            //仙娃技能升级
            // ** console.log('研发测试_chy:AddMarryDollFeedSkillLevel', id);
            Channel.instance.publish(UserFeatureOpcode.AddMarryDollFeedSkillLevel, [id]);
        }
        public AddMarryDollFeedSkillLevelReply(tuple: AddMarryDollFeedSkillLevelReply): void {
            if (tuple[0] == 0) {
                // ** console.log('研发测试_chy: 姻缘仙娃技能',);
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
                this.GetMarryDollInfo();
            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
            // ** console.log('研发测试_chy:AddMarryDollFeedSkillLevelReply', tuple);
        }

        public AddMarryDollGradeSkillLevel(id: number): void {
            //仙娃进阶技能升级
            // ** console.log('研发测试_chy:AddMarryDollGradeSkillLevel', id);
            Channel.instance.publish(UserFeatureOpcode.AddMarryDollGradeSkillLevel, [id]);
        }
        public AddMarryDollGradeSkillLevelReply(tuple: AddMarryDollGradeSkillLevelReply): void {
            if (tuple[0] == 0) {
                // ** console.log('研发测试_chy: 姻缘信仙娃进阶技能',);
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
                this.GetMarryDollInfo();
            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
            // ** console.log('研发测试_chy:AddMarryDollGradeSkillLevelReply', tuple);
        }

        public MarryCopyMonsterWare(tuple: MarryCopyMonsterWare): void {
            MarryModel.instance.updataWave(tuple)
            // ** console.log('研发测试_chy:MarryCopyMonsterWare', tuple);
        }




        public RiseMarryDollRefine(type: number): void {
            //进补
            // ** console.log('研发测试_chy:RiseMarryDollRefine', type);
            Channel.instance.publish(UserFeatureOpcode.RiseMarryDollRefine, [type]);
        }
        public RiseMarryDollRefineReply(tuple: RiseMarryDollRefineReply): void {
            if (tuple[0] == 0) {
                // ** console.log('研发测试_chy: 姻缘进补',);
                SuccessEffectCtrl.instance.play("assets/others/tx_jinbuchenggong.png");
                this.GetMarryDollInfo();
            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
            // ** console.log('研发测试_chy:RiseMarryDollRefineReply', tuple);
        }



        public GetMarryCopyTimes(): void {
            //获取姻缘次数
            // ** console.log('研发测试_chy:GetMarryCopyTimes',);
            Channel.instance.publish(UserFeatureOpcode.GetMarryCopyTimes, null);
        }
        public GetMarryCopyTimesReply(tuple: GetMarryCopyTimesReply): void {
            MarryModel.instance.setCopyInfo(tuple[GetMarryCopyTimesReplyFields.times])
            // ** console.log('研发测试_chy:GetMarryCopyTimesReply', tuple);
        }
        public UpdateMarryCopyTimes(tuple: UpdateMarryCopyTimes): void {
            MarryModel.instance.setCopyInfo(tuple[UpdateMarryCopyTimesFields.times])
            // ** console.log('研发测试_chy:UpdateMarryCopyTimes', tuple);
        }


        public ChangeMarryDollShow(id: number): void {
            //更换仙娃
            // ** console.log('研发测试_chy:ChangeMarryDollShow', id);
            Channel.instance.publish(UserFeatureOpcode.ChangeMarryDollShow, [id]);
        }
        public ChangeMarryDollShowReply(tuple: ChangeMarryDollShowReply): void {
            if (tuple[0] == 0) {
                this.GetMarryDollInfo();
            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
            // ** console.log('研发测试_chy:ChangeMarryDollShowReply', tuple);
        }

        public GetMarryTaskAward(id: number): void {
            //提交任务
            // ** console.log('研发测试_chy:GetMarryTaskAward', id);
            Channel.instance.publish(UserFeatureOpcode.GetMarryTaskAward, [id]);
        }
        public GetMarryTaskAwardReply(tuple: GetMarryTaskAwardReply): void {
            if (tuple[0] == 0) {

            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
            // ** console.log('研发测试_chy:GetMarryTaskAwardReply', tuple);
        }

        public BuyMarryPackage(id: number): void {
            //购买礼包
            // ** console.log('研发测试_chy:BuyMarryPackage', id);
            Channel.instance.publish(UserFeatureOpcode.BuyMarryPackage, [id]);
        }
        public BuyMarryPackageReply(tuple: BuyMarryPackageReply): void {
            if (tuple[0] == 0) {
                this.GetMarryInfo()
            }
            else {
                CommonUtil.codeDispose(tuple[0], "");
            }
            // ** console.log('研发测试_chy:BuyMarryPackageReply', tuple);
        }




    }
}