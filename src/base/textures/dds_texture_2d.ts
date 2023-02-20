// /// <reference path="../core/resource_pool.ts"/>
// /// <reference path="./AssetPoolTemplete.ts"/>
// /// <reference path="../utils/ArrayUtil.ts"/>
// /// <reference path="../utils/ByteArray.ts"/>
// /// <reference path="../builtin.ts"/>
//
//
// namespace assets {
//     import ResourcePool = core.ResourcePool;
//     import ByteArray = utils.ByteArray;
//     import ArrayUtil = utils.ArrayUtil;
//
//
//     enum DDSType {
//         DXT_1 = 1,
//         DXT_2 = 2,
//         DXT_3 = 3,
//         DXT_4 = 4,
//         DXT_5 = 5,
//         DXT_UNKNOWN = 6
//     }
//
//     enum ParseStatus {
//         UNINITIALIZED,
//         PARSING,
//         PARSING_MIP,
//         PARSING_OVER
//     }
//
//     // DDSPixelFormat 的 Flags 字段可用标记如下
//     enum DDSPixelFormatFlags {
//         DDPF_ALPHAPIXELS = 0x00000001,
//         DDPF_FOURCC = 0x00000004,
//         DDPF_RGB = 0x00000040
//     }
//
//     class DDSPixelFormat {
//         public size: uint32;
//         public flags: DDSPixelFormatFlags;
//         public fourCC: uint32;
//         public rgbBitCount: uint32;
//         public rBitMask: uint32;
//         public gBitMask: uint32;
//         public bBitMask: uint32;
//         public rgbaBitMask: uint32;
//     }
//
//     // DDSCaps2 的 Caps1 字段可用标记如下
//     enum DDSCaps2Type1 {
//         DDSCAPS_COMPLEX = 0x00000008,
//         DDSCAPS_TEXTURE = 0x00001000,
//         DDSCAPS_MIPMAP = 0x00400000
//     }
//
//     // DDSCaps2 的 Caps2 字段可用标记如下
//     enum DDSCaps2Type2 {
//         DDSCAPS2_CUBEMAP = 0x00000200,
//         DDSCAPS2_CUBEMAP_POSITIVEX = 0x00000400,
//         DDSCAPS2_CUBEMAP_NEGATIVEX = 0x00000800,
//         DDSCAPS2_CUBEMAP_POSITIVEY = 0x00001000,
//         DDSCAPS2_CUBEMAP_NEGATIVEY = 0x00002000,
//         DDSCAPS2_CUBEMAP_POSITIVEZ = 0x00004000,
//         DDSCAPS2_CUBEMAP_NEGATIVEZ = 0x00008000,
//         DDSCAPS2_VOLUME = 0x00200000
//     }
//
//     class DDSCaps2 {
//         caps1: DDSCaps2Type1;
//         caps2: DDSCaps2Type2;
//         reserved: uint32 = 4 * 2;           // 保留字段的长度
//     }
//
//     const MAGIC: number = 0x20534444; //"DDS "
//
//     // DDSFileHeader 的 Flags 字段可用标记如下
//     enum DDSFileHeaderFlags {
//         DDSD_CAPS = 0x00000001,
//         DDSD_HEIGHT = 0x00000002,
//         DDSD_WIDTH = 0x00000004,
//         DDSD_PITCH = 0x00000008,
//         DDSD_PIXELFORMAT = 0x00001000,
//         DDSD_MIPMAPCOUNT = 0x00020000,
//         DDSD_LINEARSIZE = 0x00080000,
//         DDSD_DEPTH = 0x00800000
//     }
//
//     // 文件头
//     class DDSFileHeader {
//         magic: uint32;
//         size: uint32;
//         flags: DDSFileHeaderFlags;
//         height: uint32;
//         width: uint32;
//         pitchOrLinearSize: uint32;
//         depth: uint32;
//         mipMapCount: uint32;
//         reserved1: uint32 = 4 * 11;         // 保留字段的长度
//         ddpfPixelFormat: DDSPixelFormat;
//         ddsCaps: DDSCaps2;
//         reserved2: uint32 = 4;              // 保留字段，目前为空
//     }
//
//     class DDSParseEntry {
//         private static _freeEntry: DDSParseEntry = null;
//
//         public static allocEntry(): DDSParseEntry {
//             let result: DDSParseEntry;
//             if (this._freeEntry != null) {
//                 result = this._freeEntry;
//                 this._freeEntry = this._freeEntry.next;
//             } else {
//                 result = new DDSParseEntry();
//             }
//
//             return result;
//         }
//
//         public static freeEntry(entry: DDSParseEntry): void {
//             entry.next = this._freeEntry;
//             this._freeEntry = entry;
//         }
//
//         private next: DDSParseEntry;
//     }
//
//     // 用比例因子缩放ARGB 8:8:8:8
//     function color_scale(color: uint32, s: number): uint32 {
//         let a: uint32 = (((color & 0xFF000000) >> 24) * s) & 0xFFFFFFFF;
//         let r: uint32 = (((color & 0x00FF0000) >> 16) * s) & 0xFFFFFFFF;
//         let g: uint32 = (((color & 0x0000FF00) >> 8) * s) & 0xFFFFFFFF;
//         let b: uint32 = (((color & 0x000000FF)) * s) & 0xFFFFFFFF;
//
//         return ((a << 24) | (r << 16) | (g << 8) | b);
//     }
//
//     // 颜色相加。(alpha不参与运算，直接为0xFF)
//     function color_add(c1: uint32, c2: uint32): uint32 {
//         let a: uint32 = (c1 & 0xFF000000) >> 24;
//         let r: uint32 = (c1 & 0x00FF0000) >> 16;
//         let g: uint32 = (c1 & 0x0000FF00) >> 8;
//         let b: uint32 = (c1 & 0x000000FF);
//
//         a += (c2 & 0xFF000000) >> 24;
//         r += (c2 & 0x00FF0000) >> 16;
//         g += (c2 & 0x0000FF00) >> 8;
//         b += (c2 & 0x000000FF);
//
//         if (a > 0xFF) a = 0xFF;
//         if (r > 0xFF) r = 0xFF;
//         if (g > 0xFF) g = 0xFF;
//         if (b > 0xFF) b = 0xFF;
//
//         return ((a << 24) | (r << 16) | (g << 8) | b);
//     }
//
//     function canHandleThisFormat(header: DDSFileHeader): boolean {
//         // 这些标记是必有的，否则认为图片格式不正确
//         if (!(header.flags & DDSFileHeaderFlags.DDSD_CAPS) ||
//             !(header.flags & DDSFileHeaderFlags.DDSD_HEIGHT) ||
//             !(header.flags & DDSFileHeaderFlags.DDSD_WIDTH) ||
//             !(header.flags & DDSFileHeaderFlags.DDSD_PIXELFORMAT) ||
//             !(header.flags & DDSFileHeaderFlags.DDSD_LINEARSIZE))
//             return false;
//
//         // 只处理 DXT? 格式的，不处理其他非压缩格式
//         if (!(header.ddpfPixelFormat.flags & DDSPixelFormatFlags.DDPF_FOURCC))
//             return false;
//
//         // 只处理 DXT1, DXT3, DXT5
//         let fmt: int32 = getDXTFormat(header.ddpfPixelFormat.fourCC);
//         if (fmt != DDSType.DXT_1 && fmt != DDSType.DXT_3 && fmt != DDSType.DXT_5)
//             return false;
//
//         // 只处理Texture类型的，Cube map 和 Volume texture不支持
//         if (header.ddsCaps.caps2 & DDSCaps2Type2.DDSCAPS2_CUBEMAP ||
//             header.ddsCaps.caps2 & DDSCaps2Type2.DDSCAPS2_VOLUME)
//             return false;
//
//         // 可以处理的格式
//         return true;
//     }
//
//     // 求两种颜色的“距离”。(排除alpha值)
//     function color_distance(c1: uint32, c2: uint32): uint32 {
//         // 分解出color1的通道
//         let r1: uint32 = (c1 & 0x00FF0000) >> 16;
//         let g1: uint32 = (c1 & 0x0000FF00) >> 8;
//         let b1: uint32 = (c1 & 0x000000FF);
//
//         // 分解出color2的通道
//         let r2: uint32 = (c2 & 0x00FF0000) >> 16;
//         let g2: uint32 = (c2 & 0x0000FF00) >> 8;
//         let b2: uint32 = (c2 & 0x000000FF);
//
//         return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
//     }
//
//     // 返回DXT的类型，未知返回DXT_UNKNOWN
//     function getDXTFormat(fourcc: int32): int32 {
//         // 必须是 'DXT?' 样式的
//         if ((fourcc & 0x00FFFFFF) != 0x00545844)
//             return DDSType.DXT_UNKNOWN;
//
//         // 取看是第几种
//         let type: int32 = (fourcc >> 24) - '0'.charCodeAt(0);
//         if (type >= 1 && type <= 5)
//             return type;
//
//         // 不是有效的类型范围
//         return DDSType.DXT_UNKNOWN;
//     }
//
//     function BLOCKSIZE(fmt: int32): int32 {
//         return fmt == DDSType.DXT_1 ? 8 : 16;
//     }
//
//     function BLOCKNUM(value: int32): int32 {
//         return (value + 3) >> 2;
//     }
//
//     class DDSParser {
//         private _mipCount: int32 = 1;
//         private _blockSize: int32 = 0;
//
//         private _status: ParseStatus = ParseStatus.UNINITIALIZED;
//
//         private _currentMip: int32 = -1;
//         private _mipWidth: int32 = 0;
//         private _mipHeight: int32 = 0;
//
//         private _blockWidth: int32 = 0;
//         private _blockHeight: int32 = 0;
//         private _blockX: int32 = 0;
//         private _blockY: int32 = 0;
//
//         private _format: int32 = 0;
//
//         private _dataPointer: int32 = 0;
//         private _resultPointer: int32 = 0;
//
//         private _colorBuffer: Array<int32>;
//         private _alphaBuffer: Array<int32>;
//
//         private _tempColor: Array<int32> = new Array<int32>(4);
//
//         private _header: DDSFileHeader = new DDSFileHeader();
//
//         private _bytes: ByteArray;
//         private _result: ByteArray;
//         private _image: ImageData;
//
//         constructor() {
//
//         }
//
//         public get image(): ImageData {
//             return this._image;
//         }
//
//         public get result(): ByteArray {
//             return this._result;
//         }
//
//         public reset(buffer: ArrayBuffer): void {
//             this._image = null;
//             this._bytes = new ByteArray(buffer);
//             this._bytes.littleEndian = true;
//             // 复制文件头信息
//             this._header.magic = this._bytes.readUint32();
//             this._header.size = this._bytes.readUint32();
//             this._header.flags = this._bytes.readUint32();
//             this._header.height = this._bytes.readUint32();
//             this._header.width = this._bytes.readUint32();
//             this._header.pitchOrLinearSize = this._bytes.readUint32();
//             this._header.depth = this._bytes.readUint32();
//             this._header.mipMapCount = this._bytes.readUint32();
//             this._header.ddpfPixelFormat = new DDSPixelFormat();
//             this._bytes.position += this._header.reserved1;
//             this._header.ddpfPixelFormat.size = this._bytes.readUint32();
//             this._header.ddpfPixelFormat.flags = this._bytes.readUint32();
//             this._header.ddpfPixelFormat.fourCC = this._bytes.readUint32();
//             this._header.ddpfPixelFormat.rgbBitCount = this._bytes.readUint32();
//             this._header.ddpfPixelFormat.rBitMask = this._bytes.readUint32();
//             this._header.ddpfPixelFormat.gBitMask = this._bytes.readUint32();
//             this._header.ddpfPixelFormat.bBitMask = this._bytes.readUint32();
//             this._header.ddpfPixelFormat.rgbaBitMask = this._bytes.readUint32();
//             this._header.ddsCaps = new DDSCaps2();
//             this._header.ddsCaps.caps1 = this._bytes.readUint32();
//             this._header.ddsCaps.caps2 = this._bytes.readUint32();
//             this._bytes.position += this._header.ddsCaps.reserved;
//             this._bytes.position += this._header.reserved2;
//
//             if (this._header.magic != MAGIC) {
//                 throw new Error("");
//             }
//
//             // 检查是否能处理这样的格式
//             if (!canHandleThisFormat(this._header)) {
//                 throw Error("");
//             }
//
//             // 取回需要解压的层数(没有mipmap当做有1层)
//             this._mipCount = 1;
//             //关闭MIP
// //			if (_header.flags & DDSFileHeader.DDSD_MIPMAPCOUNT)
// //				_mipCount = _header.mipMapCount;
//
//             // 取回宽高信息
//             let width: uint32 = this._header.width;
//             let height: uint32 = this._header.height;
//
//             let totalSize: uint32 = 0;
//             for (let i: uint32 = 0; i < this._mipCount; i++) {
//                 // 累计所有层需要的缓冲大小
//                 totalSize += width * height * 4;
//
//                 // 计算出下一层mipmap的宽高
//                 width = Math.max(1, width >> 1);
//                 height = Math.max(1, height >> 1);
//             }
//
//
//             this._result = new ByteArray(new ArrayBuffer(totalSize));
//             // this._result.littleEndian = true;
//
//             // 取回DXT格式
//             this._format = getDXTFormat(this._header.ddpfPixelFormat.fourCC);
//             this._blockSize = BLOCKSIZE(this._format);
//
//             // 初始化颜色和透明度缓冲
//             this._colorBuffer = new Array<int32>(16);
//             this._alphaBuffer = new Array<int32>(16);
//
//             this._currentMip = 0;
//
//             this._mipWidth = Math.max(1, this._header.width);
//             this._mipHeight = Math.max(1, this._header.height);
//             this._dataPointer = this._bytes.position;
//             this._resultPointer = this._result.position;
//             // 压缩块的宽高信息
//             this._blockWidth = Math.max(1, BLOCKNUM(this._mipWidth));
//             this._blockHeight = Math.max(1, BLOCKNUM(this._mipHeight));
//
//             this._blockY = 0;
//             this._blockX = 0;
//
//             this._status = ParseStatus.PARSING_MIP;
//         }
//
//         private decodeAlphaDXT3(pblk: ByteArray): void {
//             let position: int32 = pblk.position;
//             let i: uint32 = 0;
//             for (let row = 0; row < 4; ++row) {
//                 pblk.position = position + 2 * row;
//                 let d: uint16 = pblk.readUint16();
//                 for (let col = 0; col < 4; ++col) {
//                     let alpha = (d & 0x0F) * 17;
//                     this._alphaBuffer[i++] = alpha;
//                     d >>= 4;
//                 }
//             }
//             pblk.position = position + 8;
//         }
//
//         // DXT5格式解alpha通道
//         private decodeAlphaDXT5(pblk: ByteArray): void {
//             // alpha值查找表
//             let alphas: Array<int32> = new Array<int32>(8);
//             let dd: int32;
//
//             // 取到alpha_0和alpha_1
//             alphas[0] = pblk.readUint8();
//             alphas[1] = pblk.readUint8();
//
//             if (alphas[0] > alphas[1]) {
//                 // 8-alpha mode
//                 // Bit code 000 = alpha_0, 001 = alpha_1, others are interpolated.
//                 alphas[2] = (6 * alphas[0] + 1 * alphas[1] + 3) / 7;    // bit code 010
//                 alphas[3] = (5 * alphas[0] + 2 * alphas[1] + 3) / 7;    // bit code 011
//                 alphas[4] = (4 * alphas[0] + 3 * alphas[1] + 3) / 7;    // bit code 100
//                 alphas[5] = (3 * alphas[0] + 4 * alphas[1] + 3) / 7;    // bit code 101
//                 alphas[6] = (2 * alphas[0] + 5 * alphas[1] + 3) / 7;    // bit code 110
//                 alphas[7] = (1 * alphas[0] + 6 * alphas[1] + 3) / 7;    // bit code 111
//             }
//             else {
//                 // 6-alpha mode
//                 // Bit code 000 = alpha_0, 001 = alpha_1, others are interpolated.
//                 alphas[2] = (4 * alphas[0] + 1 * alphas[1] + 2) / 5;    // bit code 010
//                 alphas[3] = (3 * alphas[0] + 2 * alphas[1] + 2) / 5;    // bit code 011
//                 alphas[4] = (2 * alphas[0] + 3 * alphas[1] + 2) / 5;    // bit code 100
//                 alphas[5] = (1 * alphas[0] + 4 * alphas[1] + 2) / 5;    // bit code 101
//                 alphas[6] = 0;                                          // bit code 110
//                 alphas[7] = 255;                                        // bit code 111
//             }
//
//             // 解码4*4的alpha信息块
//             let position: int32 = pblk.position;
//             for (let i: int32 = 0; i < 16; i++) {
//                 let row: int32 = i >> 2;
//                 let col: int32 = i % 4;
//                 pblk.position = position + (row >> 1) * 3;
//                 dd = pblk.readInt32();
//                 let off: int32 = (i % 8) * 3;
//                 let idx: int32 = (dd & (0x07 << off)) >> off;
//                 //_alphaBuffer[row][col] = alphas[idx];
//                 this._alphaBuffer[i] = alphas[idx];
//             }
//
//             // 跳过alpha块，除去之前已经跳过的2个字节
//             pblk.position = position + (8 - 2);
//         }
//
//         private decodeOneBlock(pblk: ByteArray, size: int32, fmt: int32): boolean {
//             for (let i = 0; i < this._alphaBuffer.length; ++i) {
//                 this._alphaBuffer[i] = 0xFF;
//             }
//
//             // 如果fmt指明是 DXT2-DXT5，需要先解码出alpha的信息
//             if (fmt == DDSType.DXT_2 || fmt == DDSType.DXT_3) {
//                 this.decodeAlphaDXT3(pblk);
//             } else if (fmt == DDSType.DXT_4 || fmt == DDSType.DXT_5) {
//                 this.decodeAlphaDXT5(pblk);
//             }
//
//
//             // 调色板中的四种颜色
//             let colors: Array<int32> = this._tempColor;
//             let f3colorMode: boolean = false;
//
//             // 取两个调色的原始颜色
//             let _color0: int16 = pblk.readInt16();
//             let _color1: int16 = pblk.readInt16();
//
//             // 计算出插值颜色
//             if ((_color0 >= _color1) || fmt != DDSType.DXT_1) {
//                 // _color0和_color1的格式为RGB 5:6:5。四色模式
//                 colors[0] = 0xFF000000 | ((_color0 & 0xF800) << 8) | ((_color0 & 0x07E0) << 5) | ((_color0 & 0x001F) << 3);
//                 colors[1] = 0xFF000000 | ((_color1 & 0xF800) << 8) | ((_color1 & 0x07E0) << 5) | ((_color1 & 0x001F) << 3);
//
//                 colors[2] = color_add(color_scale(colors[0], 2.0 / 3), color_scale(colors[1], 1.0 / 3));
//                 colors[3] = color_add(color_scale(colors[0], 1.0 / 3), color_scale(colors[1], 2.0 / 3));
//             } else {
//                 // _color0和_color1的格式为RGBA 5:5:5:1。三色模式
//                 colors[0] = 0xFF000000 | ((_color0 & 0xF800) << 8) | ((_color0 & 0x07C0) << 5) | ((_color0 & 0x003F) << 3);
//                 colors[1] = 0xFF000000 | ((_color1 & 0xF800) << 8) | ((_color1 & 0x07C0) << 5) | ((_color1 & 0x003F) << 3);
//
//                 colors[2] = color_add(color_scale(colors[0], 1.0 / 2), color_scale(colors[1], 1.0 / 2));
//                 colors[3] = 0x00000000; // 透明
//                 f3colorMode = true;
//             }
//
//             let position: uint32 = pblk.position;
//             let row: int32;
//             let col: int32;
//             let off: int32;
//             let idx: int32;
//
//             if (f3colorMode) {
//                 // 解码 (4 * 4) = 16 个像素
//                 for (let i = 0; i < 16; i++) {
//                     row = i >> 2;
//                     col = i % 4;
//
//                     // 根据块信息求出像素点的索引
//                     off = col << 1;
//                     idx = (pblk.byteOf(position + row) & (0x03 << off)) >> off;
//
//                     if (idx == 3) {
//                         this._colorBuffer[i] = 0;
//                     } else {
//                         // this._colorBuffer[i] = (colors[idx] & 0x00FFFFFF) | (this._alphaBuffer[i] << 24);
//                         this._colorBuffer[i] = ((colors[idx] & 0x00FFFFFF) << 8) | this._alphaBuffer[i];
//                     }
//                 }
//             } else {
//                 for (let i = 0; i < 16; i++) {
//                     row = i >> 2;
//                     col = i % 4;
//
//                     // 根据块信息求出像素点的索引
//                     off = col << 1;
//                     idx = (pblk.byteOf(position + row) & (0x03 << off)) >> off;
//
//                     // this._colorBuffer[i] = (colors[idx] & 0x00FFFFFF) | (this._alphaBuffer[i] << 24);
//                     this._colorBuffer[i] = ((colors[idx] & 0x00FFFFFF) << 8) | this._alphaBuffer[i];
//                 }
//             }
//
//             // 解码本块成功
//             return true;
//         }
//
//         private parseCurrent(): void {
//             if (this._blockX >= this._blockWidth) {
//                 this._blockX = 0;
//                 ++this._blockY;
//                 if (this._blockY >= this._blockHeight) {
//                     this._status = ParseStatus.PARSING;
//                     return;
//                 }
//             }
//
//             this._bytes.position = this._dataPointer + (this._blockY * this._blockWidth + this._blockX) * this._blockSize;
//             this.decodeOneBlock(this._bytes, this._blockSize, this._format);
//
//             const offsetX: int32 = this._blockX << 2;
//             const offsetY: int32 = this._blockY << 2;
//             let x: int32;
//             let y: int32;
//             let j: int32;
//             let k: int32;
//             let limitY: int32 = offsetY + 4;
//             if (limitY > this._mipHeight) {
//                 limitY = this._mipHeight;
//             }
//
//             let limitX: int32 = offsetX + 4;
//             if (limitX > this._mipWidth) {
//                 limitX = this._mipWidth;
//             }
//
//             let pos: int32 = this._resultPointer + this._mipWidth * offsetY;
//             for (y = offsetY, j = 0; y < limitY; ++y, j += 4, pos += this._mipWidth) {
//                 this._result.position = (pos + offsetX) << 2;
//                 for (x = offsetX, k = j; x < limitX; ++x, ++k) {
//                     this._result.writeUint32(this._colorBuffer[k]);
//                 }
//             }
//             ++this._blockX;
//         }
//
//         private parseNextMIP(): void {
//             if (++this._currentMip < this._mipCount) {
//                 this._bytes.position = this._dataPointer + Math.max(1, BLOCKNUM(this._mipWidth)) * Math.max(1, BLOCKNUM(this._mipHeight)) * this._blockSize;
//                 this._result.position = this._resultPointer + this._mipWidth * this._mipHeight * 4;
//
//                 this._mipWidth = Math.max(1, this._header.width >> this._currentMip);
//                 this._mipHeight = Math.max(1, this._header.height >> this._currentMip);
//                 this._dataPointer = this._bytes.position;
//                 this._resultPointer = this._result.position;
//                 // 压缩块的宽高信息
//                 this._blockWidth = Math.max(1, BLOCKNUM(this._mipWidth));
//                 this._blockHeight = Math.max(1, BLOCKNUM(this._mipHeight));
//
//                 this._blockY = 0;
//                 this._blockX = 0;
//
//                 this._status = ParseStatus.PARSING_MIP;
//             } else {
//                 this._status = ParseStatus.PARSING_OVER;
//             }
//         }
//
//         public proceedParsing(): boolean {
//             let now: number = Date.now();
//
//             while (this._bytes.bytesAvailable > 0 && (Date.now() - now) < 10) {
//                 if (this._status == ParseStatus.PARSING_MIP) {
//                     this.parseCurrent();
//                 } else if (this._status == ParseStatus.PARSING) {
//                     this.parseNextMIP();
//                 }
//             }
//
//             if (this._bytes.bytesAvailable == 0 || this._status == ParseStatus.PARSING_OVER) {
//                 //this._texture = new Uint8Array(this._result.buffer);
//                 this._image = new ImageData(new Uint8ClampedArray(this._result.buffer), this._header.width, this._header.height);
//                 return true;
//             }
//
//             return false;
//         }
//     }
//
//     export class DDSPool extends AssetPoolTemplete {
//         private static _instance: DDSPool = new DDSPool();
//
//         public static get instance(): DDSPool {
//             return this._instance;
//         }
//
//         private readonly _resourcePool: ResourcePool;
//         private readonly _parser: DDSParser;
//         private readonly _parserQueue: Array<PoolEntry>;
//
//         private constructor() {
//             super("DDSPool");
//             this._resourcePool = ResourcePool.instance;
//             this._parser = new DDSParser();
//             this._parserQueue = [];
//         }
//
//         protected releaseEntry(entry: PoolEntry): boolean {
//             switch (entry.status) {
//                 case 0:
//                     this._resourcePool.cancel(entry.url, this.onResourceComplete);
//                     break;
//                 case 1:
//                     ArrayUtil.remove(this._parserQueue, entry);
//                     break;
//             }
//             return true;
//         }
//
//         protected initEntry(entry: PoolEntry): void {
//             entry.status = 0;
//             this._resourcePool.load(entry.url, this.onResourceComplete);
//         }
//
//         protected doRecover(entry: PoolEntry): void {
//             super.doRecover(entry);
//         }
//
//         private onResourceComplete = (url: string, handle: number, res: ArrayBuffer): void => {
//             if (res == null) {
//                 this.onComplete(url, null);
//                 return;
//             }
//
//             let entry = this._waitPool[url];
//             entry.assets.push(handle);
//             entry.status = 1;
//             this._parserQueue.push(entry);
//
//             if (this._parserQueue.length == 1) {
//                 this._parser.reset(res);
//             }
//         }
//
//         public update(): void {
//             super.update();
//
//             if (this._parserQueue.length != 0 && this._parser.proceedParsing()) {
//                 let entry: PoolEntry = this._parserQueue.shift();
//                 entry.status = 2;
//                 this.onComplete(entry.url, this._parser.image);
//                 if (this._parserQueue.length != 0) {
//                     entry = this._parserQueue[0];
//                     this._parser.reset(this._handlePool.getValue<ArrayBuffer>(entry.assets[0]));
//                 }
//             }
//         }
//     }
// }
//

