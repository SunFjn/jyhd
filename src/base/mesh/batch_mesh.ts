///<reference path="../../utils/array_utils.ts"/>

namespace base.mesh {
    import BoundBox = Laya.BoundBox;
    import BoundSphere = Laya.BoundSphere;
    import IndexBuffer3D = Laya.IndexBuffer3D;
    import PrimitiveMesh = Laya.PrimitiveMesh;
    import RenderState = Laya.RenderState;
    import Stat = Laya.Stat;
    import Vector3 = Laya.Vector3;
    import VertexBuffer3D = Laya.VertexBuffer3D;
    import VertexPositionNormal = Laya.VertexPositionNormal;
    import WebGL = Laya.WebGL;
    import WebGLContext = Laya.WebGLContext;
    import ArrayUtils = utils.ArrayUtils;
    import RenderElement = laya.d3.core.render.RenderElement;

    const enum Constant {
        BatchLimit = 30,
        PreElementSize = 4 * 6
    }

    export class BatchMesh extends PrimitiveMesh {
        protected _elements: Array<BatchElement>;
        protected _size: number;
        protected _capacity: number;
        protected _offsetMatrix: Float32Array;
        protected _batchData: Float32Array;
        protected _needUpdate: boolean;

        constructor(capacity = 10 * 30 * 2) {
            super();
            this._elements = [];
            this._size = 0;
            this._capacity = capacity;
            this._batchData = new Float32Array(this._capacity);
            this._numberVertices = 0;
            this._numberIndices = 0;
            this._offsetMatrix = new Float32Array(16 * Constant.BatchLimit);
            this._positions = [];
            this.recreateResource();
            this._generateBoundingObject();
            this._needUpdate = false;
        }

        public _getVertexBuffer(index?: number): VertexBuffer3D {
            (index === void 0) && (index = 0);
            this.checkBuffer();
            if (index === 0) {
                return this._vertexBuffer;
            }
            return null;
        }

        public _getIndexBuffer(): IndexBuffer3D {
            this.checkBuffer();
            return this._indexBuffer;
        }

        protected checkBuffer(): void {
            if (!this._needUpdate) {
                return;
            }
            this._needUpdate = false;

            if (this._size > this._capacity) {
                this._capacity = Math.floor(this._size * 1.5);
                this.recreateResource();
            } else {
                this.fillVertices();
                this._vertexBuffer.setData(this._batchData, 0, 0, this._size * Constant.PreElementSize);
            }
        }

        private fillVertices() {
            let offset = 0;
            let count = this._elements.length;
            for (let i = 0; i < count; ++i) {
                let element = this._elements[i];
                let id = i % Constant.BatchLimit;
                let uvs = element.uvs;
                let size = element.uvs.length >> 2;
                let vertices = this._batchData;
                let index = 0;
                let width = element.width;
                let halfHeight = element.height >> 1;
                let xOffset = -size / 2 * element.width;
                for (let j = 0; j < size; ++j) {
                    let uOffset = uvs[index++];
                    let vOffset = uvs[index++];
                    let uScale = uvs[index++];
                    let vScale = uvs[index++];

                    let left = xOffset + j * width;
                    //xyz,uv,i
                    vertices[offset++] = left;
                    vertices[offset++] = halfHeight;
                    vertices[offset++] = 0;
                    vertices[offset++] = uOffset;
                    vertices[offset++] = vOffset;
                    vertices[offset++] = id;

                    vertices[offset++] = left + width;
                    vertices[offset++] = halfHeight;
                    vertices[offset++] = 0;
                    vertices[offset++] = 1 * uScale + uOffset;
                    vertices[offset++] = vOffset;
                    vertices[offset++] = id;

                    vertices[offset++] = left;
                    vertices[offset++] = -halfHeight;
                    vertices[offset++] = 0;
                    vertices[offset++] = uOffset;
                    vertices[offset++] = 1 * vScale + vOffset;
                    vertices[offset++] = id;

                    vertices[offset++] = left + width;
                    vertices[offset++] = -halfHeight;
                    vertices[offset++] = 0;
                    vertices[offset++] = 1 * uScale + uOffset;
                    vertices[offset++] = 1 * vScale + vOffset;
                    vertices[offset++] = id;
                }
            }
        }

