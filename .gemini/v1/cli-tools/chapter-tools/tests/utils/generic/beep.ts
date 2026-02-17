import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

/**
 * Plays a specified number of beeps with a custom duration using speaker-test.
 * @param durationSeconds - How long each beep should last (e.g., 2).
 * @param amount - How many times the beep should repeat.
 * @param frequency - The pitch of the beep in Hz (default: 440).
 */
export async function playBeeps(
  durationSeconds: number,
  amount: number,
  frequency: number = 440
): Promise<void> {
  // Use 'timeout' to enforce duration.
  // -s KILL sends SIGKILL immediately when time is up, because speaker-test ignores SIGTERM.
  // LC_ALL=C ensures decimal points are parsed correctly regardless of system locale.
  const command = `LC_ALL=C timeout -s KILL ${durationSeconds}s speaker-test -t sine -f ${frequency} -l 0 > /dev/null 2>&1`;

  for (let i = 0; i < amount; i++) {
    try {
      await execAsync(command);
    } catch (error: any) {
      // timeout exits with 124 if the command times out.
      // It may exit with 137 if it had to SIGKILL the process (128 + 9).
      if (error.code !== 124 && error.code !== 137) {
        console.error('Error during beep execution:', error);
      }
    }

    // Optional: A 200ms pause between beeps so they remain distinct
    if (i < amount - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
}
