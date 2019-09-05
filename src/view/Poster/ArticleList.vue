<template>
    <div class='articlePage'>
        <!-- 面包屑 -->
        <div class="bread">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadArr" :key="index" :to="{path:item.path}">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="outerLayer">
            <div class="leftList">
                <div class="article_List" :key="index" v-for="(item,index) in articleListData" v-dragging="{item:item,list:articleListData,group:'item'}" @click="articleListClick(item)">
                    <div :style="`background:url('${item.imgurl+ '?imageView2/1/w/80/h/80'}') center center / 60% no-repeat;`"></div>
                    <div><a>{{item.articlename}}</a></div>
                    <div><el-button size="mini" type="danger" circle icon="el-icon-close"  @click.stop="articleListDelete(item)"></el-button></div>
                </div>
                <el-button circle icon="el-icon-plus" type="primary" style="margin-top:.1rem;" @click="addArticleClick"></el-button>
            </div>
            <div class="rightText">
                <div class="topDiv">
                    <div class='fileInfo' style="position:relative;">
                      <div class ="fromLine"> 
                            <el-form ref="form" :rules="rules" :model="ElectronicJournalInfo" label-width=".4rem" class='topFrom'>
                              <el-form-item prop='articlename' class='oneInput' style="width:30%;float:left;position:relative;" label="标题" >
                                <div style="width:100%;height:.1rem;position:absolute;top:-.12rem;">
                                  <p style="width:100%;line-height:.1rem;font-size:.05rem;color:#CBC4CF;">当前字号：{{biaotiStyle.biaotiFontSize}}&nbsp;&nbsp;字体：{{biaotiStyle.biaotiFontFamily}}</p>
                                </div>
                                <el-input :maxlength="60" v-model="ElectronicJournalInfo.articlename"  placeholder="请输入文章标题名称">
                                    <el-button class='onBtn' size="mini" slot="append" @click="setTitleClick" icon="el-icon-setting"></el-button>
                                </el-input>
                              </el-form-item>
                              <el-form-item label="封面" style="width:15%;float:left;" prop='imgurl'>
                                <el-upload
                                    style="text-align:left;"
                                    class="avatar-uploader"
                                    :action="UPLOAD_IMAGE"
                                    :data='{pid:"121"}'
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                >    
                                    <div class='smallImgDiv' v-if="ElectronicJournalInfo.imgurl" style="position:relative;">
                                      <img :src="ElectronicJournalInfo.imgurl" class="avatar">
                                      <div class="enlarge">
                                        <img style="width:100%;" :src="ElectronicJournalInfo.imgurl" alt="">
                                      </div>
                                    </div>
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                            <div class='twoSwitch'>
                              <el-form-item class='barrage' label="弹幕" style="width:100%;float:left;">
                                <el-switch
                                  v-model="ElectronicJournalInfo.showbarrage"
                                  active-color="#13ce66"
                                  :active-value='1'
                                  :inactive-value='0'
                                  inactive-color="#cccccc">
                                </el-switch>
                              </el-form-item>
                              <el-form-item class='rootHeader' label="封面置顶" style="width:100%;float:left;">
                                <el-switch
                                  v-model="ElectronicJournalInfo.showheadimg"
                                  active-color="#13ce66"
                                  :active-value='1'
                                  :inactive-value='0'
                                  inactive-color="#cccccc">
                                </el-switch>
                              </el-form-item>
                            </div>
                              
                              <el-form-item  prop="topic" class='twoInput' style="width:30%;float:left;position:relative;"  label="栏目" >
                                <div style="width:100%;height:.1rem;position:absolute;top:-.12rem;">
                                  <p style="width:100%;line-height:.1rem;font-size:.05rem;color:#CBC4CF;">当前字号：{{lanmuStyle.lanmuFontSize}}&nbsp;&nbsp;字体：{{lanmuStyle.lanmuFontFamily}}</p>
                                </div>
                                <el-input :maxlength="20" v-model="ElectronicJournalInfo.topic" placeholder="请输入栏目">
                                  <el-button slot="append" size="mini" @click="columnClick" icon="el-icon-setting"></el-button>
                                </el-input>
                            </el-form-item>
                            </el-form>
                      </div>
                      <div class ="fromLine" style="margin-top:.01rem;" >
                          <el-form ref="form" :rules="rules" :model="ElectronicJournalInfo" label-width=".4rem" class='topFrom'>
                            <el-form-item  label="类型" style="width:30%;float:left;" prop="articletype">
                                <el-select style="width:100%;" placeholder="请选择" v-model="ElectronicJournalInfo.articletype" @change="changEntryType1">
                                    <el-option-group
                                        v-for="group in entryOptions"
                                        :key="group.label"
                                        :label="group.label">
                                        <el-option
                                            v-for="item in group.options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-option-group>
                                </el-select>
                            </el-form-item>
                            <!-- <el-form-item prop="content"  v-show="ElectronicJournalInfo.articletype == '链接' || ElectronicJournalInfo.articletype == 1" style="width:30%;float:left;" label="链接"> -->
                            <el-form-item  v-show="ElectronicJournalInfo.articletype == '外部链接' || ElectronicJournalInfo.articletype == 1" style="width:30%;float:left;" label="链接">
                                <el-input v-model="outerLineUrl" placeholder="请输入完整链接地址"></el-input>
                            </el-form-item>
                            <el-form-item style="width:40%;float:left;">
                                <el-button type="success" size="small" style="text-align:center;margin-bottom:.01rem;margin-top:.01rem;float:left;" @click="previewDialogVisible = true">预览</el-button>
                                <el-button type="primary" size="small" style="text-align:center;margin-bottom:.01rem;margin-top:.01rem;float:left;" @click="saveClick">保存</el-button>
                                <el-button type="primary" size="small" style="text-align:center;margin-bottom:.01rem;margin-top:.01rem;float:left;" @click="beforeClick">返回</el-button>
                            </el-form-item>
                          </el-form>
                        </div>
                    </div>
                    
                </div>
                <!-- <div style="width:100%;height:1px; background:#ccc;position:absolute;top:1rem;"></div> -->
                <!-- <input id="fileInput" class="fileInput"  type="file" name="file" ref="fileInput" /> -->
                <div class="textDiv"> 
                   <!-- <froala  class="editor-box" v-if="config" :tag="'textarea'" :config="config" v-model="textModel"></froala> -->
                   <!-- 富文本编译器 -->
                   <VueUEditor ueditorPath='/static/ueditor/' @ready='OnUeReady'></VueUEditor>
                </div>
               
            </div>
        </div>
        <footer class="footer">
            
        </footer>
        <manageprive :previewDialogVisible="previewDialogVisible" :url="previewUrl" @close="previewDialogVisible = false" />
        
        <!-- 声音录入的提示框 -->
        <el-dialog
            title="选取声音文件"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <el-upload
            class="upload-demo"
            style="text-align:center;"
            :data="{pid:122}"
            :action="UPLOAD_IMAGE"
            :limit="limit"
            :on-success="singleUpLoadSuccess"
            :file-list="fileList"
            >
            <!--  -->
            <el-button class="btn-add" type="primary" icon="el-icon-plus" circle></el-button>
            <div slot="tip" class="el-upload__tip" style="text-align:center;">只能上传mp3文件</div>
          </el-upload>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false,fileList=[]">取 消</el-button>
              <el-button type="primary" @click="saveMp3Click">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 设置文章名称和栏目字体的弹窗 -->
        <el-dialog
          :title="setUpdialogTitle"
          :visible.sync="setupdialogVisible"
          width="40%"
          >
          <div style="width:100%;height:1rem;">
            <el-form ref="form" :model="titleStyle" label-width=".4rem" >
              <el-form-item  label="字号" style="width:60%;float:left;" >
                  <el-select style="width:100%;" placeholder="请选择" v-model="titleStyle.topFontSize" >
                      <el-option-group
                          v-for="group in sytleFontSize"
                          :key="group.label"
                          :label="group.label">
                          <el-option
                              v-for="item in group.options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                          </el-option>
                      </el-option-group>
                  </el-select>
              </el-form-item>
              <el-form-item  label="字体" style="width:60%;float:left;">
                  <el-select style="width:100%;" placeholder="请选择" v-model="titleStyle.topFontFamily" >
                      <el-option-group
                          v-for="group in styleFontFamily"
                          :key="group.label"
                          :label="group.label">
                          <el-option
                              v-for="item in group.options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                          </el-option>
                      </el-option-group>
                  </el-select>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="setTitleQuietClick">取 消</el-button>
            <el-button type="primary" @click="setTitleSubClick" >确 定</el-button>
          </span>
        </el-dialog>

        <!-- 上传图片部分的对话框 -->
        <div class="uploadImgDialog">
          <div class='uploadImgContent'>
            <div style="width: 100%;height: 40px;line-height: 40px;padding-left: 20px;font-size: 16px;">图片上传</div>
            <el-form label-width=".7rem">
              <el-form-item label="点击选择图片">
                <el-upload
                    v-loading="loading"
                    style="text-align:left;margin-left:20px;"
                    class="avatar-uploader newUload"
                    :action="UPLOAD_EDITOR_IMAGE"
                    :show-file-list="false"
                    :data='{pid:"185"}'
                    :on-success="handleAvatarSuccess1"
                    :before-upload="handleBefore1"
                >
                <img v-if="uploadImgContentUrl" :src="uploadImgContentUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-form>
            <div style="width:95%;position:absolute;left:0;bottom:15px;text-align:right;">
              <el-button @click="uploadExitClick">取 消</el-button>
              <el-button type="primary" @click="uploadImgClick">确 定</el-button>
            </div>
          </div>
        </div>
        <!-- 上传视频部分对话框 -->
        <div class="uploadImgDialog1">
          <div class='uploadImgContent1'>
            <div style="width: 100%;height: 40px;line-height: 40px;padding-left: 20px;font-size: 16px;">视频上传</div>
            <el-form label-width=".7rem">
              <el-form-item label="点击选择视频">
                <el-upload
                    style="text-align:left;margin-left:20px;"
                    class="avatar-uploader newUload"
                    :action="UPLOAD_EDITOR_IMAGE"
                    :show-file-list="false"
                    :data='{pid:"185"}'
                    :on-progress='uploadVideoProcess'
                    :on-success="handleAvatarSuccess2"
                    :before-upload="handleBefore"
                >
                    <img  :src="uploadVideoImg" class="avatar">
                    <i v-if="uploadVideoImg == null && isProgress == false" class="el-icon-plus avatar-uploader-icon"></i>
                    <el-progress v-if="isProgress"  type="circle" :percentage="videoUploadPercent" style="width:178px;height:178px;position:absolute;left:20px;top:0;"></el-progress>
                </el-upload>
              </el-form-item>
            </el-form>
            <div style="width:95%;position:absolute;left:0;bottom:15px;text-align:right;">
              <el-button @click="uploadVideoExitClick">取 消</el-button>
              <el-button type="primary" @click="uploadVideoClick">确 定</el-button>
            </div>
          </div>
        </div>

        <!-- 内链弹窗 -->
        <div class="uploadImgDialog2">
          <div class='uploadImgContent2'>
              <div style="width: 100%;height: 40px;line-height: 40px;padding-left: 20px;font-size: 16px;">选择内链</div>
              <el-form label-width=".7rem">
                <el-form-item  label="类型" style="width:80%;float:left;" prop="articletype">
                    <el-select style="width:100%;" placeholder="请选择" v-model="innerChainName">
                        <el-option-group
                            v-for="group in innerChainData"
                            :key="group.label"
                            :label="group.label">
                            <el-option
                                v-for="item in group.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
              </el-form>
              
              <div style="width:95%;position:absolute;left:0;bottom:15px;text-align:right;">
              <el-button @click="innerChainQuite">取 消</el-button>
              <el-button type="primary" @click="innerChainClick" >确 定</el-button>
            </div>
          </div>
        </div>

        <!-- 遮罩层 -->
        <div class='market'></div>
    </div>
