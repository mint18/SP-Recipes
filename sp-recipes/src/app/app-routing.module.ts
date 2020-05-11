import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {path: "", loadChildren: () => import("./main/main.module").then(m => m.MainModule)},
  {path: "addrecipe", loadChildren: () => import("./addrecipe/addrecipe.module").then(m=>m.AddrecipeModule)},
  {path: "recipe/:id", loadChildren: () => import("./recipe/recipe.module").then(m => m.RecipeModule)},
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: "enabled"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
