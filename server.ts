import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Initialize GoogleGenAI client on server
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper: 12-digit authentic FedEx format tracking number generator (e.g. 7849 5521 9012)
function generate12DigitTracking(): string {
  const p1 = Math.floor(1000 + Math.random() * 9000);
  const p2 = Math.floor(1000 + Math.random() * 9000);
  const p3 = Math.floor(1000 + Math.random() * 9000);
  return `${p1} ${p2} ${p3}`;
}

// Procedural fallback if AI call is unavailable or key not configured
function generateProceduralShipment(userPrompt?: string) {
  const trackingNumber = generate12DigitTracking();
  const promptLower = (userPrompt || '').toLowerCase();

  let service = 'PRIORITY_OVERNIGHT';
  let serviceName = 'FedEx Priority Overnight®';
  let packageDesc = 'Precision Clinical Diagnostic Assay Kits & Laboratory Reagents';
  let senderCity = 'Boston';
  let senderState = 'MA';
  let senderZip = '02110';
  let senderCompany = 'BioGenix Life Sciences Lab';
  let recipientCity = 'Chicago';
  let recipientState = 'IL';
  let recipientZip = '60611';
  let recipientCompany = 'Northwestern Medical Research Hub';
  let status = 'IN_TRANSIT';
  let heroStatus: 'DELIVERED' | 'ON TIME' = 'ON TIME';
  let statusMessage = 'In transit - Sorted at Memphis World SuperHub';
  let deliveryWindow = 'Tomorrow by 10:30 AM';
  let weight = 6.4;

  if (promptLower.includes('semiconductor') || promptLower.includes('chip') || promptLower.includes('tech')) {
    packageDesc = 'High-Precision 3nm Silicon Wafers & Cleanroom Optic Assemblies';
    senderCity = 'San Jose';
    senderState = 'CA';
    senderZip = '95134';
    senderCompany = 'Silicon Photonics & NanoTech Corp';
    recipientCity = 'Austin';
    recipientState = 'TX';
    recipientZip = '78759';
    recipientCompany = 'Apex Compute Systems';
    service = 'FIRST_OVERNIGHT';
    serviceName = 'FedEx First Overnight®';
    deliveryWindow = 'Tomorrow by 8:30 AM';
    weight = 14.2;
  } else if (promptLower.includes('legal') || promptLower.includes('contract') || promptLower.includes('document')) {
    packageDesc = 'Executed Sovereign Corporate Merger & Acquisition Closing Documents';
    senderCity = 'New York';
    senderState = 'NY';
    senderZip = '10017';
    senderCompany = 'Sullivan & Vanguard LLP';
    recipientCity = 'San Francisco';
    recipientState = 'CA';
    recipientZip = '94105';
    recipientCompany = 'Highland Ridge Capital';
    service = 'STANDARD_OVERNIGHT';
    serviceName = 'FedEx Standard Overnight®';
    deliveryWindow = 'Tomorrow by 3:00 PM';
    weight = 1.8;
  } else if (promptLower.includes('aerospace') || promptLower.includes('aviation') || promptLower.includes('engine')) {
    packageDesc = 'Calibrated Aircraft Avionics Navigation Interface Sensor';
    senderCity = 'Seattle';
    senderState = 'WA';
    senderZip = '98101';
    senderCompany = 'AeroDynamics Propulsion Group';
    recipientCity = 'Atlanta';
    recipientState = 'GA';
    recipientZip = '30309';
    recipientCompany = 'Delta TechOps Maintenance Base';
    service = 'PRIORITY_OVERNIGHT';
    serviceName = 'FedEx Priority Overnight®';
    deliveryWindow = 'Tomorrow by 10:30 AM';
    weight = 28.5;
  } else if (promptLower.includes('deliver') || promptLower.includes('complete')) {
    status = 'DELIVERED';
    heroStatus = 'DELIVERED';
    statusMessage = 'Delivered - Signed for by S. REED at front reception desk';
    deliveryWindow = 'Delivered Today at 10:14 AM';
  }

  const timeline = [
    {
      id: `scan-${Date.now()}-1`,
      timestamp: 'Today, 06:45 AM',
      dateStr: 'Today',
      timeStr: '06:45 AM',
      status: status === 'DELIVERED' ? 'Delivered' : 'On FedEx Vehicle for Delivery',
      location: `${recipientCity}, ${recipientState}`,
      details: status === 'DELIVERED' ? 'Delivered to reception. Signed by S. REED.' : 'Package loaded on delivery truck for morning route.',
      facilityType: status === 'DELIVERED' ? 'DOORSTEP' : 'VEHICLE',
    },
    {
      id: `scan-${Date.now()}-2`,
      timestamp: 'Today, 04:30 AM',
      dateStr: 'Today',
      timeStr: '04:30 AM',
      status: 'Arrived at Local Destination Facility',
      location: `${recipientCity}, ${recipientState}`,
      details: 'Container unloaded and scanned for local courier dispatch.',
      facilityType: 'LOCAL_FACILITY',
    },
    {
      id: `scan-${Date.now()}-3`,
      timestamp: 'Yesterday, 11:20 PM',
      dateStr: 'Yesterday',
      timeStr: '11:20 PM',
      status: 'Departed FedEx SuperHub',
      location: 'Memphis, TN (MEM SuperHub)',
      details: 'Air cargo container transferred to linehaul flight #FDX-402.',
      facilityType: 'AIRPORT_HUB',
    },
    {
      id: `scan-${Date.now()}-4`,
      timestamp: 'Yesterday, 08:15 PM',
      dateStr: 'Yesterday',
      timeStr: '08:15 PM',
      status: 'Arrived at FedEx SuperHub Sort Facility',
      location: 'Memphis, TN',
      details: 'Automated 6-sided optical laser barcode sort scan complete.',
      facilityType: 'SORT_FACILITY',
    },
    {
      id: `scan-${Date.now()}-5`,
      timestamp: 'Yesterday, 04:10 PM',
      dateStr: 'Yesterday',
      timeStr: '04:10 PM',
      status: 'Picked Up by FedEx Courier',
      location: `${senderCity}, ${senderState}`,
      details: 'Direct customer commercial dock pickup verified.',
      facilityType: 'DOORSTEP',
    },
  ];

  return {
    trackingNumber,
    service,
    serviceName,
    status,
    heroStatus,
    statusMessage,
    estimatedDelivery: deliveryWindow,
    actualDelivery: status === 'DELIVERED' ? 'Today, 10:14 AM' : undefined,
    shippingCharge: 185.0,
    createdAt: 'Yesterday, 03:30 PM',
    deliveryInstructions: 'Deliver to front desk reception or commercial receiving dock.',
    packageDescription: packageDesc,
    sender: {
      name: 'Dr. Evelyn Carter',
      company: senderCompany,
      address: '450 Innovation Parkway, Suite 500',
      city: senderCity,
      state: senderState,
      postalCode: senderZip,
      country: 'United States',
      phone: '(617) 555-8820',
    },
    recipient: {
      name: 'Sarah Reed',
      company: recipientCompany,
      address: '710 N Lake Shore Drive, 14th Fl',
      city: recipientCity,
      state: recipientState,
      postalCode: recipientZip,
      country: 'United States',
      phone: '(312) 555-4921',
      isResidential: false,
    },
    packageDetails: {
      weight,
      weightUnit: 'lbs',
      dimensions: { length: 14, width: 10, height: 6, unit: 'in' },
      packaging: 'Medium Box',
      declaredValue: 1500,
      signatureRequired: 'Direct Signature Required',
      description: packageDesc,
    },
    proofOfDelivery: {
      signedBy: 'S. REED',
      timestamp: 'Today at 10:14 AM',
      locationDescription: 'Executive Suite Reception Desk',
      proofPhotoUrl: '/src/assets/images/courier_package_delivery_1792291034807.jpg',
    },
    timeline,
  };
}

