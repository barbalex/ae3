FROM node:slim

ENV NODE_ENV=production

RUN npm install -g postgraphile@4.14.1
RUN npm install -g postgraphile-plugin-connection-filter@2.3.0
RUN npm install -g @graphile-contrib/pg-order-by-related@1.0.0
RUN npm install -g postgraphile-upsert-plugin@3.3.0

COPY --chown=node:node .postgraphilerc.js .postgraphilerc.js

# do not move this above installation or that will fail
USER node

EXPOSE 5000

ENTRYPOINT ["postgraphile", "-n", "0.0.0.0"]