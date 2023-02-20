/// <reference path="skeleton_pose.ts"/>
///<reference path="../assets/asset_pool_base.ts"/>

namespace base.mesh {
    import Byte = Laya.Byte;
    import IndexBuffer3D = Laya.IndexBuffer3D;
    import VertexBuffer3D = Laya.VertexBuffer3D;
    import VertexDeclaration = Laya.VertexDeclaration;
    import VertexElement = Laya.VertexElement;
    import VertexElementFormat = Laya.VertexElementFormat;
    import VertexElementUsage = Laya.VertexElementUsage;
    import WebGLContext = Laya.WebGLContext;

    const enum ChunkType {
        Mesh = 0x0000,
        Geometry = 0x0100,
        SubGeometry = 0x0101,
        GeometryAttributes = 0x0102,
        Skeleton = 0x0200,
        SkeletonJoint = 0x0201,
        SkeletonAttributes = 0x0202,
        Animation = 0x1000,
        AnimationClip = 0x1001
    }

    export class SkeletonClip {
        private readonly _skeleton: Skeleton;
        private readonly _dummyMatrixs: Table<Array<Float32Array>>;
        private readonly _animationData: AnimationData;

        constructor(skeleton: Skeleton, data: AnimationData) {
            this._skeleton = skeleton;
            this._dummyMatrixs = {};
            this._animationData = data;
        }

        public getDummyMatrix(index: number, key: string, result: Laya.Matrix4x4): Laya.Matrix4x4 {
            let tuple = this._skeleton.dummyJoints[key];
            if (!tuple) {
                return result;
            }
            let matrixs = this._dummyMatrixs[key];
            if (!matrixs) {
                this._dummyMatrixs[key] = matrixs = new Array<Float32Array>(this._animationData.numFrames);
            }

            let matrix = matrixs[index];
            if (!matrix) {
                matrixs[index] = matrix = this._animationData.getDummyMatrix(index, this._skeleton, tuple[0], tuple[1]);
            }
            result.elements.set(matrix);
            return result;
        }
    }

    export class Skeleton {
        public readonly boneParentIndexs: Uint8Array;
        public readonly inverseBindPoses: Float32Array;
        public readonly dummyJoints: Table<[number, Float32Array]>;
        private readonly keys: AnimationData[];
        private readonly values: SkeletonClip[];

        constructor(boneParentIndexs: Uint8Array, inverseBindPoses: Float32Array, boneNames: Array<string>, mountPoints: Table<[string, Float32Array]>) {
            this.boneParentIndexs = boneParentIndexs;
            this.inverseBindPoses = inverseBindPoses;

            if (mountPoints) {
                this.dummyJoints = {};
                for (let name in mountPoints) {
                    let tuple = mountPoints[name];
                    this.dummyJoints[name] = [boneNames.indexOf(tuple[0]), tuple[1]];
                }
                this.keys = [];
                this.values = [];
            }
        }

        public getSkeletonClip(data: AnimationData): SkeletonClip {
            if (!this.dummyJoints) {
                return null;
            }

            let index = this.keys.indexOf(data);
            if (index == -1) {
                this.keys.push(data);
                this.values.push(new SkeletonClip(this, data));
                index = this.values.length - 1;
            }
            return this.values[index];
        }
    }

    export class MeshData {
        public vb: Array<VertexBuffer3D>;
        public ib: Array<IndexBuffer3D>;
        public geometryOffsets: Table<[string, Float32Array]>;
        public skeleton: Skeleton;

        public static boneParentIndexs: Uint8Array;
        public static boneNames: Array<string>;
        public static inverseBindPoses: Float32Array;
        public static mountPoints: Table<[string, Float32Array]>;

        public destroy(): void {
            this.geometryOffsets = null;

            for (let vb of this.vb) {
                vb.lock = false;
                vb.destroy();
            }
            this.vb = null;

            for (let ib of this.ib) {
                ib.lock = false;
                ib.destroy();
            }
            this.ib = null;
        }

