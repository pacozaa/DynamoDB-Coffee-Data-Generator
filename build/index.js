"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushBatchOfCoffee = exports.GetItemFromTable = exports.PutItem = exports.CreateTable = exports.main = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const generate_1 = require("./generate");
const client = new client_dynamodb_1.DynamoDBClient({});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const tableName = "EspressoDrinks";
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const command = new client_dynamodb_1.ListTablesCommand({});
    const response = yield client.send(command);
    console.log({ main: response });
    console.log((_a = response === null || response === void 0 ? void 0 : response.TableNames) === null || _a === void 0 ? void 0 : _a.join("\n"));
    return response;
});
exports.main = main;
const CreateTable = () => __awaiter(void 0, void 0, void 0, function* () {
    const command = new client_dynamodb_1.CreateTableCommand({
        TableName: tableName,
        AttributeDefinitions: [
            {
                AttributeName: "DrinkName",
                AttributeType: "S",
            },
        ],
        KeySchema: [
            {
                AttributeName: "DrinkName",
                KeyType: "HASH",
            },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
        },
    });
    const response = yield client.send(command);
    console.log({ create: response });
    return response;
});
exports.CreateTable = CreateTable;
const PutItem = () => __awaiter(void 0, void 0, void 0, function* () {
    const command = new lib_dynamodb_1.PutCommand({
        TableName: tableName,
        Item: {
            DrinkName: "Latte",
            Ingredient: "milk"
        },
    });
    const response = yield docClient.send(command);
    console.log({ put: response });
    return response;
});
exports.PutItem = PutItem;
const GetItemFromTable = () => __awaiter(void 0, void 0, void 0, function* () {
    const command = new lib_dynamodb_1.GetCommand({
        TableName: tableName,
        Key: {
            DrinkName: "Latte"
        }
    });
    const response = yield docClient.send(command);
    console.log({ get: response });
    return response;
});
exports.GetItemFromTable = GetItemFromTable;
const pushBatchOfCoffee = () => __awaiter(void 0, void 0, void 0, function* () {
    let coffeeList = [];
    for (let step = 0; step < 20; step++) {
        coffeeList.push((0, generate_1.generateData)());
    }
    const chunkSize = 20;
    const chunkArray = [];
    for (let i = 0; i < coffeeList.length; i += chunkSize) {
        const chunk = coffeeList.slice(i, i + chunkSize);
        chunkArray.push(chunk);
    }
    for (const chunk of chunkArray) {
        const putRequests = chunk.map((coffee) => ({
            PutRequest: {
                Item: coffee,
            },
        }));
        const command = new lib_dynamodb_1.BatchWriteCommand({
            RequestItems: {
                [tableName]: putRequests,
            },
        });
        yield docClient.send(command);
    }
    // console.log({coffeeList})
});
exports.pushBatchOfCoffee = pushBatchOfCoffee;
// CreateTable()
// main()
// PutItem()
// GetItemFromTable()
// pushBatchOfCoffee()
(0, generate_1.getHugeData)();
