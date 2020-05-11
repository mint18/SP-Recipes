import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import {Recipe} from "./models/Recipe";

@Injectable({
  providedIn: 'root'
})
export class FlaskapiService {

  constructor(private httpClient: HttpClient) { }

  public server:string = "http://localhost:5000/api/";

  public getRecipes(){
    return this.httpClient.get<Recipe>(this.server+"recipes")
  }

  public getRecipe(recipeId: string){
    return this.httpClient.get<Recipe>(this.server + `recipe/${recipeId}`)
  }

  public addRecipe(postObj: Recipe, image: any){

    console.log(image)

    const {meal_name, recipe} = postObj;
    const formData: FormData = new FormData();

    formData.append("meal_name", meal_name);
    formData.append("recipe", recipe);
    formData.append("image_file", image[0], image["filename"]);

    return this.httpClient.post<Recipe>(this.server + "addrecipe", formData)
  }

  public editRecipe(recipeObj: Recipe, image: any){
    const {meal_name, recipe, id, old_image_name, image_name} = recipeObj;
    const formData: FormData = new FormData();

    formData.append("id", id)
    formData.append("meal_name", meal_name)
    formData.append("recipe", recipe)
    formData.append("old_image_name", old_image_name)
    formData.append("image_name", image_name)

    if(image !== undefined) {
      formData.append("image_file", image[0], image["filename"]);
      return this.httpClient.put<Recipe>(this.server + `editfullrecipe/${id}`, formData);
    }else{
      return this.httpClient.put<Recipe>(this.server + `editrecipe/${id}`, formData)
    }
  }


  public deleteRecipe(recipeId: any){
    const formData: FormData = new FormData();
    formData.append("id", recipeId);

    return this.httpClient.request("delete", this.server + `deleterecipe/${recipeId}`, {body: formData})
  }

}
