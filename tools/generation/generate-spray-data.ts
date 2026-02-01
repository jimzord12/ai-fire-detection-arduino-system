import * as fs from 'fs';
import * as path from 'path';

interface SensorRanges {
  smoke: [number, number];
  voc: [number, number];
  co: [number, number];
  flame: [number, number];
  temp: [number, number];
  hum: [number, number];
}

/**
 * Generate random value within specified range
 */
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a smooth sensor reading with some variation
 * to simulate realistic sensor behavior
 */
function smoothSensorReading(
  previousValue: number,
  min: number,
  max: number,
  smoothingFactor: number = 0.7
): number {
  const randomValue = randomInRange(min, max);
  const smoothedValue = previousValue * smoothingFactor + randomValue * (1 - smoothingFactor);
  return Math.max(min, Math.min(max, smoothedValue));
}

/**
 * Generate CSV data for C3 Scenario (Spray)
 */
function generateSprayData(outputDir: string, numSamples: number = 100): void {
  // Sensor ranges for spray scenario
  const ranges: SensorRanges = {
    smoke: [100, 250],
    voc: [800, 950], // High VOC from spray
    co: [15, 50], // Low CO
    flame: [50, 250], // Low flame
    temp: [25, 35],
    hum: [35, 50],
  };

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate current date/time for filename
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

  // Generate multiple files (simulating multiple collection sessions)
  const numFiles = 30;

  for (let fileIndex = 1; fileIndex <= numFiles; fileIndex++) {
    const fileName = `false_alarm__spray_${dateStr}_${timeStr}_${fileIndex}.csv`;
    const filePath = path.join(outputDir, fileName);

    // Initialize CSV with header
    const csvLines: string[] = ['timestamp,smoke,voc,co,flame,temp,hum'];

    // Initialize sensor values with first sample
    let smoke = randomInRange(ranges.smoke[0], ranges.smoke[1]);
    let voc = randomInRange(ranges.voc[0], ranges.voc[1]);
    let co = randomInRange(ranges.co[0], ranges.co[1]);
    let flame = randomInRange(ranges.flame[0], ranges.flame[1]);
    let temp = randomInRange(ranges.temp[0], ranges.temp[1]);
    let hum = randomInRange(ranges.hum[0], ranges.hum[1]);

    // Generate timestamp starting value (random start)
    let timestamp = Math.floor(Math.random() * 1000000) + 1000000;

    // Generate sensor readings
    for (let i = 0; i < numSamples - 1; i++) {
      const row = [
        timestamp,
        Math.round(smoke), // Integer
        Math.round(voc), // Integer
        Math.round(co), // Integer
        Math.round(flame), // Integer
        Math.round(temp * 100) / 100, // Decimal
        Math.round(hum * 100) / 100, // Decimal
      ].join(',');

      csvLines.push(row);

      // Update timestamp (100ms increment)
      timestamp += 100;

      // Update sensor readings with smoothing to simulate realistic behavior
      smoke = smoothSensorReading(smoke, ranges.smoke[0], ranges.smoke[1], 0.8);
      voc = smoothSensorReading(voc, ranges.voc[0], ranges.voc[1], 0.85);
      co = smoothSensorReading(co, ranges.co[0], ranges.co[1], 0.75);
      flame = smoothSensorReading(flame, ranges.flame[0], ranges.flame[1], 0.7);
      temp = smoothSensorReading(temp, ranges.temp[0], ranges.temp[1], 0.95); // Very smooth
      hum = smoothSensorReading(hum, ranges.hum[0], ranges.hum[1], 0.9); // Smooth
    }

    // Write CSV file
    fs.writeFileSync(filePath, csvLines.join('\n'), 'utf-8');
    console.log(`✓ Generated: ${fileName} (${numSamples} samples)`);
  }

  console.log(`\n✓ Successfully generated ${numFiles} spray scenario files in ${outputDir}`);
}

// Main execution
const projectRoot = process.cwd();
const outputDir = path.join(projectRoot, 'data', 'raw', 'false_alarm', 'spray');

generateSprayData(outputDir, 100);
