-- Demo-only seed data for the CBDC Clearing Engine.
-- Run after applying the schema:
--   pnpm --filter @workspace/db run push
--   pnpm --filter @workspace/db run seed
--
-- This intentionally resets the demo tables. Do not run it against a database
-- containing data that needs to be preserved.

BEGIN;

TRUNCATE TABLE
  activity,
  stress_results,
  transactions,
  fx_rates,
  liquidity_pools,
  corridors,
  nodes
RESTART IDENTITY CASCADE;

INSERT INTO nodes
  (currency, name, credibility, gdp, aml_risk, daily_vol_cap_m, status, color)
VALUES
  ('USD', 'FedNow Node', 0.99, 26.9, 0, 80000, 'operational', '#2563EB'),
  ('EUR', 'ECB Node', 0.97, 17.1, 0, 65000, 'operational', '#7C3AED'),
  ('GBP', 'BoE Node', 0.95, 3.1, 0, 35000, 'operational', '#0891b2'),
  ('INR', 'Digital Rupee', 0.85, 3.7, 0, 25000, 'operational', '#d97706'),
  ('SGD', 'MAS Node', 0.98, 0.5, 0, 15000, 'operational', '#dc2626'),
  ('CNY', 'e-CNY Node', 0.80, 17.7, 1, 45000, 'operational', '#be185d'),
  ('AED', 'CBUAE Node', 0.90, 0.5, 0, 20000, 'operational', '#059669');

INSERT INTO corridors
  (src_currency, tgt_currency, fx_rate, cost_bps, latency_s, liquidity_m, friction, pvp, status)
VALUES
  ('INR', 'USD', 0.01198, 12, 45, 8000, 0.10, true, 'active'),
  ('USD', 'INR', 83.5, 10, 40, 8000, 0.10, true, 'active'),
  ('USD', 'EUR', 0.92, 6, 20, 15000, 0.05, true, 'active'),
  ('EUR', 'USD', 1.087, 6, 20, 15000, 0.05, true, 'active'),
  ('USD', 'GBP', 0.79, 7, 22, 12000, 0.05, true, 'active'),
  ('GBP', 'USD', 1.266, 7, 22, 12000, 0.05, true, 'active'),
  ('USD', 'SGD', 1.34, 8, 25, 6000, 0.05, true, 'active'),
  ('SGD', 'USD', 0.746, 8, 25, 6000, 0.05, true, 'active'),
  ('USD', 'CNY', 7.24, 18, 60, 5000, 0.35, false, 'active'),
  ('CNY', 'USD', 0.138, 20, 65, 5000, 0.35, false, 'active'),
  ('USD', 'AED', 3.673, 9, 30, 4000, 0.08, true, 'active'),
  ('AED', 'USD', 0.272, 9, 30, 4000, 0.08, true, 'active'),
  ('EUR', 'GBP', 0.859, 5, 18, 10000, 0.04, true, 'active'),
  ('GBP', 'EUR', 1.164, 5, 18, 10000, 0.04, true, 'active'),
  ('EUR', 'SGD', 1.455, 9, 28, 5500, 0.06, true, 'active'),
  ('SGD', 'EUR', 0.687, 9, 28, 5500, 0.06, true, 'active'),
  ('EUR', 'CNY', 7.875, 19, 65, 4500, 0.38, false, 'active'),
  ('CNY', 'EUR', 0.127, 21, 70, 4500, 0.38, false, 'active'),
  ('EUR', 'AED', 3.993, 10, 35, 3500, 0.09, true, 'active'),
  ('AED', 'EUR', 0.25, 10, 35, 3500, 0.09, true, 'active'),
  ('GBP', 'SGD', 1.695, 10, 30, 4500, 0.07, true, 'active'),
  ('SGD', 'GBP', 0.59, 10, 30, 4500, 0.07, true, 'active'),
  ('GBP', 'CNY', 9.167, 22, 70, 3500, 0.40, false, 'active'),
  ('CNY', 'GBP', 0.109, 24, 75, 3500, 0.40, false, 'active'),
  ('INR', 'EUR', 0.011, 14, 50, 6000, 0.12, true, 'active'),
  ('EUR', 'INR', 91, 12, 48, 6000, 0.12, true, 'active'),
  ('INR', 'SGD', 0.016, 15, 55, 4000, 0.13, true, 'active'),
  ('SGD', 'INR', 62.4, 14, 52, 4000, 0.13, true, 'active'),
  ('CNY', 'SGD', 0.185, 17, 58, 2500, 0.30, false, 'active'),
  ('SGD', 'CNY', 5.41, 16, 55, 2500, 0.30, false, 'active');

INSERT INTO fx_rates
  (src_currency, tgt_currency, rate, ewma_vol, ar1_forecast, risk_score, regime)
