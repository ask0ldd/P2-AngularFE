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

  countryName! : string | null

  public olympics$: Observable<undefined | Olympic[]> = of(undefined);
  public lineChartDatas$ : Observable<null | ILineChartsDatas> = of(null);

  constructor(private router:Router, private route: ActivatedRoute, private olympicService: OlympicService) { }

  ngOnInit(): void {
    this.countryName = this.route.snapshot.paramMap.get('id')
    if(this.countryName == null) {
      this.router.navigateByUrl('/404') 
      return
    }
    this.olympics$ = this.olympicService.getOlympics$()
    this.lineChartDatas$ = this.olympicService.getCountryLineChartDatas$("france").pipe(take(1))
  }

}
