import OAuth2 from 'torii/providers/google-oauth2';

export default class GoogleToriiProvider extends OAuth2 {
  fetch(data) {
    return data;
  }
}
