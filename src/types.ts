export type PartFamily = 'HYDRAULIC_HOSE' | 'BEARING'
export type Urgency = 'CRITICAL' | 'HIGH' | 'NORMAL'
export type Condition = 'NEW' | 'USED' | 'REFURBISHED' | 'SALVAGE'
export type Availability = 'AVAILABLE' | 'RESERVED' | 'LOANED'
export type MatchResult = 'GREEN' | 'YELLOW' | 'RED'
export type RequestStatus = 'OPEN' | 'MATCHED' | 'RESOLVED'
export type LoanStatus = 'REQUESTED' | 'TERMS_AGREED' | 'HANDOFF_CONFIRMED' | 'ACTIVE' | 'RETURNED' | 'CLOSED'
export type TransactionType = 'LOAN' | 'TRADE'

export interface Site {
  id: string
  name: string
  location: string
  contactName: string
}

export interface Machine {
  id: string
  siteId: string
  manufacturer: string
  model: string
  machineType: string
}

export interface HoseSpecs {
  sizeIn?: number
  pressureBar?: number
  maxTempC?: number
  fluid?: string
  application?: string
  end1?: string
  end2?: string
  flowLpm?: number
}

export interface BearingSpecs {
  designation?: string
  type?: string
  boreMm?: number
  outerMm?: number
  widthMm?: number
  dynamicLoadKn?: number
  staticLoadKn?: number
  lubrication?: string
  clearance?: string
  sealing?: string
  fit?: string
  application?: string
}

export type PartSpecs = HoseSpecs | BearingSpecs

export interface InventoryItem {
  id: string
  siteId: string
  partFamily: PartFamily
  partName: string
  partNumber: string
  condition: Condition
  availability: Availability
  specifications: PartSpecs
  notes: string
  distanceKm: number
}

export interface PartRequest {
  id: string
  siteId: string
  machineId: string
  partFamily: PartFamily
  requiredSpecifications: PartSpecs
  urgency: Urgency
  description: string
  status: RequestStatus
  createdAt: string
}

export interface Match {
  inventory: InventoryItem
  result: MatchResult
  reasons: string[]
  warnings: string[]
}

export interface Loan {
  id: string
  requestId: string
  inventoryId: string
  fromSiteId: string
  toSiteId: string
  transactionType: TransactionType
  returnDate: string
  deposit: number
  replacementGuarantee: boolean
  status: LoanStatus
  notes: string
  createdAt: string
}

export interface Activity {
  id: string
  type: string
  message: string
  requestId?: string
  loanId?: string
  createdAt: string
}

export interface AppData {
  sites: Site[]
  machines: Machine[]
  inventory: InventoryItem[]
  requests: PartRequest[]
  loans: Loan[]
  activities: Activity[]
}
