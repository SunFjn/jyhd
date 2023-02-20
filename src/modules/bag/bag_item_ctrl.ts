/** 背包单元项*/


namespace modules.bag {
    import Image = Laya.Image;
    import Sprite = Laya.Sprite;
    import Text = Laya.Text;

    export class BagItemCtrl {
        // 品质框层
        public qualityLayer: Sprite;
        // 道具图标层
        public iconLayer: Sprite;
        // 文字层
        public nameLayer: Sprite;

        // 品质框
        public qualityBg: Image;
        // 道具图标
        public iconImg: Image;
        // 名字
        public nameTxt: Text;
        // 数量
        public numTxt: Text;

        constructor() {

        }
    }
}