///<reference path="../red_point/red_point_ctrl.ts"/>


/** 底部切页*/


namespace modules.bottomTab {
    import action_openFields = Configuration.action_openFields;
    import Event = Laya.Event;
    import Handler = Laya.Handler;
    import Image = Laya.Image;
    import BtnGroup = modules.common.BtnGroup;
    import ActionOpenCfg = modules.config.ActionOpenCfg;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import TabInfo = ui.TabInfo;
    import TabInfoFields = ui.TabInfoFields;
    import WindowInfoFields = ui.WindowInfoFields;
    import RedPointProperty = ui.RedPointProperty;
    import Panel = Laya.Panel;
    import Sprite = Laya.Sprite;
    import Rectangle = Laya.Rectangle;
    import GuideModel = modules.guide.GuideModel;

    export class BottomTab extends Panel {
        private static _instance: BottomTab;
        public static get instance(): BottomTab {
            return this._instance = this._instance || new BottomTab();
        }


        private _btnGroup: BtnGroup;
        private _bgs: Array<Image>;
        private _imgs: Array<Image>;
        private _dotArr: Array<Image>;
        private _panelIdsArr: Array<Array<WindowEnum>>;
        private _iconDir: string;

        private _skin: string;
        private _selectedSkin: string;

        private _tabInfo: TabInfo;
        private _panelId: WindowEnum;
        private _tab: Table<int>;

        // private _panel:Panel;
        private _con: Sprite;
        private _lastX: number;
        private _w: number;

        constructor() {
            if (BottomTab._instance) {
                throw new Error("重复构造");
            }
            super();

            this.width = 680;
            this.height = 136;
            this.centerX = 0;

            this._dotArr = new Array<Image>();

            this._skin = "0.png";
            this._selectedSkin = "1.png";
            this._iconDir = "assets/others/tab/";
            this._btnGroup = new BtnGroup();
            this._btnGroup.on(Event.CHANGE, this, this.selectedHandler);
            this._btnGroup.canSelectHandler = Handler.create(this, this.canSelectHandler, null, false);

            this._bgs = new Array<Image>();
            this._imgs = new Array<Image>();

            this.on(Event.DISPLAY, this, this.displayHandler);
            this.on(Event.UNDISPLAY, this, this.undisplayHandler);

            // this._panel = new Panel();
            // this.addChild(this._panel);
            // this._panel.size(500, 136);

            this._con = new Sprite();
            this.addChild(this._con);
            this._con.height = 136;
            this._w = 550;
            this._con.scrollRect = new Rectangle(0, 0, this._w, 136);
        }

        private displayHandler(): void {
            if (!this._tabInfo) return;
            // let rps: Array<Array<keyof RedPointProperty>> = this._tabInfo[TabInfoFields.redPointPros];
            // for (let i: int = 0, len: int = rps.length; i < len; i++) {
            //     if (rps[i] && rps[i].length > 0) {
            //         RedPointCtrl.instance.registeRedPoint(this._dotArr[i], rps[i]);
            //     }
            // }
            this._con.on(Event.MOUSE_DOWN, this, this.downHandler);
            this._con.on(Event.MOUSE_WHEEL, this, this.wheelHandler);
        }

        private undisplayHandler(): void {
            if (!this._tabInfo) return;
            for (let i: int = 0, len: int = this._dotArr.length; i < len; i++) {
                RedPointCtrl.instance.retireRedPoint(this._dotArr[i]);
            }

            this._con.off(Event.MOUSE_DOWN, this, this.downHandler);
            this._con.off(Event.MOUSE_WHEEL, this, this.wheelHandler);

            // if (this._bgs && this._bgs.length > 0) {
            //     for (let i: int = 0, len: int = this._bgs.length; i < len; i++) {
            //         this._bgs[i].removeSelf();
            //         this._imgs[i].skin = "";
            //         this._imgs[i].removeSelf();
            //         this._dotArr[i].removeSelf();
            //     }
            // }

            GuideModel.instance.removeUI(GuideSpriteId.TALISMAN_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.MAGIC_WEAPON_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.MAGIC_PET_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.INTENSIVE_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.STONE_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.BAG_SMELT_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.BORN_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.SINGLE_DUNGEON_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.MULTI_DUNGEON_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.THIS_SERVER_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.OTHER_SERVER_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.EXERCISE_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.ACTIVITY_ALL_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.DAILY_DEMON_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.ADVENTURE_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.ADVENTURE_SHOP_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.TREASURE_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.TREASURE_BAG_TAB_BTN);
            GuideModel.instance.removeUI(GuideSpriteId.TREASURE_CHANGE_TAB_BTN);
        }

