import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { EffectSources } from './effect_sources';
import { Actions } from './actions';
import { ROOT_EFFECTS, FEATURE_EFFECTS } from './tokens';
import { EffectsFeatureModule } from './effects_feature_module';
import { EffectsRunner } from './effects_runner';
import { RUN_EFFECTS } from './run_effects';


@NgModule({ })
export class EffectsModule {
  static forFeature(featureEffects: Type<any>[]): ModuleWithProviders {
    return {
      ngModule: EffectsFeatureModule,
      providers: [
        featureEffects,
        {
          provide: FEATURE_EFFECTS,
          multi: true,
          deps: featureEffects,
          useFactory: createSourceInstances
        },
      ]
    };
  }

  static forRoot(rootEffects: Type<any>[]): ModuleWithProviders {
    return {
      ngModule: EffectsModule,
      providers: [
        EffectsRunner,
        EffectSources,
        Actions,
        RUN_EFFECTS,
        rootEffects,
        {
          provide: ROOT_EFFECTS,
          deps: rootEffects,
          useFactory: createSourceInstances
        },
      ]
    };
  }
}

export function createSourceInstances(...instances: any[]) {
  return instances;
}
