import React from 'react';
import Alert from 'react-s-alert';
import PrimaryNav from '../components/primary_nav/primary_nav.js';

export const App = ( { children } ) => (
  <div>
    <PrimaryNav />
    { children }
    <Alert stack={{limit: 3}} />
  </div>
)
