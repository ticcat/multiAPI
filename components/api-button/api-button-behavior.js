fetch("/components/api-button/api-button-template.html")
    .then((stream) => stream.text())
    .then((text) => define(text));

function define(html) {
    class ApiButton extends HTMLElement {
        buttonAPI = null;

        constructor() {
            super();

            // Create shadow root and add fetched html
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = html;
        }

        connectedCallback() {
            // Arrange component attributes
            let apiButtonImg = this.shadowRoot.getElementById("button-icon");

            apiButtonImg.src = this.buttonAPI.imgSource;
            apiButtonImg.alt = this.buttonAPI.name + " icon";
        }

        testLog() {
            console.log("test");
        }
    }

    customElements.define("api-button", ApiButton);
}
