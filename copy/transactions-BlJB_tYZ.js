import{i as s,a as f,x as p}from"./index-CWdX713u.js";import{c as a}from"./if-defined-Bmgtyenu.js";import"./index-DTlrzZ6k.js";import"./antd-Bvt8vHIl.js";import"./vendor-DoC2WAmd.js";import"./utils-DJ8lBnJC.js";import"./index-CM2-W3P9.js";import"./index-wQqDvUXT.js";import"./index-CM3h9Wiq.js";import"./index-CN1oX7E4.js";import"./index-BsccQCB1.js";const d=s`
  :host > wui-flex:first-child {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }
`;var u=function(o,e,i,r){var n=arguments.length,t=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(o,e,i,r);else for(var c=o.length-1;c>=0;c--)(l=o[c])&&(t=(n<3?l(t):n>3?l(e,i,t):l(e,i))||t);return n>3&&t&&Object.defineProperty(e,i,t),t};let m=class extends f{render(){return p`
      <wui-flex flexDirection="column" .padding=${["0","m","m","m"]} gap="s">
        <w3m-activity-list page="activity"></w3m-activity-list>
      </wui-flex>
    `}};m.styles=d;m=u([a("w3m-transactions-view")],m);export{m as W3mTransactionsView};
