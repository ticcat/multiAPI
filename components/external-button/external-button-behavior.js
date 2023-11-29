fetch("components/external-button/external-button-template.html")
    .then((stream) => stream.text())
    .then((text) => defineExternalButton(text));

function defineExternalButton(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    class ExternalButton extends HTMLElement {
        static get observedAttributes() {
            return ["selected"];
        }

        constructor() {
            super();

            // Create shadow root and append fetched html
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        connectedCallback() {
            // Arrange component attributes
            let buttonContainer =
                this.shadowRoot.getElementById("button-container");
            let externalButtonImg =
                this.shadowRoot.getElementById("button-icon");
            const { imgSource, name } = this.externalInfo;

            buttonContainer.classList.add("active");

            externalButtonImg.src = imgSource;
            externalButtonImg.alt = name + " icon";
        }
    }

    customElements.define("external-button", ExternalButton);
}
