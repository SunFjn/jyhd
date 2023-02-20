/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.kuanghuan {
    import Dictionary = Laya.Dictionary;
    import kuanghuan = Configuration.kuanghuan;
    import kuanghuanFields = Configuration.kuanghuanFields;

    export class KuangHuanCfg {
        private static _instance: KuangHuanCfg;
        public static get instance(): KuangHuanCfg {
            return this._instance = this._instance || new KuangHuanCfg();
        }

        private _dic: Dictionary;
        private getcfg: kuanghuan[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic = new Dictionary();
            let arr: Array<kuanghuan> = GlobalData.getConfig("kuanghuan");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._dic.set(arr[i][kuanghuanFields.taskId], arr[i]);
            }
            this.getcfg = arr;
        }

        //根据类型获取配置
        public getCfgBytype(type: number): kuanghuan[] {
            let gra: kuanghuan[] = [];
            for (let i: int = 0, len: int = this.getcfg.length; i < len; i++) {
                let grad: number = this.getcfg[i][kuanghuanFields.type];
                if (type == grad) {
                    gra.push(this.getcfg[i]);
                }
            }
            return gra;
        }

        // 根据ID获取配置
        public getCfgById(id: int): kuanghuan {
            return this._dic.get(id);
        }

    }
}