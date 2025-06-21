import './product.less'

import { useEffect, useState, type JSX, type MouseEvent } from 'react';
import type { ProductData } from '../models';


export const Product = (props: { item: ProductData, onSelect: () => void, onDelete: (e: MouseEvent) => void }): JSX.Element => {
    const { item, onSelect, onDelete } = props;
    const { name, description } = item;
    return (
        <div className='product'
            onClick={onSelect}
        >
            <div className="product-inner-wrapper">
                <ProductImage />
                <div className="body">
                    <div className="item-name">{name}</div>
                    <div className="product-item-description">{description}</div>
                </div>
                <div className="product-actions">
                    <button className='delete-button' onClick={onDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export const ProductDetails = (props: { item: ProductData, saveItem: (item: ProductData) => void }): JSX.Element => {
    const { item, saveItem } = props;
    const { name, description, price } = item;
    const [savedItem, setSavedItem] = useState<ProductData>({ ...item });
    const validateSavedItem = (savedItem.description == null || savedItem.description.length <= 200)
        && savedItem.name.length > 0
        && savedItem.name.length < 31
        && savedItem.price > 0;

    useEffect(() => {
        setSavedItem({ ...item });
    }, [item])
    return (
        <div className='product-details-container'>
            <div className="product-details-title">{name} details</div>
            <div className="body">
                <ProductImage />
                <TtileAndDataBox title='Name' text={name}
                    onChange={(e) => {
                        const input: string = e.target.value;

                        setSavedItem(prev => {
                            const nextState = { ...prev };
                            nextState.name = input;
                            return nextState;
                        })
                    }}
                />
                <TtileAndDataBox title='Description' text={description || ''}
                    onChange={(e) => {
                        const input: string = e.target.value;
                        setSavedItem(prev => {
                            const nextState = { ...prev };
                            nextState.description = input;
                            return nextState;
                        })
                    }}
                />
                <TtileAndDataBox title='Price' text={price} onChange={(e) => {
                    const input: string = e.target.value;
                    if (isNaN(Number(input))) {
                        console.error({ input }, "is not a number")
                        return;
                    }
                    setSavedItem(prev => {
                        const nextState = { ...prev };
                        nextState.price = Number(input);
                        return nextState;
                    })

                }} />
            </div>
            <div className="add-button-wrapper">
                <button className='save-button' onClick={() => saveItem(savedItem)} disabled={!validateSavedItem}>Save</button>
            </div>
        </div>
    );
};

const TtileAndDataBox = (props: { title: string; text: string | number, onChange: (e: any) => void }): JSX.Element => {
    const [val, setVal] = useState<number | string>(props.text);
    useEffect(()=>{
        setVal(props.text)
    },[props.text])

    const _onChangeInput = (e:any)=>{
        if (val !== e.target.value) {
            setVal(e.target.value);
        }
        props.onChange(e);
    }
    return (
        <div className='box-wrapper'>
            <div className="title">{props.title}</div>
            <div className="input-bordered-box">
                <input type='text' value={val} onChange={_onChangeInput}></input>
            </div>
        </div>
    );
};


const ProductImage = (): JSX.Element => {
    return (
        <div className='product-image'>

        </div>
    );
};

