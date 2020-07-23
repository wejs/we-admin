import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class LoginWithGoogleBTNComponent extends Component {
  @service settings;
  @service session;
  @service router;

  @action
  login() {
    sessionStorage.setItem('redirectToThisAfterLogin', this.router.currentRouteName);
    this.session.authenticate('authenticator:torii-google', 'google');
  }
}
