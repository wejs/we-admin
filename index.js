/* jshint node: true */

module.exports = {
  name: 'we-admin',

  outputReady() {
    // only run in production env:
    if (this.app.env !== 'production') {
      return null;
    }

    var fs = this.project.require('fs-extra');
    var originFolder = process.cwd() + '/dist';
    var distFolder = process.cwd() + '/prod';
    // cleanup:
    fs.emptyDirSync(distFolder);
    // copy:
    fs.copySync(originFolder, distFolder);
  },

  afterInstall() {
    return this.addBowerPackageToProject('metisMenu')
      .then( this.addAddonToProject('@ember-decorators/babel-transforms') );
  },

  included(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/menu/menu-links-sortable.css');
    app.import('vendor/Sortable.js');
    app.import(app.bowerDirectory + '/metisMenu/dist/metisMenu.js');
    app.import(app.bowerDirectory + '/metisMenu/dist/metisMenu.css');
  }
};
