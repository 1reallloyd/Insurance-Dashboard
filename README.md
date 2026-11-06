# Insurance Analytics Pro (FY 2026)

> **Real-Time Actuarial Reserving, Claims Intelligence & Forensic Fraud Detection Engine**  
> *Currency Standard: Ghana Cedis (GH₵)*

---

## 1. What Is This Dashboard Doing? (In Plain English)

Imagine you run an insurance company in Ghana or manage a global multi-line insurance portfolio. Every day, policyholders pay premiums, and every day, accidents happen—car crashes, factory fires, storm-damaged roofs, and hospital surgical bills.

As an insurer, you have three major challenges:
1. **Paying legitimate claims promptly** while knowing exactly how much money you owe right now.
2. **Stopping fraudsters** who stage fake car crashes or inflate medical and property bills before money leaves the bank.
3. **Setting aside enough reserve money (solvency capital)** so that if a massive storm hits or prices inflate, your company has enough cash on hand to pay everyone and never goes bankrupt.

**Insurance Analytics Pro** is an all-in-one executive software dashboard built specifically to solve those three challenges. It connects live claims data, machine learning algorithms, and proven actuarial math (using Python) to give executives, lead actuaries, and claims examiners complete control over their insurance operations.

---

## 2. Key Capabilities at a Glance

- **Ghana Cedis (GH₵) Standard**: All financial values, claim sums, reserves, and deductible figures across the dashboard are calculated and presented in Ghana Cedis (`GH₵`).
- **Python-Powered Actuarial Suite**: Runs industry-standard actuarial reserving algorithms (Mack Chain-Ladder, Bornhuetter-Ferguson) and Monte Carlo stress testing in Python 3.
- **SIU Forensic Fraud Radar**: Automatically scans vehicle blackbox sensors (telematics), filing delays, and duplicate IDs to flag suspicious claims before payment.
- **One-Click Disbursement Freeze**: Instantly freezes fraudulent claims into a statutory lockbox so no unearned money is disbursed.
- **Custom Excel Template Download (.xlsx)**: Allows users to download a pre-formatted, 2-sheet Excel file with all columns and data dictionaries needed to upload their own datasets.

---

## 3. Walkthrough of Every Screen in the App

### 📊 1. Dashboard (Executive Overview)
- **Top Welcome Banner**: Displays system health and confirms that all 4 Python models are active and calculating in GH₵.
- **4 Key Performance Indicators (KPIs)**:
  - *Total Claims (2026)*: Number of active claims handled (e.g., 1,248 claims).
  - *Fraud Prevented (GH₵)*: Money saved by stopping fake or exaggerated claims (over **GH₵1.48 Million**).
  - *Predicted Claims (Nov 2026)*: Forecasted claim intake for the next month based on volume trends.
  - *Active Reserve Exposure*: Current estimated ultimate loss liability (**GH₵34.8 Million**).
- **Interactive Claims Distribution Chart (Doughnut)**: Shows what percentage of claims come from Auto (35%), Home (25%), Health (20%), Life (15%), or Business (5%). Clicking any category filters the entire dashboard.
- **7-Month Actuarial Development Chart (Bar Chart)**: Compares actual claims filed versus the actuarial models' predicted trajectory across FY 2026. Toggle between **Monthly**, **Weekly**, or **Quarterly** views.
- **Recent Forensic Activity**: Live stream showing real-time SIU alerts, batch loss-run ingestions, and model retraining logs.

---

### 📂 2. Upload Datasets
- **Purpose**: Upload historical loss runs, monthly claim spreadsheets, or telematics feeds to incorporate them into the actuarial engine.
- **Download Excel Template (.xlsx)**:
  - Located directly in the top action bar.
  - Generates and downloads an official Excel workbook (`actuarial_claims_template_ghs.xlsx`).
  - **Sheet 1 (`Claims_Template_GH₵`)**: Contains sample rows with real-world Ghanaian and international claims in GH₵.
  - **Sheet 2 (`Data_Dictionary`)**: Defines every column, valid data types, and formatting guidelines.
- **System Columns Specification Guide**: Shows the 15 exact column names used by the platform, highlighting required vs. optional fields.
- **Drag-and-Drop Uploader**: Accepts `.csv`, `.xlsx`, or `.parquet` files with live schema validation.
- **AI Dataset Loss Run Audit**: Analyzes ingested datasets using AI to check for missing values, distribution skews, and reserve adequacy recommendations.

---

### 📋 3. Claims Registry
- **Master Claims Table**: A clean, high-density register of every insurance claim in the system.
- **Columns Shown**:
  - *Claim ID* (e.g., `#CLM-1082`)
  - *Policyholder* (insured individual or company name)
  - *Policy Line* (Auto Collision, Commercial Fire, Health, Homeowners, Life, etc.)
  - *Incident Year / Date* (e.g., `2026-10-18`)
  - *Incurred Amount (GH₵)* (highlighted in rose if exceeding high-severity thresholds)
  - *Fraud Risk Score* (color-coded badge from 0% to 100%)
  - *Status* (Approved, Review, Flagged, Frozen)
  - *Actions* (Quick-inspect or Freeze buttons)
