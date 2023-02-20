namespace base.particle.snowflake {
    import MathUtil = Laya.MathUtil;
    import Vector3 = Laya.Vector3;
    import Transform3D = Laya.Transform3D;

    export class SnowflakeParticleData {
        public static startLifeTime = NaN;
        public static startSpeed = NaN;
        private static _tempVector30 = new Vector3();
        public static startColor = new Float32Array(4);
        public static startSize = new Float32Array(3);
        public static startRotation = new Float32Array(3);
        public static startUVInfo = new Float32Array(4);
        public static simulationWorldPostion = new Float32Array(3);
        public static simulationWorldRotation = new Float32Array(4);

        public static create(particleSystem: SnowflakeParticleSystem, particleRender: SnowflakeParticleRender, transform: Transform3D): void {
            let autoRandomSeed = particleSystem.autoRandomSeed;
            let rand = particleSystem._rand;
            let randomSeeds = particleSystem._randomSeeds;
            switch (particleSystem.startColorType) {
                case 0:
                    let constantStartColorE = particleSystem.startColorConstant.elements;
                    SnowflakeParticleData.startColor[0] = constantStartColorE[0];
                    SnowflakeParticleData.startColor[1] = constantStartColorE[1];
                    SnowflakeParticleData.startColor[2] = constantStartColorE[2];
                    SnowflakeParticleData.startColor[3] = constantStartColorE[3];
                    break;
                case 2:
                    if (autoRandomSeed) {
                        MathUtil.lerpVector4(particleSystem.startColorConstantMin.elements, particleSystem.startColorConstantMax.elements, Math.random(), SnowflakeParticleData.startColor);
                    } else {
                        rand.seed = randomSeeds[3];
                        MathUtil.lerpVector4(particleSystem.startColorConstantMin.elements, particleSystem.startColorConstantMax.elements, rand.getFloat(), SnowflakeParticleData.startColor);
                        randomSeeds[3] = rand.seed;
                    }
                    break;
            }
            let colorOverLifetime = particleSystem.colorOverLifetime;
            if (colorOverLifetime && colorOverLifetime.enbale) {
                let color = colorOverLifetime.color;
                switch (color.type) {
                    case 0:
                        SnowflakeParticleData.startColor[0] = SnowflakeParticleData.startColor[0] * color.constant.x;
                        SnowflakeParticleData.startColor[1] = SnowflakeParticleData.startColor[1] * color.constant.y;
                        SnowflakeParticleData.startColor[2] = SnowflakeParticleData.startColor[2] * color.constant.z;
                        SnowflakeParticleData.startColor[3] = SnowflakeParticleData.startColor[3] * color.constant.w;
                        break;
                    case 2:
                        let colorRandom = NaN;
                        if (autoRandomSeed) {
                            colorRandom = Math.random();
                        } else {
                            rand.seed = randomSeeds[10];
                            colorRandom = rand.getFloat();
                            randomSeeds[10] = rand.seed;
                        }
                        let minConstantColor = color.constantMin;
                        let maxConstantColor = color.constantMax;
                        SnowflakeParticleData.startColor[0] = SnowflakeParticleData.startColor[0] * MathUtil.lerp(minConstantColor.x, maxConstantColor.x, colorRandom);
                        SnowflakeParticleData.startColor[1] = SnowflakeParticleData.startColor[1] * MathUtil.lerp(minConstantColor.y, maxConstantColor.y, colorRandom);
                        SnowflakeParticleData.startColor[2] = SnowflakeParticleData.startColor[2] * MathUtil.lerp(minConstantColor.z, maxConstantColor.z, colorRandom);
                        SnowflakeParticleData.startColor[3] = SnowflakeParticleData.startColor[3] * MathUtil.lerp(minConstantColor.w, maxConstantColor.w, colorRandom);
                        break;
                }
            }
            let particleSize = SnowflakeParticleData.startSize;
            switch (particleSystem.startSizeType) {
                case 0:
                    if (particleSystem.threeDStartSize) {
                        let startSizeConstantSeparate = particleSystem.startSizeConstantSeparate;
                        particleSize[0] = startSizeConstantSeparate.x;
                        particleSize[1] = startSizeConstantSeparate.y;
                        particleSize[2] = startSizeConstantSeparate.z;
                    } else {
                        particleSize[0] = particleSize[1] = particleSize[2] = particleSystem.startSizeConstant;
                    }
                    break;
                case 2:
                    if (particleSystem.threeDStartSize) {
                        let startSizeConstantMinSeparate = particleSystem.startSizeConstantMinSeparate;
                        let startSizeConstantMaxSeparate = particleSystem.startSizeConstantMaxSeparate;
                        if (autoRandomSeed) {
                            particleSize[0] = MathUtil.lerp(startSizeConstantMinSeparate.x, startSizeConstantMaxSeparate.x, Math.random());
                            particleSize[1] = MathUtil.lerp(startSizeConstantMinSeparate.y, startSizeConstantMaxSeparate.y, Math.random());
                            particleSize[2] = MathUtil.lerp(startSizeConstantMinSeparate.z, startSizeConstantMaxSeparate.z, Math.random());
                        } else {
                            rand.seed = randomSeeds[4];
                            particleSize[0] = MathUtil.lerp(startSizeConstantMinSeparate.x, startSizeConstantMaxSeparate.x, rand.getFloat());
                            particleSize[1] = MathUtil.lerp(startSizeConstantMinSeparate.y, startSizeConstantMaxSeparate.y, rand.getFloat());
                            particleSize[2] = MathUtil.lerp(startSizeConstantMinSeparate.z, startSizeConstantMaxSeparate.z, rand.getFloat());
                            randomSeeds[4] = rand.seed;
                        }
                    } else {
                        if (autoRandomSeed) {
                            particleSize[0] = particleSize[1] = particleSize[2] = MathUtil.lerp(particleSystem.startSizeConstantMin, particleSystem.startSizeConstantMax, Math.random());
                        } else {
                            rand.seed = randomSeeds[4];
                            particleSize[0] = particleSize[1] = particleSize[2] = MathUtil.lerp(particleSystem.startSizeConstantMin, particleSystem.startSizeConstantMax, rand.getFloat());
                            randomSeeds[4] = rand.seed;
                        }
                    }
                    break;
            }
            let sizeOverLifetime = particleSystem.sizeOverLifetime;
            if (sizeOverLifetime && sizeOverLifetime.enbale && sizeOverLifetime.size.type === 1) {
                let size = sizeOverLifetime.size;
                if (size.separateAxes) {
                    if (autoRandomSeed) {
                        particleSize[0] = particleSize[0] * MathUtil.lerp(size.constantMinSeparate.x, size.constantMaxSeparate.x, Math.random());
                        particleSize[1] = particleSize[1] * MathUtil.lerp(size.constantMinSeparate.y, size.constantMaxSeparate.y, Math.random());
                        particleSize[2] = particleSize[2] * MathUtil.lerp(size.constantMinSeparate.z, size.constantMaxSeparate.z, Math.random());
                    } else {
                        rand.seed = randomSeeds[11];
                        particleSize[0] = particleSize[0] * MathUtil.lerp(size.constantMinSeparate.x, size.constantMaxSeparate.x, rand.getFloat());
                        particleSize[1] = particleSize[1] * MathUtil.lerp(size.constantMinSeparate.y, size.constantMaxSeparate.y, rand.getFloat());
                        particleSize[2] = particleSize[2] * MathUtil.lerp(size.constantMinSeparate.z, size.constantMaxSeparate.z, rand.getFloat());
                        randomSeeds[11] = rand.seed;
                    }
                } else {
                    let randomSize = NaN;
                    if (autoRandomSeed) {
                        randomSize = MathUtil.lerp(size.constantMin, size.constantMax, Math.random());
                    } else {
                        rand.seed = randomSeeds[11];
                        randomSize = MathUtil.lerp(size.constantMin, size.constantMax, rand.getFloat());
                        randomSeeds[11] = rand.seed;
                    }
                    particleSize[0] = particleSize[0] * randomSize;
                    particleSize[1] = particleSize[1] * randomSize;
                    particleSize[2] = particleSize[2] * randomSize;
                }
            }
            let renderMode = particleRender.renderMode;
            if (renderMode !== 1) {
                switch (particleSystem.startRotationType) {
                    case 0:
                        if (particleSystem.threeDStartRotation) {
                            let startRotationConstantSeparate = particleSystem.startRotationConstantSeparate;
                            let randomRotationE = SnowflakeParticleData._tempVector30.elements;
                            SnowflakeParticleUtils._randomInvertRoationArray(startRotationConstantSeparate.elements, randomRotationE, particleSystem.randomizeRotationDirection, autoRandomSeed ? null : rand, randomSeeds);
                            SnowflakeParticleData.startRotation[0] = randomRotationE[0];
                            SnowflakeParticleData.startRotation[1] = randomRotationE[1];
                            if (renderMode !== 4)
                                SnowflakeParticleData.startRotation[2] = -randomRotationE[2];
                            else
                                SnowflakeParticleData.startRotation[2] = randomRotationE[2];
                        } else {
                            SnowflakeParticleData.startRotation[0] = SnowflakeParticleUtils._randomInvertRoation(particleSystem.startRotationConstant, particleSystem.randomizeRotationDirection, autoRandomSeed ? null : rand, randomSeeds);
                        }
                        break;
                    case 2:
                        if (particleSystem.threeDStartRotation) {
                            let startRotationConstantMinSeparate = particleSystem.startRotationConstantMinSeparate;
                            let startRotationConstantMaxSeparate = particleSystem.startRotationConstantMaxSeparate;
                            let lerpRoationE = SnowflakeParticleData._tempVector30.elements;
                            if (autoRandomSeed) {
                                lerpRoationE[0] = MathUtil.lerp(startRotationConstantMinSeparate.x, startRotationConstantMaxSeparate.x, Math.random());
                                lerpRoationE[1] = MathUtil.lerp(startRotationConstantMinSeparate.y, startRotationConstantMaxSeparate.y, Math.random());
                                lerpRoationE[2] = MathUtil.lerp(startRotationConstantMinSeparate.z, startRotationConstantMaxSeparate.z, Math.random());
                            } else {
                                rand.seed = randomSeeds[5];
                                lerpRoationE[0] = MathUtil.lerp(startRotationConstantMinSeparate.x, startRotationConstantMaxSeparate.x, rand.getFloat());
                                lerpRoationE[1] = MathUtil.lerp(startRotationConstantMinSeparate.y, startRotationConstantMaxSeparate.y, rand.getFloat());
                                lerpRoationE[2] = MathUtil.lerp(startRotationConstantMinSeparate.z, startRotationConstantMaxSeparate.z, rand.getFloat());
                                randomSeeds[5] = rand.seed;
                            }
                            SnowflakeParticleUtils._randomInvertRoationArray(lerpRoationE, lerpRoationE, particleSystem.randomizeRotationDirection, autoRandomSeed ? null : rand, randomSeeds);
                            SnowflakeParticleData.startRotation[0] = lerpRoationE[0];
                            SnowflakeParticleData.startRotation[1] = lerpRoationE[1];
                            if (renderMode !== 4)
                                SnowflakeParticleData.startRotation[2] = -lerpRoationE[2];
                            else
                                SnowflakeParticleData.startRotation[2] = lerpRoationE[2];
                        } else {
                            if (autoRandomSeed) {
                                SnowflakeParticleData.startRotation[0] = SnowflakeParticleUtils._randomInvertRoation(MathUtil.lerp(particleSystem.startRotationConstantMin, particleSystem.startRotationConstantMax, Math.random()), particleSystem.randomizeRotationDirection, autoRandomSeed ? null : rand, randomSeeds);
                            } else {
                                rand.seed = randomSeeds[5];
                                SnowflakeParticleData.startRotation[0] = SnowflakeParticleUtils._randomInvertRoation(MathUtil.lerp(particleSystem.startRotationConstantMin, particleSystem.startRotationConstantMax, rand.getFloat()), particleSystem.randomizeRotationDirection, autoRandomSeed ? null : rand, randomSeeds);
                                randomSeeds[5] = rand.seed;
                            }
                        }
                        break;
                }
            }
            switch (particleSystem.startLifetimeType) {
                case 0:
                    SnowflakeParticleData.startLifeTime = particleSystem.startLifetimeConstant;
                    break;
                case 1:
                    SnowflakeParticleData.startLifeTime = SnowflakeParticleUtils._getStartLifetimeFromGradient(particleSystem.startLifeTimeGradient, particleSystem.emissionTime);
                    break;
                case 2:
                    if (autoRandomSeed) {
                        SnowflakeParticleData.startLifeTime = MathUtil.lerp(particleSystem.startLifetimeConstantMin, particleSystem.startLifetimeConstantMax, Math.random());
                    } else {
                        rand.seed = randomSeeds[7];
                        SnowflakeParticleData.startLifeTime = MathUtil.lerp(particleSystem.startLifetimeConstantMin, particleSystem.startLifetimeConstantMax, rand.getFloat());
                        randomSeeds[7] = rand.seed;
                    }
                    break;
                case 3:
                    let emissionTime = particleSystem.emissionTime;
                    if (autoRandomSeed) {
                        SnowflakeParticleData.startLifeTime = MathUtil.lerp(SnowflakeParticleUtils._getStartLifetimeFromGradient(particleSystem.startLifeTimeGradientMin, emissionTime), SnowflakeParticleUtils._getStartLifetimeFromGradient(particleSystem.startLifeTimeGradientMax, emissionTime), Math.random());
                    } else {
                        rand.seed = randomSeeds[7];
                        SnowflakeParticleData.startLifeTime = MathUtil.lerp(SnowflakeParticleUtils._getStartLifetimeFromGradient(particleSystem.startLifeTimeGradientMin, emissionTime), SnowflakeParticleUtils._getStartLifetimeFromGradient(particleSystem.startLifeTimeGradientMax, emissionTime), rand.getFloat());
                        randomSeeds[7] = rand.seed;
                    }
                    break;
            }
            switch (particleSystem.startSpeedType) {
                case 0:
                    SnowflakeParticleData.startSpeed = particleSystem.startSpeedConstant;
                    break;
                case 2:
                    if (autoRandomSeed) {
                        SnowflakeParticleData.startSpeed = MathUtil.lerp(particleSystem.startSpeedConstantMin, particleSystem.startSpeedConstantMax, Math.random());
                    } else {
                        rand.seed = randomSeeds[8];
                        SnowflakeParticleData.startSpeed = MathUtil.lerp(particleSystem.startSpeedConstantMin, particleSystem.startSpeedConstantMax, rand.getFloat());
                        randomSeeds[8] = rand.seed;
                    }
                    break;
            }
            let textureSheetAnimation = particleSystem.textureSheetAnimation;
            let enableSheetAnimation = textureSheetAnimation && textureSheetAnimation.enable;
            if (enableSheetAnimation) {
                let title = textureSheetAnimation.tiles;
                let titleX = title.x, titleY = title.y;
                let subU = 1.0 / titleX, subV = 1.0 / titleY;
                let startFrameCount = 0;
                let startFrame = textureSheetAnimation.startFrame;
                switch (startFrame.type) {
                    case 0:
                        startFrameCount = startFrame.constant;
                        break;
                    case 1:
                        if (autoRandomSeed) {
                            startFrameCount = MathUtil.lerp(startFrame.constantMin, startFrame.constantMax, Math.random());
                        } else {
                            rand.seed = randomSeeds[14];
                            startFrameCount = MathUtil.lerp(startFrame.constantMin, startFrame.constantMax, rand.getFloat());
                            randomSeeds[14] = rand.seed;
                        }
                        break;
                }
                let frame = textureSheetAnimation.frame;
                switch (frame.type) {
                    case 0:
                        startFrameCount += frame.constant;
                        break;
                    case 2:
                        if (autoRandomSeed) {
                            startFrameCount += MathUtil.lerp(frame.constantMin, frame.constantMax, Math.random());
                        } else {
                            rand.seed = randomSeeds[15];
                            startFrameCount += MathUtil.lerp(frame.constantMin, frame.constantMax, rand.getFloat());
                            randomSeeds[15] = rand.seed;
                        }
                        break;
                }
                let startRow = 0;
                switch (textureSheetAnimation.type) {
                    case 0:
                        startRow = Math.floor(startFrameCount / titleX);
                        break;
                    case 1:
                        if (textureSheetAnimation.randomRow) {
                            if (autoRandomSeed) {
                                startRow = Math.floor(Math.random() * titleY);
                            } else {
                                rand.seed = randomSeeds[13];
                                startRow = Math.floor(rand.getFloat() * titleY);
                                randomSeeds[13] = rand.seed;
                            }
                        } else {
                            startRow = textureSheetAnimation.rowIndex;
                        }
                        break;
                }
                let startCol = Math.floor(startFrameCount % titleX);
                // SnowflakeParticleData.startUVInfo = SnowflakeParticleData.startUVInfo;
                // SnowflakeParticleData.startUVInfo[0] = subU;
                // SnowflakeParticleData.startUVInfo[1] = subV;
                // SnowflakeParticleData.startUVInfo[2] = startCol * subU;
                // SnowflakeParticleData.startUVInfo[3] = startRow * subV;

                let startUVInfo = SnowflakeParticleData.startUVInfo;
                startUVInfo[0] = subU;
                startUVInfo[1] = subV;
                startUVInfo[2] = startCol * subU;
                startUVInfo[3] = startRow * subV;
            } else {
                // SnowflakeParticleData.startUVInfo = SnowflakeParticleData.startUVInfo;
                // SnowflakeParticleData.startUVInfo[0] = 1.0;
                // SnowflakeParticleData.startUVInfo[1] = 1.0;
                // SnowflakeParticleData.startUVInfo[2] = 0.0;
                // SnowflakeParticleData.startUVInfo[3] = 0.0;

                let startUVInfo = SnowflakeParticleData.startUVInfo;
                startUVInfo[0] = 1.0;
                startUVInfo[1] = 1.0;
                startUVInfo[2] = 0.0;
                startUVInfo[3] = 0.0;
            }
            switch (particleSystem.simulationSpace) {
                case 0:
                    // let positionE = transform.position.elements;
                    // SnowflakeParticleData.simulationWorldPostion[0] = positionE[0];
                    // SnowflakeParticleData.simulationWorldPostion[1] = positionE[1];
                    // SnowflakeParticleData.simulationWorldPostion[2] = positionE[2];
                    SnowflakeParticleData.simulationWorldPostion.set(transform.position.elements);
                    // let rotationE = transform.rotation.elements;
                    // SnowflakeParticleData.simulationWorldRotation[0] = rotationE[0];
                    // SnowflakeParticleData.simulationWorldRotation[1] = rotationE[1];
                    // SnowflakeParticleData.simulationWorldRotation[2] = rotationE[2];
                    // SnowflakeParticleData.simulationWorldRotation[3] = rotationE[3];
                    SnowflakeParticleData.simulationWorldRotation.set(transform.rotation.elements);
                    break;
                case 1:
                    break;
                default :
                    throw new Error("SnowflakeParticleMaterial: SimulationSpace value is invalid.");
                    break;
            }
        }
    }
}