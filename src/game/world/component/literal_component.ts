///<reference path="../../../base/mesh/batch_mesh.ts"/>

namespace game.world.component {
    import EntityComponent = base.ecs.EntityComponent;
    import Texture = Laya.Texture;
    import Sprite = Laya.Sprite;
    const enum Literalields {
        name = 0,     // 名称标识
        url,          // 路径
        texture,      // 数据
    }

    type LiteralData = [LiteralType, string, Texture];
    const enum LiteralType {
        //加号
        SYMBOL_MINUS,
        SYMBOL_PLUS,
        SYMBOL_PET,
        SYMBOL_CRIT,
        SYMBOL_CRIT_PET,
        SYMBOL_SEAL,
        SYMBOL_MISS,
        SYMBOL_DIZZY,
        SYMBOL_Marry_Doll,


        NUMERIC_DAMAGE,
        NUMERIC_HEAL,
        NUMERIC_HURT_PET,
        NUMERIC_HURT,
        NUMERIC_HURT_CRIT_PET,
        NUMERIC_HURT_CRIT,

    }

    class LiteralItem extends Laya.Image {
        private _meta: Laya.FontClip;   // 伤害字体
        public offsetX: number = 0

        public sourObjId: number = 0
        public notes: string = ''
        public hurt: number = 0
        public tw: TweenJS = null
        public gcTime: number = 0

        constructor() {
            super();
            this._meta = new Laya.FontClip();
            this.addChild(this._meta)
            this._meta.sheet = '1234567890';
            this._meta.spaceX = -4;
        }
        public setData(symbol: Texture = null, skin: string, value: string) {
            this.alpha = 1
            this.source = symbol;
            this._meta.visible = !(!skin || !value)
            if (this._meta.visible) {
                this._meta.skin = skin;
                this._meta.value = value;
            }
            this.resize();

        }

        private resize() {
            this._meta.x = !this.source ? 0 : 80;
            this._meta.y = this.height / 2 - this._meta.height / 2
            this.offsetX = this._meta.x + this._meta.width
            this.x -= this.offsetX * LiteralComponent.offset
            if (parseInt(this._meta.value) <= 0) {
                this._meta.visible = false
            }
        }

        public destroy(realDestroy: boolean = false): void {
            if (realDestroy) {
                super.destroy(true);
                return;
            }
            this._meta.skin = '';
            this._meta.texture = null;
            this.skin = '';
            this.source = null;
            this.removeSelf();
        }

    }

