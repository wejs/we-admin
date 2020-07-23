import OAuth2 from 'torii/providers/facebook-oauth2';

export default class FacebookToriiProvider extends OAuth2 {
  fetch(data) {
    return data;
  }
}
