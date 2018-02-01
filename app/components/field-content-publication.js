import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['field-content-publication'],

  publicationDate: null,
  isPublished: false,
  newPublicationDate: new Date(),

  minDate: new Date(),

  publishMethod: {
    id: 'unPublished',
    text: 'Manter despublicado'
  },
  newPublishMethod: null,

  publishMethods: [
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
  ],

  showDatePicker: Ember.computed('newPublishMethod', function() {
    if (this.get('newPublishMethod.id') === 'schendule') {
      return true;
    }
  }),

  editorIsOpen: false,

  init() {
    this._super(...arguments);
    this.resetChanges();
  },

  didReceiveAttrs() {
    this._super(...arguments);

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
      if (publishMethodId === 'unPublished' || publishMethodId === 'schendule') {
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
