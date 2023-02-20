///<reference path="../config/xianfu_animal_cfg.ts"/>
///<reference path="../config/scene_homestead_cfg.ts"/>
/** 仙府-家园左下面板 */
namespace modules.xianfu {
    import XianfuLeftBottomViewUI = ui.XianfuLeftBottomViewUI;
    import Event = Laya.Event;
    import XianfuAnimalCfg = modules.config.XianfuAnimalCfg;
    import NpcCtrl = modules.npc.NpcCtrl;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import XianfuCfg = modules.config.XianfuCfg;
    import xianfuFields = Configuration.xianfuFields;
    import SwitchSceneCtrl = modules.scene.SwitchSceneCtrl;
    import GameCenter = game.GameCenter;
    import CustomClip = modules.common.CustomClip;
    import NpcCfg = modules.config.NpcCfg;
    import npcFields = Configuration.npcFields;
    import Skeleton = Laya.Skeleton;
    import Templet = Laya.Templet;

    class DecorateItem extends Laya.Image {
        private _sk: Skeleton = null;
        public constructor(skin?: string) {
            super(skin)
        }
        public addNode(sk: Skeleton) {
            if (this._sk) {
                this._sk.removeSelf();
                this._sk.destroy();
                this._sk = null
            }
            this._sk = sk
            this.addChild(sk)
            this.event(Laya.Event.LOADED)
        }
        public delNode() {
            if (this._sk) {
                this._sk.removeSelf();
                this._sk.destroy();
                this._sk = null
            }
        }

    }

    export class XianfuLeftBottomPanel extends XianfuLeftBottomViewUI {

        private _skinType: number[];  // 农场 0聚灵厅 炼金室 1炼制崖 游历 2灵兽阁
        private _time: number;
        private _arrBoxs: Laya.Box[];
        private _arrTxt: Laya.Text[];

        protected initialize(): void {
            super.initialize();

            this.left = 0;
            this.bottom = 440;
            this.layer = ui.Layer.MAIN_UI_LAYER;

            this.closeByOthers = false;

            this._time = 0;
            this._arrTxt = [this.arrTxt_0, this.arrTxt_1, this.arrTxt_2];
            this._arrBoxs = [this.arrBox_0, this.arrBox_1, this.arrBox_2];
            this._dic = new Laya.Dictionary();
        }