///<reference path="../assets/handle_pool.ts"/>
///<reference path="../assets/resource_pool.ts"/>


namespace base.textures {
    import Byte = Laya.Byte;
    import Resource = Laya.Resource;

    const enum DDSType {
        DXT_1 = 1,
        DXT_2 = 2,
        DXT_3 = 3,
        DXT_4 = 4,
        DXT_5 = 5,
        DXT_UNKNOWN = 6
    }

    const enum ParseStatus {
        UNINITIALIZED,
        PARSING,
        PARSING_MIP,
        PARSING_OVER
    }

    // DDSPixelFormat 的 Flags 字段可用标记如下
    const enum DDSPixelFormatFlags {
        DDPF_ALPHAPIXELS = 0x00000001,
        DDPF_FOURCC = 0x00000004,
        DDPF_RGB = 0x00000040
    }

    class DDSPixelFormat {
        public size: uint32;
        public flags: DDSPixelFormatFlags;
        public fourCC: uint32;
        public rgbBitCount: uint32;
        public rBitMask: uint32;
        public gBitMask: uint32;
        public bBitMask: uint32;
        public rgbaBitMask: uint32;
    }

    // DDSCaps2 的 Caps1 字段可用标记如下
    const enum DDSCaps2Type1 {
        DDSCAPS_COMPLEX = 0x00000008,
        DDSCAPS_TEXTURE = 0x00001000,
        DDSCAPS_MIPMAP = 0x00400000
    }

