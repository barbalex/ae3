-- applied to the dev database on 2026-10-27, required for PostgREST auth.
-- run manually on production when deploying the PostgREST stack.
--
-- background:
-- - PostgREST's jose library rejects HMAC secrets shorter than 32 bytes
--   (PostGraphile/Node never did). Use a secret of 32+ chars, identical in
--   the database (app.jwt_secret) and .env (JWT_SECRET).
-- - ae.login had its username and exp claims commented out and no aud claim,
--   so PostGraphile rejected the token (audience) and row-level security
--   could not see the username.
-- - current_user_name() read the pre-v4 GUC 'jwt.claims.username' that
--   neither PostgREST (v12 sets 'request.jwt.claims' json only) nor
--   PostGraphile set. Now both forms are supported.

-- 1. make ae.login sign the full claim set
CREATE OR REPLACE FUNCTION ae.login(username text, pass text) RETURNS auth.jwt_token AS $fn$
declare
  _role name;
  result auth.jwt_token;
begin
  select auth.user_role($1, $2) into _role;
  if _role is null then
    raise invalid_password using message = 'invalid user or password';
  end if;

  select auth.sign(
      row_to_json(r), current_setting('app.jwt_secret')
    ) as token
    from (
      select
        _role as role,
        $1 as username,
        extract(epoch from (now() + interval '1 week'))::integer as exp,
        'postgraphile' as aud
    ) r
    into result;
  return (result.token, _role, $1, extract(epoch from (now() + interval '1 week')))::auth.jwt_token;
end;
$fn$ LANGUAGE plpgsql;

-- 2. make current_user_name work under PostgREST and PostGraphile
CREATE OR REPLACE FUNCTION public.current_user_name() RETURNS text AS $fn$
declare
  claims text;
begin
  claims := nullif(current_setting('request.jwt.claims', true), '');
  if claims is not null then
    begin
      if claims::json->>'username' is not null then
        return nullif(claims::json->>'username', '');
      end if;
    exception when others then
      null;
    end;
  end if;
  return nullif(current_setting('request.jwt.claim.username', true), '');
end;
$fn$ LANGUAGE plpgsql STABLE;

-- 3. ensure the jwt secret is long enough (>= 32 chars) and matches .env:
--    SELECT current_setting('app.jwt_secret');
--    ALTER DATABASE ae SET app.jwt_secret = '<same 32+ char value as JWT_SECRET in .env>';
