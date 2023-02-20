///<reference path="../config/era_task_cfg.ts"/>
/** 觉醒item */
namespace modules.born {
    import BornItemUI = ui.BornItemUI;
    import EraNode = Protocols.EraNode;
    import EraNodeFields = Protocols.EraNodeFields;
    import era_task = Configuration.era_task;
    import EraTaskCfg = modules.config.EraTaskCfg;
    import era_taskFields = Configuration.era_taskFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class BornItem extends BornItemUI {

        private _taskNode: EraNode;
        private _btnClip: CustomClip;
        private _type: number;  // 0 代表面板 1代表弹框

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
        }

        public set line(t: number) {
            this._type = t;
            this.lineImg.visible = !!t;
        }

        public set id(id: number) {
            this._taskNode = BornModel.instance.getEraNode(id);
            let state: number;
            let currPro: number;
            let cfg: era_task = EraTaskCfg.instance.getCfgById(id);
            let des: string = cfg[era_taskFields.name];
            this.desTxt.text = des;
            let needPro: number = cfg[era_taskFields.nodes][Configuration.EraNodeFields.param];
            if (!this._taskNode) { //满级
                state = 2;
                currPro = needPro;
            } else {
                state = this._taskNode[EraNodeFields.state];
                currPro = this._taskNode[EraNodeFields.progress];
            }
            this.barTxt.text = `(${CommonUtil.bigNumToString(currPro)}/${CommonUtil.bigNumToString(needPro)})`;
            this.barTxt.color = state == 0 ? `#ff3e3e` : `#168a17`;

            let item: Items = cfg[era_taskFields.items][0];
            this.item.dataSource = [item[ItemsFields.itemId], item[ItemsFields.count], 0, null];

            if (state == 0) {//0:未完成
                this.btn.visible = true;
                this.img.visible = false;
                this.btn.label = this._type ? `直接领取` : `前往`;
                this.btn.skin = `common/btn_tongyong_24.png`;
                this.btn.labelColors = `#465460`;
                this.stopEff();
            } else if (state == 1) {//1：完成
                if (this._type) {
                    this.btn.visible = false;
                    this.img.visible = true;
                    this.img.skin = `common/txt_commmon_ywc.png`;
                    this.stopEff();
                } else {
                    this.btn.visible = true;
                    this.img.visible = false;
                    this.btn.label = `领取`;
                    this.btn.skin = `common/btn_tongyong_23.png`;
                    this.btn.labelColors = `#9d5119`;
                    this.playEff();
                }
            } else {//2：已领取*/
                this.btn.visible = false;
                this.img.visible = true;
                this.img.skin = `common/txt_commmon_ylq.png`;
                this.stopEff();
            }
        }

        private btnHandler(): void {
            let id: number = this._taskNode[EraNodeFields.id];
            let state: number = this._taskNode[EraNodeFields.state];
            if (state == 1) {//1：完成
                BornCtrl.instance.drawEraTask(id);
            } else {
                if (this._type) {
                    SystemNoticeManager.instance.addNotice(`使用觉醒丹可领取当前的全部奖励`, true);
                } else {
                    let cfg: era_task = EraTaskCfg.instance.getCfgById(id);
                    let skipId: number = cfg[era_taskFields.nodes][Configuration.EraNodeFields.skipId];
                    if(skipId === -1){
                        WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [MoneyItemId.exp, 0, true]);
                    }else {
                        WindowManager.instance.openByActionId(skipId);
                    }
                    WindowManager.instance.close(WindowEnum.BORN_ALERT);
                }
            }
        }

        private playEff(): void {
            if (!this._btnClip) {
                this._btnClip = CommonUtil.creatEff(this.btn, `btn_light`, 15);
                this._btnClip.pos(-5, -14, true);
                this._btnClip.scale(0.9, 1, true);
            }
            this._btnClip.play();
            this._btnClip.visible = true;
        }

        private stopEff(): void {
            if (this._btnClip) {
                this._btnClip.stop();
                this._btnClip.visible = false;
            }
        }

        public destroy(): void {
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy();
        }
    }
}