    // DDSCaps2 的 Caps2 字段可用标记如下
    const enum DDSCaps2Type2 {
        DDSCAPS2_CUBEMAP = 0x00000200,
        DDSCAPS2_CUBEMAP_POSITIVEX = 0x00000400,
        DDSCAPS2_CUBEMAP_NEGATIVEX = 0x00000800,
        DDSCAPS2_CUBEMAP_POSITIVEY = 0x00001000,
        DDSCAPS2_CUBEMAP_NEGATIVEY = 0x00002000,
        DDSCAPS2_CUBEMAP_POSITIVEZ = 0x00004000,
        DDSCAPS2_CUBEMAP_NEGATIVEZ = 0x00008000,
        DDSCAPS2_VOLUME = 0x00200000
    }

    class DDSCaps2 {
        caps1: DDSCaps2Type1;
        caps2: DDSCaps2Type2;
        reserved: uint32 = 4 * 2;           // 保留字段的长度
    }

    const MAGIC: number = 0x20534444; //"DDS "

    // DDSFileHeader 的 Flags 字段可用标记如下
    const enum DDSFileHeaderFlags {
        DDSD_CAPS = 0x00000001,
        DDSD_HEIGHT = 0x00000002,
        DDSD_WIDTH = 0x00000004,
        DDSD_PITCH = 0x00000008,
        DDSD_PIXELFORMAT = 0x00001000,
        DDSD_MIPMAPCOUNT = 0x00020000,
        DDSD_LINEARSIZE = 0x00080000,
        DDSD_DEPTH = 0x00800000
    }

