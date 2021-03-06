import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['field-content-publication'],

  publicationDate: null,
  isPublished: false,

  newPublishMethod: null,

  showDatePicker: computed('newPublishMethod', function() {
    if (this.get('newPublishMethod.id') === 'schendule') {
      return true;
    }
  }),

  editorIsOpen: false,

  init() {
    this._super(...arguments);

    this.set('newPublicationDate', new Date());
    this.set('minDate', new Date());
    this.set('publishMethods', [
      {
        id: 'unPublished',
        text: 'Manter despublicado'
      },
      {
        id: 'on_create',
        text: 'Publicar ao salvar'
      },
      {
        id: 'schendule',
        text: 'Publicação agendada'
      }
    ]);

    this.set('publishMethod', {
      id: 'unPublished',
      text: 'Manter despublicado'
    });

    this.resetChanges();
  },

  didReceiveAttrs() {
    this._super(...arguments);

    let dNow = new Date();
    dNow.setDate(dNow.getDate() -1);
    this.set('minDate', dNow);

    const publicationDate = this.get('publicationDate');

    this.set('newPublicationDate', publicationDate || new Date() );

    if (!this.get('isPublished')) {
      if (publicationDate) {
        this.set('publishMethod',{
          id: 'schendule',
          text: 'Publicação agendada'
        });
      } else {
        this.set('publishMethod', {
          id: 'unPublished',
          text: 'Manter despublicado'
        });
      }
    } else {
      this.set('publishMethod',     {
        id: 'on_create',
        text: 'Publicar ao salvar'
      });
    }

    this.set('newPublishMethod', this.get('publishMethod'));
  },

  actions: {
    unPublish() {
      this.set('isPublished', false);
      this.set('publishMethod', {
        id: 'unPublished',
        text: 'Manter despublicado'
      });
      this.set('publicationDate', null);
      this.resetChanges();
    },

    savePublicationDate() {
      this.set('editorIsOpen', false);
      this.set('publishMethod', this.get('newPublishMethod'));
      this.set('publicationDate', this.get('newPublicationDate'));

      const publishMethodId = this.get('publishMethod.id');
      if (publishMethodId === 'unPublished') {
        this.set('isPublished', false);
        this.set('publicationDate', null);
      } else if (publishMethodId === 'schendule') {
        this.set('isPublished', false);
      } else if(publishMethodId === 'on_create') {
        this.set('isPublished', true);
      }
    },

    cancelChanges() {
      this.resetChanges();
    },

    openEditor() {
      this.set('editorIsOpen', true);
    },

    closeEditor() {
      this.set('editorIsOpen', false);
    },

    changePublishMethod(old, n) {
      this.set('newPublishMethod', n);
    },

    changeDate(dates) {
      if (!dates || !dates[0]) {
        return;
      }
      this.set('newPublicationDate', dates[0]);
    }
  },

  resetChanges() {
    this.set('editorIsOpen', false);
    this.set('newPublishMethod', this.get('publishMethod'));
    this.set('newPublicationDate', this.get('publicationDate'));
  }
});
