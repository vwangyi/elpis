import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import store from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
    <HashRouter>
        <App store={ store } />
    </HashRouter>
);
