class DawData {


    private static _instance: DawData;

    public static get ins(): DawData {
        if (!DawData._instance) {
            DawData._instance = new DawData();
        }
        return DawData._instance;
    }

    constructor() {

    }

    private netShow: boolean = false
    public isShow() {
        if (this.netShow) {
            //   console.log("第二次打开")
            return;
        }
        this.netShow = true;
        //乐趣堂 1正式 3测试

        // if (window['get_Lqt_platform']() || window['get_Hxt_platform']() || window['get_Xcx_platform']()) {
        //     window['WuxiantaoNet']("api/jiuzhou/chiefPower", {}, (data) => {
        //         if (data.code == 200) {
        //             if (data.data.is_chief == "0") {
        //                 //区长判断
        //                 WindowManager.instance.open(WindowEnum.Daw_UI_QUZHANG)
        //             } else if (data.data.is_rank == "1") {
        //                 //战力判断
        //                 WindowManager.instance.open(WindowEnum.Daw_UI_ZHANLI)

        //             }
        //         }
        //     })
        // }



    }
    public OpenTixian(windowEnum: number) {
        WindowManager.instance.closeAllDialog()
        WindowManager.instance.openDialog(WindowEnum.Daw_UI_TiXian)
    }
    private _TiXianSelect: number = 0
    public set TiXianSelect(value) {
        this._TiXianSelect = value
        GlobalData.dispatcher.event(CommonEventType.DAW_TiXian_updataList);
    }
    public get TiXianSelect() {
        return this._TiXianSelect;
    }

}

