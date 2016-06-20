import React from 'react';

class NotFound extends React.Component{
  constructor(props) {
    super();
  }
  render() {
    return (
      <div className='page-not-found'>
        <h1>Sorry, this page isn't available</h1>
        <h2>The link you followed may be broken, or the page may have been
        removed.</h2>
        <i className="fa fa-chain-broken" aria-hidden="true"></i>
      </div>
    )
  }
}

export default NotFound;
