import React from 'react';
import { render } from 'react-dom';
import App from './App';

function renderApp(AppComponent = App) {
    render(<AppComponent />, document.getElementById('root'));
}

renderApp();

if (module.hot) {
    // eslint-disable-next-line global-require
    module.hot.accept('./App', () => renderApp(require('./App').default));
}

