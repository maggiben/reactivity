import { persistState } from 'redux-devtools';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import { ADD_ITEM, DELETE_ITEM, EDIT_ITEM, MARK_ITEM, MARK_ALL, CLEAR_MARKED, EMIT_ITEM } from 'constants/ActionTypes';

/* reducers */
import * as reducers from 'reducers';
/* DevTools */
import { DevTools } from 'containers';

/* socket middleware */
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
let socket = io('http://localhost:8080/situationroomremote');
let socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

setTimeout(function () {
  socket.emit('need-registation-id');
}, 2500)


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
  bindStoreSocket(store);
  return store;
  // Production:
  //return createStore(reducer, initialState, enhancer);
}


function bindStoreSocket(store) {
  socket.on('connect', function () {
    console.log('Socket is connected');
  })

  socket.on('error', function (error) {
    console.error('received a socket connection error event', error);
  });

  socket.on('disconnect', function () {
    console.warn('received a socket disconnect event');
  });

  socket.on('registration-id', function (data) {
    console.info('Got registration id: ' + data);
    store.dispatch({
      type: ADD_ITEM,
      payload: {
        text: 'Got registration id: ' + data,
        marked: false,
        id: 0
      }
    });
  });

  socket.on('goto', function (destination) {
    console.info('goto: ' + destination);
    store.dispatch({
      type: ADD_ITEM,
      payload: {
        text: 'goto: ' + destination,
        marked: false,
        id: 0
      }
    });
  });

  socket.on('setAuthentication', function (payload) {
    console.log('authentication payload' + JSON.stringify(payload));
    socket.emit('intendToAuthenticate', null, function(ack) {
      console.log('Server is waiting for token now, emit authenticate with token');
      socket.emit('authenticate', {token: payload.token});
    });
  });


  // Listens to the window refresh event
  socket.on('reloadWindow', function () {
    console.info('Received command reloadWindow');
    window.location.reload();
  });
}
