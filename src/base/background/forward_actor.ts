///<reference path="actor_command.ts"/>
///<reference path="../../utils/array_utils.ts"/>
///<reference path="system/indexed_db_cache.ts"/>
///<reference path="system/http_file_system.ts"/>

namespace base.background {
    import HttpFileSystem = base.background.system.HttpFileSystem;
    import IndexedDBCache = base.background.system.IndexedDBCache;

    export class ForwardActor implements IActor {
        private _forwardHandlers: Array<Function>;
        private _core: IActor;

        constructor(core: IActor) {
            this._core = core;
            this._forwardHandlers = [];
            core.registerOpcode(DecodeCommand.opcode, DecodeCommand);
            core.registerOpcode(DecodeCompleteCommand.opcode, DecodeCompleteCommand);
            core.addCommandHandler(DecodeCompleteCommand.opcode, (command: DecodeCompleteCommand): void => {
                if (command.bytes == null) {
                    console.error(`解析图片${command.url}出错，当前图片为交错类型！`)
                }
                this.onComplete(command.url, command.bytes == null ? -1 : 0, command.bytes);
            });
        }

        public registerOpcode(type: uint, command: new () => ActorCommand): void {
            this._core.registerOpcode(type, command);
        }

        public addCommandHandler(type: uint, handler: Function): void {
            if (LoadCompleteCommand.opcode == type) {
                let handlers = this._forwardHandlers;
                if (handlers.indexOf(handler) != -1) {
                    return;
                }
                handlers.push(handler);
            } else {
                this._core.addCommandHandler(type, handler);
            }
        }

        public removeCommandHandler(type: uint, handler: Function): void {
            if (LoadCompleteCommand.opcode == type) {
                let handlers = this._forwardHandlers;
                ArrayUtils.remove(handlers, handler);
            } else {
                this._core.removeCommandHandler(type, handler);
            }
        }

        public sendCommand(command: ActorCommand): void {
            if (command.type() == LoadCommand.opcode) {
                let loadCommand = <LoadCommand>command;
                let uncompress = loadCommand.uncompress;
                HttpFileSystem.read(loadCommand.url, uncompress, (url: string, status: uint, buffer: ArrayBuffer, args: Array<ArrayBuffer>) => {
                    if (buffer != null) {
                        switch (uncompress) {
                            case 1: {
                                let command = new DecodeCommand();
                                command.url = url;
                                command.uncompress = uncompress;
                                command.content = [buffer];
                                this._core.sendCommand(command);
                                return;
                            }
                            default: {
                                let name = url.toLowerCase();
                                // if (name.lastIndexOf(".png") == (name.length - 4) || name.lastIndexOf(".jpg") == (name.length - 4)) {
                                if (StringUtils.endsWith(name, ".png") || StringUtils.endsWith(name, ".jpg") || StringUtils.endsWith(name, ".til")) {
                                    let command = new DecodeCommand();
                                    command.url = url;
                                    command.uncompress = uncompress;
                                    command.content = [buffer];
                                    this._core.sendCommand(command);
                                    return;
                                }
                                break;
                            }
                        }
                    } else if (args != null && args.length != 0) {
                        let command = new DecodeCommand();
                        command.url = url;
                        command.uncompress = uncompress;
                        command.content = args;
                        this._core.sendCommand(command);
                        return;
                    }


                    this.onComplete(url, status, buffer);
                });
            } else if (command.type() == InitCommand.opcode) {
                this.initSystem(<InitCommand>command);
                this._core.sendCommand(command);
            } else {
                this._core.sendCommand(command);
            }
        }

        private initSystem(command: InitCommand): void {
            let enableCheck = command.enableCheck;
            let host = command.host;
            IndexedDBCache.initCache(command.enableCache, () => {
                HttpFileSystem.init(host, enableCheck, (status: number) => {
                });
            });
        }

        private onComplete(url: string, status: uint, buffer: ArrayBuffer): void {
            let command = new LoadCompleteCommand();
            command.url = url;
            command.status = status;
            command.bytes = buffer;
            let handlers = this._forwardHandlers;
            for (let i = 0, length = handlers.length; i < length; ++i) {
                handlers[i](command);
            }
        }
    }
}