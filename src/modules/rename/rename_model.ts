/** 重命名*/


namespace modules.rename {
    import GetSetNameInfoReply = Protocols.GetSetNameInfoReply;
    import UpdateNameReply = Protocols.UpdateNameReply;
    import UpdateOccReply = Protocols.UpdateOccReply;
    import UpdateOccReplyFields = Protocols.UpdateOccReplyFields;
    import GetSetNameInfoReplyFields = Protocols.GetSetNameInfoReplyFields;
    import GetHeadImgListReply = Protocols.GetHeadImgListReply;
    import headImgDataFields = Protocols.headImgDataFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import headFields = Configuration.headFields;
    import BagModel = modules.bag.BagModel;

    export class RenameModel {
        private static _instance: RenameModel;
        public static get instance(): RenameModel {
            return this._instance = this._instance || new RenameModel();
        }

        // 重命名信息
        private _renameInfo: GetSetNameInfoReply;
        // 名字
        private _updateNameReply: UpdateNameReply;
        // 职业
        private _updateOccReply: UpdateOccReply;

        constructor() {
            this._headList = new Map<number, number>()
            this._headList.set(0, 1)
        }

        // 重命名信息
        public get renameInfo(): GetSetNameInfoReply {
            return this._renameInfo;
        }
        public set renameInfo(value: GetSetNameInfoReply) {
            this._renameInfo = value;
            GlobalData.dispatcher.event(CommonEventType.RENAME_INFO_UPDATE);
        }

        // 名字
        public get updateNameReply(): UpdateNameReply {
            return this._updateNameReply;
        }
        public set updateNameReply(value: UpdateNameReply) {
            this._updateNameReply = value;
            GlobalData.dispatcher.event(CommonEventType.RENAME_NAME_UPDATE);
        }


        // 性别
        public get updateOccReply(): UpdateOccReply {
            return this._updateOccReply;
        }
        public set updateOccReply(value: UpdateOccReply) {
            this._updateOccReply = value;
            GlobalData.dispatcher.event(CommonEventType.RENAME_OCC_UPDATE);
        }

        //头像列表
        public _headList: Map<number, number> = new Map<number, number>()        //头像id;


        public setheadList(value: GetHeadImgListReply) {
            value[0].forEach(e => {
                this._headList.set(e[headImgDataFields.id], e[headImgDataFields.level])
            })
            this.setCanActiveRP();
            GlobalData.dispatcher.event(CommonEventType.HEADER_DATA_UPDATE);
        }


        // 有可激活头像的红点
        public setCanActiveRP() {
            let activeRP = false;
            let arr = HeadCfg.instance.getAllHeadId()

            for (let index = 0; index < arr.length; index++) {
                // 是否有可激活和升级的头像，判断红点显示
                let activecfg = HeadCfg.instance.getLevelConfig(arr[index], 1);
                let data = activecfg[headFields.items];
                let level = RenameModel.instance.getHeadLevel(arr[index])
                let nextcfg = HeadCfg.instance.getLevelConfig(arr[index], level + 1);
                let count = BagModel.instance.getItemCountById(Number(data[0]));
                let canUp = count >= data[1] && nextcfg != null;
                if (canUp) {
                    activeRP = true;
                    break;
                }
            }

            // 触发红点
            RedPointCtrl.instance.setRPProperty("HeadCanActiveRP", activeRP);
        }

        //返回头像等级
        public getHeadLevel(id: number): number {
            return this._headList.get(id) || 0
        }
        //选择头像id
        public get selectHeadId(): number {
            return PlayerModel.instance.selectHead;
        }




    }
}