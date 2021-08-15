import { Observable, of, from } from 'rxjs';
import { map, pluck, mergeMap, toArray } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../../models/hero';
import { HEROES } from '../../mock.users';
import { MessageService } from '../../services/message-service/message.service';

@Injectable({
  providedIn: 'root'
})
/* https://randomuser.me/api/?results=10 */
export class HeroService {
  private heroesUrl =
    'https://randomuser.me/api/?results=10&seed=7b03ffa8d1c50276';
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getHeroes(): Observable<any> {
    this.messageService.add('Fetching heroes');
    return this.http.get<any>(this.heroesUrl).pipe(
      // pluck('results'), // should be equivalent to //
      map(json => json.results),
      mergeMap(results =>
        from(results).pipe(
          map(single => {
            return {
              id: Math.floor(Math.random() * 10),
              name: `${single.name.first} ${single.name.last}`
            };
          })
        )
      ),
      toArray()
    );
  }
  getHero(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = HEROES.find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
