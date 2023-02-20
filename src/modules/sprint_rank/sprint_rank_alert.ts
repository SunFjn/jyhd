/** 开服冲榜排行榜弹框*/





namespace modules.mission {
    import ThreeWorldsRankUI = ui.ThreeWorldsRankUI;
    import CustomList = modules.common.CustomList;
    import SprintRankModel = modules.sprint_rank.SprintRankModel;
    import SprintRankNode = Protocols.SprintRankNode;
    import SprintRankInfo = Protocols.SprintRankInfo;
    import SprintRankNodeFields = Protocols.SprintRankNodeFields;
    import SprintRankInfoFields = Protocols.SprintRankInfoFields;
    import springRankItem = modules.spring_rank.springRankItem;
    import SprintRankTaskModel = modules.sprint_rank.SprintRankTaskModel;
    import SprintRankTaskNodeFields = Protocols.SprintRankTaskNodeFields;
    import SprintRankCtrl = modules.sprint_rank.SprintRankCtrl;
    import SprintRankTaskCtrl = modules.sprint_rank.SprintRankTaskCtrl;


    export class SprintRankAlert extends ThreeWorldsRankUI {

        private _list: CustomList;
        private _rankType: RankType;
        private curType: number = 0;
        //当前选中的榜单
        private _type: number = 0;
        private _rankName: string[] = [];

        constructor() {
            super();
            this._rankName.push("", "精灵排行", "宠物排行", "幻武排行", "翅膀排行", "技能排行", "装备排行", "战力排行");
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }


        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.hCount = 1;
            this._list.spaceY = 4;
            this._list.itemRender = springRankItem;
            this._list.width = 530;
            this._list.height = 550;
            this._list.pos(68, 184, true);
            this.addChild(this._list);

            this.titleTxt.text = "";
            this.bgImg.height = this.height = 864;
            this.okBtn.destroy();

            this.awardTxt.text = "";
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, Laya.Event.CLICK, this, this.close);
            //this.addAutoListener(GlobalData.dispatcher, CommonEventType.SPRINT_RANK_UPDATE, this, this.updateRank, [this._type]);
        }

        public onOpened(): void {
            super.onOpened();
            SprintRankTaskCtrl.instance.getSprintRankInfo();
            SprintRankCtrl.instance.getSprintRankAllInfo();

            //this.titleTxt.text=this._rankName[this.curType-1];
            this.awardTxt.text = "战力";
            // switch (this.curType){
            //     case 1:
            //         this.titleTxt.text = "精灵排行";
            //         break;
            //     case 2:
            //         this.titleTxt.text = "宠物排行";
            //         break;
            //     case 3:
            //         this.titleTxt.text = "幻武排行";
            //         break;
            //     case 4:
            //         this.titleTxt.text = "翅膀排行";
            //         break;
            //     case 5:
            //         this.titleTxt.text = "圣物排行";
            //         break;
            //     case 6:
            //         this.titleTxt.text = "装备排行";
            //         break;
            //     case 7:
            //         this.titleTxt.text = "战力排行";
            //         break;
            // }
        }

        setOpenParam(value: any): void {
            this._type = value;
            super.setOpenParam(value);
            this.updateRank(this._type);
        }

        private updateRank(type: number): void {
            let textStr = this._rankName[type];
            textStr = textStr ? textStr : "排行";
            this.titleTxt.text = `${textStr}`;
            let _taskList = SprintRankTaskModel.instance.taskList;
            let rankParam: number = 0;
            if (_taskList[type]) {
                rankParam = _taskList[type][SprintRankTaskNodeFields.rankParam]
            }
            let rankeList: Array<SprintRankNode> = SprintRankModel.instance.rankList;
            this.curType = SprintRankModel.instance.curType;
            let nodeList: Array<SprintRankInfo>;
            if (rankeList[type]) {
                nodeList = rankeList[type][SprintRankNodeFields.nodeList];
            } else {
                nodeList = [];
            }
            //if(!nodeList.length) return;
            let listDatas: Array<SprintRankInfo> = [];
            let myRank: SprintRankInfo = null;
            let rankId: number = 0;
            for (let i: int = 0; i < 20; i++) {
                listDatas[i] = [i + 1, null, null, null];
            }
            for (let i: int = 0; i < nodeList.length; i++) {
                if (nodeList[i][SprintRankInfoFields.objId] === PlayerModel.instance.actorId) {
                    myRank = nodeList[i];
                }
                rankId = nodeList[i][SprintRankInfoFields.rank] - 1;
                listDatas[rankId] = nodeList[i];
            }
            this._list.datas = listDatas;
            this.myRankTxt.text = `我的排名：${myRank === null ? "未上榜" : myRank[SprintRankInfoFields.rank]}`;
            this.myDamageTxt.text = `我的战力：${myRank === null ? rankParam : myRank[SprintRankInfoFields.param]}`;
        }
    }
}