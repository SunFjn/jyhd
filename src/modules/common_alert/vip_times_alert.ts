/** VIP购买次数弹框*/


namespace modules.commonAlert {
    import VipTimesAlertUI = ui.VipTimesAlertUI;
    import Event = Laya.Event;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import PrivilegeCfg = modules.config.PrivilegeCfg;
    import idCountFields = Configuration.idCountFields;
    import PrivilegeParamFields = Configuration.PrivilegeParamFields;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import CustomClip = modules.common.CustomClip;
    import PrivilegeNodeFields = Configuration.PrivilegeNodeFields;
    import PrivilegeNode = Configuration.PrivilegeNode;
    import PrivilegeDataFields = Protocols.PrivilegeDataFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import VipModel = modules.vip.VipModel;
    import ItemsFields = Configuration.ItemsFields;
    import Items = Configuration.Items;
    import CommonUtil = modules.common.CommonUtil;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class VipTimesAlert extends VipTimesAlertUI {
        private _type: number;
        private _vipLevel: number;
        private _nextVipLevel: number;
        private _minLv: number;
        private _maxLv: number;
        private buyTimes: number;
        private _btnClip: CustomClip;
        private _mapId: number;
        //仙丹专用变量
        private _node: number = 0;
        private _node1: number = 0;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.tipsTxt.color = "#3d3d3d";
            this.tipsTxt.style.fontFamily = "SimHei";
            this.tipsTxt.style.fontSize = 24;
            this.tipsTxt.style.align = "center";

            this.curTxt.color = this.nextTxt.color = this.maxTxt.color = "#3d3d3d";
            this.curTxt.style.fontFamily = this.nextTxt.style.fontFamily = "SimHei";
            this.curTxt.style.fontSize = this.nextTxt.style.fontSize = this.maxTxt.style.fontSize = 24;
            this.curTxt.style.align = this.nextTxt.style.align = this.maxTxt.style.align = "center";

            this.maxBox.visible = false;


            this._btnClip = new CustomClip();
            this.buyBtn.addChild(this._btnClip);
            this._btnClip.pos(-4, -8, true);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = [
                "btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png"
                , "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.play();
            this._btnClip.visible = false;
        }

        public onOpened(): void {
            super.onOpened();
            this._btnClip.play();
        }

        public close(): void {
            super.close();
            this._btnClip.stop();

        }

        public destroy(): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy();
        }

        protected addListeners(): void {
            super.addListeners();
            this.buyBtn.on(Event.CLICK, this, this.buyHandler);
            GlobalData.dispatcher.on(CommonEventType.UPDATE_PRIVILEGE, this, this.setDate);

        }

        protected removeListeners(): void {
            super.removeListeners();
            this.buyBtn.off(Event.CLICK, this, this.buyHandler);
            GlobalData.dispatcher.off(CommonEventType.UPDATE_PRIVILEGE, this, this.setDate);

        }

        public setOpenParam(value: number): void {
            super.setOpenParam(value);
            if (value == null) {
                return;
            }
            this._type = value;
            this.maxLimit.visible = false;
            this._btnClip.visible = false;

            if (this._type == Privilege.homeBossRewardCount) {
                this.backTxt.y = 526;
                this.bg.height = 522;
                this.height = 522;
                this.btnBox.visible = false;
                this.honmeBossReward();
            }
            else if (this._type == Privilege.xianDanCount) {
                this.backTxt.y = 526;
                this.bg.height = 522;
                this.height = 522;
                this.btnBox.visible = false;
                //TODO
                this.xianDanCount();
            }
            else {
                this.backTxt.y = 659;
                this.bg.height = 655;
                this.height = 655;
                this.btnBox.visible = true;
                if (this._type == Privilege.bagEquipSize) {
                    this.addBagGrids();
                } else if (this._type == Privilege.copyCloudlandTicket) {
                    this.setDate();
                } else {
                    this.setDate();
                }
            }
        }

