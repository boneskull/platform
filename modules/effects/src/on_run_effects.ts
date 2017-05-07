import { Observable } from 'rxjs/Observable';
import { getSourceForInstance } from './effects_metadata';
import { EffectOutput } from './effects_resolver';


export interface OnRunEffects {
  ngrxOnRunEffects(resolvedEffects$: Observable<EffectOutput>): Observable<EffectOutput>;
}

const onRunEffectsKey: keyof OnRunEffects = 'ngrxOnRunEffects';

export function isOnRunEffects(sourceInstance: Object): sourceInstance is OnRunEffects {
  const source = getSourceForInstance(sourceInstance);

  return onRunEffectsKey in source && typeof source[onRunEffectsKey] === 'function';
}
