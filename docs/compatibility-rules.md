# Compatibility Rules — QuarrySwap

## Why no percentage score?

A single percentage can hide a critical failure. For example, a hose that matches size but has a lower pressure rating must not look "mostly compatible".

QuarrySwap therefore uses three deterministic states.

### Green
All supported mandatory requirements entered by the requester are satisfied and no supporting field required by the selected rule set is missing.

### Yellow
There is no known hard mismatch, but a required engineering/application field is missing from the inventory or request, so a technician must verify it.

### Red
A known requirement fails.

## Hydraulic hoses

The prototype considers:
- size / inside diameter
- working pressure
- temperature
- fluid
- application
- end connections
- optional flow capacity

Pressure uses a one-way capacity rule: available working pressure must be greater than or equal to the required working pressure. Temperature is treated similarly for the stated maximum operating temperature.

Fluid and connection fields are conservative exact checks in the demo. The system does not assume that an adapter or a different fluid is acceptable.

## Bearings

The prototype considers:
- designation/type
- bore
- outside diameter
- width
- dynamic/static load information if requested
- lubrication
- clearance
- sealing
- mounting/fit
- application

A dimension mismatch is a hard failure. Matching dimensions alone do not automatically create a green result when important application information is absent.

## Important limitation

These are product-level decision-support rules, not a substitute for the machine manual, OEM catalogue, engineering calculation, or responsible technician.

## Manufacturer-selection context

Hydraulic hose selection commonly considers size, temperature, application/media, pressure, ends/couplings and delivery/flow. Bearing selection also depends on operating loads and conditions, lubrication, fits/clearance, sealing and mounting—not just dimensions.

Sources used during product reasoning:
- Gates hydraulic hose/couplings selection guidance and Safe Hydraulics guidance.
- SKF bearing selection guidance.

For a real deployment, preserve the source/version used for each rule and expose it in an audit trail.
