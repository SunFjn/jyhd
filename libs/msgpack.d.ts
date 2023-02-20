declare module msgpack {
    function encode(value: any): Uint8Array;

    function decode(buffer: Uint8Array): any;
}