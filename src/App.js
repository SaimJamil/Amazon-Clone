import './App.css';
import Header from './Header';
import Home from './Home'
import {BrowserRouter as Router,Switch,Rote, Route} from "react-router-dom"
import Checkout from './Checkout';
import Payment from './Payment';
import Login from './Login';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';
import React, { useEffect, useState } from 'react';
import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'
import Orders from './Orders';

const promise=loadStripe("pk_test_51IKgNILPL5v4UlqgLitfpNubuPqWHY4iBqtkcPpyeoe2mF42PX46hGAp6bmrnj92hrkTaKCqE8xSGtWaV6zXbQ7F00gUyV9NVp");
function App() {
  const [{},dispatch]= useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged(authUser=>{
      if(authUser)
      {
        dispatch({
          type:'SET_USER',
          user:authUser
        })
      }
      else
      {
        dispatch({
          type:'SET_USER',
          user:null
        })
      }
    })
  }, [])

  return (
    <Router>
    <div className="app">
      <Switch>
      <Route path="/checkout">
          <Header/>
          <Checkout/>
        </Route>
        <Route path="/payment">
          <Header/>
          <Elements stripe={promise}>
            <Payment/>
          </Elements>
        </Route>
        <Route path="/orders">
          <Header/>
          <Orders/>
        </Route>
        <Route path="/login">
          <Login/>
        </Route>

        <Route path="/">
        <Header/>
          <Home/>
        </Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
