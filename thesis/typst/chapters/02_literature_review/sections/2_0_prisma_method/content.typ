== Literature search and selection method (PRISMA-inspired)

This semester thesis uses a PRISMA-inspired rapid systematic literature review (SLR) protocol to ensure the literature review is transparent, repeatable, and aligned with the thesis research questions.

=== Scope and eligibility criteria
- *Publication window:* 2015–present
- *Domains:* indoor/building fire detection and wildland/wildfire detection
- *Methods covered:* multi-sensor approaches and sensor fusion families discussed in this thesis (e.g., Kalman filtering, Bayesian methods, neural networks, and hybrid strategies)
- *Language:* English
- *Evidence requirement:* the study must describe a method and provide at least one form of evaluable evidence (metrics, experiments, dataset/scenario description, or deployment constraints)

=== Information sources and search strategy
The search targets peer-reviewed journals and conferences indexed in IEEE Xplore, ACM Digital Library, and broad aggregators such as Scopus/Web of Science (when available). Google Scholar is used as a supplemental source for citation-based snowballing (forward and backward).

Two complementary queries are used to guarantee coverage of both domains:
- *Q1 (Indoor):* building/indoor fire detection AND multi-sensor/fusion AND (false alarms OR embedded/edge)
- *Q2 (Wildland):* wildfire/wildland/forest fire AND (fusion OR embedded/edge) AND (false alarms OR early detection)

The complete protocol, screening log template, extraction table template, and PRISMA flow template are stored in the thesis repository for auditability.

=== Screening, inclusion, and reporting
Records are deduplicated, screened by title/abstract, and then assessed at full text with exclusion reasons logged. The final included set is synthesized using a comparison table (sensors, fusion method, class framing, domain tag, and deployment feasibility) and a narrative review organized by: (i) indoor vs wildland evidence, (ii) fusion method families, (iii) false-alarm mitigation strategies, and (iv) edge feasibility.

