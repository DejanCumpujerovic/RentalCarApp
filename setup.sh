#!/bin/bash
# RentalCarApp - automatski setup (pokreni iz root foldera projekta)

set -e
cd "$(dirname "$0")"

echo "=== RentalCarApp - setup ==="

# Provera alata
for cmd in php composer node npm; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "GREŠKA: '$cmd' nije instaliran ili nije u PATH-u."
    echo "Instaliraj PHP, Composer i Node.js pa pokreni ponovo. Vidi POKRETANJE.md"
    exit 1
  fi
done

# Provera PHP verzije (projekat zahteva 8.2+)
PHPVER=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
if [ "$(php -r "echo version_compare(PHP_VERSION, '8.2.0', '>=') ? 'ok' : 'fail';")" != "ok" ]; then
  echo "GREŠKA: Projekat zahteva PHP 8.2 ili noviji. Tvoja verzija: $PHPVER"
  echo ""
  echo "Instaliraj PHP 8.2 (Ubuntu/Debian):"
  echo "  sudo add-apt-repository ppa:ondrej/php"
  echo "  sudo apt-get update"
  echo "  sudo apt-get install -y php8.2 php8.2-cli php8.2-sqlite3 php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-tokenizer"
  echo ""
  echo "Zatim prebaci na PHP 8.2:  sudo update-alternatives --set php /usr/bin/php8.2"
  echo "Provera: php -v"
  exit 1
fi

echo "[1/7] Composer install..."
composer install --no-interaction

echo "[2/7] npm install..."
npm install

echo "[3/7] .env fajl..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "    .env kreiran iz .env.example"
else
  echo "    .env već postoji"
fi

echo "[4/7] Aplikacioni ključ..."
php artisan key:generate --force

echo "[5/7] SQLite baza..."
if [ ! -f database/database.sqlite ]; then
  touch database/database.sqlite
  echo "    database/database.sqlite kreiran"
fi

# Osiguraj da je u .env SQLite
if grep -q '^DB_CONNECTION=mysql' .env 2>/dev/null; then
  sed -i 's/^DB_CONNECTION=mysql/DB_CONNECTION=sqlite/' .env
  echo "    DB_CONNECTION postavljen na sqlite"
fi

echo "[6/7] Migracije..."
php artisan migrate --force

echo "[7/7] Seed (test podaci)..."
php artisan db:seed --force

echo ""
echo "=== Setup završen. ==="
echo ""
echo "Pokreni aplikaciju u DVA terminala:"
echo "  Terminal 1:  php artisan serve"
echo "  Terminal 2:  npm run dev"
echo ""
echo "Zatim otvori: http://127.0.0.1:8000"
echo ""
