/*活动列表*/
///<reference path="../config/designation_cfg.ts"/>
namespace modules.player_title {
    import CustomList = modules.common.CustomList;
    import Event = Laya.Event;
    import BtnGroup = modules.common.BtnGroup;
    import GameCenter = game.GameCenter;
    import DesignationCfg = modules.config.DesignationCfg;
    import designation = Configuration.designation;
    import designationFields = Configuration.designationFields;
    // import AvatarClip = modules.common.AvatarClip;
    import DesignationInfo = Protocols.Designation;
    import DesignationInfoFields = Protocols.DesignationFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BagModel = modules.bag.BagModel;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    /*类型*/
    const enum titleType {
        null = 0,	/*占位*/
        ranking = 1,	/*排行*/
        chengjiu,		/*成就*/
        special		    /*特殊*/
    }
    const titleName = ['', '成就', '排行', '特殊'];

    export class PlayerTitlePanel extends ui.PlayerTitleViewUI {
        private _list: CustomList;
        private _activityAllArray: Array<designation>;
        private _activityAllStateArray: Array<number>;
        private _btnGroup: BtnGroup;
        // private _avatarClip: AvatarClip;
        private _skeletonClip: SkeletonAvatar;
        private _nameTextArry: Array<Laya.Text>;
        private _designationProtocolsDate: DesignationInfo;//服务器数据
        private _curDesignDate: designation;//当前选择的数据



        private static _instance: PlayerTitlePanel;
        public static get instance(): PlayerTitlePanel {
            return this._instance = this._instance || new PlayerTitlePanel();
        }

        constructor() {
            super()
            PlayerTitlePanel._instance = this;
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._list = new CustomList();
            this._list.width = 244;
            this._list.height = 740;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.spaceY = 1;
            this._list.itemRender = PlayerTitleNewItem;
            this._list.x = 17;
            this._list.y = 201;
            this._list.zOrder = 2;
            this.addChildAt(this._list, 1);
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.titleTypeBtn1, this.titleTypeBtn2, this.titleTypeBtn3);

            this._nameTextArry = [
                this.nameText1, this.valueText1,
                this.nameText2, this.valueText2,
                this.nameText3, this.valueText3,
                this.nameText4, this.valueText4,
                this.nameText5, this.valueText5,
                this.nameText6, this.valueText6,
            ];

            // this._avatarClip = AvatarClip.create(1200, 1200, 850);
            // this.addChildAt(this._avatarClip, 1);
            // this._avatarClip.pos(490, 670, true);
            // this._avatarClip.anchorX = 0.5;
            // this._avatarClip.anchorY = 0.5;
            // this._avatarClip.zOrder = 1;
            // this._avatarClip.visible = false;
            // this._avatarClip.mouseEnabled = true;
            // this._avatarClip.avatarRotationY = 190;


            // 2D: 横版2D代码片段,加载2D龙骨资源!
            this._skeletonClip = SkeletonAvatar.createShow(this, this, 1);
            this._skeletonClip.pos(500, 670, true);
            this._skeletonClip.scale(0.8, 0.8, true);
        }

        public onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 0;
            this.titleTypeBtn2.disabled = true;
            this.updatRp();
            this.updateList();
            PlayerTitleCtrl.instance.GetDesignation();


