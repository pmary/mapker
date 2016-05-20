import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import PrimaryNav from '../primary_nav/primary_nav';

storiesOf('core.PrimaryNav', module)
  .add('default view', () => (
    <PrimaryNav />
  ));
