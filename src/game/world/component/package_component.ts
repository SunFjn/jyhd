///<reference path="../../../utils/collections/list.ts"/>

namespace game.world.component {
    import Items = Protocols.Items;
    import ItemFields = Protocols.ItemFields;
    import ItemsFields = Protocols.ItemsFields;
    import MathUtils = utils.MathUtils;
    import List = utils.collections.List;
    import BatchLiteralElement = base.mesh.BatchLiteralElement;
    import Texture = Laya.Texture;
    import Sprite = Laya.Sprite;
    import Point = Laya.Point;
    import Layer = ui.Layer;

    const enum PackageStep {
        Delay, // 延迟出现
        Drop, // 
        Wait, // 等待
        MoveTo // 移动
    }

    // interface PackageElement extends BatchLiteralElement {
    //     pos: Laya.Vector3;
    //     dest: Laya.Vector3;
    //     sv?: number;
    //     delta?: number;
    //     startTime?: number;
    //     timeout?: number;
    //     status?: PackageStep;
    // }
    type EffectData = [string, Texture];
    class PackageItem extends Laya.Sprite {
        private _goods: Laya.Image;
        public timeout: number = 0;
        public objId: number = 0;
        public status: number = PackageStep.Delay;
        public delta: number = 0; // 出现移动时间
        public startTime: number = 0; // 出现开始时间
        public sv: number = 0;
        private _eff: Laya.Image;
        public moveData = [];
        private _endPos: Laya.Point = new Laya.Point(0, 0);
        private _pos: Laya.Point = new Laya.Point(0, 0);
        public _flyPos: Laya.Point = null;
        constructor() {
            super();
            this._goods = new Laya.Image();
            this._goods.width = 50
            this._goods.height = 50
            this._goods.pos(0, 0, true)

            this._eff = new Laya.Image();
            this._eff.width = 168
            this._eff.height = 610
            this._eff.x = this._goods.width / 2 - this._eff.width / 2
            this._eff.y = -this._eff.height + this._goods.height + 30

            this.addChild(this._eff)
            this.addChild(this._goods)
            // let lab = new Laya.Label("苏丹是个老6")
            // lab.color = "#1fff05"
            // lab.fontSize = 40
            // this.addChild(lab)
        }
        // public setData(skin: string, texture: Texture) {
        //     if (!!texture) this._goods.source = texture;
        //     else this._goods.skin = skin
        // }
        public init() {
            this.alpha = 0;
            this.scale(1, 1);
            this._eff.alpha = 0;
        }
        public setIcon(itemId: number) {
            this._goods.skin = CommonUtil.getIconById(itemId);
        }

        public destroy(): void {
            this.removeSelf();
        }
        public getEnd(t): Laya.Point {
            let time = t
            if (time < 0) time = 0;
            if (time > 1) time = 1;
            let p = CommonUtil.PointOnCubicBezier(this.moveData, time)
            return new Laya.Point(p.x, p.y)

        }
        public setEffTexture(texture: Texture) {
            if (!texture) {
                this._eff.skin = '';
                this._eff.texture = null;
                return;
            }
            this._eff.alpha = 0;
            this._eff.texture = texture
        }
        public palyEff(t) {
            if (t < 0.5) return;
            let alpha = t - 0.5
            if (alpha > 1) alpha = 1;
            alpha /= 0.5
            this._eff.alpha = alpha;
        }
        public colseEff(t) {
            if (t < 0.5) return;
            let alpha = t - 0.5
            if (alpha > 1) alpha = 1;
            alpha /= 0.5
            this._eff.alpha = 1 - alpha;
        }

