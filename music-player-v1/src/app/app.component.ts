import { Component } from '@angular/core';


interface Song{
  fileName: String;
  weight?: number;
}

interface Weight {
  value: number;
  viewValue: string;
}


export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  tiles: Tile[] = [
    {text: 'One', cols: 1, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 1, color: 'lightgreen'},
    {text: 'Three', cols: 2, rows: 1, color: 'lightpink'}
  ];






  arrayFiles:File[]=[];
  tmp_arrayFiles:File[]=[];
  addedFiles:File[]=[];
  uplodedSongs:Song[]=[];

  public selectedWeight?:number;
  onFileSelected(event:any){
    this.tmp_arrayFiles=Array.from(event.target.files);
    this.arrayFiles=this.arrayFiles.concat(this.tmp_arrayFiles);
      //this.arrayFiles.push(event.target.files[0]);
  }
  onAdd(file:File):void{
    let tmpSong={fileName:file.name}
    this.uplodedSongs.push(tmpSong);

    this.addedFiles.push(file); 
  }
  
  onDelete(song:Song){
    const index: number=this.uplodedSongs.indexOf(song);
    if(index!==-1){
      this.uplodedSongs.splice(index,1);
    }
  }

  weights: Weight[] = [
    {value: 1, viewValue: '1'},
    {value: 5, viewValue: '5'},
    {value: 10, viewValue: '10'},
  ];

  public onWeightChange(song:Song){

  }
  

  

}
