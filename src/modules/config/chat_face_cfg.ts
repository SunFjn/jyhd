namespace modules.config {
    import chatExpression = Configuration.chatExpression;
    import chatExpressionFields = Configuration.chatExpressionFields;

    export class ChatFaceCfg {
        private static _instance: ChatFaceCfg;
        public static get instance(): ChatFaceCfg {
            return this._instance = this._instance || new ChatFaceCfg();
        }

        private _tab: Table<chatExpression>[];
        private _tab1: Table<chatExpression>;
        private _ids: number[][];
        private _chatFaceRegExp: Array<Array<RegExp>>;
        private _imgs: string[][];

        constructor() {
            this.init();
        }

        private init(): void {

            this._tab = [{}, {}];
            this._tab1 = {};

            let arr: chatExpression[] = GlobalData.getConfig("chat_expression");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let row = arr[i];
                this._tab[row[chatExpressionFields.type]][row[chatExpressionFields.id]] = row;
                this._tab1[row[chatExpressionFields.id]] = row;
            }

            this._ids = [[], []];
            this._chatFaceRegExp = [[], []];
            this._imgs = [[], []];
            this.initChatFace(0);
            this.initChatFace(1);
        }

        private initChatFace(type: number): void {
            let tab = this._tab[type];
            let ids = this._ids[type];
            let regs = this._chatFaceRegExp[type];
            let imgs = this._imgs[type];
            for (let key in tab) {
                ids.push(parseInt(key));
                regs.push(new RegExp(tab[key][chatExpressionFields.name], "ig"));
                imgs.push(`<img src="assets/icon/expression/${key}.png" width="40" height="36"/>`);
            }
        }

        // 0普通 1vip
        public getCfgByTypeAndId(type: int, id: int): chatExpression {
            return this._tab[type][id];
        }

        public getCfgById(id: int): chatExpression {
            return this._tab1[id];
        }

        public getFaceIdsByType(type: int): number[] {
            return this._ids[type];
        }

        public getFaceNamesByType(type: int): Array<RegExp> {
            return this._chatFaceRegExp[type];
        }

        public getFaceImgsByType(type: int): Array<string> {
            return this._imgs[type];
        }
    }
}
