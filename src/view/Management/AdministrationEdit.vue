<template>
    <div class="AdministrationEdit">
        <!-- 行政内容管理编辑 -->
        <div class="bread">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadArr" :key="index" :to="{path:item.path}">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="content">
            <!-- 操作区 -->
            <div class="button_Box">
                <el-button type="primary" @click="AddData">添加</el-button>
                <el-button type="info" :disabled="SelectionChangeArr.length!=1" @click="EditData">编辑</el-button>
                <el-button type="danger" @click="delectCLick">删除</el-button>
                <el-button type="primary" @click="PushUp">批量导入</el-button>
                <el-button type="info" @click="bacchExportClick">批量导出</el-button>
                <!-- <el-button  @click.native="newFloderClick" icon="el-icon-circle-plus-outline">新建文件夹</el-button> -->
                <el-button type="primary" @click="newFloderClick">新建文件夹</el-button>
                <!-- 批量操作文件的时候 -->
                <el-popover
                      placement="bottom"
                      width="100"
                      trigger="click"
                  >
                  <div @click="batchMoveClick" class="moreContent">移动到</div>
                  <div @click="delectCLick" class="moreContent">删除</div>
                      <el-button v-show="SelectionChangeArr.length>1" slot="reference"  class="FolderButton" icon="el-icon-more">更多</el-button>
                </el-popover>
                <el-input
                    class="SearchInput"
                    placeholder="请输入文件名称"
                    @keyup.native.enter="searchClick"
                    v-model="lookUpInfo">
                    <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
                </el-input>
            </div>
            <!-- 文件层级面包屑 -->
            <div style="width:100%;height:40px;">
              <div class="bigCrum" :key="index" v-for="(item,index) in CrumbsArr" @click="fileCrumClick(item,index)">
                <span :class="{crumbsArrFontColor:CrumbsArr.length-1 !== index}" v-show="index >= 1">/</span>
                <span :class="{crumbsArrFontColor:CrumbsArr.length-1 !== index}">{{item.titleName}}</span>
              </div>
            </div> 
            <!-- 表格 -->
            <div class="tables">
                <template>
                    <el-table
                        :data="tableData"
                        border
                        @selection-change="SelectionChange"
                        :default-sort = "{prop: 'filename', order: 'descending'}"
                        style="width: 100%">
                        <el-table-column
                            type="selection"
                            align="center"
                            width="55">
                        </el-table-column>
                        <el-table-column
                            fixed
                            label="名称"
                            width="300"
                            sortable
                            prop="filename"
                            align="left">
                             <template slot-scope="scope">
                               <div v-show="scope.row.filetype !== '文件夹'">
                                <img style="margin-top:5px;float:left;" :src="scope.row.imgIcon" alt="">
                                <el-button style="margin-left:5px;" type="text" @click="smallBtnClick(scope.row)">{{scope.row.filename}}</el-button>
                               </div>
                                <div v-show="scope.row.filetype == '文件夹'">
                                  <img style="margin-top:5px;float:left;" src="../../../static/Folderimg/floder.png" alt="">
                                  <el-input v-show="scope.row.showInput"  class="FolderNameInput" v-model="scope.row.filename" placeholder="输入文件夹名称" clearable></el-input>
                                  <img v-show="scope.row.showInput" class="iconImg" @click="confirmClick(scope)"  src="../../../static/Folderimg/confirm.png" alt="">
                                  <img v-show="scope.row.showInput" class="iconImg"  src="../../../static/Folderimg/cancel.png" alt="">
                                  <div @click="folderClick(scope)" v-show="!scope.row.showInput" style="width:150px;height:40px;line-height:40px;margin-left:5px;float:left;text-align:left;cursor:pointer;">{{scope.row.filename}}</div>
                                </div>
                             </template>
                        </el-table-column>
                        <el-table-column
                            prop="updatetime"
                            align="center"
                            sortable
                            label="日期">
                        </el-table-column>
                        <el-table-column
                            prop="downloadcount"
                            label="下载量"
                            :sortable="true"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            label="星级"
                            width="180"
                            sortable
                            align="center">
                            <template slot-scope="scope">
                                <el-rate
                                    v-model="scope.row.rating"
                                    disabled
                                    text-color="#ff9900"
                                    score-template="{value}">
                                </el-rate>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            width="180"
                            label="更多">
                            <template slot-scope="scope">
                                <el-popover
                                    placement="bottom"
                                    width="100"
                                    trigger="click"
                                >
                                <div @click="moveClick(scope)" class="moreContent">移动到</div>
                                <div @click="renameClick(scope)" class="moreContent">重命名</div>
                                <div @click="removeFileCLick(scope)" class="moreContent">删除</div>
                                    <el-button v-show="SelectionChangeArr.length<=1" slot="reference"  class="FolderButton" icon="el-icon-more"></el-button>
                                </el-popover>
                            </template>
                        </el-table-column> 
                    </el-table>
                </template>
            </div>

            <!-- 弹窗 -->
            <el-dialog :title="titleName" v-if="dialogVisible" :visible.sync="dialogVisible" >
                <!-- 批量上传 -->
                <div v-show="titleName=='批量上传'" class="BatchUpload">
                    <el-upload
                        class="upload-demo"
                        style="text-align:center;"
                        drag
                        :data="dataObj"
                        :http-request="fileChange"
                        :action="UPLOAD_FILE"
                        :multiple="true"
                        :file-list="fileList"
                        :on-success="uploadSuccess"
                        >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </div>
                <div v-show="titleName=='添加'||this.titleName=='编辑'" class="formEdit">
                    <div style="width:500px;height:80%;margin-left:20px;;">
                        <div style="float:left;line-height:40px;margin-left:10px;">选择文件</div>
                        <!-- :data="{'pid':pid,'md5':Filemd5}" -->
                        <el-upload
                          class="upload-demo"
                          style="text-align:center;"
                          :data="dataObj"
                          :action="UPLOAD_FILE"
                          :http-request="fileChange"
                          :on-success="singleUpLoadSuccess"
                          :file-list="fileListArr">
                         <el-button class="btn-add" type="primary" icon="el-icon-plus" circle></el-button>
                        </el-upload>
                        <el-form style="margin-top:20px;" label-width="80px">
                          <el-form-item label="产品名称">
                            <el-input v-model="fromData.fileName" placeholder="文件名称"></el-input>
                          </el-form-item>
                          <el-form-item style="margin-top:20px;width:100%;" label="文件类型" >
                            <el-select v-model="fromData.fileType" placeholder="请选择" >
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
                        </el-form>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer" style="text-align:right;">
                    <el-button type="danger" @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="subClick">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 文件夹移动弹窗 -->
            <el-dialog title="选择地址" v-if="MoveDialogVisible" :visible.sync="MoveDialogVisible" >
                <el-tree 
                :data="TreeData" 
                class="fileTree"
                node-key="id"
                ref="tree"
                @node-click="AdminGetCurrentKey"
                :highlight-current='true'
                :props="defaultProps" ></el-tree>
                <div slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="MoveDialogVisible=false">取 消</el-button>
                    <el-button type="primary" @click="moveSubClick" >确 定</el-button>
                </div>
            </el-dialog>
            <!-- show-checkbox -->
        </div>

    </div>
