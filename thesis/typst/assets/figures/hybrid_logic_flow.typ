#import "@preview/fletcher:0.5.5" as fletcher: diagram, node, edge, shapes

#let hybrid_logic_flow() = {
  set text(size: 9pt)
  diagram(
    spacing: (15pt, 45pt),
    node-stroke: 0.5pt + black,
    node-inset: 8pt,

    // Nodes
    node((0,0), [Sensor Input\ (10 Hz)], name: <input>, shape: shapes.rect),
    node((0,1), [Stage 1:\ TinyML Inference], name: <ai>, shape: shapes.rect),
    node((0,2), [AI Fire Prob > 0.70?], name: <prob_check>, shape: shapes.diamond),

    node((-1.5, 3.5), [Stage 2:\ Hybrid Verification], name: <hybrid>, shape: shapes.rect),
    node((-1.5, 4.5), [Smoke > 180 OR\ Flame > 150?], name: <visual_check>, shape: shapes.diamond),

    node((1.5, 3.5), [Stage 3:\ Critical Override], name: <override>, shape: shapes.rect),
    node((1.5, 4.5), [Flame Intensity\ > 800?], name: <flame_check>, shape: shapes.diamond),

    node((0, 5.5), [Stage 4:\ Temporal Verification], name: <temporal>, shape: shapes.rect),
    node((0, 6.5), [Consecutive Count\ >= 3?], name: <count_check>, shape: shapes.diamond),

    node((0, 7.5), [*ALARM TRIGGERED*], name: <alarm>, fill: red.lighten(80%)),

    node((-3, 5.5), [Heuristic\ Suppression], name: <suppress>, shape: shapes.rect),
    node((3, 5.5), [Temporal Decay\ (Confidence - 1)], name: <decay>, shape: shapes.rect),

    node((0, 8.5), [Return to\ Monitoring], name: <idle>, shape: shapes.rect),

    // Edges
    edge(<input>, <ai>, "-|>"),
    edge(<ai>, <prob_check>, "-|>"),

    edge(<prob_check>, <hybrid>, [Yes], "-|>"),
    edge(<prob_check>, <override>, [No], "-|>"),

    edge(<hybrid>, <visual_check>, "-|>"),
    edge(<visual_check>, <temporal>, [Yes], "-|>"),
    edge(<visual_check>, <suppress>, [No], "-|>"),

    edge(<override>, <flame_check>, "-|>"),
    edge(<flame_check>, <temporal>, [Yes], "-|>"),
    edge(<flame_check>, <decay>, [No], "-|>"),

    edge(<temporal>, <count_check>, "-|>"),
    edge(<count_check>, <alarm>, [Yes], "-|>"),
    edge(<count_check>, <decay>, [No], "-|>"),

    edge(<decay>, <idle>, "-|>"),
    edge(<suppress>, <idle>, "-|>"),
    edge(<alarm>, <idle>, "--|>"),
    )
    }
