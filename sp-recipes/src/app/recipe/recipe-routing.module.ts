import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";


import {RecipeComponent} from "./recipe.component";


const routes: Routes = [
  { path: '', component: RecipeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeRoutingModule { }
