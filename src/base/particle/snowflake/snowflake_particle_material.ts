namespace base.particle.snowflake {
    import BaseMaterial = Laya.BaseMaterial;
    import Vector4 = Laya.Vector4;
    import Resource = Laya.Resource;

    export class SnowflakeParticleMaterial extends BaseMaterial {
        public static RENDERMODE_OPAQUE = 1;
        public static RENDERMODE_OPAQUEDOUBLEFACE = 2;
        public static RENDERMODE_CUTOUT = 3;
        public static RENDERMODE_CUTOUTDOUBLEFACE = 4;
        public static RENDERMODE_TRANSPARENT = 13;
        public static RENDERMODE_TRANSPARENTDOUBLEFACE = 14;
        public static RENDERMODE_ADDTIVE = 15;
        public static RENDERMODE_ADDTIVEDOUBLEFACE = 16;
        public static RENDERMODE_DEPTHREAD_TRANSPARENT = 5;
        public static RENDERMODE_DEPTHREAD_TRANSPARENTDOUBLEFACE = 6;
        public static RENDERMODE_DEPTHREAD_ADDTIVE = 7;
        public static RENDERMODE_DEPTHREAD_ADDTIVEDOUBLEFACE = 8;
        public static RENDERMODE_NONDEPTH_TRANSPARENT = 9;
        public static RENDERMODE_NONDEPTH_TRANSPARENTDOUBLEFACE = 10;
        public static RENDERMODE_NONDEPTH_ADDTIVE = 11;
        public static RENDERMODE_NONDEPTH_ADDTIVEDOUBLEFACE = 12;
        /*******************************SHADERDEFINE*******************************/
        public static SHADERDEFINE_DIFFUSEMAP = 0;
        public static SHADERDEFINE_TINTCOLOR = 0;
        public static SHADERDEFINE_TILINGOFFSET = 0;
        public static SHADERDEFINE_ADDTIVEFOG = 0;
        public static SHADERDEFINE_ADDTIVEMASK = 0;

        /*******************************SHADERDEFINE*******************************/

        public static load(url: string): SnowflakeParticleMaterial {
            let cache = Resource.getResourceByURL(url) as SnowflakeParticleMaterial;
            if (cache != null) {
                return cache;
            }
            return Laya.loader.create(url, null, null, SnowflakeParticleMaterial);
        }


        public static _parseSnowflakeParticleMaterial(textureMap: any, material: SnowflakeParticleMaterial, json: any): void {
            let customProps = json.customProps;
            let diffuseTexture = customProps.diffuseTexture.texture2D;
            (diffuseTexture) && (material.diffuseTexture = Laya.Loader.getRes(textureMap[diffuseTexture]));
            let tintColorValue = customProps.tintColor;
            (tintColorValue) && (material.tintColor = new Vector4(tintColorValue[0], tintColorValue[1], tintColorValue[2], tintColorValue[3]));
        }

        private static _defaultMaterial: SnowflakeParticleMaterial;

        public static get defaultMaterial(): SnowflakeParticleMaterial {
            if (this._defaultMaterial != null) {
                this._defaultMaterial = new SnowflakeParticleMaterial();
            }
            return this._defaultMaterial;
        }

        constructor() {
            super();
            this.setShaderName("custom_particle_shader");
            this.renderMode = 6;
        }

        public onAsynLoaded(url: string, data: any, params: Array<any>): void {
            let jsonData = data[0];
            if (jsonData.version) {
                super.onAsynLoaded(url, data, params);
            } else {
                let textureMap = data[1];
                let props = jsonData.props;
                for (let prop in props) {
                    // @ts-ignore
                    this[prop] = props[prop];
                }
                SnowflakeParticleMaterial._parseSnowflakeParticleMaterial(textureMap, this, jsonData);
                this._endLoaded();
            }
            this.completeCreate();
        }

        /**
         *设置渲染模式。
         *@return 渲染模式。
         */
        public set renderMode(value: number) {
            switch (value) {
                case 1:
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_OPAQUE*/2000;
                    this.depthWrite = true;
                    this.cull = 2;
                    this.blend = 0;
                    this.alphaTest = false;
                    this._removeShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                case 2:
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_OPAQUE*/2000;
                    this.depthWrite = true;
                    this.cull = 0;
                    this.blend = 0;
                    this.alphaTest = false;
                    this._removeShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                case 3:
                    this.depthWrite = true;
                    this.cull = 2;
                    this.blend = 0;
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_OPAQUE*/2000;
                    this.alphaTest = true;
                    this._removeShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                case 4:
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_OPAQUE*/2000;
                    this.depthWrite = true;
                    this.cull = 0;
                    this.blend = 0;
                    this.alphaTest = true;
                    this._removeShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                case 13:
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
                    this.depthWrite = true;
                    this.cull = 2;
                    this.blend = 1;
                    this.srcBlend = 0x0302;
                    this.dstBlend = 0x0303;
                    this.alphaTest = false;
                    this._removeShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                case 14:
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
                    this.depthWrite = true;
                    this.cull = 0;
                    this.blend = 1;
                    this.srcBlend = 0x0302;
                    this.dstBlend = 0x0303;
                    this.alphaTest = false;
                    this._removeShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                case 15:
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
                    this.depthWrite = true;
                    this.cull = 2;
                    this.blend = 1;
                    this.srcBlend = 0x0302;
                    this.dstBlend = 1;
                    this.alphaTest = false;
                    this._addShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                case 16:
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
                    this.depthWrite = true;
                    this.cull = 0;
                    this.blend = 1;
                    this.srcBlend = 0x0302;
                    this.dstBlend = 1;
                    this.alphaTest = false;
                    this._addShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                case 5:
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
                    this.depthWrite = false;
                    this.cull = 2;
                    this.blend = 1;
                    this.srcBlend = 0x0302;
                    this.dstBlend = 0x0303;
                    this.alphaTest = false;
                    this._removeShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                case 6:
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
                    this.depthWrite = false;
                    this.cull = 0;
                    this.blend = 1;
                    this.srcBlend = 0x0302;
                    this.dstBlend = 0x0303;
                    this.alphaTest = false;
                    this._removeShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                case 7:
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
                    this.depthWrite = false;
                    this.cull = 2;
                    this.blend = 1;
                    this.srcBlend = 0x0302;
                    this.dstBlend = 1;
                    this.alphaTest = false;
                    this._addShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                case 8:
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
                    this.depthWrite = false;
                    this.cull = 0;
                    this.blend = 1;
                    this.srcBlend = 0x0302;
                    this.dstBlend = 1;
                    this.alphaTest = false;
                    this._addShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                case 9:
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
                    this.depthTest = 0x0201;
                    this.cull = 2;
                    this.blend = 1;
                    this.srcBlend = 0x0302;
                    this.dstBlend = 0x0303;
                    this.alphaTest = false;
                    this._removeShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                case 10:
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
                    this.depthTest = 0x0201;
                    this.cull = 0;
                    this.blend = 1;
                    this.srcBlend = 0x0302;
                    this.dstBlend = 0x0303;
                    this.alphaTest = false;
                    this._removeShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                case 11:
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
                    this.depthTest = 0x0201;
                    this.cull = 2;
                    this.blend = 1;
                    this.srcBlend = 0x0302;
                    this.dstBlend = 1;
                    this.alphaTest = false;
                    this._addShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                case 12:
                    this.renderQueue = /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
                    this.depthTest = 0x0201;
                    this.cull = 0;
                    this.blend = 1;
                    this.srcBlend = 0x0302;
                    this.dstBlend = 1;
                    this.alphaTest = false;
                    this._addShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
                    break;
                default :
                    throw new Error("Material:renderMode value error.");
            }
        }

        /**
         *设置颜色。
         *@param value 颜色。
         */
        /**
         *获取颜色。
         *@return 颜色。
         */
        public get tintColor(): Vector4 {
            return this._getColor(MaterialFields.TINTCOLOR);
        }

        public set tintColor(value: Vector4) {
            if (value)
                this._addShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_TINTCOLOR);
            else
                this._removeShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_TINTCOLOR);
            this._setColor(MaterialFields.TINTCOLOR, value);
        }

        /**
         *获取纹理平铺和偏移。
         *@param value 纹理平铺和偏移。
         */
        /**
         *获取纹理平铺和偏移。
         *@return 纹理平铺和偏移。
         */
        public get tilingOffset(): Vector4 {
            return this._getColor(MaterialFields.TILINGOFFSET);
        }

        public set tilingOffset(value: Vector4) {
            if (value) {
                let valueE = value.elements;
                if (valueE[0] != 1 || valueE[1] != 1 || valueE[2] != 0 || valueE[3] != 0)
                    this._addShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_TILINGOFFSET);
                else
                    this._removeShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_TILINGOFFSET);
            } else {
                this._removeShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_TILINGOFFSET);
            }
            this._setColor(MaterialFields.TILINGOFFSET, value);
        }

        /**
         *设置漫反射贴图。
         *@param value 漫反射贴图。
         */
        /**
         *获取漫反射贴图。
         *@return 漫反射贴图。
         */
        public get diffuseTexture(): Laya.BaseTexture {
            return this._getTexture(MaterialFields.DIFFUSETEXTURE);
        }

        public set diffuseTexture(value: Laya.BaseTexture) {
            if (value)
                this._addShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_DIFFUSEMAP);
            else
                this._removeShaderDefine(SnowflakeParticleMaterial.SHADERDEFINE_DIFFUSEMAP);
            this._setTexture(MaterialFields.DIFFUSETEXTURE, value);
        }

        public get periodX(): number {
            return this._getNumber(MaterialFields.PERIODX);
        }

        public set periodX(value: number) {
            this._setNumber(MaterialFields.PERIODX, value);
        }

        public get moveSpeedX(): number {
            return this._getNumber(MaterialFields.MOVESPEEDX);
        }

        public set moveSpeedX(value: number) {
            this._setNumber(MaterialFields.MOVESPEEDX, value);
        }

        public get moveSpeedY(): number {
            return this._getNumber(MaterialFields.MOVESPEEDY);
        }

        public set moveSpeedY(value: number) {
            this._setNumber(MaterialFields.MOVESPEEDY, value);
        }
    }
}