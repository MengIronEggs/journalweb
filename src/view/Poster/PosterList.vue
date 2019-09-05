<template>
    <div class="container MeetingList">
        <section class="main-section">
            <!-- 电子刊列表样式 -->
            <div class="meetings-list">
                <div class="list-item" v-for="(item,index) in ElectronicJournalData1" :key="index">
                    <!-- 图片 -->
                    <div class="listImg" @click="listClick(item)">
                        <img :src="item.imgurl" alt="">
                        <div class="item-Title"><span>{{item.title}}</span></div>
                    </div>
                    <!-- 选择按钮 -->
                   <div class="buttonGroup">
                       <el-badge :value="item.read" class="item">
                            <el-button size="small" @click="commentListClick(item)">评论</el-button>
                        </el-badge>
                        <el-button style="float:right;" size="small" @click.native="exitClick(item)">设置</el-button>
                   </div>
                </div>
            </div>
            <!-- 底部按钮 -->
            <footer class="footer">
                <el-button type="success" @click="addDialogVisible = true,newTitle='新增电子期刊'">新增电子期刊</el-button>
            </footer>
        </section>

        <!-- 新增弹窗样式 -->
        <el-dialog
            :title="newTitle"
            :visible.sync="addDialogVisible"
            :before-close="handleClose"
            width="40%">
            <el-form label-width=".6rem">
                <el-form-item label="电子刊名称">
                    <el-input
                        class="add-input"
                        placeholder="请输入电子刊名称"
                        v-model="ElectronicJournalInfo.title"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="封面">
                    <el-upload
                        v-loading="loading"
                        style="text-align:left;"
                        class="avatar-uploader"
                        :action="UPLOAD_IMAGE"
                        :data='{pid:"120"}'
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="handleBefore"
                    >
                        <img v-if="ElectronicJournalInfo.imgurl" :src="ElectronicJournalInfo.imgurl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="发布" v-show="this.newTitle !=='新增电子期刊'">
                  <el-switch
                    v-model="posterState"
                    active-color="#13ce66"
                    @change='postStateChange'
                    inactive-color="#cccccc">
                  </el-switch>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="danger"  v-show="this.newTitle !=='新增电子期刊'"  @click="removeItemClick">删除</el-button>
                <el-button type="primary" v-show="this.newTitle !=='新增电子期刊'"  @click="contentExitClick">内容编辑</el-button>
                <el-button type="primary" :disabled="!ElectronicJournalInfo.title" @click="EstablishClick">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      newTitle: "",
      ElectronicJournalData: [], //电子刊列表集合
      ElectronicJournalData1: [], //整合电子刊列表集合
      readArr: [], //读取的评论
      addDialogVisible: false, //弹窗状态
      loading: false,
      posterState: false,
      //   信息集合
      ElectronicJournalInfo: {
        ordernum: null,
        imgurl: "",
        id: null,
        sharecounts: null,
        title: null,
        deleted: null,
        updatetime: null,
        createtime: null,
        ispublished: null,
        updateuser: sessionStorage.getItem("USER_ID")
      }
    };
  },
  methods: {
    //   图片上传成功回调方法
    handleAvatarSuccess(res, file) {
      if (res.Code == 200) {
        this.loading = false;
        this.ElectronicJournalInfo.imgurl = res.Data.link;
      }
    },
    handleBefore(file, fileList) {
      this.loading = true;
    },
    // 查询产品的评论数
    productCommentFn() {
      this.$get(`Unread`).then(res => {
        if (res.Code == 200) {
          this.readArr = res.Data;
          for (let i = 0; i < this.readArr.length; i++) {
            for (let j = 0; j < this.ElectronicJournalData.length; j++) {
              if (
                this.readArr[i].journalid == this.ElectronicJournalData[j].id
              ) {
                this.ElectronicJournalData[j].read = parseInt(
                  this.readArr[i].urc
                );
              }
            }
          }
          this.ElectronicJournalData1 = this.ElectronicJournalData;
        }
      });
    },
    // 列表加载方法
    pageListonLoad() {
      this.$get(`GetEjJournallistWhere`).then(res => {
        if (res.Code == 200) {
          this.ElectronicJournalData = res.Data;
          this.productCommentFn();
        }
      });
    },
    // 设置的点击事件
    exitClick(item) {
      this.newTitle = "编辑电子期刊";
      this.addDialogVisible = true;
      this.ElectronicJournalInfo.ordernum = item.ordernum;
      this.ElectronicJournalInfo.imgurl = item.imgurl;
      this.ElectronicJournalInfo.id = item.id;
      this.ElectronicJournalInfo.sharecounts = item.sharecounts;
      this.ElectronicJournalInfo.title = item.title;
      this.ElectronicJournalInfo.deleted = item.deleted;
      this.ElectronicJournalInfo.ispublished = item.ispublished;
      this.ElectronicJournalInfo.updatetime = item.updatetime;
      this.ElectronicJournalInfo.createtime = item.createtime;
      this.ElectronicJournalInfo.updateuser = item.updateuser;
      if (item.ispublished == 1) {
        this.posterState = true;
      } else {
        this.posterState = false;
      }
    },
    contentExitClick() {
      this.$router.push({
        path: "/articleList",
        query: {
          id: this.ElectronicJournalInfo.id,
          name: this.ElectronicJournalInfo.title,
          order: this.ElectronicJournalInfo.ordernum
        }
      });
    },
    // 新增保存的点击事件
    EstablishClick() {
      // EjJournallistSave
      if (!this.ElectronicJournalInfo.title) {
        this.$showErrorTip("请输入电子刊名称");
        return false;
      }
      if (!this.ElectronicJournalInfo.imgurl) {
        this.$showErrorTip("请上传电子刊图片");
        return false;
      }
      let userid = null;
      let USER_ID = sessionStorage.getItem("USER_ID");
      if (this.newTitle == "新增电子期刊") {
        userid = USER_ID;
      } else {
        userid = this.ElectronicJournalInfo.updateuser;
      }
      let post_data = {
        id: this.ElectronicJournalInfo.id,
        imgurl: this.ElectronicJournalInfo.imgurl,
        ordernum: this.ElectronicJournalInfo.ordernum,
        sharecounts: this.ElectronicJournalInfo.sharecounts,
        title: this.ElectronicJournalInfo.title,
        deleted: this.ElectronicJournalInfo.deleted,
        updatetime: this.ElectronicJournalInfo.updatetime,
        createtime: this.ElectronicJournalInfo.createtime,
        updateuser: parseInt(userid)
      };
      this.$post(`EjJournallistSave`, post_data).then(res => {
        if (res.Code == 200) {
          if (this.newTitle == "新增电子期刊") {
            this.$showMsgTip("创建成功");
          } else {
            this.$showMsgTip("编辑成功");
          }
          this.addDialogVisible = false;
          this.ElectronicJournalInfo.ordernum = null;
          this.ElectronicJournalInfo.imgurl = "";
          this.ElectronicJournalInfo.id = null;
          this.ElectronicJournalInfo.sharecounts = null;
          this.ElectronicJournalInfo.title = null;
          this.ElectronicJournalInfo.deleted = null;
          this.ElectronicJournalInfo.updatetime = null;
          this.ElectronicJournalInfo.createtime = null;
          this.ElectronicJournalInfo.updateuser = null;
          this.pageListonLoad();
        }
      });
    },
    // 删除的点击事件
    removeItemClick() {
      this.$showConfirm("确认删除？", () => {
        this.removeChildenFn();
      });
    },
    removeChildenFn() {
      let post_data = {
        id: this.ElectronicJournalInfo.id,
        imgurl: this.ElectronicJournalInfo.imgurl,
        ordernum: this.ElectronicJournalInfo.ordernum,
        sharecounts: this.ElectronicJournalInfo.sharecounts,
        title: this.ElectronicJournalInfo.title,
        deleted: this.ElectronicJournalInfo.deleted,
        updatetime: this.ElectronicJournalInfo.updatetime,
        ispublished: this.ElectronicJournalInfo.ispublished,
        createtime: this.ElectronicJournalInfo.createtime,
        updateuser: this.ElectronicJournalInfo.updateuser
      };
      this.$post(`EjJournallistDelete`, post_data).then(res => {
        if (res.Code == 200) {
          this.$showMsgTip("删除成功");
          this.addDialogVisible = false;
          this.pageListonLoad();
        }
      });
    },
    // 列表的点击事件
    listClick(item) {
      this.$router.push({
        path: "/articleList",
        query: { id: item.id, name: item.title, order: item.ordernum }
      });
    },
    // 评论的点击事件
    commentListClick(item) {
      this.$router.push({
        path: "/commentList",
        query: { id: item.id, name: item.title }
      });
    },
    postStateChange() {
      let publish;
      if (this.posterState) {
        publish = 1;
      } else {
        publish = 0;
      }
      this.$get(
        `Publish?journalid=${this.ElectronicJournalInfo.id}&publish=${publish}`
      ).then(res => {
        if (res.Code == 200) {
          this.$showMsgTip("操作成功");
        }
      });
    },
    // 关闭按钮的点击事件
    handleClose() {
      this.addDialogVisible = false;
      this.ElectronicJournalInfo.ordernum = null;
      this.ElectronicJournalInfo.imgurl = "";
      this.ElectronicJournalInfo.id = null;
      this.ElectronicJournalInfo.sharecounts = null;
      this.ElectronicJournalInfo.title = null;
      this.ElectronicJournalInfo.deleted = null;
      this.ElectronicJournalInfo.updatetime = null;
      this.ElectronicJournalInfo.createtime = null;
      this.ElectronicJournalInfo.ispublished = null;
      this.ElectronicJournalInfo.updateuser = "";
    }
  },
  mounted() {
    this.pageListonLoad();
  }
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: left;
}
.main-section {
  width: 100%;
  padding: 20px;
  overflow: auto;
  .meetings-list {
    display: flex;
    flex-direction: row;
    justify-content: left;
    flex-wrap: wrap;
    padding-top: 20px;
    margin: 0 -20px 0 -20px;
    .list-item {
      width: 1rem;
      margin: 0 20px 20px 20px;
      .listImg {
        width: 100%;
        border-radius: 5px;
        border: 1px solid #ccc;
        overflow: hidden;
        position: relative;
        img {
          width: 100%;
        }
        .item-Title {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 0.3rem;
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          span {
            display: inline-block;
            width: 100%;
            height: 100%;
            font-size: 0.12rem;
            font-weight: 600;
            line-height: 0.3rem;
            text-align: center;
          }
        }
      }
      .buttonGroup {
        width: 100%;
        height: 0.3rem;
        margin-top: 0.06rem;
        border-radius: 5px;
      }
    }
    .list-item:hover {
      cursor: pointer;
    }
  }
}

.avatar-uploader {
  text-align: center;
}
.avatar {
  display: inline-block;
  height: 0.5rem;
}
.footer {
  padding: 30px 0;
  width: 100%;
  text-align: center;
}

.footer .el-button {
  width: 1rem;
}
</style>
<style >
.MeetingList .el-input--suffix .el-input__inner {
  height: 100%;
  line-height: 1rem;
  font-size: 0.07rem;
}
.MeetingList .el-button.is-circle {
  height: 0.18rem;
  width: 0.18rem;
  padding: 0;
  margin: 0;
}
</style>
