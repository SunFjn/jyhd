/////<reference path="../$.ts"/>
/** 资源找回model */
namespace modules.resBack {
    import Retrieve = Protocols.Retrieve;
    import UpdateRetrieve = Protocols.UpdateRetrieve;
    import RetrieveFields = Protocols.RetrieveFields;
    import UpdateRetrieveFields = Protocols.UpdateRetrieveFields;

    export class ResBackModel {
        private static _instance: ResBackModel;
        public static get instance(): ResBackModel {
            return this._instance = this._instance || new ResBackModel();
        }

        private _res: Table<Retrieve>;
        private _lilian: Table<Retrieve>;

        constructor() {
            this._res = {};
            this._lilian = {};
        }

        public update(info: UpdateRetrieve): void {
            let lilian:Array<Retrieve> = info[UpdateRetrieveFields.lilianRetrieve];
            this.lilian = lilian;
            let res:Array<Retrieve> = info[UpdateRetrieveFields.resRetrieve];
            this.res = res;
        }

        public set res(list: Array<Retrieve>) {
            if(list.length ===0)return;
            this.ridOf(list,this._res);
            GlobalData.dispatcher.event(CommonEventType.RETRIEVE_RES_UPDATE);
        }
        public getRes():Table<Retrieve>{
            return this._res;
        }

        public set lilian(list: Array<Retrieve>) {
            if(list.length ===0)return;
            this.ridOf(list,this._lilian);
            GlobalData.dispatcher.event(CommonEventType.RETRIEVE_LILIAN_UPDATE);
        }
        public getLilian():Table<Retrieve>{
            return this._lilian;
        }

        private ridOf(child: Array<Retrieve>, parent: Table<Retrieve>): void {
            for (let ele of child) {
                let id: int = ele[RetrieveFields.id];
                let count:int = ele[RetrieveFields.times];
                if(count <=0){
                    delete parent[id];
                }else{
                    parent[id] = ele;
                }
            }
        }

        public backHandler(info:Retrieve):void{
            let count:int = info[RetrieveFields.times];
            if(count === 1){
                ResBackCtrl.instance.getrieveRes([info]);
            }else if(count>1){
                WindowManager.instance.open(WindowEnum.RES_BACK_ALERT,info);
            }else if(count<=0){
                throw new Error(`资源找回次数是${count},为何没被删掉还有界面???`);
            }
        }
    }
}