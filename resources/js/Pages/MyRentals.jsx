import React, { useState, useEffect } from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import AppLayout from '../Layouts/AppLayout';
import '../../css/MyRentals.css';

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function isFutureRental(startDateStr) {
    if (!startDateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDateStr);
    start.setHours(0, 0, 0, 0);
    return start > today;
}

function isUpcomingRental(endDateStr) {
    if (!endDateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDateStr);
    end.setHours(0, 0, 0, 0);
    return end >= today;
}

export default function MyRentals() {
    const { rentals, auth, flash } = usePage().props;
    const [rentalToCancel, setRentalToCancel] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        const successMsg = flash?.success || '';
        const errorMsg = flash?.error || '';
        const msg = successMsg || errorMsg;
        const type = successMsg ? 'success' : 'error';
        if (msg) {
            setToast({ show: true, message: msg, type });
            const t = setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 4000);
            return () => clearTimeout(t);
        }
    }, [flash?.success, flash?.error]);

    const openCancelModal = (rental) => {
        setRentalToCancel(rental);
    };

    const closeCancelModal = () => {
        setRentalToCancel(null);
    };

    const confirmCancelRental = () => {
        if (!rentalToCancel) return;
        Inertia.delete(`/rentals/${rentalToCancel.id}`, {
            preserveScroll: true,
            onFinish: () => setRentalToCancel(null),
        });
    };

    const upcomingRentals = rentals?.filter((r) => isUpcomingRental(r.end_date)) ?? [];
    const pastRentals = rentals?.filter((r) => !isUpcomingRental(r.end_date)) ?? [];
    const hasAnyRentals = (rentals?.length ?? 0) > 0;

    const RentalCard = ({ rental, isUpcoming }) => {
        const canCancel = isFutureRental(rental.start_date);
        const isActive = isUpcoming && !canCancel;
        const status = canCancel ? 'Upcoming' : isActive ? 'Active' : 'Completed';

        return (
            <div className="rental-card">
                <div className="rental-card-header">
                    <h3 className="rental-card-title">{rental.car?.name}</h3>
                    <span className={`rental-card-badge rental-card-badge--${status.toLowerCase()}`}>
                        {status}
                    </span>
                </div>
                <p className="rental-car-info">
                    {rental.car?.brand} · {rental.car?.year}
                </p>
                <div className="rental-card-dates">
                    <span className="rental-card-date">
                        <span className="rental-card-date-label">From</span>
                        {formatDate(rental.start_date)}
                    </span>
                    <span className="rental-card-date-sep">→</span>
                    <span className="rental-card-date">
                        <span className="rental-card-date-label">To</span>
                        {formatDate(rental.end_date)}
                    </span>
                </div>
                {rental.total_price != null && (
                    <p className="rental-total-price">
                        <span className="rental-total-label">Total</span>
                        <span className="rental-total-amount">{parseFloat(rental.total_price).toFixed(2)} €</span>
                    </p>
                )}
                <div className="rental-card-footer">
                    {canCancel ? (
                        <button
                            type="button"
                            onClick={() => openCancelModal(rental)}
                            className="rental-card-cancel-btn"
                            aria-label="Cancel reservation"
                        >
                            Cancel reservation
                        </button>
                    ) : status === 'Completed' && rental.car?.id ? (
                        <InertiaLink
                            href={`/cars/${rental.car.id}?review=1`}
                            className="rental-card-review-link"
                        >
                            Leave a review
                        </InertiaLink>
                    ) : (
                        <span className="rental-card-status-text">
                            Currently in progress
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <AppLayout>
            <div className="my-rentals-content">
                <h1 className="my-rentals-title">My Reservations</h1>
                <p className="my-rentals-subtitle">Overview of all your rented vehicles</p>

            {toast.show && (
                <div className={`toast toast--${toast.type}`} role="alert">
                    {toast.message}
                </div>
            )}

            {!hasAnyRentals ? (
                <p className="my-rentals-empty">
                    You have no reservations. Rent a vehicle on the home page.
                </p>
            ) : (
                <>
                    <section className="rentals-section">
                        <h2 className="rentals-section-title">Upcoming</h2>
                        {upcomingRentals.length > 0 ? (
                            <div className="rentals-list">
                                {upcomingRentals.map((rental) => (
                                    <RentalCard key={rental.id} rental={rental} isUpcoming={true} />
                                ))}
                            </div>
                        ) : (
                            <p className="rentals-section-empty">No upcoming reservations.</p>
                        )}
                    </section>
                    <section className="rentals-section">
                        <h2 className="rentals-section-title">Past</h2>
                        {pastRentals.length > 0 ? (
                            <div className="rentals-list">
                                {pastRentals.map((rental) => (
                                    <RentalCard key={rental.id} rental={rental} isUpcoming={false} />
                                ))}
                            </div>
                        ) : (
                            <p className="rentals-section-empty">No past reservations.</p>
                        )}
                    </section>
                </>
            )}
            </div>

            {rentalToCancel && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Cancel reservation</h2>
                        <p className="modal-confirm-text">
                            Are you sure you want to cancel the reservation for{' '}
                            <strong>{rentalToCancel.car?.name}</strong> ({rentalToCancel.car?.brand} – {rentalToCancel.car?.year})?
                        </p>
                        <p className="modal-confirm-dates">
                            {formatDate(rentalToCancel.start_date)} – {formatDate(rentalToCancel.end_date)}
                        </p>
                        <div className="modal-actions">
                            <button className="btn rental-card-cancel-btn" onClick={confirmCancelRental}>
                                Yes, cancel reservation
                            </button>
                            <button className="btn btn-secondary" onClick={closeCancelModal}>
                                Keep reservation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