    const enum Constant {
        Bit24 = 1 << 24,
        Bit16 = 1 << 16,
        Bit8 = 1 << 8,
    }

    // 文件头
    class DDSFileHeader {
        magic: uint32;
        size: uint32;
        flags: DDSFileHeaderFlags;
        height: uint32;
        width: uint32;
        pitchOrLinearSize: uint32;
        depth: uint32;
        mipMapCount: uint32;
        reserved1: uint32 = 4 * 11;         // 保留字段的长度
        ddpfPixelFormat: DDSPixelFormat;
        ddsCaps: DDSCaps2;
        reserved2: uint32 = 4;              // 保留字段，目前为空
    }

    // 用比例因子缩放ARGB 8:8:8:8
    function color_scale(color: uint32, s: number): uint32 {
        // let a: uint32 = (((color & 0xFF000000) >> 24) * s) & 0xFFFFFFFF;
        // let r: uint32 = (((color & 0x00FF0000) >> 16) * s) & 0xFFFFFFFF;
        // let g: uint32 = (((color & 0x0000FF00) >> 8) * s) & 0xFFFFFFFF;
        // let b: uint32 = (((color & 0x000000FF)) * s) & 0xFFFFFFFF;
        let a: uint32 = (((color >>> 24) & 0xFF) * s) & 0xFF;
        let r: uint32 = (((color >>> 16) & 0xFF) * s) & 0xFF;
        let g: uint32 = (((color >>> 8) & 0xFF) * s) & 0xFF;
        let b: uint32 = (((color & 0xFF)) * s) & 0xFF;

        return ((a * Constant.Bit24) + (r * Constant.Bit16) + (g * Constant.Bit8) + b);
    }

