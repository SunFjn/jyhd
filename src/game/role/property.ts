namespace game.role {
    import EventDispatcher = Laya.EventDispatcher;
    import Point = Laya.Point;
    import Transform3D = Laya.Transform3D;
    import BatchElement = base.mesh.BatchElement;


    interface PropertyFields {
        id: number;
        type: RoleType;
        name: string;
        transform: Transform3D;
        occ: number;

        hp: [number, number];
        speed: number
        exterior: [number, number, number, number, number, number, number];
        pet: [number, number];
        status: RoleState;
        pos: Point;
        desPos: Point;
        moveType: number;
        spawnpoint: number;
        battle: [number, number];
        avatar: RoleAvatar;
        avatarSK: SkeletonComponent;    // 2D龙骨动画
        petSK: SkeletonComponent;       // 存放当前玩家的宠物龙骨的引用
        actorState: number;
        direction: number;
        defaultSKDirection: -1 | 1;  // 龙骨默认方向 -1 向左  1向右
        lastEnemy: number;
        showType: number;
        destroyed: boolean;
        liveTime: number;
        own: number;
        shadow: BatchElement;
        petContext: Role;
        level: number;
        desgnation: number;
        factionName: string;
        factionId: string;
        rise: number;
        headId: number;//头像Id

        fightTeamId: string;
        fightTeamName: string;

        shadow2D: Laya.Image;
        isPet: boolean;
        /** 宠物实时数据 [id,是否为远程,寻路半径,近战攻击半径]*/
        petCurrentData: [number, boolean, number, number];
        /** 宠物实时数据 [id,是否为远程,寻路半径,近战攻击半径]*/
        dollCurrentData: [number, boolean, number, number];

        delayDeath: boolean;
        levitation: boolean; // 浮空状态
        skipRevenge: boolean; // 忽略复仇

        debug: [[number, number], [number, number], [number, number]]


    }

    export class Property extends EventDispatcher {
        private _fields: Table<any> = {};

        public reset(): void {
            this.offAll();
            this._fields = {};
        }

        public set<K extends keyof PropertyFields & string>(fields: K, value: PropertyFields[K]): PropertyFields[K] {
            if (this._fields[fields] == value) {
                return value;
            }
            this._fields[fields] = value;
            this.event(fields, value);
            return value;
        }

        public get<K extends keyof PropertyFields & string>(fields: K): PropertyFields[K] {
            return this._fields[fields];
        }

        public has<K extends keyof PropertyFields & string>(fields: K): boolean {
            return this._fields[fields] !== undefined;
        }

    }
}
