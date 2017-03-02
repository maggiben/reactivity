import Immutable from 'immutable';
import { ADD_ITEM, DELETE_ITEM, EDIT_ITEM, MARK_ITEM, MARK_ALL, CLEAR_MARKED, EMIT_ITEM } from 'constants/ActionTypes';

const initialStateJS = [{
  text: 'Use Redux',
  marked: false,
  id: 0
}];


const initialState = Immutable.fromJS(initialStateJS);

export default function list(state = initialState, action) {
  console.log('REDUCE: ', action.type)
  switch (action.type) {
  case ADD_ITEM:
    return state.unshift(Immutable.fromJS({
      id: (state.size === 0) ? 0 : state.first().get('id') + 1,
      marked: false,
      text: action.payload.text
    }));
  default:
    return state;
  }
}
