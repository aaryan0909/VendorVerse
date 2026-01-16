# Technical Architecture & System Design

## 1. High-Level Architecture

VendorVerse utilizes an **Event-Driven Architecture (EDA)** to handle the asynchronous nature of payment webhooks and ensure zero-latency for the end-user.

```mermaid
graph TD
    User[End User] -->|Pays via UPI| UPI_App[PhonePe/GPay]
    UPI_App -->|Transaction| PG[Payment Gateway (Razorpay)]
    
    PG -->|Webhook (JSON)| API_Gateway[VendorVerse API]
    
    subgraph "VendorVerse Backend"
        API_Gateway -->|Verify Signature| Auth_Service
        Auth_Service -->|Event: Payment.Success| Event_Bus[Redis Queue]
        
        Event_Bus -->|Worker 1| Loyalty_Engine[Points Calculator]
        Event_Bus -->|Worker 2| Notif_Service[WhatsApp/SMS]
        
        Loyalty_Engine -->|Write| DB[(PostgreSQL)]
    end
    
    Loyalty_Engine -->|Update| Vendor_Dash[Vendor Dashboard]
    Notif_Service -->|Message| User
```

---

## 2. Core Components

### A. The Ingestion Layer (Node.js + Express)
*   **Role:** Receives high-volume webhooks from Payment Gateways.
*   **Criticality:** Must respond with `200 OK` within 200ms to prevent webhook disablement by PG.
*   **Security:** HMAC SHA256 signature verification to prevent spoofed transactions.

### B. The Loyalty Engine (TypeScript)
*   **Logic:**
    1.  Extract `VPA` (e.g., `rahul@okhdfcbank`).
    2.  Normalize VPA to Phone Number (via internal mapping or Account Aggregator API).
    3.  Lookup Vendor rules (e.g., `1 Point = ₹10`).
    4.  Calculate Tier upgrades (Bronze -> Silver).

### C. Database Schema (PostgreSQL on Supabase)
We use a relational model with heavy indexing on `vendor_id` and `customer_phone`.

```sql
-- Partitioned Transactions Table for Scale
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    vendor_id UUID REFERENCES vendors(id),
    customer_vpa VARCHAR(255) INDEXED,
    amount DECIMAL(10,2),
    metadata JSONB, -- Stores PG raw data
    created_at TIMESTAMP DEFAULT NOW()
) PARTITION BY RANGE (created_at);
```

---

## 3. Data Privacy & Compliance (India Stack)

Since we handle financial metadata, compliance is paramount.
1.  **Data Localization:** All data stored in AWS Mumbai Region (ap-south-1).
2.  **PII Handling:** Customer phone numbers are hashed at rest. We only decrypt for notification dispatch.
3.  **Consent:** We utilize the "Transaction Consent" implied in the payment, but strictly adhere to DPDP Act 2023 guidelines (Data Purpose Limitation).

---

## 4. Scalability Roadmap

### Stage 1: MVP (0 - 10k Txns/Day)
*   **Infra:** Single Monolith on Vercel/Render.
*   **DB:** Managed Postgres (Supabase Free Tier).

### Stage 2: Growth (10k - 1M Txns/Day)
*   **Infra:** Microservices for `Notification` and `Ledger`.
*   **Queue:** Redis (BullMQ) for buffering webhooks during peak hours (6 PM - 9 PM).

### Stage 3: Scale (1M+ Txns/Day)
*   **Sharding:** Horizontal partitioning of Database by `Vendor_Region`.
*   **Edge:** Move read-heavy logic (Customer Balance Check) to Edge Functions to reduce latency.
