namespace base.ecs {
    import EventDispatcher = Laya.EventDispatcher;

    type Arrayable<T> = T extends any[] ? T : never;

    type MessageListener<T extends any[]> = (...args: T) => void;

    export class MessageDispatcher<T> {
        private _core: EventDispatcher;

        constructor() {
            this._core = new EventDispatcher();
        }

        public hasListener<K extends keyof T & string>(type: K): boolean {
            return this._core.hasListener(type);
        }

        public publish<K extends keyof T & string>(type: K, ...args: Arrayable<T[K]>): boolean {
            return this._core.event(type, args);
        }

        public on<K extends keyof T & string>(type: K, caller: any, listener: MessageListener<Arrayable<T[K]>>): this {
            this._core.on(type, caller, listener);
            return this;
        }

        public once<C, K extends keyof T & string>(type: K, caller: C, listener: MessageListener<Arrayable<T[K]>>): this {
            this._core.once(type, caller, listener);
            return this;
        }

        public off<C, K extends keyof T & string>(type: K, caller: C, listener: MessageListener<Arrayable<T[K]>>, onceOnly?: boolean): this {
            this._core.off(type, caller, listener, onceOnly);
            return this;
        }

        public offAll<K extends keyof T & string>(type?: K): this {
            this._core.offAll(type);
            return this;
        }
    }
}