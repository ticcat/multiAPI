fetch("/components/pagination-footer/pagination-footer-template.html")
    .then((stream) => stream.text())
    .then((text) => definePaginationFooter(text));

function definePaginationFooter(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    class PaginationFooter extends HTMLElement {
        constructor() {
            super();

            // Create shadow root and append fetched html
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }
    }

    customElements.define("pagination-footer", PaginationFooter);
}
