
namespace modules.sprint_rank {
    import CustomList = modules.common.CustomList;
    import SprintRankModel = modules.sprint_rank.SprintRankModel;
    import SprintRankNode = Protocols.SprintRankNode;
    import SprintRankInfo = Protocols.SprintRankInfo;
    import SprintRankNodeFields = Protocols.SprintRankNodeFields;
    import SprintRankInfoFields = Protocols.SprintRankInfoFields;
    import springRankItem = modules.spring_rank.springRankItem;
    import SprintRankTaskModel = modules.sprint_rank.SprintRankTaskModel;
    import SprintRankTaskNodeFields = Protocols.SprintRankTaskNodeFields;
    import SprintRankCtrl = modules.sprint_rank.SprintRankCtrl;
    import SprintRankTaskCtrl = modules.sprint_rank.SprintRankTaskCtrl;
    import SoaringRankCfg = modules.config.SoaringRankCfg;
    import feisheng_rankFields = Configuration.feisheng_rankFields;
    import FeishengRankInfo = Protocols.FeishengRankInfo;
    import FeishengRankInfoFields = Protocols.FeishengRankInfoFields;
    /*历史记录返回数据*/
    import GetSprintRankBeforeReply = Protocols.GetSprintRankBeforeReply;
    import GetSprintRankBeforeReplyFields = Protocols.GetSprintRankBeforeReplyFields;
    export class SprintRankJieZhiAlert extends modules.soaring_rank.SoaringRankJieZhiAlert {
        constructor() {
            super();
        }
    }
}