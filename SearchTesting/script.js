// Test data
const courses = [
    { courseCode: "AU101", department: "Engineering", longName: "Introduction to Mechanical Engineering", shortName: "Intro Mech Eng" },
    { courseCode: "AU202", department: "Science", longName: "Quantum Physics", shortName: "Quantum Phys" },
    { courseCode: "AU303", department: "Engineering", longName: "Electrical Circuit Analysis", shortName: "Elec Circuit Anal" },
    { courseCode: "AU404", department: "Computer Science", longName: "Data Structures and Algorithms", shortName: "DSA" },
    { courseCode: "AU505", department: "Mathematics", longName: "Calculus III", shortName: "Calculus III" }
];

// Function to create a new Fuse instance with the given keys
function createFuse(keys) {
    const fuseOptions = {
        keys: keys
    };
    return new Fuse(courses, fuseOptions);
}

// Create initial Fuse instance with default keys
let fuse = createFuse(["courseCode"]);

// Function to perform search and update results
function performSearch() {
    const searchPattern = document.getElementById("searchInput").value.trim();
    const searchCriteria = document.getElementById("searchCriteria").value;

    // Set the keys based on the selected search criteria
    const keys = (searchCriteria === "courseCode") ? ["courseCode"] : ["longName"];

    // Recreate Fuse instance with updated keys
    fuse = createFuse(keys);

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
            li.textContent = `${result.item.courseCode} - ${result.item.longName} (${result.item.shortName}), Department: ${result.item.department}`;
            searchResultsElement.appendChild(li);
        });
    }
}

// Eventlistners for searching
document.getElementById("searchInput").addEventListener("input", performSearch);
document.getElementById("searchCriteria").addEventListener("change", performSearch);

// Function call
performSearch();