namespace modules.chat {
    import ChatMarkedWordsViewUI = ui.ChatMarkedWordsViewUI;
    import BlendCfg = modules.config.BlendCfg;
    import CustomList = modules.common.CustomList;
    import Event = Laya.Event;

    export class ChatMarkedWordsPanel extends ChatMarkedWordsViewUI {

        private _list: CustomList;

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.bottom = 181;

            this._list = new CustomList();
            this._list.width = 490;
            this._list.height = 323;
            this._list.hCount = 1;
            this._list.itemRender = ChatMarkedWordsItem;
            this._list.x = 10;
            this._list.y = 12;
            this._list.spaceY = 5;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(Laya.stage, Event.MOUSE_DOWN, this, this.stageClickHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        public onOpened(): void {
            super.onOpened();

            let strs: string[] = BlendCfg.instance.chatMarkedWords;

            let nums: number[] = [];
            let value: [string, int][] = [];

            for (let i: int = 0, len: int = strs.length; i < len; i++) {
                nums.push(i);
            }

            for (let i: int = 0; i < 8; i++) {
                let index: number = Math.floor(Math.random() * nums.length);
                value.push([strs[nums[index]], nums[index]]);  //值 索引
                nums.splice(index, 1);
            }

            this._list.datas = value;
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

        }

        private stageClickHandler(e: Event): void {

            if (!(e.target instanceof ChatMarkedWordsItem) && e.target !== this._list && e.target !== this) {
                this.close();
            }
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }
    }
}