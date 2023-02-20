///<reference path="../config/xi_lian_rise_cfg.ts"/>
///<reference path="../config/attr_item_cfg.ts"/>


/** 锻造*/


namespace modules.xiLian {
    import XiLianViewUI = ui.XiLianViewUI;
    import LayaEvent = modules.common.LayaEvent;
    import XilianInfo = Protocols.XilianInfo;
    import XilianInfoFields = Protocols.XilianInfoFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import xilian_rise = Configuration.xilian_rise;
    import XiLianRiseCfg = modules.config.XiLianRiseCfg;
    import xilian_riseFields = Configuration.xilian_riseFields;
    import Xilian = Protocols.Xilian;
    import XilianFields = Protocols.XilianFields;
    import TypeAttrFields = Protocols.TypeAttrFields;
    import XilianSlot = Protocols.XilianSlot;
    import XilianSlotFields = Protocols.XilianSlotFields;
    import TypeAttr = Protocols.TypeAttr;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attr_item = Configuration.attr_item;
    import attr_itemFields = Configuration.attr_itemFields;
    import Button = Laya.Button;
    import Item = Protocols.Item;
    import Image = Laya.Image;
    import BagModel = modules.bag.BagModel;
    import CustomClip = modules.common.CustomClip;
    import VipModel = modules.vip.VipModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BagUtil = modules.bag.BagUtil;
    import NoMoreNoticeId = ui.NoMoreNoticeId;
    import BaseItem = modules.bag.BaseItem;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;

    export class XiLianPanel extends XiLianViewUI {
        private _selectedPart: int;
        // 是否使用代币券
        private _useGold: boolean;
        private _attrTxts: Array<Laya.Text>;

        private _equips: Array<BaseItem>;
        private _openBtns: Array<Button>;
        private _lockBtns: Array<Laya.Image>;
        private _qualityIcons: Array<Array<Laya.Image>>;
        private _conTxts: Array<Laya.Text>;
        private _partBgs: Array<Laya.Image>;
        private _stateTxts: Array<Laya.Text>;
        private _txtBgs: Array<Laya.Image>;

        // private _proEffect: CustomClip;

        // 锁定槽数量
        private _lockNum: number;
        // 材料类型, 0消耗锻造石，1消耗极品锻造石，2消耗完美锻造石
        private _matType: int;
        // 是否有免费开启槽位
        private _hasFreeOpen: boolean;
        // 已开启且未锁定
        private _openUnlockNum: number = 0;

        // 戒指玉佩格子是否开启
        private _ringOpen: boolean;
        private _jadeOpen: boolean;

        // 是否有高级(紫色以上)未上锁
        private _seniorUnlock: boolean;

        private _skeleton:Laya.Skeleton;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = this.centerY = 0;

            this.goldTxt.style.color = "#b15315";
            this.goldTxt.style.fontFamily = "SimHei";
            this.goldTxt.style.fontSize = 24;
            this.goldTxt.style.wordWrap = false;

            this._selectedPart = -1;

            this.openBtn1.visible = this.openBtn2.visible = this.openBtn3.visible = this.openBtn4.visible = this.openBtn5.visible = false;
            this.lockBtn1.visible = this.lockBtn2.visible = this.lockBtn3.visible = this.lockBtn4.visible = this.lockBtn5.visible = false;
            this.stateTxt1.visible = this.stateTxt2.visible = this.stateTxt3.visible = this.stateTxt4.visible = this.stateTxt5.visible = false;
            this.txtBg1.visible = this.txtBg2.visible = this.txtBg3.visible = this.txtBg4.visible = this.txtBg5.visible = false;

