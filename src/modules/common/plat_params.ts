// 平台参数
namespace modules.common {
    import PlayerModel = modules.player.PlayerModel;
    import ActorBaseAttr = Protocols.ActorBaseAttr;
    import ActorBaseAttrFields = Protocols.ActorBaseAttrFields;

    export class PlatParams {
        // 平台标识
        public static platform: string;
        // 平台玩家ID
        public static userId: string;
        // 账号名
        public static account: string;
        // 服务器ID
        public static serverId: number;
        // sign
        public static sign: string = "";
        // 后台地址
        public static backstage: string;
        // 浏览器useragent
        public static userAgent: string;
        // cdn
        public static cdn: string = "";
        // 数据
        public static data: any;
        // 包号
        public static package: number = 0;
        // 是否为新玩家（新玩家不走选服页）1是新玩家 0是有账号的玩家
        public static newRegister: number = 0;

        // 购买
        public static askPay(productId: number, price: number): void {
            let attr: ActorBaseAttr = PlayerModel.instance.playerBaseAttr;
            let roleId: number = PlayerModel.instance.actorId;
            let roleName: string = attr[ActorBaseAttrFields.name];
            let roleLv: number = attr[ActorBaseAttrFields.level];
            let occ: number = attr[ActorBaseAttrFields.occ];
            console.log(roleId, roleName, roleLv, occ, productId, price);
            ask_pay(roleId, roleName, roleLv, occ, productId, price);
        }

        // 后台日志创角
        public static playerCreate(): void {
            let attr: ActorBaseAttr = PlayerModel.instance.playerBaseAttr;
            let roleId: number = PlayerModel.instance.actorId;
            let roleName: string = attr[ActorBaseAttrFields.name];
            let roleLv: number = attr[ActorBaseAttrFields.level];
            player_create(roleId, roleName, roleLv);
        }

        // 后台日志登录
        public static playerLogin(): void {
            let attr: ActorBaseAttr = PlayerModel.instance.playerBaseAttr;
            let roleId: number = PlayerModel.instance.actorId;
            let roleName: string = attr[ActorBaseAttrFields.name];
            let roleLv: number = attr[ActorBaseAttrFields.level];
            player_login(roleId, roleName, roleLv);
        }

        // 后台日志升级
        public static playerLevelUp(): void {
            //等级不统一 延迟500毫秒再取数据
            Laya.timer.once(500, this, (): void => {
                let attr: ActorBaseAttr = PlayerModel.instance.playerBaseAttr;
                let roleId: number = PlayerModel.instance.actorId;
                let roleName: string = attr[ActorBaseAttrFields.name];
                let roleLv: number = attr[ActorBaseAttrFields.level];
                player_level_up(roleId, roleName, roleLv);
            })
        }

        // 埋点
        public static recordStep(step: number): void {
            let roleId: number = PlayerModel.instance.actorId || 0;
            record_step(step, roleId);
        }

        // 后台分享        callBack(status, params)
        public static playerShare(callBack: Function): void {
            let roleId: number = PlayerModel.instance.actorId;
            player_share(roleId, callBack);
        }

        // 实名认证
        public static playerRealName(callBack: Function): void {
            player_realname(callBack);
        }

        // 关注
        public static playerFollow(callBack: Function): void {
            player_follow(PlayerModel.instance.actorId, callBack);
        }

        // 绑定手机
        public static playerBindPhone(callBack: Function): void {
            player_bindphone(callBack);
        }

        constructor() {

        }


    }
}