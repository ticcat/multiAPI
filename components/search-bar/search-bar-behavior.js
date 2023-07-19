import PokeAPIEndpoint, {
    getPokeEPSprite,
} from "../../scripts/pokeAPIEndpoint.js";
import { getVarState } from "../../scripts/stateManager.js";
import SWAPIEndpoint from "../../scripts/swAPIEndpoint.js";

fetch("/components/search-bar/search-bar-template.html")
    .then((stream) => stream.text())
    .then((text) => defineSearchBar(text));

export const searchBarState = {
    centered: "center",
    leftSide: "start",
};

function defineSearchBar(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    class SearchBar extends HTMLElement {
        #searchSubmit;

        static get observedAttributes() {
            return ["state"];
        }

        constructor() {
            super();

            // Create shadow root and append fetched html
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this.#setUpSearchBar();
        }

        attributeChangedCallback(name, _, newValue) {
            let shadow = this.shadowRoot;
            let searchBar = shadow.getElementById("search-bar-container");
            let searchBarInput = shadow.getElementById("search-bar-input");

            switch (name) {
                case "state":
                    searchBar.className =
                        "flex-container container-" + newValue;
                    searchBarInput.className = "search-icon input-" + newValue;
                    break;
            }
        }

        #setUpSearchBar() {
            const shadow = this.shadowRoot;
            const barTextInput = shadow.getElementById("search-bar-input");

            barTextInput.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    const currentEP = getVarState("currentEndpoint");
                    const searchInfo = currentEP
                        .getSearchUrls(barTextInput.value.toLowerCase())
                        .flat();

                    barTextInput.value = "";
                    this.#searchSubmit = new CustomEvent("search", {
                        detail: this.#fetchSearchData(searchInfo),
                    });
                    document.dispatchEvent(this.#searchSubmit);
                }
            });
        }

        #fetchSearchData(searchInfo) {
            let dataFetchList = [];

            searchInfo.forEach((info) => {
                dataFetchList.push(
                    fetch(info.url)
                        .then((response) => {
                            if (!response.ok)
                                throw new Error("Entry not found");

                            return response.json();
                        })
                        .then((result) => {
                            return {
                                resultData: result,
                                endpoint: this.#getResultEndpoint(
                                    result,
                                    info.parent
                                ),
                            };
                        })
                        .catch(() => {})
                );
            });

            return Promise.all(dataFetchList);
        }

        #getResultEndpoint(result, parentEP) {
            switch (getVarState("currentAPI").name) {
                case "Pokémon API":
                    let sprite = getPokeEPSprite(
                        result,
                        parentEP.name,
                        parentEP.spriteUrl
                    );
                    return new PokeAPIEndpoint(
                        result.name,
                        sprite,
                        parentEP,
                        "",
                        parentEP.api
                    );
                case "Star Wars API":
                    let item = result.count > 0 ? result.results[0] : "";
                    return new SWAPIEndpoint(
                        item.name !== undefined ? item.name : item.title,
                        parentEP.spriteUrl,
                        parentEP,
                        "",
                        parentEP.api
                    );
            }
        }
    }

    customElements.define("search-bar", SearchBar);
}
