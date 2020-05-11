import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {RecipeRoutingModule} from "./recipe-routing.module";
import {RecipeComponent} from "./recipe.component";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    RecipeRoutingModule,
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    RecipeComponent
  ],
  declarations: [RecipeComponent]
})
export class RecipeModule { }
