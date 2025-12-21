## CarRental and Buy Ecommerce Website
========================================
This is multivendor ecommerce website. Customers can purchase web scripts in various technologies.

# Features
--------------------------------------------
- Website
    - Home Page
        - Header
        - Search Bar (Car Name, Brand, Category, Location)
        - Latest Products
        - Featured Listings (Admin/Seller Promoted cars)
        - Rental vs Buy Toggle
        - Popular Categories (According to Rented & Bought count)
        - Popular Brands (According to their Popularity and Year)
        - Most Selled (According to Selled Products)
        - Location Based Availability (for rentals)
        - Range Filter (Price, Color, Brand, Consumption, Engine Type)
        - Customer Rating and Reviews
        - Footer
    - All Category List
    - All Product List According to category
        - Filter according to price, rental/buy, brand, model year, Fuel Type, Transmission, Mileage, Availability status
        - Sort according to price, latest, alphabet, views, rating, most ranted/selled
    - Product Detail
        - Rental availability Calender
        - Multiple videos and images
        - Seller Profile info
        - Similar Cars
        - Insurance Details
        - Terms and Conditions
        - Refund / Cancellation Policy
        - Customer Rating and Reviews
    - Checkout Page
        - PayPal
        - RazorPay
        - Stripe
        - Coupon / Promo Cod
        - Tax Calculation
        - Delivery / Pickup options
        - Invoice Generation(PDF)
        - Booking Summary (For Rental)
    - Order Success Page
    - Order Failure Page
    - Multilingual
==========================================
- Customer Panel
    - Login
    - Register
    - Forgot Password
    - Dashboard
        - Orders
        - Profile
        - Change Password
    - Wishlist / Favorites
    - Saved Addresses
    - Saved Payment Methods
    - Booking History (Rental vs Purchase)
    - Download Invoices
    - Review Moderation (Edit/Delete own reviews)
    - Cancel/Return request
===========================================
- Seller Panel
    - Login
    - Register
    - Forgot Password
    - Dashboard
        - Manage Categories
        - Manage Products
        - Orders
        - Customers
        - Profile
        - Change Password
    - Rental availability management
    - Pricing rules (daily / weekly / monthly)
    - Upload car documents (RC, insurance)
    - Earnings & payouts
    - Sales & rental analytics
    - Chat with customers (optional but powerful)
============================================
- Admin Panel
    - Manage Sellers
    - Manage Categories
    - Manage Products
    - Manage Customers
    - Manage Orders
    - Dashboard analytics (revenue, rentals, sales)
    - Commission management
    - Payment settlement
    - Dispute management
    - Review moderation
    - CMS (Home banners, static pages)
    - Multi-language content control
    - Role & permission management
    - Audit logs
============================================
- Multilingual
    - Language switcher
    - RTL support (if needed later)
    - Translation management (Admin side)
    - Currency conversion
============================================
- Security and System Features
    - Email verification
    - Phone OTP (for rentals)
    - CAPTCHA
    - Rate limiting
    - JWT / OAuth authentication
    - Role-based access control (RBAC)
    - Secure file uploads
    - Activity logs

# Database Design
--------------------------------------------
- Users
- Sellers
- Cars
- Orders
- Rentals
- Reviews

# Technologies (2025)
--------------------------------------------
- Programming:-------- python 3.12.0
- Backend Framework:-- Django 5.2.8
- Frontend Framework:- ReactJS
- CSS Framework:------ BootStrap
- Database:----------- PostgreSQL
- Payment:------------ Stripe, RazorPay, PayPal
- Authentication:----- JWT + OAuth