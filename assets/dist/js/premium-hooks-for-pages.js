(()=>{var e={d:(n,t)=>{for(var r in t)e.o(t,r)&&!e.o(n,r)&&Object.defineProperty(n,r,{enumerable:!0,get:t[r]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};(()=>{"use strict";e.r(n),e.d(n,{premiumHooksForPages:()=>t});var t={};e.r(t),e.d(t,{getPremiumCalendarItemView:()=>a,getPremiumItemsMinDroppableDay:()=>g,isItemTypeDraggable:()=>s,isPremiumItemInSegment:()=>c,isPremiumItemVisible:()=>l,onGetPremiumItemsMinDroppableDay:()=>f,onIsPremiumItemInSegment:()=>d,onIsPremiumItemTypeDraggable:()=>u,onIsPremiumItemVisible:()=>p,setPremiumCalendarItemView:()=>m});const r=window.wp.hooks,i=window.NelioContent.utils;var o=function(){return null};function a(e){return(0,r.applyFilters)("nelio-content_premium-hooks-for-pages_getPremiumCalendarItemView",o,e)}function m(e,n){(0,r.addFilter)("nelio-content_premium-hooks-for-pages_getPremiumCalendarItemView","getPremium".concat((0,i.pascalCase)(e),"View"),(function(t,r){return e===r?n:t}))}function s(e){switch(e){case"post":case"task":case"social":return!0;case"external-event":case"internal-event":return!1;default:return function(e){return!!(0,r.applyFilters)("nelio-content_premium-hooks-for-pages_isPremiumItemTypeDraggable",!1,e)}(e)}}function u(e,n){(0,r.addFilter)("nelio-content_premium-hooks-for-pages_isPremiumItemTypeDraggable","isPremium".concat((0,i.pascalCase)(e),"Draggable"),(function(t,r){return e===r?n(t):t}))}function l(e,n){return!!(0,r.applyFilters)("nelio-content_premium-hooks-for-pages_isPremiumItemVisibleInCalendar",!1,e,n)}function p(e,n){(0,r.addFilter)("nelio-content_premium-hooks-for-pages_isPremiumItemVisibleInCalendar","isPremium".concat((0,i.pascalCase)(e),"VisibleInCalendar"),(function(t,r,i){return e===r?n(t,i):t}))}function c(e,n,t){return!!(0,r.applyFilters)("nelio-content_premium-hooks-for-pages_isPremiumItemInCalendarSegment",!1,e,n,t)}function d(e,n){(0,r.addFilter)("nelio-content_premium-hooks-for-pages_isPremiumItemInCalendarSegment","isPremium".concat((0,i.pascalCase)(e),"InCalendarSegment"),(function(t,r,i,o){return e===r?n(t,i,o):t}))}function g(e,n){return(0,r.applyFilters)("nelio-content_premium-hooks-for-pages_getPremiumItemsMinDroppableDay",void 0,e,n)}function f(e,n){(0,r.addFilter)("nelio-content_premium-hooks-for-pages_getPremiumItemsMinDroppableDay","getPremium".concat((0,i.pascalCase)(e),"sMinDroppableDay"),(function(t,r,i){return e===r&&i?n(t,i):t}))}})();var t=NelioContent="undefined"==typeof NelioContent?{}:NelioContent;for(var r in n)t[r]=n[r];n.__esModule&&Object.defineProperty(t,"__esModule",{value:!0})})();