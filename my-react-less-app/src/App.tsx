import './App.less'

import classNames from 'classnames';

import { useState, useEffect, type MouseEvent, useRef } from 'react'
import type { ProductData, SortBy, SortByOption } from './models'
import { dummyProducts } from './dummy-data'
import { Product, ProductDetails } from './components/product';
import { SortByDropDown } from './components/sort-by';
import { geProductsFromToLocalStorage, saveToLocalStorage } from './localstorage-util';

const PRODCUTS_KEY = "products";
const NUMBER_OF_ITEMS_IN_PAGE = 5;
function App() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const firstInit = useRef<boolean>(null);
  const [selectedItemIdx, setSelectedItemIdx] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedSortByOption, setSelectedSortByOption] = useState<SortByOption>({ name: "Name", sortType: "name" });
  const [createNewItem, setCreateNewItem] = useState<boolean>(false);
  const [hideSortByDown, setHideSortByDown] = useState<boolean>(true);

  useEffect(() => {
    if (firstInit.current == null) {
      let productsToSet = geProductsFromToLocalStorage(PRODCUTS_KEY);
      let isSaveToLocalStorage = false;
      if (productsToSet.length === 0) {
        productsToSet = dummyProducts;
        isSaveToLocalStorage = true;
      }
      setProducts(() => {
        const nextState = [...productsToSet];
        setSelectedItemIdx(nextState.findIndex(item => item.state === "approved"));
        if (isSaveToLocalStorage) {
          saveToLocalStorage(PRODCUTS_KEY, nextState);
        }
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

  useEffect(() => {
   window.addEventListener('popstate', handleUrlChange);
   
   return ()=>{
     window.removeEventListener('popstate', handleUrlChange);
   }
  }, [])

  const handleUrlChange = ()=>{
    const hash = window.location.hash;
    const hashArr = hash.split('/');
    if (hashArr[0] === "#" && hashArr[1] === "products" && !isNaN(Number(hashArr[2]))) {
      setSelectedItemIdx(products.filter(filterValidItems).findIndex(item=>item.id === Number(hashArr[2])));
    }
  }
  const showProdcutDetails = (): boolean => createNewItem || (selectedItemIdx > -1 && products[selectedItemIdx]?.state !== "deleted");
  const toggleHide = () => {
    setHideSortByDown(!hideSortByDown);
  }
  const getNewEmptyItem = (): ProductData => {
    return { name: "", id: products.length + 1, price: 0, creationDate: new Date(), state: "pending" };

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
      saveToLocalStorage(PRODCUTS_KEY, nextState);
      sortBy(selectedSortByOption.sortType, nextState);
      setSelectedItemIdx(nextState.filter(filterValidItems).findIndex(item=>item.id === newItem.id));
      return nextState;
    })
  };

  const sortBy = (sortType: SortBy, _products: ProductData[] = products): void => {
    setCurrentPage(1);
    if (selectedItemIdx >= NUMBER_OF_ITEMS_IN_PAGE) {
      setSelectedItemIdx(0);
    };
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
        return a.creationDate > b.creationDate ? -1 : 1
      })
    }
  }
  const sortProdcuts = (sortTypeOption: SortByOption, _products: ProductData[] = products): void => {
    setSelectedSortByOption(sortTypeOption);
    sortBy(sortTypeOption.sortType, _products);
  }

  const filterProducts = (e: any): void => {
    setProducts(prev => {
      const inputText = e.target.value;
      if (inputText.length === 0) {
        // implement bring full list from local storage
        return geProductsFromToLocalStorage(PRODCUTS_KEY);
      }

      const nextState = [...prev.filter(item => (item.description && item.description.toLowerCase().includes(inputText)) || item.name.toLowerCase().includes(inputText))];
      return [...nextState];
    })
  }
  const arrowLeft = "<";
  const arrowRight = ">";
  const filterValidItems = (item:ProductData):boolean=>item.state === "approved";
  const getMaxNumberOfPages = (): number => {
    const numOfItems = products.filter(filterValidItems).length;
    return Math.ceil(numOfItems / NUMBER_OF_ITEMS_IN_PAGE);
  }

  const updateCurrentPage = (products: ProductData[]): void => {
    const validItems = products.filter(filterValidItems);
    const maxPage = Math.ceil(validItems.length / NUMBER_OF_ITEMS_IN_PAGE);
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
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
            <input type="text" title='Search products' placeholder="Search products" className='input-search-products' onChange={filterProducts} />
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
              filter(filterValidItems).
              slice((currentPage - 1) * NUMBER_OF_ITEMS_IN_PAGE, NUMBER_OF_ITEMS_IN_PAGE + ((currentPage - 1) * NUMBER_OF_ITEMS_IN_PAGE)).
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
                    const nextState = [...products];
                    saveToLocalStorage(PRODCUTS_KEY, nextState);
                    updateCurrentPage(nextState);
                    setProducts(nextState);
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
        <div className="pagination">
          <div className={classNames("prev pag-item", { hide: currentPage === 1 })} onClick={() => {
            setCurrentPage(currentPage - 1);
          }}>{`${arrowLeft}   Prev Page`}</div>
          <div className="page-position pag-item">{`${currentPage} of ${getMaxNumberOfPages()}`}</div>
          <div className={classNames("next pag-item", { hide: currentPage === getMaxNumberOfPages() })} onClick={() => {
            setCurrentPage(currentPage + 1);
          }}>{`Next Page   ${arrowRight}`}</div>

        </div>

      </div>
      <div className="footer"></div>
    </div>
  )
}

export default App
