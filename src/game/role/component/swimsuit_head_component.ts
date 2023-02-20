///<reference path="../../../modules/config/skill_effect_cfg.ts"/>
///<reference path="../../../modules/config/xianwei_rise_cfg.ts"/>
///<reference path="../../../modules/vip_new/vip_new_model.ts"/>


namespace game.role.component {
    import SwimsuitItemUI = ui.SwimsuitItemUI
    import SkillEffectFields = Configuration.SkillEffectFields;
    import ParticlePool = base.particle.ParticlePool;
    import designationFields = Configuration.designationFields;
    import XianweiRiseCfg = modules.config.XianweiRiseCfg;
    import xianwei_riseFields = Configuration.xianwei_riseFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import MissionModel = modules.mission.MissionModel;
    import FirstPayModel = modules.first_pay.FirstPayModel;
    import VipModel = modules.vip.VipModel;
    import VipNewModel = modules.vip_new.VipNewModel;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import Texture = Laya.Texture;
    import Point = Laya.Point;
    import List = utils.collections.List;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import MonsterResFields = Configuration.MonsterResFields;
    type HurtData = [number, number, Point, number, number, number];
    const enum HurtDataFields {
        hurt = 0,               // 显示伤害
        time,                   // 延迟显示
        pos,                    // 坐标
        flags,                  // 类型
        attackId,              // 攻击者id
        sourObjId               // 自身id
    }


    const enum TileConstant {
        EnemyColor = "#ff4242",
        OtherColor = "#ffffff",
        MasterColor = "#00e4ff",
        NpcColor = "#fffc00",
        StrokeColor = "#000000",
        FactionColor = "#50ff28",
        VipStrokeColor = "#9a1515",
        VipColor = "#ffe270"
    }

    type LayerStruct = { o: Laya.Sprite; space?: number; padding?: number };
    type LayoutStruct = { layer: LayerStruct[]; space?: number; }
    export class SwimsuitHeadomponent extends RoleComponent {
        private readonly _imagePath: string = "res/atlas/swim_suit.atlas";
        private _transform: Laya.Transform3D;
        private _swimsuitItemView: SwimsuitItemUI;
        //private _rank: modules.common.AtlasImage;//成就
        private _name: Laya.Label;//名字
        private _head: Laya.Image;//头像
        private _faction: Laya.Label;//帮派
        //private _Team: Laya.Label;//战队
        private _title: Laya.Image;//称号

        //免费VIP称号
        private _chapter: Laya.Label;
        private _vip: Laya.Image;
        private _level: Laya.Label;

        private readonly _titleType: number;
        private _layout: Array<LayoutStruct>;
        private _hpDisplay: boolean;
        constructor(owner: Role, titleType: number) {
            super(owner);
            this._titleType = titleType;
            // 0怪物 1NPC 3玩家 7主角 
            this._hpDisplay = [0, 7].indexOf(titleType) > -1

            //头像
            Laya.loader.create(this._imagePath, Laya.Handler.create(this, () => {
                this._swimsuitItemView = new SwimsuitItemUI();
                GameCenter.instance.world.publish("addToLayer", LayerType.Master, this._swimsuitItemView);
                this.setup();
            }));
        }

        public setup(): void {
            this._transform = this.property.get("avatar").title.transform;
            if (!this._swimsuitItemView || !this._transform) {
                return;
            }
            // this._transform.localPosition = new Laya.Vector3(0, 300, 0);
            if (this._titleType & 1) {
                this.owner
                    .on("visible", this, this.visible)
                    .on("updateTitle", this, this.updateName);
                GlobalData.dispatcher
                    .on(CommonEventType.PLAYER_UPDATE_PK_MODE, this, this.updatePkMode);
                this.property.on("name", this, this.updateName)
                    .on("headId", this, this.updateHead);
                this.updateName();
                this.updateHead();
                this.updatePkMode();
            }
            if (this._titleType & 2) {
                this.property
                    .on("desgnation", this, this.updateTitle)
                    .on("factionName", this, this.updateFaction)
                //.on("fightTeamName", this, this.updateTeam)
                //.on("rise", this, this.updateRank);
                //this.updateRank();
                this.updateFaction();
                //this.updateTeam()
                this.updateTitle()

            }
            if (this._titleType & 4) {
                GlobalData.dispatcher
                    .on(CommonEventType.VIP_UPDATE, this, this.updatePayTitle)
                    .on(CommonEventType.VIPF_UPDATE, this, this.updatePayTitle)
                    .on(CommonEventType.FIRST_PAY_UPDATE, this, this.updatePayTitle)
                    .on(CommonEventType.MISSION_UPDATE_LV, this, this.updatePayTitle);
                this.updatePayTitle();
            }

            this.property.on("exterior", this, this.updateExterior);
            this.owner
                .on("abnormal", this, this.abnormal);
            // 角色死亡，移除该角色打出的未展示的伤害
            //GameCenter.instance.world.on("removeDeadSkillEffect", this, this.removeDeadDamage)
            this.updateExterior();
        }

