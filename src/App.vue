<template>
    <div id="app" class="App">
        <el-container>
            <el-header>
                <header class="site-header">
                      <img @click="logoClick" :class="{'showcursor':showcursor,'logo':!showcursor}" src="../public/static/Main/logo2.png">

                    <div v-show="showTopExit" class="logout" style='cursor: pointer' @click="logout">
                      <img  class="user-head" src="../public/static/default_close.png"/>
                      退出
                    </div>
                     <span v-show="showTopExit" class="logout" style='cursor: pointer;margin-right:25px' @click="changePasswd">修改密码</span>
                    <!-- <span v-show="showTopExit" class="logout">部门 - {{Infomation.shortname}}</span> -->
                    <div v-show="showTopExit" class="logout">
                      <img class="user-head" src="../public/static/default_user.png"/>
                      {{Infomation.name}}<span v-show="Infomation.shortname" style="padding:5px;">-</span>{{Infomation.shortname}}
                    </div>

                    <span class="timer">{{sysDate}}</span>
                </header>
            </el-header>
            <el-container  class="main_container">
                <el-aside class="aside" v-if="$store.state.attribute.leftMenu" width="18%">
                    <Menu></Menu>
                </el-aside>
                <el-main class="content_main" >
                  <keep-alive>
                      <router-view class="content_main_view" v-if="$route.meta.keepAlive"></router-view>
                  </keep-alive>
                  <router-view class="content_main_view" v-if="!$route.meta.keepAlive"></router-view>

                    <!-- <router-view/> -->
                </el-main>
                <el-dialog
                  title="修改密码"
                  :visible.sync="centerDialogVisible"
                  width="30%"
                  center>
                  <el-form label-position="right" label-width="80px" :model="userInfo">
                    <el-form-item label="用户名">
                      <el-input disabled v-model="userInfo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="旧密码">
                      <el-input v-model="userInfo.password"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="新密码">
                      <el-input type="password" v-model="newPasswd"></el-input>
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmChangePasswd">确 定</el-button>
                  </span>
                </el-dialog>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import Menu from "./components/Menu.vue";
