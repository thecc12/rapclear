import { Component, OnInit, ViewChild } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { interval, Subscription } from 'rxjs';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../services/notification/notification.service';
import { MarketService } from '../../services/market/market.service';
import { AuthService } from '../../services/auth/auth.service';
import { Investment, InvestmentState } from '../../entity/investment';
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
  waitData = true;
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
  minBonus: number = 0;
  waitResponse = false;

  radioModel: string = 'Month';

  bonus: number = 0;
  initiatedInvestAmount: number = 0;
  onWaitingPayementDateInvestAmount: number = 0;
  readyToPayInvestAmount: number = 0;
  allUserSimullation: number;

  // lineChart1
  public lineChart1Data: Array<any> = [
    {
      data: [15, 25, 36, 45, 60, 80, 91],
      label: 'Golden'
    }
  ];
  public lineChart1Labels: Array<any> = ['August', 'September', 'October', 'November', 'December'];
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
      data: [10, 15, 20, 17, 34],
      label: 'Golden'
    }
  ];
  public lineChart2Labels: Array<any> = ['August', 'September', 'October', 'November', 'December'];
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
      data: [45, 34, 12, 40, 78, 81, 80],
      label: 'Golden'
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
      label: 'Golden',
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
        labelColor: function (tooltipItem, chart) {
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
          callback: function (value: any) {
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

  // barChart3
  public barChart3Data: Array<any> = [
    {
      data: [ 12, 11, 17, 20, 15, 28, 32],
      label: 'Percentage'
    }
  ];
  public barChart3Labels: Array<any> = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  public barChart3Options: any = {
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
    legend: {
      display: false
    }
  };
  public barChart3Primary: Array<any> = [
    {
      backgroundColor: getStyle('--primary'),
      borderColor: 'transparent',
      borderWidth: 1
    }
  ];
  public barChart3Danger: Array<any> = [
    {
      backgroundColor: getStyle('--danger'),
      borderColor: 'transparent',
      borderWidth: 1
    }
  ];
  public barChart3Success: Array<any> = [
    {
      backgroundColor: getStyle('--success'),
      borderColor: 'transparent',
      borderWidth: 1
    }
  ];
  public barChart3Legend = false;
  public barChart3Type = 'bar';



  // barChart6
  public barChart6Data: Array<any> = [
    {
      data: [ 1, 2, 1, 0, 2, 0, 1],
      label: 'Percentage'
    }
  ];
  public barChart6Labels: Array<any> = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  public barChart6Options: any = {
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
    legend: {
      display: false
    }
  };
  public barChart6Primary: Array<any> = [
    {
      backgroundColor: getStyle('--primary'),
      borderColor: 'transparent',
      borderWidth: 1
    }
  ];
  public barChart6Danger: Array<any> = [
    {
      backgroundColor: getStyle('--danger'),
      borderColor: 'transparent',
      borderWidth: 1
    }
  ];
  public barChart6Success: Array<any> = [
    {
      backgroundColor: getStyle('--success'),
      borderColor: 'transparent',
      borderWidth: 1
    }
  ];
  public barChart6Legend = false;
  public barChart6Type = 'bar';



  // barChart7
  public barChart7Data: Array<any> = [
    {
      data: [ 15, 20, 27, 20, 35, 30, 38],
      label: 'Percentage'
    }
  ];
  public barChart7Labels: Array<any> = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  public barChart7Options: any = {
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
    legend: {
      display: false
    }
  };
  public barChart7Primary: Array<any> = [
    {
      backgroundColor: getStyle('--primary'),
      borderColor: 'transparent',
      borderWidth: 1
    }
  ];
  public barChart7Danger: Array<any> = [
    {
      backgroundColor: getStyle('--danger'),
      borderColor: 'transparent',
      borderWidth: 1
    }
  ];
  public barChart7Success: Array<any> = [
    {
      backgroundColor: getStyle('--success'),
      borderColor: 'transparent',
      borderWidth: 1
    }
  ];
  public barChart7Legend = false;
  public barChart7Type = 'bar';


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
      data: [11, 15, 18, 23, 55, 60, 78],
      label: 'LinkedIn'
    }
  ];
  public brandBoxChartData4: Array<any> = [
    {
      data: [23, 60, 56, 35, 97, 64, 97],
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
    private basicInvestmentService: BasicInvestmentService,
    private configAppService: ConfigAppService,
    private profilService: ProfilService) {
    this.waitData = true;
    this.getInitiateInvestments();
    this.getConfirmInvestments();
    // this.notification.refreshFonct();

    let dString = 'November, 11, 2021';
    let d1 = new Date(dString);
    let d2 = new Date();
    console.log('différence de date: ', this.inDays(d1, d2));
    this.allUserSimulation();
  }

  allUserSimulation(){
    let dString = 'November, 11, 2021';
    let d1 = new Date(dString);
    let d2 = new Date();
    this.allUserSimullation = this.inDays(d1, d2) + 255;
    console.log('allUserSimullation: ', this.allUserSimullation);
  }

  inDays(d1, d2): number {
    let t2 = d2.getTime();
    let t1 = d1.getTime();
    // let t3 = d2.getHours();
    // console.log('t3: ', t3);

    // tslint:disable-next-line:radix
    let difDate = (t2 - t1) / (24 * 3600 * 1000);
    let entier = Math.trunc((t2 - t1) / (24 * 3600 * 1000));
    let allUserSimullation = Math.trunc((difDate - entier) * 100) + 6 + entier;
    console.log('allUserSimullation: ', allUserSimullation);
    return allUserSimullation;
  }

  inWeeks(d1, d2): number {
    let t2 = d2.getTime();
    let t1 = d1.getTime();

    // tslint:disable-next-line:radix
    return (t2 - t1) / (24 * 3600 * 1000 * 7);
  }

  inMonths(d1, d2) {
    let d1Y = d1.getFullYear();
    let d2Y = d2.getFullYear();
    let d1M = d1.getMonth();
    let d2M = d2.getMonth();

    return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
  }

  inYears(d1, d2) {
    return d2.getFullYear() - d1.getFullYear();
  }

  getInitiateInvestments() {
    // tslint:disable-next-line:max-line-length
    this.myInvestment.getMyOrderedInitiatedInvestment(this.authService.currentUserSubject.getValue().id).subscribe((investment: Investment) => {
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
      .catch((error: ResultStatut) => {
        let message = '';
        this.showSaleBonus.hide();
        if (error.apiCode == ResultStatut.INVALID_ARGUMENT_ERROR) message = error.message;
        else message = '\<b>Oops!!\</b>Unknow error. please contact administrator <br> contact.momo.coin@gmail.com'
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
    this.eventService.newInvestmentArrivedEvent.subscribe((result) => {
      if (result) { this.waitData = false }
    });
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
      // console.log("min ",this.minBonus);
      this.bonus = user.bonus;
      if (user.bonus >= this.configAppService.bonus.getValue().minBonus) {
        this.saleBonus = true;
        this.nextBonus = user.bonus - this.configAppService.bonus.getValue().minBonus;
      }
    });

    this.configAppService.bonus.subscribe((value) => {
      this.minBonus = value.minBonus;
      if (this.bonus >= this.configAppService.bonus.getValue().minBonus) {
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
    this.authService.currentUserSubject.subscribe((user) => {
      this.bonus = user.bonus;
    })
    this.myInvestment.investments.subscribe((mapInvest: Map<String, Investment>) => {
      this.initiatedInvestAmount = 0;
      this.onWaitingPayementDateInvestAmount = 0;
      this.readyToPayInvestAmount = 0;
      Array.from(mapInvest.values()).filter((invest: Investment) => invest.idOwner.toString() == this.authService.currentUserSubject.getValue().id.toString()).forEach((invest: Investment) => {
        switch (invest.investmentState) {
          case InvestmentState.INITIATE:
            this.initiatedInvestAmount++;
            break;
          case InvestmentState.ON_WAITING_PAYMENT_DATE:
            this.onWaitingPayementDateInvestAmount++;
            break;
          case InvestmentState.READY_TO_PAY:
            this.readyToPayInvestAmount++;
            break;
        }
      })
    })
  }
}
