<template>
  <div>
    <b-container 
      class="px-0 mx-auto">
      <b-row>
        <b-col cols=8>
        <b-card>
          <div class="text-center">
            <b-spinner v-if="modbus_working == 1" variant="success" small></b-spinner>
            <b-icon v-if="modbus_working==0" icon="exclamation-circle"></b-icon>
            <b-icon v-if="modbus_working==2" color='red' icon="exclamation-circle"></b-icon>
            <span>MODBUS</span>&nbsp;
            <b-spinner v-if="bacnet_working == 1" variant="success" small></b-spinner>
            <b-icon v-if="bacnet_working==0" icon="exclamation-circle"></b-icon>
            <b-icon v-if="bacnet_working==2" color='red' icon="exclamation-circle"></b-icon>
            <span>BACNET</span>&nbsp;
            <b-spinner v-if="database_working == 1" variant="success" small></b-spinner>
            <b-icon v-if="database_working==0" icon="exclamation-circle"></b-icon>
            <b-icon v-if="database_working==2" color='red' icon="exclamation-circle"></b-icon>
            <span>DATABASE</span>&nbsp;
            <b-spinner v-if="batch_working==1" variant="success" small></b-spinner>
            <b-icon v-if="batch_working==0" icon="exclamation-circle"></b-icon>
            <b-icon v-if="batch_working==2" color='red' icon="exclamation-circle"></b-icon>
            <span>BATCH</span>&nbsp;
          </div>
        </b-card>
        </b-col>
        <b-col>
        <b-button size="sm" variant="outline-secondary" v-on:click="checkFunction()"
          >MODULE CHECK</b-button>
        </b-col>
      </b-row>
      <b-row>
        <p></p>
      </b-row>
      <b-row>
        <b-col>
          <b-form-select
            plain="true"
            v-model="selected" :options="options"
            ></b-form-select>
        </b-col>
        <b-col>
          <b-button size="sm" variant="outline-secondary"
              v-on:click="restartFunction()">RESTART</b-button>
          &nbsp;
          <b-button size="sm" variant="outline-secondary"
              v-on:click="stopFunction()">STOP</b-button>
        </b-col>
      </b-row>
      <b-row>
        <p></p>
      </b-row>
      <b-row>
        <b-col>
         <b-form-group v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            v-model="console_selected"
            :options="console_options"
            :aria-describedby="ariaDescribedby"
            name="plain-inline"
            plain
            ></b-form-radio-group>
          </b-form-group>
        </b-col>
        <b-col>
          <b-btn size="sm" variant="outline-secondary" v-on:click="log_check()">GET LOG BUTTON</b-btn>
        </b-col>
      </b-row>
      <b-row>
        <p></p>
      <b-card bg-variant="dark" text-variant="white">
        <b-card-text v-html="logFile">
        </b-card-text>
      </b-card>
      </b-row>
    </b-container>
      <div v-bind:style="up_btn_style">
        <b-button
          bottom right fixed v-on:click="scroll_up()"><b-icon icon='arrow-up-square'></b-icon></b-button><br>
        <b-button
          bottom right fixed v-on:click="scroll_down()"><b-icon icon='arrow-down-circle'></b-icon></b-button>
      </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      modbus_working:0,
      bacnet_working:0,
      database_working:0,
      batch_working:0,
      module_check: "",
      logFile: "Click check button",
      moduleSelected:"modbus",
      selected: "modbus",
      options: [
          { value: "modbus", text: 'Modbus Module' },
          { value: 'bacnet', text: 'Bacnet Module' },
          { value: 'database', text: 'Database Module' },
          { value: 'batch', text: 'Batch Module' },
        ],
      console_selected: "output",
      console_options:[
        { value: "out", text:"output"},
        { value: "err", text:"error"}
      ],
      up_btn_style:{
        position:"fixed",
        bottom:"10px",
        right:"10px",
      }
    };
  },
  components: {

  },
  methods: {
    restartFunction(){
      this.$http.get("/api/settings/restart_only/"+this.selected).then((response) =>{
          console.log(response);
          this.checkFunction();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    stopFunction(){
      this.$http.get("/api/settings/stop_only/"+this.selected).then((response) =>{
          console.log(response);
          this.checkFunction();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    checkFunction(){
      this.$http.get("/api/settings/module_check").then((response) => {
          console.log(response);
          this.module_check = response.data
          // 정제하기
          if(this.module_check.modbus == "online")
            this.modbus_working = 1;
          else if(this.module_check.modbus == "stopped")
            this.modbus_working = 2;
          else
            this.modbus_working = 0;
          if(this.module_check.bacnet == "online")
            this.bacnet_working = 1;
          else if(this.module_check.bacnet == "stopped")
            this.bacnet_working = 2;
          else
            this.bacnet_working = 0;
          if(this.module_check.database == "online")
            this.database_working = 1;
          else if(this.module_check.databse == "stopped")
            this.database_working = 2;
          else
            this.database_working = 0;
          if(this.module_check.batch == "online")
            this.batch_working = 1;
          else if(this.module_check.batch == "stopped")
            this.batch_working = 2;
          else
            this.batch_working = 0;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    log_check(){
       this.$http.get("/api/settings/module_log_check/"+this.selected+"/"+this.console_selected).then((response) => {
          console.log(response.data);
          console.log(this.logFile);
          this.logFile = response.data.replace(/\n/g, '<br />');
        })
        .catch((error) => {
          if(error){
            console.log(error);
          }
      });
    },
    scroll_up(){
      window.scrollTo(0,0)
    },
    scroll_down(){
      var container = this.$el.querySelector(".container");
      window.scrollTo(0,container.scrollHeight);
    },
    
  }
}
</script>