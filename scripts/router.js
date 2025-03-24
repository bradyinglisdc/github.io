export class Router {
    constructor(routes) {
        this.routes = routes;
        this.init();
    }
    init() {
        // Ensure initial route is navigated to
        this.loadRoute(location.hash.slice(1));
        window.addEventListener("hashchange", () => {
            console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`);
            this.loadRoute(location.hash.slice(1));
        });
    }
    navigate(path) {
        location.hash = path;
        this.loadRoute(path);
    }
    loadRoute(path) {
        const basePath = path.split("#")[0];
        if (!this.routes[basePath]) {
            console.warn(`Route '${basePath}' not found, redirecting to 404`);
            location.hash = "/404";
            return;
        }
        fetch(this.routes[basePath])
            .then((response) => {
            if (!response.ok)
                throw new Error(`Failed to load ${this.routes[basePath]}`);
            return response.text();
        })
            .then((html) => {
            const mainElement = document.querySelector("main");
            if (mainElement) {
                mainElement.innerHTML = html;
                document.dispatchEvent(new CustomEvent("routeLoaded", { detail: basePath }));
            }
            else {
                console.error("Main element not found.");
            }
        })
            .catch((error) => {
            console.log(error);
        });
    }
}
//# sourceMappingURL=router.js.map