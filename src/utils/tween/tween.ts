/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 *
 * 基于tween.js修改
 */
///<reference path="../array_utils.ts"/>

namespace utils.tween {
    export namespace easing {
        export namespace linear {
            export function None(k: number): number {
                return k;
            }
        }

        export namespace quadratic {
            export function In(k: number): number {
                return k * k;
            }

            export function Out(k: number): number {
                return k * (2 - k);
            }

            export function InOut(k: number): number {
                if ((k *= 2) < 1) {
                    return 0.5 * k * k;
                }
                return -0.5 * (--k * (k - 2) - 1);
            }
        }

        export namespace cubic {
            export function In(k: number): number {
                return k * k * k;
            }

            export function Out(k: number): number {
                return --k * k * k + 1;
            }

            export function InOut(k: number): number {
                if ((k *= 2) < 1) {
                    return 0.5 * k * k * k;
                }
                return 0.5 * ((k -= 2) * k * k + 2);
            }
        }

        export namespace quartic {
            export function In(k: number): number {
                return k * k * k * k;
            }

            export function Out(k: number): number {
                return 1 - (--k * k * k * k);
            }

            export function InOut(k: number): number {
                if ((k *= 2) < 1) {
                    return 0.5 * k * k * k * k;
                }
                return -0.5 * ((k -= 2) * k * k * k - 2);
            }
        }

        export namespace quintic {
            export function In(k: number): number {
                return k * k * k * k * k;
            }

            export function Out(k: number): number {
                return --k * k * k * k * k + 1;
            }

            export function InOut(k: number): number {
                if ((k *= 2) < 1) {
                    return 0.5 * k * k * k * k * k;
                }
                return 0.5 * ((k -= 2) * k * k * k * k + 2);
            }
        }

        export namespace sinusoidal {
            export function In(k: number): number {
                return 1 - Math.cos(k * Math.PI / 2);
            }

            export function Out(k: number): number {
                return Math.sin(k * Math.PI / 2);
            }

            export function InOut(k: number): number {
                return 0.5 * (1 - Math.cos(Math.PI * k));
            }
        }

        export namespace exponential {
            export function In(k: number): number {
                return k === 0 ? 0 : Math.pow(1024, k - 1);
            }

            export function Out(k: number): number {
                return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
            }

            export function InOut(k: number): number {
                if (k === 0) {
                    return 0;
                }
                if (k === 1) {
                    return 1;
                }
                if ((k *= 2) < 1) {
                    return 0.5 * Math.pow(1024, k - 1);
                }
                return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
            }
        }

        export namespace circular {
            export function In(k: number): number {
                return 1 - Math.sqrt(1 - k * k);
            }

            export function Out(k: number): number {
                return Math.sqrt(1 - (--k * k));
            }

            export function InOut(k: number): number {
                if ((k *= 2) < 1) {
                    return -0.5 * (Math.sqrt(1 - k * k) - 1);
                }
                return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
            }
        }

        export namespace elastic {
            export function In(k: number): number {
                if (k === 0) {
                    return 0;
                }
                if (k === 1) {
                    return 1;
                }
                return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
            }

            export function Out(k: number): number {
                if (k === 0) {
                    return 0;
                }
                if (k === 1) {
                    return 1;
                }
                return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
            }

            export function InOut(k: number): number {
                if (k === 0) {
                    return 0;
                }
                if (k === 1) {
                    return 1;
                }
                k *= 2;
                if (k < 1) {
                    return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
                }
                return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
            }
        }

        export namespace back {
            export function In(k: number): number {
                let s = 1.70158;
                return k * k * ((s + 1) * k - s);
            }

            export function Out(k: number): number {
                let s = 1.70158;
                return --k * k * ((s + 1) * k + s) + 1;
            }

            export function InOut(k: number): number {
                let s = 1.70158 * 1.525;
                if ((k *= 2) < 1) {
                    return 0.5 * (k * k * ((s + 1) * k - s));
                }
                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
            }
        }

        export namespace bounce {
            export function In(k: number): number {
                return Out(1 - k);
            }

            export function Out(k: number): number {
                if (k < (1 / 2.75)) {
                    return 7.5625 * k * k;
                } else if (k < (2 / 2.75)) {
                    return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                } else if (k < (2.5 / 2.75)) {
                    return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                } else {
                    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                }
            }

            export function InOut(k: number): number {
                if (k < 0.5) {
                    return In(k * 2) * 0.5;
                }
                return Out(k * 2 - 1) * 0.5 + 0.5;
            }
        }
    }

