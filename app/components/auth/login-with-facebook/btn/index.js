import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
// import { getOwner } from '@ember/application';
// import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class LoginWithFacebookBTNComponent extends Component {
  @service settings;
  @service router;
  @service torii;
  @service session;

  @action
  login() {
    sessionStorage.setItem('redirectToThisAfterLogin', this.router.currentRouteName);
    this.session.authenticate('authenticator:torii-facebook', 'facebook');
  }
}
