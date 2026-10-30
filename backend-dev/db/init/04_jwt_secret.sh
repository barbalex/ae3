#!/bin/bash
set -e

# ae.login signs tokens with the app.jwt_secret database setting;
# PostgREST verifies them with the JWT_SECRET from .env (both reach
# this container via env_file). They must match, so set the database
# side from the environment - sql init scripts cannot do this because
# psql does not substitute env variables (a literal '${JWT_SECRET}'
# stored here broke every login token)
echo "setting app.jwt_secret from the JWT_SECRET env"
psql --username "${POSTGRES_USER}" --dbname=ae --command="ALTER DATABASE ae SET app.jwt_secret TO '${JWT_SECRET}';"
echo "app.jwt_secret was set"
