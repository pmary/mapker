import React from 'react';
import ReactDOM from 'react-dom';

class LocationForm extends React.Component {
  constructor(props) {
    super(props);

    // If the google api is not loaded
    if (typeof window.google === 'undefined') {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = false;
      s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBOIIm50Q6SQZdY8FXpLLTplUOQnBG2ltg&signed_in=true&libraries=places';
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    }

    this.state = {
      coordinate: null,
      search: '',
      suggests: [],
      selectedLabel: '',
      focusedSuggestIndex: 0
     };
  }

  handleSelectSuggest(suggest) {
    this.geocodeSuggest(suggest.label, (label, coordinate) => {
      this.setState({ selectedLabel: suggest.label, suggests: [] }, () => {
        if (this.props.onSelectSuggest) {
          this.setState({search: suggest.label});
          this.props.onSelectSuggest(suggest.label, this.state.coordinate);
        }
      })
    })
  }

  updateSuggests(search) {
    const autocompleteService = new google.maps.places.AutocompleteService();

    if (!search) {
      this.setState({suggests: []})
      return;
    }

    autocompleteService.getPlacePredictions({
      input: search,
      location: new google.maps.LatLng(0, 0),
      radius: 20,
    }, (googleSuggests, serviceStatus) => {
      if (!googleSuggests) {
        this.setState({suggests: []})
        return;
      }

      const suggests = googleSuggests.map((suggest, key) => {
        const [ label, ...items ] = suggest.terms
        const address = items.map((item) => item.value).join(', ')
        const firstMatchedString = suggest.matched_substrings.shift()

        return {
          label: label.value + (address.length > 0 ? ', ' + address : ''),
          labelParts: {
            before: label.value.substr(0, firstMatchedString.offset),
            matched: label.value.substr(firstMatchedString.offset, firstMatchedString.length),
            after: label.value.substr(firstMatchedString.offset + firstMatchedString.length),
          },
          address: address,
        }
      });

      this.setState({ focusedSuggestIndex: 0, suggests: suggests })
    });
  }

  geocodeSuggest(suggestLabel, callback) {
    const geocoder = new google.maps.Geocoder()

    geocoder.geocode({ address: suggestLabel }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const location = results[0].geometry.location
        const coordinate = {
          latitude: location.lat(),
          longitude: location.lng(),
          title: suggestLabel,
        }

        this.setState({coordinate: coordinate});
        callback(results[0].formatted_address, coordinate);
      }
    })
  }

  handleKeyDown(e) {
    switch (e.key) {
      case 'Enter':
        this.handleSelectSuggest(
          this.state.suggests[this.state.focusedSuggestIndex]
        )
        break

      case 'ArrowUp':
        if (
          this.state.suggests.length > 0 &&
          this.state.focusedSuggestIndex > 0
        ) {
          this.focusSuggest(this.state.focusedSuggestIndex - 1)
        }
        e.preventDefault();
        break

      case 'ArrowDown':
        if (
          this.state.suggests.length > 0 &&
          this.state.focusedSuggestIndex < this.state.suggests.length - 1
        ) {
          this.focusSuggest(this.state.focusedSuggestIndex + 1)
        }
        e.preventDefault();
        break
    }
  }

  focusSuggest(index) {
    this.setState({ focusedSuggestIndex: index })
  }

  renderMarkerIcon() {
    return (
      <svg className="placesSuggest_suggestIcon" width="15" height="15" viewBox="0 0 16 24">
        <path d="m12 0c-4.4183 2.3685e-15 -8 3.5817-8 8 0 1.421 0.3816 2.75 1.0312 3.906 0.1079 0.192 0.221 0.381 0.3438 0.563l6.625 11.531 6.625-11.531c0.102-0.151 0.19-0.311 0.281-0.469l0.063-0.094c0.649-1.156 1.031-2.485 1.031-3.906 0-4.4183-3.582-8-8-8zm0 4c2.209 0 4 1.7909 4 4 0 2.209-1.791 4-4 4-2.2091 0-4-1.791-4-4 0-2.2091 1.7909-4 4-4z"/>
      </svg>
    )
  }

  renderSuggest(suggest, key) {
    const { labelParts } = suggest

    return (
      <li
        key={ key }
        className={'placesSuggest_suggest '+ (this.state.focusedSuggestIndex === key ? 'placesSuggest_suggest-active' : '')}
        onClick={ () => this.handleSelectSuggest(suggest) }>
        { this.renderMarkerIcon() }
        <span className="placesSuggest_suggestLabel">
          { labelParts.before.length > 0 ? <span>{ labelParts.before }</span> : null }
          <span className="placesSuggest_suggestLabel-matched">{ labelParts.matched }</span>
          { labelParts.after.length > 0 ? <span>{ labelParts.after }</span> : null }
        </span>
        <span className="placesSuggest_suggestAddress">{ suggest.address }</span>
      </li>
    )
  }

  renderSuggests() {
    return (
      <ul className="placesSuggest_suggests">
        { this.state.suggests.map((suggest, key) => this.renderSuggest(suggest, key)) }
      </ul>
    )
  }

  onChangeHandler(e) {
    this.setState({search: e.target.value});
    this.updateSuggests(e.target.value);
    if(this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  }

  render() {
    return (
      <div onKeyDown={ this.handleKeyDown.bind(this) }>
        <div className="form-group address-autocomplete-container">
          <input
            type="text"
            className={this.props.className + " form-control"}
            id="address-autocomplete"
            placeholder={this.props.placeholder}
            value={this.state.search}
            onChange={this.onChangeHandler.bind(this)}
            autocomplete="off"
          />
          <div className="placesSuggest">
            { this.props.children }
            {
              this.state.selectedLabel !== this.state.search &&
              this.state.search ? this.renderSuggests() : null
            }
          </div>
        </div>
      </div>
    )
  }
}

export default LocationForm;
