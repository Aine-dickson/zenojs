import { ZenoRouter } from './router.js';

function Home() {
  const el = document.createElement('div');
  el.innerHTML = `<h2 class="text-xl font-bold">Welcome Home</h2>`;
  return el;
}

function About() {
  const el = document.createElement('div');
  el.innerHTML = `<h2 class="text-xl font-bold">About Zeno</h2><p>A minimal JS router.</p>`;
  return el;
}

new ZenoRouter({
  '/': Home,
  '/about': About
});
