import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { tracked } from '@glimmer/tracking';

export default class TermsOfServiceLinkComponent extends Component {
  @service settings;

  @tracked href = '';

  constructor(owner, args) {
    super(owner, args);

    const ENV = getOwner(this).resolveRegistration('config:environment');
    this.href = ENV.API_HOST + '/terms-of-service';
  }
}
