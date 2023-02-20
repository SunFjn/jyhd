declare const enum SnowflakeBundleType {
    MyShuriKenParticle3D = "MyShuriKenParticle3D",
    Sprite3D = "Sprite3D",
}

declare const enum MaterialType {
    MyShurikenParticleMaterial = "MyShurikenParticleMaterial",
}

declare const enum EmissionRateTip {
    Time = "Time",
}

export interface SnowflakeBundle {
    type: SnowflakeBundleType;
    props: Props;
    customProps: SnowflakeCustomProps;
    components: Components;
    child: SnowflakeBundle[];
}

export interface Components {
}

export interface SnowflakeCustomProps {
    layer: number;
    translate: number[];
    rotation: number[];
    scale: number[];
    isPerformanceMode?: boolean;
    duration?: number;
    looping?: boolean;
    prewarm?: boolean;
    startDelayType?: number;
    startDelay?: number;
    startDelayMin?: number;
    startDelayMax?: number;
    startLifetimeType?: number;
    startLifetimeConstant?: number;
    startLifetimeConstantMin?: number;
    startLifetimeConstantMax?: number;
    startLifetimeGradient?: StartLifetimeGradient;
    startLifetimeGradientMin?: StartLifetimeGradient;
    startLifetimeGradientMax?: StartLifetimeGradient;
    startSpeedType?: number;
    startSpeedConstant?: number;
    startSpeedConstantMin?: number;
    startSpeedConstantMax?: number;
    threeDStartSize?: boolean;
    startSizeType?: number;
    startSizeConstant?: number;
    startSizeConstantMin?: number;
    startSizeConstantMax?: number;
    startSizeConstantSeparate?: number[];
    startSizeConstantMinSeparate?: number[];
    startSizeConstantMaxSeparate?: number[];
    threeDStartRotation?: boolean;
    startRotationType?: number;
    startRotationConstant?: number;
    startRotationConstantMin?: number;
    startRotationConstantMax?: number;
    startRotationConstantSeparate?: number[];
    startRotationConstantMinSeparate?: number[];
    startRotationConstantMaxSeparate?: number[];
    randomizeRotationDirection?: number;
    startColorType?: number;
    startColorConstant?: number[];
    startColorConstantMin?: number[];
    startColorConstantMax?: number[];
    gravity?: number[];
    gravityModifier?: number;
    simulationSpace?: number;
    scaleMode?: number;
    playOnAwake?: boolean;
    maxParticles?: number;
    autoRandomSeed?: boolean;
    randomSeed?: number;
    emission?: Emission;
    shape?: Shape;
    colorOverLifetime?: ColorOverLifetime;
    sizeOverLifetime?: SizeOverLifetime;
    renderMode?: number;
    stretchedBillboardCameraSpeedScale?: number;
    stretchedBillboardSpeedScale?: number;
    stretchedBillboardLengthScale?: number;
    sortingFudge?: number;
    material?: Material;
    materialPath?: string;
    texturePath?: string;
    meshPath?: string;
    textureSheetAnimation?: TextureSheetAnimation;
    rotationOverLifetime?: RotationOverLifetime;
    velocityOverLifetime?: VelocityOverLifetime;
}

export interface ColorOverLifetime {
    enable: boolean;
    color: Color;
}

export interface Color {
    type: number;
    constant: number[];
    gradient: ColorGradient;
    constantMin: number[];
    constantMax: number[];
    gradientMax: ColorGradient;
}

export interface ColorGradient {
    alphas: Alpha[];
    rgbs: RGB[];
}

export interface Alpha {
    key: number;
    value: number;
}

export interface RGB {
    key: number;
    value: number[];
}

export interface Emission {
    enable: boolean;
    emissionRate: number;
    emissionRateTip: EmissionRateTip;
    bursts: Burst[];
}

export interface Burst {
    time: number;
    min: number;
    max: number;
}

export interface Material {
    type: MaterialType;
    path: string;
}

export interface RotationOverLifetime {
    enable: boolean;
    angularVelocity: AngularVelocity;
}

export interface AngularVelocity {
    type: number;
    separateAxes: boolean;
    constant: number;
    constantMin: number;
    constantMax: number;
    constantMinSeparate: number[];
    constantMaxSeparate: number[];
    gradient: PurpleGradient;
    gradientX: PurpleGradient;
    gradientY: PurpleGradient;
    gradientZ: PurpleGradient;
    gradientMin: PurpleGradient;
    gradientMax: PurpleGradient;
    gradientXMin: PurpleGradient;
    gradientXMax: PurpleGradient;
    gradientYMin: PurpleGradient;
    gradientYMax: PurpleGradient;
    gradientZMin: PurpleGradient;
    gradientZMax: PurpleGradient;
}

export interface PurpleGradient {
    angularVelocitys: any[];
}

export interface Shape {
    enable: boolean;
    shapeType: number;
    sphereRadius: number;
    sphereEmitFromShell: boolean;
    sphereRandomDirection: number;
    hemiSphereRadius: number;
    hemiSphereEmitFromShell: boolean;
    hemiSphereRandomDirection: number;
    coneAngle: number;
    coneRadius: number;
    coneLength: number;
    coneEmitType: number;
    coneRandomDirection: number;
    boxX: number;
    boxY: number;
    boxZ: number;
    boxRandomDirection: number;
    circleRadius: number;
    circleArc: number;
    circleEmitFromEdge: boolean;
    circleRandomDirection: number;
}

export interface SizeOverLifetime {
    enable: boolean;
    size: Size;
}

export interface Size {
    type: number;
    separateAxes: boolean;
    gradient: FluffyGradient;
    gradientX: FluffyGradient;
    gradientY: FluffyGradient;
    gradientZ: FluffyGradient;
    constantMin: number;
    constantMax: number;
    constantMinSeparate: number[];
    constantMaxSeparate: number[];
    gradientMin: FluffyGradient;
    gradientMax: FluffyGradient;
    gradientXMin: FluffyGradient;
    gradientXMax: FluffyGradient;
    gradientYMin: FluffyGradient;
    gradientYMax: FluffyGradient;
    gradientZMin: FluffyGradient;
    gradientZMax: FluffyGradient;
}

export interface FluffyGradient {
    sizes: Alpha[];
}

export interface StartLifetimeGradient {
    startLifetimes: any[];
}

export interface TextureSheetAnimation {
    enable: boolean;
    tiles: number[];
    type: number;
    randomRow: boolean;
    rowIndex: number;
    frame: Frame;
    startFrame: StartFrame;
    cycles: number;
    enableUVChannels: number;
    enableUVChannelsTip: string;
}

export interface Frame {
    type: number;
    constant: number;
    overTime: OverTime;
    constantMin: number;
    constantMax: number;
    overTimeMin: OverTime;
    overTimeMax: OverTime;
}

export interface OverTime {
    frames: Alpha[];
}

export interface StartFrame {
    type: number;
    constant: number;
    constantMin: number;
    constantMax: number;
}

export interface VelocityOverLifetime {
    enable: boolean;
    space: number;
    velocity: Velocity;
}

export interface Velocity {
    type: number;
    constant: number[];
    gradientX: Gradient;
    gradientY: Gradient;
    gradientZ: Gradient;
    constantMin: number[];
    constantMax: number[];
    gradientXMin: Gradient;
    gradientXMax: Gradient;
    gradientYMin: Gradient;
    gradientYMax: Gradient;
    gradientZMin: Gradient;
    gradientZMax: Gradient;
}

export interface Gradient {
    velocitys: Alpha[];
}

export interface Props {
    isStatic: boolean;
    name: string;
}
