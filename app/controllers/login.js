import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { getOwner } from '@ember/application';

export default class LoginController extends Controller {
  @tracked errorMessage;
  @service session;
  @service settings;
  @service notifications;
  @service loading;

  @action
  async authenticate() {
    const ENV = getOwner(this).resolveRegistration('config:environment');

    let { identification, password } = this;
    try {
      await this.loading.run(() => {
        return this.session.authenticate('authenticator:custom', identification, password);
      });
    } catch (error) {
      this.settings.queryError(error);
    }

    if (this.session.isAuthenticated) {
      location.href = ENV.rootURL || '/';
    }
  }
}
