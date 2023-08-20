import { faker } from '@faker-js/faker';


export interface CoffeeData {
    DrinkName: string;
    Ingredient: string;
    Description: string;
    CoffeeVolume: number;
    Creator: string;
    Meat: string;
}

export const generateData=()=>{
    const coffeeMock: CoffeeData = {
        DrinkName: faker.commerce.productName(),
        Ingredient: faker.commerce.productMaterial(),
        Description: faker.commerce.productDescription(),
        Meat: faker.animal.type(),
        CoffeeVolume: faker.number.int(),
        Creator: faker.person.fullName(),
    }
    
    return coffeeMock;
}

export const getHugeData=(size: number)=>{
    const hugeData = faker.helpers.multiple(generateData, {
        count: size,
    })
    return hugeData
}