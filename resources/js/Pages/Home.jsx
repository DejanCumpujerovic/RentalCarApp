import React, { useState, useEffect } from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import AppLayout from '../Layouts/AppLayout';
import '../../css/Home.css';


const SORT_OPTIONS = [
    { value: '', label: 'Default' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'year_desc', label: 'Year: Newest first' },
    { value: 'year_asc', label: 'Year: Oldest first' },
    { value: 'rating_desc', label: 'Rating: Highest first' },
];

export default function Home() {
    const { cars = [], auth, error, success, flash } = usePage().props;
    const [selectedCar, setSelectedCar] = useState(null);
    const [rentalDates, setRentalDates] = useState({ startDate: '', endDate: '' });
    const [filteredCars, setFilteredCars] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [alertModal, setAlertModal] = useState({ show: false, message: '' });

    const brands = [...new Set((cars || []).map((c) => c.brand).filter(Boolean))].sort();

    const sourceCars = filteredCars !== null ? filteredCars : (cars || []);
    const displayCars = sourceCars
        .filter((car) => {
            const q = searchQuery.trim().toLowerCase();
            if (q) {
                const matchName = (car.name || '').toLowerCase().includes(q);
                const matchBrand = (car.brand || '').toLowerCase().includes(q);
                if (!matchName && !matchBrand) return false;
            }
            if (selectedBrand && car.brand !== selectedBrand) return false;
            return true;
        })
        .sort((a, b) => {
            if (!sortBy) return 0;
            switch (sortBy) {
                case 'price_asc':
                    return (parseFloat(a.price_per_day) || 0) - (parseFloat(b.price_per_day) || 0);
                case 'price_desc':
                    return (parseFloat(b.price_per_day) || 0) - (parseFloat(a.price_per_day) || 0);
                case 'year_desc':
                    return (b.year || 0) - (a.year || 0);
                case 'year_asc':
                    return (a.year || 0) - (b.year || 0);
                case 'rating_desc':
                    return (b.avg_rating || 0) - (a.avg_rating || 0);
                default:
                    return 0;
            }
        });

    const openModal = (car) => {
        setSelectedCar(car);
    };

    useEffect(() => {
        const successMsg = success || (flash && flash.success) || '';
        const errorMsg = error || (flash && flash.error) || '';
        const msg = successMsg || errorMsg;
        const type = successMsg ? 'success' : 'error';
        if (msg) {
            setToast({ show: true, message: msg, type });
            const t = setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 4000);
            return () => clearTimeout(t);
        }
    }, [success, error, flash]);

    const closeModal = () => {
        setSelectedCar(null);
        setRentalDates({ startDate: '', endDate: '' });
    };

    const handleRent = () => {
        if (!auth.user) {
            setAlertModal({ show: true, message: 'You need to log in to rent a car.' });
            return;
        }

        if (!rentalDates.startDate || !rentalDates.endDate) {
            setAlertModal({ show: true, message: 'Please select both start and end dates.' });
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

    const getRentalSummary = () => {
        if (!selectedCar?.price_per_day || !rentalDates.startDate || !rentalDates.endDate) return null;
        const start = new Date(rentalDates.startDate);
        const end = new Date(rentalDates.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        if (days < 1) return null;
        return {
            days,
            total: (days * parseFloat(selectedCar.price_per_day)).toFixed(2),
        };
    };

    const rentalSummary = getRentalSummary();

    const filterCarsByDate = async () => {
        if (!rentalDates.startDate || !rentalDates.endDate) {
            setAlertModal({ show: true, message: 'Please select both start and end dates.' });
            return;
        }
        try {
            const response = await axios.post('/filterCars', {
                start_date: rentalDates.startDate,
                end_date: rentalDates.endDate,
            });
            if (response.data && response.data.cars) {
                setFilteredCars(response.data.cars);
            } else {
                setFilteredCars([]);
            }
        } catch (err) {
            console.error('Error filtering cars:', err);
            setFilteredCars([]);
        }
    };

    const showAllCars = () => {
        setFilteredCars(null);
        setRentalDates({ startDate: '', endDate: '' });
    };

    return (
        <AppLayout>
            <div className="home-main">
                <h1 className="home-title">Welcome to Rent-a-Car</h1>
                <p className="home-subtitle">Your go-to application for car rentals!</p>

            {!auth.user && (
                <a href="/login">
                    <button className="btn btn-primary">Login</button>
                </a>
            )}

                {toast.show && (
                <div className={`toast toast--${toast.type}`} role="alert">
                    {toast.message}
                </div>
            )}

                {auth.user && (
                <div className="home-filters">
                    <div className="home-filters-row">
                        <input
                            type="text"
                            placeholder="Search by name or brand..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="home-search-input"
                            aria-label="Search cars"
                        />
                        <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            className="home-brand-select"
                            aria-label="Filter by brand"
                        >
                            <option value="">All brands</option>
                            {brands.map((b) => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="home-sort-select"
                            aria-label="Sort cars"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="home-filters-row home-filters-dates">
                        <input
                            type="date"
                            name="startDate"
                            value={rentalDates.startDate}
                            onChange={handleDateChange}
                            className="home-date-input"
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={rentalDates.endDate}
                            onChange={handleDateChange}
                            className="home-date-input"
                        />
                        <button type="button" onClick={filterCarsByDate} className="btn btn-primary">
                            Filter by availability
                        </button>
                        {filteredCars !== null && (
                            <button type="button" onClick={showAllCars} className="btn btn-secondary">
                                Show all cars
                            </button>
                        )}
                    </div>
                </div>
            )}

            {auth.user && (
            <div className="car-list">
                {displayCars.length > 0 ? (
                    displayCars.map((car) => (
                        <div key={car.id} className="car-card">
                            <div className="car-card-header">
                                <h3 className="car-card-title">{car.name}</h3>
                            </div>
                            <p className="car-card-info">{car.brand} · {car.year}</p>
                            <div className="car-card-price">
                                <span className="car-card-price-label">Price per day</span>
                                <span className="car-card-price-amount">{car.price_per_day} €</span>
                            </div>
                            <div className="car-card-rating-area">
                                {car.avg_rating != null && (
                                    <p className="car-card-rating">
                                        ★ {car.avg_rating} {car.reviews_count > 0 && `(${car.reviews_count})`}
                                    </p>
                                )}
                            </div>
                            <InertiaLink href={`/cars/${car.id}`} className="car-card-details-link">
                                View details →
                            </InertiaLink>
                            <button
                                className="car-card-rent-btn"
                                onClick={() => openModal(car)}
                            >
                                Rent this car
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="home-empty-msg">
                        {sourceCars.length === 0 && filteredCars !== null
                            ? 'No cars available for the selected dates.'
                            : searchQuery || selectedBrand
                                ? 'No cars match your search. Try different filters.'
                                : 'Browse all vehicles above, or pick dates and click "Filter by availability" to see only available cars.'}
                    </p>
                )}
            </div>
            )}

            {alertModal.show && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Notice</h2>
                        <p className="modal-alert-message">{alertModal.message}</p>
                        <div className="modal-actions">
                            <button className="btn btn-primary" onClick={() => setAlertModal({ show: false, message: '' })}>
                                OK
                            </button>
                        </div>
                    </div>
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
                        {rentalSummary && (
                            <p className="modal-total-price">
                                <strong>Total price:</strong> {rentalSummary.total} € ({selectedCar.price_per_day} € × {rentalSummary.days} days)
                            </p>
                        )}
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
        </AppLayout>
    );
}
