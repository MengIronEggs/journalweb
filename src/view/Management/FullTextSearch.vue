<template>
    <div class="AdministrationEdit FullTextSearch">
        <div class="topInput">
            <el-input v-model="searchText" placeholder="请输入搜索内容" @keyup.native.enter="InputSearchClick" clearable>
                <el-button slot="append" icon="el-icon-search" @click="InputSearchClick"></el-button>
            </el-input>
        </div>
        <div style="width:85%;top: .8rem;position: absolute;height: 75%;overflow: auto;left:5%">
            <div style="width:95%;height:auto;" :key="index" v-for="(item,index) in searchResultArr" >
                <!-- <div class="searchTitle" @click="searchDownloadClick(item)">{{item.doc_title}}</div> -->
                <!-- @click="searchDownloadClick(item)" -->
                <div class="searchTitle" ><a style='display:inline-block;text-decoration:underline;' :href='item.doc_link' target="view_window">{{item.doc_title}}</a></div>
                <div class="searchContent" v-html="item.text"></div>
                <div class="searchTime">{{item.createtime}}</div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: "",
      searchResultArr: [],

    };
  },
  methods: {
    //   搜索数据
    InputSearchClick() {
      // if (this.searchText) {
        this.$get(`fullsearch?query=${this.searchText}`).then(res => {
          if (res.Code == 200) {
            this.searchResultArr = res.Data;
          }
        });
      // } else {
      //   this.$showErrorTip("请输入搜索内容");
      // }
    },
    //   点击下载
    searchDownloadClick(item) {
      window.open(item.doc_link);
    },
  },
  watch:{
    searchText(){
      // if(this.searchText){
        this.InputSearchClick();
      // }

    }
  },
  mounted() {}
};
</script>

<style lang = 'less' scoped>
.ListFolder {
  width: 80%;
  height: 40px;
  /* margin-top: 10px; */
  /* border-top: 1px solid #f2f6fd; */
  border-bottom: 1px solid #f2f6fd;
  padding-bottom: 47px;
  padding-top: 7px;
  .FolderImg {
    width: 30px;
    margin-top: 3px;
    float: left;
  }
  .FolderNameInput {
    width: 150px;
    margin-left: 10px;
    float: left;
  }
  .iconImg {
    width: 20px;
    float: left;
    margin-top: 10px;
    margin-left: 10px;
  }

  .FolderButton {
    float: right;
    margin-right: 100px;
    color: #409eff;
    position: relative;
  }
}

.moreContent {
  width: 100%;
  height: 30px;
  font-size: 14px;
  color: #000;
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
  padding-top: 20px;
}
.topInput {
  width: 50%;
  height: 0.2rem;
  position: fixed;
  left: 35%;
}
.searchTitle {
  width: 85%;
  font-size: 0.08rem;
  line-height: 0.2rem;
  font-weight: 500;
  /* color: #551a8b; */
  margin-top: 0.1rem;
  cursor:pointer;
}
.searchContent {
  width: 85%;
  line-height: 0.14rem;
  font-size: 0.07rem;
}
.searchTime {
  width: 85%;
  line-height:  0.2rem;
  font-size: 0.06rem;
  color: #2518e2;
}
</style>
<style lang="less">
.FullTextSearch{
  position: relative;
  .el-form-item__label{
    height: 0.2rem;
    font-size:0.07rem;
    line-height: 0.2rem;

  }
  .el-input__inner{
    height: 0.2rem;
    font-size:0.07rem;
    line-height: 0.2rem;
    padding-left:0.1rem;
  }
  .el-input-group__append{
    width:0.22rem;
    text-align:center;
  }
}

</style>
