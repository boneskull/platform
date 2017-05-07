import { groupBy, GroupedObservable } from 'rxjs/operator/groupBy';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { exhaustMap } from 'rxjs/operator/exhaustMap';
import { map } from 'rxjs/operator/map';
import { dematerialize } from 'rxjs/operator/dematerialize';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Injectable, isDevMode } from '@angular/core';
import { Action } from '@ngrx/store';
import { getSourceForInstance } from './effects_metadata';
import { resolveEffectSource, EffectOutput } from './effects_resolver';


@Injectable()
export class EffectSources extends Subject<any> {
  constructor() {
    super();
  }

  addEffects(effectSourceInstance: any) {
    this.next(effectSourceInstance);
  }

  /**
   * @private
   */
  toActions(): Observable<Action> {
    return mergeMap.call(
      groupBy.call(this, getSourceForInstance),
      (source$: GroupedObservable<any, any>) => dematerialize.call(map.call(
        exhaustMap.call(source$, resolveEffectSource), (output: EffectOutput) => {
          switch (output.notification.kind) {
            case 'N': {
              const action = output.notification.value;
              const isInvalidAction = !action || !action.type || typeof action.type !== 'string';

              if (isInvalidAction) {
                console.group(`Effect "${output.sourceName}.${output.propertyName}" dispatched an invalid action`);
                console.error('Source:', output.sourceInstance);
                console.error('Effect:', output.propertyName);
                console.error('Dispatched:', action);
                console.error('Notification:', output.notification);
                console.groupEnd();
              }

              break;
            }
            case 'E': {
              console.group(`Effect "${output.sourceName}.${output.propertyName}" threw an error`);
              console.error('Source:', output.sourceInstance);
              console.error('Effect:', output.propertyName);
              console.error('Error:', output.notification.error);
              console.error('Notification:', output.notification);
              console.groupEnd();

              break;
            }
          }

          return output.notification;
        }
      )),
    );
  }
}
