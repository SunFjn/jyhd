/** 喊话气泡*/


namespace game.role.component{
    import Transform3D = Laya.Transform3D;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import blend = Configuration.blend;

    export class BubbleComponent extends RoleComponent{
        private _bubbleBg:Laya.Image;
        private _txt:Laya.HTMLDivElement;
        private _cd:number;
        private _transform:Transform3D;
        private _talkStrs:Array<string>;
        private _lvs:Array<number>;
        private _intervals:Array<number>;
        private _time:number;
        private _isShow:boolean;

        constructor(owner:Role){
            super(owner);
        }

        setup(): void {
            this._cd = BlendCfg.instance.getCfgById(303)[blendFields.intParam][0];
            this._intervals = BlendCfg.instance.getCfgById(304)[blendFields.intParam];
            let cfg:blend = BlendCfg.instance.getCfgById(302);
            this._talkStrs = cfg[blendFields.stringParam];
            this._lvs = cfg[blendFields.intParam];
            this._transform = this.property.get("avatar").title.transform;
            this._transform.localPosition = new Laya.Vector3(0, 150, 0);

            this.owner.on("visible", this, this.visible);
            GlobalData.dispatcher.on(CommonEventType.SCENE_ENTER, this, this.talk, [true]);
            this.talk(true);
        }

        teardown(): void {
            this.owner.off("visible", this, this.visible);
            GlobalData.dispatcher.off(CommonEventType.SCENE_ENTER, this, this.talk);
            // Laya.timer.clear(this, this.talk);
        }

        private talk(toOpen:boolean):void{
            // Laya.timer.clear(this, this.talk);
            if(toOpen) {
                if (!this._bubbleBg) {
                    this._bubbleBg = new Laya.Image();
                    this._bubbleBg.skin = "common_sg/frame_mainui_qpk.png";
                    this._bubbleBg.sizeGrid = "10,10,10,10";
                    this._bubbleBg.width = 288;
                    this._txt = new Laya.HTMLDivElement();
                    this._txt.pos(1000, 1500, true);
                    this._txt.color = "#eaf8ff";
                    this._txt.style.fontFamily = "SimHei";
                    this._txt.style.fontSize = 24;
                    this._txt.width = 264;
                }
                this._txt.innerHTML = this.getTalkStr();
                // let w:number = this._txt.contextWidth;
                // if(w > 240) w = 240;
                // this._txt.width = w;
                // this._bubbleBg.width = w + 24;
                this._txt.style.height = this._txt.contextHeight;
                this._bubbleBg.height = this._txt.height + 24;
                // this.update();

                GameCenter.instance.world.publish("addToHUD", this._bubbleBg);
                GameCenter.instance.world.publish("addToHUD", this._txt);

                this._isShow = true;
                this._time = GlobalData.serverTime + this._cd;
                // 打开的定时关闭
                // Laya.timer.once(this._cd, this, this.talk, [false]);
            }else{
                this._bubbleBg && this._bubbleBg.removeSelf();
                this._txt && this._txt.removeSelf();

                this._isShow = false;
                this._time = GlobalData.serverTime + this._intervals[0] + Math.random() * (this._intervals[1] - this._intervals[0]);
                // 关闭后随机一个时间打开
                // Laya.timer.once(this._intervals[0] + Math.random() * (this._intervals[1] - this._intervals[0]), this, this.talk, [true]);
            }
        }

        private visible(value:boolean):void{
            this._bubbleBg && (this._bubbleBg.visible = value);
            this._txt && (this._txt.visible = value);
        }

        public update():void{
            if(this._isShow) {
                this._bubbleBg.pos(this._transform.position.x - this._bubbleBg.width * 0.5, -this._transform.position.y - this._bubbleBg.height, true);
                this._txt.pos(this._bubbleBg.x + 12, this._bubbleBg.y + 12, true);
                if(GlobalData.serverTime > this._time){
                    this.talk(false);
                }
            }else{
                if(GlobalData.serverTime > this._time){
                    this.talk(true);
                }
            }
        }

        // 获取当前等级应该显示的话
        private getTalkStr():string{
            let str:string = "";
            let lv:number = PlayerModel.instance.level;
            for(let i:int = 0, len:int = this._lvs.length; i < len; i++){
                if(lv < this._lvs[i]){
                    let arr:Array<string> = this._talkStrs[i].split("|");
                    str = arr[Math.floor(Math.random() * arr.length)];
                    break;
                }
            }
            return str;
        }

        destory(): void {
            if(this._bubbleBg){
                this._bubbleBg.destroy(true);
                this._bubbleBg = null;
            }
            if(this._txt){
                this._txt.destroy(true);
                this._txt = null;
            }
            this._transform = null;
            this._talkStrs = null;
            this._lvs = null;
            this._intervals = null;
        }
    }
}