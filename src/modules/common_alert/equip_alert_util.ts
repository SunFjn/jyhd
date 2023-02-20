namespace modules.commonAlert {
    import Text = laya.display.Text;
    import Image = Laya.Image;

    export class EquipAlertUtil {

        public static judgeDiff(diff: number, txt: Text, img: Image): void {
            txt.color = `#50ff28`;
            if (diff > 0) {  //对方的好
                img.skin = `common/zs_tongyong_3.png`;
            } else if (diff < 0) {
                img.skin = `common/zs_tongyong_5.png`;
                txt.color = `#ff3e3e`;
            } else {
                img.skin = `common/zs_tongyong_16.png`;
                txt.text = `无变化`;
            }
            diff = Math.abs(diff);
            txt.text = diff.toString();
        }
    }
}