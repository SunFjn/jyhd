namespace base.particle.snowflake {
    import RenderableSprite3D = Laya.RenderableSprite3D;
    import Vector3 = Laya.Vector3;
    import RenderElement = Laya.RenderElement;
    import Vector2 = Laya.Vector2;
    import TextureSheetAnimation = Laya.TextureSheetAnimation;
    import StartFrame = Laya.StartFrame;
    import FrameOverTime = Laya.FrameOverTime;
    import RotationOverLifetime = Laya.RotationOverLifetime;
    import GradientAngularVelocity = Laya.GradientAngularVelocity;
    import SizeOverLifetime = Laya.SizeOverLifetime;
    import GradientSize = Laya.GradientSize;
    import ColorOverLifetime = Laya.ColorOverLifetime;
    import Vector4 = Laya.Vector4;
    import GradientColor = Laya.GradientColor;
    import VelocityOverLifetime = Laya.VelocityOverLifetime;
    import GradientVelocity = Laya.GradientVelocity;
    import CircleShape = Laya.CircleShape;
    import Loader = Laya.Loader;
    import Texture2D = Laya.Texture2D;
    import ComponentNode = Laya.ComponentNode;
    import Burst = Laya.Burst;
    import SphereShape = Laya.SphereShape;
    import HemisphereShape = Laya.HemisphereShape;
    import ConeShape = Laya.ConeShape;
    import BoxShape = Laya.BoxShape;
    import Matrix4x4 = Laya.Matrix4x4;

    export class SnowflakeParticle3D extends RenderableSprite3D {
        /*******************************SHADERDEFINE*******************************/
        public static SHADERDEFINE_RENDERMODE_BILLBOARD = 0;
        public static SHADERDEFINE_RENDERMODE_STRETCHEDBILLBOARD = 0;
        public static SHADERDEFINE_RENDERMODE_HORIZONTALBILLBOARD = 0;
        public static SHADERDEFINE_RENDERMODE_VERTICALBILLBOARD = 0;
        public static SHADERDEFINE_COLOROVERLIFETIME = 0;
        public static SHADERDEFINE_RANDOMCOLOROVERLIFETIME = 0;
        public static SHADERDEFINE_VELOCITYOVERLIFETIMECONSTANT = 0;
        public static SHADERDEFINE_VELOCITYOVERLIFETIMECURVE = 0;
        public static SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCONSTANT = 0;
        public static SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCURVE = 0;
        public static SHADERDEFINE_TEXTURESHEETANIMATIONCURVE = 0;
        public static SHADERDEFINE_TEXTURESHEETANIMATIONRANDOMCURVE = 0;
        public static SHADERDEFINE_ROTATIONOVERLIFETIME = 0;
        public static SHADERDEFINE_ROTATIONOVERLIFETIMESEPERATE = 0;
        public static SHADERDEFINE_ROTATIONOVERLIFETIMECONSTANT = 0;
        public static SHADERDEFINE_ROTATIONOVERLIFETIMECURVE = 0;
        public static SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCONSTANTS = 0;
        public static SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCURVES = 0;
        public static SHADERDEFINE_SIZEOVERLIFETIMECURVE = 0;
        public static SHADERDEFINE_SIZEOVERLIFETIMECURVESEPERATE = 0;
        public static SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVES = 0;
        public static SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVESSEPERATE = 0;
        public static SHADERDEFINE_RENDERMODE_MESH = 0;
        public static SHADERDEFINE_SHAPE = 0;
        /*******************************SHADERDEFINE*******************************/
        public static WORLDPOSITION = 0;
        public static WORLDROTATION = 1;
        public static POSITIONSCALE = 4;
        public static SIZESCALE = 5;
        public static SCALINGMODE = 6;
        public static GRAVITY = 7;
        public static THREEDSTARTROTATION = 8;
        public static STRETCHEDBILLBOARDLENGTHSCALE = 9;
        public static STRETCHEDBILLBOARDSPEEDSCALE = 10;
        public static SIMULATIONSPACE = 11;
        public static CURRENTTIME = 12;
        public static VOLVELOCITYCONST = 13;
        public static VOLVELOCITYGRADIENTX = 14;
        public static VOLVELOCITYGRADIENTY = 15;
        public static VOLVELOCITYGRADIENTZ = 16;
        public static VOLVELOCITYCONSTMAX = 17;
        public static VOLVELOCITYGRADIENTXMAX = 18;
        public static VOLVELOCITYGRADIENTYMAX = 19;
        public static VOLVELOCITYGRADIENTZMAX = 20;
        public static VOLSPACETYPE = 21;
        public static COLOROVERLIFEGRADIENTALPHAS = 22;
        public static COLOROVERLIFEGRADIENTCOLORS = 23;
        public static MAXCOLOROVERLIFEGRADIENTALPHAS = 24;
        public static MAXCOLOROVERLIFEGRADIENTCOLORS = 25;
        public static SOLSIZEGRADIENT = 26;
        public static SOLSIZEGRADIENTX = 27;
        public static SOLSIZEGRADIENTY = 28;
        public static SOLSizeGradientZ = 29;
        public static SOLSizeGradientMax = 30;
        public static SOLSIZEGRADIENTXMAX = 31;
        public static SOLSIZEGRADIENTYMAX = 32;
        public static SOLSizeGradientZMAX = 33;
        public static ROLANGULARVELOCITYCONST = 34;
        public static ROLANGULARVELOCITYCONSTSEPRARATE = 35;
        public static ROLANGULARVELOCITYGRADIENT = 36;
        public static ROLANGULARVELOCITYGRADIENTX = 37;
        public static ROLANGULARVELOCITYGRADIENTY = 38;
        public static ROLANGULARVELOCITYGRADIENTZ = 39;
        public static ROLANGULARVELOCITYGRADIENTW = 40;
        public static ROLANGULARVELOCITYCONSTMAX = 41;
        public static ROLANGULARVELOCITYCONSTMAXSEPRARATE = 42;
        public static ROLANGULARVELOCITYGRADIENTMAX = 43;
        public static ROLANGULARVELOCITYGRADIENTXMAX = 44;
        public static ROLANGULARVELOCITYGRADIENTYMAX = 45;
        public static ROLANGULARVELOCITYGRADIENTZMAX = 46;
        public static ROLANGULARVELOCITYGRADIENTWMAX = 47;
        public static TEXTURESHEETANIMATIONCYCLES = 48;
        public static TEXTURESHEETANIMATIONSUBUVLENGTH = 49;
        public static TEXTURESHEETANIMATIONGRADIENTUVS = 50;
        public static TEXTURESHEETANIMATIONGRADIENTMAXUVS = 51;

        public static load(url: string): SnowflakeParticle3D {
            return Laya.loader.create(url, null, null, SnowflakeParticle3D);
        }

        public init(matrix: Matrix4x4, innerResouMap: any, nodeData: any): void {
            this._parseBaseCustomProps(nodeData.customProps);
            this._parseCustomProps(this, innerResouMap, nodeData.customProps, nodeData);
            this._parseCustomComponent(this, innerResouMap, /*nodeData.components*/[]);
            this.transform.localMatrix = matrix;
        }

        constructor(material?: SnowflakeParticleMaterial) {
            super();
            this._render = new SnowflakeParticleRender(this);
            this._render.on(Laya.Event.MATERIAL_CHANGED, this, this._onMaterialChanged);
            this._geometryFilter = new SnowflakeParticleSystem(this);
            this._createRenderElement(0);
            (material) && (this._render.sharedMaterial = material);
        }

        private _createRenderElement(index: number): void {
            let elements = this._render._renderElements;
            let element = elements[index] = new RenderElement();
            element._render = this._render;
            let material = this._render.sharedMaterials[index];
            (material) || (material = SnowflakeParticleMaterial.defaultMaterial);
            element._mainSortID = 0;
            element._sprite3D = this;
            element.renderObj = this.particleSystem;
            element._material = material;
        }

        private _onMaterialChanged(particleRender: SnowflakeParticleRender, index: number, material: SnowflakeParticleMaterial): void {
            let elements = particleRender._renderElements;
            if (index < elements.length) {
                let element = elements[index];
                element._material = material || SnowflakeParticleMaterial.defaultMaterial;
            }
        }

        protected _clearSelfRenderObjects(): void {
            this.scene.removeFrustumCullingObject(this._render);
        }

        protected _addSelfRenderObjects(): void {
            this.scene.addFrustumCullingObject(this._render);
        }

        protected _parseCustomProps(rootNode: ComponentNode, innerResouMap: Table<any>, customProps: SnowflakeCustomProps, nodeData: Table<any>): void {
            let anglelToRad = Math.PI / 180.0;
            let i = 0, n = 0;
            let particleRender = this.particleRender;
            let material;
            let materialData = customProps.material;
            if (materialData) {
                material = Loader.getRes(innerResouMap[materialData.path]);
            } else {
                let materialPath = customProps.materialPath;
                if (materialPath) {
                    material = Loader.getRes(innerResouMap[materialPath]);
                } else {
                    material = new SnowflakeParticleMaterial();
                    material.diffuseTexture = innerResouMap ? Loader.getRes(innerResouMap[customProps.texturePath]) : Texture2D.load(customProps.texturePath);
                }
            }
            particleRender.sharedMaterial = material;
            let meshPath = customProps.meshPath;
            (meshPath) && (particleRender.mesh = Loader.getRes(innerResouMap[meshPath]));
            particleRender.renderMode = customProps.renderMode == null ? 4 : customProps.renderMode;
            particleRender.stretchedBillboardCameraSpeedScale = customProps.stretchedBillboardCameraSpeedScale || 0;
            particleRender.stretchedBillboardSpeedScale = customProps.stretchedBillboardSpeedScale || 0;
            particleRender.stretchedBillboardLengthScale = customProps.stretchedBillboardLengthScale == null ? 2 : customProps.stretchedBillboardLengthScale;
            particleRender.sortingFudge = customProps.sortingFudge || 0.0;
            let particleSystem = this.particleSystem;
            particleSystem.isPerformanceMode = customProps.isPerformanceMode == null ? true : customProps.isPerformanceMode;
            particleSystem.duration = customProps.duration == null ? 1.0 : customProps.duration;
            particleSystem.looping = customProps.looping || false;
            particleSystem.prewarm = customProps.prewarm || false;
            particleSystem.startDelayType = customProps.startDelayType || 0;
            particleSystem.startDelay = customProps.startDelay || 0;
            particleSystem.startDelayMin = customProps.startDelayMin || 0;
            particleSystem.startDelayMax = customProps.startDelayMax || 0;
            particleSystem.startLifetimeType = customProps.startLifetimeType || 0;
            particleSystem.startLifetimeConstant = customProps.startLifetimeConstant == null ? 1 : customProps.startLifetimeConstant;
            if (customProps.startLifetimeGradient) {
                particleSystem.startLifeTimeGradient = SnowflakeParticleUtils._initStartLife(customProps.startLifetimeGradient);
            }
            particleSystem.startLifetimeConstantMin = customProps.startLifetimeConstantMin || 0;
            particleSystem.startLifetimeConstantMax = customProps.startLifetimeConstantMax == null ? 1 : customProps.startLifetimeConstantMax;
            if (customProps.startLifetimeGradientMin) {
                particleSystem.startLifeTimeGradientMin = SnowflakeParticleUtils._initStartLife(customProps.startLifetimeGradientMin);
            }
            if (customProps.startLifetimeGradientMax) {
                particleSystem.startLifeTimeGradientMax = SnowflakeParticleUtils._initStartLife(customProps.startLifetimeGradientMax);
            }
            particleSystem.startSpeedType = customProps.startSpeedType || 0;
            particleSystem.startSpeedConstant = (customProps.startSpeedConstant || 0) * 100;
            particleSystem.startSpeedConstantMin = (customProps.startSpeedConstantMin || 0) * 100;
            particleSystem.startSpeedConstantMax = (customProps.startSpeedConstantMax || 0) * 100;
            particleSystem.threeDStartSize = customProps.threeDStartSize || false;
            particleSystem.startSizeType = customProps.startSizeType || 0;
            particleSystem.startSizeConstant = customProps.startSizeConstant == null ? 12 : customProps.startSizeConstant;
            let startSizeConstantSeparateArray = customProps.startSizeConstantSeparate;
            let startSizeConstantSeparateElement = particleSystem.startSizeConstantSeparate.elements;
            if (startSizeConstantSeparateArray) {
                startSizeConstantSeparateElement[0] = startSizeConstantSeparateArray[0];
                startSizeConstantSeparateElement[1] = startSizeConstantSeparateArray[1];
                startSizeConstantSeparateElement[2] = startSizeConstantSeparateArray[2];
            } else {
                startSizeConstantSeparateElement[0] = 12;
                startSizeConstantSeparateElement[1] = 1;
                startSizeConstantSeparateElement[2] = 1;
            }
            particleSystem.startSizeConstantMin = customProps.startSizeConstantMin || 0;
            particleSystem.startSizeConstantMax = customProps.startSizeConstantMax == null ? 12 : customProps.startSizeConstantMax;
            let startSizeConstantMinSeparateArray = customProps.startSizeConstantMinSeparate;
            let startSizeConstantMinSeparateElement = particleSystem.startSizeConstantMinSeparate.elements;
            if (startSizeConstantMinSeparateArray) {
                startSizeConstantMinSeparateElement[0] = startSizeConstantMinSeparateArray[0];
                startSizeConstantMinSeparateElement[1] = startSizeConstantMinSeparateArray[1];
                startSizeConstantMinSeparateElement[2] = startSizeConstantMinSeparateArray[2];
            } else {
                startSizeConstantMinSeparateElement.fill(0)
            }
            let startSizeConstantMaxSeparateArray = customProps.startSizeConstantMaxSeparate;
            let startSizeConstantMaxSeparateElement = particleSystem.startSizeConstantMaxSeparate.elements;
            if (startSizeConstantMaxSeparateArray) {
                startSizeConstantMaxSeparateElement[0] = startSizeConstantMaxSeparateArray[0];
                startSizeConstantMaxSeparateElement[1] = startSizeConstantMaxSeparateArray[1];
                startSizeConstantMaxSeparateElement[2] = startSizeConstantMaxSeparateArray[2];
            } else {
                startSizeConstantMaxSeparateElement[0] = 12;
                startSizeConstantMaxSeparateElement[1] = 1;
                startSizeConstantMaxSeparateElement[2] = 1;
            }
            particleSystem.threeDStartRotation = customProps.threeDStartRotation || false;
            particleSystem.startRotationType = customProps.startRotationType || 0;
            particleSystem.startRotationConstant = (customProps.startRotationConstant || 0) * anglelToRad;
            let startRotationConstantSeparateArray = customProps.startRotationConstantSeparate;
            let startRotationConstantSeparateElement = particleSystem.startRotationConstantSeparate.elements;
            if (startRotationConstantSeparateArray) {
                startRotationConstantSeparateElement[0] = startRotationConstantSeparateArray[0] * anglelToRad;
                startRotationConstantSeparateElement[1] = startRotationConstantSeparateArray[1] * anglelToRad;
                startRotationConstantSeparateElement[2] = startRotationConstantSeparateArray[2] * anglelToRad;
            } else {
                startRotationConstantSeparateElement.fill(0);
            }
            particleSystem.startRotationConstantMin = (customProps.startRotationConstantMin || 0) * anglelToRad;
            particleSystem.startRotationConstantMax = (customProps.startRotationConstantMax || 0) * anglelToRad;
            let startRotationConstantMinSeparateArray = customProps.startRotationConstantMinSeparate;
            let startRotationConstantMinSeparateElement = particleSystem.startRotationConstantMinSeparate.elements;
            if (startRotationConstantMinSeparateArray) {
                startRotationConstantMinSeparateElement[0] = startRotationConstantMinSeparateArray[0] * anglelToRad;
                startRotationConstantMinSeparateElement[1] = startRotationConstantMinSeparateArray[1] * anglelToRad;
                startRotationConstantMinSeparateElement[2] = startRotationConstantMinSeparateArray[2] * anglelToRad;
            } else {
                startRotationConstantMinSeparateElement.fill(0);
            }
            let startRotationConstantMaxSeparateArray = customProps.startRotationConstantMaxSeparate;
            let startRotationConstantMaxSeparateElement = particleSystem.startRotationConstantMaxSeparate.elements;
            if (startRotationConstantMaxSeparateArray) {
                startRotationConstantMaxSeparateElement[0] = startRotationConstantMaxSeparateArray[0] * anglelToRad;
                startRotationConstantMaxSeparateElement[1] = startRotationConstantMaxSeparateArray[1] * anglelToRad;
                startRotationConstantMaxSeparateElement[2] = startRotationConstantMaxSeparateArray[2] * anglelToRad;
            } else {
                startRotationConstantMaxSeparateElement.fill(0);
            }
            particleSystem.randomizeRotationDirection = customProps.randomizeRotationDirection || 0;
            particleSystem.startColorType = customProps.startColorType || 0;
            let startColorConstantArray = customProps.startColorConstant;
            let startColorConstantElement = particleSystem.startColorConstant.elements;
            if (startColorConstantArray) {
                startColorConstantElement[0] = startColorConstantArray[0];
                startColorConstantElement[1] = startColorConstantArray[1];
                startColorConstantElement[2] = startColorConstantArray[2];
                startColorConstantElement[3] = startColorConstantArray[3];
            } else {
                startColorConstantElement.fill(1);
            }
            let startColorConstantMinArray = customProps.startColorConstantMin;
            let startColorConstantMinElement = particleSystem.startColorConstantMin.elements;
            if (startColorConstantMinArray) {
                startColorConstantMinElement[0] = startColorConstantMinArray[0];
                startColorConstantMinElement[1] = startColorConstantMinArray[1];
                startColorConstantMinElement[2] = startColorConstantMinArray[2];
                startColorConstantMinElement[3] = startColorConstantMinArray[3];
            } else {
                startColorConstantMinElement.fill(0);
            }
            let startColorConstantMaxArray = customProps.startColorConstantMax;
            let startColorConstantMaxElement = particleSystem.startColorConstantMax.elements;
            if (startColorConstantMaxArray) {
                startColorConstantMaxElement[0] = startColorConstantMaxArray[0];
                startColorConstantMaxElement[1] = startColorConstantMaxArray[1];
                startColorConstantMaxElement[2] = startColorConstantMaxArray[2];
                startColorConstantMaxElement[3] = startColorConstantMaxArray[3];
            } else {
                startColorConstantMaxElement.fill(1);
            }
            particleSystem.gravityModifier = customProps.gravityModifier || 0;
            particleSystem.simulationSpace = customProps.simulationSpace == null ? 1 : customProps.simulationSpace;
            particleSystem.scaleMode = customProps.scaleMode == null ? 1 : customProps.scaleMode;
            particleSystem.playOnAwake = customProps.playOnAwake == null ? true : customProps.playOnAwake;
            particleSystem.maxParticles = customProps.maxParticles == null ? 1 : customProps.maxParticles;
            let autoRandomSeed = customProps.autoRandomSeed;
            (autoRandomSeed != null) && (particleSystem.autoRandomSeed = autoRandomSeed);
            let randomSeed = customProps.randomSeed;
            (randomSeed != null) && (particleSystem.randomSeed[0] = randomSeed);
            let emissionData = customProps.emission;
            let emission = particleSystem.emission;
            if (emissionData) {
                emission.emissionRate = emissionData.emissionRate == null ? 0 : emissionData.emissionRate;
                let burstsData = emissionData.bursts;
                if (burstsData) {
                    for (i = 0, n = burstsData.length; i < n; i++) {
                        let brust = burstsData[i];
                        emission.addBurst(new Burst(brust.time, brust.min, brust.max));
                    }
                }
                emission.enbale = emissionData.enable == null ? true : emissionData.enable;
            } else {
                emission.enbale = false;
            }
            let shapeData = customProps.shape;
            if (shapeData) {
                let shape;
                let shapeType = shapeData.shapeType == null ? 2 : shapeData.shapeType;
                switch (shapeType) {
                    case 0:
                        let sphereShape;
                        shape = sphereShape = new SphereShape();
                        sphereShape.radius = (shapeData.sphereRadius == undefined ? 1 : shapeData.sphereRadius) * 100;
                        sphereShape.emitFromShell = shapeData.sphereEmitFromShell || false;
                        sphereShape.randomDirection = (shapeData.sphereRandomDirection || 0) != 0;
                        break;
                    case 1:
                        let hemiSphereShape;
                        shape = hemiSphereShape = new HemisphereShape();
                        hemiSphereShape.radius = (shapeData.hemiSphereRadius == undefined ? 1 : shapeData.hemiSphereRadius) * 100;
                        hemiSphereShape.emitFromShell = shapeData.hemiSphereEmitFromShell || false;
                        hemiSphereShape.randomDirection = (shapeData.hemiSphereRandomDirection || 0) != 0;
                        break;
                    case 2:
                        let coneShape;
                        shape = coneShape = new ConeShape();
                        coneShape.angle = (shapeData.coneAngle || 0) * anglelToRad;
                        coneShape.radius = (shapeData.coneRadius == undefined ? 1 : shapeData.coneRadius) * 100;
                        coneShape.length = (shapeData.coneLength == undefined ? 5 : shapeData.coneLength) * 100;
                        coneShape.emitType = shapeData.coneEmitType || 0;
                        coneShape.randomDirection = (shapeData.coneRandomDirection || 0) != 0;
                        break;
                    case 3:
                        let boxShape;
                        shape = boxShape = new BoxShape();
                        boxShape.x = (shapeData.boxX == undefined ? 1 : shapeData.boxX) * 100;
                        boxShape.y = (shapeData.boxY == undefined ? 1 : shapeData.boxY) * 100;
                        boxShape.z = (shapeData.boxZ == undefined ? 1 : shapeData.boxZ) * 100;
                        boxShape.randomDirection = (shapeData.boxRandomDirection || 0) != 0;
                        break;
                    case 7:
                    default:
                        let circleShape;
                        shape = circleShape = new CircleShape();
                        circleShape.radius = (shapeData.circleRadius == undefined ? 1 : shapeData.circleRadius) * 100;
                        circleShape.arc = (shapeData.circleArc == null ? 360 : shapeData.circleArc) * anglelToRad;
                        circleShape.emitFromEdge = shapeData.circleEmitFromEdge || false;
                        circleShape.randomDirection = (shapeData.circleRandomDirection || 0) != 0;
                        break;
                    // default :
                    //     let tempShape;
                    //     shape = tempShape = new CircleShape();
                    //     tempShape.radius = shapeData.circleRadius * 100;
                    //     tempShape.arc = shapeData.circleArc * anglelToRad;
                    //     tempShape.emitFromEdge = shapeData.circleEmitFromEdge || false;
                    //     tempShape.randomDirection = (shapeData.circleRandomDirection || 0) != 0;
                    //     break;
                }
                shape.enable = shapeData.enable == null ? true : shapeData.enable;
                particleSystem.shape = shape;
            }
            let velocityOverLifetimeData = customProps.velocityOverLifetime;
            if (velocityOverLifetimeData) {
                let velocityData = velocityOverLifetimeData.velocity;
                let velocity;
                let type = velocityData.type == null ? 3 : velocityData.type;
                switch (type) {
                    case 0:
                        let constantData = velocityData.constant;
                        velocity = GradientVelocity.createByConstant(constantData ? new Vector3(constantData[0], constantData[1], constantData[2]) : new Vector3(0, 0, 0));
                        break;
                    case 1:
                        velocity = GradientVelocity.createByGradient(SnowflakeParticleUtils._initParticleVelocity(velocityData.gradientX), SnowflakeParticleUtils._initParticleVelocity(velocityData.gradientY), SnowflakeParticleUtils._initParticleVelocity(velocityData.gradientZ));
                        break;
                    case 2:
                        let constantMinData = velocityData.constantMin;
                        let constantMaxData = velocityData.constantMax;
                        velocity = GradientVelocity.createByRandomTwoConstant(
                            constantMinData ? new Vector3(constantMinData[0], constantMinData[1], constantMinData[2]) : new Vector3(0, 0, 0),
                            constantMaxData ? new Vector3(constantMaxData[0], constantMaxData[1], constantMaxData[2]) : new Vector3(0, 0, 0)
                        );
                        break;
                    case 3:
                        velocity = GradientVelocity.createByRandomTwoGradient(SnowflakeParticleUtils._initParticleVelocity(velocityData.gradientXMin), SnowflakeParticleUtils._initParticleVelocity(velocityData.gradientXMax), SnowflakeParticleUtils._initParticleVelocity(velocityData.gradientYMin), SnowflakeParticleUtils._initParticleVelocity(velocityData.gradientYMax), SnowflakeParticleUtils._initParticleVelocity(velocityData.gradientZMin), SnowflakeParticleUtils._initParticleVelocity(velocityData.gradientZMax));
                        break;
                }
                let velocityOverLifetime = new VelocityOverLifetime(velocity);
                velocityOverLifetime.space = velocityOverLifetimeData.space || 0;
                velocityOverLifetime.enbale = velocityOverLifetimeData.enable == null ? true : velocityOverLifetimeData.enable;
                particleSystem.velocityOverLifetime = velocityOverLifetime;
            }
            let colorOverLifetimeData = customProps.colorOverLifetime;
            if (colorOverLifetimeData) {
                let colorData = colorOverLifetimeData.color;
                let color;
                let type = colorData.type == null ? 1 : colorData.type;
                switch (type) {
                    case 0:
                        let constColorData = colorData.constant;
                        color = GradientColor.createByConstant(
                            constColorData ? new Vector4(constColorData[0], constColorData[1], constColorData[2], constColorData[3]) : new Vector4(0, 0, 0, 0)
                        );
                        break;
                    case 1:
                        color = GradientColor.createByGradient(SnowflakeParticleUtils._initParticleColor(colorData.gradient));
                        break;
                    case 2:
                        let minConstColorData = colorData.constantMin;
                        let maxConstColorData = colorData.constantMax;
                        color = GradientColor.createByRandomTwoConstant(
                            minConstColorData ? new Vector4(minConstColorData[0], minConstColorData[1], minConstColorData[2], minConstColorData[3]) : new Vector4(0, 0, 0, 0),
                            maxConstColorData ? new Vector4(maxConstColorData[0], maxConstColorData[1], maxConstColorData[2], maxConstColorData[3]) : new Vector4(0, 0, 0, 0)
                        );
                        break;
                    case 3:
                        color = GradientColor.createByRandomTwoGradient(SnowflakeParticleUtils._initParticleColor(colorData.gradientMin), SnowflakeParticleUtils._initParticleColor(colorData.gradientMax));
                        break;
                }
                let colorOverLifetime = new ColorOverLifetime(color);
                colorOverLifetime.enbale = colorOverLifetimeData.enable == null ? true : colorOverLifetimeData.enable;
                particleSystem.colorOverLifetime = colorOverLifetime;
            }
            let sizeOverLifetimeData = customProps.sizeOverLifetime;
            if (sizeOverLifetimeData) {
                let sizeData = sizeOverLifetimeData.size;
                let size;
                let type = sizeData.type || 0;
                let separateAxes = sizeData.separateAxes || false;
                switch (type) {
                    case 0:
                        if (separateAxes) {
                            size = GradientSize.createByGradientSeparate(SnowflakeParticleUtils._initParticleSize(sizeData.gradientX), SnowflakeParticleUtils._initParticleSize(sizeData.gradientY), SnowflakeParticleUtils._initParticleSize(sizeData.gradientZ));
                        } else {
                            size = GradientSize.createByGradient(SnowflakeParticleUtils._initParticleSize(sizeData.gradient));
                        }
                        break;
                    case 1:
                        if (separateAxes) {
                            let constantMinSeparateData = sizeData.constantMinSeparate;
                            let constantMaxSeparateData = sizeData.constantMaxSeparate;
                            size = GradientSize.createByRandomTwoConstantSeparate(
                                constantMinSeparateData ? new Vector3(constantMinSeparateData[0], constantMinSeparateData[1], constantMinSeparateData[2]) : new Vector3(0, 0, 0),
                                constantMaxSeparateData ? new Vector3(constantMaxSeparateData[0], constantMaxSeparateData[1], constantMaxSeparateData[2]) : new Vector3(0, 0, 0)
                            );
                        } else {
                            size = GradientSize.createByRandomTwoConstant(sizeData.constantMin || 0, sizeData.constantMax || 0);
                        }
                        break;
                    case 2:
                        if (separateAxes) {
                            size = GradientSize.createByRandomTwoGradientSeparate(SnowflakeParticleUtils._initParticleSize(sizeData.gradientXMin), SnowflakeParticleUtils._initParticleSize(sizeData.gradientYMin), SnowflakeParticleUtils._initParticleSize(sizeData.gradientZMin), SnowflakeParticleUtils._initParticleSize(sizeData.gradientXMax), SnowflakeParticleUtils._initParticleSize(sizeData.gradientYMax), SnowflakeParticleUtils._initParticleSize(sizeData.gradientZMax));
                        } else {
                            size = GradientSize.createByRandomTwoGradient(SnowflakeParticleUtils._initParticleSize(sizeData.gradientMin), SnowflakeParticleUtils._initParticleSize(sizeData.gradientMax));
                        }
                        break;
                }
                let sizeOverLifetime = new SizeOverLifetime(size);
                sizeOverLifetime.enbale = sizeOverLifetimeData.enable == null ? true : sizeOverLifetimeData.enable;
                particleSystem.sizeOverLifetime = sizeOverLifetime;
            }
            let rotationOverLifetimeData = customProps.rotationOverLifetime;
            if (rotationOverLifetimeData) {
                let angularVelocityData = rotationOverLifetimeData.angularVelocity;
                let angularVelocity;
                let type = angularVelocityData.type || 0;
                let separateAxes = angularVelocityData.separateAxes || false;
                switch (type) {
                    case 0:
                        if (separateAxes) {
                        } else {
                            angularVelocity = GradientAngularVelocity.createByConstant((angularVelocityData.constant == null ? 360 : angularVelocityData.constant) * anglelToRad);
                        }
                        break;
                    case 1:
                        if (separateAxes) {
                        } else {
                            angularVelocity = GradientAngularVelocity.createByGradient(SnowflakeParticleUtils._initParticleRotation(angularVelocityData.gradient));
                        }
                        break;
                    case 2:
                        if (separateAxes) {
                            let minSep = angularVelocityData.constantMinSeparate;
                            let maxSep = angularVelocityData.constantMaxSeparate;
                            angularVelocity = GradientAngularVelocity.createByRandomTwoConstantSeparate(
                                minSep ? new Vector3(minSep[0] * anglelToRad, minSep[1] * anglelToRad, minSep[2] * anglelToRad) : new Vector3(0, 0, 0),
                                maxSep ? new Vector3(maxSep[0] * anglelToRad, maxSep[1] * anglelToRad, maxSep[2] * anglelToRad) : new Vector3(0, 0, 360 * anglelToRad)
                            );
                        } else {
                            angularVelocity = GradientAngularVelocity.createByRandomTwoConstant(
                                (angularVelocityData.constantMin || 0) * anglelToRad,
                                (angularVelocityData.constantMax == null ? 360 : angularVelocityData.constantMax) * anglelToRad
                            );
                        }
                        break;
                    case 3:
                        if (separateAxes) {
                        } else {
                            angularVelocity = GradientAngularVelocity.createByRandomTwoGradient(SnowflakeParticleUtils._initParticleRotation(angularVelocityData.gradientMin), SnowflakeParticleUtils._initParticleRotation(angularVelocityData.gradientMax));
                        }
                        break;
                }
                let rotationOverLifetime = new RotationOverLifetime(angularVelocity);
                rotationOverLifetime.enbale = rotationOverLifetimeData.enable == null ? true : rotationOverLifetimeData.enable;
                particleSystem.rotationOverLifetime = rotationOverLifetime;
            }
            let textureSheetAnimationData = customProps.textureSheetAnimation;
            if (textureSheetAnimationData) {
                let frameData = textureSheetAnimationData.frame;
                let frameOverTime;
                switch (frameData.type) {
                    case 0:
                        frameOverTime = FrameOverTime.createByConstant(frameData.constant);
                        break;
                    case 1:
                        frameOverTime = FrameOverTime.createByOverTime(SnowflakeParticleUtils._initParticleFrame(frameData.overTime));
                        break;
                    case 2:
                        frameOverTime = FrameOverTime.createByRandomTwoConstant(frameData.constantMin, frameData.constantMax);
                        break;
                    case 3:
                        frameOverTime = FrameOverTime.createByRandomTwoOverTime(SnowflakeParticleUtils._initParticleFrame(frameData.overTimeMin), SnowflakeParticleUtils._initParticleFrame(frameData.overTimeMax));
                        break;
                }
                let startFrameData = textureSheetAnimationData.startFrame;
                let startFrame;
                switch (startFrameData.type) {
                    case 0:
                        startFrame = StartFrame.createByConstant(startFrameData.constant);
                        break;
                    case 1:
                        startFrame = StartFrame.createByRandomTwoConstant(startFrameData.constantMin, startFrameData.constantMax);
                        break;
                }
                let textureSheetAnimation = new TextureSheetAnimation(frameOverTime, startFrame);
                textureSheetAnimation.enable = textureSheetAnimationData.enable == null ? true : textureSheetAnimationData.enable;
                let tilesData = textureSheetAnimationData.tiles;
                textureSheetAnimation.tiles = tilesData ? new Vector2(tilesData[0], tilesData[1]) : new Vector2(4, 2);
                textureSheetAnimation.type = textureSheetAnimationData.type || 0;
                textureSheetAnimation.randomRow = textureSheetAnimationData.randomRow == null ? true : textureSheetAnimationData.randomRow;
                let rowIndex = textureSheetAnimationData.rowIndex;
                (rowIndex !== null) && (textureSheetAnimation.rowIndex = rowIndex);
                textureSheetAnimation.cycles = textureSheetAnimationData.cycles == null ? 1 : textureSheetAnimationData.cycles;
                particleSystem.textureSheetAnimation = textureSheetAnimation;
            }
        }

        public _activeHierarchy(): void {
            super._activeHierarchy();
            (this.particleSystem.playOnAwake) && (this.particleSystem.play());
        }

        public _inActiveHierarchy(): void {
            super._inActiveHierarchy();
            (this.particleSystem.isAlive) && (this.particleSystem.simulate(0, true));
        }

        public cloneTo(destObject: SnowflakeParticle3D): void {
            let destSnowflakeParticle3D = destObject;
            let destParticleSystem = destSnowflakeParticle3D.particleSystem;
            this.particleSystem.cloneTo(destParticleSystem);
            let destParticleRender = destSnowflakeParticle3D.particleRender;
            let particleRender = this.particleRender;
            destParticleRender.sharedMaterials = particleRender.sharedMaterials;
            destParticleRender.enable = particleRender.enable;
            destParticleRender.renderMode = particleRender.renderMode;
            destParticleRender.mesh = particleRender.mesh;
            destParticleRender.stretchedBillboardCameraSpeedScale = particleRender.stretchedBillboardCameraSpeedScale;
            destParticleRender.stretchedBillboardSpeedScale = particleRender.stretchedBillboardSpeedScale;
            destParticleRender.stretchedBillboardLengthScale = particleRender.stretchedBillboardLengthScale;
            destParticleRender.sortingFudge = particleRender.sortingFudge;
            super.cloneTo(destObject);
        }

        /**
         *<p>销毁此对象。</p>
         *@param destroyChild 是否同时销毁子节点，若值为true,则销毁子节点，否则不销毁子节点。
         */
        public destroy(destroyChild: boolean = true) {
            (destroyChild === void 0) && (destroyChild = true);
            if (this.destroyed)
                return;
            super.destroy(destroyChild);
            (this._geometryFilter)._destroy();
            this._geometryFilter = null;
        }

        /**
         *获取粒子系统。
         *@return 粒子系统。
         */
        public get particleSystem(): SnowflakeParticleSystem {
            return <SnowflakeParticleSystem>this._geometryFilter;
        }

        /**
         *获取粒子渲染器。
         *@return 粒子渲染器。
         */
        public get particleRender(): SnowflakeParticleRender {
            return <SnowflakeParticleRender>this._render;
        }
    }
}