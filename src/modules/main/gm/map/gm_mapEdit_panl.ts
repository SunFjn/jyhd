/** GM 地图编辑器*/
namespace modules.gm {
    import GM_MapEditViewUI = ui.GM_MapEditViewUI; // UI
    import Event = Laya.Event;// 事件
    import Text = Laya.Text;// Label
    import Image = Laya.Image;// Image
    import CustomList = modules.common.CustomList; // List
    import CustomClip = modules.common.CustomClip; // 序列帧
    import LayaEvent = modules.common.LayaEvent;
    import BtnGroup = modules.common.BtnGroup;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class GM_MapEditPanl extends GM_MapEditViewUI {
        constructor() {
            super();
        }
        private _list: CustomList;
        private _btnGroup: BtnGroup;
        private _btnGroup1: BtnGroup;
        private _list_top: CustomList;
        private _list_left: CustomList;
        private _list_right: CustomList;
        private _list_bottom: CustomList;
        public destroy(destroyChild: boolean = true): void {
            // this._list = this.destroyElement(this._list);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            // let w = this.listBox.width
            // let h = this.listBox.height
            // let x1 = this.listBox.x
            // let x2 = x1 + this.listBox.width
            // let y1 = this.listBox.y
            // let y2 = y1 + this.listBox.height
            // this._list_top = this.addLayoutList(2, w, 40, 1, 1, x1, y1 - 40)
            // this._list_bottom = this.addLayoutList(2, w, 40, 1, 1, x1, y2)
            // this._list_left = this.addLayoutList(1, 40, h, 1, 1, x1 - 40, y1)
            // this._list_right = this.addLayoutList(1, 40, h, 1, 1, x2, y1)

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.selectBtn2, this.selectBtn3, this.selectBtn4, this.selectBtn5);

            this._btnGroup1 = new BtnGroup();
            this._btnGroup1.setBtns(this.selectControlAll, this.selectControlTop, this.selectControlBottom, this.selectControlLeft, this.selectControlRight);
        }

        private addLayoutList(scrollDir, width, height, vCount, hCount, x, y) {
            let list: CustomList = new CustomList();
            list.scrollDir = scrollDir;
            list.width = width;
            list.height = height;
            list.vCount = vCount;
            list.hCount = hCount;
            list.itemRender = GM_MapRegionItem;
            list.spaceY = 0
            list.spaceX = 0
            this.listBox.addChild(list);
            list.x = x;
            list.y = y;
            return list;

        }
        protected addListeners(): void {
            super.addListeners();

            this.startMap.on(Event.CLICK, this, this.stratMap);
            this.startMap2.on(Event.CLICK, this, this.stratMap2);
            this.a3Btn.on(Event.CLICK, this, this.openMove);
            this.a1Btn.on(Event.CLICK, this, this.setQuyu);
            this.saveBtn.on(Event.CLICK, this, this.save);
            this.clearBtn.on(Event.CLICK, this, this.clearQuyu);
            this.loadMap.on(Event.CLICK, this, this.load);


            this.a4Btn.on(Event.CLICK, this, this.setAllClose);
            this.a5Btn.on(Event.CLICK, this, this.setAllOpen);
            this.a6Btn.on(Event.CLICK, this, this.setAllReverse);

            this.a6Btn.on(Event.CLICK, this, this.setAllReverse);
            this.addAutoListener(this.selectBtn, common.LayaEvent.CLICK, this, () => {
                this.selectBtn.selected = !this.selectBtn.selected
            });

        }
        private load() {
            GM_MapModel.instance._onCompleteToPanl = this.stratMap2.bind(this)
            let res = Number(this.mapidTxt.text)
            let url: string = `assets/map/${res}/main/info.bin`;
            ResourcePool.instance.load(url, GM_MapModel.instance.onConfigComplete, 0, false, false, 1);
            let content = MapUtils.configs[res];
            !content ? ResourcePool.instance.load(url, GM_MapModel.instance.onConfigComplete, 0, false, false, 1) : GM_MapModel.instance.onConfigComplete(url, 0, content.buffer)

        }



