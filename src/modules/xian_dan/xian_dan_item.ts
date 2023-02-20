/////<reference path="../$.ts"/>
/** 仙丹item */
namespace modules.xianDan {
    import XianDanItemUI = ui.XianDanItemUI;
    import xiandan = Configuration.xiandan;
    import XianDanCfg = modules.config.XianDanCfg;
    import item_material = Configuration.item_material;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_materialFields = Configuration.item_materialFields;
    import attr = Configuration.attr;
    import xiandanFields = Configuration.xiandanFields;
    import AttrUtil = modules.common.AttrUtil;

    export class XianDanItem extends XianDanItemUI {

        public setData(id: number): void {
            this.item.dataSource = [id, 0, 0, null];
            this.item.isbtnClipIsPlayer = false;
            let itemCfg: item_material = ItemMaterialCfg.instance.getItemCfgById(id);
            let name: string = itemCfg[item_materialFields.name];
            this.nameTxt.text = name;
            let count: number = XianDanModel.instance.getItemCountById(id);
            this.countTxt.text = count.toString();

            let cfg: xiandan = XianDanCfg.instance.getCfgById(id);
            let attr: attr = cfg[xiandanFields.attrs][0];
            let a  = AttrUtil.getResultByAttr(attr);
            this.attrTxt.text = AttrUtil.getResultByAttr(attr)[0];
            let limitCount: number = XianDanModel.instance.getLimit(id);

            let useCount: number = XianDanModel.instance.getUseCountById(id);
            let value:number = Number(AttrUtil.getResultByAttr(attr)[1]) * useCount;
            //this.valueTxt.text = `+${AttrUtil.getResultByAttr(attr)[1]}`;
            this.valueTxt.text = `+${value}`;
            this.proTxt.text = `(${useCount}/${limitCount})`;
            let proLength = 188;
            this.progress.width = (useCount / limitCount) * proLength;
            this.proTxt.color = (useCount) >= limitCount ? `#363636` : `#344c6f`;
        }
    }
}