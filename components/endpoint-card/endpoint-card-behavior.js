fetch("/components/endpoint-card/endpoint-card-template.html")
    .then((stream) => stream.text())
    .then((text) => defineEndpointCard(text));

function defineEndpointCard(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    class EndpointCard extends HTMLElement {
        static get observedAttributes() {
            return [];
        }

        constructor() {
            super();

            // Create shadow root and append fetched html
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        connectedCallback() {
            let cardTitle = this.shadowRoot.getElementById("card-title");
            let cardCover = this.shadowRoot.getElementById("card-cover");

            cardTitle.innerHTML = this.cardEndpoint.name;
            cardCover.setAttribute("src", this.cardEndpoint.spriteUrl);
        }
    }

    customElements.define("endpoint-card", EndpointCard);
}
