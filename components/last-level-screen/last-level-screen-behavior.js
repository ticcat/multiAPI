fetch("/components/last-level-screen/last-level-screen-template.html")
    .then((stream) => stream.text())
    .then((text) => defineLastLevelScreen(text));

function defineLastLevelScreen(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    class LastLevelScreen extends HTMLElement {
        constructor() {
            super();

            // Create shadow root and append fetched html
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        connectedCallback() {
            let entryCover = this.shadowRoot.getElementById("entry-cover");
            let entryTitle = this.shadowRoot.getElementById("entry-title");

            this.endpoint.getSprite().then((spriteUrl) => {
                entryCover.setAttribute("src", spriteUrl);
            });
            entryTitle.innerHTML = this.endpoint.name;
        }
    }

    customElements.define("last-level-screen", LastLevelScreen);
}
