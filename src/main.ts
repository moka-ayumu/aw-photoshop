import '@unocss/reset/tailwind.css';
import 'uno.css';
import App from './App.svelte';
import { entrypoints } from 'uxp';

const app = new App({
  target: document.getElementById('app') as HTMLElement,
});

entrypoints.setup({
  plugin: {
    create(plugin: any) {
      console.log('Plugin created successfully.', plugin);
    },
    panels: {
      main: app,
    },
  },
});
