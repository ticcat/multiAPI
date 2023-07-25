let globalVariables = {};

export function setVarState(name, value) {
    const varChangedEvent = new CustomEvent("globalVarChanged", {
        detail: { varName: name, newValue: value },
    });

    document.dispatchEvent(varChangedEvent);

    return (globalVariables[name] = value);
}

export function getVarState(name) {
    return globalVariables[name];
}
