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
            let cardContainer =
                this.shadowRoot.getElementById("card-container");
            let cardTitle = this.shadowRoot.getElementById("card-title");

            if (this.cardEndpoint.isLastLevel()) {
                this.cardEndpoint.getSprite().then((url) => {
                    cardTitle.innerHTML = this.cardEndpoint.name;
                    this.#setCardCover(url);
                    cardContainer.onclick = this.onCardClick;
                });
            } else {
                cardTitle.innerHTML = this.cardEndpoint.name;
                this.#setCardCover(this.cardEndpoint.spriteUrl);
                cardContainer.onclick = this.onCardClick;
            }
        }

        #setCardCover(url) {
            let cardCover = this.shadowRoot.getElementById("card-cover");

            cardCover.setAttribute("src", url);
            cardCover.classList = ["loaded"];
        }
    }

    customElements.define("endpoint-card", EndpointCard);
}
