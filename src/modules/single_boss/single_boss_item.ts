/**单人boss单元项*/


///<reference path="../config/scene_copy_single_boss_cfg.ts"/>

namespace modules.single_boss {
    import Event = laya.events.Event;
    import Point = Laya.Point;
    import Text = Laya.Text;
    import Button = laya.ui.Button;
    import SignItem = modules.sign.SignItem;
    import PlayerModel = modules.player.PlayerModel;

    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import sign_itemsFields = Configuration.sign_itemsFields;
    import MonsterResFields = Configuration.MonsterResFields;
    import scene_copy_single_bossFields = Configuration.scene_copy_single_bossFields;

    import SingleBossCopy = Protocols.SingleBossCopy;
    import SingleBossCopyFields = Protocols.SingleBossCopyFields;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;
    import CommonUtil = modules.common.CommonUtil;
    import SceneCopySingleBossCfg = modules.config.SceneCopySingleBossCfg;
    import CustomClip = modules.common.CustomClip;


    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import Box = Laya.Box;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import BagUtil = modules.bag.BagUtil;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;

    export class BossItem {
        private _challengeCount: Text;
        private _restTime: Text;
        private _status: BossState;
        private _lockImg: Box;
        private _challengeBtn: Button;
        private _challengeClip: CustomClip;

        constructor(count: Text, restime: Text, lock: Box, chabtn: Button, chaclip: CustomClip) {
            this._challengeCount = count;
            this._restTime = restime;
            this._lockImg = lock;
            this._challengeBtn = chabtn;
            this._challengeClip = chaclip;
        }

        get status(): BossState {
            return this._status;
        }

        set status(value: BossState) {
            if (this._status == value) {
                return;
            }
            this._status = value;
            switch (this._status) {
                case BossState.challenge: {
                    this._challengeCount.color = "#00AD35";
                    this._challengeCount.visible = true;
                    this._restTime.visible = false;
                    this._lockImg.visible = false;
                    this._challengeBtn.visible = true;
                    this._challengeClip.visible = true;
                    break;
                }
                case BossState.bossdead: {
                    this._challengeCount.color = "#00AD35";
                    this._challengeCount.visible = true;
                    this._restTime.visible = true;
                    this._lockImg.visible = false;
                    this._challengeBtn.visible = true;
                    this._challengeClip.visible = false;
                }
                    break;
                case BossState.cantchallenge: {
                    this._challengeCount.visible = false;
                    this._restTime.visible = false;
                    this._lockImg.visible = true;
                    this._challengeBtn.visible = false;
                    this._challengeClip.visible = false;
                }
                    break;
                case BossState.withoutcount: {
                    this._challengeCount.color = "#ab2800";
                    this._challengeCount.visible = true;
                    this._restTime.visible = false;
                    this._lockImg.visible = false;
                    this._challengeBtn.visible = true;
                    this._challengeClip.visible = false;
                }
                    break;

            }
        }
    }

    export class SingleBossItem extends ui.SingleBossItemUI {
        private _startPos: Point;
        private _interval: number;
        private _imgWidth: number;
        private _spaceX: number;
        // private _awardArr: BossItem;
        private _cfg: Array<any>;
        private _resurrectiontime: number;
        private _scale: number;
        // private _challengeClip: CustomClip;
       //  private _items: Array<SignItem>;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._startPos = new Point(171, 40);
            this._imgWidth = 100;
            this._spaceX = 20;
            this._interval = 102;
            this._cfg = new Array<any>();
            this._resurrectiontime = null;
            this._scale = 0.8;

            // this._items = new Array<SignItem>();
            // for (let i = 0; i < 3; i++) {
            //     let baseItem = new SignItem();
            //     baseItem.pos(this._startPos.x + i * this._interval, this._startPos.y);
            //     baseItem.scale(this._scale, this._scale);
            //     // this._items.push(baseItem);
            //     this.addChild(baseItem);
            // }

            // this._challengeClip = new CustomClip();
            // this.challengeBtn.addChildAt(this._challengeClip, 0);
            // this._challengeClip.pos(-5, -16, true);
            // this._challengeClip.scale(0.98,1);
            // this._challengeClip.skin = "assets/effect/btn_light.atlas";
            // this._challengeClip.frameUrls = [
            //     "btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png"
            //     , "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            // this._challengeClip.durationFrame = 5;
            // this._challengeClip.play();
            // this._challengeClip.visible = true;
        }


        protected setData(value: any): void {
            super.setData(value);
            let count: number = value[0] as int;
            // this._awardArr = new BossItem(this.challengeCount, this.resurrectionTime, this.lockImg, this.challengeBtn, this._challengeClip);
            if(value[1] == 3) {
                this.unchallenged.visible = true;
            } else {
                this.unchallenged.visible = false;
            }

            let singleBossDic = SingleBossModel.instance.getSingleBossDic();
            let single: SingleBossCopy = singleBossDic.get(count);


            this._cfg = SceneCopySingleBossCfg.instance.getCfgByLv(count - 1);
            let bossId = this._cfg[scene_copy_single_bossFields.occ];
            let monsterCfg = MonsterResCfg.instance.getCfgById(bossId);
            this.lb_name.text = monsterCfg[MonsterResFields.name];
            this.bossHead.skin = `assets/icon/monster/${monsterCfg[MonsterResFields.icon]}.png`;
            this.eraLevel.text = this._cfg[scene_copy_single_bossFields.eraTips];

            this._resurrectiontime = single[SingleBossCopyFields.reviveTime];

            // let tipsAward = this._cfg[scene_copy_single_bossFields.tipsAward];
            // for (let i = 0; i < this._items.length; i++) {
            //     if (i < tipsAward.length) {
            //         let baseItem = this._items[i];
            //         let item: Protocols.Item = [tipsAward[i][sign_itemsFields.itemId], 0, 0, null];
            //         baseItem.dataSource = item;
            //     }
            // }
        }

        protected onOpened(): void {
            super.onOpened();

            // if (this.index === 0) {
            //     this.regGuideSpr(GuideSpriteId.SINGLE_BOSS_ITEM0_CHALLENGE_BTN, this.challengeBtn);
            // }
        }

        public close(): void {
            super.close();
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }
    }
}