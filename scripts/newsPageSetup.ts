/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Feb 22, 2025
*/

// Imports
import {Algorithms} from './algorithms.js';

/**
 * Static methods related to loading og the news page.
 */
export class NewsPageSetup {

    // API endpoint with query for community/local news
    static localNewsURL = "https://newsapi.org/v2/everything?q=Canada+Ontario+Oshawa&" +
        "apiKey=54207d18dd0b4df7b74e149fbf11de38";

    /**
     * Grabs and displays local news.
     */
    static async initialize() {

        const newsQuery = document.getElementById("newsQuery") as HTMLInputElement | null;

        if (!newsQuery) {
            console.warn("Missing element")
            return;
        }
        // Ensure results are updated based on query
        newsQuery.addEventListener("change", NewsPageSetup.updateResults);

        // Display news articles, pulling from session storage
        NewsPageSetup.updateResults();
    }

    /**
     * Creates a news-card for each article - sorts by search query.
     */
    static updateResults() {
        // Sort results
        const sortedResults = NewsPageSetup.sortNews();

        // Ensure sortedResults is valid
        if (!sortedResults || !sortedResults.articles) {
            console.warn("No sorted news articles available.");
            return;
        }

        // Get the results container
        const resultsContainer = document.getElementById("newsResults") as HTMLElement | null;
        if (!resultsContainer) {
            console.error("News results container not found.");
            return;
        }

        // Clear previous results
        resultsContainer.innerHTML = "";

        // Display results
        for (const article of sortedResults.articles) {
            // Ensure article has the expected properties
            if (!article.org || !article.url || !article.description) {
                console.warn("Skipping an article with missing properties:", article);
                continue;
            }

            resultsContainer.innerHTML += `
            <div class="news-card">
                <h4>${article.org}</h4>
                <h5><a href="${article.url}" target="_blank">${article.name}</a></h5>
                <p>${article.description}</p>
            </div>
        `;
        }
    }


    /**
     * Returns JSON array of local news sorted by search query - uses bubble sort for simplicity.
     */
    static sortNews() {
        // Ensure articles exist in sessionStorage
        let articlesJSON: { articles: { name: string; org: string; url: string; description: string }[] } | null = null;

        try {
            const storedData = sessionStorage.getItem("communityNews");

            if (!storedData) {
                console.warn("Community news not found in memory.");
                return null;
            }

            articlesJSON = JSON.parse(storedData);
        } catch (error) {
            console.error("Error parsing community news from memory: ", error);
            return null;
        }

        // Ensure articlesJSON contains valid data
        if (!articlesJSON || !articlesJSON.articles) {
            console.warn("Community news data is missing or corrupted.");
            return null;
        }

        // Get search query
        const searchInput = document.getElementById("newsQuery") as HTMLInputElement | null;
        if (!searchInput) {
            console.error("Search input field not found.");
            return articlesJSON;
        }

        const query = searchInput.value.trim();
        if (query === "") return articlesJSON; // Return unmodified if query is empty

        // Convert articles into an array of names for sorting
        const stringArray: string[] = articlesJSON.articles.map(
            (article) => article.name
        );

        // Get sorted string array
        const sortedArray = Algorithms.bubbleSortString(stringArray, query);

        // Sort by name based on sortedArray
        const sortedArticles = { articles: [] as { name: string; org: string; url: string; description: string }[] };

        for (const title of sortedArray) {
            const matchedArticle = articlesJSON.articles.find(
                (article) => article.name === title
            );
            if (matchedArticle) {
                sortedArticles.articles.push(matchedArticle);
            }
        }

        // Store sorted articles back in sessionStorage
        sessionStorage.setItem("communityNews", JSON.stringify(sortedArticles));
        return sortedArticles;
    }

}


