'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Config ───────────────────────────────────────────────────────────────────

const TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'JPM']
const BANK_TICKERS = new Set(['JPM'])

const ENDPOINTS = [
  { id: 'income-statement', label: 'Income Stmt'   },
  { id: 'balance-sheet',    label: 'Balance Sheet' },
  { id: 'cash-flow',        label: 'Cash Flow'     },
  { id: 'metrics',          label: 'Metrics'       },
  { id: 'financials',       label: 'Financials'    },
] as const

type EndpointId = typeof ENDPOINTS[number]['id']

// ─── Static fallback data (shown when API key not configured) ──────────────────

const STATIC: Record<string, Record<EndpointId, object>> = {
  AAPL: {
    'income-statement': { ticker: 'AAPL', company: 'Apple Inc.', period: 'annual', periods: ['2024-09-28', '2023-09-30', '2022-09-24'], data: { Revenue: { '2024-09-28': 391035000000, '2023-09-30': 383285000000, '2022-09-24': 394328000000 }, GrossProfit: { '2024-09-28': 180683000000, '2023-09-30': 169148000000, '2022-09-24': 170782000000 }, OperatingIncome: { '2024-09-28': 123216000000, '2023-09-30': 114301000000, '2022-09-24': 119437000000 }, EBITDA: { '2024-09-28': 134661000000, '2023-09-30': 125820000000, '2022-09-24': 130090000000 }, NetIncome: { '2024-09-28': 93736000000, '2023-09-30': 96995000000, '2022-09-24': 99803000000 }, EPSBasic: { '2024-09-28': 6.11, '2023-09-30': 6.16, '2022-09-24': 6.11 }, EPSDiluted: { '2024-09-28': 6.08, '2023-09-30': 6.13, '2022-09-24': 6.07 } } },
    'balance-sheet':    { ticker: 'AAPL', company: 'Apple Inc.', period: 'annual', periods: ['2024-09-28', '2023-09-30'], data: { TotalAssets: { '2024-09-28': 364980000000, '2023-09-30': 352583000000 }, TotalLiabilities: { '2024-09-28': 308030000000, '2023-09-30': 290437000000 }, TotalEquity: { '2024-09-28': 56950000000, '2023-09-30': 62146000000 }, CashAndEquivalents: { '2024-09-28': 29965000000, '2023-09-30': 29965000000 }, TotalDebt: { '2024-09-28': 101304000000, '2023-09-30': 109280000000 }, Inventory: { '2024-09-28': 7286000000, '2023-09-30': 6331000000 } } },
    'cash-flow':        { ticker: 'AAPL', company: 'Apple Inc.', period: 'annual', periods: ['2024-09-28', '2023-09-30'], data: { OperatingCashFlow: { '2024-09-28': 118254000000, '2023-09-30': 110543000000 }, CapitalExpenditures: { '2024-09-28': -9447000000, '2023-09-30': -9959000000 }, FreeCashFlow: { '2024-09-28': 108807000000, '2023-09-30': 100584000000 }, DividendsPaid: { '2024-09-28': -15234000000, '2023-09-30': -15025000000 }, ShareRepurchases: { '2024-09-28': -94949000000, '2023-09-30': -77550000000 } } },
    'metrics':          { ticker: 'AAPL', company: 'Apple Inc.', data: { gross_margin_pct: 46.2, operating_margin_pct: 31.5, net_margin_pct: 23.9, return_on_equity: 1.62, return_on_assets: 0.25, roic: 0.48, debt_to_equity: 1.78, debt_to_ebitda: 0.75, net_debt_to_ebitda: 0.53, interest_coverage: 29.4, current_ratio: 0.87, asset_turnover: 1.07, inventory_turnover: 41.2, fcf_to_ebitda: 0.81 } },
    'financials':       { ticker: 'AAPL', company: 'Apple Inc.', period: 'annual', periods: ['2024-09-28', '2023-09-30'], income: { Revenue: { '2024-09-28': 391035000000, '2023-09-30': 383285000000 }, GrossProfit: { '2024-09-28': 180683000000, '2023-09-30': 169148000000 }, OperatingIncome: { '2024-09-28': 123216000000, '2023-09-30': 114301000000 }, NetIncome: { '2024-09-28': 93736000000, '2023-09-30': 96995000000 }, EPSDiluted: { '2024-09-28': 6.08, '2023-09-30': 6.13 } }, balance: { TotalAssets: { '2024-09-28': 364980000000, '2023-09-30': 352583000000 }, TotalEquity: { '2024-09-28': 56950000000, '2023-09-30': 62146000000 }, TotalDebt: { '2024-09-28': 101304000000, '2023-09-30': 109280000000 }, CashAndEquivalents: { '2024-09-28': 29965000000, '2023-09-30': 29965000000 } }, cashflow: { OperatingCashFlow: { '2024-09-28': 118254000000, '2023-09-30': 110543000000 }, FreeCashFlow: { '2024-09-28': 108807000000, '2023-09-30': 100584000000 }, CapitalExpenditures: { '2024-09-28': -9447000000, '2023-09-30': -9959000000 } } },
  },
  MSFT: {
    'income-statement': { ticker: 'MSFT', company: 'Microsoft Corporation', period: 'annual', periods: ['2024-06-30', '2023-06-30'], data: { Revenue: { '2024-06-30': 245122000000, '2023-06-30': 211915000000 }, GrossProfit: { '2024-06-30': 171008000000, '2023-06-30': 146052000000 }, OperatingIncome: { '2024-06-30': 109433000000, '2023-06-30': 88523000000 }, EBITDA: { '2024-06-30': 131337000000, '2023-06-30': 105445000000 }, NetIncome: { '2024-06-30': 88136000000, '2023-06-30': 72361000000 }, EPSDiluted: { '2024-06-30': 11.80, '2023-06-30': 9.68 } } },
    'balance-sheet':    { ticker: 'MSFT', company: 'Microsoft Corporation', period: 'annual', periods: ['2024-06-30'], data: { TotalAssets: { '2024-06-30': 512163000000 }, TotalLiabilities: { '2024-06-30': 243686000000 }, TotalEquity: { '2024-06-30': 268477000000 }, CashAndEquivalents: { '2024-06-30': 18315000000 }, TotalDebt: { '2024-06-30': 79688000000 } } },
    'cash-flow':        { ticker: 'MSFT', company: 'Microsoft Corporation', period: 'annual', periods: ['2024-06-30'], data: { OperatingCashFlow: { '2024-06-30': 118548000000 }, CapitalExpenditures: { '2024-06-30': -44482000000 }, FreeCashFlow: { '2024-06-30': 74066000000 }, DividendsPaid: { '2024-06-30': -21771000000 } } },
    'metrics':          { ticker: 'MSFT', company: 'Microsoft Corporation', data: { gross_margin_pct: 69.8, operating_margin_pct: 44.6, net_margin_pct: 36.0, return_on_equity: 0.39, return_on_assets: 0.18, roic: 0.29, debt_to_equity: 0.30, debt_to_ebitda: 0.61, net_debt_to_ebitda: 0.47, interest_coverage: 52.1, current_ratio: 1.27, asset_turnover: 0.49, inventory_turnover: null, fcf_to_ebitda: 0.56 } },
    'financials':       { ticker: 'MSFT', company: 'Microsoft Corporation', period: 'annual', periods: ['2024-06-30', '2023-06-30'], income: { Revenue: { '2024-06-30': 245122000000, '2023-06-30': 211915000000 }, GrossProfit: { '2024-06-30': 171008000000, '2023-06-30': 146052000000 }, OperatingIncome: { '2024-06-30': 109433000000, '2023-06-30': 88523000000 }, NetIncome: { '2024-06-30': 88136000000, '2023-06-30': 72361000000 } }, balance: { TotalAssets: { '2024-06-30': 512163000000, '2023-06-30': 411976000000 }, TotalEquity: { '2024-06-30': 268477000000, '2023-06-30': 206223000000 }, TotalDebt: { '2024-06-30': 79688000000, '2023-06-30': 79713000000 } }, cashflow: { OperatingCashFlow: { '2024-06-30': 118548000000, '2023-06-30': 87582000000 }, FreeCashFlow: { '2024-06-30': 74066000000, '2023-06-30': 59475000000 } } },
  },
  GOOGL: {
    'income-statement': { ticker: 'GOOGL', company: 'Alphabet Inc.', period: 'annual', periods: ['2024-12-31', '2023-12-31'], data: { Revenue: { '2024-12-31': 350018000000, '2023-12-31': 307394000000 }, GrossProfit: { '2024-12-31': 210352000000, '2023-12-31': 174062000000 }, OperatingIncome: { '2024-12-31': 112348000000, '2023-12-31': 84293000000 }, EBITDA: { '2024-12-31': 137592000000, '2023-12-31': 107258000000 }, NetIncome: { '2024-12-31': 94083000000, '2023-12-31': 73795000000 }, EPSDiluted: { '2024-12-31': 7.50, '2023-12-31': 5.80 } } },
    'balance-sheet':    { ticker: 'GOOGL', company: 'Alphabet Inc.', period: 'annual', periods: ['2024-12-31'], data: { TotalAssets: { '2024-12-31': 450264000000 }, TotalLiabilities: { '2024-12-31': 119000000000 }, TotalEquity: { '2024-12-31': 331264000000 }, CashAndEquivalents: { '2024-12-31': 93234000000 }, TotalDebt: { '2024-12-31': 28742000000 } } },
    'cash-flow':        { ticker: 'GOOGL', company: 'Alphabet Inc.', period: 'annual', periods: ['2024-12-31'], data: { OperatingCashFlow: { '2024-12-31': 125299000000 }, CapitalExpenditures: { '2024-12-31': -52548000000 }, FreeCashFlow: { '2024-12-31': 72751000000 }, ShareRepurchases: { '2024-12-31': -62220000000 } } },
    'metrics':          { ticker: 'GOOGL', company: 'Alphabet Inc.', data: { gross_margin_pct: 60.1, operating_margin_pct: 32.1, net_margin_pct: 26.9, return_on_equity: 0.32, return_on_assets: 0.21, roic: 0.27, debt_to_equity: 0.09, debt_to_ebitda: 0.21, net_debt_to_ebitda: null, interest_coverage: 148.2, current_ratio: 2.07, asset_turnover: 0.77, inventory_turnover: null, fcf_to_ebitda: 0.53 } },
    'financials':       { ticker: 'GOOGL', company: 'Alphabet Inc.', period: 'annual', periods: ['2024-12-31', '2023-12-31'], income: { Revenue: { '2024-12-31': 350018000000, '2023-12-31': 307394000000 }, GrossProfit: { '2024-12-31': 210352000000, '2023-12-31': 174062000000 }, OperatingIncome: { '2024-12-31': 112348000000, '2023-12-31': 84293000000 }, NetIncome: { '2024-12-31': 94083000000, '2023-12-31': 73795000000 } }, balance: { TotalAssets: { '2024-12-31': 450264000000 }, TotalEquity: { '2024-12-31': 331264000000 }, CashAndEquivalents: { '2024-12-31': 93234000000 } }, cashflow: { OperatingCashFlow: { '2024-12-31': 125299000000 }, FreeCashFlow: { '2024-12-31': 72751000000 } } },
  },
  AMZN: {
    'income-statement': { ticker: 'AMZN', company: 'Amazon.com, Inc.', period: 'annual', periods: ['2024-12-31', '2023-12-31'], data: { Revenue: { '2024-12-31': 637959000000, '2023-12-31': 574785000000 }, GrossProfit: { '2024-12-31': 296699000000, '2023-12-31': 270139000000 }, OperatingIncome: { '2024-12-31': 68592000000, '2023-12-31': 36852000000 }, EBITDA: { '2024-12-31': 172540000000, '2023-12-31': 136200000000 }, NetIncome: { '2024-12-31': 59248000000, '2023-12-31': 30425000000 }, EPSDiluted: { '2024-12-31': 5.51, '2023-12-31': 2.90 } } },
    'balance-sheet':    { ticker: 'AMZN', company: 'Amazon.com, Inc.', period: 'annual', periods: ['2024-12-31'], data: { TotalAssets: { '2024-12-31': 624894000000 }, TotalLiabilities: { '2024-12-31': 383788000000 }, TotalEquity: { '2024-12-31': 241106000000 }, CashAndEquivalents: { '2024-12-31': 101200000000 }, TotalDebt: { '2024-12-31': 67108000000 }, Inventory: { '2024-12-31': 38500000000 } } },
    'cash-flow':        { ticker: 'AMZN', company: 'Amazon.com, Inc.', period: 'annual', periods: ['2024-12-31'], data: { OperatingCashFlow: { '2024-12-31': 115877000000 }, CapitalExpenditures: { '2024-12-31': -83587000000 }, FreeCashFlow: { '2024-12-31': 32290000000 } } },
    'metrics':          { ticker: 'AMZN', company: 'Amazon.com, Inc.', data: { gross_margin_pct: 46.5, operating_margin_pct: 10.7, net_margin_pct: 9.3, return_on_equity: 0.27, return_on_assets: 0.09, roic: 0.18, debt_to_equity: 0.28, debt_to_ebitda: 0.39, net_debt_to_ebitda: null, interest_coverage: 14.8, current_ratio: 1.12, asset_turnover: 1.01, inventory_turnover: 10.2, fcf_to_ebitda: 0.19 } },
    'financials':       { ticker: 'AMZN', company: 'Amazon.com, Inc.', period: 'annual', periods: ['2024-12-31', '2023-12-31'], income: { Revenue: { '2024-12-31': 637959000000, '2023-12-31': 574785000000 }, GrossProfit: { '2024-12-31': 296699000000, '2023-12-31': 270139000000 }, OperatingIncome: { '2024-12-31': 68592000000, '2023-12-31': 36852000000 }, NetIncome: { '2024-12-31': 59248000000, '2023-12-31': 30425000000 } }, balance: { TotalAssets: { '2024-12-31': 624894000000 }, TotalEquity: { '2024-12-31': 241106000000 }, TotalDebt: { '2024-12-31': 67108000000 } }, cashflow: { OperatingCashFlow: { '2024-12-31': 115877000000 }, FreeCashFlow: { '2024-12-31': 32290000000 } } },
  },
  NVDA: {
    'income-statement': { ticker: 'NVDA', company: 'NVIDIA Corporation', period: 'annual', periods: ['2025-01-26', '2024-01-28'], data: { Revenue: { '2025-01-26': 130497000000, '2024-01-28': 60922000000 }, GrossProfit: { '2025-01-26': 97269000000, '2024-01-28': 44301000000 }, OperatingIncome: { '2025-01-26': 81567000000, '2024-01-28': 32972000000 }, EBITDA: { '2025-01-26': 83985000000, '2024-01-28': 34205000000 }, NetIncome: { '2025-01-26': 72880000000, '2024-01-28': 29760000000 }, EPSDiluted: { '2025-01-26': 2.94, '2024-01-28': 1.19 } } },
    'balance-sheet':    { ticker: 'NVDA', company: 'NVIDIA Corporation', period: 'annual', periods: ['2025-01-26'], data: { TotalAssets: { '2025-01-26': 111601000000 }, TotalLiabilities: { '2025-01-26': 30041000000 }, TotalEquity: { '2025-01-26': 81560000000 }, CashAndEquivalents: { '2025-01-26': 8589000000 }, TotalDebt: { '2025-01-26': 8461000000 } } },
    'cash-flow':        { ticker: 'NVDA', company: 'NVIDIA Corporation', period: 'annual', periods: ['2025-01-26'], data: { OperatingCashFlow: { '2025-01-26': 64089000000 }, CapitalExpenditures: { '2025-01-26': -1077000000 }, FreeCashFlow: { '2025-01-26': 63012000000 }, DividendsPaid: { '2025-01-26': -246000000 }, ShareRepurchases: { '2025-01-26': -33726000000 } } },
    'metrics':          { ticker: 'NVDA', company: 'NVIDIA Corporation', data: { gross_margin_pct: 74.5, operating_margin_pct: 62.5, net_margin_pct: 55.9, return_on_equity: 1.19, return_on_assets: 0.78, roic: 0.91, debt_to_equity: 0.10, debt_to_ebitda: 0.10, net_debt_to_ebitda: null, interest_coverage: 138.4, current_ratio: 4.17, asset_turnover: 1.38, inventory_turnover: 5.1, fcf_to_ebitda: 0.75 } },
    'financials':       { ticker: 'NVDA', company: 'NVIDIA Corporation', period: 'annual', periods: ['2025-01-26', '2024-01-28'], income: { Revenue: { '2025-01-26': 130497000000, '2024-01-28': 60922000000 }, GrossProfit: { '2025-01-26': 97269000000, '2024-01-28': 44301000000 }, OperatingIncome: { '2025-01-26': 81567000000, '2024-01-28': 32972000000 }, NetIncome: { '2025-01-26': 72880000000, '2024-01-28': 29760000000 } }, balance: { TotalAssets: { '2025-01-26': 111601000000 }, TotalEquity: { '2025-01-26': 81560000000 }, TotalDebt: { '2025-01-26': 8461000000 } }, cashflow: { OperatingCashFlow: { '2025-01-26': 64089000000 }, FreeCashFlow: { '2025-01-26': 63012000000 } } },
  },
  META: {
    'income-statement': { ticker: 'META', company: 'Meta Platforms, Inc.', period: 'annual', periods: ['2024-12-31', '2023-12-31'], data: { Revenue: { '2024-12-31': 164501000000, '2023-12-31': 134902000000 }, GrossProfit: { '2024-12-31': 131247000000, '2023-12-31': 103540000000 }, OperatingIncome: { '2024-12-31': 69381000000, '2023-12-31': 46750000000 }, EBITDA: { '2024-12-31': 85601000000, '2023-12-31': 58400000000 }, NetIncome: { '2024-12-31': 62360000000, '2023-12-31': 39098000000 }, EPSDiluted: { '2024-12-31': 23.54, '2023-12-31': 14.87 } } },
    'balance-sheet':    { ticker: 'META', company: 'Meta Platforms, Inc.', period: 'annual', periods: ['2024-12-31'], data: { TotalAssets: { '2024-12-31': 276054000000 }, TotalLiabilities: { '2024-12-31': 72835000000 }, TotalEquity: { '2024-12-31': 203219000000 }, CashAndEquivalents: { '2024-12-31': 77814000000 }, TotalDebt: { '2024-12-31': 28825000000 } } },
    'cash-flow':        { ticker: 'META', company: 'Meta Platforms, Inc.', period: 'annual', periods: ['2024-12-31'], data: { OperatingCashFlow: { '2024-12-31': 91016000000 }, CapitalExpenditures: { '2024-12-31': -37669000000 }, FreeCashFlow: { '2024-12-31': 53347000000 }, DividendsPaid: { '2024-12-31': -1549000000 }, ShareRepurchases: { '2024-12-31': -32226000000 } } },
    'metrics':          { ticker: 'META', company: 'Meta Platforms, Inc.', data: { gross_margin_pct: 79.8, operating_margin_pct: 42.2, net_margin_pct: 37.9, return_on_equity: 0.38, return_on_assets: 0.25, roic: 0.33, debt_to_equity: 0.14, debt_to_ebitda: 0.34, net_debt_to_ebitda: null, interest_coverage: 62.1, current_ratio: 2.86, asset_turnover: 0.65, inventory_turnover: null, fcf_to_ebitda: 0.62 } },
    'financials':       { ticker: 'META', company: 'Meta Platforms, Inc.', period: 'annual', periods: ['2024-12-31', '2023-12-31'], income: { Revenue: { '2024-12-31': 164501000000, '2023-12-31': 134902000000 }, GrossProfit: { '2024-12-31': 131247000000, '2023-12-31': 103540000000 }, OperatingIncome: { '2024-12-31': 69381000000, '2023-12-31': 46750000000 }, NetIncome: { '2024-12-31': 62360000000, '2023-12-31': 39098000000 } }, balance: { TotalAssets: { '2024-12-31': 276054000000 }, TotalEquity: { '2024-12-31': 203219000000 }, CashAndEquivalents: { '2024-12-31': 77814000000 } }, cashflow: { OperatingCashFlow: { '2024-12-31': 91016000000 }, FreeCashFlow: { '2024-12-31': 53347000000 } } },
  },
  TSLA: {
    'income-statement': { ticker: 'TSLA', company: 'Tesla, Inc.', period: 'annual', periods: ['2024-12-31', '2023-12-31'], data: { Revenue: { '2024-12-31': 97690000000, '2023-12-31': 96773000000 }, GrossProfit: { '2024-12-31': 17073000000, '2023-12-31': 17660000000 }, OperatingIncome: { '2024-12-31': 7074000000, '2023-12-31': 8891000000 }, EBITDA: { '2024-12-31': 13520000000, '2023-12-31': 14855000000 }, NetIncome: { '2024-12-31': 7091000000, '2023-12-31': 14974000000 }, EPSDiluted: { '2024-12-31': 2.03, '2023-12-31': 4.30 } } },
    'balance-sheet':    { ticker: 'TSLA', company: 'Tesla, Inc.', period: 'annual', periods: ['2024-12-31'], data: { TotalAssets: { '2024-12-31': 122070000000 }, TotalLiabilities: { '2024-12-31': 47310000000 }, TotalEquity: { '2024-12-31': 74760000000 }, CashAndEquivalents: { '2024-12-31': 36565000000 }, TotalDebt: { '2024-12-31': 5965000000 }, Inventory: { '2024-12-31': 13376000000 } } },
    'cash-flow':        { ticker: 'TSLA', company: 'Tesla, Inc.', period: 'annual', periods: ['2024-12-31'], data: { OperatingCashFlow: { '2024-12-31': 14923000000 }, CapitalExpenditures: { '2024-12-31': -11045000000 }, FreeCashFlow: { '2024-12-31': 3878000000 } } },
    'metrics':          { ticker: 'TSLA', company: 'Tesla, Inc.', data: { gross_margin_pct: 17.5, operating_margin_pct: 7.2, net_margin_pct: 7.3, return_on_equity: 0.10, return_on_assets: 0.06, roic: 0.07, debt_to_equity: 0.08, debt_to_ebitda: 0.44, net_debt_to_ebitda: null, interest_coverage: 8.6, current_ratio: 1.84, asset_turnover: 0.79, inventory_turnover: 7.3, fcf_to_ebitda: 0.29 } },
    'financials':       { ticker: 'TSLA', company: 'Tesla, Inc.', period: 'annual', periods: ['2024-12-31', '2023-12-31'], income: { Revenue: { '2024-12-31': 97690000000, '2023-12-31': 96773000000 }, GrossProfit: { '2024-12-31': 17073000000, '2023-12-31': 17660000000 }, OperatingIncome: { '2024-12-31': 7074000000, '2023-12-31': 8891000000 }, NetIncome: { '2024-12-31': 7091000000, '2023-12-31': 14974000000 } }, balance: { TotalAssets: { '2024-12-31': 122070000000 }, TotalEquity: { '2024-12-31': 74760000000 }, CashAndEquivalents: { '2024-12-31': 36565000000 } }, cashflow: { OperatingCashFlow: { '2024-12-31': 14923000000 }, FreeCashFlow: { '2024-12-31': 3878000000 } } },
  },
  JPM: {
    'income-statement': { ticker: 'JPM', company: 'JPMorgan Chase & Co.', period: 'annual', periods: ['2024-12-31', '2023-12-31'], data: { NetInterestIncome: { '2024-12-31': 94106000000, '2023-12-31': 89270000000 }, NonInterestIncome: { '2024-12-31': 76909000000, '2023-12-31': 62882000000 }, Revenue: { '2024-12-31': 171015000000, '2023-12-31': 152152000000 }, ProvisionForCreditLosses: { '2024-12-31': 10682000000, '2023-12-31': 9320000000 }, OperatingIncome: { '2024-12-31': 76501000000, '2023-12-31': 66552000000 }, NetIncome: { '2024-12-31': 58471000000, '2023-12-31': 49552000000 }, EPSDiluted: { '2024-12-31': 19.62, '2023-12-31': 16.23 } } },
    'balance-sheet':    { ticker: 'JPM', company: 'JPMorgan Chase & Co.', period: 'annual', periods: ['2024-12-31'], data: { TotalAssets: { '2024-12-31': 4000000000000 }, TotalLiabilities: { '2024-12-31': 3680000000000 }, TotalEquity: { '2024-12-31': 320000000000 }, CashAndEquivalents: { '2024-12-31': 558000000000 }, TotalDebt: { '2024-12-31': 350000000000 }, TotalDeposits: { '2024-12-31': 2402000000000 }, LoansAndLeasesNet: { '2024-12-31': 1339000000000 } } },
    'cash-flow':        { ticker: 'JPM', company: 'JPMorgan Chase & Co.', period: 'annual', periods: ['2024-12-31'], data: { OperatingCashFlow: { '2024-12-31': 77000000000 }, CapitalExpenditures: { '2024-12-31': -8400000000 }, FreeCashFlow: { '2024-12-31': 68600000000 }, DividendsPaid: { '2024-12-31': -13800000000 }, ShareRepurchases: { '2024-12-31': -12000000000 } } },
    'metrics':          { ticker: 'JPM', company: 'JPMorgan Chase & Co.', data: { net_interest_margin: 2.72, operating_margin_pct: 44.7, net_margin_pct: 34.2, return_on_equity: 0.17, return_on_assets: 0.013, roic: 0.14, debt_to_equity: 1.09, interest_coverage: null, current_ratio: null, asset_turnover: null, fcf_to_ebitda: null, note: 'Bank — gross margin not applicable; net_interest_margin reported instead' } },
    'financials':       { ticker: 'JPM', company: 'JPMorgan Chase & Co.', period: 'annual', periods: ['2024-12-31', '2023-12-31'], income: { NetInterestIncome: { '2024-12-31': 94106000000, '2023-12-31': 89270000000 }, NonInterestIncome: { '2024-12-31': 76909000000, '2023-12-31': 62882000000 }, ProvisionForCreditLosses: { '2024-12-31': 10682000000, '2023-12-31': 9320000000 }, NetIncome: { '2024-12-31': 58471000000, '2023-12-31': 49552000000 } }, balance: { TotalAssets: { '2024-12-31': 4000000000000 }, TotalEquity: { '2024-12-31': 320000000000 }, TotalDeposits: { '2024-12-31': 2402000000000 }, LoansAndLeasesNet: { '2024-12-31': 1339000000000 } }, cashflow: { OperatingCashFlow: { '2024-12-31': 77000000000 }, FreeCashFlow: { '2024-12-31': 68600000000 } } },
  },
}

