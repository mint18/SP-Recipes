import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {FlaskapiService} from "../flaskapi.service";
import {Router} from "@angular/router";
import { Recipe } from "../models/Recipe"


@Component({
  selector: 'app-addrecipe',
  templateUrl: './addrecipe.component.html',
  styleUrls: ['./addrecipe.component.css']
})
export class AddrecipeComponent implements OnInit {

  constructor(private flaskApiService: FlaskapiService, private router: Router) { }

  public image:any = null;
  public busy: boolean

  public recipeForm = new FormGroup({
    meal_name: new FormControl('', Validators.required),
    recipe: new FormControl('', Validators.required),
    image_file: new FormControl('', Validators.required),
  });

  public handleInput($event: Event){
    //getting the image or files
    this.image = $event.target["files"];
    console.log(this.image);
  }

  public addRecipe(formData: Recipe){
    this.busy = true;
    this.flaskApiService.addRecipe(formData, this.image).subscribe(res => {
      this.busy = false;
      console.log(res);
      this.router.navigate(["/"]);
    });
  }

  ngOnInit(): void {
  }

}