        public setEndPos(sx, sy, ex, ey) {
            this._flyPos = null;
            this._pos.setTo(sx, sy)
            this._endPos.setTo(ex, ey)
            this.moveData[0] = { x: sx, y: sy }
            let offset = Math.ceil(Math.abs(sx - ex) / 4)
            this.moveData[1] = { x: sx + offset, y: sy - CommonUtil.getRandomInt(30, 100) }
            this.moveData[2] = { x: sx + 3 * offset, y: ey - CommonUtil.getRandomInt(30, 100) }
            this.moveData[3] = { x: ex, y: ey }
        }
        public setStartPos(sx, sy) {
            this._pos.setTo(sx, sy)
            let ex = this._endPos.x
            let ey = this._endPos.y
            this.moveData[0] = { x: sx, y: sy }
            let offset = Math.ceil(Math.abs(sx - ex) / 4)
            this.moveData[1] = { x: sx + offset, y: sy - CommonUtil.getRandomInt(30, 100) }
            this.moveData[2] = { x: sx + 3 * offset, y: ey - CommonUtil.getRandomInt(30, 100) }
            this.moveData[3] = { x: ex, y: ey }
        }
    }

    export class PackageComponent extends base.ecs.EntityComponent<WorldMessage, World> {
        private _sprite: Sprite;
        private _transform: Laya.Transform3D;
        private _randomCols: Array<number>;
        private _randomRows: Array<number>;
        private _rewardPos: Array<[number, number]>;
        private readonly _swapList: List<PackageItem>;
        private readonly _dropList: List<PackageItem>;
        private _effects: EffectData[];

        constructor(owner: World, url: string) {
            super(owner);
            let sprite = new Sprite();
            this._sprite = sprite;
            this._sprite.name = "掉落物层";


            let size = 31;
            this._randomCols = new Array<number>(size);
            this._randomRows = new Array<number>(size);
            for (let i = 0; i < size; ++i) {
                this._randomRows[i] = this._randomCols[i] = i * - 2;
            }
            this._swapList = new List<PackageItem>();
            this._dropList = new List<PackageItem>();

            this._rewardPos = [];
            this._rewardPos.push([0, CommonUtil.getRandomInt(0, 8)])
            let offset = 30; // 控制每个物品大概距离 浮动-5-5  
            let offsetX = 0;
            for (let index = 0; index < 7; index++) {
                offsetX += offset
                this._rewardPos.push([offsetX + CommonUtil.getRandomInt(-5, 5), CommonUtil.getRandomInt(0, offset / 2)])
                this._rewardPos.push([-offsetX + CommonUtil.getRandomInt(-5, 5), CommonUtil.getRandomInt(0, offset / 2)])
            }
            offsetX = 0;
            for (let index = 0; index < 7; index++) {
                offsetX += offset
                this._rewardPos.push([offsetX + CommonUtil.getRandomInt(-5, 5), CommonUtil.getRandomInt(offset - 10, offset + offset / 2)])
                this._rewardPos.push([-offsetX + CommonUtil.getRandomInt(-5, 5), CommonUtil.getRandomInt(offset - 10, offset + offset / 2)])
            }
            this._effects = [
                ["", null],
                ["", null],
                ["", null],
                ["assets/image/package/zi.png", null],
                ["assets/image/package/zi.png", null],
                ["assets/image/package/zi.png", null],
                ["assets/image/package/hong.png", null],
                ["assets/image/package/huang.png", null],
                // "白",
                // "绿",
                // "蓝",
                // "紫",
                // "橙",
                // "红",
                // "黄",
            ];
            let res = []
            for (const key in this._effects) {
                if (this._effects[key][0] == '') continue;
                if (res.indexOf(this._effects[key][0]) != -1) continue;
                res.push(this._effects[key][0])
            }
            Laya.loader.load(res, Handler.create(this, this.onTileComplete));
        }
        private onTileComplete(): void {
            for (const key in this._effects) {
                if (this._effects[key][0] == '') continue;
                this._effects[key][1] = Laya.loader.getRes(this._effects[key][0]);
            }
        }
        public setup(): void {
            this.owner.publish("addToLayer", LayerType.Package, this._sprite);
            // Laya.stage.addChildAt(this._sprite, 3);
            this.owner
                .on("leaveScene", this, this.leaveScene)
                .on("updateDropItems", this, this.updateDropItems)
                .on("enterMaster", this, this.enterMaster);
        }

