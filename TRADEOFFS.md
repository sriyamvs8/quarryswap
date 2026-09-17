# QuarrySwap — Trade-offs Note

QuarrySwap is deliberately optimized for the highest-pressure moment in the scenario: a mechanic has a breakdown and needs to determine whether a nearby spare can be considered for use, then move quickly into an accountable handoff.

The prototype focuses on two part families—hydraulic hoses and bearings—instead of trying to model every quarry component. This keeps the compatibility logic explainable and testable. Matching is specification-based rather than driven by an arbitrary compatibility percentage. A known requirement failure is surfaced as **DOES NOT MEET REQUIREMENT**; when critical information is absent, the system says **REQUIRES VERIFICATION** instead of assuming compatibility.

The core flow is intentionally short: create an urgent request, inspect candidate parts, review the specification comparison and warnings, agree loan/trade terms, confirm handoff, and close the breakdown/return workflow.

We intentionally do not require login for the core demo. We also leave payments, maps/GPS, transport tracking, chat, manufacturer APIs, ERP integration, and automated engineering certification out of scope. These would add complexity without improving the first emergency decision.

The inventory includes new, used, refurbished, and salvage conditions because availability during a breakdown is not equivalent to normal procurement. The handoff record captures transaction type, return date, deposit, replacement guarantee, notes, and status so that a fast swap still leaves an accountable trail.

The demo sites and inventories are fictional mock data. Distances are static demo values and are not used to override compatibility results.

The main limitation is that the prototype is decision support, not an engineering approval system. Real deployments would need machine-specific documentation, authenticated users, stronger audit controls, manufacturer/part-catalogue validation, and a controlled workflow for high-risk applications.
