/** */
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/pay_reward_weight_cfg.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
///<reference path="../config/blend_cfg.ts"/>
///<reference path="../config/scene_home_boss_cfg.ts"/>
///<reference path="../config/monster_res_cfg.ts"/>
///<reference path="../dungeon/dungeon_model.ts"/>
///<reference path="../../utils/table_utils.ts"/>
///<reference path="../config/item_material_cfg.ts"/>
///<reference path="../common/num_input_ctrl.ts"/>
///<reference path="../bag/base_item.ts"/>
///<reference path="../bag/bag_model.ts"/>
///<reference path="../config/get_way_cfg.ts"/>
///<reference path="../common_alert/lack_prop_alert.ts"/>
///<reference path="../faction/faction_ctrl.ts"/>
///<reference path="../config/scene_temple_boss_cfg.ts"/>
///<reference path="../boss_dungeon/boss_dungeon_ctrl.ts"/>
///<reference path="../boss_dungeon/boss_dungeon_model.ts"/>
namespace modules.xuanhuo {
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import BossInfo = Protocols.BossInfo;
    import BossInfoFields = Protocols.BossInfoFields;
    import CommonUtil = modules.common.CommonUtil;
    import ItemFields = Protocols.ItemFields;
    import BagModel = modules.bag.BagModel;
    import PlayerModel = modules.player.PlayerModel;
    import BagUtil = modules.bag.BagUtil;
    import BossDungeonModel = modules.bossDungeon.BossDungeonModel;
    export class XuanhuoBossModel {
        private static _instance: XuanhuoBossModel;
        public static get instance(): XuanhuoBossModel {
            return this._instance = this._instance || new XuanhuoBossModel();
        }
        public _bollTips: boolean;//本次登录是否提示玩家勾选
        public _bollZiDong: boolean;//本次登录的自动购买勾选状态

        private _nowCeng: number;//当前所在层数
        private _item: Protocols.Item;
        private _itemId: number;
        private _maxTiLi: number;
        private _stength: number = 0;
        private _zengJiaNum: number = 0;
        private _tipsNum: number = 0;
        public _moRengCeng: number;//默认展开的层

        public _isDummy: boolean = false;//是否是待机状态

        private _nameZhuanHuan: Array<string>;
        constructor() {
            this._itemId = BlendCfg.instance.getCfgById(58001)[blendFields.intParam][0];
            this._item = [this._itemId, 1, 0, null];
            this._maxTiLi = BlendCfg.instance.getCfgById(58003)[blendFields.intParam][0];
            this._zengJiaNum = BlendCfg.instance.getCfgById(58004)[blendFields.intParam][0];
            this._tipsNum = BlendCfg.instance.getCfgById(58005)[blendFields.intParam][0];
            this._bollTips = false;
            this._bollZiDong = false;
            this._nowCeng = 1;
            this._stength = 0;
            this._zengJiaNum = 50;
            this._moRengCeng = 1;
            this._nameZhuanHuan = [
                "圣殿0层",
                "圣殿一层",
                "圣殿二层",
                "圣殿三层",
                "圣殿四层",
                "圣殿五层",
                "圣殿六层",
                "圣殿七层",
                "圣殿八层",
                "圣殿九层",
                "圣殿十层",
            ]
        }

        public get tipsNum(): int {
            return this._tipsNum;
        }

        public set tipsNum(value: int) {
            this._tipsNum = value;
        }
        public get itemId(): int {
            return this._itemId;
        }

        public set itemId(value: int) {
            this._itemId = value;
        }
        public get nowCeng(): int {
            return this._nowCeng;
        }

        public set nowCeng(value: int) {
            this._nowCeng = value;
        }
        public get stength(): int {
            return this._stength;
        }

        public set stength(value: int) {
            this._stength = value;
        }
        /**
         * 最大体力
         */
        public get maxTiLi(): int {
            return this._maxTiLi;
        }

        public set maxTiLi(value: int) {
            this._maxTiLi = value;
        }
        //根据BOSSID获取服务器BOSS信息
        public getBossSeversInfoById(bossId: int): BossInfo {
            return DungeonModel.instance.getBossInfoById(bossId);
        }

        //根据对应id获取总boss表中信息
        public getCfgByid(id: number): MonsterRes {
            // console.log("根据对应id获取总boss表中信息",id)
            return MonsterResCfg.instance.getCfgById(id);
        }

        //设置选择的目标
        public setSelectTarget(id: number, isBoss: boolean): void {
            console.log("选择目标", id, isBoss, DungeonModel.instance.getBossInfoById(id))
            let model = PlayerModel.instance;
            if (id == -1) {
                model.selectTarget(SelectTargetType.Monster, -1);
                GlobalData.dispatcher.event(CommonEventType.BOSS_OWN_UPDATE);
            } else {
                this._isDummy = false;
                if (isBoss) {
                    if (DungeonModel.instance.getBossInfoById(id)) {
                        
                        BossDungeonModel.instance.selectTargetPos = DungeonModel.instance.getBossInfoById(id)[BossInfoFields.pos];
                        BossDungeonModel.instance.selectLastBoss = id;
                        model.selectTarget(SelectTargetType.Monster, id);
                    }
                    else {
                        console.log("拿不到信息");
                        modules.notice.SystemNoticeManager.instance.addNotice(`BOSS: ${id} 拿不到信息`, true);
                    }
                    GlobalData.dispatcher.event(CommonEventType.BOSS_OWN_UPDATE);
                }
                else {
                    console.log("打玩家");
                    model.selectTarget(SelectTargetType.Player, id);
                }
            }
        }

        public getName(ceng: number, isWai: boolean): string {
            let str = ``;
            str = this._nameZhuanHuan[ceng];
            return str;
        }
        // public addHandler(): void {
        //     if (!this._item) return;
        //     let itemId: number = this._item[ItemFields.ItemId];
        //     let TiLiDanNum = BagModel.instance.getItemCountById(XuanhuoBossModel.instance.itemId);
        //     if (TiLiDanNum > 0) {
        //         let count: number = 1;
        //         let nowTili = this.stength;
        //         let allTili = this.maxTiLi;
        //         if (nowTili != allTili) {
        //             if (((count * this._zengJiaNum) + nowTili) > allTili) {
        //                 CommonUtil.alert("温馨提示", '使用后体力溢出,溢出部分不保留,是否确定？', [Handler.create(this, this.useHandler)], [null], true);
        //             }
        //             else {
        //                 // ShenYuBossCtrl.instance.UseStrengthItem(1);
        //                 // BagCtrl.instance.useBagItemByIdUid(itemId, this._item[ItemFields.uid], count);
        //             }
        //         }
        //         else {
        //             modules.notice.SystemNoticeManager.instance.addNotice("当前体力值已满，无需使用体力丹", true);
        //         }
        //     }
        //     else {
        //         BagUtil.openLackPropAlert(XuanhuoBossModel.instance.itemId, 1);
        //     }

        // }
        // public useHandler() {
        //     // ShenYuBossCtrl.instance.UseStrengthItem(1);
        // }
    }
}