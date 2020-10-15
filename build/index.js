module.exports=function(e){var t={};function a(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,a),i.l=!0,i.exports}return a.m=e,a.c=t,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)a.d(n,i,function(t){return e[t]}.bind(null,i));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=0)}([function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return u}));var n,i="PLAYWRIGHT",o="PUPPETEER";!function(e){e.SET_DEVICE="SET_DEVICE",e.NAVIGATE_URL="NAVIGATE_URL",e.VALIDATE_SEO="VALIDATE_SEO",e.CLICK="CLICK",e.INPUT="INPUT",e.HOVER="HOVER",e.SCROLL_TO_VIEW="SCROLL_TO_VIEW",e.ASSERT_ELEMENT="ASSERT_ELEMENT",e.EXTRACT_INFO="EXTRACT_INFO",e.ELEMENT_SCREENSHOT="ELEMENT_SCREENSHOT",e.BLACKOUT="BLACKOUT",e.WAIT="WAIT",e.PAGE_SCREENSHOT="PAGE_SCREENSHOT",e.CAPTURE_CONSOLE="CAPTURE_CONSOLE"}(n||(n={}));var r=function(){function e(e){this.helperFunctionsToInclude={}}return e.prototype.generate=function(e){var t=this._handleEvents(e);return"const puppeteer = require('puppeteer');\n\n"+this.addHelperFunctionsIfAny()+"const browser = puppeteer.launch();\nconst page = await browser.newPage();\n"+t+"await browser.close();\n"},e.prototype.addHelperFunctionsIfAny=function(){for(var e="",t=0,a=Object.keys(this.helperFunctionsToInclude);t<a.length;t++){"EXTRACT_INFO"===a[t]&&(e+="async function extractInfoUsingScript(page, selector, validationScript){\n    const elHandle = await page.$(selector);\n    const escapedInnerHTML = (await elHandle.innerHTML()).toString().replace(/\\`/g, \"\\\\`\").trim();\n    const escapedInnerText = (await elHandle.innerText()).replace(/\\`/g, \"\\\\`\").trim();;\n    \n    const scriptToEvaluate = `(` + validationScript + `)(` + '`' + escapedInnerHTML + '`' + `, ` + '`' + `${escapedInnerText}` + '`' + `, elHandle)`;\n    const output = eval(scriptToEvaluate);\n    \n    return output;\n}\n\n")}return e},e.prototype._handleEvents=function(e){for(var t,a="\n",n=0;n<e.length;n++){var i=e[n],o=i.event_type,r=i.selector,s=i.value;switch(o){case"NAVIGATE_URL":a+="  await page.goto('"+s+"');\n";break;case"CLICK":a+="  await page.click('"+r+"');\n";break;case"HOVER":a+="  await page.hover('"+r+"');\n";break;case"SCREENSHOT":t=r.replace(/[^\w\s]/gi,"").replace(/ /g,"_")+"_"+n,a+="  const h_"+n+" =  await page.$('"+r+"');\n   h_"+n+".screenshot({path: '"+t+".png'});\n";break;case"PAGE_SCREENSHOT":a+="  await page.screenshot({path: '"+(t=s.replace(/[^\w\s]/gi,"").replace(/ /g,"_")+"_"+n)+".png'});\n";break;case"SCROLL_TO_VIEW":a+="  const stv_"+n+" =  await page.$('"+r+"');\n  stv_"+n+".scrollIntoViewIfNeeded();\n";break;case"INPUT":a+="  await page.type('"+r+"', '"+s+"');\n";break;case"EXTRACT_INFO":var l=Object.keys(s)[0],c=s[l];this.helperFunctionsToInclude.EXTRACT_INFO=!0,a+="  let "+l+" = await extractInfoUsingScript(page, '"+r+"', `"+c+"`)\n";break;case"ASSERT_TEXT":this.helperFunctionsToInclude.ASSERT_TEXT=!0,a+=" ";default:console.error("Not supported event")}}return a},e}(),s=[{name:"Google Chrome",value:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",appVersion:"Mac OS X 10.14.0",platform:"Mac OS X"},{name:"Mozilla Firefox",value:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0",appVersion:"Mac OS X 10.14.0",platform:"Mac OS X"},{name:"Microsoft Edge",value:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393",appVersion:"Windows 10 0.0.0",platform:"Windows 10"},{name:"iPhone",value:"Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1",appVersion:"iOS 10.3.1",platform:"iOS"},{name:"iPad",value:"Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4",appVersion:"iOS 8.4.1",platform:"iOS"},{name:"Samsung Phone",value:"Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-G570Y Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/44.0.2403.133 Mobile Safari/537.36",appVersion:"Android 6.0.1",platform:"Android"},{name:"Google Pixel",value:"Mozilla/5.0 (Linux; Android 7.1.1; Pixel Build/NOF27B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.132 Mobile Safari/537.36",appVersion:"Android 8.0.0",platform:"Android"}],l=[{id:"iphoneXRXSMax",name:"iPhone XR, XS Max",width:414,height:896,visible:!0,userAgent:"iPhone"},{id:"iPhoneXSX",name:"iPhone XS, X",width:375,height:812,visible:!0,userAgent:"iPhone"},{id:"iPhone8Plus7Plus6SPlus",name:"iPhone 8 Plus, 7 Plus, 6S Plus",width:414,height:736,visible:!1,userAgent:"iPhone"},{id:"iPhone876S6",name:"iPhone 8, 7, 6S, 6",width:375,height:667,visible:!1,userAgent:"iPhone"},{id:"GalaxyS9PlusS8Plus",name:"Galaxy S9 Plus, S8 Plus",width:412,height:846,visible:!0,userAgent:"Samsung Phone"},{id:"GalaxyS9NOte8S8",name:"Galaxy S9, Note 8, S8",width:360,height:740,visible:!0,userAgent:"Samsung Phone"},{id:"Pixel33XL",name:"Pixel 3, 3 XL",width:393,height:786,visible:!0,userAgent:"Google Pixel"},{id:"GoogleChromeMediumScreen",name:"Medium Screen",width:1024,height:800,visible:!0,userAgent:"Google Chrome"},{id:"GoogleChromeLargeScreen",name:"Large Screen",width:1280,height:800,visible:!0,userAgent:"Google Chrome"}],c=function(){function e(e){this.helperFunctionsToInclude={}}return e.prototype.generate=function(e,t,a){void 0===t&&(t=!1),void 0===a&&(a=!1);var n=this._handleEvents(e,t,a);return"const playwright = require('playwright');\n\n"+this.addHelperFunctionsIfAny(t,a)+(t?"let captureVideo;\n":"")+'const browser = await playwright["chromium"].launch();\n'+n+(t?"await captureVideo.stop();\n}catch(ex){ await captureVideo.stop(); throw ex;}\n":"")+"await browser.close();\n"},e.prototype.addHelperFunctionsIfAny=function(e,t){void 0===e&&(e=!1),void 0===t&&(t=!1);for(var a="",n=0,i=Object.keys(this.helperFunctionsToInclude);n<i.length;n++){"EXTRACT_INFO"===i[n]&&(a+="async function extractInfoUsingScript(page, selector, validationScript){\n    const elHandle = await page.$(selector);\n    const escapedInnerHTML = (await elHandle.innerHTML()).toString().replace(/\\`/g, \"\\\\`\").trim();\n    const escapedInnerText = (await elHandle.innerText()).replace(/\\`/g, \"\\\\`\").trim();;\n    \n    const scriptToEvaluate = `(` + validationScript + `)(` + '`' + escapedInnerHTML + '`' + `, ` + '`' + `${escapedInnerText}` + '`' + `, elHandle)`;\n    const output = eval(scriptToEvaluate);\n    \n    return output;\n}\n\n")}return e&&(a+="\nconst DEFAULT_SLEEP_TIME = 500;\nconst TYPE_DELAY = 100;\nfunction sleep(time){\n    return new Promise((resolve, reject)=>{\n        setTimeout(()=>{\n            resolve(true);\n        }, time);\n    })\n}\n\n"),t&&(a+='function logStep(type, data, meta){\n\tif(typeof _logStepToMongo !== "undefined"){\n\t\t_logStepToMongo(type, data, meta);\n\t}\n}\n'),a},e.prototype._handleEvents=function(e,t,a){var i;void 0===t&&(t=!1),void 0===a&&(a=!1);var o="\n",r=!0,c=1280,u=720;if(e[0]&&"SET_DEVICE"!==e[0].event_type){var p=l[7],E=s.find((function(e){return e.name===p.userAgent}));c=p.width,u=p.height,o+="const browserContext = await browser.newContext({width: '"+p.width+"px', height: '"+p.height+"px', userAgent: \""+E.value+'"});\n'}else if(e[0]&&"SET_DEVICE"===e[0].event_type){var d=e[0].value,g=l.find((function(e){return e.id===d})),T=g||l[7];E=s.find((function(e){return e.name===T.userAgent}));c=T.width,u=T.height,o+="const browserContext = await browser.newContext({userAgent: '"+E.value+"', viewport: { width: "+T.width+", height: "+T.height+"}});\n",a&&(o+="await ('"+n.SET_DEVICE+"', {status: 'DONE', message: 'Set user agent to "+T.name+"'}, {name: '"+T.name+"', width: "+c+", height: "+u+", userAgent: '"+E.value+"'});\n")}for(var h=0;h<e.length;h++){var S=e[h],w=S.event_type,v=S.selectors,_=S.value;switch(w){case"NAVIGATE_URL":r?(r=!1,o+="const page = await browserContext.newPage({});\n"+(t?"const {saveVideo} = require('playwright-video');\ncaptureVideo = await saveVideo(page, 'video.mp4');\ntry{\n":"")+"await page.goto('"+_+"');\n"):o+="await page.goto('"+_+"');\nawait sleep(DEFAULT_SLEEP_TIME);\n",t&&(o+="await sleep(DEFAULT_SLEEP_TIME);\n"),a&&(o+="await logStep('"+n.NAVIGATE_URL+"', {status: 'DONE', message: 'Navigated to "+_+"'});\n");break;case"CLICK":o+="await page.waitForSelector('"+v[0].value+'\', {state: "attached"});\nconst stv_'+h+" = await page.$('"+v[0].value+"');\nawait stv_"+h+".scrollIntoViewIfNeeded();\nawait stv_"+h+".dispatchEvent('click');\n",t&&(o+="await sleep(DEFAULT_SLEEP_TIME);\n"),a&&(o+="await logStep('"+n.CLICK+"', {status: 'DONE', message: 'Clicked on "+v[0].value+"'}, {selector: '"+v[0].value+"'});\n");break;case"HOVER":o+="await page.waitForSelector('"+v[0].value+"', {state: \"attached\"});\nawait page.hover('"+v[0].value+"');\n",t&&(o+="await sleep(DEFAULT_SLEEP_TIME);\n"),a&&(o+="await logStep('"+n.HOVER+"', {status: 'DONE', message: 'Clicked on "+v[0].value+"'}, {selector: '"+v[0].value+"'});\n");break;case"SCREENSHOT":i=v[0].value.replace(/[^\w\s]/gi,"").replace(/ /g,"_")+"_"+h,o+="await page.waitForSelector('"+v[0].value+'\', {state: "attached"});\nconst h_'+h+" = await page.$('"+v[0].value+"');\nawait h_"+h+".screenshot({path: '"+i+".png'});\n",t&&(o+="await sleep(DEFAULT_SLEEP_TIME);\n"),a&&(o+="await logStep('"+n.ELEMENT_SCREENSHOT+"', {status: 'DONE', message: 'Took screenshot of "+v[0].value+"'}, {selector: '"+v[0].value+"'});\n");break;case"PAGE_SCREENSHOT":o+="await page.screenshot({path: '"+(i=_.replace(/[^\w\s]/gi,"").replace(/ /g,"_")+"_"+h)+".png', fullPage: true});\n",t&&(o+="await sleep(DEFAULT_SLEEP_TIME);\n"),a&&(o+="await logStep('"+n.PAGE_SCREENSHOT+"', {status: 'DONE', message: 'Took page screenshot'}, {selector: 'body'});\n");break;case"SCROLL_TO_VIEW":o+="await page.waitForSelector('"+v[0].value+'\', {state: "attached"});\nconst stv_'+h+" = await page.$('"+v[0].value+"');\nawait stv_"+h+".scrollIntoViewIfNeeded();\n",t&&(o+="await sleep(DEFAULT_SLEEP_TIME);\n"),a&&(o+="await logStep('"+n.SCROLL_TO_VIEW+"', {status: 'DONE', message: 'Scroll until this is in view, "+v[0].value+"'}, {selector: '"+v[0].value+"'});\n");break;case"INPUT":o+="await page.waitForSelector('"+v[0].value+"', {state: \"attached\"});\nawait page.type('"+v[0].value+"', '"+_+"', {delay: "+(t?"TYPE_DELAY":25)+"});\n",t&&(o+="await sleep(DEFAULT_SLEEP_TIME);\n"),a&&(o+="await logStep('"+n.INPUT+"', {status: 'DONE', message: 'Type "+_+" in "+v[0].value+"'}, {selector: '"+v[0].value+"', value: '"+_+"'});\n");break;case"EXTRACT_INFO":var f=Object.keys(_)[0],A=_[f];this.helperFunctionsToInclude.EXTRACT_INFO=!0,o+="await page.waitForSelector('"+v[0].value+'\', {state: "attached"});\nlet '+f+" = await extractInfoUsingScript(page, '"+v[0].value+"', `"+A+"`)\n",t&&(o+="await sleep(DEFAULT_SLEEP_TIME);\n"),a&&(o+="await logStep('"+n.EXTRACT_INFO+"', {status: 'DONE', message: 'Extract info from "+v[0].value+"'}, {selector: '"+v[0].value+"'});\n");break;case"ASSERT_TEXT":this.helperFunctionsToInclude.ASSERT_TEXT=!0,t&&(o+="await sleep(DEFAULT_SLEEP_TIME);\n"),o+=" ",a&&(o+="await logStep('"+n.ASSERT_ELEMENT+"', {status: 'DONE', message: 'Assert element info from "+v[0].value+"'}, {selector: '"+v[0].value+"'});\n");default:console.error("Not supported event")}}return o},e}();function u(e,t){return void 0===e&&(e={}),void 0===t&&(t=i),t===o?new r(e):new c(e)}}]);