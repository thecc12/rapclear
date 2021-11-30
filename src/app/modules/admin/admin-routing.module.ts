import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminerGuard } from '../../guard/adminer.guard';
import { UserManageGuard } from '../../guard/user-manage.guard';
import { InvestmentsPanelComponent } from './investments-panel/investments-panel.component';
import { AddInvestmentComponent } from './investment/add-investment/add-investment.component';
import { ListsInvestmentComponent } from './investment/lists-investment/lists-investment.component';
import { PanelComponent } from './panel/panel.component';
import { SettingsAdminComponent } from './settings-admin/settings-admin.component';
import { UserAdminPanelComponent } from './user-admin-panel/user-admin-panel.component';
import { ListsUserComponent } from './users/lists-user/lists-user.component';

const routes: Routes = [
    {
        path: '',
        data: {
        },
        children: [
            {
                path: '',
                redirectTo: 'panel'
            },
            {
                path: 'panel',
                // canActivate: [AdminerGuard],
                component: PanelComponent,
                data: {
                    title: 'Admin Panel'
                }
                // canActivate:[AuthGuard]

            },
            {
                path: 'user-panel',
                // canActivate: [AdminerGuard],
                component: UserAdminPanelComponent,
                data: {
                    title: 'Users Panel'
                }
                // canActivate:[AuthGuard]

            },
            {
                path: 'investments-panel',
                // canActivate: [AdminerGuard],
                component: InvestmentsPanelComponent,
                data: {
                    title: 'Investments Panel'
                }
                // canActivate:[AuthGuard]

            },
            {
                path: 'list-user',
                // canActivate: [UserManageGuard],
                component: ListsUserComponent,
                data: {
                    title: 'User list'
                }
                // canActivate:[AuthGuard]

            },
            {
                path: 'list-investment',
                // canActivate: [AdminerGuard],
                component: ListsInvestmentComponent,
                data: {
                    title: 'List investment'
                }
                // canActivate:[AuthGuard]

            },
            {
                path: 'setting-panel',
                // canActivate: [AdminerGuard],
                component: SettingsAdminComponent,
                data: {
                    title: 'Settings'
                }
                // canActivate:[AuthGuard]

            },
            {
                path: 'add-investment',
                // canActivate: [AdminerGuard],
                component: AddInvestmentComponent,
                data: {
                    title: 'Add investment'
                }
                // canActivate:[AuthGuard]

            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class AdminRoutingModule { }
