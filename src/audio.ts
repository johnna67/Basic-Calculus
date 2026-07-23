import type { SettingsState } from './types';

export class AudioManager {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambient: OscillatorNode[] = [];
  private settings: SettingsState;

  constructor(settings: SettingsState) {
    this.settings = settings;
  }

  async unlock(): Promise<void> {
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = this.settings.masterVolume * 0.2;
      this.master.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') await this.context.resume();
  }

  update(settings: SettingsState): void {
    this.settings = settings;
    if (this.context && this.master) {
      this.master.gain.setTargetAtTime(settings.masterVolume * 0.2, this.context.currentTime, 0.04);
    }
  }

  startAmbient(roomIndex: number): void {
    if (!this.context || !this.master) return;
    this.stopAmbient();
    [40 + roomIndex * 5, 58 + roomIndex * 3].forEach((frequency, index) => {
      const oscillator = this.context!.createOscillator();
      const gain = this.context!.createGain();
      oscillator.type = index === 0 ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;
      gain.gain.value = index === 0 ? 0.08 : 0.025;
      oscillator.connect(gain).connect(this.master!);
      oscillator.start();
      this.ambient.push(oscillator);
    });
  }

  stopAmbient(): void {
    this.ambient.forEach((oscillator) => { try { oscillator.stop(); } catch { /* no-op */ } });
    this.ambient = [];
  }

  click(): void { this.tone([220], 0.04, 'square', 0.03); }
  correct(): void { this.tone([392, 523.25, 659.25], 0.08, 'sine', 0.06); }
  wrong(): void { this.tone([110, 77], 0.18, 'sawtooth', 0.08); }
  transition(): void { this.tone([130, 196, 261.6], 0.11, 'triangle', 0.05); }
  achievement(): void { this.tone([523.25, 659.25, 783.99], 0.12, 'triangle', 0.06); }

  private tone(frequencies: number[], duration: number, type: OscillatorType, volume: number): void {
    if (!this.context || !this.master || this.settings.masterVolume <= 0) return;
    const start = this.context.currentTime;
    frequencies.forEach((frequency, index) => {
      const oscillator = this.context!.createOscillator();
      const gain = this.context!.createGain();
      const offset = index * duration * 0.7;
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.001, start + offset);
      gain.gain.linearRampToValueAtTime(volume, start + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + offset + duration);
      oscillator.connect(gain).connect(this.master!);
      oscillator.start(start + offset);
      oscillator.stop(start + offset + duration + 0.03);
    });
  }
}
