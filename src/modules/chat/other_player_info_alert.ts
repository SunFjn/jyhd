/////<reference path="../$.ts"/>
/** 其他玩家详细信息面板 */
namespace modules.chat {
    import OtherPlayerInfoAlertUI = ui.OtherPlayerInfoAlertUI;
    import ChatPlayerDetailedInfo = Protocols.ChatPlayerDetailedInfo;
    import ChatPlayerDetailedInfoFields = Protocols.ChatPlayerDetailedInfoFields;
    import Item = Protocols.Item;
    import XianweiRiseCfg = modules.config.XianweiRiseCfg;
    import xianwei_riseFields = Configuration.xianwei_riseFields;
    import BornCfg = modules.config.BornCfg;
    import eraFields = Configuration.eraFields;
    import ExerciseCfg = modules.config.ExerciseCfg;
    import lilian_riseFields = Configuration.lilian_riseFields;
    import BtnGroup = modules.common.BtnGroup;
    import Event = Laya.Event;
    import CustomList = modules.common.CustomList;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import BagItem = modules.bag.BagItem;

    export class OtherPlayerInfoAlert extends OtherPlayerInfoAlertUI {

        private _equipItems: Array<BagItem>;
        private _btnGroup: BtnGroup;
        private _list: CustomList;
        private _nameStrs: string[];
        private _skeletonClip: SkeletonAvatar;
        protected initialize(): void {
            super.initialize();

            this._equipItems = new Array<BagItem>();

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.btnGroup_0, this.btnGroup_1);

            this._nameStrs = ["幻武", "翅膀", "精灵", "宠物"];

