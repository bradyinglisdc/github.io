/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Feb 22, 2025
*/

// API endpoint with query for community/local news
const localNewsURL = "https://api.thenewsapi.com/v1/news/all?" +
    "api_token=BtABsc2NcN1zHvbzuMBuuYIgtgA7Nm8yZ9Y20u1s&" +
    "search=Canada%20Ontario%20Oshawa&" +
    "language=en&" +
    "limit=50";

/**
 * Grabs and displays local news.
 */
async function initializeNews() {

    // Ensure results are updated based on query
    document.getElementById("newsQuery").addEventListener("change", updateResults);

    // Display news articles, pulling from session storage
    updateResults();
}

/**
 * Creates a news-card for each article - sorts by search query.
 */
function updateResults() {

    // Sort results
    const sortedResults = sortNews();

    // Display results
    const resultsContainer = document.getElementById("newsResults");
    resultsContainer.innerHTML = "";
    for (const article of sortedResults.articles) {
        resultsContainer.innerHTML += (
            `<div class="news-card">
                <h4>${article.org}</h4>
                <h5><a href="${article.url}">${article.name}</a></h5>
                <p>${article.description}</p>
             </div>`
        );
    }
}

/**
 * Returns JSON array of local news sorted by search query - uses bubble sort for simplicity.
 */
function sortNews() {

    // Articles to sort
    let articlesJSON;
    try {
        articlesJSON = JSON.parse(sessionStorage.getItem("communityNews"));
    }
    catch(error) {
        console.error("Community news not found in memory: " + error);
    }

    // Grab search query, return if empty
    const query = document.getElementById("newsQuery").value;
    if (query === "") { return articlesJSON; }

    // Create string array from article array for sorting
    const stringArray = [];
    for (const article of articlesJSON.articles) {
        stringArray.push(article.name);
    }

    // Get sorted string array
    const sortedArray = Algorithms.bubbleSortString(stringArray, query);

    // Sort by name
    const sortedArticles = {"articles": []};
    for (let j = 0; j < sortedArray.length; j++) {
        for (let i = 0; i < articlesJSON.articles.length; i++) {
            if (articlesJSON.articles[i].name === sortedArray[j]) {
                sortedArticles.articles.push(articlesJSON.articles[i]);
                break;
            }
        }
    }

    return sortedArticles;
}