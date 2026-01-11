# **Complete Data Collection & Model Training Guide for Arduino R4 Fire Detection System**

---

## **Table of Contents**

1. Prerequisites & Required Materials
2. Hardware Setup & Wiring Diagram
3. Software Installation & Configuration
4. Edge Impulse Account & Project Setup
5. Arduino Sketch Explanation (Line-by-Line)
6. Data Collection Methodology
7. Edge Impulse Impulse Design
8. Model Training & Evaluation
9. Model Deployment to Arduino R4
10. Academic Thesis Notes & Research Sources

---

## **1. Prerequisites & Required Materials**

### 1.1 Hardware Requirements

You will need the following components for this project:[1]

- **Arduino UNO R4 WiFi** (with Renesas RA4M1 processor and ESP32-S3 WiFi module)
- **DFRobot Fermion: MEMS Smoke Detection Sensor** (10-1000ppm Range)
- **DFRobot Gravity: Analog Flame Sensor**
- **DFRobot Fermion: AHT20 Temperature and Humidity Sensor** (I2C)
- **DFRobot Fermion: VOC Gas Sensor** (1-500ppm, MEMS)
- **DFRobot Fermion: MEMS Carbon Monoxide CO Gas Detection Sensor** (5-5000ppm)
- USB-C cable for programming and power
- Breadboard and jumper wires
- Optional: External 5V power supply if all sensors draw significant current

### 1.2 Software Requirements

Before starting, you must install the following software on your computer:

- **Arduino IDE 2.x** or later (download from arduino.cc/en/software)
- **Node.js** version 14 or higher (required for Edge Impulse CLI)
- **Edge Impulse CLI tools** (installed via npm after Node.js)
- A modern web browser (Chrome, Firefox, or Edge)

### 1.3 Knowledge Prerequisites

This guide assumes you:

