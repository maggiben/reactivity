import React from 'react';
import { DevTools } from 'containers';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import * as Actions from 'actions/list';

function mapStateToProps(state) {
  return {
    router: state.routing,
    list: state.list
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Main extends React.Component {

  addItem = item => {
    let { actions } = this.props;
    console.log('actions', actions, moment)
    actions.addItem({
      text: `Date: ${moment(new Date()).format('LT')}`,
      marked: false,
      id: 0
    });
    actions.sendMessage('hello world');
  }

  render () {
    let { list } = this.props;
    let json = list.toJS();
    let date = new Date();
    return (
      <div className="page">
        <DevTools />
        <h1>Main: {date.toString()}</h1>
        {
          json.map((item, index) => (
            <li key={index}>{item.text}</li>
          ))
        }
        <hr />
        <button onClick={this.addItem}>Add</button>
      </div>
    );
  }
};