        private addBagGrids(): void {
            this._vipLevel = VipModel.instance.vipLevel;
            if (this._vipLevel != null) {
                this.MoneyBox.visible = false;
                let attrs: Array<Configuration.privilege> = GlobalData.getConfig("privilege");
                let maxVipLevel = PrivilegeCfg.instance.getVipMaxLevel();
                if (this._vipLevel <= maxVipLevel) {
                    this._nextVipLevel = this._vipLevel + 1;
                    let privCfg: PrivilegeNode = PrivilegeCfg.instance.getVipInfoByLevel(this._vipLevel, Privilege.bagEquipSize);
                    let nextPrivCfg: PrivilegeNode = PrivilegeCfg.instance.getVipInfoByLevel(this._nextVipLevel, Privilege.bagEquipSize);
                    let grids: number = 0;
                    let nextGrids: number = 0;
                    if (this._vipLevel == 0) {
                        grids = 0;
                    } else {
                        grids = privCfg[PrivilegeNodeFields.param1];
                    }
                    nextGrids = nextPrivCfg[PrivilegeNodeFields.param1];
                    while (grids == nextGrids && this._nextVipLevel < maxVipLevel) {
                        this._nextVipLevel++;
                        if (this._nextVipLevel == maxVipLevel) {
                            this._nextVipLevel = maxVipLevel;
                        }
                        nextPrivCfg = PrivilegeCfg.instance.getVipInfoByLevel(this._nextVipLevel, Privilege.bagEquipSize);
                        nextGrids = nextPrivCfg[PrivilegeNodeFields.param1];
                    }
                    this.tipsTxt.innerHTML = "提升至<span style=\"color:rgb(14,207,9)\">SVIP" + this._nextVipLevel + "</span>可以增加背包容量";
                    this.setSVIPandVIP(this.curClip, this.curClipBg, this._vipLevel);
                    this.setSVIPandVIP(this.nextClip, this.nextClipBg, this._nextVipLevel);
                    this.curTxt.innerHTML = "装备背包增加" + grids + "格";
                    this.nextTxt.innerHTML = "装备背包增加" + nextGrids + "格";
                    this.buyBtn.label = "前往购买";
                }
            }
        }

        private honmeBossReward(): void {
            this._vipLevel = VipModel.instance.vipLevel;
            let arr = PrivilegeCfg.instance.getMinLvMaxLvByType(this._type);
            this._minLv = arr[0];
            this._maxLv = arr[1];
            this.MoneyBox.visible = false;
            if (this._vipLevel < this._minLv) {
                this._nextVipLevel = this._minLv;
            } else {
                this._nextVipLevel = PrivilegeCfg.instance.getNextLevel(this._vipLevel, this._type);
            }
            let node = PrivilegeCfg.instance.getVipInfoByLevel(this._vipLevel, this._type);
            let node1 = PrivilegeCfg.instance.getVipInfoByLevel(this._nextVipLevel, this._type);
            if (this._vipLevel < this._maxLv) {
                this.tipsTxt.innerHTML = "提升至<span style='color:rgb(45,106,56);font-size: 26px;'>SVIP" + this._nextVipLevel + "</span>可以增加开启次数";
                // this.curClip.value = `` + this._vipLevel;
                // this.nextClip.value = `` + this._nextVipLevel;
                this.setSVIPandVIP(this.curClip, this.curClipBg, this._vipLevel);
                this.setSVIPandVIP(this.nextClip, this.nextClipBg, this._nextVipLevel);
                this.curTxt.innerHTML = `每日可额外开启<span style='color:rgb(45,106,56);font-size: 26px'>${node ? node[PrivilegeNodeFields.param1] : 0}</span>次`;
                this.nextTxt.innerHTML = `每日可额外开启<span style='color:rgb(45,106,56);font-size: 26px'>${node1 ? node1[PrivilegeNodeFields.param1] : 0}</span>次`;
                this.maxBox.visible = false;
                this.upBox.visible = true;
            } else {
                // this.maxClip.value = `` + this._vipLevel;
                this.setSVIPandVIP(this.maxClip, this.maxClipBg, this._vipLevel);
                this.maxTxt.innerHTML = `每日可额外开启<span style='color:rgb(45,106,56);font-size: 26px'>${node ? node[PrivilegeNodeFields.param1] : 0}</span>次`;
                this.upBox.visible = false;
                this.maxBox.visible = true;
                this.maxLimit.visible = true;
            }
        }
        //仙丹专用函数
        private getNode(params: Array<any>) {
            for (let i: int = 0, len: int = params.length; i < len; i += 2) {
                let tLv: number = params[i];
                if (this._vipLevel < tLv) {
                    this._nextVipLevel = params[i];
                    this._node = params[i - 1];
                    this._node1 = params[i + 1];
                    return;
                }
            }
            this._node = params[params.length - 1];
        }
        //仙丹每日服用总数
        private xianDanCount(): void {
            this._vipLevel = VipModel.instance.vipLevel;
            let params: number[] = BlendCfg.instance.getCfgById(50001)[blendFields.intParam];
            this._minLv = params[0];
            this._maxLv = params[params.length - 2];
            this.MoneyBox.visible = false;
            this.getNode(params);
            if (this._vipLevel < this._maxLv) {
                this.tipsTxt.innerHTML = "提升至<span style='color:rgb(45,106,56);font-size: 26px;'>SVIP" + this._nextVipLevel + "</span>可以增加开启次数";
                this.setSVIPandVIP(this.curClip, this.curClipBg, this._vipLevel);
                this.setSVIPandVIP(this.nextClip, this.nextClipBg, this._nextVipLevel);
                this.curTxt.innerHTML = `每日可额外开启<span style='color:rgb(45,106,56);font-size: 26px'>${this._node ? this._node : 0}</span>次`;
                this.nextTxt.innerHTML = `每日可额外开启<span style='color:rgb(45,106,56);font-size: 26px'>${this._node1 ? this._node1 : 0}</span>次`;
                this.maxBox.visible = false;
                this.upBox.visible = true;
            } else {
                this.setSVIPandVIP(this.maxClip, this.maxClipBg, this._vipLevel);
                this.maxTxt.innerHTML = `每日可额外开启<span style='color:rgb(45,106,56);font-size: 26px'>${this._node ? this._node : 0}</span>次`;
                this.upBox.visible = false;
                this.maxBox.visible = true;
                this.maxLimit.visible = true;
            }
        }

