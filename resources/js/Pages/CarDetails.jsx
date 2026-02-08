import React, { useState, useEffect } from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import AppLayout from '../Layouts/AppLayout';
import '../../css/CarDetails.css';

export default function CarDetails() {
    const { car, canReview, userReview, auth, error, success, flash } = usePage().props;
    const isReviewOnly = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('review') === '1';
    const [rentalDates, setRentalDates] = useState({ startDate: '', endDate: '' });
    const [reviewForm, setReviewForm] = useState({
        rating: userReview?.rating ?? 5,
        comment: userReview?.comment ?? '',
    });
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [alertModal, setAlertModal] = useState({ show: false, message: '' });

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

    const handleRent = () => {
        if (!auth?.user) {
            setAlertModal({ show: true, message: 'You need to log in to rent a car.' });
            return;
        }

        if (!rentalDates.startDate || !rentalDates.endDate) {
            setAlertModal({ show: true, message: 'Please select both start and end dates.' });
            return;
        }

        Inertia.post('/rent', {
            car_id: car.id,
            start_date: rentalDates.startDate,
            end_date: rentalDates.endDate,
        });
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setRentalDates((prev) => ({ ...prev, [name]: value }));
    };

    const getRentalSummary = () => {
        if (!car?.price_per_day || !rentalDates.startDate || !rentalDates.endDate) return null;
        const start = new Date(rentalDates.startDate);
        const end = new Date(rentalDates.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        if (days < 1) return null;
        return {
            days,
            total: (days * parseFloat(car.price_per_day)).toFixed(2),
        };
    };

    const rentalSummary = getRentalSummary();

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        Inertia.post(`/cars/${car.id}/reviews`, reviewForm, { preserveScroll: true });
    };

    const renderStars = (rating) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        const empty = 5 - full - (half ? 1 : 0);
        return (
            <span className="stars" aria-label={`${rating} out of 5 stars`}>
                {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}
            </span>
        );
    };

    if (!car) {
        return (
            <AppLayout>
                <div className="car-details-content">
                    <p>Car not found.</p>
                    <InertiaLink href="/">Back to home</InertiaLink>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="car-details-content">
                {toast.show && (
                    <div className={`toast toast--${toast.type}`} role="alert">
                        {toast.message}
                    </div>
                )}

                <div className="car-details-card">
                    <h1 className="car-details-title">{car.name}</h1>
                    <p className="car-details-subtitle">{car.brand} · {car.year}</p>

                    <div className="car-details-specs">
                        <div className="car-details-spec">
                            <span className="car-details-spec-label">Registration</span>
                            <span className="car-details-spec-value">{car.registration_no}</span>
                        </div>
                        <div className="car-details-spec">
                            <span className="car-details-spec-label">Status</span>
                            <span className={`car-details-spec-value car-details-status--${car.status}`}>
                                {car.status}
                            </span>
                        </div>
                        <div className="car-details-spec car-details-spec--price">
                            <span className="car-details-spec-label">Price per day</span>
                            <span className="car-details-spec-value">{car.price_per_day} €</span>
                        </div>
                        {(car.avg_rating != null || car.reviews_count > 0) && (
                            <div className="car-details-spec car-details-spec--rating">
                                <span className="car-details-spec-label">Rating</span>
                                <span className="car-details-spec-value">
                                    {renderStars(car.avg_rating ?? 0)} {car.avg_rating != null && car.avg_rating}
                                </span>
                                <span className="car-details-reviews-count">({car.reviews?.length ?? 0} reviews)</span>
                            </div>
                        )}
                    </div>

                    {canReview && isReviewOnly && (
                        <form className="car-details-review-form" onSubmit={handleReviewSubmit}>
                            <h3 className="car-details-review-form-title">Leave a review</h3>
                            <div className="car-details-review-fields">
                                <div className="car-details-review-rating">
                                    <label>Rating</label>
                                    <select
                                        value={reviewForm.rating}
                                        onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: parseInt(e.target.value, 10) }))}
                                    >
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <option key={n} value={n}>{n} ★</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="car-details-review-comment-field">
                                    <label htmlFor="review-comment">Message</label>
                                    <textarea
                                        id="review-comment"
                                        value={reviewForm.comment}
                                        onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                                        rows={2}
                                        maxLength={1000}
                                        placeholder="Share your experience (optional)"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="car-details-review-btn">
                                {userReview ? 'Update review' : 'Submit review'}
                            </button>
                        </form>
                    )}

                    {car.reviews && car.reviews.length > 0 && (
                        <div className="car-details-reviews">
                            <h3 className="car-details-reviews-title">Reviews</h3>
                            {car.reviews.map((review) => (
                                <div key={review.id} className="car-details-review-card">
                                    <div className="car-details-review-header">
                                        <span className="car-details-review-author">{review.user?.name ?? 'Anonymous'}</span>
                                        <span className="car-details-review-stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                    </div>
                                    {review.comment && (
                                        <div className="car-details-review-message">
                                            <span className="car-details-review-message-label">Message: </span>
                                            <span className="car-details-review-comment">{review.comment}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {!isReviewOnly && (
                    <div className="car-details-rent-section">
                        <h2 className="car-details-rent-title">Book this car</h2>
                        <label className="car-details-label">
                            <span>Start Date</span>
                            <input
                                type="date"
                                name="startDate"
                                value={rentalDates.startDate}
                                onChange={handleDateChange}
                            />
                        </label>
                        <label className="car-details-label">
                            <span>End Date</span>
                            <input
                                type="date"
                                name="endDate"
                                value={rentalDates.endDate}
                                onChange={handleDateChange}
                            />
                        </label>
                        {rentalSummary && (
                            <p className="car-details-total">
                                <strong>Total:</strong> {rentalSummary.total} € ({car.price_per_day} € × {rentalSummary.days} days)
                            </p>
                        )}
                        {auth?.user ? (
                            <button className="car-details-rent-btn" onClick={handleRent}>
                                Rent this car
                            </button>
                        ) : (
                            <a href="/login" className="car-details-rent-btn car-details-rent-btn--login">
                                Login to rent
                            </a>
                        )}
                    </div>
                )}
                </div>
            </div>

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
        </AppLayout>
    );
}
