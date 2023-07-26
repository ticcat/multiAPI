import { getVarState } from "../../scripts/stateManager.js";

fetch("components/pagination-footer/pagination-footer-template.html")
    .then((stream) => stream.text())
    .then((text) => definePaginationFooter(text));

function definePaginationFooter(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    class PaginationFooter extends HTMLElement {
        static get observedAttributes() {
            return ["visible"];
        }

        constructor() {
            super();

            // Create shadow root and append fetched html
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        connectedCallback() {
            this.#updateState();
        }

        attributeChangedCallback(name, _, newValue) {
            let shadow = this.shadowRoot;
            let container = shadow.getElementById("pagination-container");

            switch (name) {
                case "visible":
                    if (newValue === "true") {
                        container.style = "opacity: 1;";
                    } else {
                        container.style = "opacity: 0;";
                    }
                    this.#updateState();
                    break;
            }
        }

        #updateState() {
            let pagInfo = getVarState("paginationInfo");

            switch (true) {
                case pagInfo == null:
                case pagInfo.previousUrl == null && pagInfo.nextUrl == null:
                    this.#setupPrevBtn(false, () => {});
                    this.#setupNextBtn(false, () => {});
                    break;
                case pagInfo.previousUrl == null:
                    this.#setupPrevBtn(false, () => {});
                    this.#setupNextBtn(true, this.nextBtnOnclick);
                    break;
                case pagInfo.nextUrl == null:
                    this.#setupPrevBtn(true, this.prevBtnOnclick);
                    this.#setupNextBtn(false, () => {});
                    break;
                default:
                    this.#setupPrevBtn(true, this.prevBtnOnclick);
                    this.#setupNextBtn(true, this.nextBtnOnclick);
                    break;
            }
        }

        #setupPrevBtn(visible, handler) {
            this.#setPrevBtnOpacity(visible);
            this.#setPrevBtnOnClick(handler);
        }

        #setPrevBtnOpacity(visible) {
            let prevBtn = this.shadowRoot.getElementById("previous-btn");

            prevBtn.style = visible ? "opacity: 1;" : "opacity: 0;";
        }

        #setPrevBtnOnClick(handler) {
            let prevBtn = this.shadowRoot.getElementById("previous-btn");

            prevBtn.onclick = () => {
                handler();
                this.#updateState();
            };
        }

        #setupNextBtn(visible, handler) {
            this.#setNextBtnOpacity(visible);
            this.#setNextBtnOnClick(handler);
        }

        #setNextBtnOpacity(visible) {
            let nextBtn = this.shadowRoot.getElementById("next-btn");

            nextBtn.style = visible ? "opacity: 1;" : "opacity: 0;";
        }

        #setNextBtnOnClick(handler) {
            let nextBtn = this.shadowRoot.getElementById("next-btn");

            nextBtn.onclick = () => {
                handler();
                this.#updateState();
            };
        }
    }

    customElements.define("pagination-footer", PaginationFooter);
}
