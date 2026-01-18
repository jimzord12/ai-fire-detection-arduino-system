#!/bin/bash
# check-edge-impulse-env.sh
# Environment check for Edge Impulse + Arduino on Linux/macOS

echo -e "\n=== Edge Impulse + Arduino Environment Check ===\n"

# Helper function to print status
print_status() {
    local name="$1"
    local status="$2"
    local details="$3"
    local hint="$4"

    echo -e "[$name]"
    if [ "$status" == "FOUND" ]; then
        echo -e "  Status : \033[0;32mFOUND\033[0m"
        echo "  Details: $details"
    else
        echo -e "  Status : \033[0;33mMISSING\033[0m"
        if [ -n "$hint" ]; then
            echo -e "  How to Get: \033[0;36m$hint\033[0m"
        fi
    fi
    echo ""
}

# 1. Node.js
NODE_VER=""
if command -v node >/dev/null 2>&1; then
    NODE_VER=$(node --version)
    print_status "Node.js" "FOUND" "Version: $NODE_VER" ""
else
    print_status "Node.js" "MISSING" "" "Install from https://nodejs.org or use your package manager (e.g., 'sudo apt install nodejs')."
fi

# 2. npm
if command -v npm >/dev/null 2>&1; then
    NPM_VER=$(npm -v)
    print_status "npm" "FOUND" "Version: $NPM_VER" ""
else
    print_status "npm" "MISSING" "" "Usually comes with Node.js. Try installing 'npm' package."
fi

# 3. Python 3
if command -v python3 >/dev/null 2>&1; then
    PY_VER=$(python3 --version)
    print_status "Python 3" "FOUND" "Command: python3 ($PY_VER)" ""
elif command -v python >/dev/null 2>&1; then
    # Check if python is 3.x
    PY_VER=$(python --version 2>&1)
    if [[ "$PY_VER" == *"Python 3"* ]]; then
         print_status "Python 3" "FOUND" "Command: python ($PY_VER)" ""
    else
         print_status "Python 3" "MISSING" "" "Python found but version is not 3.x. Install Python 3."
    fi
else
    print_status "Python 3" "MISSING" "" "Install Python 3 via your package manager (e.g., 'sudo apt install python3')."
fi

# 4. Edge Impulse CLI
if command -v edge-impulse-data-forwarder >/dev/null 2>&1; then
    print_status "Edge Impulse CLI" "FOUND" "Data Forwarder is available in PATH." ""
else
    print_status "Edge Impulse CLI" "MISSING" "" "Run: npm install -g edge-impulse-cli"
fi

# 5. Build Tools (Linux equivalent of VS Build Tools C++)
if command -v g++ >/dev/null 2>&1; then
    GPP_VER=$(g++ --version | head -n 1)
    print_status "Build Tools (g++)" "FOUND" "$GPP_VER" ""
elif command -v make >/dev/null 2>&1; then
     MAKE_VER=$(make --version | head -n 1)
     print_status "Build Tools (make)" "FOUND" "$MAKE_VER" ""
else
    print_status "Build Tools" "MISSING" "" "Install build-essential or equivalent (e.g., 'sudo apt install build-essential')."
fi

# 6. Arduino IDE / CLI
ARDUINO_FOUND=false
ARDUINO_DETAILS=""

if command -v arduino >/dev/null 2>&1; then
    ARDUINO_FOUND=true
    ARDUINO_DETAILS="Found 'arduino' in PATH."
elif command -v arduino-cli >/dev/null 2>&1; then
    ARDUINO_FOUND=true
    ARDUINO_DETAILS="Found 'arduino-cli' in PATH."
elif [ -d "/usr/share/arduino" ]; then
    ARDUINO_FOUND=true
    ARDUINO_DETAILS="Found directory /usr/share/arduino"
elif [ -d "/usr/local/share/arduino" ]; then
    ARDUINO_FOUND=true
    ARDUINO_DETAILS="Found directory /usr/local/share/arduino"
fi

if [ "$ARDUINO_FOUND" = true ]; then
    print_status "Arduino IDE/CLI" "FOUND" "$ARDUINO_DETAILS" ""
else
    print_status "Arduino IDE/CLI" "MISSING" "" "Download from https://www.arduino.cc/en/software"
fi

echo "=== Summary Complete ==="
