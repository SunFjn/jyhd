/** GM 地图编辑器*/
namespace modules.gm {
    import GM_DebugViewUI = ui.GM_DebugViewUI; // UI
    import Event = Laya.Event;// 事件
    import Text = Laya.Text;// Label
    import Image = Laya.Image;// Image
    import CustomList = modules.common.CustomList; // List
    import CustomClip = modules.common.CustomClip; // 序列帧
    import LayaEvent = modules.common.LayaEvent;
    import ColorFilter = Laya.ColorFilter;


    export class GM_DebugView extends GM_DebugViewUI {
        constructor() {
            super();
        }
        private _list: CustomList;
        public destroy(destroyChild: boolean = true): void {
            // this._list = this.destroyElement(this._list);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.selectBtn, common.LayaEvent.CLICK, this, () => {
                this.selectBtn.selected = !this.selectBtn.selected
            });
            // this.addAutoListener(this._list, LayaEvent.SELECT, this, this.selectHandler);
            this.addAutoListener(this.readMapBtn, LayaEvent.CLICK, this, this.readMapHandler)
            this.addAutoListener(this.bstBtn, LayaEvent.CLICK, this, this.bsrHandler)
            this.addAutoListener(this.lvbtn, LayaEvent.CLICK, this, this.redFilter)
            this.addAutoListener(this.deathBtn, LayaEvent.CLICK, this, this.deathHandler)
            this.addAutoListener(this.slotBtn, LayaEvent.CLICK, this, this.slotHandler)
            this.addAutoListener(this.skinBtn, LayaEvent.CLICK, this, this.skinHandler)
            this.addAutoListener(this.debug1Btn, LayaEvent.CLICK, this, this.debug1Handler)
            this.addAutoListener(this.skillBtn, LayaEvent.CLICK, this, this.skillHandler)

