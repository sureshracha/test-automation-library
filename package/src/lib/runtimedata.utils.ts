
import * as fileUtils  from './file.utils'; 
import * as tcontext from './testContext';


class RuntimeDataUtils {

    createRunTimeDataJsonFile = async (folderPath: string, runTimeEnv: string, fileUri: any) => {
        let fs = require("fs");
        fileUtils.checkFolderAndCreate(folderPath); // `${process.cwd()}${projectConfig.RUN_TIME_DATA_PATH}`);
        const filename = `${folderPath}/${runTimeEnv}-${await this.getRunTimeDataFileName(fileUri)}.json`;
        if (!await fs.existsSync(filename)) {
            await fs.writeFileSync(filename, '{ "testData": [], "pickedMemberData": [], "pickedFacilityData":[], "authsData": {}, "results":{}}', { flag: 'w' }, 'utf-8');
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

    getRunTimeScnearioNo = async (pickle: any) => {
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

    setRunTimeTestData = async (key: string, value: any, testdataIndex: number = 0, keyArrayName: string = 'testData') => {
        const runTimeData = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        if (runTimeData[keyArrayName].length > 0) {
            runTimeData[keyArrayName][testdataIndex][key] = value;
        } else {
            let keyval = JSON.parse(` {"${key}" : "${value}" }`)
            runTimeData.testData.push(keyval);
        }
        await fileUtils.writeJsonData(tcontext.testContext.runtimeStorageFile, runTimeData);
    }

    getFilenameWithScenarioID = async (folderPath: string, key: string) => {
        //`${process.cwd()}${projectConfig.RUN_TIME_DATA_PATH}`
        let filesArray = await fileUtils.getFileNamesFromDir(folderPath);
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
        await console.log(`No data found for Iteration - ${iterationCount} and DataSet - ${dataset}`);
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

    async copyScenariosDataToRunTimeDataFile(sourceDir: string, sourceFile: string, testScenarioId: string) {
        let fs = require('fs');
        let staticDataFile = sourceFile;
        let runTimeData = await JSON.parse(fs.readFileSync(tcontext.testContext.runtimeStorageFile));
        if (staticDataFile !== '') {
            let staticData = await JSON.parse(fs.readFileSync(staticDataFile));
            console.log(`copying data from "${staticDataFile}" to Run time data file : ${tcontext.testContext.runtimeStorageFile}`);
            let sIndex = staticData.testData.findIndex((obj: any) => obj.Row === testScenarioId.trim());
            if (sIndex >= 0)
                await runTimeData.testData.push(staticData.testData[sIndex]);
            await this.storeInRuntimeDataFile(runTimeData);
        } else {
            await this.storeScenarioDataToRuntimeDataFile(sourceDir, testScenarioId);
        }
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

    copyDatafromSourceJsonToRunTimeData = async (excludeKeysListFile: string, sourceData: any, index: number) => {
        const excludeKeysList = require(excludeKeysListFile); //`${process.cwd()}${projectConfig.REF_DATA_PATH}/myTaskDataKeys.json`);
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
    getScenariosDataAsArray = async (fileDir: string, fileName: string, testScenarioId: string) => {
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
    async storeScenarioDataToRuntimeDataFile(fileDir: string, testScenarioId: any) {
        let fs = require('fs');
        let fileNames = await fileUtils.getFileNamesFromDir(fileDir);
        let data = await fileUtils.readJsonData(tcontext.testContext.runtimeStorageFile);
        for (const filename of fileNames) {
            if (await filename.includes('.json')) {
                let scenarioData = await this.getScenariosDataAsArray(fileDir, filename, testScenarioId);
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

    async returnRandomNumber(min: number = 0, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


}

export default new RuntimeDataUtils();




import { BeforeAll, AfterAll, Before, After, Status, setParallelCanAssign, parallelCanAssignHelpers, setDefaultTimeout } from "@cucumber/cucumber"; // , setParallelCanAssign, parallelCanAssignHelpers

import { request } from "@playwright/test";
import { getEnv } from "../helper/env/env";
import { createLogger } from "winston";
import runtimeDataUtils from '../utils/common/runtime-data.utils';
import TestDataUtils from "../utils/common/testdata.utils";
import { playwright, invokeBrowser, closeplaywright } from '@qe-solutions/playwright-test-wrappers';
import { customLogger, fileUtils, tcontext, customAssert } from '@qe-solutions/test-automation-library';
import * as projectConfig from '../config/project.config.json';
import * as userCredentials from '../testdata/cwfm/ref/userCredentials.json';

const { atMostOnePicklePerTag } = parallelCanAssignHelpers;
const myTagRule = atMostOnePicklePerTag(projectConfig.SCENARIOS_EXECUTION_SEQUENCE);

// Only one pickle with @tag1 can run at a time
//   AND only one pickle with @tag2 can run at a time
//setParallelCanAssign(myTagRule);

const testDataUtils = new TestDataUtils();

Before(async function ({ pickle }) {
    await getEnv();
    let appUserId = '';
    let appPwd = '';
    let txnDatafolder = `${process.cwd()}${projectConfig.RUN_TIME_DATA_PATH}`;

    playwright.browser = await invokeBrowser(process.env.BROWSER, { headless: true });

    console.log('worker id : ' + process.env.CUCUMBER_WORKER_ID + ' ### pickle Name : ' + pickle.name);
    let CryptoJS = require('crypto-js');
    if (projectConfig.SERVICE_ACCOUNT.toLowerCase().trim() === 'yes') {
        const loginDetails = userCredentials.serviceAccounts[process.env.CUCUMBER_WORKER_ID];
        appUserId = loginDetails.userName;
        appPwd = CryptoJS.enc.Base64.parse(userCredentials.encryptedPwd).toString(CryptoJS.enc.Utf8);

    } else {
        let userData = await testDataUtils.getLoginJsonData();
        appUserId = userData.msid;
        appPwd = userData.encryptedPwd;
    }

    playwright.context = await playwright.browser.newContext(
        {
            // recordVideo: {
            //     dir: "test-results/videos",
            // },
            viewport: { 'width': 1850, 'height': 950 },
            httpCredentials:
            {
                username: appUserId,
                password: appUserId
            }
        }
    );
    if (process.env.TAG.includes('facility-validation')) {
        // projectConfig.DEFAULT_WAIT_TIME = 560000
        // projectConfig.PAGE_LOAD_TIMEOUT = 560000
        setDefaultTimeout(560000);
        playwright.context.setDefaultNavigationTimeout(560000);
    }

    // await playwright.context.tracing.start({
    //     name: pickle.name,
    //     title: pickle.name,
    //     sources: true,
    //     snapshots: true
    // });

    playwright.page = await playwright.context.newPage();
    tcontext.testContext.assertsJson = JSON.parse("{}");
    tcontext.testContext.assertsJson.soft = [];
    tcontext.testContext.runtimeStorageFile = await runtimeDataUtils.createRunTimeDataJsonFile(txnDatafolder, process.env.ENV, pickle);
    let scn = await runtimeDataUtils.getRunTimeScnearioNo(pickle);
    let sourceFile = await testDataUtils.getSourceTestDataFile();
    let sourceDirectory = `${process.cwd()}${projectConfig.TEST_DATA_TXN_PATH}`;

    await runtimeDataUtils.copyScenariosDataToRunTimeDataFile(sourceDirectory, sourceFile, scn);
    await testDataUtils.renameKey(tcontext.testContext.runtimeStorageFile, 'MyTasks', 'testData');
    let loggerFileName = await runtimeDataUtils.getRunTimeDataFileName(pickle) + "-" + pickle.id;
    tcontext.testContext.logger = createLogger(await customLogger.options({ fileName: loggerFileName, logfileFolder: `${process.cwd()}/test-results-e2e/logs` }));
    tcontext.testContext.runtimeLoggerFile = `${process.cwd()}/test-results-e2e/logs/${loggerFileName}.log`;
    playwright.apiContext = await request.newContext({
        baseURL: process.env.APIURL,
    });

    console.log(' Worker id : ' + process.env.CUCUMBER_WORKER_ID);
    console.log(' User id picked : ' + appUserId);
    await runtimeDataUtils.addOrUpdateRunTimeResultsData('ScenarioNo', scn);
    customLogger.info(' Worker id : ' + process.env.CUCUMBER_WORKER_ID);
    customLogger.info(' User id picked : ' + appUserId);
    if (process.env.CUSTOMSRN !== 'null' && process.env.CUSTOMSRN !== undefined && process.env.CUSTOMSRN !== null) {
        let closeCustomSRNs = [];
        let customsrns = process.env.CUSTOMSRN.split("/");
        if (process.env.CLOSECUSTOMSRN !== null) {
            closeCustomSRNs = process.env.CLOSECUSTOMSRN.split("/");
        } else {
            closeCustomSRNs = Array(customsrns.length).fill('No');
        }
        for (let lpIndex = 0; lpIndex < customsrns.length; lpIndex++) {
            await runtimeDataUtils.setRunTimeTestData("UseExistingSRN", customsrns[lpIndex].trim(), lpIndex);
            await runtimeDataUtils.setRunTimeTestData("CloseSRN", closeCustomSRNs[lpIndex].trim(), lpIndex);
        }
    }
    let runtimeData = runtimeDataUtils.getRunTimeResultsData('nextScenarioToExecute');
    if (runtimeData !== undefined || runtimeData !== null) {
        await runtimeDataUtils.addOrUpdateRunTimeResultsData('nextScenarioToExecute', true);
    }
});

After(async function ({ pickle, result }) {
    // const path = `./test-results-e2e/trace/${pickle.id}.zip`;
    await afterSceanrio(pickle, result, this);
    await closeplaywright();
    // await playwright.context.tracing.stop({ path: path });
    await playwright.context.close();
    if (playwright.apiContext) await playwright.apiContext.dispose();
    if (playwright.browser) await playwright.browser.close();
    if (tcontext.testContext.logger)
        tcontext.testContext.logger.close();
});



async function afterSceanrio(pickle: any, result: any, worldObj: any) {
    // if (!process.env.TAG.includes('auths') && !process.env.TAG.includes('assignedusers')) {
    let filedata = await fileUtils.readData(tcontext.testContext.runtimeLoggerFile);
    await attachlog(
        filedata + result.duration, worldObj
    );

    let runtimeData = await fileUtils.readData(tcontext.testContext.runtimeStorageFile);
    await attachlog(runtimeData, worldObj);
    await fileUtils.checkFolderAndCreate(`${process.cwd()}/test-results-e2e/screenshots`);

    if (result?.status === Status.FAILED) {
        await attachImage(result, pickle, worldObj);
        await runtimeDataUtils.addOrUpdateRunTimeResultsData('nextScenarioToExecute', false);
    }


    if (tcontext.testContext.assertsJson) {
        if (tcontext.testContext.assertsJson.soft.length > 0) {
            //await runtimeDataUtils.addOrUpdateRunTimeResultsData('Results', `${JSON.stringify(tcontext.testContext.assertsJson.soft, null, 2)}`);
            await attachlog(JSON.stringify(tcontext.testContext.assertsJson, null, 2), worldObj);
            if (result?.status !== Status.FAILED) {
                await attachImage(result, pickle, worldObj);
                if (process.env.TAG.includes('facility-validation')) {
                    await customAssert.hardAssert(true, false, `Soft Asserts Failed: ${JSON.stringify(tcontext.testContext.assertsJson.soft, null, 2)}`);
                }
                await runtimeDataUtils.addOrUpdateRunTimeResultsData('Results', 'FAIL');
            }
        }
    }

    // }
    async function attachlog(data: any, worldObj: any) {
        worldObj.attach(data, "text/plain");
    }

    async function attachImage(result: any, pickle: any, worldObj: any) {
        if (result?.status === Status.FAILED) {
            await runtimeDataUtils.addOrUpdateRunTimeResultsData('Results', 'FAIL');
            // let flag = process.env.TAG.includes('auths') || process.env.TAG.includes('facility-validation') ? true : projectConfig.ON_FAILURE_SCREENSHOT;
            // if (flag) {
            let img: Buffer;
            img = await playwright.page.screenshot({ path: `${process.cwd()}/test-results-e2e/screenshots/${await runtimeDataUtils.getRunTimeScnearioNo(pickle) + "-" + pickle.id}.png`, type: "png", fullPage: true });

            worldObj.attach(
                img, "image/png"
            )
            // }
        } else {
            if (!process.env.TAG.includes('stargate-api') || !process.env.TAG.includes('facility-validation')) {
                await runtimeDataUtils.addOrUpdateRunTimeResultsData('Results', `PASS`);
            }
        }
    }
}
