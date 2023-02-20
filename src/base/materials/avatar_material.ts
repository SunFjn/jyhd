///<reference path="material_initializer.ts"/>

namespace base.materials {
    import BaseMaterial = Laya.BaseMaterial;
    import Matrix4x4 = Laya.Matrix4x4;

    export abstract class CustomMaterial extends Laya.BaseMaterial {
        private _enableAlphaBlend: boolean;

        constructor(shaderName: string) {
            super();
            this.setShaderName(shaderName);
            this.enableAlphaBlend = false;
            this.colorMatrix = Matrix4x4.DEFAULT;
            this.completeCreate();
        }

        get colorMatrix(): Matrix4x4 {
            return this._getMatrix4x4(ShaderMaterialConstant.ColorMatrix);
        }

        set colorMatrix(value: Matrix4x4) {
            this._setMatrix4x4(ShaderMaterialConstant.ColorMatrix, value);
        }

        get enableAlphaBlend(): boolean {
            return this._enableAlphaBlend;
        }

        set enableAlphaBlend(value: boolean) {
            if (this._enableAlphaBlend == value) {
                return;
            }
            this._enableAlphaBlend = value;

            if (value) {
                this.blend = BaseMaterial.BLEND_ENABLE_ALL;
                this.blendEquation = BaseMaterial.BLENDEQUATION_ADD;
                this.srcBlend = BaseMaterial.BLENDPARAM_SRC_ALPHA;
                this.dstBlend = BaseMaterial.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
                this.renderQueue = BaseMaterial.RENDERQUEUE_TRANSPARENT;
                this.depthWrite = false;
            } else {
                this.blend = BaseMaterial.BLEND_DISABLE;
                this.renderQueue = BaseMaterial.RENDERQUEUE_OPAQUE;
                this.depthWrite = true;
            }
        }

        /**
         * 获取漫反射贴图。
         *  漫反射贴图。
         */
        public get diffuseTexture(): Laya.BaseTexture {
            return this._getTexture(ShaderMaterialConstant.Texture0);
        }

        /**
         * 设置漫反射贴图。
         * 漫反射贴图。
         */
        public set diffuseTexture(value: Laya.BaseTexture) {
            this._setTexture(ShaderMaterialConstant.Texture0, value);
        }

        _removeReference(): void {
            super._removeReference();
            if (this.referenceCount <= 0) {
                this.destroy();
            }
        }
    }

    export class AvatarMaterial extends CustomMaterial {
        constructor() {
            super("avatar_shader");
        }
    }

    export class AvatarSkinnedMaterial extends CustomMaterial {
        constructor() {
            super("avatar_skinned_shader");
        }
    }
    
    MaterialInitializer.declareShader(
        "avatar_shader",
        {
            'a_Position': Laya.VertexElementUsage.POSITION0,
            'a_Texcoord': Laya.VertexElementUsage.TEXTURECOORDINATE0
        },
        {
            'u_MvpMatrix': [Laya.Sprite3D.MVPMATRIX, Laya.Shader3D.PERIOD_SPRITE],

            'u_Texture0': [ShaderMaterialConstant.Texture0, Laya.Shader3D.PERIOD_MATERIAL],
            'u_AlphaTestValue': [Laya.BaseMaterial.ALPHATESTVALUE, Laya.Shader3D.PERIOD_MATERIAL],
            'u_ColorMatrix': [ShaderMaterialConstant.ColorMatrix, Laya.Shader3D.PERIOD_MATERIAL]
        });

    MaterialInitializer.declareShader(
        "avatar_skinned_shader",
        {
            'a_Position': Laya.VertexElementUsage.POSITION0,
            'a_Texcoord': Laya.VertexElementUsage.TEXTURECOORDINATE0,
            'a_BoneWeights': Laya.VertexElementUsage.BLENDWEIGHT0,
            'a_BoneIndices': Laya.VertexElementUsage.BLENDINDICES0
        },
        {
            'u_MvpMatrix': [Laya.Sprite3D.MVPMATRIX, Laya.Shader3D.PERIOD_SPRITE],
            'u_Bones': [/*Laya.SkinnedMeshSprite3D.BONES*/ 0x0, Laya.Shader3D.PERIOD_RENDERELEMENT],

            'u_Texture0': [ShaderMaterialConstant.Texture0, Laya.Shader3D.PERIOD_MATERIAL],
            'u_AlphaTestValue': [Laya.BaseMaterial.ALPHATESTVALUE, Laya.Shader3D.PERIOD_MATERIAL],
            'u_ColorMatrix': [ShaderMaterialConstant.ColorMatrix, Laya.Shader3D.PERIOD_MATERIAL]
        });

    // function initShader(): void {
    //     let name = "AvatarShader";
    //     Laya.ShaderCompile3D.add(
    //         Laya.Shader3D.nameKey.add(name),
    //         ShaderText[name][0],
    //         ShaderText[name][1],
    //         {
    //             'a_Position': Laya.VertexElementUsage.POSITION0,
    //             'a_Texcoord': Laya.VertexElementUsage.TEXTURECOORDINATE0
    //         },
    //         {
    //             'u_MvpMatrix': [Laya.Sprite3D.MVPMATRIX, Laya.Shader3D.PERIOD_SPRITE],
    //
    //             'u_Texture0': [ShaderConstant.Texture0, Laya.Shader3D.PERIOD_MATERIAL],
    //             'u_AlphaTestValue': [Laya.BaseMaterial.ALPHATESTVALUE, Laya.Shader3D.PERIOD_MATERIAL],
    //             'u_ColorMatrix': [ShaderConstant.ColorMatrix, Laya.Shader3D.PERIOD_MATERIAL]
    //         });
    //
    //     name = "AvatarSkinnedShader";
    //     Laya.ShaderCompile3D.add(
    //         Laya.Shader3D.nameKey.add(name),
    //         ShaderText[name][0],
    //         ShaderText[name][1],
    //         {
    //             'a_Position': Laya.VertexElementUsage.POSITION0,
    //             'a_Texcoord': Laya.VertexElementUsage.TEXTURECOORDINATE0,
    //             'a_BoneWeights': Laya.VertexElementUsage.BLENDWEIGHT0,
    //             'a_BoneIndices': Laya.VertexElementUsage.BLENDINDICES0
    //         },
    //         {
    //             'u_MvpMatrix': [Laya.Sprite3D.MVPMATRIX, Laya.Shader3D.PERIOD_SPRITE],
    //             'u_Bones': [Laya.SkinnedMeshSprite3D.BONES, Laya.Shader3D.PERIOD_RENDERELEMENT],
    //
    //             'u_Texture0': [ShaderConstant.Texture0, Laya.Shader3D.PERIOD_MATERIAL],
    //             'u_AlphaTestValue': [Laya.BaseMaterial.ALPHATESTVALUE, Laya.Shader3D.PERIOD_MATERIAL],
    //             'u_ColorMatrix': [ShaderConstant.ColorMatrix, Laya.Shader3D.PERIOD_MATERIAL]
    //         });
    // }
    //
    // initShader();
}