        private static vertexDeclarations = [
            new VertexDeclaration(20, [
                new VertexElement(0, VertexElementFormat.Vector3, VertexElementUsage.POSITION0),
                new VertexElement(12, VertexElementFormat.Vector2, VertexElementUsage.TEXTURECOORDINATE0)
            ]),
            new VertexDeclaration(28, [
                new VertexElement(0, VertexElementFormat.Vector3, VertexElementUsage.POSITION0),
                new VertexElement(12, VertexElementFormat.Vector2, VertexElementUsage.TEXTURECOORDINATE0),
                new VertexElement(20, VertexElementFormat.Single, VertexElementUsage.BLENDWEIGHT0),
                new VertexElement(24, VertexElementFormat.Single, VertexElementUsage.BLENDINDICES0)
            ]),
            new VertexDeclaration(36, [
                new VertexElement(0, VertexElementFormat.Vector3, VertexElementUsage.POSITION0),
                new VertexElement(12, VertexElementFormat.Vector2, VertexElementUsage.TEXTURECOORDINATE0),
                new VertexElement(20, VertexElementFormat.Vector2, VertexElementUsage.BLENDWEIGHT0),
                new VertexElement(28, VertexElementFormat.Vector2, VertexElementUsage.BLENDINDICES0)
            ]),
            new VertexDeclaration(44, [
                new VertexElement(0, VertexElementFormat.Vector3, VertexElementUsage.POSITION0),
                new VertexElement(12, VertexElementFormat.Vector2, VertexElementUsage.TEXTURECOORDINATE0),
                new VertexElement(20, VertexElementFormat.Vector3, VertexElementUsage.BLENDWEIGHT0),
                new VertexElement(32, VertexElementFormat.Vector3, VertexElementUsage.BLENDINDICES0)
            ]),
            new VertexDeclaration(52, [
                new VertexElement(0, VertexElementFormat.Vector3, VertexElementUsage.POSITION0),
                new VertexElement(12, VertexElementFormat.Vector2, VertexElementUsage.TEXTURECOORDINATE0),
                new VertexElement(20, VertexElementFormat.Vector4, VertexElementUsage.BLENDWEIGHT0),
                new VertexElement(36, VertexElementFormat.Vector4, VertexElementUsage.BLENDINDICES0)
            ])
        ];
        private static mesh: MeshData;

        public static create(buffer: ArrayBuffer): MeshData {
            MeshData.mesh = new MeshData();

            let bytes = new Byte(buffer);
            while (bytes.bytesAvailable) {
                let chunkType = bytes.getUint16();
                let chunkSize = bytes.getUint32();
                switch (chunkType) {
                    case ChunkType.Mesh:
                        MeshData.parseMesh(bytes, chunkSize);
                        break;
                    default:
                        bytes.pos += chunkSize;
                        break;
                }
            }

            let result = MeshData.mesh;
            MeshData.mesh = null;
            if (MeshData.boneParentIndexs) {
                result.skeleton = new Skeleton(MeshData.boneParentIndexs, MeshData.inverseBindPoses, MeshData.boneNames, MeshData.mountPoints);
            }
            MeshData.boneParentIndexs = null;
            MeshData.inverseBindPoses = null;
            MeshData.boneNames = null;
            MeshData.mountPoints = null;
            return result;
        }

        private static parseMesh(bytes: Byte, size: uint32): void {
            let limit = bytes.pos + size;
            while (bytes.pos < limit) {
                let chunkType = bytes.getUint16();
                let chunkSize = bytes.getUint32();
                switch (chunkType) {
                    case ChunkType.Geometry:
                        MeshData.parseGeometry(bytes, chunkSize);
                        break;
                    case ChunkType.Skeleton:
                        MeshData.parseSkeleton(bytes, chunkSize);
                        break;
                    default:
                        bytes.pos += chunkSize;
                        break;
                }
            }
        }

        private static parseGeometry(bytes: Byte, size: uint32): void {
            let limit = bytes.pos + size;
            while (bytes.pos < limit) {
                let chunkType = bytes.getUint16();
                let chunkSize = bytes.getUint32();
                switch (chunkType) {
                    case ChunkType.SubGeometry:
                        MeshData.parseSubGeometry(bytes, chunkSize);
                        break;
                    case ChunkType.GeometryAttributes:
                        MeshData.parseGeometryAttributes(bytes, chunkSize);
                        break;
                    default:
                        bytes.pos += chunkSize;
                        break;
                }
            }
        }

