
const keyCodes = {
  16: 'shift',
  87: 'w',
  65: 'a',
  83: 's',
  68: 'd',
  32: 'space',
};

export default class InputHandler {
  private bindings: Object = {
    w: 'up',
    a: 'left',
    s: 'down',
    d: 'right',
  };
  public state: { up: boolean, left: boolean, down: boolean, right: boolean } = {
    up: false,
    left: false,
    down: false,
    right: false,
  };

  constructor() {
    document.addEventListener('keydown', e => this.toggle(e.which, true));
    document.addEventListener('keyup', e => this.toggle(e.which, false));
  }

  private toggle(code: number, pressed: boolean) {
    if (code in keyCodes && keyCodes[code] in this.bindings) {
      const key = keyCodes[code];
      const action = this.bindings[key];
      if (action in this.state) this.state[action] = pressed;
    }
  }
}
