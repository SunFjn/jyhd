namespace base.background {
    export interface ActorCommand {
        type(): uint;

        writeTo(args: ArrayBuffer[]): Array<any>;

        readTo(tuple: Array<any>, args: ArrayBuffer[]): void;
    }

    const enum CommandOpcode {
        InitCommand,
        InitCompleteCommand,
        LoadCommand,
        LoadCompleteCommand,
        DecodeCommand,
        DecodeCompleteCommand
    }

    export class InitCommand implements ActorCommand {
        public static opcode: CommandOpcode = CommandOpcode.InitCommand;
        public enableCache: boolean = false;
        public enableCheck: boolean = false;
        public host: string = "";

        public type(): uint {
            return InitCommand.opcode
        }

        public readTo(tuple: Array<any>, args: ArrayBuffer[]): void {
            let offset = 0;
            this.enableCache = tuple[offset++];
            this.enableCheck = tuple[offset++];
            this.host = tuple[offset++];
        }

        public writeTo(args: ArrayBuffer[]): Array<any> {
            let result: Array<any> = [];
            result.push(this.enableCache);
            result.push(this.enableCheck);
            result.push(this.host);
            return result;
        }
    }

    export class InitCompleteCommand implements ActorCommand {
        public static opcode: CommandOpcode = CommandOpcode.InitCompleteCommand;
        public status: number;

        public type(): uint {
            return InitCompleteCommand.opcode;
        }

        public readTo(tuple: Array<any>, args: ArrayBuffer[]): void {
            let offset = 0;
            this.status = tuple[offset++];
        }

        public writeTo(args: ArrayBuffer[]): Array<any> {
            let result: Array<any> = [];
            result.push(this.status);
            return result;
        }
    }

    export class LoadCompleteCommand implements ActorCommand {
        public static opcode: CommandOpcode = CommandOpcode.LoadCompleteCommand;
        public url: string;
        public status: int;
        public bytes: ArrayBuffer;

        public type(): uint {
            return LoadCompleteCommand.opcode;
        }

        public readTo(tuple: Array<any>, args: ArrayBuffer[]): void {
            let offset = 0;
            this.url = tuple[offset++];
            this.status = tuple[offset++];
            let index = tuple[offset++];
            if (index != 0) {
                this.bytes = args[index];
            }
        }

        public writeTo(args: ArrayBuffer[]): Array<any> {
            let result: Array<any> = [];
            result.push(this.url);
            result.push(this.status);
            if (this.bytes != null) {
                result.push(args.length);
                args.push(this.bytes);
            } else {
                result.push(0);
            }
            return result;
        }
    }

    export class LoadCommand implements ActorCommand {
        public static opcode: CommandOpcode = CommandOpcode.LoadCommand;
        public url: string;
        public uncompress: uint;

        public type(): uint {
            return LoadCommand.opcode;
        }

        public readTo(tuple: Array<any>, args: ArrayBuffer[]): void {
            let offset = 0;
            this.url = tuple[offset++];
            this.uncompress = tuple[offset];
        }

        public writeTo(args: ArrayBuffer[]): Array<any> {
            let result: Array<any> = [];
            result.push(this.url);
            result.push(this.uncompress);
            return result;
        }
    }

    export class DecodeCommand implements ActorCommand {
        public static opcode: CommandOpcode = CommandOpcode.DecodeCommand;
        public url: string;
        public uncompress: number;
        public content: Array<ArrayBuffer>;

        public type(): uint {
            return DecodeCommand.opcode;
        }

        public readTo(tuple: Array<any>, args: ArrayBuffer[]): void {
            let offset = 0;
            this.url = tuple[offset++];
            this.uncompress = tuple[offset++];
            let size = tuple[offset++];
            if (size != 0) {
                let index = tuple[offset];
                this.content = [];
                for (let limit = index + size; index < limit; ++index) {
                    this.content.push(args[index]);
                }
            }
        }

        public writeTo(args: ArrayBuffer[]): Array<any> {
            let result: Array<any> = [];
            result.push(this.url);
            result.push(this.uncompress);
            if (this.content != null && this.content.length != 0) {
                result.push(this.content.length);
                result.push(args.length);
                for (let bytes of this.content) {
                    args.push(bytes);
                }
            } else {
                result.push(0);
            }
            return result;
        }
    }

    export class DecodeCompleteCommand implements ActorCommand {
        public static opcode: CommandOpcode = CommandOpcode.DecodeCompleteCommand;
        public url: string;
        public bytes: ArrayBuffer;

        public type(): uint {
            return DecodeCompleteCommand.opcode;
        }

        public readTo(tuple: Array<any>, args: ArrayBuffer[]): void {
            let offset = 0;
            this.url = tuple[offset++];
            let index = tuple[offset];
            if (index != 0) {
                this.bytes = args[index];
            }
        }

        public writeTo(args: ArrayBuffer[]): Array<any> {
            let result: Array<any> = [];
            result.push(this.url);
            if (this.bytes != null) {
                result.push(args.length);
                args.push(this.bytes);
            } else {
                result.push(0);
            }
            return result;
        }
    }
}