import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigAppService } from '../../../services/config-app/config-app.service';
import { ResultStatut } from '../../../services/firebase/resultstatut';
import { NotificationService } from '../../../services/notification/notification.service';
import { GainInputComponent } from '../gain-input/gain-input.component';

@Component({
  selector: 'app-gain',
  templateUrl: './gain.component.html',
  styleUrls: ['./gain.component.css']
})
export class GainComponent implements OnInit {

  waitForChangeStateGain: boolean = false;
  waitForChangeStateBonus: boolean = false;
  gainList: {percent: string, numberOfDay: number}[] = [];
  waitLoadData = true;

  formBonus: FormGroup;

  @ViewChildren(GainInputComponent) gains: QueryList<GainInputComponent>;
  constructor(
    private configAppService: ConfigAppService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.formBonus = new FormGroup({
      formBonusValue: new FormControl(0, [Validators.required]),
      formMinBonus: new FormControl(0, [Validators.required]),
    });

    this.configAppService.gains.subscribe((gains: {percent: string, numberOfDay: number}[]) => {
      this.gainList = gains;
      if (this.gainList.length > 0) { this.waitLoadData = false; }
    });

    this.configAppService.bonus.subscribe((value) => {
      this.formBonus.controls.formBonusValue.setValue(value.bonus);
      this.formBonus.controls.formMinBonus.setValue(value.minBonus);
    });

    // this.formBonus=new FormGroup({
    //   "toFirstParent":new FormControl(0,[Validators.required]),
    //   "toSecondParent":new FormControl(0),
    //   "toThirdParent":new FormControl(0),
    //   "toFourParent":new FormControl(0)
    // })
  }
  addGain() {
    this.gainList.push({percent: '0', numberOfDay: 0});
  }
  removeGain() {
    this.gainList.splice(this.gainList.length - 1);
  }
  saveGain() {
    let tlist: GainInputComponent[] = this.gains.toArray();
    let ngList: {percent: string, numberOfDay: number}[] = [];
    for (let i = 0; i < tlist.length; i += 2) {
      // tslint:disable-next-line:radix
      let nberOfDay = parseInt(tlist[i].getValue());
      // tslint:disable-next-line:radix
      let percent = parseInt(tlist[i + 1].getValue());

      if (percent <= 0) {
        this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br>The percentage of row N°${(i / 2) + 1} is invalid`);
        return;
      }
      if (nberOfDay <= 0) {
        this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br>The number of days of row N°${(i / 2) + 1} is invalid`);
        return;
      }
      ngList.push({
        percent: `${percent}`,
        numberOfDay: nberOfDay
      });
    }
    if (this.waitForChangeStateGain) { return; }
    this.waitForChangeStateGain = true;
    this.configAppService.saveGain(ngList)
    .then((result: ResultStatut) => {
      this.waitForChangeStateGain = false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br>The earnings have been successfully updated`);
    })
    .catch((result: ResultStatut) => {
      this.waitForChangeStateGain = false;
      // tslint:disable-next-line:max-line-length
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br>` + result.message);
    });
    // console.log("Gain",ngList)
  }


  saveBonus() {
    if (!this.formBonus.valid) {
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br>the bonus value is invalid`); }
    this.waitForChangeStateBonus = true;
    this.configAppService.saveBonus({bonus: this.formBonus.value.formBonusValue, minBonus: this.formBonus.value.formMinBonus})
    .then((result: ResultStatut) => {
      this.waitForChangeStateBonus = false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br>The bonus have been successfully updated`);
    })
    .catch((result: ResultStatut) => {
      this.waitForChangeStateGain = false;
      // tslint:disable-next-line:max-line-length
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br>` + result.message);
    })
  }
}