        public addElement(element: BatchElement): void {
            let size = element.uvs.length >> 2;
            this._elements.push(element);
            this._size += size;
            this._needUpdate = true;
        }

        public removeElement(element: BatchElement): void {
            if (ArrayUtils.remove(this._elements, element) != -1) {
                let size = element.uvs.length >> 2;
                this._size -= size;
                this._needUpdate = true;
            }
        }

        public clear(): void {
            this._size = 0;
            this._elements.length = 0;
        }

        public _getPositions(): Array<Vector3> {
            this.checkBuffer();

            let vertices = [];
            let positionElement;
            let vertexElements = this._vertexBuffer.vertexDeclaration.getVertexElements();
            for (let j = 0; j < vertexElements.length; j++) {
                let vertexElement = vertexElements[j];
                if (vertexElement.elementFormat === /*laya.d3.graphics.VertexElementFormat.Vector3*/"vector3" && vertexElement.elementUsage === /*laya.d3.graphics.VertexElementUsage.POSITION0*/0) {
                    positionElement = vertexElement;
                    break;
                }
            }
            let verticesData = this._vertexBuffer.getData();
            for (let j = 0; j < verticesData.length; j += this._vertexBuffer.vertexDeclaration.vertexStride / 4) {
                let offset = j + positionElement.offset / 4;
                let position = new Vector3(verticesData[offset + 0], verticesData[offset + 1], verticesData[offset + 2]);
                vertices.push(position);
            }
            return vertices;
        }

        protected recreateResource(): void {
            this.disposeResource();
            this._numberVertices = 4 * this._capacity;
            this._numberIndices = 6 * this._capacity;
            let vertexDeclaration = VertexPositionNormal.vertexDeclaration;
            let vertexFloatStride = vertexDeclaration.vertexStride / 4;

            let vertices = new Float32Array(this._numberVertices * vertexFloatStride);
            this._batchData = vertices;
            let indices = new Uint16Array(this._numberIndices);
            let offset = 0;
            for (let i = 0; i < this._capacity; ++i) {
                indices[offset++] = i * 4 + 0;
                indices[offset++] = i * 4 + 1;
                indices[offset++] = i * 4 + 2;
                indices[offset++] = i * 4 + 3;
                indices[offset++] = i * 4 + 2;
                indices[offset++] = i * 4 + 1;
            }
            this.fillVertices();

            this._vertexBuffer = new VertexBuffer3D(vertexDeclaration, this._numberVertices, WebGLContext.DYNAMIC_DRAW, true);
            this._vertexBuffer._addReference();
            this._indexBuffer = new IndexBuffer3D(IndexBuffer3D.INDEXTYPE_USHORT, this._numberIndices, WebGLContext.STATIC_DRAW, true);
            this._indexBuffer._addReference();
            this._vertexBuffer.setData(vertices);

            this._indexBuffer.setData(indices);
            this.memorySize = (this._vertexBuffer._byteLength + this._indexBuffer._byteLength) * 2;
            this.completeCreate();
        }

        public _beforeRender(state: RenderState): boolean {
            if (this._elements.length == 0) {
                return false;
            }
            return super._beforeRender(state);
        }

        public _render(state: RenderState): void {
            let renderElement = state.renderElement;
            let numberIndices = 0;
            let offsetIndices = 0;
            let count = 0;
            for (let i = 0; i < this._elements.length; ++i) {
                let literal = this._elements[i];
                numberIndices += (literal.uvs.length >> 2) * 6;
                this._offsetMatrix.set(literal.matrix.elements, count * 16);
                if (++count == Constant.BatchLimit) {
                    this.doRender(renderElement, state, numberIndices, offsetIndices);
                    offsetIndices += numberIndices * 2;
                    numberIndices = 0;
                    count = 0;
                }
            }

            if (count != 0) {
                this.doRender(renderElement, state, numberIndices, offsetIndices);
            }
        }

