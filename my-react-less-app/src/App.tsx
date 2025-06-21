import './App.less'

import { useState, useEffect, type MouseEvent, useRef } from 'react'
import type { ProductData } from './models'
import { dummyProducts } from './dummy-data'
import { Product, ProductDetails } from './components/product';

function App() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const firstInit = useRef<boolean>(null);
  const [selectedItemIdx, setSelectedItemIdx] = useState<number>(-1);
  const [createNewItem, setCreateNewItem] = useState<boolean>(false);

  useEffect(() => {
    if (firstInit.current == null) {
      setProducts(() => {
        const nextState = [...dummyProducts];
        setSelectedItemIdx(nextState.findIndex(item => item.state === "approved"));
        return nextState;
      }
      );
      firstInit.current = false;
    } else {
      if (selectedItemIdx === -1) {
        setSelectedItemIdx(products.findIndex(item => item.state === "approved"));
      }
    }
  }, [products])

  const showProdcutDetails = (): boolean => createNewItem || (selectedItemIdx > -1 && products[selectedItemIdx]?.state !== "deleted");

  const getNewEmptyItem = (): ProductData => {
    return { name: "New item name", id: products.length + 1, price: 0, creationDate: new Date(), state: "pending" };

  }
  const addItem = () => {
    setCreateNewItem(true);
  }

  const saveItem = (newItem: ProductData): void => {
    setProducts(prev => {
      const nextState = [...prev];
      const idx = nextState.findIndex(item=>item.id === newItem.id);
      if (idx === -1) {
        nextState.push({...newItem, state:"approved"});
        setCreateNewItem(false);
      } else {
        nextState[idx].description = newItem.description;
        nextState[idx].price = newItem.price;
        nextState[idx].name = newItem.name;
      }
      return nextState;
    })

  }
  return (
    <div className='store-container'>
      <div className="header">MY STORE</div>
      <div className="body">
        <div className="actions">
          <button
            className="add"
            onClick={addItem}
          >+Add</button>
          <div className="search-products">
            <div className="maginifying-glass">Add maginifying glass</div>
            <input type="text" title='Search producs' defaultValue="Search producs" />
          </div>
          <div className="sort by">Sort BY</div>
        </div>
        <div className="products">
          <div className="list">{
            products.
              filter(item => item.state === "approved").
              map((item, idx) => <
                Product
                item={item}
                key={item.id}
                onSelect={() => {
                  setSelectedItemIdx(products.findIndex(_item => _item.id === item.id));
                }}
                onDelete={(e: MouseEvent) => {
                  const _idx = products.findIndex(_item => _item.id === item.id);
                  if (_idx > - 1) {
                    products[_idx].state = "deleted";
                    setProducts([...products]);
                  }
                  if (!createNewItem) {
                    setSelectedItemIdx(-1);
                  }
                  e.stopPropagation();

                }}
              />)
          }</div>
          <div className="item-description">
            {showProdcutDetails() && <ProductDetails item={createNewItem ? getNewEmptyItem() : products[selectedItemIdx]} saveItem={saveItem} />}
          </div>
        </div>
        <div className="pagination"></div>

      </div>
      <div className="footer"></div>
    </div>
  )
}

export default App