    export namespace interpolation {
        export function Linear(v: number[], k: number): number {
            let m = v.length - 1;
            let f = m * k;
            let i = Math.floor(f);
            let fn = helperLinear;

            if (k < 0) {
                return fn(v[0], v[1], f);
            }

            if (k > 1) {
                return fn(v[m], v[m - 1], m - f);
            }

            return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
        }

        export function Bezier(v: number[], k: number): number {
            let b = 0;
            let n = v.length - 1;
            let pw = Math.pow;
            let bn = helperBernstein;

            for (let i = 0; i <= n; i++) {
                b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
            }

            return b;
        }

        export function CatmullRom(v: number[], k: number): number {
            let m = v.length - 1;
            let f = m * k;
            let i = Math.floor(f);
            let fn = helperCatmullRom;

            if (v[0] === v[m]) {
                if (k < 0) {
                    i = Math.floor(f = m * (1 + k));
                }
                return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
            }

            if (k < 0) {
                return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
            } else if (k > 1) {
                return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
            }
            return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
        }

        function helperLinear(p0: number, p1: number, t: number): number {
            return (p1 - p0) * t + p0;
        }

        function helperBernstein(n: number, i: number): number {
            let fc = helperFactorial;
            return fc(n) / fc(i) / fc(n - i);
        }

        let a = [1];

        function helperFactorial(n: number): number {
            if (a[n]) {
                return a[n];
            }

            let s = 1;
            for (let i = n; i > 1; i--) {
                s *= i;
            }
            a[n] = s;
            return s;
        }

