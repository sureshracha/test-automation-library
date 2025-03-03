
import * as fileUtils from './file.utils';
import * as tcontext from './testContext';
import * as fs from 'fs';

export async function createRunTimeDataJsonFie(rFilename: any, runTimeDataFolder: string, environment: string, initialData: string = '{ "testData": [], "pickedMemberData": [], "pickedFacilityData": [], "authsData": { } }') {

    await fileUtils.checkFolderAndCreate(runTimeDataFolder);
    const filename = `${runTimeDataFolder}/${environment}-${await getRunTimeDataFileName(rFilename)}.json`;
    if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, initialData, { flag: 'w' });
    }
    return filename;

}

export async function getRunTimeDataFileName(filepath: any) {
    if (await filepath.includes('/')) {
        return await filepath.split('/')[filepath.split('/').length - 1];
    } else {
        return await filepath.split('\\')[filepath.split('\\').length - 1];
    }
}

export async function getRunTimeScnearioNo(filepath: any) {
    let filename = await getRunTimeDataFileName(filepath);
    let length = await filename.split('-').length;
    console.log(await filename.substring(0, 1))
    return length > 0 ? await (await filename.split('-')[0]).trim() : await filename.substring(0, 1);
}

export async function getRunTimeDataFilePath() {
    return tcontext.testContext.runtimeStorageFile;
}

export async function setRunTimeData(key: string, value: any) {
    const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    runTimeData[key] = value;
    await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
}

export async function removeRunTimeData(key: string) {
    const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    delete runTimeData[key];
    await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
}

export async function setRunTimeScenarioData(key: string, value: any, testdataIndex: number = 0,keyArrayName: string = 'testData') {
    const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    if (runTimeData.testData.length > 0) {
        runTimeData[keyArrayName][testdataIndex][key] = value;
    } else {
        let keyval = JSON.parse(` {"${key}" : "${value}" }`)
        runTimeData.testData.push(keyval);
    }
    await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
}

export async function getFilenameWithScenarioID(key: string, env: string, runTimeDataFolder: string) {
    let filesArray = await fileUtils.getFileNamesFromDir(runTimeDataFolder);
    let index = filesArray.findIndex(element => element.includes(`${env}-${key}`));
    return await filesArray[index];
}

export async function getRunTimeData(key: string) {
    const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    if (await json[key]) {
        return json[key];
    }
    return '';
}

export async function getRunTimeResultsData(key: string) {
    const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    return await json.results[key];
}

export async function getRunTimeScenarioData(key: string, index: any, keyArrayName: string = 'testData') {
    const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    if (await json[keyArrayName][index][key]) {
        console.log('Getting - ' + key + ' : ' + await json[keyArrayName][index][key]);
        return await json[keyArrayName][index][key];
    }
    console.log('Getting - ' + key + ' : ' + await json[keyArrayName][index][key]);
    return '';
}

export async function getRunTimePickedMemberData(key: string) {
    const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    console.log('Getting - ' + key + ' : ' + await json.pickedMemberData[key]);
    return await json.pickedMemberData[key];
}

export async function getRunTimeFullPickedMemberData() {
    const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    return await json.pickedMemberData;
}

export async function getRunTimeFullData() {
    const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    return json;
}

export async function copyJsonSpecificData(source: string, destination: string, testDataIndex: number) {
    const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    Object.keys(json[source][testDataIndex]).forEach(key => {
        json[destination][key] = json[source][testDataIndex][key];
    })
    await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, json);
}

export async function getRuntimeScenarioData(keyArrayName: string, iterationCount: string, dataset: string) {
    let testData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    const index = await testData[keyArrayName].findIndex((obj: any) => obj.Iteration == iterationCount && obj.DataSet == dataset);
    if (testData[keyArrayName][index]) {
        return await testData[keyArrayName][index];
    }
    return '';
}

