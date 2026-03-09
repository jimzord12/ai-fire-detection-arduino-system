=== Appendix B: Raw Data Samples (CSV) <appendix:raw-data>
Excerpts from the raw CSV datasets for each of the three classification classes (Idle, Fire, Noise) are provided to illustrate the feature space.

To illustrate the nature of the training data, snippets from each of the three classification classes (Fire, No Fire, and False Alarm) are presented below. These samples represent the raw sensor outputs prior to feature engineering and windowing in the TinyML pipeline.

==== 1. Fire Dataset (Sample)
_Source: fire__close_low_vent_20260125_212033_1.csv_

#figure(
  table(
    columns: (1.2fr, 0.8fr, 0.8fr, 0.8fr, 0.8fr, 1fr, 1fr),
    [*Timestamp*], [*Smoke*], [*VOC*], [*CO*], [*Flame*], [*Temp*], [*Hum*],
    [15380], [254], [742], [736], [966], [25.20], [47.12],
    [15480], [253], [740], [736], [966], [25.21], [47.10],
    [15580], [254], [740], [736], [967], [25.18], [47.10],
    [15680], [254], [740], [736], [969], [25.19], [47.14],
    [15780], [254], [740], [735], [966], [25.19], [47.08],
  ),
  caption: [Raw sensor data captured during a fire scenario (smoldering fire at close range). Note the high values for Smoke, VOC, and CO.],
) <table-raw-fire-sample>

==== 2. No Fire (Ambient) Dataset (Sample)
_Source: no_fire__base_room_air_20260118_201221_1.csv_

#figure(
  table(
    columns: (1.2fr, 0.8fr, 0.8fr, 0.8fr, 0.8fr, 1fr, 1fr),
    [*Timestamp*], [*Smoke*], [*VOC*], [*CO*], [*Flame*], [*Temp*], [*Hum*],
    [1137200], [70], [408], [438], [2], [19.10], [50.35],
    [1137300], [70], [408], [440], [1], [19.09], [50.35],
    [1137400], [70], [408], [441], [1], [19.11], [50.36],
    [1137500], [67], [408], [441], [0], [19.10], [50.36],
    [1137600], [67], [408], [441], [0], [19.11], [50.38],
  ),
  caption: [Raw sensor data captured during normal ambient room conditions. Values represent the stable environmental baseline.],
) <table-raw-no-fire-sample>

==== 3. False Alarm Dataset (Sample)
_Source: false_alarm__spray_20260201_150429_1.csv_

#figure(
  table(
    columns: (1.2fr, 0.8fr, 0.8fr, 0.8fr, 0.8fr, 1fr, 1fr),
    [*Timestamp*], [*Smoke*], [*VOC*], [*CO*], [*Flame*], [*Temp*], [*Hum*],
    [1229677], [161], [911], [23], [109], [30.05], [39.62],
    [1229777], [158], [905], [21], [144], [29.85], [39.91],
    [1229877], [153], [891], [23], [151], [29.98], [40.34],
    [1229977], [162], [881], [23], [159], [29.92], [40.25],
    [1230077], [156], [882], [23], [132], [30.03], [40.9],
  ),
  caption: [Raw sensor data captured during a false alarm scenario (aerosol spray). Note the high VOC but low CO levels compared to the fire dataset.],
) <table-raw-false-alarm-sample>

==== Data Column Definitions

- *Timestamp*: Milliseconds since Arduino startup.
- *Smoke, VOC, CO*: Raw analog sensor readings (10-bit ADC, range 0-1023).
- *Flame*: Raw analog reading from IR flame sensor.
- *Temp*: Ambient temperature in degrees Celsius (°C).
- *Hum*: Relative humidity percentage (%).
