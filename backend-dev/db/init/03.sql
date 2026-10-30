-- TODO: seems that shema ae does not yet exist
\c ae
grant select on table ae.v_vermehrung_arten to fdw_user;
grant select on table ae.v_apflora_lr_delarze to fdw_user;
grant select on table ae.v_apflora_taxonomies to fdw_user;
-- app.jwt_secret is set by 04_jwt_secret.sh: sql scripts get no env
-- substitution, so '${JWT_SECRET}' here was stored literally and
-- broke every login token (ae.login signed with the placeholder,
-- PostgREST verified against the real secret)
--ALTER DATABASE ae SET search_path = public, utility;