
import { type JSX } from 'react';
import type { SortByOption } from '../models';

export const SortByDropDown = (props: { 
    hide: boolean,
    options: SortByOption[], 
    onClickOption: (sortTypeOption: SortByOption) => void, 
    selectedOption: SortByOption, 
    updateHide: ()=>void;
}): JSX.Element => {
    const { hide, options, onClickOption, selectedOption, updateHide } = props;

    return (
        <div className='sort-by-wrapper'>
            <div className="header-wraepper">

                <div className="selected-option"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClickOption(selectedOption);
                    }}
                >{selectedOption.name}</div>
                <div className="open-dropdown" onClick={(e)=>{
                    e.stopPropagation();
                    updateHide();
                }}>{hide ? <>&#8595;</> : <>&#8593;</>}</div>
            </div>
            {!hide && <div className="options">
                {options.filter(option => option.sortType !== selectedOption.sortType).map(option => {
                    return (
                        <div className='option-item' key={option.sortType} onClick={(e) => {
                            e.stopPropagation();
                            onClickOption(option);
                        }
                        
                        }>
                            {option.name}
                        </div>
                    )
                })}
            </div>
            }
        </div>
    );
};

