FROM node:slim

ENV NODE_ENV=production

# in v5: v5
RUN npm install -g postgraphile@4.14.1
# in v5: preset i.e. extends in graphile.config.ts
RUN npm install -g postgraphile-plugin-connection-filter@2.3.0
# in v5: preset i.e. extends in graphile.config.ts
RUN npm install -g @graphile-contrib/pg-order-by-related@1.0.0
# in v5: 
# https://github.com/cdaringe/postgraphile-upsert/issues/646
RUN npm install -g postgraphile-upsert-plugin@3.3.0

# need to add a graphile.config.js file for the presets
COPY --chown=node:node .postgraphilerc.js .postgraphilerc.js

# do not move this above installation or that will fail
USER node

EXPOSE 5000

ENTRYPOINT ["postgraphile", "-n", "0.0.0.0"]