import { Injectable } from '@angular/core';
import { ConfigAppService } from '../config-app/config-app.service';

@Injectable({
    providedIn: 'root'
  })
export class PlanService {
    constructor(private configAppService: ConfigAppService) {}

    calculePlan(amount: number, plan: number): number {
        // tslint:disable-next-line: prefer-const triple-equals
        let gainPlan = this.configAppService.gains.getValue().find((gain) => gain.numberOfDay == plan);
        if (!gainPlan) { return amount; }
        // tslint:disable-next-line:radix
        // if (plan = 10) { return (amount * 30 / 100) + amount; } else if (plan = 20) {
        //     return (amount * 65 / 100) + amount; } else if (plan = 30) {
        //     return (amount * 100 / 100) + amount; }
        // tslint:disable-next-line:radix
        return (amount * parseInt(gainPlan.percent) / 100) + amount;

    }
}
