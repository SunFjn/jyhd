/// <reference path="joint_pose.ts"/>

// namespace base.mesh {
//     import Matrix4x4 = Laya.Matrix4x4;
//
//     export class SkeletonPose {
//         public joints: Float32Array;
//         private _isGlobal: boolean;
//         private _matrices: Float32Array;
//         private _dummyJoints: Table<[number, Matrix4x4]>;
//         private _dummyMatrixs: Table<Matrix4x4>;
//
//         constructor(joints: Float32Array, dummyJoints?: Table<[number, Matrix4x4]>) {
//             this._isGlobal = false;
//             this.joints = joints;
//             this._dummyJoints = dummyJoints;
//             this._dummyMatrixs = {};
//         }
//
//         public getSkinnedData(parentIndexs: Uint8Array, inverseBindPoses: Float32Array, matrices: Float32Array): void {
//             if (!this._isGlobal) {
//                 this.toGlobalPose(parentIndexs);
//                 this._matrices = new Float32Array((this.joints.length / 7) * 12);
//                 this.toMatrices(inverseBindPoses, this._matrices);
//                 this._isGlobal = true;
//                 if (this._dummyJoints) {
//                     for (let key in this._dummyJoints) {
//                         let tuple = this._dummyJoints[key];
//                         let matrix = this.createAffineTransformation(tuple[0]);
//                         Matrix4x4.multiply(matrix, tuple[1], matrix);
//                         this._dummyMatrixs[key] = matrix;
//                     }
//                 }
//             }
//             matrices.set(this._matrices);
//         }
//
//         public getDummyMatrix(key: string, result: Matrix4x4): Matrix4x4 {
//             if (this._dummyMatrixs[key] != null) {
//                 result.elements.set(this._dummyMatrixs[key].elements);
//             }
//             return result;
//         }
//
//         private createAffineTransformation(index: number): Matrix4x4 {
//             let result = new Matrix4x4();
//             let oe = result.elements;
//             let joints = this.joints;
//             let offset = index * 7;
//             let x = joints[offset + 3 + 0], y = joints[offset + 3 + 1], z = joints[offset + 3 + 2],
//                 w = joints[offset + 3 + 3];
//             let x2 = x + x, y2 = y + y, z2 = z + z;
//             let xx = x * x2, xy = x * y2, xz = x * z2;
//             let yy = y * y2, yz = y * z2, zz = z * z2;
//             let wx = w * x2, wy = w * y2, wz = w * z2;
//             let sx = 1, sy = 1, sz = 1;
//             oe[0] = (1 - (yy + zz)) * sx;
//             oe[1] = (xy + wz) * sx;
//             oe[2] = (xz - wy) * sx;
//             oe[3] = 0;
//             oe[4] = (xy - wz) * sy;
//             oe[5] = (1 - (xx + zz)) * sy;
//             oe[6] = (yz + wx) * sy;
//             oe[7] = 0;
//             oe[8] = (xz + wy) * sz;
//             oe[9] = (yz - wx) * sz;
//             oe[10] = (1 - (xx + yy)) * sz;
//             oe[11] = 0;
//             oe[12] = joints[offset + 0];
//             oe[13] = joints[offset + 1];
//             oe[14] = joints[offset + 2];
//             oe[15] = 1;
//
//             return result;
//         }
//
//         protected toGlobalPose(parentIndexs: Uint8Array): void {
//             let len = this.joints.length;
//             let parentIndex: number;
//             let x1: number, y1: number, z1: number, w1: number;
//             let x2: number, y2: number, z2: number, w2: number;
//             let x3: number, y3: number, z3: number;
//
//             let globalPoses = this.joints;
//             let joints = this.joints;
//             let numJoint = len / 7;
//             for (let i = 0; i < numJoint; ++i) {
//                 parentIndex = parentIndexs[i] - 1;
//
//                 let q = i * 7 + 3;
//                 let t = i * 7;
//
//                 if (parentIndex < 0) {
//                     globalPoses[t + 0] = joints[t + 0];
//                     globalPoses[t + 1] = joints[t + 1];
//                     globalPoses[t + 2] = joints[t + 2];
//
//                     globalPoses[q + 0] = joints[q + 0];
//                     globalPoses[q + 1] = joints[q + 1];
//                     globalPoses[q + 2] = joints[q + 2];
//                     globalPoses[q + 3] = joints[q + 3];
//                 } else {
//                     // append parent pose
//                     let parentPose = parentIndex * 7;
//
//                     // rotate point
//                     let qr = parentPose + 3;
//                     let tr = i * 7;
//
//                     x2 = globalPoses[qr + 0];
//                     y2 = globalPoses[qr + 1];
//                     z2 = globalPoses[qr + 2];
//                     w2 = globalPoses[qr + 3];
//                     x3 = joints[tr + 0];
//                     y3 = joints[tr + 1];
//                     z3 = joints[tr + 2];
//
//                     w1 = -x2 * x3 - y2 * y3 - z2 * z3;
//                     x1 = w2 * x3 + y2 * z3 - z2 * y3;
//                     y1 = w2 * y3 - x2 * z3 + z2 * x3;
//                     z1 = w2 * z3 + x2 * y3 - y2 * x3;
//
//                     // append parent translation
//                     tr = parentPose;
//                     globalPoses[t + 0] = -w1 * x2 + x1 * w2 - y1 * z2 + z1 * y2 + globalPoses[tr + 0];
//                     globalPoses[t + 1] = -w1 * y2 + x1 * z2 + y1 * w2 - z1 * x2 + globalPoses[tr + 1];
//                     globalPoses[t + 2] = -w1 * z2 - x1 * y2 + y1 * x2 + z1 * w2 + globalPoses[tr + 2];
//
//                     // append parent orientation
//                     x1 = globalPoses[qr + 0];
//                     y1 = globalPoses[qr + 1];
//                     z1 = globalPoses[qr + 2];
//                     w1 = globalPoses[qr + 3];
//                     qr = i * 7 + 3;
//                     x2 = joints[qr + 0];
//                     y2 = joints[qr + 1];
//                     z2 = joints[qr + 2];
//                     w2 = joints[qr + 3];
//
//                     globalPoses[q + 3] = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
//                     globalPoses[q + 0] = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
//                     globalPoses[q + 1] = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
//                     globalPoses[q + 2] = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
//                 }
//             }
//         }
//
//         protected toMatrices(inverseBindPoses: Float32Array, matrices: Float32Array): void {
//             // convert pose to matrix
//             let mtxOffset = 0;
//             let ox, oy, oz, ow;
//             let xy2: number, xz2: number, xw2: number;
//             let yz2: number, yw2: number, zw2: number;
//             let n11: number, n12: number, n13: number;
//             let n21: number, n22: number, n23: number;
//             let n31: number, n32: number, n33: number;
//             let m11: number, m12: number, m13: number, m14: number;
//             let m21: number, m22: number, m23: number, m24: number;
//             let m31: number, m32: number, m33: number, m34: number;
//             let joints = inverseBindPoses;
//
//             let t: number;
//             let numJoints = joints.length / 16;
//             let indexOffset = 0;
//             for (let i = 0; i < numJoints; ++i) {
//                 let quat = i * 7 + 3;
//                 let vec = i * 7;
//                 ox = this.joints[quat + 0];
//                 oy = this.joints[quat + 1];
//                 oz = this.joints[quat + 2];
//                 ow = this.joints[quat + 3];
//
//                 t = 2.0 * ox;
//                 xy2 = t * oy;
//                 xz2 = t * oz;
//                 xw2 = t * ow;
//                 t = 2.0 * oy;
//                 yz2 = t * oz;
//                 yw2 = t * ow;
//                 zw2 = 2.0 * oz * ow;
//
//                 yz2 = 2.0 * oy * oz;
//                 yw2 = 2.0 * oy * ow;
//                 zw2 = 2.0 * oz * ow;
//                 ox *= ox;
//                 oy *= oy;
//                 oz *= oz;
//                 ow *= ow;
//
//                 t = ox - oy;
//                 n11 = t - oz + ow;
//                 n12 = xy2 - zw2;
//                 n13 = xz2 + yw2;
//                 n21 = xy2 + zw2;
//                 n22 = -t - oz + ow;
//                 n23 = yz2 - xw2;
//                 n31 = xz2 - yw2;
//                 n32 = yz2 + xw2;
//                 n33 = -ox - oy + oz + ow;
//
//                 // prepend inverse bind pose
//                 indexOffset = 16 * i;
//                 m11 = joints[indexOffset + 0];
//                 m12 = joints[indexOffset + 4];
//                 m13 = joints[indexOffset + 8];
//                 m14 = joints[indexOffset + 12];
//                 m21 = joints[indexOffset + 1];
//                 m22 = joints[indexOffset + 5];
//                 m23 = joints[indexOffset + 9];
//                 m24 = joints[indexOffset + 13];
//                 m31 = joints[indexOffset + 2];
//                 m32 = joints[indexOffset + 6];
//                 m33 = joints[indexOffset + 10];
//                 m34 = joints[indexOffset + 14];
//
//                 matrices[mtxOffset++] = n11 * m11 + n12 * m21 + n13 * m31;
//                 matrices[mtxOffset++] = n11 * m12 + n12 * m22 + n13 * m32;
//                 matrices[mtxOffset++] = n11 * m13 + n12 * m23 + n13 * m33;
//                 matrices[mtxOffset++] = n11 * m14 + n12 * m24 + n13 * m34 + this.joints[vec + 0];
//
//                 matrices[mtxOffset++] = n21 * m11 + n22 * m21 + n23 * m31;
//                 matrices[mtxOffset++] = n21 * m12 + n22 * m22 + n23 * m32;
//                 matrices[mtxOffset++] = n21 * m13 + n22 * m23 + n23 * m33;
//                 matrices[mtxOffset++] = n21 * m14 + n22 * m24 + n23 * m34 + this.joints[vec + 1];
//
//                 matrices[mtxOffset++] = n31 * m11 + n32 * m21 + n33 * m31;
//                 matrices[mtxOffset++] = n31 * m12 + n32 * m22 + n33 * m32;
//                 matrices[mtxOffset++] = n31 * m13 + n32 * m23 + n33 * m33;
//                 matrices[mtxOffset++] = n31 * m14 + n32 * m24 + n33 * m34 + this.joints[vec + 2];
//             }
//         }
//     }
// }
// /// <reference path="joint_pose.ts"/>
//
// namespace base.mesh {
//     import Matrix4x4 = Laya.Matrix4x4;
//
//     export class SkeletonPose {
//         constructor(numJoint?: number) {
//             this.joints = new Array<JointPose>(numJoint);
//         }
//
//         public readonly joints: Array<JointPose>;
//
//         public toGlobalPose(parentIndexs: Uint8Array, result: SkeletonPose): void {
//             let len = this.joints.length;
//             let parentIndex: number;
//             let x1: number, y1: number, z1: number, w1: number;
//             let x2: number, y2: number, z2: number, w2: number;
//             let x3: number, y3: number, z3: number;
//
//             let globalPoses = result.joints;
//             globalPoses.length = len;
//
//             for (let i = 0; i < len; ++i) {
//                 let globalJointPose = globalPoses[i] = new JointPose();
//                 parentIndex = parentIndexs[i] - 1;
//                 let pose = this.joints[i];
//
//                 let q = globalJointPose.q.elements;
//                 let t = globalJointPose.v.elements;
//
//                 if (parentIndex < 0) {
//                     t[0] = pose.v.elements[0];
//                     t[1] = pose.v.elements[1];
//                     t[2] = pose.v.elements[2];
//
//                     q[0] = pose.q.elements[0];
//                     q[1] = pose.q.elements[1];
//                     q[2] = pose.q.elements[2];
//                     q[3] = pose.q.elements[3];
//                 }
//                 else {
//                     // append parent pose
//                     let parentPose = globalPoses[parentIndex];
//
//                     // rotate point
//                     let qr = parentPose.q.elements;
//                     let tr = pose.v.elements;
//
//                     x2 = qr[0];
//                     y2 = qr[1];
//                     z2 = qr[2];
//                     w2 = qr[3];
//                     x3 = tr[0];
//                     y3 = tr[1];
//                     z3 = tr[2];
//
//                     w1 = -x2 * x3 - y2 * y3 - z2 * z3;
//                     x1 = w2 * x3 + y2 * z3 - z2 * y3;
//                     y1 = w2 * y3 - x2 * z3 + z2 * x3;
//                     z1 = w2 * z3 + x2 * y3 - y2 * x3;
//
//                     // append parent translation
//                     tr = parentPose.v.elements;
//                     t[0] = -w1 * x2 + x1 * w2 - y1 * z2 + z1 * y2 + tr[0];
//                     t[1] = -w1 * y2 + x1 * z2 + y1 * w2 - z1 * x2 + tr[1];
//                     t[2] = -w1 * z2 - x1 * y2 + y1 * x2 + z1 * w2 + tr[2];
//
//                     // append parent orientation
//                     x1 = qr[0];
//                     y1 = qr[1];
//                     z1 = qr[2];
//                     w1 = qr[3];
//                     qr = pose.q.elements;
//                     x2 = qr[0];
//                     y2 = qr[1];
//                     z2 = qr[2];
//                     w2 = qr[3];
//
//                     q[3] = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
//                     q[0] = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
//                     q[1] = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
//                     q[2] = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
//                 }
//             }
//         }
//
//         public toMatrices(inverseBindPoses: Array<Matrix4x4>, matrices: Float32Array): void {
//             // convert pose to matrix
//             let mtxOffset = 0;
//             let ox, oy, oz, ow;
//             let xy2: number, xz2: number, xw2: number;
//             let yz2: number, yw2: number, zw2: number;
//             let n11: number, n12: number, n13: number;
//             let n21: number, n22: number, n23: number;
//             let n31: number, n32: number, n33: number;
//             let m11: number, m12: number, m13: number, m14: number;
//             let m21: number, m22: number, m23: number, m24: number;
//             let m31: number, m32: number, m33: number, m34: number;
//             let joints = inverseBindPoses;
//
//             let t: number;
//             let numJoints = joints.length;
//
//             for (let i = 0; i < numJoints; ++i) {
//                 let quat = this.joints[i].q.elements;
//                 let vec = this.joints[i].v.elements;
//                 ox = quat[0];
//                 oy = quat[1];
//                 oz = quat[2];
//                 ow = quat[3];
//
//                 t = 2.0 * ox;
//                 xy2 = t * oy;
//                 xz2 = t * oz;
//                 xw2 = t * ow;
//                 t = 2.0 * oy;
//                 yz2 = t * oz;
//                 yw2 = t * ow;
//                 zw2 = 2.0 * oz * ow;
//
//                 yz2 = 2.0 * oy * oz;
//                 yw2 = 2.0 * oy * ow;
//                 zw2 = 2.0 * oz * ow;
//                 ox *= ox;
//                 oy *= oy;
//                 oz *= oz;
//                 ow *= ow;
//
//                 t = ox - oy;
//                 n11 = t - oz + ow;
//                 n12 = xy2 - zw2;
//                 n13 = xz2 + yw2;
//                 n21 = xy2 + zw2;
//                 n22 = -t - oz + ow;
//                 n23 = yz2 - xw2;
//                 n31 = xz2 - yw2;
//                 n32 = yz2 + xw2;
//                 n33 = -ox - oy + oz + ow;
//
//                 // prepend inverse bind pose
//                 let raw = joints[i].elements;
//                 m11 = raw[0];
//                 m12 = raw[4];
//                 m13 = raw[8];
//                 m14 = raw[12];
//                 m21 = raw[1];
//                 m22 = raw[5];
//                 m23 = raw[9];
//                 m24 = raw[13];
//                 m31 = raw[2];
//                 m32 = raw[6];
//                 m33 = raw[10];
//                 m34 = raw[14];
//
//                 matrices[mtxOffset++] = n11 * m11 + n12 * m21 + n13 * m31;
//                 matrices[mtxOffset++] = n11 * m12 + n12 * m22 + n13 * m32;
//                 matrices[mtxOffset++] = n11 * m13 + n12 * m23 + n13 * m33;
//                 matrices[mtxOffset++] = n11 * m14 + n12 * m24 + n13 * m34 + vec[0];
//
//                 matrices[mtxOffset++] = n21 * m11 + n22 * m21 + n23 * m31;
//                 matrices[mtxOffset++] = n21 * m12 + n22 * m22 + n23 * m32;
//                 matrices[mtxOffset++] = n21 * m13 + n22 * m23 + n23 * m33;
//                 matrices[mtxOffset++] = n21 * m14 + n22 * m24 + n23 * m34 + vec[1];
//
//                 matrices[mtxOffset++] = n31 * m11 + n32 * m21 + n33 * m31;
//                 matrices[mtxOffset++] = n31 * m12 + n32 * m22 + n33 * m32;
//                 matrices[mtxOffset++] = n31 * m13 + n32 * m23 + n33 * m33;
//                 matrices[mtxOffset++] = n31 * m14 + n32 * m24 + n33 * m34 + vec[2];
//             }
//         }
//     }
// }