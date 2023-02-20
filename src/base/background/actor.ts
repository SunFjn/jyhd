///<reference path="actor_command.ts"/>
///<reference path="../../utils/array_utils.ts"/>


namespace base.background {
    import ArrayUtils = utils.ArrayUtils;

    export class Actor implements IActor {
        private _worker: Worker;
        private _args: Array<ArrayBuffer>;
        private _list: Array<Array<any>>;
        private _opcodeHandlers: Array<Array<Function>>;
        private _opcodes: Array<new () => ActorCommand>;

        constructor(path: string) {
            this._worker = new Worker(path);
            this._args = new Array<ArrayBuffer>(1);
            this._list = new Array<Array<any>>();
            this._worker.onmessage = this.onMessage;
            this._opcodeHandlers = [];
            this._opcodes = [];
        }

        public registerOpcode(type: uint, command: new () => ActorCommand): void {
            this._opcodes[type] = command;
        }

        public addCommandHandler(type: uint, handler: Function): void {
            let handlers: Array<Function> = this._opcodeHandlers[type];
            if (handlers == null) {
                handlers = new Array<Function>();
                this._opcodeHandlers[type] = handlers;
            }

            if (handlers.indexOf(handler) != -1) {
                return;
            }

            handlers.push(handler);
        }

        public removeCommandHandler(type: uint, handler: Function): void {
            let handlers: Array<Function> = this._opcodeHandlers[type];
            if (handlers == null) {
                return;
            }
            ArrayUtils.remove(handlers, handler);
        }

        private onMessage = (message: MessageEvent): void => {
            let args = message.data as ArrayBuffer[];
            if (args.length == 0) {
                return;
            }
            let commands = msgpack.decode(new Uint8Array(args[0])) as Array<any>;
            let length = commands.length;
            for (let i = 0; i < length; ++i) {
                let command = commands[i];
                let type = command[0];
                let opcode = new this._opcodes[type];
                opcode.readTo(command[1], args);
                let handlers = this._opcodeHandlers[type];
                if (handlers == null) {
                    continue;
                }
                for (let i = 0, length = handlers.length; i < length; ++i) {
                    handlers[i](opcode);
                }
            }
        };

        public sendCommand(command: ActorCommand): void {
            // if (this._list.length == 0) {
            //     setTimeout(this.onUpdate, 0);
            // }
            let tuple: Array<any> = command.writeTo(this._args);
            this._list.push([command.type(), tuple]);
            this.onUpdate();
        }

        private onUpdate = (): void => {
            if (this._list.length == 0) {
                return;
            }

            let commandBuffer = msgpack.encode(this._list).buffer;
            this._args[0] = commandBuffer;
            this._worker.postMessage(this._args, this._args);
            this._args = new Array<ArrayBuffer>(1);
            this._list.length = 0;
        }
    }
}