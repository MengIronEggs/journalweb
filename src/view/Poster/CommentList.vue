<template>
    <div class="commentPage">
        <!-- 面包屑 -->
        <div class="bread">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadArr" :key="index" :to="{path:item.path}">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='comment_list'>
            <div class="comment_list_Info" :key="index" v-for="(item,index) in CommentListData" >
              <el-row>
                <el-col :span="2">
                  <div class="grid-content bg-purple">
                    <img :src="item.headimgurl" style="width:60%;" alt="">
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content bg-purple-light" style="color:#5f7082;">{{item.nickname}}&nbsp;:</div>
                </el-col>
                <el-col :span="8" @click.native="readCommendClick(item,index)" >
                  <div class="grid-content bg-purple" v-if="item.comment.indexOf('gif')==-1"  :class="{'commentColor':commentFont == index || item.isread == 1}">{{item.comment}}</div>
                  <img v-else class="gifimg" :class="{'gifimgColor':commentFont == index || item.isread == 1}" :src="`https://img.guoanfamily.com/journal/${item.comment}?imageView2/2/w/160`" alt="">
                </el-col>
                <el-col :span="3">
                  <div class="grid-content bg-purple">
                    <div style="float:left;margin-top:.01rem;">前台展示</div>
                    <el-switch
                    style="float:right;"
                    v-model="item.isshow"
                    active-color="#13ce66"
                    :active-value='1'
                    :inactive-value='0'
                    @change='isShowchange(item)'
                    inactive-color="#cccccc">
                  </el-switch>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple" style="text-align:center;">{{item.articlename}}</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <el-button style="float:right;" type="danger" plain size="mini" @click.stop="deleteCommentClick(item,index)">删除</el-button>
                    <el-button style="float:right;margin-right:.1rem;" v-show="!item.btnState" type="info" plain size="mini" @click.stop="replayClick(item,index)">回复</el-button>
                    <el-button style="float:right;margin-right:.1rem;" v-show="item.btnState" type="danger" plain size="mini" @click.stop="exitClick(item,index)">取消</el-button>
                  </div>
                </el-col>
              </el-row>

              <div class="comment_list_Info" style="width:100%;border-bottom:none;" :key="index1" v-for="(items,index1) in item.newArr" >
                  <el-row>
                    <el-col :span="2">
                      <div class="grid-content bg-purple">
                        <img :src="items.headimgurl" style="width:60%;" alt="">
                      </div>
                    </el-col>
                    <el-col :span="5">
                      <div class="grid-content bg-purple-light"><span style="display:inline-block;color:#5f7082;">{{items.nickname}}&nbsp;</span>回复&nbsp;<span style="display:inline-block;color:#5f7082;">{{item.nickname}}&nbsp;:</span></div>
                    </el-col>
                    <el-col :span="13"  @click.native="readCommendClick(items,index1)">
                      <div class="grid-content bg-purple" v-if="items.comment.indexOf('gif')==-1" :class="{'commentColor':commentFont == index1 || items.isread == 1}">{{items.comment}}</div>
                      <img v-else class="gifimg" :class="{'gifimgColor':commentFont == index || item.isread == 1}" :src="`https://img.guoanfamily.com/journal/${items.comment}?imageView2/2/w/160`" alt="">

                    </el-col>
                    <el-col :span="4">
                      <div class="grid-content bg-purple">
                        <el-button style="float:right;" type="danger" plain size="mini" @click.stop="deleteCommentReplyClick(items,index)">删除</el-button>
                        <el-button v-show="!items.btnState && items.nickname !== '国安城市'" style="float:right;" type="info" plain size="mini" @click.stop="replayClick(items,index)">回复</el-button>
                        <el-button v-show="items.btnState" style="float:right;" type="danger" plain size="mini" @click.stop="exitClick(items,index)">取消</el-button>
                      </div>
                    </el-col>
                  </el-row>
              </div>
              <el-row>
                <el-col :span="24" v-show="replayFlag==index">
                  <div class="grid-content bg-purple">
                    <el-input v-model="replyContent" placeholder="请输入回复内容">
                          <el-button slot="append" size="mini" @click="saveReplayClick">发送</el-button>
                    </el-input>
                  </div>
                </el-col>
              </el-row>
              <div style="width:100%;height:5px;"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      breadArr: [
        { path: "/posterList", name: "电子期刊" },
        { path: "/commentList", name: this.$route.query.name }
      ],
      journaId: this.$route.query.id,
      CommentListData: [],
      commentFont: null,
      replayText: "回复",
      replyContent: "",
      replayFlag: null,
      contentText: {},
      orderNum: null,
      isShow: false
    };
  },
  methods: {
    // 评论是否在前端展示
    isShowchange(item) {
      this.$get(`MarkShow?commentid=${item.id}&show=${parseInt(item.isshow)}`).then(res => {
        if (res.Code == 200) {}
      });
    },
    // 评论列表加载
    commentsListLoad() {
      this.$get(`GetEjArticlecommentbyJid?jid=${this.journaId}`).then(res => {
        if (res.Code == 200) {
          if (res.Data.length > 0) {
            let cids = "";
            res.Data.forEach(item => {
              cids += item.id + ",";
              item.newArr = [];
            });
            // this.CommentListData = res.Data;
            let CommentListData = res.Data;
            cids = cids.substring(0, cids.length - 1);
            // console.log(cids);
            let relayListArr = [];
            // 所有回复信息
            this.$get(`GetEjCommentreplayByCids?cids=${cids}`).then(resp => {
              if (resp.Code == 200) {
                resp.Data.forEach(its => {
                  CommentListData.forEach(items => {
                    if (its.commentid == items.id) {
                      items.newArr.push(its);
                    }
                  });
                });
                this.CommentListData = CommentListData;
                // console.log(this.CommentListData);
              }
            });
          }
        }
      });
    },
    // 改变当前评论的状态
    readCommendClick(item, index) {
      // console.log('1234',item,index);
      if (item.isread !== 1 && item.nickname !== "国安城市") {
        this.commentFont = index;
        this.$get(`Markread?commentid=${item.id}`).then(res => {
          if (res.Code == 200) {
          }
        });
      }
    },
    // 回复的点击事件
    replayClick(item, index) {
      this.orderNum = null;
      this.contentText = {};
      item.btnState = true;
      this.replayFlag = index;
      this.contentText = item;
      this.orderNum = index;
    },
    // 取消回复的点击事件
    exitClick(item, index) {
      item.btnState = false;
      this.replayFlag = null;
    },
    // 回复发送的点击事件
    saveReplayClick() {
      if (!this.replyContent) {
        this.$showErrorTip("请输入回复内容");
        return false;
      }
      let commentid;
      if (this.contentText.articlename) {
        commentid = this.contentText.id;
      } else {
        commentid = this.contentText.commentid;
      }
      let post_data = {
        comment: this.replyContent,
        commentid: commentid,
        headimgurl: "https://img.guoanfamily.com/citic.png",
        openid: sessionStorage.getItem("USER_ID"),
        ordernum: this.orderNum,
        nickname: "国安城市"
      };

      // EjCommentreplySave
      this.$post(`EjCommentreplySave`, post_data).then(res => {
        if (res.Code == 200) {
          this.$showMsgTip("回复成功");
          this.replayFlag = null;
          this.commentsListLoad();
        }
      });
    },
    // 删除评论的点击事件
    deleteCommentClick(item,index){
      this.orderNum =  null;
      this.orderNum = index;
      let post_data={
        id: item.id,
      }
      this.$post(`EjArticlecommentDelete`,post_data).then(res => {
        if (res.Code == 200) {
          this.$showMsgTip('删除成功');
          this.commentsListLoad();
        }
      });
    },
    // 删除回复的点击事件
    deleteCommentReplyClick(item,index){
      let post_data={
          id:item.id
      }
      this.$post(`EjCommentreplyDelete`,post_data).then(res=>{
        if(res.Code == 200){
          this.$showMsgTip('删除成功');
          this.commentsListLoad();
        }
      })
    }
  },
  mounted() {
    this.commentsListLoad();
  }
};
</script>

