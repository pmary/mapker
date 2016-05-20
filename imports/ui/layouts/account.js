import React from 'react';
import Alert from 'react-s-alert';

export const AccountsLayout = ( { children } ) => (
  <div>
    <div className="accounts-layout">
      { children }
    </div>
    <Alert stack={{limit: 3}} />
  </div>
)
