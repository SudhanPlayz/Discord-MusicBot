import { IUpdateListener } from '@/interfaces/sharedState';

export default abstract class SharedState<T> {
    states: T;
    updateHandlers: IUpdateListener<T>[];

    constructor() {
        this.states = {} as T;
        this.updateHandlers = [];
    }

    get() {
        return this.states;
    }

    updateListener() {
        for (const handler of this.updateHandlers) {
            handler(this.states);
        }
    }

    set<KT extends keyof T>(key: KT, value: T[KT]) {
        this.states[key] = value;
    }

    registerListener(handler: this['updateHandlers'][number]) {
        if (this.updateHandlers.includes(handler)) return -1;

        this.updateHandlers.push(handler);
    }

    removeListener(handler: this['updateHandlers'][number]) {
        const idx = this.updateHandlers.findIndex((h) => h === handler);

        if (idx !== -1) {
            this.updateHandlers.splice(idx, 1);
        }

        return idx;
    }

    abstract copy(state: T): T;
}