        public setSVIPandVIP(clipObj: Laya.FontClip, clipObjBg: Laya.Image, lv: number) {
            if (lv >= 1) {
                clipObjBg.skin = `common/image_common_svip.png`;
                clipObj.skin = `common/num_common_svip.png`;
                clipObj.sheet = `0123456789`;
                clipObj.value = lv.toString();
                clipObj.x = 65;
            }
            else {
                let vipLevel = modules.vip_new.VipNewModel.instance.getVipLevelTrue();
                clipObj.visible = true;
                clipObjBg.skin = `common/image_common_vip.png`;
                clipObj.skin = `common/num_common_vip.png`;
                clipObj.sheet = `0123456789`;
                clipObj.value = vipLevel.toString();
                clipObj.x = 61;
            }
        }
        private setDate(): void {
            this._vipLevel = VipModel.instance.vipLevel;
            let privilege = VipModel.instance.getPrivilegeInfoById(this._type);
            if (!privilege) return;
            this.buyTimes = privilege[PrivilegeDataFields.value];
            this._mapId = privilege[PrivilegeDataFields.exValue];

            let arr = PrivilegeCfg.instance.getMinLvMaxLvByType(this._type);
            this._minLv = arr[0];
            this._maxLv = arr[1];
            if (this._vipLevel < this._minLv) {
                this._nextVipLevel = this._minLv;
                this.buyBtn.label = "前往提升";
                this.MoneyBox.visible = false
            } else {
                this._nextVipLevel = PrivilegeCfg.instance.getNextLevel(this._vipLevel, this._type);
                this.buyBtn.label = "购买次数";
                this.MoneyBox.visible = true;
            }
            let node = PrivilegeCfg.instance.getVipInfoByLevel(this._vipLevel, this._type);
            let node1 = PrivilegeCfg.instance.getVipInfoByLevel(this._nextVipLevel, this._type);
            this.setRedDot(this.buyTimes, node);

            if (this._vipLevel < this._maxLv) {
                this.tipsTxt.innerHTML = "提升至<span style='color:rgb(45,106,56);font-size: 26px;'>SVIP" + this._nextVipLevel + "</span>可以增加购买次数";
                // this.curClip.value = `` + this._vipLevel;
                // this.nextClip.value = `` + this._nextVipLevel;
                this.setSVIPandVIP(this.curClip, this.curClipBg, this._vipLevel);
                this.setSVIPandVIP(this.nextClip, this.nextClipBg, this._nextVipLevel);
                this.curTxt.innerHTML = `每日可购买<span style='color:rgb(45,106,56);font-size: 26px'>${node ? node[PrivilegeNodeFields.param1] : 0}</span>次`;
                this.nextTxt.innerHTML = `每日可购买<span style='color:rgb(45,106,56);font-size: 26px'>${node1 ? node1[PrivilegeNodeFields.param1] : 0}</span>次`;
                if (this.MoneyBox.visible == true) {
                    let cost = PrivilegeCfg.instance.getCostByLevel(this._nextVipLevel, this._type)[PrivilegeParamFields.param];
                    if (this.buyTimes <= node[PrivilegeNodeFields.param1]) {
                        if (this.buyTimes >= cost.length) {
                            this.costTxt.text = cost[cost.length - 1][idCountFields.count].toString();
                        } else {
                            this.costTxt.text = cost[this.buyTimes][idCountFields.count].toString();
                        }
                    }
                    this.boughtTxt.text = this.buyTimes + "/" + node[PrivilegeNodeFields.param1];
                    if (this.buyTimes == node[PrivilegeNodeFields.param1]) {
                        this.boughtTxt.color = CommonUtil.getColorByQuality(5);
                    } else {
                        this.boughtTxt.color = "#3d3d3d";
                    }
                }
                this.maxBox.visible = false;
                this.upBox.visible = true;
            } else {
                // this.maxClip.value = `` + this._vipLevel;
                this.setSVIPandVIP(this.maxClip, this.maxClipBg, this._vipLevel);
                this.maxTxt.innerHTML = `每日可购买<span style='color:rgb(45,106,56);font-size: 26px'>${node ? node[PrivilegeNodeFields.param1] : 0}</span>次`;
                if (this.MoneyBox.visible == true) {
                    let cost = PrivilegeCfg.instance.getCostByLevel(this._vipLevel, this._type)[PrivilegeParamFields.param];
                    let maxtimes = node[PrivilegeNodeFields.param1];
                    if (this.buyTimes <= maxtimes) {
                        if (this.buyTimes >= cost.length) {
                            this.costTxt.text = cost[cost.length - 1][idCountFields.count].toString();
                        } else {
                            this.costTxt.text = cost[this.buyTimes][idCountFields.count].toString();
                        }
                    }
                    this.boughtTxt.text = this.buyTimes + "/" + node[PrivilegeNodeFields.param1];
                    if (this.buyTimes == node[PrivilegeNodeFields.param1]) {
                        this.boughtTxt.color = CommonUtil.getColorByQuality(5);
                    } else {
                        this.boughtTxt.color = "#3d3d3d";
                    }
                }
                this.upBox.visible = false;
                this.maxBox.visible = true;
            }
        }

