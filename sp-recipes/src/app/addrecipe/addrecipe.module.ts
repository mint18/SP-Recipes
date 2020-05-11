import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import { AddrecipeRoutingModule} from "./addrecipe-routing.module";
import {AddrecipeComponent} from "./addrecipe.component";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    AddrecipeRoutingModule,
    ReactiveFormsModule,
    CommonModule
  ],
  declarations: [AddrecipeComponent]
})
export class AddrecipeModule { }
