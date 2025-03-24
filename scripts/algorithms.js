/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Feb 23, 2025
*/
/**
 * A collection of useful algorithms for sorting front end data.
 */
export class Algorithms {
    /**
     * Returns an ordered string array with the closest query match (left char to right char) first.
     * @param stringArray The array to sort.
     * @param query The query to sort with.
     * @returns {*[]}
     */
    static bubbleSortString(stringArray, query) {
        // Each index of the stringArray will get one point for each exact char match in a row.
        const scores = new Array(stringArray.length).fill(0);
        // Iterate through each item in the string array.
        for (let itemIndex = 0; itemIndex < stringArray.length; itemIndex++) {
            // Iterate through each char in search query
            for (let charIndex = 0; charIndex < query.length; charIndex++) {
                // Break if at last index of current item
                if (charIndex >= stringArray[itemIndex].length) {
                    break;
                }
                // Otherwise, check for a match and add one score to this item if found
                if (query[charIndex].toLowerCase() === stringArray[itemIndex][charIndex].toLowerCase()) {
                    scores[itemIndex] = scores[itemIndex] == null ? 1 : scores[itemIndex] + 1;
                }
                else {
                    scores[itemIndex] = scores[itemIndex] == null ? 0 : scores[itemIndex];
                    break;
                }
            }
        }
        // Now sort based on number of char matches per item against query
        for (let itemIndex = 0; itemIndex < scores.length; itemIndex++) {
            for (let compareIndex = itemIndex; compareIndex < scores.length; compareIndex++) {
                // Ensure comparison is possible
                if (scores[compareIndex + 1] == null) {
                    break;
                }
                // Check if the item at this index has a higher score
                if (scores[compareIndex + 1] > scores[itemIndex]) {
                    // Swap items
                    const tempItem = stringArray[itemIndex];
                    stringArray[itemIndex] = stringArray[compareIndex + 1];
                    stringArray[compareIndex + 1] = tempItem;
                    // Swap indexes
                    const tempIndex = scores[itemIndex];
                    scores[itemIndex] = scores[compareIndex + 1];
                    scores[compareIndex + 1] = tempIndex;
                }
            }
        }
        return stringArray;
    }
}
//# sourceMappingURL=algorithms.js.map