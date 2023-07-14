import { getVarState } from "../../scripts/stateManager.js";

fetch("/components/search-bar/search-bar-template.html")
    .then((stream) => stream.text())
    .then((text) => defineSearchBar(text));

function defineSearchBar(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    class SearchBar extends HTMLElement {
        #searchSubmit;

        constructor() {
            super();

            // Create shadow root and append fetched html
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this.#setUpSearchBar();
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
                            return { result: result, type: info.type };
                        })
                        .catch(() => {})
                );
            });

            return Promise.all(dataFetchList);
        }
    }

    customElements.define("search-bar", SearchBar);
}
