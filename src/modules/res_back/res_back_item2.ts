/////<reference path="../$.ts"/>
/** item 2 */
namespace modules.resBack {
    import ResBackItem_2UI = ui.ResBackItem_2UI;
    import Retrieve = Protocols.Retrieve;
    import RetrieveFields = Protocols.RetrieveFields;
    import retrieve_lilianFields = Configuration.retrieve_lilianFields;
    import retrieve_lilian = Configuration.retrieve_lilian;
    import RetrieveCfg = modules.config.RetrieveCfg;

    export class ResBackItem2 extends ResBackItem_2UI {

        private  _info:Retrieve;

        protected addListeners(): void {
            super.addListeners();

           this.addAutoListener(this.btn,common.LayaEvent.CLICK,ResBackModel.instance,ResBackModel.instance.backHandler);
        }

        public setData(value: Retrieve):void{
            this._info = value;
            let id:int = value[RetrieveFields.id];
            let cfg:retrieve_lilian = RetrieveCfg.instance.getLilianCfgById(id);
            if(!cfg){
                throw new Error(`历练找回id为${id},配置为空!`);
            }
            this.nameTxt.text = cfg[retrieve_lilianFields.name];
            let count:int = value[RetrieveFields.times];
            this.countTxt.text = `(可找回${count}次)`;
            this.valueTxt.text = `${cfg[retrieve_lilianFields.exp]}点`;
            this.numTxt.text = value[RetrieveFields.gold].toString();
        }
    }
}