VALUES
  ('USD', 'EUR', 0.92, 0.042, 0.043, 0.18, 'low'),
  ('USD', 'GBP', 0.79, 0.038, 0.039, 0.16, 'low'),
  ('USD', 'INR', 83.5, 0.085, 0.087, 0.42, 'medium'),
  ('USD', 'SGD', 1.34, 0.031, 0.032, 0.14, 'low'),
  ('USD', 'CNY', 7.24, 0.121, 0.125, 0.68, 'high'),
  ('USD', 'AED', 3.673, 0.028, 0.029, 0.12, 'low'),
  ('EUR', 'GBP', 0.859, 0.036, 0.037, 0.15, 'low'),
  ('EUR', 'INR', 91, 0.092, 0.094, 0.48, 'medium'),
  ('EUR', 'SGD', 1.455, 0.040, 0.041, 0.17, 'low'),
  ('EUR', 'CNY', 7.875, 0.128, 0.131, 0.72, 'high'),
  ('EUR', 'AED', 3.993, 0.033, 0.034, 0.14, 'low'),
  ('EUR', 'USD', 1.087, 0.042, 0.043, 0.18, 'low'),
  ('GBP', 'USD', 1.266, 0.038, 0.039, 0.16, 'low'),
  ('GBP', 'EUR', 1.164, 0.036, 0.037, 0.15, 'low'),
  ('GBP', 'INR', 105.4, 0.095, 0.097, 0.51, 'medium'),
  ('GBP', 'SGD', 1.695, 0.043, 0.044, 0.19, 'low'),
  ('GBP', 'CNY', 9.167, 0.132, 0.135, 0.75, 'high'),
  ('GBP', 'AED', 4.65, 0.037, 0.038, 0.16, 'low'),
  ('INR', 'USD', 0.01198, 0.085, 0.087, 0.42, 'medium'),
  ('INR', 'EUR', 0.011, 0.092, 0.094, 0.48, 'medium'),
  ('INR', 'GBP', 0.0095, 0.095, 0.097, 0.51, 'medium'),
  ('INR', 'SGD', 0.016, 0.078, 0.080, 0.39, 'medium'),
  ('INR', 'CNY', 0.0866, 0.145, 0.148, 0.82, 'high'),
  ('INR', 'AED', 0.044, 0.081, 0.083, 0.41, 'medium'),
  ('SGD', 'USD', 0.746, 0.031, 0.032, 0.14, 'low'),
  ('SGD', 'EUR', 0.687, 0.040, 0.041, 0.17, 'low'),
  ('SGD', 'GBP', 0.59, 0.043, 0.044, 0.19, 'low'),
  ('SGD', 'INR', 62.4, 0.078, 0.080, 0.39, 'medium'),
  ('SGD', 'CNY', 5.41, 0.118, 0.121, 0.65, 'high'),
  ('SGD', 'AED', 2.74, 0.035, 0.036, 0.15, 'low'),
  ('CNY', 'USD', 0.138, 0.121, 0.125, 0.68, 'high'),
  ('CNY', 'EUR', 0.127, 0.128, 0.131, 0.72, 'high'),
  ('CNY', 'GBP', 0.109, 0.132, 0.135, 0.75, 'high'),
  ('CNY', 'INR', 11.54, 0.145, 0.148, 0.82, 'high'),
  ('CNY', 'SGD', 0.185, 0.118, 0.121, 0.65, 'high'),
  ('CNY', 'AED', 0.508, 0.115, 0.118, 0.62, 'high'),
  ('AED', 'USD', 0.272, 0.028, 0.029, 0.12, 'low'),
  ('AED', 'EUR', 0.25, 0.033, 0.034, 0.14, 'low'),
  ('AED', 'GBP', 0.215, 0.037, 0.038, 0.16, 'low'),
  ('AED', 'INR', 22.73, 0.081, 0.083, 0.41, 'medium'),
  ('AED', 'SGD', 0.365, 0.035, 0.036, 0.15, 'low'),
  ('AED', 'CNY', 1.968, 0.115, 0.118, 0.62, 'high');

INSERT INTO liquidity_pools
  (currency, total_liquidity_b, available_liquidity_b, reserved_liquidity_b, utilization_pct, efficiency_score, status)
VALUES
  ('USD', 80, 62, 18, 22.5, 0.94, 'healthy'),
  ('EUR', 65, 48, 17, 26.2, 0.91, 'healthy'),
  ('GBP', 35, 27, 8, 22.9, 0.93, 'healthy'),
  ('INR', 25, 14, 11, 44, 0.78, 'high_utilization'),
  ('SGD', 15, 8.5, 6.5, 43.3, 0.82, 'high_utilization'),
  ('CNY', 45, 18, 27, 60, 0.71, 'critical'),
  ('AED', 20, 15, 5, 25, 0.89, 'healthy');

INSERT INTO transactions
  (tx_hash, src_currency, tgt_currency, amount, amount_converted, purpose_code, entity_type, status, route, cost_bps, latency_s, fx_risk_score, compliance_score, composite_score, block_hash, prev_block_hash, created_at, settled_at)
