
import * as fileUtils from './file.utils';
import * as tcontext from './testContext';



export async function createRunTimeDataJsonFile(folderPath: string, runTimeEnv: string, fileUri: any) {
    let fs = require("fs");
    fileUtils.checkFolderAndCreate(folderPath); // `${process.cwd()}${projectConfig.RUN_TIME_DATA_PATH}`);
    const filename = `${folderPath}/${runTimeEnv}-${await getRunTimeDataFileName(fileUri)}.json`;
    if (!await fs.existsSync(filename)) {
        await fs.writeFileSync(filename, '{ "testData": [], "pickedMemberData": [], "pickedFacilityData":[], "authsData": {}, "results":{}}', { flag: 'w' }, 'utf-8');
    }
    return filename;
}

export async function getRunTimeDataFileName(pickle: any) {
    if (await pickle.uri.includes('/')) {
        return await pickle.uri.split('/')[pickle.uri.split('/').length - 1];
    } else {
        return await pickle.uri.split('\\')[pickle.uri.split('\\').length - 1];
    }
}

export async function getRunTimeScnearioNo(pickle: any) {
    let filename = await getRunTimeDataFileName(pickle);
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

export async function setRunTimeTestData(key: string, value: any, testdataIndex: number = 0, keyArrayName: string = 'testData') {
    const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    if (runTimeData[keyArrayName].length > 0) {
        runTimeData[keyArrayName][testdataIndex][key] = value;
    } else {
        let keyval = JSON.parse(` {"${key}" : "${value}" }`)
        runTimeData.testData.push(keyval);
    }
    await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
}

export async function getFilenameWithScenarioID(folderPath: string, key: string) {
    //`${process.cwd()}${projectConfig.RUN_TIME_DATA_PATH}`
    let filesArray = await fileUtils.getFileNamesFromDir(folderPath);
    let index = filesArray.findIndex(element => element.includes(`${process.env.ENV}-${key}`));
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

export async function getRunTimeTestData(key: string, index: any) {
    const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    if (await json.testData[index][key]) {
        console.log('Getting - ' + key + ' : ' + await json.testData[index][key]);
        return await json.testData[index][key];
    }
    console.log('Getting - ' + key + ' : ' + await json.testData[index][key]);
    return '';
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
    await console.log(`No data found for Iteration - ${iterationCount} and DataSet - ${dataset}`);
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

export async function getRunTimeAuthsData() {
    return await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
}

export async function getRunTimeScenarioAuthsData() {
    let data = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    return await data.authsData;
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

export async function copyScenariosDataToRunTimeDataFile(sourceDir: string, sourceFile: string, testScenarioId: string) {
    let fs = require('fs');
    let staticDataFile = sourceFile;
    let runTimeData = await JSON.parse(fs.readFileSync(tcontext.testContext.runtimeStorageFile));
    if (staticDataFile !== '') {
        let staticData = await JSON.parse(fs.readFileSync(staticDataFile));
        console.log(`copying data from "${staticDataFile}" to Run time data file : ${tcontext.testContext.runtimeStorageFile}`);
        let sIndex = staticData.testData.findIndex((obj: any) => obj.Row === testScenarioId.trim());
        if (sIndex >= 0)
            await runTimeData.testData.push(staticData.testData[sIndex]);
        await storeInRuntimeDataFile(runTimeData);
    } else {
        await storeScenarioDataToRuntimeDataFile(sourceDir, testScenarioId);
    }
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

export async function copyDatafromSourceJsonToRunTimeData(excludeKeysListFile: string, sourceData: any, index: number) {
    const excludeKeysList = require(excludeKeysListFile);
    const runtimedata = require(tcontext.testContext.runtimeStorageFile);
    let exclude = excludeKeysList.copyMyTasksDataKeysForExclude;
    Object.keys(sourceData).forEach(key => {
        if (exclude.length > 0) {
            if (exclude.indexOf(key.trim()) < 0) {
                runtimedata.testData[index][key] = sourceData[key];
            }
        } else {
            runtimedata.testData[index][key] = sourceData[key];
        }
    })
    await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runtimedata);
}

// gettting the scenario data from testdata transactions file
export async function getScenariosDataAsArray(fileDir: string, fileName: string, testScenarioId: string) {
    let fileDataPath = `${fileDir}/${fileName}`;
    let staticData = await fileUtils.readJsonData(fileDataPath);
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
export async function storeScenarioDataToRuntimeDataFile(fileDir: string, testScenarioId: any) {
    let fs = require('fs');
    let fileNames = await fileUtils.getFileNamesFromDir(fileDir);
    let data = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    for (const filename of fileNames) {
        if (await filename.includes('.json')) {
            let scenarioData = await getScenariosDataAsArray(fileDir, filename, testScenarioId);
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







