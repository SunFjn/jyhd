///<reference path="utils/byte_stream.ts"/>

namespace base.background.routine {
    import ByteStream = base.background.routine.utils.ByteStream;

    const enum PngColorMask {
        Gray = 0,
        Palette = 1,
        Color = 2,
        Alpha = 4
    }

    const enum PngColorType {
        Gray = PngColorMask.Gray,
        RGB = PngColorMask.Color,
        Palette = PngColorMask.Color | PngColorMask.Palette,
        AlphaGray = PngColorMask.Gray | PngColorMask.Alpha,
        RGBA = PngColorMask.Color | PngColorMask.Alpha
    }

    const enum DeltaEncoding {
        None,
        Left,
        Up,
        Average,
        Paeth
    }

    class PngFileEntry {
        private static _freeEntry: PngFileEntry;

        public static allocEntry(): PngFileEntry {
            let result: PngFileEntry;
            if (PngFileEntry._freeEntry != null) {
                result = this._freeEntry;
                this._freeEntry = this._freeEntry.next;
            } else {
                result = new PngFileEntry();
            }

            return result;
        }

        public static freeEntry(entry: PngFileEntry): void {
            entry.next = this._freeEntry;
            PngFileEntry._freeEntry = entry;
            entry.palette = null;
            entry.segments.length = 0;
            entry.transparency = null;
        }

        public width: uint32;
        public height: uint32;
        public bits: uint8;
        public colorType: PngColorType;
        public compressionMethod: uint8;
        public filterMethod: uint8;
        public interlaceMethod: uint8;

        public palette: Uint8Array;

        public segments: Array<Uint8Array> = [];

        public transparency: Uint8Array;

        private next: PngFileEntry;
    }

    export class PngDecoder {
        private static sectionHandlers: Table<(entry: PngFileEntry, stream: ByteStream, chunkSize: uint32) => void> = {};

        public static init(): void {
            PngDecoder.sectionHandlers = {
                IHDR: PngDecoder.handlerIHDR,
                PLTE: PngDecoder.handlerPLTE,
                IDAT: PngDecoder.handlerIDAT,
                tRNS: PngDecoder.handlerTRNS,
                // iCCP: PngDecoder.handlerICCP
            }
        }

        private static handlerIHDR(entry: PngFileEntry, stream: ByteStream, chunkSize: uint32): void {
            entry.width = stream.getUint32();
            entry.height = stream.getUint32();
            entry.bits = stream.getUint8();
            entry.colorType = stream.getUint8();
            entry.compressionMethod = stream.getUint8();
            entry.filterMethod = stream.getUint8();
            entry.interlaceMethod = stream.getUint8();
        }

        private static handlerPLTE(entry: PngFileEntry, stream: ByteStream, chunkSize: uint32): void {
            entry.palette = stream.getBytes(chunkSize);
        }

        private static handlerIDAT(entry: PngFileEntry, stream: ByteStream, chunkSize: uint32): void {
            entry.segments.push(stream.getBytes(chunkSize));
        }

        private static handlerTRNS(entry: PngFileEntry, stream: ByteStream, chunkSize: uint32): void {
            entry.transparency = stream.getBytes(chunkSize);
        }

        private static handlerICCP(entry: PngFileEntry, stream: ByteStream, chunkSize: uint32): void {
            let pos = stream.cursor;
            let codes: Array<string> = [];
            let code = stream.getUint8();
            do {
                codes.push(String.fromCharCode(code));
                code = stream.getUint8();
            } while (code != 0);
            let profile = codes.join("");
            let method = stream.getUint8();
            let length = chunkSize - (stream.cursor - pos);
            let bytes = stream.getBytes(length);
        }