</template>

<script>
import manageprive from "../../components/managePrive";
export default {
  components: {
    manageprive
  },
  data() {
    const UPLOAD_EDITOR_IMAGE = this.UPLOAD_EDITOR_IMAGE;
    return {
      setUpdialogTitle:'',
      setupdialogVisible:false,
      titleStyle:{
        topFontSize:'18px',
        topFontFamily:'微软雅黑',
      },
      // 标题集合
      biaotiStyle:{
        biaotiFontSize:'18px',
        biaotiFontFamily:'微软雅黑',
      },
      // 栏目集合
      lanmuStyle:{
        lanmuFontSize:'12px',
        lanmuFontFamily:'微软雅黑',
      },
      innerChainName:'',
      loading:false,
      previewDialogVisible: false,
      dialogVisible: false,
      previewUrl: "",
      limit: 1,
      checkBox: false,
      fileList: [],
      musicUrl: "",
      breadArr: [
        { path: "/posterList", name: "电子期刊" },
        { path: "/articleList", name: this.$route.query.name }
      ],
      journaName: this.$route.query.name,
      journaOrder: this.$route.query.order,
      journaId: this.$route.query.id,
      // 文档类型为外链的时候的url变量
      outerLineUrl: "",
      textModel: "",
      //   文本编译器
      config: {
        placeholder: "",
        language: "zh_cn",
        heightMin: 200,
        widthMin: 800,
        height: 320,
        width: "100%",
        direction: "ltr",
        toolbarButtons: [
          "html",
          "fullscreen",
          "|",
          "insertLink",
          "insertImage",
          "insertVideo",
          "alert",
          "insertTable",
          "|",
          "quote",
          "insertHR",
          "subscript",
          "superscript",
          "undo",
          "redo",
          "|",
          "bold",
          "italic",
          "underline",
          "strikeThrough",
          "|",
          "fontFamily",
          "|",
          "fontSize",
          "|",
          "color",
          "emoticons",
          "inlineStyle",
          "|",
          "paragraphFormat",
          "|",
          "paragraphStyle",
          "align",
          "formatOL",
          "formatUL",
          "outdent",
          "indent",
          "clearFormatting",
          "insertimg",
          "lineHeight",
          "|",
          "insertHTML",
          "html"
        ],
        allowedImageTypes: ["jpeg", "jpg", "png", "gif"],
        imageAllowedTypes: ["jpeg", "jpg", "png", "gif"],
        imageUploadURL: UPLOAD_EDITOR_IMAGE,
        videoUploadURL: UPLOAD_EDITOR_IMAGE,
        fontFamilySelection: true,
        fontSizeSelection: true,
        videoMaxSize: 1024 * 1024 * 300,
        events: {
          "froalaEditor.initialized": (e, editor) => {
            this.$editor = editor;
          }
          // "froalaEditor.DefineIcon": ("alert", { NAME: "info" }),
          // "froalaEditor.RegisterCommand": ("alert",
          // {
          //   title: "sfs",
          //   focus: false,
          //   undo: false,
          //   refreshAfterCallback: false,
          //   callback: function() {
          //     alert("Hello!");
          //   }
          // })
        }
      },
      model: null,
      ElectronicJournalInfo: {
        articlename: "",
        articletype: null,
        content: "",
        createtime: "",
        deleted: null,
        id: null,
        imgurl: "",
        journalid: null,
        likes: null,
        updateuser: null,
        ordernum: null,
        updatetime: null,
        topic: null,
        showheadimg: null,
        showbarrage: null
      },
      rules: {
        articlename: [
          { required: true, message: "请输入文章标题名称", trigger: "blur" }
        ],
        topic: [{ required: true, message: "请输入栏目名称", trigger: "blur" }],
        // articletype: [
        //   { required: true, message: "请选择活动区域", trigger: "change" }
        // ],
        content: [
          { required: true, message: "请输入外链地址", trigger: "blur" }
        ],
        imgurl: [{ required: true, message: "请选择封面", trigger: "change" }]
      },
      articleListData: [],
      entryOptions: [
        {
          label: "",
          options: [
            {
              value: "0",
              label: "文章"
            },
            {
              value: "1",
              label: "外部链接"
            }
          ]
        }
      ],
      sytleFontSize:[
        {
          label:"",
          options:[
            {value:'12px',label:'12px'},
            {value:'14px',label:'14px'},
            {value:'16px',label:'16px'},
            {value:'18px',label:'18px'},
            {value:'20px',label:'20px'},
            {value:'24px',label:'24px'},
            {value:'36px',label:'36px'},
          ]
        }
      ],
      styleFontFamily:[
        {
          label:"",
          options:[
             {value:'宋体',label:'宋体'},
             {value:'微软雅黑',label:'微软雅黑'},
             {value:'楷体',label:'楷体'},
             {value:'黑体',label:'黑体'},
          ]
        }
      ],
      innerChainData:[
        {
          label:"",
          options:[]
        }
      ],
      post_data: [],
      newUE:null,
      uploadImgContentUrl:null,
      uploadVideoContentUrl:null,
      uploadVideoImg:null,
      isProgress:false,
      videoUploadPercent:0
    };
  },
  methods: {
    OnUeReady(UE) {
      this.newUE = UE;
      // console.log(this.newUE);
      this.newUE.setContent(this.textModel)
    },

    // 内链确定的点击事件
    innerChainClick(){
      // var name = this.innerChainData[0].options[this.innerChainName].label;
      // // console.log('选中值',name);
      // var A = `<a href='javascript:;' class='innerChainA' sindex=${this.innerChainName}>${name}</a>`
      // this.newUE.execCommand("inserthtml",A);
      // this.innerChainName = '';
      // console.log('1234132',this.newUE.selection.getRange());
      this.newUE.selection.getRange().applyInlineStyle("a", {
          "sindex": this.innerChainName,
          "class": "innerChainA",
          "href":"javascript:;"
        })
      document.querySelector('.uploadImgDialog2').style.display = 'none';
      document.querySelector('.market').style.display = 'none';
    },
    // 内链取消的点击事件
    innerChainQuite(){
      this.innerChainName = '';
      document.querySelector('.uploadImgDialog2').style.display = 'none';
      document.querySelector('.market').style.display = 'none';
    },
    // 选取图片确定的点击事件
    uploadImgClick(){
      // console.log('1234',this.newUE);
      var url = this.uploadImgContentUrl;
      // var url = 'https://img.guoanfamily.com/rentPC/newHouseImg/newHouseIndex1.jpg'
      this.newUE.execCommand( 'insertimage', {
            src:url,
            // width:'100',
            // height:'100'
      } );
      this.uploadImgContentUrl = null;
      document.querySelector('.market').style.display = 'none';
      document.querySelector('.uploadImgDialog').style.display = 'none';
    },
    // 取消上传图片的点击事件
    uploadExitClick(){
      document.querySelector('.market').style.display = 'none';
      document.querySelector('.uploadImgDialog').style.display = 'none';
    },
    // 上传视频的点击事件
    uploadVideoClick(){
      // 插入视频标签
      var videoUrl = `<video src=${this.uploadVideoContentUrl} style='width:300px;hegiht:200px;cursor: pointer;' controls>
        <source src=${this.uploadVideoContentUrl}>
        您的浏览器不支持 video 标签。
      </video>`
      // 获取到拼接好的视频的url，调用ueditor方法
      this.newUE.execCommand("inserthtml",videoUrl);
      // 清空数据 
      this.uploadVideoContentUrl= null;
      this.uploadVideoImg = null;
      
      document.querySelector('.market').style.display = 'none';
      document.querySelector('.uploadImgDialog1').style.display = 'none';
    },
    // 取消上传视频的点击事件
    uploadVideoExitClick(){
      document.querySelector('.market').style.display = 'none';
      document.querySelector('.uploadImgDialog1').style.display = 'none';
    },
    // 富文本编译器插入图标方法-
    addButtonIcon() {
      $.FroalaEditor.DefineIcon("alert", { NAME: "info" });
      $.FroalaEditor.RegisterCommand("alert", {
        title: "插入声音",
        focus: false,
        undo: false,
        refreshAfterCallback: false,
        callback: () => {
          this.dialogVisible = true;
        }
      });

      $("div#froala-editor").froalaEditor({
        toolbarButtons: ["alert", "html"]
      });
    },
    // 语音上传成功
    singleUpLoadSuccess(res, file) {
      if (res.Code == 200) {
        this.fileList = [];
        let obj = {};
        obj.name = file.name;
        obj.url = res.Data.link;
        this.musicUrl = res.Data.link;
        this.fileList.push(obj);
      }
    },
    // 保存音频文件的点击事件
    saveMp3Click() {
      // console.log(this.$editor);
      // console.log(this.$editor.html);
      if (!this.musicUrl) {
        this.$showErrorTip("请先上传文件");
        return false;
      }
      let newHtml = `<p><div class='audio_box' style='margin-top: 10px;height: 60px;width: 100%;display:block;' ref='audioBox'><div class='audio_Dom' style='height: 100%;background-color: #eee;border-radius:5px;position: relative;'><div class='left' style='width: 60px; float: left;background: url(https://img.guoanfamily.com/Zqs6cGiwVN0MqSP5rq8LmcGcKRW9M_LqF072IVcIgE_hqJvABYyrYogfTzt1ZUV9.jpg) center no-repeat;background-size: 60%;height: 100%;'></div><div class='right' style='padding-left: 10px;'><div class='titles' style='height:100%;line-height:60px;font-size:18px;'></div><div class='timers' style='position: absolute;bottom: 6px;right: 6px;'></div></div><audio class='audio' style='display:none' src='${
        this.musicUrl
      }'><source src=src='${
        this.musicUrl
      }' type='audio/mpeg'/></audio></div></div></p>`;
      this.$editor.html.insert(newHtml);
      let audioFlag = false;
      // 音乐播放与暂停的点击事件
      $(".left").on("click", function(event) {
        event.stopPropagation();
        event.preventDefault();
        if (!audioFlag) {
          var audio = $(".audio")[0];
          audio.play();
          audioFlag = true;
          $(".left").css({
            background:
              "url(https://img.guoanfamily.com/9kUQhufca4ghQmVqUtt9cXYH6rda7tfJqCuAQFkQ31hZwSMGSwSLxCeiSl1AwhA9.jpg) no-repeat center",
            "background-size": "60%"
          });
        } else {
          var audio = $(".audio")[0];
          audio.pause();
          audioFlag = false;
          $(".left").css({
            background:
              "url(https://img.guoanfamily.com/Zqs6cGiwVN0MqSP5rq8LmcGcKRW9M_LqF072IVcIgE_hqJvABYyrYogfTzt1ZUV9.jpg)no-repeat center",
            "background-size": "60%"
          });
        }
        // alert('1234');
      });
      // 音乐的时长
      var musicTime = null;

      $(".audio")[0].addEventListener(
        "canplaythrough",
        () => {
          musicTime = Math.round($(".audio")[0].duration * 100) / 100 + "s";
          // console.log('1234',musicTime);
          $(".timers").html(musicTime);
        },
        false
      );
      $(".audio")[0].load();
      this.dialogVisible = false;
    },


    // 标题设置的点击事件
    setTitleClick(){
      // console.log('1234234',this.ElectronicJournalInfo.id);
      if(this.ElectronicJournalInfo.id == 0 || this.ElectronicJournalInfo.id == null || this.ElectronicJournalInfo.id == undefined){
        this.$showErrorTip('请先保存文章后在进行设置');
        return  false;
      }else{
        this.setupdialogVisible = true;
        this.setUpdialogTitle = '标题设置';
      }
      
    },
    // 栏目设置的点击事件
    columnClick(){
      if(this.ElectronicJournalInfo.id == 0 || this.ElectronicJournalInfo.id == null || this.ElectronicJournalInfo.id == undefined){
        this.$showErrorTip('请先保存文章后在进行设置');
        return  false;
      }else{
        this.setupdialogVisible = true;
        this.setUpdialogTitle = '栏目设置';
      }
    },
    // 设置标题字体样式和栏目字体样式弹窗确定的点击事件
    setTitleSubClick(){
      let url = '';
      let post_data = {};
      if(this.setUpdialogTitle == '标题设置'){
        url = 'TitlestyleSet';
        post_data.id= this.ElectronicJournalInfo.id;
        post_data.titlestyle = 'font-size:' + this.titleStyle.topFontSize +  ';' + 'font-family:' +  this.titleStyle.topFontFamily;
        // titlesty
        this.biaotiStyle.biaotiFontSize = this.titleStyle.topFontSize;
        this.biaotiStyle.biaotiFontFamily = this.titleStyle.topFontFamily;
      }
      if(this.setUpdialogTitle == '栏目设置'){
        url ='TopicstyleSet';
        post_data.id= this.ElectronicJournalInfo.id;
        post_data.topicstyle = 'font-size:' + this.titleStyle.topFontSize + ';' + 'font-family:' +  this.titleStyle.topFontFamily;
        this.lanmuStyle.lanmuFontSize = this.titleStyle.topFontSize;
        this.lanmuStyle.lanmuFontFamily = this.titleStyle.topFontFamily;
      }
      this.$post(url,post_data).then(res=>{
          // console.log('1234241',res);
        if(res.Code == 200){
          this.$showMsgTip('保存成功');
          this.setupdialogVisible = false;
          this.setUpdialogTitle = '';
          this.titleStyle.topFontSize = '';
          this.titleStyle.topFontFamily = '';
        }
      })
    },
    // 设置标题字体样式和栏目字体样式弹窗取消的点击事件
    setTitleQuietClick(){
      this.setupdialogVisible = false;
      this.setUpdialogTitle = '';
      this.titleStyle.topFontSize = '';
      this.titleStyle.topFontFamily = '';
    },
    
    // 数据集加载
    articleListLoad() {
      this.$get(`GetEjArticlelistWhere?cond=journalid&arg=${this.journaId}`)
        .then(res => {
          if (res.Code == 200) {
            if (res.Data.length > 0) {
              this.articleListData = res.Data;
              this.ElectronicJournalInfo.articlename = this.articleListData[0].articlename;
              this.ElectronicJournalInfo.articletype = this.articleListData[0].articletype;
              this.ElectronicJournalInfo.content = this.articleListData[0].content;
              this.ElectronicJournalInfo.createtime = this.articleListData[0].createtime;
              this.ElectronicJournalInfo.deleted = this.articleListData[0].deleted;
              this.ElectronicJournalInfo.id = this.articleListData[0].id;
              this.ElectronicJournalInfo.imgurl = this.articleListData[0].imgurl;
              this.ElectronicJournalInfo.journalid = this.articleListData[0].journalid;
              this.ElectronicJournalInfo.likes = this.articleListData[0].likes;
              this.ElectronicJournalInfo.updateuser = this.articleListData[0].updateuser;
              this.ElectronicJournalInfo.ordernum = this.articleListData[0].ordernum;
              this.ElectronicJournalInfo.updatetime = this.articleListData[0].updatetime;
              this.ElectronicJournalInfo.topic = this.articleListData[0].topic;
              this.ElectronicJournalInfo.showbarrage = this.articleListData[0].showbarrage;
              this.ElectronicJournalInfo.showheadimg = this.articleListData[0].showheadimg;
              if (this.articleListData[0].articletype == 0) {
                this.ElectronicJournalInfo.articletype = "文章";
              } else {
                this.ElectronicJournalInfo.articletype = "外部链接";
              }
              
              for(let i = 0;i< res.Data.length;i++){
                let obj = {};
                obj.value = i;
                obj.label =  res.Data[i].articlename;
                this.innerChainData[0].options.push(obj);
              }
              console.log('111111111111',this.innerChainData);
              this.articleListClick(this.articleListData[0]);
            }
          }
        })
        .then(() => {
          // 拖拽中
          this.$dragging.$on("dragged", ({ value }) => {
            this.post_data = [];
            // console.log('1234',value.list);
            for (var i = 0; i < this.articleListData.length; i++) {
              let obj = {};
              obj.id = this.articleListData[i].id;
              obj.ordernum = i;
              this.post_data.push(obj);
            }
          });
        })
        .then(() => {
          // 拖拽结束
          this.$dragging.$on("dragend", ({}) => {
            // console.log('截取数组',JSON.stringify(this.post_data));
            this.$post(
              `EjArticleSort?jid=${this.journaId}`,
              this.post_data.splice(-this.articleListData.length)
            ).then(res => {
              if (res.Code == 200) {
                this.articleListData = res.Data;
                this.ElectronicJournalInfo.articlename = this.articleListData[0].articlename;
                this.ElectronicJournalInfo.articletype = this.articleListData[0].articletype;
                this.ElectronicJournalInfo.content = this.articleListData[0].content;
                this.ElectronicJournalInfo.createtime = this.articleListData[0].createtime;
                this.ElectronicJournalInfo.deleted = this.articleListData[0].deleted;
                this.ElectronicJournalInfo.id = this.articleListData[0].id;
                this.ElectronicJournalInfo.imgurl = this.articleListData[0].imgurl;
                this.ElectronicJournalInfo.journalid = this.articleListData[0].journalid;
                this.ElectronicJournalInfo.likes = this.articleListData[0].likes;
                this.ElectronicJournalInfo.updateuser = this.articleListData[0].updateuser;
                this.ElectronicJournalInfo.ordernum = this.articleListData[0].ordernum;
                this.ElectronicJournalInfo.updatetime = this.articleListData[0].updatetime;
                this.ElectronicJournalInfo.topic = this.articleListData[0].topic;
                this.ElectronicJournalInfo.showbarrage = this.articleListData[0].showbarrage;
                this.ElectronicJournalInfo.showheadimg = this.articleListData[0].showheadimg;
                if (this.articleListData[0].articletype == 0) {
                  this.ElectronicJournalInfo.articletype = "文章";
                } else {
                  this.ElectronicJournalInfo.articletype = "外部链接";
                }
                // if (this.articleListData[0].showheadimg == 0) {
                //   this.checkBox = false;
                // } else {
                //   this.checkBox = true;
                // }
                this.articleListClick(this.articleListData[0]);
              }
            });
          });
        });
    },
    // 图片控制
    handleAvatarSuccess(res, file) {
      if (res.Code == 200) {
        this.ElectronicJournalInfo.imgurl = res.Data.link;
      }
    },
    // 判断类型
    handleBefore1(file, fileList) {
      console.log(file);
      if(file.type.indexOf('video') != -1){
        this.$showErrorTip('类型错误');
        this.loading = false;
        return false;
      }else{
         this.loading = true;
      }
      if(file.size > 5242880){
        this.$showErrorTip('图片过大，请重新上传');
        this.loading = false;
        return false;
      }else{
         this.loading = true;
      }
     
    },
    // 上传图片弹窗
    handleAvatarSuccess1(res, file) {
        this.loading = false;
        this.uploadImgContentUrl = res.link;
      // }
    },
    // 上传视频之前
    handleBefore(file, fileList) {
      if(file.type .indexOf('image') != -1){
        this.$showErrorTip('类型错误');
        return false;
      }
    },
    // 视频上传进度条可控制
    uploadVideoProcess(event, file, fileList){
        this.isProgress = true;
        this.videoUploadPercent = parseInt(file.percentage.toFixed(0));
    },
    // 上传视频弹窗
    handleAvatarSuccess2(res,file){
      // this.loading = false;
      this.isProgress = false;
      this.uploadVideoImg = res.link + "?vframe/jpg/offset/3";
      this.uploadVideoContentUrl = res.link;
    },
    // 文章类型选择
    changEntryType1(val) {
      // console.log(val);
      if (val == 0) {
        this.ElectronicJournalInfo.articletype == "文章";
      } else {
        this.ElectronicJournalInfo.articletype == "外部链接";
      }
    },
    // 文章列表的点击事件
    articleListClick(item) {
      this.$get(`GetEjArticlelistFirst?cond=id&arg=${item.id}`).then(res => {
        if (res.Code == 200) {
          this.previewUrl =
            "posterWarp/#/journal?journalid=" +
            this.journaId +
            "&isPublish=0" +
            "&listId=" +
            item.id;
          this.ElectronicJournalInfo.articlename = res.Data.articlename;
          this.ElectronicJournalInfo.topic = res.Data.topic;
          if (res.Data.articletype == 0) {
            this.ElectronicJournalInfo.articletype = "文章";
            this.textModel = res.Data.content;
            this.outerLineUrl = "";
          } else {
            this.ElectronicJournalInfo.articletype = "外部链接";
            this.outerLineUrl = res.Data.content;
            this.textModel = "";
          }
         
          this.ElectronicJournalInfo.createtime = res.Data.createtime;
          this.ElectronicJournalInfo.deleted = res.Data.deleted;
          this.ElectronicJournalInfo.id = res.Data.id;
          this.ElectronicJournalInfo.imgurl = res.Data.imgurl;
          this.ElectronicJournalInfo.journalid = res.Data.journalid;
          this.ElectronicJournalInfo.likes = res.Data.likes;
          this.ElectronicJournalInfo.updateuser = res.Data.updateuser;
          this.ElectronicJournalInfo.ordernum = res.Data.ordernum;
          this.ElectronicJournalInfo.updatetime = res.Data.updatetime;
          this.ElectronicJournalInfo.showheadimg = res.Data.showheadimg;
          this.ElectronicJournalInfo.showbarrage = res.Data.showbarrage;
          
          // 回显当前值的字体样式
          if(res.Data.titlestyle){
            let titleStyle = res.Data.titlestyle.split(':');
            this.biaotiStyle.biaotiFontSize = titleStyle[1].split(';')[0];
            if(!this.biaotiStyle.biaotiFontSize){
              this.biaotiStyle.biaotiFontSize =  '18px';
            }
            this.biaotiStyle.biaotiFontFamily = titleStyle[2];
            if(!this.biaotiStyle.biaotiFontFamily){
              this.biaotiStyle.biaotiFontFamily = '微软雅黑';
            }
          }else{
            this.biaotiStyle.biaotiFontSize =  '18px';
            this.biaotiStyle.biaotiFontFamily = '微软雅黑';
          }
          if(res.Data.topicstyle){
              let toppicStyle = res.Data.topicstyle.split(':');
              this.lanmuStyle.lanmuFontSize = toppicStyle[1].split(';')[0];
              if(!this.lanmuStyle.lanmuFontSize){
                this.lanmuStyle.lanmuFontSize = '12px';
              }
              this.lanmuStyle.lanmuFontFamily = toppicStyle[2];
              if(!this.lanmuStyle.lanmuFontFamily){
                this.lanmuStyle.lanmuFontFamily = '微软雅黑';
              }
          }else{
              this.lanmuStyle.lanmuFontSize = '12px';
              this.lanmuStyle.lanmuFontFamily = '微软雅黑';
          }
          
          
        }
      }).then(()=>{
        if(this.newUE !== null && this.newUE !== undefined){
          this.newUE.setContent(this.textModel);
        }
      });
    },
    // 新增的点击事件
    addArticleClick() {
      this.ElectronicJournalInfo.articlename = "";
      this.ElectronicJournalInfo.articletype = null;
      this.ElectronicJournalInfo.content = "";
      this.ElectronicJournalInfo.createtime = "";
      this.ElectronicJournalInfo.deleted = 0;
      this.ElectronicJournalInfo.id = 0;
      this.ElectronicJournalInfo.imgurl = "";
      this.ElectronicJournalInfo.journalid = 0;
      this.ElectronicJournalInfo.likes = 0;
      this.ElectronicJournalInfo.updateuser = 0;
      this.ElectronicJournalInfo.ordernum = 0;
      this.ElectronicJournalInfo.updatetime = 0;
      this.ElectronicJournalInfo.topic = null;
      this.ElectronicJournalInfo.showheadimg = null;
      this.ElectronicJournalInfo.showbarrage = null;
      this.outerLineUrl = "";
      this.textModel = "";
    },
    // 保存的点击事件
    saveClick() {
      if (this.ElectronicJournalInfo.articletype == "文章") {
        this.ElectronicJournalInfo.articletype = 0;
      } else if (this.ElectronicJournalInfo.articletype == "外部链接") {
        this.ElectronicJournalInfo.articletype = 1;
      }
      if (this.ElectronicJournalInfo.articletype == 1) {
        this.ElectronicJournalInfo.content = this.outerLineUrl;
      } else {
        this.ElectronicJournalInfo.content = this.newUE.getContent();
      }
     
      let post_data = {
        journalid: parseInt(this.journaId),
        articlename: this.ElectronicJournalInfo.articlename,
        imgurl: this.ElectronicJournalInfo.imgurl,
        ordernum: this.ElectronicJournalInfo.ordernum,
        content: this.ElectronicJournalInfo.content,
        articletype: parseInt(this.ElectronicJournalInfo.articletype),
        likes: this.ElectronicJournalInfo.likes,
        createtime: this.ElectronicJournalInfo.createtime,
        updatetime: this.ElectronicJournalInfo.updatetime,
        updateuser: parseInt(sessionStorage.getItem("USER_ID")),
        deleted: this.ElectronicJournalInfo.deleted,
        id: this.ElectronicJournalInfo.id,
        topic: this.ElectronicJournalInfo.topic,
        showheadimg: this.ElectronicJournalInfo.showheadimg,
        showbarrage: this.ElectronicJournalInfo.showbarrage
      };
      if (!post_data.articlename) {
        this.$showErrorTip("请输入文章标题名称");
        return false;
      }
      if (
        post_data.articletype == null &&
        post_data.articletype == undefined &&
        post_data.articletype == ""
      ) {
        this.$showErrorTip("请选择文章类型");
        return false;
      }

      if (!post_data.imgurl) {
        this.$showErrorTip("请选择图片");
        return false;
      }

      if (post_data.articletype == 1) {
        if (!post_data.content) {
          this.$showErrorTip("请输入链接地址");
          return false;
        }
      }

      this.$post(`EjArticlelistSave`, post_data).then(res => {
        if (res.Code == 200) {
          // this.ElectronicJournalInfo.articletype = null;
          if (
            this.ElectronicJournalInfo.id == 0 ||
            this.ElectronicJournalInfo.id == null
          ) {
            this.$showMsgTip("保存成功");
            this.textModel = "";
            this.articleListLoad();
          } else {
            this.$showMsgTip("修改成功");
            this.textModel = "";
            this.articleListClick(this.ElectronicJournalInfo);
          }
        }
      });
    },
    // 返回的点击事件
    beforeClick() {
      // history.go(-1);
      this.$router.push({ path: "/posterList" });
    },
    // 删除按钮的点击事件
    articleListDelete(item) {
      this.$showConfirm("是否确定删除此章节", () => {
        this.deleteFn(item);
      });
    },
    deleteFn(item) {
      this.$post(`EjArticlelistDelete`, item).then(res => {
        if (res.Code == 200) {
          this.$showMsgTip("删除成功");
          this.textModel = "";
          this.articleListLoad();
        }
      });
    }
  },
  created() {
    // this.addButtonIcon();
    this.previewUrl =
      "posterWarp/#/journal?journalid=" + this.journaId + "&isPublish=0";
  },
  mounted() {
    // console.log('12343',process.env.NODE_ENV);

    this.articleListLoad();
  }
};
</script>
<style>
a[href="https://www.froala.com/wysiwyg-editor?k=u"] {
  display: none !important;
}
</style>

