## Math Equations in Typst – Best Practices

Typst uses the `$` delimiter for mathematical equations. Understanding the distinction between **inline** and **block** equations is critical for proper formatting, centering, and numbering.

### 1. Inline Equations
Inline equations are embedded within a sentence. They are rendered with tighter spacing and are **not** centered or numbered.
- **Syntax**: Do NOT include spaces immediately after the opening `$` or before the closing `$`.
- **Example**: `The input vector $x$ is processed by the neuron...`

### 2. Block Equations
Block equations are displayed on their own line. These are the equations that can be **centered** and **numbered** via the project template.
- **Syntax**: You MUST include at least one space after the opening `$` and before the closing `$`.
- **Example**: `$ y = sigma(sum w_i x_i + b) $`

> **Note**: If you omit the spaces (e.g., `$y=ax+b$`), Typst will treat it as an inline equation even if it sits on its own line, and it will remain left-aligned without a number.

### 3. Automatic Centering and Numbering
In this thesis project, the `common/template.typ` is configured to automatically center and number all block equations:

```typst
// Configuration in common/template.typ
set math.equation(numbering: "(1)")
show math.equation.where(block: true): it => align(center, it)
```

### 4. Referencing Equations
To reference an equation in your text, add a label immediately after the closing `$`.

**Example:**
```typst
$ E = m c^2 $ <eq:einstein>

As shown in @eq:einstein, energy and mass are equivalent.
```

### 5. Multi-line Equations
For complex derivations, use the `\` character for line breaks within a block equation.

**Example:**
```typst
$ 
  f(x) &= (x+1)^2 \
       &= x^2 + 2x + 1 
$
```

### Summary Table

| Feature | Inline Syntax | Block Syntax |
| :--- | :--- | :--- |
| **Delimiters** | `$x+y$` (No spaces) | `$ x+y $` (With spaces) |
| **Placement** | Within text | Standalone line |
| **Alignment** | Left (in-flow) | Centered (via template) |
| **Numbering** | None | Automatic (via template) |
