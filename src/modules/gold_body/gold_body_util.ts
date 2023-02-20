/** 金身工具类*/


namespace modules.goldBody {
    export class GoldBodyUtil {
        constructor() {

        }

        //显示总的属性        ---------------------------------以后修改属性，这个部分需要修改，UI也需要进行设置！------------------------------------------\
        //前面的8个，如果改变顺序显示的面板也需要进行改变
        public static soulTotalAttrIndices: Array<int> = [ItemAttrType.attack, ItemAttrType.hp, ItemAttrType.defense, ItemAttrType.disDefense, ItemAttrType.hit,
            ItemAttrType.dodge, ItemAttrType.crit, ItemAttrType.tough, ItemAttrType.soulAttackPer, ItemAttrType.soulHpPer];
    }
}