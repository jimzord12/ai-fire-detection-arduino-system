# Detailed Guide to Installing the Latest Version of Typst on Ubuntu 24.04

Typst is a modern, markup-based typesetting system designed as a powerful and easy-to-learn alternative to LaTeX. As of January 2026, the latest stable version is **0.14.2**.

Ubuntu 24.04 (Noble Numbat) does not include Typst in its default repositories, but there are several reliable ways to install the latest version. I'll cover the most common and recommended methods below, in order of recommendation for most users:

1. **Via Snap (Easiest and Officially Recommended for Ubuntu)**
   Snap packages are sandboxed, automatically update, and work seamlessly on Ubuntu.

2. **Manual Download of Prebuilt Binary (Portable and Static-Linked)**
   Ideal if you prefer no package manager overhead or want a fully static binary.

3. **Via Cargo (Rust Package Manager)**
   Good if you already develop in Rust or want crate-based management.

4. **Build from Source**
   For developers who want the absolute cutting-edge or custom builds.

After installation, verify with `typst --version`.

### 1. Installation via Snap (Recommended for Most Ubuntu Users)

Snap is pre-installed on Ubuntu desktop editions. The official Typst Snap provides the latest version and handles updates automatically.

**Steps:**

```bash
# Update your system (optional but recommended)
sudo apt update

# Install snapd if not already present (rarely needed on desktop)
sudo apt install snapd -y

# Install Typst
sudo snap install typst
```

**Verification:**

```bash
typst --version
```

This should output something like `typst 0.14.2`.

**Notes:**
- The Snap version is currently at 0.14.2 (matching the latest release).
- Snap packages may have minor restrictions on font/package access in some cases, but they work well for standard use.

### 2. Manual Installation with Prebuilt Binary

Typst provides statically linked prebuilt binaries on GitHub releases. These are single-file executables with no dependencies.

**Prerequisites:**
Check your architecture with `uname -m`.
- `x86_64` → most common (Intel/AMD desktops/laptops).
- `aarch64` → ARM-based systems (e.g., some servers or Raspberry Pi).

**Steps for x86_64 (most users):**

```bash
# Download the latest prebuilt binary
wget -qO typst.tar.xz https://github.com/typst/typst/releases/latest/download/typst-x86_64-unknown-linux-musl.tar.xz

# Extract the binary
tar xf typst.tar.xz

# Move the binary to a system-wide location (requires sudo)
sudo mv typst-x86_64-unknown-linux-musl/typst /usr/local/bin/

# Clean up
rm -rf typst.tar.xz typst-x86_64-unknown-linux-musl
```

**For aarch64 (ARM):**

Replace the URL with:
`https://github.com/typst/typst/releases/latest/download/typst-aarch64-unknown-linux-musl.tar.xz`
And adjust the extraction folder name accordingly.

**Verification:**

```bash
typst --version
```

**Notes:**
- The `/usr/local/bin` directory is in your PATH by default.
- This binary is statically linked (musl), so it runs on any modern Linux without dependencies.
- To update later, repeat the process (or use another method).

### 3. Installation via Cargo

If you have or want the Rust toolchain, this installs from crates.io (always the latest published release).

**Steps:**

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Reload your shell to update PATH (or restart terminal)
source "$HOME/.cargo/env"

# Install the latest Typst CLI
cargo install typst-cli --locked
```

**Verification:**

```bash
typst --version
```

**Notes:**
- The binary installs to `~/.cargo/bin` (added to PATH by rustup).
- This pulls the latest version from crates.io (currently 0.14.2).
- Great for developers, as it integrates with Rust tooling.

### 4. Build from Source

For the absolute latest (including pre-release commits) or custom modifications.

**Prerequisites:** Install Rust (same as Cargo method above) and Git.

**Steps:**

```bash
# Install dependencies
sudo apt update
sudo apt install git -y

# Clone the repository
git clone https://github.com/typst/typst.git
cd typst

# Build the release binary (takes a few minutes)
cargo build --release

# Move the binary to a system-wide location
sudo cp target/release/typst /usr/local/bin/
```

**Verification:**

```bash
typst --version
```

**Notes:**
- This builds the current main branch (may be newer than 0.14.2).
- For the exact latest release, checkout the tag: `git checkout v0.14.2`.

### Final Notes

- **Choosing a Method:** Start with Snap for simplicity. Use the manual binary if you want a lightweight, dependency-free install.
- **Basic Usage Example:** Create a file `hello.typ` with:
  ```
  #set page(width: 10cm, height: auto)
  #set align(center)

  *Hello, Typst!*
  ```
  Then compile: `typst compile hello.typ`
- **Fonts and Packages:** Typst searches system fonts automatically. For packages, use `@preview/` in your documents (e.g., `#import "@preview/cetz:0.2.2": *`).
- **Updates:** For Snap, run `sudo snap refresh typst`. For others, reinstall using the same method.
- If you encounter issues, check the official GitHub repo: https://github.com/typst/typst

Enjoy typesetting with Typst! If you have questions about usage, feel free to ask.