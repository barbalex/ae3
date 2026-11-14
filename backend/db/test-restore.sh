# restore test: downloads the newest backup from nextcloud and
# restores it into a scratch database inside the running postgres,
# sanity counts, compares the restored data against the live db by
# fingerprint, drops the scratch database.
# run inside the ae_db container: docker exec -it ae_db bash ./test-restore.sh
# BEWARE: rclone config is expected at /root/.config/rclone/rclone.conf
# (mounted from the host, see docker-compose.yml)

set -e

REMOTE_DIR="nextcloud:Gabriel Software/projekte/artendb/sik"
SCRATCH_DB="ae_restore_test"

# keep in sync with the fingerprint in backup.sh
FINGERPRINT_SQL="
  select coalesce(md5(string_agg(row_text, '' order by row_text)), '') from (
    select (to_jsonb(t))::text as row_text from ae.object t
    union all select (to_jsonb(t))::text from ae.pco_of_object t
    union all select (to_jsonb(t))::text from ae.rco_of_object t
    union all select (to_jsonb(t))::text from ae.relation t
    union all select (to_jsonb(t))::text from ae.property_collection_object t
    union all select (to_jsonb(t))::text from ae.synonym t
    union all select (to_jsonb(t))::text from ae.property_collection t
    union all select (to_jsonb(t))::text from ae.taxonomy t
    union all select (to_jsonb(t))::text from ae.\"user\" t
    union all select (to_jsonb(t))::text from ae.organization t
    union all select (to_jsonb(t))::text from ae.organization_user t
    union all select (to_jsonb(t))::text from ae.role t
    union all select (to_jsonb(t))::text from ae.tree_category t
  ) s"

echo "finding newest backup..."
NEWEST=$(rclone lsf "$REMOTE_DIR" | grep -E '^[0-9]{4}-' | sort | tail -1)
if [ -z "$NEWEST" ]; then
  echo "ERROR: no backup found in $REMOTE_DIR"
  exit 1
fi
echo "newest backup: $NEWEST"

echo "downloading..."
rclone copyto "$REMOTE_DIR/$NEWEST" "/tmp/$NEWEST" --retries 3

echo "restoring into scratch database $SCRATCH_DB..."
dropdb --if-exists -U postgres -h localhost "$SCRATCH_DB"
createdb -U postgres -h localhost "$SCRATCH_DB"
# ae has no foreign tables and all extensions (pgcrypto, postgres_fdw,
# uuid-ossp) restore from the dump themselves - unlike vermehrung no
# pre-creating is needed.
# tolerate only benign errors (e.g. CREATE SCHEMA public colliding
# with the schema createdb made) - anything else fails the test
set +e
pg_restore -U postgres -h localhost --dbname="$SCRATCH_DB" --no-owner "/tmp/$NEWEST" 2> /tmp/restore.log
set -e
FATAL=$(grep '^pg_restore: error:' /tmp/restore.log | grep -cv 'already exists') || true
if [ "$FATAL" -gt 0 ]; then
  cat /tmp/restore.log
  echo "ERROR: restore had $FATAL fatal errors"
  exit 1
fi
echo "restore ok ($(grep -c '^pg_restore: error:' /tmp/restore.log || true) benign errors tolerated)"

echo "sanity counts:"
for t in object taxonomy property_collection property_collection_object relation pco_of_object rco_of_object synonym; do
  COUNT=$(PGPASSWORD=$POSTGRES_PASSWORD psql -U postgres -h localhost -d "$SCRATCH_DB" -At -c "select count(*) from ae.$t")
  echo "  $t: $COUNT"
done

echo "comparing restored data against the live db..."
LIVE=$(PGPASSWORD=$POSTGRES_PASSWORD psql -U postgres -h localhost -d ae -At -c "$FINGERPRINT_SQL")
RESTORED=$(PGPASSWORD=$POSTGRES_PASSWORD psql -U postgres -h localhost -d "$SCRATCH_DB" -At -c "$FINGERPRINT_SQL")
if [ "$LIVE" != "$RESTORED" ]; then
  echo "ERROR: restored fingerprint $RESTORED differs from live fingerprint $LIVE"
  echo "(if the live data changed since the dump was taken, rerun after the next backup)"
  exit 1
fi

echo "cleaning up..."
dropdb -U postgres -h localhost "$SCRATCH_DB"
rm -f "/tmp/$NEWEST"
echo "restore test OK: $NEWEST restores cleanly and matches the live data"
