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
            let entryCoverImage =
                this.shadowRoot.getElementById("entry-cover-image");
            let entryTitle = this.shadowRoot.getElementById("entry-title");

            this.endpoint.getSprite().then((spriteUrl) => {
                entryCoverImage.setAttribute("src", spriteUrl);
            });
            entryTitle.innerHTML = this.endpoint.name;
            this.#setTableData(this.data);
        }

        #setTableData(data) {
            let dataTable = this.shadowRoot.getElementById("data-table");

            for (const key in data) {
                let dataRow = document.createElement("tr");
                let dataKey = document.createElement("td");
                let dataValue = document.createElement("td");

                dataKey.innerHTML = key;
                dataValue.innerHTML = data[key];
                dataRow.appendChild(dataKey);
                dataRow.appendChild(dataValue);

                dataTable.appendChild(dataRow);
            }
        }
    }

    customElements.define("last-level-screen", LastLevelScreen);
}
