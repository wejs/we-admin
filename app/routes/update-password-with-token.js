import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class UpdatePasswordWithTokenRoute extends Route {
  @service auth;
  @service notifications;

  title = 'Atualizar senha';

  model(params) {
    return hash({
      paramsIsValid: this.auth.validResetPasswordToken(params.user_id, params.token),
      userId: params.user_id,
      token: params.token,
      newPassword: '',
      rNewPassword: ''
    });
  }

  afterModel(model) {
    if (!model.paramsIsValid) {
      this.notifications.warning('O token de alteração de senha está inválido.');
      return this.transitionTo('forgot-password');
    }

    return model;
  }
}
