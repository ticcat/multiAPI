fetch("/components/topbar/topbar-template.html")
    .then((stream) => stream.text())
    .then((text) => defineTopbar(text));

function defineTopbar(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    class Topbar extends HTMLElement {
        constructor() {
            super();

            // Create shadow root and append fetched html
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        setBackButtonVisibility() {
            console.log("Changed");
            let backButton = this.shadowRoot.getElementById("back-button");

            if (currentEndpoint.name !== "Base") {
                backButton.style = "visibility: visible;";
            } else {
                backButton.style = "visibility: hidden;";
            }
        }
    }

    customElements.define("main-topbar", Topbar);
}
