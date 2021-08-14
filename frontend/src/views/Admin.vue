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
      <v-row>
        <v-col>
          <v-select
        dense
        v-model="moduleSelected"
        :items="['MODBUS', 'BACNET', 'DATABASE', 'BATCH']"
        label="Please select a module to check the log."
      ></v-select>
        </v-col>
        <v-col>
        <v-radio-group row v-model="logtypeSelected">
      <v-radio
        label="out"
        value="out"
        ></v-radio>
      <v-radio
        label="err"
        value="err"
      ></v-radio>
    </v-radio-group>
        </v-col>
        <v-col>
      <v-btn small v-on:click="log_check()">log check</v-btn>
        </v-col>
      </v-row>
      <v-card elevation="1"
        v-scroll.self="onScroll"
        class="overflow-y-auto"
        max-height="500"
        dark
        card-text-font-size="1px"
        >  
        <v-card-text>
          <pre v-html="logFile" small></pre>
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
      logFile: 1,
      moduleSelected:"MODBUS",
      logtypeSelected:"out",
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
    },
    log_check(){
       console.log(this.moduleSelected,this.logtypeSelected)
       this.$http.get("/api/settings/module_log_check/"+this.moduleSelected+"/"+this.logtypeSelected).then((response) => {
          console.log(response.data);
          console.log("이거 제대로 되냐? ");
          console.log(this.logFile);
          this.logFile = response.data;
          console.log("testseet",this.logFile);
        })
        .catch((error) => {
          if(error){
            console.log(error);
          }
      });
    }
  }
}
</script>