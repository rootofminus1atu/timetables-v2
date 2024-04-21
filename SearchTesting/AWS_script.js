 // Function to fetch data from API Gateway
 async function fetchData() {
    try {
        const response = await fetch('https://vtlxqv4eyh.execute-api.eu-west-1.amazonaws.com/GetModules/data', {
            method: "GET", // Method is set to GET since you're fetching data
            mode: "cors", // Assuming you want CORS enabled
            headers: {
                "Content-Type": "application/json" // Adjust headers as needed
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}


// Function to create a new Fuse instance with the given keys and data
async function createFuse(keys) {
    const data = await fetchData();
    const fuseOptions = {
        keys: keys
    };
    return new Fuse(data, fuseOptions);
}

// Create initial Fuse instance with default keys
let fuse;

// Function to perform search and update results
async function performSearch() {
    const searchPattern = document.getElementById("searchInput").value.trim();
    const searchCriteria = document.getElementById("searchCriteria").value;

    // Set the keys based on the selected search criteria
    const keys = (searchCriteria === "courseCode") ? ["id"] : ["longName"];

    // Recreate Fuse instance with updated keys
    fuse = await createFuse(keys);

    // Perform search
    const searchResults = fuse.search(searchPattern);

    // Display search results
    const searchResultsElement = document.getElementById("searchResults");
    searchResultsElement.innerHTML = ""; // Clear previous results

    if (searchResults.length === 0) {
        searchResultsElement.innerHTML = "<li>No results found</li>";
    } else {
        searchResults.forEach(result => {
            const li = document.createElement("li");
            li.textContent = `${result.item.id} - ${result.item.longName} (${result.item.shortName}), Department: ${result.item.department}`;
            searchResultsElement.appendChild(li);
        });
    }
}

// Event listener for searching
document.getElementById("searchInput").addEventListener("input", performSearch);
document.getElementById("searchCriteria").addEventListener("change", performSearch);

// Initial function call
performSearch();