## Tables in Typst – Detailed Best Practices

Tables are created with #table() inside #figure() for captioning and numbering.

### Basic Table Example

```typst
#figure(
  table(
    columns: (auto, auto, auto, 1fr, auto),
    align: (horizon + left, horizon + center, horizon + center, horizon + center, horizon + center),
    stroke: (x,y) => if y == 0 { (bottom: 1pt + black) } else { (bottom: 0.5pt + gray) },
    table.header(
      [*Sensor*], [*Type*], [*Measurement Range*], [*Typical Fire Threshold*], [*False Positive Sources*]
    ),
    [MQ-2],     [Smoke/Gas],     [300–10,000 ppm],   [>800 ppm],     [Alcohol, cooking fumes],
    [Flame IR], [Infrared],      [760–1100 nm],      [Detected],     [Sunlight, hot surfaces],
    [DHT22],    [Temp/Humidity], [-40–80°C / 0–100%], [>50°C],       [Heaters, human presence],
    [TSL2591],  [Light],         [0–88,000 lux],     [<200 lux drop], [Ambient light changes]
  ),
  caption: [Summary of selected sensors, their ranges, and common false-positive triggers.]
) <tab:sensors>

Refer to @tab:sensors for sensor specifications.
```

### Advanced Table Features

- Insert and fill for cells
- Cell spanning with `table.cell(colspan: 2, ...)`
- Hlines and vlines for custom borders

```typst
#figure(
  table(
    columns: 5,
    inset: 8pt,
    stroke: none,
    fill: (x,y) => if y == 0 { gray.lighten(70%) } else if calc.odd(y) { gray.lighten(95%) } else { white },
    table.hline(),
    table.header([*Class*], [*Precision*], [*Recall*], [*F1-Score*], [*Support*]),
    table.hline(),
    [No Fire],  [0.96], [0.98], [0.97], [450],
    [Fire],     [0.94], [0.91], [0.92], [180],
    table.hline(),
    table.cell(colspan: 3, align: right)[*Average*], [0.95], [630],
    table.hline()
  ),
  caption: [Classification report for the deployed TinyML model on the test dataset.]
) <tab:classification>
```

### Side-by-Side Figure + Table

Use `grid` or `subpar` for layout:

```typst
#grid(
  columns: (1fr, 1fr),
  gutter: 2em,
  figure(image("figures/confusion.png"), caption: [Confusion matrix]) <fig:confusion>,
  figure(table(...), caption: [Metrics summary]) <tab:metrics>
)

See the confusion matrix in @fig:confusion alongside detailed metrics in @tab:metrics.
```

## Additional Recommendations

- Always include `alt` text via `image(..., alt: "Description")` for accessibility.
- Use relative paths `(figures/)` and organize in a dedicated folder.
- For large tables, consider `longtable` equivalents via packages like `@preview/tablex`.
- Cross-references: always use `@label` (e.g., `@fig:system-arch`, `@tab:sensors` ).
- Placement: Typst handles floating well; use `placement: none` or `top/bottom` if needed.