/* jshint node: true */
'use strict';

module.exports = {
  name: 'we-admin',
  included: function(app) {
    this._super.included(app);
    app.import('vendor/menu/menu-links-sortable.css');
    app.import('vendor/Sortable.js');
  },

  outputReady: function () {
    // only run in production env:
    if (this.app.env !== 'production') {
      return null;
    }

    console.log('this', this);

    var fs = this.project.require('fs-extra');
    var originFolder = process.cwd() + '/dist';
    var distFolder = process.cwd() + '/prod';
    // cleanup:
    fs.emptyDirSync(distFolder);
    // copy:
    fs.copySync(originFolder, distFolder);
  }
};
