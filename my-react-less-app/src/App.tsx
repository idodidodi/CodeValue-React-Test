import './App.less'

import { useState, useEffect, type MouseEvent } from 'react'
import type { ProductData } from './models'
import { dummyProducts } from './dummy-data'
import { Product, ProductDetails } from './components/product';

function App() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [selectedItemIdx, setSelectedItemIdx] = useState<number>(-1);

  // const updateProducts = ():void=>{
  //   setProducts(()=>{
  //     if (products.length === 0) return [];
  //     const nextState =  products.current.filter(item => item.state === "approved");
  //     setSelectedItemIdx(nextState.findIndex(item=>item.state === "approved"));
  //     return nextState;
  //   })
  // }
  useEffect(() => {
    setProducts([...dummyProducts]);
  }, [])

  const showProdcutDetails = (): boolean => selectedItemIdx > -1 && products[selectedItemIdx].state !== "deleted";
  // const findItemIdx = (item:ProductData, id:number):boolean=>item.id === id;
  // const getIdx = (id: number):number=> products.findIndex((_item)=>findItemIdx(_item, id));
  console.log(products)

  return (
    <div className='store-container'>
      <div className="header">MY STORE</div>
      <div className="body">
        <div className="actions">
          <button className="add">+Add</button>
          <div className="search-products">
            <div className="maginifying-glass">Add maginifying glass</div>
            <input type="text" title='Search producs' defaultValue="Search producs" />
          </div>
          <div className="sort by">Sort BY</div>
        </div>
        <div className="products">
          <div className="list">{
            products.
            filter(item=>item.state === "approved").
            map((item, idx) => <
              Product
              item={item}
              key={item.id}
              onSelect={() => {
                setSelectedItemIdx(idx);
              }}
              onDelete={(e: MouseEvent) => {
                const _idx = products.findIndex(_item => _item.id === item.id);
                if (_idx > - 1) {
                  products[_idx].state = "deleted";
                  setProducts([...products]);
                }
                setSelectedItemIdx(-1);
                e.stopPropagation();

              }}
            />)
          }</div>
          <div className="item-description">
            {showProdcutDetails() && <ProductDetails item={products[selectedItemIdx]} />}
          </div>
        </div>
        <div className="pagination"></div>

      </div>
      <div className="footer"></div>
    </div>
  )
}

export default App
