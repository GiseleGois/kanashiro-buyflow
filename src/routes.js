import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import ShoppingCart from './pages/schedulePurchase';
import History from './pages/history';

function Routes() {
  return (
    <Router>
      <Route path='/' exact component={Login} />
      <Route path='/register' component={Register} />
      <Route path='/home' component={Home} />
      <Route path='/schedule-purchase' component={ShoppingCart} />
      <Route path='/history' component={History} />
    </Router>
  );
}

export default Routes;