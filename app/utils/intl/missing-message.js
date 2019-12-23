import { isEmpty } from '@ember/utils';
import { warn } from '@ember/debug';
import links from 'ember-intl/utils/links';
import { getOwner } from '@ember/application';

export default function missingMessage(key, locales /*, options */) {
  if (isEmpty(locales)) {
    warn(`[ember-intl] no locale has been set. Documentation: ${links.unsetLocale}`, false, {
      id: 'ember-intl-no-locale-set'
    });

    return `No locale defined.  Unable to resolve translation: "${key}"`;
  }

  if (typeof locales === 'string') {
    locales = [locales];
  }

  const localeNames = locales.join(', ');

  // let i18nService = getOwner(this).lookup('service:i18n');
  // let localesToTranslate = i18nService.get('localesToTranslate');

  // localesToTranslate.pushObject({
  //   key: key,
  //   locales: locales
  // });

  warn(`[ember-intl] translation: "${key}" on locale: "${localeNames}" was not found.`, false, {
    id: 'ember-intl-missing-translation'
  });

  return `Missing translation "${key}" for locale "${localeNames}"`;
}