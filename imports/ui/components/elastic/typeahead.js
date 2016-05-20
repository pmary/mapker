import React from 'react';
import ReactDOM from 'react-dom';

// http://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

class Suggestion extends React.Component {
	constructor(props) {
    super(props);
	}
	handleClick() {
		this.props.onClick(this.props.suggestion)
	}
	render() {
    return (
			<div
				className="typeahead-suggestion"
				onClick={this.handleClick.bind(this)}
			>
				{this.props.suggestion.text}
			</div>
		)
	}
}

class ElasticTypeahead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {taxon: '', suggestionsVisible: false};
    this.handleTaxonChangeDebounced = debounce( (query) => {
			// Suggeset query against the ES index
      Meteor.call('elastic.taxon.search', query, (err, res) => {
        if (err) { console.log(err); }
        else {
					// Get the autocomplete suggestions
					if (
						res.suggester &&
						res.suggester[0] &&
						res.suggester[0].options &&
						res.suggester[0].options.length
					) {
						this.setState({suggestions: res.suggester[0].options});
						/*for (let i = 0; i < res.suggester[0].options.length; i++) {
							console.log(res.suggester[0].options[i]);
						}*/
						// Display the suggestions list if there is at leat 1 suggestion
						// and if its text is different to the query string
						if (
							res.suggester[0].options.length == 1 &&
							res.suggester[0].options[0].text == query
						) {
							this.setState({suggestionsVisible: false});
						}
						else {
							this.setState({suggestionsVisible: true});
						}
					}
				}
      });
    }, 200);
  }
	// If there is a click outside of the component, hide the suggestions list
	handleClick(e) {
  	if (
			!this.refs[this.props.refKey+'typeaheadContainer'].contains(e.target) &&
			!this.refs[this.props.refKey+'typeaheadSuggestionsContainer'].contains(e.target)
		) {
			// Hide the suggestions list
			this.setState({suggestionsVisible: false});
    	return;
    }
		else {
			return;
		}
  }
  componentWillMount() {
    document.addEventListener('click', this.handleClick.bind(this), false);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick.bind(this), false);
  }
	handleFocus() {
		// Display the suggestions list if there is at leat 1 suggestion
		// and if its different to the query string
		if (
			this.state.suggestions &&
			this.state.suggestions.length == 1 &&
			this.state.suggestions[0].text == this.state.taxon
		) {
			this.setState({suggestionsVisible: false});
		}
		else {
			this.setState({suggestionsVisible: true});
		}
	}
	handleTaxonChange(value) {
		// If there is a function passed as prop, execute it
		if (this.props.onChange && typeof this.props.onChange === "function") {
			this.props.onChange(value);
		}

    this.setState({taxon: value});
    // Prevent the function to be called more than once every 2 secondes
    this.handleTaxonChangeDebounced(value);
	}
	handleSelect(suggestion) {
		this.handleTaxonChange(suggestion.text);
		// Pass the suggestion in the onSelect callback
		this.props.onSelect(suggestion);

		// Clear the search and the suggestions
		this.setState({taxon: ''});
		this.setState({suggestionsVisible: false});
		this.setState({suggestions: []});
	}
  handleChange(event) {
		this.handleTaxonChange(event.target.value);
  }
  render() {
		var suggestions = null;
		if (this.state.suggestions) {
			suggestions = this.state.suggestions.map( (suggestion) => {
	      return (
					<Suggestion
						onClick={this.handleSelect.bind(this)}
						key={
							'typeahead-suggestion-' +
							suggestion.text.replace(/[^A-Z0-9]/ig, "_")
						}
						suggestion={suggestion} />
				)
	    });
		}

    return (
      <div>
				<div
					className="typeahead-container"
					ref={this.props.refKey+'typeaheadContainer'}
				>
	        <input
	          type="text"
	          className={this.props.className + ' form-control typeahead-input'}
	          placeholder={this.props.placeholder}
	          value={this.state.taxon}
	          onChange={this.handleChange.bind(this)}
						onFocus={this.handleFocus.bind(this)}
						required={this.props.required}
	        />
					<div
						className={
							(this.state.suggestionsVisible ? 'visible ' : ' ') +
							" typeahead-suggestions-container"
						}
						ref={this.props.refKey+'typeaheadSuggestionsContainer'}
					>
						{suggestions}
					</div>

	      </div>
			</div>
    )
  }
}

export default ElasticTypeahead;
