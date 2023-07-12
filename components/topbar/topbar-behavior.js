import { getVarState } from "../../scripts/stateManager.js";

fetch("/components/topbar/topbar-template.html")
    .then((stream) => stream.text())
    .then((text) => defineTopbar(text));

export const topBarState = {
    Full: "full",
    Pagination: "pagination",
    OnlyBackBtn: "onlyBackBtn",
};

function defineTopbar(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    class Topbar extends HTMLElement {
        static get observedAttributes() {
            return ["state"];
        }

        constructor() {
            super();

            // Create shadow root and append fetched html
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        connectedCallback() {
            this.shadowRoot
                .getElementById("back-button")
                .setAttribute("state", topBarState.Full);
        }

        attributeChangedCallback(name, _, newValue) {
            switch (name) {
                case "state": {
                    switch (newValue) {
                        case topBarState.Pagination:
                            this.#setBackButton(true, this.onBackButtonClick);
                            this.#setPaginationInfo();
                            break;
                        case topBarState.OnlyBackBtn:
                            this.#setBackButton(true, this.onBackButtonClick);
                            this.#setPaginationInfo(false);
                            break;
                        case topBarState.Full:
                            this.#setBackButton(false, undefined);
                            this.#setPaginationInfo(false);
                            break;
                    }
                    break;
                }
            }
        }

        #setBackButton(visible, onClickHandler) {
            const shadow = this.shadowRoot;
            let backButton = shadow.getElementById("back-button");

            backButton.onclick = onClickHandler;
            backButton.style = visible ? "opacity: 1;" : "opacity: 0";
        }

        #setPaginationInfo(visible = true) {
            const shadow = this.shadowRoot;
            let paginationElem = shadow.getElementById("pagination-info");
            let pagTextElem = shadow.getElementById("pagination-info-text");

            let paginationInfo = getVarState("paginationInfo");

            if (visible) {
                let { ePName, init, final } =
                    this.#formatPaginationInfo(paginationInfo);
                pagTextElem.innerHTML = ePName + " " + init + "-" + final;
                paginationElem.style = "opacity: 1;";
            } else {
                pagTextElem.innerHTML = "";
                paginationElem.style = "opacity: 0;";
            }
        }

        #formatPaginationInfo(pagInfo) {
            let initValue = (pagInfo.page - 1) * pagInfo.entriesPerPage + 1;
            let finalValue = initValue - 1 + pagInfo.entriesOnPage;

            return {
                ePName: getVarState("currentEndpoint").name,
                page: pagInfo.page,
                init: initValue,
                final: finalValue,
            };
        }
    }

    customElements.define("main-topbar", Topbar);
}
