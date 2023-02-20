namespace base.ecs {
    export abstract class EntityComponent<T, E extends Entity<T>> {
        public readonly owner: E;

        protected constructor(owner: E) {
            this.owner = owner;
        }

        public abstract setup(): void;

        public abstract teardown(): void;

        public abstract destory(): void;
    }
}