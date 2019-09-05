<style>
    .login .el-form-item {
        padding: 0 36px;
    }

    .login .el-input__inner {
        text-indent: 0.1rem;
        height: 0.25rem;
        font-size: 0.08rem;
    }

    .publicInput .el-input__icon {
        left: 0;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #f18270;
        border-color: #f18270;
    }
    .login .el-checkbox{
        font-size: 0.09rem;
    }
</style>

<style scoped>
    .login {
        min-width: 1000px;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: no-repeat center;
        background-size: cover;
        overflow: auto;
        transition: background-image 1s;

    }

    .login > img {
        position: absolute;
        width: 1.53rem;
        /* height: 0.425rem; */
        font-size: 0;
        border: none;
        top: 0.5rem;
        left: 59%;
        margin-left: 0.02rem;
    }

    .login-container {
        position: absolute;
        left: 60%;
        top: 1.1rem;
        margin-bottom:1rem;
        border-radius: 0.003rem;
        box-sizing: border-box;
        background-clip: padding-box;
        width: 1.7rem;
        background: #fff;
        box-shadow: 0 0 0.12rem #100404;
    }

    .ui_icon {
        position: absolute;
        width: 0.17rem;
        height: 100%;
        left: 0;
        top: 0;
        text-align: center;
        z-index: 999;
        color: #bfcbd9;
    }

    .ui_user {
        background: url('../../public/static/Login/username.png') center no-repeat;
    }

    .ui_password {
        background: url('../../public/static/Login/password.png') center no-repeat;
    }

    .title {
        margin: 0.1rem auto ;
        text-align: center;
        color: #f18270;
        font-size: 0.14rem;
    }

    .remember {
        display: block;
        width: 100%;
        text-align: left;
        padding: 0 0 0.15rem 0.2rem;
    }

    .loginBtn {
        background: #f18270;
        color: #fff;
        height: 0.21rem;
        line-height: .01rem;
        width: 0.95rem;
        margin: 0 auto;
    }

    .messageTitle {
        width: 100%;
        height: 0.35rem;
        background: #56596a;
        color: #aab5ee;
        font-size: 0.09rem;
        text-align: center;
        line-height: 0.35rem;
    }
</style>

<template>
    <div class="login" :style="backgroundImage">
        <img src="../../public/static/Main/logo2.png">
        <el-form :model="form" :rules="rules" ref="form" label-position="left" label-width="0px"
                 class="demo-ruleForm login-container">

            <!--账号密码登录窗口-->
            <div>
                <h3 class="title">账户登录</h3>
                <el-form-item prop="username">
                    <i class="ui_icon ui_user"></i>
                    <el-input type="text" v-model="form.username" placeholder="账号或手机号：" class="publicInput"/>
                </el-form-item>

                <el-form-item prop="password">
                    <i class="ui_icon ui_password"></i>
                    <el-input type="password" v-model="form.password" placeholder="密码："/>
                </el-form-item>


                <el-checkbox v-model="remember" class="remember">记住账号</el-checkbox>
                <div style="width:100%;text-align:center;margin-bottom:.08rem;">
                    <el-button class="loginBtn" :loading="loading" @click.native.prevent="submit">登录</el-button>
                </div>
            </div>

            <div class="messageTitle">电子期刊</div>
        </el-form>
    </div>
</template>

<script>
    // import background1 from "../../static/Login/background_1.jpg";
    import background1 from '../../public/static/Login/background_1.jpg'
    import background2 from "../../public/static/Login/background_2.jpg";

    export default {
        data() {
            return {
                backgroundUrl: background1,

                loading: false,
                form: {
                    username: '',
                    password: '',
                },

                rules: {
                    username: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ],
                },

                changeBackgroundTimer: null,

                remember: true,
            };
        },

        created() {
            //初始化时，若本地记录了登录信息，则默认填充登录信息
            this.$store.state.attribute.leftMenu = false;
            let account = this.$getStorage(this.KEYS.USER_ACCOUNT);
            if (account) {
                let {username, password, remember} = account;
                this.remember = remember;
                if (remember) {
                    this.form.username = username;
                    this.form.password = password;
                }
            }

        },

        beforeDestroy() {
            //移除时需要销毁定时器、取消键盘监听
            clearInterval(this.changeBackgroundTimer);
            document.onkeyup = null;
        },

        mounted() {
            //定时更新背景
            this.changeBackgroundTimer = setInterval(() => {
                if (this.backgroundUrl === background1) {
                    this.backgroundUrl = background2;
                } else {
                    this.backgroundUrl = background1;
                }
            }, 5000);

            //监听回车，点击登录
            document.onkeyup = e => {
                e = e || event;
                let currKey = e.keyCode || e.which || e.charCode;
                if (currKey === 13) {
                    this.submit();
                }
            };
        },

        methods: {
            submit() {
                // console.log(this.$root.isLogin, 89777)
                this.$refs.form.validate((valid) => {
                        this.$post(`login`, {
                            name: this.form.username,
                            password: this.form.password
                        }).then(res => {
                            if(res.Code === 200 && res.Data){
                                // 超管
                                this.$setSession(this.KEYS.USER_ID, res.Data.Id);
                                if(res.Data.isadmin==1){
                                    this.makeData(res);
                                    return false;
                                }
                               let uid = res.Data.Id

                                this.$get(`GetEjRightFirst?cond=uid&arg=${uid}`).then(Response=>{
                                    if(Response.Code==200){
                                       if(Response.Data.id!=0){
                                           this.makeData(res)
                                       }else{
                                            this.$showErrorTip("您暂无登录权限!");
                                       }
                                    }
                                })
                            }else{
                                this.$showErrorTip("账号密码错误!");
                            }
                        });
                })
            },
            makeData(res){
                this.$store.state.attribute.isShowExit = true;

                this.$setSession(this.KEYS.USER_INFO, res.Data);

                if (this.remember) {
                    this.$setStorage(this.KEYS.USER_ACCOUNT, {
                        remember: this.remember,
                        username: this.form.username,
                        password: this.form.password,
                    });
                } else {
                    this.$setStorage(this.KEYS.USER_ACCOUNT, {
                        remember: this.remember,
                    });
                }
                this.$store.state.attribute.objectType = '';
                this.$store.state.attribute.leftMenu = true;
                this.$router.push("/posterList");
            }
        },

        computed: {
            backgroundImage() {
                return {backgroundImage: `url(${this.backgroundUrl})`}
            },
        },
    }

</script>
