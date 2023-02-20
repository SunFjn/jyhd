namespace modules.commonAlert {
    import Text = Laya.Text;
    import GetWayCfg = modules.config.GetWayCfg;

    export class PropAlertUtil {

        public static setDesTxt(txt: Text): void {
            txt.color = "#ffffff";
            txt.fontSize = 22;
            txt.font = "SimHei";
            txt.stroke = 4;
            txt.width = 88;
            txt.strokeColor = "#422d1e";
            txt.align = "center";
        }
        /**
         * 兼容来源描述超出4字
         * @param txt 控件
         */
        public static compatibleDesTxt(txt: Text): void {
            if (txt.textWidth > 88) {
                txt.x = 50 - txt.textWidth / 2
            }
        }


        public static clickHandler(id: number) {
            if (id != 500) {
                WindowManager.instance.closeAllDialog();
            } else {
                modules.notice.SystemNoticeManager.instance.addNotice("请多关注游戏内活动哦", false);
            }
            let getWayCfg: Configuration.get_way = GetWayCfg.instance.getCfgById(id);
            let skipId: number = getWayCfg[Configuration.get_wayFields.params][0];
            PropAlertUtil.skipScene(skipId);
        }

        public static skipScene(skipId: int): void {
            if (skipId) {
                if (skipId > 999) { //进场景
                    if (skipId == SCENE_ID.scene_homestead) {
                        xianfu.XianfuCtrl.instance.enterScene();
                    } else {
                        dungeon.DungeonCtrl.instance.reqEnterScene(skipId);
                    }
                } else {
                    WindowManager.instance.openByActionId(skipId);
                }
            }
        }
    }
}