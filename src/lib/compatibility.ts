import type { BearingSpecs, HoseSpecs, InventoryItem, Match, MatchResult, PartRequest } from '../types'

type Outcome = { hardFail: boolean; warning: boolean; reasons: string[]; warnings: string[] }

const check = (label: string, ok: boolean, missing: boolean, reasons: string[], warnings: string[], failText: string) => {
  if (missing) {
    warnings.push(`${label}: not recorded — verify before use.`)
  } else if (ok) {
    reasons.push(`${label}: meets entered requirement.`)
  } else {
    return true
  }
  return false
}

function hoseMatch(req: HoseSpecs, inv: HoseSpecs): Outcome {
  const reasons: string[] = []
  const warnings: string[] = []
  let hardFail = false

  if (req.sizeIn !== undefined) {
    hardFail ||= check('Size', inv.sizeIn === undefined ? false : inv.sizeIn === req.sizeIn, inv.sizeIn === undefined, reasons, warnings, 'Size does not match.')
    if (inv.sizeIn !== undefined && inv.sizeIn !== req.sizeIn) warnings.push(`Size: required ${req.sizeIn}" but inventory is ${inv.sizeIn}".`)
  }
  if (req.pressureBar !== undefined) {
    if (inv.pressureBar === undefined) warnings.push('Pressure rating: not recorded — verify.')
    else if (inv.pressureBar >= req.pressureBar) reasons.push(`Pressure: ${inv.pressureBar} bar ≥ ${req.pressureBar} bar required.`)
    else { hardFail = true; warnings.push(`Pressure: ${inv.pressureBar} bar is below ${req.pressureBar} bar required.`) }
  }
  if (req.maxTempC !== undefined) {
    if (inv.maxTempC === undefined) warnings.push('Maximum temperature: not recorded — verify.')
    else if (inv.maxTempC >= req.maxTempC) reasons.push(`Temperature: ${inv.maxTempC}°C ≥ ${req.maxTempC}°C required.`)
    else { hardFail = true; warnings.push(`Temperature: ${inv.maxTempC}°C is below ${req.maxTempC}°C required.`) }
  }
  const stringFields: Array<[keyof HoseSpecs, string]> = [
    ['fluid', 'Fluid'], ['application', 'Application'], ['end1', 'End 1 connection'], ['end2', 'End 2 connection']
  ]
  for (const [key, label] of stringFields) {
    const required = req[key]
    if (required !== undefined) {
      const available = inv[key]
      if (available === undefined) warnings.push(`${label}: not recorded — verify.`)
      else if (available === required) reasons.push(`${label}: ${required}.`)
      else { hardFail = true; warnings.push(`${label}: required "${required}", inventory says "${available}".`) }
    }
  }
  if (req.flowLpm !== undefined) {
    if (inv.flowLpm === undefined) warnings.push('Flow capacity: not recorded — verify.')
    else if (inv.flowLpm >= req.flowLpm) reasons.push(`Flow capacity: ${inv.flowLpm} L/min ≥ ${req.flowLpm} L/min entered.`)
    else { hardFail = true; warnings.push(`Flow capacity: ${inv.flowLpm} L/min is below ${req.flowLpm} L/min entered.`) }
  }

  return { hardFail, warning: warnings.length > 0, reasons, warnings }
}

function bearingMatch(req: BearingSpecs, inv: BearingSpecs): Outcome {
  const reasons: string[] = []
  const warnings: string[] = []
  let hardFail = false

  const dimensions: Array<[keyof BearingSpecs, string, string]> = [
    ['boreMm', 'Bore', 'mm'], ['outerMm', 'Outside diameter', 'mm'], ['widthMm', 'Width', 'mm']
  ]
  for (const [key, label, unit] of dimensions) {
    const required = req[key]
    if (required !== undefined) {
      const available = inv[key]
      if (available === undefined) warnings.push(`${label}: not recorded — verify.`)
      else if (available === required) reasons.push(`${label}: ${available} ${unit}.`)
      else { hardFail = true; warnings.push(`${label}: required ${required} ${unit}, inventory is ${available} ${unit}.`) }
    }
  }

  const exactFields: Array<[keyof BearingSpecs, string]> = [
    ['designation', 'Designation'], ['type', 'Bearing type'], ['lubrication', 'Lubrication'],
    ['clearance', 'Clearance'], ['sealing', 'Sealing'], ['fit', 'Mounting/fit'], ['application', 'Application']
  ]
  for (const [key, label] of exactFields) {
    const required = req[key]
    if (required !== undefined) {
      const available = inv[key]
      if (available === undefined) warnings.push(`${label}: not recorded — verify.`)
      else if (available === required) reasons.push(`${label}: ${required}.`)
      else { hardFail = true; warnings.push(`${label}: required "${required}", inventory says "${available}".`) }
    }
  }

  const capacityFields: Array<[keyof BearingSpecs, string, string]> = [
    ['dynamicLoadKn', 'Dynamic load', 'kN'], ['staticLoadKn', 'Static load', 'kN']
  ]
  for (const [key, label, unit] of capacityFields) {
    const required = req[key]
    if (required !== undefined) {
      const available = inv[key]
      if (available === undefined) warnings.push(`${label}: not recorded — verify.`)
      else if (available >= required) reasons.push(`${label}: ${available} ${unit} ≥ ${required} ${unit} required.`)
      else { hardFail = true; warnings.push(`${label}: ${available} ${unit} is below ${required} ${unit} required.`) }
    }
  }

  return { hardFail, warning: warnings.length > 0, reasons, warnings }
}

export function evaluateMatch(request: PartRequest, inventory: InventoryItem): Match {
  const outcome = request.partFamily === 'HYDRAULIC_HOSE'
    ? hoseMatch(request.requiredSpecifications as HoseSpecs, inventory.specifications as HoseSpecs)
    : bearingMatch(request.requiredSpecifications as BearingSpecs, inventory.specifications as BearingSpecs)

  let result: MatchResult = 'GREEN'
  if (outcome.hardFail) result = 'RED'
  else if (outcome.warning) result = 'YELLOW'

  return { inventory, result, reasons: outcome.reasons, warnings: outcome.warnings }
}

const rank: Record<MatchResult, number> = { GREEN: 0, YELLOW: 1, RED: 2 }

export function getMatches(request: PartRequest, inventory: InventoryItem[]): Match[] {
  return inventory
    .filter(item => item.partFamily === request.partFamily && item.availability === 'AVAILABLE' && item.siteId !== request.siteId)
    .map(item => evaluateMatch(request, item))
    .sort((a, b) => rank[a.result] - rank[b.result] || a.inventory.distanceKm - b.inventory.distanceKm)
}
