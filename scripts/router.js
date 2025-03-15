"use strict";

import { loadHeader } from "./header.js";

export class Router {
    constructor(routes) {
        this.routes = routes;
        this.init();
    }

    init() {
        window.addEventListener("DOMContentLoaded", () => {
            const path = location.hash.slice(1) || "/";
            this.loadRoute(path);
        });

        window.addEventListener("popstate", () => {
            console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`);
            this.loadRoute(location.hash.slice(1));
        });
    }

    navigate(path) {
        location.hash = path;
    }

    loadRoute(path) {
        console.log(`[INFO] Loading route: ${path}`);

        const basePath = path.split("#")[0];

        if (!this.routes[basePath]) {
            console.warn(`[WARN] Route Not Found! ${basePath}, redirecting to 404`);
            location.hash = "/404";
        }

        fetch(this.routes[basePath])
            .then((response) => {
                if (!response.ok) throw new Error(`Failed to load ${this.routes[basePath]}`);
                return response.text();
            })
            .then((html) => {
                document.querySelector("main").innerHTML = html;
                document.dispatchEvent(new CustomEvent("routeLoaded", { detail: basePath }));
            })
            .catch((error) => {
                console.log(error);
            });
    }
}