        private doRender(renderElement: RenderElement, state: Laya.RenderState, numberIndices: number, offsetIndices: number) {
            renderElement._shaderValue.setValue(ShaderRenderElementConstant.OffsetMatrix, this._offsetMatrix);
            state._shader.uploadRenderElementUniforms(renderElement._shaderValue.data);
            WebGL.mainContext.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004, numberIndices, /*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403, offsetIndices);
            Stat.drawCall++;
            Stat.trianglesFaces += numberIndices / 3;
        }

        protected _generateBoundingObject(): void {
            this._boundingSphere = new BoundSphere(Vector3.ZERO, 1);
            this._boundingBox = new BoundBox(Vector3.ZERO, Vector3.ONE);
        }
    }

    export class BatchLiteralhMesh extends PrimitiveMesh {
        protected _elements: Array<BatchLiteralElement>;
        protected _size: number;
        protected _capacity: number;
        protected _offsetMatrix: Float32Array;
        protected _batchData: Float32Array;
        protected _needUpdate: boolean;

        constructor(capacity = 10 * 60 * 2) {
            super();
            this._elements = [];
            this._size = 0;
            this._capacity = capacity;
            this._batchData = new Float32Array(this._capacity);
            this._numberVertices = 0;
            this._numberIndices = 0;
            this._offsetMatrix = new Float32Array(8 * 60);
            this._positions = [];
            this.recreateResource();
            this._generateBoundingObject();
            this._needUpdate = false;
        }

        public _getVertexBuffer(index?: number): VertexBuffer3D {
            (index === void 0) && (index = 0);
            this.checkBuffer();
            if (index === 0) {
                return this._vertexBuffer;
            }
            return null;
        }

        public _getIndexBuffer(): IndexBuffer3D {
            this.checkBuffer();
            return this._indexBuffer;
        }

        protected checkBuffer(): void {
            if (!this._needUpdate) {
                return;
            }
            this._needUpdate = false;

            if (this._size > this._capacity) {
                this._capacity = Math.floor(this._size * 1.5);
                this.recreateResource();
            } else {
                this.fillVertices();
                this._vertexBuffer.setData(this._batchData, 0, 0, this._size * Constant.PreElementSize);
            }
        }

        private fillVertices() {
            let offset = 0;
            let count = this._elements.length;
            for (let i = 0; i < count; ++i) {
                let element = this._elements[i];
                let id = i % 60;
                let uvs = element.uvs;
                let size = element.uvs.length >> 2;
                let vertices = this._batchData;
                let index = 0;

                let elementWidth = 0;
                let sizes = element.sizes;
                for (let j = 0; j < size; ++j) {
                    elementWidth += sizes[j * 2];
                }
                let xOffset = -(elementWidth >> 1);
                let left = xOffset;

                for (let j = 0; j < size; ++j) {
                    let width = sizes[j * 2];
                    let halfHeight = sizes[j * 2 + 1] >> 1;

                    let uOffset = uvs[index++];
                    let vOffset = uvs[index++];
                    let uScale = uvs[index++];
                    let vScale = uvs[index++];

                    //xyz,uv,i
                    vertices[offset++] = left;
                    vertices[offset++] = halfHeight;
                    vertices[offset++] = 0;
                    vertices[offset++] = uOffset;
                    vertices[offset++] = vOffset;
                    vertices[offset++] = id;

                    vertices[offset++] = left + width;
                    vertices[offset++] = halfHeight;
                    vertices[offset++] = 0;
                    vertices[offset++] = 1 * uScale + uOffset;
                    vertices[offset++] = vOffset;
                    vertices[offset++] = id;

                    vertices[offset++] = left;
                    vertices[offset++] = -halfHeight;
                    vertices[offset++] = 0;
                    vertices[offset++] = uOffset;
                    vertices[offset++] = 1 * vScale + vOffset;
                    vertices[offset++] = id;

                    vertices[offset++] = left + width;
                    vertices[offset++] = -halfHeight;
                    vertices[offset++] = 0;
                    vertices[offset++] = 1 * uScale + uOffset;
                    vertices[offset++] = 1 * vScale + vOffset;
                    vertices[offset++] = id;

                    left += width;
                }
            }
        }

        public addElement(element: BatchLiteralElement): void {
            let size = element.uvs.length >> 2;
            this._elements.push(element);
            this._size += size;
            this._needUpdate = true;
        }

        public removeElement(element: BatchLiteralElement): void {
            if (ArrayUtils.remove(this._elements, element) != -1) {
                let size = element.uvs.length >> 2;
                this._size -= size;
                this._needUpdate = true;
            }
        }

        public clear(): void {
            this._size = 0;
            this._elements.length = 0;
        }

        public _getPositions(): Array<Vector3> {
            this.checkBuffer();

            let vertices = [];
            let positionElement;
            let vertexElements = this._vertexBuffer.vertexDeclaration.getVertexElements();
            for (let j = 0; j < vertexElements.length; j++) {
                let vertexElement = vertexElements[j];
                if (vertexElement.elementFormat === /*laya.d3.graphics.VertexElementFormat.Vector3*/"vector3" && vertexElement.elementUsage === /*laya.d3.graphics.VertexElementUsage.POSITION0*/0) {
                    positionElement = vertexElement;
                    break;
                }
            }
            let verticesData = this._vertexBuffer.getData();
            for (let j = 0; j < verticesData.length; j += this._vertexBuffer.vertexDeclaration.vertexStride / 4) {
                let ofset = j + positionElement.offset / 4;
                let position = new Vector3(verticesData[ofset + 0], verticesData[ofset + 1], verticesData[ofset + 2]);
                vertices.push(position);
            }
            return vertices;
        }

        protected recreateResource(): void {
            this.disposeResource();
            this._numberVertices = 4 * this._capacity;
            this._numberIndices = 6 * this._capacity;
            let vertexDeclaration = VertexPositionNormal.vertexDeclaration;
            let vertexFloatStride = vertexDeclaration.vertexStride / 4;

            let vertices = new Float32Array(this._numberVertices * vertexFloatStride);
            this._batchData = vertices;
            let indices = new Uint16Array(this._numberIndices);
            let offset = 0;
            for (let i = 0; i < this._capacity; ++i) {
                indices[offset++] = i * 4 + 0;
                indices[offset++] = i * 4 + 1;
                indices[offset++] = i * 4 + 2;
                indices[offset++] = i * 4 + 3;
                indices[offset++] = i * 4 + 2;
                indices[offset++] = i * 4 + 1;
            }
            this.fillVertices();

            this._vertexBuffer = new VertexBuffer3D(vertexDeclaration, this._numberVertices, WebGLContext.DYNAMIC_DRAW, true);
            this._vertexBuffer._addReference();
            this._indexBuffer = new IndexBuffer3D(IndexBuffer3D.INDEXTYPE_USHORT, this._numberIndices, WebGLContext.STATIC_DRAW, true);
            this._indexBuffer._addReference();
            this._vertexBuffer.setData(vertices);

            this._indexBuffer.setData(indices);
            this.memorySize = (this._vertexBuffer._byteLength + this._indexBuffer._byteLength) * 2;
            this.completeCreate();
        }

        public _beforeRender(state: RenderState): boolean {
            if (this._elements.length == 0) {
                return false;
            }
            return super._beforeRender(state);
        }

        public _render(state: RenderState): void {
            let renderElement = state.renderElement;
            let numberIndices = 0;
            let offsetIndices = 0;
            let count = 0;
            for (let i = 0; i < this._elements.length; ++i) {
                let literal = this._elements[i];
                numberIndices += (literal.uvs.length >> 2) * 6;
                this._offsetMatrix.set(literal.scale.elements, count * 8);
                this._offsetMatrix[count * 8 + 3] = literal.alpha;
                this._offsetMatrix.set(literal.offset.elements, count * 8 + 4);
                if (++count == 60) {
                    this.doRender(renderElement, state, numberIndices, offsetIndices);
                    offsetIndices += numberIndices * 2;
                    numberIndices = 0;
                    count = 0;
                }
            }

            if (count != 0) {
                this.doRender(renderElement, state, numberIndices, offsetIndices);
            }
        }

        private doRender(renderElement: RenderElement, state: Laya.RenderState, numberIndices: number, offsetIndices: number) {
            renderElement._shaderValue.setValue(ShaderRenderElementConstant.OffsetMatrix, this._offsetMatrix);
            state._shader.uploadRenderElementUniforms(renderElement._shaderValue.data);
            WebGL.mainContext.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004, numberIndices, /*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403, offsetIndices);
            Stat.drawCall++;
            Stat.trianglesFaces += numberIndices / 3;
        }

        protected _generateBoundingObject(): void {
            this._boundingSphere = new BoundSphere(Vector3.ZERO, 1);
            this._boundingBox = new BoundBox(Vector3.ZERO, Vector3.ONE);
        }
    }
}