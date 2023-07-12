import { getVarState } from "../../scripts/stateManager.js";

fetch("/components/search-bar/search-bar-template.html")
    .then((stream) => stream.text())
    .then((text) => defineSearchBar(text));

function defineSearchBar(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    class SearchBar extends HTMLElement {
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
                    const searchUrls = currentEP.getSearchUrls(
                        barTextInput.value
                    );

                    barTextInput.value = "";
                    console.log(searchUrls);
                }
            });
        }

        #testLog() {
            console.log(getVarState("currentAPI"));
            console.log(getVarState("currentEndpoint"));
        }
    }

    customElements.define("search-bar", SearchBar);
}
