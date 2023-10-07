import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { Route } from 'react-router-dom';

export const App = () => {
  return (
    <div>
    <Navbar/>
    <Route path='/'>
     <HomePage/>
    </Route>
    <SearchBooksPage/>
    <Footer/>
    </div>
  );
}