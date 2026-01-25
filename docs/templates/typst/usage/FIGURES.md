## Figures in Typst – Detailed Best Practices

Typst's `#figure()` is the central element for all captioned content (images, drawings, algorithms, code listings, tables, etc.). Key principles:
- Always use `#figure()` for anything that needs a caption and automatic numbering.
- Use `<label>` for cross-referencing with `@label`.
- Set global styling with `show figure` rules in `config.typ`.
- Supplements allow custom prefixes (e.g., "Fig." instead of "Figure").
- Kind-specific numbering: separate counters for images, tables, code, etc.

### Global Figure Styling (in config.typ)
```typst
// Custom supplement and numbering for different kinds
#show figure.where(kind: image): set figure(supplement: "Fig.")
#show figure.where(kind: table): set figure(supplement: "Table")
#show figure.where(kind: raw): set figure(supplement: "Listing")  // for code

// Caption styling: bold caption above for tables, below for images
#show figure.where(kind: table): it => {
  set align(center)
  it.body
  strong(it.caption)
}

#show figure.where(kind: image): it => {
  set align(center)
  it.body
  it.caption
}

// Automatic outline entries
#outline(title: "List of Figures", target: figure.where(kind: image))
#outline(title: "List of Tables", target: figure.where(kind: table))
```

### Single Image Figure

```typst
#figure(
  image("figures/system_overview.svg", width: 90%),
  caption: [
    Overall system architecture: Arduino board with connected sensors, sensor fusion processing, and Edge Impulse TinyML model deployment.
  ]
) <fig:system-arch>

As shown in @fig:system-arch, the data flows from sensors through fusion to the classifier.
```

### Multi-Panel (Subfigures) Using Grid

Typst has native subfigure support via packages or manual layout (recommended: `@preview/subpar:0.1.2` or built-in grid).

#### With subpar package (highly recommended for theses):

```typst
#import "@preview/subpar:0.1.2": *

#figure(
  subpar.grid(
    columns: 2,
    image("figures/sensor_mq2.jpg", width: 100%),
    image("figures/sensor_flame.jpg", width: 100%),
    image("figures/sensor_dht22.jpg", width: 100%),
    image("figures/arduino_setup.jpg", width: 100%),
    caption: [MQ-2 gas sensor],
    caption: [IR flame sensor],
    caption: [DHT22 temperature/humidity sensor],
    caption: [Complete Arduino prototype],
  ),
  caption: [Hardware components used in the fire detection prototype.]
) <fig:hardware-components>

Subfigure @fig:hardware-components.a shows the MQ-2 sensor, while @fig:hardware-components.d presents the full assembly.
```

#### Without package (pure Typst grid):

```typst
#figure(
  grid(
    columns: 2,
    gutter: 1em,
    figure(image("figures/a.png"), caption: [Panel A]) <sub-a>,
    figure(image("figures/b.png"), caption: [Panel B]) <sub-b>,
    figure(image("figures/c.png"), caption: [Panel C]) <sub-c>,
    figure(image("figures/d.png"), caption: [Panel D]) <sub-d>,
  ),
  caption: [Multi-panel hardware overview.]
) <fig:multi-panel>

See panels @sub-a and @sub-d in @fig:multi-panel.
```

### Vector Diagrams with CeTZ

```typst
#import "@preview/cetz:0.2.2": canvas, draw

#figure(
  canvas({
    draw.rect((0,0), (10,6), stroke: none, fill: gray.lighten(90%))
    draw.circle((5,3), radius: 2, fill: blue.lighten(80%), name: "arduino")
    draw.content("arduino.center", [Arduino Nano 33 BLE])
    // Add more elements: sensors, arrows, etc.
    draw.line("arduino.east", (8,4), =>, name: "to-sensors")
    draw.content((8.5,4), [Sensors])
  }),
  caption: [Block diagram of the proposed system using CeTZ.]
) <fig:block-diagram>
```

