import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Participation } from '../models/Participation';
import { ILineChartsDatas } from '../models/ILineChartDatas';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]) // soutenance : replace any with Olympic[]

  private olympicsDatas : Olympic[] = []

  constructor(private http: HttpClient) {
    /*this.http.get<Olympic[]>(this.olympicUrl).subscribe(data => {
      this.olympicsDatas = data;
    }, catchError((error, caught) => {
      this.olympics$.next([]);
      console.error('An error occurred while fetching Olympic data.');
      return throwError(() => new Error('Something bad happened; please try again later.'));
    }))*/

    /*this.http.get<Olympic[]>(this.olympicUrl).subscribe({
      next: (v) => this.olympicsDatas = v,
      error: (e) => console.error(e),
      complete: () => console.info('complete') 
    })*/
  }

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)), 
      catchError(this.handleError)
      /*catchError((error, caught) => {
        this.olympics$.next([]);
        console.error('An error occurred while fetching Olympic data.');
        return throwError(() => new Error('Something bad happened; please try again later.'));
      })*/
    );
  }

  private handleError(error: HttpErrorResponse) {
    // https://angular.io/guide/http-handle-request-errors
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error("Can't load the requested datas."));
  }

  /* To study 
  
  loadInitialData(): Observable<Olympic[]> {
    if (!this.olympics$) {
      this.olympics$ = this.http.get<Olympic[]>(this.olympicUrl).pipe(
        tap((value) => console.log('Fetched data', value)),
        catchError(this.handleError),
        shareReplay(1) // Share the data and replay the last emitted value to new subscribers
      );
    }
    return this.olympics$;
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    // You can perform additional error handling here
    return throwError('Something went wrong');
  }

  */

  getOlympics$() {
    return this.olympics$.asObservable();
  }

  // using find - rxjs operator - would allow me to ignore emissions not matching my condition, 
  // reduce - rxjs operator - would allow me to work on successive emissions
  // it wouldn't allow me to find the first ICountryJOStats matching it
  getCountryMedals$(country : string) : Observable<number>{
    return this.getOlympics$().pipe( // !!! catch error
        map((datas : Olympic[]) => datas
        .find((datas : Olympic) => datas.country.toLowerCase() === country)?.participations
        .reduce((accumulator : number, participation : Participation) => accumulator + participation.medalsCount, 0) || 0
        )
    )
  }

  getCountryTotalAthletes$(country : string) : Observable<number>{
    return this.getOlympics$().pipe(
        map((datas : Olympic[]) => datas
        .find((datas : Olympic) => datas.country.toLowerCase() === country)?.participations
        .reduce((accumulator : number, participation : Participation) => accumulator + participation.athleteCount, 0) || 0
        )
    )
  }

  getCountryLineChartDatas$(country : string) : Observable<ILineChartsDatas>{
    return this.getOlympics$().pipe(
        map((datas : Olympic[]) => {
          const selectedCountryDatas = datas.find((datas) => datas.country.toLowerCase() === country)
          if(selectedCountryDatas) return {name: country, series: selectedCountryDatas?.participations.map(participation => ({name : participation.year.toString(), value : participation.medalsCount}))}
          return {name : country, series : [{name : '', value : 0 }]}
        })
    )
  }

  getPieChartDatas$() : Observable<{name : string, value : number} []>{
    return this.getOlympics$().pipe(
      map((datas : Olympic[]) => datas
        .map((countryDatas : Olympic) => ({name : countryDatas.country, value : countryDatas.participations.reduce((accumulator : number, participation : Participation) => accumulator + participation.medalsCount, 0)}))
      )
    )
  }

  getNumberOfJOs$() : Observable<number>{
    return this.getOlympics$().pipe(
      map((datas : Olympic[]) => {
          let eventsDates : number[] = []
          datas.forEach(countryStats => {
            countryStats.participations.forEach(participation => {
              if(!eventsDates.includes(participation.year)) eventsDates.push(participation.year)
            })
          })
          return eventsDates.length
        } 
      )
    )
  }
}