        private setRedDot(buyTimes: number, node: PrivilegeNode): void {
            let times: number;
            //这里直接用 当前类型获取吧
            let currTime: number = VipModel.instance.getPrivilegeInfoById(this._type)[PrivilegeDataFields.value];
            // let currTime: number = VipModel.instance.getPrivilegeInfoById(Privilege.canBuySweppingTimes)[PrivilegeDataFields.value];
            let needGoldCount: number = 0;
            node == null ? times = 0 : times = node[PrivilegeNodeFields.param1];
            if (node) {
                let itemsArr: Items[] = PrivilegeCfg.instance.getCostByLevel(this._vipLevel, this._type)[PrivilegeParamFields.param];
                let items: Items = this.getConsume(itemsArr, currTime);
                if (items) {
                    needGoldCount = items[ItemsFields.count];
                } else {
                    this._btnClip.visible = false;
                    return;
                }
            }
            if (buyTimes < times && times != 0 && PlayerModel.instance.ingot >= needGoldCount) {
                this._btnClip.visible = true
            } else {
                this._btnClip.visible = false;
            }
        }

        private getConsume(itemsArr: Items[], currTime: int): Items {
            let result: Items = itemsArr[currTime];
            if (!result) {
                return this.getConsume(itemsArr, --currTime);
            } else {
                return itemsArr[currTime];
            }
        }

        private buyHandler(): void {
            let vipLv = VipModel.instance.vipLevel;
            if ((!this._minLv && this._minLv !== 0) || vipLv < this._minLv) {
                if (modules.vip.VipModel.instance.vipLevel >= 1) {
                    WindowManager.instance.open(WindowEnum.VIP_PANEL);
                }
                else {
                    WindowManager.instance.open(WindowEnum.VIP_NEW_PANEL);
                }
                this.close();
            } else {
                if (this._type == Privilege.canBuySweppingTimes) {
                    Channel.instance.publish(UserFeatureOpcode.BuySweepingTimes, null);
                } else if (this._type == Privilege.copyCloudlandTicket) {
                    let sceneCfg = SceneCfg.instance.getCfgById(this._mapId);
                    let type = sceneCfg[sceneFields.type];
                    DungeonCtrl.instance.buyTimes(type);
                } else {
                    let sceneCfg = SceneCfg.instance.getCfgById(this._mapId);
                    let type = sceneCfg[sceneFields.type];
                    DungeonCtrl.instance.buyTimes(type);
                }
            }
        }
    }
}