</template>

<script>
// import folder from "../../../static/Folderimg/floder.png";
// import iconImg from "../../../static/Folderimg/iconImg.png";
// import wordImg from "../../../static/Folderimg/wordImg.png";
// import pdfImg from "../../../static/Folderimg/pdfImg.png";
// import mp3Img from "../../../static/Folderimg/mp3Img.png";
// import mp4Img from "../../../static/Folderimg/mp4Img.png";
// import exelImg from "../../../static/Folderimg/exelImg.png";
// import zipImg from "../../../static/Folderimg/zipImg.png";
// import noTypeImg from "../../../static/Folderimg/noTypeImg.png";
export default {
  data() {
    return {
      pid: 0,
      fid:0,
      CrumbsArr:[],
      custom:'custom',
      TreeData:[],
      defaultProps: {
          children: 'children',
          label: 'label'
        },
      MoveDialogVisible:false,
      MoveArr:[],
      targetId:0,
      totalNum: 0,
      menuIndex: this.$store.state.attribute.menuBtnIndex,
      breadArr: [
        { path: "/managementEdit", name: "综合行政" },
        { path: "/AdministrationEdit", name: "内容管理" }
      ],
      lookUpInfo: "",
      tableData: [],
      SelectionChangeArr: [],
      formEdit: {
        name: ""
      },
      fileList: [], //上传文件列表
      fileListArr: [],
      currentPage: 1,
      dialogVisible: false,
      titleName: "",
      fromData: {
        fileName: "",
        fileType: ""
      },
      entryOptions: [
        {
          label: "",
          options: [
            {
              value: "1",
              label: "图片"
            },
            {
              value: "2",
              label: "文档"
            },
            {
              value: "3",
              label: "音频"
            },
            {
              value: "4",
              label: "视频"
            },
          ]
        }
      ],
      postFileType: "",
      post_data: {},
      resDataType:{},
      chunks:'',
      fileReader:null,
      blobSlice:null,
      spark:new SparkMD5.ArrayBuffer(),
      files:[],
      currentChunk:0,
      uploadeFileName:'',
      dataObj:{
        pid:'',
        md5:'',
      },
      filess:[],
    };
  },
  methods: {
    // 数据加载方法
    pageLoad(pid,fid) {
      // /GetAsFilelistByPidFolder?pid=?&fid=?
      // this.$get(`GetAsFilelistWhere?cond=pid&arg=${pid}`).then(res => {
      this.$get(`GetAsFilelistByPidFolder?pid=${pid}&fid=${this.fid}`).then(res => {
        if (res.Code == 200) {
          for (let i = 0; i < res.Data.length; i++) {
            let data = new Date(res.Data[i].updatetime).Format("yyyy-MM-dd");
            res.Data[i].updatetime = data;
            if(res.Data[i].filetype == '文档'){
              res.Data[i].imgIcon =  wordImg;
            }else if(res.Data[i].filetype == '图片'){
              res.Data[i].imgIcon =  iconImg;
            }else if(res.Data[i].filetype == '音频'){
              res.Data[i].imgIcon =  mp3Img;
            }else if(res.Data[i].filetype == '视频'){
              res.Data[i].imgIcon =  mp4Img;
            }else if(res.Data[i].filetype == '文件夹'){
              res.Data[i].imgIcon = folder;
              res.Data[i].showInput = false;
            }else{
              res.Data[i].imgIcon = noTypeImg;
            }
          }
         
          this.tableData = res.Data;
          
          this.totalNum = res.Data.length;
        }
      });
    },
    // 文件面包屑的点击事件
    fileCrumClick(item,index){
      this.fid = item.fid;
      this.pageLoad(item.pid,this.fid);
      this.CrumbsArr =  this.CrumbsArr.splice(0,index+1);
    },
    //新建文件夹的点击事件
    newFloderClick(){
      let obj = {};
      obj.createtime = "";
      obj.undatetime = "";
      obj.deleted = 0;
      obj.downloadcount = 0;
      obj.fileid = 0;
      obj.folderid = 0;
      obj.filetype =  '文件夹';
      obj.filename = "";
      obj.id = 0;
      obj.pid = parseInt(this.$route.query.pid);
      obj.rating = 0;
      obj.showInput = true;
      this.tableData.unshift(obj);
    },
    // 确认创建文件夹的点击事件
    confirmClick(scope){
      let post_data = {
        id: scope.row.id,
        pid: scope.row.pid,
        filename: scope.row.filename,
        filetype: scope.row.filetype,
        fileid:scope.row.fileid,
        downloadcount: scope.row.downloadcount,
        folderid:this.fid,
        rating: scope.row.rating,
        deleted: scope.row.deleted
      }
      if(scope.row.filename){
        this.$post("AsFilelistSave", post_data).then(res => {
          if (res.Code == 200) {
            this.$showMsgTip("保存成功");
            this.pageLoad(this.pid,this.fid);
          }
        });
      }else{
        this.$showErrorTip('请输入文件夹名称');
      }
    },
    // 获取选择的树的key的方法(行政权限树)
    AdminGetCurrentKey(one,two,three) {
      // console.log(one,two,three);
      this.targetId = one.id;
    },
    // 移动确定的点击事件
    moveSubClick(){
      let ids =  this.MoveArr.join(',');
      this.$get(`AsFileMove?ids=${ids}&fid=${this.targetId}`).then(res => {
        if(res.Code == 200){
          this.$showMsgTip("设置成功");
          this.MoveDialogVisible =  false;
          this.pageLoad(this.pid,this.fid);
        }
      })
    },
    // 移动的点击事件
    moveClick(scope){
      this.MoveArr = [];
      this.MoveArr.push(scope.row.id);
      this.MoveDialogVisible = true;
      // /GetAsFTree
      this.$get(`GetAsFTree`).then(res =>{
        if(res.Code == 200){
          let Arr = [...res.Data];
          this.removeId(Arr,scope.row.id);
          this.TreeData = Arr;
        }
         
      });
    },  
    // 移除重复id的值
    removeId(arr,id){
      let flage=true;
      arr.forEach((item,index) => {
        if(item.id==id){
          arr = arr.splice(index,1);
          flage = false;
          return false;
        }
        if(item.children.length>0&&flage){
          this.removeId(item.children,id)
        }
      });
      
    },
    // 批量移动个点击事件
    batchMoveClick(){
      this.MoveArr = this.SelectionChangeArr.map(item=>{
        return item.id;
      })
      let ids = this.MoveArr.join(",")
     
      this.MoveDialogVisible = true;
      this.$get(`GetAsFTree?ids=${ids}`).then(res =>{
        if(res.Code == 200){
          this.TreeData = res.Data;
        }
      });
    },
    // 重命名的点击事件
    renameClick(scope){
      console.log('1234',scope);
      scope.row.showInput = true;
    },
    // 删除的点击事件
    removeFileCLick(scope){
      let ids = scope.row.id;
      this.$get(`AsFileBatchDelete?ids=${ids}`).then(res =>{
        if(res.Code == 200){
          this.$showMsgTip("删除成功");
          this.pageLoad(this.pid,this.fid);
        }
      })
    },
    // 文件夹的点击事件
    folderClick(scope){
      this.fid = scope.row.id;
      let href = window.location.href;
      // window.location.href = href + "&fid=" + this.fid;
      this.pid = scope.row.pid;
      let obj = {};
      obj.titleName = scope.row.filename;
      obj.pid = this.pid;
      obj.fid = this.fid;
      this.CrumbsArr.push(obj);
      this.pageLoad(this.pid,this.fid);
    },
    // 批量文件上传成功回调
    uploadSuccess(res, file) {
      if ((res.Code = 200)) {
        let TypeArr = res.Data.Filename.split(".");
        let arr = TypeArr[TypeArr.length -1];
        let nameArr = res.Data.Filename.split('.');
        nameArr.splice(nameArr.length -1,1);
        let names = nameArr.join('.');
        var filetype = "";
        if (arr == "png" || arr == "jpg" || arr == "gif") {
          filetype = "图片";
        } else if (
          arr == "pdf" ||
          arr == "xls" ||
          arr == "xlsx" ||
          arr == "txt" ||
          arr == "doc" ||
          arr == "docx"
        ) {
          filetype = "文档";
        } else if (
          arr == "MP3" ||
          arr == "mp3" ||
          arr == "wav" ||
          arr == "mid"
        ) {
          filetype = "音频";
        } else if (
          arr == "avi" ||
          arr == "mp4" ||
          arr == "MP4" ||
          arr == "ram"
        ) {
          filetype = "视频";
        }
        let filename = '';
        let post_data = {
          id: 0,
          pid: parseInt(this.pid),
          filename: names,
          filetype: filetype,
          fileid: res.Data.Id,
          downloadcount: 0,
          rating: 0,
          folderid:this.fid,
          createtime: res.Data.Createtime,
          updatetime: res.Data.Updatetime,
          deleted: 0
        };
        this.$post("AsFilelistSave", post_data).then(res => {
          if (res.Code == 200) {
            this.$showMsgTip("上传成功");
          }
        });
      }
    },
    // 上传的改变事件
    fileChange(file){
   
      this.currentChunk=0;
      this.files = file.file
      if(this.uploadeFileName == this.files.name){
        return false;
      }
      this.uploadeFileName = this.files.name;
      
      let chunkSize =2097152;
      this.chunks = Math.ceil(this.files.size / chunkSize);
      this.onFileload(file.file);
      this.loadNext();
    },
    loadNext() {
      let chunkSize =2097152;
      this.blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
      var start = this.currentChunk * chunkSize;
      var	end = ((start + chunkSize) >=  this.files.size) ? this.files.size : start + chunkSize;
      this.fileReader.readAsArrayBuffer(this.blobSlice.call(this.files, start, end));
    },
    onFileload(file){
          this.fileReader = new FileReader();
          this.fileReader.onload = (e)=> {
            this.spark.append(e.target.result); // Append array buffer
            this.currentChunk++;
            if(this.currentChunk < this.chunks) {
                this.loadNext();
            } else {
              this.dataObj.pid = this.$route.query.pid;
              this.dataObj.md5 = this.spark.end();
              this.fromSubmitFn(file);
            }
          };
          this.fileReader.onerror = function() {
            console.log('oops, something went wrong.');
          };
    },
    // fromSub
    fromSubmitFn(file){
      // console.log(file.name,this.dataObj.md5)
        let data = new FormData()
        data.append("file", file)
        data.append("pid", this.dataObj.pid)
        data.append("md5",this.dataObj.md5);
      fetch(`https://mt.guoanfamily.com/asmanage/HbfileSave`,{
        method: 'post',
        dataType: "json",
        body: data
      }).then((res)=>{
        return res.json();
      }).then(res=>{
        if(this.titleName == '添加'){
          this.singleUpLoadSuccess(res,this.files);
        }else{
          this.uploadSuccess(res,this.files);
        }
        
      })
    },
    // 单一文件上传
    singleUpLoadSuccess(res, file) {
      if ((res.Code = 200)) {
         this.resDataType = res.Data;
        let TypeArr = res.Data.Filename.split(".");
        let arr = TypeArr[TypeArr.length - 1];
        // console.log('arr',arr);
        var filetype = "";
        let obj = {};
        obj.name = res.Data.Filename;
        obj.url = res.Data.url;
        this.fileListArr.push(obj);
        let nameArr = res.Data.Filename.split('.');
        nameArr.splice(nameArr.length -1,1);
        let names = nameArr.join('.');
        this.fromData.fileName = names;

        // this.fromData.fileType = arr[1];
        if (arr == "png" || arr == "jpg") {
          filetype = "图片";
          this.fromData.fileType  =  '图片';
        } else if (
          arr == "pdf" ||
          arr == "xls" ||
          arr == "doc" ||
          arr == "xlsx" ||
          arr == "txt" ||
          arr == "docx"
        ) {
          filetype = "文档";
          this.fromData.fileType  =  '文档';
        } else if (
          arr == "MP3" ||
          arr == "mp3" ||
          arr == "wav" ||
          arr == "mid"
        ) {
          filetype = "音频";
          this.fromData.fileType = '音频';
        } else if (
          arr == "avi" ||
          arr == "mp4" ||
          arr == "MP4" ||
          arr == "ram"
        ) {
          filetype = "视频";
          this.fromData.fileType = '视频';
        }
          this.post_data = {
            id: 0,
            pid: parseInt(this.pid),
            filename: this.fromData.fileName,
            filetype: this.fromData.fileType,
            fileid: res.Data.Id,
            downloadcount: 0,
            folderid:this.fid,
            rating: 0,
            createtime: res.Data.Createtime,
            updatetime: res.Data.Updatetime,
            deleted: 0,
          };
      }
    },
    // 提交的点击事件
    subClick() {
      if (this.titleName == "编辑") {
        this.post_data = {
          id: this.SelectionChangeArr[0].id,
          pid: this.SelectionChangeArr[0].pid,
          filename: this.fromData.fileName,
          filetype: this.fromData.fileType,
          fileid: this.SelectionChangeArr[0].fileid,
          downloadcount: this.SelectionChangeArr[0].downloadcount,
          rating: this.SelectionChangeArr[0].rating,
          createtime: this.SelectionChangeArr[0].createtime,
          updatetime: this.SelectionChangeArr[0].updatetime,
          deleted: this.SelectionChangeArr[0].deleted
        };
        this.dialogVisible = false;
        this.fileListArr = [];
        this.fromData.fileName = "";
        this.fromData.fileType = "";
        this.$post("AsFilelistSave", this.post_data).then(res => {
          if (res.Code == 200) {
            this.$showMsgTip("保存成功");
            this.pageLoad(this.pid,this.fid);
          }
        });
      }
      if(this.titleName == "添加"){
        this.dialogVisible = false;
        this.fileListArr = [];
        this.fromData.fileName = "";
        this.fromData.fileType = "";
        this.$post("AsFilelistSave", this.post_data).then(res => {
          if (res.Code == 200) {
            this.$showMsgTip("保存成功");
            this.pageLoad(this.pid,this.fid);
          }
        });
      }
      if(this.titleName == '批量上传'){
         this.dialogVisible = false;
         this.fileList = [];
         this.pageLoad(this.pid,this.fid);
      }
      
    },
    // 文件下载
    smallBtnClick(item) {
      window.location.href = `https://mt.guoanfamily.com/asmanage/AsFileDownload?fileid=${
        item.fileid
      }&id=${item.id}`;
    },
    // 批量导出
    bacchExportClick() {
      window.location.href = `https://mt.guoanfamily.com/asmanage/AsFileExport?pid=${
        this.pid
      }`;
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    SelectionChange(val) {
      this.SelectionChangeArr = val;
    },
    // 批量上传按钮
    PushUp() {
      this.titleName = "批量上传";
      this.dialogVisible = true;
    },

    AddData() {
      this.titleName = "添加";
      this.dialogVisible = true;
    },
    // 搜索处理
    searchClick() {
      let pid = this.$route.query.pid;
      this.$get(
        `GetAsFilelistbyName?filename=${this.lookUpInfo}&pid=${pid}`
      ).then(res => {
        if (res.Code == 200) {
          for (let i = 0; i < res.Data.length; i++) {
            let data = new Date(res.Data[i].updatetime).Format("yyyy-MM-dd");
            res.Data[i].updatetime = data;
          }
          this.tableData = res.Data;
          this.totalNum = res.Data.length;
        }
      });
    },
    // 编辑按钮
    EditData() {
      this.fileListArr = [];
      if (this.SelectionChangeArr.length > 1) {
        this.$showMsgTip = "您只能选择一条记录";
        return false;
      }
      var obj = {};
      obj.name = this.SelectionChangeArr[0].filename;
      obj.url = "";
      this.fileListArr.push(obj);
      this.fromData.fileName = obj.name;
      this.fromData.fileType = this.SelectionChangeArr[0].filetype;
      this.titleName = "编辑";
      this.dialogVisible = true;
    },
    // 删除按钮
    delectCLick() {
      // 多条记录删除方法
       if (this.SelectionChangeArr.length == 0) {
        this.$showErrorTip("请选择要删除的记录");
        return false;
      }
      let arr = this.SelectionChangeArr.map(item=>{
        return item.id;
      })
      let ids = arr.join(',');
      this.$get(`AsFileBatchDelete?ids=${ids}`).then(res =>{
        if(res.Code == 200){
          this.$showMsgTip("删除成功");
          this.pageLoad(this.pid,this.fid);
        }
      })
    },
    // 小编辑按钮
    EditLineData() {
      this.titleName = "编辑";
      this.dialogVisible = true;
    }
  },
  components: {},
  created() {
    this.pid = this.$route.query.pid;
    this.fid = this.$route.query.fid;
    this.pageLoad(this.pid,this.fid);
    let obj = {};
    obj.titleName = '全部文件',
    obj.pid = this.pid,
    obj.fid = this.fid,
    this.CrumbsArr.push(obj);
  },
  mounted() {},
  computed: {
    menuBtnIndex() {
      return this.menuIndex.id;
    },
    mdtNum(){},
  },
  watch: {
    menuBtnIndex() {
      this.pageLoad(this.menuIndex.id,this.fid);
    },
  }
};
</script>

<style scoped lang="less">
.bigCrum{
  line-height:40px;float:left;width:auto;margin-left:5px;font-size:14px;
  cursor: pointer;
}
.crumbsArrFontColor{
  color:#409eff;
}
.FolderNameInput {
    width: 150px;
    margin-left: 10px;
    float: left;
  }
.moreContent {
  width: 100%;
  height: 30px;
  font-size: 12px;
  color: #606266;
  line-height: 30px;
  text-align: center;
}
.moreContent:hover {
  color: #409eff;
}
.AdministrationEdit {
  position: relative;
  height: 100%;
  overflow: auto;
  padding-top: 30px;
}
.iconImg {
    width: 20px;
    float: left;
    margin-top: 10px;
    margin-left: 10px;
  }
.bread {
  position: absolute;
  top: 0;
  left: 0;
  height: 30px;
  width: 100%;
}
.button_Box {
  padding: 10px;
  .SearchInput {
    width: 250px;
    float: right;
  }
}
.pag_ination {
  margin-top: 20px;
}
.BatchUpload {
  text-align: center;
}
.formEdit {
  //   width: 60%;
  text-align: center;
}
</style>
<style scoped>
.el-select {
  width: 100%;
}
</style>
<style lang="less">
.AdministrationEdit{
  .fileTree{
    &.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
      background-color: #b5d7fe;
    }
    .el-tree-node__label {
      padding-left:30px;
      position: relative;
      &::before{
        content:"";
        position: absolute;
        left: 0;
        top: 0;
        height: 26px;
        width: 26px;
        background: url('../../../static/Folderimg/floder.png') center 2px no-repeat;
        background-size: 80% ;
      }
    }
  }
}
</style>

