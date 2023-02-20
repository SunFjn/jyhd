///<reference path="../config/faction_box_cfg.ts"/>
/** 宝藏列表item */
namespace modules.faction {
    import CustomClip = modules.common.CustomClip;
    import CommonUtil = modules.common.CommonUtil;
    import BaozangItemUI = ui.BaozangItemUI;
    import FactionBox = Protocols.FactionBox;
    import faction_box = Configuration.faction_box;
    import FactionBoxCfg = modules.config.FactionBoxCfg;
    import FactionBoxFields = Protocols.FactionBoxFields;
    import CustomList = modules.common.CustomList;
    import BaseItem = modules.bag.BaseItem;
    import Items = Configuration.Items;
    import Item = Protocols.Item;
    import ItemsFields = Configuration.ItemsFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import faction_boxFields = Configuration.faction_boxFields;
    import GetBoxInfoReplyFields = Protocols.GetBoxInfoReplyFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;


    export const enum BAOZANG_ITEM_TYPE {
        LIST,
        MINE,
        HELP_LIST,
        CANT_HELP,
    }

    export class BaozangItem extends BaozangItemUI {

        private _list: CustomList;
        private _resNames: Table<string>;
        private _cfgFields: Table<faction_boxFields>;
        private _time: number;
        private _state: FactionBoxState;
        private _id: string;
        private _type: BAOZANG_ITEM_TYPE;
        private _eff: CustomClip;
        private _goldEnough: boolean;

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.scrollDir = 2;
            this._list.x = 247;
            this._list.y = 60;
            this._list.width = 460;
            this._list.height = 100;
            this._list.hCount = 1;
            this._list.itemRender = BaseItem;
            this._list.spaceY = 5;
            this._list.scale(0.9, 0.9);
            this.addChild(this._list);

            this._resNames = {};
            this._resNames[FactionBoxColor.green] = ``;

            this._cfgFields = {};
            this._cfgFields[FactionBoxColor.green] = faction_boxFields.greenAward;
            this._cfgFields[FactionBoxColor.blue] = faction_boxFields.blueAward;
            this._cfgFields[FactionBoxColor.purple] = faction_boxFields.purpleAward;
            this._cfgFields[FactionBoxColor.orange] = faction_boxFields.orangeAward;
            this._cfgFields[FactionBoxColor.red] = faction_boxFields.redAward;