function getStaticData(ticker: string, endpoint: EndpointId): object {
  return (STATIC[ticker] ?? STATIC['AAPL'])[endpoint]
}

// ─── JSON token renderer ──────────────────────────────────────────────────────

type TokenType = 'key' | 'string' | 'number' | 'null' | 'bool' | 'punct'
type Token = { type: TokenType; value: string }

const TOKEN_COLORS: Record<TokenType, string> = {
  key:    '#67e8f9',
  string: '#6ee7b7',
  number: '#fcd34d',
  bool:   '#c084fc',
  null:   '#71717a',
  punct:  '#a1a1aa',
}

function tokenizeJson(json: string): Token[] {
  const tokens: Token[] = []
  const pattern = /("(?:\\u[0-9a-fA-F]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[{}[\],:])/g
  let cursor = 0
  let match = pattern.exec(json)

  while (match !== null) {
    if (match.index > cursor) {
      tokens.push({ type: 'punct', value: json.slice(cursor, match.index) })
    }
    const m = match[0]
    let type: TokenType = 'punct'
    if (m.startsWith('"'))                    type = m.endsWith(':') ? 'key' : 'string'
    else if (m === 'null')                    type = 'null'
    else if (m === 'true' || m === 'false')   type = 'bool'
    else if (/^-?\d/.test(m))                 type = 'number'
    tokens.push({ type, value: m })
    cursor = pattern.lastIndex
    match = pattern.exec(json)
  }
  if (cursor < json.length) tokens.push({ type: 'punct', value: json.slice(cursor) })
  return tokens
}

function JsonView({ data }: { data: object }) {
  const tokens = tokenizeJson(JSON.stringify(data, null, 2))
  return (
    <pre className="text-xs leading-[1.75] font-mono whitespace-pre">
      {tokens.map((t, i) => (
        <span key={i} style={{ color: TOKEN_COLORS[t.type] }}>{t.value}</span>
      ))}
    </pre>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ApiExplorer() {
  const [ticker,   setTicker]   = useState<string>('AAPL')
  const [endpoint, setEndpoint] = useState<EndpointId>('income-statement')
  const [data,     setData]     = useState<object>(() => getStaticData('AAPL', 'income-statement'))
  const [loading,  setLoading]  = useState(false)
  const [isLive,   setIsLive]   = useState(false)

  const fetchData = useCallback(async (t: string, ep: EndpointId) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/financial-data?ticker=${t}&endpoint=${ep}`)
      if (res.ok) {
        const json = await res.json()
        if (!json.error) {
          setData(json)
          setIsLive(true)
          setLoading(false)
          return
        }
      }
    } catch {
      // fall through to static
    }
    setData(getStaticData(t, ep))
    setIsLive(false)
    setLoading(false)
  }, [])

  const handleTicker = (t: string) => {
    setTicker(t)
    fetchData(t, endpoint)
  }

  const handleEndpoint = (ep: EndpointId) => {
    setEndpoint(ep)
    fetchData(ticker, ep)
  }

  const path = `/v1/company/${ticker}/${endpoint}`

  return (
    <section id="explorer" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10">
        <h2 className="mb-2 text-3xl font-black text-white">Interactive API Explorer</h2>
        <p className="text-sm text-zinc-500">
          Select a ticker and endpoint to see real API responses. Clean, standardized JSON that just works.
        </p>
      </div>

      <div className="overflow-hidden border border-white/[0.08] bg-[#171717]">

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#131313] px-5 py-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-zinc-500">GET</span>
            <code className="font-mono text-[#00d47e]">{path}</code>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {loading ? (
              <span className="text-zinc-500">fetching…</span>
            ) : (
              <>
                <span className={`h-1.5 w-1.5 rounded-full ${isLive ? 'live-dot bg-[#00d47e]' : 'bg-zinc-600'}`} />
                <span className={isLive ? 'text-[#00d47e]' : 'text-zinc-500'}>
                  {isLive ? '200 OK · live' : '200 OK · demo'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr]">

          {/* Sidebar */}
          <div className="border-b border-white/[0.06] lg:border-b-0 lg:border-r lg:border-white/[0.06]">
            <div className="border-b border-white/[0.06] p-3">
              <div className="mb-2 px-2 text-xs uppercase tracking-widest text-zinc-500">Endpoint</div>
              <div className="flex flex-col gap-0.5">
                {ENDPOINTS.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => handleEndpoint(ep.id)}
                    className={`rounded-sm px-3 py-2 text-left text-xs font-medium transition-colors ${
                      endpoint === ep.id
                        ? 'bg-[#00d47e]/10 text-[#00d47e]'
                        : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300'
                    }`}
                  >
                    {ep.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3">
              <div className="mb-2 px-2 text-xs uppercase tracking-widest text-zinc-500">Ticker</div>
              <div className="flex flex-col gap-0.5">
                {TICKERS.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTicker(t)}
                    className={`rounded-sm px-3 py-2 text-left text-xs font-bold tracking-wider transition-colors ${
                      ticker === t
                        ? 'bg-[#00d47e]/10 text-[#00d47e]'
                        : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      {t}
                      {BANK_TICKERS.has(t) && (
                        <span className="text-[9px] font-normal tracking-normal text-zinc-500 normal-case">bank</span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* JSON view */}
          <div className={`max-h-[440px] overflow-auto p-6 transition-opacity duration-150 ${loading ? 'opacity-40' : 'opacity-100'}`}>
            <JsonView data={data} />
          </div>
        </div>
      </div>

      {/* Note for bank-specific fields */}
      <p className="mt-3 text-xs text-zinc-500">
        JPM shows bank-specific fields (NetInterestIncome, ProvisionForCreditLosses, TotalDeposits) — standardized automatically by industry.
        Metrics marked <code className="text-zinc-500">null</code> are not applicable to financial institutions.
      </p>
    </section>
  )
}
