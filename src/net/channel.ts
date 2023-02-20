namespace net {
    export class Channel {
        private static _instance: Channel = new Channel();

        public static get instance(): Channel {
            return Channel._instance;
        }

        private _socket: WebSocket;
        private _handlers: Array<Function>;
        private _send: boolean = true;
        private constructor() {
            this._handlers = [];
        }
        public setSend(value: boolean) {
            this._send = value
        }

        public get socket(): WebSocket {
            return this._socket;
        }

        // 微信小游戏创建websocket
        private createWxSocket(e) {
            let t = <any><unknown>wx.connectSocket({
                url: e.url,
                success: function () {
                    console.log("wx connect socket success.");
                },
                fail: function () {
                    console.log("wx connect socket fail.");
                },
                complete: null,
                header: null,
                method: "GET",
                protocols: null
            });

            t.onOpen(function (t) {
                if (e.onopen) e.onopen(t)
            });
            t.onClose(function (t) {
                if (e.onclose) e.onclose(t)
            });
            t.onError(function (t) {
                if (e.onerror) e.onerror(t)
            });
            t.onMessage(function (t) {
                if (e.onmessage) e.onmessage(t)
            });
            return t
        }

        public open<T>(url: string, caller: T, onOpen: (e: Event) => void, onClose: (e: CloseEvent) => void, onError: (e: Event) => void): void {
            if (Main.instance.isWXChannel) {
                this._socket = this.createWxSocket({
                    url: url,
                    onopen: onOpen.bind(caller),
                    onerror: onError.bind(caller),
                    onmessage: this.onMessage,
                    onclose: onClose.bind(caller)
                });
            } else {
                console.log("Create WebSocket!!!");
                this._socket = new WebSocket(url);
                this._socket.binaryType = "arraybuffer";
                this._socket.onmessage = this.onMessage;
                this._socket.onopen = onOpen.bind(caller);
                this._socket.onclose = onClose.bind(caller);
                this._socket.onerror = onError.bind(caller);
            }
        }

        protected onMessage = (event: MessageEvent): void => {
            let data: ArrayBuffer = event.data;
            let stream = new DataView(data);
            let offset = 0;
            let size = stream.getUint16(offset, true);
            offset += 2;
            let opcode = stream.getUint32(offset, true);
            offset += 4;
            let handler = this._handlers[opcode];
            if (handler != null) {
                let tuple: any = null;
                if (data.byteLength > offset) {
                    let bytes = new Uint8Array(data, offset);
                    tuple = msgpack.decode(bytes);
                    if (DEBUG) {


                        var arr = [
                            "10000d2", "10000cb", "10000d0", "10000cd", "1000065", "1000085", "10000cc", "10000ca", "10000cc",/*释放技能*//*广播离屏*//*玩家或怪物死亡*//*飘血*//*更新血量*//*更新角色状态*//*广播玩家移动*//*广播入屏*//*广播玩家移动*/
                            "10000de",/*释放技能返回*/
                            "100007e",/*更新收益*/
                            "1000084",/*更新buff列表*/
                            "1000068",/*更新经验*/
                            "1000070",/*更新货币*/
                            "1000066",/*更新玩家总属性*/
                            "1000387",/*更新魔力*/
                            "1000077",/*挂机场景更新当前击杀怪物波数*/
                            "100007a",/*同步时间返回*/

                            /*临时屏蔽*/
                            "100065",
                            "10000ce",/*复活返回*/
                            "10000cf",/*广播复活*/
                            "10004b4",/*更新BOSS 死亡、重生推送*/
                            "1001134",/*更新天梯次数*/
                            "1001132",/*更新参与奖励状态*/
                            "1001131",/*更新天梯积分 (积分、功勋、剩余次数)*/
                            "1001133",/*更新功勋奖励状态*/
                            "1000f3f",/*更新建筑产出信息*/
                        ]

                        if (arr.indexOf(opcode.toString(16)) != -1) {
                            // console.log("client 接收数据1 = ", tuple, " 消息号：0x", opcode.toString(16))
                            // console.error(">>>   ", opcode.toString(16))
                        } else {
                            // console.log("client 接收数据2 = ", tuple, " 消息号：0x", opcode.toString(16))
                        }

                    }
                } else {
                    // console.log("client 接收数据  无参接收", " 消息号：0x", opcode.toString(16))
                }
                handler.call(null, tuple);
            } else {
                // console.log("接收数据 未处理的消息：0x" + opcode.toString(16));
                let tuple: any = null;
                if (data.byteLength > offset) {
                    let bytes = new Uint8Array(data, offset);
                    tuple = msgpack.decode(bytes);
                    // console.log("接收但是未处理的消息号:0x " + opcode.toString(16), "originCode:" + opcode, "消息参", tuple)
                } else {
                    //  console.log("无法处理3")
                }
            }
        };

        public subscribe<T extends keyof Protocols.Types, C extends object>(opcode: T, caller: C, handler: (tuple: Protocols.Types[T]) => void): Channel {
            if (this._handlers[opcode]) throw new Error("同一条协议不可以侦听两次：" + opcode);
            this._handlers[opcode] = handler.bind(caller);
            return this;
        }

        public publish<T extends keyof Protocols.Types>(opcode: T, tuple: Protocols.Types[T]): Channel {
            if (!this._send) return this;
            let content = null;
            let size = 0;
            if (tuple != null) {
                content = msgpack.encode(tuple);
                size = content.byteLength;
            }
            let buffer = new Uint8Array(2 + 4 + size);
            let stream = new DataView(buffer.buffer);
            let offset = 0;
            stream.setUint16(offset, buffer.byteLength, true);
            offset += 2;
            stream.setUint32(offset, opcode, true);
            offset += 4;
            if (content != null) {
                buffer.set(content, offset);
            }
            if (DEBUG) {
                var arr = ["500000", "500002", "500001", "100064", "100065", "1001650", "200064"]
                /*玩家移动*//*释放及技能*//*ping*/
                if (arr.indexOf((opcode as Number).toString(16)) != -1) {
                    // console.info("client 发送 = ", tuple, " 消息号：0x", (opcode as Number).toString(16));
                    // console.error(">>>   ",opcode.toString(16))
                } else {
                    // console.info("client 发送 = ", tuple, " 消息号：0x", (opcode as Number).toString(16));
                }
            }

            if (Main.instance.isWXChannel) {
                (<any>this._socket).send({
                    data: buffer.buffer,
                    fail: t => {
                        console.log("wx.websocket 发送消息失败：", t.errMsg)
                    }
                });
            } else {

                this._socket.send(buffer);

            }

            return this;
        }
    }
}