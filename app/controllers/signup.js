import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";

export default class SignupController extends Controller {
  @service ajax;
  @service settings;

  @action
  save() {
    const user = this.model.user;
    const ENV = this.settings.ENV;

    this.ajax.request(ENV.API_HOST + '/signup', {
      method: 'POST',
      data: user
    })
    .then((r) => {
      this.settings.handleMessages(r);
    });
  }
}
