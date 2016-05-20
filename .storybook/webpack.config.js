const path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, '../'),
        loaders: [
            'style',
            'css',
            'sass'
        ]
      },
      {test: /\.(png|jpg|svg|woff|woff2)?(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?limit=8192'},
      {test: /\.(eot|ttf)$/, loader: 'file-loader'}
    ]
  }
};
