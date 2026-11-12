// This page is the bridge between the browser's raw HTML and React

//For <React.StrictMode>
import React from 'react';
// For creating the root container
import ReactDOM from 'react-dom/client';
// Enables client-side routing
import { BrowserRouter } from 'react-router-dom';
// Top-level React component
import App from './App.tsx';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);