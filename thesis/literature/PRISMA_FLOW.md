# PRISMA Flow (Template)

Use this PRISMA-inspired flow for Chapter 2 (semester thesis “rapid SLR”).

## Flow diagram (Mermaid)

Paste into any Mermaid renderer (GitHub preview supports Mermaid in many contexts).

```mermaid
flowchart TD
  A[Records identified from databases\nQuery 1 (Indoor): n = ____\nQuery 2 (Wildland): n = ____] --> B[Records identified from other sources\nSnowballing / Scholar: n = ____]
  A --> C[Total records before deduplication\nn = ____]
  B --> C
  C --> D[Duplicates removed\nn = ____]
  D --> E[Records screened (title/abstract)\nn = ____]
  E --> F[Records excluded (title/abstract)\nn = ____]
  E --> G[Full-text articles assessed\nn = ____]
  G --> H[Full-text articles excluded\nwith reasons\nn = ____]
  G --> I[Studies included in review\n(peer-reviewed)\nn = ____]

  %% Non-PRISMA supporting sources
  J[Standards + datasheets (supporting)\ntracked separately] -.-> I
```

## Full-text exclusion reasons (use these buckets)

Record full-text exclusions with 1 primary reason.

- R1: Out of scope (not fire detection)
- R2: Not multi-sensor/fusion and not a useful comparator
- R3: No evaluable evidence (no metrics, no dataset, no experiment)
- R4: Not accessible full text
- R5: Duplicates / superseded by an extended journal version
- R6: Non-English
- R7: Pre-2015 (should be filtered earlier, but keep for audit)

## Counts table (fill-in)

| Stage                     |    Count |
| ------------------------- | -------: |
| Identified (databases)    | \_\_\_\_ |
| Identified (other)        | \_\_\_\_ |
| Total before dedup        | \_\_\_\_ |
| Duplicates removed        | \_\_\_\_ |
| Screened (title/abstract) | \_\_\_\_ |
| Excluded (title/abstract) | \_\_\_\_ |
| Full-text assessed        | \_\_\_\_ |
| Full-text excluded        | \_\_\_\_ |
| Included (peer-reviewed)  | \_\_\_\_ |
