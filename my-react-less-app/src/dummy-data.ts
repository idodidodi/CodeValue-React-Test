import type { ProductData } from "./models";

export const dummyProducts: ProductData[] = [
  {
    id: 1,
    name: "Chair",
    price: 100,
    creationDate: new Date("December 17, 1995 03:24:00"),
    state:"approved",
    description: "Something that you sit on"
},
{
    id: 2,
    name: "Table",
    price: 110,
    creationDate: new Date("December 17, 1996 03:24:00"),
    state:"deleted",
    description: "Something you put things on"
},
{
    id: 3,
    name: "Stool",
    price: 50,
    creationDate: new Date("December 17, 1997 03:24:00"),
    state:"approved",
    description: "Something you sit on"
},
{
    id: 4,
    name: "Toilet",
    price: 150,
    creationDate: new Date("December 17, 1998 03:24:00"),
    state:"approved",
    description: "Something you use everyday for your natural needs"
},
{
    id: 5,
    name: "Tap",
    price: 200,
    creationDate: new Date("December 17, 1999 03:24:00"),
    state:"approved"
  },
];