namespace base.background.routine.utils {
    export class ByteStream {
        public bytesAvailable(): number {
            return this.length - this.cursor;
        }

        public getUint8(): uint8 {
            return this.input[this.cursor++];
        }

        public getUint16(): uint16 {
            let result = this.view.getUint16(this.cursor, this.littleEndian);
            this.cursor += 2;
            return result;
        }

        public getUint32(): uint32 {
            let result = this.view.getUint32(this.cursor, this.littleEndian);
            this.cursor += 4;
            return result;
        }

        public getUTF(size: uint32): string {
            let result = new Array<string>(size);
            for (let i = 0; i < size; ++i) {
                result[i] = String.fromCharCode(this.input[this.cursor++]);
            }
            return result.join("");
        }

        public getBytes(size: uint32): Uint8Array {
            let result = new Uint8Array(this.input.buffer, this.input.byteOffset + this.cursor, size);
            this.cursor += size;
            return result;
        }

        public skip(size: uint32): void {
            this.cursor += size;
        }

        public open(input: Uint8Array, littleEndian: boolean = false): void {
            this.cursor = 8;
            this.length = input.byteLength;
            this.input = input;
            this.view = new DataView(input.buffer);
            this.littleEndian = littleEndian;
        }

        public close(): void {
            this.input = null;
            this.view = null;
        }

        public cursor: number;
        public length: number;
        public input: Uint8Array;
        public view: DataView;
        public littleEndian: boolean;
    }
}