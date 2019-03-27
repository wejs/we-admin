import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { hash } from 'rsvp';
import { set } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
  ajax: inject(),
  image: inject(),

  model() {
    const s = this.get('settings');

    const systemSettings = (s.get('systemSettings') || '');

    let d = {
      settings: systemSettings
    };

    if (
      s &&
      s.data.plugins &&
      s.data.plugins.indexOf('we-plugin-fb-pixel') > -1
    ) {
      d.haveFBPixelPlugin = true;
    }

    return hash(d);
  },

  actions: {
    save(data) {
      let s = this.get('settings');

      s.setSystemSettings(data)
      .then( (result) => {
        set(s, 'systemSettings', result.settings);

        this.get('notifications').success('As configurações de integração do sistema foram salvas.');
        this.send('scrollToTop');
      })
      .fail( (err)=> {
        this.send('queryError', err);
      });
    }
  }
});
