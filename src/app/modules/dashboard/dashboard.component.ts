import { Component, OnInit, ViewChild } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { interval, Subscription } from 'rxjs';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../services/notification/notification.service';
import { MarketService } from '../../services/market/market.service';
import { AuthService } from '../../services/auth/auth.service';
import { Investment } from '../../entity/investment';
import { ConfigAppService } from '../../services/config-app/config-app.service';
import { EventService } from '../../services/event/event.service';
import { ResultStatut } from '../../services/firebase/resultstatut';
import { BasicInvestmentService } from '../../services/investment/basic-investment.service';
import { ProfilService } from '../../services/profil/profil.service';
import { User } from '../../entity/user';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  @ViewChild('showSaleBonus') public showSaleBonus: ModalDirective;
  bonus: number = 0;
  nextBonus: number = 0;
  saleBonus: boolean = false;
  private updateSubscription: Subscription;
  activeUser: number; // valeur fictive du nombre d'utilisateurs en ligne.
  allUsers: number = 1500;  // valeur fictive du nombre total d'utilisateurs. créé la
  // fonctionnalité dans les service (utilisable par la suite dans admin) mais laisser ici fictif.
  balence: number = 0; // somme de toutes les montants de chaqueq investment avec son id
  bonusBalence: number = 0; // Bonus de pa
  saleBalence: number = 0;
  listPurchaseInvestments: Map<string, boolean> = new Map<string, boolean>();
  listSaleInvestments: Map<string, boolean> = new Map<string, boolean>();
  numPurchaseInvestment: number = 0;
  numSaleInvestment: number = 0;
  allSaleAmount: number = 0;
  allPurchaseAmount: number = 0;
  allAmount: number = 0;
  minBonus :number =0;
  waitResponse = false;

  radioModel: string = 'Month';


  // lineChart1
  public lineChart1Data: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Series A'
    }
  ];
  public lineChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart1Options: any = {
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
          min: 40 - 5,
          max: 84 + 5,
        }
      }],
    },
    elements: {
      line: {
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
  public lineChart1Colours: Array<any> = [
    {
      backgroundColor: getStyle('--primary'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart1Legend = false;
  public lineChart1Type = 'line';

  // lineChart2
  public lineChart2Data: Array<any> = [
    {
      data: [1, 18, 9, 17, 34, 22, 11],
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


  // lineChart3
  public lineChart3Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'Series A'
    }
  ];
  public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart3Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart3Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
    }
  ];
  public lineChart3Legend = false;
  public lineChart3Type = 'line';


  // barChart1
  public barChart1Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
      label: 'Series A',
      barPercentage: 0.6,
    }
  ];
  public barChart1Labels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
  public barChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    }
  };
  public barChart1Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.3)',
      borderWidth: 0
    }
  ];
  public barChart1Legend = false;
  public barChart1Type = 'bar';

  // mainChart

  public mainChartElements = 27;
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];

  public mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Current'
    },
    {
      data: this.mainChartData2,
      label: 'Previous'
    },
    {
      data: this.mainChartData3,
      label: 'BEP'
    }
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  /* tslint:enable:max-line-length */
  public mainChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any) {
            return value.charAt(0);
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5),
          max: 250
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public mainChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: hexToRgba(getStyle('--info'), 10),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: 'transparent',
      borderColor: getStyle('--success'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: getStyle('--warning'),
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];
  public mainChartLegend = false;
  public mainChartType = 'line';

  // social box charts

  public brandBoxChartData1: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Facebook'
    }
  ];
  public brandBoxChartData2: Array<any> = [
    {
      data: [1, 13, 9, 17, 34, 41, 38],
      label: 'Twitter'
    }
  ];
  public brandBoxChartData3: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'LinkedIn'
    }
  ];
  public brandBoxChartData4: Array<any> = [
    {
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Google+'
    }
  ];

  public brandBoxChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public brandBoxChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public brandBoxChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public brandBoxChartLegend = false;
  public brandBoxChartType = 'line';

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


  constructor(
    private notification: NotificationService,
    private myInvestment: MarketService,
    private authService: AuthService,
    private bsModal: BsModalService,
    // private translate:TranslateService,
    private eventService: EventService,
    private basicInvestmentService:BasicInvestmentService,
    private configAppService:ConfigAppService,
    private profilService: ProfilService) {
    this.getInitiateInvestments();
    this.getConfirmInvestments();
  }

  getInitiateInvestments() {
    this.myInvestment.getMyOrderdInvestmentNotInMarket().subscribe((investment: Investment) => {
      // console.log("Arrived")
      if (!this.listPurchaseInvestments.has(investment.id.toString().toString())) {
        this.listPurchaseInvestments.set(investment.id.toString().toString(), true);
        this.allAmount = this.allAmount + investment.amount;
        this.numPurchaseInvestment++;
      }
      this.allAmount = this.allPurchaseAmount + this.allAmount;
    });
    // console.log(this.allAmount)
  }

  randomNumber(m?: number, k?: number, c?: number) {
    if (!m) { m = 300; }
    // if (!k) { k = 0; }
    // if (!c) { c = 0; }
    let mm = Math.floor((Math.random() * m) + 1);
    // let kk = Math.floor((Math.random() * k) + 1);
    // let cc = Math.floor((Math.random() * c) + 1);
    let d = new Date();
    let val = 400;
    let hh = d.getHours();
    if (hh > 22) {
      val = 200;
    }
    if (hh < 7) {
      val = 100;
    }
    let number = val + mm;
    // console.log('random: ' + number);
    return number;
  }

  getConfirmInvestments() {
    this.myInvestment.getMyOrderedInvestment().subscribe((investment: Investment) => {
      if (!this.listSaleInvestments.has(investment.id.toString().toString())) {
        this.listSaleInvestments.set(investment.id.toString().toString(), true);
        this.allAmount = this.allAmount + investment.amount;
        this.numSaleInvestment++;
      }
    });
    // this.allAmount = this.allSaleAmount + this.allAmount;
  }

  saleMyBonus() {
    this.waitResponse = true;
    this.basicInvestmentService.transfertBonusToInvestment()
    .then((result: ResultStatut) => {
      this.waitResponse = false;
      this.showSaleBonus.hide();
      this.notification.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br>${this.minBonus} MC \</b>of your bonuses have been put on the market`);
    })
      .catch((error:ResultStatut) => {
        let message="";
        this.showSaleBonus.hide();
        if(error.apiCode==ResultStatut.INVALID_ARGUMENT_ERROR) message =error.message;
        else message="\<b>Oops!!\</b>Unknow error. please contact administrator <br> contact.momo.coin@gmail.com"
        setTimeout(() => this.notification.showNotification('top', 'center', 'danger', '', 'An error has occurred <br/>'), 200)
        this.waitResponse = false;
      });
    }

    showModal() {
      this.showSaleBonus.show();
    }
    hideModal() {
      this.showSaleBonus.hide();
    }

  ngOnInit(): void {
    // generate random values for mainChart
    for (let i = 0; i <= this.mainChartElements; i++) {
      this.mainChartData1.push(this.random(50, 200));
      this.mainChartData2.push(this.random(80, 100));
      this.mainChartData3.push(65);
    }


    this.updateSubscription = interval(8000).subscribe(
      (val) => {
        this.activeUser = this.randomNumber(50);
      });

    this.authService.currentUserSubject.subscribe((user: User) => {
      console.log("min ",this.minBonus);
      this.bonus = user.bonus;
      if(user.bonus >= this.configAppService.bonus.getValue().minBonus) {
        this.saleBonus = true;
        this.nextBonus = user.bonus - this.configAppService.bonus.getValue().minBonus;
      }
    });

    this.configAppService.bonus.subscribe((value)=>{
      this.minBonus=value.minBonus;
      if(this.bonus >= this.configAppService.bonus.getValue().minBonus) {
        this.saleBonus = true;
        this.nextBonus = this.bonus - this.configAppService.bonus.getValue().minBonus;
      }
    })

    this.getInitiateInvestments();
    this.getConfirmInvestments();

    this.profilService.balancedAccountObservable.subscribe((balance: number) => {
      // console.log("Balance ",balance)
      this.balence = balance;
    })
    // this.eventService
    // .newInvestmentArrivedEvent
    // .subscribe((arrived:boolean)=>{
    //   if(!arrived) return;
    //   console.log("Clear")
    //   this.listPurchaseInvestments.clear();
    //   this.listSaleInvestments.clear();
    //   this.numPurchaseInvestment=0;
    //   this.numSaleInvestment=0;
    // })
  }
}
