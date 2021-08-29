<template>
  <div>
    <b-container 
      class="px-0 mx-auto">
      <b-row>
        <b-col>
        <b-card>
          modbus: , bacnet, database
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
  </div>
</template>

<script>

export default {
  data() {
    return {
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
      ]
    };
  },
  components: {

  },
  methods: {
    restartFunction(){
      this.$http.get("/api/settings/restart_only/"+this.selected).then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    stopFunction(){
      this.$http.get("/api/settings/stop_only/"+this.selected).then(function(response) {
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
    }
  }
}
</script>