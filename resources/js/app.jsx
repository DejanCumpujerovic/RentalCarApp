import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';
import '../css/style.css';


createInertiaApp({
  resolve: (name) => import(`./Pages/${name}`), // Match your directory structure
  setup({ el, App, props }) {
    console.log("Inertia initialized with props:", props);
    const root = createRoot(el);
    root.render(<App {...props} />);
  },
});
