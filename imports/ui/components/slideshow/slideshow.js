import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import MediaQuery from 'react-responsive';

var hasOwn = {}.hasOwnProperty;

function classNames () {
  var classes = '';

  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (!arg) continue;

    var argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes += ' ' + arg;
    } else if (Array.isArray(arg)) {
      classes += ' ' + classNames.apply(null, arg);
    } else if (argType === 'object') {
      for (var key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes += ' ' + key;
        }
      }
    }
  }

  return classes.substr(1);
}

class Slideshow extends React.Component{
  constructor() {
    super()
    this.state = { activeIndex: 0 };
  }
  jumpToSlide(index) {
    this.setState({ activeIndex: index });
  }
  render() {
    return (
      <div className="slideshow">
        <ul className="slideshow-slides">
          {
            this.props.slides.map((slide, index) => (
              <li
                key={"slideshow-slide-" + index}
                className={ classNames({ active: index == this.state.activeIndex }) }
                style={{backgroundImage: slide.backgroundImage, backgroundColor: slide.backgroundColor}}
              >
                <figure>
                  { slide.caption ? <figcaption dangerouslySetInnerHTML={{__html: slide.caption}}></figcaption> : null }
                </figure>
              </li>
            ))
          }
        </ul>
        <ul className="slideshow-dots">
          {
            this.props.slides.map((slide, index) => (
              <li key={"slideshow-dot-" + index} className={ (index == this.state.activeIndex) ? 'active': '' }>
                <a onClick={ (event)=> this.jumpToSlide(index) }>
                  { slide.picto ? <span className={"slider-picto " + slide.picto}></span> : null }
                </a>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
};

export default Slideshow;
