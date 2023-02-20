///<reference path="material_initializer.ts"/>

namespace base.materials {
    import BaseMaterial = Laya.BaseMaterial;
    import VertexElementUsage = Laya.VertexElementUsage;
    // export class ColorMaterial extends Laya.BaseMaterial {
    //     constructor() {
    //         super();
    //         this.setShaderName("ColorShader");
    //     }
    // }
    //
    // export class UnlitMaterial extends Laya.BaseMaterial {
    //     constructor() {
    //         super();
    //         this.setShaderName("UnlitShader");
    //     }
    //
    //     /**
    //      * 获取漫反射贴图。
    //      *  漫反射贴图。
    //      */
    //     public get diffuseTexture(): Laya.BaseTexture {
    //         return this._getTexture(ShaderConstant.Texture0);
    //     }
    //
    //     /**
    //      * 设置漫反射贴图。
    //      * 漫反射贴图。
    //      */
    //     public set diffuseTexture(value: Laya.BaseTexture) {
    //         this._setTexture(ShaderConstant.Texture0, value);
    //     }
    // }

    // export class UnlitBlendMaterial extends UnlitMaterial {
    //     constructor() {
    //         super();
    //         this.blend = BaseMaterial.BLEND_ENABLE_ALL;
    //         this.blendEquation = BaseMaterial.BLENDEQUATION_ADD;
    //         this.srcBlend = BaseMaterial.BLENDPARAM_SRC_ALPHA;
    //         this.dstBlend = BaseMaterial.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
    //         this.renderQueue = BaseMaterial.RENDERQUEUE_TRANSPARENT;
    //         this.depthWrite = false;
    //     }
    // }

    // export class UnlitUVMaterial extends UnlitBlendMaterial {
    //     constructor() {
    //         super();
    //         this.setShaderName("UnlitUVShader");
    //     }
    // }

    // export class UnlitSkinnedMaterial extends UnlitMaterial {
    //     constructor() {
    //         super();
    //         this.setShaderName("UnlitSkinnedShader");
    //     }
    // }

    export class BatchAtlasMaterial extends Laya.BaseMaterial {
        constructor() {
            super();
            this.setShaderName("batch_atlas_shader");
            this.blend = BaseMaterial.BLEND_ENABLE_ALL;
            this.blendEquation = BaseMaterial.BLENDEQUATION_ADD;
            this.srcBlend = BaseMaterial.BLENDPARAM_SRC_ALPHA;
            this.dstBlend = BaseMaterial.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
            this.renderQueue = BaseMaterial.RENDERQUEUE_TRANSPARENT;
            this.depthWrite = false;
        }

        public get diffuseTexture(): Laya.BaseTexture {
            return this._getTexture(ShaderMaterialConstant.Texture0);
        }

        public set diffuseTexture(value: Laya.BaseTexture) {
            this._setTexture(ShaderMaterialConstant.Texture0, value);
        }
    }

    export class MultiTextureMaterial extends BaseMaterial {
        private static NullTexture: Laya.BaseTexture;
        private readonly _discardArray: Float32Array;

        public readonly tilingOffset: Float32Array;
        public readonly offsetMatrix: Float32Array;

        constructor(enableBlend: boolean = false) {
            super();

            if (enableBlend) {
                this.blend = BaseMaterial.BLEND_ENABLE_ALL;
                this.blendEquation = BaseMaterial.BLENDEQUATION_ADD;
                this.srcBlend = BaseMaterial.BLENDPARAM_SRC_ALPHA;
                this.dstBlend = BaseMaterial.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
                this.renderQueue = BaseMaterial.RENDERQUEUE_TRANSPARENT;
                this.depthWrite = false;
            }

            if (MultiTextureMaterial.NullTexture == null) {
                MultiTextureMaterial.NullTexture = new Laya.SolidColorTexture2D(new Laya.Vector4(0, 0, 0, 0));
                MultiTextureMaterial.NullTexture.lock = true;
            }
            this.setShaderName("multi_texture_shader");

            this.offsetMatrix = new Float32Array(16 * 8);
            this._discardArray = new Float32Array(8);
            let tilingOffset = new Float32Array(4 * 8);
            let offset = 0;
            for (let i = 0; i < 8; ++i) {
                this.setTextureAt(ShaderMaterialConstant.Texture0 + i, MultiTextureMaterial.NullTexture);
                this._discardArray[i] = 1.0;
                tilingOffset[offset++] = 1.0;
                tilingOffset[offset++] = 1.0;
                tilingOffset[offset++] = 0;
                tilingOffset[offset++] = 0;
            }
            this.tilingOffset = tilingOffset;
            this._setBuffer(ShaderMaterialConstant.DiscardArray, this._discardArray);
            this._setBuffer(ShaderMaterialConstant.ColorMatrix, this.offsetMatrix);
            this._setBuffer(ShaderMaterialConstant.TilingOffset, this.tilingOffset);
        }

