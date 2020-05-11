import { Component, OnInit } from '@angular/core';
import { FlaskapiService} from "../flaskapi.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import{ Recipe} from "../models/Recipe";
import {FormGroup, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  constructor(private flaskApiService: FlaskapiService, private route: ActivatedRoute, private router: Router) { }

  public currentId: any = this.route.snapshot.paramMap.get("id");
  public recipeSubscription: Subscription;
  public editSubscription: Subscription;
  public recipe: Recipe;
  public editMode: boolean = false;
  public image: any;
  public busy: boolean;

  public editForm = new FormGroup({
    meal_name: new FormControl('', Validators.required),
    recipe: new FormControl('', Validators.required),
    old_image_addr: new FormControl('', Validators.required),
    id: new FormControl('', Validators.required),
    image_name: new FormControl('', Validators.required)
  });

  public getRecipeById(){
    this.recipeSubscription = this.flaskApiService.getRecipe(this.currentId).subscribe( res => {
      this.recipe = res["data"];
      console.log(this.recipe)

      this.editForm.setValue({
        meal_name: this.recipe[1],
        recipe: this.recipe[2],
        id: this.recipe[0],
        old_image_addr: this.recipe[3],
        image_name: this.recipe[4]
      })
    })
  }

  public enableEdit(){
    this.editMode = !this.editMode;
  }

  public handleInput($event: Event){
    //getting the image or files
    this.image = $event.target["files"];
    console.log(this.image);
  }

  public editRecipe(formData: Recipe){
    this.busy = true;
    this.editSubscription = this.flaskApiService.editRecipe(formData, this.image).subscribe(res => {
      this.busy = false;
      console.log(res)
    })
  }

  public deleteRecipe(recipeId: any){
    this.flaskApiService.deleteRecipe(recipeId).subscribe(res => {
      this.router.navigate(["/"]);
    })
  }

  ngOnInit(): void {
    this.getRecipeById()
  }



}