        public get selectedIndex(): int {
            return this._btnGroup.selectedIndex;
        }

        public set selectedIndex(value: int) {
            this._btnGroup.selectedIndex = value;
            this._panelId = 0;
        }

        public get imgs(): Array<Image> {
            return this._imgs;
        }

        public get panelId(): WindowEnum {
            return this._panelId;
        }

        public set panelId(value: WindowEnum) {
            this._panelId = value;
        }

        public set tabInfo(value: TabInfo) {
            this.scrollConTo(0);
            // if (this._tabInfo === value) return;
            if (!value) return;
            this._tabInfo = value;
            this.setPanels(value[TabInfoFields.panelIdsArr]);
        }
        private setPanels(panelIdsArr: Array<Array<WindowEnum>>) {
            this._panelId = 0;
            if (this._bgs && this._bgs.length > 0) {
                for (let i: int = 0, len: int = this._bgs.length; i < len; i++) {
                    this._bgs[i].removeSelf();
                    this._imgs[i].skin = "";
                    this._imgs[i].removeSelf();
                    this._dotArr[i].removeSelf();
                }
            }
            this._panelIdsArr = panelIdsArr;
            let img: Image;
            let bg: Image;
            let rps: Array<Array<Array<keyof RedPointProperty>>> = this._tabInfo[TabInfoFields.redPointPros];
            let index: int = 0;
            this._tab = {};
            for (let i: int = 0, len: int = this._panelIdsArr.length; i < len; i++) {
                // 已经关闭的面板不添加到切页里
                let arr: Array<WindowEnum> = panelIdsArr[i];
                let flag: boolean = true;
                for (let j: int = 0, len1: int = arr.length; j < len1; j++) {
                    // console.log(arr)
                    if (!this.isFuncClose(arr[j])) {
                        flag = false;
                        break;
                    }
                }
                if (flag) continue;
                if (this._imgs.length > index) {
                    img = this._imgs[index];
                    bg = this._bgs[index];
                } else {

                    img = new Image();
                    img[GlobalSecondEffectBtnTag.BTN_KEY] = GlobalSecondEffectBtnTag.BTN_VALUE;
                    this._imgs.push(img);
                    img.anchorX = img.anchorY = 0.5;
                    img.pos(55 + index * 114, 53, true);
                    bg = new Image();
                    bg[GlobalSecondEffectBtnTag.BTN_KEY] = GlobalSecondEffectBtnTag.BTN_VALUE;
                    this._bgs.push(bg);
                    bg.pos(0 + index * 114, 0, true);

                    this._dotArr[index] = new Image("common/image_common_xhd.png");
                    this._dotArr[index].anchorX = 0.5;
                    this._dotArr[index].anchorY = 0.5;
                    this._dotArr[index].pos((index + 1) * 114 - 20, 18);
                }
                bg.skin = "bottom_tab/btn_common_yqbg_0.png";
                this._con.addChild(bg);
                this._con.addChild(img);
                // //如果是全民狂欢  特殊处理
                if (this._tabInfo[TabInfoFields.funcId] === ActionOpenId.kuanghuan) {
                    if (i === 1) {
                        let str = modules.kuanghuan.KuangHuanModel.instance.getType();
                        this._tabInfo[TabInfoFields.icons][i] = str;
                    }
                    // else if (i === 0) {
                    //     this._tabInfo[TabInfoFields.icons][i] = modules.kuanghuan.KuangHuanModel.instance.getType(1);
                    // }
                } else if ((this._tabInfo[TabInfoFields.funcId] === ActionOpenId.zhuanPanEnter)) {
                    if (i === 1) {
                        let type = modules.rotary_table_soraing.RotaryTableSoaringModel.instance.type;
                        if (type == 0) {
                            this._tabInfo[TabInfoFields.icons][i] = `image_common_cbdb_`;
                        } else {
                            this._tabInfo[TabInfoFields.icons][i] = `image_common_fsdb_`;
                        }
                    }
                }
                else if ((this._tabInfo[TabInfoFields.funcId] === ActionOpenId.xunbao)) {
                    if (i === 1) {
                        if (bg) {
                            Laya.Point.TEMP.setTo(bg.width / 2, bg.height / 2);
                            let pos1 = bg.localToGlobal(Laya.Point.TEMP, true);
                            // console.log("pos1: ", pos1);
                            modules.action_preview.actionPreviewModel.instance._posSprite.set(specialAniPoin.xunBaoCangKu, bg);
                        }
                    }
                }
                img.skin = this._iconDir + this._tabInfo[TabInfoFields.icons][i] + this._skin;
                // img.mouseEnabled = true;
                // ----------生成的红点设置
                this._con.addChild(this._dotArr[index]);
                this._dotArr[index].visible = false;

                if (rps[i] && rps[i].length > 0) {
                    let arr: Array<keyof RedPointProperty> = [];
                    for (let j: int = 0, len1: int = rps[i].length; j < len1; j++) {
                        arr = arr.concat(rps[i][j]);
                    }
                    RedPointCtrl.instance.registeRedPoint(this._dotArr[index], arr);
                }
                this._tab[index] = i;
                index++;

                // 引导
                // 圣物切页
                if (arr.indexOf(WindowEnum.TALISMAN_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.TALISMAN_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.MAGIC_WEAPON_FEED_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.MAGIC_WEAPON_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.MAGIC_PET_FEED_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.MAGIC_PET_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.INTENSIVE_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.INTENSIVE_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.STONE_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.STONE_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.SMELT_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.BAG_SMELT_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.BORN_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.BORN_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.BIG_TOWER) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.SINGLE_DUNGEON_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.TEAM_BATTLE_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.MULTI_DUNGEON_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.SINGLE_BOSS_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.THIS_SERVER_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.THREE_WORLDS_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.OTHER_SERVER_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.EXERCISE_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.EXERCISE_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.ACTIVITY_ALL_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.ACTIVITY_ALL_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.DAILY_DEMON_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.DAILY_DEMON_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.ADVENTURE_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.ADVENTURE_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.ADVENTURE_SHOP_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.ADVENTURE_SHOP_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.TREASURE_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.TREASURE_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.TREASURE_BAG_PANEL) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.TREASURE_BAG_TAB_BTN, bg);
                } else if (arr.indexOf(WindowEnum.TREASURE_CHANGE) !== -1) {
                    GuideModel.instance.registeUI(GuideSpriteId.TREASURE_CHANGE_TAB_BTN, bg);
                }
            }
            this._con.width = index === 0 ? 0 : index * 114 - 4;
            this._btnGroup.setBtns(...this._bgs);
        }


        private canSelectHandler(value: number): boolean {
            let realIndex: int = this._tab[value];
            let panelIds: Array<number> = this._tabInfo[TabInfoFields.panelIdsArr][realIndex];
            if (!panelIds || panelIds.length === 0) return false;
            let flag: boolean = false;
            if (panelIds.indexOf(this._panelId) !== -1) {
                return true;
            }
            // 检测切页对应的所有面板的功能是否开启，默认打开功能开启有红点排在最前的面板
            let tPanelId: number = -1;        // 功能开启但没红点的面板
            let redPanel: number = -1;       // 功能开启且有红点的面板
            for (let i: int = 0, len: int = panelIds.length; i < len; i++) {
                let panelId: WindowEnum = panelIds[i];
                if (this.isFuncOpen(panelId)) {
                    flag = true;
                    let rps: Array<keyof RedPointProperty> = BottomTabConfig.instance.getRpsByPanelId(panelId);
                    if (rps && rps.length > 0) {
                        for (let k: int = 0, len2: int = rps.length; k < len2; k++) {
                            if (RedPointCtrl.instance.getRPProperty(rps[k])) {
                                redPanel = panelId;
                                break;
                            }
                        }
                    }
                    if (redPanel !== -1) {
                        this._panelId = redPanel;
                        break;
                    }
                    if (tPanelId === -1) {
                        tPanelId = panelId;
                        this._panelId = panelId;
                    }
                }
            }

            // 都没开启时取此切页对应的功能条件提示
            if (!flag && this._tabInfo[TabInfoFields.funcId] !== ActionOpenId.begin) {
                let arr: Array<number> = ActionOpenCfg.instance.getCfgById(this._tabInfo[TabInfoFields.funcId])[action_openFields.subfunctions];
                let tipsLet = FuncOpenModel.instance.getFuncOpenTipById(arr[realIndex + 1]);
                if (tipsLet) {
                    SystemNoticeManager.instance.addNotice(tipsLet, true);
                } else {
                    SystemNoticeManager.instance.addNotice("已结束", true);
                }
            }
            return flag;
        }

        // 功能是否未开启
        private isFuncOpen(panelId: WindowEnum): boolean {
            let flag: boolean = true;
            let funcId: number = WindowManager.instance.getWindowConfigById(panelId)[WindowInfoFields.funcId];
            if (funcId !== ActionOpenId.begin) {
                if (!FuncOpenModel.instance.getFuncIsOpen(funcId)) {
                    flag = false;
                }
                // else if (funcState === ActionOpenState.close) {
                //     flag = false;
                //     SystemNoticeManager.instance.addNotice("活动已经结束", true);
                //     // let tipsLet = action_openLet[action_openFields.tips];
                //     // SystemNoticeManager.instance.addNotice(tipsLet, true);
                // }
            }
            return flag;
        }

        // 功能是否关闭
        private isFuncClose(panelId: WindowEnum): boolean {
            let flag: boolean = false;
            let funcId: number = WindowManager.instance.getWindowConfigById(panelId)[WindowInfoFields.funcId];
            // console.log("funcId", funcId, FuncOpenModel.instance.getFuncNeedShow(funcId))
            if (!FuncOpenModel.instance.getFuncNeedShow(funcId)) {
                flag = true;
            }
            return flag;
        }

        private lastIndex:number;

        private selectedHandler(): void {
            if (this._panelId == WindowEnum.VIP_PANEL) {
                if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.vip)) {
                    if (modules.vip_new.VipNewModel.instance.getVipLevelTrue() < 10 && modules.vip.VipModel.instance.vipLevel < 1) {
                        SystemNoticeManager.instance.addNotice("VIP10开启SVIP功能", true);
                        return;
                    }
                }
            }

            let index: int = this._btnGroup.btns.indexOf(this._btnGroup.oldSelectedBtn);

            let bg: Image = this._bgs[index];
            let img: Image = this._imgs[index];

            if (img && img.parent) {
                bg.skin = "bottom_tab/btn_common_yqbg_0.png";
                img.skin = this._iconDir + this._tabInfo[TabInfoFields.icons][this._tab[index]] + this._skin;
            }

            index = this._btnGroup.selectedIndex;
            bg = this._bgs[index];
            img = this._imgs[index];
            if (img) {
                bg.skin = "bottom_tab/btn_common_yqbg_1.png";
                img.skin = this._iconDir + this._tabInfo[TabInfoFields.icons][this._tab[index]] + this._selectedSkin;
                if (this.lastIndex !== index) {
                    this.scaleExpand(img);
                }
                this.lastIndex = index;
            }
            this.event(Event.CHANGE);
            if (!this._tabInfo) return;
            if (this._panelId !== 0) {
                if (!WindowManager.instance.isOpened(this._panelId)) {
                    WindowManager.instance.open(this._panelId);
                }
            }
            this.scrollConTo(index * 114 - 275);
        }

        private scaleExpand(img: Image) {
            TweenJS.create(img).to({ scaleX: 1.1, scaleY: 1.1 }, 80)
                .easing(utils.tween.easing.circular.InOut)
                .onComplete((): void => {
                    TweenJS.create(img).to({ scaleX: 1, scaleY: 1 }, 80)
                        .easing(utils.tween.easing.circular.InOut)
                        .start()
                }).start()
        }

        private downHandler(): void {
            this._lastX = this._con.mouseX;
            Laya.stage.on(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.on(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.on(Event.MOUSE_OUT, this, this.upHandler);
        }

        private wheelHandler(e: Event): void {
            let offsetX: number = e.delta * -8;
            this.scrollX(offsetX);
        }

        private moveHandler(): void {
            let offsetX: number = this._lastX - this._con.mouseX;
            this.scrollX(offsetX);
            this._lastX = this._con.mouseX;
        }

        private upHandler(): void {
            Laya.stage.off(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.off(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.off(Event.MOUSE_OUT, this, this.upHandler);
        }

        private scrollX(offsetX: number): void {
            if (this._con.width < this._w) return;
            let rect: Rectangle = this._con.scrollRect;
            rect.x = rect.x + offsetX;
            if (rect.x < 0) rect.x = 0;
            else if (rect.x > this._con.width - this._w) {
                rect.x = this._con.width - this._w;
            }
            this._con.scrollRect = rect;
        }

        private scrollConTo(value: number): void {
            if (this._con.width < this._w) return;
            let rect: Rectangle = this._con.scrollRect;
            rect.x = value;
            if (rect.x < 0) rect.x = 0;
            else if (rect.x > this._con.width - this._w) {
                rect.x = this._con.width - this._w;
            }
            this._con.scrollRect = rect;
        }

        public destroy(destroyChild?: boolean): void {
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }

            if (this._bgs) {
                for (let e of this._bgs) {
                    e.destroy(true);
                }
                this._bgs = null;
            }

            if (this._imgs) {
                for (let e of this._imgs) {
                    e.destroy(true);
                }
                this._imgs = null;
            }

            if (this._dotArr) {
                for (let e of this._dotArr) {
                    e.destroy(true);
                }
                this._dotArr = null;
            }

            super.destroy(destroyChild);
        }
    }
}