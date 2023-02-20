/**
 * name
 */


///<reference path="create_role_ctrl.ts"/>
///<reference path="../common/btn_group.ts"/>
///<reference path="../chat/chat_model.ts"/>


module modules.createRole {
    import erorr_codeFields = Configuration.erorr_codeFields;
    import BtnGroup = modules.common.BtnGroup;
    import ErrorCodeCfg = modules.config.ErrorCodeCfg;
    // import AvatarClip = modules.common.AvatarClip;
    import LayaEvent = modules.common.LayaEvent;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    const enum NameType {
        Family = 0,
        Symbol = 1,
        ManPrefix = 2,
        WomanPrefix = 3,
        ManSuffix = 4,
        WomanSuffix = 5,
    }

    export class CreateRolePanel extends ui.CreateRoleViewUI {
        private _btnGroup: BtnGroup;
        private _sex: number;

        private _time: number;

        private _isPause: boolean;

        //姓
        private _familyNames: Array<string>;
        //符号
        private _symbols: Array<string>;
        //男前缀
        private _manPrefix: Array<string>;
        //女前缀
        private _womanPrefix: Array<string>;
        //男后缀
        private _manSuffix: Array<string>;
        //女后缀
        private _womanSuffix: Array<string>;
        // 通用前缀
        private _commonPrefix: Array<string>;

        private _manLastName: string;
        private _womanLastName: string;
        private _isAuto: boolean;
        private _skeleAvatar: SkeletonAvatar;


        constructor() {
            super();
            this._manLastName = "";
            this._womanLastName = "";
        }

        protected initialize(): void {
            super.initialize();
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.maleBtn, this.femaleBtn);

            this.centerX = 0;
            this.centerY = 0;

            this._isPause = false;
            this._isAuto = true;

            // 创角龙骨
            this._skeleAvatar = SkeletonAvatar.createShow(this, this);
            this._skeleAvatar.pos(378, 872, true);


            // let nameLibrary = GlobalData.getConfig("name_library");
            this._familyNames = nameGenerator.familyNames;//ArrayUtils.disturb(nameLibrary[NameType.Family][NameLibraryFields.names]);
            this._symbols = nameGenerator.symbols;//ArrayUtils.disturb(nameLibrary[NameType.Symbol][NameLibraryFields.names]);
            this._manPrefix = nameGenerator.manPrefix;//ArrayUtils.disturb(nameLibrary[NameType.ManPrefix][NameLibraryFields.names]);
            this._manSuffix = nameGenerator.manSuffix;//ArrayUtils.disturb(nameLibrary[NameType.ManSuffix][NameLibraryFields.names]);
            this._womanPrefix = nameGenerator.womanPrefix;//ArrayUtils.disturb(nameLibrary[NameType.WomanPrefix][NameLibraryFields.names]);
            this._womanSuffix = nameGenerator.womanSuffix;//ArrayUtils.disturb(nameLibrary[NameType.WomanSuffix][NameLibraryFields.names]);
            this._commonPrefix = nameGenerator.commonPrefix;

        }

        protected addListeners(): void {
            this.addAutoListener(this.enterBtn, LayaEvent.CLICK, this, this.enterClickHandler);
            this.addAutoListener(this.randomNameBtn, LayaEvent.CLICK, this, this.randomNameHandler);
            this.addAutoListener(this._btnGroup, LayaEvent.CHANGE, this, this.sexChangeHandler);
            this.addAutoListener(this.nameTxt, LayaEvent.FOCUS, this, this.focusHandler);
            this.addAutoListener(this.nameTxt, LayaEvent.BLUR, this, this.blurHandler);
            this.addAutoListener(this.nameTxt, LayaEvent.INPUT, this, this.inputHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CREATE_ROLE_FAIL, this, this.failHandler);
        }

        protected onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 1;

            this._time = 20;
            Laya.timer.loop(1000, this, this.loopHandler);
            this.loopHandler();

