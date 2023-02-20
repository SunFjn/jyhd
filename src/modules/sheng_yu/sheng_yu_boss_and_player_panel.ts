///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/scene_copy_cloudland.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
///<reference path="../config/scene_temple_boss_cfg.ts"/>
namespace modules.sheng_yu {
    import CustomList = modules.common.CustomList;
    import Event = Laya.Event;
    import ClasSsceneTempleBossCfg = modules.config.ClasSsceneTempleBossCfg;
    import scene_temple_boss = Configuration.scene_temple_boss;
    import scene_temple_bossFields = Configuration.scene_temple_bossFields;
    import PlayerModel = modules.player.PlayerModel;
    import BossDungeonModel = modules.bossDungeon.BossDungeonModel;
    export class ShengYuBossAndPlayerListPanel extends ui.ShengYuBossAndPlayerListViewUI {
        private _list: CustomList;
        private _listPlayer: CustomList;
        private _listState: boolean = true;
        private _listPlayerState: boolean = true;
        private _meId: number;
        private _data: Array<number | [number, string, number]>; //0为普通玩家，1为拥有者，2为攻击者，3拥有且被攻击
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.right = 6;
            this.bottom = 265;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;
            this._list = new CustomList();
            this._list.width = 260;
            this._list.height = 115;
            this._list.hCount = 1;
            this._list.itemRender = ShengYuBossListItemItem;
            this._list.x = 290;
            this._list.y = 36;
            this._list.selectedIndex = -1;
            this.addChild(this._list);

            this._listPlayer = new CustomList();
            this._listPlayer.width = 290;
            this._listPlayer.height = 115;
            this._listPlayer.hCount = 1;
            this._listPlayer.itemRender = ShengYuBossPlayerListItemItem;
            this._listPlayer.x = 0;
            this._listPlayer.y = 36;
            this._listPlayer.selectedIndex = -1;
            this.addChild(this._listPlayer);

            this._meId = 0;
            BossDungeonModel.instance.isInScene = true;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.expandBtn, Event.CLICK, this, this.expandBtnHandler);
            this.addAutoListener(this._list, Event.SELECT, this, this.selectHandler);

