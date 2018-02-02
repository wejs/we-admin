import Ember from 'ember';

let ENV;

export default Ember.Component.extend({
  session: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  init() {
    this._super(...arguments);
    ENV = Ember.getOwner(this).resolveRegistration('config:environment');
  },

  attributeBindings: ['disabled'],
  disabled: null,

  tagName: 'button',
  companyid: null,

  isLoading: false,

  iconContent: '<i class="glyphicon glyphicon-resize-small"></i>',

  click() {
    if (!this.get('isLoading')) {
      this.set('isLoading', true);
      this.updateContent();

      this.sendRequest()
      .then( ()=> {

        this.get('notifications').success('Conteúdos associados.');

        this.set('isLoading', false);
        this.updateContent();
        return null;
      })
      .fail( (err)=> {
        Ember.Logger.error('Error on update company association contents', err);

        this.get('notifications').error('Ocorreu um erro inesperado ao associar os conteúdos à empresa.');

        this.set('isLoading', false);
        this.updateContent();
        return null;
      });
    }

    return false;
  },

  updateContent() {
    if (this.get('isLoading')) {
      this.set('disabled', true);
      this.set('iconContent', '<i class="glyphicon glyphicon-refresh"></i>');
    } else {
      this.set('disabled', false);
      this.set('iconContent', '<i class="glyphicon glyphicon-resize-small"></i>');
    }
  },

  sendRequest() {
    let headers = { Accept: 'application/json' },
        accessToken = this.get('session.session.authenticated.access_token');

    if (accessToken) {
      headers.Authorization = `Basic ${accessToken}`;
    }

    const companyid = this.get('companyid');

    return Ember.$.ajax({
      url: `${ENV.API_HOST}/company/${companyid}/scan-and-associate-contents`,
      type: 'POST',
      headers: headers
    });
  }
});
