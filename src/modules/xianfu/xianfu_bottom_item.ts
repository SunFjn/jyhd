/////<reference path="../$.ts"/>
/** 仙府-家园底部Item */
namespace modules.xianfu {
    import GetBuildingInfoReply = Protocols.GetBuildingInfoReply;
    import GetBuildingInfoReplyFields = Protocols.GetBuildingInfoReplyFields;
    import CustomClip = modules.common.CustomClip;
    import Event = Laya.Event;
    import xianfuFields = Configuration.xianfuFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import XianfuCfg = modules.config.XianfuCfg;
    import XianfuAnimalCfg = modules.config.XianfuAnimalCfg;
    import UpdateSpiritAnimalTravel = Protocols.UpdateSpiritAnimalTravel;
    import UpdateSpiritAnimalTravelFields = Protocols.UpdateSpiritAnimalTravelFields;
    import XianfuBuildCfg = modules.config.XianfuBuildCfg;
    import xianfu_buildFields = Configuration.xianfu_buildFields;

    export class XianfuBottomItem extends ui.XianfuBottomItemUI {

        private _endTime: number;
        private _type: number;//0药草园 1粮食园 2炼丹炉 3炼器炉 4炼魂炉 5678灵兽等```
        private _effs: CustomClip[];

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._type = -1;

            this._effs = [];
            this._effs[0] = this.creatEff(`hand`);

            this._endTime = 0;
        }