        private static parseSkeleton(bytes: Byte, size: uint32): void {
            let limit = bytes.pos + size;
            while (bytes.pos < limit) {
                let chunkType = bytes.getUint16();
                let chunkSize = bytes.getUint32();
                switch (chunkType) {
                    case ChunkType.SkeletonJoint:
                        MeshData.parseSkeletonJoint(bytes, chunkSize);
                        break;
                    case ChunkType.SkeletonAttributes:
                        MeshData.parseSkeletonAttributes(bytes, chunkSize);
                        break;
                    default:
                        bytes.pos += chunkSize;
                        break;
                }
            }
        }

        private static parseSubGeometry(bytes: Byte, size: uint32): void {
            let count = bytes.getUint16();
            let vbs = new Array<VertexBuffer3D>(count);
            let ibs = new Array<IndexBuffer3D>(count);
            for (let i = 0; i < count; ++i) {
                let flags = bytes.getUint8();
                let blendWeights = bytes.getUint8();
                let vertexDeclaration = 3 * 4;      // 三个顶点各四字节
                if ((flags & 0x02) != 0) {
                    vertexDeclaration += 2 * 4;     // uv各四字节
                }
                if ((flags & 0x04) != 0) {          // blendWeights个权重对应的骨骼索引和权重值各4字节
                    vertexDeclaration += blendWeights * 2 * 4;
                }

                let vertexCount = bytes.getUint32();
                let vertexData = new Float32Array(bytes.buffer.slice(bytes.pos, bytes.pos + vertexCount * vertexDeclaration));
                bytes.pos += vertexCount * vertexDeclaration;
                let vertexBuffer: VertexBuffer3D = VertexBuffer3D.create(MeshData.vertexDeclarations[blendWeights], vertexCount, WebGLContext.STATIC_DRAW, true);
                vertexBuffer.setData(vertexData);
                vertexBuffer.lock = true;
                vbs[i] = vertexBuffer;

                let indexCount = bytes.getUint32();
                let indexData = new Uint16Array(bytes.buffer.slice(bytes.pos, bytes.pos + indexCount * 2));
                bytes.pos += indexCount * 2;
                let indexBuffer: IndexBuffer3D = IndexBuffer3D.create(IndexBuffer3D.INDEXTYPE_USHORT, indexCount, WebGLContext.STATIC_DRAW, true);
                indexBuffer.setData(indexData);
                indexBuffer.lock = true;
                ibs[i] = indexBuffer;
            }
            MeshData.mesh.vb = vbs;
            MeshData.mesh.ib = ibs;
        }


        private static parseGeometryAttributes(bytes: Byte, size: uint32): void {
            let limit = bytes.pos + size;
            MeshData.mesh.geometryOffsets = {};
            while (bytes.pos < limit) {
                let key = bytes.readUTFString();
                let type = bytes.getUint8();
                let length = bytes.getUint32();
                switch (type) {
                    case 32:
                        let name = bytes.readUTFString();
                        MeshData.mesh.geometryOffsets[key] = [name, MeshData.readMatrix4x4(bytes)];
                        break;
                    default:
                        bytes.pos += length;
                        break;
                }
            }
        }

        private static parseSkeletonJoint(bytes: Byte, size: uint32): void {
            let numJoints = bytes.getUint16();

            let boneIndexs = new Uint8Array(bytes.buffer.slice(bytes.pos, bytes.pos + numJoints));
            bytes.pos += numJoints;

            let boneNames = new Array<string>(numJoints);
            for (let i = 0; i < numJoints; ++i) {
                boneNames[i] = bytes.readUTFString();
            }

            let inverseBindPosesData: Float32Array = new Float32Array(bytes.buffer.slice(bytes.pos, bytes.pos + numJoints * 16 * 4));
            bytes.pos += numJoints * 16 * 4;
            MeshData.boneParentIndexs = boneIndexs;
            MeshData.boneNames = boneNames;
            MeshData.inverseBindPoses = inverseBindPosesData;
        }