- **Status Filter Tabs**: Easily filter between *All Claims*, *Pending Review*, *Approved*, or *Flagged / Frozen*.
- **Interactive Claim Modal**: Clicking any claim opens a detailed file view:
  - Full financial details (Gross Claim Amount in GH₵, Policy Deductible in GH₵).
  - Telematics driving score (if vehicle telemetry was active).
  - Full accident narrative and triggered red flag tags.
  - **AI Forensic Analysis**: An AI report summarizing key risks and statutory EUO (Examination Under Oath) guidance.
  - **Interactive Adjuster Copilot**: An interactive Q&A assistant where examiners can ask questions about the claim file and receive legal and procedural guidance.

---

### 🚨 4. Forensic Radar (SIU Special Investigation Unit)
- **Purpose**: The front line against insurance fraud rings and organized crime.
- **Live Syndicate Threat Scanner**: An AI-powered scanner identifying staged collisions, duplicate VIN utilization, unbundled medical billing clinic fraud, and transponder ignition key anomalies.
- **Metrics**: Displays total loss prevention savings (**GH₵1.48M**) and active syndicate rings intercepted.
- **Instant Freeze Action**: Allows investigators to click **"Freeze Payout"** on any flagged claim to instantly halt payments and record an immutable audit trail entry.

---

### 🔮 5. Prediction & Scenario Forecaster
- **Purpose**: Helps insurance executives look into the future and ask: *"What happens to our money if severe weather strikes or inflation skyrockets?"*
- **Interactive Macroeconomic Stress Controls**:
  - *Weather Catastrophe Severity Index* (from 0.5x calm to 3.0x catastrophic storms).
  - *Medical & Auto Parts Inflation Rate* (from 1.0% to 15.0% price surge).
  - *Policy Exposure Growth* (from -10% runoff to +30% aggressive expansion).
- **Stochastic Monte Carlo Engine Outputs (in GH₵)**:
  - *Simulated Loss Incurred*: Expected aggregate loss under the specified stress scenario.
  - *Projected Claim Intake Frequency*: Estimated number of claims for the coming month.
  - *Solvency II SCR Buffer*: Recommends the exact liquid capital retention (e.g., GH₵41.5M) required to remain fully solvent under NAIC / Solvency II standards.
- **AI Actuarial Stress Assessment**: Generates executive commentary assessing whether catastrophic excess-of-loss (XOL) reinsurance treaty retention layers will be breached.

---

### 📄 6. Reports Repository
- **Purpose**: Download certified actuarial reports, regulatory board presentations, and solvency summaries.
- **Available Reports**:
  - *Q3 2026 Actuarial Solvency Report*
  - *Fraud Interception & SIU Audit Deck*
  - *Loss Triangulation Matrix & IBNR Reserve Schedule*
  - *ORSA (Own Risk and Solvency Assessment) Summary*
  - *Line of Business Profitability Ledger*
- **Flexible Formats**: Exportable in one click as certified PDF or CSV files.

---

### ⚙️ 7. Settings & Python Engine Diagnostics
- **Configurable Operational Parameters**:
  - *Fraud Auto-Flagging Sensitivity*: Choose between 65% (Sensitive), 75% (Standard), or 85% (Strict).
  - *Live Telematics Sync*: Toggle real-time IoT blackbox streaming.
  - *Actuarial Triangulation Method*: Select between Mack Chain-Ladder, Bornhuetter-Ferguson, or Cape Cod.
  - *Statutory Solvency Buffer*: Adjust capital cushion percentage (10%, 15%, or 20%).
- **Live Python Actuarial Engine Status**: Shows all 4 backend Python models and confirms they are operational and calculating in Ghana Cedis (`GH₵`).

---

### ❓ 8. Help & Actuarial IT Support
- **Knowledge Base & FAQ**: Answers common questions about ISO 20022 formats, Solvency II metrics, and fraud scoring.
- **Direct Ticket Submission**: Form allowing examiners to log claims discrepancy tickets with a 2-hour SLA response time.

---

## 4. The 4 Python Actuarial Models Explained Simply

Behind the user interface is a Python 3 engine (`/python_models/actuarial_models.py`). Here is what each model does in plain English:

### Model 1: Mack Chain-Ladder Reserving Model (`PY-ACT-001`)
- **What problem does it solve?** When an accident happens in October, the insurer might not get the final hospital or repair bill until months or years later. The company needs to reserve money today for bills that haven't arrived yet—known as **IBNR (Incurred But Not Reported)** reserves.
- **How it works**: It organizes historical losses into a triangle by accident year and development year. It calculates volume-weighted development factors ($f_k$) to project the final ultimate loss and calculates the exact amount of IBNR reserve needed in GH₵.

### Model 2: Bornhuetter-Ferguson Credibility Engine (`PY-ACT-002`)
- **What problem does it solve?** For volatile lines with few claims but massive payouts (such as warehouse fires or commercial marine insurance), the regular Chain-Ladder method can swing wildly.
- **How it works**: It blends historical claims experience with an a-priori Expected Loss Ratio (ELR) based on earned premium. This produces smooth, stable reserves that prevent sudden financial shocks.

