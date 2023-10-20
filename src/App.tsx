import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { Redirect, Route, Switch,useHistory } from 'react-router-dom';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import {OktaAuth , toRelativeUrl} from '@okta/okta-auth-js';
import { LoginCallback, Security } from '@okta/okta-react';
import { rename } from 'fs';
import { render } from '@testing-library/react';
import LoginWidget from './Auth/loginWidget';
import { oktaConfig } from './lib/oktaConfig';

const oktaAuth = new OktaAuth(oktaConfig);
export const App = () => {

  const customAuthHandler = () => {
    history.push('/login');
  }

  const history = useHistory();
  
  const restoreOriginalUri = async(_oktaAuth: any , originalUri:any) => {
    history.replace(toRelativeUrl(originalUri || '/' , window.location.origin));
  }
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
      <Navbar />
      <div className='flex-gow-1'>
        <Switch>
          {/* Redirect will redirect to the action inside "to" */}
          <Route path='/' exact>
            <Redirect to='/home' />
            <HomePage />
          </Route>
          <Route path="/home">
            <HomePage />
          </Route>
          <Route path='/search'>
            <SearchBooksPage />
          </Route>
          <Route path={'/checkout/:bookId'}>
            <BookCheckoutPage/>
          </Route>
          <Route path='/login' render={
            () =>
             <LoginWidget config={oktaConfig}/>
          }/>
          <Route path='/login/callback' component={LoginCallback}/>
        </Switch>
      </div>
      <Footer/>
      </Security>
    </div>
  );
}