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
            this.push('/login');
        });

        this._bindEvents();
        this.renderRoute();
    }

    _bindEvents() {
        window.addEventListener('hashchange', () => this.renderRoute());
        window.addEventListener('DOMContentLoaded', () => this.renderRoute());
    }

    get currentPath() {
        return location.hash.slice(1).split('?')[0] || '/';
    }

    get currentQuery() {
        const search = location.hash.split('?')[1];
        const query = {};
        if (!search) return query;

        for (const pair of search.split('&')) {
            const [key, value] = pair.split('=');
            query[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
        return query;
    }

    matchRoute(path) {
        for (const [pattern, config] of Object.entries(this.routes)) {
        const paramNames = [];
        const regex = new RegExp(
                '^' + pattern.replace(/:[^/]+/g, match => {
                paramNames.push(match.slice(1));
                return '([^/]+)';
            }) + '$'
        );

        const match = path.match(regex);
        if (match) {
            const params = {};
            paramNames.forEach((name, i) => {
                params[name] = decodeURIComponent(match[i + 1]);
            });

            return { route: config, params };
        }
        }
        return null;
    }

    async renderRoute() {
        const target = document.querySelector(this.viewSelector);
        if (!target) return console.warn(`ZenoRouter: Target ${this.viewSelector} not found`);

        target.innerHTML = '';

        const match = this.matchRoute(this.currentPath);
        if (!match) {
            target.appendChild(this.notFound());
            return;
        }

        const { route, params } = match;
        const query = this.currentQuery;

        const componentFn = typeof route === 'function' ? route : route.component;
        const guard = typeof route === 'function' ? null : route.guard;

        // Guard check before anything else
        if (guard && !guard(params, query)) {
            this.onGuardFail(this.currentPath);
            return;
        }

        // Load component
        let result = await componentFn(); // call the function (may return Promise or Node)
                                          // this allows for dynamic imports

        if (result instanceof Node) {
            target.appendChild(result);
            return;
        }

        if (result?.default) {
            result = result.default;
        }

        // Now result should be a function returning DOM Node
        const el = result({ params, query });

        if (el instanceof Node) {
            target.appendChild(el);
        } else {
            console.warn('ZenoRouter: Component did not return a valid DOM Node');
        }
    }


    // Programmatic navigation
    push(path) {
        location.hash = path.startsWith('#') ? path : `#${path}`;
    }
}
