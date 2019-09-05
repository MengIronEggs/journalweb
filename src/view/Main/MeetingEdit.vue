<style scoped>
.container {
  /* height:550px; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  overflow-x: hidden;
  overflow-y: auto;
}

.footer {
  padding: 0.05rem 0;
  width: 100%;
  text-align: center;
}

.footer .el-button {
  width: 1rem;
  height: 0.2rem;
}

.form-box {
  width: 400px;
  margin: 30px auto;
  border: 1px solid #ccc;
  padding: 20px;
}
</style>
<style>
  .MeetingEdit .el-checkbox__label{
    height: 0.09rem;
    vertical-align:top;
    line-height: 0.09rem;
    font-size:0.07rem;
  }
  .MeetingEdit  input{
    height: 0.2rem;
    line-height: 0.2rem;
    font-size:0.07rem;
  }
  .MeetingEdit .el-checkbox__inner{
    width: 0.09rem;
    height: 0.09rem;
  }
  .MeetingEdit .el-checkbox__input.is-checked+.el-checkbox__label{
    font-size:0.07rem;
  }
  .MeetingEdit .el-checkbox__inner::after{
    content:"";
    width: 0.03rem;
    height: 0.05rem;
    top:0.01rem;
    left: 0.02rem;
  }
</style>

<template>
    <div class="MeetingEdit" style="overflow-y:scroll;">
        <div style="margin: 20px;display:flex;">
            <div style="width:40%;">
                <el-input class="searchInpt" v-model="form.name" placeholder="请输入会议标题"></el-input>
            </div>
            <div style="width:40%;margin-left:10%;">
                <el-checkbox style="margin-top:10px;" v-model="checked" @change="change" >不需要登录</el-checkbox>
            </div>
        </div>

        <div class="container">
            <articleList/>
            <structure />

            <attribute @refreshLis="submit" />
        </div>

        <!--<el-form class="form-box" ref="form" :model="form" label-width="80px">
            <el-form-item label="会议名称">

            </el-form-item>
        </el-form>-->

        <footer class="footer">
            <el-button type="success" @click="previewDialogVisible = true">预览</el-button>
            <el-button type="primary" @click="submit" :disabled="!form.name">保存</el-button>
            <el-button type="info" @click="goback">返回</el-button>
        </footer>

        <!--预览提示框-->
        <preview :previewDialogVisible="previewDialogVisible" :url="previewUrl" @close="previewDialogVisible = false" />
    </div>

</template>

<script>
import structure from "../../components/Structure";
import attribute from "../../components/Attribute";
import articleList from "../../components/Article";
import preview from "../../components/Preview";

export default {
  data() {
    return {
      checked: false,
      mid: this.$route.query.mid,
      previewDialogVisible: false,

      form: {
        name: ""
      },

      previewUrl: `#/?id=${this.$route.query.mid}&uid=${this.$getSession(
        this.KEYS.USER_ID
      )}`
    };
  },

  created() {
    const entryArray = [];
    for (let i = 0; i < 12; i++) {
      entryArray.push({
        icon: "",
        label: i + 1,
        type: "article",
        articleId: "",
        href: "",
        location: "",
        city: "",
        date: "",
        fileList: [],
        scheduleFile: []
      });
    }

    this.$store.commit("initEntry", {
      entryArray
    });

    this.$store.commit("initCarouselArray", {
      carouselArray: []
    });

    const defaultEntry = entryArray;
    this.$get(`HandBookbyId?id=${this.mid}`).then(({ Code, Msg, Data }) => {
      let { Fpjson, Hbname } = Data;
      this.form.name = Hbname;
      if (Data.Nologin == 0) {
        this.checked = false;
      } else {
        this.checked = true;
      }
      if (Fpjson) {
        let { entryArray, carouselArray } = JSON.parse(Fpjson);
        this.$store.commit("initCarouselArray", {
          carouselArray
        });
        this.$store.commit("initEntry", {
          entryArray
        });
      }
    });
  },

  mounted() {},

  methods: {
    //   是否需要登录值改变的事件
    change(val) {
      let id = this.$route.query.mid;
      let nologin = "";
      if (val) {
        nologin = 1;
      } else {
        nologin = 0;
      }
      let geturl  = `HandBookNoLogin?nologin=${nologin}&id=${id}`
      this.$get(geturl).then(
        response => {
          console.log('修改了登录状态');
        },
        response => {
          this.$showMsgTip(`失败`);
        }
      );
    },
    submit() {
      if (!this.form.name) {
        this.$showErrorTip("请输入会议名称");
        return;
      }

      let { entryArray, carouselArray } = this.$store.state.attribute;

      this.$post(`SaveHandBook`, {
        Id: ~~this.mid,
        Hbname: this.form.name,
        Fpjson: JSON.stringify({ carouselArray, entryArray })
      }).then(({ Code, Msg }) => {
        if (Code === 200) {
          this.$showMsgTip(`保存成功`);
        } else {
          this.$showErrorTip(`保存失败`);
        }
      });
    },

    goback() {
      this.$showConfirm("确定已保存数据，以免数据丢失", () => {
        this.$router.back();
      });
    }
  },

  components: {
    structure,
    attribute,
    articleList,
    preview
  }
};
</script>