        private save() {
            let arr = []
            for (let index = 0; index < this.Datalength; index++) {
                arr.push(GM_MapModel.instance._map[index])
            }
            console.log('研发测试_chy:地图', '保存长度', this.Datalength, arr.length);
            if (arr.length > 5)
                console.log('研发测试_chy:地图', '预览参数', arr[0], arr[1]);

            let vCount = Number(this.xTxt.text)
            let hCount = Number(this.yTxt.text)
            let Maptype = []
            if (!GM_MapModel.instance._flags) {
                for (let index = 0; index < vCount * hCount; index++) {
                    Maptype.push(2)
                }
            } else {
                for (let index = 0; index < vCount * hCount; index++) {
                    Maptype.push(GM_MapModel.instance._flags[index])
                }
            }

            // let pathDat = GM_MapModel.instance._quyu
            // let path = []
            // for (const key in pathDat) {
            //     if (pathDat[key] && pathDat[key] != null)
            //         path.push([Number(key), pathDat[key][1], pathDat[key][3], pathDat[key][0], pathDat[key][2]])
            // }

            let saveData = {
                id: Number(this.mapidTxt.text),
                width: hCount * 512,
                height: vCount * 512,
                splitWidth: 512,
                splitHeight: 512,
                row: vCount,
                cols: hCount,
                flags: JSON.stringify(Maptype),
                MapUtils: {
                    offset: 2,
                    mapWidth: hCount * 512,
                    mapHeight: vCount * 512,
                    cellWidth: 16,
                    cellHeight: 16,
                    cellHalfWidth: 8,
                    cellHalfHeight: 8,
                    cols: hCount * 512 / 16,
                    rows: vCount * 512 / 16,
                    pathNodesDesc: "pathNodes 参数 第一位是区域ID 剩下四位是X1,X2,Y1,Y2 是xy的取值范围 手写改到spawnpoints和copy",
                    spawnpoints: JSON.stringify(GM_MapModel.instance.spawnpointNodes, null, 5),
                    pathNodes: JSON.stringify(GM_MapModel.instance.pathNodes, null, 5)
                },

            }

            window['saveJSON'](saveData, "map" + saveData.id + ".json")
            window['saveJSON'](JSON.stringify(arr), "map" + saveData.id + "_Mapdata.json")



        }

        private setQuyu() {
            let id = Number(this.quyuTxt.text);
            if (id < 1) return;
            let data = this._list.selectedData
            console.log('研发测试_chy:地图', '设置随机区域', data._y, data._x, data._y * 32, data._x * 32, data._y * 32 + 32, data._x * 32 + 32);
            let item = [data.y * 32, data.x * 32, data.y * 32 + 32, data.x * 32 + 32]
            if (GM_MapModel.instance._quyu[id] && GM_MapModel.instance._quyu[id] != item && GM_MapModel.instance._quyu[id] != null) return

            GM_MapModel.instance._quyu[id] = item;
            let items: Array<GM_MapRegionItem> = this._list.items as Array<GM_MapRegionItem>
            items[this._list.selectedIndex].setTxt(id.toString())
        }


        private clearQuyu() {
            let id = Number(this.quyuTxt.text);
            if (id < 1) return;
            let data = this._list.selectedData
            console.log('研发测试_chy:地图', '清除随机区域', data._y, data._x, data._y * 32, data._x * 32, data._y * 32 + 32, data._x * 32 + 32);
            GM_MapModel.instance._quyu[id] = null;
            let items: Array<GM_MapRegionItem> = this._list.items as Array<GM_MapRegionItem>
            items[this._list.selectedIndex].setTxt("-1")
        }
        private Datalength = 0
        private stratMap() {
            if (this._list) this.listBox.removeChild(this._list)
            GM_MapModel.instance._flags = null
            let vCount = Number(this.xTxt.text)

            let hCount = Number(this.yTxt.text)
            GM_MapModel.instance._map = new Uint32Array(vCount * hCount * 1025);
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.width = vCount * 40;
            this._list.height = vCount * 40;
            this._list.vCount = vCount;
            this._list.hCount = hCount;
            this._list.itemRender = GM_MapRegionItem;
            this._list.spaceY = 0
            this._list.spaceX = 0
            this.listBox.addChild(this._list);
            this._list.x = this.listBox.width / 2 - this._list.width / 2;
            this._list.y = this.listBox.height / 2 - this._list.height / 2;
            this._list.on(Event.SELECT, this, this.selectHandler);
            // console.log('研发测试_chy:111', vCount, hCount);
            let arr = []
            let index = 0
            let i = 0
            for (let y = 0; y < vCount; y++) {
                for (let x = 0; x < hCount; x++) {
                    //w*h*c*y+x*w
                    arr.push({
                        x: x, y: y, url: "assets/map/" + this.mapidTxt.text + "/main/", tag: x * 32 + y * 32 * 32 * hCount, vCount: vCount, hCount: hCount, _x: x * 32, _y: y * 32, type: this.selectBtn.selected ? 3 : 0, index: i, skin: ''
                    })
                    i++
                }
            }
            this._list.datas = arr;
            this.Datalength = i * 1024
        }

