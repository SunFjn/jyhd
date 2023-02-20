///<reference path="../config/equipment_zhuhun_cfg.ts"/>
///<reference path="../config/equipment_shihun_cfg.ts"/>
namespace modules.equipment_zu_hun {
    import Event = laya.events.Event;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import EquipmentShiHunCfg = modules.config.EquipmentShiHunCfg;
    import shihunFields = Configuration.shihunFields;
    import ShihunGridsFields = Protocols.ShihunGridsFields;
    import LayaEvent = modules.common.LayaEvent;

    export class SEquipmentSiHunItem extends ui.EquipmentSiHunItemUI {
        constructor() {
            super();
        }

        private typeNum: number = 1;
        private isOpen: boolean = false;//是否 解锁
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this, LayaEvent.CLICK, this, this.openEquipmentSiHunAlert);
        }

        public setData(value: any): void {
            super.setData(value);
            this.typeNum = value;
            this.typeImg.skin = `equipment_zu_hun/icon_${this.typeNum}.png`;
            this.realTypeImg.skin = `equipment_zu_hun/img_${this.typeNum}.png`;
            this.setUI();
            this.typeRp.visible = EquipmentZuHunModel.instance.getCanUpShiHun(this.typeNum);
        }

        public openEquipmentSiHunAlert() {
            if (this.isOpen) {
                let shuju = EquipmentZuHunModel.instance.shihunList[this.typeNum];
                if (shuju) {
                    WindowManager.instance.open(WindowEnum.EQUIPMENT_SIHUN_ALERT, shuju);
                } else {
                    WindowManager.instance.open(WindowEnum.EQUIPMENT_SIHUN_ALERT, [this.typeNum, 0]);
                }
            } else {
                this.showTips();
            }
        }

        public showTips() {
            let shuju = EquipmentZuHunModel.instance.shihunList[this.typeNum];
            let dates = null;
            if (shuju) {
                let sClass = shuju[ShihunGridsFields.sClass];
                let level = shuju[ShihunGridsFields.level];
                dates = EquipmentShiHunCfg.instance.getDateByPartAndLevel(this.typeNum, level);
            } else {
                dates = EquipmentShiHunCfg.instance.getDateByPartAndLevel(this.typeNum, 0);
            }
            if (dates) {
                let parts = dates[shihunFields.parts];
                let openLv = EquipmentShiHunCfg.instance.getOpenLvByPartAndLevel(this.typeNum);
                let str = ``;
                for (let index = 0; index < parts.length; index++) {
                    let element = parts[index];
                    if (index == parts.length - 1) {
                        str = str + CommonUtil.getNameByPart(element);
                    } else {
                        str = str + CommonUtil.getNameByPart(element) + "、";
                    }
                }
                SystemNoticeManager.instance.addNotice(`${str}${openLv}阶开启`, true);
            } else {
                SystemNoticeManager.instance.addNotice("未开启", true);
            }
        }

        public setUI() {
            let shuju = EquipmentZuHunModel.instance.shihunList[this.typeNum];
            let dates = null;
            if (shuju) {
                let sClass = shuju[ShihunGridsFields.sClass];
                let level = shuju[ShihunGridsFields.level];
                dates = EquipmentShiHunCfg.instance.getDateByPartAndLevel(this.typeNum, level);
            } else {
                dates = EquipmentShiHunCfg.instance.getDateByPartAndLevel(this.typeNum, 0);
            }
            if (dates) {
                let openLv = EquipmentShiHunCfg.instance.getOpenLvByPartAndLevel(this.typeNum);
                let parts = dates[shihunFields.parts];
                this.isOpen = EquipmentZuHunModel.instance.getWhetherToMeet(openLv, parts);
                if (this.isOpen) {
                    this.levelBgImg.visible = this.levelText.visible = true;
                    this.suoImg.visible = false;
                    let shuju = EquipmentZuHunModel.instance.shihunList[this.typeNum];
                    if (shuju) {
                        this.levelBgImg.visible = this.levelText.visible = shuju[ShihunGridsFields.level] > 0;
                        this.levelText.text = `${shuju[ShihunGridsFields.level]}`;
                    } else {
                        this.levelBgImg.visible = this.levelText.visible = false;
                    }
                } else {
                    this.suoImg.visible = true;
                    this.levelBgImg.visible = this.levelText.visible = false;
                }
            } else {
                this.suoImg.visible = true;
                this.levelBgImg.visible = this.levelText.visible = false;
            }
        }
    }
}
