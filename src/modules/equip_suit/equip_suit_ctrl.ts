///<reference path="./equip_suit_model.ts"/>
///<reference path="../config/equip_suit_cfg.ts"/>
/** 套装协议 */
namespace modules.equipSuit {
    import EquipSuitModel = modules.equipSuit.EquipSuitModel;
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetEquipSuitReply = Protocols.GetEquipSuitReply;
    import GetEquipSuitReplyFields = Protocols.GetEquipSuitReplyFields;
    import LightenUp = Protocols.LightenUp;
    import LightenUpReply = Protocols.LightenUpReply;
    import LightenUpReplyFields = Protocols.LightenUpReplyFields;
    import EquipSuitCfg = modules.config.EquipSuitCfg;
    import equip_suit = Configuration.equip_suit;
    import equip_suitFields = Configuration.equip_suitFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class EquipSuitCtrl extends BaseCtrl {
        private static _instance: EquipSuitCtrl;
        public static get instance(): EquipSuitCtrl {
            return this._instance = this._instance || new EquipSuitCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetEquipSuitReply, this, this.getEquipSuitReply);
            Channel.instance.subscribe(SystemClientOpcode.LightenUpReply, this, this.lightenUpReply);

            //功能开启注册 仿写
            //FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.sevenDay, UserFeatureOpcode.GetSevenDay);

            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.updateFuncOpen);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_EQUIPS_INITED, EquipSuitModel.instance, EquipSuitModel.instance.checkRP);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_WEAR_EQUIP, EquipSuitModel.instance, EquipSuitModel.instance.checkRP);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_WEAR_EQUIPS, EquipSuitModel.instance, EquipSuitModel.instance.checkRP);
            this.requsetAllData()
        }

        public requsetAllData() {
            Channel.instance.publish(UserFeatureOpcode.GetEquipSuit, null);
        }

        public getEquipSuitReply(tuple: GetEquipSuitReply): void {
            EquipSuitModel.instance.ids = tuple[GetEquipSuitReplyFields.idList];
            EquipSuitModel.instance.lightParts = tuple[GetEquipSuitReplyFields.light];

            EquipSuitModel.instance.checkRP();
            GlobalData.dispatcher.event(CommonEventType.EQUIP_SUIT_UPDATE);
        }

        private updateFuncOpen(ids: ActionOpenId[]): void {
            if (ids && ids.indexOf(ActionOpenId.equipSuit) !== -1) {
                EquipSuitModel.instance.minOpenFuncId();
            }
        }

        public lightenUp(tuple: LightenUp): void {
            Channel.instance.publish(UserFeatureOpcode.LightenUp, tuple);
        }

        public lightenUpReply(tuple: LightenUpReply): void {
            let code: number = tuple[LightenUpReplyFields.result];
            if (!code) {
                let id: number = EquipSuitModel.instance.selectId;
                let cfg: equip_suit = EquipSuitCfg.instance.getCfgById(id);
                let name: string = cfg[equip_suitFields.name];
                let part: EquipCategory = EquipSuitModel.instance.selectPart;
                let partName: string = CommonUtil.getNameByPart(part);
                notice.SystemNoticeManager.instance.addNotice(`成功点亮${name}【${partName}】`);
            } else {
                CommonUtil.noticeError(code);
            }
        }

        public openPanel(): void {
            let funcId: ActionOpenId = ActionOpenId.equipSuit;
            let isOpen: boolean = FuncOpenModel.instance.getFuncIsOpen(funcId);
            if (isOpen) {
                let indexs: Pair<number, number> = EquipSuitModel.instance.panelIndex;
                let tIndex: number = indexs.first;
                let sIndex: number = indexs.second;
                let panelId: number = EquipSuitUtil.panels[tIndex];
                WindowManager.instance.open(panelId, sIndex);
            } else {
                let str: string = FuncOpenModel.instance.getFuncOpenTipById(funcId);
                notice.SystemNoticeManager.instance.addNotice(str, true);
            }
        }
    }
}