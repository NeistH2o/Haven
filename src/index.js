import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

let myname = "Alexis";

ReactDOM.render(<App name={myname} />, document.getElementById('root'));
registerServiceWorker();
