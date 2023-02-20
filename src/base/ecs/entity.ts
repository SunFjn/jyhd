///<reference path="message_dispatcher.ts"/>
///<reference path="entity_component.ts"/>

namespace base.ecs {
    import Dictionary = Laya.Dictionary;

    type Spawner<T, E extends Entity<T>, C extends EntityComponent<T, E>, U extends any[]> = { new(owner: E, ...args: U): C };

    export class Entity<T> extends MessageDispatcher<T> {
        private _components: Dictionary;
        private _isEnter: boolean;
        private _isValid: boolean;

        constructor() {
            super();
            this._components = new Dictionary();
            this._isEnter = false;
            this._isValid = true;
        }

        public get isEnter(): boolean {
            return this._isEnter;
        }

        public get isValid(): boolean {
            return this._isEnter && this._isValid;
        }

        public enter(): void {
            if (this._isEnter) {
                return;
            }
            this._isEnter = true;

            let values: EntityComponent<T, this>[] = this._components.values;
            for (let c of values) {
                c.setup();
            }
        }

        public leave(): void {
            if (!this._isEnter) {
                return;
            }
            this._isEnter = false;

            let values: EntityComponent<T, this>[] = this._components.values;
            for (let c of values) {
                c.teardown();
            }
        }

        public update(): void {
            if (!this._isEnter) {
                return;
            }

            let values = this._components.values;
            for (let c of values) {
                if (c.update != null) {
                    c.update();
                }
            }
        }

        public destory(): void {
            this._isValid = false;
            if (this._components != null) {
                let values: EntityComponent<T, this>[] = this._components.values;
                if (this._isEnter) {
                    for (let c of values) {
                        c.teardown();
                    }
                }

                for (let c of values) {
                    c.destory();
                }
                this._components.clear();
                this._components = null;
                this._isEnter = false;
            }
            this.offAll();
        }

        public addComponent<C extends EntityComponent<T, this>, U extends any[]>(spawner: Spawner<T, this, C, U>, ...args: U): C {
            let c: C = this._components.get(spawner);
            if (c != null) {
                throw new Error();
            }

            c = new spawner(this, ...args);
            this._components.set(spawner, c);

            if (this._isEnter) {
                c.setup();
            }

            return c;
        }

        public getComponent<C extends EntityComponent<T, this>, U extends any[]>(spawner: Spawner<T, this, C, U>): C {
            return this._components.get(spawner);
        }

        public removeComponent<C extends EntityComponent<T, this>, U extends any[]>(spawner: Spawner<T, this, C, U>): boolean {
            let c: C = this._components.get(spawner);
            if (c != null) {
                if (this._isEnter) {
                    c.teardown();
                }
                c.destory();
                this._components.remove(spawner);
            }
            return c != null;
        }
    }
}