        private static decodePalette(entry: PngFileEntry): Uint8Array {
            let palette = entry.palette;
            let transparency = entry.transparency;
            let length = palette.length;
            let result = new Uint8Array(length / 3 * 4);
            let offset = 0;
            let cursor = 0;
            let size = transparency.byteLength;
            let index = 0;
            while (offset < length) {
                result[cursor++] = palette[offset++];
                result[cursor++] = palette[offset++];
                result[cursor++] = palette[offset++];
                result[cursor++] = (index < size) ? transparency[index++] : 255;
            }
            return result;
        };

        private static mergeSegments(segments: Array<Uint8Array>): Uint8Array {
            let byteLength = 0;
            for (let segment of segments) {
                byteLength += segment.byteLength;
            }
            let bytes = new Uint8Array(byteLength);
            let offset = 0;
            for (let segment of segments) {
                bytes.set(segment, offset);
                offset += segment.length;
            }
            return new Zlib.Inflate(bytes).decompress();
        }

        private static calcPixelBytes(entry: PngFileEntry): uint32 {
            let channels = 3;
            if (entry.colorType & PngColorMask.Alpha) {
                channels = 4;
            }

            if (entry.colorType == PngColorType.Palette && entry.transparency) {
                channels = 4;
            }

            return channels;
        }

        private static calcIndexBytes(entry: PngFileEntry): uint32 {
            let channels = 1;
            switch (entry.colorType) {
                case PngColorType.RGB: {
                    channels = 3;
                    break;
                }
                case PngColorType.AlphaGray: {
                    channels = 2;
                    break;
                }
                case PngColorType.RGBA: {
                    channels = 4;
                    break;
                }
            }

            let bits = channels * entry.bits;
            return (bits + 7) >> 3;
        }

        private static decodePixels(entry: PngFileEntry): Uint8Array {
            if (entry.interlaceMethod == 0) {
                return this.notInterlaceMethod(entry);
            }
            return null;
        }

