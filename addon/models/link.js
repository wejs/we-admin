import DS from 'ember-data';
import Ember from 'ember';

function isExternal(url) {
    var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
    if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) {
      return true;
    }
    if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":("+{"http:":80,"https:":443}[location.protocol]+")?$"), "") !== location.host) {
      return true;
    }
    return false;
}

export default DS.Model.extend({
  href: DS.attr('string'),
  text: DS.attr('string'),
  title: DS.attr('string'),
  class: DS.attr('string'),
  style: DS.attr('string'),
  target: DS.attr('string'),

  modelName: DS.attr('string'),
  modelId: DS.attr('string'),
  type: DS.attr('string'),
  role: DS.attr('string'),

  rel: DS.attr('string'),
  key: DS.attr('string'),
  depth: DS.attr('number'),
  weight: DS.attr('number'),
  parent: DS.attr('number'),
  links: DS.attr('array', {
    defaultValue() { return Ember.A(); }
  }),
  menu: DS.belongsTo('menu', {
    inverse: 'links',
    async: true
  }),
  identation: Ember.computed('depth', function() {
    const depth = this.get('depth');
    let identation = '';

    if (depth) {
      for (let i = 0; i < depth; i++) {
        identation += '<div class="indentation">&nbsp;</div>';
      }
    }

    return Ember.String.htmlSafe(identation);
  }),

  isInternalLink: Ember.computed('href', function() {
    const href = this.get('href');
    if (!href) {
      return false;
    }
    // check if is internal url
    return (!isExternal(href));
  }),
  linkPermanent: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});