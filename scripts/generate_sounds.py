import os
import wave
import math
import random
import struct

os.makedirs('public/assets', exist_ok=True)
SAMPLE_RATE = 44100
DURATION = 5  # seconds
NUM_SAMPLES = SAMPLE_RATE * DURATION

def write_wav(filename, samples):
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(SAMPLE_RATE)
        for sample in samples:
            sample = max(-1.0, min(1.0, sample))
            int_sample = int(sample * 32767.0)
            wav_file.writeframes(struct.pack('<h', int_sample))

def generate_whitenoise():
    print("Generating whitenoise...")
    samples = [random.uniform(-0.3, 0.3) for _ in range(NUM_SAMPLES)]
    write_wav('public/assets/whitenoise.wav', samples)

def generate_rain():
    print("Generating rain (low-pass filtered noise)...")
    samples = []
    prev = 0
    alpha = 0.05 
    for _ in range(NUM_SAMPLES):
        noise = random.uniform(-0.5, 0.5)
        val = prev + alpha * (noise - prev)
        prev = val
        samples.append(val * 4.0)
    write_wav('public/assets/rain.wav', samples)

def generate_bowls():
    print("Generating singing bowls...")
    samples = []
    freq1, freq2, freq3 = 432.0, 864.0, 1296.0
    for i in range(NUM_SAMPLES):
        t = i / SAMPLE_RATE
        env = math.sin(t * math.pi / DURATION)
        val = (math.sin(2 * math.pi * freq1 * t) * 0.6 +
               math.sin(2 * math.pi * freq2 * t) * 0.3 +
               math.sin(2 * math.pi * freq3 * t) * 0.1) * env
        samples.append(val * 0.7)
    write_wav('public/assets/bowls.wav', samples)

if __name__ == "__main__":
    generate_whitenoise()
    generate_rain()
    generate_bowls()
    print("All sounds generated.")
