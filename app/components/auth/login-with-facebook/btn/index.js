import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { action } from '@ember/object';

export default class LoginWithFacebookBTNComponent extends Component {
  @service settings;
  @service router;
  @service torii;
  @service session;

  @action
  async login() {
    const ENV = getOwner(this).resolveRegistration('config:environment');

    sessionStorage.setItem('redirectToThisAfterLogin', this.router.currentRouteName);
    await this.session.authenticate('authenticator:torii-facebook', 'facebook');

    // if (this.session.isAuthenticated) {
    //   location.href = ENV.rootURL || '/';
    // }
  }
}