        public setTextureAt(index: ShaderMaterialConstant, value: Laya.BaseTexture) {
            this._discardArray[index - ShaderMaterialConstant.Texture0] = (value == null) ? 1.0 : .0;
            if (value == null) {
                value = MultiTextureMaterial.NullTexture;
            }
            this._setTexture(index, value);
        }

        public getTextureAt(index: ShaderMaterialConstant): Laya.BaseTexture {
            return this._getTexture(index);
        }
    }

    export class LiteralAtlasMaterial extends BaseMaterial {
        constructor() {
            super();
            this.setShaderName("literal_atlas_shader");
            this.blend = BaseMaterial.BLEND_ENABLE_ALL;
            this.blendEquation = BaseMaterial.BLENDEQUATION_ADD;
            this.srcBlend = BaseMaterial.BLENDPARAM_SRC_ALPHA;
            this.dstBlend = BaseMaterial.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
            this.renderQueue = BaseMaterial.RENDERQUEUE_TRANSPARENT;
            this.depthWrite = false;
        }

        public get diffuseTexture(): Laya.BaseTexture {
            return this._getTexture(ShaderMaterialConstant.Texture0);
        }

        public set diffuseTexture(value: Laya.BaseTexture) {
            this._setTexture(ShaderMaterialConstant.Texture0, value);
        }
    }

    MaterialInitializer.declareShader(
        "literal_atlas_shader",
        {
            'a_Position': VertexElementUsage.POSITION0,
            'a_Args': VertexElementUsage.NORMAL0,
            'a_Texcoord': VertexElementUsage.TEXTURECOORDINATE0
        },
        {
            'u_MvpMatrix': [Laya.Sprite3D.MVPMATRIX, Laya.Shader3D.PERIOD_SPRITE],

            'u_LiteralParams': [ShaderRenderElementConstant.OffsetMatrix, Laya.Shader3D.PERIOD_RENDERELEMENT],

            'u_Texture0': [ShaderMaterialConstant.Texture0, Laya.Shader3D.PERIOD_MATERIAL],
        });

    MaterialInitializer.declareShader(
        "batch_atlas_shader",
        {
            'a_Position': VertexElementUsage.POSITION0,
            'a_Args': VertexElementUsage.NORMAL0,
            'a_Texcoord': VertexElementUsage.TEXTURECOORDINATE0
        },
        {
            'u_MvpMatrix': [Laya.Sprite3D.MVPMATRIX, Laya.Shader3D.PERIOD_SPRITE],

            'u_OffsetMatrix': [ShaderRenderElementConstant.OffsetMatrix, Laya.Shader3D.PERIOD_RENDERELEMENT],

            'u_Texture0': [ShaderMaterialConstant.Texture0, Laya.Shader3D.PERIOD_MATERIAL],
        });

    MaterialInitializer.declareShader(
        "multi_texture_shader",
        {
            'a_Position': VertexElementUsage.POSITION0,
            'a_Args': VertexElementUsage.NORMAL0,
        },
        {
            'u_MvpMatrix': [Laya.Sprite3D.MVPMATRIX, Laya.Shader3D.PERIOD_SPRITE],
            'u_OffsetMatrix': [ShaderMaterialConstant.ColorMatrix, Laya.Shader3D.PERIOD_MATERIAL],
            'u_Discard': [ShaderMaterialConstant.DiscardArray, Laya.Shader3D.PERIOD_MATERIAL],
            'u_TilingOffset': [ShaderMaterialConstant.TilingOffset, Laya.Shader3D.PERIOD_MATERIAL],

            'u_Texture0': [ShaderMaterialConstant.Texture0, Laya.Shader3D.PERIOD_MATERIAL],
            'u_Texture1': [ShaderMaterialConstant.Texture1, Laya.Shader3D.PERIOD_MATERIAL],
            'u_Texture2': [ShaderMaterialConstant.Texture2, Laya.Shader3D.PERIOD_MATERIAL],
            'u_Texture3': [ShaderMaterialConstant.Texture3, Laya.Shader3D.PERIOD_MATERIAL],
            'u_Texture4': [ShaderMaterialConstant.Texture4, Laya.Shader3D.PERIOD_MATERIAL],
            'u_Texture5': [ShaderMaterialConstant.Texture5, Laya.Shader3D.PERIOD_MATERIAL],
            'u_Texture6': [ShaderMaterialConstant.Texture6, Laya.Shader3D.PERIOD_MATERIAL],
            'u_Texture7': [ShaderMaterialConstant.Texture7, Laya.Shader3D.PERIOD_MATERIAL],
        });

