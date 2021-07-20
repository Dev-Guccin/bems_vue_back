<template>
    <v-btn v-if ="this.$store.getters.getIsAuth == false" elevation="3" router :to ="{name: 'login'}" exact>Admin page</v-btn>
    <v-btn color="red lighten-3" v-else elevation="3" router :to="{name: 'home'}"  v-on:click="submit" exact>Logout</v-btn>
</template>
<script>
import { mapActions } from 'vuex'

export default{ 
    methods :{
        ...mapActions(['logout']),
        async submit() {
            try {
                let loginResult = await this.logout()
                
                if (loginResult == true) {
                    if (this.$route.path != '/') {
                        this.$router.push("/");
                    }
                }else{
                    alert('로그아웃에 실패했습니다.');
                }
                console.log(loginResult) // 로그인 성공하면 true, 아니면 false
            } catch (err) {
            console.error(err)
        
            }
        }
    }
}
</script>  