    export class LiteralComponent extends EntityComponent<WorldMessage, World> {
        public static offset: number = 0.5
        private _sprite: Sprite;
        private _literal: LiteralData[];
        private static _assemblyPool: LiteralItem[];
        public static effCont: number = 0;
        public _dic: Laya.Dictionary;
        private _offsetsArr: Array<[Point, number]>;
        constructor(owner: World) {
            super(owner);
            let sprite = new Sprite();
            this._sprite = sprite;
            this._sprite.name = "飘血层";
            this._dic = new Laya.Dictionary();
   
            LiteralComponent._assemblyPool = [];
            this._literal = [
                [LiteralType.SYMBOL_MINUS, "hit/jian.png", null],
                [LiteralType.SYMBOL_PLUS, "hit/jia.png", null],
                [LiteralType.SYMBOL_PET, "hit/image_cw.png", null],
                [LiteralType.SYMBOL_CRIT, "hit/txt_bj2.png", null],
                [LiteralType.SYMBOL_CRIT_PET, "hit/txt_bj3.png", null],
                [LiteralType.SYMBOL_SEAL, "hit/chenmo.png", null],
                [LiteralType.SYMBOL_MISS, "hit/shanbi.png", null],
                [LiteralType.SYMBOL_DIZZY, "hit/xuanyun.png", null],
                [LiteralType.SYMBOL_Marry_Doll, "hit/image_cw.png", null], // 仙娃暂时没有
                // 数字 数字用的艺术字组件无法直接填充内存数据 后期可优化
                [LiteralType.NUMERIC_DAMAGE, "hit/num_x1.png", null],
                [LiteralType.NUMERIC_HEAL, "hit/lvse.png", null],
                [LiteralType.NUMERIC_HURT_PET, "hit/num_zh3.png", null],
                [LiteralType.NUMERIC_HURT, "hit/num_zh1.png", null],
                [LiteralType.NUMERIC_HURT_CRIT_PET, "hit/num_da3.png", null],
                [LiteralType.NUMERIC_HURT_CRIT, "hit/num_da2.png", null],
            ]
            Laya.loader.load("assets/image/hit/hit.atlas", Handler.create(this, this.onTileComplete));

            // 做了一个伤害字体位置数组 顺序取出使用 
            this._offsetsArr = new Array<[Point, number]>();
            let offsetsX = []
            let offset = 0
            for (let i = 0; i < 1; i++) {
                offsetsX.push(offset)
                offset += CommonUtil.getRandomInt(28, 40);
            }
            let offsetsY = []
            offset = 280
            for (let i = 0; i < 6; i++) {
                offsetsY.push(offset)
                offset += CommonUtil.getRandomInt(25, 40);
            }
            for (let y = 0; y < offsetsY.length; y++) {
                for (let x = 0; x < offsetsX.length; x++) {
                    this._offsetsArr.push([{ x: offsetsX[x], y: offsetsY[y] }, 0])
                }
            }

            // 定时回收没用的资源
            Laya.timer.loop(10000, this, this.checkGC);
        }
        private getLatelyOffsets() {
            let t = Date.now();
            let len = this._offsetsArr.length
            for (let i = 0; i < len; i++) {
                if (t - this._offsetsArr[i][1] >= 450) {
                    this._offsetsArr[i][1] = t;
                    return this._offsetsArr[i][0]
                }
            }
            return { x: CommonUtil.getRandomInt(-10, 30), y: CommonUtil.getRandomInt(350, 380) }


        }
        private getDic(notes: string): Laya.Dictionary {
            let dic = this._dic.get(notes)
            if (dic == null) {
                dic = new Laya.Dictionary();
                this._dic.set(notes, dic)
            }
            return dic;
        }

        private onTileComplete(): void {
            for (const key in this._literal) {
                let url = this._literal[key][Literalields.url]
                let texture = Laya.loader.getRes(url)
                if (!texture) {
                    console.log('研发测试_chy:加载失败', url);
                } else {
                    this._literal[key][Literalields.texture] = texture;
                }

            }
        }

        public setup(): void {
            this.owner.publish("addToLayer", LayerType.Literal, this._sprite);
            this.owner.on("fightingTips", this, this.fightingTips);
            this.owner.on("leaveScene", this, this.leaveScene);
        }

        public teardown(): void {
            this._sprite.removeSelf();
            this.owner.off("fightingTips", this, this.fightingTips);
            this.owner.off("leaveScene", this, this.leaveScene);
        }

        public destory(): void {
            for (const iterator of LiteralComponent._assemblyPool) {
                iterator.destroy(true);
            }
            LiteralComponent._assemblyPool.length = 0;
            this._sprite.destroy();
        }

        private leaveScene(): void {
        }
        private getAssemblyPool() {
            let literalItem: LiteralItem = LiteralComponent._assemblyPool.length > 0 ? LiteralComponent._assemblyPool.pop() : new LiteralItem();
            literalItem.gcTime = Date.now();
            return literalItem;
        }
        private convertValue(value: uint, symbol: Texture, skin: string, pos: Laya.Point): LiteralItem {
            let item = this.getAssemblyPool()
            let p = this.getLatelyOffsets();
            item.pos(pos.x + p.x + CommonUtil.getRandomInt(-5, 5), pos.y - p.y + CommonUtil.getRandomInt(-5, 5), true); // 初始出现位置
            item.setData(symbol, skin, value.toString())

            return item;
            // + (CommonUtil.getRandomInt(0, 50) - CommonUtil.getRandomInt(0, 100))
        }

