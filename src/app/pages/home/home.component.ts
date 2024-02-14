import { Component, OnInit } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import { ILineChartsDatas } from 'src/app/core/models/ILineChartDatas';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<undefined | Olympic[]> = of(undefined);
  public lineChartDatas$ : Observable<null | ILineChartsDatas> = of(null);

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics$()
    this.lineChartDatas$ = this.olympicService.getCountryLineChartDatas$("france").pipe(take(1))
  }
}
