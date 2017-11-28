/* jshint node: true */
'use strict';

module.exports = {
  name: 'we-admin',
  included: function(app) {
    this._super.included(app);
    app.import('vendor/menu/menu-links-sortable.css');
    app.import('vendor/Sortable.js');
  }
};
