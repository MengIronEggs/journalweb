(function () {

  function moreBtnOnClick(editor) {
    var e = editor.ui.getDom("toolbarbox");
    if (UE.dom.domUtils.hasClass(e, "show-edui-more")) {
      UE.dom.domUtils.removeClasses(e, "show-edui-more");
    } else {
      UE.dom.domUtils.addClass(e, "show-edui-more");
    }
  }
  // 插入视频的点击事件
  function insertVideo2BtnOnClick(editor) {
    // alert("插入视频");
    document.querySelector('.uploadImgDialog1').style.display = 'block';
    document.querySelector('.market').style.display = 'block';
  }
  // 插入图片的点击事件
  function insertImage2BtnOnClick(editor) {
    document.querySelector('.uploadImgDialog').style.display = 'block';
    document.querySelector('.market').style.display = 'block';
  }
  // 首行缩进的点击事件
  function travessaoBtnOnClick(editor) {
    editor.execCommand('indent');
  }

  // 更多
  window.UE.registerUI('more', function (editor, uiName) {
    // 注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName, {
      execCommand: function () {
        moreBtnOnClick(editor);
      }
    });
    var btn = new UE.ui.Button({
      name: uiName,
      title: "更多",
      cssRules: '',
      onclick: function () {
        editor.execCommand(uiName);
      }
    });
    return btn;
  });


  UE.registerUI('combox', function (editor, uiName) {
    //注册按钮执行时的command命令,用uiName作为command名字，使用命令默认就会带有回退操作
    editor.registerCommand(uiName, {
      execCommand: function (cmdName, value) {
        //这里借用fontsize的命令
        // this.execCommand('letterSpacing', value + 'px')
        // if (this.selection.getRange().cloneContents() !== null){
        //   var val = this.selection.getRange().cloneContents().textContent;
        // this.execCommand('inserthtml', "<span style='letter-spacing:" + value + "px'>" + val + "</span>")
        // } 
        // UE.dom.domUtils.setStyle(this.selection.getRange().applyInlineStyle("span", {
        //   "letter-spacing": "color:red"
        // }));

        this.selection.getRange().removeInlineStyle(["span"])
        var onLetter = "letter-spacing:" + value + "px";
        // console.log(myst);
        this.selection.getRange().applyInlineStyle("span", {
          "style": onLetter
        })

        // UE.dom.domUtils.setStyle(this.selection.getStart(), 'letter-spacing', value + 'px');
        // this.selection.getRange().applyInlineStyle("span", {
        //   "letter-spacing": value +'px'
        // })
        // console.log('1324', this.selection.getRange().cloneContents());
        // var oneLetter = this.selection.getRange().cloneContents().children;
        // console.log('12343',oneLetter);
        // for(let i = 0;i<oneLetter.length;i++){
        //   console.log(oneLetter[i].outerHTML);
        //   // oneLetter[i].outerHTML = '1234'
        //   UE.dom.domUtils.setStyle(this.render.oneLetter[i], 'letter-spacing', value + 'px');
        // }


        // console.log('123432432', oneLetter);
        //this.execCommand('combox', value + 'px')
      },
      queryCommandValue: function () {
        //这里借用fontsize的查询命令
        return this.queryCommandValue('letterSpacing')
      }
    });


    //创建下拉菜单中的键值对，这里我用字体大小作为例子
    var items = [];
    for (var i = 0, ci; ci = [0.5, 1, 2][i++];) {
      items.push({
        //显示的条目
        label: ci,
        //选中条目后的返回值
        value: ci,
        //针对每个条目进行特殊的渲染
        renderLabelHtml: function () {
          //这个是希望每个条目的字体是不同的
          return '<span class="edui-label %%-label" style="line-height:2;letter-spacing:' +
            this.value + 'px;">' + (this.label || '') + '</span>';
        }
      });
    }
    //创建下来框
    var combox = new UE.ui.Combox({
      //需要指定当前的编辑器实例
      editor: editor,
      //添加条目
      items: items,
      //当选中时要做的事情
      onselect: function (t, index) {
        //拿到选中条目的值
        editor.execCommand(uiName, this.items[index].value);
      },
      //提示
      title: '字间距',
      //当编辑器没有焦点时，combox默认显示的内容
      initValue: '',
    });

    editor.addListener('selectionchange', function (type, causeByUi, uiReady) {
      if (!uiReady) {
        // var state = editor.queryCommandState(uiName);
        // if (state == -1) {
        //   combox.setDisabled(true);
        // } else {
        //   combox.setDisabled(false);
        //   var value = editor.queryCommandValue(uiName);
        //   if (!value) {
        //     combox.setValue(uiName);
        //     return;
        //   }
        //   //ie下从源码模式切换回来时，字体会带单引号，而且会有逗号
        //   value && (value = value.replace(/['"]/g, '').split(',')[0]);
        //   combox.setValue(value);

        // }
      }

    });
    return combox;
  }, 19 /*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/ );


  // 插入视频
  UE.registerUI('insertvideo2', function (editor, uiName) {
    editor.registerCommand(uiName, {
      execCommand: function () {
        insertVideo2BtnOnClick(editor);
      }
    });
    var btn = new UE.ui.Button({
      name: uiName,
      title: "视频",
      cssRules: '',
      onclick: function () {
        editor.execCommand(uiName);
      }
    });
    return btn;
  });

  // 插入图片
  UE.registerUI('insertimage2', function (editor, uiName) {
    editor.registerCommand(uiName, {
      execCommand: function () {
        insertImage2BtnOnClick(editor);
      }
    });
    var btn = new UE.ui.Button({
      name: uiName,
      title: "图片",
      cssRules: '',
      onclick: function () {
        editor.execCommand(uiName);
      }
    });
    return btn;
  });

  // 首行缩进
  UE.registerUI('travessao', function (editor, uiName) {
    editor.registerCommand(uiName, {
      execCommand: function () {
        travessaoBtnOnClick(editor);
      }
    });
    var btn = new UE.ui.Button({
      name: uiName,
      title: "首行缩进",
      cssRules: '',
      onclick: function () {
        editor.execCommand(uiName);
      }
    });
    return btn;
  });
  // 撤销的点击事件
  function undo1OnClick(editor) {
    console.log('12342131发v的说法');
    editor.execCommand('undo');
  }
  // 撤销
  UE.registerUI('undo1', function (editor, uiName) {
    editor.registerCommand(uiName, {
      execCommand: function () {
        undo1OnClick(editor);
      }
    });
    var btn = new UE.ui.Button({
      name: uiName,
      title: "撤销",
      cssRules: '',
      onclick: function () {
        editor.execCommand(uiName);
      }
    });
    return btn;
  });
  
  // 重做
  UE.registerUI('redo1', function (editor, uiName) {
    editor.registerCommand(uiName, {
      execCommand: function () {
        redo1Onclick(editor);
      }
    });
    var btn = new UE.ui.Button({
      name: uiName,
      title: "重做",
      cssRules: '',
      onclick: function () {
        editor.execCommand(uiName);
      }
    });
    return btn;
  });
  // 重做的点击事件
  function redo1Onclick(editor) {
    console.log('1234213');
    editor.execCommand('redo');
  }

  // 添加内链图标
  UE.registerUI('insertimage3', function (editor, uiName) {
    editor.registerCommand(uiName, {
      execCommand: function () {
        insertImage3BtnOnClick(editor);
      }
    });
    var btn = new UE.ui.Button({
      name: uiName,
      title: "内链",
      cssRules: '',
      onclick: function () {
        editor.execCommand(uiName);
      }
    });
    return btn;
  });

// 内链的点击事件
function insertImage3BtnOnClick(editor) {
  document.querySelector('.uploadImgDialog2').style.display = 'block';
  document.querySelector('.market').style.display = 'block';
  // console.log(this.Button);
  // var focusNode = UE.getEditor('editor').selection.getStart()
  // console.log('123412',focusNode)]
  // UE.getEditor('editor').focus();
  // var focusNode = UE.getEditor('editor').selection.getStart()
  // console.log(focusNode)
  // console.log(UE.dom.domUtils.getStyle(focusNode 'color'));
  
  // console.log(editor.selection.getRange());
}


})();