namespace modules.born {

    import GetEraInfoReply = Protocols.GetEraInfoReply;
    import GetEraInfoReplyFields = Protocols.GetEraInfoReplyFields;
    import EraNodeFields = Protocols.EraNodeFields;
    import PlayerModel = modules.player.PlayerModel;
    import BagModel = modules.bag.BagModel;
    import EraNode = Protocols.EraNode;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import BornCfg = modules.config.BornCfg;
    import era = Configuration.era;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import eraFields = Configuration.eraFields;

    export class BornModel {

        private static _instance: BornModel;
        public static get instance(): BornModel {
            return this._instance = this._instance || new BornModel();
        }

        private _lv: int;
        private _tab: Table<EraNode>;
        private _ids: number[];

        constructor() {
            this._tab = {};
            this._ids = [];
        }

        public updateInfo(tuple: GetEraInfoReply): void {

            utils.TableUtils.clear(this._tab);
            this._ids.length = 0;

            let lv: number = tuple[GetEraInfoReplyFields.level];
            if (lv > this._lv && this._lv != null) {
                WindowManager.instance.open(WindowEnum.BORN_SUCCESS_ALERT);
            }
            this._lv = lv;
            PlayerModel.instance.bornLev = this._lv;
            BagModel.instance.setMaxStage(this._lv);

            let nodes: Array<EraNode> = tuple[GetEraInfoReplyFields.nodes];
            nodes.forEach((ele) => {
                let id: number = ele[EraNodeFields.id];
                this._ids.push(id);
                this._tab[id] = ele;
                // console.log(`觉醒任务id --->${id}`);
                // console.log(`觉醒任务进度 --->${ele[EraNodeFields.progress]}`);
            });

            GlobalData.dispatcher.event(CommonEventType.BORN_UPDATE);
            this.checkRP();
        }

        public checkRP(): void {
            let lv: number = BornModel.instance.lv;
            let cfg: era = BornCfg.instance.getCfgByLv(lv);
            let nextCfg: era = BornCfg.instance.getCfgByLv(this._lv, 1);

            if (!nextCfg) {
                RedPointCtrl.instance.setRPProperty("bornRP", false);
                return;
            }

            for (let key in this._tab) {
                let value: EraNode = this._tab[key];
                if (value[EraNodeFields.state] == 1) {
                    RedPointCtrl.instance.setRPProperty("bornRP", true);
                    return;
                }
            }
            let flag: boolean = false;
            if (cfg[eraFields.eraDan][0]) {
                for (let key in this._tab) {
                    let value: EraNode = this._tab[key];
                    if (!value[EraNodeFields.state]) {
                        flag = false;
                        break;
                    } else {
                        flag = true;
                    }
                }
            } else {
                flag = false;
            }

            if (cfg[eraFields.eraDan][0] && nextCfg && !flag) {
                let needProp: Items = cfg[eraFields.eraDan][0];
                let needId: number = needProp[ItemsFields.itemId];
                let haveCount: number = CommonUtil.getPropCountById(needId);
                if (haveCount > 0) {
                    flag = true;
                }
            }
            RedPointCtrl.instance.setRPProperty("bornRP", flag);
        }
        /**
         * 
         * @param lv  //等级
         * @param isFontClip  是否为艺术字体
         * @returns 
         */
        public formatLv(lv: number,isFontClip:boolean = true): string {
            let zhuan: number = Math.floor(lv / 100);
            let chong: number = lv % 100;
            //"a"代表"十" "b"表示转 "c"表示重
            let ten = Math.floor(zhuan / 10);//10位
            let bit = zhuan % 10;//个位
            if (isFontClip) {
                let str = "";
                if (ten) {
                    str +=  ten > 1 ? ten + "a":"a";
                }
                if (bit) {
                    str += bit;
                }
               return `${str}b${chong}c`;
            }else{
                let str = "";
                if (ten) {
                    str += ten > 1 ? CommonUtil.numToUpperCase(ten) + CommonUtil.numToUpperCase(10) : CommonUtil.numToUpperCase(10);
                }
                if (bit) {
                    str += CommonUtil.numToUpperCase(bit);
                }
               return `${str}`;
            }
        }

        public get lv(): number {
            return this._lv ? this._lv : 0;
        }

        public getEraNode(id: number): EraNode {
            return this._tab[id];
        }

        public get ids(): number[] {
            return this._ids;
        }
    }
}