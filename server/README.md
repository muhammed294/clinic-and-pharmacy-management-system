# Clinic and Pharmacy Management System

A backend system built to digitize and streamline the daily operations of a clinic and its pharmacy — from patient registration through doctor consultation, laboratory testing, payments, and medicine sales.

Built as a portfolio project with the goal of eventually supporting real clinic operations in Ethiopia.

---

## 1. What This System Does

**Clinic Side**
- Registers patients once (via a unique card number) and tracks every visit they make afterward.
- Routes each visit to the correct doctor — children, adult, or emergency — matching how the clinic actually operates today.
- Records vitals (weight, temperature, etc.) before a doctor sees the patient.
- Lets doctors keep digital prescription records for their own reference.
- Manages the full lab workflow: doctor requests a test → patient pays → lab technician runs the test → result is sent back to the doctor — with the system automatically tracking status at every step.

**Pharmacy Side**
- Manages medicine inventory in batches, so expiry dates can be tracked.
- Automatically reduces stock when a sale is made — no manual stock adjustment needed.
- Automatically calculates sale totals as items are added — no manual math, no room for error.
- Flags any medicine that has dropped below its minimum stock threshold, so restocking never gets missed.

**Payments & Reporting**
- Every payment — clinic registration, lab fees, and pharmacy sales — is recorded with both the amount and how it was paid (cash or mobile banking like Telebirr, CBE Birr, or BOA).
- Daily, weekly, and monthly sales and revenue can be reported on-screen, broken down by payment method and payment type.

---

## 2. Why This Matters for the Clinic

| Problem Today | How This System Helps |
|---|---|
| Paper records get lost, damaged, or are hard to search | All patient, visit, and payment history is stored digitally and instantly searchable |
| Hard to know exactly how much medicine is in stock, or what's about to run out | Real-time stock tracking with automatic low-stock alerts |
| No easy way to see daily/weekly cash vs. mobile banking totals | Built-in reporting split by payment method and type |
| Lab test payment and approval can be missed or forgotten | Payment approval is directly linked to the lab request — nothing falls through the cracks |
| Any staff member could potentially access sensitive records | Login-protected system — only authenticated staff can access patient or financial data |

---

## 3. How a Patient Moves Through the System

```
Patient arrives
      │
      ▼
Card Office (new or returning patient, checked by card number)
      │
      ▼
Vitals check (weight, temperature)
      │
      ▼
Routed to the right doctor: Children / Adults / Emergency
      │
      ├── Doctor writes a prescription (kept for doctor's own record)
      │
      └── Doctor may request a lab test
                │
                ▼
          Patient pays lab fee at Card Office
                │
                ▼
          Card Officer approves payment
                │
                ▼
          Lab technician runs the test and enters the result
                │
                ▼
          Result is automatically marked ready and sent back to the doctor
```

*Emergency patients skip the Card Office on arrival and are seen immediately — payment is collected afterward.*

The Pharmacy operates independently: a pharmacist can sell any medicine directly, without needing a patient visit record.

---

## 4. Technology Used

| Layer | Technology |
|---|---|
| Server | Node.js + Express |
| Database | MySQL |
| Database access | Raw SQL via `mysql2` (no ORM — built this way intentionally, to build strong fundamentals rather than relying on a framework) |
| Authentication | JWT (JSON Web Tokens) + bcrypt password hashing |
| API Testing | Thunder Client |

**Why no ORM?** This was a deliberate choice. Writing raw SQL means every query, every relationship, and every transaction was understood and built by hand — not generated automatically. This makes the system easier to debug, easier to optimize, and easier to explain to anyone reviewing it.

---

## 5. Security

- **No plain-text passwords, ever.** All passwords are hashed with bcrypt before being stored — even if the database were somehow exposed, actual passwords could not be recovered from it.
- **Login-protected system.** Every part of the system requires a valid login token, except the login screen itself. Staff cannot view or modify any patient, clinic, or financial data without first signing in.
- **Session tokens expire automatically** after 8 hours, limiting how long access remains valid after a shift ends.
- **Data integrity is enforced at the database level**, not just in the application — for example, the system will not allow a sale to reference a medicine that doesn't exist, or a payment to be linked to the wrong patient visit.

---

## 6. Reliability: Transactions

Certain operations in this system involve multiple steps that must all succeed together, or not happen at all — for example, selling a medicine involves recording the sale, reducing stock, and updating the total price at the same time.

This system uses **database transactions** for these operations, meaning:

- If every step succeeds, all changes are saved together.
- If *any* step fails partway through, **all changes are automatically undone** — the database is never left in a half-updated, inconsistent state.

This applies to:
- Recording a pharmacy sale item (updates stock and sale total together)
- Recording a lab result (automatically updates the related lab request's status)
- Approving a payment (automatically updates the related lab request's payment status)

---

## 7. Current Status

- ✅ Full Pharmacy module (Medicine, Stock, Sales, Sale Items) — complete, tested
- ✅ Full Clinic module (Patients, Doctors, Visits, Vitals, Prescriptions, Lab Requests, Lab Results, Payments) — complete, tested
- ✅ User accounts, login, and role-based access — complete, tested
- 🔲 Frontend interface — planned next
- 🔲 Role-based permission restrictions (e.g., only admins can remove staff accounts) — planned

---

## 8. What's Next

1. Build a simple, staff-friendly frontend interface for each role (Card Officer, Doctor, Lab Technician, Pharmacist, Admin).
2. Add refined permissions so each staff role only sees and does what's relevant to their job.
3. Pilot the system on a local machine at the clinic with real (anonymized) workflows before any full rollout.

---

*This system was built independently as a learning project, with the long-term goal of supporting real day-to-day clinic operations.*
