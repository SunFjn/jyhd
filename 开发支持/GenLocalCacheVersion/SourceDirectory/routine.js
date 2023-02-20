"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        }) ||
        function (d, b) {
            for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p];
        };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DNLMarkerError = (function DNLMarkerErrorClosure() {
    function DNLMarkerError(message, scanLines) {
        this.message = message;
        this.scanLines = scanLines;
    }
    DNLMarkerError.prototype = new Error();
    DNLMarkerError.prototype.name = 'DNLMarkerError';
    DNLMarkerError.constructor = DNLMarkerError;
    return DNLMarkerError;
})();
var EOIMarkerError = (function EOIMarkerErrorClosure() {
    function EOIMarkerError(message) {
        this.message = message;
    }
    EOIMarkerError.prototype = new Error();
    EOIMarkerError.prototype.name = 'EOIMarkerError';
    EOIMarkerError.constructor = EOIMarkerError;
    return EOIMarkerError;
})();
var JpegImage = (function JpegImageClosure() {
    var dctZigZag = new Uint8Array([
        0,
        1, 8,
        16, 9, 2,
        3, 10, 17, 24,
        32, 25, 18, 11, 4,
        5, 12, 19, 26, 33, 40,
        48, 41, 34, 27, 20, 13, 6,
        7, 14, 21, 28, 35, 42, 49, 56,
        57, 50, 43, 36, 29, 22, 15,
        23, 30, 37, 44, 51, 58,
        59, 52, 45, 38, 31,
        39, 46, 53, 60,
        61, 54, 47,
        55, 62,
        63
    ]);
    var dctCos1 = 4017;
    var dctSin1 = 799;
    var dctCos3 = 3406;
    var dctSin3 = 2276;
    var dctCos6 = 1567;
    var dctSin6 = 3784;
    var dctSqrt2 = 5793;
    var dctSqrt1d2 = 2896;
    function JpegImage(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.decodeTransform, decodeTransform = _c === void 0 ? null : _c, _d = _b.colorTransform, colorTransform = _d === void 0 ? -1 : _d;
        this._decodeTransform = decodeTransform;
        this._colorTransform = colorTransform;
    }
    function buildHuffmanTable(codeLengths, values) {
        var k = 0, code = [], i, j, length = 16;
        while (length > 0 && !codeLengths[length - 1]) {
            length--;
        }
        code.push({ children: [], index: 0, });
        var p = code[0], q;
        for (i = 0; i < length; i++) {
            for (j = 0; j < codeLengths[i]; j++) {
                p = code.pop();
                p.children[p.index] = values[k];
                while (p.index > 0) {
                    p = code.pop();
                }
                p.index++;
                code.push(p);
                while (code.length <= i) {
                    code.push(q = { children: [], index: 0, });
                    p.children[p.index] = q.children;
                    p = q;
                }
                k++;
            }
            if (i + 1 < length) {
                code.push(q = { children: [], index: 0, });
                p.children[p.index] = q.children;
                p = q;
            }
        }
        return code[0].children;
    }
    function getBlockBufferOffset(component, row, col) {
        return 64 * ((component.blocksPerLine + 1) * row + col);
    }
    function decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successivePrev, successive, parseDNLMarker) {
        if (parseDNLMarker === void 0) { parseDNLMarker = false; }
        var mcusPerLine = frame.mcusPerLine;
        var progressive = frame.progressive;
        var startOffset = offset, bitsData = 0, bitsCount = 0;
        function readBit() {
            if (bitsCount > 0) {
                bitsCount--;
                return (bitsData >> bitsCount) & 1;
            }
            bitsData = data[offset++];
            if (bitsData === 0xFF) {
                var nextByte = data[offset++];
                if (nextByte) {
                    if (nextByte === 0xDC && parseDNLMarker) {
                        offset += 2;
                        var scanLines = (data[offset++] << 8) | data[offset++];
                        if (scanLines > 0 && scanLines !== frame.scanLines) {
                            throw new DNLMarkerError('Found DNL marker (0xFFDC) while parsing scan data', scanLines);
                        }
                    }
                    else if (nextByte === 0xD9) {
                        throw new EOIMarkerError('Found EOI marker (0xFFD9) while parsing scan data');
                    }
                    throw new Error("unexpected marker " + ((bitsData << 8) | nextByte).toString(16));
                }
            }
            bitsCount = 7;
            return bitsData >>> 7;
        }
        function decodeHuffman(tree) {
            var node = tree;
            while (true) {
                node = node[readBit()];
                if (typeof node === 'number') {
                    return node;
                }
                if (typeof node !== 'object') {
                    throw new Error('invalid huffman sequence');
                }
            }
        }
        function receive(length) {
            var n = 0;
            while (length > 0) {
                n = (n << 1) | readBit();
                length--;
            }
            return n;
        }
        function receiveAndExtend(length) {
            if (length === 1) {
                return readBit() === 1 ? 1 : -1;
            }
            var n = receive(length);
            if (n >= 1 << (length - 1)) {
                return n;
            }
            return n + (-1 << length) + 1;
        }
        function decodeBaseline(component, offset) {
            var t = decodeHuffman(component.huffmanTableDC);
            var diff = t === 0 ? 0 : receiveAndExtend(t);
            component.blockData[offset] = (component.pred += diff);
            var k = 1;
            while (k < 64) {
                var rs = decodeHuffman(component.huffmanTableAC);
                var s = rs & 15, r = rs >> 4;
                if (s === 0) {
                    if (r < 15) {
                        break;
                    }
                    k += 16;
                    continue;
                }
                k += r;
                var z = dctZigZag[k];
                component.blockData[offset + z] = receiveAndExtend(s);
                k++;
            }
        }
        function decodeDCFirst(component, offset) {
            var t = decodeHuffman(component.huffmanTableDC);
            var diff = t === 0 ? 0 : (receiveAndExtend(t) << successive);
            component.blockData[offset] = (component.pred += diff);
        }
        function decodeDCSuccessive(component, offset) {
            component.blockData[offset] |= readBit() << successive;
        }
        var eobrun = 0;
        function decodeACFirst(component, offset) {
            if (eobrun > 0) {
                eobrun--;
                return;
            }
            var k = spectralStart, e = spectralEnd;
            while (k <= e) {
                var rs = decodeHuffman(component.huffmanTableAC);
                var s = rs & 15, r = rs >> 4;
                if (s === 0) {
                    if (r < 15) {
                        eobrun = receive(r) + (1 << r) - 1;
                        break;
                    }
                    k += 16;
                    continue;
                }
                k += r;
                var z = dctZigZag[k];
                component.blockData[offset + z] =
                    receiveAndExtend(s) * (1 << successive);
                k++;
            }
        }
        var successiveACState = 0, successiveACNextValue;
        function decodeACSuccessive(component, offset) {
            var k = spectralStart;
            var e = spectralEnd;
            var r = 0;
            var s;
            var rs;
            while (k <= e) {
                var offsetZ = offset + dctZigZag[k];
                var sign = component.blockData[offsetZ] < 0 ? -1 : 1;
                switch (successiveACState) {
                    case 0:
                        rs = decodeHuffman(component.huffmanTableAC);
                        s = rs & 15;
                        r = rs >> 4;
                        if (s === 0) {
                            if (r < 15) {
                                eobrun = receive(r) + (1 << r);
                                successiveACState = 4;
                            }
                            else {
                                r = 16;
                                successiveACState = 1;
                            }
                        }
                        else {
                            if (s !== 1) {
                                throw new Error('invalid ACn encoding');
                            }
                            successiveACNextValue = receiveAndExtend(s);
                            successiveACState = r ? 2 : 3;
                        }
                        continue;
                    case 1:
                    case 2:
                        if (component.blockData[offsetZ]) {
                            component.blockData[offsetZ] += sign * (readBit() << successive);
                        }
                        else {
                            r--;
                            if (r === 0) {
                                successiveACState = successiveACState === 2 ? 3 : 0;
                            }
                        }
                        break;
                    case 3:
                        if (component.blockData[offsetZ]) {
                            component.blockData[offsetZ] += sign * (readBit() << successive);
                        }
                        else {
                            component.blockData[offsetZ] =
                                successiveACNextValue << successive;
                            successiveACState = 0;
                        }
                        break;
                    case 4:
                        if (component.blockData[offsetZ]) {
                            component.blockData[offsetZ] += sign * (readBit() << successive);
                        }
                        break;
                }
                k++;
            }
            if (successiveACState === 4) {
                eobrun--;
                if (eobrun === 0) {
                    successiveACState = 0;
                }
            }
        }
        function decodeMcu(component, decode, mcu, row, col) {
            var mcuRow = (mcu / mcusPerLine) | 0;
            var mcuCol = mcu % mcusPerLine;
            var blockRow = mcuRow * component.v + row;
            var blockCol = mcuCol * component.h + col;
            var offset = getBlockBufferOffset(component, blockRow, blockCol);
            decode(component, offset);
        }
        function decodeBlock(component, decode, mcu) {
            var blockRow = (mcu / component.blocksPerLine) | 0;
            var blockCol = mcu % component.blocksPerLine;
            var offset = getBlockBufferOffset(component, blockRow, blockCol);
            decode(component, offset);
        }
        var componentsLength = components.length;
        var component, i, j, k, n;
        var decodeFn;
        if (progressive) {
            if (spectralStart === 0) {
                decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
            }
            else {
                decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
            }
        }
        else {
            decodeFn = decodeBaseline;
        }
        var mcu = 0, fileMarker;
        var mcuExpected;
        if (componentsLength === 1) {
            mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
        }
        else {
            mcuExpected = mcusPerLine * frame.mcusPerColumn;
        }
        var h, v;
        while (mcu < mcuExpected) {
            var mcuToRead = resetInterval ?
                Math.min(mcuExpected - mcu, resetInterval) : mcuExpected;
            for (i = 0; i < componentsLength; i++) {
                components[i].pred = 0;
            }
            eobrun = 0;
            if (componentsLength === 1) {
                component = components[0];
                for (n = 0; n < mcuToRead; n++) {
                    decodeBlock(component, decodeFn, mcu);
                    mcu++;
                }
            }
            else {
                for (n = 0; n < mcuToRead; n++) {
                    for (i = 0; i < componentsLength; i++) {
                        component = components[i];
                        h = component.h;
                        v = component.v;
                        for (j = 0; j < v; j++) {
                            for (k = 0; k < h; k++) {
                                decodeMcu(component, decodeFn, mcu, j, k);
                            }
                        }
                    }
                    mcu++;
                }
            }
            bitsCount = 0;
            fileMarker = findNextFileMarker(data, offset);
            if (fileMarker && fileMarker.invalid) {
                warn('decodeScan - unexpected MCU data, current marker is: ' +
                    fileMarker.invalid);
                offset = fileMarker.offset;
            }
            var marker = fileMarker && fileMarker.marker;
            if (!marker || marker <= 0xFF00) {
                throw new Error('marker was not found');
            }
            if (marker >= 0xFFD0 && marker <= 0xFFD7) {
                offset += 2;
            }
            else {
                break;
            }
        }
        fileMarker = findNextFileMarker(data, offset);
        if (fileMarker && fileMarker.invalid) {
            warn('decodeScan - unexpected Scan data, current marker is: ' +
                fileMarker.invalid);
            offset = fileMarker.offset;
        }
        return offset - startOffset;
    }
    function quantizeAndInverse(component, blockBufferOffset, p) {
        var qt = component.quantizationTable, blockData = component.blockData;
        var v0, v1, v2, v3, v4, v5, v6, v7;
        var p0, p1, p2, p3, p4, p5, p6, p7;
        var t;
        if (!qt) {
            throw new Error('missing required Quantization Table.');
        }
        for (var row = 0; row < 64; row += 8) {
            p0 = blockData[blockBufferOffset + row];
            p1 = blockData[blockBufferOffset + row + 1];
            p2 = blockData[blockBufferOffset + row + 2];
            p3 = blockData[blockBufferOffset + row + 3];
            p4 = blockData[blockBufferOffset + row + 4];
            p5 = blockData[blockBufferOffset + row + 5];
            p6 = blockData[blockBufferOffset + row + 6];
            p7 = blockData[blockBufferOffset + row + 7];
            p0 *= qt[row];
            if ((p1 | p2 | p3 | p4 | p5 | p6 | p7) === 0) {
                t = (dctSqrt2 * p0 + 512) >> 10;
                p[row] = t;
                p[row + 1] = t;
                p[row + 2] = t;
                p[row + 3] = t;
                p[row + 4] = t;
                p[row + 5] = t;
                p[row + 6] = t;
                p[row + 7] = t;
                continue;
            }
            p1 *= qt[row + 1];
            p2 *= qt[row + 2];
            p3 *= qt[row + 3];
            p4 *= qt[row + 4];
            p5 *= qt[row + 5];
            p6 *= qt[row + 6];
            p7 *= qt[row + 7];
            v0 = (dctSqrt2 * p0 + 128) >> 8;
            v1 = (dctSqrt2 * p4 + 128) >> 8;
            v2 = p2;
            v3 = p6;
            v4 = (dctSqrt1d2 * (p1 - p7) + 128) >> 8;
            v7 = (dctSqrt1d2 * (p1 + p7) + 128) >> 8;
            v5 = p3 << 4;
            v6 = p5 << 4;
            v0 = (v0 + v1 + 1) >> 1;
            v1 = v0 - v1;
            t = (v2 * dctSin6 + v3 * dctCos6 + 128) >> 8;
            v2 = (v2 * dctCos6 - v3 * dctSin6 + 128) >> 8;
            v3 = t;
            v4 = (v4 + v6 + 1) >> 1;
            v6 = v4 - v6;
            v7 = (v7 + v5 + 1) >> 1;
            v5 = v7 - v5;
            v0 = (v0 + v3 + 1) >> 1;
            v3 = v0 - v3;
            v1 = (v1 + v2 + 1) >> 1;
            v2 = v1 - v2;
            t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
            v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
            v7 = t;
            t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
            v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
            v6 = t;
            p[row] = v0 + v7;
            p[row + 7] = v0 - v7;
            p[row + 1] = v1 + v6;
            p[row + 6] = v1 - v6;
            p[row + 2] = v2 + v5;
            p[row + 5] = v2 - v5;
            p[row + 3] = v3 + v4;
            p[row + 4] = v3 - v4;
        }
        for (var col = 0; col < 8; ++col) {
            p0 = p[col];
            p1 = p[col + 8];
            p2 = p[col + 16];
            p3 = p[col + 24];
            p4 = p[col + 32];
            p5 = p[col + 40];
            p6 = p[col + 48];
            p7 = p[col + 56];
            if ((p1 | p2 | p3 | p4 | p5 | p6 | p7) === 0) {
                t = (dctSqrt2 * p0 + 8192) >> 14;
                t = (t < -2040) ? 0 : (t >= 2024) ? 255 : (t + 2056) >> 4;
                blockData[blockBufferOffset + col] = t;
                blockData[blockBufferOffset + col + 8] = t;
                blockData[blockBufferOffset + col + 16] = t;
                blockData[blockBufferOffset + col + 24] = t;
                blockData[blockBufferOffset + col + 32] = t;
                blockData[blockBufferOffset + col + 40] = t;
                blockData[blockBufferOffset + col + 48] = t;
                blockData[blockBufferOffset + col + 56] = t;
                continue;
            }
            v0 = (dctSqrt2 * p0 + 2048) >> 12;
            v1 = (dctSqrt2 * p4 + 2048) >> 12;
            v2 = p2;
            v3 = p6;
            v4 = (dctSqrt1d2 * (p1 - p7) + 2048) >> 12;
            v7 = (dctSqrt1d2 * (p1 + p7) + 2048) >> 12;
            v5 = p3;
            v6 = p5;
            v0 = ((v0 + v1 + 1) >> 1) + 4112;
            v1 = v0 - v1;
            t = (v2 * dctSin6 + v3 * dctCos6 + 2048) >> 12;
            v2 = (v2 * dctCos6 - v3 * dctSin6 + 2048) >> 12;
            v3 = t;
            v4 = (v4 + v6 + 1) >> 1;
            v6 = v4 - v6;
            v7 = (v7 + v5 + 1) >> 1;
            v5 = v7 - v5;
            v0 = (v0 + v3 + 1) >> 1;
            v3 = v0 - v3;
            v1 = (v1 + v2 + 1) >> 1;
            v2 = v1 - v2;
            t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
            v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
            v7 = t;
            t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
            v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
            v6 = t;
            p0 = v0 + v7;
            p7 = v0 - v7;
            p1 = v1 + v6;
            p6 = v1 - v6;
            p2 = v2 + v5;
            p5 = v2 - v5;
            p3 = v3 + v4;
            p4 = v3 - v4;
            p0 = (p0 < 16) ? 0 : (p0 >= 4080) ? 255 : p0 >> 4;
            p1 = (p1 < 16) ? 0 : (p1 >= 4080) ? 255 : p1 >> 4;
            p2 = (p2 < 16) ? 0 : (p2 >= 4080) ? 255 : p2 >> 4;
            p3 = (p3 < 16) ? 0 : (p3 >= 4080) ? 255 : p3 >> 4;
            p4 = (p4 < 16) ? 0 : (p4 >= 4080) ? 255 : p4 >> 4;
            p5 = (p5 < 16) ? 0 : (p5 >= 4080) ? 255 : p5 >> 4;
            p6 = (p6 < 16) ? 0 : (p6 >= 4080) ? 255 : p6 >> 4;
            p7 = (p7 < 16) ? 0 : (p7 >= 4080) ? 255 : p7 >> 4;
            blockData[blockBufferOffset + col] = p0;
            blockData[blockBufferOffset + col + 8] = p1;
            blockData[blockBufferOffset + col + 16] = p2;
            blockData[blockBufferOffset + col + 24] = p3;
            blockData[blockBufferOffset + col + 32] = p4;
            blockData[blockBufferOffset + col + 40] = p5;
            blockData[blockBufferOffset + col + 48] = p6;
            blockData[blockBufferOffset + col + 56] = p7;
        }
    }
    function buildComponentData(frame, component) {
        var blocksPerLine = component.blocksPerLine;
        var blocksPerColumn = component.blocksPerColumn;
        var computationBuffer = new Int16Array(64);
        for (var blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
            for (var blockCol = 0; blockCol < blocksPerLine; blockCol++) {
                var offset = getBlockBufferOffset(component, blockRow, blockCol);
                quantizeAndInverse(component, offset, computationBuffer);
            }
        }
        return component.blockData;
    }
    function findNextFileMarker(data, currentPos, startPos) {
        if (startPos === void 0) { startPos = currentPos; }
        function peekUint16(pos) {
            return (data[pos] << 8) | data[pos + 1];
        }
        var maxPos = data.length - 1;
        var newPos = startPos < currentPos ? startPos : currentPos;
        if (currentPos >= maxPos) {
            return null;
        }
        var currentMarker = peekUint16(currentPos);
        if (currentMarker >= 0xFFC0 && currentMarker <= 0xFFFE) {
            return {
                invalid: null,
                marker: currentMarker,
                offset: currentPos,
            };
        }
        var newMarker = peekUint16(newPos);
        while (!(newMarker >= 0xFFC0 && newMarker <= 0xFFFE)) {
            if (++newPos >= maxPos) {
                return null;
            }
            newMarker = peekUint16(newPos);
        }
        return {
            invalid: currentMarker.toString(16),
            marker: newMarker,
            offset: newPos,
        };
    }
    JpegImage.prototype = {
        width: 0,
        height: 0,
        parse: function (data, _a) {

            var _b = (_a === void 0 ? {} : _a).dnlScanLines, dnlScanLines = _b === void 0 ? null : _b;
            function readUint16() {
                var value = (data[offset] << 8) | data[offset + 1];
                offset += 2;
                return value;
            }
            function readDataBlock() {
                var length = readUint16();
                var endOffset = offset + length - 2;
                var fileMarker = findNextFileMarker(data, endOffset, offset);
                if (fileMarker && fileMarker.invalid) {
                    warn('readDataBlock - incorrect length, current marker is: ' +
                        fileMarker.invalid);
                    endOffset = fileMarker.offset;
                }
                var array = data.subarray(offset, endOffset);
                offset += array.length;
                return array;
            }
            function prepareComponents(frame) {
                var mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / frame.maxH);
                var mcusPerColumn = Math.ceil(frame.scanLines / 8 / frame.maxV);
                for (var i = 0; i < frame.components.length; i++) {
                    component = frame.components[i];
                    var blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) *
                        component.h / frame.maxH);
                    var blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines / 8) *
                        component.v / frame.maxV);
                    var blocksPerLineForMcu = mcusPerLine * component.h;
                    var blocksPerColumnForMcu = mcusPerColumn * component.v;
                    var blocksBufferSize = 64 * blocksPerColumnForMcu *
                        (blocksPerLineForMcu + 1);
                    component.blockData = new Int16Array(blocksBufferSize);
                    component.blocksPerLine = blocksPerLine;
                    component.blocksPerColumn = blocksPerColumn;
                }
                frame.mcusPerLine = mcusPerLine;
                frame.mcusPerColumn = mcusPerColumn;
            }

            var offset = 0;
            var jfif = null;
            var adobe = null;
            var frame, resetInterval;
            var numSOSMarkers = 0;
            var quantizationTables = [];
            var huffmanTablesAC = [], huffmanTablesDC = [];
            var fileMarker = readUint16();
            if (fileMarker !== 0xFFD8) {
                throw new Error('SOI not found');
            }

            fileMarker = readUint16();
            markerLoop: while (fileMarker !== 0xFFD9) {
                var i, j, l;
                switch (fileMarker) {
                    case 0xFFE0:
                    case 0xFFE1:
                    case 0xFFE2:
                    case 0xFFE3:
                    case 0xFFE4:
                    case 0xFFE5:
                    case 0xFFE6:
                    case 0xFFE7:
                    case 0xFFE8:
                    case 0xFFE9:
                    case 0xFFEA:
                    case 0xFFEB:
                    case 0xFFEC:
                    case 0xFFED:
                    case 0xFFEE:
                    case 0xFFEF:
                    case 0xFFFE:
                        var appData = readDataBlock();
                        if (fileMarker === 0xFFE0) {
                            if (appData[0] === 0x4A && appData[1] === 0x46 &&
                                appData[2] === 0x49 && appData[3] === 0x46 &&
                                appData[4] === 0) {
                                jfif = {
                                    version: { major: appData[5], minor: appData[6], },
                                    densityUnits: appData[7],
                                    xDensity: (appData[8] << 8) | appData[9],
                                    yDensity: (appData[10] << 8) | appData[11],
                                    thumbWidth: appData[12],
                                    thumbHeight: appData[13],
                                    thumbData: appData.subarray(14, 14 +
                                        3 * appData[12] * appData[13]),
                                };
                            }
                        }
                        if (fileMarker === 0xFFEE) {
                            if (appData[0] === 0x41 && appData[1] === 0x64 &&
                                appData[2] === 0x6F && appData[3] === 0x62 &&
                                appData[4] === 0x65) {
                                adobe = {
                                    version: (appData[5] << 8) | appData[6],
                                    flags0: (appData[7] << 8) | appData[8],
                                    flags1: (appData[9] << 8) | appData[10],
                                    transformCode: appData[11],
                                };
                            }
                        }
                        break;
                    case 0xFFDB:
                        var quantizationTablesLength = readUint16();
                        var quantizationTablesEnd = quantizationTablesLength + offset - 2;
                        var z;
                        while (offset < quantizationTablesEnd) {
                            var quantizationTableSpec = data[offset++];
                            var tableData = new Uint16Array(64);
                            if ((quantizationTableSpec >> 4) === 0) {
                                for (j = 0; j < 64; j++) {
                                    z = dctZigZag[j];
                                    tableData[z] = data[offset++];
                                }
                            }
                            else if ((quantizationTableSpec >> 4) === 1) {
                                for (j = 0; j < 64; j++) {
                                    z = dctZigZag[j];
                                    tableData[z] = readUint16();
                                }
                            }
                            else {
                                throw new Error('DQT - invalid table spec');
                            }
                            quantizationTables[quantizationTableSpec & 15] = tableData;
                        }
                        break;
                    case 0xFFC0:
                    case 0xFFC1:
                    case 0xFFC2:
                        if (frame) {
                            throw new Error('Only single frame JPEGs supported');
                        }
                        readUint16();
                        frame = {};
                        frame.extended = (fileMarker === 0xFFC1);
                        frame.progressive = (fileMarker === 0xFFC2);
                        frame.precision = data[offset++];
                        var sofScanLines = readUint16();
                        frame.scanLines = dnlScanLines || sofScanLines;
                        frame.samplesPerLine = readUint16();
                        frame.components = [];
                        frame.componentIds = {};
                        var componentsCount = data[offset++], componentId;
                        var maxH = 0, maxV = 0;
                        for (i = 0; i < componentsCount; i++) {
                            componentId = data[offset];
                            var h = data[offset + 1] >> 4;
                            var v = data[offset + 1] & 15;
                            if (maxH < h) {
                                maxH = h;
                            }
                            if (maxV < v) {
                                maxV = v;
                            }
                            var qId = data[offset + 2];
                            l = frame.components.push({
                                h: h,
                                v: v,
                                quantizationId: qId,
                                quantizationTable: null,
                            });
                            frame.componentIds[componentId] = l - 1;
                            offset += 3;
                        }
                        frame.maxH = maxH;
                        frame.maxV = maxV;
                        prepareComponents(frame);
                        break;
                    case 0xFFC4:
                        var huffmanLength = readUint16();
                        for (i = 2; i < huffmanLength;) {
                            var huffmanTableSpec = data[offset++];
                            var codeLengths = new Uint8Array(16);
                            var codeLengthSum = 0;
                            for (j = 0; j < 16; j++, offset++) {
                                codeLengthSum += (codeLengths[j] = data[offset]);
                            }
                            var huffmanValues = new Uint8Array(codeLengthSum);
                            for (j = 0; j < codeLengthSum; j++, offset++) {
                                huffmanValues[j] = data[offset];
                            }
                            i += 17 + codeLengthSum;
                            ((huffmanTableSpec >> 4) === 0 ?
                                huffmanTablesDC : huffmanTablesAC)[huffmanTableSpec & 15] =
                                buildHuffmanTable(codeLengths, huffmanValues);
                        }
                        break;
                    case 0xFFDD:
                        readUint16();
                        resetInterval = readUint16();
                        break;
                    case 0xFFDA:
                        var parseDNLMarker = (++numSOSMarkers) === 1 && !dnlScanLines;
                        readUint16();
                        var selectorsCount = data[offset++];
                        var components = [], component;
                        for (i = 0; i < selectorsCount; i++) {
                            var componentIndex = frame.componentIds[data[offset++]];
                            component = frame.components[componentIndex];
                            var tableSpec = data[offset++];
                            component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
                            component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
                            components.push(component);
                        }
                        var spectralStart = data[offset++];
                        var spectralEnd = data[offset++];
                        var successiveApproximation = data[offset++];
                        try {
                            var processed = decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successiveApproximation >> 4, successiveApproximation & 15, parseDNLMarker);
                            offset += processed;
                        }
                        catch (ex) {
                            if (ex instanceof DNLMarkerError) {
                                warn(ex.message + " -- attempting to re-parse the JPEG image.");
                                return this.parse(data, { dnlScanLines: ex.scanLines, });
                            }
                            else if (ex instanceof EOIMarkerError) {
                                warn(ex.message + " -- ignoring the rest of the image data.");
                                break markerLoop;
                            }
                            throw ex;
                        }
                        break;
                    case 0xFFDC:
                        offset += 4;
                        break;
                    case 0xFFFF:
                        if (data[offset] !== 0xFF) {
                            offset--;
                        }
                        break;
                    default:
                        if (data[offset - 3] === 0xFF &&
                            data[offset - 2] >= 0xC0 && data[offset - 2] <= 0xFE) {
                            offset -= 3;
                            break;
                        }
                        var nextFileMarker = findNextFileMarker(data, offset - 2);
                        if (nextFileMarker && nextFileMarker.invalid) {
                            warn('JpegImage.parse - unexpected data, current marker is: ' +
                                nextFileMarker.invalid);
                            offset = nextFileMarker.offset;
                            break;
                        }
                        throw new Error('unknown marker ' + fileMarker.toString(16));
                }
                fileMarker = readUint16();
            }
            this.width = frame.samplesPerLine;
            this.height = frame.scanLines;
            this.jfif = jfif;
            this.adobe = adobe;
            this.components = [];
            for (i = 0; i < frame.components.length; i++) {
                component = frame.components[i];
                var quantizationTable = quantizationTables[component.quantizationId];
                if (quantizationTable) {
                    component.quantizationTable = quantizationTable;
                }
                this.components.push({
                    output: buildComponentData(frame, component),
                    scaleX: component.h / frame.maxH,
                    scaleY: component.v / frame.maxV,
                    blocksPerLine: component.blocksPerLine,
                    blocksPerColumn: component.blocksPerColumn,
                });
            }
            this.numComponents = this.components.length;
        },
        _getLinearizedBlockData: function (width, height, reserved, alphaChannel) {
            if (reserved === void 0) { reserved = 0; }
            if (alphaChannel === void 0) { alphaChannel = null; }
            var isSourcePDF = false;
            var scaleX = this.width / width, scaleY = this.height / height;
            var component, componentScaleX, componentScaleY, blocksPerScanline;
            var x, y, i, j, k;
            var index;
            var offset = 0;
            var output;
            var numComponents = this.components.length;
            var rowBytes = width * numComponents;
            var needAlpha = alphaChannel != null;
            if (numComponents == 3) {
                if (needAlpha) {
                    rowBytes = width * 4;
                }
                else {
                    rowBytes = ((rowBytes + 3) >> 2) * 4;
                }
            }
            var dataLength = rowBytes * height;
            var result = new ArrayBuffer(dataLength + reserved);
            var data = new Uint8ClampedArray(result, reserved);
            var xScaleBlockOffset = new Uint32Array(width);
            var mask3LSB = 0xfffffff8;
            var step = needAlpha ? 4 : numComponents;
            for (i = 0; i < numComponents; i++) {
                component = this.components[i];
                componentScaleX = component.scaleX * scaleX;
                componentScaleY = component.scaleY * scaleY;
                output = component.output;
                blocksPerScanline = (component.blocksPerLine + 1) << 3;
                for (x = 0; x < width; x++) {
                    j = 0 | (x * componentScaleX);
                    xScaleBlockOffset[x] = ((j & mask3LSB) << 3) | (j & 7);
                }
                for (y = 0; y < height; y++) {
                    j = 0 | (y * componentScaleY);
                    index = blocksPerScanline * (j & mask3LSB) | ((j & 7) << 3);
                    offset = rowBytes * y + i;
                    for (x = 0; x < width; x++, offset += step) {
                        data[offset] = output[index + xScaleBlockOffset[x]];
                    }
                }
            }
            if (needAlpha) {
                offset = 3;
                for (y = 0, k = 0; y < height; y++) {
                    for (x = 0; x < width; x++, offset += 4) {
                        data[offset] = alphaChannel[k++];
                    }
                }
            }
            var transform = this._decodeTransform;
            if (!isSourcePDF && numComponents === 4 && !transform) {
                transform = new Int32Array([
                    -256, 255, -256, 255, -256, 255, -256, 255
                ]);
            }
            if (transform) {
                if (numComponents == 3 && needAlpha) {
                    for (i = 0; i < dataLength;) {
                        for (j = 0, k = 0; j < numComponents; j++, i++, k += 2) {
                            data[i] = ((data[i] * transform[k]) >> 8) + transform[k + 1];
                        }
                        i++;
                    }
                }
                else {
                    for (i = 0; i < dataLength;) {
                        for (j = 0, k = 0; j < numComponents; j++, i++, k += 2) {
                            data[i] = ((data[i] * transform[k]) >> 8) + transform[k + 1];
                        }
                    }
                }
            }
            return data;
        },
        get _isColorConversionNeeded() {
            if (this.adobe) {
                return !!this.adobe.transformCode;
            }
            if (this.numComponents === 3) {
                if (this._colorTransform === 0) {
                    return false;
                }
                return true;
            }
            if (this._colorTransform === 1) {
                return true;
            }
            return false;
        },
        _convertYccToRgb: function convertYccToRgb(data, needAlpha, width, height) {
            var Y, Cb, Cr;
            var step = needAlpha ? 4 : 3;
            var rowBytes = ((width * step + 3) >> 2) * 4;
            var i = 0;
            for (var y = 0; y < height; ++y) {
                i = rowBytes * y;
                for (var x = 0; x < width; ++x) {
                    Y = data[i];
                    Cb = data[i + 1];
                    Cr = data[i + 2];
                    data[i] = Y - 179.456 + 1.402 * Cr;
                    data[i + 1] = Y + 135.459 - 0.344 * Cb - 0.714 * Cr;
                    data[i + 2] = Y - 226.816 + 1.772 * Cb;
                    i += step;
                }
            }
            return data;
        },
        _convertYcckToRgb: function convertYcckToRgb(data) {
            var Y, Cb, Cr, k;
            var offset = 0;
            for (var i = 0, length = data.length; i < length; i += 4) {
                Y = data[i];
                Cb = data[i + 1];
                Cr = data[i + 2];
                k = data[i + 3];
                data[offset++] = -122.67195406894 +
                    Cb * (-6.60635669420364e-5 * Cb + 0.000437130475926232 * Cr -
                        5.4080610064599e-5 * Y + 0.00048449797120281 * k -
                        0.154362151871126) +
                    Cr * (-0.000957964378445773 * Cr + 0.000817076911346625 * Y -
                        0.00477271405408747 * k + 1.53380253221734) +
                    Y * (0.000961250184130688 * Y - 0.00266257332283933 * k +
                        0.48357088451265) +
                    k * (-0.000336197177618394 * k + 0.484791561490776);
                data[offset++] = 107.268039397724 +
                    Cb * (2.19927104525741e-5 * Cb - 0.000640992018297945 * Cr +
                        0.000659397001245577 * Y + 0.000426105652938837 * k -
                        0.176491792462875) +
                    Cr * (-0.000778269941513683 * Cr + 0.00130872261408275 * Y +
                        0.000770482631801132 * k - 0.151051492775562) +
                    Y * (0.00126935368114843 * Y - 0.00265090189010898 * k +
                        0.25802910206845) +
                    k * (-0.000318913117588328 * k - 0.213742400323665);
                data[offset++] = -20.810012546947 +
                    Cb * (-0.000570115196973677 * Cb - 2.63409051004589e-5 * Cr +
                        0.0020741088115012 * Y - 0.00288260236853442 * k +
                        0.814272968359295) +
                    Cr * (-1.53496057440975e-5 * Cr - 0.000132689043961446 * Y +
                        0.000560833691242812 * k - 0.195152027534049) +
                    Y * (0.00174418132927582 * Y - 0.00255243321439347 * k +
                        0.116935020465145) +
                    k * (-0.000343531996510555 * k + 0.24165260232407);
            }
            return data.subarray(0, offset);
        },
        _convertYcckToCmyk: function convertYcckToCmyk(data) {
            var Y, Cb, Cr;
            for (var i = 0, length = data.length; i < length; i += 4) {
                Y = data[i];
                Cb = data[i + 1];
                Cr = data[i + 2];
                data[i] = 434.456 - Y - 1.402 * Cr;
                data[i + 1] = 119.541 - Y + 0.344 * Cb + 0.714 * Cr;
                data[i + 2] = 481.816 - Y - 1.772 * Cb;
            }
            return data;
        },
        _convertCmykToRgb: function convertCmykToRgb(data) {
            var c, m, y, k;
            var offset = 0;
            var scale = 1 / 255;
            for (var i = 0, length = data.length; i < length; i += 4) {
                c = data[i] * scale;
                m = data[i + 1] * scale;
                y = data[i + 2] * scale;
                k = data[i + 3] * scale;
                data[offset++] = 255 +
                    c * (-4.387332384609988 * c + 54.48615194189176 * m +
                        18.82290502165302 * y + 212.25662451639585 * k -
                        285.2331026137004) +
                    m * (1.7149763477362134 * m - 5.6096736904047315 * y -
                        17.873870861415444 * k - 5.497006427196366) +
                    y * (-2.5217340131683033 * y - 21.248923337353073 * k +
                        17.5119270841813) -
                    k * (21.86122147463605 * k + 189.48180835922747);
                data[offset++] = 255 +
                    c * (8.841041422036149 * c + 60.118027045597366 * m +
                        6.871425592049007 * y + 31.159100130055922 * k -
                        79.2970844816548) +
                    m * (-15.310361306967817 * m + 17.575251261109482 * y +
                        131.35250912493976 * k - 190.9453302588951) +
                    y * (4.444339102852739 * y + 9.8632861493405 * k -
                        24.86741582555878) -
                    k * (20.737325471181034 * k + 187.80453709719578);
                data[offset++] = 255 +
                    c * (0.8842522430003296 * c + 8.078677503112928 * m +
                        30.89978309703729 * y - 0.23883238689178934 * k -
                        14.183576799673286) +
                    m * (10.49593273432072 * m + 63.02378494754052 * y +
                        50.606957656360734 * k - 112.23884253719248) +
                    y * (0.03296041114873217 * y + 115.60384449646641 * k -
                        193.58209356861505) -
                    k * (22.33816807309886 * k + 180.12613974708367);
            }
            return data.subarray(0, offset);
        },
        getData: function (width, height, forceRGB, reserved, alphaChannel) {
            if (forceRGB === void 0) { forceRGB = false; }
            if (reserved === void 0) { reserved = 0; }
            if (alphaChannel === void 0) { alphaChannel = null; }
            if (this.numComponents > 4) {
                throw new Error('Unsupported color mode');
            }
            var data = this._getLinearizedBlockData(width, height, reserved, alphaChannel);
            if (this.numComponents === 1 && forceRGB) {
                var rowBytes = ((width * 3 + 3) >> 2) * 4;
                var rgbData = new Uint8ClampedArray(rowBytes * height);
                var i = 0;
                var x, y, offset;
                for (y = 0; y < height; ++y) {
                    offset = y * rowBytes;
                    for (x = 0; x < width; ++x) {
                        var grayColor = data[i++];
                        rgbData[offset++] = grayColor;
                        rgbData[offset++] = grayColor;
                        rgbData[offset++] = grayColor;
                    }
                }
                return rgbData;
            }
            else if (this.numComponents === 3 && this._isColorConversionNeeded) {
                return this._convertYccToRgb(data, alphaChannel != null, width, height);
            }
            else if (this.numComponents === 4) {
                if (this._isColorConversionNeeded) {
                    if (forceRGB) {
                        return this._convertYcckToRgb(data);
                    }
                    return this._convertYcckToCmyk(data);
                }
                else if (forceRGB) {
                    return this._convertCmykToRgb(data);
                }
            }
            return data;
        },
    };
    return JpegImage;
})();
(function () {
    ;
    var l = void 0, aa = this;
    function r(c, d) {
        var a = c.split("."), b = aa; !(a[0] in b) && b.execScript && b.execScript("var " + a[0]); for (var e; a.length && (e = a.shift());)
            !a.length && d !== l ? b[e] = d : b = b[e] ? b[e] : b[e] = {};
    }
    ;
    var t = "undefined" !== typeof Uint8Array && "undefined" !== typeof Uint16Array && "undefined" !== typeof Uint32Array && "undefined" !== typeof DataView;
    function v(c) {
        var d = c.length, a = 0, b = Number.POSITIVE_INFINITY, e, f, g, h, k, m, n, p, s, x; for (p = 0; p < d; ++p)
            c[p] > a && (a = c[p]), c[p] < b && (b = c[p]); e = 1 << a; f = new (t ? Uint32Array : Array)(e); g = 1; h = 0; for (k = 2; g <= a;) {
                for (p = 0; p < d; ++p)
                    if (c[p] === g) {
                        m = 0;
                        n = h;
                        for (s = 0; s < g; ++s)
                            m = m << 1 | n & 1, n >>= 1;
                        x = g << 16 | p;
                        for (s = m; s < e; s += k)
                            f[s] = x;
                        ++h;
                    }
                ++g;
                h <<= 1;
                k <<= 1;
            } return [f, a, b];
    }
    ;
    function w(c, d) {
        this.g = [];
        this.h = 32768;
        this.d = this.f = this.a = this.l = 0;
        this.input = t ? new Uint8Array(c) : c;
        this.m = !1;
        this.i = y;
        this.r = !1;
        if (d || !(d = {}))
            d.index && (this.a = d.index), d.bufferSize && (this.h = d.bufferSize), d.bufferType && (this.i = d.bufferType), d.resize && (this.r = d.resize);
        switch (this.i) {
            case A:
                this.b = 32768;
                this.c = new (t ? Uint8Array : Array)(32768 + this.h + 258);
                break;
            case y:
                this.b = 0;
                this.c = new (t ? Uint8Array : Array)(this.h);
                this.e = this.z;
                this.n = this.v;
                this.j = this.w;
                break;
            default: throw Error("invalid inflate mode");
        }
    }
    var A = 0, y = 1, B = { t: A, s: y };
    w.prototype.k = function () {
        for (; !this.m;) {
            var c = C(this, 3);
            c & 1 && (this.m = !0);
            c >>>= 1;
            switch (c) {
                case 0:
                    var d = this.input, a = this.a, b = this.c, e = this.b, f = d.length, g = l, h = l, k = b.length, m = l;
                    this.d = this.f = 0;
                    if (a + 1 >= f)
                        throw Error("invalid uncompressed block header: LEN");
                    g = d[a++] | d[a++] << 8;
                    if (a + 1 >= f)
                        throw Error("invalid uncompressed block header: NLEN");
                    h = d[a++] | d[a++] << 8;
                    if (g === ~h)
                        throw Error("invalid uncompressed block header: length verify");
                    if (a + g > d.length)
                        throw Error("input buffer is broken");
                    switch (this.i) {
                        case A:
                            for (; e +
                                g > b.length;) {
                                m = k - e;
                                g -= m;
                                if (t)
                                    b.set(d.subarray(a, a + m), e), e += m, a += m;
                                else
                                    for (; m--;)
                                        b[e++] = d[a++];
                                this.b = e;
                                b = this.e();
                                e = this.b;
                            }
                            break;
                        case y:
                            for (; e + g > b.length;)
                                b = this.e({ p: 2 });
                            break;
                        default: throw Error("invalid inflate mode");
                    }
                    if (t)
                        b.set(d.subarray(a, a + g), e), e += g, a += g;
                    else
                        for (; g--;)
                            b[e++] = d[a++];
                    this.a = a;
                    this.b = e;
                    this.c = b;
                    break;
                case 1:
                    this.j(ba, ca);
                    break;
                case 2:
                    for (var n = C(this, 5) + 257, p = C(this, 5) + 1, s = C(this, 4) + 4, x = new (t ? Uint8Array : Array)(D.length), S = l, T = l, U = l, u = l, M = l, F = l, z = l, q = l, V = l, q = 0; q < s; ++q)
                        x[D[q]] =
                            C(this, 3);
                    if (!t) {
                        q = s;
                        for (s = x.length; q < s; ++q)
                            x[D[q]] = 0;
                    }
                    S = v(x);
                    u = new (t ? Uint8Array : Array)(n + p);
                    q = 0;
                    for (V = n + p; q < V;)
                        switch (M = E(this, S), M) {
                            case 16:
                                for (z = 3 + C(this, 2); z--;)
                                    u[q++] = F;
                                break;
                            case 17:
                                for (z = 3 + C(this, 3); z--;)
                                    u[q++] = 0;
                                F = 0;
                                break;
                            case 18:
                                for (z = 11 + C(this, 7); z--;)
                                    u[q++] = 0;
                                F = 0;
                                break;
                            default: F = u[q++] = M;
                        }
                    T = t ? v(u.subarray(0, n)) : v(u.slice(0, n));
                    U = t ? v(u.subarray(n)) : v(u.slice(n));
                    this.j(T, U);
                    break;
                default: throw Error("unknown BTYPE: " + c);
            }
        }
        return this.n();
    };
    var G = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], D = t ? new Uint16Array(G) : G, H = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 258, 258], I = t ? new Uint16Array(H) : H, J = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0], K = t ? new Uint8Array(J) : J, L = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577], da = t ? new Uint16Array(L) : L, ea = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12,
        13, 13], N = t ? new Uint8Array(ea) : ea, O = new (t ? Uint8Array : Array)(288), P, fa;
    P = 0;
    for (fa = O.length; P < fa; ++P)
        O[P] = 143 >= P ? 8 : 255 >= P ? 9 : 279 >= P ? 7 : 8;
    var ba = v(O), Q = new (t ? Uint8Array : Array)(30), R, ga;
    R = 0;
    for (ga = Q.length; R < ga; ++R)
        Q[R] = 5;
    var ca = v(Q);
    function C(c, d) {
        for (var a = c.f, b = c.d, e = c.input, f = c.a, g = e.length, h; b < d;) {
            if (f >= g)
                throw Error("input buffer is broken");
            a |= e[f++] << b;
            b += 8;
        } h = a & (1 << d) - 1; c.f = a >>> d; c.d = b - d; c.a = f; return h;
    }
    function E(c, d) {
        for (var a = c.f, b = c.d, e = c.input, f = c.a, g = e.length, h = d[0], k = d[1], m, n; b < k && !(f >= g);)
            a |= e[f++] << b, b += 8; m = h[a & (1 << k) - 1]; n = m >>> 16; if (n > b)
            throw Error("invalid code length: " + n); c.f = a >> n; c.d = b - n; c.a = f; return m & 65535;
    }
    w.prototype.j = function (c, d) {
        var a = this.c, b = this.b; this.o = c; for (var e = a.length - 258, f, g, h, k; 256 !== (f = E(this, c));)
            if (256 > f)
                b >= e && (this.b = b, a = this.e(), b = this.b), a[b++] = f;
            else {
                g = f - 257;
                k = I[g];
                0 < K[g] && (k += C(this, K[g]));
                f = E(this, d);
                h = da[f];
                0 < N[f] && (h += C(this, N[f]));
                b >= e && (this.b = b, a = this.e(), b = this.b);
                for (; k--;)
                    a[b] = a[b++ - h];
            } for (; 8 <= this.d;)
            this.d -= 8, this.a--; this.b = b;
    };
    w.prototype.w = function (c, d) {
        var a = this.c, b = this.b; this.o = c; for (var e = a.length, f, g, h, k; 256 !== (f = E(this, c));)
            if (256 > f)
                b >= e && (a = this.e(), e = a.length), a[b++] = f;
            else {
                g = f - 257;
                k = I[g];
                0 < K[g] && (k += C(this, K[g]));
                f = E(this, d);
                h = da[f];
                0 < N[f] && (h += C(this, N[f]));
                b + k > e && (a = this.e(), e = a.length);
                for (; k--;)
                    a[b] = a[b++ - h];
            } for (; 8 <= this.d;)
            this.d -= 8, this.a--; this.b = b;
    };
    w.prototype.e = function () {
        var c = new (t ? Uint8Array : Array)(this.b - 32768), d = this.b - 32768, a, b, e = this.c; if (t)
            c.set(e.subarray(32768, c.length));
        else {
            a = 0;
            for (b = c.length; a < b; ++a)
                c[a] = e[a + 32768];
        } this.g.push(c); this.l += c.length; if (t)
            e.set(e.subarray(d, d + 32768));
        else
            for (a = 0; 32768 > a; ++a)
                e[a] = e[d + a]; this.b = 32768; return e;
    };
    w.prototype.z = function (c) { var d, a = this.input.length / this.a + 1 | 0, b, e, f, g = this.input, h = this.c; c && ("number" === typeof c.p && (a = c.p), "number" === typeof c.u && (a += c.u)); 2 > a ? (b = (g.length - this.a) / this.o[2], f = 258 * (b / 2) | 0, e = f < h.length ? h.length + f : h.length << 1) : e = h.length * a; t ? (d = new Uint8Array(e), d.set(h)) : d = h; return this.c = d; };
    w.prototype.n = function () {
        var c = 0, d = this.c, a = this.g, b, e = new (t ? Uint8Array : Array)(this.l + (this.b - 32768)), f, g, h, k; if (0 === a.length)
            return t ? this.c.subarray(32768, this.b) : this.c.slice(32768, this.b); f = 0; for (g = a.length; f < g; ++f) {
                b = a[f];
                h = 0;
                for (k = b.length; h < k; ++h)
                    e[c++] = b[h];
            } f = 32768; for (g = this.b; f < g; ++f)
            e[c++] = d[f]; this.g = []; return this.buffer = e;
    };
    w.prototype.v = function () { var c, d = this.b; t ? this.r ? (c = new Uint8Array(d), c.set(this.c.subarray(0, d))) : c = this.c.subarray(0, d) : (this.c.length > d && (this.c.length = d), c = this.c); return this.buffer = c; };
    function W(c, d) {
        var a, b; this.input = c; this.a = 0; if (d || !(d = {}))
            d.index && (this.a = d.index), d.verify && (this.A = d.verify); a = c[this.a++]; b = c[this.a++]; switch (a & 15) {
                case ha:
                    this.method = ha;
                    break;
                default: throw Error("unsupported compression method");
            } if (0 !== ((a << 8) + b) % 31)
            throw Error("invalid fcheck flag:" + ((a << 8) + b) % 31); if (b & 32)
            throw Error("fdict flag is not supported"); this.q = new w(c, { index: this.a, bufferSize: d.bufferSize, bufferType: d.bufferType, resize: d.resize });
    }
    W.prototype.k = function () {
        var c = this.input, d, a; d = this.q.k(); this.a = this.q.a; if (this.A) {
            a = (c[this.a++] << 24 | c[this.a++] << 16 | c[this.a++] << 8 | c[this.a++]) >>> 0;
            var b = d;
            if ("string" === typeof b) {
                var e = b.split(""), f, g;
                f = 0;
                for (g = e.length; f < g; f++)
                    e[f] = (e[f].charCodeAt(0) & 255) >>> 0;
                b = e;
            }
            for (var h = 1, k = 0, m = b.length, n, p = 0; 0 < m;) {
                n = 1024 < m ? 1024 : m;
                m -= n;
                do
                    h += b[p++], k += h;
                while (--n);
                h %= 65521;
                k %= 65521;
            }
            if (a !== (k << 16 | h) >>> 0)
                throw Error("invalid adler-32 checksum");
        } return d;
    };
    var ha = 8;
    r("Zlib.Inflate", W);
    r("Zlib.Inflate.prototype.decompress", W.prototype.k);
    var X = { ADAPTIVE: B.s, BLOCK: B.t }, Y, Z, $, ia;
    if (Object.keys)
        Y = Object.keys(X);
    else
        for (Z in Y = [], $ = 0, X)
            Y[$++] = Z;
    $ = 0;
    for (ia = Y.length; $ < ia; ++$)
        Z = Y[$], r("Zlib.Inflate.BufferType." + Z, X[Z]);
}).call(this);
(function (window) {
    "use strict";
    var g_buffer = new Uint8Array(8);
    var g_view = new DataView(g_buffer.buffer);
    function serialize(data) {
        var pow32 = 0x100000000;
        var array = new Uint8Array(128);
        var length = 0;
        append(data);
        return array.subarray(0, length);
        function append(data) {
            switch (typeof data) {
                case "undefined":
                    appendNull(data);
                    break;
                case "boolean":
                    appendBoolean(data);
                    break;
                case "number":
                    appendNumber(data);
                    break;
                case "string":
                    appendString(data);
                    break;
                case "object":
                    if (data === null)
                        appendNull(data);
                    else if (data instanceof Date)
                        appendDate(data);
                    else if (Array.isArray(data))
                        appendArray(data);
                    else if (data instanceof Uint8Array || data instanceof Uint8ClampedArray)
                        appendBinArray(data);
                    else if (data instanceof Int8Array || data instanceof Int16Array || data instanceof Uint16Array ||
                        data instanceof Int32Array || data instanceof Uint32Array ||
                        data instanceof Float32Array || data instanceof Float64Array)
                        appendArray(data);
                    else
                        appendObject(data);
                    break;
            }
        }
        function appendNull(data) {
            appendByte(0xc0);
        }
        function appendBoolean(data) {
            appendByte(data ? 0xc3 : 0xc2);
        }
        function appendNumber(data) {
            if (isFinite(data) && Math.floor(data) === data) {
                if (data >= 0 && data <= 0x7f) {
                    appendByte(data);
                }
                else if (data < 0 && data >= -0x20) {
                    appendByte(data);
                }
                else if (data > 0 && data <= 0xff) {
                    appendBytes([0xcc, data]);
                }
                else if (data >= -0x80 && data <= 0x7f) {
                    appendBytes([0xd0, data]);
                }
                else if (data > 0 && data <= 0xffff) {
                    appendBytes([0xcd, data >>> 8, data]);
                }
                else if (data >= -0x8000 && data <= 0x7fff) {
                    appendBytes([0xd1, data >>> 8, data]);
                }
                else if (data > 0 && data <= 0xffffffff) {
                    appendBytes([0xce, data >>> 24, data >>> 16, data >>> 8, data]);
                }
                else if (data >= -0x80000000 && data <= 0x7fffffff) {
                    appendBytes([0xd2, data >>> 24, data >>> 16, data >>> 8, data]);
                }
                else if (data > 0 && data <= 0xffffffffffffffff) {
                    var hi = data / pow32;
                    var lo = data % pow32;
                    appendBytes([0xd3, hi >>> 24, hi >>> 16, hi >>> 8, hi, lo >>> 24, lo >>> 16, lo >>> 8, lo]);
                }
                else if (data >= -0x8000000000000000 && data <= 0x7fffffffffffffff) {
                    appendByte(0xd3);
                    appendInt64(data);
                }
                else if (data < 0) {
                    appendBytes([0xd3, 0x80, 0, 0, 0, 0, 0, 0, 0]);
                }
                else {
                    appendBytes([0xcf, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
                }
            }
            else {
                g_view.setFloat64(0, data);
                appendByte(0xcb);
                appendBytes(g_buffer);
            }
        }
        function appendString(data) {
            var bytes = encodeUtf8(data);
            var length = bytes.length;
            if (length <= 0x1f)
                appendByte(0xa0 + length);
            else if (length <= 0xff)
                appendBytes([0xd9, length]);
            else if (length <= 0xffff)
                appendBytes([0xda, length >>> 8, length]);
            else
                appendBytes([0xdb, length >>> 24, length >>> 16, length >>> 8, length]);
            appendBytes(bytes);
        }
        function appendArray(data) {
            var length = data.length;
            if (length <= 0xf)
                appendByte(0x90 + length);
            else if (length <= 0xffff)
                appendBytes([0xdc, length >>> 8, length]);
            else
                appendBytes([0xdd, length >>> 24, length >>> 16, length >>> 8, length]);
            for (var index = 0; index < length; index++) {
                append(data[index]);
            }
        }
        function appendBinArray(data) {
            var length = data.length;
            if (length <= 0xf)
                appendBytes([0xc4, length]);
            else if (length <= 0xffff)
                appendBytes([0xc5, length >>> 8, length]);
            else
                appendBytes([0xc6, length >>> 24, length >>> 16, length >>> 8, length]);
            appendBytes(data);
        }
        function appendObject(data) {
            var length = 0;
            for (var key in data)
                length++;
            if (length <= 0xf)
                appendByte(0x80 + length);
            else if (length <= 0xffff)
                appendBytes([0xde, length >>> 8, length]);
            else
                appendBytes([0xdf, length >>> 24, length >>> 16, length >>> 8, length]);
            for (var key in data) {
                append(key);
                append(data[key]);
            }
        }
        function appendDate(data) {
            var sec = data.getTime() / 1000;
            if (data.getMilliseconds() === 0 && sec >= 0 && sec < 0x100000000) {
                appendBytes([0xd6, 0xff, sec >>> 24, sec >>> 16, sec >>> 8, sec]);
            }
            else if (sec >= 0 && sec < 0x400000000) {
                var ns = data.getMilliseconds() * 1000000;
                appendBytes([0xd7, 0xff, ns >>> 22, ns >>> 14, ns >>> 6, ((ns << 2) >>> 0) | (sec / pow32), sec >>> 24, sec >>> 16, sec >>> 8, sec]);
            }
            else {
                var ns = data.getMilliseconds() * 1000000;
                appendBytes([0xc7, 12, 0xff, ns >>> 24, ns >>> 16, ns >>> 8, ns]);
                appendInt64(sec);
            }
        }
        function appendByte(byte) {
            if (array.length < length + 1) {
                var newLength = array.length * 2;
                while (newLength < length + 1)
                    newLength *= 2;
                var newArray = new Uint8Array(newLength);
                newArray.set(array);
                array = newArray;
            }
            array[length] = byte;
            length++;
        }
        function appendBytes(bytes) {
            if (array.length < length + bytes.length) {
                var newLength = array.length * 2;
                while (newLength < length + bytes.length)
                    newLength *= 2;
                var newArray = new Uint8Array(newLength);
                newArray.set(array);
                array = newArray;
            }
            array.set(bytes, length);
            length += bytes.length;
        }
        function appendInt64(value) {
            var hi, lo;
            if (value >= 0) {
                hi = value / pow32;
                lo = value % pow32;
            }
            else {
                value++;
                hi = Math.abs(value) / pow32;
                lo = Math.abs(value) % pow32;
                hi = ~hi;
                lo = ~lo;
            }
            appendBytes([hi >>> 24, hi >>> 16, hi >>> 8, hi, lo >>> 24, lo >>> 16, lo >>> 8, lo]);
        }
    }
    function deserialize(array) {
        var pow32 = 0x100000000;
        var pos = 0;
        if (typeof array !== "object" || typeof array.length === "undefined") {
            throw new Error("Invalid argument type: Expected a byte array (Array or Uint8Array) to deserialize.");
        }
        if (!(array instanceof Uint8Array)) {
            array = new Uint8Array(array);
        }
        var data = read();
        if (pos < array.length) {
        }
        return data;
        function read() {
            var byte = array[pos++];
            if (byte >= 0x00 && byte <= 0x7f)
                return byte;
            if (byte >= 0x80 && byte <= 0x8f)
                return readMap(byte - 0x80);
            if (byte >= 0x90 && byte <= 0x9f)
                return readArray(byte - 0x90);
            if (byte >= 0xa0 && byte <= 0xbf)
                return readStr(byte - 0xa0);
            if (byte === 0xc0)
                return null;
            if (byte === 0xc1)
                throw new Error("Invalid byte code 0xc1 found.");
            if (byte === 0xc2)
                return false;
            if (byte === 0xc3)
                return true;
            if (byte === 0xc4)
                return readBin(-1, 1);
            if (byte === 0xc5)
                return readBin(-1, 2);
            if (byte === 0xc6)
                return readBin(-1, 4);
            if (byte === 0xc7)
                return readExt(-1, 1);
            if (byte === 0xc8)
                return readExt(-1, 2);
            if (byte === 0xc9)
                return readExt(-1, 4);
            if (byte === 0xca)
                return readFloat(4);
            if (byte === 0xcb)
                return readFloat(8);
            if (byte === 0xcc)
                return readUInt(1);
            if (byte === 0xcd)
                return readUInt(2);
            if (byte === 0xce)
                return readUInt(4);
            if (byte === 0xcf)
                return readUInt(8);
            if (byte === 0xd0)
                return readInt(1);
            if (byte === 0xd1)
                return readInt(2);
            if (byte === 0xd2)
                return readInt(4);
            if (byte === 0xd3)
                return readInt(8);
            if (byte === 0xd4)
                return readExt(1);
            if (byte === 0xd5)
                return readExt(2);
            if (byte === 0xd6)
                return readExt(4);
            if (byte === 0xd7)
                return readExt(8);
            if (byte === 0xd8)
                return readExt(16);
            if (byte === 0xd9)
                return readStr(-1, 1);
            if (byte === 0xda)
                return readStr(-1, 2);
            if (byte === 0xdb)
                return readStr(-1, 4);
            if (byte === 0xdc)
                return readArray(-1, 2);
            if (byte === 0xdd)
                return readArray(-1, 4);
            if (byte === 0xde)
                return readMap(-1, 2);
            if (byte === 0xdf)
                return readMap(-1, 4);
            if (byte >= 0xe0 && byte <= 0xff)
                return byte - 256;
            throw new Error("Invalid byte value " + byte + " in the MessagePack binary data : Expecting a range of 0 to 255. This is not a byte array.");
        }
        function readInt(size) {
            var value = 0;
            var first = true;
            while (size-- > 0) {
                if (first) {
                    var byte = array[pos++];
                    value += byte & 0x7f;
                    if (byte & 0x80) {
                        value -= 0x80;
                    }
                    first = false;
                }
                else {
                    value *= 256;
                    value += array[pos++];
                }
            }
            return value;
        }
        function readUInt(size) {
            var value = 0;
            while (size-- > 0) {
                value *= 256;
                value += array[pos++];
            }
            return value;
        }
        function readFloat(size) {
            var i = 0;
            while (i < size) {
                g_buffer[i++] = array[pos++];
            }
            if (size === 4)
                return g_view.getFloat32(0, false);
            if (size === 8)
                return g_view.getFloat64(0, false);
        }
        function readBin(size, lengthSize) {
            if (size < 0)
                size = readUInt(lengthSize);
            var data = new Uint8Array(array.buffer.slice(array.byteOffset + pos, array.byteOffset + pos + size));
            pos += size;
            return data;
        }
        function readMap(size, lengthSize) {
            if (size < 0)
                size = readUInt(lengthSize);
            var data = {};
            while (size-- > 0) {
                var key = read();
                data[key] = read();
            }
            return data;
        }
        function readArray(size, lengthSize) {
            if (size < 0)
                size = readUInt(lengthSize);
            var data = new Array(size);
            var i = 0;
            while (i < size) {
                data[i++] = read();
            }
            return data;
        }
        function readStr(size, lengthSize) {
            if (size < 0)
                size = readUInt(lengthSize);
            var start = pos;
            pos += size;
            return decodeUtf8(array, start, size);
        }
        function readExt(size, lengthSize) {
            if (size < 0)
                size = readUInt(lengthSize);
            var type = readUInt(1);
            var data = readBin(size);
            switch (type) {
                case 255:
                    return readExtDate(data);
            }
            return { type: type, data: data };
        }
        function readExtDate(data) {
            if (data.length === 4) {
                var sec = ((data[0] << 24) >>> 0) +
                    ((data[1] << 16) >>> 0) +
                    ((data[2] << 8) >>> 0) +
                    data[3];
                return new Date(sec * 1000);
            }
            if (data.length === 8) {
                var ns = ((data[0] << 22) >>> 0) +
                    ((data[1] << 14) >>> 0) +
                    ((data[2] << 6) >>> 0) +
                    (data[3] >>> 2);
                var sec = ((data[3] & 0x3) * pow32) +
                    ((data[4] << 24) >>> 0) +
                    ((data[5] << 16) >>> 0) +
                    ((data[6] << 8) >>> 0) +
                    data[7];
                return new Date(sec * 1000 + ns / 1000000);
            }
            if (data.length === 12) {
                var ns = ((data[0] << 24) >>> 0) +
                    ((data[1] << 16) >>> 0) +
                    ((data[2] << 8) >>> 0) +
                    data[3];
                pos -= 8;
                var sec = readInt(8);
                return new Date(sec * 1000 + ns / 1000000);
            }
            throw new Error("Invalid data length for a date value.");
        }
    }
    function encodeUtf8(str) {
        var ascii = true, length = str.length;
        for (var x = 0; x < length; x++) {
            if (str.charCodeAt(x) > 127) {
                ascii = false;
                break;
            }
        }
        var i = 0, bytes = new Uint8Array(str.length * (ascii ? 1 : 4));
        for (var ci = 0; ci !== length; ci++) {
            var c = str.charCodeAt(ci);
            if (c < 128) {
                bytes[i++] = c;
                continue;
            }
            if (c < 2048) {
                bytes[i++] = c >> 6 | 192;
            }
            else {
                if (c > 0xd7ff && c < 0xdc00) {
                    if (++ci >= length)
                        throw new Error("UTF-8 encode: incomplete surrogate pair");
                    var c2 = str.charCodeAt(ci);
                    if (c2 < 0xdc00 || c2 > 0xdfff)
                        throw new Error("UTF-8 encode: second surrogate character 0x" + c2.toString(16) + " at index " + ci + " out of range");
                    c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
                    bytes[i++] = c >> 18 | 240;
                    bytes[i++] = c >> 12 & 63 | 128;
                }
                else
                    bytes[i++] = c >> 12 | 224;
                bytes[i++] = c >> 6 & 63 | 128;
            }
            bytes[i++] = c & 63 | 128;
        }
        return ascii ? bytes : bytes.subarray(0, i);
    }
    function decodeUtf8(bytes, start, length) {
        var i = start, str = [];
        length += start;
        while (i < length) {
            var c = bytes[i++];
            if (c > 127) {
                if (c > 191 && c < 224) {
                    if (i >= length)
                        throw new Error("UTF-8 decode: incomplete 2-byte sequence");
                    c = (c & 31) << 6 | bytes[i++] & 63;
                }
                else if (c > 223 && c < 240) {
                    if (i + 1 >= length)
                        throw new Error("UTF-8 decode: incomplete 3-byte sequence");
                    c = (c & 15) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
                }
                else if (c > 239 && c < 248) {
                    if (i + 2 >= length)
                        throw new Error("UTF-8 decode: incomplete 4-byte sequence");
                    c = (c & 7) << 18 | (bytes[i++] & 63) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
                }
                else
                    throw new Error("UTF-8 decode: unknown multibyte start 0x" + c.toString(16) + " at index " + (i - 1));
            }
            if (c <= 0xffff)
                str.push(c);
            else if (c <= 0x10ffff) {
                c -= 0x10000;
                str.push(c >> 10 | 0xd800);
                str.push(c & 0x3FF | 0xdc00);
            }
            else
                throw new Error("UTF-8 decode: code point 0x" + c.toString(16) + " exceeds UTF-16 reach");
        }
        return String.fromCharCode.apply(String, str);
    }
    var msgpack = {
        serialize: serialize,
        deserialize: deserialize,
        encode: serialize,
        decode: deserialize
    };
    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = msgpack;
    }
    else {
        window[window.msgpackJsName || "msgpack"] = msgpack;
        if (typeof define === "function" && define.amd) {
            define("msgpack", [], function () {
                return msgpack;
            });
        }
    }
})(this);
var base;
(function (base) {
    var background;
    (function (background) {
        var InitCommand = (function () {
            function InitCommand() {
                this.enableCache = false;
                this.enableCheck = false;
                this.host = "";
            }
            InitCommand.prototype.type = function () {
                return InitCommand.opcode;
            };
            InitCommand.prototype.readTo = function (tuple, args) {
                var offset = 0;
                this.enableCache = tuple[offset++];
                this.enableCheck = tuple[offset++];
                this.host = tuple[offset++];
            };
            InitCommand.prototype.writeTo = function (args) {
                var result = [];
                result.push(this.enableCache);
                result.push(this.enableCheck);
                result.push(this.host);
                return result;
            };
            InitCommand.opcode = 0;
            return InitCommand;
        }());
        background.InitCommand = InitCommand;
        var InitCompleteCommand = (function () {
            function InitCompleteCommand() {
            }
            InitCompleteCommand.prototype.type = function () {
                return InitCompleteCommand.opcode;
            };
            InitCompleteCommand.prototype.readTo = function (tuple, args) {
                var offset = 0;
                this.status = tuple[offset++];
            };
            InitCompleteCommand.prototype.writeTo = function (args) {
                var result = [];
                result.push(this.status);
                return result;
            };
            InitCompleteCommand.opcode = 1;
            return InitCompleteCommand;
        }());
        background.InitCompleteCommand = InitCompleteCommand;
        var LoadCompleteCommand = (function () {
            function LoadCompleteCommand() {
            }
            LoadCompleteCommand.prototype.type = function () {
                return LoadCompleteCommand.opcode;
            };
            LoadCompleteCommand.prototype.readTo = function (tuple, args) {
                var offset = 0;
                this.url = tuple[offset++];
                this.status = tuple[offset++];
                var index = tuple[offset++];
                if (index != 0) {
                    this.bytes = args[index];
                }
            };
            LoadCompleteCommand.prototype.writeTo = function (args) {
                var result = [];
                result.push(this.url);
                result.push(this.status);
                if (this.bytes != null) {
                    result.push(args.length);
                    args.push(this.bytes);
                }
                else {
                    result.push(0);
                }
                return result;
            };
            LoadCompleteCommand.opcode = 3;
            return LoadCompleteCommand;
        }());
        background.LoadCompleteCommand = LoadCompleteCommand;
        var LoadCommand = (function () {
            function LoadCommand() {
            }
            LoadCommand.prototype.type = function () {
                return LoadCommand.opcode;
            };
            LoadCommand.prototype.readTo = function (tuple, args) {
                var offset = 0;
                this.url = tuple[offset++];
                this.uncompress = tuple[offset];
            };
            LoadCommand.prototype.writeTo = function (args) {
                var result = [];
                result.push(this.url);
                result.push(this.uncompress);
                return result;
            };
            LoadCommand.opcode = 2;
            return LoadCommand;
        }());
        background.LoadCommand = LoadCommand;
        var DecodeCommand = (function () {
            function DecodeCommand() {
            }
            DecodeCommand.prototype.type = function () {
                return DecodeCommand.opcode;
            };
            DecodeCommand.prototype.readTo = function (tuple, args) {
                var offset = 0;
                this.url = tuple[offset++];
                this.uncompress = tuple[offset++];
                var size = tuple[offset++];
                if (size != 0) {
                    var index = tuple[offset];
                    this.content = [];
                    for (var limit = index + size; index < limit; ++index) {
                        this.content.push(args[index]);
                    }
                }
            };
            DecodeCommand.prototype.writeTo = function (args) {
                var result = [];
                result.push(this.url);
                result.push(this.uncompress);
                if (this.content != null && this.content.length != 0) {
                    result.push(this.content.length);
                    result.push(args.length);
                    for (var _i = 0, _a = this.content; _i < _a.length; _i++) {
                        var bytes = _a[_i];
                        args.push(bytes);
                    }
                }
                else {
                    result.push(0);
                }
                return result;
            };
            DecodeCommand.opcode = 4;
            return DecodeCommand;
        }());
        background.DecodeCommand = DecodeCommand;
        var DecodeCompleteCommand = (function () {
            function DecodeCompleteCommand() {
            }
            DecodeCompleteCommand.prototype.type = function () {
                return DecodeCompleteCommand.opcode;
            };
            DecodeCompleteCommand.prototype.readTo = function (tuple, args) {
                var offset = 0;
                this.url = tuple[offset++];
                var index = tuple[offset];
                if (index != 0) {
                    this.bytes = args[index];
                }
            };
            DecodeCompleteCommand.prototype.writeTo = function (args) {
                var result = [];
                result.push(this.url);
                if (this.bytes != null) {
                    result.push(args.length);
                    args.push(this.bytes);
                }
                else {
                    result.push(0);
                }
                return result;
            };
            DecodeCompleteCommand.opcode = 5;
            return DecodeCompleteCommand;
        }());
        background.DecodeCompleteCommand = DecodeCompleteCommand;
    })(background = base.background || (base.background = {}));
})(base || (base = {}));
var utils;
(function (utils) {
    var ArrayUtils = (function () {
        function ArrayUtils() {
        }
        ArrayUtils.copy = function (source, sourceOffset, target, targetOffset, length) {
            if (source.length < (sourceOffset + length)) {
                return false;
            }
            if (target.length < (targetOffset + length)) {
                return false;
            }
            while (length--) {
                target[targetOffset++] = source[sourceOffset++];
            }
            return true;
        };
        ArrayUtils.insertAt = function (array, index, obj) {
            array.push(obj);
            if (index < 0) {
                return;
            }
            for (var j = array.length - 1; j > index; --j) {
                obj = array[j];
                array[j] = array[j - 1];
                array[j - 1] = obj;
            }
        };
        ArrayUtils.removeAt = function (array, index) {
            var last = array.length - 1;
            if (index > last)
                return null;
            var obj = array[index];
            for (var j = index; j < last; ++j) {
                array[j] = array[j + 1];
            }
            array.length = last;
            return obj;
        };
        ArrayUtils.remove = function (array, obj) {
            var index = array.indexOf(obj);
            if (index === -1) {
                return -1;
            }
            var last = array.length - 1;
            for (var j = index; j < last; ++j) {
                array[j] = array[j + 1];
            }
            array.length = last;
            return index;
        };
        ArrayUtils.removeRange = function (array, index, count, result) {
            if (result === void 0) { result = null; }
            var last = array.length - count;
            if (index > last) {
                last = index;
            }
            if (result != null) {
                var size = (index + count) > array.length ? array.length : index + count;
                for (var i = index; i < size; ++i) {
                    result[i - index] = array[i];
                }
            }
            for (var j = index; j < last; ++j) {
                array[j] = array[j + count];
            }
            array.length = last;
        };
        ArrayUtils.removeAll = function (array, obj) {
            var index = 0;
            while ((index = array.indexOf(obj, index)) != -1) {
                var last = array.length - 1;
                for (var j = index; j < last; ++j) {
                    array[j] = array[j + 1];
                }
                array.length = last;
            }
        };
        ArrayUtils.unsafeRemoveAt = function (array, index) {
            var last = array.length - 1;
            if (index > last)
                return null;
            var obj = array[index];
            array[index] = array[last];
            array.length = last;
            return obj;
        };
        ArrayUtils.unsafeRemove = function (array, obj) {
            var index = array.indexOf(obj);
            if (index === -1) {
                return -1;
            }
            var last = array.length - 1;
            array[index] = array[last];
            array.length = last;
            return index;
        };
        ArrayUtils.disturb = function (array) {
            var size = array.length;
            for (var i = size - 1; i >= 0; --i) {
                var upper = i + 1;
                var index = Math.floor(Math.random() * upper) % upper;
                if (i != index) {
                    var temp = array[i];
                    array[i] = array[index];
                    array[index] = temp;
                }
            }
            return array;
        };
        ArrayUtils.random = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            var size = array.length - offset;
            var index = Math.floor(Math.random() * size) % size;
            return array[index + offset];
        };
        ArrayUtils.randomIndex = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            var size = array.length - offset;
            var index = Math.floor(Math.random() * size) % size;
            return index + offset;
        };
        ArrayUtils.reverse = function (array) {
            for (var l = 0, r = array.length - 1; l < r; ++l, --r) {
                var temp = array[l];
                array[l] = array[r];
                array[r] = temp;
            }
        };
        return ArrayUtils;
    }());
    utils.ArrayUtils = ArrayUtils;
})(utils || (utils = {}));
var base;
(function (base) {
    var background;
    (function (background) {
        var ArrayUtils = utils.ArrayUtils;
        var ActorProxy = (function () {
            function ActorProxy(worker) {
                var _this = this;
                this.onMessage = function (message) {
                    var args = message.data;
                    if (args.length == 0) {
                        return;
                    }
                    var commands = msgpack.decode(new Uint8Array(args[0]));
                    var length = commands.length;
                    for (var i = 0; i < length; ++i) {
                        var command = commands[i];
                        var type = command[0];
                        var opcode = new _this._opcodes[type];
                        opcode.readTo(command[1], args);
                        var handlers = _this._opcodeHandlers[type];
                        var length_1 = handlers.length;
                        for (var i_1 = 0; i_1 < length_1; ++i_1) {
                            handlers[i_1](opcode);
                        }
                    }
                };
                this.onUpdate = function () {
                    if (_this._list.length == 0) {
                        return;
                    }
                    var commandBuffer = msgpack.encode(_this._list).buffer;
                    _this._args[0] = commandBuffer;
                    _this._worker.postMessage(_this._args, _this._args);
                    _this._args = new Array(1);
                    _this._list.length = 0;
                };
                this._worker = worker;
                this._args = new Array(1);
                this._list = new Array();
                this._worker.onmessage = this.onMessage;
                this._opcodeHandlers = [];
                this._opcodes = [];
            }
            ActorProxy.prototype.registerOpcode = function (type, command) {
                this._opcodes[type] = command;
            };
            ActorProxy.prototype.addCommandHandler = function (type, handler) {
                var handlers = this._opcodeHandlers[type];
                if (handlers == null) {
                    handlers = new Array();
                    this._opcodeHandlers[type] = handlers;
                }
                if (handlers.indexOf(handler) != -1) {
                    return;
                }
                handlers.push(handler);
            };
            ActorProxy.prototype.removeCommandHandler = function (type, handler) {
                var handlers = this._opcodeHandlers[type];
                if (handlers == null) {
                    return;
                }
                ArrayUtils.remove(handlers, handler);
            };
            ActorProxy.prototype.sendCommand = function (command) {
                var tuple = command.writeTo(this._args);
                this._list.push([command.type(), tuple]);
                this.onUpdate();
            };
            return ActorProxy;
        }());
        background.ActorProxy = ActorProxy;
    })(background = base.background || (base.background = {}));
})(base || (base = {}));
var utils;
(function (utils) {
    var ByteStream = (function () {
        function ByteStream() {
        }
        ByteStream.prototype.bytesAvailable = function () {
            return this.length - this.cursor;
        };
        ByteStream.prototype.getUint8 = function () {
            return this.input[this.cursor++];
        };
        ByteStream.prototype.getUint16 = function () {
            var result = this.view.getUint16(this.cursor, this.littleEndian);
            this.cursor += 2;
            return result;
        };
        ByteStream.prototype.getUint32 = function () {
            var result = this.view.getUint32(this.cursor, this.littleEndian);
            this.cursor += 4;
            return result;
        };
        ByteStream.prototype.getUTF = function (size) {
            var result = new Array(size);
            for (var i = 0; i < size; ++i) {
                result[i] = String.fromCharCode(this.input[this.cursor++]);
            }
            return result.join("");
        };
        ByteStream.prototype.getBytes = function (size) {
            var result = new Uint8Array(this.input.buffer, this.input.byteOffset + this.cursor, size);
            this.cursor += size;
            return result;
        };
        ByteStream.prototype.skip = function (size) {
            this.cursor += size;
        };
        ByteStream.prototype.open = function (input, littleEndian) {
            if (littleEndian === void 0) { littleEndian = false; }
            this.cursor = 0;
            this.length = input.byteLength;
            this.input = input;
            this.view = new DataView(input.buffer);
            this.littleEndian = littleEndian;
        };
        ByteStream.prototype.close = function () {
            this.input = null;
            this.view = null;
        };
        return ByteStream;
    }());
    utils.ByteStream = ByteStream;
})(utils || (utils = {}));
var ByteStream = utils.ByteStream;
var PngFileEntry = (function () {
    function PngFileEntry() {
        this.segments = [];
    }
    PngFileEntry.allocEntry = function () {
        var result;
        if (PngFileEntry._freeEntry != null) {
            result = this._freeEntry;
            this._freeEntry = this._freeEntry.next;
        }
        else {
            result = new PngFileEntry();
        }
        return result;
    };
    PngFileEntry.freeEntry = function (entry) {
        entry.next = this._freeEntry;
        PngFileEntry._freeEntry = entry;
        entry.palette = null;
        entry.segments.length = 0;
        entry.transparency = null;
    };
    return PngFileEntry;
}());
var PngDecoder = (function () {
    function PngDecoder() {
    }
    PngDecoder.init = function () {
        PngDecoder.sectionHandlers = {
            IHDR: PngDecoder.handlerIHDR,
            PLTE: PngDecoder.handlerPLTE,
            IDAT: PngDecoder.handlerIDAT,
            tRNS: PngDecoder.handlerTRNS,
        };
    };
    PngDecoder.handlerIHDR = function (entry, stream, chunkSize) {
        entry.width = stream.getUint32();
        entry.height = stream.getUint32();
        entry.bits = stream.getUint8();
        entry.colorType = stream.getUint8();
        entry.compressionMethod = stream.getUint8();
        entry.filterMethod = stream.getUint8();
        entry.interlaceMethod = stream.getUint8();
    };
    PngDecoder.handlerPLTE = function (entry, stream, chunkSize) {
        entry.palette = stream.getBytes(chunkSize);
    };
    PngDecoder.handlerIDAT = function (entry, stream, chunkSize) {
        entry.segments.push(stream.getBytes(chunkSize));
    };
    PngDecoder.handlerTRNS = function (entry, stream, chunkSize) {
        entry.transparency = stream.getBytes(chunkSize);
    };
    PngDecoder.handlerICCP = function (entry, stream, chunkSize) {
        var pos = stream.cursor;
        var codes = [];
        var code = stream.getUint8();
        do {
            codes.push(String.fromCharCode(code));
            code = stream.getUint8();
        } while (code != 0);
        var profile = codes.join("");
        var method = stream.getUint8();
        var length = chunkSize - (stream.cursor - pos);
        var bytes = stream.getBytes(length);
    };
    PngDecoder.decodePalette = function (entry) {
        var palette = entry.palette;
        var transparency = entry.transparency;
        var length = palette.length;
        var result = new Uint8Array(length / 3 * 4);
        var offset = 0;
        var cursor = 0;
        var size = transparency.byteLength;
        var index = 0;
        while (offset < length) {
            result[cursor++] = palette[offset++];
            result[cursor++] = palette[offset++];
            result[cursor++] = palette[offset++];
            result[cursor++] = (index < size) ? transparency[index++] : 255;
        }
        return result;
    };
    ;
    PngDecoder.mergeSegments = function (segments) {
        var byteLength = 0;
        for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
            var segment = segments_1[_i];
            byteLength += segment.byteLength;
        }
        var bytes = new Uint8Array(byteLength);
        var offset = 0;
        for (var _a = 0, segments_2 = segments; _a < segments_2.length; _a++) {
            var segment = segments_2[_a];
            bytes.set(segment, offset);
            offset += segment.length;
        }
        return new Zlib.Inflate(bytes).decompress();
    };
    PngDecoder.calcPixelBytes = function (entry) {
        var channels = 3;
        if (entry.colorType & 4) {
            channels = 4;
        }
        if (entry.colorType == 3 && entry.transparency) {
            channels = 4;
        }
        return channels;
    };
    PngDecoder.calcIndexBytes = function (entry) {
        var channels = 1;
        switch (entry.colorType) {
            case 2: {
                channels = 3;
                break;
            }
            case 4: {
                channels = 2;
                break;
            }
            case 6: {
                channels = 4;
                break;
            }
        }
        var bits = channels * entry.bits;
        return (bits + 7) >> 3;
    };
    PngDecoder.decodePixels = function (entry) {
        if (entry.interlaceMethod == 0) {
            return this.notInterlaceMethod(entry);
        }
        return null;
    };
    PngDecoder.notInterlaceMethod = function (entry) {
        var bytes = PngDecoder.mergeSegments(entry.segments);
        var length = bytes.byteLength;
        var height = entry.height;
        var pixelBytes = PngDecoder.calcIndexBytes(entry);
        var rowBytes = Math.floor((length - height) / height);
        var rowOffset = rowBytes + 1;
        var i = 0;
        var cursor = 0;
        var a = 0, b = 0, c = 0, p = 0, pa = 0, pb = 0, pc = 0, pr = 0;
        while (cursor < length) {
            switch (bytes[cursor++]) {
                case 0: {
                    cursor += rowBytes;
                    break;
                }
                case 1: {
                    cursor += pixelBytes;
                    for (i = pixelBytes; i < rowBytes; ++i, ++cursor) {
                        bytes[cursor] = (bytes[cursor] + bytes[cursor - pixelBytes]) % 256;
                    }
                    break;
                }
                case 2: {
                    if (cursor != 1) {
                        for (i = 0; i < rowBytes; ++i, ++cursor) {
                            bytes[cursor] = (bytes[cursor] + bytes[cursor - rowOffset]) % 256;
                        }
                    }
                    break;
                }
                case 3: {
                    if (cursor == 1) {
                        cursor += pixelBytes;
                        for (i = pixelBytes; i < rowBytes; ++i, ++cursor) {
                            bytes[cursor] = (bytes[cursor] + (bytes[cursor - pixelBytes] >> 1)) % 256;
                        }
                    }
                    else {
                        for (i = 0; i < pixelBytes; ++i, ++cursor) {
                            bytes[cursor] = (bytes[cursor] + (bytes[cursor - rowOffset] >> 1)) % 256;
                        }
                        for (i = pixelBytes; i < rowBytes; ++i, ++cursor) {
                            bytes[cursor] = (bytes[cursor] + ((bytes[cursor - pixelBytes] + bytes[cursor - rowOffset]) >> 1)) % 256;
                        }
                    }
                    break;
                }
                case 4: {
                    if (pixelBytes == 1) {
                        if (cursor == 1) {
                            a = bytes[cursor++];
                            for (i = 1; i < rowBytes; ++i, ++cursor) {
                                pr = (a > 0) ? a : 0;
                                a = bytes[cursor] = (bytes[cursor] + pr) % 256;
                            }
                        }
                        else {
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
                    }
                    else {
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
                        }
                        else {
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
                    console.log("\u89E3\u6790\u51FA\u9519\uFF1A" + entry.width + ", " + entry.height + ", " + pixelBytes);
                    console.log(bytes.byteLength);
                    break;
                }
            }
        }
        return bytes;
    };
    PngDecoder.decode = function (data) {
        var entry = PngFileEntry.allocEntry();
        var stream = new ByteStream();
        stream.open(data);
        stream.skip(8);
        while (stream.bytesAvailable() > 0) {
            var chunkSize = stream.getUint32();
            var section = stream.getUTF(4);
            var handler = PngDecoder.sectionHandlers[section];
            if (handler != null) {
                handler(entry, stream, chunkSize);
            }
            else {
                stream.skip(chunkSize);
            }
            var crc = stream.getUint32();
        }
        stream.close();
        var pixels = PngDecoder.decodePixels(entry);
        if (pixels == null) {
            return null;
        }
        var cursor = 0;
        var offset = 0;
        var width = entry.width;
        var height = entry.height;
        var buffer = new ArrayBuffer(width * height * PngDecoder.calcPixelBytes(entry) + 8);
        var result = new Uint8Array(buffer, 8);
        var view = new DataView(buffer, 0, 8);
        view.setUint32(0, width);
        view.setUint32(4, height);
        switch (entry.colorType) {
            case 3: {
                PngDecoder.fromPalette(entry, pixels, result);
                break;
            }
            case 2: {
                switch (entry.bits) {
                    case 8: {
                        for (var y = 0; y < height; ++y) {
                            offset++;
                            for (var x = 0; x < width; ++x) {
                                result[cursor++] = pixels[offset++];
                                result[cursor++] = pixels[offset++];
                                result[cursor++] = pixels[offset++];
                            }
                        }
                        break;
                    }
                    case 16: {
                        for (var y = 0; y < height; ++y) {
                            offset++;
                            for (var x = 0; x < width; ++x) {
                                result[cursor++] = ((pixels[offset] << 8 | pixels[offset + 1]) / 65535) * 255;
                                offset += 2;
                                result[cursor++] = ((pixels[offset] << 8 | pixels[offset + 1]) / 65535) * 255;
                                offset += 2;
                                result[cursor++] = ((pixels[offset] << 8 | pixels[offset + 1]) / 65535) * 255;
                                offset += 2;
                            }
                        }
                        break;
                    }
                }
                break;
            }
            case 6: {
                switch (entry.bits) {
                    case 8: {
                        for (var y = 0; y < height; ++y) {
                            offset++;
                            for (var x = 0; x < width; ++x) {
                                result[cursor++] = pixels[offset++];
                                result[cursor++] = pixels[offset++];
                                result[cursor++] = pixels[offset++];
                                result[cursor++] = pixels[offset++];
                            }
                        }
                        break;
                    }
                    case 16: {
                        for (var y = 0; y < height; ++y) {
                            offset++;
                            for (var x = 0; x < width; ++x) {
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
                        break;
                    }
                }
                break;
            }
            default: {
                console.error("\u672A\u652F\u6301\u7684\u7C7B\u578B\uFF1A" + entry.colorType + ", " + entry.bits);
                break;
            }
        }
        PngFileEntry.freeEntry(entry);
        return buffer;
    };
    PngDecoder.fromPalette = function (entry, pixels, result) {
        var cursor = 0;
        var offset = 0;
        var width = entry.width;
        var height = entry.height;
        var palette = entry.palette;
        if (entry.transparency != null) {
            palette = PngDecoder.decodePalette(entry);
            switch (entry.bits) {
                case 1: {
                    for (var y = 0; y < height; ++y) {
                        offset++;
                        for (var x = 0; x < width; ++x) {
                            var index = (pixels[offset + (x >> 3)] & 0x01) * 4;
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
                    for (var y = 0; y < height; ++y) {
                        offset++;
                        for (var x = 0; x < width; ++x) {
                            var index = (pixels[offset + (x >> 2)] & 0x03) * 4;
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
                    for (var y = 0; y < height; ++y) {
                        offset++;
                        for (var x = 0; x < width; ++x) {
                            var index = (pixels[offset + (x >> 1)] & 0x0F) * 4;
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
                    for (var y = 0; y < height; ++y) {
                        offset++;
                        for (var x = 0; x < width; ++x) {
                            var index = pixels[offset++] * 4;
                            result[cursor++] = palette[index];
                            result[cursor++] = palette[index + 1];
                            result[cursor++] = palette[index + 2];
                            result[cursor++] = palette[index + 3];
                        }
                    }
                    break;
                }
            }
        }
        else {
            switch (entry.bits) {
                case 1: {
                    for (var y = 0; y < height; ++y) {
                        offset++;
                        for (var x = 0; x < width; ++x) {
                            var index = (pixels[offset + (x >> 3)] & 0x01) * 3;
                            result[cursor++] = palette[index];
                            result[cursor++] = palette[index + 1];
                            result[cursor++] = palette[index + 2];
                        }
                        offset += (width + 7) >> 3;
                    }
                    break;
                }
                case 2: {
                    for (var y = 0; y < height; ++y) {
                        offset++;
                        for (var x = 0; x < width; ++x) {
                            var index = (pixels[offset + (x >> 2)] & 0x03) * 3;
                            result[cursor++] = palette[index];
                            result[cursor++] = palette[index + 1];
                            result[cursor++] = palette[index + 2];
                        }
                        offset += (width + 3) >> 2;
                    }
                    break;
                }
                case 4: {
                    for (var y = 0; y < height; ++y) {
                        offset++;
                        for (var x = 0; x < width; ++x) {
                            var index = (pixels[offset + (x >> 1)] & 0x0F) * 3;
                            result[cursor++] = palette[index];
                            result[cursor++] = palette[index + 1];
                            result[cursor++] = palette[index + 2];
                        }
                        offset += (width + 1) >> 1;
                    }
                    break;
                }
                case 8: {
                    for (var y = 0; y < height; ++y) {
                        offset++;
                        for (var x = 0; x < width; ++x) {
                            var index = pixels[offset++] * 3;
                            result[cursor++] = palette[index];
                            result[cursor++] = palette[index + 1];
                            result[cursor++] = palette[index + 2];
                        }
                    }
                    break;
                }
            }
        }
    };
    PngDecoder.sectionHandlers = {};
    return PngDecoder;
}());
var base;
(function (base) {
    var background;
    (function (background) {
        var system;
        (function (system) {
            var FileDecodeSystem = (function () {
                function FileDecodeSystem() {
                }
                FileDecodeSystem.init = function () {
                    PngDecoder.init();
                };
                FileDecodeSystem.inflateBuffer = function (buffer) {
                    var data = new Zlib.Inflate(new Uint8Array(buffer)).decompress();
                    return data.buffer.slice(data.byteOffset, data.byteLength);
                };
                FileDecodeSystem.decodeImage = function (stream, alphaChannel) {
                    if (alphaChannel === void 0) { alphaChannel = null; }
                    if (this.isPng(stream)) {
                        return PngDecoder.decode(stream);
                    }
                    var p = new JpegImage();
                    p.parse(stream);
                    var w = p.width;
                    var h = p.height;
                    var data = p.getData(w, h, true, 8, alphaChannel);
                    var view = new DataView(data.buffer);
                    view.setUint32(0, w);
                    view.setUint32(4, h);
                    return data.buffer;
                };
                FileDecodeSystem.isPng = function (buffer) {
                    var header = FileDecodeSystem.PngHeader;
                    for (var i = 0; i < 8; ++i) {
                        if (buffer[i] != header[i]) {
                            return false;
                        }
                    }
                    return true;
                };
                FileDecodeSystem.PngHeader = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
                return FileDecodeSystem;
            }());
            system.FileDecodeSystem = FileDecodeSystem;
        })(system = background.system || (background.system = {}));
    })(background = base.background || (base.background = {}));
})(base || (base = {}));
var ActorProxy = base.background.ActorProxy;
var InitCommand = base.background.InitCommand;
var InitCompleteCommand = base.background.InitCompleteCommand;
var FileDecodeSystem = base.background.system.FileDecodeSystem;
var DecodeCommand = base.background.DecodeCommand;
var DecodeCompleteCommand = base.background.DecodeCompleteCommand;
FileDecodeSystem.init();
var actor = new ActorProxy(self);
actor.registerOpcode(InitCommand.opcode, InitCommand);
actor.registerOpcode(InitCompleteCommand.opcode, InitCompleteCommand);
actor.registerOpcode(DecodeCommand.opcode, DecodeCommand);
actor.registerOpcode(DecodeCompleteCommand.opcode, DecodeCompleteCommand);
actor.addCommandHandler(InitCommand.opcode, function (_) {
    var command = new InitCompleteCommand();
    command.status = 0;
    actor.sendCommand(command);
});
actor.addCommandHandler(DecodeCommand.opcode, function (command) {
    var url = command.url;
    var uncompress = command.uncompress;
    var content = command.content;
    var buffer;
    switch (uncompress) {
        case 1: {
            buffer = FileDecodeSystem.inflateBuffer(content[0]);
            break;
        }
        default: {
            var name = url.toLowerCase();
            if (name.lastIndexOf(".png") == (name.length - 4) || name.lastIndexOf(".jpg") == (name.length - 4)) {
                buffer = FileDecodeSystem.decodeImage(new Uint8Array(content[0]));
            }
            else if (name.lastIndexOf(".til") == (name.length - 4)) {
                var stream = new ByteStream();
                stream.open(new Uint8Array(content[0]));
                stream.getUint16();
                var alpha = stream.getBytes(stream.getUint32());
                stream.getUint16();
                buffer = FileDecodeSystem.decodeImage(stream.getBytes(stream.getUint32()), new Zlib.Inflate(alpha).decompress());
            }
            break;
        }
    }
    content.length = 0;
    var result = new DecodeCompleteCommand();
    result.url = url;
    result.bytes = buffer;
    actor.sendCommand(result);
});
