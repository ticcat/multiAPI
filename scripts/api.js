export default class API {
    name = "";
    imgSource = "";
    baseEndpoint = null;
    firstLevelEndPoints = [];

    constructor(name, imgSource, baseEP, firstLevelEndpoints) {
        this.name = name;
        this.imgSource = imgSource;
        this.baseEndpoint = baseEP;
        this.firstLevelEndPoints = firstLevelEndpoints;
    }
}