            this.addAutoListener(this.addbtn1, LayaEvent.CLICK, this, this.add1Handler)
            this.addAutoListener(this.addbtn2, LayaEvent.CLICK, this, this.add2Handler)
            this.addAutoListener(this.addbtn3, LayaEvent.CLICK, this, this.add3Handler)
            this.addAutoListener(this.lab2, LayaEvent.RESIZE, this, this.aaaaa)
            this.addAutoListener(this.addbtn4, LayaEvent.CLICK, this, this.bbbbbb)
            this.addAutoListener(this.lab2, LayaEvent.CHANGE, this, this.aaaaa)


        }
        private aaaaa() {
            console.log('研发测试_chy:测试变化',);

        }
        private bbbbbb() {
            console.log('研发测试_chy:测试',);
            this.lab2.text = 'aaaaaa'
        }
        private t: number = 0
        private add3Handler() {

            let templet = new Laya.Templet();
            templet.loadAni('res/skeleton/ceshi/LayerTest.sk');
            templet.once(Laya.Event.COMPLETE, this, e => {
                this.t = Date.now()
                let sk1: Laya.Skeleton = e.buildArmature(0);
                let img = new Laya.Image();
                img.addChild(sk1)
                this.testbox.addChild(img)
                img.pos(200, 300)
                sk1.play(0, true)

                sk1.on(Laya.Event.LABEL, this, e => {
                    let t = Date.now()
                    console.log('研发测试_chy:e', '时间差', t - this.t, e.stringValue)
                    this.t = t
                    // this.testbox._childs[0].zOrder = 1
                    // this.testbox._childs[1].zOrder = 0
                    // this.testbox.updateZOrder();
                })
            })

        }
        private add1Handler() {
            let effect = new CustomClip();
            this.testbox.addChild(effect);
            let frameUrls: Array<string> = [];
            for (let i: int = 3, len: int = 12; i < len; i++) {
                frameUrls.push(`xianfu/decorate/candlelight/${i}.png`);
            }
            effect.pos(200, 200);
            effect.frameUrls = frameUrls;
            effect.durationFrame = 5;
            effect.loop = true;
            effect.play();
        }
        private add2Handler() {
            let templet = new Laya.Templet();
            templet.loadAni('xianfu/decorate/candlelight/UI_jiayuan_Farm_PingfengL.sk');
            templet.on(Laya.Event.COMPLETE, this, e => {
                let sk1: Laya.Skeleton = e.buildArmature(1);
                let img = new Laya.Image();
                img.addChild(sk1)
                this.testbox.addChild(img)
                img.pos(0, 600)

                sk1.play(0, true);
                // var shader = new Laya.Shader3D(shaderStr, shaderStr2, 'discoloration');
                // var material = new Laya.ShaderMaterial();
                // material.shader = shader;
                // box.meshRender.material = material;
                // let shader = Laya.Shader2X.create(
                //     [
                //         "attribute vec2 a_Position;",
                //         "attribute vec2 a_Texcoord;",
                //         "uniform vec2 u_offset;",
                //         "varying vec2 v_Texcoord;",
                //         "void main()",
                //         "{",
                //         "gl_Position = vec4(a_Position + u_offset, 0.0, 1.0);",
                //         "v_Texcoord = a_Texcoord;",
                //         "}"
                //     ].join("\n"),
                //     [
                //         "precision mediump float;",
                //         "uniform vec4 u_color;",
                //         "uniform sampler2D u_texture;",
                //         "varying vec2 v_Texcoord;",
                //         "void main()",
                //         "{",
                //         "vec4 t_color = texture2D(u_texture, v_Texcoord);",
                //         "gl_FragColor = t_color * u_color;",
                //         "}"
                //     ].join("\n"),
                //     "CustomShader",
                // );
                // 获取自定义 shader
                var customShader = Laya.Shader.getShader("CustomShader");
                // 应用自定义滤镜
                sk1.filters = [customShader];



            })
        }
        private cutting() {

        }

        private deathHandler(): void {
            this.deathtex.scale(1, 1)
            TweenJS.create(this.deathtex)
                .combine(true)
                .to({ scaleX: 0.6, scaleY: 0.6 }, 800)
                .chain(
                    TweenJS.create(this.deathtex)
                        .to({ scaleX: 5, scaleY: 5 }, 500)
                )
                .onComplete((e: Laya.Image) => {
                    e.removeSelf();
                })
                .start();

        }

        private readMapHandler(): void {
            console.log('研发测试_chy:读取地图层级信息', Laya.stage._childs);
        }


        protected removeListeners(): void {
            super.removeListeners();

        }


        //设置面板打开信息
        public setOpenParam(value: any): void {
            super.setOpenParam(value);




        }
        private _sk: Laya.Skeleton;
        private redFilter() {
            // var grayscaleMat: Array<number> = [0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0];
            var redMat: Array<number> =
                [
                    1, 0, 0, 0, 0, //R
                    0, 0, 0, 0, 0, //G
                    0, 0, 0, 0, 0, //B
                    0, 0, 0, 1, 0, //A
                ];
            //创建一个颜色滤镜对象,红色
            var redFilter: ColorFilter = new ColorFilter(redMat);
            this.testbox.filters = [redFilter]
            Laya.timer.loop(250, this, () => {
                this.testbox.filters = [redFilter]
            })
            Laya.timer.loop(300, this, () => {
                this.testbox.filters = []
            })
            // this._composeClip.filters = [redFilter]
            let templet = new Laya.Templet();
            templet.loadAni('res/skeleton/tx/chuansongmen2/UI_jiayuan_Portal.sk');
            templet.on(Laya.Event.COMPLETE, this, e => {
                console.log('研发测试_chy:加载完毕',);
                // this._sk = e.buildArmature(1);
                // this.testbox.addChild(this._sk)
                // this._sk.play(0, true)
                // this._sk.pos(0, 200)
                // this._sk.scale(1, 1)
                // let texture = Laya.loader.getRes("assets/image/hit/num_da2.png")
                // this._sk.setSlotSkin('2x2pix', texture);
                // for (let i = 2; i <= 20; i++) {
                //     this._sk.setSlotSkin('2x2pix' + i, texture);

                // }
                // this._sk.getBoneCoords(0, "null")
                // this._sk._applyFilters();
                // this.testbox._applyFilters()

                let sk1 = e.buildArmature(1);
                this.testbox.addChild(sk1)
                sk1.play(0, true)
                sk1.pos(0, 200)

                let sk2 = e.buildArmature(1);
                this.testbox.addChild(sk2)
                sk2.play(1, true)
                sk2.pos(200, 200)

                let sk3 = e.buildArmature(1);
                this.testbox.addChild(sk3)
                sk3.play(2, true)
                sk3.pos(400, 200)


            })
            templet.on(Laya.Event.ERROR, this, e => {
                console.log('研发测试_chy:加载失败',);
                console.log(e)
            })
            let templet2 = new Laya.Templet();
            templet2.loadAni('res/skeleton/zhujue/HSN.sk');
            templet2.on(Laya.Event.COMPLETE, this, e => {

                let sk4 = e.buildArmature(1);
                this.testbox.addChild(sk4)
                sk4.play(0, true)
                sk4.pos(0, 400)



            })


        }

        private skillHandler() {
            let templet = new Laya.Templet();
            templet.loadAni('res/skeleton/zhujue/nanzhu.sk');
            templet.on(Laya.Event.COMPLETE, this, e => {
                let sk1: Laya.Skeleton = e.buildArmature(0);
                this.testbox.addChild(sk1)
                sk1.play(0, true)
                sk1.scale(0.6, 0.6)
                sk1.playbackRate(0.3)
                sk1.pos(0, 200)
                sk1.getSlotByName('null');
                console.log()
                let len = sk1.getAnimNum()
                let arr = [];
                // for (let i = 0; i < len; i++) {
                //     arr.push(sk1.getAniNameByIndex(i))
                // }
                // console.log('nanzhu', arr)
                let lab1 = new Laya.Label('原点');
                this.testbox.addChild(lab1)
                lab1.pos(0, 200)

                let lab2 = new Laya.Label('50');
                this.testbox.addChild(lab2)
                lab2.pos(50, 200)

                let lab3 = new Laya.Label('150');
                this.testbox.addChild(lab3)
                lab3.pos(150, 200)

                let lab4 = new Laya.Label('300');
                this.testbox.addChild(lab4)
                lab4.pos(300, 200)





            })
        }

        private skinHandler() {


            let templet = new Laya.Templet();
            templet.loadAni('res/skeleton/ceshi/skinTest.sk');
            templet.on(Laya.Event.COMPLETE, this, e => {
                let sk1 = e.buildArmature(1);
                this.testbox.addChild(sk1)
                sk1.play(0, true)
                sk1.pos(0, 200)
                sk1.getSlotByName('null');

                sk1.on(Laya.Event.LABEL, this, e => {
                    console.log('研发测试_chy:e', e);
                })
            })

        }
        private slotHandler() {
            let texture = Laya.loader.getRes("picA/picA05.png")
            let templet = new Laya.Templet();
            templet.loadAni('res/skeleton/ceshi/PicTest.sk');
            templet.on(Laya.Event.COMPLETE, this, e => {
                let sk1 = e.buildArmature(1);
                this.testbox.addChild(sk1)
                sk1.play(0, true)
                sk1.pos(0, 200)


                sk1.on(Laya.Event.LABEL, this, e => {
                    console.log('研发测试_chy:e', e);
                    console.log('研发测试_chy:"picA/picA" + e.stringValue + ".png"', "picA/picA" + e.stringValue + ".png");
                    sk1.setSlotSkin('WeaponTest', null);
                    // for (let i = 2; i <= 20; i++) {
                    //     this._sk.setSlotSkin('2x2pix' + i, texture);

                    // }


                })
            })
        }
        private debug1Handler() {
            let templet = new Laya.Templet();
            templet.loadAni('res/skeleton/ceshi/2/PicTest.sk');
            templet.on(Laya.Event.COMPLETE, this, e => {
                let sk1 = e.buildArmature(0);
                this.testbox.addChild(sk1)
                sk1.play(0, true)
                sk1.pos(0, 200)
                console.log('研发测试_chy:sk1', sk1.getSlotByName('WeaponTest2'));
                let blot: Laya.BoneSlot = sk1.getSlotByName('WeaponTest2')
                let t: Laya.Texture = blot.currTexture

                let img = new Laya.Image()
                img.source
                let sk2 = e.buildArmature(1);
                this.testbox.addChild(sk2)
                sk2.play(0, true)
                sk2.pos(300, 200)
                console.log('研发测试_chy:sk2', sk2.getSlotByName('WeaponTest2'));
            })
        }

        private _bsrOffset: number = 0

        private bsrHandler() {
            let p = []
            p[0] = { x: 0, y: 400 }
            p[1] = { x: 200, y: 200 }
            p[2] = { x: 100, y: 200 }
            p[3] = { x: 400, y: 400 }

            let pos = CommonUtil.PointOnCubicBezier(p, this._bsrOffset)

            this.testImg.x = pos.x
            this.testImg.y = pos.y
            this._bsrOffset += 0.1
            if (this._bsrOffset > 1) this._bsrOffset = 0

        }
        private _composeClip: CustomClip;
        protected onOpened(): void {
            super.onOpened();

            let effect = new CustomClip();
            this.addChild(effect);
            let frameUrls: Array<string> = [];
            for (let i: int = 3, len: int = 10; i < len; i++) {
                frameUrls.push(`assets/effect/hurt/1/${i}.png`);
            }
            effect.pos(55, 95);
            effect.frameUrls = frameUrls;
            effect.durationFrame = 5;
            effect.loop = true;
            effect.play();

            Laya.loader.load("res/skeleton/ceshi/picA.atlas", null);
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

