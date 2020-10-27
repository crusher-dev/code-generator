// @ts-nocheck

import {
	ACTIONS_IN_TEST,
	ASSERT_TEXT,
	CLICK, EXTRACT_INFO,
	HOVER,
	INPUT,
	NAVIGATE_URL,
	PAGE_SCREENSHOT,
	SCREENSHOT,
	SCROLL_TO_VIEW, SET_DEVICE
} from "./constants/eventsToRecord";
import userAgents from "./constants/userAgents";
import devices from "./constants/devices";

const importPlayWright = `const playwright = require('playwright');\n\n`

const header = `const browser = await playwright["chromium"].launch();\n`

const footer = `await browser.close();\n`;

const logStepsFunction = `function logStep(type, data, meta){
	if(typeof _logStepToMongo !== "undefined"){
		_logStepToMongo(type, data, meta);
	}
}\n`;

const extractInfoUsingScriptFunction = `async function extractInfoUsingScript(page, selector, validationScript){
    const elHandle = await page.$(selector);
    const escapedInnerHTML = (await elHandle.innerHTML())` + '.toString().replace(/\\`/g, "\\\\`").trim()' + `;
    const escapedInnerText = (await elHandle.innerText())` + '.replace(/\\`/g, "\\\\`").trim();' + `;
    
    `+ "const scriptToEvaluate = \`(\` + validationScript + \`)(\` + '\`' + escapedInnerHTML + '\`' + \`, \` + '\`' + \`${escapedInnerText}\` + '\`' + \`, elHandle)\`" + `;
    const output = eval(scriptToEvaluate);
    
    return output;
}\n\n`;

const sleepScriptFunction = `
const DEFAULT_SLEEP_TIME = 500;
const TYPE_DELAY = 100;
function sleep(time){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(true);
        }, time);
    })
}\n\n`;

export default class CodeGenerator {
	helperFunctionsToInclude: any;

	constructor(options: any) {
		this.helperFunctionsToInclude = {};
	}

	generate(events: any, isRecordingVideo: boolean = false, isLiveProgress = false){
		const generatedEventsCode = this._handleEvents(events, isRecordingVideo, isLiveProgress);
		return importPlayWright + this.addHelperFunctionsIfAny(isRecordingVideo, isLiveProgress) + (isRecordingVideo ? `let captureVideo;\n` : ``) + header + generatedEventsCode + (isRecordingVideo ? `await captureVideo.stop();\n}catch(ex){ await captureVideo.stop(); throw ex;}\n` : '') + footer;
	}

	addHelperFunctionsIfAny(isRecordingVideo = false, isLiveProgress = false){
		const helperFunctions = Object.keys(this.helperFunctionsToInclude);
		let codeToAdd = "";
		for(let fun of helperFunctions){
			if(fun === EXTRACT_INFO){
				codeToAdd+= extractInfoUsingScriptFunction;
			}
		}
		if(isRecordingVideo){
			codeToAdd += sleepScriptFunction;
		}
		if(isLiveProgress){
			codeToAdd += logStepsFunction;
		}
		return codeToAdd;
	}