        public teardown(): void {
            this._sprite.removeSelf();
            this.owner
                .off("leaveScene", this, this.leaveScene)
                .off("updateDropItems", this, this.updateDropItems)
                .off("enterMaster", this, this.enterMaster);
        }

        public destory(): void {
            this._sprite.destroy();
        }

        public update(): void {
            if (this._dropList.isEmpty || !this._transform) {
                return;
            }
            let now = Date.now();
            do {
                let e = this._dropList.shift();
                if (!e) continue;
                let isDel = false;
                switch (e.status) {
                    case PackageStep.Delay: {
                        if (now > e.timeout) {
                            let delay = false;
                            if (e.objId > 0) {
                                let role = GameCenter.instance.getRole(e.objId)
                                if (role != null) {
                                    delay = true;
                                    if (role.property.get('status') == 1024) {
                                        let skPos = role.property.get('avatarSK').getSKPositon()
                                        e.setStartPos(skPos.x, skPos.y)
                                        e.timeout = now + 500;
                                        e.objId = 0
                                    }
                                }
                            }
                            if (!delay) {
                                e.startTime = now;
                                e.status = PackageStep.Drop;
                                e.sv = (Math.random() * 200 | 0) + 200;
                                e.delta = CommonUtil.isSlow ? 2000 : CommonUtil.getRandomInt(200, 400)
                                e.alpha = 1;
                            }
                        }
                        break;
                    }
                    case PackageStep.Drop: {
                        let rate = (now - e.startTime) / e.delta;
                        let pos = e.getEnd(rate);
                        // e.pos(
                        //     MathUtils.lerp(e.x, pos.x, rate),
                        //     MathUtils.lerp(e.y, pos.y, rate) + MathUtils.bezier(0, e.sv, 0, rate),
                        // );
                        e.pos(
                            pos.x,
                            pos.y,
                        );
                        e.palyEff(rate)
                        if (rate >= 1) {
                            e.status = PackageStep.Wait;
                            e.timeout = now + 1000;
                            e.pos(pos.x, pos.y);
                        }
                        break;
                    }
                    case PackageStep.Wait: {
                        if (now > e.timeout) {
                            e.status = PackageStep.MoveTo;
                            e.startTime = now;
                        }
                        break;
                    }
                    case PackageStep.MoveTo: {
                        let rate = (now - e.startTime) / 800;
                        let s = MathUtils.lerp(1, 0.5, rate);
                        let pos = this._transform.localPosition;
                        let destinX = pos.x + 10
                        let destinY = -pos.y - 160
                        if (e._flyPos != null) {
                            destinX = e._flyPos.x
                            destinX = e._flyPos.y
                        }

                        e.colseEff(rate)
                        e.scale(s, s);
                        e.pos(
                            MathUtils.lerp(e.x, destinX, rate),
                            MathUtils.lerp(e.y, destinY, rate),

                        );
                        isDel = rate >= 1;
                        break;
                    }
                }

                if (isDel) {
                    this.removePackage(e);
                } else {
                    this._swapList.unshift(e);
                }
            } while ((!this._dropList.isEmpty));
            this._dropList.swap(this._swapList);
        }



        private enterMaster(role: game.role.Role): void {
            this._transform = role.property.get("transform");
        }

        private leaveScene(): void {
            this._transform = null;
            while (!this._dropList.isEmpty) {
                this.removePackage(this._dropList.shift());
            }
        }