        function helperCatmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
            let v0 = (p2 - p0) * 0.5;
            let v1 = (p3 - p1) * 0.5;
            let t2 = t * t;
            let t3 = t * t2;
            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
        }
    }

    export class TweenGroup {
        public static readonly groups: Array<TweenGroup> = [];
        private _tweens: Table<TweenJS>;
        private _tweensAddedDuringUpdate: Table<TweenJS>;

        constructor() {
            this._tweens = {};
            this._tweensAddedDuringUpdate = {};
            TweenGroup.groups.push(this);
        }

        public getAll(): TweenJS[] {
            return Object.keys(this._tweens).map((key) => {
                return this._tweens[key];
            });
        }

        public removeAll(): void {
            let tweens = this._tweens;
            this._tweens = {};
            this._tweensAddedDuringUpdate = {};
            for (let id in tweens) {
                tweens[id] && tweens[id].stop();
            }
        }

        public destroy(): void {
            this.removeAll();
            ArrayUtils.remove(TweenGroup.groups, this);
        }

        public add(tween: TweenJS): void {
            this._tweens[tween.key()] = tween;
            this._tweensAddedDuringUpdate[tween.key()] = tween;
        }

        public remove(tween: TweenJS): void {
            delete this._tweens[tween.key()];
            delete this._tweensAddedDuringUpdate[tween.key()];
        }

        public update(time?: number, preserve?: boolean): boolean {
            let tweenIds = Object.keys(this._tweens);

            if (tweenIds.length === 0) {
                return false;
            }

            time = time !== undefined ? time : Date.now();

            // Tweens are updated in "batches". If you add a new tween during an update, then the
            // new tween will be updated in the next batch.
            // If you remove a tween during an update, it may or may not be updated. However,
            // if the removed tween was added during the current batch, then it will not be updated.
            while (tweenIds.length > 0) {
                this._tweensAddedDuringUpdate = {};
                for (let i = 0; i < tweenIds.length; i++) {
                    let tween = this._tweens[tweenIds[i]];
                    if (tween && !tween.update(time)) {
                        // tween.isPlaying = false;
                        if (!preserve) {
                            delete this._tweens[tweenIds[i]];
                        }
                    }
                }
                tweenIds = Object.keys(this._tweensAddedDuringUpdate);
            }

            return true;
        }
    }

    type TweenUpdateCallback = (object?: any, rate?: number) => void;
    type TweenCallback = (object?: any, properties?: any) => void;

    export class TweenJS {
        private static defaultGroup: TweenGroup = new TweenGroup();
        private static id: number = 0;

        private static nextId(): number {
            return ++TweenJS.id;
        }

        public static update(time?: number, preserve?: boolean): void {
            for (let i = TweenGroup.groups.length - 1; i >= 0; --i) {
                TweenGroup.groups[i].update(time, preserve);
            }
        }

        public static create(object?: any, group?: TweenGroup): TweenJS {
            return new TweenJS(object, group);
        }

        public static recover(tween: TweenJS): void {
            tween.stop();
        }

        private readonly _id: string;
        private readonly _group: TweenGroup;

        private _onStartCallback: TweenCallback;
        private _onUpdateCallback: TweenUpdateCallback;
        private _onCompleteCallback: TweenCallback;
        private _onStopCallback: TweenCallback;
        private _onRepeatCallback: TweenCallback;

        private readonly _object: any;
        private readonly _valuesStart: Table<any>;
        private _valuesEnd: Table<any>;
        private readonly _valuesStartRepeat: Table<any>;

        private _isPlaying: boolean;
        private _onStartCallbackFired: boolean;
        private _yoyo: boolean;
        private _combine: boolean;
        private _reversed: boolean;

        private _startTime: number;
        private _delayTime: number;
        private _duration: number;
        private _repeat: number;
        private _count: number;
        private _repeatDelayTime: number;

        private _chainedTweens: Array<TweenJS>;
        private _chainRunning: boolean;

        private _easingFunction: (k: number) => number;
        private _interpolationFunction: (v: number[], k: number) => number;

        protected constructor(object?: any, group?: TweenGroup) {
            this._id = TweenJS.nextId().toString();
            this._object = object;
            this._valuesStart = {};
            this._valuesEnd = {};
            this._valuesStartRepeat = {};
            this._duration = 0;
            this._repeat = 0;
            this._repeatDelayTime = undefined;
            this._yoyo = false;
            this._isPlaying = false;
            this._reversed = false;
            this._delayTime = 0;
            this._startTime = 0;
            this._easingFunction = easing.linear.None;
            this._interpolationFunction = interpolation.Linear;
            this._chainedTweens = [];
            this._onStartCallback = null;
            this._onStartCallbackFired = false;
            this._onUpdateCallback = null;
            this._onCompleteCallback = null;
            this._onStopCallback = null;
            this._group = group || TweenJS.defaultGroup;

            this._combine = false;
            this._chainRunning = false;
            this._count = 0;
        }

        public get object(): any {
            return this._object;
        }

        public get property(): any {
            return this._valuesEnd;
        }

        public get duration(): number {
            return this._duration;
        }

        public key(): string {
            return this._id;
        }

        public get isPlaying(): boolean {
            return this._isPlaying;
        }

        public to(properties: any, duration: number): TweenJS {
            this._valuesEnd = properties;
            if (duration !== undefined) {
                this._duration = duration;
            }
            return this;
        }

        public start(): TweenJS {
            if (this._isPlaying) {
                return this;
            }

            this._group.add(this);
            this._count = 0;
            this._isPlaying = true;
            this._onStartCallbackFired = false;
            this._startTime = Date.now() + this._delayTime;
            this._chainRunning = false;

            for (let property in this._valuesEnd) {
                // Check if an Array was provided as property value
                if (this._valuesEnd[property] instanceof Array) {
                    if (this._valuesEnd[property].length === 0) {
                        continue;
                    }
                    // Create a local copy of the Array with the start value at the front
                    this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);
                }

                // If `to()` specifies a property that doesn't exist in the source object,
                // we should not set that property in the object
                if (this._object[property] === undefined) {
                    continue;
                }

                // Save the starting value.
                this._valuesStart[property] = this._object[property];
                if ((this._valuesStart[property] instanceof Array) === false) {
                    this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
                }

                this._valuesStartRepeat[property] = this._valuesStart[property] || 0;
            }
            return this;
        }

        public stop(): TweenJS {
            if (!this._isPlaying) {
                return this;
            }

            this._group.remove(this);
            this._isPlaying = false;
            if (this._onStopCallback) {
                this._onStopCallback(this._object, this._valuesEnd);
            }

            this.stopChainedTweens();
            return this;
        }

        public end(): TweenJS {
            this.update(this._startTime + this._duration);
            return this;
        }

        public stopChainedTweens(): TweenJS {
            if (this._chainRunning) {
                for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
                    this._chainedTweens[i].stop();
                }
                this._chainRunning = false;
            }
            return this;
        }

        public combine(enable: boolean): TweenJS {
            this._combine = enable;
            return this;
        }

        public delay(amount: number): TweenJS {
            this._delayTime = amount;
            return this;
        }

        /**
         * 循环次数
         * @param times 
         * @returns 
         */
        public repeat(times: number): TweenJS {
            this._repeat = times;
            return this;
        }

        public repeatDelay(amount: number): TweenJS {
            this._repeatDelayTime = amount;
            return this;
        }

        /**
         * 是否开启往返（注意需要设置次数）
         * @param enable 
         * @returns 
         */
        public yoyo(enable: boolean): TweenJS {
            this._yoyo = enable;
            return this;
        }

        public easing(easing: (k: number) => number): TweenJS {
            this._easingFunction = easing;
            return this;
        }

        public interpolation(interpolation: (v: number[], k: number) => number): TweenJS {
            this._interpolationFunction = interpolation;
            return this;
        }

        public chain(...tweens: TweenJS[]): TweenJS {
            this._chainedTweens = tweens;
            return this;
        }

        public onStart(callback: TweenCallback): TweenJS {
            this._onStartCallback = callback;
            return this;
        }

        public onStop(callback: TweenCallback): TweenJS {
            this._onStopCallback = callback;
            return this;
        }

        public onUpdate(callback: TweenCallback): TweenJS {
            this._onUpdateCallback = callback;
            return this;
        }

        public onRepeat(callback: TweenCallback): TweenJS {
            this._onRepeatCallback = callback;
            return this;
        }

        public onComplete(callback: TweenUpdateCallback): TweenJS {
            this._onCompleteCallback = callback;
            return this;
        }

        public update(time: number): boolean {
            if (time < this._startTime) {
                return true;
            }

            if (this._onStartCallbackFired === false) {
                if (this._onStartCallback) {
                    this._onStartCallback(this._object, this._valuesEnd);
                }
                this._onStartCallbackFired = true;
            }

            let elapsed = this._duration === 0 ? 1 : (time - this._startTime) / this._duration;
            elapsed = elapsed > 1 ? 1 : elapsed;

            let value = 1.0;
            //当子链运行时证明主链已经完成了，所以不用再变化
            if (!this._chainRunning) {
                value = this._easingFunction(elapsed);
                for (let property in this._valuesEnd) {
                    // Don't update properties that do not exist in the source object
                    if (this._valuesStart[property] === undefined) {
                        continue;
                    }

                    let start = this._valuesStart[property] || 0;
                    let end = this._valuesEnd[property];
                    if (end instanceof Array) {
                        this._object[property] = this._interpolationFunction(end, value);
                    } else {
                        // Parses relative end values with start as base (e.g.: +10, -3)
                        if (typeof (end) === 'string') {
                            if (end.charAt(0) === '+' || end.charAt(0) === '-') {
                                end = start + parseFloat(end);
                            } else {
                                end = parseFloat(end);
                            }
                        }
                        // Protect against non numeric properties.
                        if (typeof (end) === 'number') {
                            this._object[property] = start + (end - start) * value;
                        }
                    }
                }
            }

            if (this._onUpdateCallback) {
                this._onUpdateCallback(this._object, value);
            }

            //防止在_onUpdateCallback中stop
            if (elapsed === 1 && this._isPlaying) {
                if (this._repeat > this._count++) {
                    // Reassign starting values, restart by making startTime = now
                    for (let property in this._valuesStartRepeat) {
                        if (typeof (this._valuesEnd[property]) === 'string') {
                            this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property]);
                        }

                        if (this._yoyo) {
                            let tmp = this._valuesStartRepeat[property];

                            this._valuesStartRepeat[property] = this._valuesEnd[property];
                            this._valuesEnd[property] = tmp;
                        }

                        this._valuesStart[property] = this._valuesStartRepeat[property];
                    }

                    if (this._yoyo) {
                        this._reversed = !this._reversed;
                    }

                    if (this._repeatDelayTime !== undefined) {
                        this._startTime = time + this._repeatDelayTime;
                    } else {
                        this._startTime = time + this._delayTime;
                    }

                    if (this._onRepeatCallback) {
                        this._onRepeatCallback(this._object, this._valuesEnd);
                    }
                } else {
                    if (!this._combine || !this._chainRunning) {
                        for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
                            // Make the chained tweens start exactly at the time they should,
                            // even if the `update()` method was called way past the duration of the tween
                            // this._chainedTweens[i].start(this._startTime + this._duration);
                            this._chainedTweens[i].start();
                        }
                        this._chainRunning = true;
                    } else {
                        let isComplete = true;
                        for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
                            if (this._chainedTweens[i].isPlaying) {
                                isComplete = false;
                                break;
                            }
                        }
                        this._chainRunning = !isComplete;
                    }

                    if (!this._combine || !this._chainRunning) {
                        this._isPlaying = false;
                        if (this._onCompleteCallback !== null) {
                            this._onCompleteCallback(this._object, this._valuesEnd);
                        }
                    }
                }
            }
            return this._isPlaying;
        }
    }
}