<template>
  <div class="Menu">
    <nav class="navigation">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        background-color="#3e3f41"
        text-color="#fff"
        :active-text-color="activeBigColor"
        :router="true"
      >
        <el-menu-item @click.native="meettingClick" index="1">
          <i class="el-icon-menu"></i>
          <span slot="title">电子期刊</span>
        </el-menu-item>
        <el-menu-item index="2" @click.native="titleClick">
          <template slot="title">
            <i class="el-icon-edit-outline" :class="{'oSpan': activeColor}"></i>
            <span :class="{'oSpan': activeColor}">访客统计</span>
          </template>
        </el-menu-item>
        <!-- <el-menu-item index="2" @click.native="titleClick">
                   <template slot="title" >
                        <i class="el-icon-setting" :class="{'oSpan': activeColor}"></i>
                        <span :class="{'oSpan': activeColor}">行政综合</span>
                    </template>
        </el-menu-item>-->
        <!-- <el-menu-item @click.native="searchClick" index="5">
                        <i class="el-icon-search"></i>
                        <span slot="title">综合搜索</span>
        </el-menu-item>-->
        <!-- </router-link> -->
        <!-- <router-link to="/fulltextsearch"> -->
        <!-- <el-menu-item v-show='isShowSearch' @click.native="allsearchClick" index="6">
                        <i class="el-icon-search"></i>
                        <span slot="title">全文检索</span>
        </el-menu-item>-->
        <!-- <router-link to="/dailyfirst"> -->
        <!-- <el-menu-item @click.native="dailyClick" index="4">
                        <i class="el-icon-view"></i>
                        <span slot="title">日报管理</span>
        </el-menu-item>-->
        <!-- </router-link> -->
        <router-link to="/personalmanagement" v-show="showPersonEdit">
          <el-menu-item v-show="isShowAdminMenu" @click.native="pesronalAdminClick" index="3">
            <img v-show="imgFlag" src="../../public/static/personal.png" style="width:0.12rem;" alt>
            <img
              v-show="!imgFlag"
              src="../../public/static/personal1.png"
              style="width:0.12rem;"
              alt
            >
            <span slot="title">
              <span style="display:inline-block;width:8px;"></span>人员管理
            </span>
          </el-menu-item>
        </router-link>
      </el-menu>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeBigColor: "#ffd04b",
      isShowAdminMenu1: true,
      activeColor: false,
      imgFlag: true,
      userid: null,
      isShowSearch: true,
      showPersonEdit: false
    };
  },
  methods: {
    // 会议手册点击事件
    meettingClick() {
      this.activeColor = false;
      this.$router.push({ path: "/posterList" });
    },
    titleClick() {
      this.activeColor = true;
      this.$router.push({ path: "/visitorInfo" });
    },
    listClick(item) {
      this.activeColor = false;
      this.$store.state.attribute.menuBtnIndex.id = item.id;
      let USER_INFO = sessionStorage.getItem("USER_INFO");
      let isadmin = JSON.parse(USER_INFO).isadmin;
      let Menuid = item.id;
      if (isadmin === 1) {
        this.$router.push({
          path: "/AdministrationEdit",
          query: { pid: item.id, fid: 0 }
        });
      } else {
        let adminFlag = this.$store.state.attribute.adminArr.find(
          (value, index, arr) => {
            return value == Menuid;
          }
        );
        if (adminFlag) {
          this.$router.push({
            path: "/AdministrationEdit",
            query: { pid: item.id, fid: 0 }
          });
        } else {
          this.$showErrorTip("您没有操作权限");
          this.$router.replace("/managementEdit");
        }
      }
    },
    // 人员管理的点击事件
    pesronalAdminClick() {
      this.activeColor = false;
      this.$router.push({ path: "/personalmanagement" });
    },
    // 日报管理的点击事件
    dailyClick() {
      this.activeColor = false;
      this.$router.push({ path: "/dailyfirst" });
    },
    // 综合搜索的点击事件
    searchClick() {
      this.activeColor = false;
      this.$router.push({ path: "/ComprehensiveSearch" });
    },
    // 全文检索的点击事件
    allsearchClick() {
      this.activeColor = false;
      this.$router.push({ path: "/fulltextsearch" });
    },
    // 全文搜索权限控制
    fullTextAdminFn() {
      if (this.$route.path !== "/" && this.$route.path !== "/login") {
        this.$get(`GetAsUserauthWhere?cond=userid&arg=${this.userid}`).then(
          res => {
            if (res.Code == 200) {
              // 首先判断是否为管理员
              // isShowSearch
              let USER_INFO = sessionStorage.getItem("USER_INFO");
              if (USER_INFO) {
                let isadmin = JSON.parse(USER_INFO).isadmin;
                if (isadmin == 0) {
                  var adminTree = res.Data.filter(item => {
                    return item.productid == 129;
                  });
                  if (adminTree.length > 0) {
                    this.isShowSearch = true;
                  } else {
                    this.isShowSearch = false;
                  }
                }
              }
            }
          }
        );
      }
    }
  },
  created() {
    this.userid = window.sessionStorage.getItem("USER_ID");
    let USERINFO = sessionStorage.getItem("USER_INFO");
    if (USERINFO) {
      let isadmin = JSON.parse(USERINFO).isadmin;
      if (isadmin == 1) {
        this.showPersonEdit = true;
      } else {
        this.showPersonEdit = false;
      }
    }
    // this.fullTextAdminFn();
  },
  watch: {
    activeColor() {
      if (this.activeColor) {
        this.activeBigColor = "#ffffff";
      } else {
        this.activeBigColor = "#ffd04b";
      }
    },
    $route: function() {
      if (this.$route.path == "/personalmanagement") {
        this.imgFlag = false;
      } else {
        this.imgFlag = true;
      }
      // if(this.$route.path == '/posterList'){
      //   let USERINFO = sessionStorage.getItem("USER_INFO");
      //   if(USERINFO){
      //    let isadmin = JSON.parse(USERINFO).isadmin;
      //    if(isadmin==1){
      //      this.showPersonEdit = true
      //    }else{
      //       this.showPersonEdit = false
      //    }
      //   }

      // }
    }
  },
  computed: {
    menuArr() {
      // 首先判断是否为管理员
      // isShowSearch
      let USER_INFO = sessionStorage.getItem("USER_INFO");
      if (USER_INFO) {
        let isadmin = JSON.parse(USER_INFO).isadmin;
        if (isadmin == 0) {
          let arr = [];
          this.$store.state.attribute.menuArr.forEach(element => {
            this.$store.state.attribute.adminArr.forEach(item => {
              if (item == element.id) {
                arr.push(element);
              }
            });
          });
          return arr; //this.$store.state.attribute.menuArr;
        } else {
          console.log("123421342");
          return this.$store.state.attribute.menuArr;
        }
      }
    },
    isShowAdminMenu() {
      let USER_INFO = sessionStorage.getItem("USER_INFO");
      if (USER_INFO) {
        let isadmin = JSON.parse(USER_INFO).isadmin;
        if (isadmin === 0) {
          return false;
        } else {
          return true;
        }
      }
    }
  },
  components: {}
};
</script>

<style scoped>
.Menu {
  height: 100%;
}
.navigation {
  width: 100%;
  height: 100%;
  background: #3e3f41;
}
.el-menu-vertical-demo {
  border: none;
}

.el-menu-item {
  border-bottom: 1px solid #afafaf;
}

.el-menu-item:last-child {
  border: none;
}

.el-menu-item:first-child {
  border-top: 1px solid #afafaf;
}
</style>
<style lang="less">
.oSpan {
  color: #ffd04b !important;
}
.Menu {
  .el-menu-item {
    height: 0.24rem;
    line-height: 0.24rem;
  }
  .el-menu-item i {
    display: inline-block;
    margin-right: 0.02rem;
    width: 0.12rem;
    text-align: center;
    font-size: 0.08rem;
    vertical-align: middle;
  }
  span {
    display: inline-block;
  }
}
</style>

