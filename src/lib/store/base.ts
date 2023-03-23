import { writable, get, type Writable } from 'svelte/store';

export class BaseStore<T> {
    public subscribe;
    protected store: Writable<T>;

    constructor(defaultStore: any) {
        this.store = writable(defaultStore);
        this.subscribe = this.store.subscribe;
    }

    get(key?: string) {
        let keys: string[] = [];
        if (typeof key === 'string' && key.match(/\./)) {
            keys = key.split('.')
        }

        if (keys.length) {
            // @ts-ignore
            return get(this.store)[keys[0]][keys[1]];
        } else if (key) {
            // @ts-ignore
            return get(this.store)[key];
        } else {
            return get(this.store);
        }
    }
}