    MaterialInitializer.declareShader(
        "custom_particle_shader",
        {
            'a_CornerTextureCoordinate': /*laya.d3.graphics.VertexElementUsage.CORNERTEXTURECOORDINATE0*/17,
            'a_MeshPosition': /*laya.d3.graphics.VertexElementUsage.POSITION0*/0,
            'a_MeshColor': /*laya.d3.graphics.VertexElementUsage.COLOR0*/1,
            'a_MeshTextureCoordinate': /*laya.d3.graphics.VertexElementUsage.TEXTURECOORDINATE0*/2,
            'a_ShapePositionStartLifeTime': /*laya.d3.graphics.VertexElementUsage.SHAPEPOSITIONSTARTLIFETIME*/30,
            'a_DirectionTime': /*laya.d3.graphics.VertexElementUsage.DIRECTIONTIME*/32,
            'a_StartColor': /*laya.d3.graphics.VertexElementUsage.STARTCOLOR0*/19,
            'a_EndColor': /*laya.d3.graphics.VertexElementUsage.ENDCOLOR0*/23,
            'a_StartSize': /*laya.d3.graphics.VertexElementUsage.STARTSIZE*/20,
            'a_StartRotation0': /*laya.d3.graphics.VertexElementUsage.STARTROTATION*/22,
            'a_StartSpeed': /*laya.d3.graphics.VertexElementUsage.STARTSPEED*/31,
            'a_Random0': /*laya.d3.graphics.VertexElementUsage.RANDOM0*/34,
            'a_Random1': /*laya.d3.graphics.VertexElementUsage.RANDOM1*/35,
            'a_SimulationWorldPostion': /*laya.d3.graphics.VertexElementUsage.SIMULATIONWORLDPOSTION*/36,
            'a_SimulationWorldRotation': /*laya.d3.graphics.VertexElementUsage.SIMULATIONWORLDROTATION*/37
        },
        {
            'u_texture': [base.particle.snowflake.MaterialFields.DIFFUSETEXTURE, /*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_Tintcolor': [base.particle.snowflake.MaterialFields.TINTCOLOR, /*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_TilingOffset': [base.particle.snowflake.MaterialFields.TILINGOFFSET, /*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_PeriodX': [base.particle.snowflake.MaterialFields.PERIODX, /*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_MoveSpeedX': [base.particle.snowflake.MaterialFields.MOVESPEEDX, /*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_MoveSpeedY': [base.particle.snowflake.MaterialFields.MOVESPEEDY, /*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_WorldPosition': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.WORLDPOSITION*/0, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_WorldRotation': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.WORLDROTATION*/1, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_PositionScale': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.POSITIONSCALE*/4, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_SizeScale': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SIZESCALE*/5, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ScalingMode': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SCALINGMODE*/6, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_Gravity': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.GRAVITY*/7, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ThreeDStartRotation': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.THREEDSTARTROTATION*/8, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_StretchedBillboardLengthScale': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.STRETCHEDBILLBOARDLENGTHSCALE*/9, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_StretchedBillboardSpeedScale': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.STRETCHEDBILLBOARDSPEEDSCALE*/10, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_SimulationSpace': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SIMULATIONSPACE*/11, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_CurrentTime': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.CURRENTTIME*/12, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ColorOverLifeGradientAlphas': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.COLOROVERLIFEGRADIENTALPHAS*/22, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ColorOverLifeGradientColors': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.COLOROVERLIFEGRADIENTCOLORS*/23, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_MaxColorOverLifeGradientAlphas': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.MAXCOLOROVERLIFEGRADIENTALPHAS*/24, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_MaxColorOverLifeGradientColors': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.MAXCOLOROVERLIFEGRADIENTCOLORS*/25, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_VOLVelocityConst': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.VOLVELOCITYCONST*/13, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_VOLVelocityGradientX': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.VOLVELOCITYGRADIENTX*/14, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_VOLVelocityGradientY': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.VOLVELOCITYGRADIENTY*/15, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_VOLVelocityGradientZ': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.VOLVELOCITYGRADIENTZ*/16, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_VOLVelocityConstMax': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.VOLVELOCITYCONSTMAX*/17, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_VOLVelocityGradientMaxX': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.VOLVELOCITYGRADIENTXMAX*/18, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_VOLVelocityGradientMaxY': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.VOLVELOCITYGRADIENTYMAX*/19, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_VOLVelocityGradientMaxZ': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.VOLVELOCITYGRADIENTZMAX*/20, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_VOLSpaceType': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.VOLSPACETYPE*/21, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_SOLSizeGradient': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SOLSIZEGRADIENT*/26, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_SOLSizeGradientX': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SOLSIZEGRADIENTX*/27, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_SOLSizeGradientY': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SOLSIZEGRADIENTY*/28, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_SOLSizeGradientZ': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SOLSizeGradientZ*/29, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_SOLSizeGradientMax': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SOLSizeGradientMax*/30, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_SOLSizeGradientMaxX': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SOLSIZEGRADIENTXMAX*/31, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_SOLSizeGradientMaxY': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SOLSIZEGRADIENTYMAX*/32, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_SOLSizeGradientMaxZ': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.SOLSizeGradientZMAX*/33, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ROLAngularVelocityConst': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.ROLANGULARVELOCITYCONST*/34, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ROLAngularVelocityConstSeprarate': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.ROLANGULARVELOCITYCONSTSEPRARATE*/35, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ROLAngularVelocityGradient': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENT*/36, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ROLAngularVelocityGradientX': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTX*/37, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ROLAngularVelocityGradientY': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTY*/38, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ROLAngularVelocityGradientZ': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTZ*/39, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ROLAngularVelocityGradientW': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTW*/40, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ROLAngularVelocityConstMax': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.ROLANGULARVELOCITYCONSTMAX*/41, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ROLAngularVelocityConstMaxSeprarate': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.ROLANGULARVELOCITYCONSTMAXSEPRARATE*/42, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ROLAngularVelocityGradientMax': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTMAX*/43, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ROLAngularVelocityGradientMaxX': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTXMAX*/44, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ROLAngularVelocityGradientMaxY': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTYMAX*/45, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ROLAngularVelocityGradientMaxZ': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTZMAX*/46, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_ROLAngularVelocityGradientMaxW': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTWMAX*/47, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_TSACycles': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.TEXTURESHEETANIMATIONCYCLES*/48, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_TSASubUVLength': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.TEXTURESHEETANIMATIONSUBUVLENGTH*/49, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_TSAGradientUVs': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.TEXTURESHEETANIMATIONGRADIENTUVS*/50, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_TSAMaxGradientUVs': [/*laya.d3.core.particleShuriKen.ShuriKenParticle3D.TEXTURESHEETANIMATIONGRADIENTMAXUVS*/51, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_CameraPosition': [/*laya.d3.core.BaseCamera.CAMERAPOS*/0, /*laya.d3.shader.Shader3D.PERIOD_CAMERA*/3],
            'u_CameraDirection': [/*laya.d3.core.BaseCamera.CAMERADIRECTION*/5, /*laya.d3.shader.Shader3D.PERIOD_CAMERA*/3],
            'u_CameraUp': [/*laya.d3.core.BaseCamera.CAMERAUP*/6, /*laya.d3.shader.Shader3D.PERIOD_CAMERA*/3],
            'u_View': [/*laya.d3.core.BaseCamera.VIEWMATRIX*/1, /*laya.d3.shader.Shader3D.PERIOD_CAMERA*/3],
            'u_Projection': [/*laya.d3.core.BaseCamera.PROJECTMATRIX*/2, /*laya.d3.shader.Shader3D.PERIOD_CAMERA*/3],
            'u_FogStart': [/*laya.d3.core.scene.Scene.FOGSTART*/1, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_FogRange': [/*laya.d3.core.scene.Scene.FOGRANGE*/2, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_FogColor': [/*laya.d3.core.scene.Scene.FOGCOLOR*/0, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/4]
        });
}