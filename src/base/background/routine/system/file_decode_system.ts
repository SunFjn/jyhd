///<reference path="../../../../../jslibs/jpg.js"/>


namespace base.background.routine.system {
    export class FileDecodeSystem {
        public static readonly PngHeader: Uint8Array = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

        public static init(): void {
            PngDecoder.init();
        }

        public static inflateBuffer(buffer: ArrayBuffer): ArrayBuffer {
            let data = new Zlib.Inflate(new Uint8Array(buffer)).decompress();
            return data.buffer.slice(data.byteOffset, data.byteLength);
        }

        public static decodeImage(buffer: ArrayBuffer, alphaChannel: Uint8Array = null): ArrayBuffer {
            if (this.isPng(new Uint8Array(buffer))) {
                buffer = PngDecoder.decode(new Uint8Array(buffer));
            } else {
                let p = new JpegImage();
                p.parse(new Uint8Array(buffer));
                let w = p.width;
                let h = p.height;
                let needConvert = FileDecodeSystem.needAlphaSize(w, h) || alphaChannel != null;
                let data = p.getData(w, h, true, needConvert, 8, alphaChannel);
                buffer = data.buffer;
                let view = new DataView(buffer);
                view.setUint32(0, w);
                view.setUint32(4, h);
            }
            return buffer;
        }

        private static needAlphaSize(w: number, h: number): boolean {
            if (w % 2 != 0 || h % 2 != 0) {
                return true;
            }

            if (w == 290 && h == 340) {
                return true;
            }

            if (w == 586 && h == 530) {
                return true;
            }

            return false;
        }

        private static isPng(buffer: Uint8Array): boolean {
            let header = FileDecodeSystem.PngHeader;
            for (let i = 0; i < 8; ++i) {
                if (buffer[i] != header[i]) {
                    return false;
                }
            }
            return true;
        }
    }
}