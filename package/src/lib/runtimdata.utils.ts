
import * as fileUtils  from '../lib/file.utils';
import * as tcontext  from '../lib/testContext';
import * as projectConfig from '../../config/project.config.json';

class RuntimeDataUtils {

    createRunTimeDataJsonFie = async (pickle: any) => {
        let fs = require("fs");
        fileUtils.checkFolderAndCreate(`${process.cwd()}${projectConfig.RUN_TIME_DATA_PATH}`);
        const filename = `${process.cwd()}${projectConfig.RUN_TIME_DATA_PATH}/${process.env.ENV}-${await this.getRunTimeDataFileName(pickle)}.json`;
        if (!await fs.existsSync(filename)) {
            await fs.writeFileSync(filename, '{ "testData": [], "pickedMemberData": [], "pickedFacilityData":[], "authsData": {} }', { flag: 'w' }, 'utf-8');
        }
        return filename;
    }

    getRunTimeDataFileName = async (pickle: any) => {
        if (await pickle.uri.includes('/')) {
            return await pickle.uri.split('/')[pickle.uri.split('/').length - 1];
        } else {
            return await pickle.uri.split('\\')[pickle.uri.split('\\').length - 1];
        }
    }

    getRunTimeFeatureScnearioNo = async (pickle: any) => {
        let filename = await this.getRunTimeDataFileName(pickle);
        let length = await filename.split('-').length;
        console.log(await filename.substring(0, 1))
        return length > 0 ? await (await filename.split('-')[0]).trim() : await filename.substring(0, 1);
    }

    getRunTimeDataFilePath = async () => {
        return tcontext.testContext.runtimeStorageFile;
    }

    setRunTimeData = async (key: string, value: any) => {
        const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        runTimeData[key] = value;
        await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
    }

    removeRunTimeData = async (key: string) => {
        const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        delete runTimeData[key];
        await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
    }

    setRunTimeTestData = async (key: string, value: any, testdataIndex: number = 0) => {
        const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        if (runTimeData.testData.length > 0) {
            runTimeData.testData[testdataIndex][key] = value;
        } else {
            let keyval = JSON.parse(` {"${key}" : "${value}" }`)
            runTimeData.testData.push(keyval);
        }
        await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
    }

    getFilenameWithScenarioID = async (key: string) => {
        let filesArray = await fileUtils.getFileNamesFromDir(`${process.cwd()}${projectConfig.RUN_TIME_DATA_PATH}`);
        let index = filesArray.findIndex(element => element.includes(`${process.env.ENV}-${key}`));
        return await filesArray[index];
    }

    getRunTimeData = async (key: string) => {
        const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        if (await json[key]) {
            return json[key];
        }
        return '';
    }

    getRunTimeResultsData = async (key: string) => {
        const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        return await json.results[key];
    }

    getRunTimeTestData = async (key: string, index: any) => {
        const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        if (await json.testData[index][key]) {
            console.log('Getting - ' + key + ' : ' + await json.testData[index][key]);
            return await json.testData[index][key];
        }
        console.log('Getting - ' + key + ' : ' + await json.testData[index][key]);
        return '';
    }

    getRunTimePickedMemberData = async (key: string) => {
        const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        console.log('Getting - ' + key + ' : ' + await json.pickedMemberData[key]);
        return await json.pickedMemberData[key];
    }

    getRunTimeFullPickedMemberData = async () => {
        const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        return await json.pickedMemberData;
    }

    async pushRunTimePickedMemberData(data: any) {
        let fs = require("fs");
        const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        json.pickedMemberData = data;
        await fs.writeFileSync(tcontext.testContext.runtimeStorageFile, JSON.stringify(json, null, 2), 'utf-8');
    }

    getRunTimePickedFacilityData = async (key: string) => {
        const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        console.log('Getting - ' + key + ' : ' + await json.pickedFacilityData[key]);
        return await json.pickedFacilityData[key];
    }

    async pushRunTimePickedFacilityData(data: any) {
        let fs = require("fs");
        const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        json.pickedFacilityData = data;
        await fs.writeFileSync(tcontext.testContext.runtimeStorageFile, JSON.stringify(json, null, 2), 'utf-8');
    }

    async pushRunTimeDbMemberData(data: any) {
        let fs = require("fs");
        const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        await json.dbMemberData.push(data);
        await fs.writeFileSync(tcontext.testContext.runtimeStorageFile, JSON.stringify(json, null, 2), 'utf-8');
    }

