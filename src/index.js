import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import ScrollToTop from 'react-router-scroll-top';

import { store, persistor, history } from './store';
import App from './templates/app';
import * as Sentry from '@sentry/browser';

Sentry.init({dsn: "https://ed4e1029f1ce45dc894efb4021490750@sentry.io/1498973"});

const target = document.querySelector('#root')

render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<ConnectedRouter history={history}>
				<ScrollToTop>
					<App />
				</ScrollToTop>
			</ConnectedRouter>
		</PersistGate>
	</Provider>,
	target
)