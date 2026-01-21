# 🚗 RentalCarApp

> **Laravel + React + Inertia.js** demo aplikacija za iznajmljivanje automobila

---

## 📑 Sadržaj

- [Uvod](#-uvod)
- [Tehnologije](#️-tehnologije)
  - [Laravel](#laravel)
  - [React](#react)
  - [Inertia.js](#inertiajs)
- [Arhitektura aplikacije](#-arhitektura-aplikacije)
- [Zašto Inertia.js?](#-zašto-inertiajs)
- [Prednosti i mane Inertia.js](#-prednosti-i-mane-inertiajs)
- [Instalacija i pokretanje](#-instalacija-i-pokretanje)
- [Demonstracija projekta](#-demonstracija-projekta)
- [Funkcionalnosti](#-funkcionalnosti)
- [Primeri koda](#-primeri-koda)
- [Struktura projekta](#-struktura-projekta)
- [Zaključak](#-zaključak)
- [Reference](#-reference)

---

## 📌 Uvod

**RentalCarApp** je demo aplikacija koja prikazuje integraciju između **Laravel-a** (back-end) i **React-a** (front-end) pomoću **Inertia.js** framework-a.

### Cilj projekta

Glavni cilj ovog projekta je demonstracija kako se može izgraditi moderna **SPA (Single Page Application)** bez potrebe za pisanjem posebnog REST API-ja. Inertia.js eliminiše tradicionalnu arhitekturu gde front-end i back-end komuniciraju isključivo preko API endpoint-a.

### Kako Inertia.js menja pristup?

Umesto klasičnog pristupa:
```
[React] --HTTP zahtev--> [REST API] --Odgovor--> [React]
```

Inertia.js omogućava:
```
[React] <--Inertia.js--> [Laravel kontroler]
```

Framework automatski upravlja:
- Preuzimanjem podataka sa servera
- Sinhronizacijom podataka sa React komponentama
- Navigacijom između stranica (bez refresha)
- CSRF zaštitom

Ova jednostavnost omogućava fokusiranje na razvoj funkcionalnosti, umesto na tehničke detalje povezivanja front-end-a i back-end-a.

---

## 🛠️ Tehnologije

| Tehnologija | Verzija | Uloga |
|-------------|---------|-------|
| Laravel | 10.x | Back-end framework |
| React | 18.x | Front-end biblioteka |
| Inertia.js | 1.x | Most između Laravel-a i React-a |
| MySQL | 8.x | Baza podataka |
| Vite | 5.x | Build alat za front-end |
| Node.js | 18.x+ | JavaScript runtime |
| Composer | 2.x | PHP dependency manager |

---

### Laravel

<img src="https://laravel.com/img/logomark.min.svg" alt="Laravel" width="80">

**Laravel** je jedan od najpopularnijih PHP framework-a, poznat po eleganciji, jednostavnosti i bogatoj funkcionalnosti.

#### Ključne karakteristike:

| Karakteristika | Opis |
|----------------|------|
| **MVC arhitektura** | Razdvaja logiku (Model), prikaz (View) i kontrolu (Controller) |
| **Eloquent ORM** | Intuitivan rad sa bazama podataka kroz PHP modele |
| **Blade templating** | Engine za dinamičke prikaze (u ovom projektu zamenjen React-om) |
| **Artisan CLI** | Komandna linija za generisanje koda, migracije, itd. |
| **Middleware** | Filtriranje HTTP zahteva (autentifikacija, CORS...) |
| **Routing** | Definisanje URL ruta i njihovih kontrolera |

#### Zašto Laravel za ovaj projekat?

1. **Odlična Inertia.js integracija** - Laravel ima first-class podršku za Inertia
2. **Eloquent ORM** - Jednostavan rad sa tabelama `cars`, `users`, `rentals`
3. **Ugrađena autentifikacija** - Login sistem spreman za korišćenje
4. **Artisan komande** - Brzo generisanje kontrolera, modela, migracija

---

### React

<img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" width="80">

**React** je JavaScript biblioteka razvijena od strane Meta (Facebook) za izgradnju korisničkih interfejsa.

#### Ključne karakteristike:

| Karakteristika | Opis |
|----------------|------|
| **Komponentni pristup** | UI se gradi od manjih, nezavisnih komponenti |
| **Virtual DOM** | Efikasno ažuriranje samo promenjenih delova stranice |
| **Deklarativni stil** | Opisujete ŠTA želite, React brine KAKO |
| **JSX sintaksa** | Kombinacija JavaScript-a i HTML-a |
| **Hooks** | useState, useEffect za upravljanje stanjem |
| **Jednosmerni tok podataka** | Podaci teku od roditelja ka deci |

#### Zašto React za ovaj projekat?

1. **Popularnost** - Najveća zajednica i broj resursa
2. **Fleksibilnost** - Lako se integriše sa Inertia.js
3. **Performanse** - Virtual DOM obezbeđuje brz UI
4. **Komponente** - Ponovno korišćenje koda (CarCard, Modal, DatePicker...)

---

### Inertia.js

**Inertia.js** je framework koji deluje kao **"lepak" (glue)** između server-side framework-a (Laravel) i client-side framework-a (React).

#### Šta Inertia.js NIJE:

- ❌ Nije zamena za Laravel
- ❌ Nije zamena za React
- ❌ Nije još jedan JavaScript framework
- ❌ Nije REST API generator

#### Šta Inertia.js JESTE:

- ✅ Most koji povezuje back-end i front-end
- ✅ Omogućava SPA bez pisanja API-ja
- ✅ Koristi postojeće Laravel rute i kontrolere
- ✅ Automatski prenosi podatke u React komponente

---

## 🏗️ Arhitektura aplikacije

### Tradicionalna SPA arhitektura (bez Inertia.js)

```
┌─────────────┐     HTTP/JSON      ┌─────────────┐
│             │ ←───────────────── │             │
│   React     │                    │  Laravel    │
│   (Front)   │ ──────────────────→│  REST API   │
│             │     fetch/axios    │             │
└─────────────┘                    └─────────────┘
      │                                   │
      │                                   │
      ▼                                   ▼
  localStorage                        MySQL DB
  (JWT token)
```

**Problemi ovog pristupa:**
- Potrebno pisati API endpoint za svaku akciju
- Ručno upravljanje autentifikacijom (JWT tokeni)
- Dupla validacija (front-end i back-end)
- Složenije rukovanje greškama

---

### Inertia.js arhitektura (ovaj projekat)

```
┌─────────────┐                    ┌─────────────┐
│             │   Inertia.render() │             │
│   React     │ ←───────────────── │  Laravel    │
│   (Front)   │                    │  Controller │
│             │ ──────────────────→│             │
└─────────────┘    Inertia.post()  └─────────────┘
                                          │
                                          │
                                          ▼
                                      MySQL DB
```

**Prednosti:**
- Laravel kontroler direktno šalje podatke React komponenti
- Nema potrebe za API endpoint-ima
- Sesijska autentifikacija (kao klasična web app)
- Jedna validacija na serveru

---

### Tok podataka u aplikaciji

```
1. Korisnik otvara stranicu
   └─→ Laravel ruta: Route::get('/', [CarController::class, 'index'])
       └─→ Kontroler: return Inertia::render('Home', ['cars' => $cars])
           └─→ React komponenta prima props: function Home({ cars })

2. Korisnik iznajmljuje auto
   └─→ React: Inertia.post('/rent', { car_id, start_date, end_date })
       └─→ Laravel ruta: Route::post('/rent', [RentalController::class, 'store'])
           └─→ Kontroler obrađuje zahtev, vraća redirect ili error
               └─→ Inertia automatski ažurira React komponentu
```

---

## 🎯 Zašto Inertia.js?

Inertia.js rešava ključni problem moderne web razvoja: **kako napraviti SPA sa bogatim korisničkim iskustvom, a zadržati jednostavnost server-side razvoja?**

### Glavne prednosti:

| Prednost | Objašnjenje |
|----------|-------------|
| 🔗 **"Glue" - Lepak** | Povezuje Laravel i React bez dodatnog sloja |
| 🚀 **SPA bez API-ja** | Nema potrebe za REST/GraphQL endpoint-ima |
| 📝 **Manje koda** | Značajno manje boilerplate koda |
| 🔒 **Sesijska auth** | Koristi Laravel-ovu ugrađenu autentifikaciju |
| 🔄 **SEO podrška** | Server-Side Rendering (SSR) opcija |
| ⚡ **Brzina razvoja** | Fokus na funkcionalnost, ne na infrastrukturu |

### Kada koristiti Inertia.js?

✅ **Idealno za:**
- Aplikacije gde već koristite Laravel
- Projekte gde tim poznaje i PHP i JavaScript
- Admin panele i dashboard-e
- CRUD aplikacije
- Aplikacije sa sesijskom autentifikacijom

❌ **Nije idealno za:**
- Aplikacije koje trebaju javni API (mobilne app)
- Mikroservisnu arhitekturu
- Projekte gde front-end i back-end razvijaju odvojeni timovi
- Real-time aplikacije sa WebSocket-ima

---

## ⚖️ Prednosti i mane Inertia.js

### ✅ Prednosti

| # | Prednost | Detalji |
|---|----------|---------|
| 1 | **Manje koda** | Nema potrebe za pisanjem API kontrolera, serializera, fetch poziva |
| 2 | **Jednostavnost** | Koristi poznate Laravel koncepte (rute, kontroleri, middleware) |
| 3 | **Brži razvoj** | Od ideje do implementacije za kraće vreme |
| 4 | **Lakše održavanje** | Jedna aplikacija umesto dve odvojene |
| 5 | **Tipična validacija** | Laravel-ova validacija radi automatski |
| 6 | **Flash poruke** | Session flash poruke rade kao u klasičnom Laravel-u |
| 7 | **Shared data** | Lako deljenje globalnih podataka (auth user, notifikacije) |

### ❌ Mane i ograničenja

| # | Mana | Detalji |
|---|------|---------|
| 1 | **Vezanost za server** | Front-end zavisi od back-end framework-a |
| 2 | **Nema javnog API-ja** | Ako treba mobilna app, morate pisati dodatni API |
| 3 | **Manja fleksibilnost** | Teže razdvojiti front-end i back-end timove |
| 4 | **Learning curve** | Potrebno razumeti i Laravel i React |
| 5 | **SSR kompleksnost** | Server-Side Rendering zahteva dodatnu konfiguraciju |

### Poređenje pristupa

| Aspekt | Inertia.js | Tradicionalni API |
|--------|------------|-------------------|
| Količina koda | Manje | Više |
| Vreme razvoja | Brže | Sporije |
| Fleksibilnost | Manja | Veća |
| Mobilna podrška | Ograničena | Puna |
| Kompleksnost | Niža | Viša |
| Tim | Full-stack | Može biti odvojen |

---

## ⚙️ Instalacija i pokretanje

### 🔹 Preduslovi

Pre početka, potrebno je imati instalirano:

| Alat | Link | Provera instalacije |
|------|------|---------------------|
| XAMPP (Apache + MySQL) | [apachefriends.org](https://www.apachefriends.org/) | Pokrenuti XAMPP Control Panel |
| Node.js i npm | [nodejs.org](https://nodejs.org/) | `node -v` i `npm -v` |
| Composer | [getcomposer.org](https://getcomposer.org/) | `composer -V` |
| Git | [git-scm.com](https://git-scm.com/) | `git --version` |
| VS Code (opciono) | [code.visualstudio.com](https://code.visualstudio.com/) | - |

---

### 🔹 Koraci za instalaciju

#### 1️⃣ Kloniranje repozitorijuma

```bash
git clone https://github.com/DejanCumpujerovic/RentalCarApp.git
cd RentalCarApp
```

#### 2️⃣ Instalacija PHP zavisnosti

```bash
composer install
```

#### 3️⃣ Instalacija JavaScript zavisnosti

```bash
npm install
```

#### 4️⃣ Podešavanje environment fajla

```bash
cp .env.example .env
```

Otvorite `.env` fajl i podesite bazu podataka:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rentalCar
DB_USERNAME=root
DB_PASSWORD=
```

#### 5️⃣ Generisanje aplikacionog ključa

```bash
php artisan key:generate
```

#### 6️⃣ Kreiranje baze i pokretanje migracija

U MySQL-u kreirajte bazu `rentalCar`, zatim:

```bash
php artisan migrate
```

#### 7️⃣ (Opciono) Popunjavanje test podacima

```bash
php artisan db:seed
```

#### 8️⃣ Pokretanje servera

Otvorite **dva terminala**:

**Terminal 1 - Laravel server:**
```bash
php artisan serve
```

**Terminal 2 - Vite dev server:**
```bash
npm run dev
```

#### 📍 Aplikacija je dostupna na:

👉 **http://127.0.0.1:8000**

---

## 🖥️ Demonstracija projekta

### Početna stranica

<!--
  UPUTSTVO: Dodajte screenshot početne stranice
  1. Napravite screenshot aplikacije
  2. Sačuvajte kao: docs/images/homepage.png
  3. Uklonite komentar sa linije ispod
-->
<!-- ![Početna stranica](docs/images/homepage.png) -->

Početna stranica prikazuje:
- **Hero sekciju** sa naslovom "Welcome to Rent-a-Car"
- **Login dugme** za prijavu korisnika
- **Listu dostupnih automobila** (nakon prijave)

### Korisnički tok (User Flow)

```
┌─────────────────┐
│  Početna strana │
│  "Welcome to    │
│   Rent-a-Car"   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Login stranica │
│  Email/Password │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Lista automobila│
│  + Filter datuma │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Iznajmljivanje │
│  Modal/Forma    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Potvrda       │
│   rezervacije   │
└─────────────────┘
```

---

## ✨ Funkcionalnosti

| # | Funkcionalnost | Opis |
|---|----------------|------|
| 1 | 🔐 **Prijavljivanje** | Login sistem sa email-om i lozinkom |
| 2 | 🚘 **Pregled automobila** | Lista svih dostupnih vozila |
| 3 | 📅 **Filter po datumu** | Prikaz vozila dostupnih u izabranom periodu |
| 4 | 📝 **Iznajmljivanje** | Rezervacija vozila za izabrani period |
| 5 | 🚪 **Odjavljivanje** | Logout funkcionalnost |

---

## 💻 Primeri koda

### 1. Inertia.js setup (app.jsx)

Ovo je ulazna tačka React aplikacije koja koristi Inertia:

```jsx
import { createInertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';
import { createRoot } from 'react-dom/client';

// Inicijalizacija progress bara
InertiaProgress.init();

createInertiaApp({
  // Dinamički učitava stranice iz ./Pages foldera
  resolve: (name) => import(`./Pages/${name}`),

  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(<App {...props} />);
  },
});
```

**Objašnjenje:**
- `resolve` - Mapira ime stranice na React komponentu
- `setup` - Montira React aplikaciju u DOM
- `InertiaProgress` - Prikazuje loading bar prilikom navigacije

---

### 2. Laravel kontroler sa Inertia

```php
<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Inertia\Inertia;

class CarController extends Controller
{
    public function index()
    {
        // Preuzimanje svih automobila iz baze
        $cars = Car::all();

        // Renderovanje React komponente sa podacima
        return Inertia::render('Home', [
            'cars' => $cars,
        ]);
    }

    public function filterCars(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Filtriranje dostupnih automobila
        $availableCars = Car::whereDoesntHave('rentals', function ($query) use ($startDate, $endDate) {
            $query->where('start_date', '<=', $endDate)
                  ->where('end_date', '>=', $startDate);
        })->get();

        return Inertia::render('Home', [
            'cars' => $availableCars,
        ]);
    }
}
```

**Objašnjenje:**
- `Inertia::render()` - Šalje podatke direktno React komponenti
- Nema potrebe za `return response()->json()`
- React komponenta `Home` prima `cars` kao prop

---

### 3. Laravel rute

```php
use App\Http\Controllers\CarController;
use App\Http\Controllers\AuthController;

// Javne rute
Route::get('/', [CarController::class, 'index'])->name('home');
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

// Zaštićene rute (potrebna autentifikacija)
Route::middleware('auth')->group(function () {
    Route::post('/filterCars', [CarController::class, 'filterCars']);
    Route::post('/rent', [RentalController::class, 'store']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
```

---

### 4. React komponenta - Iznajmljivanje sa Inertia.js

```jsx
import { Inertia } from '@inertiajs/inertia';

const handleRent = () => {
    // Provera da li je korisnik ulogovan
    if (!auth.user) {
        alert("You need to log in to rent a car.");
        return;
    }

    // Validacija datuma
    if (!rentalDates.startDate || !rentalDates.endDate) {
        alert("Please select both start and end dates.");
        return;
    }

    // Slanje zahteva preko Inertia.js
    Inertia.post('/rent', {
        car_id: selectedCar.id,
        start_date: rentalDates.startDate,
        end_date: rentalDates.endDate,
    });

    closeModal();
};
```

**Prednosti ovog pristupa:**
- ✅ Samo 5 linija za HTTP zahtev
- ✅ Automatsko rukovanje CSRF tokenom
- ✅ Automatski redirect nakon uspeha
- ✅ Automatsko prikazivanje grešaka

---

### 5. Isti kod BEZ Inertia.js (Fetch API)

```jsx
const handleRent = async () => {
    if (!auth.user) {
        alert("You need to log in to rent a car.");
        return;
    }

    if (!rentalDates.startDate || !rentalDates.endDate) {
        alert("Please select both start and end dates.");
        return;
    }

    try {
        // Ručno slanje fetch zahteva
        const response = await fetch('/rent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Ručno dodavanje CSRF tokena
                'X-CSRF-TOKEN': document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute('content'),
            },
            body: JSON.stringify({
                car_id: selectedCar.id,
                start_date: rentalDates.startDate,
                end_date: rentalDates.endDate,
            }),
        });

        // Ručno rukovanje odgovorom
        if (response.ok) {
            alert("Car rented successfully!");
            closeModal();
            // Ručno osvežavanje podataka
            window.location.reload();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message || 'Failed to rent a car.'}`);
        }
    } catch (error) {
        console.error("Error occurred:", error);
        alert("An unexpected error occurred.");
    }
};
```

**Problemi ovog pristupa:**
- ❌ ~30 linija umesto ~5
- ❌ Ručno upravljanje CSRF tokenom
- ❌ Ručno parsiranje odgovora
- ❌ Ručno rukovanje greškama
- ❌ Ručno osvežavanje stranice

---

### Vizuelno poređenje

| Aspekt | Inertia.js | Fetch API |
|--------|------------|-----------|
| Linije koda | ~5 | ~30 |
| CSRF token | Automatski | Ručno |
| Error handling | Automatski | Ručno |
| Redirect | Automatski | Ručno |
| Loading state | Automatski | Ručno |

---

## 📁 Struktura projekta

```
RentalCarApp/
│
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── CarController.php      # Kontroler za automobile
│   │   │   ├── RentalController.php   # Kontroler za iznajmljivanje
│   │   │   └── AuthController.php     # Kontroler za autentifikaciju
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php  # Inertia middleware
│   │
│   └── Models/
│       ├── Car.php                    # Model automobila
│       ├── User.php                   # Model korisnika
│       └── Rental.php                 # Model iznajmljivanja
│
├── resources/
│   └── js/
│       ├── app.jsx                    # Ulazna tačka React aplikacije
│       └── Pages/
│           ├── Home.jsx               # Početna stranica
│           ├── Login.jsx              # Login stranica
│           └── Components/
│               ├── CarCard.jsx        # Komponenta za prikaz auta
│               ├── DateFilter.jsx     # Komponenta za filter datuma
│               └── RentModal.jsx      # Modal za iznajmljivanje
│
├── routes/
│   └── web.php                        # Definicije ruta
│
├── database/
│   └── migrations/                    # Migracije baze podataka
│
├── .env                               # Environment konfiguracija
├── composer.json                      # PHP zavisnosti
├── package.json                       # JavaScript zavisnosti
└── vite.config.js                     # Vite konfiguracija
```

---

## 🏁 Zaključak

### Inertia.js vs Fetch API - Sumiranje

| Kriterijum | Pobednik |
|------------|----------|
| Manje koda | 🏆 Inertia.js |
| Jednostavnost | 🏆 Inertia.js |
| Brzina razvoja | 🏆 Inertia.js |
| Lakše održavanje | 🏆 Inertia.js |
| Fleksibilnost | 🏆 Fetch API |
| Mobilna podrška | 🏆 Fetch API |

### Ključne tačke

1. **Manje koda** - Inertia.js značajno smanjuje količinu boilerplate koda
2. **Jednostavnost i funkcionalnost** - Fokus na poslovnu logiku, ne na infrastrukturu
3. **Brz razvoj** - Od ideje do implementacije za kraće vreme
4. **Lakše održavanje** - Jedna kodna baza, poznati Laravel koncepti

### Kada izabrati Inertia.js?

✅ Izaberite Inertia.js ako:
- Već koristite Laravel
- Pravite web aplikaciju (ne mobilnu)
- Želite SPA iskustvo bez kompleksnosti
- Tim poznaje i PHP i JavaScript

❌ Izaberite klasični API ako:
- Trebate javni API za mobilne aplikacije
- Front-end i back-end timovi rade odvojeno
- Planirate mikroservisnu arhitekturu

---

## 📚 Reference

### Zvanična dokumentacija

- [Laravel dokumentacija](https://laravel.com/docs)
- [React dokumentacija](https://react.dev/)
- [Inertia.js dokumentacija](https://inertiajs.com/)
- [Vite dokumentacija](https://vitejs.dev/)

### Korisni resursi

- [Laravel + Inertia.js starter kit](https://github.com/laravel/breeze)
- [Inertia.js GitHub repozitorijum](https://github.com/inertiajs/inertia)

---

## 👤 Autor

**Dejan Čumpujerović**

- 🎓 Broj indeksa: 1678
- 📚 Predmet: Napredno softversko inženjerstvo
- 🔗 GitHub: [github.com/DejanCumpujerovic](https://github.com/DejanCumpujerovic)

---

<p align="center">
  <i>Hvala na pažnji! 🙏</i>
</p>
