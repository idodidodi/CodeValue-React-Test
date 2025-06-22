import './App.less'

import classNames from 'classnames';

import { useState, useEffect, type MouseEvent, useRef } from 'react'
import type { ProductData, SortBy, SortByOption } from './models'
import { dummyProducts } from './dummy-data'
import { Product, ProductDetails } from './components/product';
import { SortByDropDown } from './components/sort-by';
import { deleteItemFromStorage, geProductsFromToLocalStorage, saveItemToLocalStorage, saveToLocalStorage } from './localstorage-util';

const PRODCUTS_KEY = "products";
const NUMBER_OF_ITEMS_IN_PAGE = 5;
function App() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const firstInit = useRef<boolean>(null);
  const nextId = useRef<number>(null);
  const [selectedItemId, setSelectedItemId] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedSortByOption, setSelectedSortByOption] = useState<SortByOption>({ name: "Name", sortType: "name" });
  const [createNewItem, setCreateNewItem] = useState<boolean>(false);
  const [hideSortByDown, setHideSortByDown] = useState<boolean>(true);

  const setFirstValidItemId = (products: ProductData[]): void => {
    const firstValidItem = products.find(filterValidItems);
    setSelectedItemId(firstValidItem ? firstValidItem.id : -1);
  }
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
        setFirstValidItemId(nextState);
        if (isSaveToLocalStorage) {
          saveToLocalStorage(PRODCUTS_KEY, nextState);
        }
        return nextState;
      }
      );
      firstInit.current = false;
    } else {
      if (selectedItemId === -1) {
        setFirstValidItemId(products);
      }
    }
    sortBy(selectedSortByOption.sortType);
  }, [products])

  useEffect(() => {
    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    }
  }, [])

  const handleUrlChange = () => {
    const hash = window.location.hash;
    const hashArr = hash.split('/');
    if (hashArr[0] === "#" && hashArr[1] === "products" && !isNaN(Number(hashArr[2]))) {
      const requestedItem: ProductData | undefined = geProductsFromToLocalStorage(PRODCUTS_KEY).find(item => item.id === Number(hashArr[2]));
      if (requestedItem?.state === "approved") {
        setSelectedItemId(Number(hashArr[2]))
      }
    }
  }
  const showProdcutDetails = (): boolean => {
    if (createNewItem) {
      return true;
    }
    if (selectedItemId > -1) {
      const foundItem = products.find(findItemById);
      if (foundItem) {
        return foundItem.state !== "deleted";
      }
    }
    return false;
  }

  const toggleHide = () => {
    setHideSortByDown(!hideSortByDown);
  }
  const getNewEmptyItem = (): ProductData => {
    return { name: "", id: -2, price: 0, creationDate: new Date(), state: "pending" };

  }
  const addItem = () => {
    setCreateNewItem(true);
  }

  const getMaxProductId = (): number => {
    const products = geProductsFromToLocalStorage(PRODCUTS_KEY);
    if (products.length === 0) {
      alert('empty');
      return 0;
    }
    let maxId = 0;
    for (let i = 0; i < products.length; i++) {
      if (products[i].id > maxId) {
        maxId = products[i].id;
      }
    }
    return maxId;
  }

  const getNextId = (): number => {
    if (nextId.current) {
      nextId.current += 1;
      return nextId.current;
    }

    nextId.current = getMaxProductId();
    nextId.current += 1;
    return nextId.current;
  }
  const saveItem = (newItem: ProductData): void => {
    let isNewItem = false;
    const itemIdx = geProductsFromToLocalStorage(PRODCUTS_KEY).findIndex(item => item.id === newItem.id);
    if (itemIdx === -1) {
      isNewItem = true;
      newItem.id = getNextId();
      newItem.state = "approved";
      setCreateNewItem(false);
    }
    
    setProducts(prev => {
      const nextState = [...prev];
      if (isNewItem) {
        nextState.push(newItem);
      } else {
        nextState[itemIdx].description = newItem.description;
        nextState[itemIdx].price = newItem.price;
        nextState[itemIdx].name = newItem.name;
      }
      sortBy(selectedSortByOption.sortType, nextState);
      setSelectedItemId(newItem.id);
      return nextState;
    })
    saveItemToLocalStorage(PRODCUTS_KEY, newItem, isNewItem);

  };

  const sortBy = (sortType: SortBy, _products: ProductData[] = products): void => {
    setCurrentPage(1);
    const selectedItemIdx = _products.findIndex(findItemById);
    if (selectedItemIdx >= NUMBER_OF_ITEMS_IN_PAGE) {
      setFirstValidItemId(_products);
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
    setProducts(_ => {
      const inputText = e.target.value;
      if (inputText.length === 0) {
        // implement bring full list from local storage
        return geProductsFromToLocalStorage(PRODCUTS_KEY);
      }

      const nextState = [...geProductsFromToLocalStorage(PRODCUTS_KEY).filter(item => (item.description && item.description.toLowerCase().includes(inputText)) || item.name.toLowerCase().includes(inputText))];
      return [...nextState];
    })
  }
  const arrowLeft = "<";
  const arrowRight = ">";
  const filterValidItems = (item: ProductData): boolean => item.state === "approved";
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

  const findItemById = (item: ProductData): boolean => item.id === selectedItemId;
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
                  setCreateNewItem(false);
                  setSelectedItemId(item.id);
                }}
                onDelete={(e: MouseEvent) => {
                  const _idx = products.findIndex(_item => _item.id === item.id);
                  if (_idx > - 1) {
                    products[_idx].state = "deleted";
                    const nextState = [...products];
                    deleteItemFromStorage(PRODCUTS_KEY, item.id);
                    updateCurrentPage(nextState);
                    if (!createNewItem && selectedItemId === item.id) {
                      setFirstValidItemId(nextState);
                    }
                    setProducts(nextState);
                  } else {
                    if (!createNewItem && selectedItemId === item.id) {
                      setFirstValidItemId(products);
                    }
                  }
                  e.stopPropagation();

                }}
              />)
          }</div>
          <div className="item-description">
            {showProdcutDetails() && <ProductDetails item={createNewItem ? getNewEmptyItem() : products.find(findItemById)!} saveItem={saveItem} />}
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
