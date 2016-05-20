import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { Button } from 'react-bootstrap';

storiesOf('Button', module)
  .add('with a text', () => (
    <Button bsStyle="primary">Primary</Button>
  ))
  .add('with no text', () => (
    <button></button>
  ));
