---
name: owlera-production-qa
description: >-
  Executes automated quality assurance, master acceptance tests, typechecking, Next.js build verification,
  linting, and regression tests for OWLERA with strictly honest failure reporting.
  Activate when validating code changes, preparing pull requests, running test suites, or verifying production readiness.
---

# OWLERA Production QA & Verification Suite

This skill enforces rigorous quality control, test execution, build checks, and honest diagnostic reporting for the **OWLERA** codebase.

---

## 1. Prime Directive: Honest & Uncompromising Reporting

- **Zero Fabrication Rule:** NEVER report that a test passed unless you executed the command and observed an exit code of `0`.
- **Transparent Failure Reporting:** If a test fails, report the exact test number, assertion message, stack trace, and failing condition. Never suppress or hide errors.
- **Never Modify Tests to Fake Passes:** Never comment out assertions, remove test cases, or lower thresholds in `tests/` just to get a green test run.
- **No Production Deployments:** Do not trigger production deployments (`vercel --prod`, git pushes to production branches) as part of QA tasks.

---

## 2. QA Verification Commands

Run the suite sequentially. If a step fails, stop, diagnose, and resolve the root cause before proceeding.

### Step 1: Master Automated Acceptance Test Suite (23 Tests)
Validates core e-commerce business logic, price formatting, shipping calculations, coupon discounts, PIN validation, and Razorpay HMAC-SHA256 signature verification.

```bash
node tests/master_acceptance.test.mjs
```

**Expected Result:** `✓ 23/23 Tests Passed` (Exit Code 0).

### Step 2: Functional Test Suite
Verifies route handlers, API payloads, and cart state transitions:

```bash
node tests/functional.test.mjs
```

### Step 3: TypeScript Compilation & Type Safety
Verifies that all components, props, hooks, and API routes strictly conform to TypeScript definitions with zero type errors:

```bash
npx tsc --noEmit
```

**Expected Result:** Clean exit with no errors.

### Step 4: Next.js Production Build Verification
Verifies that all 35 public and administrative routes build cleanly, static pages generate without hydration mismatch, and server components compile:

```bash
npm run build
```

**Expected Result:** Successfully compiled client and server bundles; all routes listed as static (○) or dynamic (ƒ).

### Step 5: Code Linting
Checks for ESLint rules, unused imports, accessibility warnings, and formatting issues:

```bash
npm run lint
```

---

## 3. Route Coverage Verification (35 Routes)

Every production QA pass must ensure all 35 declared routes remain reachable and render without 404 or 500 runtime exceptions:

- **Storefront & Categories:** `/`, `/shop`, `/jewellery`, `/fashion`, `/lifestyle`, `/collections/[slug]`, `/products/[slug]`, `/search`
- **Customer Journey:** `/cart`, `/checkout`, `/order-success`, `/orders`, `/track-order`, `/wishlist`
- **Brand & Information:** `/about`, `/contact`, `/faq`
- **Compliance & Policies:** `/policies`, `/policies/terms`, `/policies/privacy`, `/policies/shipping`, `/policies/returns`, `/policies/refunds`, `/policies/cancellation`, `/policies/payment`
- **Administrative Control Panel:** `/admin`
- **API Endpoints:**
  - `/api/products`, `/api/products/[slug]`
  - `/api/checkout`, `/api/checkout/verify`, `/api/checkout/webhook`
  - `/api/orders/track`
  - `/api/newsletter`
  - `/api/admin/products`, `/api/admin/orders`
- **SEO & Metadata:** `/sitemap.xml` (`app/sitemap.ts`), `/robots.txt` (`public/robots.txt`)

---

## 4. Failure Triage Runbook

When a QA check fails:
1. **Assertion Failure:** Note the exact test name, expected vs actual values.
2. **Type Error (`tsc`):** Note the file path, line number, TypeScript error code (`TSxxxx`), and missing or mismatched types.
3. **Build Error (`next build`):** Inspect the module build error. Common causes: missing client directive (`"use client"`), missing environment variable in SSG page, or window/document reference in SSR context.
4. **Fix and Re-verify:** Apply minimal targeted fix and re-run ONLY the failed check, followed by the full suite to guarantee no regression.
