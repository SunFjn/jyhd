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


interface Table<T> {
    [key: string]: T;
}
