import { Input, type Scene } from 'phaser';

/**
 * Edge-triggered jump from Space or gamepad face button (buttons[0]).
 */
export class JumpInput {
  private space?: Input.Keyboard.Key;
  private prevPadA = false;

  constructor(private readonly scene: Scene) {
    this.space = scene.input.keyboard?.addKey(Input.Keyboard.KeyCodes.SPACE);
  }

  /** True once per press edge. */
  consumedJumpPress(): boolean {
    let pressed = false;

    if (this.space && Input.Keyboard.JustDown(this.space)) {
      pressed = true;
    }

    const pad = this.scene.input.gamepad?.getPad(0);
    const padA = Boolean(pad?.A || pad?.buttons?.[0]?.pressed);
    if (padA && !this.prevPadA) {
      pressed = true;
    }
    this.prevPadA = padA;

    return pressed;
  }
}
