/////<reference path="../$.ts"/>
/** 仙女护送日志面板 */
namespace modules.fairy {
    import BtnGroup = modules.common.BtnGroup;
    import FairyLogAlertUI = ui.FairyLogAlertUI;
    import CustomList = modules.common.CustomList;
    import CommonUtil = modules.common.CommonUtil;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    export class FairyLogAlert extends FairyLogAlertUI {

        private _list: CustomList;
        private _btnGroup: BtnGroup;
        private _remainTime: number;
        private _maxLootTime: number;

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.pos(55, 125);
            this._list.width = 550;
            this._list.height = 310;
            this._list.hCount = 1;
            this._list.spaceY = 5;
            this._list.itemRender = FairyLogItem;
            this.addChild(this._list);

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.btnGoup_0, this.btnGoup_1);

            this._maxLootTime = config.BlendCfg.instance.getCfgById(31007)[Configuration.blendFields.intParam][0];

            this._remainTime = 0;
        }

        public destroy(): void {
            this._list = this.destroyElement(this._list);
            this._btnGroup = this.destroyElement(this._btnGroup);
            super.destroy();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._btnGroup, Laya.Event.CHANGE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FAIRY_LOG_UPDATE, this, this.updateView);
            this._btnGroup.selectedIndex = 0;

            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.loopHandler);
        }

        public onOpened(): void {
            super.onOpened();
            FairyCtrl.instance.getFairyLog();
        }

        private updateView(): void {

            this.noSendTxt.visible = false;

            if (this._btnGroup.selectedIndex == 0) {
                this._list.visible = false;
                let state: number = FairyModel.instance.sendState;
                /*护送状态 0闲置，1护送中，2护送结束*/
                if (state == 1) {
                    this.box.visible = true;
                    let fairyId: number = FairyModel.instance.fairyId;
                    this._remainTime = FairyModel.instance.endTime;
                    let cfg: Configuration.fairy = config.FairyCfg.instance.getCfgById(fairyId);
                    let fairyName: string = cfg[Configuration.fairyFields.name];
                    let lootColor: string = FairyModel.instance.looting >= this._maxLootTime ? `#ff3e3d` : `#168a17`;
                    this.nameTxt.text = fairyName;
                    this.nameTxt.color = CommonUtil.getColorByQuality(fairyId);
                    this.countTxt.text = `${FairyModel.instance.looting}/${this._maxLootTime}`;
                    this.countTxt.color = lootColor;
                    this.timeTxt.text = `剩余时间:${CommonUtil.timeStampToMMSS(this._remainTime)}`;
                    this.doubleTxt.visible = FairyModel.instance.isDouble;
                    let items: Items[] = cfg[Configuration.fairyFields.items];
                    this.setProp(this.icon_0,this.propTxt_0,items[0]);
                    this.setProp(this.icon_1,this.propTxt_1,items[1]);
                } else {
                    this.noSendTxt.visible = true;
                    this.noSendTxt.text = `当前并无护送`;
                    this.box.visible = false;
                }

            } else {
                this._list.visible = true;
                this.noSendTxt.visible = this.box.visible = false;

                let logList: Array<Protocols.FairyLog> = FairyModel.instance.logList.concat();
                if (FairyModel.instance.sendState == 2) {
                    logList.push(null);
                }
                if (logList.length == 0) {
                    this.noSendTxt.text = `当前并无拦截信息`;
                    this.noSendTxt.visible = true;
                }
                this._list.datas = logList;
            }
        }

        private  setProp(icon:Image,txt:Text,item:Items):void{
            let itemId:number = item[ItemsFields.itemId];
            let itemCount:number = item[ItemsFields.count];
            icon.skin = CommonUtil.getIconById(itemId, true);
            txt.text = `${itemCount * FairyModel.instance.per * (FairyModel.instance.isDouble ? 2 : 1)}`;
        }

        private loopHandler(): void {
            if (this._remainTime <= 0) {
                return;
            } else {
                if (this._btnGroup.selectedIndex == 0){
                    this.timeTxt.text = `剩余时间:${CommonUtil.timeStampToMMSS(this._remainTime)}`;
                }
            }
        }
    }
}