export default {
  data() {
    return {
      isRady: true,
      isLogin: this.$getSession(this.KEYS.USER_INFO) !== null,
      isHideMenu: false,
      clockTimer: null,
      sysDate: "",
      userInfo: {},
      newPasswd: '', // 新密码
      centerDialogVisible: false, // 弹出框
      showcursor:false,
      week() {
        let day = new Date().getDay();
        let str = "星期";

        switch (day) {
          case 0:
            str += "日";
            break;
          case 1:
            str += "一";
            break;
          case 2:
            str += "二";
            break;
          case 3:
            str += "三";
            break;
          case 4:
            str += "四";
            break;
          case 5:
            str += "五";
            break;
          case 6:
            str += "六";
            break;
        }

        return str;
      },
    };
  },

  created() {
    // this.$router.replace("/login");
    this.sysDate = new Date().Format(`yyyy-MM-dd  ${this.week()}  hh:mm:ss`);
    this.clockTimer = setInterval(() => {
      this.sysDate = new Date().Format(`yyyy-MM-dd  ${this.week()}  hh:mm:ss`);
    }, 1000);
  },

  mounted() {

  },
  components: {
    Menu
  },
  methods: {
    logoClick(){
      if(this.$store.state.attribute.leftMenu){
        this.$store.state.attribute.leftMenu = false;
      }else{
        this.$store.state.attribute.leftMenu = true;
      }
    },
    logout() {
      this.$store.state.attribute.isShowExit = false;
      window.sessionStorage.clear();
      this.$router.push("/login");
      // window.location.href = 'https://mt.guoanfamily.com/manageMentAdmin/#/login'
    },
    changePasswd() {
      const userid = sessionStorage.getItem('USER_ID')
      if(userid) {
        this.$get(`GetYunUserFirst?cond=id&arg=${userid}`).then(res => {
          // console.log(res, 7777)
          if(res && res.Code === 200 && res.Data) {
            this.userInfo = res.Data
            this.centerDialogVisible = true
          }
        })
      }else{
        return false
      }
    },
    confirmChangePasswd() {
      if(this.newPasswd === '') {
        this.$message({
          message: '请输入密码',
          type: 'warning'
        });
        return false
      }
      this.userInfo.password = this.newPasswd
      this.newPasswd = '';
      this.$confirm('确认修改？')
      .then(_ => {
        this.$post(`YunUserSave`, this.userInfo).then(res => {
          if(res && res.Code === 200) {
            this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          });
          this.centerDialogVisible = false
          }
        })
      })
    }
  },
  watch: {
    $route: function() {
      if (this.$route.path == "/" || this.$route.path == "/login") {
        this.$store.state.attribute.leftMenu = true;
        this.showcursor = true;
      }else{
        this.showcursor = false;
      }
      if(this.$route.path == '/articleList'){
        this.$store.state.attribute.leftMenu = false;
      }else{
        this.$store.state.attribute.leftMenu = true;
      }

    }
  },
  computed:{
    showTopExit(){
      if(this.$route.path !== '/' && this.$route.path !== '/login' ){
        if(window.sessionStorage.getItem('USER_ID')){
          this.$store.state.attribute.isShowExit = true;
        }
        return  this.$store.state.attribute.isShowExit;
      }
    },
    // MenuShow(){
    //   if(this.$route.path !== "/articleList"){
    //     this.$store.state.attribute.leftMenu = false;
    //     return this.$store.state.attribute.leftMenu
    //   }else{
    //     this.$store.state.attribute.leftMenu = true;
    //     return this.$store.state.attribute.leftMenu
    //   }
    // },
    Infomation(){
      if(this.$route.path !== '/' && this.$route.path !== '/login' ){
        let userInfo = JSON.parse(window.sessionStorage.getItem("USER_INFO"));
        return userInfo;
      }else{
        let obj = {};
        obj.name = '';
        obj.company = '';
        return obj;
      }
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box !important;
}

#app .el-container {
  position: absolute;
  top: 0rem;
  left: 0;
  bottom: 0;
  width: 100%;
}
#app .el-container .main_container{
  top: .3rem;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  position: relative;
}

body,
html {
  height: 100%;
  padding: 0;
  margin: 0;
  font-family: "Times New Roman", serif;
}
.aside {
  height: 100%;
  overflow-y: auto;
}
.content_main {

  height: 100%;
  overflow-y: hidden;
}

.site-header {
  height: .3rem;
  line-height: .3rem;
  background: #3e3f41;
  text-align: left;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9;
}

.logo {
  height: .32rem;
  margin-left:.2rem;
  /* margin: .06rem  .45rem; */
  cursor: pointer;
}
.showcursor{
  height: .32rem;
  margin-left:.2rem;
}

.timer {
  color: white;
  line-height: .3rem;
  display: inline-block;
  float: right;
  margin-right: .4rem;
  font-size: 0.07rem;
}

.logout {
  color: white;
  line-height: .3rem;
  display: inline-block;
  float: right;
  margin-right: .2rem;
  font-size: 0.07rem;
}
p {
  margin: 0;
  padding: 0;
}
.user-head{
  float: left;
  width: .2rem;
  height:.2rem;
  border-radius: 50%;
  display: inline-block;
  margin: 0.05rem
}
.content_container {
  position: absolute;
  top: .3rem;
  bottom: 0;
  left: 0;
  right: 0;
}
a {
  text-decoration: none;
  -webkit-touch-callout: none;
}

/*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: rgba(245, 245, 245, 0);
  border-radius: 5px;
}

/*定义滚动条的轨道，内阴影及圆角*/
::-webkit-scrollbar-track {
  /*-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);*/
  border-radius: 5px;
  background-color: rgba(245, 245, 245, 0);
}

/*定义滑块，内阴影及圆角*/
::-webkit-scrollbar-thumb {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  /*-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);*/
  background-color: hsla(225, 4%, 58%, 0.33);
}
</style>