<style lang='less' scoped>
.commentPage {
  width: 100%;
  height: 100%;
  position: relative;
  .comment_list {
    position: absolute;
    padding-right: 0.1rem;
    top: 0.2rem;
    left: 0.2rem;
    width: 90%;
    bottom: 0.2rem;
    margin: auto;
    overflow-y: scroll;
    .comment_list_Info {
      width: 100%;
      height: auto;
      margin-top: 2px;
      border-bottom: 1px solid #ccc;
      // margin-bottom: 0.2rem;
      .commentColor {
        color: red;
      }
    }
  }
  // .el-row {
  //   // margin-bottom: 0.08rem;
  //   &:last-child {
  //     // margin-bottom: 0.08rem;
  //     // border-bottom: 1px solid #ccc;
  //   }
  // }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #fff;
  }
  .bg-purple {
    background: #fff;
  }
  .gifimg{
    width: 100px;
    height: 100px;
    &.gifimgColor{
      border:1px solid red;
    }

  }
  .bg-purple-light {
    background: #fff;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 0.18rem;
    line-height: 0.1rem;
    font-size: 0.07rem;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
}
</style>
<style>
.bread .el-breadcrumb {
  font-size: 0.07rem;
  height: 0.1rem;
  line-height: 0.1rem;
}
</style>