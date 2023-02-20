/** 仙盟工具*/
namespace modules.faction {
    export class FactionUtil {

        public static limitShowNames: string[] = [
            `解散公会`,
            `审批入会申请`,
            `广播招人`,
            `设定入会条件`,
            `修改公告`,
            `修改宣传语`,
            `踢出公会`,
            `任命副会长`,
            `任命优秀会员`,
        ];

        public static limitShowList: FactionPower[] = [
            FactionPower.dissolution,
            FactionPower.examine,
            FactionPower.broadcast,
            FactionPower.setJoinLimit,
            FactionPower.setNotice,
            FactionPower.setTitle,
            FactionPower.kick,
            FactionPower.deputyLeader,
            FactionPower.huFa,
        ];

        public static post: FactionPosition[] = [
            FactionPosition.member,
            FactionPosition.leader,
            FactionPosition.deputyLeader,
            FactionPosition.huFa,
        ];

        public static postNames: string[] = [
            `成员`,
            `会长`,
            `副会长`,
            `优秀会员`,
        ];

        //对应颜色
        public static boxName: string[] = [
            `四海宝藏`,
            `蛮荒宝藏`,
            `太古宝藏`,
            `开天宝藏`,
            `圣墟宝藏`,
        ];

    }
}