<style lang='less' scoped>

// 上传图片弹窗
.uploadImgDialog{
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar-uploader-icon:hover{
    border-color: #409EFF;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  width:500px;
  height: 300px;
  position: fixed;
  left:0;
  top:0;
  right:0;
  bottom:0;
  margin:auto;
  background: #fff;
  z-index: 10;
  border-radius: 5px;
  display: none;
  .uploadImgContent{
    width:100%;
    height: 100%;
    position: relative;
    .newUload{
      // margin-top:80px;avatar-uploader-icon
      // text-align: center !important;
    }
  }
}
// 上传视频弹窗
.uploadImgDialog1{
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 20px;
  }
  .avatar-uploader-icon:hover{
    border-color: #409EFF;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  width:500px;
  height: 300px;
  position: fixed;
  left:0;
  top:0;
  right:0;
  bottom:0;
  margin:auto;
  background: #fff;
  z-index: 10;
  border-radius: 5px;
  display: none;
  .uploadImgContent1{
    width:100%;
    height: 100%;
    position: relative;
    .newUload{
      // margin-top:80px;avatar-uploader-icon
      // text-align: center !important;
    }
  }
}
.uploadImgDialog2{
  width:500px;
  height: 300px;
  position: fixed;
  left:0;
  top:0;
  right:0;
  bottom:0;
  margin:auto;
  background: #fff;
  z-index: 10;
  border-radius: 5px;
  display: none;
  .uploadImgContent2{
    width:100%;
    height: 100%;
    position: relative;
    .newUload{
      // margin-top:80px;avatar-uploader-icon
      // text-align: center !important;
    }
  }
}
.market{
  width:100%;
  height: 100%;
  background: #000;
  opacity: .3;
  position: fixed;
  left:0;
  top:0;
  z-index: 1;
  display: none;
}
.articlePage {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  position: relative;
}
.fileInfo {
  width: 100%;
  height: 0.7rem;
  // background: red;
  margin-top: 0.1rem;
  line-height: 0.25rem;
  border-bottom: 1px solid #ccc;
  .fromLine {
    width: 100%;
    height: 0.3rem;
    margin-top:.08rem;
    float: left;
    .twoSwitch{
      width:15%;
      float:left;
      height:.35rem;
      margin-top:-.1rem;
    }
  }
  .avatar {
    display: inline-block;
    height: 0.2rem;
  }
  .smallImgDiv:hover {
    .enlarge {
      display: block;
    }
  }
  .enlarge {
    width: 1rem;
    top: -0.1rem;
    right: -1.1rem;
    position: absolute;
    z-index: 2;
    display: none;
  }
}
.outerLayer {
  width: 100%;
  position: absolute;
  z-index: 1;
  bottom: 0rem;
  left: 0;
  top: 0.2rem;
  border: 1px solid #ccc;
  .leftList {
    width: 20%;
    height: 100%;
    float: left;
    border-right: 1px solid #ccc;
    text-align: center;
    overflow-y: scroll;
    .article_List {
      width: 94%;
      margin-left: 3%;
      height: 0.25rem;
      border-bottom: 1px solid #ccc;
      div:nth-child(1) {
        width: 25%;
        height: 100%;
        float: left;
      }
      div:nth-child(2) {
        width: 50%;
        height: 100%;
        float: left;
        line-height: 0.25rem;
        font-size: 0.08rem;
        color: blue;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      div:nth-child(3) {
        display: none;
        width: 15%;
        height: 100%;
        float: right;
        line-height: 0.25rem;
      }
    }
    .article_List:hover {
      cursor: pointer;
      div:nth-child(3) {
        display: block;
      }
    }
  }
  .rightText {
    width: 75%;
    height: 100%;
    float: right;
    overflow-y: scroll;
    border-left: 1px solid #ccc;
    position: relative;
    .topDiv {
      // padding-left: 0.2rem;
      width: 100%;
      height: .7rem;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
    }
    .textDiv {
      width: 100%;
      bottom: 0;
      overflow: auto;
      // height: auto;
      position: absolute;
      left: 0;
      top: 1.1rem;
      z-index: 1;
    }
  }
}
.footer {
  /* width: 100%; */
  text-align: center;
  position: fixed;
  bottom: 10px;
  left: 4rem;
}
</style>
<style lang = "less">
.twoSwitch{
  .barrage{
    margin-bottom:0 !important;
  }
  .rootHeader{
    margin-top:-.05rem !important;
  }

}
.oneInput{ 
  .el-input-group__append{
    display:none;
  }
}
.oneInput:hover{
  .el-input-group__append{
    border-left: 0;
    display: block;
    float: right;
    height: 100%;
    /* position: relative; */
    position: absolute;
    right: 0;
    top: 0;
    line-height: .2rem;
  }
}
.twoInput{ 
  .el-input-group__append{
    display:none;
  }
}
.twoInput:hover{
  .el-input-group__append{
    border-left: 0;
    display: block;
    float: right;
    height: 100%;
    /* position: relative; */
    position: absolute;
    right: 0;
    top: 0;
    line-height: .2rem;
  }
}
.bread .el-breadcrumb {
  font-size: 0.07rem;
  height: 0.1rem;
  line-height: 0.1rem;
}
.uploadImgContent{
  .el-form-item__label{
    padding-left:30px;
  }
  .uploadImgContent{
    width:50%;
  }
}
.uploadImgContent1{
  .el-form{
    .el-progress-circle{
      width:178px !important;
      height:178px !important;
    }
  }
  
}
.rightText {
  .fr-box {
    button:nth-child(7) {
      /* background:red !important; */
      /* background: url("../../../static/voic.png") no-repeat center !important; */
      background-size: 50% !important;
      i {
        display: none;
      }
    }
  }
}
.left {
  cursor: pointer;
}
.edui-wx .edui-editor-toolbarbox{
  position: fixed !important;
  overflow: hidden !important;
  z-index: 1000 !important;
  width:72% !important;
  top: 1.45rem;
}
.edui-box .edui-icon .edui-wx{
  display:none !important;
}
.view{
  padding-top:2.8rem !important;
}
</style>

