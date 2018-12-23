export function initialize(instance) {
  // const applicationRoute = instance.lookup('route:application');
  const session = instance.lookup('service:session');
  // const settings         = instance.lookup('service:settings');

  session.on('authenticationSucceeded', function() {
    setTimeout( ()=> {
      window.location.reload();
    }, 900);
  });
  session.on('invalidationSucceeded', function() {
    setTimeout( ()=> {
      window.location.reload();
    }, 900);
  });
}

export default {
  initialize,
  name:  'session-events'
};