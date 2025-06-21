import './product.less'

import { type JSX, type MouseEvent } from 'react';
import type { ProductData } from '../models';


export const Product = (props: { item: ProductData, onSelect:()=>void , onDelete:(e:MouseEvent)=>void}): JSX.Element => {
    const {item, onSelect, onDelete} = props;
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

export const ProductDetails = (props: { item: ProductData }): JSX.Element => {
    const { name, description, price } = props.item;

    return (
        <div className='product-details-container'>
            <div className="product-details-title">{name} details</div>
            <div className="body">
                <ProductImage />
                <TtileAndDataBox title='Name' text={name} />
                <TtileAndDataBox title='Description' text={description || ''} />
                <TtileAndDataBox title='Price' text={price} />
            </div>
        </div>
    );
};

const TtileAndDataBox = (props: { title: string; text: string | number }): JSX.Element => {
    return (
        <div className='box-wrapper'>
            <div className="title">{props.title}</div>
            <div className="bordered-box">
                {props.text}
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

