function fetchTestData() {
    let testRequest = new Request('https://pokeapi.co/api/v2/pokemon');
    let myInit = {
        method: "GET",
        mode: "cors"
    }

    return fetch(testRequest, myInit).then((response) => {
            if(!response.ok) {
                throw new Error("HTTP Error status: ${response.status}");
            }

            return response.json();
        }
    );
}

window.onload = () => {
    let fetchDataButton = document.getElementById("fetchDataButton");

    fetchDataButton.onclick = function() {
        let fetchDataPromise = fetchTestData().then((data) => {
            const resultsHeader = document.getElementById("fetchResultsHeader");
            const resultsList = document.getElementById("fetchResultsList");
            
            data.results.map((pokemon) => {
                let li = document.createElement("li");
                let node = document.createTextNode(pokemon.name);

                li.appendChild(node);
                resultsList.appendChild(li);
            })

            resultsHeader.style = "display: block;"
        });
    }
}