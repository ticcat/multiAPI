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

        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case "state": {
                    let backButton =
                        this.shadowRoot.getElementById("back-button");

                    switch (newValue) {
                        case topBarState.OnlyBackBtn:
                        case topBarState.Pagination:
                            backButton.style = "opacity: 1;";
                            break;
                        case topBarState.Full:
                            backButton.style = "opacity: 0;";
                            break;
                    }
                    break;
                }
            }
            console.log(
                name + " changed to: " + newValue + " from " + oldValue
            );
        }
    }

    customElements.define("main-topbar", Topbar);
}
