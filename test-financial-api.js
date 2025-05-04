// Test script for Financial Datasets API
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { format, subDays } from 'date-fns';

// Load environment variables
dotenv.config();

async function testStockPriceApi() {
  if (!process.env.FINANCIAL_DATASETS_API_KEY) {
    console.error('Error: FINANCIAL_DATASETS_API_KEY not set in environment variables');
    return;
  }

  console.log('Using API Key:', process.env.FINANCIAL_DATASETS_API_KEY);

  const options = {
    method: 'GET',
    headers: { 'X-API-KEY': process.env.FINANCIAL_DATASETS_API_KEY }
  };

  // Test 1: Get price snapshot for PLTR
  try {
    console.log('\n--- Test 1: Price Snapshot for PLTR ---');
    const snapshotUrl = 'https://api.financialdatasets.ai/prices/snapshot?ticker=PLTR';
    console.log(`Requesting: ${snapshotUrl}`);
    
    const snapshotResponse = await fetch(snapshotUrl, options);
    console.log('Status:', snapshotResponse.status, snapshotResponse.statusText);
    
    if (snapshotResponse.ok) {
      const data = await snapshotResponse.json();
      console.log('Snapshot Data:', JSON.stringify(data, null, 2));
    } else {
      const text = await snapshotResponse.text();
      console.log('Error Response:', text);
    }
  } catch (error) {
    console.error('Snapshot Fetch Error:', error);
  }

  // Test 2: Get historical prices for PLTR (one day)
  try {
    console.log('\n--- Test 2: One Day Historical Prices for PLTR ---');
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const oneDayUrl = `https://api.financialdatasets.ai/prices/?ticker=PLTR&interval=minute&interval_multiplier=5&start_date=${today}&end_date=${today}&limit=5000`;
    console.log(`Requesting: ${oneDayUrl}`);
    
    const oneDayResponse = await fetch(oneDayUrl, options);
    console.log('Status:', oneDayResponse.status, oneDayResponse.statusText);
    
    if (oneDayResponse.ok) {
      const data = await oneDayResponse.json();
      console.log('One Day Data Points:', data.prices ? data.prices.length : 0);
      console.log('First Price Point:', data.prices && data.prices.length > 0 ? data.prices[0] : 'No data');
      console.log('Has Next Page:', data.next_page_url ? 'Yes' : 'No');
    } else {
      const text = await oneDayResponse.text();
      console.log('Error Response:', text);
    }
  } catch (error) {
    console.error('One Day Fetch Error:', error);
  }

  // Test 3: Get historical prices for PLTR (30 days)
  try {
    console.log('\n--- Test 3: Thirty Days Historical Prices for PLTR ---');
    const today = format(new Date(), 'yyyy-MM-dd');
    const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
    
    const thirtyDaysUrl = `https://api.financialdatasets.ai/prices/?ticker=PLTR&interval=minute&interval_multiplier=30&start_date=${thirtyDaysAgo}&end_date=${today}&limit=5000`;
    console.log(`Requesting: ${thirtyDaysUrl}`);
    
    const thirtyDaysResponse = await fetch(thirtyDaysUrl, options);
    console.log('Status:', thirtyDaysResponse.status, thirtyDaysResponse.statusText);
    
    if (thirtyDaysResponse.ok) {
      const data = await thirtyDaysResponse.json();
      console.log('Thirty Days Data Points:', data.prices ? data.prices.length : 0);
      console.log('First Price Point:', data.prices && data.prices.length > 0 ? data.prices[0] : 'No data');
      console.log('Has Next Page:', data.next_page_url ? 'Yes' : 'No');
    } else {
      const text = await thirtyDaysResponse.text();
      console.log('Error Response:', text);
    }
  } catch (error) {
    console.error('Thirty Days Fetch Error:', error);
  }
}

// Run the tests
testStockPriceApi().then(() => {
  console.log('\nTests completed');
}).catch(err => {
  console.error('Test execution failed:', err);
});
