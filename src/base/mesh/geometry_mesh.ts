namespace base.mesh {
    import IndexBuffer3D = Laya.IndexBuffer3D;
    import PrimitiveMesh = Laya.PrimitiveMesh;
    import RenderState = Laya.RenderState;
    import VertexBuffer3D = Laya.VertexBuffer3D;

    export class GeometryMesh extends PrimitiveMesh {
        constructor(vb: VertexBuffer3D, ib: IndexBuffer3D) {
            super();
            this._indexBuffer = ib;
            this._indexBuffer._addReference();
            this._vertexBuffer = vb;
            this._vertexBuffer._addReference();
            this._numberVertices = vb.vertexCount;
            this._numberIndices = ib.indexCount;
            // this._positions = this._getPositions();
            this._generateBoundingObject();
            this.completeCreate();
        }

        protected _generateBoundingObject(): void {

        }

        _removeReference(): void {
            super._removeReference();
            if (this.referenceCount <= 0) {
                this.destroy();
            }
        }
    }

    export class SkinnedGeometryMesh extends GeometryMesh {
        public readonly skinnedData: Float32Array;

        constructor(vb: VertexBuffer3D, ib: IndexBuffer3D, numJoint: number) {
            super(vb, ib);
            let skinnedData = new Float32Array(numJoint * 12);
            let j = 0;
            for (let i = 0; i < numJoint; ++i) {
                skinnedData[j++] = 1;
                skinnedData[j++] = 0;
                skinnedData[j++] = 0;
                skinnedData[j++] = 0;

                skinnedData[j++] = 0;
                skinnedData[j++] = 1;
                skinnedData[j++] = 0;
                skinnedData[j++] = 0;

                skinnedData[j++] = 0;
                skinnedData[j++] = 0;
                skinnedData[j++] = 1;
                skinnedData[j++] = 0;
            }
            this.skinnedData = skinnedData;
        }

        _render(state: RenderState): void {
            let renderElement = state.renderElement;
            renderElement._shaderValue.setValue(/*laya.d3.core.SkinnedMeshSprite3D.BONES*/0, this.skinnedData);
            state._shader.uploadRenderElementUniforms(renderElement._shaderValue.data);
            super._render(state);
        }
    }
}