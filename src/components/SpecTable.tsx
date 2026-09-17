import type { PartRequest, InventoryItem } from '../types'

const hoseRows = [
  ['sizeIn', 'Size', '"'], ['pressureBar', 'Pressure', 'bar'], ['maxTempC', 'Max temperature', '°C'],
  ['fluid', 'Fluid', ''], ['application', 'Application', ''], ['end1', 'End 1', ''], ['end2', 'End 2', ''], ['flowLpm', 'Flow capacity', 'L/min']
]
const bearingRows = [
  ['designation', 'Designation', ''], ['type', 'Type', ''], ['boreMm', 'Bore', 'mm'], ['outerMm', 'Outside diameter', 'mm'],
  ['widthMm', 'Width', 'mm'], ['dynamicLoadKn', 'Dynamic load', 'kN'], ['staticLoadKn', 'Static load', 'kN'],
  ['lubrication', 'Lubrication', ''], ['clearance', 'Clearance', ''], ['sealing', 'Sealing', ''], ['fit', 'Mounting/fit', ''], ['application', 'Application', '']
]

export function SpecTable({ request, inventory }: { request: PartRequest; inventory: InventoryItem }) {
  const rows = request.partFamily === 'HYDRAULIC_HOSE' ? hoseRows : bearingRows
  const req = request.requiredSpecifications as Record<string, unknown>
  const inv = inventory.specifications as Record<string, unknown>
  return (
    <div className="spec-table">
      {rows.filter(([key]) => req[key] !== undefined).map(([key, label, unit]) => {
        const r = req[key]
        const a = inv[key]
        const equal = a !== undefined && a === r
        const capacity = ['pressureBar','maxTempC','flowLpm','dynamicLoadKn','staticLoadKn'].includes(key)
        const pass = a !== undefined && (capacity ? Number(a) >= Number(r) : equal)
        return (
          <div className="spec-row" key={key}>
            <span>{label}</span>
            <b>{String(r)}{unit}</b>
            <span className={a === undefined ? 'spec-warn' : pass ? 'spec-pass' : 'spec-fail'}>
              {a === undefined ? 'Not recorded' : `${String(a)}${unit}`}
            </span>
          </div>
        )
      })}
    </div>
  )
}
