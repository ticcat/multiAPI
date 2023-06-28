import filterRawData from "../../scripts/last-level/lastLevelDataFilter.js";

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

            let filteredData = filterRawData(data, this.endpoint);

            for (let data in filteredData) {
                let dataRowElement = document.createElement("tr");
                let dataKeyElement = document.createElement("td");
                let dataValueElement = document.createElement("td");
                let dataEntry = filteredData[data];

                dataKeyElement.innerHTML = dataEntry.key;
                dataValueElement.innerHTML = dataEntry.value;
                dataRowElement.appendChild(dataKeyElement);
                dataRowElement.appendChild(dataValueElement);

                dataTable.appendChild(dataRowElement);
            }
        }
    }

    customElements.define("last-level-screen", LastLevelScreen);
}
