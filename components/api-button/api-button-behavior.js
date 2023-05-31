fetch("/components/api-button/api-button-template.html")
    .then((stream) => stream.text())
    .then((text) => define(text));

function define(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    class ApiButton extends HTMLElement {
        $buttonAPI;

        constructor() {
            super();

            // Create shadow root and add fetched html
            const shadowRoot = this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        connectedCallback() {
            // Arrange component attributes
            let apiButtonImg = this.shadowRoot.getElementById("button-icon");

            apiButtonImg.src = this.buttonAPI.imgSource;
            apiButtonImg.alt = this.buttonAPI.name + " icon";
        }
    }

    customElements.define("api-button", ApiButton);
}
