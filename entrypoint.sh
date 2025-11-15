#!/bin/sh

mkdir -p /var/www/html/tkj-inventory/temp
mkdir -p /var/www/html/tkj-inventory/public/assets/img
mkdir -p /var/www/html/tkj-inventory/public/assets/evidence

echo "[Entrypoint]: Executed..."

chown -R www-data:www-data /var/www/html/tkj-inventory
chmod -R 775 /var/www/html/tkj-inventory/temp
chmod -R 775 /var/www/html/tkj-inventory/public/assets/img
chmod -R 775 /var/www/html/tkj-inventory/public/assets/evidence


### Idk, sometimes not work 🙏
echo "[Debugging Secret]: Host:$DB_HOST_CONFIG User:$DB_USER_CONFIG Password:$DB_PASS_CONFIG"

# until mysql -h"$DB_HOST_CONFIG" -u"$DB_USER_CONFIG" -p"$DB_PASS_CONFIG" -e "SELECT 1" > /dev/null 2>&1; do
#   echo "[Entrypoint]: Database not ready. Waiting 3 seconds again..."
#   sleep 3
# done

# SQL_FILE="/var/www/html/tkj-inventory/tkj_inventory.sql"

# if [ -f "$SQL_FILE" ]; then
#   echo "[Entrypoint]: check if the database already exists..."
#   if ! mysql -h"$DB_HOST_CONFIG" -u"$DB_USER_CONFIG" -p"$DB_PASS_CONFIG" -D"$DB_NAME_CONFIG" -e "SELECT 1 FROM users LIMIT 1;" 2>/dev/null; then
#     echo "[Entrypoint]: The database is empty or the ‘users’ table cannot be found. Importing..."
#     mysql -h"$DB_HOST_CONFIG" -u"$DB_USER_CONFIG" -p"$DB_PASS_CONFIG" -D"$DB_NAME_CONFIG" < "$SQL_FILE"
#     echo "[Entrypoint]: SQL import complete."
#   else
#     echo "[Entrypoint]: The database has been filled. Skip import."
#   fi
# else
#   echo "[Entrypoint]: Warning: File SQL (${SQL_FILE}) not found"
# fi

echo "[Entrypoint]: Starting cron daemon..."
# /usr/sbin/crond -f -l 8 &
/usr/sbin/crond &

echo "[Entrypoint]: Running the application..."
exec "$@"