            this.addAutoListener(this.expandPlayerBtn, Event.CLICK, this, this.expandPlayerBtnHandler);
            this.addAutoListener(this._listPlayer, Event.SELECT, this, this.listPlayerHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SHENG_YU_BOSS_SCENE_UPDATE, this, this.updateBossInfo);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BOSS_OWN_UPDATE, this, this.updatePlayerInfo);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BOSS_ATTACK_UPDATE, this, this.updatePlayerInfo);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BOSS_SHOW_PLAYER_INFO, this, this.updatePlayerInfo);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BOSS_UPDATE, this, this.noneWhileOneHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();
            ShenYuBossCtrl.instance.nowCengShu();
            this._list.selectedIndex = -1;
            this._listPlayer.selectedIndex = -1;
            this._meId = PlayerModel.instance.actorId;
            this.updateBossInfo(true);
            this.updatePlayerInfo();
            Laya.timer.loop(1000, BossDungeonModel.instance, BossDungeonModel.instance.loopHandler);
            BossDungeonModel.instance.isInScene = true;
            this._listState = false;
            this._listPlayerState = false;
            this.changUI();
            this.changPlayerUI();
        }

        private selectHandler(): void {
            if (this._list.selectedIndex == -1) {
                return;
            }
            this._listPlayer.selectedIndex = -1;
            // console.log("list 点击选择的位置： " + this._list.selectedIndex);
        }

        public expandBtnHandler(): void {
            if (this._listState) {
                this._listState = false;
            } else {
                this._listState = true;
            }
            this.changUI();
        }

        private listPlayerHandler(): void {
            if (this._listPlayer.selectedIndex == -1) {
                return;
            }
            this._list.selectedIndex = -1;
            // console.log("list 点击选择的位置： " + this._list.selectedIndex);
        }

        public expandPlayerBtnHandler(): void {
            if (this._listPlayerState) {
                this._listPlayerState = false;
            } else {
                this._listPlayerState = true;
            }
            this.changPlayerUI();
        }
        /**
         * 改变展示大小
         */
        public changUI() {
            if (this._listState) {
                this.bgImg.height = 155;
                this.bgImg.y = 0;
                this._list.height = 115;
                this._list.y = 36;
                this.titleText.y = 12;
                this.expandBtn.y = 13;
                this.expandBtn.skin = "common/btn_tonyong_28.png";
            } else {
                this.bgImg.height = 76;
                this.bgImg.y = 78;
                this._list.height = 43;
                this._list.y = 108;
                this.titleText.y = 88;
                this.expandBtn.y = 87;
                this.expandBtn.skin = "common/btn_tonyong_29.png";
            }
            this.updateBossInfo();
        }


        public changPlayerUI() {
            if (this._listPlayerState) {
                this.bgPlayerImg.height = 155;
                this.bgPlayerImg.y = 0;
                this._listPlayer.height = 115;
                this._listPlayer.y = 36;
                this.titleText1.y = 12;
                this.expandPlayerBtn.y = 13;
                this.expandPlayerBtn.skin = "common/btn_tonyong_28.png";
            } else {
                this.bgPlayerImg.height = 76;
                this.bgPlayerImg.y = 78;
                this._listPlayer.height = 43;
                this._listPlayer.y = 108;
                this.titleText1.y = 88;
                this.expandPlayerBtn.y = 87;
                this.expandPlayerBtn.skin = "common/btn_tonyong_29.png";
            }
            this.updatePlayerInfo();
        }
        /**
         * name
         */
        public playerBoss() {
            let nossId = DungeonModel.instance.getLiveBoss();
            ShengYuBossModel.instance.setSelectTarget(nossId, true);
        }
        public noneWhileOneHandler() {
            if (BossDungeonModel.instance.searchBossIds) {
                this.playerBoss();
            }
        }
        public updateBossInfo(bolll: boolean = false): void {
            //测试数据
            let infos = ClasSsceneTempleBossCfg.instance.getBossInfoByGrade(ShengYuBossModel.instance.nowCeng);
            infos.sort(this.sortOverd.bind(this));
            this._list.datas = infos;
            if (bolll) {
                if (infos) {
                    let occArr = new Array<number>();
                    for (let index = 0; index < infos.length; index++) {
                        let element = infos[index];
                        if (element) {
                            let occ = element[scene_temple_bossFields.occ]
                            occArr.push(occ);
                        }
                    }
                    BossDungeonModel.instance.searchBossIds = occArr;
                    BossDungeonModel.instance.searchBossType = SCENE_ID.scene_temple_boss;
                    this.playerBoss();
                }
            }
        }
        public sortOverd(A: scene_temple_boss, B: scene_temple_boss): number {
            let areaIdA = A[scene_temple_bossFields.areaId];
            let areaIdB = B[scene_temple_bossFields.areaId];
            if (areaIdA > areaIdB) {
                return 1
            }
            else {
                return -1
            }
        }

        private updatePlayerInfo(): void {
            let own: Array<[number, string, number]> = [];
            let attack: Array<[number, string, number]> = [];
            let attacked: Array<[number, string, number]> = [];
            let common: Array<[number, string, number]> = [];

            let datasPlayer: Array<[number, string]> = BossDungeonModel.instance.getPlayerInfo();
            for (let data of datasPlayer) {
                let id = data[0];
                if (!BossDungeonModel.instance.isSelectBossOwner(id)) {  //不是当前等选择BOSS的拥有者
                    if (id != this._meId) { //玩家自身,不需要任何操作
                        if (BossDungeonModel.instance.playerIsMeAttack(id)) { //是自身攻击的
                            attack.push([data[0], data[1], 2]);
                        } else {//不自身攻击
                            if (BossDungeonModel.instance.playerIsAttackMe(id)) {//是攻击自身的
                                attacked.push([data[0], data[1], 2]);
                            } else {//最平常的
                                common.push([data[0], data[1], 0]);
                            }
                        }
                    } /*else {
                        common.push([data[0], data[1], 0]);
                    }*/
                } else {//拥有者
                    let isBattle = BossDungeonModel.instance.playerIsMeAttack(id) || BossDungeonModel.instance.playerIsAttackMe(id);
                    own.push([data[0], data[1], isBattle ? 3 : 1]);
                }
            }
            let arr = own.concat(attack, attacked, common);
            this._listPlayer.datas = arr;
            this._data = arr;
        }

        public close(): void {
            Laya.timer.clear(BossDungeonModel.instance, BossDungeonModel.instance.loopHandler);
            BossDungeonModel.instance.resetShuJu();
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._listPlayer = this.destroyElement(this._listPlayer);
            super.destroy(destroyChild);
        }
    }
}