        private updateExterior(): void {
            let offset = -300
            // let exterior = this.property.get("exterior");
            // let petCurrentData = this.property.get("petCurrentData"); // 宠物数据
            // if (exterior || petCurrentData) { // 外观信息存在
            //     // 怪物走表不一样 兼容一个模型不同缩放(小怪可能是BOSS)
            //     if (this.property.get("type") == RoleType.Monster) { // 怪物
            //         let cfg = MonsterResCfg.instance.getCfgById(this.property.get("occ"));
            //         if (cfg) offset += parseInt(cfg[MonsterResFields.title] + "");
            //     } else { // 其他
            //         let cfg = !exterior ? ExteriorSKCfg.instance.getCfgById(petCurrentData[0]) : ExteriorSKCfg.instance.getCfgById(exterior[0])
            //         if (cfg) offset += parseInt(cfg[ExteriorSKFields.title] + "");
            //     }
            // }
            this._transform.localPosition = new Laya.Vector3(0, -offset, 0);
        }

        public teardown(): void {
            if (this._titleType & 1) {
                this.owner
                    .off("visible", this, this.visible)
                    .off("updateTitle", this, this.updateName);
                GlobalData.dispatcher
                    .off(CommonEventType.PLAYER_UPDATE_PK_MODE, this, this.updatePkMode);
                this.property.off("name", this, this.updateName);
                //this._name = this.clearElement(this._name);

                //GameCenter.instance.world.off("removeDeadSkillEffect", this, this.removeDeadDamage)
            }

            if (this._titleType & 2) {
                this.property
                    .off("desgnation", this, this.updateTitle)
                    .off("factionName", this, this.updateFaction)
                //.off("fightTeamName", this, this.updateTeam)
                //.off("rise", this, this.updateRank);
                //this._rank = this.clearElement(this._rank);
                //this._faction = this.clearElement(this._faction);
                //this._Team = this.clearElement(this._Team);
                this._title = this.clearElement(this._title);
            }

            if (this._titleType & 4) {
                GlobalData.dispatcher
                    .off(CommonEventType.VIP_UPDATE, this, this.updatePayTitle)
                    .off(CommonEventType.VIPF_UPDATE, this, this.updatePayTitle)
                    .off(CommonEventType.FIRST_PAY_UPDATE, this, this.updatePayTitle)
                    .off(CommonEventType.MISSION_UPDATE_LV, this, this.updatePayTitle);
                this._vip = this.clearElement(this._vip);
                this._chapter = this.clearElement(this._chapter);
                this._level = this.clearElement(this._level);
            }

            this.property.off("exterior", this, this.updateExterior);
            //this._hpBar = this.clearElement(this._hpBar);
            this._layout = null;

            this.owner.off("abnormal", this, this.abnormal);

            if (this._swimsuitItemView) {
                this._swimsuitItemView.removeSelf();
                //Laya.loader.clearRes(this._imagePath);
            }

        }

        public destory(): void {
            if (this._swimsuitItemView) {
                this._swimsuitItemView.destroy(true);
            }
        }

        public update(): void {
            if (!this._layout && (this._name || this._hpDisplay)) {
                this.resetLayout();
            }

            if (this._layout) {
                this.updateLayout();
            }
        }

        private updateLayout() {
            let pos = this._transform.position;
            let orgX = pos.x;
            let orgY = -pos.y;
            if (!this._swimsuitItemView) {
                return;
            }
            this._swimsuitItemView.pos(orgX - 60, orgY);//更新位置
            for (let i = 0, length = this._layout.length; i < length; ++i) {
                let layout = this._layout[i];
                let w = 0;
                let h = 0;
                orgY -= (layout.space || 0);
                for (let j = 0, length = layout.layer.length; j < length; ++j) {
                    let e = layout.layer[j];
                    w += e.o.width + (e.space || 0);
                    if (e.o.height > h) {
                        h = e.o.height;
                    }
                }
                w /= 2;
                for (let j = 0, length = layout.layer.length; j < length; ++j) {
                    let e = layout.layer[j];
                    e.o.x = orgX - w;
                    e.o.y = orgY - (h - (h - e.o.height) / 2) - (e.padding || 0);
                    w -= e.o.width + (e.space || 0);
                }
                orgY -= h;
            }
        }

