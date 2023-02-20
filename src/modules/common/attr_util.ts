/*
 * @Author: yuyongyuan 1784394982@qq.com
 * @Date: 2022-12-02 13:53:21
 * @LastEditors: yuyongyuan 1784394982@qq.com
 * @LastEditTime: 2022-12-23 09:52:28
 * @FilePath: \hengban_game\src\modules\common\attr_util.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
///<reference path="../../../libs/generate/configuration.d.ts"/>
/// <reference path="../config/attr_item_cfg.ts" />
namespace modules.common {

    import attr = Configuration.attr;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import attr_item = Configuration.attr_item;
    import TypesAttr = Protocols.TypesAttr;

    export class AttrUtil {

        public static formatFloatNum(value: number): string {
            let b = Math.round(value * 10000);
            let t: number = b * 0.01 >> 0;
            let result: number = t + (b % 100 * 0.01);
            return t === result ? `${t}` : result.toFixed(2);
        }

        public static setAttrTxts(
            cfg: any,
            nextCfg: any,
            nameTxts: Array<Laya.Text | Laya.Label>,
            valueTxts: Array<Laya.Text | Laya.Label>,
            imgs: Array<Laya.Image>,
            upTxts: Array<Laya.Text | Laya.Label>,
            attrsIndex: number = -1
        ): number {
            let attrs: Array<attr> = nextCfg ? nextCfg[attrsIndex] : cfg[attrsIndex];
            let curAttrs: Array<attr> = []
            if ((!cfg || cfg &&!cfg[attrsIndex].length) && nextCfg) {
                nextCfg[attrsIndex].forEach((attr: attr) => {
                    curAttrs.push([attr[0], 0]);
                })
            } else {
                curAttrs = cfg[attrsIndex];
            }

            let nextAttrs: Array<attr> = nextCfg ? nextCfg[attrsIndex] : null;
            for (let i: int = 0, len: int = attrs.length; i < len; i++) {
                let type: number = attrs[i][attrFields.type];
                let attCfg: attr_item = AttrItemCfg.instance.getCfgById(type);

                let isPercent: number = attCfg[attr_itemFields.isPercent];
                let curAttr: attr = this.getAttrByType(type, curAttrs);
                let curAttrStr: string = curAttr ? isPercent ? this.formatFloatNum(curAttr[attrFields.value]) + "%" : CommonUtil.bigNumToString(Math.round(curAttr[attrFields.value]),false): "0";
                if (valueTxts) {
                    nameTxts[i].text = attCfg[attr_itemFields.name] + ":";
                    valueTxts[i].text = curAttrStr;
                    valueTxts[i].visible = true;
                    valueTxts[i].x = nameTxts[i].x + nameTxts[i].width + 10;
                } else {
                    nameTxts[i].text = `${attCfg[attr_itemFields.name]}:${curAttrStr}`;
                }
                nameTxts[i].visible = true;

                if (nextAttrs) {
                    let nextAttr: attr = this.getAttrByType(type, nextAttrs);
                    if (nextAttr) {
                        imgs[i].visible = upTxts[i].visible = true;
                        let value: number = nextAttr[attrFields.value] - (curAttr ? curAttr[attrFields.value] : 0);
                        upTxts[i].text = isPercent ? this.formatFloatNum(value) + "%" : CommonUtil.bigNumToString(Math.round(value),false);
                    }
                } else {
                    imgs[i].visible = upTxts[i].visible = false;
                }
            }
            for (let i: int = attrs.length, len = nameTxts.length; i < len; i++) {
                nameTxts[i].visible = imgs[i].visible = upTxts[i].visible = false;
                if (valueTxts) valueTxts[i].visible = false;
            }
            return attrs.length;
        }

        public static getAttrByType(type: number, attrs: Array<attr | TypesAttr>): attr | TypesAttr {
            let t: attr = null;
            for (let i: int = 0, len: int = attrs.length; i < len; i++) {
                if (attrs[i][attrFields.type] === type) {
                    t = attrs[i];
                    break;
                }
            }
            return t;
        }

        public static getResultByAttr(attr: attr): [string, string] {
            let type: int = attr[attrFields.type];
            let value: number = attr[attrFields.value];
            let attrCfg: attr_item = AttrItemCfg.instance.getCfgById(type);
            let attrName: string = attrCfg[attr_itemFields.name];
            let isPer: boolean = attrCfg[attr_itemFields.isPercent] == 1;
            let attrValue: string = isPer ? `${value * 100}%` : `${value}`;
            return [attrName, attrValue];
        }
    }
}
