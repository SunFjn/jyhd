namespace base.particle.snowflake {
    import VertexBuffer3D = Laya.VertexBuffer3D;
    import IndexBuffer3D = Laya.IndexBuffer3D;
    import Emission = Laya.Emission;
    import BaseShape = Laya.BaseShape;
    import VelocityOverLifetime = Laya.VelocityOverLifetime;
    import ColorOverLifetime = Laya.ColorOverLifetime;
    import SizeOverLifetime = Laya.SizeOverLifetime;
    import RotationOverLifetime = Laya.RotationOverLifetime;
    import TextureSheetAnimation = Laya.TextureSheetAnimation;
    import GradientDataNumber = Laya.GradientDataNumber;
    import Rand = Laya.Rand;
    import Vector3 = Laya.Vector3;
    import Vector4 = Laya.Vector4;
    import Vector2 = Laya.Vector2;
    import Stat = Laya.Stat;
    import MathUtil = Laya.MathUtil;
    import VertexShurikenParticleMesh = Laya.VertexShurikenParticleMesh;
    import VertexShurikenParticleBillboard = Laya.VertexShurikenParticleBillboard;
    import RenderState = Laya.RenderState;
    import WebGL = Laya.WebGL;

    export class SnowflakeParticleSystem extends Laya.GeometryFilter implements Laya.IRenderable, Laya.IClone {
        private static halfKSqrtOf2 = 1.42 * 0.5;
        private static _RANDOMOFFSET = new Uint32Array([0x23571a3e, 0xc34f56fe, 0x13371337, 0x12460f3b, 0x6aed452e, 0xdec4aea1, 0x96aa4de3, 0x8d2c8431, 0xf3857f6f, 0xe0fbd834, 0x13740583, 0x591bc05c, 0x40eb95e4, 0xbc524e5f, 0xaf502044, 0xa614b381, 0x1034e524, 0xfc524e5f]);
        private static _maxElapsedTime = 1.0 / 3.0;
        private static _tempVector30 = new Vector3();
        private static _tempVector31 = new Vector3();
        private static _tempVector32 = new Vector3();
        private static _tempVector33 = new Vector3();
        private static _tempVector34 = new Vector3();
        private static _tempVector35 = new Vector3();
        private static _tempVector36 = new Vector3();
        private static _tempVector37 = new Vector3();
        private static _tempVector38 = new Vector3();
        private static _tempVector39 = new Vector3();
        private static _tempPosition = new Vector3();
        private static _tempDirection = new Vector3();

        private _boundingSphere: Laya.BoundSphere;
        private _boundingBox: Laya.BoundBox;
        private _boundingBoxCorners: Array<Vector3>;
        private _owner: SnowflakeParticle3D;
        private _ownerRender: SnowflakeParticleRender;
        private _vertices: Float32Array;
        private _floatCountPerVertex: number;
        private _startLifeTimeIndex: number;
        private _timeIndex: number;
        private _simulateUpdate: boolean;
        private _firstActiveElement: number;
        private _firstNewElement: number;
        private _firstFreeElement: number;
        private _firstRetiredElement: number;
        private _drawCounter: number;
        private _vertexBuffer: VertexBuffer3D;
        private _indexBuffer: IndexBuffer3D;
        private _bufferMaxParticles: number;
        private _emission: Emission;
        private _shape: BaseShape;
        private _isEmitting: boolean;
        private _isPlaying: boolean;
        private _isPaused: boolean;
        private _playStartDelay: number;
        /**@private 发射的累计时间。*/
        private _frameRateTime: number;
        /**@private 一次循环内的累计时间。*/
        private _emissionTime: number;
        private _totalDelayTime: number;
        private _burstsIndex: number;
        private _velocityOverLifetime: VelocityOverLifetime;
        private _colorOverLifetime: ColorOverLifetime;
        private _sizeOverLifetime: SizeOverLifetime;
        private _rotationOverLifetime: RotationOverLifetime;
        private _textureSheetAnimation: TextureSheetAnimation;
        private _startLifetimeType: number;
        private _startLifetimeConstant: number;
        private _startLifeTimeGradient: GradientDataNumber;
        private _startLifetimeConstantMin: number;
        private _startLifetimeConstantMax: number;
        private _startLifeTimeGradientMin: GradientDataNumber;
        private _startLifeTimeGradientMax: GradientDataNumber;
        private _maxStartLifetime: number;
        private _vertexStride: number;
        private _indexStride: number;
        private _currentTime: number;
        private _startUpdateLoopCount: number;
        public _rand: Rand;
        public _randomSeeds: Uint32Array;
        /**粒子运行的总时长，单位为秒。*/
        public duration: number;
        /**是否循环。*/
        public looping: boolean;
        /**是否预热。暂不支持*/
        public prewarm: boolean;
        /**开始延迟类型，0为常量模式,1为随机随机双常量模式，不能和prewarm一起使用。*/
        public startDelayType: number;
        /**开始播放延迟，不能和prewarm一起使用。*/
        public startDelay: number;
        /**开始播放最小延迟，不能和prewarm一起使用。*/
        public startDelayMin: number;
        /**开始播放最大延迟，不能和prewarm一起使用。*/
        public startDelayMax: number;
        /**开始速度模式，0为恒定速度，2为两个恒定速度的随机插值。缺少1、3模式*/
        public startSpeedType: number;
        /**开始速度,0模式。*/
        public startSpeedConstant: number;
        /**最小开始速度,1模式。*/
        public startSpeedConstantMin: number;
        /**最大开始速度,1模式。*/
        public startSpeedConstantMax: number;
        /**开始尺寸是否为3D模式。*/
        public threeDStartSize: boolean;
        /**开始尺寸模式,0为恒定尺寸，2为两个恒定尺寸的随机插值。缺少1、3模式和对应的二种3D模式*/
        public startSizeType: number;
        /**开始尺寸，0模式。*/
        public startSizeConstant: number;
        /**开始三维尺寸，0模式。*/
        public startSizeConstantSeparate: Vector3;
        /**最小开始尺寸，2模式。*/
        public startSizeConstantMin: number;
        /**最大开始尺寸，2模式。*/
        public startSizeConstantMax: number;
        /**最小三维开始尺寸，2模式。*/
        public startSizeConstantMinSeparate: Vector3;
        /**最大三维开始尺寸，2模式。*/
        public startSizeConstantMaxSeparate: Vector3;
        /**3D开始旋转，暂不支持*/
        public threeDStartRotation: boolean;
        /**开始旋转模式,0为恒定尺寸，2为两个恒定旋转的随机插值,缺少2种模式,和对应的四种3D模式。*/
        public startRotationType: number;
        /**开始旋转，0模式。*/
        public startRotationConstant: number;
        /**开始三维旋转，0模式。*/
        public startRotationConstantSeparate: Vector3;
        /**最小开始旋转，1模式。*/
        public startRotationConstantMin: number;
        /**最大开始旋转，1模式。*/
        public startRotationConstantMax: number;
        /**最小开始三维旋转，1模式。*/
        public startRotationConstantMinSeparate: Vector3;
        /**最大开始三维旋转，1模式。*/
        public startRotationConstantMaxSeparate: Vector3;
        /**随机旋转方向，范围为0.0到1.0*/
        public randomizeRotationDirection: number;
        /**开始颜色模式，0为恒定颜色，2为两个恒定颜色的随机插值,缺少2种模式。*/
        public startColorType: number;
        /**开始颜色，0模式。*/
        public startColorConstant: Vector4;
        /**最小开始颜色，1模式。*/
        public startColorConstantMin: Vector4;
        /**最大开始颜色，1模式。*/
        public startColorConstantMax: Vector4;
        /**重力敏感度。*/
        public gravityModifier: number;
        /**模拟器空间,0为World,1为Local。暂不支持Custom。*/
        public simulationSpace: number;
        /**缩放模式，0为Hiercachy,1为Local,2为World。暂不支持1,2*/
        public scaleMode: number;
        /**激活时是否自动播放。*/
        public playOnAwake: boolean;
        /**随机种子,注:play()前设置有效。*/
        public randomSeed: Uint32Array;
        /**是否使用随机种子。 */
        public autoRandomSeed: boolean;
        /**是否为性能模式,性能模式下会延迟粒子释放。*/
        public isPerformanceMode: boolean;

        private _uvLength: Vector2;

        constructor(owner: SnowflakeParticle3D) {
            super();

            this._drawCounter = NaN;

            this._uvLength = new Vector2();
            this._firstActiveElement = 0;
            this._firstNewElement = 0;
            this._firstFreeElement = 0;
            this._firstRetiredElement = 0;
            this._owner = owner;
            this._ownerRender = owner.particleRender;
            this._boundingBoxCorners = new Array<Laya.Vector3>(8);
            this._boundingSphere = new Laya.BoundSphere(new Vector3(), Number.MAX_VALUE);
            this._boundingBox = new Laya.BoundBox(new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE), new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE));
            this._currentTime = 0;
            this._isEmitting = false;
            this._isPlaying = false;
            this._isPaused = false;
            this._burstsIndex = 0;
            this._frameRateTime = 0;
            this._emissionTime = 0;
            this._totalDelayTime = 0;
            this._simulateUpdate = false;
            this._bufferMaxParticles = 1;
            this.duration = 5.0;
            this.looping = true;
            this.prewarm = false;
            this.startDelayType = 0;
            this.startDelay = 0.0;
            this.startDelayMin = 0.0;
            this.startDelayMax = 0.0;
            this._startLifetimeType = 0;
            this._startLifetimeConstant = 5.0;
            this._startLifeTimeGradient = new GradientDataNumber();
            this._startLifetimeConstantMin = 0.0;
            this._startLifetimeConstantMax = 5.0;
            this._startLifeTimeGradientMin = new GradientDataNumber();
            this._startLifeTimeGradientMax = new GradientDataNumber();
            this._maxStartLifetime = 5.0;
            this.startSpeedType = 0;
            this.startSpeedConstant = 5.0;
            this.startSpeedConstantMin = 0.0;
            this.startSpeedConstantMax = 5.0;
            this.threeDStartSize = false;
            this.startSizeType = 0;
            this.startSizeConstant = 1;
            this.startSizeConstantSeparate = new Vector3(1, 1, 1);
            this.startSizeConstantMin = 0;
            this.startSizeConstantMax = 1;
            this.startSizeConstantMinSeparate = new Vector3(0, 0, 0);
            this.startSizeConstantMaxSeparate = new Vector3(1, 1, 1);
            this.threeDStartRotation = false;
            this.startRotationType = 0;
            this.startRotationConstant = 0;
            this.startRotationConstantSeparate = new Vector3(0, 0, 0);
            this.startRotationConstantMin = 0.0;
            this.startRotationConstantMax = 0.0;
            this.startRotationConstantMinSeparate = new Vector3(0, 0, 0);
            this.startRotationConstantMaxSeparate = new Vector3(0, 0, 0);
            this.randomizeRotationDirection = 0.0;
            this.startColorType = 0;
            this.startColorConstant = new Vector4(1, 1, 1, 1);
            this.startColorConstantMin = new Vector4(1, 1, 1, 1);
            this.startColorConstantMax = new Vector4(1, 1, 1, 1);
            this.gravityModifier = 0.0;
            this.simulationSpace = 1;
            this.scaleMode = 0;
            this.playOnAwake = true;
            this._rand = new Rand(0);
            this.autoRandomSeed = true;
            this.randomSeed = new Uint32Array(1);
            this._randomSeeds = new Uint32Array(SnowflakeParticleSystem._RANDOMOFFSET.length);
            this.isPerformanceMode = true;
            this._emission = new Emission();
            this._emission.enbale = true;
            this._owner.on(/*laya.events.Event.ACTIVE_IN_HIERARCHY_CHANGED*/"activeinhierarchychanged", this, this._onOwnerActiveHierarchyChanged);
        }

        public _getVertexBuffer(index: number = 0): VertexBuffer3D {
            return index === 0 ? this._vertexBuffer : null;
        }

        public _getIndexBuffer(): IndexBuffer3D {
            return this._indexBuffer;
        }

        private _generateBoundingSphere(): void {
            let centerE = this._boundingSphere.center.elements;
            centerE[0] = 0;
            centerE[1] = 0;
            centerE[2] = 0;
            this._boundingSphere.radius = Number.MAX_VALUE;
        }

        private _generateBoundingBox(): void {
            let particle = this._owner;
            let particleRender = particle.particleRender;
            let boundMin = this._boundingBox.min;
            let boundMax = this._boundingBox.max;
            let i = 0, n = 0;
            let maxStartLifeTime = NaN;
            switch (this.startLifetimeType) {
                case 0:
                    maxStartLifeTime = this.startLifetimeConstant;
                    break;
                case 1:
                    maxStartLifeTime = -Number.MAX_VALUE;
                    let startLifeTimeGradient = this.startLifeTimeGradient;
                    for (i = 0, n = startLifeTimeGradient.gradientCount; i < n; i++)
                        maxStartLifeTime = Math.max(maxStartLifeTime, startLifeTimeGradient.getValueByIndex(i));
                    break;
                case 2:
                    maxStartLifeTime = Math.max(this.startLifetimeConstantMin, this.startLifetimeConstantMax);
                    break;
                case 3:
                    maxStartLifeTime = -Number.MAX_VALUE;
                    let startLifeTimeGradientMin = this.startLifeTimeGradientMin;
                    for (i = 0, n = startLifeTimeGradientMin.gradientCount; i < n; i++)
                        maxStartLifeTime = Math.max(maxStartLifeTime, startLifeTimeGradientMin.getValueByIndex(i));
                    let startLifeTimeGradientMax = this.startLifeTimeGradientMax;
                    for (i = 0, n = startLifeTimeGradientMax.gradientCount; i < n; i++)
                        maxStartLifeTime = Math.max(maxStartLifeTime, startLifeTimeGradientMax.getValueByIndex(i));
                    break;
            }
            let minStartSpeed = NaN, maxStartSpeed = NaN;
            switch (this.startSpeedType) {
                case 0:
                    minStartSpeed = maxStartSpeed = this.startSpeedConstant;
                    break;
                case 1:
                    break;
                case 2:
                    minStartSpeed = this.startLifetimeConstantMin;
                    maxStartSpeed = this.startLifetimeConstantMax;
                    break;
                case 3:
                    break;
            }
            let minPosition, maxPosition, minDirection, maxDirection;
            if (this._shape && this._shape.enable) {
            } else {
                minPosition = maxPosition = Vector3.ZERO;
                minDirection = Vector3.ZERO;
                maxDirection = Vector3.UnitZ;
            }
            let startMinVelocity = new Vector3(minDirection.x * minStartSpeed, minDirection.y * minStartSpeed, minDirection.z * minStartSpeed);
            let startMaxVelocity = new Vector3(maxDirection.x * maxStartSpeed, maxDirection.y * maxStartSpeed, maxDirection.z * maxStartSpeed);
            if (this._velocityOverLifetime && this._velocityOverLifetime.enbale) {
                let lifeMinVelocity;
                let lifeMaxVelocity;
                let velocity = this._velocityOverLifetime.velocity;
                switch (velocity.type) {
                    case 0:
                        lifeMinVelocity = lifeMaxVelocity = velocity.constant;
                        break;
                    case 1:
                        lifeMinVelocity = lifeMaxVelocity = new Vector3(velocity.gradientX.getAverageValue(), velocity.gradientY.getAverageValue(), velocity.gradientZ.getAverageValue());
                        break;
                    case 2:
                        lifeMinVelocity = velocity.constantMin;
                        lifeMaxVelocity = velocity.constantMax;
                        break;
                    case 3:
                        lifeMinVelocity = new Vector3(velocity.gradientXMin.getAverageValue(), velocity.gradientYMin.getAverageValue(), velocity.gradientZMin.getAverageValue());
                        lifeMaxVelocity = new Vector3(velocity.gradientXMax.getAverageValue(), velocity.gradientYMax.getAverageValue(), velocity.gradientZMax.getAverageValue());
                        break;
                }
            }
            let positionScale, velocityScale;
            let transform = this._owner.transform;
            let worldPosition = transform.position;
            let sizeScale = SnowflakeParticleSystem._tempVector39;
            let sizeScaleE = sizeScale.elements;
            let renderMode = particleRender.renderMode;
            switch (this.scaleMode) {
                case 0:
                    let scale = transform.scale;
                    positionScale = scale;
                    sizeScaleE[0] = scale.x;
                    sizeScaleE[1] = scale.z;
                    sizeScaleE[2] = scale.y;
                    (renderMode === 1) && (velocityScale = scale);
                    break;
                case 1:
                    let localScale = transform.localScale;
                    positionScale = localScale;
                    sizeScaleE[0] = localScale.x;
                    sizeScaleE[1] = localScale.z;
                    sizeScaleE[2] = localScale.y;
                    (renderMode === 1) && (velocityScale = localScale);
                    break;
                case 2:
                    positionScale = transform.scale;
                    sizeScaleE[0] = sizeScaleE[1] = sizeScaleE[2] = 1;
                    (renderMode === 1) && (velocityScale = Vector3.ONE);
                    break;
            }
            let minStratPosition, maxStratPosition;
            if (this._velocityOverLifetime && this._velocityOverLifetime.enbale) {
            } else {
                minStratPosition = new Vector3(startMinVelocity.x * maxStartLifeTime, startMinVelocity.y * maxStartLifeTime, startMinVelocity.z * maxStartLifeTime);
                maxStratPosition = new Vector3(startMaxVelocity.x * maxStartLifeTime, startMaxVelocity.y * maxStartLifeTime, startMaxVelocity.z * maxStartLifeTime);
                if (this.scaleMode != 2) {
                    Vector3.add(minPosition, minStratPosition, boundMin);
                    Vector3.multiply(positionScale, boundMin, boundMin);
                    Vector3.add(maxPosition, maxStratPosition, boundMax);
                    Vector3.multiply(positionScale, boundMax, boundMax);
                } else {
                    Vector3.multiply(positionScale, minPosition, boundMin);
                    Vector3.add(boundMin, minStratPosition, boundMin);
                    Vector3.multiply(positionScale, maxPosition, boundMax);
                    Vector3.add(boundMax, maxStratPosition, boundMax);
                }
            }
            switch (this.simulationSpace) {
                case 0:
                    break;
                case 1:
                    Vector3.add(boundMin, worldPosition, boundMin);
                    Vector3.add(boundMax, worldPosition, boundMax);
                    break;
            }
            let maxSize = NaN, maxSizeY = NaN;
            switch (this.startSizeType) {
                case 0:
                    if (this.threeDStartSize) {
                        let startSizeConstantSeparate = this.startSizeConstantSeparate;
                        maxSize = Math.max(startSizeConstantSeparate.x, startSizeConstantSeparate.y);
                        if (renderMode === 1)
                            maxSizeY = startSizeConstantSeparate.y;
                    } else {
                        maxSize = this.startSizeConstant;
                        if (renderMode === 1)
                            maxSizeY = this.startSizeConstant;
                    }
                    break;
                case 1:
                    break;
                case 2:
                    if (this.threeDStartSize) {
                        let startSizeConstantMaxSeparate = this.startSizeConstantMaxSeparate;
                        maxSize = Math.max(startSizeConstantMaxSeparate.x, startSizeConstantMaxSeparate.y);
                        if (renderMode === 1)
                            maxSizeY = startSizeConstantMaxSeparate.y;
                    } else {
                        maxSize = this.startSizeConstantMax;
                        if (renderMode === 1)
                            maxSizeY = this.startSizeConstantMax;
                    }
                    break;
                case 3:
                    break;
            }
            if (this._sizeOverLifetime && this._sizeOverLifetime.enbale) {
                maxSize *= this._sizeOverLifetime.size.getMaxSizeInGradient();
            }
            let threeDMaxSize = SnowflakeParticleSystem._tempVector30;
            let threeDMaxSizeE = threeDMaxSize.elements;
            let rotSize = NaN, nonRotSize = NaN;
            switch (renderMode) {
                case 0:
                    rotSize = maxSize * SnowflakeParticleSystem.halfKSqrtOf2;
                    Vector3.scale(sizeScale, maxSize, threeDMaxSize);
                    Vector3.subtract(boundMin, threeDMaxSize, boundMin);
                    Vector3.add(boundMax, threeDMaxSize, boundMax);
                    break;
                case 1:
                    let maxStretchPosition = SnowflakeParticleSystem._tempVector31;
                    let maxStretchVelocity = SnowflakeParticleSystem._tempVector32;
                    let minStretchVelocity = SnowflakeParticleSystem._tempVector33;
                    let minStretchPosition = SnowflakeParticleSystem._tempVector34;
                    if (this._velocityOverLifetime && this._velocityOverLifetime.enbale) {
                    } else {
                        Vector3.multiply(velocityScale, startMaxVelocity, maxStretchVelocity);
                        Vector3.multiply(velocityScale, startMinVelocity, minStretchVelocity);
                    }
                    let sizeStretch = maxSizeY * particleRender.stretchedBillboardLengthScale;
                    let maxStretchLength = Vector3.scalarLength(maxStretchVelocity) * particleRender.stretchedBillboardSpeedScale + sizeStretch;
                    let minStretchLength = Vector3.scalarLength(minStretchVelocity) * particleRender.stretchedBillboardSpeedScale + sizeStretch;
                    let norMaxStretchVelocity = SnowflakeParticleSystem._tempVector35;
                    let norMinStretchVelocity = SnowflakeParticleSystem._tempVector36;
                    Vector3.normalize(maxStretchVelocity, norMaxStretchVelocity);
                    Vector3.scale(norMaxStretchVelocity, maxStretchLength, minStretchPosition);
                    Vector3.subtract(maxStratPosition, minStretchPosition, minStretchPosition);
                    Vector3.normalize(minStretchVelocity, norMinStretchVelocity);
                    Vector3.scale(norMinStretchVelocity, minStretchLength, maxStretchPosition);
                    Vector3.add(minStratPosition, maxStretchPosition, maxStretchPosition);
                    rotSize = maxSize * SnowflakeParticleSystem.halfKSqrtOf2;
                    Vector3.scale(sizeScale, rotSize, threeDMaxSize);
                    let halfNorMaxStretchVelocity = SnowflakeParticleSystem._tempVector37;
                    let halfNorMinStretchVelocity = SnowflakeParticleSystem._tempVector38;
                    Vector3.scale(norMaxStretchVelocity, 0.5, halfNorMaxStretchVelocity);
                    Vector3.scale(norMinStretchVelocity, 0.5, halfNorMinStretchVelocity);
                    Vector3.multiply(halfNorMaxStretchVelocity, sizeScale, halfNorMaxStretchVelocity);
                    Vector3.multiply(halfNorMinStretchVelocity, sizeScale, halfNorMinStretchVelocity);
                    Vector3.add(boundMin, halfNorMinStretchVelocity, boundMin);
                    Vector3.min(boundMin, minStretchPosition, boundMin);
                    Vector3.subtract(boundMin, threeDMaxSize, boundMin);
                    Vector3.subtract(boundMax, halfNorMaxStretchVelocity, boundMax);
                    Vector3.max(boundMax, maxStretchPosition, boundMax);
                    Vector3.add(boundMax, threeDMaxSize, boundMax);
                    break;
                case 2:
                    maxSize *= Math.cos(0.78539816339744830961566084581988);
                    nonRotSize = maxSize * 0.5;
                    threeDMaxSizeE[0] = sizeScale.x * nonRotSize;
                    threeDMaxSizeE[1] = sizeScale.z * nonRotSize;
                    Vector3.subtract(boundMin, threeDMaxSize, boundMin);
                    Vector3.add(boundMax, threeDMaxSize, boundMax);
                    break;
                case 3:
                    maxSize *= Math.cos(0.78539816339744830961566084581988);
                    nonRotSize = maxSize * 0.5;
                    Vector3.scale(sizeScale, nonRotSize, threeDMaxSize);
                    Vector3.subtract(boundMin, threeDMaxSize, boundMin);
                    Vector3.add(boundMax, threeDMaxSize, boundMax);
                    break;
            }
            this._boundingBox.getCorners(this._boundingBoxCorners);
        }

        private _updateEmission(): void {
            if (!Laya.stage.isVisibility || !this.isAlive)
                return;
            if (this._simulateUpdate) {
                this._simulateUpdate = false;
            } else {
                let elapsedTime = (this._startUpdateLoopCount !== Stat.loopCount && !this._isPaused) ? Laya.timer.delta / 1000.0 : 0;
                elapsedTime = Math.min(SnowflakeParticleSystem._maxElapsedTime, elapsedTime);
                this._updateParticles(elapsedTime);
            }
        }

        private _updateParticles(elapsedTime: number): void {
            if (this._ownerRender.renderMode === MeshType.MESH && !this._ownerRender.mesh)
                return;
            this._currentTime += elapsedTime;
            this._retireActiveParticles();
            this._freeRetiredParticles();
            this._totalDelayTime += elapsedTime;
            if (this._totalDelayTime < this._playStartDelay) {
                return;
            }
            if (this._emission.enbale && this._isEmitting && !this._isPaused)
                this._advanceTime(elapsedTime, this._currentTime);
        }

        private _updateParticlesSimulationRestart(time: number): void {
            this._firstActiveElement = 0;
            this._firstNewElement = 0;
            this._firstFreeElement = 0;
            this._firstRetiredElement = 0;
            this._burstsIndex = 0;
            this._frameRateTime = time;
            this._emissionTime = 0;
            this._totalDelayTime = 0;
            this._currentTime = time;
            let delayTime = time;
            if (delayTime < this._playStartDelay) {
                this._totalDelayTime = delayTime;
                return;
            }
            if (this._emission.enbale)
                this._advanceTime(time, time);
        }

        private _addUpdateEmissionToTimer(): void {
            Laya.timer.frameLoop(1, this, this._updateEmission);
        }

        private _removeUpdateEmissionToTimer(): void {
            Laya.timer.clear(this, this._updateEmission);
        }

        private _onOwnerActiveHierarchyChanged(active: boolean): void {
            // if (this._owner.displayedInStage) {
            //     if (active) {
            //         this._addUpdateEmissionToTimer();
            //     } else {
            //         this._removeUpdateEmissionToTimer();
            //     }
            // }

            if (this._owner.displayedInStage && active) {
                this._addUpdateEmissionToTimer();
            } else {
                this._removeUpdateEmissionToTimer();
            }
        }

        private _retireActiveParticles(): void {
            let epsilon = 0.0001;
            while (this._firstActiveElement != this._firstNewElement) {
                let index = this._firstActiveElement * this._floatCountPerVertex * this._vertexStride;
                let timeIndex = index + this._timeIndex;
                let particleAge = this._currentTime - this._vertices[timeIndex];
                if (particleAge + epsilon < this._vertices[index + this._startLifeTimeIndex])
                    break;
                this._vertices[timeIndex] = this._drawCounter;
                this._firstActiveElement++;
                if (this._firstActiveElement >= this._bufferMaxParticles)
                    this._firstActiveElement = 0;
            }
        }

        private _freeRetiredParticles(): void {
            while (this._firstRetiredElement != this._firstActiveElement) {
                let age = this._drawCounter - this._vertices[this._firstRetiredElement * this._floatCountPerVertex * this._vertexStride + this._timeIndex];
                if (this.isPerformanceMode)
                    if (age < 3)
                        break;
                this._firstRetiredElement++;
                if (this._firstRetiredElement >= this._bufferMaxParticles)
                    this._firstRetiredElement = 0;
            }
        }

        private _burst(fromTime: number, toTime: number): number {
            let totalEmitCount = 0;
            let bursts = this._emission._bursts;
            for (let n = bursts.length; this._burstsIndex < n; this._burstsIndex++) {
                let burst = bursts[this._burstsIndex];
                let burstTime = burst.time;
                if (fromTime <= burstTime && burstTime < toTime) {
                    let emitCount = 0;
                    if (this.autoRandomSeed) {
                        emitCount = MathUtil.lerp(burst.minCount, burst.maxCount, Math.random());
                    } else {
                        this._rand.seed = this._randomSeeds[0];
                        emitCount = MathUtil.lerp(burst.minCount, burst.maxCount, this._rand.getFloat());
                        this._randomSeeds[0] = this._rand.seed;
                    }
                    totalEmitCount += emitCount;
                } else {
                    break;
                }
            }
            return totalEmitCount;
        }

        private _advanceTime(elapsedTime: number, emitTime: number): void {
            let i = 0;
            let lastEmissionTime = this._emissionTime;
            this._emissionTime += elapsedTime;
            let totalEmitCount = 0;

            if (this._emissionTime > this.duration) {
                if (this.looping) {
                    totalEmitCount += this._burst(lastEmissionTime, this._emissionTime);
                    this._emissionTime -= this.duration;
                    this.event(/*laya.events.Event.COMPLETE*/"complete");
                    this._burstsIndex = 0;
                    totalEmitCount += this._burst(0, this._emissionTime);
                } else {
                    totalEmitCount = Math.min(this.maxParticles - this.aliveParticleCount, totalEmitCount);
                    for (i = 0; i < totalEmitCount; i++)
                        this.emit(emitTime);
                    this._isPlaying = false;
                    this.stop();
                    return;
                }
            } else {
                totalEmitCount += this._burst(lastEmissionTime, this._emissionTime);
            }
            totalEmitCount = Math.min(this.maxParticles - this.aliveParticleCount, totalEmitCount);
            for (i = 0; i < totalEmitCount; i++)
                this.emit(emitTime);
            let emissionRate = this.emission.emissionRate;
            if (emissionRate > 0) {
                let minEmissionTime = 1 / emissionRate;
                this._frameRateTime += minEmissionTime;
                this._frameRateTime = this._currentTime - (this._currentTime - this._frameRateTime) % this._maxStartLifetime;
                while (this._frameRateTime <= emitTime) {
                    if (this.emit(this._frameRateTime))
                        this._frameRateTime += minEmissionTime;
                    else
                        break;
                }
                this._frameRateTime = Math.floor(emitTime / minEmissionTime) * minEmissionTime;
            }
        }

        private _initBufferDatas(): void {
            if (this._vertexBuffer) {
                this._vertexBuffer.destroy();
                this._indexBuffer.destroy();
            }
            let render = this._ownerRender;
            let renderMode = render.renderMode;
            if (renderMode !== MeshType.NONE && this.maxParticles > 0) {
                let indices, i = 0, j = 0, m = 0, indexOffset = 0, perPartOffset = 0, vertexDeclaration;
                let mesh = render.mesh;
                if (renderMode === MeshType.MESH) {
                    if (mesh) {
                        let vertexBufferCount = mesh._vertexBuffers.length;
                        if (vertexBufferCount > 1) {
                            throw new Error("SnowflakeParticleSystem: submesh Count mesh be One or all subMeshes have the same vertexDeclaration.");
                        } else {
                            vertexDeclaration = VertexShurikenParticleMesh.vertexDeclaration;
                            this._floatCountPerVertex = vertexDeclaration.vertexStride / 4;
                            this._startLifeTimeIndex = 12;
                            this._timeIndex = 16;
                            this._vertexStride = mesh._vertexBuffers[0].vertexCount;
                            let totalVertexCount = this._bufferMaxParticles * this._vertexStride;
                            let vbCount = Math.floor(totalVertexCount / 65535) + 1;
                            let lastVBVertexCount = totalVertexCount % 65535;
                            if (vbCount > 1) {
                                throw new Error("SnowflakeParticleSystem:the maxParticleCount multiply mesh vertexCount is large than 65535.");
                            }
                            this._vertexBuffer = VertexBuffer3D.create(vertexDeclaration, lastVBVertexCount, /*laya.webgl.WebGLContext.DYNAMIC_DRAW*/0x88E8);
                            this._vertices = new Float32Array(this._floatCountPerVertex * lastVBVertexCount);
                            this._indexStride = mesh._indexBuffer.indexCount;
                            let indexDatas = mesh._indexBuffer.getData();
                            let indexCount = this._bufferMaxParticles * this._indexStride;
                            this._indexBuffer = IndexBuffer3D.create(/*laya.d3.graphics.IndexBuffer3D.INDEXTYPE_USHORT*/"ushort", indexCount, /*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4);
                            indices = new Uint16Array(indexCount);
                            indexOffset = 0;
                            for (i = 0; i < this._bufferMaxParticles; i++) {
                                let indexValueOffset = i * this._vertexStride;
                                for (j = 0, m = indexDatas.length; j < m; j++)
                                    indices[indexOffset++] = indexValueOffset + indexDatas[j];
                            }
                            this._indexBuffer.setData(indices);
                        }
                    }
                } else {
                    vertexDeclaration = VertexShurikenParticleBillboard.vertexDeclaration;
                    this._floatCountPerVertex = vertexDeclaration.vertexStride / 4;
                    this._startLifeTimeIndex = 7;
                    this._timeIndex = 11;
                    this._vertexStride = 4;
                    this._vertexBuffer = VertexBuffer3D.create(vertexDeclaration, this._bufferMaxParticles * this._vertexStride, /*laya.webgl.WebGLContext.DYNAMIC_DRAW*/0x88E8);
                    this._vertices = new Float32Array(this._floatCountPerVertex * this._bufferMaxParticles * this._vertexStride);
                    for (i = 0; i < this._bufferMaxParticles; i++) {
                        perPartOffset = i * this._floatCountPerVertex * this._vertexStride;
                        this._vertices[perPartOffset] = -0.5;
                        this._vertices[perPartOffset + 1] = -0.5;
                        this._vertices[perPartOffset + 2] = 0;
                        this._vertices[perPartOffset + 3] = 1;
                        perPartOffset += this._floatCountPerVertex;
                        this._vertices[perPartOffset] = 0.5;
                        this._vertices[perPartOffset + 1] = -0.5;
                        this._vertices[perPartOffset + 2] = 1;
                        this._vertices[perPartOffset + 3] = 1;
                        perPartOffset += this._floatCountPerVertex;
                        this._vertices[perPartOffset] = 0.5;
                        this._vertices[perPartOffset + 1] = 0.5;
                        this._vertices[perPartOffset + 2] = 1;
                        this._vertices[perPartOffset + 3] = 0;
                        perPartOffset += this._floatCountPerVertex;
                        this._vertices[perPartOffset] = -0.5;
                        this._vertices[perPartOffset + 1] = 0.5;
                        this._vertices[perPartOffset + 2] = 0;
                        this._vertices[perPartOffset + 3] = 0;
                    }
                    this._indexStride = 6;
                    this._indexBuffer = IndexBuffer3D.create(/*laya.d3.graphics.IndexBuffer3D.INDEXTYPE_USHORT*/"ushort", this._bufferMaxParticles * 6, /*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4);
                    indices = new Uint16Array(this._bufferMaxParticles * 6);
                    for (i = 0; i < this._bufferMaxParticles; i++) {
                        indexOffset = i * 6;
                        let firstVertex = i * this._vertexStride, secondVertex = firstVertex + 2;
                        indices[indexOffset++] = firstVertex;
                        indices[indexOffset++] = secondVertex;
                        indices[indexOffset++] = firstVertex + 1;
                        indices[indexOffset++] = firstVertex;
                        indices[indexOffset++] = firstVertex + 3;
                        indices[indexOffset++] = secondVertex;
                    }
                    this._indexBuffer.setData(indices);
                }
            }
        }

        public _destroy(): void {
            super._destroy();
            (this._owner.activeInHierarchy) && (this._removeUpdateEmissionToTimer());
            this._vertexBuffer.destroy();
            this._indexBuffer.destroy();
            this._emission._destroy();
            this._owner = null;
            this._vertices = null;
            this._vertexBuffer = null;
            this._indexBuffer = null;
            this._emission = null;
            this._shape = null;
            this.startLifeTimeGradient = null;
            this.startLifeTimeGradientMin = null;
            this.startLifeTimeGradientMax = null;
            this.startSizeConstantSeparate = null;
            this.startSizeConstantMinSeparate = null;
            this.startSizeConstantMaxSeparate = null;
            this.startRotationConstantSeparate = null;
            this.startRotationConstantMinSeparate = null;
            this.startRotationConstantMaxSeparate = null;
            this.startColorConstant = null;
            this.startColorConstantMin = null;
            this.startColorConstantMax = null;
            this._velocityOverLifetime = null;
            this._colorOverLifetime = null;
            this._sizeOverLifetime = null;
            this._rotationOverLifetime = null;
            this._textureSheetAnimation = null;
        }

        /**
         *发射一个粒子。
         */
        private emit(time: number): boolean {
            let position = SnowflakeParticleSystem._tempPosition;
            let direction = SnowflakeParticleSystem._tempDirection;
            if (this._shape && this._shape.enable) {
                if (this.autoRandomSeed)
                    this._shape.generatePositionAndDirection(position, direction);
                else
                    this._shape.generatePositionAndDirection(position, direction, this._rand, this._randomSeeds);
            } else {
                let positionE = position.elements;
                let directionE = direction.elements;
                positionE[0] = positionE[1] = positionE[2] = 0;
                directionE[0] = directionE[1] = 0;
                directionE[2] = 1;
            }
            return this.addParticle(position, direction, time);
        }

        //TODO:提前判断优化
        private addParticle(position: Vector3, direction: Vector3, time: number): boolean {
            Vector3.normalize(direction, direction);
            let nextFreeParticle = this._firstFreeElement + 1;
            if (nextFreeParticle >= this._bufferMaxParticles)
                nextFreeParticle = 0;
            if (nextFreeParticle === this._firstRetiredElement)
                return false;

            SnowflakeParticleData.create(this, this._ownerRender, this._owner.transform);
            let particleAge = this._currentTime - time;
            if (particleAge >= SnowflakeParticleData.startLifeTime)
                return true;

            let randomVelocityX = NaN, randomVelocityY = NaN, randomVelocityZ = NaN;
            let needRandomVelocity = this._velocityOverLifetime && this._velocityOverLifetime.enbale;
            if (needRandomVelocity) {
                let velocityType = this._velocityOverLifetime.velocity.type;
                if (velocityType === 2 || velocityType === 3) {
                    if (this.autoRandomSeed) {
                        randomVelocityX = Math.random();
                        randomVelocityY = Math.random();
                        randomVelocityZ = Math.random();
                    } else {
                        this._rand.seed = this._randomSeeds[9];
                        randomVelocityX = this._rand.getFloat();
                        randomVelocityY = this._rand.getFloat();
                        randomVelocityZ = this._rand.getFloat();
                        this._randomSeeds[9] = this._rand.seed;
                    }
                } else {
                    needRandomVelocity = false;
                }
            } else {
                needRandomVelocity = false;
            }

            let randomColor = NaN;
            let needRandomColor = this._colorOverLifetime && this._colorOverLifetime.enbale;
            if (needRandomColor) {
                let colorType = this._colorOverLifetime.color.type;
                if (colorType === 3) {
                    if (this.autoRandomSeed) {
                        randomColor = Math.random();
                    } else {
                        this._rand.seed = this._randomSeeds[10];
                        randomColor = this._rand.getFloat();
                        this._randomSeeds[10] = this._rand.seed;
                    }
                } else {
                    needRandomColor = false;
                }
            } else {
                needRandomColor = false;
            }

            let randomSize = NaN;
            let needRandomSize = this._sizeOverLifetime && this._sizeOverLifetime.enbale;
            if (needRandomSize) {
                let sizeType = this._sizeOverLifetime.size.type;
                if (sizeType === 3) {
                    if (this.autoRandomSeed) {
                        randomSize = Math.random();
                    } else {
                        this._rand.seed = this._randomSeeds[11];
                        randomSize = this._rand.getFloat();
                        this._randomSeeds[11] = this._rand.seed;
                    }
                } else {
                    needRandomSize = false;
                }
            } else {
                needRandomSize = false;
            }

            let randomRotation = NaN;
            let needRandomRotation = this._rotationOverLifetime && this._rotationOverLifetime.enbale;
            if (needRandomRotation) {
                let rotationType = this._rotationOverLifetime.angularVelocity.type;
                if (rotationType === 2 || rotationType === 3) {
                    if (this.autoRandomSeed) {
                        randomRotation = Math.random();
                    } else {
                        this._rand.seed = this._randomSeeds[12];
                        randomRotation = this._rand.getFloat();
                        this._randomSeeds[12] = this._rand.seed;
                    }
                } else {
                    needRandomRotation = false;
                }
            } else {
                needRandomRotation = false;
            }

            let randomTextureAnimation = NaN;
            let needRandomTextureAnimation = this._textureSheetAnimation && this._textureSheetAnimation.enable;
            if (needRandomTextureAnimation) {
                let textureAnimationType = this._textureSheetAnimation.frame.type;
                if (textureAnimationType === 3) {
                    if (this.autoRandomSeed) {
                        randomTextureAnimation = Math.random();
                    } else {
                        this._rand.seed = this._randomSeeds[15];
                        randomTextureAnimation = this._rand.getFloat();
                        this._randomSeeds[15] = this._rand.seed;
                    }
                } else {
                    needRandomTextureAnimation = false;
                }
            } else {
                needRandomTextureAnimation = false;
            }

            let startIndex = this._firstFreeElement * this._floatCountPerVertex * this._vertexStride;
            // let subU = SnowflakeParticleData.startUVInfo[0];
            // let subV = SnowflakeParticleData.startUVInfo[1];
            // let startU = SnowflakeParticleData.startUVInfo[2];
            // let startV = SnowflakeParticleData.startUVInfo[3];
            let startUVInfo = SnowflakeParticleData.startUVInfo;
            let subU = startUVInfo[0];
            let subV = startUVInfo[1];
            let startU = startUVInfo[2];
            let startV = startUVInfo[3];
            let positionE = position.elements;
            let directionE = direction.elements;
            let meshVertices, meshVertexStride = 0, meshPosOffset = 0, meshCorOffset = 0, meshUVOffset = 0,
                meshVertexIndex = 0;
            let render = this._ownerRender;
            if (render.renderMode === MeshType.MESH) {
                let meshVB = render.mesh._vertexBuffers[0];
                meshVertices = meshVB.getData();
                let meshVertexDeclaration = meshVB.vertexDeclaration;
                meshPosOffset = meshVertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.VertexElementUsage.POSITION0*/0).offset / 4;
                let colorElement = meshVertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.VertexElementUsage.COLOR0*/1);
                meshCorOffset = colorElement ? colorElement.offset / 4 : -1;
                let uvElement = meshVertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.VertexElementUsage.TEXTURECOORDINATE0*/2);
                meshUVOffset = uvElement ? uvElement.offset / 4 : -1;
                meshVertexStride = meshVertexDeclaration.vertexStride / 4;
                meshVertexIndex = 0;
            } else {
                this._vertices[startIndex + 2] = startU;
                this._vertices[startIndex + 3] = startV + subV;
                let secondOffset = startIndex + this._floatCountPerVertex;
                this._vertices[secondOffset + 2] = startU + subU;
                this._vertices[secondOffset + 3] = startV + subV;
                let thirdOffset = secondOffset + this._floatCountPerVertex;
                this._vertices[thirdOffset + 2] = startU + subU;
                this._vertices[thirdOffset + 3] = startV;
                let fourthOffset = thirdOffset + this._floatCountPerVertex;
                this._vertices[fourthOffset + 2] = startU;
                this._vertices[fourthOffset + 3] = startV;
            }
            for (let i = startIndex, n = startIndex + this._floatCountPerVertex * this._vertexStride; i < n; i += this._floatCountPerVertex) {
                let offset = 0;
                if (render.renderMode === MeshType.MESH) {
                    offset = i;
                    let vertexOffset = meshVertexStride * (meshVertexIndex++);
                    let meshOffset = vertexOffset + meshPosOffset;
                    this._vertices[offset++] = meshVertices[meshOffset++];
                    this._vertices[offset++] = meshVertices[meshOffset++];
                    this._vertices[offset++] = meshVertices[meshOffset];
                    if (meshCorOffset === -1) {
                        this._vertices[offset++] = 1.0;
                        this._vertices[offset++] = 1.0;
                        this._vertices[offset++] = 1.0;
                        this._vertices[offset++] = 1.0;
                    } else {
                        meshOffset = vertexOffset + meshCorOffset;
                        this._vertices[offset++] = meshVertices[meshOffset++];
                        this._vertices[offset++] = meshVertices[meshOffset++];
                        this._vertices[offset++] = meshVertices[meshOffset++];
                        this._vertices[offset++] = meshVertices[meshOffset];
                    }
                    if (meshUVOffset === -1) {
                        this._vertices[offset++] = 0.0;
                        this._vertices[offset++] = 0.0;
                    } else {
                        meshOffset = vertexOffset + meshUVOffset;
                        this._vertices[offset++] = startU + meshVertices[meshOffset++] * subU;
                        this._vertices[offset++] = startV + meshVertices[meshOffset] * subV;
                    }
                } else {
                    offset = i + 4;
                }
                this._vertices[offset++] = positionE[0];
                this._vertices[offset++] = positionE[1];
                this._vertices[offset++] = positionE[2];
                this._vertices[offset++] = SnowflakeParticleData.startLifeTime;
                this._vertices[offset++] = directionE[0];
                this._vertices[offset++] = directionE[1];
                this._vertices[offset++] = directionE[2];
                this._vertices[offset++] = time;
                this._vertices[offset++] = SnowflakeParticleData.startColor[0];
                this._vertices[offset++] = SnowflakeParticleData.startColor[1];
                this._vertices[offset++] = SnowflakeParticleData.startColor[2];
                this._vertices[offset++] = SnowflakeParticleData.startColor[3];
                this._vertices[offset++] = SnowflakeParticleData.startSize[0];
                this._vertices[offset++] = SnowflakeParticleData.startSize[1];
                this._vertices[offset++] = SnowflakeParticleData.startSize[2];
                this._vertices[offset++] = SnowflakeParticleData.startRotation[0];
                this._vertices[offset++] = SnowflakeParticleData.startRotation[1];
                this._vertices[offset++] = SnowflakeParticleData.startRotation[2];
                this._vertices[offset++] = SnowflakeParticleData.startSpeed;
                needRandomColor && (this._vertices[offset + 1] = randomColor);
                needRandomSize && (this._vertices[offset + 2] = randomSize);
                needRandomRotation && (this._vertices[offset + 3] = randomRotation);
                needRandomTextureAnimation && (this._vertices[offset + 4] = randomTextureAnimation);
                if (needRandomVelocity) {
                    this._vertices[offset + 5] = randomVelocityX * 100;
                    this._vertices[offset + 6] = randomVelocityY * 100;
                    this._vertices[offset + 7] = randomVelocityZ * 100;
                }
                switch (this.simulationSpace) {
                    case 0:
                        offset += 8;
                        this._vertices[offset++] = SnowflakeParticleData.simulationWorldPostion[0];
                        this._vertices[offset++] = SnowflakeParticleData.simulationWorldPostion[1];
                        this._vertices[offset++] = SnowflakeParticleData.simulationWorldPostion[2];
                        this._vertices[offset++] = SnowflakeParticleData.simulationWorldRotation[0];
                        this._vertices[offset++] = SnowflakeParticleData.simulationWorldRotation[1];
                        this._vertices[offset++] = SnowflakeParticleData.simulationWorldRotation[2];
                        this._vertices[offset++] = SnowflakeParticleData.simulationWorldRotation[3];
                        break;
                    case 1:
                        break;
                    default :
                        throw new Error("SnowflakeParticleMaterial: SimulationSpace value is invalid.");
                }
            }
            this._firstFreeElement = nextFreeParticle;
            return true;
        }

        private addNewParticlesToVertexBuffer(): void {
            let start = 0;
            if (this._firstNewElement < this._firstFreeElement) {
                start = this._firstNewElement * this._vertexStride * this._floatCountPerVertex;
                this._vertexBuffer.setData(this._vertices, start, start, (this._firstFreeElement - this._firstNewElement) * this._vertexStride * this._floatCountPerVertex);
            } else {
                start = this._firstNewElement * this._vertexStride * this._floatCountPerVertex;
                this._vertexBuffer.setData(this._vertices, start, start, (this._bufferMaxParticles - this._firstNewElement) * this._vertexStride * this._floatCountPerVertex);
                if (this._firstFreeElement > 0) {
                    this._vertexBuffer.setData(this._vertices, 0, 0, this._firstFreeElement * this._vertexStride * this._floatCountPerVertex);
                }
            }
            this._firstNewElement = this._firstFreeElement;
        }

        public _beforeRender(state: RenderState): boolean {
            if (this._firstNewElement != this._firstFreeElement)
                this.addNewParticlesToVertexBuffer();
            this._drawCounter++;
            if (this._firstActiveElement != this._firstFreeElement) {
                this._vertexBuffer._bind();
                this._indexBuffer._bind();
                return true;
            }
            return false;
        }

        public _render(state: RenderState): void {
            let indexCount = 0;
            let gl = WebGL.mainContext;
            if (this._firstActiveElement < this._firstFreeElement) {
                indexCount = (this._firstFreeElement - this._firstActiveElement) * this._indexStride;
                gl.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004, indexCount, /*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403, 2 * this._firstActiveElement * this._indexStride);
                Stat.trianglesFaces += indexCount / 3;
                Stat.drawCall++;
            } else {
                indexCount = (this._bufferMaxParticles - this._firstActiveElement) * this._indexStride;
                gl.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004, indexCount, /*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403, 2 * this._firstActiveElement * this._indexStride);
                Stat.trianglesFaces += indexCount / 3;
                Stat.drawCall++;
                if (this._firstFreeElement > 0) {
                    indexCount = this._firstFreeElement * this._indexStride;
                    gl.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004, indexCount, /*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403, 0);
                    Stat.trianglesFaces += indexCount / 3;
                    Stat.drawCall++;
                }
            }
        }

        /**
         *开始发射粒子。
         */
        public play(): void {
            this._burstsIndex = 0;
            this._isEmitting = true;
            this._isPlaying = true;
            this._isPaused = false;
            this._emissionTime = 0;
            this._totalDelayTime = 0;
            if (!this.autoRandomSeed) {
                for (let i = 0, n = this._randomSeeds.length; i < n; i++)
                    this._randomSeeds[i] = this.randomSeed[0] + SnowflakeParticleSystem._RANDOMOFFSET[i];
            }
            switch (this.startDelayType) {
                case 0:
                    this._playStartDelay = this.startDelay;
                    break;
                case 1:
                    if (this.autoRandomSeed) {
                        this._playStartDelay = MathUtil.lerp(this.startDelayMin, this.startDelayMax, Math.random());
                    } else {
                        this._rand.seed = this._randomSeeds[2];
                        this._playStartDelay = MathUtil.lerp(this.startDelayMin, this.startDelayMax, this._rand.getFloat());
                        this._randomSeeds[2] = this._rand.seed;
                    }
                    break;
                default :
                    throw new Error("Utils3D: startDelayType is invalid.");
            }
            this._frameRateTime = this._currentTime + this._playStartDelay;
            this._startUpdateLoopCount = Stat.loopCount;
            this.event(/*laya.events.Event.PLAYED*/"played");
        }

        /**
         *暂停发射粒子。
         */
        private pause(): void {
            this._isPaused = true;
            this.event(/*laya.events.Event.PAUSED*/"paused");
        }

        /**
         *通过指定时间增加粒子播放进度，并暂停播放。
         *@param time 进度时间.如果restart为true,粒子播放时间会归零后再更新进度。
         *@param restart 是否重置播放状态。
         */
        public simulate(time: number, restart: boolean = true): void {
            this._simulateUpdate = true;
            if (restart) {
                this._updateParticlesSimulationRestart(time);
            } else {
                this._isPaused = false;
                this._updateParticles(time);
            }
            this.pause();
        }

        /**
         *停止发射粒子。
         */
        private stop(): void {
            this._burstsIndex = 0;
            this._isEmitting = false;
            this._emissionTime = 0;
            this.event(/*laya.events.Event.STOPPED*/"stopped");
        }

        /**
         *克隆。
         *@param destObject 克隆源。
         */
        public cloneTo(destObject: SnowflakeParticleSystem): void {
            let dest = destObject;
            dest.duration = this.duration;
            dest.looping = this.looping;
            dest.prewarm = this.prewarm;
            dest.startDelayType = this.startDelayType;
            dest.startDelay = this.startDelay;
            dest.startDelayMin = this.startDelayMin;
            dest.startDelayMax = this.startDelayMax;
            dest._maxStartLifetime = this._maxStartLifetime;
            dest.startLifetimeType = this.startLifetimeType;
            dest.startLifetimeConstant = this.startLifetimeConstant;
            this.startLifeTimeGradient.cloneTo(dest.startLifeTimeGradient);
            dest.startLifetimeConstantMin = this.startLifetimeConstantMin;
            dest.startLifetimeConstantMax = this.startLifetimeConstantMax;
            this.startLifeTimeGradientMin.cloneTo(dest.startLifeTimeGradientMin);
            this.startLifeTimeGradientMax.cloneTo(dest.startLifeTimeGradientMax);
            dest.startSpeedType = this.startSpeedType;
            dest.startSpeedConstant = this.startSpeedConstant;
            dest.startSpeedConstantMin = this.startSpeedConstantMin;
            dest.startSpeedConstantMax = this.startSpeedConstantMax;
            dest.threeDStartSize = this.threeDStartSize;
            dest.startSizeType = this.startSizeType;
            dest.startSizeConstant = this.startSizeConstant;
            this.startSizeConstantSeparate.cloneTo(dest.startSizeConstantSeparate);
            dest.startSizeConstantMin = this.startSizeConstantMin;
            dest.startSizeConstantMax = this.startSizeConstantMax;
            this.startSizeConstantMinSeparate.cloneTo(dest.startSizeConstantMinSeparate);
            this.startSizeConstantMaxSeparate.cloneTo(dest.startSizeConstantMaxSeparate);
            dest.threeDStartRotation = this.threeDStartRotation;
            dest.startRotationType = this.startRotationType;
            dest.startRotationConstant = this.startRotationConstant;
            this.startRotationConstantSeparate.cloneTo(dest.startRotationConstantSeparate);
            dest.startRotationConstantMin = this.startRotationConstantMin;
            dest.startRotationConstantMax = this.startRotationConstantMax;
            this.startRotationConstantMinSeparate.cloneTo(dest.startRotationConstantMinSeparate);
            this.startRotationConstantMaxSeparate.cloneTo(dest.startRotationConstantMaxSeparate);
            dest.randomizeRotationDirection = this.randomizeRotationDirection;
            dest.startColorType = this.startColorType;
            this.startColorConstant.cloneTo(dest.startColorConstant);
            this.startColorConstantMin.cloneTo(dest.startColorConstantMin);
            this.startColorConstantMax.cloneTo(dest.startColorConstantMax);
            dest.gravityModifier = this.gravityModifier;
            dest.simulationSpace = this.simulationSpace;
            dest.scaleMode = this.scaleMode;
            dest.playOnAwake = this.playOnAwake;
            dest.maxParticles = this.maxParticles;
            (this._emission) && (dest._emission = this._emission.clone());
            (this.shape) && (dest.shape = this.shape.clone());
            (this.velocityOverLifetime) && (dest.velocityOverLifetime = this.velocityOverLifetime.clone());
            (this.colorOverLifetime) && (dest.colorOverLifetime = this.colorOverLifetime.clone());
            (this.sizeOverLifetime) && (dest.sizeOverLifetime = this.sizeOverLifetime.clone());
            (this.rotationOverLifetime) && (dest.rotationOverLifetime = this.rotationOverLifetime.clone());
            (this.textureSheetAnimation) && (dest.textureSheetAnimation = this.textureSheetAnimation.clone());
            dest.isPerformanceMode = this.isPerformanceMode;
            dest._isEmitting = this._isEmitting;
            dest._isPlaying = this._isPlaying;
            dest._isPaused = this._isPaused;
            dest._playStartDelay = this._playStartDelay;
            dest._frameRateTime = this._frameRateTime;
            dest._emissionTime = this._emissionTime;
            dest._totalDelayTime = this._totalDelayTime;
            dest._burstsIndex = this._burstsIndex;
        }

        /**
         *克隆。
         *@return 克隆副本。
         */
        public clone(): SnowflakeParticleSystem {
            let dest = new SnowflakeParticleSystem(null);
            this.cloneTo(dest);
            return dest;
        }

        public _getVertexBuffers(): Array<VertexBuffer3D> {
            return null;
        }

        /**设置最大粒子数,注意:谨慎修改此属性，有性能损耗。*/
        /**获取最大粒子数。*/
        public get maxParticles(): number {
            return this._bufferMaxParticles - 1;
        }

        public set maxParticles(value: number) {
            let newMaxParticles = value + 1;
            if (newMaxParticles !== this._bufferMaxParticles) {
                this._bufferMaxParticles = newMaxParticles;
                this._initBufferDatas();
            }
        }

        /**
         *是否正在发射。
         */
        public get isEmitting(): boolean {
            return this._isEmitting;
        }

        /**
         *是否存活。
         */
        public get isAlive(): boolean {
            return (this._isPlaying || this.aliveParticleCount > 0);
        }

        /**
         *设置形状。
         */
        /**
         *获取形状。
         */
        public get shape(): BaseShape {
            return this._shape;
        }

        public set shape(value: BaseShape) {
            if (this._shape !== value) {
                if (value && value.enable) {
                    this._ownerRender._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_SHAPE);
                } else {
                    this._ownerRender._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_SHAPE);
                }
                this._shape = value;
            }
        }

        /**
         *设置生命周期旋转,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
         *@param value 生命周期旋转。
         */
        /**
         *获取生命周期旋转,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
         *@return 生命周期旋转。
         */
        public get rotationOverLifetime(): RotationOverLifetime {
            return this._rotationOverLifetime;
        }

        public set rotationOverLifetime(value: RotationOverLifetime) {
            let render = this._ownerRender;
            if (value) {
                let rotation = value.angularVelocity;
                if (!rotation)
                    return;
                let rotationSeparate = rotation.separateAxes;
                let rotationType = rotation.type;
                if (value.enbale) {
                    if (rotationSeparate)
                        render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMESEPERATE);
                    else
                        render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIME);
                    switch (rotationType) {
                        case 0:
                            render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECONSTANT);
                            break;
                        case 1:
                            render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECURVE);
                            break;
                        case 2:
                            render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCONSTANTS);
                            break;
                        case 3:
                            render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCURVES);
                            break;
                    }
                } else {
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIME);
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMESEPERATE);
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECONSTANT);
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECURVE);
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCONSTANTS);
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCURVES);
                }
                switch (rotationType) {
                    case 0:
                        if (rotationSeparate) {
                            render._setShaderValueColor(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYCONSTSEPRARATE*/35, rotation.constantSeparate);
                        } else {
                            render._setShaderValueNumber(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYCONST*/34, rotation.constant);
                        }
                        break;
                    case 1:
                        if (rotationSeparate) {
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTX*/37, rotation.gradientX._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTY*/38, rotation.gradientY._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTZ*/39, rotation.gradientZ._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTW*/40, rotation.gradientW._elements);
                        } else {
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENT*/36, rotation.gradient._elements);
                        }
                        break;
                    case 2:
                        if (rotationSeparate) {
                            render._setShaderValueColor(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYCONSTSEPRARATE*/35, rotation.constantMinSeparate);
                            render._setShaderValueColor(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYCONSTMAXSEPRARATE*/42, rotation.constantMaxSeparate);
                        } else {
                            render._setShaderValueNumber(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYCONST*/34, rotation.constantMin);
                            render._setShaderValueNumber(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYCONSTMAX*/41, rotation.constantMax);
                        }
                        break;
                    case 3:
                        if (rotationSeparate) {
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTX*/37, rotation.gradientXMin._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTXMAX*/44, rotation.gradientXMax._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTY*/38, rotation.gradientYMin._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTYMAX*/45, rotation.gradientYMax._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTZ*/39, rotation.gradientZMin._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTZMAX*/46, rotation.gradientZMax._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTW*/40, rotation.gradientWMin._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTWMAX*/47, rotation.gradientWMax._elements);
                        } else {
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENT*/36, rotation.gradientMin._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTMAX*/43, rotation.gradientMax._elements);
                        }
                        break;
                }
            } else {
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIME);
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMESEPERATE);
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECONSTANT);
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECURVE);
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCONSTANTS);
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCURVES);
                render._setShaderValueColor(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYCONSTSEPRARATE*/35, null);
                render._setShaderValueColor(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYCONSTMAXSEPRARATE*/42, null);
                render._setShaderValueNumber(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYCONST*/34, undefined);
                render._setShaderValueNumber(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYCONSTMAX*/41, undefined);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTX*/37, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTXMAX*/44, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTY*/38, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTYMAX*/45, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTZ*/39, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTZMAX*/46, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTW*/40, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTWMAX*/47, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENT*/36, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.ROLANGULARVELOCITYGRADIENTMAX*/43, null);
            }
            this._rotationOverLifetime = value;
        }

        /**
         *获取发射器。
         */
        public get emission(): Emission {
            return this._emission;
        }

        /**
         *获取一次循环内的累计时间。
         *@return 一次循环内的累计时间。
         */
        public get emissionTime(): number {
            return this._emissionTime > this.duration ? this.duration : this._emissionTime;
        }

        /**
         *粒子存活个数。
         */
        public get aliveParticleCount(): number {
            if (this._firstNewElement >= this._firstRetiredElement)
                return this._firstNewElement - this._firstRetiredElement;
            else
                return this._bufferMaxParticles - this._firstRetiredElement + this._firstNewElement;
        }

        /**
         *是否正在播放。
         */
        public get isPlaying(): boolean {
            return this._isPlaying;
        }

        /**
         *是否已暂停。
         */
        public get isPaused(): boolean {
            return this._isPaused;
        }

        /**
         *设置开始生命周期模式,0为固定时间，1为渐变时间，2为两个固定之间的随机插值,3为两个渐变时间的随机插值。
         */
        /**
         *获取开始生命周期模式,0为固定时间，1为渐变时间，2为两个固定之间的随机插值,3为两个渐变时间的随机插值。
         */
        public get startLifetimeType(): number {
            return this._startLifetimeType;
        }

        public set startLifetimeType(value: number) {
            let i = 0, n = 0;
            switch (this.startLifetimeType) {
                case 0:
                    this._maxStartLifetime = this.startLifetimeConstant;
                    break;
                case 1:
                    this._maxStartLifetime = -Number.MAX_VALUE;
                    let startLifeTimeGradient = this.startLifeTimeGradient;
                    for (i = 0, n = startLifeTimeGradient.gradientCount; i < n; i++)
                        this._maxStartLifetime = Math.max(this._maxStartLifetime, startLifeTimeGradient.getValueByIndex(i));
                    break;
                case 2:
                    this._maxStartLifetime = Math.max(this.startLifetimeConstantMin, this.startLifetimeConstantMax);
                    break;
                case 3:
                    this._maxStartLifetime = -Number.MAX_VALUE;
                    let startLifeTimeGradientMin = this.startLifeTimeGradientMin;
                    for (i = 0, n = startLifeTimeGradientMin.gradientCount; i < n; i++)
                        this._maxStartLifetime = Math.max(this._maxStartLifetime, startLifeTimeGradientMin.getValueByIndex(i));
                    let startLifeTimeGradientMax = this.startLifeTimeGradientMax;
                    for (i = 0, n = startLifeTimeGradientMax.gradientCount; i < n; i++)
                        this._maxStartLifetime = Math.max(this._maxStartLifetime, startLifeTimeGradientMax.getValueByIndex(i));
                    break;
            }
            this._startLifetimeType = value;
        }

        public get _originalBoundingSphere(): Laya.BoundSphere {
            return this._boundingSphere;
        }

        /**
         *设置开始生命周期，0模式,单位为秒。
         */
        /**
         *获取开始生命周期，0模式,单位为秒。
         */
        public get startLifetimeConstant(): number {
            return this._startLifetimeConstant;
        }

        public set startLifetimeConstant(value: number) {
            if (this._startLifetimeType === 0)
                this._maxStartLifetime = value;
            this._startLifetimeConstant = value;
        }

        /**
         *设置最小开始生命周期，2模式,单位为秒。
         */
        /**
         *获取最小开始生命周期，2模式,单位为秒。
         */
        public get startLifetimeConstantMin(): number {
            return this._startLifetimeConstantMin;
        }

        public set startLifetimeConstantMin(value: number) {
            if (this._startLifetimeType === 2)
                this._maxStartLifetime = Math.max(value, this._startLifetimeConstantMax);
            this._startLifetimeConstantMin = value;
        }

        /**
         *设置开始渐变生命周期，1模式,单位为秒。
         */
        /**
         *获取开始渐变生命周期，1模式,单位为秒。
         */
        public get startLifeTimeGradient(): GradientDataNumber {
            return this._startLifeTimeGradient;
        }

        public set startLifeTimeGradient(value: GradientDataNumber) {
            if (this._startLifetimeType === 1) {
                this._maxStartLifetime = -Number.MAX_VALUE;
                for (let i = 0, n = value.gradientCount; i < n; i++)
                    this._maxStartLifetime = Math.max(this._maxStartLifetime, value.getValueByIndex(i));
            }
            this._startLifeTimeGradient = value;
        }

        /**
         *设置最大开始生命周期，2模式,单位为秒。
         */
        /**
         *获取最大开始生命周期，2模式,单位为秒。
         */
        public get startLifetimeConstantMax(): number {
            return this._startLifetimeConstantMax;
        }

        public set startLifetimeConstantMax(value: number) {
            if (this._startLifetimeType === 2)
                this._maxStartLifetime = Math.max(this._startLifetimeConstantMin, value);
            this._startLifetimeConstantMax = value;
        }

        /**
         *设置开始渐变最小生命周期，3模式,单位为秒。
         */
        /**
         *获取开始渐变最小生命周期，3模式,单位为秒。
         */
        public get startLifeTimeGradientMin(): GradientDataNumber {
            return this._startLifeTimeGradientMin;
        }

        public set startLifeTimeGradientMin(value: GradientDataNumber) {
            if (this._startLifetimeType === 3) {
                let i = 0, n = 0;
                this._maxStartLifetime = -Number.MAX_VALUE;
                for (i = 0, n = value.gradientCount; i < n; i++)
                    this._maxStartLifetime = Math.max(this._maxStartLifetime, value.getValueByIndex(i));
                for (i = 0, n = this._startLifeTimeGradientMax.gradientCount; i < n; i++)
                    this._maxStartLifetime = Math.max(this._maxStartLifetime, this._startLifeTimeGradientMax.getValueByIndex(i));
            }
            this._startLifeTimeGradientMin = value;
        }

        /**
         *设置开始渐变最大生命周期，3模式,单位为秒。
         */
        /**
         *获取开始渐变最大生命周期，3模式,单位为秒。
         */
        public get startLifeTimeGradientMax(): GradientDataNumber {
            return this._startLifeTimeGradientMax;
        }

        public set startLifeTimeGradientMax(value: GradientDataNumber) {
            if (this._startLifetimeType === 3) {
                let i = 0, n = 0;
                this._maxStartLifetime = -Number.MAX_VALUE;
                for (i = 0, n = this._startLifeTimeGradientMin.gradientCount; i < n; i++)
                    this._maxStartLifetime = Math.max(this._maxStartLifetime, this._startLifeTimeGradientMin.getValueByIndex(i));
                for (i = 0, n = value.gradientCount; i < n; i++)
                    this._maxStartLifetime = Math.max(this._maxStartLifetime, value.getValueByIndex(i));
            }
            this._startLifeTimeGradientMax = value;
        }

        /**
         *设置生命周期速度,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
         *@param value 生命周期速度.
         */
        /**
         *获取生命周期速度,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
         *@return 生命周期速度.
         */
        public get velocityOverLifetime(): VelocityOverLifetime {
            return this._velocityOverLifetime;
        }

        public set velocityOverLifetime(value: VelocityOverLifetime) {
            let render = this._ownerRender;
            if (value) {
                let velocity = value.velocity;
                let velocityType = velocity.type;
                if (value.enbale) {
                    switch (velocityType) {
                        case 0:
                            render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECONSTANT);
                            break;
                        case 1:
                            render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECURVE);
                            break;
                        case 2:
                            render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCONSTANT);
                            break;
                        case 3:
                            render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCURVE);
                            break;
                    }
                } else {
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECONSTANT);
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECURVE);
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCONSTANT);
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCURVE);
                }
                switch (velocityType) {
                    case 0:
                        render._setShaderValueColor(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYCONST*/13, velocity.constant);
                        break;
                    case 1:
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTX*/14, velocity.gradientX._elements);
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTY*/15, velocity.gradientY._elements);
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTZ*/16, velocity.gradientZ._elements);
                        break;
                    case 2:
                        render._setShaderValueColor(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYCONST*/13, velocity.constantMin);
                        render._setShaderValueColor(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYCONSTMAX*/17, velocity.constantMax);
                        break;
                    case 3:
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTX*/14, velocity.gradientXMin._elements);
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTXMAX*/18, velocity.gradientXMax._elements);
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTY*/15, velocity.gradientYMin._elements);
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTYMAX*/19, velocity.gradientYMax._elements);
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTZ*/16, velocity.gradientZMin._elements);
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTZMAX*/20, velocity.gradientZMax._elements);
                        break;
                }
                render._setShaderValueInt(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLSPACETYPE*/21, value.space);
            } else {
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECONSTANT);
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECURVE);
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCONSTANT);
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCURVE);
                render._setShaderValueColor(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYCONST*/13, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTX*/14, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTY*/15, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTZ*/16, null);
                render._setShaderValueColor(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYCONST*/13, null);
                render._setShaderValueColor(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYCONSTMAX*/17, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTX*/14, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTXMAX*/18, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTY*/15, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTYMAX*/19, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTZ*/16, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLVELOCITYGRADIENTZMAX*/20, null);
                render._setShaderValueInt(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.VOLSPACETYPE*/21, undefined);
            }
            this._velocityOverLifetime = value;
        }

        /**
         *设置生命周期颜色,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
         *@param value 生命周期颜色
         */
        /**
         *获取生命周期颜色,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
         *@return 生命周期颜色
         */
        public get colorOverLifetime(): ColorOverLifetime {
            return this._colorOverLifetime;
        }

        public set colorOverLifetime(value: ColorOverLifetime) {
            let render = this._ownerRender;
            if (value) {
                let color = value.color;
                if (value.enbale) {
                    switch (color.type) {
                        case 1:
                            render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_COLOROVERLIFETIME);
                            break;
                        case 3:
                            render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_RANDOMCOLOROVERLIFETIME);
                            break;
                    }
                } else {
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_COLOROVERLIFETIME);
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_RANDOMCOLOROVERLIFETIME);
                }
                switch (color.type) {
                    case 1:
                        let gradientColor = color.gradient;
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.COLOROVERLIFEGRADIENTALPHAS*/22, gradientColor._alphaElements);
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.COLOROVERLIFEGRADIENTCOLORS*/23, gradientColor._rgbElements);
                        break;
                    case 3:
                        let minGradientColor = color.gradientMin;
                        let maxGradientColor = color.gradientMax;
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.COLOROVERLIFEGRADIENTALPHAS*/22, minGradientColor._alphaElements);
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.COLOROVERLIFEGRADIENTCOLORS*/23, minGradientColor._rgbElements);
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.MAXCOLOROVERLIFEGRADIENTALPHAS*/24, maxGradientColor._alphaElements);
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.MAXCOLOROVERLIFEGRADIENTCOLORS*/25, maxGradientColor._rgbElements);
                        break;
                }
            } else {
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_COLOROVERLIFETIME);
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_RANDOMCOLOROVERLIFETIME);
                // render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.COLOROVERLIFEGRADIENTALPHAS*/22, gradientColor._alphaElements);
                // render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.COLOROVERLIFEGRADIENTCOLORS*/23, gradientColor._rgbElements);
                // render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.COLOROVERLIFEGRADIENTALPHAS*/22, minGradientColor._alphaElements);
                // render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.COLOROVERLIFEGRADIENTCOLORS*/23, minGradientColor._rgbElements);
                // render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.MAXCOLOROVERLIFEGRADIENTALPHAS*/24, maxGradientColor._alphaElements);
                // render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.MAXCOLOROVERLIFEGRADIENTCOLORS*/25, maxGradientColor._rgbElements);

                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.COLOROVERLIFEGRADIENTALPHAS*/22, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.COLOROVERLIFEGRADIENTCOLORS*/23, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.MAXCOLOROVERLIFEGRADIENTALPHAS*/24, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.MAXCOLOROVERLIFEGRADIENTCOLORS*/25, null);
            }
            this._colorOverLifetime = value;
        }

        /**
         *设置生命周期尺寸,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
         *@param value 生命周期尺寸
         */
        /**
         *获取生命周期尺寸,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
         *@return 生命周期尺寸
         */
        public get sizeOverLifetime(): SizeOverLifetime {
            return this._sizeOverLifetime;
        }

        public set sizeOverLifetime(value: SizeOverLifetime) {
            let render = this._ownerRender;
            if (value) {
                let size = value.size;
                let sizeSeparate = size.separateAxes;
                let sizeType = size.type;
                if (value.enbale) {
                    switch (sizeType) {
                        case 0:
                            if (sizeSeparate)
                                render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVESEPERATE);
                            else
                                render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVE);
                            break;
                        case 2:
                            if (sizeSeparate)
                                render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVESSEPERATE);
                            else
                                render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVES);
                            break;
                    }
                } else {
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVE);
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVESEPERATE);
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVES);
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVESSEPERATE);
                }
                switch (sizeType) {
                    case 0:
                        if (sizeSeparate) {
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSIZEGRADIENTX*/27, size.gradientX._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSIZEGRADIENTY*/28, size.gradientY._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSizeGradientZ*/29, size.gradientZ._elements);
                        } else {
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSIZEGRADIENT*/26, size.gradient._elements);
                        }
                        break;
                    case 2:
                        if (sizeSeparate) {
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSIZEGRADIENTX*/27, size.gradientXMin._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSIZEGRADIENTXMAX*/31, size.gradientXMax._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSIZEGRADIENTY*/28, size.gradientYMin._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSIZEGRADIENTYMAX*/32, size.gradientYMax._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSizeGradientZ*/29, size.gradientZMin._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSizeGradientZMAX*/33, size.gradientZMax._elements);
                        } else {
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSIZEGRADIENT*/26, size.gradientMin._elements);
                            render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSizeGradientMax*/30, size.gradientMax._elements);
                        }
                        break;
                }
            } else {
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVE);
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVESEPERATE);
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVES);
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVESSEPERATE);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSIZEGRADIENTX*/27, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSIZEGRADIENTXMAX*/31, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSIZEGRADIENTY*/28, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSIZEGRADIENTYMAX*/32, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSizeGradientZ*/29, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSizeGradientZMAX*/33, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSIZEGRADIENT*/26, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.SOLSizeGradientMax*/30, null);
            }
            this._sizeOverLifetime = value;
        }

        /**
         *设置生命周期纹理动画,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
         *@param value 生命周期纹理动画。
         */
        /**
         *获取生命周期纹理动画,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
         *@return 生命周期纹理动画。
         */
        public get textureSheetAnimation(): TextureSheetAnimation {
            return this._textureSheetAnimation;
        }

        public set textureSheetAnimation(value: TextureSheetAnimation) {
            let render = this._ownerRender;
            if (value) {
                let frameOverTime = value.frame;
                let textureAniType = frameOverTime.type;
                if (value.enable) {
                    switch (textureAniType) {
                        case 1:
                            render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONCURVE);
                            break;
                        case 3:
                            render._addShaderDefine(SnowflakeParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONRANDOMCURVE);
                            break;
                    }
                } else {
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONCURVE);
                    render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONRANDOMCURVE);
                }
                if (textureAniType === 1 || textureAniType === 3) {
                    render._setShaderValueInt(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.TEXTURESHEETANIMATIONCYCLES*/48, value.cycles);
                    let title = value.tiles;
                    let _uvLengthE = this._uvLength.elements;
                    _uvLengthE[0] = 1.0 / title.x;
                    _uvLengthE[1] = 1.0 / title.y;
                    render._setShaderValueVector2(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.TEXTURESHEETANIMATIONSUBUVLENGTH*/49, this._uvLength);
                }
                switch (textureAniType) {
                    case 1:
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.TEXTURESHEETANIMATIONGRADIENTUVS*/50, frameOverTime.frameOverTimeData._elements);
                        break;
                    case 3:
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.TEXTURESHEETANIMATIONGRADIENTUVS*/50, frameOverTime.frameOverTimeDataMin._elements);
                        render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.TEXTURESHEETANIMATIONGRADIENTMAXUVS*/51, frameOverTime.frameOverTimeDataMax._elements);
                        break;
                }
            } else {
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONCURVE);
                render._removeShaderDefine(SnowflakeParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONRANDOMCURVE);
                render._setShaderValueInt(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.TEXTURESHEETANIMATIONCYCLES*/48, undefined);
                render._setShaderValueVector2(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.TEXTURESHEETANIMATIONSUBUVLENGTH*/49, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.TEXTURESHEETANIMATIONGRADIENTUVS*/50, null);
                render._setShaderValueBuffer(/*laya.d3.core.particleShuriKen.SnowflakeParticle3D.TEXTURESHEETANIMATIONGRADIENTMAXUVS*/51, null);
            }
            this._textureSheetAnimation = value;
        }

        public get _vertexBufferCount(): number {
            return 1;
        }

        public get triangleCount(): number {
            return this._indexBuffer ? this._indexBuffer.indexCount / 3 : 0;
        }

        public get _originalBoundingBox(): Laya.BoundBox {
            return this._boundingBox;
        }

        public get _originalBoundingBoxCorners(): Array<Vector3> {
            return this._boundingBoxCorners;
        }
    }
}