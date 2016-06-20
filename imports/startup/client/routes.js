import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { App } from '/imports/ui/layouts/app.js';
import { AccountsLayout } from '/imports/ui/layouts/account.js';
import Home from '/imports/ui/pages/home.js';
import NotFound from '/imports/ui/pages/404.js';
import SignIn from '/imports/ui/pages/accounts/sign_in.js';
import SignUp from '/imports/ui/pages/accounts/sign_up.js';
import ForgotPassword from '/imports/ui/pages/accounts/forgot_password.js';
import ResetPassword from '/imports/ui/pages/accounts/reset_password.js';
import AccountActivation from '/imports/ui/pages/accounts/account_activation.js';
import TermsOfService from '/imports/ui/pages/legal/terms_of_service.js';

// Administration
import { AdminLayout } from '/imports/ui/layouts/admin.js';
import AdminHome from '/imports/ui/pages/admin/home.js';
import AdminTaxons from '/imports/ui/pages/admin/taxons.js';

// Profile
import Profile from '/imports/ui/pages/profiles/profile.js';

Meteor.startup( () => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App } >
        <IndexRoute component={ Home } />
        <Route path="/?signed-up" component={ Home } />
        <Route path="/users/:username" component={ Profile } />
        <Route path='*' component={NotFound} />
      </Route>
      <Route path="/" component={ AccountsLayout } >
        <Route path="/sign-in" component={ SignIn } />
        <Route path="/sign-up" component={ SignUp } />
        <Route path="/forgot-password" component={ ForgotPassword } />
        <Route path="/reset-password/:token" component={ ResetPassword } />
        <Route path="/activate-account" component={ AccountActivation } />
        <Route path="/verify-email/:token" component={ AccountActivation } />
      </Route>
      <Route path="/" component={ AdminLayout } >
        <Route path="/admin42" component={ AdminHome } />
        <Route path="/admin42/taxons" component={ AdminTaxons } />
      </Route>
    </Router>,
    document.getElementById( 'react-root' )
  );
});
