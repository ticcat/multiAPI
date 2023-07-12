export default class StateManager {
    #globalVariables = {};

    setVarState(name, value) {
        this.#globalVariables[name] = value;
    }

    getVarState(name) {
        return this.#globalVariables[name];
    }
}
