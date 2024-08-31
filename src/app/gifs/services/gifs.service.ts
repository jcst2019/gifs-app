import { Gif, SearchResponse } from './../interfaces/gifs.interfaces';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList:Gif[]=[];
  private _tagHistory: string[]=[];
  private apiKey:     string='bE4XW92SErYUDGeBVixGJoIzHjittdhF';
  private serviceUrl: string ='https://api.giphy.com/v1/gifs';

  constructor(private http:HttpClient) {
    this.loadLocalStorage();
   }

  get tagsHistory(){

    return [...this._tagHistory];

  }

  private organizedHistory(tag:string){

    tag.toLowerCase();
    if(this._tagHistory.includes(tag)){
        this._tagHistory = this._tagHistory.filter((oldTag)=>oldTag !== tag)
    }
    this._tagHistory.unshift(tag);
    this._tagHistory = this._tagHistory.splice(0,10);
    this.saveLocalStorage();

  }

  private saveLocalStorage():void{

    localStorage.setItem('history',JSON.stringify(this._tagHistory));

  }

  private loadLocalStorage():void{

    if(!localStorage.getItem('history')) return;

    this._tagHistory = JSON.parse(localStorage.getItem('history')!);

    if(this._tagHistory.length === 0 ) return;
    
    this.searchTag(this._tagHistory[0]);
    

  }

  // public async searchTag(tag:string):Promise<void>{
  public searchTag(tag:string):void{
    // if(tag!=='')
      if(tag.length===0) return;
      this.organizedHistory(tag);
      // this._tagHistory.unshift(tag);

      // fetch('https://api.giphy.com/v1/gifs/search?api_key=bE4XW92SErYUDGeBVixGJoIzHjittdhF&q=valorant&limit=10')
      // .then(resp => resp.json())
      // .then(data => console.log(data));


      // this.http.get('https://api.giphy.com/v1/gifs/search?api_key=bE4XW92SErYUDGeBVixGJoIzHjittdhF&q=valorant&limit=10')
      // .subscribe(resp => console.log(resp));

      const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('limit', '10')
        .set('q', tag)  

      this.http.get<SearchResponse>(`${this.serviceUrl}/search`,{params})
      .subscribe((resp) => {
        console.log(resp);
        // console.log(resp.data);
        this.gifList=resp.data;
        console.log({gifs:this.gifList});
        
      });
  }

}
