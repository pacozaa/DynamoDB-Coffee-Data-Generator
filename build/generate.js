"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHugeData = exports.generateData = void 0;
const faker_1 = require("@faker-js/faker");
const generateData = () => {
    const coffeeMock = {
        DrinkName: faker_1.faker.commerce.productName(),
        Ingredient: faker_1.faker.commerce.productMaterial(),
        Description: faker_1.faker.commerce.productDescription(),
        Meat: faker_1.faker.animal.type(),
        CoffeeVolume: faker_1.faker.number.int(),
        Creator: faker_1.faker.person.fullName(),
    };
    return coffeeMock;
};
exports.generateData = generateData;
const getHugeData = () => {
    const hugeData = faker_1.faker.helpers.multiple(exports.generateData, {
        count: 5,
    });
    console.log({ hugeData });
    return hugeData;
};
exports.getHugeData = getHugeData;
