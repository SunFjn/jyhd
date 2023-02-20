/** */
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/activity_all_cfg.ts"/>
///<reference path="../nine/nine_model.ts"/>
namespace modules.player_title {
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import designation = Configuration.designation;
    import designationFields = Configuration.designationFields;
    import designationProtocols = Protocols.Designation;
    import designationFieldsProtocols = Protocols.DesignationFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import DesignationCfg = modules.config.DesignationCfg;

    export class PlayerTitleModel {
        private static _instance: PlayerTitleModel;
        public static get instance(): PlayerTitleModel {
            return this._instance = this._instance || new PlayerTitleModel();
        }
        public _id: number = 0;
        public _currentIdData: designation = null; //当前佩戴的称号的数据
        public _AllDate: Table<designationProtocols>;//数据列表
        public _returnDtate: boolean = false;
        constructor() {
            this._returnDtate = false;
            // this._AllDate = new <designationProtocols>();
            this._AllDate = {};
        }

        public set nowTitleData(value: designation) {
            this._currentIdData = value;
        }
        public get nowTitleData(): designation {
            return this._currentIdData;
        }

        public get AllDate(): any {
            return this._AllDate;
        }

        public set AllDate(value: Array<designationProtocols>) {
            // id = 0,
            //     state = 1,			/*称号状态 1:未激活 2:可激活 3:已激活 4:穿戴中*/
            //     endTime = 2,			/*到期时间戳 0:无期限*/
            //     value = 3,			/*当前进度*/
            //     total = 4,			/*总进度*/
            for (let index = 0; index < value.length; index++) {
                let element = value[index];
                let id = element[designationFieldsProtocols.id];
                this._AllDate[id] = element;
            }
            this.setRp();
            // console.log("最新称号数据：   ", this._AllDate);
            // 临时处理
            if (WindowManager.instance.isOpened(WindowEnum.PLAYER_TITLE_PANEL))
                GlobalData.dispatcher.event(CommonEventType.PLAYER_TITLE_UPDATE);
        }

        /**
         * 获取总战力
         */
        public getAtkNum(): number {
            let atkNum = 0;

            for (const key in this._AllDate) {
                const element = this._AllDate[key];
                if (element) {
                    let id = element[designationFieldsProtocols.id];
                    //	/*称号状态 1:未激活 2:可激活 3:已激活 4:穿戴中*/
                    let state = element[designationFieldsProtocols.state];
                    if (state == 3 || state == 4) {
                        let shuju = DesignationCfg.instance.getCfgById(id);
                        if (shuju) {//安全判断
                            atkNum = atkNum + shuju[designationFields.atkNum];
                        }
                    }
                }
            }

            if (!atkNum) {
                atkNum = 0;
            }
            return atkNum;
        }

        public stateOne(): number {
            let ishave = 0;
            if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.playerTitle)) {
                for (const key in this._AllDate) {
                    const element = this._AllDate[key];
                    if (element) {
                        if (element[designationFieldsProtocols.state] == 3 || element[designationFieldsProtocols.state] == 4) {
                            ishave++;
                        }
                    }
                }
            }
            return ishave;
        }
        public isJiHuo(): boolean {
            let ishave = false;
            if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.playerTitle)) {
                for (const key in this._AllDate) {
                    const element = this._AllDate[key];
                    if (element) {
                        if (element[designationFieldsProtocols.state] == 2) {
                            // ishave = true;
                            return true;
                        }
                    }
                }
            }
            return ishave;
        }

        /**
         * name
         */
        public setRp() {
            let ishave = this.isJiHuo();
            RedPointCtrl.instance.setRPProperty("playerTitleRP", ishave);
        }

        /**
         * 判断当前类型 称号费否有可激活的
         */
        public isRpOfType(type: number): boolean {
            let shuju = DesignationCfg.instance.getCfgByType(type);
            if (shuju) {
                for (let index = 0; index < shuju.length; index++) {
                    let element = shuju[index];
                    let id = element[designationFields.id];
                    let data = this._AllDate[id];
                    if (data) {
                        ///*称号状态 1:未激活 2:可激活 3:已激活 4:穿戴中*/
                        let state = data[designationFieldsProtocols.state];
                        if (state == 2) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        /**
         * 获取当前类型称号的 激活进度
         * @param type
         */
        public getJjinDu(type: number): Array<number> {
            let shuju = DesignationCfg.instance.getCfgByType(type);
            let jinDu = new Array<number>();
            jinDu[0] = 0;
            jinDu[1] = 0;
            if (shuju) {
                jinDu[1] = shuju.length;
                for (let index = 0; index < shuju.length; index++) {
                    let element = shuju[index];
                    let id = element[designationFields.id];
                    let data = this._AllDate[id];
                    if (data) {
                        ///*称号状态 1:未激活 2:可激活 3:已激活 4:穿戴中*/
                        let state = data[designationFieldsProtocols.state];
                        if (state != 2 && state != 1) {
                            jinDu[0] = jinDu[0] + 1;
                        }
                    }
                }
            }
            return jinDu;
        }

        /**
         * 4穿戴中>3可激活>2已激活>1未激活，同状态下，按配置表配置的顺序从上往下排。
         */
        public getState(data: designation): number {
            let state = 1;
            if (data) {
                let id = data[designationFields.id];
                let shuju: designationProtocols = this._AllDate[id];
                if (shuju) {
                    state = shuju[designationFieldsProtocols.state];
                    //这里随时根据 需求变动排序
                    //称号状态 1:未激活 2:可激活 3:已激活 4:穿戴中
                    switch (state) {
                        case 1:
                            state = 1;
                            break;
                        case 2:
                            state = 3;
                            break;
                        case 3:
                            state = 2;
                            break;
                        case 4:
                            state = 4;
                            break;
                        default:
                            break;
                    }
                }
            }
            return state
        }

        /**
         * 列表属性展示节点
         */
        private _itemAttrOpenNode: Array<PlayerTitleItem>;
        public setItemAttrOpenNode(type: number, item: PlayerTitleItem) {
            if (typeof this._itemAttrOpenNode == "undefined") {
                this._itemAttrOpenNode = new Array<PlayerTitleItem>();
            }
            this._itemAttrOpenNode[type] = item;
        }
        public getItemAttrOpenNode(type: number): PlayerTitleItem {
            if (typeof this._itemAttrOpenNode == "undefined") {
                return undefined;
            }
            if (typeof this._itemAttrOpenNode[type] == "undefined") {
                return undefined;
            }
            return this._itemAttrOpenNode[type];
        }
    }
}