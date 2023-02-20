/** 重命名*/


namespace modules.rename {
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetSetNameInfoReply = Protocols.GetSetNameInfoReply;
    import UpdateNameReply = Protocols.UpdateNameReply;
    import UpdateOccReply = Protocols.UpdateOccReply;
    import SetNameReply = Protocols.SetNameReply;
    import SetNameReplyFields = Protocols.SetNameReplyFields;
    import UpdateOccReplyFields = Protocols.UpdateOccReplyFields;
    import ActorShow = Protocols.ActorShow;
    import SceneModel = modules.scene.SceneModel;
    import HumanShow = Protocols.HumanShow;
    import GameCenter = game.GameCenter;
    import UpdateNameReplyFields = Protocols.UpdateNameReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    import SetHeadImgReply = Protocols.SetHeadImgReply;
    import SetHeadImgReplyFields = Protocols.SetHeadImgReplyFields;
    import GetHeadImgListReply = Protocols.GetHeadImgListReply;
    import GetHeadImgListReplyFields = Protocols.GetHeadImgListReplyFields;
    import ActiveHeadImgReply = Protocols.ActiveHeadImgReply;
    import ActiveHeadImgReplyFields = Protocols.ActiveHeadImgReplyFields;

    export class RenameCtrl extends BaseCtrl {
        private static _instance: RenameCtrl;
        public static get instance(): RenameCtrl {
            return this._instance = this._instance || new RenameCtrl();
        }

        setup(): void {
            // 获取重命名信息返回
            Channel.instance.subscribe(SystemClientOpcode.GetSetNameInfoReply, this, this.getSetNameInfoReply);
            // 更新名字
            Channel.instance.subscribe(SystemClientOpcode.UpdateNameReply, this, this.updateNameReply);
            // 更新职业
            Channel.instance.subscribe(SystemClientOpcode.UpdateOccReply, this, this.updateOccReply);
            // 改名返回
            Channel.instance.subscribe(SystemClientOpcode.SetNameReply, this, this.setNameReply);
            // 获取拥有头像列表返回
            Channel.instance.subscribe(SystemClientOpcode.GetHeadImgListReply, this, this.GetHeadImgListReply);
            // 激活或升级头像返回
            Channel.instance.subscribe(SystemClientOpcode.ActiveHeadImgReply, this, this.ActiveHeadImgReply);
            // 设置头像返回
            Channel.instance.subscribe(SystemClientOpcode.SetHeadImgReply, this, this.SetHeadImgReply);

            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.checkRP);


            //SetHeadImg = 0x2021be,                                                                /*设置头像*/
            //GetHeadImgList = 0x2021bf,                                                        /*获取拥有头像列表*/
            //ActiveHeadImg = 0x2021c0,                                                         /*激活或升级头像*/

            //SetHeadImgReply = 0x100236e,                                                        /*设置头像返回*/
            //GetHeadImgListReply = 0x100236f,                                                /*获取拥有头像列表返回*/
            //ActiveHeadImgReply = 0x1002370,                                                        /*激活或升级头像返回*/
            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.getSetNameInfo();
            this.GetHeadImgList();
        }

        public SetHeadImg(id): void {
            // console.log("设置头像...................");
            Channel.instance.publish(UserFeatureOpcode.SetHeadImg, [id]);
        }

        public GetHeadImgList(): void {
            // console.log("获取拥有头像列表...................");
            Channel.instance.publish(UserFeatureOpcode.GetHeadImgList, null);
        }
        public ActiveHeadImg(id): void {
            // console.log("激活或升级头像..................." + id);
            Channel.instance.publish(UserFeatureOpcode.ActiveHeadImg, [id]);
        }

        private SetHeadImgReply(value: SetHeadImgReply): void {
            // console.log("设置头像返回...................", value);
            let code = value[SetHeadImgReplyFields.result]
            if (code === ErrorCode.Success) {
                SystemNoticeManager.instance.addNotice("设置头像成功");
                PlayerModel.instance.selectHead = value[SetHeadImgReplyFields.id];
                this.GetHeadImgList();
                GlobalData.dispatcher.event(CommonEventType.HEADER_UPDATE);
            } else {
                CommonUtil.noticeError(code);
            }
        }

        private ActiveHeadImgReply(value: ActiveHeadImgReply): void {
            // console.log("激活或升级头像返回...................", value);
            let code = value[ActiveHeadImgReplyFields.result]
            if (code === ErrorCode.Success) {
                this.GetHeadImgList();
            } else {
                CommonUtil.noticeError(code)
            }




        }
        private GetHeadImgListReply(value: GetHeadImgListReply): void {
            // console.log("获取拥有头像列表返回...................", value);
            RenameModel.instance.setheadList(value)

        }


        // 获取重命名信息
        public getSetNameInfo(): void {
            // console.log("获取重命名信息................");
            Channel.instance.publish(UserFeatureOpcode.GetSetNameInfo, null);
        }
        // 获取重命名信息返回
        private getSetNameInfoReply(value: GetSetNameInfoReply): void {
            // console.log("获取重命名信息返回......................", value);
            RenameModel.instance.renameInfo = value;
        }

        // 设置名字和职业
        public setNameSex(name: string, occ: number): void {
            // console.log("设置名字和职业...................", name, occ);
            Channel.instance.publish(UserFeatureOpcode.SetNameOcc, [name, occ]);
        }
        // 改名返回
        private setNameReply(value: SetNameReply): void {
            // console.log("改名返回...................", value);
            let code: number = value[SetNameReplyFields.result];
            if (code === ErrorCode.Success) {
                WindowManager.instance.close(WindowEnum.RENAME_PANEL);
                SystemNoticeManager.instance.addNotice("改名成功");
            } else {
                CommonUtil.noticeError(code);
            }
        }

        // 更新名字
        private updateNameReply(value: UpdateNameReply): void {
            // console.log("更新名字........................", value);
            let roleId: number = value[UpdateNameReplyFields.roleID];
            if (roleId === PlayerModel.instance.actorId) {
                PlayerModel.instance.roleName = value[UpdateNameReplyFields.name];
            }
            // 更新场景
            let role = GameCenter.instance.getRole(roleId);
            if (role != null) {
                role.property.set("name", value[UpdateNameReplyFields.name]);
            }
            RenameModel.instance.updateNameReply = value;
        }

        // 更新性别
        private updateOccReply(value: UpdateOccReply): void {
            // console.log("更新性别.........................", value);
            let roleId: number = value[UpdateOccReplyFields.roleID];
            if (roleId === PlayerModel.instance.actorId) {
                PlayerModel.instance.occ = value[UpdateOccReplyFields.occ];
            }
            // 更新场景
            // let role = GameCenter.instance.getRole(roleId);
            // if (role != null) {
            //     let context = role.property;
            //     let arr:[number, number, number, number, number, number] = context.get("exterior");
            //     arr[0] = Math.round(arr[0] / 10) * 10 + PlayerModel.instance.occ;
            //     context.set("exterior", arr);
            // }
            RenameModel.instance.updateOccReply = value;
        }

        //检测红点
       private checkRP(){
            RenameModel.instance.setCanActiveRP();
       }
    }
}