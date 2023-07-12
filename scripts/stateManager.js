let globalVariables = {};

export function setVarState(name, value) {
    return (globalVariables[name] = value);
}

export function getVarState(name) {
    return globalVariables[name];
}