        private static parseSkeletonAttributes(bytes: Byte, size: uint32): void {
            MeshData.mountPoints = {};
            let limit = bytes.pos + size;
            while (bytes.pos < limit) {
                let key = bytes.readUTFString();
                let type = bytes.getUint8();
                let length = bytes.getUint32();
                switch (type) {
                    case 32:
                        let name = bytes.readUTFString();
                        MeshData.mountPoints[key] = [name, MeshData.readMatrix4x4(bytes)];
                        break;
                    default:
                        bytes.pos += length;
                        break;
                }
            }
        }

        private static readMatrix4x4(bytes: Byte): Float32Array {
            let result = new Float32Array(16);
            result[0] = bytes.getFloat32();
            result[1] = bytes.getFloat32();
            result[2] = bytes.getFloat32();
            result[3] = 0;

            result[4] = bytes.getFloat32();
            result[5] = bytes.getFloat32();
            result[6] = bytes.getFloat32();
            result[7] = 0;

            result[8] = bytes.getFloat32();
            result[9] = bytes.getFloat32();
            result[10] = bytes.getFloat32();
            result[11] = 0;

            result[12] = bytes.getFloat32();
            result[13] = bytes.getFloat32();
            result[14] = bytes.getFloat32();
            result[15] = 1;

            return result;
        }

    }

    const enum Constant {
        FLOATS_PER_JOINT = 7
    }

    export class AnimationData {
        public name: string;
        public framerate: number;
        public numFrames: number;
        public numJoints: number;
        public frames: Float32Array;
        public flags: Uint8Array;
        public matrices: Float32Array;

        public getSkinnedData(index: number, skeleton: Skeleton, matrices: Float32Array): void {
            this.toGlobalMatrices(index, skeleton);
            ArrayUtils.copy(this.matrices, index * this.numJoints * 12, matrices, 0, matrices.length);
        }

        private toGlobalMatrices(index: number, skeleton: Skeleton) {
            if (!this.flags[index]) {
                this.toGlobalPose(index, skeleton.boneParentIndexs);
                this.toMatrices(index, skeleton.inverseBindPoses);
                this.flags[index] = 1;
            }
        }

        public getDummyMatrix(frame: number, skeleton: Skeleton, index: number, matrix: Float32Array): Float32Array {
            this.toGlobalMatrices(frame, skeleton);
            return this.createAffineTransformation(frame, index, matrix);
        }

