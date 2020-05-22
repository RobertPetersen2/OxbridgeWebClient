import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


    slides: any = [[]];
    chunk(arr, chunkSize) {
      let R = [];
      for (let i = 0, len = arr.length; i < len; i += chunkSize) {
        R.push(arr.slice(i, i + chunkSize));
      }
      return R;
    }


  constructor() { }

  ngOnInit(): void {
    this.slides = this.chunk(this.cards, 3);

  }

  cards = [
    {
      title: 'Card Title 1',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://i.guim.co.uk/img/media/0430f4bebfbabe0074ac8a2689c88dd63ac65652/0_0_2500_1500/master/2500.jpg?width=1920&quality=85&auto=format&fit=max&s=bf05b26261e3a10f832002f7c8118bbf'
    },
    {
      title: 'Card Title 2',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://i.guim.co.uk/img/media/9f85529d3c3281db1fae493b32d483fba2627ea3/0_67_2306_1383/master/2306.jpg?width=1920&quality=85&auto=format&fit=max&s=f340e1e3ce2a68cea4a74f6bbb2800bc'
    },
    {
      title: 'Card Title 3',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://i.guim.co.uk/img/media/060e9a164566cf9a9ab06dac9ad5236fea37fcc5/150_0_2135_1281/master/2135.jpg?width=620&quality=85&auto=format&fit=max&s=9b641435230f999fe2132c2f0126e68c'
    },
    {
      title: 'Card Title 4',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://media.istockphoto.com/photos/sailing-crew-on-sailboat-during-regatta-picture-id475069301'
    },
    {
      title: 'Card Title 5',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://www.theboatrace.org/wp-content/uploads/Screenshot-2020-03-29-at-15.18.03.png'
    },
    {
      title: 'Card Title 6',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://i.guim.co.uk/img/media/40e93b15bbbecf452b180ebf486dd4c08fca58ae/0_345_6016_3611/master/6016.jpg?width=620&quality=85&auto=format&fit=max&s=71a23a83d4dd27aab89411cf6766f945'
    }, 
  ];

}