        private static notInterlaceMethod(entry: PngFileEntry): Uint8Array {
            let bytes = PngDecoder.mergeSegments(entry.segments);
            let length = bytes.byteLength;
            let height = entry.height;
            let pixelBytes = PngDecoder.calcIndexBytes(entry);
            let rowBytes = Math.floor((length - height) / height);
            let rowOffset = rowBytes + 1;

            let i = 0;
            let cursor = 0;
            let a = 0, b = 0, c = 0, p = 0, pa = 0, pb = 0, pc = 0, pr = 0;
            while (cursor < length) {
                switch (bytes[cursor++]) {
                    case DeltaEncoding.None: {
                        cursor += rowBytes;
                        break;
                    }
                    case DeltaEncoding.Left: {
                        cursor += pixelBytes;
                        for (i = pixelBytes; i < rowBytes; ++i, ++cursor) {
                            bytes[cursor] = (bytes[cursor] + bytes[cursor - pixelBytes]) % 256;
                        }
                        break;
                    }
                    case DeltaEncoding.Up: {
                        //不是第一行
                        if (cursor != 1) {
                            for (i = 0; i < rowBytes; ++i, ++cursor) {
                                bytes[cursor] = (bytes[cursor] + bytes[cursor - rowOffset]) % 256;
                            }
                        }
                        break;
                    }
                    case DeltaEncoding.Average: {
                        if (cursor == 1) {
                            cursor += pixelBytes;
                            for (i = pixelBytes; i < rowBytes; ++i, ++cursor) {
                                bytes[cursor] = (bytes[cursor] + (bytes[cursor - pixelBytes] >> 1)) % 256;
                            }
                        } else {
                            for (i = 0; i < pixelBytes; ++i, ++cursor) {
                                bytes[cursor] = (bytes[cursor] + (bytes[cursor - rowOffset] >> 1)) % 256;
                            }
                            for (i = pixelBytes; i < rowBytes; ++i, ++cursor) {
                                bytes[cursor] = (bytes[cursor] + ((bytes[cursor - pixelBytes] + bytes[cursor - rowOffset]) >> 1)) % 256;
                            }
                        }
                        break;
                    }
                    case DeltaEncoding.Paeth: {
                        if (pixelBytes == 1) {
                            if (cursor == 1) {
                                a = bytes[cursor++];
                                for (i = 1; i < rowBytes; ++i, ++cursor) {
                                    pr = (a > 0) ? a : 0;
                                    a = bytes[cursor] = (bytes[cursor] + pr) % 256;
                                }
                            } else {
                                b = bytes[cursor - rowOffset];
                                p = b;
                                pa = p;
                                if (pa < 0) {
                                    pa = -pa;
                                }
                                pc = p;
                                if (pc < 0) {
                                    pc = -pc;
                                }
                                pr = (p <= 0) ? 0 : ((0 <= pc) ? b : 0);
                                a = bytes[cursor] = bytes[cursor] + pr;
                                cursor++;
                                for (i = 1; i < rowBytes; ++i, ++cursor) {
                                    b = bytes[cursor - rowOffset], c = bytes[cursor - rowOffset - 1];
                                    p = a + b - c;
                                    pa = p - a;
                                    if (pa < 0) {
                                        pa = -pa;
                                    }
                                    pb = p - b;
                                    if (pb < 0) {
                                        pb = -pb;
                                    }
                                    pc = p - c;
                                    if (pc < 0) {
                                        pc = -pc;
                                    }
                                    pr = (pa <= pb && pa <= pc) ? a : ((pb <= pc) ? b : c);
                                    a = bytes[cursor] = (bytes[cursor] + pr) % 256;
                                }
                            }
                        } else {
                            if (cursor == 1) {
                                cursor += pixelBytes;
                                b = c = 0;
                                for (i = pixelBytes; i < rowBytes; ++i, ++cursor) {
                                    a = bytes[cursor - pixelBytes];
                                    p = a + b - c;
                                    pa = p - a;
                                    if (pa < 0) {
                                        pa = -pa;
                                    }
                                    pb = p - b;
                                    if (pb < 0) {
                                        pb = -pb;
                                    }
                                    pc = p - c;
                                    if (pc < 0) {
                                        pc = -pc;
                                    }
                                    pr = (pa <= pb && pa <= pc) ? a : ((pb <= pc) ? b : c);
                                    bytes[cursor] = (bytes[cursor] + pr) % 256;
                                }
                            } else {
                                for (i = 0; i < pixelBytes; ++i, ++cursor) {
                                    a = 0, b = bytes[cursor - rowOffset], c = 0;
                                    p = a + b - c;
                                    pa = p - a;
                                    if (pa < 0) {
                                        pa = -pa;
                                    }
                                    pb = p - b;
                                    if (pb < 0) {
                                        pb = -pb;
                                    }
                                    pc = p - c;
                                    if (pc < 0) {
                                        pc = -pc;
                                    }
                                    pr = (pa <= pb && pa <= pc) ? a : ((pb <= pc) ? b : c);
                                    bytes[cursor] = (bytes[cursor] + pr) % 256;
                                }
                                for (i = pixelBytes; i < rowBytes; ++i, ++cursor) {
                                    a = bytes[cursor - pixelBytes], b = bytes[cursor - rowOffset], c = bytes[cursor - rowOffset - pixelBytes];
                                    p = a + b - c;
                                    pa = p - a;
                                    if (pa < 0) {
                                        pa = -pa;
                                    }
                                    pb = p - b;
                                    if (pb < 0) {
                                        pb = -pb;
                                    }
                                    pc = p - c;
                                    if (pc < 0) {
                                        pc = -pc;
                                    }
                                    pr = (pa <= pb && pa <= pc) ? a : ((pb <= pc) ? b : c);
                                    bytes[cursor] = (bytes[cursor] + pr) % 256;
                                }
                            }
                        }
                        break;
                    }
                    default: {
                        // console.log(`解析出错：${entry.width}, ${entry.height}, ${pixelBytes}`);
                        // console.log(bytes.byteLength);
                        break;
                    }
                }
            }

            return bytes;
        }

