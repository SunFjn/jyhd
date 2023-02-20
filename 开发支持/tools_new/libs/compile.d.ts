export const enum DataType {
    Dummy = 0,
    Json = 0x01,
    Msgpack = 0x02,
    All = Json | Msgpack
}

export const enum AssignType {
    Value,
    Type,
    Null
}

export const enum MetaType {
    string = "string",
    number = "number",
    boolean = "boolean",
    buffer = "Uint8Array",
    array = "Array",
    table = "Object",
    tuple = "tuple",
}

export interface TypeMeta {
    type: MetaType;
    class: string;
    source: (exportType?: DataType) => string;
}

export interface BuiltinMeta extends TypeMeta {
    (name: string, comment?: string, exportType?: DataType, assignType?: AssignType): VarMeta;
}

export interface ArrayTypeMeta extends TypeMeta {
    (name: string, comment?: string, exportType?: DataType, assignType?: AssignType): VarMeta;

    element: TypeMeta;
}

export interface TableTypeMeta extends TypeMeta {
    (name: string, comment?: string, exportType?: DataType, assignType?: AssignType): VarMeta;

    value: TypeMeta;
}

export interface TupleTypeMeta extends TypeMeta {
    (name: string, comment?: string, exportType?: DataType, assignType?: AssignType): VarMeta;

    fields: Array<VarMeta>;
    comment: string;
}

export interface VarMeta {
    type: MetaType;
    name: string;
    comment: string;
    meta: TypeMeta;
    assignType: AssignType;
    exportType: DataType;
}

export const enum FileType {
    tuple = 0,
    array = 1,
    hash = 2,
}
