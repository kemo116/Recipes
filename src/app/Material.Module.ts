import { NgModule } from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
    exports:[
MatInputModule,
MatSelectModule,
MatToolbarModule,
MatMenuModule,
MatIconModule,
MatButtonModule,
MatAutocompleteModule,
MatDialogModule,

    ]
})
export class MaterialModule{}