    // 颜色相加。(alpha不参与运算，直接为0xFF)
    function color_add(c1: uint32, c2: uint32): uint32 {
        // let a: uint32 = (c1 & 0xFF000000) >> 24;
        // let r: uint32 = (c1 & 0x00FF0000) >> 16;
        // let g: uint32 = (c1 & 0x0000FF00) >> 8;
        // let b: uint32 = (c1 & 0x000000FF);
        let a: uint32 = (c1 >>> 24) & 0xFF;
        let r: uint32 = (c1 >>> 16) & 0xFF;
        let g: uint32 = (c1 >>> 8) & 0xFF;
        let b: uint32 = (c1 & 0xFF);

        // a += (c2 & 0xFF000000) >> 24;
        // r += (c2 & 0x00FF0000) >> 16;
        // g += (c2 & 0x0000FF00) >> 8;
        // b += (c2 & 0x000000FF);
        a += (c2 >>> 24) & 0xFF;
        r += (c2 >>> 16) & 0xFF;
        g += (c2 >>> 8) & 0xFF;
        b += (c2 & 0xFF);

        if (a > 0xFF) a = 0xFF;
        if (r > 0xFF) r = 0xFF;
        if (g > 0xFF) g = 0xFF;
        if (b > 0xFF) b = 0xFF;

        return ((a * Constant.Bit24) + (r * Constant.Bit16) + (g * Constant.Bit8) + b);
    }