            let role = GameCenter.instance.getRole(PlayerModel.instance.actorId);
            if (role) {
                let shuju: Array<number> = role.property.get("exterior");
                // this._avatarClip.reset(shuju[0], shuju[1], shuju[2], 0, 0, shuju[5]);
                this._skeletonClip.reset(shuju[0], shuju[1], shuju[2], 0, 0, shuju[5]);
                
                this._skeletonClip.resetScale(AvatarAniBigType.tianZhu, 0.2);
                this._skeletonClip.resetOffset(AvatarAniBigType.tianZhu, -110, 330);
                this._skeletonClip.resetOffset(AvatarAniBigType.wing, -100, -30);
            }
        }

        public close(): void {
            super.close();

            PlayerTitleModel.instance.nowTitleData = null;
            this.AllBtn.disabled = true;
            this.conditionTxt.text = "";
            this.titleImg.skin = "";
            for (let index = 0; index < this._nameTextArry.length; index++) {
                let element = this._nameTextArry[index];
                element.visible = false;
            }
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }
            // if (this._avatarClip) {
            //     this._avatarClip.removeSelf();
            //     this._avatarClip.destroy();
            //     this._avatarClip = null;
            // }
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            super.destroy(destroyChild);
        }

        protected addListeners(): void {
            super.addListeners();
            this._btnGroup.on(Event.CHANGE, this, this.changeHandler);
            this.AllBtn.on(Event.CLICK, this, this.AllBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_TITLE_OPENUPDATE, this, this.updateOpenList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_TITLE_UPDATE, this, this.updatRp);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_TITLE_NOW_REFRESH, this, this.updatNowTitle);

        }

        protected removeListeners(): void {
            super.removeListeners();
            this._btnGroup.on(Event.CHANGE, this, this.changeHandler);
            this.AllBtn.on(Event.CHANGE, this, this.AllBtnHandler);
            Laya.timer.clear(this, this.loopHandler);
        }

        private _addNotice(condition) {
            if (condition) {
                SystemNoticeManager.instance.addNotice(condition, true);
            } else {
                SystemNoticeManager.instance.addNotice("条件不满足", true);
            }
        }

        private AllBtnHandler(): void {
            let designationDate: designation = PlayerTitleModel.instance.nowTitleData;
            let designationProtocolsDate = PlayerTitleModel.instance.AllDate[designationDate[designationFields.id]];
            let condition = designationDate[designationFields.condition];
            if (!designationDate) {
                return;
            }
            if (!designationProtocolsDate) {
                this._addNotice(condition);
                return;
            }
            let state = designationProtocolsDate[DesignationInfoFields.state];
            let id = designationDate[designationFields.id];
            // 未激活状态如果本地有道具则为可激活
            // state = this.reSetAndGetStatus(state, designationFields.node)
            //称号状态 1:未激活 2:可激活 3:已激活 4:穿戴中
            switch (state) {
                case 1:
                    this._addNotice(condition);
                    break;
                case 2:
                    PlayerTitleCtrl.instance.ActiveDesignation(id);
                    break;
                case 3:
                    PlayerTitleCtrl.instance.WearDesignation(id);
                    break;
                case 4:
                    PlayerTitleCtrl.instance.TakeoffDesignation(id);
                    break;
                default:
                    break;
            }
        }

        // 未激活状态如果本地有道具则为可激活
        private reSetAndGetStatus(state, data) {
            if (data == null) return state;
            switch (data[0]) {
                case 26:
                    let id: number = data[1][0];
                    let count: number = BagModel.instance.getItemCountById(id);
                    if (count >= 1) {
                        return 2;
                    }
                    break;
            }
        }

        private changeHandler(): void {
            this._activityAllArray = DesignationCfg.instance.getCfgByType(this._btnGroup.selectedIndex + 1);
            console.log("切换：", this._btnGroup.selectedIndex);

            this.updateList();
        }

        //这里不注册红点是因为 可能要根据表 动态增加按钮
        public updatRp() {
            this.RpImg1.visible = PlayerTitleModel.instance.isRpOfType(titleType.ranking);
            this.RpImg2.visible = PlayerTitleModel.instance.isRpOfType(titleType.chengjiu);
            this.RpImg3.visible = PlayerTitleModel.instance.isRpOfType(titleType.special);
            let getAtkNum = PlayerTitleModel.instance.getAtkNum();
            this.atkMsz.value = `${getAtkNum}`;

            this.titleTypeBtn1.label = this.getJinDu(titleType.ranking);
            this.titleTypeBtn2.label = this.getJinDu(titleType.chengjiu);
            this.titleTypeBtn3.label = this.getJinDu(titleType.special);
        }

        //当前称号数据刷新 0-刷新，1-穿戴 2-卸下
        public updatNowTitle(type: number = 0) {
            this.AllBtn.disabled = false;
            if (type == 1) {
                this.AllBtn.label = "卸下"
                return;
            } else if (type == 2) {
                this.AllBtn.label = "穿戴"
                return;
            }
            Laya.timer.clear(this, this.loopHandler);
            let designationDate: designation = PlayerTitleModel.instance.nowTitleData;
            let attrTips = designationDate[designationFields.attrTips];
            this._curDesignDate = designationDate;
            this._designationProtocolsDate = PlayerTitleModel.instance.AllDate[designationDate[designationFields.id]];
            if (this._designationProtocolsDate == null) {
                this._designationProtocolsDate = [designationDate[designationFields.id], 1, 0, 0, 4];
            }
            let state = this._designationProtocolsDate[DesignationInfoFields.state];
            let src = designationDate[designationFields.src];
            // 称号
            this.titleImg.skin = `assets/icon/ui/designation/${src}.png`;
            this.conditionTxt.text = designationDate[designationFields.condition];

            this.upLevelBtn.visible = false; //designationDate[designationFields.type] == 3;
            // if (this.upLevelBtn.visible) {
            //     this.levelUpCostImg.skin = `assets/icon/ui/designation/up/${designationDate[designationFields.src]}.png`;
            // }
            this.setArr(attrTips);

            // 按钮显示文字 
            // 称号状态 1:未激活 2:可激活 3:已激活 4:穿戴中
            switch (state) {
                case 1: this.AllBtn.label = "激活"; break;
                case 2: break;
                case 3: this.AllBtn.label = "穿戴"; break;
                case 4: this.AllBtn.label = "卸下"; break;
            }
            this.timeText3.visible = state != 1;
            let limitTime = designationDate[designationFields.limitTime];
            // 过期时间
            if (limitTime == 0) {
                this.timeText3.text = "过期时间:永久有效";
            } else {
                this.loopHandler();
                Laya.timer.loop(1000, this, this.loopHandler);
            }
        }
        private loopHandler(): void {
            if (!this._designationProtocolsDate) {
                return;
            }
            let endTime = this._designationProtocolsDate[DesignationInfoFields.endTime];
            let str = this.timeStampToMMSS(endTime)[0];
            let str1 = this.timeStampToMMSS(endTime)[1];
            let str2 = this.timeStampToMMSS(endTime)[2];
            str = str == 0 ? 1 : str;
            if (str === 0 && str1 === 0 && str2 === 0) {
                Laya.timer.clear(this, this.loopHandler);
                this.timeText3.text = `过期时间:${0}天`;
                return;
            }
            this.timeText3.text = `过期时间:${str}天`;
        }

        public timeStampToMMSS(ms: number): Array<int> {
            let str: Array<int> = [0, 0, 0];
            let offset: number = ms - GlobalData.serverTime;

            if (offset <= 0) {
                str = [0, 0, 0];
            } else {
                let sec: int = offset * 0.001 >> 0;
                let minute: int = sec / 60 >> 0;
                let hour: int = minute / 60 >> 0;
                let day: int = hour / 24 >> 0;
                sec = sec % 60;
                minute = minute % 60;
                hour = hour % 24;
                // str = day + "天" + hour + "时" + minute + "分";
                str = [day, hour, minute];
            }
            return str;
        }
        /**
        * 设置属性 
        */
        public setArr(attrTips: any) {
            if (attrTips) {
                for (let index = 0; index < this._nameTextArry.length; index++) {
                    let element = this._nameTextArry[index];
                    element.visible = false;
                }
                for (let index = 0; index < attrTips.length; index++) {
                    let element = attrTips[index];
                    if (this._nameTextArry[index]) {
                        this._nameTextArry[index].text = element;
                        this._nameTextArry[index].visible = true;
                    }
                }
            }
        }

        /**
         * getJinDu
         */
        public getJinDu(type: number): string {
            let jindu = PlayerTitleModel.instance.getJjinDu(type);
            let str = "称号0/0";
            if (jindu) {
                str = `${titleName[type]}(${jindu[0]}/${jindu[1]})`;
            }
            return str;
        }

        /**
         * 展开或者收缩 称号属性时 刷新list
         */
        public updateOpenList() {
            //这个不刷新数据  只刷新 list 排版
            this._list.relayout();
        }

        //排序
        private overSort(A: designation, B: designation): number {
            let A_state = PlayerTitleModel.instance.getState(A);
            let B_state = PlayerTitleModel.instance.getState(B);

            let A_sortID = A[designationFields.id];
            let B_sortID = B[designationFields.id];
            let returnNum = 1;
            if (A_state == B_state) {
                A_sortID < B_sortID ? returnNum = -1 : returnNum = 1;
            } else {
                A_state > B_state ? returnNum = -1 : returnNum = 1;
            }
            return returnNum;
        };

        private updateList(): void {
            if (this._activityAllArray == undefined) {
                return;
            }
            if (this._activityAllArray.length > 0) {
                this._activityAllArray.sort(this.overSort);
                this._list.datas = this._activityAllArray;
            } else {

            }
        }
    }
}