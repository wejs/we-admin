import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';

let rg1 = new RegExp('{{', 'g');
let rg2 = new RegExp('}}', 'g');

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return hash({
      record: this.store.createRecord('t')
    });
  },
  actions: {
    save(record) {
      const i18n = this.get('i18n');

      record.save()
      .then( function updateLocale(r) {
        if (r && r.l) {
          let t = r.t;

          if (t && t.indexOf('{{') > -1) {
            t = t
              .replace(rg1, '{')
              .replace(rg2, '}');
          }

          i18n.addTranslations(r.l, {
            [r.s]: t
          });
        }

        return r;
      })
      .then( (r)=> {
        this.get('notifications').success('Tradução registrada com sucesso.');

        this.transitionTo('t.item', r.id);
        this.send('scrollToTop');
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
        return null;
      });
    }
  }
});