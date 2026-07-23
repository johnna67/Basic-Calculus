import Phaser from 'phaser';
import { BACKGROUNDS } from './art';

export class VisualScene extends Phaser.Scene {
  private backdrop?: Phaser.GameObjects.Image;
  private tint?: Phaser.GameObjects.Rectangle;
  private motes: Phaser.GameObjects.Arc[] = [];
  private targetX = 960;
  private targetY = 540;
  private targetScale = 1.06;
  private pointerX = 0;
  private pointerY = 0;
  private reducedMotion = false;

  constructor() { super('visual'); }

  preload(): void {
    BACKGROUNDS.forEach((uri, index) => this.load.image(`room-${index}`, uri));
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#040605');
    this.backdrop = this.add.image(960, 540, 'room-0').setOrigin(0.5).setDisplaySize(1920, 1080).setScale(1.07);
    this.tint = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.06).setBlendMode(Phaser.BlendModes.MULTIPLY);
    const scan = this.add.graphics().setAlpha(0.09);
    scan.fillStyle(0x000000, 0.42);
    for (let y = 0; y < 1080; y += 6) scan.fillRect(0, y, 1920, 2);
    for (let i = 0; i < 44; i += 1) {
      const mote = this.add.circle(Phaser.Math.Between(0, 1920), Phaser.Math.Between(0, 1080), Phaser.Math.Between(1, 4), 0xd8d1bd, Phaser.Math.FloatBetween(0.05, 0.2));
      mote.setData('speed', Phaser.Math.FloatBetween(0.06, 0.24));
      mote.setData('drift', Phaser.Math.FloatBetween(-0.08, 0.08));
      this.motes.push(mote);
    }
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.pointerX = (pointer.x / this.scale.width - 0.5) * 22;
      this.pointerY = (pointer.y / this.scale.height - 0.5) * 12;
    });
    window.addEventListener('visual-room', ((event: CustomEvent<{ roomIndex: number; nodeIndex: number }>) => this.setRoom(event.detail.roomIndex, event.detail.nodeIndex)) as EventListener);
    window.addEventListener('visual-node', ((event: CustomEvent<{ nodeIndex: number }>) => this.setNode(event.detail.nodeIndex)) as EventListener);
    window.addEventListener('visual-wrong', (() => this.flashWrong()) as EventListener);
    window.addEventListener('visual-correct', (() => this.flashCorrect()) as EventListener);
    window.addEventListener('visual-settings', ((event: CustomEvent<{ reducedMotion: boolean }>) => { this.reducedMotion = event.detail.reducedMotion; }) as EventListener);
  }

  update(_time: number, delta: number): void {
    if (!this.backdrop) return;
    const amount = this.reducedMotion ? 1 : Math.min(1, delta / 280);
    this.backdrop.x = Phaser.Math.Linear(this.backdrop.x, this.targetX + (this.reducedMotion ? 0 : this.pointerX), amount);
    this.backdrop.y = Phaser.Math.Linear(this.backdrop.y, this.targetY + (this.reducedMotion ? 0 : this.pointerY), amount);
    this.backdrop.scaleX = Phaser.Math.Linear(this.backdrop.scaleX, this.targetScale, amount);
    this.backdrop.scaleY = Phaser.Math.Linear(this.backdrop.scaleY, this.targetScale, amount);
    if (!this.reducedMotion) {
      this.motes.forEach((mote) => {
        mote.y -= Number(mote.getData('speed')) * delta;
        mote.x += Number(mote.getData('drift')) * delta;
        if (mote.y < -8) { mote.y = 1088; mote.x = Phaser.Math.Between(0, 1920); }
      });
    }
  }

  setRoom(roomIndex: number, nodeIndex: number): void {
    if (!this.backdrop) return;
    const clamped = Math.max(0, Math.min(4, roomIndex));
    this.tweens.killTweensOf(this.backdrop);
    this.backdrop.setTexture(`room-${clamped}`);
    this.setNode(nodeIndex);
    if (this.reducedMotion) { this.backdrop.setAlpha(1); return; }
    this.backdrop.setAlpha(0.68);
    this.tweens.add({ targets: this.backdrop, alpha: 1, duration: 360, ease: 'Sine.easeOut' });
  }

  setNode(nodeIndex: number): void {
    const offsets = [-40, 32, -18, 48, -32, 0];
    this.targetX = 960 + (offsets[nodeIndex] ?? 0);
    this.targetY = 540 + (nodeIndex % 2 ? 8 : -8);
    this.targetScale = 1.055 + Math.min(nodeIndex, 5) * 0.012;
  }

  private flashWrong(): void {
    if (!this.tint) return;
    this.tint.setFillStyle(0x8b0e0e, 0.5);
    if (!this.reducedMotion) this.cameras.main.shake(280, 0.012);
    this.time.delayedCall(320, () => this.tint?.setFillStyle(0x000000, 0.06));
  }

  private flashCorrect(): void {
    if (!this.tint) return;
    this.tint.setFillStyle(0x6f9158, 0.2);
    this.time.delayedCall(280, () => this.tint?.setFillStyle(0x000000, 0.06));
  }
}

export function createVisualGame(parent: string): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 1920,
    height: 1080,
    backgroundColor: '#040605',
    scene: [VisualScene],
    render: { antialias: true },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1920, height: 1080 },
    input: { keyboard: true, mouse: true, touch: true },
  });
}