            this._time = 0;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
            Laya.timer.loop(1000, this, this.loopHandler);

        }

        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.loopHandler);
        }

        public setData(value: [FactionBox, BAOZANG_ITEM_TYPE]): void {
            let info: FactionBox = value[0];
            this._type = value[1];
            for (let e of this._childs) {
                e.visible = true;
            }
            this._id = info[FactionBoxFields.id];
            this._state = info[FactionBoxFields.state];
            let cfg: faction_box = FactionBoxCfg.instance.getCfgBylv(info[FactionBoxFields.level]);
            let color: number = info[FactionBoxFields.color];
            this.boxNameImg = color;
            let items: Items[] = <Items[]>cfg[this._cfgFields[color]];
            let datas: Item[] = [];
            for (let i: int = 0, len: int = items.length; i < len; i++) {
                datas.push([items[i][ItemsFields.itemId], items[i][ItemsFields.count], 0, null]);
            }
            this.btn.visible = true;
            this.helpManTxt.visible = this.propBox.visible = this.helpedTxt.visible = false;

            if (this._eff) {
                this._eff.visible = false;
            }

            this._list.datas = datas;
            if (this._type == BAOZANG_ITEM_TYPE.LIST) {
                this.list = info;
            } else if (this._type == BAOZANG_ITEM_TYPE.MINE) {
                this.mine = info;
            } else if (this._type == BAOZANG_ITEM_TYPE.HELP_LIST) {
                this.helpList = info;
            } else if (this._type == BAOZANG_ITEM_TYPE.CANT_HELP) {
                this.cantHelp = info;
            }
            this.loopHandler();
        }

        private set boxNameImg(color: number) {
            if (color === FactionBoxColor.green) {
                this.typeImg.skin = `faction/txt_xm_shbz.png`;
            } else if (color === FactionBoxColor.blue) {
                this.typeImg.skin = `faction/txt_xm_hmbz.png`;
            } else if (color === FactionBoxColor.purple) {
                this.typeImg.skin = `faction/txt_xm_tgbz.png`;
            } else if (color === FactionBoxColor.orange) {
                this.typeImg.skin = `faction/txt_xm_ktbz.png`;
            } else if (color === FactionBoxColor.red) {
                this.typeImg.skin = `faction/txt_xm_sxbz.png`;
            }
        }

        private set list(info: FactionBox) {
            this.headBox.visible = false;
            let needTime: string = CommonUtil.getTimeTypeAndTime(info[FactionBoxFields.time]);
            this.tipTxt.text = `打开需要${needTime}`;
            this.btn.skin = `common/btn_tongyong_24.png`;
            this.btn.labelColors = `#465460`;
            let freeCount: number = FactionModel.instance.boxInfo[GetBoxInfoReplyFields.freeCount];
            if (freeCount > 0) {
                this.btn.label = `免费挖掘`;
                this.propBox.visible = false;
            } else {
                this.btn.label = ``;
                this.propBox.visible = true;
                let color: FactionBoxColor = info[FactionBoxFields.color];
                let params: number[] = BlendCfg.instance.getCfgById(36019)[blendFields.intParam];
                let needItemId: number = params[color * 2];
                let needItemCount: number = params[color * 2 + 1];
                let haveCount: number = CommonUtil.getPropCountById(needItemId);
                this.propImg.skin = CommonUtil.getIconById(needItemId, true);
                this.propTxt.text = `${needItemCount}`;
                this.propTxt.color = haveCount >= needItemCount ? `#2d1a1a` : `#ff3e3e`;
                this._goldEnough = haveCount >= needItemCount;
            }
        }

        private set mine(info: FactionBox) {
            this.headBox.visible = false;
            this._time = info[FactionBoxFields.time];
            if (this._state == FactionBoxState.open) {  //开启中
                this.btn.skin = `common/btn_tongyong_23.png`;
                this.btn.label = `加速`;
                this.btn.labelColors = `#9d5119`;
                this.showHelpMan(info);
            } else if (this._state == FactionBoxState.waitOpen) { //等着协助开
                this.btn.skin = `common/btn_tongyong_24.png`;
                this.btn.label = `求助`;
                this.btn.labelColors = `#465460`;
            } else if (this._state == FactionBoxState.assist) { //发送协助
                this.btn.visible = false;
                this.helpedTxt.visible = true;
            } else if (this._state == FactionBoxState.get) {//可领取
                this.btn.skin = `common/btn_tongyong_23.png`;
                this.btn.label = `领取`;
                this.btn.labelColors = `#9d5119`;
                this.showHelpMan(info);
                this.playEff();
            }
        }

        private set helpList(info: FactionBox) {
            this.iconImg.visible = false;
            let occ: number = info[FactionBoxFields.occ];
            this.headImg.skin = `assets/icon/head/${occ}.png`;
            this.nameTxt.text = `${info[FactionBoxFields.name]}`;
            this._time = info[FactionBoxFields.time];
            this.btn.gray = false;
            if (this._state == FactionBoxState.open) {
                this.btn.skin = `common/btn_tongyong_23.png`;
                this.btn.label = `加速`;
                this.btn.labelColors = `#9d5119`;
            } else if (this._state == FactionBoxState.assist) {
                this.btn.skin = `common/btn_tongyong_24.png`;
                this.btn.label = `帮助`;
                this.btn.labelColors = `#465460`;
            } else if (this._state == FactionBoxState.get) {
                this.btn.skin = `common/btn_tongyong_23.png`;
                this.btn.label = `领取`;
                this.btn.labelColors = `#9d5119`;
                this.playEff();
            }
        }

        private set cantHelp(info: FactionBox) {
            this.iconImg.visible = false;
            let occ: number = info[FactionBoxFields.occ];
            this.headImg.skin = `assets/icon/head/${occ}.png`;
            this.nameTxt.text = `${info[FactionBoxFields.name]}`;
            this._time = info[FactionBoxFields.time];
            this.btn.gray = true;
            this.btn.skin = `common/btn_tongyong_24.png`;
            this.btn.label = `帮助`;
            this.btn.labelColors = `#465460`;
        }

        private showHelpMan(info: FactionBox): void {
            this.helpManTxt.text = `协助者:${info[FactionBoxFields.name]}`;
            this.helpManTxt.visible = true;
        }

        private playEff(): void {
            if (!this._eff) {
                this._eff = CommonUtil.creatEff(this.btn, `btn_light`, 15);
                this._eff.pos(-3, -13, true);
                this._eff.scale(0.8, 0.92);
            }
            this._eff.play();
            this._eff.visible = true;
        }

        private loopHandler(): void {
            if (this._state == FactionBoxState.notOpen) {
                this.tipTxt.color = `#ffec7c`;
                return;
            }
            let time: string = CommonUtil.timeStampToHHMMSS(this._time);
            if (this._state == FactionBoxState.open) {
                this.tipTxt.text = `${time}后可领奖`;
                this.tipTxt.color = `#168a17`;
            } else if (this._state == FactionBoxState.waitOpen) { //已挖，等着协助开
                this.tipTxt.text = `${time}后宝藏消失`;
                this.tipTxt.color = `#ff3e3e`;
            } else if (this._state == FactionBoxState.get) {
                this.tipTxt.text = `可领取`;
                this.tipTxt.color = `#168a17`;
            } else if (this._state == FactionBoxState.assist) {
                this.tipTxt.text = `${time}后宝藏消失`;
                this.tipTxt.color = `#ff3e3e`;
            }
        }

        private btnHandler(): void {
            if (this._state == FactionBoxState.open) {
                WindowManager.instance.open(WindowEnum.BAOZANG_SPEED_ALERT, this._id);
                return;
            }
            if (this._type == BAOZANG_ITEM_TYPE.LIST) {
                if (this._goldEnough == false) {
                    CommonUtil.goldNotEnoughAlert();
                } else {
                    FactionCtrl.instance.openBox([this._id]);
                }
            } else if (this._type == BAOZANG_ITEM_TYPE.MINE) {
                if (this._state == FactionBoxState.waitOpen) {
                    FactionCtrl.instance.askAssist([this._id]);
                } else if (this._state == FactionBoxState.get) {
                    FactionCtrl.instance.getBoxAward([this._id]);
                }
            } else if (this._type == BAOZANG_ITEM_TYPE.HELP_LIST) {
                if (this._state == FactionBoxState.assist) {
                    FactionCtrl.instance.assistOpenBox([this._id]);
                } else if (this._state == FactionBoxState.get) {
                    FactionCtrl.instance.getBoxAward([this._id]);
                }
            } else if (this._type == BAOZANG_ITEM_TYPE.CANT_HELP) {
                let tempBox: FactionBox = FactionModel.instance.tempBox;
                let state: FactionBoxState = tempBox[FactionBoxFields.state];
                if (state == FactionBoxState.get) {
                    CommonUtil.noticeError(ErrorCode.FactionAssistBoxNotGet);
                } else {
                    SystemNoticeManager.instance.addNotice(`同时只能协助一个宝藏`, true);
                }
            }
        }

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._eff = this.destroyElement(this._eff);
            super.destroy(destroyChild);
        }
    }
}
