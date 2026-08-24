// bloom-deps:

function createStateMachine<S extends string, E extends string>(config: {
  initial: S;
  transitions: Record<S, Partial<Record<E, S>>>;
  onEnter?: Partial<Record<S, () => void>>;
}): { send: (event: E) => void; state: () => S; can: (event: E) => boolean } {
  if (
    config === null ||
    typeof config !== 'object' ||
    typeof config.initial !== 'string' ||
    config.transitions === null ||
    typeof config.transitions !== 'object'
  ) {
    throw new TypeError('config must have required fields: initial and transitions');
  }

  let currentState: S = config.initial;

  function state(): S {
    return currentState;
  }

  function can(event: E): boolean {
    const stateTransitions = config.transitions[currentState];
    if (!stateTransitions) return false;
    return event in stateTransitions && stateTransitions[event] !== undefined;
  }

  function send(event: E): void {
    const stateTransitions = config.transitions[currentState];
    if (!stateTransitions) return;
    const nextState = stateTransitions[event];
    if (nextState === undefined) return;
    currentState = nextState;
    if (config.onEnter) {
      const callback = config.onEnter[currentState];
      if (typeof callback === 'function') {
        callback();
      }
    }
  }

  return { send, state, can };
}

export { createStateMachine };