VALUES
  ('0xabc1234567890', 'INR', 'USD', 835000000, NULL, 'Trade Settlement (T1)', 'Tier 1 Commercial Bank', 'SETTLED', 'INR → USD', 12, 45, 0.42, 0, 0.312, '0xblock001', NULL, '2026-05-22 04:29:15+00', '2026-05-22 04:24:15+00'),
  ('0xdef9876543210', 'USD', 'EUR', 5000000, NULL, 'Investment (I1)', 'Central Bank', 'SETTLED', 'USD → EUR', 6, 20, 0.18, 0, 0.168, '0xblock002', '0xblock001', '2026-05-22 04:29:15+00', '2026-05-22 04:25:15+00'),
  ('0xghi1122334455', 'EUR', 'GBP', 2500000, NULL, 'Trade Settlement (T1)', 'Tier 1 Commercial Bank', 'SETTLED', 'EUR → GBP', 5, 18, 0.15, 0, 0.142, '0xblock003', '0xblock002', '2026-05-22 04:29:15+00', '2026-05-22 04:26:15+00'),
  ('0xjkl5566778899', 'USD', 'SGD', 1200000, NULL, 'Remittance (R1)', 'Retail', 'SETTLED', 'USD → SGD', 8, 25, 0.14, 0, 0.158, '0xblock004', '0xblock003', '2026-05-22 04:29:15+00', '2026-05-22 04:27:15+00'),
  ('0xmno1020304050', 'GBP', 'INR', 3800000, NULL, 'Trade Settlement (T1)', 'Tier 1 Commercial Bank', 'SETTLED', 'GBP → USD → INR', 17, 85, 0.51, 0, 0.445, '0xblock005', '0xblock004', '2026-05-22 04:29:15+00', '2026-05-22 04:28:00+00'),
  ('0xpqr6070809000', 'SGD', 'EUR', 900000, NULL, 'Investment (I1)', 'Central Bank', 'SETTLED', 'SGD → USD → EUR', 14, 45, 0.17, 0, 0.201, '0xblock006', '0xblock005', '2026-05-22 04:29:15+00', '2026-05-22 04:28:45+00'),
  ('0xstu1234560000', 'AED', 'USD', 2200000, NULL, 'Trade Settlement (T1)', 'Tier 1 Commercial Bank', 'SETTLED', 'AED → USD', 9, 30, 0.12, 0, 0.138, '0xblock007', '0xblock006', '2026-05-22 04:29:15+00', '2026-05-22 04:29:00+00'),
  ('0xvwx9999888777', 'INR', 'EUR', 1500000, NULL, 'Trade Settlement (T1)', 'Tier 1 Commercial Bank', 'SETTLED', 'INR → USD → EUR', 18, 65, 0.48, 0, 0.378, '0xblock008', '0xblock007', '2026-05-22 04:29:15+00', '2026-05-22 04:29:10+00');

INSERT INTO activity
  (type, message, src_currency, tgt_currency, amount, status, tx_hash, timestamp)
VALUES
  ('settlement', 'INR → USD settled via direct corridor', 'INR', 'USD', 835000000, 'SETTLED', '0xabc1234567890', '2026-05-22 04:29:37+00'),
  ('settlement', 'USD → EUR settled via direct corridor', 'USD', 'EUR', 5000000, 'SETTLED', '0xdef9876543210', '2026-05-22 04:29:37+00'),
  ('settlement', 'EUR → GBP settled via direct corridor', 'EUR', 'GBP', 2500000, 'SETTLED', '0xghi1122334455', '2026-05-22 04:29:37+00'),
  ('settlement', 'USD → SGD settled via direct corridor', 'USD', 'SGD', 1200000, 'SETTLED', '0xjkl5566778899', '2026-05-22 04:29:37+00'),
  ('settlement', 'GBP → USD → INR multi-hop settled', 'GBP', 'INR', 3800000, 'SETTLED', '0xmno1020304050', '2026-05-22 04:29:37+00'),
  ('settlement', 'SGD → USD → EUR multi-hop settled', 'SGD', 'EUR', 900000, 'SETTLED', '0xpqr6070809000', '2026-05-22 04:29:37+00'),
  ('settlement', 'AED → USD settled via direct corridor', 'AED', 'USD', 2200000, 'SETTLED', '0xstu1234560000', '2026-05-22 04:29:37+00'),
  ('settlement', 'INR → USD → EUR multi-hop settled', 'INR', 'EUR', 1500000, 'SETTLED', '0xvwx9999888777', '2026-05-22 04:29:37+00');

INSERT INTO stress_results
  (scenario, trials, success_rate, var_cost, avg_latency_s, resilience_score, baseline_success_rate, baseline_var_cost, created_at)
VALUES
  ('baseline', 1000, 0.985, 13000, 40.1, 'A+', 0.985, 13000, '2026-05-22 04:29:42+00'),
  ('fx_shock_severe', 1000, 0.924, 28500, 67.3, 'A', 0.985, 13000, '2026-05-22 04:29:42+00'),
  ('systemic_shock', 1000, 0.871, 52000, 89.5, 'B', 0.985, 13000, '2026-05-22 04:29:42+00');

COMMIT;