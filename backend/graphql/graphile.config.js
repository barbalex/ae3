import 'graphile-config'

import PresetAmber from 'postgraphile/presets/amber'
import { makeV4Preset } from 'postgraphile/presets/v4'
// Use the 'pg' module to connect to the database
import { makePgService } from '@dataplan/pg/adaptor/pg'
import { PostGraphileConnectionFilterPreset } from 'postgraphile-plugin-connection-filter'

/** @type {GraphileConfig.Preset} */
const preset = {
  extends: [
    // The initial PostGraphile V5 preset
    PresetAmber.default ?? PresetAmber,

    // Change the options and add/remove plugins based on your V4 configuration:
    makeV4Preset({
      /* PUT YOUR V4 OPTIONS HERE, e.g.: */
      graphileBuildOptions: {
        connectionFilterRelations: true,
        orderByNullsLast: false,
      },
    }),

    // Note some plugins are now "presets", e.g.
    // `@graphile/simplify-inflection`, those should be listed here instead of `appendPlugins`
    PostGraphileConnectionFilterPreset,
  ],

  plugins: [
    /*
     * If you were using `pluginHook` before, the relevant plugins will need
     * listing here instead. You can also move the `appendPlugins` list here
     * for consistency if you like.
     */
    '@graphile-contrib/pg-order-by-related',
    'postgraphile-upsert-plugin:PgMutationUpsertPlugin',
  ],

  /*
   * PostgreSQL database configuration.
   *
   * If you're using the CLI you can skip this and use the `-c` and `-s`
   * options instead, but we advise configuring it here so all the modes of
   * running PostGraphile can share it.
   */
  pgServices: [
    makePgService({
      // Database connection string:
      connectionString: process.env.DATABASE_URL,
      // List of schemas to expose:
      schemas: ['ae'],
      // Superuser connection string, only needed if you're using watch mode:
      // superuserConnectionString: process.env.SUPERUSER_DATABASE_URL,
    }),
  ],
}

export default preset
