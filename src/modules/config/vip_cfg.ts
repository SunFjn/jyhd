// /** vip配置*/
//
//
// namespace modules.config {
//     import vip = Configuration.vip;
//     import vipFields = Configuration.vipFields;
//     import Dictionary = Laya.Dictionary;
//
//     export class VipCfg {
//         private static _instance: VipCfg;
//         public static get instance(): VipCfg {
//             return this._instance = this._instance || new VipCfg();
//         }
//
//         private _dic: Dictionary;
//
//         constructor() {
//             this.init();
//         }
//
//         private init(): void {
//             this._dic = new Dictionary();
//             let arr: Array<vip> = GlobalData.getConfig("vip");
//             for (let i: int = 0, len = arr.length; i < len; i++) {
//                 this._dic.set(arr[i][vipFields.level], arr[i]);
//             }
//         }
//
//         // 根据VIP等级获取配置
//         public getCfgByLv(lv: int): vip {
//             return this._dic.get(lv);
//         }
//     }
// }