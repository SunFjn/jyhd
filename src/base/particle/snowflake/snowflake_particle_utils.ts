namespace base.particle.snowflake {
    import GradientDataNumber = Laya.GradientDataNumber;
    import GradientDataColor = Laya.GradientDataColor;
    import Vector3 = Laya.Vector3;
    import GradientDataInt = Laya.GradientDataInt;
    import MathUtil = Laya.MathUtil;
    import Rand = Laya.Rand;

    export class SnowflakeParticleUtils {
        private static _isInit: boolean = false;

        public static init() {
            if (this._isInit) {
                return;
            }
            this._isInit = true;

            Laya.AnimationNode.registerAnimationNodeProperty(
                "particleRender.sharedMaterial.tilingOffset",
                SnowflakeParticleUtils._getParticleRenderSharedMaterialTilingOffset,
                SnowflakeParticleUtils._setParticleRenderSharedMaterialTilingOffset);

            let shaderCompile = Laya.ShaderCompile3D.get("custom_particle_shader");
            SnowflakeParticleMaterial.SHADERDEFINE_DIFFUSEMAP = shaderCompile.registerMaterialDefine("DIFFUSEMAP");
            SnowflakeParticleMaterial.SHADERDEFINE_TINTCOLOR = shaderCompile.registerMaterialDefine("TINTCOLOR");
            SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEFOG = shaderCompile.registerMaterialDefine("ADDTIVEFOG");
            SnowflakeParticleMaterial.SHADERDEFINE_TILINGOFFSET = shaderCompile.registerMaterialDefine("TILINGOFFSET");
            SnowflakeParticleMaterial.SHADERDEFINE_ADDTIVEMASK = shaderCompile.registerMaterialDefine("ADDTIVEMASK");

            SnowflakeParticle3D.SHADERDEFINE_RENDERMODE_BILLBOARD = shaderCompile.registerSpriteDefine("SPHERHBILLBOARD");
            SnowflakeParticle3D.SHADERDEFINE_RENDERMODE_STRETCHEDBILLBOARD = shaderCompile.registerSpriteDefine("STRETCHEDBILLBOARD");
            SnowflakeParticle3D.SHADERDEFINE_RENDERMODE_HORIZONTALBILLBOARD = shaderCompile.registerSpriteDefine("HORIZONTALBILLBOARD");
            SnowflakeParticle3D.SHADERDEFINE_RENDERMODE_VERTICALBILLBOARD = shaderCompile.registerSpriteDefine("VERTICALBILLBOARD");
            SnowflakeParticle3D.SHADERDEFINE_COLOROVERLIFETIME = shaderCompile.registerSpriteDefine("COLOROVERLIFETIME");
            SnowflakeParticle3D.SHADERDEFINE_RANDOMCOLOROVERLIFETIME = shaderCompile.registerSpriteDefine("RANDOMCOLOROVERLIFETIME");
            SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECONSTANT = shaderCompile.registerSpriteDefine("VELOCITYOVERLIFETIMECONSTANT");
            SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECURVE = shaderCompile.registerSpriteDefine("VELOCITYOVERLIFETIMECURVE");
            SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCONSTANT = shaderCompile.registerSpriteDefine("VELOCITYOVERLIFETIMERANDOMCONSTANT");
            SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCURVE = shaderCompile.registerSpriteDefine("VELOCITYOVERLIFETIMERANDOMCURVE");
            SnowflakeParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONCURVE = shaderCompile.registerSpriteDefine("TEXTURESHEETANIMATIONCURVE");
            SnowflakeParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONRANDOMCURVE = shaderCompile.registerSpriteDefine("TEXTURESHEETANIMATIONRANDOMCURVE");
            SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIME = shaderCompile.registerSpriteDefine("ROTATIONOVERLIFETIME");
            SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMESEPERATE = shaderCompile.registerSpriteDefine("ROTATIONOVERLIFETIMESEPERATE");
            SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECONSTANT = shaderCompile.registerSpriteDefine("ROTATIONOVERLIFETIMECONSTANT");
            SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECURVE = shaderCompile.registerSpriteDefine("ROTATIONOVERLIFETIMECURVE");
            SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCONSTANTS = shaderCompile.registerSpriteDefine("ROTATIONOVERLIFETIMERANDOMCONSTANTS");
            SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCURVES = shaderCompile.registerSpriteDefine("ROTATIONOVERLIFETIMERANDOMCURVES");
            SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVE = shaderCompile.registerSpriteDefine("SIZEOVERLIFETIMECURVE");
            SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVESEPERATE = shaderCompile.registerSpriteDefine("SIZEOVERLIFETIMECURVESEPERATE");
            SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVES = shaderCompile.registerSpriteDefine("SIZEOVERLIFETIMERANDOMCURVES");
            SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVESSEPERATE = shaderCompile.registerSpriteDefine("SIZEOVERLIFETIMERANDOMCURVESSEPERATE");
            SnowflakeParticle3D.SHADERDEFINE_RENDERMODE_MESH = shaderCompile.registerSpriteDefine("RENDERMODE_MESH");
            SnowflakeParticle3D.SHADERDEFINE_SHAPE = shaderCompile.registerSpriteDefine("SHAPE");
        }

        public static precompileShaderWithCreate(): void {
            let shaderCompile = Laya.ShaderCompile3D.get("custom_particle_shader");
            shaderCompile.precompileShaderWithShaderDefine(1, 69214344, 14);
            shaderCompile.precompileShaderWithShaderDefine(1, 69206152, 14);
            shaderCompile.precompileShaderWithShaderDefine(1, 2097288, 14);
            shaderCompile.precompileShaderWithShaderDefine(193, 36208768, 14);
            shaderCompile.precompileShaderWithShaderDefine(1, 136, 14);
            shaderCompile.precompileShaderWithShaderDefine(193, 33554560, 14);
            shaderCompile.precompileShaderWithShaderDefine(193, 33554432, 46);
            shaderCompile.precompileShaderWithShaderDefine(1, 75501704, 14);
            shaderCompile.precompileShaderWithShaderDefine(193, 35815552, 6);
            shaderCompile.precompileShaderWithShaderDefine(1, 69206160, 14);
            shaderCompile.precompileShaderWithShaderDefine(193, 35651712, 14);
            shaderCompile.precompileShaderWithShaderDefine(193, 35651712, 6);
            shaderCompile.precompileShaderWithShaderDefine(193, 35815552, 14);
            shaderCompile.precompileShaderWithShaderDefine(193, 33718400, 14);
            shaderCompile.precompileShaderWithShaderDefine(1, 67285128, 14);
            shaderCompile.precompileShaderWithShaderDefine(1, 67276936, 14);
            shaderCompile.precompileShaderWithShaderDefine(193, 35815552, 30);
            shaderCompile.precompileShaderWithShaderDefine(193, 33554432, 14);
            shaderCompile.precompileShaderWithShaderDefine(1, 69210256, 14);
            shaderCompile.precompileShaderWithShaderDefine(1, 69218448, 6);
            shaderCompile.precompileShaderWithShaderDefine(1, 69214344, 6);
            shaderCompile.precompileShaderWithShaderDefine(1, 69771400, 14);
            shaderCompile.precompileShaderWithShaderDefine(193, 33718400, 6);
            shaderCompile.precompileShaderWithShaderDefine(193, 35815552, 22);
        }

        public static precompileShaderWithGame(): void {
            // let shaderCompile = Laya.ShaderCompile3D.get("custom_particle_shader");
            // shaderCompile.precompileShaderWithShaderDefine(193, 33562624, 6);
            // shaderCompile.precompileShaderWithShaderDefine(1, 2261128, 14);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33554432, 14);
            // shaderCompile.precompileShaderWithShaderDefine(193, 35651712, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 69206160, 14);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33562624, 14);
            // shaderCompile.precompileShaderWithShaderDefine(193, 35651712, 6);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33562624, 30);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33554560, 14);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33726592, 6);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33718400, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 69206152, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 67117192, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 67109024, 6);
            // shaderCompile.precompileShaderWithShaderDefine(1, 69214344, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 2097288, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 69214344, 6);
            // shaderCompile.precompileShaderWithShaderDefine(193, 35651712, 22);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33562752, 6);
            // shaderCompile.precompileShaderWithShaderDefine(1, 69206152, 6);
            // shaderCompile.precompileShaderWithShaderDefine(193, 35815552, 22);
            // shaderCompile.precompileShaderWithShaderDefine(1, 67109000, 6);
            // shaderCompile.precompileShaderWithShaderDefine(1, 67109000, 14);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33726464, 14);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33718272, 6);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33718272, 14);
            // shaderCompile.precompileShaderWithShaderDefine(193, 35659904, 6);
            // shaderCompile.precompileShaderWithShaderDefine(1, 2097312, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 2097312, 6);
            // shaderCompile.precompileShaderWithShaderDefine(193, 35659776, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 2654344, 6);
            // shaderCompile.precompileShaderWithShaderDefine(1, 2105480, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 69771400, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 69763208, 6);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33718400, 6);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33554560, 6);
            // shaderCompile.precompileShaderWithShaderDefine(1, 70291592, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 69210256, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 2654344, 14);
            // shaderCompile.precompileShaderWithShaderDefine(193, 100671488, 6);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33554432, 30);
            // shaderCompile.precompileShaderWithShaderDefine(1, 69210128, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 2662536, 6);
            // shaderCompile.precompileShaderWithShaderDefine(1, 2662544, 6);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33554432, 62);
            // shaderCompile.precompileShaderWithShaderDefine(193, 35815552, 14);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33554432, 6);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33554432, 46);
            // shaderCompile.precompileShaderWithShaderDefine(193, 36208768, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 136, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 75501704, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 69218448, 6);
            // shaderCompile.precompileShaderWithShaderDefine(193, 35823744, 14);
            // shaderCompile.precompileShaderWithShaderDefine(193, 35659904, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 67674248, 14);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33718272, 62);
            // shaderCompile.precompileShaderWithShaderDefine(193, 35815552, 6);
            // shaderCompile.precompileShaderWithShaderDefine(193, 33718272, 30);
            // shaderCompile.precompileShaderWithShaderDefine(1, 67111048, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 69763208, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 557192, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 69214352, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 8, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 163976, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 69771400, 46);
            // shaderCompile.precompileShaderWithShaderDefine(193, 35815552, 30);
            // shaderCompile.precompileShaderWithShaderDefine(1, 69771272, 14);
            // shaderCompile.precompileShaderWithShaderDefine(193, 35652224, 14);
            // shaderCompile.precompileShaderWithShaderDefine(1, 8200, 6);
        }

        public static _initStartLife(gradientData: StartLifetimeGradient): GradientDataNumber {
            let gradient = new GradientDataNumber();
            let startLifetimesData = gradientData.startLifetimes;
            for (let i = 0, n = startLifetimesData.length; i < n; i++) {
                let valueData = startLifetimesData[i];
                gradient.add(valueData.key, valueData.value);
            }
            return gradient;
        }

        public static _initParticleVelocity(gradientData: Table<any>): GradientDataNumber {
            let gradient = new GradientDataNumber();
            let velocitysData = gradientData.velocitys;
            for (let i = 0, n = velocitysData.length; i < n; i++) {
                let valueData = velocitysData[i];
                gradient.add(valueData.key, valueData.value);
            }
            return gradient;
        }

        public static _initParticleColor(gradientColorData: ColorGradient): GradientDataColor {
            let gradientColor = new GradientDataColor();
            let alphasData = gradientColorData.alphas;
            let i = 0, n = 0;
            for (i = 0, n = alphasData.length; i < n; i++) {
                let alphaData = alphasData[i];
                gradientColor.addAlpha(alphaData.key, alphaData.value);
            }

            let rgbsData = gradientColorData.rgbs;
            for (i = 0, n = rgbsData.length; i < n; i++) {
                let rgbData = rgbsData[i];
                let rgbValue = rgbData.value;
                gradientColor.addRGB(rgbData.key, new Vector3(rgbValue[0], rgbValue[1], rgbValue[2]));
            }
            return gradientColor;
        }

        public static _initParticleSize(gradientSizeData: Table<any>): GradientDataNumber {
            let gradientSize = new GradientDataNumber();
            let sizesData = gradientSizeData.sizes;
            for (let i = 0, n = sizesData.length; i < n; i++) {
                let valueData = sizesData[i];
                gradientSize.add(valueData.key, valueData.value);
            }
            return gradientSize;
        }

        public static _initParticleRotation(gradientData: Table<any>): GradientDataNumber {
            let gradient = new GradientDataNumber();
            let angularVelocitysData = gradientData.angularVelocitys;
            for (let i = 0, n = angularVelocitysData.length; i < n; i++) {
                let valueData = angularVelocitysData[i];
                gradient.add(valueData.key, valueData.value / 180.0 * Math.PI);
            }
            return gradient;
        }

        public static _initParticleFrame(overTimeFramesData: Table<any>): GradientDataInt {
            let overTimeFrame = new GradientDataInt();
            let framesData = overTimeFramesData.frames;
            for (let i = 0, n = framesData.length; i < n; i++) {
                let frameData = framesData[i];
                overTimeFrame.add(frameData.key, frameData.value);
            }
            return overTimeFrame;
        }

        public static _getStartLifetimeFromGradient(startLifeTimeGradient: GradientDataNumber, emissionTime: number): number {
            for (let i = 1, n = startLifeTimeGradient.gradientCount; i < n; i++) {
                let key = startLifeTimeGradient.getKeyByIndex(i);
                if (key >= emissionTime) {
                    let lastKey = startLifeTimeGradient.getKeyByIndex(i - 1);
                    let age = (emissionTime - lastKey) / (key - lastKey);
                    return MathUtil.lerp(startLifeTimeGradient.getValueByIndex(i - 1), startLifeTimeGradient.getValueByIndex(i), age)
                }
            }
            throw new Error("SnowflakeParticleData: can't get value foam startLifeTimeGradient.");
        }

        public static _randomInvertRoationArray(rotatonE: Float32Array, outE: Float32Array, randomizeRotationDirection: number, rand: Rand, randomSeeds: Uint32Array): void {
            let randDic = NaN;
            if (rand) {
                rand.seed = randomSeeds[6];
                randDic = rand.getFloat();
                randomSeeds[6] = rand.seed;
            } else {
                randDic = Math.random();
            }
            if (randDic < randomizeRotationDirection) {
                outE[0] = -rotatonE[0];
                outE[1] = -rotatonE[1];
                outE[2] = -rotatonE[2];
            } else {
                outE[0] = rotatonE[0];
                outE[1] = rotatonE[1];
                outE[2] = rotatonE[2];
            }
        }

        public static _randomInvertRoation(rotaton: number, randomizeRotationDirection: number, rand: Rand, randomSeeds: Uint32Array): number {
            let randDic = NaN;
            if (rand) {
                rand.seed = randomSeeds[6];
                randDic = rand.getFloat();
                randomSeeds[6] = rand.seed;
            } else {
                randDic = Math.random();
            }
            if (randDic < randomizeRotationDirection)
                rotaton = -rotaton;
            return rotaton;
        }

        private static _getParticleRenderSharedMaterialTilingOffset(animationNode: Laya.AnimationNode, sprite3D: Laya.Sprite3D) {
            let material: any;
            if (animationNode) {
                let entity: Laya.Transform3D = animationNode.transform._entity;
                if (entity) {
                    material = (<any>entity.owner).particleRender.sharedMaterial;
                    return material.tilingOffset.elements;
                } else
                    return null;
            } else {
                material = (<any>sprite3D).particleRender.sharedMaterial;
                if (!material.tilingOffset) material.tilingOffset = new Laya.Vector4();
                return material.tilingOffset.elements;
            }
        }

        private static _setParticleRenderSharedMaterialTilingOffset(animationNode: Laya.AnimationNode, sprite3D: Laya.Sprite3D, value: Float32Array) {
            let material: any, tilingOffset: Laya.Vector4;
            if (animationNode) {
                let entity = animationNode.transform._entity;
                if (entity) {
                    material = (<any>entity.owner).particleRender.material;
                    tilingOffset = material.tilingOffset;
                    tilingOffset.elements = value;
                    material.tilingOffset = tilingOffset;
                }
            } else {
                material = (<any>sprite3D).particleRender.material;
                tilingOffset = material.tilingOffset;
                if (!tilingOffset) tilingOffset = new Laya.Vector4();
                tilingOffset.elements = value;
                material.tilingOffset = tilingOffset;
            }
        }
    }
}