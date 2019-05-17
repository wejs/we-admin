import Component from '@ember/component';
import { getOwner } from '@ember/application';

const Sortable = window.Sortable;

export default Component.extend({
  links: null,

  group: 'default',

  onSortEnd: 'onSortEnd',
  deleteLink: 'deleteLink',

  parentDepth: null,
  depth: 0,

  classNames: ['m-list-group'],

  int() {
    if(this.get('parentDepth')) {
      this.set('depth', this.get('parentDepth')+1);
    }
  },

  didInsertElement() {
    // Simple list
    Sortable.create(this.element, {
      group: this.get('group'),
      handle: ".m-list-group-item-label",
      animation: 0, // ms, animation speed moving items when sorting, `0` — without animation
      // handle: ".tile__title", // Restricts sort start click/touch to the specified element
      // draggable: ".tile", // Specifies which items inside the element should be sortable
      onEnd: (/**Event*/evt)=> {
        // var itemEl = evt.item;  // dragged HTMLElement
        // evt.to;    // target list
        // evt.from;  // previous list
        // evt.oldIndex;  // element's old index within old parent
        // evt.newIndex;  // element's new index within new parent

        const viewRegistry = getOwner(this).lookup('-view-registry:main');

        const toComponent = viewRegistry[evt.to.id];
        const fromComponent = viewRegistry[evt.from.id];
        const itemComponent = viewRegistry[evt.item.id];

        this.sendAction('onSortEnd', {
          event: evt,
          toComponent,
          fromComponent,
          itemComponent
        });
      },
    });
  },

  actions: {
    onSortEnd() {
      this.sendAction('onSortEnd', ...arguments);
    },
    deleteLink() {
      this.sendAction('deleteLink', ...arguments);
    }
  }
});
