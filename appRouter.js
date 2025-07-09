import { ZenoRouter } from "./router.js";
import { useAuthStore } from "./stores/appStore.js";
import { useUIStore } from "./stores/appStore.js";
import HomePage from "./pages/HomePage.js";
import DashboardPage from "./pages/DashboardPage.js";

const routes = {
    '/': HomePage,

    '/dashboard': {
        component: DashboardPage,
        guard: () => !!useAuthStore().isAuthenticated.value,
    },

    '/login': {
        component: () => {
            const auth = useAuthStore();
            if (auth.isAuthenticated.value) {
                console.log("Already authenticated, redirecting to dashboard");
                return DashboardPage();
            }
            useUIStore().openLoginModal();
            return HomePage();
        }
    }
};

function notFoundComponent() {
    const div = document.createElement('div');
    div.className = 'min-h-screen flex items-center justify-center bg-gray-50';
    div.innerHTML = /*html*/`
        <div class="text-center">
            <h1 class="text-6xl font-bold text-gray-400 mb-4">404</h1>
            <h3 class="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h3>
            <p class="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
            <a href="#/" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                <i class="fas fa-home mr-2"></i>Go Home
            </a>
        </div>
    `;
    return div;
}

export const router = new ZenoRouter(routes, {
    viewSelector: '#router-view',
    notFound: notFoundComponent,
    onGuardFail: () => {
        console.log("Guard failed, redirecting to login");
        router.push('/');
        useUIStore().openLoginModal();
    }
});
