<template>
  <div class="home">
    <p> > 건물 에너지 사용 현황</p>
    <b-container class="px-0 mx-auto" style="height:400px;">
      <b-row>
        <b-col cols="">
          <b-card
            height="400px"
            class="text-center"
            header="건물 기본정보"
            header-tag="header"
            center
          >
          <b-card-body>
            <b-container>
              <b-row>
                <b-col>
                  <b-img thumbnail fluid src="@/assets/building_test.jpg" alt="Vue_logo"></b-img>
                </b-col>
                <b-col>
                 <b-table-simple>
                   <b-tbody>
                     <b-tr>
                       <b-td>건축물명</b-td>
                       <b-td>GSBC(정기중소기업)</b-td>
                     </b-tr>
                     <b-tr>
                       <b-td>준공년도</b-td>
                       <b-td>2001.08</b-td>
                     </b-tr>
                     <b-tr>
                       <b-td>주소</b-td>
                       <b-td>경기도 수원시 영등포구</b-td>
                     </b-tr>
                     <b-tr>
                       <b-td>건축규모</b-td>
                       <b-td>본관동(지하3층)<br>
                        연구동(지하1층,지상4층)<br>
                        창업동(지하2층, 지상4층)<br>
                        회의동(지상 3층)</b-td>
                     </b-tr>
                     <b-tr>
                       <b-td>연면적</b-td>
                       <b-td>48,653m2(15,420명)</b-td>
                     </b-tr>
                     <b-tr>
                       <b-td>주용도</b-td>
                       <b-td>연구소(교육연구 및 복지시설)</b-td>
                     </b-tr>
                   </b-tbody>
                 </b-table-simple>
                </b-col>
              </b-row>
            </b-container>
            <!-- <line-chart :chart-data="datacollection" :height="400"></line-chart> -->
          </b-card-body>
          </b-card>
            
      <!-- <button @click="fillData()">Randomize</button> -->
        </b-col>
        <b-col cols="2">
          <b-card
            height="400px"
            style="height:400px;"
            header="사용면적당 1차 에너지 사용량 (kWh/m2년)"
            header-tag="header"
            class="text-center"

          >
          <b-card-body class="">
          </b-card-body>
          </b-card>
            
        </b-col>
        <b-col cols="2">
          <b-card
            height="400px"
            style="height:400px;"
            header="사용면적당 CO2 배출량 (kg/m2년)"
            header-tag="header"
            class="text-center"

          >
          <b-card-body>
          </b-card-body>
          </b-card>
            
        </b-col>
      </b-row>
      
      <b-row>
        <b-col cols="8">
          <b-card
            height="400px"
            style="height:400px;"
            header="월별 1차 에너지 사용량 (사용면적당)"
            header-tag="header"
            class="text-center"
          >
          <b-card-body>
            <!-- <line-chart :chart-data="datacollection" :height="400"></line-chart> -->
          </b-card-body>
          </b-card>
        </b-col>
        <b-col cols="4">
          <b-card
            height="400px"
            style="height:400px;"
            header="연간 1차 에너지 사용량 (사용면적당)"
            header-tag="header"
            class="text-center"
          >
          <b-card-body>
            <!-- <line-chart :chart-data="datacollection" :height="400"></line-chart> -->
          </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    
    
  </div>
</template>

<script>
 export default {
    data() {
      return {
        isBusy: false,
        items: [
          { first_name: '건축물명', last_name: 'MacDonald'  },
          { first_name: 'ㅇ', last_name: 'Shaw'},
          { first_name: 'Geneva', last_name: 'Wilson' },
          { first_name: 'Jami', last_name: 'Carney' }
        ]
      }
    },
 }
// import LineChart from '../components/charts/LineChart'   

// export default {
//   name: 'Home',
//   components: {
//     LineChart
//   },
//   data(){
//     return{
//       datacollection: null,
//       chartStyles: {
//         height : '400px',
//         position: 'relative'
//       }

//     }
//   },
//   mounted(){
//     this.fillData()
//   },
//   methods:{
//      fillData () {
//         this.datacollection = {
//           labels: [this.getRandomInt(), this.getRandomInt()],
//           datasets: [
//             {
//               label: 'Data One',
//               backgroundColor: '#f87979',
//               data: [this.getRandomInt(), this.getRandomInt()]
//             }, {
//               label: 'Data One',
//               backgroundColor: '#f87979',
//               data: [this.getRandomInt(), this.getRandomInt()]
//             }
//           ]
//         },
//         this.option
//      },
//       getRandomInt () {
//         return (Math.floor(Math.random() * (50 - 5 + 1)) + 5)%10
//     }
//   }
// }
</script>