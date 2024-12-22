import React, { useState, useEffect } from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import Logout from './Logout';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import '../../css/Home.css';


export default function Home() {
    const { cars, auth, error } = usePage().props;
    const [selectedCar, setSelectedCar] = useState(null);
    const [rentalDates, setRentalDates] = useState({ startDate: '', endDate: '' });
    const [filteredRentals, setFilteredRentals] = useState([]);

    const openModal = (car) => {
        setSelectedCar(car);
    };

    useEffect(() => {
        console.log("Available Rentals:", filteredRentals);
    }, [filteredRentals]);

    const closeModal = () => {
        setSelectedCar(null);
        setRentalDates({ startDate: '', endDate: '' });
    };

    const handleLogout = () => {
        Inertia.post('/logout');
    };

    const handleRent = () => {
        if (!auth.user) {
            alert("You need to log in to rent a car.");
            return;
        }

        if (!rentalDates.startDate || !rentalDates.endDate) {
            alert("Please select both start and end dates.");
            return;
        }

        Inertia.post('/rent', {
            car_id: selectedCar.id,
            start_date: rentalDates.startDate,
            end_date: rentalDates.endDate,
        });

        closeModal();
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setRentalDates((prev) => ({ ...prev, [name]: value }));
    };

    const filterCarsByDate = async () => {
        if (!rentalDates.startDate || !rentalDates.endDate) {
            alert("Please select both start and end dates.");
            return;
        }
    
        try {
            const response = await axios.post('/filterCars', {
                start_date: rentalDates.startDate,
                end_date: rentalDates.endDate,
            });
    
            if (response.data && response.data.availableRentals) {
                // Filtriraj jedinstvena vozila
                const uniqueCars = [];
                const seenCars = new Set();
    
                response.data.availableRentals.forEach((rental) => {
                    if (!seenCars.has(rental.car.id)) {
                        uniqueCars.push(rental);
                        seenCars.add(rental.car.id);
                    }
                });
    
                setFilteredRentals(uniqueCars);
            } else {
                console.error('No available cars found in the response');
                setFilteredRentals([]);
            }
        } catch (error) {
            console.error("Error filtering cars:", error);
            setFilteredRentals([]);
        }
    };

    
    const getStatus = (rental) => {
        const startDate = new Date(rental.start_date);
        const endDate = new Date(rental.end_date);
        const status = endDate >= startDate ? 'available' : 'rented';
        console.log(`Car: ${rental.car.name}, Start Date: ${startDate}, End Date: ${endDate}, Status: ${status}`);
        return status;
    };
    

    return (
        <div className="home-background">
            <h1 className="home-title">Welcome to Rent-a-Car</h1>
            <p className="home-subtitle">Your go-to application for car rentals!</p>

            {auth.user ? (
                <div>
                    <p className="home-subtitle">
                        Logged in as: <span className="user-name">{auth.user.name}</span>
                    </p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <a href="/login">
                    <button className="btn btn-primary">Login</button>
                </a>
            )}

            {error && <p className="error">{error}</p>}

            {auth.user && (
                <div>
                    <input 
                        type="date" 
                        name="startDate" 
                        value={rentalDates.startDate}
                        onChange={handleDateChange} 
                    />
                    <input 
                        type="date" 
                        name="endDate" 
                        value={rentalDates.endDate}
                        onChange={handleDateChange} 
                    />
                    <button onClick={filterCarsByDate}>Filter Cars</button>
                </div>
            )}

            {auth.user && (
            <div className="car-list">
                {filteredRentals && filteredRentals.length > 0 ? (
                    filteredRentals.map((rental) => (
                        <div key={rental.id} className="car-card">
                            <h3>{rental.car.name}</h3>
                            <p>{rental.car.brand} - {rental.car.year}</p>
                            <p>Status: {getStatus(rental)}</p>
                            {auth.user && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => openModal(rental.car)}
                                >
                                    Rent this car
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', fontSize: '1.2em', color: '#ffcc00' }}>
                    Unesite datum kada želite da rentirate automobil
                    </p>
                )}
            </div>
            )}

            {selectedCar && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Rent {selectedCar.name}</h2>
                        <label>
                            <p>Start Date:</p>
                            <input
                                type="date"
                                value={rentalDates.startDate}
                                onChange={(e) => setRentalDates({ ...rentalDates, startDate: e.target.value })}
                            />
                        </label>
                        <label>
                            <p>End Date:</p>
                            <input
                                type="date"
                                value={rentalDates.endDate}
                                onChange={(e) => setRentalDates({ ...rentalDates, endDate: e.target.value })}
                            />
                        </label>
                        <div className="modal-actions">
                            <button className="btn btn-success" onClick={handleRent}>
                                Confirm Rent
                            </button>
                            <button className="btn btn-secondary" onClick={closeModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
