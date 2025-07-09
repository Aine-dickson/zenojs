import { effect } from '../reaxis.js';
import { router } from '../appRouter.js';
import { useAuthStore, useUIStore } from '../stores/appStore.js';
import renderer from '../renderer.js';

export function createNavigation() {
    const authStore = useAuthStore();
    const uiStore = useUIStore();

    const div = document.createElement('div');
    
    div.innerHTML = /*html*/`
        <nav class="bg-blue-600 shadow-sm">
            <div class="container mx-auto px-4 py-3 flex justify-between items-center">
                <span id="home" class="text-white cursor-pointer font-bold text-xl flex items-center">
                    <i class="fas fa-video mr-2"></i>HLS Platform
                </span>
                <div id="loggedInUser" class="flex items-center space-x-4"></div>
            </div>
        </nav>
    `;

    const home = div.querySelector('#home');
    home.addEventListener('click', () => {
       router.push('/');
    });

    const loggedInUser = div.querySelector('#loggedInUser');

    let renderOptions = [
        // Option 0: Authenticated user
        /*html*/`
            <a href="#/dashboard" class="text-white hover:text-blue-200 flex items-center">
                <i class="fas fa-tachometer-alt mr-1"></i>${authStore.user.value}
            </a>
            <button class="px-4 logoutBtn py-2 text-white border border-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                <i class="fas fa-sign-out-alt mr-1"></i>Logout
            </button>
        `,
        // Option 1: Not authenticated
        /*html*/`
            <button class="px-4 loginBtn py-2 text-white border border-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                <i class="fas fa-sign-in-alt mr-2"></i>Admin Login
            </button>
        `
    ];

    const events = {
        '.logoutBtn': {
            eventType: 'click',
            handler: (e) => {
                e.preventDefault();
                authStore.logout();
            }
        },
        '.loginBtn': {
            eventType: 'click',
            handler: (e) => {
                e.preventDefault();
                uiStore.openLoginModal();
            }
        }
    };

    // Initial render
    effect(() => {
        renderer({
            target: loggedInUser,
            renderOptions: renderOptions,
            conditions: [
                // Condition 0: User is authenticated AND has user data
                () => authStore.isAuthenticated.value && authStore.user.value,
                // Condition 1: User is NOT authenticated (will be default if condition 0 fails)
                () => !authStore.isAuthenticated.value
            ],
            events: events
        });
    });
    
    return div;
}
