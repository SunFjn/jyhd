declare type uint8 = number;
declare type uint16 = number;
declare type uint32 = number;
declare type uint64 = number;

declare type int8 = number;
declare type int16 = number;
declare type int32 = number;
declare type int64 = number;

declare type int = number;
declare type uint = number;

declare type float32 = number;
declare type float64 = number;

declare type uint10 = number;
declare type uint12 = number;
declare type uint31 = number;
declare type uint53 = number;

declare type TeamId = number;
declare type ItemId = number;
declare type PackageId = number;
declare type Uid = number;
declare type TaskId = string;
declare type AgentId = number;
declare type Uuid = string;

interface Table<T> {
    [key: string]: T;
}

interface Pair<T1, T2> {
    first: T1;
    second: T2;
}

interface PlatformGroup {
    platform: number;
    group: number;
}

interface Point {
    x: number;
    y: number;
}