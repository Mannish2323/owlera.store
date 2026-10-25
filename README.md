# OWLERA — Quiet Luxury, Timeless Elegance

Welcome to **OWLERA**, a premium jewellery and lifestyle e-commerce platform built around understated elegance, refined aesthetics, and a seamless online shopping experience.

Our goal is to create a sophisticated digital storefront that combines editorial design, intuitive navigation, and secure shopping functionality.

---

## ✨ Project Overview

OWLERA delivers a premium jewellery shopping experience through:

* **Luxury UI/UX:** Minimalist layouts, elegant typography, and refined visual details.
* **Product Discovery:** Organised collections, product listings, and rich product detail pages.
* **Shopping Experience:** Cart, wishlist, instant search, and responsive navigation.
* **Secure Checkout:** Payment integration with server-side Razorpay verification.
* **Customer Accounts & Order Tracking:** Order history, tracking, inventory, and manual fulfilment workflows.
* **Order Management:** Secure admin control panel with sales KPIs and inventory controls.
* **Responsive Design:** Optimised experiences across mobile, tablet, and desktop.
* **SEO & Performance:** Search-friendly pages, OpenGraph metadata, JSON-LD structured data, and efficient asset loading.

---

## 🎨 Brand Identity

* **Brand:** OWLERA
* **Tagline:** *Your Everyday Shine*
* **Design Philosophy:** Quiet luxury
* **Visual Palette:** Warm ivory (`#F8F4EC`), Soft cream (`#F1E8DA`), Deep charcoal (`#1E211E`), and Bronze gold (`#AD8048`)
* **Typography:** Editorial serif headings (*Cormorant Garamond*) with clean sans-serif body text (*Inter*)
* **Brand Mark:** A geometric monoline diamond owl emblem paired with the suspended OWLERA wordmark

---

## 🛠️ Technology Stack

* **Frontend:** Next.js 14 (App Router), React, TypeScript
* **Styling:** Custom CSS Design Tokens & Vanilla CSS Architecture
* **Database:** Supabase PostgreSQL with Row Level Security (RLS)
* **Authentication:** Supabase Auth & Admin Session Guards
* **File Storage:** Supabase Storage
* **Payments:** Razorpay API & Webhook HMAC-SHA256 Verification
* **Customer Support:** Direct WhatsApp Concierge API integration (`+91 6305630468`)
* **Version Control:** Git and GitHub
* **Deployment:** Vercel

---

## 🌐 Deployment

* **Target Website:** [https://owlerastore.vercel.app](https://owlerastore.vercel.app/)
* **Repository:** [https://github.com/Mannish2323/owlera.store.git](https://github.com/Mannish2323/owlera.store.git)

Deployment uses GitHub and Vercel, with automated preview deployments for testing before production releases.

---

## 🔐 Security & Privacy

Security is a foundational pillar of the OWLERA platform:

* Keep API secrets and credentials strictly out of source control.
* Store deployment secrets in environment variables (`.env.local`).
* Protect customer information: unverified tracking lookups mask personal names and phone numbers.
* Apply PostgreSQL Row Level Security (RLS) policies for all database operations.
* Verify payment capture cryptographically on the server using HMAC-SHA256.
* Idempotent webhook handling with duplicate event rejection.
* Never commit passwords, private API keys, database credentials, or payment secrets.

---

## 🚀 Getting Started

### Prerequisites

Install **Node.js (v18+)**, **npm**, and **Git**.

### Installation

```bash
# Clone the repository
git clone https://github.com/Mannish2323/owlera.store.git
cd owlera.store

# Install dependencies
npm install
```

### Environment Configuration

Create a local `.env.local` file based on `.env.example`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_WEBHOOK_SECRET=YOUR_RAZORPAY_WEBHOOK_SECRET

# Store Metadata
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STORE_NAME=OWLERA
NEXT_PUBLIC_CURRENCY=INR
NEXT_PUBLIC_WHATSAPP_NUMBER=916305630468
```

> **Note:** Only configure variables that the codebase uses. Keep secret values private, and never commit `.env.local` to GitHub.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Quality & Testing Checks

Before deploying, run all verification and regression suites:

```bash
# 1. Run Automated Master Acceptance Test Suite (23/23 Tests)
node tests/master_acceptance.test.mjs

# 2. Run Next.js Production Build Verification (35/35 Routes)
npm run build
```

---

## 📁 Project Status

* **Status:** Feature Complete & Production Verified
* All 35 public and administrative routes, payment verification webhooks, and database schemas are implemented, tested, and passing with 100% test coverage.

---

## 🤝 Contributions

Contributions, suggestions, and improvements are welcome. Please review the existing code and discuss substantial changes before submitting a pull request.

---

## 📄 License

No open-source license is specified yet. All rights reserved unless a license is added to this repository.

---

**OWLERA** — *Quiet Elegance. Everyday Luxury.*