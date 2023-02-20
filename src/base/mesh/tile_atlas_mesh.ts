namespace base.mesh {
    import IndexBuffer3D = Laya.IndexBuffer3D;
    import PrimitiveMesh = Laya.PrimitiveMesh;
    import VertexBuffer3D = Laya.VertexBuffer3D;
    import VertexPositionNormal = Laya.VertexPositionNormal;
    import WebGLContext = Laya.WebGLContext;

    const enum Constant {
        BatchLimit = 8,
    }

    export class TileAtlasMesh extends PrimitiveMesh {
        protected _size: number;
        protected _capacity: number;
        protected _width: number;
        protected _height: number;

        constructor(width: number, height: number) {
            super();
            this._size = 0;
            this._capacity = Constant.BatchLimit;
            this._width = width;
            this._height = height;
            this.activeResource();
            this._positions = this._getPositions();
            this._generateBoundingObject();
        }

        public reset(width: number, height: number): void {
            if (this._width !== width || this._height !== height) {
                this._width = width;
                this._height = height;
                this.releaseResource();
                this.activeResource();
            }
        }

        protected recreateResource(): void {
            this.disposeResource();

            let halfW = this._width >> 1;
            let halfH = this._height >> 1;
            this._numberVertices = 4 * this._capacity;
            this._numberIndices = 6 * this._capacity;
            let vertexDeclaration = VertexPositionNormal.vertexDeclaration;
            let vertexFloatStride = vertexDeclaration.vertexStride / 4;
            let vertices = new Float32Array(this._numberVertices * vertexFloatStride);
            let indices = new Uint16Array(this._numberIndices);
            let offset = 0;
            let index = 0;
            for (let i = 0; i < this._capacity; ++i) {
                vertices[index++] = -halfW;
                vertices[index++] = halfH;
                vertices[index++] = 0;
                vertices[index++] = 0;
                vertices[index++] = 0;
                vertices[index++] = i;

                vertices[index++] = halfW;
                vertices[index++] = halfH;
                vertices[index++] = 0;
                vertices[index++] = 1;
                vertices[index++] = 0;
                vertices[index++] = i;

                vertices[index++] = -halfW;
                vertices[index++] = -halfH;
                vertices[index++] = 0;
                vertices[index++] = 0;
                vertices[index++] = 1;
                vertices[index++] = i;

                vertices[index++] = halfW;
                vertices[index++] = -halfH;
                vertices[index++] = 0;
                vertices[index++] = 1;
                vertices[index++] = 1;
                vertices[index++] = i;

                indices[offset++] = i * 4 + 0;
                indices[offset++] = i * 4 + 1;
                indices[offset++] = i * 4 + 2;
                indices[offset++] = i * 4 + 3;
                indices[offset++] = i * 4 + 2;
                indices[offset++] = i * 4 + 1;
            }

            this._vertexBuffer = new VertexBuffer3D(vertexDeclaration, this._numberVertices, WebGLContext.STATIC_DRAW, true);
            this._vertexBuffer._addReference();
            this._indexBuffer = new IndexBuffer3D(IndexBuffer3D.INDEXTYPE_USHORT, this._numberIndices, WebGLContext.STATIC_DRAW, true);
            this._indexBuffer._addReference();

            this._vertexBuffer.setData(vertices);
            this._indexBuffer.setData(indices);
            this.memorySize = (this._vertexBuffer._byteLength + this._indexBuffer._byteLength) * 2;
            this.completeCreate();
        }
    }
}