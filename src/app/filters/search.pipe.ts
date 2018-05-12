import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'search'
})
export class SearchPipe implements PipeTransform {

	transform(items: any[], searchText: string): any[] {
		if(!items) return [];
		if(!searchText) return items;

		
		searchText = searchText.toLowerCase();
		console.log(items);

		return items.filter(it => {
			for(let t in it){
				let s:any;

				if(it[t]){
		console.log(t);


				 s = String(it[t]).toLowerCase().includes(searchText);}
				if (s) return it;
			}
		});
	}

}