            this._attrTxts = [this.attrText1, this.attrText2, this.attrText3, this.attrText4, this.attrText5];
            this._stateTxts = [this.stateTxt1, this.stateTxt2, this.stateTxt3, this.stateTxt4, this.stateTxt5];
            this._txtBgs = [this.txtBg1, this.txtBg2, this.txtBg3, this.txtBg4, this.txtBg5];
            this._equips = [this.equip1, this.equip2, this.equip3, this.equip4, this.equip5, this.equip6, this.equip7, this.equip8, this.equip9, this.equip10];
            this._openBtns = [this.openBtn1, this.openBtn2, this.openBtn3, this.openBtn4, this.openBtn5];
            this._lockBtns = [this.lockBtn1, this.lockBtn2, this.lockBtn3, this.lockBtn4, this.lockBtn5];
            this._conTxts = [this.conTxt1, this.conTxt2, this.conTxt3, this.conTxt4, this.conTxt5, this.conTxt6, this.conTxt7, this.conTxt8, this.conTxt9, this.conTxt10];
            this._partBgs = [this.partBg1, this.partBg2, this.partBg3, this.partBg4, this.partBg5, this.partBg6, this.partBg7, this.partBg8, this.partBg9, this.partBg10];
            this._qualityIcons = [
                [this.quality_1_1, this.quality_1_2, this.quality_1_3, this.quality_1_4, this.quality_1_5],
                [this.quality_2_1, this.quality_2_2, this.quality_2_3, this.quality_2_4, this.quality_2_5],
                [this.quality_3_1, this.quality_3_2, this.quality_3_3, this.quality_3_4, this.quality_3_5],
                [this.quality_4_1, this.quality_4_2, this.quality_4_3, this.quality_4_4, this.quality_4_5],
                [this.quality_5_1, this.quality_5_2, this.quality_5_3, this.quality_5_4, this.quality_5_5],
                [this.quality_6_1, this.quality_6_2, this.quality_6_3, this.quality_6_4, this.quality_6_5],
                [this.quality_7_1, this.quality_7_2, this.quality_7_3, this.quality_7_4, this.quality_7_5],
                [this.quality_8_1, this.quality_8_2, this.quality_8_3, this.quality_8_4, this.quality_8_5],
                [this.quality_9_1, this.quality_9_2, this.quality_9_3, this.quality_9_4, this.quality_9_5],
                [this.quality_10_1, this.quality_10_2, this.quality_10_3, this.quality_10_4, this.quality_10_5]
            ];

            // this._proEffect = new CustomClip();
            // this.conBox.addChildAt(this._proEffect, 0);
            // this._proEffect.skin = "assets/effect/wave.atlas";
            // this._proEffect.frameUrls = ["wave/0.png", "wave/1.png", "wave/2.png", "wave/3.png", "wave/4.png",
            //     "wave/5.png", "wave/6.png", "wave/7.png"];
            // this._proEffect.loop = true;
            // this._proEffect.pos(-10, 100, true);
            this.selectMatBox.visible = false;
            this.matItem2.visible = false;
            this.matItem2.needTip = false;
            this._hasFreeOpen = false;
            this._matType = 0;

            let arr: Array<number> = BlendCfg.instance.getCfgById(38007)[blendFields.intParam];
            for (let i: int = 0, len: int = this._conTxts.length; i < len; i++) {
                if (arr[i]) {
                    this._conTxts[i].text = `${CommonUtil.numToUpperCase(Math.floor(arr[i] * 0.01))}阶${CommonUtil.numToUpperCase(arr[i] % 100)}段开启`;
                }
            }

            this.addRingBtn.visible = this.addJadeBtn.visible = false;
            this.initEffectBg();
        }