### Model 3: Forensic Telematics & Fraud Anomaly Detector (`PY-ML-003`)
- **What problem does it solve?** Fake accidents and inflated losses cost insurance companies billions every year.
- **How it works**: It evaluates every claim on multiple dimensions:
  - *Telematics Divergence*: Does the driver's phone/vehicle sensor match the claimed crash impact speed?
  - *Reporting Delay*: Did the claimant wait 3 weeks before reporting a simple dent?
  - *Severity Deviation*: Is the claimed amount in GH₵ a statistical outlier for that line of business?
  - *Red Flag Tags*: Are there traces of accelerants, unbundled medical codes, or duplicate VINs?
  - *Output*: Computes a calibrated fraud risk score from 0% to 100% and recommends whether to approve, inspect, or freeze.

### Model 4: Compound Poisson-Gamma Solvency Simulator (`PY-STOCH-004`)
- **What problem does it solve?** Regulators (like the National Insurance Commission or NAIC) require insurers to prove they can survive a "1-in-200-year" catastrophe.
- **How it works**: It runs a **5,000-iteration Monte Carlo simulation**:
  - Frequency of accidents is modeled using a Poisson distribution.
  - Severity of each loss is modeled using a Gamma distribution.
  - It calculates the **99.5% Value-at-Risk ($VaR_{99.5\%}$)** and **Solvency Capital Requirement (SCR in GH₵)**, checking if reinsurance treaty attachment limits ($GH₵40.0M$) will be pierced.

---

## 5. Dataset Columns Reference (15 Standard Columns)

When uploading claim spreadsheets into the system (or downloading the Excel template), the following 15 columns are used:

| Column Name | Type | Required? | Plain English Meaning | Example Value |
|:---|:---:|:---:|:---|:---|
| `claim_id` | Text | **Yes** | Unique claim reference number | `CLM-2026-001` |
| `claimant_name` | Text | **Yes** | Policyholder or company name | `Kwame Mensah` |
| `policy_number` | Text | **Yes** | Insurance policy contract code | `POL-AUTO-2026-8812` |
| `line_of_business` | Text | **Yes** | Branch of insurance | `Auto Collision` |
| `claim_amount_ghs` | Number | **Yes** | Total claimed amount in Ghana Cedis | `18500` |
| `deductible_ghs` | Number | **Yes** | Policyholder out-of-pocket share in GH₵ | `1500` |
| `incident_date` | Date | **Yes** | Date the accident/loss occurred | `2026-10-18` |
| `filing_date` | Date | **Yes** | Date the claim was reported | `2026-10-19` |
| `jurisdiction` | Text | No | Region or city where loss occurred | `Greater Accra, Ghana` |
| `telematics_score` | Number | No | Vehicle IoT driving rating (0–100) | `72` |
| `fraud_risk_score` | Number | No | Pre-computed fraud risk rating (0–100) | `22` |
| `status` | Text | No | Current status (`Approved`, `Review`, `Flagged`, `Frozen`) | `Review` |
| `assigned_adjuster` | Text | No | Lead claims examiner assigned | `Emmanuel Addo` |
| `incident_description` | Text | No | Plain-text summary of the incident | `Side bumper contact at interchange` |
| `red_flags` | Text | No | Semicolon-delimited fraud warnings | `Telematics speed delta` |

---

## 6. Technology Architecture

```
[ Frontend: React 19 + TypeScript + Tailwind CSS ]
         |
         | (HTTP / JSON API)
         v
[ Full-Stack Server: Node.js + Express (server.ts) on Port 3000 ]
    |                    |                         |
    | (child_process)    | (XLSX Workbook Stream)  | (Gemini AI SDK)
    v                    v                         v
[ Python 3 Engine ]  [ Excel Template ]       [ Gemini 3.8 Flash ]
  • Mack Chain-Ladder   • Claims_Template       • Forensic Reports
  • Bornhuetter-Ferg.   • Data_Dictionary       • Copilot Q&A
  • Telematics Radar                            • Loss Run Audits
  • Poisson-Gamma VaR
```

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Chart.js.
- **Backend API**: Node.js with Express 4, serving REST endpoints and Vite middleware.
- **Actuarial Modeling**: Pure Python 3 (`python_models/actuarial_models.py`) executing ASTIN mathematical algorithms in milliseconds.
- **Spreadsheet Engine**: SheetJS (`xlsx`) for bidirectional Excel file generation and parsing.
- **AI Intelligence**: Google GenAI SDK (`@google/genai`) using `gemini-3.8-flash` with built-in actuarial rule fallbacks.

---

## 7. How to Start the Application

The application runs as a standard Node.js full-stack service on port `3000`:

```bash
# 1. Install dependencies
npm install

# 2. Start the development server (runs Express + Vite + Python integration)
npm run dev
```

Visit `http://localhost:3000/` in your browser. All models and features will be immediately active and ready for exploration.
