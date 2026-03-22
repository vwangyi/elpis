import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <App store={ store } />
)
