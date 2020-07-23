import CookieStore from 'ember-simple-auth/session-stores/cookie';

export default class ApplicationSessionStore extends CookieStore {
  cookieExpirationTime = 60*60*24*10;
}