    function canHandleThisFormat(header: DDSFileHeader): boolean {
        // 这些标记是必有的，否则认为图片格式不正确
        if (!(header.flags & DDSFileHeaderFlags.DDSD_CAPS) ||
            !(header.flags & DDSFileHeaderFlags.DDSD_HEIGHT) ||
            !(header.flags & DDSFileHeaderFlags.DDSD_WIDTH) ||
            !(header.flags & DDSFileHeaderFlags.DDSD_PIXELFORMAT) ||
            !(header.flags & DDSFileHeaderFlags.DDSD_LINEARSIZE))
            return false;

        // 只处理 DXT? 格式的，不处理其他非压缩格式
        if (!(header.ddpfPixelFormat.flags & DDSPixelFormatFlags.DDPF_FOURCC))
            return false;

        // 只处理 DXT1, DXT3, DXT5
        let fmt: int32 = getDXTFormat(header.ddpfPixelFormat.fourCC);
        if (fmt != DDSType.DXT_1 && fmt != DDSType.DXT_3 && fmt != DDSType.DXT_5)
            return false;

        // 只处理Texture类型的，Cube map 和 Volume texture不支持
        if (header.ddsCaps.caps2 & DDSCaps2Type2.DDSCAPS2_CUBEMAP ||
            header.ddsCaps.caps2 & DDSCaps2Type2.DDSCAPS2_VOLUME)
            return false;

        // 可以处理的格式
        return true;
    }

    // 求两种颜色的“距离”。(排除alpha值)
    function color_distance(c1: uint32, c2: uint32): uint32 {
        // 分解出color1的通道
        let r1: uint32 = (c1 & 0x00FF0000) >> 16;
        let g1: uint32 = (c1 & 0x0000FF00) >> 8;
        let b1: uint32 = (c1 & 0x000000FF);

        // 分解出color2的通道
        let r2: uint32 = (c2 & 0x00FF0000) >> 16;
        let g2: uint32 = (c2 & 0x0000FF00) >> 8;
        let b2: uint32 = (c2 & 0x000000FF);

        return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
    }

    // 返回DXT的类型，未知返回DXT_UNKNOWN
    function getDXTFormat(fourcc: int32): int32 {
        // 必须是 'DXT?' 样式的
        if ((fourcc & 0x00FFFFFF) != 0x00545844)
            return DDSType.DXT_UNKNOWN;

        // 取看是第几种
        let type: int32 = (fourcc >> 24) - '0'.charCodeAt(0);
        if (type >= 1 && type <= 5)
            return type;

        // 不是有效的类型范围
        return DDSType.DXT_UNKNOWN;
    }

    function BLOCKSIZE(fmt: int32): int32 {
        return fmt == DDSType.DXT_1 ? 8 : 16;
    }

    function BLOCKNUM(value: int32): int32 {
        return (value + 3) >> 2;
    }

    class DDSParser {
        private _mipCount: int32 = 1;
        private _blockSize: int32 = 0;

        private _status: ParseStatus = ParseStatus.UNINITIALIZED;

        private _currentMip: int32 = -1;
        private _mipWidth: int32 = 0;
        private _mipHeight: int32 = 0;

        private _blockWidth: int32 = 0;
        private _blockHeight: int32 = 0;
        private _blockX: int32 = 0;
        private _blockY: int32 = 0;

        private _format: int32 = 0;

        private _dataPointer: int32 = 0;
        private _resultPointer: int32 = 0;

        private _colorBuffer: Uint32Array;
        private _alphaBuffer: Uint32Array;

        private _tempColor: Uint32Array = new Uint32Array(4);

        private _header: DDSFileHeader = new DDSFileHeader();

        private _bytes: Byte;
        private _result: Byte;

        constructor() {

        }

        public get result(): Byte {
            return this._result;
        }

        public get hander(): DDSFileHeader {
            return this._header;
        }

