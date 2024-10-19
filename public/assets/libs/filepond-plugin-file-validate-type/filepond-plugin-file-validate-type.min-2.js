/*!
 * FilePondPluginFileValidateType 1.2.9
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://pqina.nl/filepond/ for details.
 */

/* eslint-disable */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).FilePondPluginFileValidateType=t()}(this,function(){"use strict";var e=function(e){var t=e.addFilter,n=e.utils,i=n.Type,T=n.isString,E=n.replaceInString,l=n.guesstimateMimeType,o=n.getExtensionFromFilename,r=n.getFilenameFromURL,u=function(e,t){return e.some(function(e){return/\*$/.test(e)?(n=e,(/^[^/]+/.exec(t)||[]).pop()===n.slice(0,-2)):e===t;var n})},a=function(e,t,n){if(0===t.length)return!0;var i=function(e){var t="";if(T(e)){var n=r(e),i=o(n);i&&(t=l(i))}else t=e.type;return t}(e);return n?new Promise(function(T,E){n(e,i).then(function(e){u(t,e)?T():E()}).catch(E)}):u(t,i)};return t("SET_ATTRIBUTE_TO_OPTION_MAP",function(e){return Object.assign(e,{accept:"acceptedFileTypes"})}),t("ALLOW_HOPPER_ITEM",function(e,t){var n=t.query;return!n("GET_ALLOW_FILE_TYPE_VALIDATION")||a(e,n("GET_ACCEPTED_FILE_TYPES"))}),t("LOAD_FILE",function(e,t){var n=t.query;return new Promise(function(t,i){if(n("GET_ALLOW_FILE_TYPE_VALIDATION")){var T=n("GET_ACCEPTED_FILE_TYPES"),l=n("GET_FILE_VALIDATE_TYPE_DETECT_TYPE"),o=a(e,T,l),r=function(){var e,t=T.map((e=n("GET_FILE_VALIDATE_TYPE_LABEL_EXPECTED_TYPES_MAP"),function(t){return null!==e[t]&&(e[t]||t)})).filter(function(e){return!1!==e}),l=t.filter(function(e,n){return t.indexOf(e)===n});i({status:{main:n("GET_LABEL_FILE_TYPE_NOT_ALLOWED"),sub:E(n("GET_FILE_VALIDATE_TYPE_LABEL_EXPECTED_TYPES"),{allTypes:l.join(", "),allButLastType:l.slice(0,-1).join(", "),lastType:l[l.length-1]})}})};if("boolean"==typeof o)return o?t(e):r();o.then(function(){t(e)}).catch(r)}else t(e)})}),{options:{allowFileTypeValidation:[!0,i.BOOLEAN],acceptedFileTypes:[[],i.ARRAY],labelFileTypeNotAllowed:["File is of invalid type",i.STRING],fileValidateTypeLabelExpectedTypes:["Expects {allButLastType} or {lastType}",i.STRING],fileValidateTypeLabelExpectedTypesMap:[{},i.OBJECT],fileValidateTypeDetectType:[null,i.FUNCTION]}}};return"undefined"!=typeof window&&void 0!==window.document&&document.dispatchEvent(new CustomEvent("FilePond:pluginloaded",{detail:e})),e});
