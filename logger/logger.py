import serial, csv

config = {
    "filename": "voc_data.csv",
    "port": "COM5", # on Windows; on macOS/Linux: "/dev/tty.usbmodemXXXX"
    "baud": 9600,
    "columns": ["time_ms", "voc"]
}

port = config["port"]
baud = config["baud"]

ser = serial.Serial(port, baud)
with open(config["filename"], "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(config["columns"])   # header row

    try:
        while True:
            line = ser.readline().decode().strip()  # "1234,567"
            if not line:
                continue
            parts = line.split(",")
            if len(parts) != 2:
                continue
            writer.writerow(parts)
            f.flush()
    except KeyboardInterrupt:
        pass
