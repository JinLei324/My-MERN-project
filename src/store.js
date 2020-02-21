import { createStore, applyMiddleware, compose } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history'
import rootReducer from './reducers'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga'

import rootSaga from './saga'

export const sagaMiddleware = createSagaMiddleware()
export const history = createBrowserHistory()

const initialState = {}
const enhancers = []
const middleware = [thunk, routerMiddleware(history), sagaMiddleware]

if (process.env.NODE_ENV === 'development') {
	const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

	if (typeof devToolsExtension === 'function') {
		enhancers.push(devToolsExtension())
	}
}


const composedEnhancers = compose(
	applyMiddleware(...middleware),
	...enhancers
)

const persistedReducer = persistReducer({
	key: 'benefactor-main-store',
	storage: storage,
	whitelist: ['authentication']
}, rootReducer)

export const store = createStore(
	connectRouter(history)(persistedReducer),
	initialState,
	composedEnhancers
)
export const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)

