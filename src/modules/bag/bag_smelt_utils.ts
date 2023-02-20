/**熔炼工具类 */


namespace modules.bag {
    export class BagSmeltUtil {
        constructor() {
        }

        public static colorIndex: Array<int> = [6, 5, 4, 3]; //颜色对应0-任意品质-6,1-紫色及以下-3,2-橙色及以下-4,3-红色及以下-5; a-b-c:a索引,b对应显示内容,c表中定义

        public static starIndex: Array<int> = [5, 4, 3, 2, 1];  //无星级对应1，以此类推
    }
}