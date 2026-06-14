# LCRI: Logistics Cold-Chain Risk Index Calculator

An AI-powered decision support dashboard for pharmaceutical cold-chain logistics.

LCRI (Logistics Cold-Chain Risk Index) evaluates shipment integrity in real time by combining environmental conditions, transit disruptions, and vehicle health into a single actionable risk score.

The platform is designed to support pharmaceutical distributors, cold-chain operators, hospitals, and logistics teams responsible for temperature-sensitive products such as vaccines, biologics, insulin, and specialty medicines.

---

# Overview

Maintaining pharmaceutical products within approved temperature ranges during transportation is critical for product efficacy and patient safety.

Traditional logistics platforms provide monitoring and tracking but often fail to predict risks before cold-chain failures occur.

LCRI addresses this challenge by calculating a composite operational risk score using real-time shipment telemetry, environmental data, and transit conditions.

---

# Key Features

## Real-Time Risk Scoring

Calculate a unified Logistics Cold-Chain Risk Index (LCRI) between 0 and 100.

---

## Temperature Risk Analysis

Monitor cold-chain compliance for pharmaceutical shipments.

Supports:

* Refrigerated transport
* Vaccine distribution
* Biologics transportation
* Specialty medicine logistics

---

## Traffic Risk Monitoring

Evaluate:

* Congestion levels
* Route delays
* Route deviations
* Estimated arrival disruptions

---

## Weather Risk Assessment

Analyze:

* Ambient temperature
* Humidity
* Rainfall
* Storm conditions
* Heatwave exposure

---

## Vehicle Health Monitoring

Evaluate:

* Refrigeration unit performance
* Engine health
* Battery condition
* Backup cooling availability

---

## Decision Support Engine

Translate risk scores into actionable operational recommendations.

---

## Interactive Dashboard

Features:

* Live risk visualization
* Risk factor breakdown
* Operational recommendations
* Preset simulation scenarios

---

# Mathematical Model

The Logistics Cold-Chain Risk Index (LCRI) is calculated using a weighted composite scoring framework.

```math
LCRI =
(Temp_R × 0.40)
+
(Traffic_R × 0.25)
+
(Weather_R × 0.20)
+
(Vehicle_R × 0.15)
```

Where:

| Factor           | Weight |
| ---------------- | ------ |
| Temperature Risk | 40%    |
| Traffic Risk     | 25%    |
| Weather Risk     | 20%    |
| Vehicle Risk     | 15%    |

---

# Risk Components

## Temperature Risk

Primary cold-chain compliance factor.

Examples:

| Condition | Risk |
| --------- | ---- |
| 2–8°C     | 0    |
| 8–10°C    | 30   |
| 10–15°C   | 70   |
| >15°C     | 100  |

---

## Traffic Risk

Based on:

* Congestion severity
* ETA deviation
* Route complexity
* Delay probability

---

## Weather Risk

Based on:

* Heat exposure
* Humidity
* Storm conditions
* Environmental volatility

---

## Vehicle Risk

Based on:

* Refrigeration performance
* Fuel level
* Battery health
* Maintenance indicators

---

# Decision Framework

| Score Range | Status                   | Recommended Action                       |
| ----------- | ------------------------ | ---------------------------------------- |
| 0 – 25      | 🟢 Safe                  | Continue transit                         |
| 26 – 50     | 🟡 Monitor               | Increase monitoring frequency            |
| 51 – 75     | 🟠 Intervention Required | Evaluate rerouting and contingency plans |
| 76 – 100    | 🔴 Critical              | Immediate operational intervention       |

---

# Example Interpretation

```text
Shipment ID: PH001

Temperature Risk: 70
Traffic Risk: 60
Weather Risk: 40
Vehicle Risk: 20

LCRI Score: 56.5
```

Result:

🟠 Intervention Required

Recommended Action:

* Evaluate alternate routes
* Increase telemetry monitoring
* Inspect refrigeration system

---

# Tech Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* Lucide React

## Backend (Future)

* FastAPI
* PostgreSQL
* Redis

## Analytics

* Pandas
* Scikit-Learn
* XGBoost

## AI Layer

* Gemini API
* Google AI Studio

---

# Installation

## Prerequisites

```bash
Node.js >= 18
npm >= 9
```

## Install Dependencies

```bash
npm install
npm install lucide-react
```

## Run Development Server

```bash
npm run dev
```

---

# Project Structure

```text
src/
│
├── components/
│   └── LCRICalculator.tsx
│
├── utils/
│   └── lcriMath.ts
│
├── data/
│   └── presets.ts
│
├── styles/
│
└── App.tsx
```

---

# Future Roadmap

## Phase 1

* Core LCRI calculator
* Risk classification engine
* Dashboard visualizations

## Phase 2

* Weather API integration
* Traffic API integration
* GPS telemetry ingestion

## Phase 3

* AI-powered shipment explanations
* Predictive risk forecasting
* Alert recommendation engine

## Phase 4

* Digital Twin simulation
* Compliance reporting
* Multi-shipment fleet management

---

# Research Applications

This project can be used for:

* Pharmaceutical cold-chain logistics
* Vaccine transportation monitoring
* Supply chain risk analysis
* Predictive logistics research
* Digital twin experimentation

---

# Disclaimer

This software is intended for research, educational, and prototype development purposes.

The calculated LCRI score should not be used as the sole basis for regulatory, safety, or operational decisions without independent validation and domain expert review.

---

# License

MIT License

Copyright (c) 2026
