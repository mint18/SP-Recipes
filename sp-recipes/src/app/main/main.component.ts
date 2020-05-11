import {Component, OnDestroy, OnInit} from '@angular/core';
import {FlaskapiService} from "../flaskapi.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  constructor(private flaskApiService: FlaskapiService) { }

  public recipes: any[];
  public recipesSubscription: Subscription

  public getRecipes(){
    this.recipesSubscription = this.flaskApiService.getRecipes().subscribe(p => {
      this.recipes=p["data"]
      console.log(this.recipes)
    })
  }

  ngOnInit(): void {
    this.getRecipes()
  }

  ngOnDestroy(): void {
    this.recipesSubscription.unsubscribe();
  }

}
