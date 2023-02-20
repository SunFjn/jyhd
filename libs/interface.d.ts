/** 单元项渲染器接口*/
declare namespace modules.common {
    interface IItemRender {
        selected: boolean;
    }
}

declare namespace base.mesh {
    interface BatchElement {
        width: number;
        height: number;
        uvs: Array<number>;
        matrix: Laya.Matrix4x4;
    }

    interface BatchLiteralElement {
        sizes: Array<number>;
        uvs: Array<number>;
        scale: Laya.Vector3;
        offset: Laya.Vector3;
        alpha: number;
        // align: number;
    }

    type GeometryElement = [string, string, [string, string, boolean, boolean, number]];

    interface JsonElement {
        name: string;
        geometry?: Array<GeometryElement>;
        skeleton?: [string, string];
    }

    interface ChildrenElement extends JsonElement {
        parent?: [string, string];
    }

    interface MeshElement extends JsonElement {
        children?: Array<ChildrenElement>;
        group?: Table<Table<Array<[string, string]>>>;
    }

    interface AvatarData {
        config: MeshElement;
        res: Table<any>;
    }
}

declare namespace utils.collections {
    interface HeapElement {
        pointer: int32;
    }
}

declare namespace game.world {
    import Entity = base.ecs.Entity;
    import EntityComponent = base.ecs.EntityComponent;
    import BatchElement = base.mesh.BatchElement;
    import Sprite = Laya.Sprite;
    import Sprite3D = Laya.Sprite3D;
    import Vector3 = Laya.Vector3;
    import LocomotorComponent = game.role.component.LocomotorComponent;
    import Items = Protocols.Items;
    import Role = game.role.Role;
    import Property = game.role.Property;

    import SkeletonPlaybackRateFactor = role.SkeletonPlaybackRateFactor;
    interface WorldMessage {
        addToLayer: [LayerType, Sprite];
        addToRootLayer: [LayerType, Sprite3D];
        stageResize: [number, number];
        // 2D: 横版2D代码片段,加载2D龙骨资源!;
        launchEffect: [RoleType, number, string, Laya.Point, number, number, any?];
        // 3D: 横版3D注释代码片段-使用3D时放开且关闭2D代码即可!;
        // launchEffect: [number, string, Vector3, number];

        fightingTips: [uint, number, Laya.Point, TipsFlags, number, number];
        shakeCamera: [boolean, number];
        follow: [LocomotorComponent, boolean?];
        castShadow: [boolean, BatchElement];
        enterScene: [number];
        leaveScene: [];
        updateTianguan: []; // 天关变换没有离开场景消息 按需添加
        loadMapComplete: [];
        addToHUD: [Sprite];
        updateDropItems: [number, number, Array<Items>, number];
        enterMaster: [Role];
        setPlayRate: [LayerType[], Array<SkeletonPlaybackRateFactor>]
        castShadow2D: [boolean, number, Property];
        castHalo: [boolean, Property];

        woundTips: [Property, Laya.Point];
        removeDeadSkillEffect: [number];
        playBossdeath: [Laya.Point]
        setTransformDoorActive: [boolean, Laya.Point?]

        stageClick: [number, number];
        playWarning: [boolean];
        updateSet: [];
    }

    type World = Entity<WorldMessage>;
    type WorldComponent = EntityComponent<WorldMessage, World>;
}

declare namespace game.role {
    interface RoleMessage {
        useSkill: [number, number, boolean]; // id目标 skill释放技能 is立即发送目标
        death: [];
        leave: [number];
        strike: [Role, number, boolean]; // 受击消息[攻击者,技能id,true 忽略受击动画播放]
        updateTitle: [string];
        flare: [];
        fade: [];
        setCoordinate: [number, number];
        moveOver: [];
        hurt: [number, number, number, TipsFlags, number];
        transmit: [number, number];
        combatComplete: [];
        abnormal: [number];
        sprint: [boolean];
        reviveReply: [number];
        trigger: [];
        visible: [boolean];
        shiftMsg: [number, number] // 受击效果 0 1 击退击飞 参数
    }
}

declare namespace base.background {
    export interface IActor {
        registerOpcode(type: uint, command: new () => ActorCommand): void;

        addCommandHandler(type: uint, handler: Function): void;

        removeCommandHandler(type: uint, handler: Function): void;

        sendCommand(command: ActorCommand): void;
    }
}

declare namespace utils {
    interface WordNode {
        readonly leaf: boolean;
        readonly children: Table<WordNode>;
    }
}

declare namespace base.particle.snowflake {
    export const enum SnowflakeBundleType {
        MyShuriKenParticle3D = "MyShuriKenParticle3D",
        Sprite3D = "Sprite3D",
    }

    export const enum MaterialType {
        MyShurikenParticleMaterial = "MyShurikenParticleMaterial",
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
        layer?: number;
        translate?: number[];
        rotation?: number[];
        scale?: number[];
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
        gradientMin: ColorGradient;
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

    export enum EmissionRateTip {
        Time = "Time",
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
}

interface Disposable {
    dispose(): void;
}

interface Destroyable {
    destroy(all?: boolean): void;
}