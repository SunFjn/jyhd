declare namespace game.ai.behavior {
    const enum BehaviorStatus {
        Ready,
        Success,
        Failure,
        Running
    }

    interface Condition {
        check(): boolean;

        reset(): void;
    }
}