// Endpoint: AI-Powered Shipment Generator
app.post('/api/ai/generate-shipment', async (req, res) => {
  const { prompt } = req.body || {};

  if (!ai) {
    // Graceful procedural fallback if Gemini API key is not configured in environment
    const generated = generateProceduralShipment(prompt);
    return res.json({ success: true, shipment: generated, source: 'procedural' });
  }

  try {
    const systemPrompt = `You are an expert FedEx Express logistics systems dispatcher and manifest engineer.
Generate an authentic, highly detailed FedEx shipment record matching the user's prompt or scenario.
Requirements:
1. trackingNumber MUST be in 12-digit format with spaces (e.g., '7849 5521 9012' or '${generate12DigitTracking()}').
2. service must be one of: 'PRIORITY_OVERNIGHT', 'FIRST_OVERNIGHT', 'STANDARD_OVERNIGHT', 'EXPRESS_2DAY', 'GROUND'.
3. status must be one of: 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'PENDING'.
4. heroStatus MUST be either 'DELIVERED' or 'ON TIME'.
5. deliveryWindow must be a realistic specific time window (e.g. 'Tomorrow, Oct 30 by 10:30 AM' or 'Delivered: Today at 8:14 AM').
6. timeline MUST be a chronological array of 4-6 realistic FedEx scan checkpoints detailing facility names (e.g., Memphis World Hub, Indianapolis Sort Facility, O'Hare Station), timestamps, and event descriptions.
7. realistic package details, sender and recipient addresses, commodity description, and proof of delivery information.`;

    const userMessage = prompt && prompt.trim()
      ? `Generate a realistic FedEx shipment for this scenario: "${prompt}".`
      : 'Generate a realistic FedEx Express priority shipment (e.g. biopharmaceutical, precision hardware, or executive contracts) traveling across major US cities.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trackingNumber: { type: Type.STRING },
            service: { type: Type.STRING },
            serviceName: { type: Type.STRING },
            status: { type: Type.STRING },
            heroStatus: { type: Type.STRING },
            statusMessage: { type: Type.STRING },
            estimatedDelivery: { type: Type.STRING },
            shippingCharge: { type: Type.NUMBER },
            packageDescription: { type: Type.STRING },
            deliveryInstructions: { type: Type.STRING },
            sender: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                company: { type: Type.STRING },
                address: { type: Type.STRING },
                city: { type: Type.STRING },
                state: { type: Type.STRING },
                postalCode: { type: Type.STRING },
                country: { type: Type.STRING },
                phone: { type: Type.STRING },
              },
              required: ['name', 'address', 'city', 'state', 'postalCode', 'country', 'phone'],
            },
            recipient: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                company: { type: Type.STRING },
                address: { type: Type.STRING },
                city: { type: Type.STRING },
                state: { type: Type.STRING },
                postalCode: { type: Type.STRING },
                country: { type: Type.STRING },
                phone: { type: Type.STRING },
                isResidential: { type: Type.BOOLEAN },
              },
              required: ['name', 'address', 'city', 'state', 'postalCode', 'country', 'phone'],
            },
            packageDetails: {
              type: Type.OBJECT,
              properties: {
                weight: { type: Type.NUMBER },
                weightUnit: { type: Type.STRING },
                packaging: { type: Type.STRING },
                declaredValue: { type: Type.NUMBER },
                signatureRequired: { type: Type.STRING },
              },
              required: ['weight', 'packaging'],
            },
            proofOfDelivery: {
              type: Type.OBJECT,
              properties: {
                signedBy: { type: Type.STRING },
                timestamp: { type: Type.STRING },
                locationDescription: { type: Type.STRING },
              },
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING },
                  dateStr: { type: Type.STRING },
                  timeStr: { type: Type.STRING },
                  status: { type: Type.STRING },
                  location: { type: Type.STRING },
                  details: { type: Type.STRING },
                  facilityType: { type: Type.STRING },
                },
                required: ['timestamp', 'dateStr', 'timeStr', 'status', 'location', 'details', 'facilityType'],
              },
            },
          },
          required: [
            'trackingNumber',
            'service',
            'serviceName',
            'status',
            'heroStatus',
            'statusMessage',
            'estimatedDelivery',
            'sender',
            'recipient',
            'packageDetails',
            'timeline',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Standardize 12-digit tracking formatting if needed
    if (!parsed.trackingNumber || parsed.trackingNumber.length < 8) {
      parsed.trackingNumber = generate12DigitTracking();
    }

    if (!parsed.heroStatus) {
      parsed.heroStatus = parsed.status === 'DELIVERED' ? 'DELIVERED' : 'ON TIME';
    }

    // Default package details dimension if missing
    if (!parsed.packageDetails.dimensions) {
      parsed.packageDetails.dimensions = { length: 14, width: 10, height: 6, unit: 'in' };
    }
    if (!parsed.packageDetails.weightUnit) {
      parsed.packageDetails.weightUnit = 'lbs';
    }

    // Attach proof photo asset
    if (!parsed.proofOfDelivery) {
      parsed.proofOfDelivery = {
        signedBy: parsed.recipient?.name || 'Authorized Consignee',
        timestamp: parsed.estimatedDelivery || 'Today at 10:14 AM',
        locationDescription: 'Front Door / Commercial Receiving Concourse',
      };
    }
    parsed.proofOfDelivery.proofPhotoUrl = '/src/assets/images/courier_package_delivery_1792291034807.jpg';

    parsed.createdAt = 'Just now (AI Generated)';
    parsed.shippingCharge = parsed.shippingCharge || 215.0;

    return res.json({ success: true, shipment: parsed, source: 'gemini-3.8-flash' });
  } catch (error) {
    console.error('Gemini shipment generation failed, falling back:', error);
    const fallback = generateProceduralShipment(prompt);
    return res.json({ success: true, shipment: fallback, source: 'procedural-fallback' });
  }
});

// Vite middleware mounting (SPA dev server) or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