        private initEffectBg() {
            if (this._skeleton) return;
            this._skeleton = new Laya.Skeleton();
            this.conBox.addChild(this._skeleton);
            this._skeleton.pos(56, 0);
            this._skeleton.load("res/skeleton/wave/UI_duanzao_Ball4.sk", Laya.Handler.create(this, () => {
                this._skeleton.play(0, true);
            }));
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.useGoldBtn, LayaEvent.CLICK, this, this.useGoldHandler);
            this.addAutoListener(this.helpBtn, LayaEvent.CLICK, this, this.helpHandler);
            this.addAutoListener(this.xiLianBtn, LayaEvent.CLICK, this, this.xiLianHandler);
            for (let i: int = 0, len: int = this._openBtns.length; i < len; i++) {
                this.addAutoListener(this._openBtns[i], LayaEvent.CLICK, this, this.openSlotHandler, [i]);
                this.addAutoListener(this._lockBtns[i], LayaEvent.CLICK, this, this.lockSlot, [i]);
            }
            for (let i: int = 0, len: int = this._equips.length; i < len; i++) {
                this._equips[i].needTip = this._equips[i].valueDisplay = false;
                this.addAutoListener(this._equips[i], LayaEvent.CLICK, this, this.equipClickHandler, [i + 1]);
            }
            this.addAutoListener(this.addMatBtn, LayaEvent.CLICK, this, this.addMatHandler);
            this.addAutoListener(this.closeBoxBtn, LayaEvent.CLICK, this, this.closeBoxHandler);
            this.addAutoListener(this.takeOffBtn, LayaEvent.CLICK, this, this.takeOffHandler);
            this.addAutoListener(this.matSelectItem1, LayaEvent.CLICK, this, this.selectMatHandler, [1]);
            this.addAutoListener(this.matSelectItem2, LayaEvent.CLICK, this, this.selectMatHandler, [2]);
            this.addAutoListener(Laya.stage, LayaEvent.CLICK, this, this.stageClickHandler);
            this.addAutoListener(this.selectMatBox, LayaEvent.CLICK, this, this.boxClickHandler);
            this.addAutoListener(this.matItem2, LayaEvent.CLICK, this, this.addMatHandler);
            this.addAutoListener(this.masterBg, LayaEvent.CLICK, this, this.masterClickHandler);
            this.addAutoListener(this.addRingBtn, LayaEvent.CLICK, this, this.gotoTreasure);
            this.addAutoListener(this.addJadeBtn, LayaEvent.CLICK, this, this.gotoTreasure);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XI_LIAN_INFO_UPDATE, this, this.updateInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_EQUIPS_INITED, this, this.updateEquip);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_WEAR_EQUIP, this, this.updateEquip);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_WEAR_EQUIPS, this, this.updateEquip);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateMat);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_BORN_LEV, this, this.updateEra);

            this.addAutoRegisteRedPoint(this.masterRPImg, ["xiLianMaster"]);
        }

        protected onOpened(): void {
            super.onOpened();
            this._lockNum = 0;
            this._selectedPart = -1;
            this.selectedImg.visible = false;
            this.selectMatBox.visible = false;
            this.matItem2.visible = false;
            this._hasFreeOpen = false;
            this._openUnlockNum = 0;
            // this._proEffect.play();

            this.useGold = false;
            this.updateEquip();
            this.updateEra();
        }

        close(): void {
            super.close();
            // this._proEffect.stop();
        }

        public get useGold(): boolean {
            return this._useGold;
        }

        public set useGold(value: boolean) {
            this._useGold = value;
            this.useGoldBtn.selected = value;
        }

        private equipClickHandler(part: number): void {
            this.selectPart(part);
        }

        private useGoldHandler(): void {
            if (!this.useGold) {      // 勾选使用代币券
                let needGold: number = BlendCfg.instance.getCfgById(38006)[blendFields.intParam][this._lockNum];
                if (PlayerModel.instance.ingot >= needGold) {
                    this.useGold = !this.useGold;
                } else {
                    CommonUtil.goldNotEnoughAlert();
                }
            } else {
                this.useGold = !this.useGold;
            }
        }

        private helpHandler(): void {
            CommonUtil.alertHelp(20055);
        }

        private updateEra(): void {
            let eraLv: number = PlayerModel.instance.bornLev;
            let lv1: number = Math.floor(eraLv * 0.01);
            let lv2: number = eraLv % 100;
            let arr: Array<number> = BlendCfg.instance.getCfgById(38007)[blendFields.intParam];
            let index: int = this.getChildIndex(this.xiLianBtn) + 1;
            for (let i: int = 0, len: int = this._conTxts.length; i < len; i++) {
                this._partBgs[i].off(LayaEvent.CLICK, this, this.partClickHandler);
                let open: boolean = false;
                if (arr[i]) {
                    let tLv1: number = Math.floor(arr[i] * 0.01);
                    let tLv2: number = arr[i] % 100;
                    if (lv1 > tLv1) {
                        open = true;
                    } else if (lv1 === tLv1 && lv2 >= tLv2) {
                        open = true;
                    }
                    if (!open) this.addAutoListener(this._partBgs[i], LayaEvent.CLICK, this, this.partClickHandler, [`觉醒达到${CommonUtil.numToUpperCase(tLv1)}阶${CommonUtil.numToUpperCase(tLv2)}段开启`]);
                } else {
                    open = true;
                }
                this._conTxts[i].visible = !open;
                // this._equips[i].visible = open;
                open ? this.addChildAt(this._equips[i], index) : this._equips[i].removeSelf();
                let icons: Array<Laya.Image> = this._qualityIcons[i];
                for (let j: int = 0, len1: int = icons.length; j < len1; j++) {
                    icons[j].visible = open;
                }
                if (i + 1 === EquipCategory.ring) {
                    this._ringOpen = open;
                } else if (i + 1 === EquipCategory.jude) {
                    this._jadeOpen = open;
                }
            }
            this.updateEquip();
        }

        // 点击部位
        private partClickHandler(str: string): void {
            SystemNoticeManager.instance.addNotice(str, true);
        }

        // 更新装备
        private updateEquip(): void {
            let playLevel: number = PlayerModel.instance.level;
            let showLevel: Array<number> = BlendCfg.instance.getCfgById(53001)[blendFields.intParam];
            for (let i: int = 0, len: int = this._equips.length; i < len; i++) {
                let part: int = i + 1;
                let item: Item = PlayerModel.instance.getEquipByPart(part);
                if (item) {
                    this._equips[i].dataSource = item;
                    this._equips[i].mouseEnabled = true;
                    this._equips[i].visible = true;
                    if (this._selectedPart === -1) {
                        this.selectPart(part);
                    }
                    if (part === EquipCategory.ring) this.addRingBtn.visible = false;
                    else if (part === EquipCategory.jude) this.addJadeBtn.visible = false;

                } else {
                    this._equips[i].dataSource = null;
                    this._equips[i].mouseEnabled = false;
                    this._equips[i].visible = false;
                    if (part === EquipCategory.ring && playLevel >= showLevel[0]) this.addRingBtn.visible = this._ringOpen;
                    else if (part === EquipCategory.jude && playLevel >= showLevel[0]) this.addJadeBtn.visible = this._jadeOpen;
                }
            }
        }

        // 选择部位
        private selectPart(part: number): void {
            if (this._selectedPart === part) return;
            this._selectedPart = part;
            this.selectedImg.visible = true;
            this.selectedImg.pos(this._equips[part - 1].x - 4, this._equips[part - 1].y - 5, true);
            this._matType = 0;
            this.addMatBtn.visible = true;
            this.matItem2.visible = false;
            this.updateInfo();
        }

        // 开启槽位
        private openSlotHandler(slotIndex: int): void {
            if (this._selectedPart === -1) return;
            if (!XiLianModel.instance.xiLianInfo) return;
            let str: string;
            if (this._hasFreeOpen) {
                str = `第一条锻造槽位<span color="#65ff49">免费开启</span>，是否确定开启？`;
                CommonUtil.alert("提示", str, [Handler.create(this, this.openSlot, [0])]);
            } else {
                if (slotIndex === 4) {      // 最后一个槽要VIP开启
                    let needVip: number = BlendCfg.instance.getCfgById(38010)[blendFields.intParam][0];
                    if (VipModel.instance.vipLevel >= needVip) {
                        str = "您已达到第五槽位开启所需的SVIP等级，是否开启槽位？";
                        CommonUtil.alert("提示", str, [Handler.create(this, this.openSlot, [slotIndex])]);
                    } else {
                        str = `<span color="#FF3E3E">达到SVIP${needVip}</span>即可开启第五槽位，是否前往提升SVIP等级？`;
                        CommonUtil.alert("提示", str, [Handler.create(this, this.gotoVip)]);
                    }
                } else {
                    let needGold: number = BlendCfg.instance.getCfgById(38008)[blendFields.intParam][slotIndex];
                    if (needGold > 0) {
                        str = `是否花费<span color="#FF3E3E">${needGold}代币券</span>开启该锻造槽位？`;
                        CommonUtil.alert("提示", str, [Handler.create(this, this.openSlot, [slotIndex])]);
                    }
                }
            }
        }

        private openSlot(slotIndex: int): void {
            let needGold: number = BlendCfg.instance.getCfgById(38008)[blendFields.intParam][slotIndex] || 0;
            if (PlayerModel.instance.ingot >= needGold) {
                XiLianCtrl.instance.openXilian(this._selectedPart, slotIndex);
            } else {      // 代币券不足
                CommonUtil.goldNotEnoughAlert();
            }
        }

        private gotoVip(): void {
            if (modules.vip.VipModel.instance.vipLevel >= 1) {
                WindowManager.instance.open(WindowEnum.VIP_PANEL);
            }
            else {
                WindowManager.instance.open(WindowEnum.VIP_NEW_PANEL);
            }
        }

        // 锁定槽位
        private lockSlot(slotIndex: int): void {
            if (this._selectedPart === -1) return;
            let info: XilianSlot = XiLianModel.instance.getSlotInfoByPartAndSlot(this._selectedPart, slotIndex);
            XiLianCtrl.instance.lockXilian(!info[XilianSlotFields.isLock], this._selectedPart, slotIndex);
        }

        private xiLianHandler(): void {
            if (this._openUnlockNum > 0) {
                // 判断锻造石
                let needMatCount: number = BlendCfg.instance.getCfgById(38005)[blendFields.intParam][this._lockNum];
                let hasCount: number = BagModel.instance.getItemCountById(10230001);
                // 判断免费次数
                let info: XilianInfo = XiLianModel.instance.xiLianInfo;
                if (hasCount >= needMatCount || (info && info[XilianInfoFields.remianTimes] > 0)) {
                    let enough: boolean = false;
                    // 锻造石够判断完美、极品锻造石
                    if (this._matType === 1 || this._matType === 2) {
                        let itemId: number = this._matType === 1 ? 10240001 : 10250001;
                        let count: number = BagModel.instance.getItemCountById(itemId);
                        let needCount: number = BlendCfg.instance.getCfgById(this._matType === 1 ? 38011 : 38012)[blendFields.intParam][this._lockNum];
                        if (count >= needCount) {
                            enough = true;
                        } else {
                            BagUtil.openLackPropAlert(itemId, needCount - count);
                        }
                    } else {
                        enough = true;
                    }
                    if (enough) {
                        // 判断是否有橙色及以上属性没上锁
                        if (this._seniorUnlock) {
                            let handler: Handler = Handler.create(XiLianCtrl.instance, XiLianCtrl.instance.equipXilian, [this._selectedPart, this._useGold, this._matType]);
                            CommonUtil.alert("提示", `您有<span color="#FF3E3E">高级属性没有上锁</span>，新属性将替换该属性，是否继续锻造？`,
                                [handler], [], true, null, NoMoreNoticeId.xiLianSeniorUnlock);
                        } else {
                            XiLianCtrl.instance.equipXilian(this._selectedPart, this._useGold, this._matType);

                            // 弹出锻造成功字段
                            SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong13.png");
                        }
                    }
                } else {
                    BagUtil.openLackPropAlert(10230001, needMatCount - hasCount);
                }
            } else {
                let str = `第一条锻造槽位<span color="#65ff49">免费开启</span>，是否确定开启？`;
                CommonUtil.alert("提示", str, [Handler.create(this, this.openSlot, [0])]);
            }
        }

        // 更新锻造
        private updateInfo(): void {
            this._openUnlockNum = 0;
            this.fightClip.value = "0";
            this._seniorUnlock = false;
            this._hasFreeOpen = false;
            let info: XilianInfo = XiLianModel.instance.xiLianInfo;
            if (!info) return;
            let times: number = info[XilianInfoFields.remianTimes];
            let totalTimes: number = BlendCfg.instance.getCfgById(38009)[blendFields.intParam][0];
            this.timesTxt.text = `${times}/${totalTimes}`;
            this.timesTxt.color = times === 0 ? "#FF3E3E" : "#148800";
            let masterLv: number = info[XilianInfoFields.xilianRiseLevel];
            let cfg: xilian_rise = XiLianRiseCfg.instance.getCfgByLv(masterLv);
            if (cfg[xilian_riseFields.count] > 0) {
                let hasCount: number = XiLianModel.instance.getAttrCountByQuality(cfg[xilian_riseFields.color]);
                this.masterProTxt.text = `${hasCount}/${cfg[xilian_riseFields.count]}`;
                this.wavePosition(hasCount, cfg[xilian_riseFields.count]);
                // this._proEffect.y = hasCount >= cfg[xilian_riseFields.count] ? 0 : (1 - hasCount / cfg[xilian_riseFields.count]) * 100;
            } else {      // 最高级
                let count: number = XiLianRiseCfg.instance.getCfgByLv(masterLv - 1)[xilian_riseFields.count];
                this.masterProTxt.text = `${count}/${count}`;
                // his._proEffect.y = 0;
                this.wavePosition(count, count);
            }
            this.masterTxt.text = `锻造大师·${masterLv}阶`;

            let xiLianInfos: Array<Xilian> = info[XilianInfoFields.xilians];
            let partInfo: Xilian;
            for (let i: int = 0, len: int = xiLianInfos.length; i < len; i++) {
                let tInfo: Xilian = xiLianInfos[i];
                if (tInfo) {
                    if (tInfo[XilianFields.part] === this._selectedPart) {
                        partInfo = tInfo;
                    }
                    let slots: Array<XilianSlot> = tInfo[XilianFields.slots];
                    for (let i: int = 0, len: int = slots.length; i < len; i++) {
                        let slot: XilianSlot = slots[i];
                        let attr: TypeAttr = slot[XilianSlotFields.attr];
                        let num: int = slot[XilianSlotFields.num];
                        let qualityIcon: Image = this._qualityIcons[tInfo[XilianFields.part] - 1][num];
                        if (slot[XilianSlotFields.state] === 2) {
                            qualityIcon.skin = `xi_lian/image_zbxl_${attr[TypeAttrFields.color]}.png`;
                        }
                    }
                }
            }

            if (!partInfo) {
                this.addMatBtn.visible = false;
                return;
            }
            this.fightClip.value = partInfo[XilianFields.score].toString();
            let slots: Array<XilianSlot> = partInfo[XilianFields.slots];
            let lockNum: number = 0;     // 锁定的槽数量
            let openUnlockIndex: number = -1;      // 开启的槽中如果只有一个没锁定的隐藏锁定按钮

            for (let i: int = 0, len: int = slots.length; i < len; i++) {
                let slot: XilianSlot = slots[i];
                let attr: TypeAttr = slot[XilianSlotFields.attr];
                let attrCfg: attr_item = AttrItemCfg.instance.getCfgById(attr[TypeAttrFields.type]);
                let attrValue: number = attr[TypeAttrFields.value];
                let num: int = slot[XilianSlotFields.num];
                if (slot[XilianSlotFields.state] === 2 && attrCfg) {
                    if (attrCfg[attr_itemFields.isPercent]) {
                        this._attrTxts[num].text = `${attrCfg[attr_itemFields.name]}+${(attrValue * 100).toFixed(2)}%(${(slot[XilianSlotFields.min] * 100).toFixed(2)}%~${(slot[XilianSlotFields.max] * 100).toFixed(2)}%)`;
                    } else {
                        this._attrTxts[num].text = `${attrCfg[attr_itemFields.name]}+${Math.round(attrValue)}(${slot[XilianSlotFields.min]}~${slot[XilianSlotFields.max]})`;
                    }
                    this._attrTxts[num].color = CommonUtil.getColorByQuality(attr[TypeAttrFields.color] - 1);
                    if (!this._attrTxts[num].color) {
                        this._attrTxts[num].color = "#444444"
                    }
                    this._stateTxts[num].visible = this._txtBgs[num].visible = false;
                    this._openBtns[num].visible = false;
                    this._lockBtns[num].visible = true;
                    let isLock: boolean = slot[XilianSlotFields.isLock];
                    this._lockBtns[num].skin = isLock ? "xi_lian/btn_zbxl_lock_1.png" : "xi_lian/btn_zbxl_lock_0.png";
                    if (isLock) {
                        lockNum++;
                    } else {      // 开启但未锁定
                        this._openUnlockNum++;
                        openUnlockIndex = i;
                        if (attr[TypeAttrFields.color] >= 4) {        // 紫色及以上
                            this._seniorUnlock = true;
                        }
                    }
                } else {
                    this._stateTxts[num].visible = this._txtBgs[num].visible = true;
                    if (num === 4) {      // 最后一个槽要VIP开启
                        this._attrTxts[num].text = `第${num + 1}条锻造槽`;
                        this._stateTxts[num].text = `(SVIP${BlendCfg.instance.getCfgById(38010)[blendFields.intParam][0]}开启)`;
                        this._openBtns[num].label = "开启";
                    } else {
                        let needGold: number = BlendCfg.instance.getCfgById(38008)[blendFields.intParam][num];
                        if (needGold === 0) this._hasFreeOpen = true;
                        this._attrTxts[num].text = `第${num + 1}条锻造槽`;
                        this._stateTxts[num].text = `未开启`;
                        this._openBtns[num].label = needGold > 0 ? "开启" : "免费";
                    }
                    this._attrTxts[num].color = "#09b981";
                    this._openBtns[num].visible = true;
                    this._lockBtns[num].visible = false;
                }
            }
            if (this._openUnlockNum === 1) {        // 只有一条开启但未锁定的槽，隐藏锁定按钮
                this._lockBtns[openUnlockIndex].visible = false;
            }
            let needGold: number = BlendCfg.instance.getCfgById(38006)[blendFields.intParam][lockNum];
            if (this._matType === 0) {
                this.goldTxt.innerHTML = `消耗<span color="#2b9f16">${needGold}代币券</span>必出一条<span color="#d738f4">紫色以上</span>属性`;
                this.useGoldBtn.visible = true;
            } else {
                let itemId: number = this._matType === 1 ? 10240001 : 10250001;
                let count: number = BagModel.instance.getItemCountById(itemId);
                let needCount: number = BlendCfg.instance.getCfgById(this._matType === 1 ? 38011 : 38012)[blendFields.intParam][lockNum];
                this.matItem2.dataSource = [itemId, count, 0, null];
                this.matItem2.setNum(`${count}/${needCount}`, count >= needCount ? "#FFFFFF" : "#FF3E3E");
            }

            this._lockNum = lockNum;
            this.updateMat();
        }

        private wavePosition(numkid:number, num: number) {
            if (!num) return;
            let ratio = numkid / num;
            if (ratio >= 1) ratio = 1;
            // this._skeleton.y = 100 - 100 * ratio;
            TweenJS.create(this._skeleton).to({ y: 100 - 100 * ratio }, 100)
                .easing(utils.tween.easing.linear.None)
                .start()
        }

        private updateMat(): void {
            let needMatCount: number = BlendCfg.instance.getCfgById(38005)[blendFields.intParam][this._lockNum];
            this.matItem1.dataSource = [10230001, needMatCount, 0, null];
            let hasCount: number = BagModel.instance.getItemCountById(10230001);
            this.matItem1.setNum(`${hasCount}/${needMatCount}`, hasCount >= needMatCount ? "#FFFFFF" : "#FF3E3E");
        }

        private addMatHandler(e: Laya.Event): void {
            this.selectMatBox.visible = true;
            this.matSelectItem1.setData(10240001);
            this.matSelectItem2.setData(10250001);
            e.stopPropagation();
        }

        private closeBoxHandler(): void {
            this.selectMatBox.visible = false;
        }

        private stageClickHandler(): void {
            this.selectMatBox.visible = false;
        }

        private boxClickHandler(e: Laya.Event): void {
            e.stopPropagation();
        }

        private takeOffHandler(): void {
            this.matItem2.visible = false;
            this.addMatBtn.visible = true;
            this._matType = 0;
            this.useGoldBtn.visible = true;
            let needGold: number = BlendCfg.instance.getCfgById(38006)[blendFields.intParam][this._lockNum];
            this.goldTxt.innerHTML = `消耗<span color="#65ff49">${needGold}代币券</span>必出一条<span color="#d738f4">紫色及以上</span>属性`;
            this.selectMatBox.visible = false;
        }

        private selectMatHandler(type: int): void {
            this._matType = type;
            let itemId: number = type === 1 ? 10240001 : 10250001;
            let count: number = BagModel.instance.getItemCountById(itemId);
            let needCount: number = BlendCfg.instance.getCfgById(type === 1 ? 38011 : 38012)[blendFields.intParam][this._lockNum];
            this.matItem2.dataSource = [itemId, count, 0, null];
            this.matItem2.setNum(`${count}/${needCount}`, count >= needCount ? "#FFFFFF" : "#FF3E3E");
            this.useGold = false;
            if (type === 1) {
                this.goldTxt.innerHTML = `消耗极品锻造石必出一条<span color="#EA8706">橙色及以上</span>属性`;
            } else if (type === 2) {
                this.goldTxt.innerHTML = `消耗完美锻造石必出一条<span color="#FF3E3E">红色</span>属性`;
            }
            this.useGoldBtn.visible = false;
            this.selectMatBox.visible = false;
            this.addMatBtn.visible = false;
            this.matItem2.visible = true;
        }

        private masterClickHandler(): void {
            WindowManager.instance.openDialog(WindowEnum.STONE_MASTER_DIALOG, 3);
        }

        // 神器探索跳转
        private gotoTreasure(): void {
            WindowManager.instance.open(WindowEnum.TREASURE_PANEL);
        }

        destroy(destroyChild: boolean = true): void {
            this._attrTxts.length = 0;
            this._attrTxts = null;
            this._stateTxts.length = 0;
            this._stateTxts = null;
            this._txtBgs.length = 0;
            this._txtBgs = null;
            this._equips.length = 0;
            this._equips = null;
            this._openBtns.length = 0;
            this._openBtns = null;
            this._lockBtns.length = 0;
            this._lockBtns = null;
            this._qualityIcons.length = 0;
            this._qualityIcons = null;
            this._conTxts.length = 0;
            this._conTxts = null;
            this._partBgs.length = 0;
            this._partBgs = null;
            // this._proEffect.stop();
            // this._proEffect.destroy();
            // this._proEffect = null;
            if (this._skeleton) {
                this._skeleton = this.destroyElement(this._skeleton);
            }
            super.destroy(destroyChild);
        }
    }
}