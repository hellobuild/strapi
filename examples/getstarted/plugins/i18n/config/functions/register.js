'use strict';

const _ = require('lodash');

// add a register function to do some stuff after the loading but before the boot
module.exports = () => {
  // need to add some logic to the db layer so we can add fields to the models

  Object.values(strapi.models).forEach(model => {
    if (_.get(model, 'pluginOptions.i18n.enabled', false) === true) {
      _.set(model.attributes, 'strapi_id', {
        writable: true,
        private: false,
        configurable: false,
        type: 'string',
      });

      _.set(model.attributes, 'localizations', {
        writable: true,
        private: false,
        configurable: false,
        type: 'json',
      });

      _.set(model.attributes, 'locale', {
        writable: true,
        private: false,
        configurable: false,
        type: 'string',
        default: 'en-US',
      });
    }
  });

  // strapi.database.migrations.push({
  //   before() {},
  //   after() {},
  // });
};

/*
 Strapi loading steps so we know where to integrate

1. new Strapi(dir)
2. loading env vars
3. loading config (global config)
5. loading plugins (external, local)
6. loading hooks (global or api)
6. loading middlewares (global or api)
4. loading apis (controllers, services, models, config)
5. loading components (global or api)
6. internal services (core-api, entity server, metrics, webhooks, database)
7. Initialize middlewares
8. Init hooks
9. Bootstrap ?? too big
10. start http server
*/
