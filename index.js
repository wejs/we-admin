/* jshint node: true */
'use strict';

module.exports = {
  name: 'we-admin',
  included: function(app) {
    app.import('vendor/menu-links-sortable.css');
  }
};
