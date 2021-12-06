import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { Investment } from '../../../entity/investment';
import { MarketService } from '../../../services/market/market.service';

@Component({
  selector: 'app-initiated-investment',
  templateUrl: './initiated-investment.component.html',
  styleUrls: ['./initiated-investment.component.scss']
})
export class InitiatedInvestmentComponent implements OnInit {

  radioModel: string = 'Month';
  // lineChart2
  public lineChart2Data: Array<any> = [
    {
      data: [1, 18, 9, 15, 20, 22, 34],
      label: 'Series A'
    }
  ];

  public lineChart2Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart2Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 1 - 5,
          max: 34 + 5,
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart2Colours: Array<any> = [
    { // grey
      backgroundColor: getStyle('--info'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart2Legend = false;
  public lineChart2Type = 'line';



  public mainChartElements = 27;
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];

  initiatedInvestment:Investment[]=[];
  initiatedInvestmentCheck:Map<String,boolean>=new Map<String,boolean>();

  public constructor(private marketService:MarketService)
  {}
  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ngOnInit(): void {
    // generate random values for mainChart
    for (let i = 0; i <= this.mainChartElements; i++) {
      this.mainChartData1.push(this.random(50, 200));
      this.mainChartData2.push(this.random(80, 100));
      this.mainChartData3.push(65);
    }

    this.marketService.getMyOrderedInitiatedInvestment()
    .subscribe((value:Investment)=>{
      if(this.initiatedInvestmentCheck.has(value.id.toString()))
      {
        let pos=this.initiatedInvestment.findIndex((invest)=>invest.id.toString()==value.id.toString());
        if(pos>-1)this.initiatedInvestment[pos]=value;
      }
      else
      {
        this.initiatedInvestment.push(value);
        this.initiatedInvestmentCheck.set(value.id.toString(),true);
      }
    })
  }
}