        private pushLayout(sprite: Laya.Sprite, vSpace: number, hSpace: number = 0, padding: number = 0): LayoutStruct {
            if (!sprite) {
                return null;
            }
            let result = {
                layer: [{ o: sprite, space: hSpace, padding: padding }],
                space: vSpace
            };
            this._layout.push(result);
            return result;
        }

        private resetLayout() {
            this._layout = [];
            //this.pushLayout(this._hpBar, -30);
            if (!this._name) { /* 给怪物预留的显示 小怪显示血条 */
                return;
            }
            //let layout = this.pushLayout(this._name, 0);
            // if (this._rank) {
            //     layout.layer.unshift({
            //         o: this._rank,
            //         space: 8
            //     });
            // }

            //this.pushLayout(this._faction, 0);
            //this.pushLayout(this._Team, 0);
            if (this._vip) {
                if (this._chapter) {
                    let layout = this.pushLayout(this._vip, 0, -80);
                    layout.layer.unshift({
                        o: this._chapter,
                        space: -45,
                        padding: 1
                    });
                    layout.layer.push({
                        o: this._level,
                        padding: 3,

                    });
                } else {
                    this.pushLayout(this._vip, 0, 0);
                }
            }
            this.pushLayout(this._title, 5);
        }

        private visible(value: boolean): void {

            if (this._name.visible == value) {
                return;
            }
            //this._hpBar && (this._hpBar.visible = value);
            //this._rank && (this._rank.visible = value);
            this._name.visible = value;
            this._faction && (this._faction.visible = value);
            this._swimsuitItemView && (this._swimsuitItemView.faction_bg_img.visible = this._faction.visible);
            //this._Team && (this._Team.visible = value);
            this._title && (this._title.visible = value);
            this._vip && (this._vip.visible = value);
            this._chapter && (this._chapter.visible = value);
            this._level && (this._level.visible = value);

        }


        private updatePkMode(): void {

            switch (this.property.get("type")) {
                case RoleType.Monster: {
                    this._name.color = TileConstant.EnemyColor;
                    break;
                }
                case RoleType.Master: {
                    this._name.color = TileConstant.MasterColor;
                    break;
                }
                case RoleType.Player: {
                    let cfg = SceneCfg.instance.getCfgById(MapUtils.currentID);
                    let model = PlayerModel.instance;
                    if (model.pkMode != 0) {
                        switch (cfg[sceneFields.type]) {
                            case SceneTypeEx.xuanhuoCopy:
                                this._name.color = CommonUtil.isSameTeam(this.property.get("id")) ? TileConstant.OtherColor : TileConstant.EnemyColor;
                                break;
                            default:
                                this._name.color = TileConstant.EnemyColor;
                                break;
                        }
                    } else {
                        this._name.color = TileConstant.OtherColor;
                    }
                    break;
                }
                default: {
                    this._name.color = TileConstant.NpcColor;
                }
            }
        }

        // private updateRank(): void {
        //     let id = this.property.get("rise") || 0;
        //     if (!id) {
        //         this._rank = this.clearElement(this._rank);
        //         return;
        //     }
        //     if (!this._rank) {
        //         this._rank = new modules.common.AtlasImage();
        //         this._rank.atlas = "assets/icon/ui/xian_wei/rise.atlas";
        //         this._layout = null;
        //         GameCenter.instance.world.publish("addToLayer", LayerType.Title, this._rank);
        //     }
        //     let tuple = XianweiRiseCfg.instance.getXianweiRiseByLevel(id);
        //     this._rank.skin = `assets/icon/ui/xian_wei/${tuple[xianwei_riseFields.res]}.png`;
        // }

        private updateName(): void {
            if (!this._name) {
                this._name = this._swimsuitItemView.name_txt;
                this._layout = null;
            }
            this._name.text = this.property.get("name");
        }
        private updateHead(): void {
            if (!this._head) {
                this._head = this._swimsuitItemView.headImg;
                let cMask = new Laya.Sprite();
                cMask.graphics.drawCircle(60, 60, 60, "#ff0000");
                cMask.pos(0, 0);
                this._head.mask = cMask;
            }
            this._head.skin = `assets/icon/head/${CommonUtil.getHeadUrl(Number(this.property.get("headId")) + Number(this.property.get("occ")))}`;
        }

