import React , {Component} from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from './applane/applane'

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
