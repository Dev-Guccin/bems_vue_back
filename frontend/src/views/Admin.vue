<template>
  <div>
    <v-container>
      <v-row align="right">
        <v-card>modbus: , bacnet, database</v-card> 
        <v-btn
        small
          elevation="2"
          v-on:click="checkFunction()"
        >module check</v-btn>
      </v-row>
      <p></p>
      <v-row>
        <v-btn small color="blue" v-on:click="restartFunction('modbus')">Modbus restart</v-btn>
        <v-btn small color="blue" v-on:click="stopFunction('modbus')">Modbus stop</v-btn>
        <v-btn small color="teal" v-on:click="restartFunction('bacnet')">Bacnet restart</v-btn>
        <v-btn small color="teal" v-on:click="stopFunction('bacnet')">Bacnet stop</v-btn>
      </v-row>
      <v-row>
         <v-btn small color="grey" v-on:click="restartFunction('database')">Database restart</v-btn>
         <v-btn small color="grey" v-on:click="stopFunction('database')">Database stop</v-btn>
        <v-btn small color="grey" v-on:click="restartFunction('batch')">Batch restart</v-btn>
        <v-btn small color="grey" v-on:click="stopFunction('batch')">Batch stop</v-btn>
      </v-row>
    </v-container>
    <v-container>
      <v-card elevation="1"> 
        <v-card-text>
          <p>Error log</p>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container>
      <v-layout row>
        
      </v-layout>
    </v-container>
  </div>
</template>

<script>

export default {
  data() {
    return {
      excelData: [],
      chosenFile: null
    };
  },
  components: {
  },
  methods: {
    restartFunction(module){
      this.$http.get("/api/settings/restart_only/"+module).then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    stopFunction(module){
      this.$http.get("/api/settings/stop_only/"+module).then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    checkFunction(){
      this.$http.get("/api/settings/module_check").then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    
  }
}
</script>