        private updateFaction(): void {
            //let cfg = SceneCfg.instance.getCfgById(MapUtils.currentID);
            // if (cfg[sceneFields.type] == SceneTypeEx.xuanhuoCopy) {
            //     this._faction = this.clearElement(this._faction);
            //     return;
            // }
            let name = this.property.get("factionName");
            if (!name) {
                //this._faction = this.clearElement(this._faction);
                return;
            }
            if (!this._faction) {
                this._faction = this._swimsuitItemView.faction_txt;
                this._faction.visible = true;
                this._swimsuitItemView.faction_bg_img.visible = true;
                this._layout = null;
                this._faction.color = TileConstant.FactionColor;
            }
            this._faction.text = `[盟]${name}`;

        }

        // private updateTeam(): void {
        //     let cfg = SceneCfg.instance.getCfgById(MapUtils.currentID);
        //     if (cfg[sceneFields.type] != SceneTypeEx.xuanhuoCopy) {
        //         this._Team = this.clearElement(this._Team);
        //         return;
        //     }

        //     let name = this.property.get("fightTeamName");
        //     if (!name) {
        //         this._Team = this.clearElement(this._Team);
        //         return;
        //     }
        //     if (!this._Team) {
        //         this._Team = this.initLabel();
        //         this._layout = null;
        //         this._Team.color = TileConstant.FactionColor;
        //     }
        //     this._Team.text = `[战队]${name}`;

        // }

        private clearElement(e: Laya.Sprite): null {
            if (e) {
                e.destroy(true);
                this._layout = null;
            }
            return null;
        }

        private updatePayTitle(): void {
            let lv = MissionModel.instance.curLv;
            let args = BlendCfg.instance.getCfgById(32003)[blendFields.intParam];
            let i = 0;
            let length = args.length;
            while (i < length) {
                if (lv < args[i]) {
                    break;
                }
                i++;
            }
            let last = length - 1;
            if (i == last && FirstPayModel.instance.giveState <= 0) {
                if (!this._vip) {
                    this._vip = new Laya.Image();
                    GameCenter.instance.world.publish("addToLayer", LayerType.Title, this._vip);
                    this._layout = null;
                }
                this._chapter = this.clearElement(this._chapter);
                this._level = this.clearElement(this._level);
                this._vip.skin = `assets/icon/ui/vip/need_first_pay.png`;
            } else if (i < last) {
                if (!this._vip) {
                    this._vip = new Laya.Image();
                    GameCenter.instance.world.publish("addToLayer", LayerType.Title, this._vip);
                    this._chapter = this.initVipLabel(30);
                    this._chapter.align = "right";
                    this._level = this.initVipLabel(40);
                    this._level.width = 65
                    this._level.align = "right";
                    this._layout = null;
                }

                let lv = i + 2;
                this._level.text = VipModel.instance.vipLevel > 0 || VipNewModel.instance.getVipLevelTrue() >= lv ? "" : "  " + lv.toString();
                this._chapter.text = args[i].toString();
                this._chapter.align = "left";
                this._vip.skin = `assets/icon/ui/vip/txtbg_ch_bg.png`;
            } else {
                if (this._vip) {
                    this._vip = this.clearElement(this._vip);
                    this._chapter = this.clearElement(this._chapter);
                    this._level = this.clearElement(this._level);
                }
            }
        }

        private updateTitle(): void {
            let id = this.property.get("desgnation") || 0;
            if (!id) {
                this._title = this.clearElement(this._title);
                return;
            }

            if (!this._title) {
                this._title = new Laya.Image();
                this._layout = null;
                GameCenter.instance.world.publish("addToLayer", LayerType.Title, this._title);
            }
            let config = modules.config.DesignationCfg.instance.getCfgById(id);
            this._title.skin = `assets/icon/ui/designation/${config[designationFields.src]}.png`;
        }

        private initLabel(size: number = 20, stroke: number = 2, strokeColor: string = TileConstant.StrokeColor): Laya.Label {
            let result = new Laya.Label();
            result.fontSize = size;
            result.font = "SimHei";
            result.stroke = stroke;
            result.strokeColor = strokeColor;
            GameCenter.instance.world.publish("addToLayer", LayerType.Title, result);
            return result;
        }

        private initVipLabel(size: number): Laya.Label {
            let result = this.initLabel(size, 2, TileConstant.VipStrokeColor);
            result.italic = true;
            result.bold = true;
            result.color = TileConstant.VipColor;
            result.align = "left";
            return result;
        }

        private abnormal(value: number): void {

        }
    }
}