export async function getRuntimeScenarioIndex(keyArrayName: string, iterationCount: string, dataset: string) {
    let testData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    const index = await testData[keyArrayName].findIndex((obj: any) => obj.Iteration == iterationCount && obj.DataSet == dataset);
    return index;
}

export async function addOrUpdateRunTimeResultsData(key: string, value: any) {
    const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    runTimeData.results[key] = value;
    await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
}

export async function addOrUpdateRunTimeScenarioData(arrayName: string, index: number, key: string, value: any) {
    const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    runTimeData[arrayName][index][key] = value;
    await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
}



export async function setRunTimeDataWithPipeSynbol(key: string, value: string) {
    const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    if (runTimeData[key] === undefined) {
        runTimeData[key] = value;
    } else {
        runTimeData[key] = `${runTimeData[key]}|${value}`;
    }
    await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
}

export async function setRunTimeDataWithComma(key: string, value: string) {
    const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile)
    if (runTimeData[key] == undefined) {
        runTimeData[key] = value;
    } else {
        runTimeData[key] = `${runTimeData[key]},${value}`;
    }
    await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
}

export async function storeInRuntimeDataFile(runTimeData: any) {
    let fs = require('fs');
    runTimeData.results = {};
    if (await fileUtils.isfileExist(tcontext.testContext.runtimeStorageFile)) {
        let data = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        if (data.testData.length === 0) {
            await fs.writeFileSync(tcontext.testContext.runtimeStorageFile, JSON.stringify(runTimeData, null, 2), 'utf-8');
            console.log("\n" + tcontext.testContext.runtimeStorageFile + '  ### file  updated');
        } else {
            console.log(tcontext.testContext.runtimeStorageFile + '\n file already upto date');
        }
    } else {
        await fs.writeFileSync(tcontext.testContext.runtimeStorageFile, JSON.stringify(runTimeData, null, 2), 'utf-8');
        console.log(tcontext.testContext.runtimeStorageFile + ' ### file created');
    }
}

export async function copyDatafromSourceJsonToRunTimeData(sourceData: any, index: number, excludeKeysList: any,keyArrayName: string = 'testData') {
    const runtimedata = require(await getRunTimeDataFilePath());
    let exclude = excludeKeysList.copyMyTasksDataKeysForExclude;
    Object.keys(sourceData).forEach(key => {
        if (exclude.length > 0) {
            if (exclude.indexOf(key.trim()) < 0) {
                runtimedata[keyArrayName][index][key] = sourceData[key];
            }
        } else {
            runtimedata[keyArrayName][index][key] = sourceData[key];
        }
    })
    await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runtimedata);
}

// gettting the scenario data from testdata transactions file
export async function getScenariosDataAsArray(filePath: string, testScenarioId: string) {
    let staticData = await fileUtils.readJsonData(filePath);
    let jsonDataArry = await JSON.parse('[]');
    staticData.testData.forEach(async (scenarioData: any) => {
        if (scenarioData.TestScenario === testScenarioId) {
            await jsonDataArry.push(scenarioData);
        }
    })
    if (jsonDataArry.length === 0) return [];
    return jsonDataArry;
}
// Store the data into runtime data file
export async function copyScenariosDataToRuntimeDataFile(testScenarioId: any, completefolderPath: string, sourceFile: string) {
    let fs = require('fs');
    let fileNames = await fileUtils.getFileNamesFromDir(completefolderPath);
    let data = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    for (const filename of fileNames) {
        if (await filename.includes('.json')) {
            let scenarioData = await getScenariosDataAsArray(sourceFile, testScenarioId);
            if (scenarioData.length > 0) {
                let dataArrayKey = await filename.split('D_').join('').split('.json').join('');
                data[dataArrayKey] = scenarioData;
            }
        }
        if (await fileUtils.isfileExist(tcontext.testContext.runtimeStorageFile)) {
            await fs.writeFileSync(tcontext.testContext.runtimeStorageFile, JSON.stringify(data, null, 2), 'utf-8');
        }
    }
}

export async function returnRandomNumber(min: number = 0, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

