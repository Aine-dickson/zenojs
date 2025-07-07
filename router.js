// zeno/router.js

export class ZenoRouter {
    constructor(routes = {}, options = {}) {
        this.routes = routes;
        this.viewSelector = options.viewSelector || '#router-view';
        this.notFound = options.notFound || (() => {
            const div = document.createElement('div');
            div.innerHTML = `<h1 class="text-red-600">404 - Page not found</h1>`;
            return div;
        });
        this.onGuardFail = options.onGuardFail || (() => {
            location.hash = '/login';
        });

        this._bindEvents();
        this.renderRoute();
    }

    _bindEvents() {
        window.addEventListener('hashchange', () => this.renderRoute());
        window.addEventListener('DOMContentLoaded', () => this.renderRoute());
    }

    get currentPath() {
        return location.hash.replace(/^#/, '') || '/';
    }

    renderRoute() {
        const target = document.querySelector(this.viewSelector);
        if (!target) return console.warn(`ZenoRouter: Target ${this.viewSelector} not found`);

        target.innerHTML = '';

        const route = this.routes[this.currentPath];

        if (!route) {
            target.appendChild(this.notFound());
            return;
        }

        // Route can be a component directly or an object with guard
        const component = typeof route === 'function' ? route : route.component;
        const guard = typeof route === 'function' ? null : route.guard;

        if (guard && !guard()) {
            this.onGuardFail(this.currentPath); // Can be customized
            return;
        }

        target.appendChild(component());
    }
}
