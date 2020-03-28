export const test = new Proxy({}, {
    get (target, prop,receiver) {
        return target;
    }
})