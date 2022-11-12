import logo from './logo.svg';
import './App.css';
import Graph from "./Graph";

const iconImage = {
  object:"https://upload.wikimedia.org/wikipedia/commons/7/7e/Circle-icons-profile.svg",
  car:"https://img.icons8.com/metro/40/000000/car.png",
  house:"https://img.icons8.com/ios/40/000000/city-block.png",
  telephone:"https://img.icons8.com/ios-glyphs/40/000000/ringer-volume.png",
  social:"https://img.icons8.com/wired/40/000000/domain.png",
  meet:"https://img.icons8.com/ios/40/000000/restaurant-table.png",
  company:"https://img.icons8.com/ios/35/000000/permanent-job.png",
}

const request = [
  {
    targets: [
      {
        id: '2',
        relationType: 'weak',
        isBidirectional: false,
        label:"Здрасти5"
      },
      {
        id: '3',
        relationType: 'weak',
        isBidirectional: false,
        label:"Здрасти4"
      },
      {
        id: '4',
        relationType: 'weak',
        isBidirectional: false,
        label:"Здрасти3"
      },
      {
        id: '5',
        relationType: 'weak',
        isBidirectional: false,
        label:"Здрасти2"
      },
      {
        id: '6',
        relationType: 'weak',
        isBidirectional: false,
        label:"Здрасти1"
      }
    ],
    data: {
      id: '1',
      type: 'Object',
      title: 'Бендер Остап Сулейманович',
      detail: {
        image: iconImage.object,
        characteristics: {
          "Ф.И.О": "Бендер Остап Сулейманович",
          "День рождения": "21.03.1992",
          "#хэштег#": '#ostap22',

        },
        comments: 'Вино, женщины и карты нам обеспечены.'
      }
    }
  },
  {
    targets: [],
    data: {
      id: '2',
      title: '+79017950443',
      type: 'Abonent',
      detail: {
        image: iconImage.telephone,
        characteristics: {
          "Номер телефона": '+79017950443',
          "IMSI ": 'International Mobile Subscriber Identity',
        },
        comments: 'Время, которое у нас есть, — это деньги, которых у нас нет.'
      }
    }
  },
  {
    targets: [],
    data: {
      id: '3',
      title: 'Vk',
      type: 'SocialNetwork',
      detail: {
        image: iconImage.social,
        characteristics: {
          "Наименование соцсети": 'VK',
          Username :"Ostap2103",
          ID :"3412"
        },
        comments: 'Знойная женщина — мечта поэта.'
      }
    }
  },
  {
    targets: [],
    data: {
      id: '4',
      title: 'BMW 320 black',
      type: 'car',
      detail: {
        image: iconImage.car,
        characteristics: {
          ГРЗ : 'е666кз77',
          марка : 'BMW 320 black',
          vin : '5678956789067890',
        },
        comments: 'Лёд тронулся, господа присяжные заседатели!'
      }
    }
  },
  {
    targets: [],
    data: {
      id: '5',
      title: 'Adress',
      type: 'house',
      detail: {
        image: iconImage.house,
        characteristics: {
          Адресс: 'Пушкина 22',
        },
        comments: 'Командовать парадом буду я!'
      }
    }
  },
  {
    targets: [],
    data: {
      id: '6',
      title: 'Fintech',
      type: 'Сompany',
      detail: {
        image: iconImage.company,
        characteristics: {
          инн: '566796677557',
        },
        comments: 'CName - Финтех'
      }
    }
  },
  {
    targets: [
      {
        id: '8',
        relationType: 'strong',
        isBidirectional: true,
        label:"Здрасти",
      },
      {
        id: '9',
        relationType: 'strong',
        isBidirectional: true,
        label:"Здрасти"
      },],
    data: {
      id: '7',
      type: 'Object',
      title: 'Толстой Лев Николаевич',
      detail: {
        image: iconImage.object,
        characteristics: {

          "День рождения": "9 сентября 1828",
          "#хэштег#": '#lev1828',

        },
        comments: 'Утро помещика (1856)'
      }
    }
  },
  {
    targets: [],
    data: {
      id: '8',
      title: 'Cоюз писателей',
      type: 'Сompany',
      detail: {
        image: iconImage.company,
        characteristics: {
          инн: '566796677557',
        },
        comments: 'Союз писателей'
      }
    }
  },
  {
    targets: [],
    data: {
      id: '9',
      title: 'Adress',
      type: 'house',
      detail: {
        image: iconImage.house,
        characteristics: {
          Адресс: 'Ленина 22',
        },
        comments: 'Парам!'
      }
    }
  },
  {
    targets: [
      {
        id: '7',
        relationType: 'medium',
        isBidirectional: true,
        label:"Здрасти"
      },
      {
        id: '1',
        relationType: 'medium',
        isBidirectional: true,
        label:"Здрасти333"
      }],
    data: {
      id: '10',
      title: 'Вершина связи двух сущностей',
      type: 'Встреча',
      detail: {
        image: iconImage.meet,
        characteristics: {
          OBJ1: 'Остап Сулейсанович',
          OBJ2: "Лев Николаевич"
        },
        comments: 'Парам!'
      }
    }
  },
];

function App() {
  return (
    <Graph request1={request}/>
  );
}

export default App;
