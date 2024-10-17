import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AddEditDialogComponent } from './pages/add-edit-dialog/add-edit-dialog.component';

export const routes: Routes = [
    {
        path: '',
        component: ProductsComponent
    },
    {
        path: 'products',
        component: ProductsComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    },
    {
        path: 'add-edit-dialog',
        component: AddEditDialogComponent
    }
];
