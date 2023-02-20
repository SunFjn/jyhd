/** 成就工具类*/


namespace modules.magicPosition {

    export class MagicPositionUtil {
        constructor() {

        }

        public static getSkinByLv(lv: number): string {
            let stage: number = lv % 10;
            let str: string;
            if (stage == 1) {
                str = `txt_xw_cq`;
            } else if (stage == 2) {
                str = `txt_xw_zq`;
            } else if (stage == 3) {
                str = `txt_xw_df`;
            } else {
                str = `txt_xw_dym`;
            }
            return `magic_position/${str}.png`;
        }
    }
}