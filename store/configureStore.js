import { persistState } from 'redux-devtools';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';

/* reducers */
import * as reducers from 'reducers';
/* DevTools */
import { DevTools } from 'containers';

/* socket middleware */
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
let socket = io('http://localhost:3000');
let socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

const reducer = combineReducers({
  ...reducers,
  routing: routerReducer
});

const enhancer = compose(
  applyMiddleware(thunk),
  applyMiddleware(socketIoMiddleware),
  DevTools.instrument(),
  persistState(
    window.location.href.match(
      /[?&]debug_session=([^&#]+)\b/
    )
  )
);

export default function configureStore(initialState) {
  const store = createStore(reducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('reducers', () =>
      store.replaceReducer(require('reducers').default)
    );
  }

  return store;
  // Production:
  //return createStore(reducer, initialState, enhancer);
}
