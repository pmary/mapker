import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory, Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import Alert from 'react-s-alert';
import { Taxons } from '/imports/api/taxons/taxons.js';
import ElasticTypeahead from '/imports/ui/components/elastic/typeahead.js';

class TaxonRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      english: this.props.taxon.name,
      chinese: this.props.taxon.i18n.zh.name,
      french: this.props.taxon.i18n.fr.name,
      type: 'skill'
    };
  }
  handleClickEdit(event) {
    event.preventDefault();
    this.setState({editing: true});
  }
  handleClickCancel(event) {
    event.preventDefault();
    this.setState({editing: false});
  }
  handleClickActivate(event) {
    Meteor.call('taxons.activate', this.props.taxon._id, function (err) {
      if (err) {
        console.log('taxons.activate: ', err);
      }
    })
  }
  handleEnglishChange(event) { this.setState({english: event.target.value}); }
  handleChineseChange(event) { this.setState({chinese: event.target.value}); }
  handleFrenchChange(event) { this.setState({french: event.target.value}); }
  handleTypeChange(event) { this.setState({type: event.target.value}); }
  handleSubmit(event) {
    event.preventDefault();
    // If there is not at least the english label, return
    if (!this.props) { return; }

    // Call the 'taxons.add' with the different labels
    Meteor.call(
      'taxons.update',
      this.props.taxon._id,
      this.state.english,
      this.state.chinese,
      this.state.french,
      this.state.type,
      (err, res) => {
        // Close the edit form
        this.setState({editing: false});
        // Handle the errors
        if (err) { console.log('err: ', err); }
      }
    );
  }
  render() {
    return (
      <tr className={this.state.editing ? 'editing' : null}>
        <td>
          {this.props.taxon._id}
        </td>
        <td>
          {this.props.taxon.name}
        </td>
        <td>
          {this.props.taxon.i18n.zh.name}
        </td>
        <td>
          {this.props.taxon.i18n.fr.name}
        </td>
        <td>
          {this.props.taxon.type}
        </td>
        <td>
          <button
            onClick={this.handleClickEdit.bind(this)}
            type="button"
            className="btn btn-primary btn-xs"
          >
            Edit
          </button>

          <Link
            to={`/admin42/taxons/edit/${this.props.taxon._id}`}
            type="button"
            className="btn btn-danger btn-xs"
          >
            Delete
          </Link>
          { !this.props.taxon.verified ?
            <button
              onClick={this.handleClickActivate.bind(this)}
              type="button"
              className="btn btn-success btn-xs"
            >
              Activate
            </button>
            : null
          }
        </td>
        <td className="edition-row" colSpan="6">
          <h4>Editing {this.state.english}</h4>
          <form className="form-inline" onSubmit={this.handleSubmit.bind(this)}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="English"
                value={this.state.english}
                onChange={this.handleEnglishChange.bind(this)}
                required />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Cantonese Chinese"
                value={this.state.chinese}
                onChange={this.handleChineseChange.bind(this)} />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="French"
                value={this.state.french}
                onChange={this.handleFrenchChange.bind(this)} />
            </div>
            <div className="form-group">
              <select
                className="form-control"
                value={this.state.type}
                onChange={this.handleTypeChange.bind(this)}
              >
                <option value="skill">Skill</option>
                <option value="place-category">Place category</option>
              </select>
            </div>
            <button
              type="button"
              className="btn btn-default"
              onClick={this.handleClickCancel.bind(this)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </td>
      </tr>
    )
  }
}

