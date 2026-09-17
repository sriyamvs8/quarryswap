import type { MatchResult } from '../types'

export function ResultBadge({ result }: { result: MatchResult }) {
  const labels = {
    GREEN: 'MEETS ENTERED REQUIREMENTS',
    YELLOW: 'REQUIRES VERIFICATION',
    RED: 'DOES NOT MEET REQUIREMENT',
  }
  return <span className={`result-badge result-${result.toLowerCase()}`}>{labels[result]}</span>
}

export function UrgencyBadge({ urgency }: { urgency: string }) {
  return <span className={`urgency urgency-${urgency.toLowerCase()}`}>{urgency}</span>
}
