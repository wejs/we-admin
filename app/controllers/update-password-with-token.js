import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";

export default class UpdatePasswordWithTokenController extends Controller {
  @service settings;
  @service notifications;
  @service ajax;

  @action
  async updatePasswordWithToken(evt) {
    evt.preventDefault();

    const model = this.model;

    if (!model.newPassword) {
      return this.notifications.warning('O campo nova senha é nescessário.');
    }

    if (model.newPassword != model.rNewPassword) {
      return this.notifications.warning(
        'O campo nova senha e repetir a nova senha estão diferentes.'
      );
    }

    const url = `/auth/${model.userId}/change-password-with-token`;
    const result = await this.ajax.request(url, {
      method: 'POST',
      data: {
        token: model.token,
        newPassword: model.newPassword,
        rNewPassword: model.rNewPassword
      }
    });

    this.notifications.success('Senha alterada com sucesso.');
    this.transitionToRoute('login');
  }
}


