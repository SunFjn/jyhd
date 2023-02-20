/**
 * 幻化控制器
 * */


namespace modules.illusion {
    import BaseCtrl = modules.core.BaseCtrl;
    import ChangeMagicShow = Protocols.ChangeMagicShow;
    import ChangeMagicShowReply = Protocols.ChangeMagicShowReply;
    import ChangeMagicShowReplyFields = Protocols.ChangeMagicShowReplyFields;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import RiseMagicShow = Protocols.RiseMagicShow;
    import RiseMagicShowReply = Protocols.RiseMagicShowReply;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import RiseRideMagicShowReply = Protocols.RiseRideMagicShowReply;
    import RiseRideMagicShow = Protocols.RiseRideMagicShow;
    import ChangeRideShowReply = Protocols.ChangeRideShowReply;
    import ChangeRideShowReplyFields = Protocols.ChangeRideShowReplyFields;
    import ChangeRideMagicShow = Protocols.ChangeRideMagicShow;
    import RiseMagicShowReplyFields = Protocols.RiseMagicShowReplyFields;
    import MagicPetModel = modules.magicPet.MagicPetModel;
    import RiseRideMagicShowReplyFields = Protocols.RiseRideMagicShowReplyFields;
    import MagicWeaponModel = modules.magicWeapon.MagicWeaponModel;

    export class IllusionCtrl extends BaseCtrl {
        private static _instance: IllusionCtrl;

        public static get instance(): IllusionCtrl {
            return this._instance = this._instance || new IllusionCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {

            //宠物 幻化激活/升星
            Channel.instance.subscribe(SystemClientOpcode.RiseMagicShowReply, this, this.riseMagicShowReply);
            //精灵
            Channel.instance.subscribe(SystemClientOpcode.RiseRideMagicShowReply, this, this.riseRideMagicShowReply);
            // 更换宠物幻化外观
            Channel.instance.subscribe(SystemClientOpcode.ChangeMagicShowReply, this, this.changeMagicShowReply);
            //更换精灵幻化外观
            Channel.instance.subscribe(SystemClientOpcode.ChangeRideMagicShowReply, this, this.changeRideMagicShowReply);
        }

        //宠物 激活/升星
        public riseMagicShow(tuple: RiseMagicShow): void {
            Channel.instance.publish(UserFeatureOpcode.RiseMagicShow, tuple);
        }

        //精灵 激活/升星
        public riseRideMagicShow(tuple: RiseRideMagicShow): void {
            Channel.instance.publish(UserFeatureOpcode.RiseRideMagicShow, tuple);
        }

        // 宠物幻化激活/升星返回
        private riseMagicShowReply(tuple: RiseMagicShowReply): void {
            // IllusionModel.instance.activateOrUp(tuple[RiseMagicShowReplyFields.result]);
            if (!tuple[RiseMagicShowReplyFields.result]) {
                if (MagicPetModel.instance.getShowInfoById(IllusionModel.instance._magicSelectId)[MagicShowInfoFields.star] === 1) {
                    WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [IllusionModel.instance._magicSelectId, 4]);
                    this.changeMagicShow([IllusionModel.instance._magicSelectId]);
                }
            }
        }

        //  精灵幻化激活返回
        private riseRideMagicShowReply(tuple: RiseRideMagicShowReply): void {
            if (!tuple[RiseRideMagicShowReplyFields.result]) {
                if (MagicWeaponModel.instance.getShowInfoById(IllusionModel.instance._rideMagicSelectId)[MagicShowInfoFields.star] === 1) {
                    WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [IllusionModel.instance._rideMagicSelectId, 3]);
                    this.changeRideMagicShow([IllusionModel.instance._rideMagicSelectId]);
                }
            }
        }

        // 更换宠物幻化外观
        public changeMagicShow(tuple: ChangeMagicShow): void {
            Channel.instance.publish(UserFeatureOpcode.ChangeMagicShow, tuple);
        }

        public changeRideMagicShow(tuple: ChangeRideMagicShow): void {
            Channel.instance.publish(UserFeatureOpcode.ChangeRideMagicShow, tuple);
        }

        // 更换宠物幻化外观返回
        private changeMagicShowReply(tuple: ChangeMagicShowReply): void {
            if (!tuple[0]) {
                SystemNoticeManager.instance.addNotice("更换成功");
                IllusionModel.instance.magicShowId = tuple[ChangeMagicShowReplyFields.magicShowId];
            }
        }

        private changeRideMagicShowReply(tuple: ChangeRideShowReply): void {
            if (!tuple[0]) {
                SystemNoticeManager.instance.addNotice("更换成功");
                IllusionModel.instance.rideMagicShowId = tuple[ChangeRideShowReplyFields.showId];
            }
        }
    }
}