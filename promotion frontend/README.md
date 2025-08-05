🛒 Promotion Engine - Complete Technical Documentation
📘 Overview
A Promotion Engine is a flexible, scalable microservice designed to handle various types of discount rules (like percentage off, fixed discounts, buy X get Y, etc.) and apply them at the product, cart, or order level.
This document provides a complete guide for designing, building, and integrating the engine with any e-commerce platform (custom, Shopify, etc.).
________________________________________
📑 Table of Contents
1.	Introduction & Objective
2.	Promotion Types Supported
3.	Architecture Overview
4.	Database Schema
5.	Rule Definition Format
6.	Promotion Evaluation Flow
7.	Example Promotion Flows
8.	Backend API Endpoints
9.	Frontend Components
10.	Client Integration (Custom Apps)
11.	Custom Promotion Logic & Data Access
12.	Scalability & Flexibility Guidelines
13.	Setup Instructions (Start-to-End)
14.	Final Notes
________________________________________
1. 🎯 Objective
To create a configurable, plug-and-play promotion engine microservice which can:
•	Define and manage multiple types of promotions
•	Be embedded in different e-commerce applications
•	Support custom rules per client
________________________________________
2. 🎁 Types of Promotions Supported
Type	Description
Percentage Discount	10% off on product/cart/order
Fixed Discount	₹100 off on cart/order/product
Buy X Get Y Free	Buy 2 shirts, get 1 cap free
Buy X for ₹Y	Buy 3 items for ₹1000
Tiered Pricing	Buy 1 @ ₹500, Buy 3 @ ₹450 each
Time-bound Deals	Flash sales or promotions valid for a limited time
Category-Based	10% off only on Electronics
SKU-Based	₹200 off on SKU “APPLE_12PMAX”
First Time User	20% off on first purchase
Minimum Cart Value	₹500 off on cart > ₹5000
Payment Method Based	5% off using UPI or specific credit cards
User Segment Based	Offer for GOLD users only
Custom Promo Codes	Apply CODE10 for ₹100 off
Auto-Applied Rules	Auto discount based on cart total, date, user etc.
Combo Offers	Buy Shoes + Socks for ₹2000
________________________________________
3. 🏗️ Architecture Overview
•	Microservice-based (Node.js, Express)
•	Configurable JSON-based rules
•	Exposed via REST APIs
•	DB: PostgreSQL or MongoDB (via Prisma)
•	Integratable with any e-commerce frontend/backend
________________________________________
4. 🧱 Minimal & Scalable Database Schema
Designed with as few tables as possible for simplicity and flexibility
Tables:
•	promotions
id: string
name: string
type: enum (percentage, fixed, bxgy, etc.)
rule_json: JSON
start_date: Date
end_date: Date
is_active: boolean
client_id: string (multi-tenant)
created_by, updated_by: string
tags: string[]
•	clients
id: string
name: string
domain: string
api_key: string
metadata: JSON
•	applied_promotions
id: string
promotion_id: FK
order_id: string
client_id: FK
cart_snapshot: JSON
final_discount_amount: number
evaluated_at: Date
________________________________________
5. 🧠 Rule Definition Schema (JSON)
Flexible schema stored in rule_json
{
  "conditions": [
    { "field": "cart_total", "operator": ">", "value": 5000 },
    { "field": "user_segment", "operator": "=", "value": "GOLD" }
  ],
  "actions": [
    { "type": "percentage", "value": 10 }
  ]
}
•	Field types: cart_total, user_segment, payment_method, product_ids, etc.
•	Operators: =, !=, >, <, in, not_in
•	Action types: percentage, fixed, free_item, set_price
________________________________________
6. ⚙️ Promotion Evaluation Flow
1.	Client sends request to /evaluate endpoint with cart data
2.	Engine fetches active rules for the client
3.	Conditions are matched using rule engine
4.	If valid, action is applied and discount is returned
________________________________________
7. 🔁 Example Promotion Flow
Scenario: First-time buyer gets ₹500 off on ₹5000+
Backend Admin:
•	Create rule via POST /rules
{
  "client_id": "store_123",
  "name": "First Timer Deal",
  "type": "fixed",
  "rule_json": {
    "conditions": [
      { "field": "user.is_first_order", "operator": "=", "value": true },
      { "field": "cart.total", "operator": ">=", "value": 5000 }
    ],
    "actions": [
      { "type": "fixed", "value": 500 }
    ]
  }
}
Frontend (Cart Page):
•	On cart update, call /evaluate
POST /evaluate
{
  "client_id": "store_123",
  "user": { "id": "u1", "is_first_order": true },
  "cart": { "total": 5600, "items": [...] }
}
Response:
{
  "applied": true,
  "discount": 500,
  "new_total": 5100,
  "promotion_id": "promo_abc123"
}
Frontend:
•	Show: ✅ “₹500 Discount Applied - First Order!”
________________________________________
8. 🧩 Backend API Endpoints
🔧 Rule Management:
•	POST /rules - Create promotion rule
•	GET /rules - List all rules
•	GET /rules/:id - View rule
•	PUT /rules/:id - Update rule
•	DELETE /rules/:id - Soft delete
🔍 Evaluation:
•	POST /evaluate - Evaluate rules on cart
🛒 Apply Discount:
•	POST /apply - Save discount applied to cart/order
🔄 Webhooks:
•	POST /webhook/orders - Track post-order to store applied promotions
🔑 Authentication:
•	POST /auth/token - Issue token for clients
________________________________________
9. 🧩 Frontend Components
🛠 Admin Panel UI
•	Rule Builder Form
o	Conditions UI (dropdowns, values)
o	Action UI (discount type, value)
o	Preview section
•	Rules List View
•	Create/Edit Rule Page
🛍 Client Dashboard
•	Promotions List
•	Promotion Effect Analytics
•	Active vs Expired tab
⚡ Embedded Widget (Custom App/Shopify)
•	Discount Banner on Cart Page
•	Auto Apply on Checkout
•	Evaluation Trigger (AJAX call to /evaluate)
________________________________________
10. 📦 Integration (Custom App Clients)
Option 1: Client uses REST APIs
•	Send cart & user data to /evaluate
•	Apply discount using response
Option 2: SDK Wrapper
•	Provide JS SDK for frontend use:
PromoEngine.init({ clientId: 'store_123' });
PromoEngine.evaluate(cart, user).then(res => ...);
Option 3: Shopify App
•	Embedded via App Bridge & ScriptTag
•	Auto-call /evaluate on cart load
________________________________________
11. 🧠 Custom Promotions & Client-Specific Rules
•	Each promotion rule links to client_id
•	Rules can use client-specific metafields or tags
•	If client needs specific logic:
o	Add custom condition resolvers (via plugin/hook system)
o	Allow injection of external data in evaluation context
________________________________________
12. ⚖️ Flexibility & Scalability
•	Store rules in JSON = portable, versionable
•	Add custom resolvers for complex conditions
•	Multi-tenant via client_id
•	External webhook/event support
•	Allow caching for heavy cart evaluation logic
________________________________________
13. 🚀 Setup Instructions (End-to-End)
1.	Setup DB schema (3 tables: promotions, clients, applied_promotions)
2.	Build backend APIs using Node.js + Express + Prisma
3.	Build Admin UI (React or embed in Shopify app)
4.	Expose API to clients (secure via API keys)
5.	Clients send cart/user payload to /evaluate
6.	Apply discount on frontend via returned result
________________________________________
14. 📌 Final Notes
•	Keep rules readable and testable
•	Add admin testing mode for previewing rules
•	Log every rule evaluation for analytics
•	Provide fallback in case of failure
________________________________________
✅ This document serves as a blueprint to build a robust, reusable, plug-and-play Promotion Engine for any commerce platform.
