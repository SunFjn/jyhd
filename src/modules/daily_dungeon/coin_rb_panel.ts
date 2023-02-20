/** 哥布林王国右下面板*/


namespace modules.dailyDungeon {
    import CoinRBViewUI = ui.CoinRBViewUI;
    import Event = Laya.Event;
    import BroadcastCopyIncome = Protocols.BroadcastCopyIncome;
    import BroadcastCopyIncomeFields = Protocols.BroadcastCopyIncomeFields;
    import IncomeFields = Protocols.IncomeFields;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import DungeonModel = modules.dungeon.DungeonModel;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import Layer = ui.Layer;
    import Inspire = Protocols.Inspire;
    import InspireFields = Protocols.InspireFields;
    import TweenGroup = utils.tween.TweenGroup;
    import LayaEvent = modules.common.LayaEvent;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import AutoInspire = Protocols.AutoInspire;
    import AutoInspireFields = Protocols.AutoInspireFields;

    export class CoinRBPanel extends CoinRBViewUI {
        private _coinImgs: Array<Image>;
        private _coinTxts: Array<Text>;
        private _incomes: Array<BroadcastCopyIncome>;
        private _skinUrl: string;
        private _tweenGroup: TweenGroup;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.right = 0;
            this.bottom = 240;

            this.layer = Layer.MAIN_UI_LAYER;
            this.closeByOthers = false;

            this._coinImgs = new Array<Image>();
            this._coinTxts = new Array<Text>();
            this._incomes = new Array<BroadcastCopyIncome>();

            this._tweenGroup = new TweenGroup();
            this.regGuideSpr(GuideSpriteId.CURRENCY_INSPIRE_BTN, this.inspireBtn);
            
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.inspireBtn, LayaEvent.CLICK, this, this.inspireHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BROADCAST_COPY_INCOME, this, this.incomeUpdate);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_INSPIRE_UPDATE, this, this.updateInspire);

            Laya.timer.loop(240, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.loopHandler);
        }

        protected onOpened(): void {
            super.onOpened();

            // this.incomeUpdate();

            this.killNumTxt.text = "0";
            this.coinTxt.text = "0";

            let mapId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            if (mapId === SCENE_ID.scene_copper_copy) {
                this.nameTxt.text = "哥布林王国";
                this.coinDescTxt.text = "累积金币：";
                this._skinUrl = "common/icon_tongyong_1.png";
            } else if (mapId === SCENE_ID.scene_zq_copy) {
                this.nameTxt.text = "泰拉矿场";
                this.coinDescTxt.text = "累积魔力：";
                this._skinUrl = "common/icon_tongyong_10.png";
            }

 
            let cfg = SceneCfg.instance.getCfgById(mapId);
            let auto: AutoInspire = DungeonModel.instance.getAutoInspire(cfg[sceneFields.type])
            if (auto[AutoInspireFields.gold] == 1) DungeonModel.instance.reqInspire(InspireType.gold, false, true);
            this.updateInspire();
        }

        public close(): void {
            if (this._tweenGroup) {
                this._tweenGroup.removeAll();
            }
            super.close();
            this._incomes.length = 0;
        }

        private inspireHandler(): void {
            WindowManager.instance.openDialog(WindowEnum.SINGLE_INSPIRE_ALERT, 2);
        }

        private incomeUpdate(): void {
            let income: BroadcastCopyIncome = DungeonModel.instance.broadcastCopyIncome;
            if (!income) return;
            this.killNumTxt.text = income[BroadcastCopyIncomeFields.monsterTotalCount] + "";
            this.coinTxt.text = Math.round(income[BroadcastCopyIncomeFields.totalIncome][IncomeFields.param]) + "";
            let coin: number = income[BroadcastCopyIncomeFields.curIncome][IncomeFields.param];

            if (coin > 0) {
                this._incomes.push(income);
            }
        }

        private loopHandler(): void {
            if (!this._incomes || this._incomes.length === 0) return;
            let income: BroadcastCopyIncome = this._incomes.shift();
            let img: Image = this._coinImgs.length > 0 ? this._coinImgs.shift() : new Image();
            img.skin = this._skinUrl;
            this.addChild(img);
            let tY: number = 316;// - income[BroadcastCopyIncomeFields.monsterTotalCount] * 16;
            img.pos(272, tY, true);
            TweenJS.create(img, this._tweenGroup).to({ y: tY - 110 }, 800).chain(
                TweenJS.create(img, this._tweenGroup).to({ y: tY - 180, alpha: 0.6 }, 400).onComplete((): void => {
                    img.skin = "";
                    img.removeSelf();
                    img.alpha = 1;
                    this._coinImgs.push(img);
                })
            ).start();

            let txt: Text = this._coinTxts.length > 0 ? this._coinTxts.shift() : new Text();
            this.addChild(txt);
            tY = tY + 8;// - income[BroadcastCopyIncomeFields.monsterTotalCount] * 16;
            txt.pos(314, tY, true);

            // 福利周卡购买后显示后缀增加‘（周卡）’字样

            if (income[BroadcastCopyIncomeFields.curIncome][IncomeFields.additionType] == 312) {
                txt.text = "+" + Math.ceil(income[BroadcastCopyIncomeFields.curIncome][IncomeFields.param]) + "(开服)"
            } else if (income[BroadcastCopyIncomeFields.curIncome][IncomeFields.additionType] == 344) {
                txt.text = "+" + Math.ceil(income[BroadcastCopyIncomeFields.curIncome][IncomeFields.param]) + "(周卡)"
            }  else if (income[BroadcastCopyIncomeFields.curIncome][IncomeFields.additionType] == 359) {
                txt.text = "+" + Math.ceil(income[BroadcastCopyIncomeFields.curIncome][IncomeFields.param]) + "(春节)"
            } else {
                txt.text = "+" + Math.ceil(income[BroadcastCopyIncomeFields.curIncome][IncomeFields.param])
            }
            txt.color = "#44ff63";
            txt.fontSize = 23;
            txt.stroke = 4;
            txt.strokeColor = "#000000";
            TweenJS.create(txt, this._tweenGroup).to({ y: tY - 110 }, 800).chain(
                TweenJS.create(txt, this._tweenGroup).to({ y: tY - 180, alpha: 0.6 }, 400).onComplete((): void => {
                    txt.text = "";
                    txt.removeSelf();
                    txt.alpha = 1;
                    this._coinTxts.push(txt);
                })
            ).start();
        }

        private updateInspire(): void {
            if (!DungeonModel.instance.inspires) return;
            let inspires: Array<Inspire> = DungeonModel.instance.inspires;
            let damage: number = 0;
            for (let i: int = 0, len: int = inspires.length; i < len; i++) {
                damage += inspires[i][InspireFields.per];
            }
            this.inspireTxt.text = `攻击+${(damage * 100).toFixed(0)}%`;




        }

        public destroy(destroyChild: boolean = true): void {
            if (this._coinImgs) {
                for (let e of this._coinImgs) {
                    e.destroy(true);
                }
                this._coinImgs = null;
            }

            if (this._coinTxts) {
                for (let e of this._coinTxts) {
                    e.destroy(true);
                }
                this._coinTxts = null;
            }

            super.destroy(destroyChild);
        }
    }
}