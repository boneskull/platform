import 'rxjs/add/operator/concat';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs/observable/of';
import { never } from 'rxjs/observable/never';
import { Effect, EffectSources } from '../';


describe('EffectSources', () => {
  let effectSources: EffectSources;

  beforeEach(() => {
    effectSources = new EffectSources();
  });

  it('should have an "addEffects" method to push new source instances', () => {
    const effectSource = { };
    spyOn(effectSources, 'next');

    effectSources.addEffects(effectSource);

    expect(effectSources.next).toHaveBeenCalledWith(effectSource);
  });

  describe('toActions() Operator', () => {
    const a = { type: 'From Source A' };
    const b = { type: 'From Source B' };
    const c = { type: 'From Source C that completes' };

    class SourceA {
      @Effect() a$ = alwaysOf(a);
    }

    class SourceB {
      @Effect() b$ = alwaysOf(b);
    }

    class SourceC {
      @Effect() c$ = of(c);
    }

    it('should resolve effects from instances', () => {
      const sources$ = cold('--a--', { a: new SourceA() });
      const expected = cold('--a--', { a });

      const output = toActions(sources$);

      expect(output).toBeObservable(expected);
    });

    it('should ignore duplicate sources', () => {
      const sources$ = cold('--a--b--c--', {
        a: new SourceA(),
        b: new SourceA(),
        c: new SourceA(),
      });
      const expected = cold('--a--------', { a });

      const output = toActions(sources$);

      expect(output).toBeObservable(expected);
    });

    function toActions(source: any) {
      return effectSources.toActions.call(source);
    }
  });

  function alwaysOf<T>(value: T) {
    return of(value).concat(never<T>());
  }
});
