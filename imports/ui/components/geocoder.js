import React, { Component, PropTypes } from 'react';

function search(endpoint, source, accessToken, proximity, query, callback) {
  var searchTime = new Date();
  var uri = endpoint + '/geocoding/v5/' +
    source + '/' + encodeURIComponent(query) + '.json' +
    '?access_token=' + accessToken +
    (proximity ? '&proximity=' + proximity : '');
  $.get(uri, function () {
  }).done(function (result, state) {
    callback(false, state, result, searchTime);
  }).fail(function (err, other1, other2) {
    callback(err, state, null, searchTime);
  });
}

/**
 * Geocoder component: connects to Mapbox.com Geocoding API
 * and provides an autocompleting interface for finding locations.
 */
 class Geocoder extends React.Component {
   constructor(props) {
     super(props);

     this.state = {
       results: [],
       focus: null,
       loading: false,
       searchTime: new Date(),
       inputValue: '',
       suggestionsVisible: false
     }
   }
   componentDidMount() {
     console.log('Geocoder mount');
     if (this.props.focusOnMount) this.refs.input.focus();

   }
   componentWillMount() {
     document.addEventListener('click', this.handleClick.bind(this), false);
   }
   componentWillUnmount() {
     document.removeEventListener('click', this.handleClick.bind(this), false);
   }
   // Used by parent via the component ref to modify the inputValue state
   updateInputValue(val) {
     this.setState({inputValue: val});
   }
   // Used by parent via the component ref to geocode a text location
   doGeocode(value) {
     console.log('doGeocode');
     search(
       this.props.endpoint,
       this.props.source,
       this.props.accessToken,
       this.props.proximity,
       value,
       this.onResult.bind(this));
   }
 	 handleClick(e) {
     // If there is a click outside of the component, hide the suggestions list
     if (
       !this.refs.container.contains(e.target) &&
       !this.refs.suggestionsContainer.contains(e.target)
     ) {
       // Hide the suggestions list
       this.setState({suggestionsVisible: false});
       return;
     }
     else {
       return;
     }
   }
   onChange(e) {
     var value = e.target.value;

     this.setState({inputValue: value});
     this.setState({loading:true});
     this.setState({loading:true});

     // If there is a callback function
     if (this.props.onChange) { this.props.onChange(value); }

     // If there is a value
     if (value === '') {
       this.setState({
         results: [],
         focus: null,
         loading:false
       });
     } else {
       search(
         this.props.endpoint,
         this.props.source,
         this.props.accessToken,
         this.props.proximity,
         value,
         this.onResult.bind(this));
     }
   }
   onFocus(e) {
     this.setState({suggestionsVisible: true});
   }
   moveFocus(dir) {
     if(this.state.loading) return;
     this.setState({
       focus: this.state.focus === null ?
         0 : Math.max(0,
           Math.min(
             this.state.results.length - 1,
             this.state.focus + dir))
     });
   }
   acceptFocus() {
     if (this.state.focus !== null) {
       //this.props.onSelect(this.state.results[this.state.focus]);
     }
   }
   onKeyDown(e) {
     switch (e.which) {
       // up
       case 38:
         e.preventDefault();
         this.moveFocus(-1);
         break;
       // down
       case 40:
         this.moveFocus(1);
         break;
       // accept
       case 13:
         if( this.state.results.length > 0 && this.state.focus == null) {
           this.clickOption(this.state.results[0],0);
         }
         else if (this.state.results.length > 0) {
           this.clickOption(this.state.results[this.state.focus], 0);
         }
         this.acceptFocus();
         break;
     }
   }
   onResult(err, res, body, searchTime) {
     // searchTime is compared with the last search to set the state
     // to ensure that a slow xhr response does not scramble the
     // sequence of autocomplete display.
     if (!err && body && body.features && this.state.searchTime <= searchTime) {
       this.setState({
         searchTime: searchTime,
         loading: false,
         results: body.features,
         focus: null
       });

       // If the parent component has a callback function for the suggest
       if (this.props.onSuggest) {
         this.props.onSuggest(this.state.results);
        }
     }
   }
   clickOption(place, listLocation) {
     this.setState({focus:listLocation, inputValue: place.place_name});

     // focus on the input after click to maintain key traversal
     this.refs.input.focus();

     // Clear the result list
     this.setState({results: []});

     // If there is a callback function to a parent component
     if (this.props.onSelect) {
       this.props.onSelect(place);
     }
     return false;
   }

   render() {
     var value = `${this.props.inputValue}`;
     var input = <input
       ref="input"
       className={this.props.inputClass}
       onChange={this.onChange.bind(this)}
       onKeyDown={this.onKeyDown.bind(this)}
       onFocus={this.onFocus.bind(this)}
       placeholder={this.props.inputPlaceholder}
       value={this.state.inputValue}
       type="text" />;
     return (
       <div className="geocoder-container" ref="container">
         {this.props.inputPosition === 'top' && input}
         <div ref="suggestionsContainer">
           {(this.state.results.length > 0 && this.state.suggestionsVisible) && (
             <ul className={`${this.props.showLoader && this.state.loading ? 'loading' : ''} ${this.props.resultsClass}`}>
               {this.state.results.map((result, i) => (
                 <li
                   key={result.id}
                   onClick={this.clickOption.bind(this, result, i)}
                   className={this.props.resultClass + ' ' + (i === this.state.focus ? this.props.resultFocusClass : '')}
                  >
                    {result.place_name}
                 </li>
               ))}
             </ul>
           )}
         </div>
         {this.props.inputPosition === 'bottom' && input}
       </div>
     );
   }
 }

 Geocoder.propTypes = {
   endpoint: PropTypes.string,
   source: PropTypes.string,
   inputClass: PropTypes.string,
   inputValue: PropTypes.string,
   resultClass: PropTypes.string,
   resultsClass: PropTypes.string,
   inputPosition: PropTypes.string,
   inputPlaceholder: PropTypes.string,
   resultFocusClass: PropTypes.string,
   onSelect: PropTypes.func.isRequired,
   onSuggest: PropTypes.func,
   accessToken: PropTypes.string.isRequired,
   proximity: PropTypes.string,
   showLoader: PropTypes.bool,
   focusOnMount: PropTypes.bool
 }

 Geocoder.defaultProps = {
   endpoint: 'https://api.tiles.mapbox.com',
   inputClass: '',
   inputValue: '',
   resultClass: '',
   resultsClass: '',
   resultFocusClass: 'strong',
   inputPosition: 'top',
   inputPlaceholder: 'Search',
   showLoader: false,
   source: 'mapbox.places',
   proximity: '',
   onSuggest: function() {},
   focusOnMount: true
 }

export default Geocoder;
