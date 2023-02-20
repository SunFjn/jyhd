// ///<reference path="../first_pay/first_pay_model.ts"/>
// ///<reference path="../config/fight_talisman_cfg.ts"/>

// namespace modules.fight_talisman {
//     import Event = Laya.Event;
//     import CustomClip = common.CustomClip;
//     import CustomList = modules.common.CustomList;
//     import Items = Configuration.Items;
//     import ItemsFields = Configuration.ItemsFields;
//     import FirstPayModel = modules.first_pay.FirstPayModel;
//     import FightTalismanCfg = modules.config.FightTalismanCfg;
//     import fight_talisman = Configuration.fight_talisman;
//     import fight_talismanFields = Configuration.fight_talismanFields;
//     import SystemNoticeManager = modules.notice.SystemNoticeManager;
//     import BlendCfg = config.BlendCfg;
//     import blend = Configuration.blend;
//     import blendFields = Configuration.blendFields;

//     export class FightTalismanAlert extends ui.FightTalismanAlertUI {
//         constructor() {
//             super();
//         }

//         private _list: CustomList;
//         private _activeBtnEff: CustomClip;  //按钮粒子效果

//         protected initialize(): void {
//             super.initialize();
//             //按钮粒子效果
//             this._activeBtnEff = CommonUtil.creatEff(this.activateBtn, "btn_light", 15);
//             this._activeBtnEff.pos(-5, -10);

//             this.wayToGet.underline = true;
//             let items: Array<number> = BlendCfg.instance.getCfgById(49002)[blendFields.intParam];
//             this.baseItem.dataSource = [items[0], items[1], 0, null];     //战力护符Item显示
//             this._list = new CustomList();
//             this._list.width = 550;
//             this._list.height = 410;
//             this._list.x = 65;
//             this._list.y = 232;
//             this._list.itemRender = FightTalismanItem;
//             this.addChildAt(this._list, 2);
//         }

//         public destroy(): void {
//             super.destroy();
//             if (this._activeBtnEff) {
//                 this._activeBtnEff.destroy();
//                 this._activeBtnEff = null;
//             }
//         }

//         protected addListeners(): void {
//             super.addListeners();
//             this.addAutoListener(this.activateBtn, Event.CLICK, this, this.activateBtnHandler);        //一键激活
//             this.addAutoListener(this.wayToGet, Event.CLICK, this, this.wayToGetHandler);        //获取途径
//             this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIGHT_TALISMAN_UPDATE, this, this.update);       //画面刷新事件
//         }

//         protected removeListeners(): void {
//             super.removeListeners();

//         }

//         public onOpened(): void {
//             super.onOpened();
//             this.update();
//         }

//         private update(): void {
//             //显示隐藏获取途径
//             this.wayToGet.visible = FightTalismanModel.instance.actived == -1;

//             let actived: number = FightTalismanModel.instance.actived;      //已激活的护符
//             let canActive: number = FightTalismanModel.instance.canActived;   //可激活的护符

//             //按钮特效
//             if (actived != -1 && actived < canActive) {
//                 this._activeBtnEff.visible = true;
//                 this._activeBtnEff.play();
//             }
//             else {
//                 this._activeBtnEff.visible = false;
//             }

//             if (actived == -1) {
//                 this.fighting.text = "0";
//             }
//             else {
//                 this.fighting.text = FightTalismanCfg.instance.getCfgByEra(actived)[fight_talismanFields.fighting].toString();       //战力显示
//             }

//             let dats: Array<FightTalismanItemValue> = [];
//             let len: number = FightTalismanCfg.instance.arr.length;
//             let arr: Array<fight_talisman> = FightTalismanCfg.instance.arr;

//             for (let i = 0; i < len; ++i) {
//                 if (arr[i][fight_talismanFields.era] <= actived) {
//                     dats.push([arr[i][fight_talismanFields.era], FightTalismanItemValueState.actived]);
//                 }
//                 else if (arr[i][fight_talismanFields.era] <= canActive) {
//                     dats.push([arr[i][fight_talismanFields.era], FightTalismanItemValueState.canActive]);
//                 }
//                 else {
//                     dats.push([arr[i][fight_talismanFields.era], FightTalismanItemValueState.unActive]);
//                 }
//             }
//             this._list.datas = dats;
//         }

//         //一键激活
//         private activateBtnHandler(): void {
//             if (FightTalismanModel.instance.actived == -1) {
//                 this.wayToGetHandler();     //如果还没购买或激活，将跳转到购买页面
//             }
//             else if (FightTalismanModel.instance.actived < FightTalismanModel.instance.canActived) {
//                 FightTalismanCtrl.instance.activeTalisman();
//             }
//             else if (FightTalismanModel.instance.actived == FightTalismanCfg.instance.arr[FightTalismanCfg.instance.arr.length - 1][fight_talismanFields.era]) {
//                 SystemNoticeManager.instance.addNotice("已激活护符的全部战力", false);      //系统提示
//             }
//             else {
//                 SystemNoticeManager.instance.addNotice("未达到激活条件", true);      //系统提示
//             }
//         }

//         //获取途径
//         private wayToGetHandler(): void {
//             //如果已首充
//             // if(FirstPayModel.instance.giveState){
//             WindowManager.instance.open(WindowEnum.FIGHT_TALISMAN_BUY_ALERT);      //战力护符购买页面
//             // }
//             // else{
//             //     WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);      //首充页面
//             // }
//         }
//     }
// }