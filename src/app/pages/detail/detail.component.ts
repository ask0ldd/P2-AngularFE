import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { ILineChartsDatas } from 'src/app/core/models/ILineChartDatas';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  public olympics$: Observable<undefined | Olympic[]> = of(undefined);
  public lineChartDatas$ : Observable<null | ILineChartsDatas> = of(null);

  countryName : string = ""
  totalMedals! : number // ! tell that the property will be assigned in OnInit
  minYaxis! : number
  maxYaxis! : number

  chartDatas$!: Observable<ILineChartsDatas>

  constructor(private router:Router, private route: ActivatedRoute, private olympicService: OlympicService) { }

  ngOnInit(): void {
    /*this.olympics$ = this.olympicService.getOlympics$()
    this.lineChartDatas$ = this.olympicService.getCountryLineChartDatas$("france").pipe(take(1))*/

    this.countryName = "france"
    if(this.countryName == null || this.countryName == "") {
      this.router.navigateByUrl('/404') 
      return
    }

    this.chartDatas$ = this.olympicService.getCountryLineChartDatas$(this.countryName)

    // It's not necessary for the variables depending on observables to be observables themselves : https://angular.io/guide/comparing-observables
    this.chartDatas$.subscribe(datas => {
      const medalsList = datas.series?.map(serie => serie.value)
      this.minYaxis = Math.floor((Math.min(...medalsList) / 10)) * 10
      if(this.minYaxis < 0) this.minYaxis = 0
      this.maxYaxis = Math.ceil((Math.max(...medalsList) / 10)) * 10
      this.totalMedals = datas.series.reduce((acc, serie) => acc + serie.value, 0)
    })
  }

}
