fetch("/components/pagination-footer/pagination-footer-template.html")
    .then((stream) => stream.text())
    .then((text) => definePaginationFooter(text));

export const paginationVisibility = {
    visible: "visible",
    hidden: "hidden",
};

export const paginationState = {
    both: "both",
    onlyPrev: "onlyPrev",
    onlyNext: "onlyNext",
    none: "none",
};

function definePaginationFooter(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    class PaginationFooter extends HTMLElement {
        static get observedAttributes() {
            return ["state"];
        }

        constructor() {
            super();

            // Create shadow root and append fetched html
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        attributeChangedCallback(name, _, newValue) {
            switch (name) {
                case "state":
                    switch (newValue) {
                        case paginationState.onlyPrev:
                            this.#setupPrevBtn(true, this.prevBtnOnclick);
                            this.#setupNextBtn(false, () => {});
                            break;
                        case paginationState.onlyNext:
                            this.#setupPrevBtn(false, () => {});
                            this.#setupNextBtn(true, this.nextBtnOnclick);
                            break;
                        case paginationState.none:
                            this.#setupPrevBtn(false, () => {});
                            this.#setupNextBtn(false, () => {});
                            break;
                        default:
                            this.#setupPrevBtn(true, this.prevBtnOnclick);
                            this.#setupNextBtn(true, this.nextBtnOnclick);
                            break;
                    }
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

            prevBtn.onclick = handler;
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

            nextBtn.onclick = handler;
        }
    }

    customElements.define("pagination-footer", PaginationFooter);
}
