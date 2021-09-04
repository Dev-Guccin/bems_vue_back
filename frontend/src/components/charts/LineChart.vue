<template>
    <div class="home">
        <p> > 건물 에너지 사용 현황</p>
        <b-container class="px-0 mx-auto" style="" fluid>
            <b-row>
                <b-col cols="8">
                    <b-card class="text-center" header="건물 기본정보" header-tag="header" style="padding:0px;">
                        <b-card-body style="padding:0px;">
                            <b-container style="padding:0px;">
                                <b-row>
                                    <b-col>
                                        <b-img src="@/assets/building_test.jpg" alt="Vue_logo" fluid></b-img>
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
                                                    <b-td>본관동(지하3층)<br> 연구동(지하1층,지상4층)
                                                        <br> 창업동(지하2층, 지상4층)<br> 회의동(지상 3층)</b-td>
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
                        </b-card-body>
                    </b-card>
                </b-col>
                <b-col cols="2">
                    <b-card height="400px" header="사용면적당 1차 에너지 사용량 (kWh/m2년)" header-tag="header" class="text-center">
                        <b-card-body>
                            <b-table-simple>
                                <b-tbody>
                                    <b-tr>
                                        <h2>163</h2>
                                    </b-tr>
                                    <b-tr></b-tr>
                                </b-tbody>
                            </b-table-simple>
                        </b-card-body>
                    </b-card>
                </b-col>
                <b-col cols="2">
                    <b-card height="400px" header="사용면적당 CO2 배출량 (kg/m2년)" header-tag="header" class="text-center">
                        <b-card-body>
                            <b-table-simple>
                                <b-tbody>
                                    <b-tr>
                                        <h2>69</h2>
                                    </b-tr>
                                    <b-tr></b-tr>
                                </b-tbody>
                            </b-table-simple>
                        </b-card-body>
                    </b-card>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="8">
                    <b-card height="400px" header="월별 1차 에너지 사용량 (사용면적당)" header-tag="header" class="text-center">
                        <b-card-body>
                            <!-- <button @click="fillData()">Randomize</button> -->
                            <canvas class="statistics-charts-line" ref="lineChart" width="200" height="100px"></canvas>    
                        </b-card-body>
                    </b-card>
                </b-col>
                <b-col cols="4">
                    <b-card height="400px" header="연간 1차 에너지 사용량 (사용면적당)" header-tag="header" class="text-center">
                        <b-card-body>
                        </b-card-body>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import Chart from "chart.js";

export default {
    data() {
        return {
            Chart,
            datacollection: null,
            chartStyles: {
                height: '400px',
                position: 'relative'
            }
        }
    },
    async mounted() {
        await this.drawChart();
    },
    methods: {
        drawChart() {
            const chartCtx = this.$refs.lineChart.getContext("2d");
            console.log(chartCtx, "chartCtx?");
            // context와 Chart.js객체, 데이터가 결정됐으니  그리기만 하면된다.
            this.$refs.lineChart = new Chart(chartCtx, {
                type: 'bar',
                data: {
                  labels: [1,2,3],
                  datasets: [
                    {
                      label: 'Dataset 1',
                      data: [[0,2],[0,3]],
                      backgroundColor: "#f67019",
                    },
                    {
                      label: 'Dataset 2',
                      data: [3,2,2.2],
                      backgroundColor:   '#4dc9f6',
                    },
                    {
                      label: 'Dataset 3',
                      data: [2,3.1,2],
                      backgroundColor: '#acc236',
                    },
                  ]
                },
                options: {

                  responsive: true,
                  scales: {
                    x:{
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                    }
                  }
                }
            })
        }
    },
}
</script>