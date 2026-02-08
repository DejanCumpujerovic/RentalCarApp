# Kako podići RentalCarApp (Linux)

## Šta ti trenutno nedostaje

U okruženju gde sam ja pokretao komande **nema PHP, Composer ni Node.js**, i ne mogu da instaliram pakete sa `sudo` bez tvoje lozinke. Zato prvo to uradiš ti na svom računaru (jednom), pa onda sve ostalo možeš pokrenuti jednom skriptom.

---

## Korak 1: Instalacija alata (jednom na sistemu)

Otvori **svoj** terminal (u Cursoru ili bilo gde) i pokreni:

### Ubuntu / Debian

Projekat zahteva **PHP 8.2+**. Default `php` paket je često 8.1, zato koristimo PPA:

```bash
# PHP 8.2 (preko ondrej/php PPA)
sudo add-apt-repository ppa:ondrej/php
sudo apt-get update
sudo apt-get install -y php8.2 php8.2-cli php8.2-sqlite3 php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-tokenizer unzip curl

# Postavi php komandu na 8.2 (ako imaš više verzija)
sudo update-alternatives --set php /usr/bin/php8.2

# Composer (globalno)
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Node.js 18+ (preko NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Provera:

```bash
php -v
composer -V
node -v
npm -v
```

---

## Korak 2: Automatski setup projekta

U folderu projekta:

```bash
cd /home/dejan/RentalCarApp
chmod +x setup.sh
./setup.sh
```

Skripta uradi: `composer install`, `npm install`, kreira `.env`, generiše ključ, kreira SQLite bazu, pokreće migracije i seed.

---

## Korak 3: Pokretanje aplikacije

Ostavi **dva** otvorena terminala.

**Terminal 1:**

```bash
cd /home/dejan/RentalCarApp
php artisan serve
```

**Terminal 2:**

```bash
cd /home/dejan/RentalCarApp
npm run dev
```

U browseru otvori: **http://127.0.0.1:8000**

---

## Ako nešto pukne

- **"php version (8.1.x) does not satisfy"** → Projekat traži PHP 8.2+. Instaliraj PHP 8.2 (vidi Korak 1 – ondrej/php PPA) i pokreni `sudo update-alternatives --set php /usr/bin/php8.2`.
- **"composer: command not found"** → Composer nije u PATH-u; proveri da li je u `/usr/local/bin` i da je taj folder u `PATH`.
- **"SQLSTATE could not find driver"** → Instaliraj: `sudo apt-get install php8.2-sqlite3` (ili za tvoju PHP verziju).
- **Migracija / seed greška** → Pošalji tačnu poruku greške pa možemo ispraviti.

Sve ovo možeš raditi u terminalu u Cursoru; VSCode ti nije potreban.
