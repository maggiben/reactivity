import * as types from 'constants/ActionTypes';

export const addItem = payload => ({ type: types.ADD_ITEM, payload });
export const emitItem = id => ({ type: types.EMIT_ITEM, id });

export function sendMessage (message) {
  return function (dispatch, getState) {
    let state = getState();
    console.log('state: ', state)
    return dispatch({
      type:'server/hello',
      data: new Date().toString()
    });
  }
}
