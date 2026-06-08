
import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './registerServiceWorker';
import './styles/index.css';

axios.defaults.baseURL = import.meta.env.DEV ? 'http://localhost:5173' : '/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
