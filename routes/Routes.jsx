import React from 'react';
import { Router, Route, Redirect, hashHistory, browserHistory, IndexRoute } from 'react-router';
import { Main, Home, About, NotFound } from 'containers';

export default (
  <Route path="/" component={Main} name="Main">
    <IndexRoute component={Home} name='Home'/>
    <Route path="/about" component={About} />
    <Redirect from="/*" to="/" />
    <Route path="*" component={NotFound} />
  </Route>
);
