🚗 RentalCarApp

RentalCarApp je demo aplikacija koja prikazuje integraciju Laravel-a i React-a pomoću Inertia.js frameworka.
Cilj projekta je demonstracija kako se može izgraditi moderna SPA aplikacija bez potrebe za pisanjem posebnog REST API-ja.

📌 Uvod

Inertia.js eliminiše potrebu za pisanjem REST API-ja i ručnim upravljanjem HTTP zahtevima.
Umesto toga, koristi postojeće server-side rute i kontrolere za komunikaciju sa front-end-om.

Framework automatski upravlja preuzimanjem podataka i njihovom sinhronizacijom sa React komponentama, što značajno smanjuje vreme potrebno za konfiguraciju.

Ova jednostavnost omogućava fokusiranje na razvoj funkcionalnosti, umesto na tehničke detalje povezivanja front-end-a i back-end-a.

🛠️ Tehnologije

Laravel – PHP framework za back-end

React – JavaScript biblioteka za front-end

Inertia.js – Most između Laravel-a i React-a (SPA bez API-ja)

MySQL – Baza podataka

Vite / npm – Front-end build alati

⚙️ Instalacija i pokretanje
🔹 Preduslovi

Pre početka, potrebno je imati instalirano:

XAMPP
 (Apache + MySQL)

Node.js i npm

Composer

Visual Studio Code ili drugi editor

Provera instalacije Node.js-a:

node -v
npm -v

🔹 Koraci za instalaciju
1️⃣ Kloniranje repozitorijuma
git clone https://github.com/DejanCumpujerovic/RentalCarApp.git
cd RentalCarApp

2️⃣ Instalacija PHP zavisnosti
composer install

3️⃣ Instalacija JavaScript zavisnosti
npm install

4️⃣ Podesite .env fajl
cp .env.example .env


U .env fajlu podesite bazu:

DB_DATABASE=rentalCar
DB_USERNAME=root
DB_PASSWORD=

5️⃣ Generisanje aplikacionog ključa
php artisan key:generate

6️⃣ Pokretanje migracija
php artisan migrate

7️⃣ Pokretanje servera
php artisan serve
npm run dev


📍 Aplikacija je dostupna na:
👉 http://127.0.0.1:8000

✨ Funkcionalnosti

✅ Prijavljivanje korisnika (Login)

🚘 Prikaz svih dostupnih automobila

📅 Filtriranje automobila po datumu

📝 Iznajmljivanje automobila u izabranom periodu

🧩 Laravel
Šta je Laravel?

Laravel je jedan od najpopularnijih PHP framework-a, poznat po eleganciji, jednostavnosti i bogatoj funkcionalnosti.
Zasniva se na MVC (Model-View-Controller) arhitekturi, koja razdvaja logiku, podatke i prikaz.

Zašto Laravel?
Karakteristika	Opis
Elegancija koda	Čist i čitljiv sintaksni stil
Eloquent ORM	Jednostavan rad sa bazama
Blade templating	Dinamički UI
Artisan CLI	Brz razvoj
Inertia.js podrška	SPA bez API-ja
Skalabilnost	Pogodan za male i velike projekte
Primer koda (Laravel + Inertia)
public function index()
{
    $cars = Car::all();

    return Inertia::render('Home', [
        'cars' => $cars,
    ]);
}

Route::get('/', [CarController::class, 'index'])->name('home');
Route::post('/filterCars', [CarController::class, 'filterCars']);

⚛️ React
Šta je React?

React je JavaScript biblioteka razvijena od strane Meta (Facebook) za izgradnju korisničkih interfejsa.
Koristi komponentni pristup i Virtual DOM, što ga čini brzim i efikasnim.

Zašto React?
Karakteristika	Opis
Komponente	Modularan i održiv kod
Deklarativni stil	Fokus na UI
Virtual DOM	Brza ažuriranja
Fleksibilnost	Integracija sa raznim alatima
Velika zajednica	Mnogo resursa

🔗 Inertia.js
Šta je Inertia.js?

Inertia.js omogućava kreiranje SPA aplikacija koristeći postojeće server-side rute i kontrolere.
Deluje kao "lepak" između Laravel-a i React-a – bez potrebe za REST API-jem.

Primer: Sa Inertia.js
const handleRent = () => {
    Inertia.post('/rent', {
        car_id: selectedCar.id,
        start_date: rentalDates.startDate,
        end_date: rentalDates.endDate,
    });
    closeModal();
};

Primer: Bez Inertia.js (Fetch API)
const handleRent = async () => {
    try {
        const response = await fetch('/rent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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

        if (response.ok) {
            alert("Car rented successfully!");
            closeModal();
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

⚖️ Kada koristiti koji pristup?
Inertia.js	Fetch API
Koristite Laravel	Backend nije Laravel
Brz i jednostavan razvoj	Veća kontrola
Nema dodatnog API sloja	Ručno upravljanje zahtevima

🏁 Zaključak

Korišćenje Inertia.js značajno smanjuje količinu koda i kompleksnost u Laravel + React aplikacijama.
Predstavlja moćan most koji ubrzava razvoj i pojednostavljuje održavanje.

Fetch API pruža veću fleksibilnost, ali zahteva više rada i složeniju arhitekturu.
