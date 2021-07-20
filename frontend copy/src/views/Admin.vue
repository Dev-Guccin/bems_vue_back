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
        <v-flex><Modbus></Modbus></v-flex>
        <v-flex><Bacnet></Bacnet></v-flex>
        <v-flex><Database></Database></v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Modbus from '../components/Modbus.vue'
import Bacnet from '../components/Bacnet.vue'
import Database from '../components/Database.vue'

export default {
  data() {
    return {
      excelData: [],
      chosenFile: null
    };
  },
  components: {
      Modbus,
      Bacnet,
      Database
  },
  methods: {
    excelChange(event){
      console.log(event)
    },
    excelUpload() {
      if(!this.chosenFile){
        console.log("데이터 없음")
        alert("아무것도 없습니다.ddd")
        return
      }
      else{
        console.log("데이터 존재함")
        console.log(this.chosenFile.name);
      }
      const frm = new FormData() 
      frm.append('file', this.chosenFile) 
      console.log(frm.getAll("file"))
      this.$axios.post('/setting/excel', frm,{ 
        headers: { 
          //'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => { // 응답 처리 
        console.log(response)
      }) .catch((error) => { // 예외 처리 
        console.log(error)
      })
    }
  }
}
</script>