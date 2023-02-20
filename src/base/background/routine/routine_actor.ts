///<reference path="system/file_decode_system.ts"/>

namespace base.background.routine {
    import FileDecodeSystem = base.background.routine.system.FileDecodeSystem;

    export class RoutineActor implements IActor {
        private _args: Array<ArrayBuffer>;
        private _list: Array<ActorCommand>;
        private _opcodeHandlers: Array<Array<Function>>;
        private _opcodes: Array<new () => ActorCommand>;

        constructor() {
            this._args = new Array<ArrayBuffer>(1);
            this._list = [];
            this._opcodeHandlers = [];
            this._opcodes = [];

            FileDecodeSystem.init();
            let actor = this;
            actor.registerOpcode(DecodeCommand.opcode, DecodeCommand);
            actor.registerOpcode(DecodeCompleteCommand.opcode, DecodeCompleteCommand);
            actor.addCommandHandler(InitCommand.opcode, (_: InitCommand) => {
                let command = new InitCompleteCommand();
                command.status = 0;
                actor.sendCommand(command);
            });

            actor.addCommandHandler(DecodeCommand.opcode, (command: DecodeCommand) => {
                let url = command.url;
                let uncompress = command.uncompress;
                let content = command.content;
                let buffer: ArrayBuffer;
                switch (uncompress) {
                    case 1: {
                        buffer = FileDecodeSystem.inflateBuffer(content[0]);
                        break;
                    }
                    default: {
                        let name = url.toLowerCase();
                        if (name.lastIndexOf(".png") == (name.length - 4) || name.lastIndexOf(".jpg") == (name.length - 4)) {
                            buffer = FileDecodeSystem.decodeImage(content[0]);
                        } else if (name.lastIndexOf(".til") == (name.length - 4)) {
                            buffer = FileDecodeSystem.decodeImage(content[0], new Zlib.Inflate(new Uint8Array(content[1])).decompress());
                        }
                        break;
                    }
                }

                let result = new DecodeCompleteCommand();
                result.url = url;
                result.bytes = buffer;
                actor.sendCommand(result);
            });
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

        public sendCommand(command: ActorCommand): void {
            if (this._list.length == 0) {
                setTimeout(this.onUpdate, 0);
            }
            this._list.push(command);
        }

        private onUpdate = (): void => {
            if (this._list.length == 0) {
                return;
            }

            for (let command of this._list) {
                let handlers = this._opcodeHandlers[command.type()];
                if (handlers == null) {
                    continue;
                }
                for (let i = 0, length = handlers.length; i < length; ++i) {
                    handlers[i](command);
                }
            }
            this._list.length = 0;
        }
    }
}