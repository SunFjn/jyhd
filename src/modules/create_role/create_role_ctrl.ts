///<reference path="../core/base_ctrl.ts"/>
///<reference path="../common/common_util.ts"/>
///<reference path="../../game/misc/statistics.ts"/>

/**
 * name
 */
module modules.createRole {
    import BaseCtrl = modules.core.BaseCtrl;
    import Channel = net.Channel;
    import SystemClientOpcode = Protocols.SystemClientOpcode;
    import UserNexusOpcode = Protocols.UserNexusOpcode;
    import WindowEnum = ui.WindowEnum;
    import ActorLoginReply = Protocols.ActorLoginReply;
    import ActorLoginReplyFields = Protocols.ActorLoginReplyFields;

    export class CreateRoleCtrl extends BaseCtrl {
        private static _instance: CreateRoleCtrl;

        public static get instance(): CreateRoleCtrl {
            if (!CreateRoleCtrl._instance) CreateRoleCtrl._instance = new CreateRoleCtrl();
            return CreateRoleCtrl._instance;
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.ActorLoginReply, this, this.actorLoginReply);
        }

        // 请求创建角色
        public actorLogin(name: string, sex: int) {
            PlatParams.recordStep(RecordStep.StartCreateRole);
            Channel.instance.publish(UserNexusOpcode.ActorLogin, [name, sex]);
        }

        // 创建角色回调
        public actorLoginReply(tuple: ActorLoginReply): void {
            let result = tuple[ActorLoginReplyFields.result];
            if (result == ErrorCode.Success) {
                // Statistics.authRequest(3, tuple[Protocols.ActorLoginReplyFields.actor]);
                // PlayerModel.instance.actorId = tuple[Protocols.ActorLoginReplyFields.actor];
                PlayerCtrl.instance.initBaseInfo(tuple[ActorLoginReplyFields.actor], tuple[ActorLoginReplyFields.baseAttr], true);
                WindowManager.instance.close(WindowEnum.CREATE_ROLE_PANEL);
                Browser.container.style.display = "none";

                // 微信小游戏渠道-需要打开登录界面
                if (Main.instance.isWXChannel) {
                    console.log("aaaaaa");
                    WindowManager.instance.open(WindowEnum.LOGIN_PANEL);
                }

                // GlobalData.dispatcher.event(CommonEventType.LOGIN_SUCCESS, tuple[Protocols.ActorLoginReplyFields.actor]);
                // GlobalData.isCreateRole = true;
            } else {
                // CommonUtil.alert("创角", "错误码：" + result);
                GlobalData.dispatcher.event(CommonEventType.CREATE_ROLE_FAIL, result);
            }
        }
    }
}