        private trigger(element: LiteralItem, delay: number): TweenJS {
            return TweenJS.create(element)
                .combine(true)
                .chain(
                    // //先放大后缩小
                    TweenJS.create(element)
                        .to({ scaleX: 0.8, scaleY: 0.8 }, 150)
                        .easing(utils.tween.easing.quadratic.Out)
                        .repeat(1),
                    //先比较快的上升
                    TweenJS.create(element)
                        .to({ x: element.x + element.offsetX * (LiteralComponent.offset + 0.2) / 2 }, 150)
                        .easing(utils.tween.easing.quadratic.Out)
                        .combine(true)
                        .chain(
                            TweenJS.create(element)
                                .to({ alpha: 0 }, 250)
                                .delay(800),
                            TweenJS.create(element)
                                .to({ y: element.y - 250 }, 700)
                                .delay(400)
                        )
                )
                .onStart(this.addLiteralElement)
                .onComplete(this.recover)
                .start();
        }


        private addLiteralElement = (element: LiteralItem): void => {
            element.scale(1 + LiteralComponent.offset, 1 + LiteralComponent.offset)
            this._sprite.addChild(element)
            LiteralComponent.effCont++;
            // element.effPlay();
        };

        private recover = (element: LiteralItem): void => {
            element.destroy();
            LiteralComponent._assemblyPool.push(element)
            LiteralComponent.effCont--;
            let dic = this.getDic(element.notes)
            dic.remove(element.sourObjId)
        };

        private fightingTips(value: uint, delay: number, pos: Laya.Point, flags: TipsFlags, attackId: number, sourObjId: number): void {
            let index = LiteralType.NUMERIC_DAMAGE;
            let symbol: Texture = null; // 标识
            let meta: string = '';   // 字体
            let notes: string = '通用';
            if (flags & TipsFlags.Miss) {
                index = LiteralType.SYMBOL_MISS;
                notes = '闪避'
            } else if (flags & TipsFlags.Heal) {
                index = LiteralType.NUMERIC_HEAL;
                // meta = this._literal[index][1];
                notes = '治愈'
            } else {
                if (flags & TipsFlags.Self) {
                    if (flags & TipsFlags.Crit) {
                        index = (flags & TipsFlags.Pet) ? LiteralType.NUMERIC_HURT_CRIT_PET : LiteralType.NUMERIC_HURT_CRIT;
                        notes = (flags & TipsFlags.Pet) ? '宠物伤害-暴击' : '人物伤害-暴击'
                    } else {
                        index = (flags & TipsFlags.Pet) ? LiteralType.NUMERIC_HURT_PET : LiteralType.NUMERIC_HURT;
                        notes = (flags & TipsFlags.Pet) ? '宠物伤害' : '人物伤害'
                    }
                }

                meta = this._literal[index][1];
            }
            switch (index) {
                case LiteralType.NUMERIC_HURT_CRIT: {
                    symbol = this._literal[LiteralType.SYMBOL_CRIT][2];
                    break;
                }
                case LiteralType.NUMERIC_HURT_CRIT_PET: {
                    symbol = this._literal[LiteralType.SYMBOL_CRIT_PET][2];
                    break;
                }
                case LiteralType.NUMERIC_HURT_PET: {
                    symbol = this._literal[LiteralType.SYMBOL_PET][2];
                    break;
                }
                case LiteralType.NUMERIC_DAMAGE: {
                    // symbol = this._literal[LiteralType.SYMBOL_MINUS][1];
                    break;
                }
                case LiteralType.SYMBOL_MISS: {
                    break;
                }
                case LiteralType.NUMERIC_HEAL: {
                    // symbol = this._literal[LiteralType.SYMBOL_PLUS][1];
                }
            }
            let now = Date.now();
            let dic = this.getDic(notes)
            let hurt = 0;

            let e: LiteralItem = this.convertValue(value + hurt, symbol, meta, pos)
            e.hurt = value + hurt;
            e.sourObjId = sourObjId;
            e.notes = notes;
            e.tw = this.trigger(e, delay);
            dic.set(sourObjId, e)

        }

        private checkGC() {
            // 长度0返回 小于30秒返回 
            let len = LiteralComponent._assemblyPool.length
            if (!len) return;
            let t = Date.now();
            for (let i = len - 1; i >= 0; i--) {
                if (t - LiteralComponent._assemblyPool[i].gcTime >= 30 * 1000) {
                    LiteralComponent._assemblyPool[i].destroy(true);
                    LiteralComponent._assemblyPool[i] = null;
                    LiteralComponent._assemblyPool.splice(i, 1);
                }
            }
        }

    }
}
