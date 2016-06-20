import React, { Component, PropTypes } from 'react';

var map;
var layerGroup;
var params;
var geocoder;
var input;
var debug;

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

class MapComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map: {},
      searchTime: new Date(),
    }
  }

  componentDidMount() {
    // Render the map
    L.mapbox.accessToken = this.props.accessToken;
    map = L.mapbox.map(this.refs.map, this.props.mapid, {
      maxZoom: 17,
      attributionControl: false,
      zoomControl: true
    }).setView(this.props.center, 12);
    layerGroup = L.layerGroup().addTo(map);
  }

  invalidateSize() {
    map.invalidateSize();
  }

  disableZoom() {
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.keyboard.disable();
  }

  onResult(err, res, body, searchTime) {
    if (!err && body && body.features && this.state.searchTime <= searchTime) {
      this.setState({ searchTime: searchTime });
      // If the component has a callback
      if (this.props.onReverseGeocoding) {
        this.props.onReverseGeocoding(body.features[0]);
      }
    }
  }

  onSelect(res) {
    layerGroup.clearLayers();

    var marker = L.marker(new L.LatLng(
      res.geometry.coordinates[1],
      res.geometry.coordinates[0]
    ), {
      icon: L.mapbox.marker.icon({
        'marker-color': 'f9886c'
      }),
      draggable: true
    });
    var popupContent = "Drag me to adjust the location";
    marker.bindPopup(popupContent,{
        closeButton: false,
    });

    marker.on('dragend', (e) => {
      var marker = e.target;
      var position = marker.getLatLng();
      //marker.setLatLng([position],{id:uni,draggable:'true'}).bindPopup(position).update();

      // Do reverse geocoding
      search(
        this.props.endpoint,
        this.props.source,
        this.props.accessToken,
        this.props.proximity,
        position.lng+','+position.lat,
        this.onResult.bind(this)
      );
    });

    marker.addTo(layerGroup);

    var markerSymbol = res.properties.category &&
      icons[res.properties.category] ?
      icons[res.properties.category].icon :
      'circle-stroked';
    var geojson = {
      "properties": {
          'marker-symbol': markerSymbol,
          'marker-size': 'large',
          'marker-color': '#' + 'f9886c'
      },
      "type": "Feature",
      "geometry": {
          "type": "Point",
          "coordinates": res.center
      }
    };

    var type = res.id.split('.')[0];
    var max = 17;
    if (type === "address") {
      max = 17;
    }
    else if (type === "place") {
      max = 14;
    }
    else if (type === "postcode") {
      max = 9;
    }
    else if (type === "region") {
      max = 9;
    }
    else if (type === "country") {
      max = 4;
    }

    var feature = L.mapbox.featureLayer(geojson);
    map.fitBounds(feature.getBounds(), { maxZoom: max });
    setTimeout(function () {
      marker.openPopup();
      setTimeout(function () {
        marker.closePopup();
      }, 5000);
    }, 150);

    if (debug) {
      debug.innerHTML = JSON.stringify(res, null, '  ');
    }
  }

  /**
   * Clear the map layers
   */
  clearLayers() {
    layerGroup.clearLayers();
  }

  /**
   * Add a marker to the map
   * It can be draggable and have a popup
   *
   * @param {Array} coordinate - Like [4.0411151, 48.2662536]
   * @param {Boolean} draggable
   * @param {String} popupContent - The text to display into the popup
   */
  addMarker(lat, lon, draggable, popupContent) {
    var marker = L.marker(new L.LatLng(
      lat,
      lon
    ), {
      icon: L.mapbox.marker.icon({
        'marker-color': 'f9886c'
      }),
      draggable: draggable
    });

    if (popupContent) {
      var popupContent = popupContent;
      marker.bindPopup(popupContent,{
          closeButton: false,
      });
    }

    if (draggable) {
      marker.on('dragend', (e) => {
        var marker = e.target;
        var position = marker.getLatLng();
        //marker.setLatLng([position],{id:uni,draggable:'true'}).bindPopup(position).update();

        // Do reverse geocoding
        search(
          this.props.endpoint,
          this.props.source,
          this.props.accessToken,
          this.props.proximity,
          position.lng+','+position.lat,
          this.onResult.bind(this)
        );
      });
    }

    marker.addTo(layerGroup);
    marker.openPopup();
  }

  /**
   * Method for the parent to sets a map view that contains the given
   * geographical bounds with the maximum zoom level possible.
   *
   * @param {Number} lat
   * @param {Number} lon
   * @param {Number} max - The max zoom level
   */
  setView(lat, lon, max = 17) {
    /*map.fitBounds([southWest, northEast], { maxZoom: 24 });
    .setView(this.props.center, 12);*/
    map.setView(new L.LatLng(lat, lon), 17);
  }

  render() {
    return (
      <div>
        <div ref="map" className="map-container">

        </div>
      </div>
    )
  }
}

MapComponent.propTypes = {
  endpoint: PropTypes.string,
  source: PropTypes.string,
  proximity: PropTypes.string,
  accessToken: PropTypes.string.isRequired,
  center: PropTypes.array,
  mapid: PropTypes.string,
  markerColor: PropTypes.string
}

MapComponent.defaultProps = {
  endpoint: 'https://api.tiles.mapbox.com',
  source: 'mapbox.places',
  proximity: '',
  center: [38.8951, -77.0364],
  mapid: 'mapbox.streets',
  markerColor: 'f9886c'
}

export default MapComponent;
