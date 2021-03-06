const SENTRY_KEY = '488193c1894241789631f5a36188e3a5';
const SENTRY_APP = '96144';
export const SENTRY_URL = `https://${SENTRY_KEY}@sentry.io/${SENTRY_APP}`;

/* global Raven */

export function logException(ex, context) {
  Raven.captureException(ex, {
    extra: context
  });
  /*eslint no-console:0*/
  window && window.console && console.error && console.error(ex);
}

// Objet global de configuration
// TODO: config différente selon l'environnement (dev/prod)
export const Config = {
  //API: 'http://dev.senitdev.com/api',
  API: 'http://app3.myaccessweb.com/api/',
  thumbnailURL: 'modules-static-files/Screens/tenants/'
};