    getRunTimeFullData = async () => {
        const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        return json;
    }

    async copyAuthsTemplateData(authsData: any) {
        const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        json.authsData = authsData;
        await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, json);
    }

    async copyJsonSpecificData(source: string, destination: string, testDataIndex: number) {
        const json = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        Object.keys(json[source][testDataIndex]).forEach(key => {
            json[destination][key] = json[source][testDataIndex][key];
        })
        await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, json);
    }

    async getRuntimeScenarioData(keyArrayName: string, iterationCount: string, dataset: string) {
        let testData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        const index = await testData[keyArrayName].findIndex((obj: any) => obj.Iteration == iterationCount && obj.DataSet == dataset);
        if (testData[keyArrayName][index]) {
            return await testData[keyArrayName][index];
        }
        return '';
    }

    async getRuntimeScenarioIndex(keyArrayName: string, iterationCount: string, dataset: string) {
        let testData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        const index = await testData[keyArrayName].findIndex((obj: any) => obj.Iteration == iterationCount && obj.DataSet == dataset);
        return index;
    }

    addOrUpdateRunTimeResultsData = async (key: string, value: any) => {
        const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        runTimeData.results[key] = value;
        await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
    }

    addOrUpdateRunTimeScenarioData = async (arrayName: string, index: number, key: string, value: any) => {
        const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        runTimeData[arrayName][index][key] = value;
        await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
    }

    getRunTimeAuthsData = async () => {
        return await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
    }

    getRunTimeScenarioAuthsData = async () => {
        let data = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        return await data.authsData;
    }

    updateRunTimeScenarioAuthsData = async (key: string, value: any) => {
        let data = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        data.authsData[key] = value;
        await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, data);
    }

    setRunTimeDataWithPipeSynbol = async (key: string, value: string) => {
        const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        if (runTimeData[key] === undefined) {
            runTimeData[key] = value;
        } else {
            runTimeData[key] = `${runTimeData[key]}|${value}`;
        }
        await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
    }

    setRunTimeDataWithComma = async (key: string, value: string) => {
        const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile)
        if (runTimeData[key] == undefined) {
            runTimeData[key] = value;
        } else {
            runTimeData[key] = `${runTimeData[key]},${value}`;
        }
        await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
    }

    async copyMyTaskScenariosDataToRunTimeDataFile(testScenarioId: string) {
        let fs = require('fs');
        let staticDataFile = await this.getSourceTestDataFile();
        let runTimeData = await JSON.parse(fs.readFileSync(tcontext.testContext.runtimeStorageFile));
        let staticData = await JSON.parse(fs.readFileSync(staticDataFile));
        if (!process.env.TAG.toLowerCase().toString().includes('auths') && !process.env.TAG.toLowerCase().toString().includes('facility-validation') && !process.env.TAG.toLowerCase().toString().includes('data-gen') && !process.env.TAG.toLowerCase().toString().includes('stargate-api') && !process.env.TAG.toLowerCase().toString().includes('closesrnorhsc')) {
            await staticData.testData.forEach(async (scenarioData: any) => {
                if (scenarioData.TestScenario === testScenarioId) {
                    // console.log(` |testscenrio - ${scenarioData.TestScenario}| Iteration -  ${scenarioData.Iteration} | DataSet - ${scenarioData.DataSet}`)
                    if (runTimeData.testData) {
                        const index = await runTimeData.testData.findIndex((obj: any) => obj.TestScenario == scenarioData.TestScenario && obj.Iteration == scenarioData.Iteration && obj.DataSet == scenarioData.DataSet);
                        if (index < 0)
                            await runTimeData.testData.push(scenarioData);
                    }
                }
            })
        } else {
            console.log(`copying data from "${staticDataFile}" to Run time data file : ${tcontext.testContext.runtimeStorageFile}`);
            let sIndex = staticData.testData.findIndex((obj: any) => obj.Row === testScenarioId.trim());
            if (sIndex >= 0)
                await runTimeData.testData.push(staticData.testData[sIndex]);
        }
        await this.storeInRuntimeDataFile(runTimeData);
        if (!process.env.TAG.toLowerCase().toString().includes('auths') && !process.env.TAG.toLowerCase().toString().includes('facility-validation') && !process.env.TAG.toLowerCase().toString().includes('data-gen') && !process.env.TAG.toLowerCase().toString().includes('stargate-api') && !process.env.TAG.toLowerCase().toString().includes('closesrnorhsc')) {
            await this.storeScenarioDataToRuntimeDataFile(testScenarioId);
        }
    }

    async getSourceTestDataFile() {
        let filePath = "";
        if (process.env.TAG) {
            if (!process.env.TAG.includes('auths') && !process.env.TAG.includes('facility-validation') && !process.env.TAG.toLowerCase().toString().includes('data-gen') && !process.env.TAG.toLowerCase().toString().includes('stargate-api') && !process.env.TAG.toLowerCase().toString().includes('closesrnorhsc')) {
                filePath = `${process.cwd()}${projectConfig.TEST_DATA_TXN_PATH}/D_MyTasks.json`;
            } else if (process.env.TAG.toLowerCase().toString().includes('stargate-api')) {
                filePath = `${process.cwd()}${projectConfig.TEST_DATA_DYNAMIC_DATA_FILES}${projectConfig.STARGATE_API_SHEET}.json`;
            } else if (process.env.TAG.toLowerCase().toString().includes('closesrnorhsc')) {
                filePath = `${process.cwd()}${projectConfig.TEST_DATA_DYNAMIC_DATA_FILES}${projectConfig.SRN_HSC_CLOSE_SHEET}.json`;
            } else {
                filePath = process.env.TAG.toLowerCase().toString().includes('auths') ? `${process.cwd()}${projectConfig.TEST_DATA_DYNAMIC_DATA_FILES}${projectConfig.AUTHS_SHEET}.json`
                    : `${process.cwd()}${projectConfig.TEST_DATA_DYNAMIC_DATA_FILES}${projectConfig.FACILITY_VALIDATION_CONSOLIDATED_SHEET}.json`;
            }
        }
        return filePath;
    }

    async storeInRuntimeDataFile(runTimeData: any) {
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

    copyDatafromSourceJsonToDestination = async (sourceData: string, destinationData: string,) => {
        const excludeKeysList = require(`${process.cwd()}${projectConfig.REF_DATA_PATH}/myTaskDataKeys.json`);
        Object.keys(sourceData).forEach(key => {
            if (excludeKeysList.length > 0) {
                if (excludeKeysList.indexOf(key.trim()) < 0) {
                    destinationData[key] = sourceData[key];
                }
            } else {
                destinationData[key] = sourceData[key];
            }
        })
        let dataArrayToCopy = {
            "testData": [
                destinationData
            ],
        }
        await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, dataArrayToCopy);
    }

    copyDatafromSourceJsonToRunTimeData = async (sourceData: any, index: number) => {
        const excludeKeysList = require(`${process.cwd()}${projectConfig.REF_DATA_PATH}/myTaskDataKeys.json`);
        const runtimedata = require(await this.getRunTimeDataFilePath());
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
    getScenariosDataAsArray = async (fileName: string, testScenarioId: string) => {
        let fileDataPath = `${process.cwd()}${projectConfig.TEST_DATA_TXN_PATH}/${fileName}`;
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
    async storeScenarioDataToRuntimeDataFile(testScenarioId: any) {
        let fs = require('fs');
        let fileDir = `${process.cwd()}${projectConfig.TEST_DATA_TXN_PATH}`;
        let fileNames = await fileUtils.getFileNamesFromDir(fileDir);
        let data = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        for (const filename of fileNames) {
            if (await filename.includes('.json')) {
                let scenarioData = await this.getScenariosDataAsArray(filename, testScenarioId);
                if (scenarioData.length > 0) {
                    let dataArrayKey = await filename.split('D_').join('').split('.json').join('');
                    if (!data[dataArrayKey] && dataArrayKey !== 'MyTasks') {
                        data[dataArrayKey] = scenarioData;
                    }
                }
            }
            if (await fileUtils.isfileExist(tcontext.testContext.runtimeStorageFile)) {
                await fs.writeFileSync(tcontext.testContext.runtimeStorageFile, JSON.stringify(data, null, 2), 'utf-8');
            }
        }
    }

    async returnRandomNumber(min: number = 0, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async getLocalLoginData() {
        let fs = require('fs');
        if (fs.existsSync(projectConfig.LOGIN_USER_DETAILS_JSONFILEPATH)) {
            return require(projectConfig.LOGIN_USER_DETAILS_JSONFILEPATH);
        } else {
            return {
                "msid": "umauto2001",
                "teamManagement": "umauto_group",
                "reassignUser": "umauto2012",
                "fullName": "Ganesh Kamath"
            };
        }
    }

}

export default new RuntimeDataUtils();
