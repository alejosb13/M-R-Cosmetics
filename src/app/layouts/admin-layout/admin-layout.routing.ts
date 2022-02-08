import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';

import { ClientesComponent } from 'app/pages/clientes/clientes.component';
import { ClienteEditarComponent } from 'app/pages/clientes/cliente-editar/cliente-editar.component';
// import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'inicio',               component: DashboardComponent },
    
    { path: 'cliente',              component: ClientesComponent },
    { path: 'cliente/guardar/:id',  component: ClienteEditarComponent },
    { path: 'cliente/editar/:id',   component: ClienteEditarComponent },

    
    { path: 'user',           component: UserComponent },
    { path: 'table',          component: TableComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    // { path: 'upgrade',        component: UpgradeComponent }
];
