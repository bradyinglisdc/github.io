import { loadHeader } from "./header.js";

export type RouteMap = {[key: string]: string};

export class Router {

    private routes : RouteMap

    constructor(routes : RouteMap) {
        this.routes = routes;
        this.init();
    }

    init() : void {

        // Ensure initial route is navigated to
        this.loadRoute(location.hash.slice(1));

        window.addEventListener("hashchange", () => {
            console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`)
            this.loadRoute(location.hash.slice(1));
        });
    }

    navigate(path:string){
        location.hash = path;
        this.loadRoute(path);
    }

    loadRoute(path:string){
        const basePath = path.split("#")[0];

        if (!this.routes[basePath]) {
            console.warn(`Route '${basePath}' not found, redirecting to 404`);
            location.hash = "/404";
            return;
        }

        fetch(this.routes[basePath])
            .then ((response) => {
                if (!response.ok) throw new Error (`Failed to load ${this.routes[basePath]}`);
                return response.text();
            })
            .then ((html) => {
                const mainElement = document.querySelector("main");
                if (mainElement) {
                    mainElement.innerHTML = html
                    document.dispatchEvent(new CustomEvent("routeLoaded", {detail : basePath}));
                } else {
                    console.error("Main element not found.")
                }
        })
        .catch((error) => {
            console.log(error)
        });

    }


}