        private updateDropItems(x: number, y: number, drops: Items[], objId: number): void {
            ArrayUtils.disturb(this._randomCols);
            ArrayUtils.disturb(this._randomRows);
            let cursor = 0;
            let now = Date.now();
            let mapPos = MapUtils.getRealPosition(x, y - 3)
            for (let item of drops) {
                let occ = item[ItemsFields.ItemId];
                let count = CommonUtil.getItemTypeById(occ) != ItemMType.Unreal ? item[ItemFields.count] : 1;
                while (count--) {
                    let e = this.loadPackage(mapPos.x, mapPos.y, occ);
                    e.objId = objId;
                    e.timeout = now;
                    e.status = PackageStep.Delay;
                    // e.delta = (Math.random() * 200 | 0) + 200;
                    e.delta = CommonUtil.isSlow ? 2000 : CommonUtil.getRandomInt(200, 400)
                    // let p = CommonUtil.getRandomInt(0, this._rewardPos.length - 1)
                    e.setEndPos(mapPos.x, mapPos.y, mapPos.x + this._rewardPos[cursor][0], mapPos.y + this._rewardPos[cursor][1])
                    e.setEffTexture(this._effects[CommonUtil.getItemQualityById(occ)][1])

                    let type = 0
                    let destinX = 0;
                    let destinY = 0;
                    if (type == 1) { // 飞入背包
                        let spr: Point = modules.action_preview.actionPreviewModel.instance.getPosSprite(specialAniPoin.beiBao);
                        if (spr) {
                            Point.TEMP.setTo(spr.x, spr.y);
                            GameCenter.instance.getWorldLayer(LayerType.Package).globalToLocal(Point.TEMP);
                            destinX = Point.TEMP.x;
                            destinY = Point.TEMP.y;
                            e._flyPos = new Laya.Point(destinX, destinY)
                        }
                    }
                    now += 50;
                    ++cursor;
                    if (cursor >= this._rewardPos.length) cursor = 0;
                }
            }
        }



        private getPackagePool() {
            return Laya.Pool.getItemByCreateFun("PACKAGE_ITEM", () => {
                return new PackageItem();
            });
        }
        private loadPackage(x: number, y: number, occ: number): PackageItem {
            // let icon = PackageComponent.getPackageIcon(occ);
            let element = this.getPackagePool();
            element.init();
            element.pos(x, y, true);
            element.setIcon(occ)
            this._dropList.unshift(element);
            this._sprite.addChild(element);
            return element;
        }

        public removePackage(e: PackageItem): void {
            e.destroy();
            Laya.Pool.recover("PACKAGE_ITEM", e);
        }

        private static getPackageIcon(id: number): number {
            let result = 0;
            let type = CommonUtil.getItemTypeById(id);
            if (type == ItemMType.Equip) {
                switch (CommonUtil.getPartById(id)) {
                    case EquipCategory.weapon: {
                        result = 1;
                        break;
                    }
                    case EquipCategory.hats: {
                        result = 2;
                        break;
                    }
                    case EquipCategory.clothes: {
                        result = 3;
                        break;
                    }
                    case EquipCategory.hand: {
                        result = 4;
                        break;
                    }
                    case EquipCategory.shoes: {
                        result = 5;
                        break;
                    }
                    case EquipCategory.belt: {
                        result = 6;
                        break;
                    }
                    case EquipCategory.necklace: {
                        result = 7;
                        break;
                    }
                    case EquipCategory.bangle: {
                        result = 8;
                        break;
                    }
                    case EquipCategory.ring: {
                        result = 9;
                        break;
                    }
                    case EquipCategory.jude: {
                        result = 10;
                        break;
                    }
                }
            } else if (type == ItemMType.Unreal) {
                switch (CommonUtil.getPartById(id)) {
                    case UnrealCategory.money: {
                        result = 11;
                        break;
                    }
                    case UnrealCategory.coin: {
                        result = 12;
                        break;
                    }
                    case UnrealCategory.energy: {
                        result = 13;
                        break;
                    }
                }
            }

            return result;
        }
    }
}

