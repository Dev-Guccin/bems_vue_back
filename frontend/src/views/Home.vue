<template>
  <div class="home">
    <p> > 건물 에너지 사용 현황</p>
    <b-container class="px-0 mx-auto" style="height: 100px; ">
      <b-row>
        <b-col cols="">
          <b-card
            height="400px"
            style="height:400px;"
            header="featured"
            header-tag="header"
          >
          <b-card-body>
            <!-- <line-chart :chart-data="datacollection" :height="400"></line-chart> -->
          </b-card-body>
          </b-card>
            
      <!-- <button @click="fillData()">Randomize</button> -->
        </b-col>
        <b-col cols="2">
          <b-card
            height="400px"
            style="height:400px;"
            header="featured"
            header-tag="header"
          >
          <b-card-body class="">
          </b-card-body>
          </b-card>
            
        </b-col>
        <b-col cols="2">
          <b-card
            height="400px"
            style="height:400px;"
            header="featured"
            header-tag="header"
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
            header="featured"
            header-tag="header"
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
            header="featured"
            header-tag="header"
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