	_handleEvents(events: any, isRecordingVideo = false, isLiveProgress = false){
		let screenShotFileName: string;
		let code = '\n';
		let firstTimeNavigate = true;
		let width = 1280;
		let height = 720;
		if(events[0] && events[0].event_type!==ACTIONS_IN_TEST.SET_DEVICE) {
			const device = devices[7];
			const userAgent = userAgents.find(agent => {
				return agent.name === device.userAgent;
			});
			width = device.width;
			height = device.height;
			code += `const browserContext = await browser.newContext({width: '${device.width}px', height: '${device.height}px', userAgent: "${userAgent.value}"});\n`;
			if(isLiveProgress) {
				code += `await logStep('${ACTIONS_IN_TEST.SET_DEVICE}', {status: 'DONE', message: 'Set user agent to ${device.name}'}, {name: '${device.name}', width: ${width}, height: ${height}, userAgent: '${userAgent.value}'});\n`;
			}
		} else if(events[0] && events[0].event_type===SET_DEVICE) {
			const {value: deviceId} = events[0];
			const deviceFound = devices.find((_device)=>{
				return _device.id === deviceId;
			});
			const device = deviceFound ? deviceFound : devices[7];
			const userAgent = userAgents.find(agent => {
				return agent.name === device.userAgent;
			});
			width = device.width;
			height = device.height;
			code += `const browserContext = await browser.newContext({userAgent: '${userAgent.value}', viewport: { width: ${device.width}, height: ${device.height}}});\n`;
			if(isLiveProgress) {
				code += `await logStep('${ACTIONS_IN_TEST.SET_DEVICE}', {status: 'DONE', message: 'Set user agent to ${device.name}'}, {name: '${device.name}', width: ${width}, height: ${height}, userAgent: '${userAgent.value}'});\n`;
			}
		}

		for (let i = 0; i < events.length; i++) {
			const { event_type, selectors, value } = events[i];
			switch (event_type) {
				case ACTIONS_IN_TEST.NAVIGATE_URL:
					if(firstTimeNavigate) {
						firstTimeNavigate = false;
						code += `const page = await browserContext.newPage({});\n` + (isRecordingVideo ? `const {saveVideo} = require('playwright-video');\ncaptureVideo = await saveVideo(page, 'video.mp4');\ntry{\n` : '') +`await page.goto('${value}');\n`;
					} else {
						code += `await page.goto('${value}');\n`;
					}
					if(isLiveProgress){
						code += `await logStep('${ACTIONS_IN_TEST.NAVIGATE_URL}', {status: 'DONE', message: 'Navigated to ${value}'});\n`;
					}
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ACTIONS_IN_TEST.CLICK:
					code += `await page.waitForSelector('${selectors[0].value}', {state: "attached"});\nconst stv_${i} = await page.$('${selectors[0].value}');\nawait stv_${i}.scrollIntoViewIfNeeded();\nawait stv_${i}.dispatchEvent('click');\n`
					if(isLiveProgress){
						code += `await logStep('${ACTIONS_IN_TEST.CLICK}', {status: 'DONE', message: 'Clicked on ${selectors[0].value}'}, {selector: '${selectors[0].value}'});\n`;
					}
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ACTIONS_IN_TEST.HOVER:
					code += `await page.waitForSelector('${selectors[0].value}', {state: "attached"});\nawait page.hover('${selectors[0].value}');\n`;
					if(isLiveProgress){
						code += `await logStep('${ACTIONS_IN_TEST.HOVER}', {status: 'DONE', message: 'Clicked on ${selectors[0].value}'}, {selector: '${selectors[0].value}'});\n`;
					}
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ACTIONS_IN_TEST.ELEMENT_SCREENSHOT:
					screenShotFileName = selectors[0].value.replace(/[^\w\s]/gi, '').replace(/ /g, '_') + `_${i}`;
					code += `await page.waitForSelector('${selectors[0].value}', {state: "attached"});\nconst h_${i} = await page.$('${selectors[0].value}');\nawait h_${i}.screenshot({path: '${screenShotFileName}.png'});\n`
					if(isLiveProgress){
						code += `await logStep('${ACTIONS_IN_TEST.ELEMENT_SCREENSHOT}', {status: 'DONE', message: 'Took screenshot of ${selectors[0].value}'}, {selector: '${selectors[0].value}'});\n`;
					}
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ACTIONS_IN_TEST.PAGE_SCREENSHOT:
					screenShotFileName = value.replace(/[^\w\s]/gi, '').replace(/ /g,"_") + `_${i}`;
					code += `await page.screenshot({path: '${screenShotFileName}.png', fullPage: true});\n`;
					if(isLiveProgress){
						code += `await logStep('${ACTIONS_IN_TEST.PAGE_SCREENSHOT}', {status: 'DONE', message: 'Took page screenshot'}, {selector: 'body'});\n`;
					}
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ACTIONS_IN_TEST.SCROLL_TO_VIEW:
					code += `await page.waitForSelector('${selectors[0].value}', {state: "attached"});\nconst stv_${i} = await page.$('${selectors[0].value}');\nawait stv_${i}.scrollIntoViewIfNeeded();\n`
					if(isLiveProgress){
						code += `await logStep('${ACTIONS_IN_TEST.SCROLL_TO_VIEW}', {status: 'DONE', message: 'Scroll until this is in view, ${selectors[0].value}'}, {selector: '${selectors[0].value}'});\n`;
					}
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ACTIONS_IN_TEST.INPUT:
					code += `await page.waitForSelector('${selectors[0].value}', {state: "attached"});\nawait page.type('${selectors[0].value}', '${value}', {delay: ${isRecordingVideo ? 'TYPE_DELAY' : 25}});\n`;
					if(isLiveProgress){
						code += `await logStep('${ACTIONS_IN_TEST.INPUT}', {status: 'DONE', message: 'Type ${value} in ${selectors[0].value}'}, {selector: '${selectors[0].value}', value: '${value}'});\n`;
					}
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ACTIONS_IN_TEST.EXTRACT_INFO:
					const variable_name = Object.keys(value)[0];
					const validation_script = value[variable_name];
					this.helperFunctionsToInclude[EXTRACT_INFO] = true;
					code += `await page.waitForSelector('${selectors[0].value}', {state: "attached"});\nlet ${variable_name} = await extractInfoUsingScript(page, '${selectors[0].value}', ` + '`' + validation_script + '`' + `)\n`;
					if(isLiveProgress){
						code += `await logStep('${ACTIONS_IN_TEST.EXTRACT_INFO}', {status: 'DONE', message: 'Extract info from ${selectors[0].value}'}, {selector: '${selectors[0].value}'});\n`;
					}
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ACTIONS_IN_TEST.ASSERT_ELEMENT:
					this.helperFunctionsToInclude[ASSERT_TEXT] = true;
					code += ` `;
					if(isLiveProgress){
						code += `await logStep('${ACTIONS_IN_TEST.ASSERT_ELEMENT}', {status: 'DONE', message: 'Assert element info from ${selectors[0].value}'}, {selector: '${selectors[0].value}'});\n`;
					}
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
				default:
					console.error("Not supported event");
			}

		}
		return code;
	}
}
