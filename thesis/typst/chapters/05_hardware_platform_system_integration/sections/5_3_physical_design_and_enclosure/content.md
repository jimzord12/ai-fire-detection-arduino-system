# 5.3 Physical Design and Enclosure

The physical design of an autonomous fire detection node enclosure must reconcile two
competing engineering constraints: maximising the transport of combustion-product gases
to chemically sensitive transducers while preventing thermal interference between the
power-dissipating heating elements of MEMS sensors and thermally sensitive components
such as the AHT20 temperature/humidity sensor and the Renesas RA4M1 microcontroller.
Both objectives are inseparable in a compact multi-sensor deployment, and the enclosure
geometry constitutes a primary determinant of overall system detection accuracy.

## 5.3.1 Airflow Considerations for Gas Sensors

Gas-based fire detectors depend critically on the timely delivery of combustion products
to sensor surfaces. Fonollosa et al. (2018) demonstrated that the spatial arrangement
and housing geometry of gas sensing systems directly influence response latency and
detection sensitivity, noting that buoyancy-driven smoke plumes from smouldering fires
disperse slowly and do not always rise to ceiling level, which makes sensor positioning
and enclosure permeability decisive factors in alarm response time (Fonollosa et al.,
2018). For the present node, the enclosure must therefore facilitate passive convective
ingress of ambient air laden with smoke, CO, and VOC markers without relying on
forced-ventilation hardware that would increase power draw and mechanical complexity.

MEMS gas sensors are particularly sensitive to packaging constraints. Chen et al. (2023)
evaluated a polytetrafluoroethylene (PTFE) membrane-based packaging approach for MEMS
gas sensors and demonstrated that enclosures incorporating microporous hydrophobic
membranes achieved analyte gas permeability while blocking condensed water and
particulate contamination, preserving sensor response characteristics without sacrificing
gas diffusion rates (Chen et al., 2023). Following this principle, the enclosure of the
present node incorporates ventilation apertures on lateral and lower faces, sized to
permit laminar diffusion of gaseous analytes while minimising forced-convection artefacts
that would transiently dilute sensor readings during a detection event.

Islam et al. (2019) further established that housing geometry creates boundary layer
effects that can attenuate gas concentration at the sensing surface relative to ambient
levels; their experimental evaluation of slot-vent housings showed that aperture
placement perpendicular to the dominant airflow direction yielded the most uniform
concentration distribution across sensor arrays (Islam et al., 2019). Accordingly, the
present enclosure places its primary ventilation apertures on the lower-lateral faces at
approximately 90° to the anticipated horizontal plume trajectory, ensuring that natural
thermal convection from a fire event produces an upward draught that draws combustion
gases through the sensor cavity without stagnation pockets forming in dead zones. The
IR flame sensor (760–1100 nm) is mounted on a flush external surface with an unobstructed
optical window, consistent with its line-of-sight operational requirement, and does not
require enclosed gas diffusion pathways.

## 5.3.2 Isolation of Thermal Components

MEMS metal-oxide semiconductor (MOS) gas sensors, including the smoke, VOC, and CO
transducers employed in this system, rely on resistive micro-heaters that sustain sensing
films at elevated operating temperatures. Wu et al. (2024) reviewed the performance
characteristics of MEMS gas sensors and confirmed that these micro-heater elements drive
sensing films to temperatures typically in the range of 200–450 °C at the element level,
even though the package surface temperature is considerably lower; in a compact
multi-sensor enclosure, cumulative dissipation from three co-located MEMS heaters is
sufficient to elevate the internal ambient temperature measurably (Wu et al., 2024). This
localised heat poses a co-location hazard for two categories of adjacent components: the
AHT20 temperature and humidity sensor, whose ambient temperature readings would be biased
upward by conductive or radiative heat transfer from the MEMS heaters, and the RA4M1
microcontroller, whose junction temperature ratings constrain the maximum permissible
local thermal environment.

To mitigate intra-enclosure thermal cross-talk, the physical layout enforces spatial
segregation between heater-bearing MEMS sensors and the AHT20. Fonollosa et al. (2018)
underlined that thermal interactions between co-located sensors in compact detector
housings can systematically skew baseline readings, particularly for temperature-dependent
transducers, and recommended physical baffling or separation distances as the primary
mitigation strategy (Fonollosa et al., 2018). In the present design, the AHT20 is
positioned on the windward aspect of the enclosure, upstream of the MEMS sensor cluster
in the convective air path, so that ambient air contacting the humidity sensor has not
yet been warmed by the MEMS heaters. A low-thermal-conductivity polylactic acid (PLA)
partition baffle separates the MEMS sensor bay from the AHT20 bay, reducing conductive
coupling through the shared PCB substrate.

Wu et al. (2024) further noted that uncontrolled ambient temperature rise inside a sealed
enclosure can shift the operating point of metal-oxide sensing films, producing drift in
resistance baseline and introducing classification uncertainty into the inference pipeline
(Wu et al., 2024). This reinforces the imperative to maintain thermal equilibrium through
passive ventilation; the same lateral-face apertures that facilitate analyte gas ingress
also serve as passive heat exhaust pathways for MEMS heater dissipation. Chen et al.
(2023) confirmed that well-designed membrane apertures sustain sufficient air exchange to
prevent heat accumulation within compact sensor housings while simultaneously retaining
particulate rejection properties, thereby providing a dual-function thermal and chemical
benefit to the overall enclosure architecture (Chen et al., 2023).

## References

- Chen, Z., Wu, X., Liu, Y., & Zheng, H. (2023). A novel packaging of the MEMS gas
  sensors used in complex environment. _Sensors_, _23_(11), 5087.
  https://doi.org/10.3390/s23115087

- Fonollosa, J., Solórzano, A., & Marco, S. (2018). Chemical sensor systems and
  associated algorithms for fire detection: A review. _Sensors_, _18_(2), 553.
  https://doi.org/10.3390/s18020553

- Islam, A., Houston, A. L., Shankar, A., & Detweiler, C. (2019). Design and evaluation
  of sensor housing for boundary layer profiling using multirotors. Sensors, 19(11), 2481.
  https://doi.org/10.3390/s19112481

- Wu, Y., Lei, M., & Xia, X. (2024). Research progress of MEMS gas sensors: A
  comprehensive review of sensing materials. _Sensors_, _24_(24), 8125.
  https://doi.org/10.3390/s24248125

## Glossary

- **MEMS**: Micro-Electro-Mechanical Systems; miniaturised mechanical and
  electro-mechanical elements fabricated using semiconductor processing techniques,
  used here to denote miniaturised gas and environmental sensors.

- **MOS (Metal-Oxide Semiconductor)**: Sensing material category used in MEMS gas
  sensors whose electrical resistance varies in response to target gas concentration
  when operated at elevated temperature via an integrated micro-heater.

- **PTFE (Polytetrafluoroethylene)**: A chemically inert, hydrophobic polymer used as
  a microporous membrane in sensor packaging to permit gas diffusion while blocking
  liquid water and particulates.

- **Thermal cross-talk**: Unintended heat transfer between co-located components within
  a shared enclosure, causing measurement bias in thermally sensitive transducers.

- **PLA (Polylactic Acid)**: A biodegradable thermoplastic with low thermal conductivity
  used as an enclosure and baffle material to provide thermal isolation between sensor
  sub-assemblies.

- **VOC**: Volatile Organic Compounds; organic chemicals with high vapour pressure at
  room temperature, detectable by MEMS VOC sensors as fire-related combustion
  by-products.
