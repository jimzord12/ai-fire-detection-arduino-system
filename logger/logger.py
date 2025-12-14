import csv
import re
import sys
import time

import serial
from serial.serialutil import SerialException

config = {
    "filename": "voc_data.csv",
    "port": "COM5", # on Windows; on macOS/Linux: "/dev/tty.usbmodemXXXX"
    "baud": 9600,
    "columns": ["time_ms", "sensor", "value"],
    "serial_timeout_s": 1.0,
    "preflight_settle_s": 1.0,
    "preflight_timeout_s": 5.0,
    "preflight_min_valid_rows": 1,
    "preflight_max_lines": 20,
    "preflight_sample_lines": 5,
}

port = config["port"]
baud = config["baud"]


def _parse_row(line: str) -> list[str] | None:
    # Common formats:
    # - "92346,VOC,642"
    # - "92346,642"
    parts = [p.strip() for p in line.split(",")]

    if len(parts) == 3 and parts[0] and parts[2]:
        try:
            time_ms = str(int(parts[0]))
            value = str(float(parts[2]))
        except ValueError:
            return None
        sensor = parts[1]
        return [time_ms, sensor, value]

    if len(parts) == 2 and parts[0] and parts[1]:
        try:
            time_ms = str(int(parts[0]))
            value = str(float(parts[1]))
        except ValueError:
            return None
        return [time_ms, "", value]

    # Fallback: tolerate labeled output like "t=1234 voc=567".
    # Extract the first two numbers found on the line.
    numbers = re.findall(r"[-+]?\d*\.?\d+", line)
    if len(numbers) < 2:
        return None

    try:
        time_ms = str(int(float(numbers[0])))
        value = str(float(numbers[1]))
    except ValueError:
        return None
    return [time_ms, "", value]


def _preflight_check(ser: serial.Serial) -> tuple[bool, str]:
    start = time.time()
    valid_rows: list[list[str]] = []
    lines_read = 0
    bytes_read = 0
    samples: list[str] = []

    try:
        ser.reset_input_buffer()
    except Exception:
        # Not all backends support it; proceed anyway.
        pass

    while time.time() - start < float(config["preflight_timeout_s"]) and lines_read < int(
        config["preflight_max_lines"]
    ):
        raw = ser.readline()
        lines_read += 1
        if not raw:
            continue

        bytes_read += len(raw)

        try:
            line = raw.decode(errors="replace").strip()
        except Exception:
            continue
        if not line:
            continue

        if len(samples) < int(config["preflight_sample_lines"]):
            samples.append(line)

        row = _parse_row(line)
        if row is None:
            continue

        valid_rows.append(row)
        if len(valid_rows) >= int(config["preflight_min_valid_rows"]):
            return True, f"Received {len(valid_rows)} valid row(s). Sample: {','.join(valid_rows[0])}"

    if bytes_read == 0:
        return (
            False,
            f"No data received within {config['preflight_timeout_s']}s (read {lines_read} line(s), 0 bytes).",
        )

    sample_msg = ""
    if samples:
        sample_msg = " Sample line(s): " + " | ".join(samples)

    return (
        False,
        f"Data was received but no valid rows were parsed within {config['preflight_timeout_s']}s "
        f"(read {lines_read} line(s), {bytes_read} bytes).{sample_msg}",
    )

try:
    ser = serial.Serial(port, baud, timeout=float(config["serial_timeout_s"]))
except SerialException as e:
    print(f"[FAIL] Could not open serial port {port} @ {baud}: {e}")
    raise SystemExit(1)

print(f"[OK] Opened serial port {port} @ {baud}.")

# Many Arduino boards reset on serial open; give it a moment to start printing.
time.sleep(float(config["preflight_settle_s"]))

try:
    ok, msg = _preflight_check(ser)
    if not ok:
        print(f"[FAIL] Preflight check failed: {msg}")
        raise SystemExit(2)

    print(f"[OK] Preflight check passed: {msg}")
    print(f"[OK] Writing CSV to {config['filename']}...")

    with open(config["filename"], "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(config["columns"])  # header row

        try:
            while True:
                raw = ser.readline()
                if not raw:
                    continue
                line = raw.decode(errors="replace").strip()
                if not line:
                    continue
                row = _parse_row(line)
                if row is None:
                    continue
                writer.writerow(row)
                f.flush()
        except KeyboardInterrupt:
            print("\n[OK] Stopped by user (Ctrl+C).")
finally:
    try:
        ser.close()
    except Exception:
        pass
