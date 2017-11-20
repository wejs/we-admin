import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  class: DS.attr('string'),
  sorted: DS.attr('boolean'),
  links: DS.hasMany('link', {
    inverse: 'menu',
    async: true
  }),
  sortedLinks: Ember.computed('links', function() {
    let links = this.get('links');

    links = links.sortBy('parent', 'weight', 'depth');

    // window.links = links;
    // return;

    // links = links.sort(function(a, b) {
    //   let aD = a.get('depth') || 0;
    //   let bD = b.get('depth') || 0;

    //   if (aD === bD) {
    //     let aW = a.get('weight');
    //     let bW = b.get('weight');

    //     if (aW === bW) {
    //       return 0;
    //     } else if (aW < bW) {
    //       return -1;
    //     } else {
    //       return 1;
    //     }
    //   } else if (aD < bD) {
    //     return -1;
    //   } else {
    //     return 1;
    //   }

    // });


    let r = Ember.A([]);

    for (let i = 0; i < links.get('length'); i++) {
      let link = links.objectAt(i);

      if (!link.get('depth')) {
        // is root
        r.push(link);
      } else {
        let parent;
        let length = r.get('length');

        if (length === 0) {
          // first item...
          r.push(link);
          continue;
        }

        for (let j = 0; j < length; j++) {
          let sLink = r.objectAt(j);
          // same link, skip ...
          if (r.get('id') === link.get('id')) {
            continue;
          }

          if (parent) {

            if (
              Number(sLink.get('parent')) === Number(link.get('parent'))
            ) {
              if (sLink.get('weight') > link.get('weight')) {
                r.splice(j+1, 0, link);
                break;
              }
            } else {
              r.splice(j, 0, link);
              break;
            }
          }

          if (
            !parent &&
            Number(sLink.get('id')) === Number(link.get('parent'))
          ) {
            parent = true;
          }
          // last run:
          if ((j+1) >= length) {
            r.splice(j+1, 0, link);
          }
        }
      }
    }

    // return sortedLinks;
    return r;
  }),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});