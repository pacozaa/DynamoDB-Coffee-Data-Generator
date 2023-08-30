import { ListTablesCommand, CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { CoffeeData, generateData, getHugeData } from "./generate";
import { assert } from "console";
import { sleep } from "./utils";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "CoffeeMagic";

export const ListTable = async () => {
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

export const PutItem = async (coffeeData: CoffeeData) => {
    const command = new PutCommand({
        TableName: tableName,
        Item: coffeeData,
    });
    try{

    const response = await docClient.send(command);
    // console.log({ put: response });
    return response;}
    catch(error){
        console.log(error)
    }
};

export const GetItemFromTable = async (name: string) => {
    const command = new GetCommand({
        TableName: tableName,
        Key: {
            DrinkName: name
        }
    });

    const response = await docClient.send(command);
    // console.log({ get: response });
    return response;
};

export const putBatchOfCoffeeOneByOne = async (size:number,sleepTime:number) => {
    let coffeeList = getHugeData(size);
    let count = 0
    for(const coffee of coffeeList){
        PutItem(coffee)
        await sleep(sleepTime)
        count++
        console.log({putCount: count})
    }
}

export const putBatchOfCoffee = async (size:number,sleepTime:number) => {
    let coffeeList = getHugeData(size);
    const chunkSize = 20;
    const chunkArray = [];
    for (let i = 0; i < coffeeList.length; i += chunkSize) {
        const chunk = coffeeList.slice(i, i + chunkSize);
        chunkArray.push(chunk)
    }

    try {
        let count = 0;
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
            count++
            console.log({batchNumber: count})
            await sleep(sleepTime)
        }
    } catch (error) {
        console.log({ error })
    }

}
// Steps - Uncomment and delete number
// 1. CreateTable()
// 2. ListTable()
// 3. PutItem({
//     DrinkName: "Porky Keanu",
//     Ingredient: "Dark signature blend",
//     Description: "Meaty coffee",
//     CoffeeVolume: 80000000,
//     Creator: "Keanu Reeves",
//     Meat: "Pork"
// })
// 4. GetItemFromTable("Porky Keanu")
// 5. putBatchOfCoffee(2000,1000); //Fine tune the sleepTime number
// 6. putBatchOfCoffeeOneByOne(2000,300) //Fine tune the sleepTime number