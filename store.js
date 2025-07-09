import { effect } from './reaxis.js';

const storeRegistry = new Map();

function isRef(val) {
    return val && typeof val === 'object' && 'value' in val;
}

function isReactive(val) {
    return val && typeof val === 'object' && !isRef(val);
}

function shouldPersist(key, persist) {
    if (persist === true) return true;
    if (persist === false) return false;
    if (persist?.pick) return persist.pick.includes(key);
    if (persist?.omit) return !persist.omit.includes(key);
    return false;
}

function serializeStore(store, persistConfig) {
    const data = {};
    for (const key in store) {
        const value = store[key];
        if (shouldPersist(key, persistConfig)) {
            data[key] = isRef(value) ? value.value : value;
        }
    }
    return JSON.stringify(data);
}

function restoreState(setupResult, stored) {
    for (const key in stored) {
        if (key in setupResult) {
            const val = setupResult[key];
            if (isRef(val)) val.value = stored[key];
            else if (isReactive(val)) Object.assign(val, stored[key]);
        }
    }
}

export function defineStore(name, setupFn, options = {}) {
    if (storeRegistry.has(name)) return storeRegistry.get(name);

    const persist = options.persist;
    let storageKey = `zeno-store-${name}`;

    let setupResult = setupFn();

    // If persistence is enabled, load from storage
    if (persist) {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                restoreState(setupResult, parsed);
            } catch (e) {
                console.warn(`[Zeno.store] Failed to parse stored data for '${name}'`);
            }
        }
    }

    // Reactive only what needs to be tracked
    const store = {};
    for (const key in setupResult) {
        store[key] = setupResult[key];
    }

    // Persistence reactivity hook
    if (persist) {
        effect(() => {
            const raw = serializeStore(store, persist);
            localStorage.setItem(storageKey, raw);
        });
    }

    const useStore = () => store;
    storeRegistry.set(name, useStore);
    return useStore;
}