            this.randomNameHandler();
            this.errorTxt.visible = false;
            Browser.container.setAttribute("style", "visibility: visible;");
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.loopHandler);
        }

        private sexChangeHandler(): void {
            let sex = this._btnGroup.selectedIndex === 0 ? OccType.Man : OccType.Woman;
            this.txtImg.skin = this._btnGroup.selectedIndex === 0 ? "create_role/txt_nan.png" : "create_role/txt_nv.png";
            if (this._sex == sex) {
                return;
            }
            this._sex = sex;
            if (this._isAuto) {
                if (this._sex === OccType.Man) {
                    if (this._manLastName == "") {
                        this.randomNameHandler();
                    } else {
                        this.nameTxt.text = this._manLastName;
                    }
                } else {
                    if (this._womanLastName == "") {
                        this.randomNameHandler();
                    } else {
                        this.nameTxt.text = this._womanLastName;
                    }
                }
            }
            this.showAnimation();
            this.resetTimer();
        }

        private inputHandler(): void {
            this.resetTimer();
            this.errorTxt.visible = false;
            this._isAuto = false;
        }

        private failHandler(result: number): void {
            if (this._isAuto && result == ErrorCode.IsExistName) {
                this.randomNameHandler();
                this.enterClickHandler();
            } else {
                this.enterBtn.mouseEnabled = true;
                this.errorTxt.visible = true;
                let tuple = ErrorCodeCfg.instance.getErrorCfgById(result);
                this.errorTxt.text = tuple ? tuple[erorr_codeFields.msg_ZN] : `错误：${result}`;
            }
        }

        private enterClickHandler(): void {
            let name: string = this.nameTxt.text;
            if (!name) {
                this.errorTxt.visible = true;
                this.errorTxt.text = "名字不能为空";
                return;
            } else if (StringUtils.containSpace(name)) {
                this.errorTxt.visible = true;
                this.errorTxt.text = "名字不能包含空格";
                return;
            } else if (name.length < 1 || name.length > 6) {
                this.errorTxt.visible = true;
                this.errorTxt.text = "名字长度为1~6个字";
                return;
            } else if (!StringUtils.isValidWords(name)) {
                this.errorTxt.visible = true;
                this.errorTxt.text = "包含非法字符";
                return;
            }
            this.enterBtn.mouseEnabled = false;
            CreateRoleCtrl.instance.actorLogin(name, this._sex);
        }

        private randomNameHandler(): string {
            this.resetTimer();
            this._isAuto = true;
            this.errorTxt.visible = false;

            let result;
            if (Math.random() >= 0.5) {
                result = `${ArrayUtils.random(this._familyNames)}${ArrayUtils.random(this._sex === OccType.Man ? this._manSuffix : this._womanSuffix)}`;
            } else {
                let prefix: Array<string> = this._sex === OccType.Man ? this._manPrefix : this._womanPrefix;
                let randomIndex: number = Math.floor(Math.random() * (this._commonPrefix.length + prefix.length));
                result = `${randomIndex >= this._commonPrefix.length ? prefix[randomIndex - this._commonPrefix.length] : this._commonPrefix[randomIndex]}${ArrayUtils.random(this._symbols)}${ArrayUtils.random(this._sex === OccType.Man ? this._manSuffix : this._womanSuffix)}`;
            }
            this.nameTxt.text = result;

            if (this._sex === OccType.Man) {
                this._manLastName = result;
            } else {
                this._womanLastName = result;
            }

            return result;
        }

        private focusHandler(): void {
            // this.resetTimer();
            this.nameTxt.select();
            this._isPause = true;
        }

        private blurHandler(): void {
            this._isPause = false;
        }

        private resetTimer(): void {
            this.tipTxt.visible = true;
            this._time = 20;
            Laya.timer.clear(this, this.loopHandler);
            Laya.timer.loop(1000, this, this.loopHandler);
            this.loopHandler();
        }

        private loopHandler(): void {
            if (!this._isAuto || this._isPause) return;
            this.tipTxt.text = `${this._time}秒后进入游戏`;
            if (this._time === 0) {
                this.tipTxt.visible = false;
                Laya.timer.clear(this, this.loopHandler);
                this.enterClickHandler();
            }
            this._time--;
        }


        private showAnimation(): void {

            if (this._sex === OccType.Man) {
                this._skeleAvatar.resetOffset(AvatarAniBigType.weapon, 0, -15)
                this._skeleAvatar.reset(1001, 5001, -1, -1, -1, -1);
                this._skeleAvatar.resetScale(AvatarAniBigType.clothes, 1.2);
            } else {
                this._skeleAvatar.resetOffset(AvatarAniBigType.weapon, 0, -25)
                this._skeleAvatar.reset(1002, 5001, -1, -1, -1, -1);
                this._skeleAvatar.resetScale(AvatarAniBigType.clothes, 1.2);
            }
        }
    }
}