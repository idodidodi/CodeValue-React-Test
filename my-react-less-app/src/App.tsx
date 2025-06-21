import './App.less'

import { useState } from 'react'
import type { Product } from './models'

const dummyProducts: Product[] = [
  {
    id: 1,
    name: "Chair",
    price: 100,
    creationDate: new Date("December 17, 1995 03:24:00"),
    description: "Something you sit on"
  },
  {
    id: 2,
    name: "Table",
    price: 110,
    creationDate: new Date("December 17, 1996 03:24:00"),
    description: "Something you put things on"
  },
  {
    id: 3,
    name: "Stool",
    price: 50,
    creationDate: new Date("December 17, 1997 03:24:00"),
    description: "Something you sit on"
  },
  {
    id: 4,
    name: "Toilet",
    price: 150,
    creationDate: new Date("December 17, 1998 03:24:00"),
    description: "Something you use everyday for your natural needs"
  },
  {
    id: 5,
    name: "Tap",
    price: 200,
    creationDate: new Date("December 17, 1999 03:24:00"),
    description: "Something that springs water"
  },
];
function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className='store-container'>
      <div className="header"></div>
      <div className="body">
        <div className="actions"></div>
        <div className="products">
          <div className="list"></div>
          <div className="item-description"></div>
        </div>
        <div className="pagination"></div>

      </div>
      <div className="footer"></div>
    </div>
  )
}

export default App
