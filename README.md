# VendorVerse 🇮🇳
**The Operating System for India's 12 Million Street Vendors.**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Stack](https://img.shields.io/badge/stack-MERN%20%2B%20UPI-orange)

> **"Organized retail has Starbucks Rewards. Unorganized retail has... nothing. Until now."**

VendorVerse is the **first UPI-native loyalty SaaS** designed specifically for the Indian informal economy—from the Dadar Vada Pav stall to the Bangalore Chai point. We leverage the existing UPI infrastructure to automate customer retention without requiring any behavior change from the merchant or the customer.


## 📑 Investment & Strategy Documentation

We have compiled detailed research and planning documents for co-founders, investors, and technical architects:

*   **📈 [Business Plan & Investment Memo](BUSINESS_PLAN.md)**
    *   *Executive Summary, Revenue Model, Unit Economics (CAC/LTV), and 3-Year Projections.*
*   **⚔️ [Market Research & Competitive Landscape](MARKET_RESEARCH.md)**
    *   *Deep dive into the ₹41 Billion street food market, competitor quadrant (Reelo vs. Khatabook vs. Us), and our "Zero-UI" Moat.*
*   **🏗 [Technical Architecture & Roadmap](TECHNICAL_ARCHITECTURE.md)**
    *   *System design, UPI Webhook event flow, Privacy/Data Localization (RBI Compliance), and Scalability.*

---

## 💡 The "Zero-UI" Innovation

The biggest failure of previous SaaS attempts for street vendors was demanding **time** and **literacy**.
*   *Competitors* require: iPads, Phone number entry, App downloads, POS integration.
*   *VendorVerse* requires: **Nothing.**

**The Flow:**
1.  Customer scans vendor's **existing** Paytm/PhonePe QR.
2.  Payment Gateway triggers a server-side webhook to VendorVerse.
3.  VendorVerse identifies the user via VPA (Virtual Payment Address).
4.  Points are auto-credited.
5.  Customer receives a WhatsApp/SMS with "You earned 10 points! Free Chai next visit."

**Vendor Effort: 0%. Customer Effort: 0%. Retention: 100%.**

---

## 🛠 Tech Stack

*   **Frontend:** React 19, TypeScript, Tailwind CSS (Mobile-First, Vernacular UI).
*   **Backend (Simulated):** Node.js logic, Webhook Event Bus.
*   **Database:** PostgreSQL (Schema optimized for high-concurrency writes).
*   **Integrations:** Razorpay/Cashfree Webhooks, WhatsApp Business API.

## 🚀 Quick Start (Local Dev)

1.  **Clone & Install**
    ```bash
    git clone https://github.com/yourusername/vendorverse.git
    npm install
    ```

2.  **Environment Setup**
    Create a `.env` file (see `.env.example`) for mock gateway keys.

3.  **Run Development Server**
    ```bash
    npm start
    ```
    Open `http://localhost:3000` to view the Vendor Dashboard.

---

## 📱 Product Demo

### 1. Vendor Dashboard (The "Dhanda" View)
Designed for low-digital literacy. High contrast. Hinglish support.
*   **Metric Focus:** "Aaj ki Kamai" (Today's Earnings) vs "Total Revenue".
*   **Action:** One-tap QR generation.

### 2. The Loop
*   Simulate a transaction using the **"Test Payment"** button in the dashboard.
*   Watch real-time updates to the customer ledger and analytics.

---

## 🔮 Roadmap

| Phase | Milestone | KPI Target |
|-------|-----------|------------|
| **Q1 2025** | **Hyper-Local Pilot** (Dadar/Mumbai) | 100 Active Vendors |
| **Q2 2025** | **WhatsApp Integration** | 50k Monthly Txns |
| **Q3 2025** | **Lending Layer** (Data-backed micro-loans) | ₹1Cr Disbursal |
| **Q4 2025** | **Aggregator Network** (Coalition Loyalty) | 10k Vendors |

---

*VendorVerse is a tribute to the entrepreneurial spirit of India's streets.* 🇮🇳
