/**战斗过程中的list显示 */



namespace modules.bossHome {
    import Panel = Laya.Panel;
    import Image = Laya.Image;
    import CustomList = modules.common.CustomList;
    import Event = Laya.Event;
    import Button = Laya.Button;
    import Text = Laya.Text;
    import PlayerModel = modules.player.PlayerModel;
    import BossDungeonModel = modules.bossDungeon.BossDungeonModel;

    export class BossHomeList extends Panel {

        private _showPanel: Panel;
        private _txt: Text;
        private _bg: Image;
        private _interImg: Image;
        private _btn: Button;
        private _list: CustomList;
        private _isShowList: boolean;
        private _data: Array<number | [number, string, number]>; //0为普通玩家，1为拥有者，2为攻击者，3拥有且被攻击
        private _isPlayer: boolean;
        private _meId: number;
        private _selectId: number;
        private _selectIndex: number;

        constructor() {
            super();
            this._isShowList = false;
            this._showPanel = new Panel();
            this.addChild(this._showPanel);
            this._showPanel.pos(0, 0);

            this._bg = new Image('common_sg/9g_tongyong_10.png');
            this._showPanel.addChild(this._bg);
            this._bg.x = 0;
            this._bg.sizeGrid = '12,12,12,12,1';

            this._txt = new Text();
            this._showPanel.addChild(this._txt);
            this._txt.pos(95, 14);
            this._txt.font = 'SimHei';
            this._txt.fontSize = 20;
            this._txt.color = '#ffffff';

            this._interImg = new Image('common_sg/split_common_fgx3.png');
            this._showPanel.addChild(this._interImg);
            this._interImg.pos(12, 42);

            this._btn = new Button('common/btn_tonyong_28.png', '');
            this._showPanel.addChild(this._btn);
            this._btn.stateNum = 1;
            this._btn.pos(230, 16);

            this._list = new CustomList();
            this._showPanel.addChild(this._list);
            this._list.x = 7;
            this._list.y = 43;
            this._list.scrollDir = 1;
            this._list.hCount = 1;
            this._list.spaceY = -1;
            this.bottom = 238;

            this._meId = 0;
            this._selectId = this._selectIndex = -1;

            this.on(Event.DISPLAY, this, this.displayHandler);
            this.on(Event.UNDISPLAY, this, this.undisplayHandler);
        }

        protected displayHandler(): void {
            this._btn.on(Event.CLICK, this, this.downHandler);
            this._list.on(Event.SELECT, this, this.selectHandler);
            GlobalData.dispatcher.on(CommonEventType.BOSS_SHOW_PLAYER_INFO, this, this.updatePlayerShow);
            GlobalData.dispatcher.on(CommonEventType.BOSS_OWN_UPDATE, this, this.updatePlayerShow);
            GlobalData.dispatcher.on(CommonEventType.BOSS_ATTACK_UPDATE, this, this.updatePlayerShow);
        }

        protected undisplayHandler(): void {
            this._btn.off(Event.CLICK, this, this.downHandler);
            this._list.off(Event.SELECT, this, this.selectHandler);
            GlobalData.dispatcher.off(CommonEventType.BOSS_SHOW_PLAYER_INFO, this, this.updatePlayerShow);
            GlobalData.dispatcher.off(CommonEventType.BOSS_OWN_UPDATE, this, this.updatePlayerShow);
            GlobalData.dispatcher.off(CommonEventType.BOSS_ATTACK_UPDATE, this, this.updatePlayerShow);
        }

        private downHandler(): void {
            if (this._isShowList) {
                this._isShowList = false;
                this._bg.height = this.height = this._showPanel.height = 90;
                this._list.height = 40;
                this._list.vCount = 1;
                this._btn.skin = 'common/btn_tonyong_29.png';
            } else {
                this._isShowList = true;
                this._list.height = 184;
                this._list.vCount = 5;
                this._bg.height = this.height = this._showPanel.height = 234;
                this._btn.skin = 'common/btn_tonyong_28.png';
            }
            this._list.datas = this._data;
        }

