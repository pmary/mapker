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
				className={this.props.className + " typeahead-suggestion"}
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
    this.state = {
			taxon: '',
			suggestionsVisible: false,
			focusedSuggestIndex: null
		};
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
						if (res.suggester[0].options.length) {
							this.setState({suggestions: res.suggester[0].options});
						}
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
    }, 100);
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
		// If there is a callback fot the suggestion selection
		if (this.props.onSelect) {
			// Clear the search and the suggestions
			this.setState({
				taxon: '',
				suggestionsVisible: false,
				suggestions: []
			});

			// Pass the suggestion in the onSelect callback
			this.props.onSelect(suggestion);

			// Set the focus on the input
			this.refs[this.props.refKey+'typeaheadContainer'].getElementsByTagName('input')[0].focus()
		}
		else {
			this.setState({
				taxon: suggestion.text,
				suggestionsVisible: false
			});
			this.props.onSelect(suggestion);
		}
	}
  handleChange(e) {
		this.handleTaxonChange(e.target.value);
  }
	moveFocus(dir) {
		this.setState({
			focusedSuggestIndex: this.state.focusedSuggestIndex === null ?
				0 : Math.max(0,
					Math.min(
						this.state.suggestions.length - 1,
						this.state.focusedSuggestIndex + dir))
		});
	}
	handleKeyDown(e) {
		e.persist();

		switch (e.key) {
      case 'Enter':
				console.log('Press Enter');
				console.log('focusedSuggestIndex: ', this.state.focusedSuggestIndex);
				if(this.state.taxon && this.state.focusedSuggestIndex == null) {
					if (this.props.onSubmit) {
						// Send the submited value to the callback
						this.props.onSubmit(e.target.value);

						// Clear the search and the suggestions
						this.setState({
							taxon: '',
							suggestionsVisible: false,
							suggestions: [],
							focusedSuggestIndex: null
						});
					}
				}
				else if (this.state.suggestions.length) {
					console.log('In else');
					console.log('this.state.suggestions: ', this.state.suggestions);
					console.log('this.state.focusedSuggestIndex: ', this.state.focusedSuggestIndex);
					if (this.props.onSelect) {
						// Send the submited value to the callback
						let suggest = this.state.suggestions[this.state.focusedSuggestIndex];
						this.props.onSelect(suggest);

						// Clear the search and the suggestions
						this.setState({
							taxon: '',
							suggestionsVisible: false,
							suggestions: [],
							focusedSuggestIndex: null
						});
					}
				}
				break

			case 'ArrowUp':
				e.preventDefault();
				this.moveFocus(-1);
				break

			case 'ArrowDown':
				e.preventDefault();
				this.moveFocus(1);
				break
		}
	}

	focusSuggest(index) {
    this.setState({ focusedSuggestIndex: index })
  }

	// Set the focus to the input
	focusInput() {
		this.refs.input.focus();
	}

  render() {
		var suggestions = null;
		if (this.state.suggestions) {
			suggestions = this.state.suggestions.map( (suggestion, key) => {
	      return (
					<Suggestion
						onClick={this.handleSelect.bind(this)}
						key={
							'typeahead-suggestion-' +
							suggestion.text.replace(/[^A-Z0-9]/ig, "_")
						}
						className={(this.state.focusedSuggestIndex === key ? 'taxonsSuggest_suggest-active' : '')}
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
						ref="input"
	          className={this.props.className + ' form-control typeahead-input'}
	          placeholder={this.props.placeholder}
	          value={this.state.taxon}
	          onChange={this.handleChange.bind(this)}
						onKeyDown={this.handleKeyDown.bind(this)}
						onFocus={this.handleFocus.bind(this)}
						required={this.props.required}
						autocomplete="off"
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