        public reset(buffer: ArrayBuffer): void {
            this._bytes = new Byte(buffer);
            this._bytes.endian = Byte.LITTLE_ENDIAN;
            // 复制文件头信息
            this._header.magic = this._bytes.getUint32();
            this._header.size = this._bytes.getUint32();
            this._header.flags = this._bytes.getUint32();
            this._header.height = this._bytes.getUint32();
            this._header.width = this._bytes.getUint32();
            this._header.pitchOrLinearSize = this._bytes.getUint32();
            this._header.depth = this._bytes.getUint32();
            this._header.mipMapCount = this._bytes.getUint32();
            this._header.ddpfPixelFormat = new DDSPixelFormat();
            this._bytes.pos += this._header.reserved1;
            this._header.ddpfPixelFormat.size = this._bytes.getUint32();
            this._header.ddpfPixelFormat.flags = this._bytes.getUint32();
            this._header.ddpfPixelFormat.fourCC = this._bytes.getUint32();
            this._header.ddpfPixelFormat.rgbBitCount = this._bytes.getUint32();
            this._header.ddpfPixelFormat.rBitMask = this._bytes.getUint32();
            this._header.ddpfPixelFormat.gBitMask = this._bytes.getUint32();
            this._header.ddpfPixelFormat.bBitMask = this._bytes.getUint32();
            this._header.ddpfPixelFormat.rgbaBitMask = this._bytes.getUint32();
            this._header.ddsCaps = new DDSCaps2();
            this._header.ddsCaps.caps1 = this._bytes.getUint32();
            this._header.ddsCaps.caps2 = this._bytes.getUint32();
            this._bytes.pos += this._header.ddsCaps.reserved;
            this._bytes.pos += this._header.reserved2;

            if (this._header.magic != MAGIC) {
                throw new Error("");
            }

            // 检查是否能处理这样的格式
            if (!canHandleThisFormat(this._header)) {
                throw Error("");
            }

            // 取回需要解压的层数(没有mipmap当做有1层)
            this._mipCount = 1;
            //关闭MIP
//			if (_header.flags & DDSFileHeader.DDSD_MIPMAPCOUNT)
//				_mipCount = _header.mipMapCount;

            // 取回宽高信息
            let width: uint32 = this._header.width;
            let height: uint32 = this._header.height;

            let totalSize: uint32 = 0;
            for (let i: uint32 = 0; i < this._mipCount; i++) {
                // 累计所有层需要的缓冲大小
                totalSize += width * height * 4;

                // 计算出下一层mipmap的宽高
                width = Math.max(1, width >> 1);
                height = Math.max(1, height >> 1);
            }


            this._result = new Byte(new ArrayBuffer(totalSize));
            this._result.endian = Byte.BIG_ENDIAN;

            // 取回DXT格式
            this._format = getDXTFormat(this._header.ddpfPixelFormat.fourCC);
            this._blockSize = BLOCKSIZE(this._format);

            // 初始化颜色和透明度缓冲
            this._colorBuffer = new Uint32Array(16);
            this._alphaBuffer = new Uint32Array(16);

            this._currentMip = 0;

            this._mipWidth = Math.max(1, this._header.width);
            this._mipHeight = Math.max(1, this._header.height);
            this._dataPointer = this._bytes.pos;
            this._resultPointer = this._result.pos;
            // 压缩块的宽高信息
            this._blockWidth = Math.max(1, BLOCKNUM(this._mipWidth));
            this._blockHeight = Math.max(1, BLOCKNUM(this._mipHeight));

            this._blockY = 0;
            this._blockX = 0;

            this._status = ParseStatus.PARSING_MIP;
        }

        private decodeAlphaDXT3(pblk: Byte): void {
            let position: int32 = pblk.pos;
            let i: uint32 = 0;
            for (let row = 0; row < 4; ++row) {
                pblk.pos = position + 2 * row;
                let d: uint16 = pblk.getUint16();
                for (let col = 0; col < 4; ++col) {
                    let alpha = (d & 0x0F) * 17;
                    this._alphaBuffer[i++] = alpha;
                    d >>= 4;
                }
            }
            pblk.pos = position + 8;
        }

        // DXT5格式解alpha通道
        private decodeAlphaDXT5(pblk: Byte): void {
            // alpha值查找表
            let alphas: Uint32Array = new Uint32Array(8);
            let dd: int32;

            // 取到alpha_0和alpha_1
            alphas[0] = pblk.getUint8();
            alphas[1] = pblk.getUint8();

            if (alphas[0] > alphas[1]) {
                // 8-alpha mode
                // Bit code 000 = alpha_0, 001 = alpha_1, others are interpolated.
                alphas[2] = (6 * alphas[0] + 1 * alphas[1] + 3) / 7;    // bit code 010
                alphas[3] = (5 * alphas[0] + 2 * alphas[1] + 3) / 7;    // bit code 011
                alphas[4] = (4 * alphas[0] + 3 * alphas[1] + 3) / 7;    // bit code 100
                alphas[5] = (3 * alphas[0] + 4 * alphas[1] + 3) / 7;    // bit code 101
                alphas[6] = (2 * alphas[0] + 5 * alphas[1] + 3) / 7;    // bit code 110
                alphas[7] = (1 * alphas[0] + 6 * alphas[1] + 3) / 7;    // bit code 111
            } else {
                // 6-alpha mode
                // Bit code 000 = alpha_0, 001 = alpha_1, others are interpolated.
                alphas[2] = (4 * alphas[0] + 1 * alphas[1] + 2) / 5;    // bit code 010
                alphas[3] = (3 * alphas[0] + 2 * alphas[1] + 2) / 5;    // bit code 011
                alphas[4] = (2 * alphas[0] + 3 * alphas[1] + 2) / 5;    // bit code 100
                alphas[5] = (1 * alphas[0] + 4 * alphas[1] + 2) / 5;    // bit code 101
                alphas[6] = 0;                                          // bit code 110
                alphas[7] = 255;                                        // bit code 111
            }

            // 解码4*4的alpha信息块
            let position: int32 = pblk.pos;
            for (let i: int32 = 0; i < 16; i++) {
                let row: int32 = i >> 2;
                let col: int32 = i % 4;
                pblk.pos = position + (row >> 1) * 3;
                dd = pblk.getInt32();
                let off: int32 = (i % 8) * 3;
                let idx: int32 = (dd & (0x07 << off)) >> off;
                //_alphaBuffer[row][col] = alphas[idx];
                this._alphaBuffer[i] = alphas[idx];
            }

            // 跳过alpha块，除去之前已经跳过的2个字节
            pblk.pos = position + (8 - 2);
        }

