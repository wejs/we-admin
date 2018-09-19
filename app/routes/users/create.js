import Route from '@ember/routing/route';
import { hash } from 'rsvp';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  notifications: inject('notification-messages'),

  model() {
    return hash({
      user: {}
    });
  },
  actions: {
    create(data) {
      const i18n = this.get('i18n');

      const record = this.store.createRecord('user', data);

      record.set('active', true);

      record.save()
      .then( (r)=> {
        this.get('notifications').success(i18n.t('user.registered.success.msg'));

        this.transitionTo('users.item', r.id);
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
      });
    }
  }
});