class AdminTaxons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {english: '', chinese: '', french: '', type: 'skill'};
  }
  handleEnglishChange(value) { console.log('Value: ', value);this.setState({english: value}); }
  handleChineseChange(event) { this.setState({chinese: event.target.value}); }
  handleFrenchChange(event) { this.setState({french: event.target.value}); }
  handleTypeChange(event) { this.setState({type: event.target.value}); }
  handleSubmit(event) {
    event.preventDefault();

    // If there is not at least the english label, return
    if (!this.state.english) {
      return;
    }

    // Call the 'taxons.add' method with the different labels
    Meteor.call(
      'taxons.add',
      this.state.english,
      this.state.chinese,
      this.state.french,
      this.state.type,
      function (err, res) {
        if (err) { console.log('err: ', err); }
        else { console.log('res: ', res); }
      }
    );
  }
  /**
   * Handle the ElasticTypeahead component 'onSelectSuggest' callback
   * @param { text: String, score: Number, payload: { _id: String } }
   */
  handleSelectSuggest(suggest) {
    console.log(suggest);
  }
  handleResetIndex(event) {
    // Set the submit btn state to loading
    var target = $(event.currentTarget);
    target.button('loading');

    // Call the 'elastic.taxons.reset' method with the different labels
    Meteor.call('elastic.taxons.reset', function (err, res) {
      target.button('reset');
      if (err) {
        console.log('err: ', err);
        Alert.error(err.reason, {
          position: 'top-right',
          effect: 'jelly'
        });
      }
      else {
        Alert.success('The taxon index has been successfully reset', {
          position: 'top-right',
          effect: 'jelly'
        });
      }
    });
  }
  render() {
    var taxonRows = this.props.taxons.map(function (taxon) {
      return (<TaxonRow key={taxon._id} taxon={taxon} />)
    });

    unverifiedTaxonsRows = this.props.unverifiedTaxons.map(function (taxon) {
      return (<TaxonRow key={taxon._id} taxon={taxon} />)
    });

    return (
      <div className="taxons-page">
        <h1>Taxons</h1>

        <h2>Add a Taxon</h2>
        <form className="form-inline" onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group">
            <ElasticTypeahead
              placeholder="English"
              refKey="adminTaxonNameInput"
              onChange={this.handleEnglishChange.bind(this)}
              onSelect={this.handleSelectSuggest.bind(this)}
              required={true}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Cantonese Chinese"
              value={this.state.chinese}
              onChange={this.handleChineseChange.bind(this)} />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="French"
              value={this.state.french}
              onChange={this.handleFrenchChange.bind(this)} />
          </div>
          <div className="form-group">
            <select
              className="form-control"
              value={this.state.type}
              onChange={this.handleTypeChange.bind(this)}
            >
              <option value="skill">Skill</option>
              <option value="place-category">Place category</option>
            </select>
          </div>
          <button type="submit" className="btn btn-default">Add</button>
        </form>

        <h2>Elastic Index</h2>
        <button
          type="button"
          className="btn btn-danger"
          data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i>"
          onClick={this.handleResetIndex.bind(this)}
        >
          Reset the index
        </button>

        <h2>Unverified Taxons</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Id</th>
              <th>English</th>
              <th>Chinese</th>
              <th>French</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {unverifiedTaxonsRows}
          </tbody>
        </table>

        <h2>List</h2>

        <div className="form-group">
          <label for="exampleInputEmail1">Search</label>
          <ElasticTypeahead />
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Id</th>
              <th>English</th>
              <th>Chinese</th>
              <th>French</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {taxonRows}
          </tbody>
        </table>
      </div>
    )
  }
}

// Define the type of the given properties
AdminTaxons.propTypes = {
  loading: PropTypes.bool,
  taxons: PropTypes.array.isRequired,
  unverifiedTaxons: PropTypes.array.isRequired
}

/**
 * Create a container component to reactively render the wrapped component in
 * response to any changes to reactive data sources accessed from inside the
 * function proded to it.
 *
 * @see http://guide.meteor.com/react.html#data
 */
export default createContainer (({ params }) => {
  const taxonsHandler = Meteor.subscribe('taxons.admin.find');
  const loading = !taxonsHandler.ready();

  return {
    loading,
    taxons: Taxons.find({}, {limit: 10}).fetch(),
    unverifiedTaxons: Taxons.find({verified: false}).fetch()
  }

}, AdminTaxons);