        private updatePlayerShow(): void {
            if (!this._isPlayer) {
                return;
            }

            let model = BossDungeonModel.instance;
            let own: Array<[number, string, number]> = [];
            let attack: Array<[number, string, number]> = [];
            let attacked: Array<[number, string, number]> = [];
            let common: Array<[number, string, number]> = [];

            let datas: Array<[number, string]> = BossDungeonModel.instance.getPlayerInfo();
            for (let data of datas) {
                let id = data[0];
                if (!model.isSelectBossOwner(id)) {  //不是归属
                    if (id != this._meId) { //不是本人
                        if (model.playerIsMeAttack(id)) { //是自身攻击的
                            attack.push([data[0], data[1], 2]);
                        } else {//不自身攻击
                            if (model.playerIsAttackMe(id)) {//是攻击自身的
                                attacked.push([data[0], data[1], 2]);
                            } else {//最平常的
                                common.push([data[0], data[1], 0]);
                            }
                        }
                    } /*else {
                        common.push([data[0], data[1], 0]);
                    }*/
                } else {//拥有者
                    let isBattle = model.playerIsMeAttack(id) || BossDungeonModel.instance.playerIsAttackMe(id);
                    own.push([data[0], data[1], isBattle ? 3 : 1]);
                }
            }
            let arr = own.concat(attack, attacked, common);
            this._list.datas = arr;
            this._data = arr;
            this.getIndexById();
        }

        //根据id获取对应的显示index
        private getIndexById(): void {
            if (this._selectId > 0 && this._data && this._data.length > 0) {
                for (let i = 0; i < this._data.length; i++) {
                    let temp = this._data[i] as [number, string, number];
                    if (this._selectId == temp[0]) {
                        if (this._list.selectedIndex != i) {
                            this._list.selectedIndex = i;
                            this._selectIndex = i;
                        }
                    }
                }
            }
        }

        //抛出选择项
        private selectHandler(): void {
            if (this._list.selectedIndex == -1) {
                return;
            }
            if (this._isPlayer) {
                let temp = this._data[this._list.selectedIndex] as [number, string, number];
                if (temp[0] == this._meId) {
                    this._list.selectedIndex = this._selectIndex;
                    return;
                }
                if (this._selectId != temp[0]) {
                    this._selectId = temp[0];
                    this._selectIndex = this._list.selectedIndex;
                    BossHomeModel.instance.setSelectTarget(this._selectId, false);
                }
            } else {
                let temp = this._data[this._list.selectedIndex] as number;
                BossHomeModel.instance.setSelectTarget(temp, true);
            }
        }


        public setWidth(value: number): void {
            this.width = this._showPanel.width = this._bg.width = value;
            this._list.width = value - 10;
            this._interImg.width = value - 20;
            this._btn.x = value - 40;
        }

        public initSelectIndex(): void {
            this._list.selectedIndex = -1;
            this._selectId = -1;
            this._selectIndex = -1;
        }


        public setShowName(value: string): void {
            this._txt.text = value;
        }

        public destroy(): void {
            this.undisplayHandler();
            this.off(Event.DISPLAY, this, this.displayHandler);
            this.off(Event.UNDISPLAY, this, this.undisplayHandler);
            super.destroy(true);
        }

        public setCenter(value: number): void {
            this.centerX = value;
        }

        public setPlayerData(): void {
            this._isPlayer = true;
            this._list.itemRender = PlayerListItem;
            this._meId = PlayerModel.instance.actorId;
            this._txt.x = 70;
            this.updatePlayerShow();
            this.downHandler();
        }

        public setBossData(value: any): void {
            this._isPlayer = false;
            this._list.itemRender = BossListItem;
            this._list.datas = value;
            this._data = value;
            this._txt.x = 95;
            this.downHandler();
        }
    }
}