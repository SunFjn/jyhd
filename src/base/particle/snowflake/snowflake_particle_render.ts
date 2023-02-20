namespace base.particle.snowflake {
    export class SnowflakeParticleRender extends Laya.BaseRender {
        private static gravity = new Laya.Vector3(0, -9.81, 0);

        private _defaultBoundBox: Laya.BoundBox;
        private _renderMode: MeshType;
        private _mesh: Laya.Mesh;
        public stretchedBillboardCameraSpeedScale: number;
        public stretchedBillboardSpeedScale: number;
        public stretchedBillboardLengthScale: number;
        private _finalGravity: Laya.Vector3;
        private _tempRotationMatrix: Laya.Matrix4x4;

        constructor(owner: SnowflakeParticle3D) {
            super(owner);
            this._finalGravity = new Laya.Vector3();
            this._tempRotationMatrix = new Laya.Matrix4x4();
            this._defaultBoundBox = new Laya.BoundBox(new Laya.Vector3(), new Laya.Vector3());
            this._renderMode = MeshType.NONE;
            this._mesh = null;
            this.stretchedBillboardCameraSpeedScale = 0;
            this.stretchedBillboardLengthScale = 0;
            this.stretchedBillboardLengthScale = 1.0;
        }

        protected _calculateBoundingBox(): void {
            let elements = this._boundingBox.min.elements;
            elements[0] = -Number.MAX_VALUE;
            elements[1] = -Number.MAX_VALUE;
            elements[2] = -Number.MAX_VALUE;
            elements = this._boundingBox.max.elements;
            elements[0] = Number.MAX_VALUE;
            elements[1] = Number.MAX_VALUE;
            elements[2] = Number.MAX_VALUE;
        }

        protected _calculateBoundingSphere(): void {
            let oriBoundSphere = (<any>this._owner).particleSystem._boundingSphere;
            let maxScale = NaN;
            let transform = this._owner.transform;
            let scaleE = transform.scale.elements;
            let scaleX = Math.abs(scaleE[0]);
            let scaleY = Math.abs(scaleE[1]);
            let scaleZ = Math.abs(scaleE[2]);
            if (scaleX >= scaleY && scaleX >= scaleZ)
                maxScale = scaleX;
            else
                maxScale = scaleY >= scaleZ ? scaleY : scaleZ;
            Laya.Vector3.transformCoordinate(oriBoundSphere.center, transform.worldMatrix, this._boundingSphere.center);
            this._boundingSphere.radius = oriBoundSphere.radius * maxScale;
        }

        public _renderUpdate(projectionView: Laya.Matrix4x4): boolean {
            let particleSystem = (<any>this._owner).particleSystem;
            if (!Laya.stage.isVisibility || !particleSystem.isAlive)
                return false;
            let transform = this._owner.transform;
            switch (particleSystem.simulationSpace) {
                case 0:
                    break;
                case 1:
                    this._setShaderValueColor(/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.WORLDPOSITION*/0, transform.position);
                    this._setShaderValueColor(/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.WORLDROTATION*/1, transform.rotation);
                    break;
                default :
                    throw new Error("SnowflakeParticleMaterial: SimulationSpace value is invalid.");
            }
            switch (particleSystem.scaleMode) {
                case 0:
                    let scale = transform.scale;
                    this._setShaderValueColor(/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.POSITIONSCALE*/4, scale);
                    this._setShaderValueColor(/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SIZESCALE*/5, scale);
                    break;
                case 1:
                    let localScale = transform.localScale;
                    this._setShaderValueColor(/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.POSITIONSCALE*/4, localScale);
                    this._setShaderValueColor(/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SIZESCALE*/5, localScale);
                    break;
                case 2:
                    this._setShaderValueColor(/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.POSITIONSCALE*/4, transform.scale);
                    this._setShaderValueColor(/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SIZESCALE*/5, Laya.Vector3.ONE);
                    break;
            }
            let finalGravityE = this._finalGravity.elements;
            // let gravityE = Laya.Physics.gravity.elements;
            let gravityE = SnowflakeParticleRender.gravity.elements;
            let gravityModifier = particleSystem.gravityModifier;
            finalGravityE[0] = gravityE[0] * gravityModifier;
            finalGravityE[1] = gravityE[1] * gravityModifier;
            finalGravityE[2] = gravityE[2] * gravityModifier;
            this._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.GRAVITY*/7, finalGravityE);
            this._setShaderValueInt(/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SIMULATIONSPACE*/11, particleSystem.simulationSpace);
            this._setShaderValueBool(/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.THREEDSTARTROTATION*/8, particleSystem.threeDStartRotation);
            this._setShaderValueInt(/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SCALINGMODE*/6, particleSystem.scaleMode);
            this._setShaderValueInt(/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.STRETCHEDBILLBOARDLENGTHSCALE*/9, this.stretchedBillboardLengthScale);
            this._setShaderValueInt(/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.STRETCHEDBILLBOARDSPEEDSCALE*/10, this.stretchedBillboardSpeedScale);
            this._setShaderValueNumber(/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.CURRENTTIME*/12, particleSystem._currentTime);
            if (Laya3D.debugMode)
                this._renderRenderableBoundBox();
            return true;
        }

        public _destroy(): void {
            super._destroy();
            (this._mesh) && (this._mesh._removeReference(), this._mesh = null);
        }

        public get boundingBox(): Laya.BoundBox {
            if (!(<any>this._owner).particleSystem.isAlive) {
                return this._defaultBoundBox;
            } else {
                if (this._boundingBoxNeedChange) {
                    this._calculateBoundingBox();
                    this._boundingBoxNeedChange = false;
                }
                return this._boundingBox;
            }
        }

        /**
         *设置渲染模式,0为BILLBOARD、1为STRETCHEDBILLBOARD、2为HORIZONTALBILLBOARD、3为VERTICALBILLBOARD、4为MESH。
         *@param value 渲染模式。
         */
        /**
         *获取渲染模式。
         *@return 渲染模式。
         */
        public get renderMode(): MeshType {
            return this._renderMode;
        }

        public set renderMode(value: MeshType) {
            if (this._renderMode !== value) {
                switch (this._renderMode) {
                    case MeshType.BILLBOARD:
                        this._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_RENDERMODE_BILLBOARD);
                        break;
                    case MeshType.STRETCHEDBILLBOARD:
                        this._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_RENDERMODE_STRETCHEDBILLBOARD);
                        break;
                    case MeshType.HORIZONTALBILLBOARD:
                        this._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_RENDERMODE_HORIZONTALBILLBOARD);
                        break;
                    case MeshType.VERTICALBILLBOARD:
                        this._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_RENDERMODE_VERTICALBILLBOARD);
                        break;
                    case MeshType.MESH:
                        this._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_RENDERMODE_MESH);
                        break;
                }
                this._renderMode = value;
                switch (value) {
                    case MeshType.BILLBOARD:
                        this._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_RENDERMODE_BILLBOARD);
                        break;
                    case MeshType.STRETCHEDBILLBOARD:
                        this._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_RENDERMODE_STRETCHEDBILLBOARD);
                        break;
                    case MeshType.HORIZONTALBILLBOARD:
                        this._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_RENDERMODE_HORIZONTALBILLBOARD);
                        break;
                    case MeshType.VERTICALBILLBOARD:
                        this._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_RENDERMODE_VERTICALBILLBOARD);
                        break;
                    case MeshType.MESH:
                        this._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_RENDERMODE_MESH);
                        break;
                    default :
                        throw new Error("SnowflakeParticleRender: unknown renderMode Value.");
                }
                (<any>this._owner).particleSystem._initBufferDatas();
            }
        }

        /**
         *设置网格渲染模式所使用的Mesh,rendderMode为4时生效。
         *@param value 网格模式所使用Mesh。
         */
        /**
         *获取网格渲染模式所使用的Mesh,rendderMode为4时生效。
         *@return 网格模式所使用Mesh。
         */
        public get mesh(): Laya.Mesh {
            return this._mesh;
        }

        public set mesh(value: Laya.Mesh) {
            if (this._mesh !== value) {
                (this._mesh) && (this._mesh._removeReference());
                this._mesh = value;
                (value) && (value._addReference());
                (<any>this._owner).particleSystem._initBufferDatas();
            }
        }
    }
}