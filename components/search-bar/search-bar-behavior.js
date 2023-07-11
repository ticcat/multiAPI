fetch("/components/search-bar/search-bar-template.html")
    .then((stream) => stream.text())
    .then((text) => defineSearchBar(text));

function defineSearchBar(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    class SearchBar extends HTMLElement {
        constructor() {
            super();

            // Create shadow root and append fetched html
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }
    }

    customElements.define("search-bar", SearchBar);
}
