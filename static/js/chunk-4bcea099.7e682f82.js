(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4bcea099"],{"0e2b":function(t,e,a){e=t.exports=a("2350")(!1),e.push([t.i,"\n.topAbout[data-v-20a56df4]{width:600px;margin:0 auto;height:400px;position:relative\n}\n.topAbout .searChInput[data-v-20a56df4]{left:1px\n}\n.topAbout .searChInput[data-v-20a56df4],.topAbout .searChInput1[data-v-20a56df4]{width:248px;height:40;z-index:200;position:absolute;top:50px\n}\n.topAbout .searChInput1[data-v-20a56df4]{right:5px\n}",""])},"121d":function(t,e,a){e=t.exports=a("2350")(!1),e.push([t.i,'\na[href="https://www.froala.com/wysiwyg-editor?k=u"]{display:none!important\n}',""])},"1a7a":function(t,e,a){var o=a("121d");"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var r=a("499e").default;r("26e6ee3a",o,!0,{sourceMap:!1,shadowMode:!1})},"5b3d":function(t,e,a){e=t.exports=a("2350")(!1),e.push([t.i,"\n.el-transfer-panel{width:250px\n}\n.el-transfer-panel__filter{opacity:0\n}",""])},befa:function(t,e,a){var o=a("0e2b");"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var r=a("499e").default;r("5fe8ce70",o,!0,{sourceMap:!1,shadowMode:!1})},c5bd:function(t,e,a){"use strict";var o=a("eb94"),r=a.n(o);r.a},cce9:function(t,e,a){"use strict";var o=a("befa"),r=a.n(o);r.a},de42:function(t,e,a){"use strict";var o=a("1a7a"),r=a.n(o);r.a},eb94:function(t,e,a){var o=a("5b3d");"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var r=a("499e").default;r("c7a7e8f6",o,!0,{sourceMap:!1,shadowMode:!1})},f552:function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"bread"},[a("el-breadcrumb",{attrs:{separator:"/"}},t._l(t.breadArr,function(e,o){return a("el-breadcrumb-item",{key:o,attrs:{to:{path:e.path}}},[t._v(t._s(e.name))])}))],1),a("h4",[t._v("选择卡片")]),a("div",{staticClass:"topAbout"},[a("div",{staticClass:"searChInput"},[a("el-input",{attrs:{placeholder:"输入姓名或电话"},model:{value:t.names,callback:function(e){t.names=e},expression:"names"}},[a("el-button",{attrs:{slot:"append",icon:"el-icon-search"},on:{click:t.searchClick},slot:"append"})],1)],1),a("div",{staticClass:"searChInput1"}),a("el-transfer",{attrs:{filterable:"",titles:t.titles,"filter-placeholder":"请输入姓名",data:t.data2},model:{value:t.AboutUs.productprop.aboutUs.userArr,callback:function(e){t.$set(t.AboutUs.productprop.aboutUs,"userArr",e)},expression:"AboutUs.productprop.aboutUs.userArr"}})],1),a("div",{staticClass:"TheText"},[t.config?a("froala",{staticClass:"editor-box",attrs:{tag:"textarea",config:t.config},model:{value:t.AboutUs.productprop.aboutUs.text,callback:function(e){t.$set(t.AboutUs.productprop.aboutUs,"text",e)},expression:"AboutUs.productprop.aboutUs.text"}}):t._e()],1),a("div",{staticStyle:{width:"100%",height:"40px","margin-top":"20px","text-align":"center"}},[a("el-button",{attrs:{type:"primary"},on:{click:t.saveClick}},[t._v("保存")])],1)])},r=[],n=(a("f751"),a("7f7f"),{data:function(){var t=this,e=this.UPLOAD_EDITOR_IMAGE;return{breadArr:[{path:"/managementEdit",name:"综合行政"},{path:"/aboutUs",name:"关于我们"}],names:"",names1:"",value2:[],data2:[],titles:["人员列表","选择结果"],text:null,config:{placeholder:"",language:"zh_cn",heightMin:480,widthMin:800,height:480,width:"100%",direction:"ltr",toolbarButtons:["html","fullscreen","|","insertLink","insertImage","insertVideo","insertTable","|","quote","insertHR","subscript","superscript","undo","redo","|","bold","italic","underline","strikeThrough","|","fontFamily","|","fontSize","|","color","emoticons","inlineStyle","|","paragraphFormat","|","paragraphStyle","align","formatOL","formatUL","outdent","indent","clearFormatting","insertimg","lineHeight"],allowedImageTypes:["jpeg","jpg","png","gif"],imageAllowedTypes:["jpeg","jpg","png","gif"],imageUploadURL:e,videoUploadURL:e,events:{"froalaEditor.initialized":function(e,a){t.$editor=a}}}}},methods:{searchClick:function(){var t=this;this.$get("GetYunUserSearch?value="+this.names).then(function(e){if(200==e.Code){var a=[];a=e.Data.map(function(t){return t.label=t.name+"("+t.shortName+")",t.key=t.id,t}),t.data2=a}})},nameListLoad:function(){var t=this;this.$get("GetYunUserSearch").then(function(e){if(200==e.Code){var a=[];a=e.Data.map(function(t){return t.label=t.name+"("+t.shortName+")",t.key=t.id,t}),t.data2=a}})},saveClick:function(){this.submit(this.AboutUs)},submit:function(t){var e=this,a={};Object.assign(a,t),a.userid=sessionStorage.getItem("USER_ID"),a.userid=parseInt(a.userid),a.productprop=JSON.stringify(a.productprop),a.producttype=parseInt(a.producttype),a.productorder&&(a.productorder=parseInt(a.productorder)),this.$post("AsProductlistSave",a).then(function(t){200==t.Code&&e.$showMsgTip("保存成功")})}},mounted:function(){this.nameListLoad()},computed:{AboutUs:function(){return this.$store.state.attribute.footerList}}}),i=n,s=(a("cce9"),a("de42"),a("c5bd"),a("2877")),u=Object(s["a"])(i,o,r,!1,null,"20a56df4",null);u.options.__file="AboutUs.vue";e["default"]=u.exports}}]);