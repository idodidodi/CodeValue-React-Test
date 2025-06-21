import './App.less'

import { useState, useEffect, type MouseEvent, useRef } from 'react'
import type { ProductData, SortBy, SortByOption } from './models'
import { dummyProducts } from './dummy-data'
import { Product, ProductDetails } from './components/product';
import { SortByDropDown } from './components/sort-by';

function App() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const firstInit = useRef<boolean>(null);
  const [selectedItemIdx, setSelectedItemIdx] = useState<number>(-1);
  const [selectedSortByOption, setSelectedSortByOption] = useState<SortByOption>({ name: "Name", sortType: "name" });
  const [createNewItem, setCreateNewItem] = useState<boolean>(false);
  const [hideSortByDown, setHideSortByDown] = useState<boolean>(true);

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
    sortBy(selectedSortByOption.sortType);
  }, [products])

  const showProdcutDetails = (): boolean => createNewItem || (selectedItemIdx > -1 && products[selectedItemIdx]?.state !== "deleted");
  const toggleHide = () => {
    setHideSortByDown(!hideSortByDown);
  }
  const getNewEmptyItem = (): ProductData => {
    return { name: "New item name", id: products.length + 1, price: 0, creationDate: new Date(), state: "pending" };

  }
  const addItem = () => {
    setCreateNewItem(true);
  }

  const saveItem = (newItem: ProductData): void => {
    setProducts(prev => {
      const nextState = [...prev];
      const idx = nextState.findIndex(item => item.id === newItem.id);
      if (idx === -1) {
        nextState.push({ ...newItem, state: "approved" });
        setCreateNewItem(false);
      } else {
        nextState[idx].description = newItem.description;
        nextState[idx].price = newItem.price;
        nextState[idx].name = newItem.name;
      }
      sortBy(selectedSortByOption.sortType, nextState);
      return nextState;
    })
  };

  const sortBy = (sortType: SortBy, _products: ProductData[] = products): void => {
    if (sortType === "name") {
      _products.sort((a, b) => {
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
    } else {
      _products.sort((a, b) => {
        if (a.creationDate === b.creationDate) return 0;
        return a.creationDate < b.creationDate ? -1 : 1
      })
    }
  }
  const sortProdcuts = (sortTypeOption: SortByOption, _products: ProductData[] = products): void => {
    setSelectedSortByOption(sortTypeOption);
    sortBy(sortTypeOption.sortType, _products);
  }

  const filterProducts = (e: any):void=>{
    setProducts(prev=>{
      const inputText = e.target.value;
      if (inputText.length === 0) {
        // implement bring full list from local storage
        return prev;
      }

      const nextState = [...prev.filter(item=> (item.description && item.description.toLowerCase().includes(inputText)) || item.name.toLowerCase().includes(inputText))];
      return [...nextState];
    })
  }
  return (
    <div className='store-container' onClick={() => {
      setHideSortByDown(true);
    }}>
      <div className="header">MY STORE</div>
      <div className="body">
        <div className="actions">
          <button
            className="add"
            onClick={addItem}
          >+Add</button>
          <div className="search-products">
            <div className="maginifying-glass">&#128269;</div>
            <input type="text" title='Search products' placeholder="Search products" className='input-search-products' onChange={filterProducts}/>
          </div>
          <div className="sort-by">
            <div className="sort-by-header">Sort by</div>
            <SortByDropDown
              hide={hideSortByDown}
              updateHide={toggleHide}
              selectedOption={selectedSortByOption}
              onClickOption={sortProdcuts}
              options={[{ name: "Name", sortType: "name" }, { name: "Recently added", sortType: "recent" }]}
            />
          </div>
        </div>
        <div className="products">
          <div className="list">{
            products.
              filter(item => item.state === "approved").
              map((item) => <
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