        public static decode(data: Uint8Array): ArrayBuffer {
            let entry = PngFileEntry.allocEntry();
            let stream = new ByteStream();
            stream.open(data);
            while (stream.bytesAvailable() > 0) {
                let chunkSize = stream.getUint32();
                let section = stream.getUTF(4);
                let handler = PngDecoder.sectionHandlers[section];
                if (handler != null) {
                    handler(entry, stream, chunkSize);
                } else {
                    stream.skip(chunkSize);
                }
                let crc = stream.getUint32();
            }
            let pixels = PngDecoder.decodePixels(entry);
            if (pixels == null) {
                return null;
            }

            let cursor = 0;
            let offset = 0;
            let width = entry.width;
            let height = entry.height;


            let buffer = new ArrayBuffer(width * height * PngDecoder.calcPixelBytes(entry) + 8);
            let result = new Uint8Array(buffer, 8);
            let view = new DataView(buffer, 0, 8);
            view.setUint32(0, width);
            view.setUint32(4, height);
            switch (entry.colorType) {
                case PngColorType.Palette: {
                    PngDecoder.fromPalette(entry, pixels, result);
                    break;
                }
                case PngColorType.RGB: {
                    switch (entry.bits) {
                        case 8: {
                            for (let y = 0; y < height; ++y) {
                                offset++;
                                for (let x = 0; x < width; ++x) {
                                    result[cursor++] = pixels[offset++];
                                    result[cursor++] = pixels[offset++];
                                    result[cursor++] = pixels[offset++];
                                }
                            }
                            break;
                        }
                        case 16: {
                            for (let y = 0; y < height; ++y) {
                                offset++;
                                for (let x = 0; x < width; ++x) {
                                    result[cursor++] = ((pixels[offset] << 8 | pixels[offset + 1]) / 65535) * 255;
                                    offset += 2;
                                    result[cursor++] = ((pixels[offset] << 8 | pixels[offset + 1]) / 65535) * 255;
                                    offset += 2;
                                    result[cursor++] = ((pixels[offset] << 8 | pixels[offset + 1]) / 65535) * 255;
                                    offset += 2;
                                }
                            }
                            // console.error(`未支持的类型：${entry.colorType}, ${entry.bits}`);
                            break;
                        }
                    }
                    break;
                }
                case PngColorType.RGBA: {
                    switch (entry.bits) {
                        case 8: {
                            for (let y = 0; y < height; ++y) {
                                offset++;
                                for (let x = 0; x < width; ++x) {
                                    result[cursor++] = pixels[offset++];
                                    result[cursor++] = pixels[offset++];
                                    result[cursor++] = pixels[offset++];
                                    result[cursor++] = pixels[offset++];
                                }
                            }
                            break;
                        }
                        case 16: {
                            for (let y = 0; y < height; ++y) {
                                offset++;
                                for (let x = 0; x < width; ++x) {
                                    result[cursor++] = ((pixels[offset] << 8 | pixels[offset + 1]) / 65535) * 255;
                                    offset += 2;
                                    result[cursor++] = ((pixels[offset] << 8 | pixels[offset + 1]) / 65535) * 255;
                                    offset += 2;
                                    result[cursor++] = ((pixels[offset] << 8 | pixels[offset + 1]) / 65535) * 255;
                                    offset += 2;
                                    result[cursor++] = ((pixels[offset] << 8 | pixels[offset + 1]) / 65535) * 255;
                                    offset += 2;
                                }
                            }
                            // console.error(`未支持的类型：${entry.colorType}, ${entry.bits}`);
                            break;
                        }
                    }
                    break;
                }
                default: {
                    console.error(`未支持的类型：${entry.colorType}, ${entry.bits}`);
                    break;
                }
            }
            PngFileEntry.freeEntry(entry);
            return buffer;
        }