        protected addListeners(): void {
            super.addListeners();

            Laya.timer.loop(1000, this, this.loopHandler);

            this.addAutoListener(this.arrImg, Event.CLICK, this, this.speedUpHandler);
            this.addAutoListener(this.btn, Event.CLICK, this, this.btnHandler);
            this.addAutoListener(this.lockImg, Event.CLICK, this, this.lockImgHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_BUILD_UPDATE, this, this.updateBuildInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_PET_UPDATE, this, this.updateBuildInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_UPDATE, this, this.updateBuildInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_CLICK, this, this.onCilck);

        }
        private onCilck(type) {
            if (type == this._type) this.btnHandler();
        }
        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.loopHandler);
        }

        public onOpened(): void {
            super.onOpened();

            for (let i: int = 0, len: int = this._effs.length; i < len; i++) {
                this._effs[i].play();
            }

            this.updateBuildInfo();
        }

        public set type(type: number) {
            this._type = type;
            this.initShow();
            this.addChild(this.nameTxt);
        }

        private playEff(index: number = 0): void {
            for (let i: int = 0, len: int = this._effs.length; i < len; i++) {
                this._effs[i].visible = i == index;
            }
        }

        private updateBuildInfo(): void {
            let panelType: number = XianfuModel.instance.panelType;
            this.iconImg.gray = this.iconImg.visible = this.lockImg.visible = true;
            this.signImg.visible = false;
            this.btn.pos(45, 58);
            this.playEff(-1);
            if (panelType == 0 && this._type < 2) { // 农场  0聚灵厅 ----0药草园 1粮食园
                this.updateView_0();
            } else if (panelType == 1 && this._type >= 2 && this._type <= 4) { // 炼金室  1炼制崖 ----2炼丹炉 3炼器炉 4炼魂炉
                this.updateView_1();
            } else if (panelType == 2 && this._type >= 5 && this._type <= 8) {   // 游历 2灵兽阁
                this.updateView_2();
            }
        }

        //0药草园 1粮食园
        private updateView_0(): void {
            let info: GetBuildingInfoReply = XianfuModel.instance.getBuildInfo(this._type);
            if (!info) {//功能还没开
                this.awardBox.visible = false;
                return;
            }
            let state: number = info[GetBuildingInfoReplyFields.state];
            this.awardBox.visible = this.signImg.visible = true;
            this.lockImg.visible = this.gray = this.iconImg.visible = false;
            //已达上限:产药中:出产中
            // this.signImg.skin = state == 3 ? `xianfu/txt_xf_ydsx.png` : this._type == 0 ? `xianfu/txt_xf_hlz.png` : `xianfu/txt_xf_jbz.png`;
            this.signImg.skin = state == 3 ? `xianfu/txt_xf_ydsx.png` : this._type == 0 ? `xianfu/txt_xf_jbz.png` : `xianfu/txt_xf_jbz.png`;
            if (state == 3) {
                this.playEff();
            } else {
                // this.playEff(1);
                this.iconImg.visible = true;
            }
            let output: number = info[GetBuildingInfoReplyFields.sum];
            this.awardTxt.text = output.toString();
            let sumWidth: number = this.awardIconImg.width + this.awardTxt.width + 5;
            this.awardIconImg.x = (this.width - sumWidth) / 2;
            this.awardTxt.x = this.awardIconImg.x + this.awardIconImg.width + 5;
        }

        //2炼丹炉 3炼器炉 4炼魂炉
        private updateView_1(): void {
            let info: GetBuildingInfoReply = XianfuModel.instance.getBuildInfo(this._type);
            if (!info) {//功能还没开
                return;
            }
            let state: number = info[GetBuildingInfoReplyFields.state];
            this.signImg.visible = true;
            this.arrImg.visible = this.iconImg.gray = this.iconImg.visible = this.lockImg.visible = false;
            /*建筑状态 0：闲置 1:产出中 2：可领取*/
            state = info[GetBuildingInfoReplyFields.state];
            this.signImg.skin = state == 2 ? `xianfu/txt_xf_ksh.png` : state == 1 ? `xianfu/image_xf_lzz.png` : `xianfu/image_xf_xzz.png`;
            if (state == 1) {  //生产中
                this.arrImg.visible = this.timeBox.visible = true;
                this._endTime = info[GetBuildingInfoReplyFields.time] - GlobalData.serverTime;
                this.btn.pos(45, 80);
                this.playEff(2);
            } else if (state == 0) { //未炼制
                this._endTime = 0;
                this.playEff(1);
            } else {
                this._endTime = 0;
                this.playEff();
            }
        }

        private updateView_2(): void {
            let ids: number[] = XianfuAnimalCfg.instance.ids;
            let info: UpdateSpiritAnimalTravel = XianfuModel.instance.getPetInfos(ids[this._type - 5]);
            if (!info) {
                return;
            }
            let state: number = info[UpdateSpiritAnimalTravelFields.state];
            this.signImg.visible = true;
            this.timeBox.visible = this.arrImg.visible = this.lockImg.visible = this.iconImg.gray = this.iconImg.visible = false;
            this.signImg.skin = state == 2 ? `xianfu/txt_xf_ksh.png` : state == 1 ? `xianfu/txt_xf_ylz.png` : `xianfu/txt_xf_xxz.png`;
            if (state == 2) {  //完成
                this.playEff();
            } else if (state == 1) {  //游历中
                this.arrImg.visible = this.timeBox.visible = true;
                this._endTime = info[UpdateSpiritAnimalTravelFields.time] - GlobalData.serverTime;
                this.playEff(1);
            } else {
                this.playEff(-1);
                let str: string = this._type == 5 ? `ls_04` : this._type == 6 ? `ls_03` : this._type == 7 ? `ls_02` : `ls_01`;
                this.iconImg.skin = `xianfu/${str}.png`;
                this.iconImg.visible = true;
            }
        }

        private loopHandler(): void {
            if (this._type == 0 || this._type == 1) {
                Laya.timer.clear(this, this.loopHandler);
                return;
            }
            // 2炼丹炉 3炼器炉 4炼魂炉 5678灵兽等```
            if (this._endTime <= 0) { //倒计时完成
                this.timeBox.visible = false;
            } else {  //正在倒计时
                this.timeTxt.text = CommonUtil.msToMMSS(this._endTime);
                this._endTime -= 1000;
            }
        }

        private initShow(): void {
            this.iconImg.visible = this.arrImg.visible = this.timeBox.visible = this.awardBox.visible = false;
            if (this._type <= 1) {
                this.iconImg.visible = true;
                if (this._type == 0) {
                    this.nameTxt.text = `药草园`;  //左面
                    this.awardIconImg.skin = `xianfu/18_s.png`;
                    // this._effs[1] = this.creatEff(`huiling`);
                    this.iconImg.skin = `xianfu/img_cyy.png`;
                } else {
                    this.nameTxt.text = `粮食园`;  //右面
                    this.awardIconImg.skin = `xianfu/19_s.png`;
                    // this._effs[1] = this.creatEff(`gold`);
                    this.iconImg.skin = `xianfu/img_xmy.png`;
                }
            } else if (this._type <= 4) {
                this.iconImg.visible = true;
                this._effs[1] = this.creatEff(`liandanlu`); //闲置中
                this._effs[2] = this.creatEff(`refine`);  //炼制中
                this._effs[2].x = 20;
                this._effs[2].y = 50;
                if (this._type == 2) {
                    this.nameTxt.text = `炼丹炉`;
                    this.iconImg.skin = `xianfu/icon_xf_ldl.png`;
                } else if (this._type == 3) {
                    this.nameTxt.text = `炼器炉`;
                    this.iconImg.skin = `xianfu/icon_xf_lql.png`;
                } else if (this._type == 4) {
                    this.nameTxt.text = `炼魂炉`;
                    this.iconImg.skin = `xianfu/icon_xf_lhl.png`;
                }
            } else {
                this._effs[1] = this.creatEff(`footPrint`);  //游历中
                this._effs[1].x = 40;
                this._effs[1].y = 60;
                if (this._type == 5) {
                    this.nameTxt.text = `鸡小萌`;
                    this.iconImg.skin = `xianfu/ls_04.png`;
                } else if (this._type == 6) {
                    this.nameTxt.text = `蟹小黄`;
                    this.iconImg.skin = `xianfu/ls_03.png`;
                } else if (this._type == 7) {
                    this.nameTxt.text = `熊小胖`;
                    this.iconImg.skin = `xianfu/ls_02.png`;
                } else if (this._type == 8) {
                    this.nameTxt.text = `虎小白`;
                    this.iconImg.skin = `xianfu/ls_01.png`;
                }
            }
        }

        private creatEff(name: string): CustomClip {
            let eff: CustomClip = new CustomClip();
            eff.skin = `assets/effect/xianfu/${name}.atlas`;
            let str: string[] = [];
            let len: number = 0;
            // let x = 44, y = 55;
            let x = 20, y = 25;
            if (name == `hand`) {  //收获
                len = 2;
                x = 55; y = 66;
            } else if (name == `gold`) { //金币
                len = 8;
            } else if (name == `huiling`) {
                len = 8;
            } else if (name == `footPrint`) {
                len = 20;
            } else if (name == `liandanlu`) {
                len = 12;
                x = 44; y = 55;
            } else if (name == `refine`) {
                len = 8;
            }
            for (let i: int = 0; i < len; i++) {
                str.push(`${name}/${i}.png`);
            }

            eff.frameUrls = str;
            this.addChild(eff);
            eff.durationFrame = 5;
            eff.loop = true;
            eff.play();
            eff.pos(x, y);
            eff.visible = false;
            return eff;
        }

        private btnHandler(): void {
            //0药草园 1粮食园 2炼丹炉 3炼器炉 4炼魂炉
            if (this._type < 5) {
                let info: GetBuildingInfoReply = XianfuModel.instance.getBuildInfo(this._type);
                if (!info) {
                    SystemNoticeManager.instance.addNotice(`家园等级不足`, true);
                    return;
                }
                let lv: number = info[GetBuildingInfoReplyFields.level];
                let occ: number;
                if (this._type < 2) {
                    occ = XianfuCfg.instance.getCfgByBuildIdAndLv(this._type, lv)[xianfuFields.buildShowId];
                } else {
                    occ = XianfuBuildCfg.instance.getCfgByIdAndLv(this._type, lv)[xianfu_buildFields.buildShowId];
                }
                //0药草园 1粮食园 2炼丹炉 3炼器炉 4炼魂炉
                XianfuModel.instance.buildType = this._type;
                XianfuCtrl.instance.getBuildingInfo([this._type]);
                PlayerModel.instance.selectTarget(SelectTargetType.Npc, occ);
            } else {  //
                let petId: number = XianfuAnimalCfg.instance.ids[this._type - 5];
                let petInfo: UpdateSpiritAnimalTravel = XianfuModel.instance.getPetInfos(petId);
                if (!petInfo) {
                    SystemNoticeManager.instance.addNotice(`家园等级不足`, true);
                    return;
                } else {
                    /*状态 0：闲置 1:游历中 2：游历回来，可领取*/
                    let state: number = petInfo[UpdateSpiritAnimalTravelFields.state];
                    XianfuModel.instance.selectPetIndex = this._type - 5;
                    if (state == 0) {  //闲置中
                        WindowManager.instance.open(WindowEnum.XIANFU_PET_READY_GO_ALERT);
                    } else {   //游历
                        WindowManager.instance.open(WindowEnum.XIANFU_PET_TRAVELING_ALERT);
                    }
                }
            }
        }

        private lockImgHandler(): void {
            // 仙府-家园达到X级时解锁
            let lv: number;
            if (this._type < 5) {
                lv = XianfuCfg.instance.getCfgByBuildIdAndLv(this._type, 1)[xianfuFields.level];
            } else {
                let petId: number = XianfuAnimalCfg.instance.ids[this._type - 5];
                lv = XianfuCfg.instance.getCfgByPetId(petId)[xianfuFields.level];
            }
            SystemNoticeManager.instance.addNotice(`家园达到${lv}级时解锁`, true);
        }

        private speedUpHandler(): void {
            if (this._type < 5) {
                XianfuModel.instance.buildType = this._type;
                XianfuCtrl.instance.endSmelt();
            } else {
                XianfuModel.instance.selectPetIndex = this._type - 5;
                WindowManager.instance.open(WindowEnum.XIANFU_PET_AT_ONCE_END_ALERT);
            }
        }

        public destroy(destroyChild: boolean = true): void {
            this._effs = this.destroyElement(this._effs);
            super.destroy(destroyChild);
        }
    }
}