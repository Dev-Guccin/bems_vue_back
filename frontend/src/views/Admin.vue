<template>
  <div class="about">
    <v-container>
      <v-row align="right">
        <v-card>modbus: , bacnet, database</v-card> 
        <v-btn
          elevation="2"
        >module check</v-btn>
      </v-row>
      <v-row>
        <v-btn color="blue">Modbus restart</v-btn><v-btn color="blue">Modbus stop</v-btn>
        <v-btn color="teal">Bacnet restart</v-btn><v-btn color="teal">Bacnet stop</v-btn>
        <v-btn color="grey">Database restart</v-btn><v-btn color="grey">Database stop</v-btn>
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
    excelChange(event){
      console.log(event)
    },
  }
}
</script>