        private stratMap2() {
            if (this._list) this.listBox.removeChild(this._list)
            let vCount = GM_MapModel.instance._rows
            let hCount = GM_MapModel.instance._cols
            this.xTxt.text = String(vCount)
            this.yTxt.text = String(hCount)
            this._list = new CustomList();

            let w = hCount * 40
            let h = vCount * 40
            let maxW = 540
            let maxH = 300
            if (w > maxW) {
                w = maxW
                this._list.scrollDir = 2;
            } else if (h > maxH) {
                h = maxH
                this._list.scrollDir = 1;
            }


            this._list.width = w;
            this._list.height = h;
            this._list.vCount = vCount;
            this._list.hCount = hCount;
            this._list.itemRender = GM_MapRegionItem;
            this._list.spaceY = 0
            this._list.spaceX = 0
            this.listBox.addChild(this._list);
            this._list.x = this.listBox.width / 2 - this._list.width / 2;

            this._list.y = this.listBox.height / 2 - this._list.height / 2;
            if (h > maxH) this._list.y = 30


            this._list.on(Event.SELECT, this, this.selectHandler);
            // console.log('研发测试_chy:111', vCount, hCount);
            let arr = []
            let index = 0
            let i = 0
            for (let y = 0; y < vCount; y++) {
                for (let x = 0; x < hCount; x++) {
                    //w*h*c*y+x*w
                    let value = { x: x, y: y, url: "assets/map/" + this.mapidTxt.text + "/main/", tag: x * 32 + y * 32 * 32 * hCount, vCount: vCount, hCount: hCount, _x: x * 32, _y: y * 32, type: 1, index: i, skin: '' }
                    let skin = ''
                    if (value.type == 0) {
                        skin = value.url + "" + value.y + "_" + value.x + ".jpg";
                    } else {
                        switch (GM_MapModel.instance._flags[value.index]) {
                            case 2:
                                skin = value.url + "" + value.y + "_" + value.x + ".jpg";
                                break;
                            case 3:
                                skin = value.url + "" + value.y + "_" + value.x + ".png";
                                break;
                            default:
                                skin = value.url + "" + value.y + "_" + value.x + ".til";
                                break;
                        }
                    }
                    value.skin = skin
                    arr.push(value)
                    i++
                }
            }
            this._list.datas = arr;
            this.Datalength = i * 1024
        }
        private selectHandler(): void {

            if (this.selectBtn2.selected) this.setAllClose();
            if (this.selectBtn3.selected) this.setAllOpen();
            if (this.selectBtn4.selected) this.setAllReverse();



        }
        protected removeListeners(): void {
            super.removeListeners();

        }

        private openMove() {
            console.log('研发测试_chy:地图', '打开设置移动', this._list.selectedData);
            WindowManager.instance.openDialog(WindowEnum.GM_MAP_ALERT, [this._list.selectedData])
        }
        //设置面板打开信息
        public setOpenParam(value: any): void {
            super.setOpenParam(value);




        }



        // 设置所有关闭
        public setAllClose(): void {
            let data = this._list.selectedData
            let i = data.tag
            for (let y = 0; y < 32; y++) {
                for (let x = 0; x < 32; x++) {
                    if (this.checkJump(x, y))
                        GM_MapModel.instance._map[32 * data.hCount * y + x + i] = 15
                }
            }
            SystemNoticeManager.instance.addNotice("选中设置所有关闭", false);
        }

        //设置所有开启
        public setAllOpen(): void {
            let data = this._list.selectedData
            let i = data.tag
            for (let y = 0; y < 32; y++) {
                for (let x = 0; x < 32; x++) {
                    if (this.checkJump(x, y))
                        GM_MapModel.instance._map[32 * data.hCount * y + x + i] = 0
                }
            }
            SystemNoticeManager.instance.addNotice("选中设置所有开启", false);
        }

        //设置所有取反
        public setAllReverse(): void {
            let data = this._list.selectedData
            let i = data.tag
            for (let y = 0; y < 32; y++) {
                for (let x = 0; x < 32; x++) {

                    let z = 32 * data.hCount * y + x + i
                    if (this.checkJump(x, y))
                        GM_MapModel.instance._map[z] = GM_MapModel.instance._map[z] == 0 ? 15 : 0;
                }
            }
            SystemNoticeManager.instance.addNotice("选中设置所有取反", false);
        }

        private checkJump(x, y) {
            console.log('研发测试_chy:x,y', x, y);
            if (this.selectControlAll.selected) return true;
            let len = 31;
            let count = parseInt(this.selectControlCount.text)
            if (this.selectControlTop.selected && y < count) {
                return true;
            }
            if (this.selectControlBottom.selected && y > len - count) {
                return true;
            }
            if (this.selectControlLeft.selected && x < count) {
                return true;
            }
            if (this.selectControlRight.selected && x > len - count) {
                return true;
            }
            return false

        }

        protected onOpened(): void {
            super.onOpened();
            GM_MapModel.instance._onCompleteToPanl = null;
            this._btnGroup.selectedIndex = 3
            this._btnGroup1.selectedIndex = 0;
        }


        // 关闭
        private closeHandler(): void {

            this.close();

        }

        close(): void {
            super.close();
            //if (WindowManager.instance.isOpened(WindowEnum.GUIDE_PANEL)) WindowManager.instance.close(WindowEnum.GUIDE_PANEL)
        }
    }
}