- Can open Arduino IDE and upload sketches to boards
- Can open a terminal/command prompt on your operating system
- Have basic understanding of sensors (even if you don't know the details)
- Have an internet connection for data upload

---

## **2. Hardware Setup & Wiring Diagram**

### 2.1 Understanding Arduino R4 WiFi Pins

The Arduino UNO R4 WiFi maintains the classic UNO form factor with 5V I/O compatibility. Key pins you'll use:[2][1]

- **Analog Pins A0-A5**: Read voltage levels from 0-5V as digital values (0-1023)
- **I2C Pins (SDA/SCL)**: Digital communication protocol for the AHT20 sensor
- **5V Pin**: Provides 5V power to sensors
- **GND Pin**: Common ground reference

### 2.2 Detailed Wiring Instructions

Connect each sensor as follows. **Important**: Double-check polarity before powering on to avoid damage.

#### Smoke Sensor (MEMS Smoke Detection)

- **VCC** → Arduino **5V**
- **GND** → Arduino **GND**
- **AOUT** (Analog Output) → Arduino **A0**

#### Flame Sensor (Analog Flame Sensor)

- **VCC** → Arduino **5V**
- **GND** → Arduino **GND**
- **AOUT** → Arduino **A1**

#### VOC Sensor (Volatile Organic Compounds)

- **VCC** → Arduino **5V**
- **GND** → Arduino **GND**
- **AOUT** → Arduino **A2**

#### CO Sensor (Carbon Monoxide)

- **VCC** → Arduino **5V**
- **GND** → Arduino **GND**
- **AOUT** → Arduino **A3**

#### AHT20 Temperature/Humidity Sensor

- **VCC** → Arduino **5V**
- **GND** → Arduino **GND**
- **SDA** → Arduino **SDA** (labeled on board)
- **SCL** → Arduino **SCL** (labeled on board)

### 2.3 Verification Steps

After wiring:

1. Visually inspect all connections against the list above
2. Ensure no wires are touching each other (causing shorts)
3. Verify power (5V) and ground (GND) are not reversed on any sensor
4. Connect USB cable to Arduino and your computer

---

## **3. Software Installation & Configuration**

### 3.1 Installing Arduino IDE

If you haven't already:

1. Visit https://www.arduino.cc/en/software
2. Download Arduino IDE 2.x for your operating system (Windows, Mac, or Linux)
3. Install following on-screen instructions
4. Launch Arduino IDE

### 3.2 Installing Arduino Board Support

The Arduino R4 WiFi requires board definitions:

1. Open Arduino IDE
2. Go to **Tools** → **Board** → **Boards Manager**
3. In the search box, type: `Arduino UNO R4`
4. Find "Arduino UNO R4 Boards" by Arduino
5. Click **Install** (this downloads Renesas core files)
6. Wait for installation to complete (may take 2-5 minutes)
7. Once complete, go to **Tools** → **Board** and select **Arduino UNO R4 WiFi**

### 3.3 Installing Required Arduino Libraries

You need one library for the AHT20 sensor:

1. In Arduino IDE, go to **Tools** → **Manage Libraries...**
2. In the search box, type: `DFRobot_AHT20`
3. Find the library by DFRobot
4. Click **Install**
5. Close the Library Manager

**Note**: The analog sensors (Smoke, Flame, VOC, CO) do not require libraries because we read them using `analogRead()`, which is built into Arduino.

### 3.4 Installing Node.js

Edge Impulse CLI requires Node.js:[3]

1. Visit https://nodejs.org/
2. Download the **LTS version** (Long Term Support) for your OS
3. Run the installer
4. Accept default options during installation
5. Verify installation by opening a terminal/command prompt and typing:
   ```
   node --version
   ```
   You should see a version number like `v20.x.x`

### 3.5 Installing Edge Impulse CLI

With Node.js installed, now install the Edge Impulse command-line tools:[4][3]

1. Open a terminal/command prompt
2. Run this command:
   ```
   npm install -g edge-impulse-cli
   ```
   (The `-g` flag installs globally so you can use it anywhere)
3. Wait for installation (may take 1-2 minutes)
4. Verify by running:
   ```
   edge-impulse-data-forwarder --version
   ```
   You should see a version number

**Troubleshooting**: If you get permission errors on Mac/Linux, try:

```
sudo npm install -g edge-impulse-cli
```

---

## **4. Edge Impulse Account & Project Setup**

### 4.1 Creating an Edge Impulse Account

1. Visit https://studio.edgeimpulse.com/
2. Click **Sign Up** (top right)
3. Enter your email and create a password, or sign up with Google/GitHub
4. Verify your email if prompted
5. You'll be taken to the Edge Impulse Studio dashboard

### 4.2 Creating a New Project

1. In Edge Impulse Studio, click **Create new project** (big green button)
2. Enter a project name: `Fire_Detection_R4` (or your preferred name)
3. Select project type: **Developer** (this is the free tier)
4. Click **Create project**
5. You'll see an empty project dashboard

### 4.3 Obtaining Your API Key

This is the **critical step** you need for the CLI tools to connect:[5][6][7]

1. In your project, look at the top navigation bar
2. Click on the **Keys** tab (it's between "Dashboard" and "Versioning")
3. You'll see a section titled "API keys"
4. There should be a default key that starts with `ei_` followed by many characters
5. **Double-click** on the API key to highlight it
6. **Right-click** and select **Copy** (or use Ctrl+C / Cmd+C)
7. **Save this key** in a text file on your computer for later use

**Important**: This API key is like a password. Don't share it publicly. Anyone with this key can access your project.[5]

### 4.4 Understanding Your Project Dashboard

Your Edge Impulse project has several tabs:[6]

- **Dashboard**: Overview and API keys
- **Data acquisition**: Where collected sensor data appears
- **Impulse design**: Where you configure the ML pipeline
- **Live classification**: Test your model in real-time
- **Deployment**: Export the model to Arduino
- **Versioning**: Track changes to your project

We'll use these tabs in sequence as we build the system.

---

## **5. Arduino Sketch Explanation (Line-by-Line)**

### 5.1 Complete Code

Copy this entire sketch into Arduino IDE:

```cpp
#include <DFRobot_AHT20.h>

// ========== PIN DEFINITIONS ==========
// Analog sensors connected to Arduino analog pins
const int PIN_SMOKE = A0;  // MEMS Smoke sensor analog output
const int PIN_FLAME = A1;  // Flame sensor analog output
const int PIN_VOC   = A2;  // VOC sensor analog output
const int PIN_CO    = A3;  // CO sensor analog output

// ========== SENSOR OBJECTS ==========
DFRobot_AHT20 aht20;  // Temperature/Humidity sensor object

// ========== TIMING VARIABLES ==========
unsigned long last_interval_ms = 0;  // Tracks last sample time
const unsigned long SAMPLE_INTERVAL = 100;  // 100ms = 10Hz sampling rate

void setup() {
  // ========== SERIAL COMMUNICATION ==========
  Serial.begin(115200);  // High baud rate for fast data transfer
  while (!Serial);        // Wait for serial port to connect (only needed for some boards)

  // ========== INITIALIZE I2C SENSOR ==========
  // AHT20 uses I2C communication protocol
  if (aht20.begin() != 0) {
    // If sensor initialization fails, print error
    // Note: We still continue running to avoid blocking other sensors
    Serial.println("AHT20 init failed");
  }

  // Optional: Print header row for debugging (comment out for data forwarder)
  // Serial.println("smoke,flame,temp,hum,voc,co");
}

void loop() {
  // ========== NON-BLOCKING TIMING ==========
  // This checks if 100ms have passed since last sample
  if (millis() - last_interval_ms >= SAMPLE_INTERVAL) {
    last_interval_ms = millis();  // Reset timer

    // ========== READ ANALOG SENSORS ==========
    // analogRead() returns 0-1023 (10-bit ADC on Arduino R4)
    // These are RAW values; Edge Impulse will normalize them
    int smoke = analogRead(PIN_SMOKE);
    int flame = analogRead(PIN_FLAME);
    int voc   = analogRead(PIN_VOC);
    int co    = analogRead(PIN_CO);

    // ========== READ I2C SENSOR ==========
    float temp = 0.0;
    float hum = 0.0;

    // Trigger a measurement from AHT20
    if (aht20.startMeasurement()) {
      // If measurement succeeds, read temperature and humidity
      temp = aht20.getTemperature_C();  // Returns temperature in Celsius
      hum = aht20.getHumidity_RH();     // Returns relative humidity (0-100%)
    }
    // If measurement fails, temp and hum remain 0.0

    // ========== OUTPUT DATA ==========
    // Edge Impulse Data Forwarder expects comma-separated values
    // Format: smoke,flame,temp,hum,voc,co
    // IMPORTANT: No spaces, and newline at the end
    Serial.print(smoke); Serial.print(",");
    Serial.print(flame); Serial.print(",");
    Serial.print(temp, 2);  // Print temp with 2 decimal places
    Serial.print(",");
    Serial.print(hum, 2);   // Print humidity with 2 decimal places
    Serial.print(",");
    Serial.print(voc);   Serial.print(",");
    Serial.println(co);  // println adds newline character
  }

  // Loop continues immediately - no delay()!
  // This allows Arduino to process other tasks if needed
}
```

### 5.2 Code Explanation by Section

#### Why 115200 Baud Rate?

```cpp
Serial.begin(115200);
```

We use 115200 bits/second (baud) because we're sending data 10 times per second with 6 sensor values each. This requires high bandwidth. Standard 9600 baud would be too slow and cause data loss.

#### Why `millis()` Instead of `delay()`?

```cpp
if (millis() - last_interval_ms >= SAMPLE_INTERVAL) {
```

The `millis()` function returns milliseconds since Arduino started. By checking if 100ms have passed, we sample at exactly 10Hz **without blocking** the processor. Using `delay(100)` would freeze the Arduino and prevent WiFi or other tasks from running.[8][9]

#### Why Raw Analog Values?

```cpp
int smoke = analogRead(PIN_SMOKE);
```

We send raw `analogRead()` values (0-1023) instead of converting to ppm (parts per million) because Edge Impulse's neural network performs its own normalization during training. This saves Arduino processing power and allows the model to learn the optimal scaling.[10]

#### Why This Specific Data Format?

```cpp
Serial.print(smoke); Serial.print(",");
```

The Edge Impulse Data Forwarder expects **comma-separated values** with **no spaces** and a **newline at the end**. This CSV format is standard for time-series data ingestion.[3][4]

### 5.3 Uploading the Sketch

1. Connect your Arduino R4 WiFi via USB
2. In Arduino IDE, select **Tools** → **Port** → (choose the port showing "Arduino UNO R4 WiFi")
3. Click the **Upload** button (right arrow icon)
4. Wait for "Upload complete" message
5. Open **Tools** → **Serial Monitor**
6. Set baud rate to **115200** (bottom-right dropdown)
7. You should see data streaming like:
   ```
   523,1015,23.45,45.23,412,678
   524,1014,23.46,45.25,413,679
   ```

If you see data, **hardware and code are working correctly!** If not, check:

- Correct port selected
- Baud rate is 115200
- Sensors are wired correctly
- AHT20 error messages (if any)

---

## **6. Data Collection Methodology**

### 6.1 Understanding the Classes

You will collect **3 types of data**:

1. **Idle (No Fire)**: Normal indoor environment with no smoke, flame, or unusual gases
2. **Fire**: Active fire conditions with visible flame, smoke, rising temperature, and combustion gases
3. **Noise**: Ambiguous scenarios that might confuse the model (cooking, steam, aerosols, bright lights)

These three classes allow the neural network to distinguish real fires from false alarms.[9][8]

### 6.2 Connecting to Edge Impulse Data Forwarder

Now we'll send live Arduino data to your Edge Impulse project:[4][3]

1. **Keep Arduino connected** via USB with the sketch running
2. **Close the Arduino Serial Monitor** (the Data Forwarder needs exclusive serial access)
3. Open a terminal/command prompt
4. Navigate to any directory (it doesn't matter where)
5. Run this command:
   ```
   edge-impulse-data-forwarder
   ```

> See `thesis_ideas.md` at Environment Setup for Windows 11 Troubleshooting

#### First-Time Setup Prompts

You'll see several questions:

**Prompt 1**: "What is your user name or e-mail address?"

- Enter the email you used for Edge Impulse Studio
- Press Enter

**Prompt 2**: "What is your password?"

- Enter your Edge Impulse password
- Press Enter (password won't be visible while typing)

**Prompt 3**: "To which project do you want to add this device?"

- Use arrow keys to select your `Fire_Detection_R4` project
- Press Enter

**Prompt 4**: "Which serial port is your device on?"

- Select the port showing your Arduino (same as in Arduino IDE)
- Press Enter

**Prompt 5**: "6 sensor axes detected. What do you want to call them?"

- This is **critical**. Type exactly: `smoke, flame, temp, hum, voc, co`
- Press Enter

**Prompt 6**: "What name do you want to give this device?"

- Type: `Arduino_R4_Fire` (or any name you prefer)
- Press Enter

#### Successful Connection

You should see:

```
[WS] Device connected to Edge Impulse
Waiting for data...
```

Now data is streaming to Edge Impulse! Leave this terminal window open.

### 6.3 Collecting "Idle" Class Data

This represents normal, safe conditions with no fire:[8]

1. Place your Arduino and sensors on a desk in a quiet room
2. Ensure no smoke, flames, or strong odors nearby
3. In your web browser, go to Edge Impulse Studio
4. Click on **Data acquisition** tab (left sidebar)
5. You should see your device `Arduino_R4_Fire` listed under "Devices"
6. Set these parameters:
   - **Label**: Type `Idle`
   - **Sample length**: `60000` ms (60 seconds)
   - **Sensor**: Should show "6 axes" (your sensors)
   - **Category**: Leave as "Training"
7. Click **Start sampling**
8. Wait 60 seconds while data is collected
9. The sample will appear in the "Collected data" section below
10. Repeat this **5 times** to get 5 minutes of Idle data

**Tips**:

- Keep sensors stationary
- Avoid touching them during collection
- Room should have normal temperature (20-25°C) and humidity (30-60%)

### 6.4 Collecting "Fire" Class Data

This represents actual fire conditions. **SAFETY FIRST!**[9][8]

#### Safety Precautions

- Perform outdoors or in a well-ventilated area
- Have a fire extinguisher or water bucket nearby
- Never leave fire unattended
- Keep flammable materials away
- Have an adult present if you're under 18

#### Collection Procedure

**Setup**:

1. Place Arduino on a stable, fire-resistant surface (concrete, metal table)
2. Position sensors 20-30 cm away from where you'll place the fire
3. Prepare a small, controlled fire source:
   - Option A: Candle in a metal container
   - Option B: Small piece of paper in an aluminum pan
   - Option C: Incense stick (for smoke)

**Collection**:

1. In Edge Impulse Studio, **Data acquisition** tab
2. Set parameters:
   - **Label**: `Fire`
   - **Sample length**: `60000` ms (60 seconds)
   - **Sensor**: 6 axes
   - **Category**: Training
3. **Start the fire source first** (light candle/paper)
4. **Then immediately click** "Start sampling"
5. Let it record for 60 seconds
6. After recording, **extinguish the fire safely**
7. Wait 2-3 minutes for sensors to return to baseline
8. Repeat **5 times** with variations:
   - Different fire sizes (small candle vs. larger flame)
   - Different positions (left, right, above sensors)
   - Different materials (paper, wood, wax)

**What You're Capturing**:

- **Flame sensor**: Detects infrared radiation from flame
- **Smoke sensor**: Detects particles in air
- **CO sensor**: Detects carbon monoxide from combustion
- **VOC sensor**: Detects organic gases from burning materials
- **Temperature**: Rises from heat
- **Humidity**: Often drops when temperature rises

### 6.5 Collecting "Noise" Class Data

This represents scenarios that might trigger false alarms:[11][12]

1. **Steam**: Boil water in a kettle near sensors (60 seconds)
2. **Cooking**: Fry food on a pan (smoke without fire) (60 seconds)
3. **Aerosols**: Spray air freshener or deodorant near sensors (60 seconds)
4. **Bright Light**: Shine a flashlight or lighter (no flame) at flame sensor (60 seconds)
5. **Hair Dryer**: Blow hot air at sensors (60 seconds)

For each scenario:

1. In Data acquisition tab
2. Label: `Noise`
3. Sample length: 60000 ms
4. Category: Training
5. Start sampling
6. Perform the activity
7. Wait for completion

**Goal**: The model learns these patterns are **not fire**, reducing false positives.

### 6.6 Data Collection Summary

After completing all collections, you should have:

- **Idle**: 5 samples × 60 seconds = 5 minutes
- **Fire**: 5 samples × 60 seconds = 5 minutes
- **Noise**: 5 samples × 60 seconds = 5 minutes
- **Total**: 15 minutes of labeled time-series data

### 6.7 Splitting Data into Train/Test Sets

Edge Impulse needs separate training and testing data:[13][14][15]

1. Go to **Data acquisition** tab
2. Scroll down to see all your samples
3. Find 1-2 samples from **each class** (Idle, Fire, Noise)
4. Click the **three dots (- - - )** on the right side of each sample
5. Select **Move to test set**
6. Verify: You should now have ~80% in "Training data" and ~20% in "Test data"

**Why?** The model trains on training data, but we validate performance on test data it has never seen before. This prevents overfitting.[14][16]

---

## **7. Edge Impulse Impulse Design**

### 7.1 What is an "Impulse"?

An Impulse is Edge Impulse's term for the complete machine learning pipeline. It consists of three blocks:[17]

1. **Input Block**: Defines data format and windowing
2. **Processing Block (DSP)**: Extracts features from raw data
3. **Learning Block**: The neural network that classifies features

### 7.2 Creating the Impulse

1. In Edge Impulse Studio, click **Impulse design** (left sidebar)
2. Click **Create impulse**

#### Input Block Configuration

You'll see an "Input block" box:

- **Window size**: Set to `2000` ms (2 seconds)
  - This means the model analyzes 2-second chunks of data at a time
- **Window increase**: Set to `500` ms (0.5 seconds)
  - This is the "sliding window" step size
  - A 60-second sample will be split into multiple 2-second windows with overlap
- **Frequency**: Should show `10 Hz` (because our Arduino samples at 10Hz)

**Why 2 seconds?** Fire characteristics evolve over seconds, not milliseconds. A 2-second window captures enough temporal context for the model to detect patterns (e.g., rising temperature).[18][8]

#### Processing Block Selection

1. Click **Add a processing block**
2. You'll see several options. Select **Spectral Analysis**[19][17][18]

**What is Spectral Analysis?** It extracts both **time-domain** (RMS, kurtosis, skewness) and **frequency-domain** features (FFT spectral power) from your sensor data. This helps the model detect:[18][19]

- Slow trends (temperature rising)
- Fast oscillations (flame sensor flicker)
- Statistical properties (variance in gas readings)

#### Learning Block Selection

1. Click **Add a learning block**
2. Select **Classification (Keras)**[20][17]

This is a neural network that will learn to map extracted features to your three classes (Idle, Fire, Noise).

#### Save Impulse

1. Scroll to the top
2. Click **Save Impulse**

Your pipeline is now configured! You should see a flow diagram showing:

```
Time series data → Spectral Analysis → Neural Network → Classification output
```

### 7.3 Configuring Spectral Features

1. In the left sidebar under "Impulse design", click **Spectral features**
2. You'll see parameters for the DSP block:[19]

#### Key Parameters

- **Filter**: Set to `none` (we want all sensor data)
  - Filters can remove noise, but our data is already clean
- **FFT length**: Leave at default (256 or 512)
  - This determines frequency resolution
- **Spectral power edges**: Leave at default
  - These define frequency bands for feature extraction

**Important**: For slow-moving environmental data like temperature and gas sensors, the time-domain features (RMS, skewness) are often more important than frequency features. However, the flame sensor might have high-frequency flicker, so we keep both.[18]

#### Generate Features

1. Scroll down
2. Click **Generate features**
3. Wait 30-60 seconds while Edge Impulse processes all your training data
4. You'll see a **Feature explorer** visualization:
   - Each dot represents a 2-second window from your training data
   - Colors represent classes (Idle, Fire, Noise)
   - **Good sign**: If clusters are separated, your sensors capture meaningful differences
   - **Bad sign**: If clusters overlap completely, sensors can't distinguish classes

**Analysis**: Look at the feature explorer. Are the three classes visually separated? If yes, proceed. If they're completely mixed, you may need to collect more varied data.[8][9]

### 7.4 Configuring the Neural Network

1. In the left sidebar under "Impulse design", click **NN Classifier**
2. You'll see the neural network configuration page[20]

#### Neural Network Architecture

Edge Impulse provides a default architecture suitable for most time-series classification tasks. You'll see:

- **Number of training cycles**: `100` (epochs)
  - How many times the model sees the entire training dataset
- **Learning rate**: `0.0005` (default)
  - Controls how quickly the model updates weights
- **Validation set size**: `20%`
  - 20% of training data is used for validation during training

#### Advanced Settings (Optional)

Click **Show advanced settings** to see:

- **Neural network architecture**: Shows layer structure
  - Typical: Dense layers with dropout for regularization
  - Example: `Dense(20, ReLU) → Dropout(0.25) → Dense(10, ReLU) → Dense(3, Softmax)`
  - The final layer has 3 neurons (one per class)
- **Data augmentation**: Disabled by default for sensor fusion
  - For time-series, augmentation might add noise or time warping

**For beginners**: Leave these at default values. The defaults work well for sensor fusion.[20]

#### Start Training

1. Scroll to the bottom
2. Click **Start training**
3. Wait 2-5 minutes while the model trains
4. You'll see a training progress graph showing:
   - **Training loss**: Should decrease over epochs
   - **Validation loss**: Should decrease similarly
   - If validation loss increases while training decreases, this indicates overfitting

#### Interpret Results

After training completes, you'll see:

- **Accuracy**: Percentage of correct classifications (aim for >85%)
- **Loss**: Lower is better (aim for <0.5)
- **Confusion matrix**: Shows how each class was classified
  - Diagonal values (top-left to bottom-right) should be high
  - Off-diagonal values indicate misclassifications

**Example Good Confusion Matrix**:

```
              Predicted:
Actual:       Idle  Fire  Noise
Idle          95%   2%    3%
Fire          1%    93%   6%
Noise         5%    3%    92%
```

If accuracy is low (<70%), you may need:

- More training data
- More varied scenarios
- Different DSP block settings
- Network architecture adjustments

### 7.5 Testing the Model

1. In the left sidebar, click **Model testing**
2. Click **Classify all**
3. Edge Impulse will run the model on your **test set** (data the model has never seen)
4. You'll see:
   - **Test accuracy**: Should be similar to training accuracy
   - **Per-sample results**: Shows classification for each test sample

**Analysis**: If test accuracy is much lower than training accuracy, the model overfit to training data. Solutions:[16][21]

- Add more test data
- Use data augmentation
- Simplify neural network architecture

---

## **8. Model Deployment to Arduino R4**

### 8.1 Building the Arduino Library

1. In Edge Impulse Studio, click **Deployment** (left sidebar)
2. You'll see various deployment options
3. Find and select **Arduino library**
4. Select optimization: **Quantized (int8)**
   - This converts the model to 8-bit integers for faster inference on microcontrollers
   - **Critical for Cortex-M4** like Arduino R4's Renesas RA4M1
5. Click **Build**
6. A `.zip` file will download (e.g., `ei-fire_detection_r4-arduino-1.0.0.zip`)

### 8.2 Installing the Library in Arduino IDE

1. Open Arduino IDE
2. Go to **Sketch** → **Include Library** → **Add .ZIP Library...**
3. Navigate to your Downloads folder
4. Select the downloaded `.zip` file
5. Click **Open**
6. You'll see "Library installed" confirmation

### 8.3 Deployment Sketch

Now create a new sketch that runs inference:

```cpp
// Include the Edge Impulse library (name varies by project)
#include <Fire_Detection_R4_inferencing.h>
#include <DFRobot_AHT20.h>

// Sensor pins
const int PIN_SMOKE = A0;
const int PIN_FLAME = A1;
const int PIN_VOC   = A2;
const int PIN_CO    = A3;

DFRobot_AHT20 aht20;

// Buffer to hold sensor readings for inference
float features[EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE];
int feature_ix = 0;

void setup() {
  Serial.begin(115200);
  while (!Serial);

  if (aht20.begin() != 0) {
    Serial.println("AHT20 init failed");
  }

  Serial.println("Edge Impulse Fire Detection System");
}

void loop() {
  // Read sensors (same as before)
  int smoke = analogRead(PIN_SMOKE);
  int flame = analogRead(PIN_FLAME);
  float temp = 0, hum = 0;
  if (aht20.startMeasurement()) {
    temp = aht20.getTemperature_C();
    hum = aht20.getHumidity_RH();
  }
  int voc = analogRead(PIN_VOC);
  int co = analogRead(PIN_CO);

  // Fill feature buffer
  features[feature_ix++] = smoke;
  features[feature_ix++] = flame;
  features[feature_ix++] = temp;
  features[feature_ix++] = hum;
  features[feature_ix++] = voc;
  features[feature_ix++] = co;

  // When buffer is full, run inference
  if (feature_ix >= EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE) {
    feature_ix = 0;

    // Create signal from features
    signal_t signal;
    numpy::signal_from_buffer(features, EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE, &signal);

    // Run classifier
    ei_impulse_result_t result;
    EI_IMPULSE_ERROR res = run_classifier(&signal, &result, false);

    if (res != 0) {
      Serial.print("Error running classifier: ");
      Serial.println(res);
      return;
    }

    // Print predictions
    Serial.println("Predictions:");
    for (size_t ix = 0; ix < EI_CLASSIFIER_LABEL_COUNT; ix++) {
      Serial.print(result.classification[ix].label);
      Serial.print(": ");
      Serial.print(result.classification[ix].value, 3);
      Serial.println();
    }

    // Decision logic
    if (result.classification[1].value > 0.80) {  // Assuming Fire is index 1
      Serial.println("🚨 FIRE DETECTED!");
      // Trigger alarm (GPIO pin, buzzer, WiFi alert, etc.)
    }
  }

  delay(100);  // 10Hz sampling
}
```

### 8.4 Upload and Test

1. Upload this sketch to your Arduino R4
2. Open Serial Monitor (115200 baud)
3. You should see predictions like:
   ```
   Predictions:
   Idle: 0.923
   Fire: 0.042
   Noise: 0.035
   ```
4. Test by introducing fire conditions (safely!)
5. Watch for "Fire" probability to rise above 0.80

### 8.5 Alert Integration

Add alert mechanisms:

- **Visual**: Connect an LED to a digital pin, turn on when fire detected
- **Audible**: Connect a piezo buzzer for alarm sound
- **WiFi**: Use Arduino R4's ESP32 module to send HTTP/MQTT alerts
- **SMS/Email**: Integrate with services like Twilio or SendGrid

Example LED alert:

```cpp
const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  // ... rest of setup
}

void loop() {
  // ... after classification
  if (result.classification[1].value > 0.80) {
    digitalWrite(LED_PIN, HIGH);  // Turn on LED
  } else {
    digitalWrite(LED_PIN, LOW);   // Turn off LED
  }
}
```

---

## **9. Academic Thesis Notes & Research Sources**

### 9.1 Key Concepts for Your Thesis

#### Chapter 1: Introduction to Fire Detection Systems

**Traditional Approaches vs. AI-Based Methods**:

- **Threshold-based detectors**: Use single-sensor thresholds (e.g., smoke > 200ppm triggers alarm)[12]
- **Limitations**: High false alarm rates (30-90% of fire alarms are false) due to cooking, steam, dust[11][12]
- **Sensor Fusion**: Combining multiple sensor modalities (thermal, optical, chemical) improves reliability[22][23][24]
- **Machine Learning**: Neural networks learn complex correlations between sensors that humans can't program explicitly[20][8]

**Keywords**: Fire Detection, False Alarm Reduction, Multi-Sensor Fusion, TinyML, Edge Computing

#### Chapter 2: Sensor Technologies for Fire Detection

**MEMS Gas Sensors** (Your smoke, VOC, CO sensors):

- Metal-Oxide-Semiconductor (MOx) technology
- Chemical reactions change electrical resistance
- Sensitivity ranges: Smoke (10-1000ppm), VOC (1-500ppm), CO (5-5000ppm)
- Response time: 2-10 seconds for MOx sensors
- **Source**: DFRobot technical datasheets, Figaro Engineering gas sensor application notes

**Infrared Flame Detection**:

- Detects IR radiation at wavelengths 4.3-4.4 μm (carbon dioxide emission from flames)
- Analog output proportional to IR intensity
- **Limitations**: Sunlight, halogen lamps, and reflections cause false positives[25]
- **Source**: "Fire Detection Using Flame-Color, Flickering, and Spatial-Temporal Analysis" (academic papers)

**Temperature/Humidity Sensors** (AHT20):

- Capacitive humidity sensing + NTC thermistor
- Accuracy: ±0.3°C for temperature, ±2% RH for humidity
- Fire signatures: Rapid temperature rise (>2°C/min), humidity drop (moisture evaporates)
- **Source**: AOSONG Electronics AHT20 datasheet

#### Chapter 3: Edge Computing and TinyML

**Why Edge AI?**:

- **Latency**: Cloud inference adds 100-500ms delay; fire detection needs <1 second response[26]
- **Privacy**: Sensor data stays on-device
- **Reliability**: Works without internet connection
- **Power**: Low-power microcontrollers vs. power-hungry cloud servers

**Renesas RA4M1 Microcontroller** (Arduino R4's processor):

- ARM Cortex-M4 core at 48 MHz
- 256 KB Flash, 32 KB SRAM
- Hardware floating-point unit (FPU) for efficient neural network inference
- **Source**: Renesas RA4M1 Group Datasheet

**Quantization**:

- Full-precision (float32) models: 4 bytes per weight
- Int8 quantized models: 1 byte per weight (4× smaller, 2-4× faster)
- Accuracy loss: Typically <2% with proper quantization-aware training[21]
- **Source**: "Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference" (Google Research paper)

#### Chapter 4: Machine Learning Pipeline

**Data Collection Strategy**:

- **Balanced datasets**: Equal samples per class prevent model bias[27][28]
- **Temporal windows**: 2-second windows capture fire dynamics (temperature rise rate, gas accumulation)[18][8]
- **Sampling frequency**: 10 Hz sufficient for environmental sensors (Nyquist theorem: sample at 2× highest frequency of interest)[8]

**Feature Extraction (DSP Block)**:

- **Spectral Analysis**: Combines time-domain and frequency-domain features[19][18]
- **Time-domain features**: RMS (signal energy), Skewness (asymmetry), Kurtosis (tail heaviness)
- **Frequency-domain features**: FFT extracts periodic components (e.g., flame flicker at 5-15 Hz)
- **Why not raw data?**: Feature extraction reduces dimensionality (20-50 features vs. 1200 raw samples), improving generalization[17]

**Neural Network Architecture**:

- **Dense (Fully Connected) layers**: Standard for tabular/feature data
- **Dropout regularization**: Randomly disables neurons during training to prevent overfitting[20]
- **Softmax activation**: Output layer converts logits to probabilities (sum to 1.0)[20]
- **Categorical cross-entropy loss**: Standard loss function for multi-class classification

**Training Hyperparameters**:

- **Learning rate**: Controls step size during gradient descent (typical: 0.0001-0.001)
- **Batch size**: Number of samples per training iteration (typical: 16-64)
- **Epochs**: Full passes through training data (typical: 50-200)
- **Early stopping**: Stops training if validation loss doesn't improve for N epochs[20]

#### Chapter 5: Evaluation Metrics

**Confusion Matrix Analysis**:

- **True Positives (TP)**: Correctly detected fires
- **False Positives (FP)**: False alarms (most critical to minimize)
- **False Negatives (FN)**: Missed fires (most dangerous)
- **True Negatives (TN)**: Correctly identified non-fire scenarios

**Derived Metrics**:

- **Precision**: TP / (TP + FP) — "Of all fire alarms, how many were real?"
- **Recall (Sensitivity)**: TP / (TP + FN) — "Of all real fires, how many did we detect?"
- **F1-Score**: Harmonic mean of precision and recall
- **For fire detection**: Prioritize high recall (don't miss fires) while maintaining acceptable precision (minimize false alarms)

**Source**: "Performance Evaluation of Machine Learning Models for Fire Detection" (various IEEE papers)

#### Chapter 6: Real-World Deployment Considerations

**False Alarm Reduction Techniques**:

1. **Temporal filtering**: Require Fire probability >0.8 for 5 consecutive readings (5 seconds) before triggering alarm[12][11]
2. **Sensor redundancy**: Require agreement from at least 3 of 5 sensors
3. **Environmental context**: Adjust thresholds based on time of day, location (kitchen vs. bedroom)

**Power Consumption**:

- Active inference: ~50-100 mA at 5V (Arduino R4)
- Sleep modes: <1 mA with periodic wake-up
- Battery life estimates: 10,000 mAh battery → 100-200 hours continuous operation

**Maintenance**:

- MEMS sensors degrade over 2-5 years (gas sensitivity decreases)
- Calibration: Periodic exposure to clean air resets baseline
- Firmware updates: Over-The-Air (OTA) via WiFi for model improvements

### 9.2 Academic Keywords for Literature Search

Use these search terms on **Google Scholar**, **IEEE Xplore**, **ACM Digital Library**:

- "Multi-sensor fire detection machine learning"
- "TinyML embedded fire detection"
- "Sensor fusion artificial neural networks fire"
- "Edge computing IoT fire safety"
- "False alarm reduction fire detection systems"
- "MEMS gas sensor fire detection"
- "Spectral features time-series classification"
- "Quantized neural networks microcontrollers"

### 9.3 Recommended Academic Papers & Sources

**Fire Detection Research**:

1. "Fire Detection and Management through a Multi-Sensor Network for the Protection of Cultural Heritage Areas from the Risk of Fire and Extreme Weather Conditions"[29]
2. "An Indoor Fire Detection Method Based on Multi-Sensor Fusion and a Lightweight Convolutional Neural Network"[24]
3. "Real-time fire and smoke detection system for diverse environmental conditions using YOLOv5 optimization"[26]

**TinyML and Edge AI**: 4. Edge Impulse Documentation: "Data Acquisition for Time-Series Data"[30] 5. "Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference" (Google Research, arXiv:1712.05877) 6. "TinyML: Machine Learning with TensorFlow Lite on Arduino and Ultra-Low-Power Microcontrollers" (O'Reilly book)

**Sensor Technologies**: 7. DFRobot Wiki: Technical specifications for MEMS sensors (company website) 8. Figaro Engineering: "Gas Sensor Technology Overview" (white paper) 9. Renesas: "RA4M1 Group User's Manual: Hardware" (official datasheet)

**Machine Learning Theory**: 10. "Deep Learning" by Goodfellow, Bengio, Courville (MIT Press) — Chapters 6-8 (Neural Networks) 11. "Pattern Recognition and Machine Learning" by Bishop — Chapter 5 (Neural Networks)

### 9.4 Thesis Structure Recommendation

**Suggested 50-70 Page Thesis Outline**:

1. **Introduction** (5-7 pages)

   - Problem statement: Fire safety statistics, false alarm costs
   - Research objectives
   - Thesis organization

2. **Literature Review** (10-12 pages)

   - Traditional fire detection methods
   - Machine learning in fire detection
   - Edge computing and TinyML
   - Gap analysis: Why sensor fusion + TinyML is novel

3. **Theoretical Background** (8-10 pages)

   - Sensor physics (MOx, IR, capacitive humidity)
   - Neural network fundamentals
   - DSP and feature extraction
   - Quantization techniques

4. **System Design** (10-12 pages)

   - Hardware architecture (Arduino R4, sensors)
   - Software architecture (Edge Impulse pipeline)
   - Data collection methodology
   - Model training procedure

5. **Implementation** (8-10 pages)

   - Code walkthrough (Arduino sketches)
   - Edge Impulse configuration details
   - Deployment process

6. **Results and Evaluation** (8-10 pages)

   - Training accuracy, test accuracy, confusion matrix
   - Real-world testing scenarios
   - False alarm analysis
   - Performance benchmarks (inference time, memory usage)

7. **Discussion** (5-7 pages)

   - Interpretation of results
   - Comparison with existing systems
   - Limitations and challenges
   - Future improvements (more sensors, larger dataset, online learning)

8. **Conclusion** (2-3 pages)

   - Summary of contributions
   - Practical implications
   - Future research directions

9. **References** (2-3 pages)

   - Cite all papers, datasheets, and Edge Impulse documentation

10. **Appendices** (Optional, 5-10 pages)
    - Full Arduino code listings
    - Sensor datasheets excerpts
    - Additional confusion matrices
    - Raw training logs

### 9.5 Writing Tips for Engineering Thesis

- **Be quantitative**: Always include numbers (accuracy: 92.3%, inference time: 47ms, memory: 84KB)
- **Cite everything**: Datasheets, papers, documentation, even if online sources
- **Use diagrams**: Block diagrams, flowcharts, circuit schematics, and training curves
- **Explain trade-offs**: Why 10Hz vs. 100Hz? Why 2-second windows vs. 5-second?
- **Compare alternatives**: Why neural networks vs. random forests? Why Edge Impulse vs. TensorFlow Lite?
- **Reproducibility**: Provide enough detail that another engineer could replicate your work

### 9.6 Citation Examples (IEEE Format)

```
[1] E. Galea et al., "Fire Detection and Management through a Multi-Sensor Network for the Protection of Cultural Heritage Areas," European Commission CORDIS, Project ID 244088, 2010.

[2] Edge Impulse Inc., "Data Acquisition for Time-Series Data," Edge Impulse Documentation, 2025. [Online]. Available: https://docs.edgeimpulse.com/studio/projects/data-acquisition

[3] Renesas Electronics Corp., "RA4M1 Group User's Manual: Hardware," Rev. 4.00, 2023.

[4] DFRobot, "Fermion: MEMS Smoke Detection Sensor Datasheet," 2024. [Online]. Available: https://wiki.dfrobot.com

[5] Y. Chen et al., "An Indoor Fire Detection Method Based on Multi-Sensor Fusion," Sensors, vol. 23, no. 24, Dec. 2023.
```

---

## **10. Troubleshooting Common Issues**

### Issue 1: Data Forwarder Not Detecting Sensors

**Symptom**: CLI shows "0 sensor axes detected"
**Solution**:

- Ensure Serial Monitor is closed in Arduino IDE
- Check baud rate is 115200 in Arduino sketch
- Verify data format has exactly 6 comma-separated values

### Issue 2: Low Model Accuracy (<70%)

**Solutions**:

- Collect more training data (aim for 10+ minutes per class)
- Ensure clear distinction between classes (e.g., use real fire for Fire class)
- Check feature explorer for class separation
- Try different DSP blocks (Flatten instead of Spectral Analysis)

### Issue 3: AHT20 Initialization Fails

**Solutions**:

- Check I2C wiring (SDA/SCL pins)
- Try swapping SDA and SCL
- Check sensor is powered with 5V
- Test with DFRobot's example sketches first

### Issue 4: Arduino Runs Out of Memory

**Symptom**: Sketch won't upload or crashes during inference
**Solutions**:

- Use int8 quantization (not float32)
- Reduce window size in Impulse (1000ms instead of 2000ms)
- Simplify neural network (fewer layers/neurons)

---

## **Conclusion**

You now have a **complete, step-by-step guide** to building a multi-sensor fire detection system using Arduino UNO R4 WiFi and Edge Impulse. This guide covered:

✅ Hardware wiring and sensor connections
✅ Software installation (Arduino IDE, Node.js, Edge Impulse CLI)
✅ Edge Impulse account setup and API key retrieval
✅ Detailed Arduino code with line-by-line explanations
✅ Safe data collection procedures for Idle, Fire, and Noise classes
✅ Impulse design with Spectral Analysis and Neural Network configuration
✅ Model training, evaluation, and deployment
✅ Academic thesis structure with keywords, sources, and citations

**Next Steps**:

1. Follow each section in order — don't skip steps
2. Collect high-quality, varied data for each class
3. Iterate on your model if accuracy is low
4. Test thoroughly in real-world scenarios
5. Document everything for your thesis

**Remember**: Safety first when collecting fire data. Always have fire extinguishing equipment nearby and work in ventilated areas.

Good luck with your project! 🔥🚒

[1](https://store.arduino.cc/products/uno-r4-wifi)
[2](https://www.elektormagazine.com/news/arduino-uno-r4-minima-wifi)
[3](https://docs.edgeimpulse.com/tools/clis/edge-impulse-cli/data-forwarder)
[4](https://github.com/edgeimpulse/edge-impulse-cli/blob/master/README-data-forwarder.md)
[5](https://docs.edgeimpulse.com/apis/studio)
[6](https://docs.edgeimpulse.com/tutorials/tools/apis/studio/collect-data-device)
[7](https://docs.edgeimpulse.com/tutorials/tools/sdks/studio/python/use-hugging-face)
[8](https://docs.edgeimpulse.com/projects/expert-network/fire-detection-sensor-fusion-arduino-nano-33)
[9](https://github.com/edgeimpulse/expert-projects/blob/main/air-quality-and-environmental-projects/fire-detection-sensor-fusion-arduino-nano-33.md)
[10](https://docs.edgeimpulse.com/studio/projects/processing-blocks)
[11](https://www.semanticscholar.org/paper/False-Positive-Decremented-Research-for-Fire-and-in-Lee-Shim/ed6813092b46805dfcda6f4d059c1189cbc99421)
[12](https://www.businesswatchgroup.co.uk/effective-strategies-to-reduce-false-alarms-in-fire-detection-systems/)
[13](https://docs.edgeimpulse.com/tutorials/topics/data/collect-image-data-openmv-h7-plus)
[14](https://wiki.seeedstudio.com/reTerminal-DM-edgeimpulse/)
[15](https://www.silabs.com/documents/public/training/wireless/ML%20Speech%20Recognition%20Lab%20Manual_Public.pdf)
[16](https://docs.edgeimpulse.com/studio/projects/model-testing)
[17](https://docs.edgeimpulse.com/studio/projects/impulse-design)
[18](https://tinyml.seas.harvard.edu/EdgeMLUP-23/assets/slides/4.Extra-EI%20Studio%20-%20Spectral%20Analysis.pdf)
[19](https://docs.edgeimpulse.com/studio/projects/processing-blocks/blocks/spectral-analysis)
[20](https://docs.edgeimpulse.com/studio/projects/learning-blocks/blocks/classification)
[21](https://www.mouser.com/blog/edge-impulse-analyzing-ml-models)
[22](https://www.edgeimpulse.com/blog/sensor-fusion-ignites-next-gen-fire-detection/)
[23](https://docs.edgeimpulse.com/projects/expert-network/fire-detection-sensor-fusion-arduino-nano)
[24](https://pmc.ncbi.nlm.nih.gov/articles/PMC10747019/)
[25](https://www.ultralytics.com/blog/computer-vision-in-fire-detection-and-prevention)
[26](https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2025.1636758/full)
[27](https://data.mendeley.com/datasets/nwzcm9ckrt)
[28](https://www.nature.com/articles/s41598-026-35207-z)
[29](https://cordis.europa.eu/project/id/244088/reporting)
[30](https://docs.edgeimpulse.com/studio/projects/data-acquisition)
[31](https://docs.edgeimpulse.com/apis/studio/projects/get-api-keys)
[32](https://docs.nordicsemi.com/bundle/ncs-3.0.0/page/nrf/external_comp/edge_impulse.html)
[33](https://manual.virtualbreadboard.com/components/machinelearning/edgeimpulse/edgeimpulse.html)
[34](https://docs.edgeimpulse.com/tutorials/topics/feature-extraction/build-custom-processing-blocks)
[35](https://github.com/edgeimpulse/processing-blocks)
[36](https://www.edgeimpulse.com/blog/even-better-audio-classification-with-our-new-dsp-blocks/)
[37](https://www.youtube.com/watch?v=7vr4D_zlQTE)
[38](https://docs.edgeimpulse.com/tutorials/topics/machine-learning/classify-multiple-2d-features)
