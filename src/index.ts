import { ListTablesCommand, CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { CoffeeData, generateData, getHugeData } from "./generate";
import { assert } from "console";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "EspressoDrinks";

export const main = async () => {
    const command = new ListTablesCommand({});

    const response = await client.send(command);
    console.log({ main: response });
    console.log(response?.TableNames?.join("\n"));
    return response;
};


export const CreateTable = async () => {
    const command = new CreateTableCommand({
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

    const response = await client.send(command);
    console.log({ create: response });
    return response;
};

export const PutItem = async () => {
    const command = new PutCommand({
        TableName: tableName,
        Item: {
            DrinkName: "Latte",
            Ingredient: "milk"
        },
    });

    const response = await docClient.send(command);
    console.log({ put: response });
    return response;
};

export const GetItemFromTable = async () => {
    const command = new GetCommand({
        TableName: tableName,
        Key: {
            DrinkName: "Latte"
        }
    });

    const response = await docClient.send(command);
    console.log({ get: response });
    return response;
};


export const pushBatchOfCoffee = async () => {
    let coffeeList = getHugeData(5000);
    const chunkSize = 20;
    const chunkArray = [];
    for (let i = 0; i < coffeeList.length; i += chunkSize) {
        const chunk = coffeeList.slice(i, i + chunkSize);
        chunkArray.push(chunk)
    }

    for (const chunk of chunkArray) {
        const putRequests = chunk.map((coffee) => ({
            PutRequest: {
                Item: coffee,
            },
        }));
        const command = new BatchWriteCommand({
            RequestItems: {
                [tableName]: putRequests,
            },
        });

        await docClient.send(command);
    }
    // console.log({coffeeList})
}


// CreateTable()
// main()
// PutItem()
// GetItemFromTable()
// pushBatchOfCoffee()