            this._list = new CustomList();
            this._list.hCount = 1;
            this._list.x = 56;
            this._list.y = 582;
            this._list.width = 550;
            this._list.height = 103;
            this._list.spaceY = 10;
            this._list.itemRender = PlayerInfoTxtItem;
            this.fashionBox.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.OTHER_PLAYER_INFO, this, this.updateView);
            this.addAutoListener(this._btnGroup, Event.CHANGE, this, this.updateView);
        }

        public onOpened(): void {
            super.onOpened();

            this._btnGroup.selectedIndex = 0;
        }

        private updateView(): void {

            let info: ChatPlayerDetailedInfo = ChatModel.instance.otherPlayerInfo;
            if (!info) return;

            let actorId: number = info[ChatPlayerDetailedInfoFields.agentId]; //玩家ID
            let occ: number = info[ChatPlayerDetailedInfoFields.occ];/*职业*/

            if (this._btnGroup.selectedIndex == 0) {
                this.btnGroup_0.mouseEnabled = false;
                this.btnGroup_1.mouseEnabled = true;
                this.baseBox.visible = true;
                this.fashionBox.visible = false;

                let fight: number = info[ChatPlayerDetailedInfoFields.fight]; /*战力*/
                let vipLv: number = info[ChatPlayerDetailedInfoFields.vip];/*vip等级*/
                let name: string = info[ChatPlayerDetailedInfoFields.name]; /*名字*/
                let lv: number = info[ChatPlayerDetailedInfoFields.level];  /*等级*/
                let eraLv: number = info[ChatPlayerDetailedInfoFields.eraLevel]; /*觉醒等级*/
                let riseId: number = info[ChatPlayerDetailedInfoFields.riseId];/*成就id*/
                let lilianLevel: number = info[ChatPlayerDetailedInfoFields.lilianLevel];/*历练等级*/
                let equips: Array<Item> = info[ChatPlayerDetailedInfoFields.equips];/*穿戴装备*/

                this.atkMsz.value = fight.toString();
                this.vipImg.visible = vipLv > 0;
                this.nameTxt.text = name;
                this.headImg.skin = `assets/icon/head/${occ}.png`;
                this.lvTxt.text = `等级:${lv}`;
                this.bornTxt.text = `觉醒等级:${BornCfg.instance.getCfgByLv(eraLv)[eraFields.name]}`;
                if (riseId == 0) {
                    this.xianweiTxt.visible = false;
                } else {
                    this.xianweiTxt.visible = true;
                    this.xianweiTxt.text = `成就:${XianweiRiseCfg.instance.getXianweiRiseByLevel(riseId)[xianwei_riseFields.name]}`;
                }
                if (!lilianLevel) {
                    this.daohangTxt.visible = false;
                } else {
                    this.daohangTxt.text = `活跃值:${ExerciseCfg.instance.getZLLCfgByLev(lilianLevel)[lilian_riseFields.name]}`;
                    this.daohangTxt.visible = true;
                }
                for (let i: int = 0, len: int = equips.length; i < len; i++) {
                    if (!this._equipItems[i]) {
                        let item: BagItem = new BagItem();
                        item.nameVisible = false;
                        item.needTip = true;
                        this.baseBox.addChild(item);
                        this._equipItems.push(item);
                        item.pos(58 + Math.floor(i % 5) * 108, 474 + Math.floor(i / 5) * 108);
                    }
                    this._equipItems[i].visible = true;
                    if (actorId == PlayerModel.instance.actorId) {
                        this._equipItems[i].type = bag.ItemBelongType.mine;
                    } else {
                        this._equipItems[i].type = bag.ItemBelongType.otherMan;
                    }
                    this._equipItems[i].dataSource = equips[i];
                }

                let showLen: number = equips.length;
                for (let i: int = 0, len: int = this._equipItems.length; i < len; i++) {
                    if (i >= showLen) {
                        this._equipItems[i].visible = false;
                    }
                }

                // 切页时销毁龙骨对象
                if (this._skeletonClip) {
                    this._skeletonClip = this.destroyElement(this._skeletonClip);
                }
            } else {
                this.btnGroup_0.mouseEnabled = true;
                this.btnGroup_1.mouseEnabled = false;
                this.baseBox.visible = false;
                this.fashionBox.visible = true;

                let sbCount: number = info[ChatPlayerDetailedInfoFields.sbCount];/*幻武激活数量*/
                let sbFight: number = info[ChatPlayerDetailedInfoFields.sbFight];/*幻武总战力*/
                let wingCount: number = info[ChatPlayerDetailedInfoFields.wingCount];/*翅膀激活数量*/
                let wingFight: number = info[ChatPlayerDetailedInfoFields.wingFight]; /*翅膀总战力*/
                let rideCount: number = info[ChatPlayerDetailedInfoFields.rideCount];/*精灵激活数量*/
                let rideFight: number = info[ChatPlayerDetailedInfoFields.rideFight];/*精灵总战力*/
                let petCount: number = info[ChatPlayerDetailedInfoFields.petCount];/*宠物激活数量*/
                let petFight: number = info[ChatPlayerDetailedInfoFields.petFight];/*宠物总战力*/
                let fashionId: number = info[ChatPlayerDetailedInfoFields.fashionId];/*时装ID*/
                let petId: number = info[ChatPlayerDetailedInfoFields.petId];/*宠物ID*/
                let sbId: number = info[ChatPlayerDetailedInfoFields.sbId]; /*幻武ID*/
                let wingId: number = info[ChatPlayerDetailedInfoFields.wingId];/*翅膀ID*/
                let rideId: number = info[ChatPlayerDetailedInfoFields.rideId];/*精灵ID*/
                let clothes: number = fashionId;

                let itemDatas: [string, number, number][] = [];
                itemDatas.push([this._nameStrs[0], sbCount, sbFight]);
                itemDatas.push([this._nameStrs[1], wingCount, wingFight]);
                itemDatas.push([this._nameStrs[2], rideCount, rideFight]);
                itemDatas.push([this._nameStrs[3], petCount, petFight]);
                this._list.datas = itemDatas;
                if (sbId == 0) sbId = 5001;

                this._skeletonClip = SkeletonAvatar.createShow(this, this);
                this._skeletonClip.pos(315, 500, true);
                console.log("展示玩家时装信息 时装:", clothes, "幻武:", sbId, "翅膀:", wingId);

                this._skeletonClip.reset(clothes, sbId, wingId);
            }
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._skeletonClip) {
                this._skeletonClip = this.destroyElement(this._skeletonClip);
            }

            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }
            if (this._equipItems) {
                for (let index = 0; index < this._equipItems.length; index++) {
                    let element = this._equipItems[index];
                    if (element) {
                        element.removeSelf();
                        element.destroy();
                        element = null;
                    }
                }
                this._equipItems.length = 0;
                this._equipItems = null;
            }
            super.destroy();
        }
    }
}