        private decodeOneBlock(pblk: Byte, size: int32, fmt: int32): boolean {
            for (let i = 0; i < this._alphaBuffer.length; ++i) {
                this._alphaBuffer[i] = 0xFF;
            }

            // 如果fmt指明是 DXT2-DXT5，需要先解码出alpha的信息
            if (fmt == DDSType.DXT_2 || fmt == DDSType.DXT_3) {
                this.decodeAlphaDXT3(pblk);
            } else if (fmt == DDSType.DXT_4 || fmt == DDSType.DXT_5) {
                this.decodeAlphaDXT5(pblk);
            }


            // 调色板中的四种颜色
            let colors: Uint32Array = this._tempColor;
            let f3colorMode: boolean = false;

            // 取两个调色的原始颜色
            let _color0: int16 = pblk.getInt16();
            let _color1: int16 = pblk.getInt16();

            // 计算出插值颜色
            if ((_color0 >= _color1) || fmt != DDSType.DXT_1) {
                // _color0和_color1的格式为RGB 5:6:5。四色模式
                colors[0] = 0xFF000000 | ((_color0 & 0xF800) << 8) | ((_color0 & 0x07E0) << 5) | ((_color0 & 0x001F) << 3);
                colors[1] = 0xFF000000 | ((_color1 & 0xF800) << 8) | ((_color1 & 0x07E0) << 5) | ((_color1 & 0x001F) << 3);

                colors[2] = color_add(color_scale(colors[0], 2.0 / 3), color_scale(colors[1], 1.0 / 3));
                colors[3] = color_add(color_scale(colors[0], 1.0 / 3), color_scale(colors[1], 2.0 / 3));
            } else {
                // _color0和_color1的格式为RGBA 5:5:5:1。三色模式
                colors[0] = 0xFF000000 | ((_color0 & 0xF800) << 8) | ((_color0 & 0x07C0) << 5) | ((_color0 & 0x003F) << 3);
                colors[1] = 0xFF000000 | ((_color1 & 0xF800) << 8) | ((_color1 & 0x07C0) << 5) | ((_color1 & 0x003F) << 3);

                colors[2] = color_add(color_scale(colors[0], 1.0 / 2), color_scale(colors[1], 1.0 / 2));
                colors[3] = 0x00000000; // 透明
                f3colorMode = true;
            }

            let position: uint32 = pblk.pos;
            let row: int32;
            let col: int32;
            let off: int32;
            let idx: int32;

            if (f3colorMode) {
                // 解码 (4 * 4) = 16 个像素
                for (let i = 0; i < 16; i++) {
                    row = i >> 2;
                    col = i % 4;

                    // 根据块信息求出像素点的索引
                    off = col << 1;
                    idx = (pblk._getUInt8(position + row) & (0x03 << off)) >> off;

                    if (idx == 3) {
                        this._colorBuffer[i] = 0;
                    } else {
                        // this._colorBuffer[i] = (colors[idx] & 0x00FFFFFF) | (this._alphaBuffer[i] << 24);
                        this._colorBuffer[i] = ((colors[idx] & 0x00FFFFFF) << 8) | this._alphaBuffer[i];
                    }
                }
            } else {
                for (let i = 0; i < 16; i++) {
                    row = i >> 2;
                    col = i % 4;

                    // 根据块信息求出像素点的索引
                    off = col << 1;
                    idx = (pblk._getUInt8(position + row) & (0x03 << off)) >> off;

                    // this._colorBuffer[i] = (colors[idx] & 0x00FFFFFF) | (this._alphaBuffer[i] << 24);
                    this._colorBuffer[i] = ((colors[idx] & 0x00FFFFFF) << 8) | this._alphaBuffer[i];
                }
            }

            // 解码本块成功
            return true;
        }

        private parseCurrent(): void {
            if (this._blockX >= this._blockWidth) {
                this._blockX = 0;
                ++this._blockY;
                if (this._blockY >= this._blockHeight) {
                    this._status = ParseStatus.PARSING;
                    return;
                }
            }

            this._bytes.pos = this._dataPointer + (this._blockY * this._blockWidth + this._blockX) * this._blockSize;
            this.decodeOneBlock(this._bytes, this._blockSize, this._format);

            const offsetX: int32 = this._blockX << 2;
            const offsetY: int32 = this._blockY << 2;
            let x: int32;
            let y: int32;
            let j: int32;
            let k: int32;
            let limitY: int32 = offsetY + 4;
            if (limitY > this._mipHeight) {
                limitY = this._mipHeight;
            }

            let limitX: int32 = offsetX + 4;
            if (limitX > this._mipWidth) {
                limitX = this._mipWidth;
            }

            let pos: int32 = this._resultPointer + this._mipWidth * offsetY;
            for (y = offsetY, j = 0; y < limitY; ++y, j += 4, pos += this._mipWidth) {
                this._result.pos = (pos + offsetX) << 2;
                for (x = offsetX, k = j; x < limitX; ++x, ++k) {
                    this._result.writeUint32(this._colorBuffer[k]);
                }
            }
            ++this._blockX;
        }

        private parseNextMIP(): void {
            if (++this._currentMip < this._mipCount) {
                this._bytes.pos = this._dataPointer + Math.max(1, BLOCKNUM(this._mipWidth)) * Math.max(1, BLOCKNUM(this._mipHeight)) * this._blockSize;
                this._result.pos = this._resultPointer + this._mipWidth * this._mipHeight * 4;

                this._mipWidth = Math.max(1, this._header.width >> this._currentMip);
                this._mipHeight = Math.max(1, this._header.height >> this._currentMip);
                this._dataPointer = this._bytes.pos;
                this._resultPointer = this._result.pos;
                // 压缩块的宽高信息
                this._blockWidth = Math.max(1, BLOCKNUM(this._mipWidth));
                this._blockHeight = Math.max(1, BLOCKNUM(this._mipHeight));

                this._blockY = 0;
                this._blockX = 0;

                this._status = ParseStatus.PARSING_MIP;
            } else {
                this._status = ParseStatus.PARSING_OVER;
            }
        }

        public proceedParsing(): void {
            while (this._status != ParseStatus.PARSING_OVER) {
                if (this._status == ParseStatus.PARSING_MIP) {
                    this.parseCurrent();
                } else if (this._status == ParseStatus.PARSING) {
                    this.parseNextMIP();
                }
            }
            this._bytes.clear();
        }
    }

    export class DDSTexture2D extends Laya.DataTexture2D {
        private static parser: DDSParser = new DDSParser();

        private _waitDestroy: boolean;
        private _timeout: number;

        private onResourceComplete = (url: string, handle: number, buffer: ArrayBuffer): void => {
            let parser = DDSTexture2D.parser;
            parser.reset(buffer);
            parser.proceedParsing();
            let info = parser.hander;
            this._buffer = parser.result.buffer;
            this._width = info.width;
            this._height = info.height;
            this._mipmap = false;
            this._magFifter = Laya.WebGLContext.LINEAR;
            this._minFifter = Laya.WebGLContext.LINEAR;
            this._size = new Laya.Size(this._width, this._height);
            this.activeResource();
            this._endLoaded();
        };

        protected constructor() {
            super();
            this._waitDestroy = false;
            this._timeout = null;
        }

        static load(url: string): DDSTexture2D {
            let cache = Resource.getResourceByURL(url) as DDSTexture2D;
            if (cache != null) {
                cache._waitDestroy = false;
                return cache;
            }
            let result = new DDSTexture2D();
            result._loaded = false;
            result._setUrl(url);
            ResourcePool.instance.load(url, result.onResourceComplete);
            return result;
        }

        public destroy(): void {
            if (!this._waitDestroy) {
                this._waitDestroy = true;
                this._timeout = Date.now() + 3 * 60 * 1000;
                return;
            }

            if (this._timeout > Date.now()) {
                return;
            }

            super.destroy();
        }
    }
}