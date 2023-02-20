
namespace modules.soaring_rank {
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
    import SoaringRankCfg = modules.config.SoaringRankCfg;
    import feisheng_rankFields = Configuration.feisheng_rankFields;
    import FeishengRankInfo = Protocols.FeishengRankInfo;
    import FeishengRankInfoFields = Protocols.FeishengRankInfoFields;
    /*历史记录返回数据*/
    import GetSprintRankBeforeReply = Protocols.GetSprintRankBeforeReply;
    import GetSprintRankBeforeReplyFields = Protocols.GetSprintRankBeforeReplyFields;
    export class SoaringRankJieZhiAlert extends ui.SoaringRankJieZhiAlertUI {
        private _list: CustomList;
        private _type: int;/*榜类型*/
        private _param: int;/*参数*/
        private _allMingCiArr: Array<any>;

        constructor() {
            super();
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

            this.StatementHTML.color = "#585858";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 24;
            this.StatementHTML.style.align = "left";

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.hCount = 1;
            this._list.spaceY = 4;
            this._list.itemRender = SoaringRankJieZhiItem;
            this._list.width = 530;
            this._list.height = 336;
            this.borderImg.addChild(this._list);
            this._list.pos(16, 15);


        }

        protected addListeners(): void {
            super.addListeners();
        }

        public onOpened(): void {
            super.onOpened();

        }
        setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._type = value;
            if (this._type == 0) {
                this._param = modules.sprint_rank.SprintRankModel.instance._LiShiparam;//去开服冲榜 模块里面去数据
                localStorage.setItem(localStorageStrKey.SprintRankModel, `${GlobalData.serverTime}`);
            }
            else {
                this._param = modules.soaring_rank.SoaringRankModel.instance._LiShiparam;//去封神榜 模块里面去数据
                localStorage.setItem(localStorageStrKey.SoaringRankModel, `${GlobalData.serverTime}`);
            }
            this.showUI();
        }
        public showUI() {
            let timeStr = ``;
            let nameSTR = ``;
            if (this._type == 0) {  //开服冲榜
                nameSTR = this.getNameByType(this._param);
                
                this.myRankNumText.text = `未上榜`;
                let myRank = modules.sprint_rank.SprintRankModel.instance._LiShiNodeListByObjid[modules.player.PlayerModel.instance.actorId]
                if (myRank) {
                    this.myRankNumText.text = `第${myRank[FeishengRankInfoFields.rank]}名`;
                }
                timeStr = this.timeStampToDate(modules.sprint_rank.SprintRankModel.instance._LiShiparamTime);
            }
            else {  //封神榜
                let shuju = SoaringRankCfg.instance.getCfgsByGrade(this._param, 0);
                let type = shuju[feisheng_rankFields.type];
                nameSTR = this.getNameByTypeFeiShen(type);
                this.myRankNumText.text = `未上榜`;
                let myRank = modules.soaring_rank.SoaringRankModel.instance._LiShiNodeListByObjid[modules.player.PlayerModel.instance.actorId]
                if (myRank) {
                    this.myRankNumText.text = `第${myRank[FeishengRankInfoFields.rank]}名`;
                }
                timeStr = this.timeStampToDate(modules.soaring_rank.SoaringRankModel.instance._LiShiparamTime);
            }

            this.StatementHTML.innerHTML = `${timeStr}<span style='color:#168a17'>${nameSTR}</span>排名已截止`;

            this._allMingCiArr = new Array<any>();
            for (var index = 1; index <= 10; index++) {
                this._allMingCiArr.push([index, this._type]);
            }
            if (this._allMingCiArr) {
                this._list.datas = this._allMingCiArr;
            }
        }
        public getNameByType(type: number): string {
            let str = ``;
            switch (type) {
                case 1:
                    str = `精灵榜`;
                    break;
                case 2:
                    str = `宠物榜`;
                    break;
                case 3:
                    str = `幻武榜`;
                    break;
                case 4:
                    str = `翅膀榜`;
                    break;
                case 5:
                    str = `技能榜`;
                    break;
                case 6:
                    str = `装备榜`;
                    break;
                case 7:
                    str = `战力榜`;
                    break;
                default:
                    break;
            }
            return str;
        }
        public getNameByTypeFeiShen(type: number): string {
            let str = ``;
            switch (type) {
                case 1:
                    str = `精灵培养` + `封神榜`;
                    break;
                case 2:
                    str = `宠物培养` + `封神榜`;
                    break;
                case 3:
                    str = `幻武升级` + `封神榜`;
                    break;
                case 4:
                    str = `翅膀升级` + `封神榜`;
                    break;
                case 5:
                    str = `物华天宝` + `封神榜`;
                    break;
                case 6:
                    str = `时装升级` + `封神榜`;
                    break;
                case 7:
                    str = `神兽升级` + `封神榜`;
                    break;
                default:
                    break;
            }
            return str;
        }
        public timeStampToDate(ms: number): string {
            let date: Date = new Date(ms);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            let monthStr = `` + month;
            if (month < 10) {
                monthStr = `0${month}`;
            }
            let dayStr = `` + day;
            if (day < 10) {
                dayStr = `0${day}`;
            }
            let str: string = `${year}年${monthStr}月${dayStr}日`;
            return str;
        }
    }
}