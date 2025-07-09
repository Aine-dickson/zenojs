let currentEffect = null;

// Dependency map
const targetMap = new WeakMap();

function track(target, prop) {
    if (!currentEffect) return;

    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    let deps = depsMap.get(prop);
    if (!deps) {
        deps = new Set();
        depsMap.set(prop, deps);
    }

    deps.add(currentEffect);
}

function trigger(target, prop) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;

    const deps = depsMap.get(prop);
    if (deps) {
        deps.forEach(fn => fn());
    }
}

export function reactive(obj) {
    return new Proxy(obj, {
        get(target, prop) {
            track(target, prop);
            return Reflect.get(target, prop);
        },
        set(target, prop, value) {
            const result = Reflect.set(target, prop, value);
            trigger(target, prop);
            return result;
        }
    });
}

export function ref(initialValue) {
    const wrapper = { value: initialValue };
    return reactive(wrapper);
}

export function effect(fn) {
    currentEffect = fn;
    fn();
    currentEffect = null;
}
