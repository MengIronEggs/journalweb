<template>
    <div class="AdministrationEdit Personalmanagement">
        <div class="content">
            <div class="button_Box">
                <el-button type="primary" @click="addBtnClick">添加</el-button>
                <el-button type="danger"  @click="deleteBtnClick">删除</el-button>
                <el-button type="info" @click="editBtnClick">编辑</el-button>
                <el-button type="warning" @click="AdminSetUp">设置权限</el-button>
                <el-input
                    class="SearchInput"
                    placeholder="请输入姓名电话"
                    @keyup.enter.native="InputSearchClick"
                    v-model="lookUpInfo">
                    <el-button slot="append" icon="el-icon-search" @click="InputSearchClick"></el-button>
                </el-input>
            </div>
        </div>
         <!-- 表格 -->
        <div class="tables">
            <template>
                <el-table
                    style="width: 100%"
                    :data="tableData"

                     @selection-change="SelectionChange"
                    border
                >
                    <el-table-column
                        type="selection"
                        align="center"
                        width="55">
                    </el-table-column>
                     <el-table-column
                        fixed
                        label="头像"
                        align="center">
                            <template slot-scope="scope">
                                <!-- <el-button type="text" @click="smallBtnClick(scope.row)">{{scope.row.filename}}</el-button> -->
                                <img style="width:0.2rem;" :src="scope.row.userheadimg" alt="">
                            </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        align="center"
                        label="姓名">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        align="center"
                        label="电话">
                    </el-table-column>
                    <el-table-column
                        prop="shortname"
                        align="center"
                        label="公司简称">
                    </el-table-column>
                    <el-table-column
                        prop="department"
                        align="center"
                        label="部门">
                    </el-table-column>
                    <el-table-column
                        prop="usertitle"
                        align="center"
                        label="职位">
                    </el-table-column>
                    <el-table-column
                        prop="password"
                        align="center"
                        label="密码">
                    </el-table-column>
                    <el-table-column
                        min-width="100"
                        prop="isadmin"
                        align="center"
                        label="是否为超级管理员">
                        <!-- <template  slot-scope="scope">
                          <el-button size="mini" type="primary">是</el-button>
                          <el-button size="mini" type="danger">否</el-button>
                        </template> -->
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <!-- 分页器 -->
        <div class="pages">
          <el-pagination
            :page-size="PageSize"
            layout="prev, pager, next"
            @current-change='PageLoad'
            :current-page.sync='page'
            :total="500">
          </el-pagination>
        </div>
        <!-- 添加和编辑的弹窗 -->
         <el-dialog :title="titleName" v-if="dialogVisible" :visible.sync="dialogVisible" >
              <el-form :model="dialogFrom">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="dialogFrom.name"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="dialogFrom.phone"></el-input>
                </el-form-item>
                <el-form-item label="公司简称" :label-width="formLabelWidth">
                    <el-input v-model="dialogFrom.companyName"></el-input>
                </el-form-item>
                <el-form-item label="部门" :label-width="formLabelWidth">
                    <el-input v-model="dialogFrom.department"></el-input>
                </el-form-item>
                <el-form-item label="职位" :label-width="formLabelWidth">
                    <el-input v-model="dialogFrom.position"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="dialogFrom.password"></el-input>
                </el-form-item>
                <el-form-item label="是否为管理员" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="dialogFrom.checked">
                        <el-checkbox label="是/否"  @change="onChange" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer" style="text-align:right;">
                <el-button @click="dialogCancalClick">取 消</el-button>
                <el-button type="primary" @click="dialogSubClick">确 定</el-button>
            </div>
         </el-dialog>
         <!-- 权限设置 -->
         <el-dialog title="权限设置" class="dialog_box" width="30%" :visible.sync="editJurisdiction">
           <el-row>
             <el-col :span="12">
               是否允许编辑电子刊
             </el-col>
             <el-col :span="12">
               <el-switch v-model="canEditer"  active-color="#13ce66" inactive-color="#ff4949"  active-text="是" inactive-text="否"></el-switch>
             </el-col>
           </el-row>
           <div slot="footer" class="dialog-footer">
            <el-button @click="editJurisdiction = false">取 消</el-button>
            <el-button :disabled="!editDisable" type="primary" @click="changeEditer">确 定</el-button>
          </div>
          <div class="fullmask" v-if="!editDisable" v-loading="true"></div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 开始编辑权限
      editJurisdiction:false,
      // 编辑权限列表
      EditData:{},
      // 是否可编辑电子刊
      canEditer:false,
      editDisable:false,
      lookUpInfo: "",
      tableData: [],
      PageSize:10,
      page:1,
      selectArr: [],
      // 弹窗名称
      titleName: "",
      dialogVisible: false,
      formLabelWidth: "100px",
      dialogFrom: {
        name: "",
        phone: "",
        companyName: "",
        department: "",
        position: "",
        password: "",
        checked: false
      },
      isadmin: 0
    };
  },
  methods: {
    //   页面数据加载的方法
    PageLoad() {
      this.$get("GetYunUserSearch?page=" + this.page + "&size=" + this.PageSize).then(res => {
        if (res.Code == 200) {
          res.Data = res.Data.map(item => {
            if (item.isadmin == 0) {
              item.isadmin = "否";
            } else {
              item.isadmin = "是";
            }
            return item;
          });
          this.tableData = res.Data;
        }
      });
    },
    //   选择行的change事件
    SelectionChange(val) {
      this.selectArr = val;
    },
    //   行内设置按钮的点击事件
    handleClick(item) {
      console.log(item);
      this.$router.push({ path: "/adminSetup", query: { userid: item.id } });


    },
    // 添加按钮的点击事件
    addBtnClick() {
      this.dialogVisible = true;
      this.titleName = "添加";
      this.dialogFrom.name = "";
      this.dialogFrom.password = "";
      this.dialogFrom.phone = "";
      this.dialogFrom.companyName = "";
      this.dialogFrom.department = "";
      this.dialogFrom.position = "";
    },
    // 删除的点击事件
    deleteBtnClick() {
      if (this.selectArr.length > 1) {
        this.$showErrorTip("您只能选择一条记录删除");
        return false;
      }
      if (this.selectArr.length == 0) {
        this.$showErrorTip("请您选择需要删除的记录");
        return false;
      }
      let post_data = {
        company: this.selectArr[0].company,
        deleted: this.selectArr[0].deleted,
        department: this.selectArr[0].department,
        id: this.selectArr[0].id,
        name: this.selectArr[0].name,
        password: this.selectArr[0].password,
        phone: this.selectArr[0].phone,
        shortname: this.selectArr[0].shortname,
        userheadimg: this.selectArr[0].userheadimg,
        usertitle: this.selectArr[0].usertitle,
        yun_openid: this.selectArr[0].yun_openid
      };
      this.$post("YunUserDelete", post_data).then(res => {
        if (res.Code == 200) {
          this.PageLoad();
        }
      });
    },
    // 编辑的点击事件
    editBtnClick() {
      this.titleName = "编辑";
      if (this.selectArr.length > 1) {
        this.$showErrorTip("您只能选择一条记录编辑");
        return false;
      }
      if (this.selectArr.length == 0) {
        this.$showErrorTip("请您选择需要编辑的记录");
        return false;
      }
      // console.log('======',this.selectArr);
      // 判断用户是否为管理员
      if (this.selectArr[0].isadmin == '是') {
        this.dialogFrom.checked = true;
      } else {
        this.dialogFrom.checked = false;
      }
      this.dialogFrom.name = this.selectArr[0].name;
      this.dialogFrom.phone = this.selectArr[0].phone;
      this.dialogFrom.companyName = this.selectArr[0].shortname;
      this.dialogFrom.department = this.selectArr[0].department;
      this.dialogFrom.position = this.selectArr[0].usertitle;
      this.dialogFrom.password = this.selectArr[0].password;
      this.dialogVisible = true;
    },
    // 权限设置的点击事件
    AdminSetUp() {
      this.canEditer = false;
      if (this.selectArr.length > 1) {
        this.$showErrorTip("您只能选择一条记录设置权限");
        return false;
      }
      if (this.selectArr.length == 0) {
        this.$showErrorTip("请您选择需要设置权限的记录");
        return false;
      }
      this.editDisable = false;
      this.editJurisdiction = true;
      this.GetEjRightFirst(this.selectArr[0].id)
    },
    // 搜索的点击事件
    InputSearchClick() {
      this.$get(`GetYunUserSearch?value=${this.lookUpInfo}`).then(res => {
        if (res.Code == 200) {
          res.Data = res.Data.map(item => {
            if (item.isadmin == "0") {
              item.isadmin = "否";
            } else {
              item.isadmin = "是";
            }
            return item;
          });
          this.tableData = res.Data;
        }
      });
    },
    // 查询权限
    GetEjRightFirst(uid){
      this.$get(`GetEjRightFirst?cond=uid&arg=${uid}`).then(res=>{

        if(res.Code==200){
          this.EditData = res.Data;
          if(uid==this.EditData.uid&&this.EditData){
            this.canEditer = true;
          }else{
            this.EditData.uid = uid;
            this.canEditer = false;
          }

          this.editDisable = true;
        }
      });
    },
    // 保存权限结果
    changeEditer(){
      let postData = {
          id : this.EditData.id,
          uid: this.EditData.uid
        }
      if(this.canEditer){
         this.$post(`EjRightSave`,postData).then(res=>{
           if(res.Code==200){
              this.editJurisdiction = false
           }
         })
      }else{
        // 存在的数据
        if(postData.id){
          let DaletData = {
            id:postData.id
          }
          this.$post(`EjRightDelete`,DaletData).then(res=>{
           console.log(12,res)
           if(res.Code==200){
              this.editJurisdiction = false
           }
         })
          console.log(2,postData);
        }
      }



    },
    // 弹窗取消的点击事件
    dialogCancalClick() {
      this.dialogVisible = false;
      this.dialogFrom.name = "";
      this.dialogFrom.phone = "";
      // this.dialogFrom.department = '';
      // this.dialogFrom.position = '';
      this.dialogFrom.password = "";
    },
    // 弹窗确定的点击事件
    dialogSubClick() {
      let post_data = {};
      if (this.titleName == "添加") {
        post_data.company = "";
        post_data.deleted = 0;
        post_data.department = this.dialogFrom.department;
        post_data.id = "";
        post_data.name = this.dialogFrom.name;
        post_data.password = this.dialogFrom.password;
        post_data.phone = this.dialogFrom.phone;
        post_data.isadmin = this.isadmin;
        post_data.shortname = this.dialogFrom.companyName;
        post_data.userheadimg = "";
        post_data.usertitle = this.dialogFrom.position;
        post_data.yun_openid = "";
      } else {
        post_data.company = this.selectArr[0].company;
        post_data.deleted = this.selectArr[0].deleted;
        post_data.department = this.dialogFrom.department;
        post_data.id = this.selectArr[0].id;
        post_data.name = this.dialogFrom.name;
        post_data.password = this.dialogFrom.password;
        post_data.phone = this.dialogFrom.phone;
        post_data.isadmin = this.isadmin;
        post_data.shortname = this.dialogFrom.companyName;
        post_data.userheadimg = this.selectArr[0].userheadimg;
        post_data.usertitle = this.dialogFrom.position;
        post_data.yun_openid = this.selectArr[0].yun_openid;
      }
      this.addEditPublicFn(post_data);
    },
    // 新增和编辑的公共方法
    addEditPublicFn(obj) {
      this.$post("YunUserSave", obj).then(res => {
        if (res.Code == 200) {
          this.$showMsgTip("成功");
          this.dialogVisible = false;
          // 刷新页面
          this.PageLoad();
        }
      });
    },
    // 复选框值改变的事件
    onChange(val) {
      if (val) {
        this.isadmin = 1;
      } else {
        this.isadmin = 0;
      }
    }
  },
  mounted() {
     this.PageLoad();
    // this.GetEjRightFirst()


  }
};
</script>

<style lang="less" scoped>
.AdministrationEdit {
  position: relative;
  height: 100%;
  overflow: auto;
  padding-top: 30px;
}
.button_Box {
  padding: 10px;
  .SearchInput {
    width: 1.3rem;
    height: 0.2rem;
    float: right;
  }
}
</style>
<style scoped>
.el-form-item__label {
  text-align: center;
}
</style>
<style lang="less">
.Personalmanagement {
  .el-button{
    // padding: 0.06rem 0.1rem;
  }
  .dialog_box{
    .el-dialog{
      position: relative;
      .fullmask{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
  }
  .dialog-footer {
    text-align:right;
  }
  .is-center{
    .cell{
      text-align:center;
    }
  }
  .tables{
    margin-top: 0.1rem;
  }
  .el-table th>.cell{
    line-height: 0.12rem;
  }
  .el-table .cell{
    line-height: 0.12rem;
  }
  .SearchInput {
    .el-input__inner{
      height: 100%;
      line-height: 0.2rem;
      font-size:0.07rem;
    }
  }
}
</style>