        private static fromPalette(entry: PngFileEntry, pixels: Uint8Array, result: Uint8Array): void {
            let cursor = 0;
            let offset = 0;
            let width = entry.width;
            let height = entry.height;
            let palette = entry.palette;
            if (entry.transparency != null) {
                palette = PngDecoder.decodePalette(entry);
                switch (entry.bits) {
                    case 1: {
                        for (let y = 0; y < height; ++y) {
                            offset++;
                            for (let x = 0; x < width; ++x) {
                                let index = (pixels[offset + (x >> 3)] & 0x01) * 4;
                                result[cursor++] = palette[index];
                                result[cursor++] = palette[index + 1];
                                result[cursor++] = palette[index + 2];
                                result[cursor++] = palette[index + 3];
                            }
                            offset += (width + 7) >> 3;
                        }
                        break;
                    }
                    case 2: {
                        for (let y = 0; y < height; ++y) {
                            offset++;
                            for (let x = 0; x < width; ++x) {
                                let index = (pixels[offset + (x >> 2)] & 0x03) * 4;
                                result[cursor++] = palette[index];
                                result[cursor++] = palette[index + 1];
                                result[cursor++] = palette[index + 2];
                                result[cursor++] = palette[index + 3];
                            }
                            offset += (width + 3) >> 2;
                        }
                        break;
                    }
                    case 4: {
                        for (let y = 0; y < height; ++y) {
                            offset++;
                            for (let x = 0; x < width; ++x) {
                                let index = (pixels[offset + (x >> 1)] & 0x0F) * 4;
                                result[cursor++] = palette[index];
                                result[cursor++] = palette[index + 1];
                                result[cursor++] = palette[index + 2];
                                result[cursor++] = palette[index + 3];
                            }
                            offset += (width + 1) >> 1;
                        }
                        break;
                    }
                    case 8: {
                        for (let y = 0; y < height; ++y) {
                            offset++;
                            for (let x = 0; x < width; ++x) {
                                let index = pixels[offset++] * 4;
                                result[cursor++] = palette[index];
                                result[cursor++] = palette[index + 1];
                                result[cursor++] = palette[index + 2];
                                result[cursor++] = palette[index + 3];
                            }
                        }
                        break;
                    }
                }
            } else {
                switch (entry.bits) {
                    case 1: {
                        for (let y = 0; y < height; ++y) {
                            offset++;
                            for (let x = 0; x < width; ++x) {
                                let index = (pixels[offset + (x >> 3)] & 0x01) * 3;
                                result[cursor++] = palette[index];
                                result[cursor++] = palette[index + 1];
                                result[cursor++] = palette[index + 2];
                            }
                            offset += (width + 7) >> 3;
                        }
                        break;
                    }
                    case 2: {
                        for (let y = 0; y < height; ++y) {
                            offset++;
                            for (let x = 0; x < width; ++x) {
                                let index = (pixels[offset + (x >> 2)] & 0x03) * 3;
                                result[cursor++] = palette[index];
                                result[cursor++] = palette[index + 1];
                                result[cursor++] = palette[index + 2];
                            }
                            offset += (width + 3) >> 2;
                        }
                        break;
                    }
                    case 4: {
                        for (let y = 0; y < height; ++y) {
                            offset++;
                            for (let x = 0; x < width; ++x) {
                                let index = (pixels[offset + (x >> 1)] & 0x0F) * 3;
                                result[cursor++] = palette[index];
                                result[cursor++] = palette[index + 1];
                                result[cursor++] = palette[index + 2];
                            }
                            offset += (width + 1) >> 1;
                        }
                        break;
                    }
                    case 8: {
                        for (let y = 0; y < height; ++y) {
                            offset++;
                            for (let x = 0; x < width; ++x) {
                                let index = pixels[offset++] * 3;
                                result[cursor++] = palette[index];
                                result[cursor++] = palette[index + 1];
                                result[cursor++] = palette[index + 2];
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
}