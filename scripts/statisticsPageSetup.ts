/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: March 22, 2025
*
* NOTE: @ts-ignore used on import as associated typescript files for chart.js are divided into many files using bundle
*/

// @ts-ignore
import * as ChartJs from "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/+esm";

ChartJs.Chart.register(...ChartJs.registerables);

/**
 * Statistics page setup methods.
 */
export class StatisticsPageSetup {

    /**
     * Sets up the canvas element such that stats are show.
     */
    static showStats(): void {

        // Grab statsChart canvas, ensure its not null
        const canvas = document.getElementById("statsChart") as HTMLCanvasElement;
        if (!canvas) {
            console.error('Canvas not found');
            return;
        }

        // Get context such that chart can be drawn, then create chart
        const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (!context) {
            console.error("2D context not available");
            return;
        }
        StatisticsPageSetup.createChart(context);
    }

    /**
     * Creates a line graph with chartStatistics
     * @param chartContext canvas context to draw on.
     */
    static createChart(chartContext: ChartJs.CanvasRenderingContext2D) {

        // Grab site data from statistics json
        const statisticsData = JSON.parse(sessionStorage.getItem("siteStatistics") || "[]");

        // Create the chart site data
        const statsChart = new ChartJs.Chart(chartContext,
            {
                type: "line",
                data: statisticsData.siteData,
                options: {
                    responsive: true,
                    scales: {
                        y: {beginAtZero: true}
                    }
                }
            });
    }
}