        protected addListeners(): void {
            super.addListeners();

            Laya.timer.loop(1000, this, this.loopHandler);

            this.addAutoListener(this.tabBtn_0, Event.CLICK, this, this.clickHandler, [0]);
            this.addAutoListener(this.tabBtn_1, Event.CLICK, this, this.clickHandler, [1]);
            this.addAutoListener(this.tabBtn_2, Event.CLICK, this, this.clickHandler, [2]);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_EVENT_UPDATE, this, this.updateEventIcon);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_EVENT_UPDATE, this, this.otherAreaMatch);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SELECT_XIANFU_AREA, this, this.otherAreaMatch);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_UPDATE, this, this.otherAreaMatch);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_UPDATE, this, this.otherAreaMatch);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_REENTER, this, this.clickHandler, [3]);
            this.addAutoListener(Laya.stage, common.LayaEvent.CLICK, this, this.onClick);
            // Laya.timer.loop(1000, this, this.loopShow);

        }

        protected removeListeners(): void {
            super.removeListeners();
            // Laya.timer.clear(this, this.loopShow);
            Laya.timer.clear(this, this.loopHandler);
        }

        public onOpened(): void {
            super.onOpened();

            //进入默认 聚灵厅
            this._skinType = [0, 1, 2, 3];
            this.clickBtnHandler(3);
            this.updateEventIcon();
        }

        private loopHandler(): void {

            if (this._time <= 0) {
                this.eventBox.visible = false;
                return;
            } else {
                this.timeTxt.text = modules.common.CommonUtil.msToHHMMSS(this._time);
                this._time -= 1000;
            }
        }

        private get checkIsHaveEvent(): boolean {
            return !XianfuModel.instance.xianfuEvent || !XianfuModel.instance.xianfuEvent[Protocols.XianFuEventFields.isOpen];
        }

        //更新事件提示图标
        private updateEventIcon(): void {
            if (this.checkIsHaveEvent) {
                this.eventBox.visible = false;
                return;
            } else {
                this.eventBox.visible = true;
                let eventId: number = XianfuModel.instance.xianfuEvent[Protocols.XianFuEventFields.eventId];
                this.eventIcon.skin = `xianfu/event_${eventId}.png`;
                this._time = XianfuModel.instance.xianfuEvent[Protocols.XianFuEventFields.time] - GlobalData.serverTime;
                if (eventId == XianFuEvent.mall) {
                    this.hintTxt.text = `离开倒计时`;
                } else if (eventId == XianFuEvent.Intrusion || eventId == XianFuEvent.boss) {
                    this.hintTxt.text = `撤退倒计时`;
                } else {
                    this.hintTxt.text = `消失倒计时`;
                }
            }
        }

        //另外两个区域事件匹配 事件id 区域id
        private otherAreaMatch(): void {
            let otherAreas: number[] = this.getOtherAreaId();
            let areaId: number = -1;
            let eventId = XianfuModel.instance.checkEventRP();
            if (eventId != XianFuEvent.none && eventId != XianFuEvent.mall)
                areaId = XianfuModel.instance.areaId();  //非商城事件

            let residueAreas: number[] = [];
            for (let i: int = 0; i < otherAreas.length; i++) {
                if (areaId == otherAreas[i]) {
                    this.showEventArrImg(i, eventId - 1);
                } else {
                    residueAreas[i] = otherAreas[i];
                }
            }

            for (let i: int = 0; i < residueAreas.length; i++) {
                if (residueAreas[i]) {
                    this.checkStateByArea(i, residueAreas[i]);
                }
            }
        }

        private checkStateByArea(index: number, areaId: number): void { //根据区域判断设置状态
            this._arrBoxs[index].visible = false;
            if (areaId == 1) {// 农场 聚灵厅
                if (XianfuModel.instance.julingEvent) {
                    this.showEventArrImg(index, XianfuModel.instance.julingEvent);
                }
            } else if (areaId == 2) { // 炼金室 炼制涯
                if (XianfuModel.instance.lianzhiEvent) {
                    this.showEventArrImg(index, XianfuModel.instance.lianzhiEvent);
                } else if (XianfuModel.instance.lianzhiHaveTime) {
                    this.showEventArrImg(index, XianfuModel.instance.lianzhiHaveTime);
                }
            } else { // 游历 灵兽阁
                if (XianfuModel.instance.petEvent) {
                    this.showEventArrImg(index, XianfuModel.instance.petEvent);
                } else if (XianfuModel.instance.petHaveTime) {
                    this.showEventArrImg(index, XianfuModel.instance.petHaveTime);
                }
            }
        }


        // 策划需求 
        // 右侧按钮红点
        // 每20秒提示一次 提示5秒后 隐藏 反复
        // private loopCount: number = 0
        // private show: number = 0
        // private loopShow() {
        //     this.loopCount++;
        //     if (this.show == 0) {
        //         if (this.loopCount >= 20) {
        //             this.showEventArrImg(0, -1)
        //             this.showEventArrImg(1, -1)
        //             this.loopCount = 0;
        //             this.show = 1
        //         }
        //     } else {
        //         if (this.loopCount >= 5) {
        //             this.showEventArrImg(0, null)
        //             this.showEventArrImg(1, null)
        //             this.loopCount = 0;
        //             this.show = 0
        //         }
        //     }
        // }
        //  ============end

        private showEventArrImg(index: number, eventId: number): void {
            if (eventId == null) {
                this._arrBoxs[index].visible = false;
                return;
            }
            // if (this.select != index) // 这个启用是 当前区域=btn index时候 红点取消显示
            this._arrBoxs[index].visible = true;
            let str: string;
            if (eventId == XianFuEvent.Intrusion - 1) {
                str = `魔兵刷新`;
            } else if (eventId == XianFuEvent.boss - 1) {
                str = `魔将刷新`;
            } else if (eventId == XianFuEvent.collect - 1) {
                str = `灵脉刷新`;
            } else if (eventId == XianFuEvent.treasure - 1) {
                str = `宝矿刷新`;
            } else if (eventId == 5) {//农场 聚灵厅有收益达到上限时 类型5
                str = `可收获`;
            } else if (eventId == 6) {//炼金室 炼制崖有收获可领时 类型6
                str = `可收获`;
            } else if (eventId == 7) {//炼制崖有炉子闲置且该炉子有炼制次数时（未开启不算）类型7
                str = `可炼制`;
            } else if (eventId == 8) {//游历 灵兽阁有灵兽游历可收获时 类型8
                str = `可收获`;
            } else if (eventId == 9) {//灵兽阁有灵兽休息且有游历次数时（未开启不算）类型9
                str = `可游历`;
            }
            // this._arrTxt[index].text = str;
            this._arrTxt[index].text = "";
        }

        private getOtherAreaId(): number[] {
            return [1, 2, 3];// 测试返回123尝试
            let panelType: number = XianfuModel.instance.panelType;
            if (panelType == 0) {
                return [2, 3];
            } else if (panelType == 1) {
                return [1, 3];
            } else {
                return [1, 2];
            }
        }
        private select: number = 0
        private clickHandler(index: number) {
            if (this.select == index) {
                // SystemNoticeManager.instance.addNotice("您已在当前场景!", true);
                return;
            }
            // 点击切换场景

            if (this.select == 3) {
                // 默认场景
                XianfuModel.instance._transmit = this.delayHandler.bind(this, index)
                let occ = XianfuCfg.instance.getCfgByBuildIdAndLv(index + 5, 1)[xianfuFields.buildShowId];
                PlayerModel.instance.selectTarget(SelectTargetType.Npc, occ);
            } else {
                XianfuModel.instance._transmit = this.delayHandler.bind(this, index)
                let occ = XianfuCfg.instance.getCfgByBuildIdAndLv(this.select + 8, 1)[xianfuFields.buildShowId];
                PlayerModel.instance.selectTarget(SelectTargetType.Npc, occ);
            }



        }

        private delayHandler(index: number): void {
            SwitchSceneCtrl.instance.tweenCloudEnter();
            Laya.timer.once(500, this, this.clickBtnHandler, [index])
        }


        private clickBtnHandler(index: number): void {
            this.select = index
            NpcCtrl.instance.gatherInterrupt();
            PlayerModel.instance.selectTarget(SelectTargetType.Dummy, -1);
            this.registerEvent(this._skinType[index]);
            GlobalData.dispatcher.event(CommonEventType.SELECT_XIANFU_AREA);
        }

        private registerEvent(id: number): void {
            if (XianfuModel.instance.panelType != id)
                DungeonCtrl.instance.reqEnterScene(2241, id);
            XianfuModel.instance.panelType = id;
            this.tabBtn_0.selected = this.tabBtn_1.selected = this.tabBtn_2.selected = false;
            // this.tabBtn_0.disabled = this.tabBtn_1.disabled = this.tabBtn_2.disabled = 
            // 农场 0聚灵厅 炼金室 1炼制崖 游历 2灵兽阁
            if (id == 0) {
                this.tabBtn_0.selected = true;
                // this.tabBtn_0.disabled = true;
                XianfuCtrl.instance.getBuildingInfo([0]);
                XianfuCtrl.instance.getBuildingInfo([1]);
            } else if (id == 1) {
                this.tabBtn_1.selected = true;
                // this.tabBtn_1.disabled = true;
                XianfuCtrl.instance.getBuildingInfo([2]);
                XianfuCtrl.instance.getBuildingInfo([3]);
                XianfuCtrl.instance.getBuildingInfo([4]);
            } else if (id == 2) {
                this.tabBtn_2.selected = true;
                // this.tabBtn_2.disabled = true;
                let ids: number[] = XianfuAnimalCfg.instance.ids;
                for (let i: int = 0, len: int = ids.length; i < len; i++) {
                    XianfuCtrl.instance.getSpiritAnimalTravel([ids[i]]);
                }
            } else {
                // 初始默认场景
            }
            this.updateSceneDecorate(id);
        }

        private _dic: Laya.Dictionary; // 字典 用来NPCid对应type
        private _click: Laya.Sprite[] = []; // 带点击的家具 用于相交计算
        private _decorate: Laya.Image[] = [];  // png家具
        private _decorateLab: Laya.Label[] = []; // 名字
        private _decorateSkeleton: DecorateItem[] = []; // spine

        private updateSceneDecorate(id: number) {
            this._dic.clear();
            this._click = [];
            while (this._decorate.length > 0) {
                let e = this._decorate.pop()
                e.offAll();
                e.removeSelf();
                e = null;
            }
            while (this._decorateLab.length > 0) {
                let e = this._decorateLab.pop()
                e.removeSelf();
                e = null;
            }
            while (this._decorateSkeleton.length > 0) {
                let e = this._decorateSkeleton.pop();
                e.offAll();
                e.delNode();
                e.removeSelf();
                e = null;
            }

            //0药草园 1粮食园 2炼丹炉 3炼器炉 4炼魂炉
            let cfg = [];
            switch (id) {
                case 0:
                    cfg = [
                        // { url: 'xianfu/decorate/image_paizizuo0.png', pos: [22, 58] }, // 牌子左
                        // { url: 'xianfu/decorate/image_paiziyou0.png', pos: [112, 58] }, // 牌子右
                        { url: 'xianfu/decorate/candlelight/UI_jiayuan_Farm_PingfengL.sk', pos: [25, 92] }, // 牌子左sk
                        { url: 'xianfu/decorate/candlelight/UI_jiayuan_Farm_PingfengR.sk', pos: [115, 92] }, // 牌子右sk
                        // { url: 'xianfu/decorate/image_huapenyou0.png', pos: [105, 92] }, // 花盆右
                        // { url: 'xianfu/decorate/image_huapenzuo0.png', pos: [24, 93] }, // 花盆左
                        { url: 'xianfu/decorate/image_ztyou0.png', pos: [134, 79] }, // 烛台2右
                        // { url: 'xianfu/decorate/image_ztzuo0.png', pos: [6, 78] }, // 烛台2左
                        { url: 'xianfu/decorate/candlelight/UI_jiayuan_Farm_Zhutai.sk', pos: [20, 96] }, // 烛台sk
                        { url: 'xianfu/decorate/candlelight/UI_jiayuan_Farm_HuapenL.sk', pos: [117, 97] }, // 药草sk
                        { url: 'xianfu/decorate/candlelight/UI_jiayuan_Farm_HuapenR.sk', pos: [37, 97] }, // 粮食sk
                        { url: 'xianfu/decorate/image_caoyao0.png', pos: [105, 85], npc: 2241005, type: 0, name: '药草', hide: 1 }, // 药草
                        { url: 'xianfu/decorate/image_xiaomai0.png', pos: [23, 83], npc: 2241001, type: 1, name: '粮食', hide: 1 }, // 粮食

                    ]
                    break;
                case 1:
                    cfg = [
                        { url: 'xianfu/decorate/image_jiazizuo0.png', pos: [14, 186] }, // 架子左
                        { url: 'xianfu/decorate/image_jiaziyou0.png', pos: [109, 186] }, // 架子右
                        { url: 'xianfu/decorate/image_pingfeng.png', pos: [50, 180] }, // 屏风
                        { url: 'xianfu/decorate/candlelight/UI_jiayuan_Alchemy_Liandanlu.sk', pos: [80, 225] }, // 炼丹炉
                        { url: 'xianfu/decorate/image_ldl.png', pos: [59, 198], npc: 2241002, type: 2, name: '炼丹炉', hide: 1 }, // 炼丹炉
                        { url: 'xianfu/decorate/image_zhuozizuo0.png', pos: [17, 219] }, // 桌子左
                        { url: 'xianfu/decorate/image_zhuoziyou0.png', pos: [107, 219] }, // 桌子右
                        { url: 'xianfu/decorate/image_zhutaiyou0.png', pos: [117, 199] }, // 烛台右
                        { url: 'xianfu/decorate/image_zhutaizuo0.png', pos: [20, 203] }, // 烛台左
                        { url: 'xianfu/decorate/image_daoyaoyou0.png', pos: [116, 217] }, // 捣药右
                        { url: 'xianfu/decorate/image_daoyaozuo0.png', pos: [34, 217] }, // 捣药左
                        { url: 'xianfu/decorate/image_caoyaozs0.png', pos: [45, 223] }, // 药草装饰

                    ]
                    break;
                case 2:
                    cfg = [
                        { url: 'xianfu/decorate/image_wuzi0.png', pos: [94, 297] }, // 屋子
                        { url: 'xianfu/decorate/image_zhen0.png', pos: [54, 338] }, // 阵
                        { url: 'xianfu/decorate/image_baoxiang0.png', pos: [0, 335] }, // 宝箱
                    ]
                    break;
                case 3:// 入口
                    cfg = [
                        { url: 'res/skeleton/tx/chuansongmen3/UI_jiayuan_Portal_G.sk', pos: [29, 449], alpha: 0.5 }, // 特效门1
                        { url: 'res/skeleton/tx/chuansongmen3/UI_jiayuan_Portal_B.sk', pos: [82, 450], alpha: 0.5 }, // 特效门2
                        { url: 'res/skeleton/tx/chuansongmen3/UI_jiayuan_Portal_Y.sk', pos: [136, 449], alpha: 0.5 }, // 特效门3



                        { url: 'xianfu/decorate/zz1.png', pos: [3, 409] }, // 种植门
                        { url: 'xianfu/decorate/ly1.png', pos: [56, 409] }, // 炼药门
                        { url: 'xianfu/decorate/ss1.png', pos: [109, 409] }, // 神兽门

                        { url: 'xianfu/decorate/cc4.png', pos: [45, 449] }, // 种植门 草3

                        { url: 'xianfu/decorate/cc2.png', pos: [1, 447] }, // 种植门 草1
                        { url: 'xianfu/decorate/cc3.png', pos: [35, 447] }, // 种植门 草2

                        { url: 'xianfu/decorate/dll1.png', pos: [5, 427] }, // 种植门 灯笼1
                        { url: 'xianfu/decorate/dll2.png', pos: [49, 427] }, // 种植门 灯笼2



                        { url: 'xianfu/decorate/dl1.png', pos: [61, 438] }, // 神兽门 炼丹炉1
                        { url: 'xianfu/decorate/dl2.png', pos: [88, 438] }, // 神兽门 炼丹炉2

                        { url: 'xianfu/decorate/dll3.png', pos: [57, 428] }, // 神兽门 灯笼1
                        { url: 'xianfu/decorate/dll4.png', pos: [101, 428] }, // 神兽门 灯笼2


                        { url: 'xianfu/decorate/st1.png', pos: [86, 445] }, // 神兽巢 石头1
                        { url: 'xianfu/decorate/st2.png', pos: [137, 450] }, // 神兽巢 石头2

                        { url: 'xianfu/decorate/dll5.png', pos: [110, 427] }, // 神兽巢 灯笼1
                        { url: 'xianfu/decorate/dll6.png', pos: [154, 427] }, // 神兽巢 灯笼2
                        { url: 'xianfu/decorate/sss1.png', pos: [113, 440] }, // 神兽巢 鹤1
                        { url: 'xianfu/decorate/sss2.png', pos: [144, 440] }, // 神兽巢 鹤2
                    ];
                    break;
            }

            let len = cfg.length
            let sprite = GameCenter.instance.getWorldLayer(LayerType.Background)
            for (let i = 0; i < len; i++) {
                let type = cfg[i].url
                let object: Laya.Sprite = null;
                type = type.split('.').pop()
                if (type == 'png') {
                    // png家具部分
                    let e: Laya.Image = new Laya.Image();
                    if (!e.skin) sprite.addChild(e);

                    e.skin = cfg[i].url
                    e.pos(cfg[i].pos[0] * 16, cfg[i].pos[1] * 16)
                    if (!!cfg[i].npc) {
                        // 有NPC属性
                        e.on(Laya.Event.CLICK, this, this.npcHandler, [cfg[i].npc])
                        this._dic.set(cfg[i].npc, cfg[i].type)
                        this._click.push(e)
                    }
                    if (!!cfg[i].hide) {
                        // 隐藏
                        e.visible = false
                    }
                    cfg[i].alpha && (e.alpha = cfg[i].alpha)
                    // 添加控制
                    this._decorate.push(e)
                    object = e;
                } else if (type == 'sk') {
                    // spine
                    let e = new DecorateItem();
                    sprite.addChild(e);
                    e.alpha = 1;
                    cfg[i].alpha && (e.alpha = cfg[i].alpha)
                    e.pos(cfg[i].pos[0] * 16, cfg[i].pos[1] * 16)
                    let url = cfg[i].url;
                    let name = this.getNameByUrl(url);
                    let temp: Templet = this._dic.get(name)
                    if (!temp) {
                        temp = new Templet();
                        this._dic.set(name, temp)
                        temp.once(Laya.Event.COMPLETE, this, () => {
                            add(temp, e)
                        })
                        temp.on(Laya.Event.ERROR, this, () => {
                            this._dic.set(name, null)
                        });
                        temp.loadAni(url)
                    } else {
                        add(temp, e)
                    }
                    object = e;
                    this._decorateSkeleton.push(e);
                } else {
                    continue;
                }
                function add(temp: Templet, node: DecorateItem) {
                    let sk = temp.buildArmature(0)
                    sk.play(0, true)
                    node.addNode(sk)
                }

                // 名字部分
                if (!!cfg[i].name) {
                    // 带有名字属性 显示名字
                    let lab = this.initLabel();
                    if (lab.text == '') sprite.addChild(lab);
                    lab.color = "#fffc00"
                    lab.text = cfg[i].name
                    if (object) {
                        object.once(Laya.Event.LOADED, this, () => {
                            lab.x = (object.width / 2 + object.x) - lab.width / 2
                            lab.y = object.y - 40
                        })
                    }
                    this._decorateLab.push(lab)
                }


            }

        }

        private initLabel(size: number = 30, stroke: number = 2, strokeColor: string = "#000000"): Laya.Label {
            let result = new Laya.Label();
            result.fontSize = size;
            result.font = "SimHei";
            result.stroke = stroke;
            result.strokeColor = strokeColor;
            return result;
        }


        private onClick(event) {
            let pointX = Laya.MouseManager.instance.mouseX;
            let pointY = Laya.MouseManager.instance.mouseY;
            if (event.target.name != 'rockerRegion') {
                return;
            }
            let len = this._click.length
            let sprite = GameCenter.instance.getWorldLayer(LayerType.Background)
            let pos = sprite.globalToLocal(new Laya.Point(pointX, pointY))

            for (let i = 0; i < len; i++) {

                if (
                    pos.x >= this._click[i].x &&
                    pos.x <= this._click[i].x + this._click[i].width &&
                    pos.y >= this._click[i].y &&
                    pos.y <= this._click[i].y + this._click[i].height
                ) {
                    // 相交检测
                    let event = new Laya.Event()
                    this._click[i].event(Laya.Event.CLICK, event.setTo(Laya.Event.CLICK, this._click[i], this._click[i]));
                    break;
                }
            }




        }
        private npcHandler(id: number) {
            let type = this._dic.get(id)
            if (type == null) return;
            GlobalData.dispatcher.event(CommonEventType.XIANFU_CLICK, [type]);

            // let cfg = NpcCfg.instance.getCfgById(id);
            // if (cfg) {
            //     let pos = GameCenter.instance._master.property.get("transform").localPosition;
            //     let role = GameCenter.instance.findNearbyRole(pos.x, pos.y, 1000, RoleType.Npc, id)
            //     if (role) {
            //         GlobalData.dispatcher.event(CommonEventType.PLAYER_TRIGGER_NPC, [role.property.get('id')]);
            //     } else {
            //         console.log('未找到NPC')
            //     }
            // }


        }
        public close(): void {
            this.updateSceneDecorate(-1);
            super.close();
        }

        private getNameByUrl(url: string) {
            let strName = url.split('/').pop() || ''
            return strName = strName.split('.')[0]
        }
    }
}
