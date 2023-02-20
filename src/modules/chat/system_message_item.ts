///<reference path="../config/broadcast_cfg.ts"/>
/** 系统消息面板 */
namespace modules.chat {
    import ChatUtil = modules.chat.ChatUtil;
    import ChatPackage = Protocols.ChatPackage;
    import ChatPackageFields = Protocols.ChatPackageFields;
    import HTMLDivElement = Laya.HTMLDivElement;
    import Event = Laya.Event;
    import Image = Laya.Image;

    export class SystemMessageItem extends ItemRender {

        private _txt: HTMLDivElement;
        private _img: Image;

        public destroy(): void {
            this._txt = this.destroyElement(this._txt);
            this._img = this.destroyElement(this._img);
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this.width = 633;

            this._img = new Image(`chat/image_lt_xt.png`);
            this.addChild(this._img);

            this._txt = new HTMLDivElement();
            this._txt.style.width = this.width - this._img.width;
            this._txt.x = this._img.width + 6;

            this._txt.color = "#2a2a2a";
            this._txt.style.fontFamily = "SimHei";
            this._txt.style.fontSize = 22;
            this._txt.style.wordWrap = true;
            this.addChild(this._txt);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._txt, Event.LINK, this, this.linkHandler);
        }

        public setData(value: any): void {
            value = value as ChatPackage;
            this.updateView(value);
        }

        private updateView(value: ChatPackage): void {
            let str: string = ChatUtil.parseBroadcaset(value[ChatPackageFields.content]);
            this._txt.innerHTML = str;
            this._txt.style.height = this.height = this._txt.contextHeight;
        }

        private linkHandler(value: string): void {
            ChatUtil.linkHandler(value);
        }
    }
}