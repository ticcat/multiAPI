export default class API {
    name = "";
    imgSource = "";
    baseUrl = "";
    firstLevelEndPoints = [];

    constructor(name, imgSource, baseUrl, firstLevelEndpoints) {
        this.name = name;
        this.imgSource = imgSource;
        this.baseUrl = baseUrl;
        this.firstLevelEndPoints = firstLevelEndpoints;
    }
}
