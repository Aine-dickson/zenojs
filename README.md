# ZenoJS - Lightweight Reactive JavaScript Framework

A minimalistic, reactive JavaScript framework for building modern single-page applications with zero dependencies. ZenoJS provides a complete solution with custom router, reactive state management, component rendering, and store pattern implementation.

## Core Framework Files

```
├── reaxis.js             # Reactive state management system
├── store.js              # Store factory with persistence
├── router.js             # Hash-based router implementation
├── appRouter.js          # Application-specific router configuration
├── renderer.js           # Component rendering system
├── head.js               # Head management utilities
├── README.md             # Documentation
└── stores/
    └── videoStore.js     # Example store implementation
└── components/
    └── Navigation.js     # Example component implementation
```

## ✨ Key Features

### 🔄 Reactive State Management (reaxis.js)
- **Zero Dependencies**: Pure JavaScript reactive system
- **Automatic Tracking**: Dependency tracking for efficient updates
- **Effect System**: Side effect management with cleanup


### � Store Pattern (store.js)
- **Persistent State**: Automatic localStorage synchronization
- **Modular Design**: Create multiple specialized stores
- **Reactive Integration**: Seamless integration with reaxis system
- **Serialization**: Built-in state serialization/deserialization

### 🛤️ Routing System (router.js & appRouter.js)
- **Hash-based Navigation**: Client-side routing without server configuration
- **Route Guards**: Authentication and authorization controls
- **Dynamic Loading**: Components loaded on demand

### 🎨 Component System (renderer.js)
- **Functional Components**: Pure functions returning DOM elements
- **Event Handling**: Centralized event management
- **Conditional Rendering**: Smart rendering based on conditions
- **Lifecycle Management**: Component mounting and unmounting
- **Reusability**: Modular components for easy maintenance

### � Head Management (head.js)
- **Dynamic Meta Tags**: Runtime meta tag manipulation
- **SEO Optimization**: Title, description, and keyword management
- **Social Media**: Open Graph and Twitter Card support
- **Structured Data**: JSON-LD schema integration

## 🚀 Getting Started

### Basic Usage

1. **Create a simple reactive state**:
```javascript
import { reactive, effect } from './reaxis.js';

const state = reactive({
  count: 0,
  name: 'ZenoJS'
});

effect(() => {
  console.log(`Count: ${state.count}, Double: ${state.count * 2}`);
});

state.count = 5; // Logs: "Count: 5, Double: 10"
```

2. **Create a store**:
```javascript
import { defineStore } from './store.js';

const counterStore = defineStore('counter', ()=>{
  let count = 0;
  let increment = () => {
    count++;
  },
  let decrement = () => {
    count--;
  }

  return { count }
}, persist: true);
```

3. **Set up routing**:
```javascript
import { ZenoRouter } from './router.js';

const router = new ZenoRouter({
  '/': () => import('./pages/HomePage.js'),
  '/about': () => import('./pages/AboutPage.js'),
  '/dashboard': {
    component: () => import('./pages/DashboardPage.js'),
    guard: () => authStore.isAuthenticated.value
  }
});

export default router;
```

4. **Create components**:
```javascript
import { effect } from './reaxis.js';
import renderer from './renderer.js';

export function createButton() {
  const div = document.createElement('div');
  
  const renderOptions = [
    `<button class="btn-primary">Click me!</button>`,
    `<button class="btn-secondary">Clicked!</button>`
  ];
  
  const events = {
    'button': {
      eventType: 'click',
      handler: () => store.toggleState()
    }
  };
  
  effect(() => {
    renderer({
      target: div,
      renderOptions,
      conditions: [
        () => store.isClicked.value,
        () => !store.isClicked.value
      ],
      events
    });
  });
  
  return div;
}
```

## 📚 API Reference

### Reaxis (Reactive System)

#### `reactive(target)`
Creates a reactive proxy of an object.

#### `effect(fn)`
Runs a function that automatically re-runs when reactive dependencies change.

### Store

#### `defineStore(name, definition)`
Creates a persistent store with reactive state.

### Router

#### `new ZenoRouter(routes, options)`
Creates a router instance with route definitions.

#### `router.push(path)`
Navigates to a specific route.

### Renderer

#### `renderer(options)`
Renders components with conditional logic and event handling.

## 🎯 Core Concepts

### Reactivity
ZenoJS uses a proxy-based reactivity system that automatically tracks dependencies and updates the UI when data changes. This eliminates the need for manual DOM manipulation.

### Stores
Stores provide a centralized way to manage application state with automatic persistence to localStorage. They integrate seamlessly with the reactive system.

### Components
Components are pure functions that return DOM elements. They use the renderer system for dynamic content and event handling.

### Routing
The router system provides client-side navigation without requiring server configuration. It supports route guards and dynamic component loading.

## 🔧 Example Implementation

The included `videoStore.js` and `Navigation.js` demonstrate how to build a complete application using ZenoJS:

- **videoStore.js**: Shows store creation with reactive state, computed values, and persistence
- **Navigation.js**: Demonstrates component creation with event handling and conditional rendering

These files serve as reference implementations and can be customized for your specific needs.

## 🌟 Why ZenoJS?

- **Zero Dependencies**: No external libraries required
- **Lightweight**: Under 10KB for the entire framework
- **Modern**: Uses latest JavaScript features and best practices
- **Reactive**: Automatic UI updates without manual DOM manipulation
- **Persistent**: Built-in state persistence across sessions
- **Flexible**: Modular architecture allows picking only what you need
- **Production Ready**: Used in real-world applications

## 🤝 Contributing

ZenoJS is designed to be simple and focused. When contributing:

1. Keep the core small and dependency-free
2. Maintain backward compatibility
3. Add comprehensive tests for new features
4. Update documentation and examples
5. Follow the existing code style

## 📄 License

MIT License - feel free to use ZenoJS in your projects!

---

*ZenoJS - Minimalistic. Reactive. Powerful.*
