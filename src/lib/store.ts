import { useEffect, useMemo, useState } from 'react'
import { demoData } from '../data/demoData'
import type { Activity, AppData, Loan, PartRequest } from '../types'

const KEY = 'quarryswap-demo-v1'

function load(): AppData {
  try {
    const saved = localStorage.getItem(KEY)
    return saved ? JSON.parse(saved) as AppData : structuredClone(demoData)
  } catch {
    return structuredClone(demoData)
  }
}

export function useQuarryStore() {
  const [data, setData] = useState<AppData>(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data))
  }, [data])

  const actions = useMemo(() => ({
    createRequest: (request: PartRequest) => setData(d => ({
      ...d,
      requests: [request, ...d.requests],
      activities: [{
        id: crypto.randomUUID(), type: 'REQUEST',
        message: `${request.urgency} ${request.partFamily === 'HYDRAULIC_HOSE' ? 'hose' : 'bearing'} request opened.`,
        requestId: request.id, createdAt: new Date().toISOString()
      }, ...d.activities]
    })),
    addInventory: (item: AppData['inventory'][number]) => setData(d => ({
      ...d,
      inventory: [item, ...d.inventory],
      activities: [{
        id: crypto.randomUUID(), type: 'INVENTORY',
        message: `${item.partNumber} listed at ${d.sites.find(s => s.id === item.siteId)?.name ?? 'site'}.`,
        createdAt: new Date().toISOString()
      }, ...d.activities]
    })),
    createLoan: (loan: Loan, inventoryName: string) => setData(d => ({
      ...d,
      loans: [loan, ...d.loans],
      requests: d.requests.map(r => r.id === loan.requestId ? { ...r, status: 'MATCHED' } : r),
      activities: [{
        id: crypto.randomUUID(), type: 'TERMS',
        message: `${loan.transactionType} terms started for ${inventoryName}.`,
        requestId: loan.requestId, loanId: loan.id, createdAt: new Date().toISOString()
      }, ...d.activities]
    })),
    updateLoan: (loanId: string, status: Loan['status'], message: string) => setData(d => ({
      ...d,
      loans: d.loans.map(l => l.id === loanId ? { ...l, status } : l),
      activities: [{
        id: crypto.randomUUID(), type: status,
        message, loanId, createdAt: new Date().toISOString()
      }, ...d.activities]
    })),
    resolveRequest: (requestId: string) => setData(d => ({
      ...d,
      requests: d.requests.map(r => r.id === requestId ? { ...r, status: 'RESOLVED' } : r),
      activities: [{
        id: crypto.randomUUID(), type: 'RESOLVED',
        message: 'Breakdown marked resolved.', requestId, createdAt: new Date().toISOString()
      }, ...d.activities]
    })),
    resetDemo: () => setData(structuredClone(demoData))
  }), [])

  return { data, actions }
}
