import type { AppData } from '../types'

const ago = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString()

export const demoData: AppData = {
  sites: [
    { id: 'site-1', name: 'Deccan Quarry A', location: 'Medchal', contactName: 'Ravi Kumar' },
    { id: 'site-2', name: 'Granite Works B', location: 'Shamshabad', contactName: 'Anitha Rao' },
    { id: 'site-3', name: 'Telangana Aggregates C', location: 'Nalgonda', contactName: 'Mahesh Reddy' },
  ],
  machines: [
    { id: 'm-1', siteId: 'site-1', manufacturer: 'DemoMach', model: 'DX-220', machineType: 'Excavator' },
    { id: 'm-2', siteId: 'site-1', manufacturer: 'DemoMach', model: 'LD-95', machineType: 'Loader' },
    { id: 'm-3', siteId: 'site-2', manufacturer: 'RockPro', model: 'CP-480', machineType: 'Crusher' },
    { id: 'm-4', siteId: 'site-2', manufacturer: 'RockPro', model: 'EX-210', machineType: 'Excavator' },
    { id: 'm-5', siteId: 'site-3', manufacturer: 'StoneMax', model: 'LD-110', machineType: 'Loader' },
    { id: 'm-6', siteId: 'site-3', manufacturer: 'StoneMax', model: 'EX-250', machineType: 'Excavator' },
  ],
  inventory: [
    {
      id: 'inv-h1', siteId: 'site-2', partFamily: 'HYDRAULIC_HOSE', partName: 'Hydraulic Hose 1/2" JIC', partNumber: 'HS-12-JJ-400',
      condition: 'NEW', availability: 'AVAILABLE',
      specifications: { sizeIn: 0.5, pressureBar: 400, maxTempC: 121, fluid: 'Petroleum hydraulic oil', application: 'Hydraulic line', end1: 'JIC', end2: 'JIC', flowLpm: 45 },
      notes: 'New stock, capped ends.', distanceKm: 14
    },
    {
      id: 'inv-h2', siteId: 'site-3', partFamily: 'HYDRAULIC_HOSE', partName: 'Hydraulic Hose 1/2" JIC', partNumber: 'HS-12-JJ-250',
      condition: 'USED', availability: 'AVAILABLE',
      specifications: { sizeIn: 0.5, pressureBar: 250, maxTempC: 100, fluid: 'Petroleum hydraulic oil', application: 'Hydraulic line', end1: 'JIC', end2: 'JIC', flowLpm: 40 },
      notes: 'Used; visual inspection required.', distanceKm: 23
    },
    {
      id: 'inv-h3', siteId: 'site-3', partFamily: 'HYDRAULIC_HOSE', partName: 'Hydraulic Hose 1/2" JIC', partNumber: 'HS-12-JJ-350',
      condition: 'REFURBISHED', availability: 'AVAILABLE',
      specifications: { sizeIn: 0.5, pressureBar: 350, maxTempC: 100, fluid: 'Petroleum hydraulic oil', application: 'Hydraulic line', end1: 'JIC', end2: 'JIC', flowLpm: 42 },
      notes: 'Refurbished assembly; end fittings inspected.', distanceKm: 23
    },
    {
      id: 'inv-h4', siteId: 'site-1', partFamily: 'HYDRAULIC_HOSE', partName: 'Hydraulic Hose 3/4" JIC', partNumber: 'HS-34-JJ-400',
      condition: 'NEW', availability: 'AVAILABLE',
      specifications: { sizeIn: 0.75, pressureBar: 400, maxTempC: 121, fluid: 'Petroleum hydraulic oil', application: 'Hydraulic line', end1: 'JIC', end2: 'JIC', flowLpm: 60 },
      notes: 'New stock.', distanceKm: 8
    },
    {
      id: 'inv-h5', siteId: 'site-2', partFamily: 'HYDRAULIC_HOSE', partName: 'Hydraulic Hose 1/2" ORFS', partNumber: 'HS-12-OR-400',
      condition: 'NEW', availability: 'AVAILABLE',
      specifications: { sizeIn: 0.5, pressureBar: 400, maxTempC: 121, fluid: 'Petroleum hydraulic oil', application: 'Hydraulic line', end1: 'ORFS', end2: 'ORFS', flowLpm: 45 },
      notes: 'Different end connection; do not assume adapter suitability.', distanceKm: 14
    },
    {
      id: 'inv-h6', siteId: 'site-1', partFamily: 'HYDRAULIC_HOSE', partName: 'Hydraulic Hose 1/2" — Unspecified Ends', partNumber: 'HS-12-UNK',
      condition: 'SALVAGE', availability: 'AVAILABLE',
      specifications: { sizeIn: 0.5, pressureBar: 400, maxTempC: 121, fluid: 'Petroleum hydraulic oil', application: 'Hydraulic line' },
      notes: 'Connection details not recorded.', distanceKm: 8
    },
    {
      id: 'inv-h7', siteId: 'site-3', partFamily: 'HYDRAULIC_HOSE', partName: 'Hydraulic Hose 1/2" High Temp', partNumber: 'HS-12-JJ-400HT',
      condition: 'NEW', availability: 'AVAILABLE',
      specifications: { sizeIn: 0.5, pressureBar: 400, maxTempC: 150, fluid: 'Petroleum hydraulic oil', application: 'Hydraulic line', end1: 'JIC', end2: 'JIC', flowLpm: 45 },
      notes: 'Higher temperature capacity.', distanceKm: 23
    },
    {
      id: 'inv-h8', siteId: 'site-2', partFamily: 'HYDRAULIC_HOSE', partName: 'Hydraulic Hose 1/2" — Fluid Unknown', partNumber: 'HS-12-JJ-U',
      condition: 'USED', availability: 'AVAILABLE',
      specifications: { sizeIn: 0.5, pressureBar: 400, maxTempC: 121, application: 'Hydraulic line', end1: 'JIC', end2: 'JIC', flowLpm: 45 },
      notes: 'Fluid specification missing.', distanceKm: 14
    },
    {
      id: 'inv-b1', siteId: 'site-2', partFamily: 'BEARING', partName: 'Deep Groove Bearing 50×90×20', partNumber: 'BR-63010',
      condition: 'NEW', availability: 'AVAILABLE',
      specifications: { designation: '63010', type: 'Deep groove ball bearing', boreMm: 50, outerMm: 90, widthMm: 20, dynamicLoadKn: 35, staticLoadKn: 19, lubrication: 'Grease', clearance: 'CN', sealing: 'Open', fit: 'Standard', application: 'Crusher drive' },
      notes: 'New boxed bearing.', distanceKm: 14
    },
    {
      id: 'inv-b2', siteId: 'site-3', partFamily: 'BEARING', partName: 'Bearing 45×85×19', partNumber: 'BR-62090',
      condition: 'NEW', availability: 'AVAILABLE',
      specifications: { designation: '6209', type: 'Deep groove ball bearing', boreMm: 45, outerMm: 85, widthMm: 19, dynamicLoadKn: 31, staticLoadKn: 17, lubrication: 'Grease', clearance: 'CN', sealing: 'Open', fit: 'Standard', application: 'Crusher drive' },
      notes: 'Dimensions differ from 50 mm bore requirement.', distanceKm: 23
    },
    {
      id: 'inv-b3', siteId: 'site-1', partFamily: 'BEARING', partName: 'Bearing 50×90×20 — Application Missing', partNumber: 'BR-63010-U',
      condition: 'USED', availability: 'AVAILABLE',
      specifications: { designation: '63010', type: 'Deep groove ball bearing', boreMm: 50, outerMm: 90, widthMm: 20, dynamicLoadKn: 35, staticLoadKn: 19, lubrication: 'Grease', clearance: 'CN', sealing: 'Open', fit: 'Standard' },
      notes: 'Application history not recorded.', distanceKm: 8
    },
    {
      id: 'inv-b4', siteId: 'site-3', partFamily: 'BEARING', partName: 'Bearing 50×90×20 — Sealed', partNumber: 'BR-63010-2RS',
      condition: 'NEW', availability: 'AVAILABLE',
      specifications: { designation: '63010-2RS', type: 'Deep groove ball bearing', boreMm: 50, outerMm: 90, widthMm: 20, dynamicLoadKn: 35, staticLoadKn: 19, lubrication: 'Grease', clearance: 'CN', sealing: '2RS', fit: 'Standard', application: 'Crusher drive' },
      notes: 'Sealing differs from open bearing request.', distanceKm: 23
    },
    {
      id: 'inv-b5', siteId: 'site-1', partFamily: 'BEARING', partName: 'Bearing 50×90×20 — Heavy Duty', partNumber: 'BR-63010-HD',
      condition: 'REFURBISHED', availability: 'AVAILABLE',
      specifications: { designation: '63010', type: 'Deep groove ball bearing', boreMm: 50, outerMm: 90, widthMm: 20, dynamicLoadKn: 42, staticLoadKn: 24, lubrication: 'Grease', clearance: 'CN', sealing: 'Open', fit: 'Standard', application: 'Crusher drive' },
      notes: 'Refurbished; inspection required.', distanceKm: 8
    },
    {
      id: 'inv-b6', siteId: 'site-2', partFamily: 'BEARING', partName: 'Bearing 50×90×20 — Clearance Unknown', partNumber: 'BR-63010-CU',
      condition: 'SALVAGE', availability: 'AVAILABLE',
      specifications: { designation: '63010', type: 'Deep groove ball bearing', boreMm: 50, outerMm: 90, widthMm: 20, dynamicLoadKn: 35, staticLoadKn: 19, lubrication: 'Grease', sealing: 'Open', fit: 'Standard', application: 'Crusher drive' },
      notes: 'Internal clearance not recorded.', distanceKm: 14
    },
    {
      id: 'inv-b7', siteId: 'site-3', partFamily: 'BEARING', partName: 'Bearing 50×90×20 — Different Application', partNumber: 'BR-63010-GEN',
      condition: 'USED', availability: 'AVAILABLE',
      specifications: { designation: '63010', type: 'Deep groove ball bearing', boreMm: 50, outerMm: 90, widthMm: 20, dynamicLoadKn: 35, staticLoadKn: 19, lubrication: 'Grease', clearance: 'CN', sealing: 'Open', fit: 'Standard', application: 'Conveyor drive' },
      notes: 'Recorded application differs.', distanceKm: 23
    },
    {
      id: 'inv-b8', siteId: 'site-2', partFamily: 'BEARING', partName: 'Bearing 50×90×20 — Trade Stock', partNumber: 'BR-63010-T',
      condition: 'NEW', availability: 'AVAILABLE',
      specifications: { designation: '63010', type: 'Deep groove ball bearing', boreMm: 50, outerMm: 90, widthMm: 20, dynamicLoadKn: 35, staticLoadKn: 19, lubrication: 'Grease', clearance: 'CN', sealing: 'Open', fit: 'Standard', application: 'Crusher drive' },
      notes: 'Available for loan or trade.', distanceKm: 14
    }
  ],
  requests: [
    {
      id: 'req-1', siteId: 'site-1', machineId: 'm-1', partFamily: 'HYDRAULIC_HOSE',
      requiredSpecifications: { sizeIn: 0.5, pressureBar: 300, maxTempC: 100, fluid: 'Petroleum hydraulic oil', application: 'Hydraulic line', end1: 'JIC', end2: 'JIC' },
      urgency: 'CRITICAL', description: 'Boom hydraulic line burst. Excavator is stopped at face.', status: 'OPEN', createdAt: ago(1)
    },
    {
      id: 'req-2', siteId: 'site-3', machineId: 'm-6', partFamily: 'HYDRAULIC_HOSE',
      requiredSpecifications: { sizeIn: 0.5, pressureBar: 350, maxTempC: 100, fluid: 'Petroleum hydraulic oil', application: 'Hydraulic line', end1: 'JIC', end2: 'JIC' },
      urgency: 'HIGH', description: 'Replacement needed before next shift.', status: 'OPEN', createdAt: ago(3)
    },
    {
      id: 'req-3', siteId: 'site-2', machineId: 'm-3', partFamily: 'BEARING',
      requiredSpecifications: { designation: '63010', type: 'Deep groove ball bearing', boreMm: 50, outerMm: 90, widthMm: 20, lubrication: 'Grease', clearance: 'CN', sealing: 'Open', fit: 'Standard', application: 'Crusher drive' },
      urgency: 'CRITICAL', description: 'Crusher drive bearing failure. Production stopped.', status: 'OPEN', createdAt: ago(0.5)
    },
    {
      id: 'req-4', siteId: 'site-1', machineId: 'm-2', partFamily: 'BEARING',
      requiredSpecifications: { boreMm: 50, outerMm: 90, widthMm: 20 },
      urgency: 'NORMAL', description: 'Planned replacement; confirm stock before maintenance window.', status: 'OPEN', createdAt: ago(7)
    }
  ],
  loans: [
    {
      id: 'loan-1', requestId: 'req-1', inventoryId: 'inv-h1', fromSiteId: 'site-2', toSiteId: 'site-1',
      transactionType: 'LOAN', returnDate: new Date(Date.now() + 7 * 86400_000).toISOString().slice(0,10),
      deposit: 5000, replacementGuarantee: true, status: 'ACTIVE',
      notes: 'Return after replacement hose arrives.', createdAt: ago(0.8)
    },
    {
      id: 'loan-2', requestId: 'req-3', inventoryId: 'inv-b8', fromSiteId: 'site-2', toSiteId: 'site-2',
      transactionType: 'TRADE', returnDate: new Date(Date.now() + 1 * 86400_000).toISOString().slice(0,10),
      deposit: 0, replacementGuarantee: false, status: 'TERMS_AGREED',
      notes: 'Trade terms agreed; handoff pending.', createdAt: ago(0.2)
    }
  ],
  activities: [
    { id: 'a-1', type: 'HANDOFF', message: 'HS-12-JJ-400 handed off from Granite Works B to Deccan Quarry A.', requestId: 'req-1', loanId: 'loan-1', createdAt: ago(0.7) },
    { id: 'a-2', type: 'REQUEST', message: 'Critical bearing request opened at Granite Works B.', requestId: 'req-3', createdAt: ago(0.5) },
    { id: 'a-3', type: 'TERMS', message: 'Trade terms agreed for BR-63010-T.', requestId: 'req-3', loanId: 'loan-2', createdAt: ago(0.2) },
    { id: 'a-4', type: 'INVENTORY', message: 'BR-63010-HD marked available at Deccan Quarry A.', createdAt: ago(2) },
    { id: 'a-5', type: 'RESOLVED', message: 'Previous hose breakdown resolved after emergency swap.', createdAt: ago(5) }
  ]
}
