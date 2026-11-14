# dumps ae db
# prepends the datetime to filename
# uploads the backup to nextcloud
# but only if the data fingerprint changed
# BEWARE: rclone config is expected at /root/.config/rclone/rclone.conf
# it is mounted from the host file /root/backup/rclone.conf, see docker-compose.yml

# data fingerprint: deterministic md5 over every ae table's rows.
# replaces the old size-equality check - equal size with different
# content silently skipped backups. ~3s on the current data volume.
FINGERPRINT=$(PGPASSWORD=$POSTGRES_PASSWORD psql -U postgres -h localhost -d ae -At -c "
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
  ) s")
# an empty fingerprint (failed query) must never satisfy the skip check
if [ -z "$FINGERPRINT" ]; then
  echo "ERROR: computing the data fingerprint failed"
  exit 1
fi
if [ -f /sik_data/last.fingerprint ] && [ "$FINGERPRINT" = "$(cat /sik_data/last.fingerprint)" ]; then
  echo "data fingerprint unchanged - not dumping"
  exit 0
fi

echo "creating dump file..."
FILENAME=$(date +"%Y-%m-%d_%H-%M-%S_ae.backup")
PGPASSWORD=$POSTGRES_PASSWORD pg_dump -U postgres -h localhost --file=/sik_data/$FILENAME -Fc -Z9 ae

REMOTE_DIR="nextcloud:Gabriel Software/projekte/artendb/sik"

upload() {
  echo "uploading backup file..."
  # BEWARE: the remote name needs to match the one defined in rclone.conf, i.e. nextcloud
  if ! rclone copyto "/sik_data/$FILENAME" "$REMOTE_DIR/$FILENAME" --retries 3; then
    # on failure: keep last.backup so the next run retries the upload
    echo "ERROR: upload to nextcloud failed"
    rm -f "/sik_data/$FILENAME"
    exit 1
  fi
}

upload

# only replace last.backup and the fingerprint after a successful upload
rm -f /sik_data/last.backup
mv -f "/sik_data/$FILENAME" /sik_data/last.backup
echo "$FINGERPRINT" > /sik_data/last.fingerprint
echo "backed up $FILENAME"