        private createAffineTransformation(frame: number, index: number, matrix: Float32Array): Float32Array {
            let oe = new Float32Array(16);
            let joints = this.frames;
            let offset = (frame * this.numJoints * Constant.FLOATS_PER_JOINT) + index * 7;
            let x = joints[offset + 3 + 0], y = joints[offset + 3 + 1], z = joints[offset + 3 + 2],
                w = joints[offset + 3 + 3];
            let x2 = x + x, y2 = y + y, z2 = z + z;
            let xx = x * x2, xy = x * y2, xz = x * z2;
            let yy = y * y2, yz = y * z2, zz = z * z2;
            let wx = w * x2, wy = w * y2, wz = w * z2;
            let sx = 1, sy = 1, sz = 1;
            oe[0] = (1 - (yy + zz)) * sx;
            oe[1] = (xy + wz) * sx;
            oe[2] = (xz - wy) * sx;
            oe[3] = 0;
            oe[4] = (xy - wz) * sy;
            oe[5] = (1 - (xx + zz)) * sy;
            oe[6] = (yz + wx) * sy;
            oe[7] = 0;
            oe[8] = (xz + wy) * sz;
            oe[9] = (yz - wx) * sz;
            oe[10] = (1 - (xx + yy)) * sz;
            oe[11] = 0;
            oe[12] = joints[offset + 0];
            oe[13] = joints[offset + 1];
            oe[14] = joints[offset + 2];
            oe[15] = 1;

            let b = matrix;
            for (let i = 0; i < 4; i++) {
                let ai0 = oe[i];
                let ai1 = oe[i + 4];
                let ai2 = oe[i + 8];
                let ai3 = oe[i + 12];
                oe[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
                oe[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
                oe[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
                oe[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
            }

            return oe;
        }

        protected toGlobalPose(index: number, parentIndexs: Uint8Array): void {
            let parentIndex: number;
            let x1: number, y1: number, z1: number, w1: number;
            let x2: number, y2: number, z2: number, w2: number;
            let x3: number, y3: number, z3: number;

            let globalPoses = this.frames;
            let joints = this.frames;
            let baseOffset = Constant.FLOATS_PER_JOINT * this.numJoints * index;
            for (let i = 0, numJoints = this.numJoints; i < numJoints; ++i) {
                parentIndex = parentIndexs[i] - 1;

                let offset = baseOffset + i * 7;
                let q = offset + 3;
                let t = offset;

                if (parentIndex < 0) {
                    globalPoses[t + 0] = joints[t + 0];
                    globalPoses[t + 1] = joints[t + 1];
                    globalPoses[t + 2] = joints[t + 2];

                    globalPoses[q + 0] = joints[q + 0];
                    globalPoses[q + 1] = joints[q + 1];
                    globalPoses[q + 2] = joints[q + 2];
                    globalPoses[q + 3] = joints[q + 3];
                } else {
                    // append parent pose
                    let parentPose = baseOffset + parentIndex * 7;

                    // rotate point
                    let qr = parentPose + 3;
                    let tr = offset;

                    x2 = globalPoses[qr + 0];
                    y2 = globalPoses[qr + 1];
                    z2 = globalPoses[qr + 2];
                    w2 = globalPoses[qr + 3];
                    x3 = joints[tr + 0];
                    y3 = joints[tr + 1];
                    z3 = joints[tr + 2];

                    w1 = -x2 * x3 - y2 * y3 - z2 * z3;
                    x1 = w2 * x3 + y2 * z3 - z2 * y3;
                    y1 = w2 * y3 - x2 * z3 + z2 * x3;
                    z1 = w2 * z3 + x2 * y3 - y2 * x3;

                    // append parent translation
                    tr = parentPose;
                    globalPoses[t + 0] = -w1 * x2 + x1 * w2 - y1 * z2 + z1 * y2 + globalPoses[tr + 0];
                    globalPoses[t + 1] = -w1 * y2 + x1 * z2 + y1 * w2 - z1 * x2 + globalPoses[tr + 1];
                    globalPoses[t + 2] = -w1 * z2 - x1 * y2 + y1 * x2 + z1 * w2 + globalPoses[tr + 2];

                    // append parent orientation
                    x1 = globalPoses[qr + 0];
                    y1 = globalPoses[qr + 1];
                    z1 = globalPoses[qr + 2];
                    w1 = globalPoses[qr + 3];
                    qr = offset + 3;
                    x2 = joints[qr + 0];
                    y2 = joints[qr + 1];
                    z2 = joints[qr + 2];
                    w2 = joints[qr + 3];

                    globalPoses[q + 3] = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
                    globalPoses[q + 0] = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
                    globalPoses[q + 1] = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
                    globalPoses[q + 2] = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
                }
            }
        }

        protected toMatrices(index: number, inverseBindPoses: Float32Array): void {
            // convert pose to matrix
            let ox, oy, oz, ow;
            let xy2: number, xz2: number, xw2: number;
            let yz2: number, yw2: number, zw2: number;
            let n11: number, n12: number, n13: number;
            let n21: number, n22: number, n23: number;
            let n31: number, n32: number, n33: number;
            let m11: number, m12: number, m13: number, m14: number;
            let m21: number, m22: number, m23: number, m24: number;
            let m31: number, m32: number, m33: number, m34: number;
            let joints = inverseBindPoses;

            let t: number;
            let numJoints = this.numJoints;
            let mtxOffset = index * numJoints * 12;
            let matrices = this.matrices;
            let poseJoints = this.frames;
            let indexOffset = 0;
            let baseOffset = Constant.FLOATS_PER_JOINT * this.numJoints * index;
            for (let i = 0; i < numJoints; ++i) {
                let offset = baseOffset + i * 7;
                let quat = offset + 3;
                let vec = offset;
                ox = poseJoints[quat + 0];
                oy = poseJoints[quat + 1];
                oz = poseJoints[quat + 2];
                ow = poseJoints[quat + 3];

                t = 2.0 * ox;
                xy2 = t * oy;
                xz2 = t * oz;
                xw2 = t * ow;
                t = 2.0 * oy;
                yz2 = t * oz;
                yw2 = t * ow;
                zw2 = 2.0 * oz * ow;

                yz2 = 2.0 * oy * oz;
                yw2 = 2.0 * oy * ow;
                zw2 = 2.0 * oz * ow;
                ox *= ox;
                oy *= oy;
                oz *= oz;
                ow *= ow;

                t = ox - oy;
                n11 = t - oz + ow;
                n12 = xy2 - zw2;
                n13 = xz2 + yw2;
                n21 = xy2 + zw2;
                n22 = -t - oz + ow;
                n23 = yz2 - xw2;
                n31 = xz2 - yw2;
                n32 = yz2 + xw2;
                n33 = -ox - oy + oz + ow;

                // prepend inverse bind pose
                indexOffset = 16 * i;
                m11 = joints[indexOffset + 0];
                m12 = joints[indexOffset + 4];
                m13 = joints[indexOffset + 8];
                m14 = joints[indexOffset + 12];
                m21 = joints[indexOffset + 1];
                m22 = joints[indexOffset + 5];
                m23 = joints[indexOffset + 9];
                m24 = joints[indexOffset + 13];
                m31 = joints[indexOffset + 2];
                m32 = joints[indexOffset + 6];
                m33 = joints[indexOffset + 10];
                m34 = joints[indexOffset + 14];

                matrices[mtxOffset++] = n11 * m11 + n12 * m21 + n13 * m31;
                matrices[mtxOffset++] = n11 * m12 + n12 * m22 + n13 * m32;
                matrices[mtxOffset++] = n11 * m13 + n12 * m23 + n13 * m33;
                matrices[mtxOffset++] = n11 * m14 + n12 * m24 + n13 * m34 + poseJoints[vec + 0];

                matrices[mtxOffset++] = n21 * m11 + n22 * m21 + n23 * m31;
                matrices[mtxOffset++] = n21 * m12 + n22 * m22 + n23 * m32;
                matrices[mtxOffset++] = n21 * m13 + n22 * m23 + n23 * m33;
                matrices[mtxOffset++] = n21 * m14 + n22 * m24 + n23 * m34 + poseJoints[vec + 1];

                matrices[mtxOffset++] = n31 * m11 + n32 * m21 + n33 * m31;
                matrices[mtxOffset++] = n31 * m12 + n32 * m22 + n33 * m32;
                matrices[mtxOffset++] = n31 * m13 + n32 * m23 + n33 * m33;
                matrices[mtxOffset++] = n31 * m14 + n32 * m24 + n33 * m34 + poseJoints[vec + 2];
            }
        }

        public destroy(): void {
            this.name = "";
            this.frames = null;
        }

        private static animationData: AnimationData;

        public static create(buffer: ArrayBuffer): AnimationData {
            let result = AnimationData.animationData = new AnimationData();
            let bytes = new Byte(buffer);
            while (bytes.bytesAvailable) {
                let chunkType = bytes.getUint16();
                let chunkSize = bytes.getUint32();
                switch (chunkType) {
                    case ChunkType.Animation:
                        AnimationData.parseAnimation(bytes, chunkSize);
                        break;
                    default:
                        bytes.pos += chunkSize;
                        break;
                }
            }
            AnimationData.animationData = null;
            return result;
        }

        private static parseAnimationClip(bytes: Byte, size: uint32): void {
            let block = AnimationData.animationData;
            block.name = bytes.readUTFString();
            block.framerate = bytes.getUint16();
            let numFrames = block.numFrames = bytes.getUint16();
            let numJoints = block.numJoints = bytes.getUint16();
            block.flags = new Uint8Array(numFrames);
            block.matrices = new Float32Array(numFrames * numJoints * 12);
            block.frames = bytes.getFloat32Array(bytes.pos, (numJoints * Constant.FLOATS_PER_JOINT * 4) * numFrames);
        }

        private static parseAnimation(bytes: Byte, size: uint32): void {
            let limit = bytes.pos + size;
            while (bytes.pos < limit) {
                let chunkType = bytes.getUint16();
                let chunkSize = bytes.getUint32();
                switch (chunkType) {
                    case ChunkType.AnimationClip:
                        AnimationData.parseAnimationClip(bytes, chunkSize);
                        break;
                    default:
                        bytes.pos += chunkSize;
                        break;
                }
            }
        }
    }
}