<template>
    <div>
    <!-- Image and text -->
        <b-navbar variant="dark" type="dark" class="px-3">
            <b-navbar-brand href="#">
            <img src="https://placekitten.com/g/30/30" class="d-inline-block align-top" alt="Kitten">
            4m-Bems
            </b-navbar-brand>
            <div>
                <b-spinner variant="success"></b-spinner>
            </div>
        </b-navbar>
        <b-container fluid class="m-0 p-0">
            <b-row class="">
                <b-col cols="2" class="p-0">
                    <b-nav vertical class="vh-100 ">
                        <v-list color="transparent p-0">
                            <div
                            v-for="item in side" 
                            :key="item.text"
                            @click="item.drop=not(item.drop)">
                                <v-list-item 
                                link router :to="{name: item.router}">
                                    <v-list-item-icon>
                                        <v-icon v-text="item.icon"></v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{ item.text }}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <div
                                v-show="item.drop">
                                <v-list-item
                                v-for="sub in item.subPages" 
                                :key="sub.text"
                                 link router :to="{name: sub.router}">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{ sub.text }}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                </div>
                            </div>
                            <v-divider class="my-2"></v-divider>

                            <v-list-item link 
                            router :to="{name: setting[0].router}">
                                <v-list-item-icon >
                                    <v-icon v-text="setting[0].icon"></v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{setting[0].text}}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </b-nav>
                </b-col>
                <b-col>
                    <div>
                        <router-view/> 
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>


<script>
export default {
    methods: {
      onOver() {
        this.$refs.dropdown1.visible = true;
      },
      onLeave() {
        this.$refs.dropdown1.visible = false;
      }
    },
    data: () => ({
        drop : true,
        links: [
            { text: 'Dashboard', router: 'Home' },

        ],
        side: [
            { text: '종합보기', router: 'Home', icon: 'mdi-home', drop : false, subPages: [
                {text : '건물 에너지 사용현황', router : '#'},
                {text : '종합 운전 현황', router : '#'},
                {text : '사용자 분할화면', router : '#'}
            ] },
            { text: '에너지 사용', router: 'Temperate', icon: 'mdi-thermometer' , drop : false, subPages: [
                {text : '전체에너지(총량)', router : '#'},
                {text : '전력에너지(전체)', router : '#'},
                {text : '전력에너지(구역)', router : '#'},
                {text : '가스에너지', router : '#'},
                {text : '계량기관리', router : '#'}
            ]},
            { text: '에너지 분석', router: 'Humid', icon: 'mdi-water-percent', drop : false, subPages: [
                {text : '에너지 사용분석', router : '#'},
                {text : '에너지 절감분석', router : '#'}
            ] },
            { text: '에너지 제어', router: 'Fire', icon: 'mdi-fire', drop : false, subPages: [
                {text : '최적운전제어', router : '#'},
                {text : '설비예측제어', router : '#'},
                {text : '전력예측제어', router : '#'}
            ] },
            { text: '에너지 로직', router: 'Light', icon: 'mdi-lightbulb', drop : false, subPages: [
                {text : '?', router : '#'}
            ] },
            { text: '성능진단', router: 'ElecticPower', icon: 'mdi-flash', drop : false, subPages: [
                {text : '시스템', router : '#'},
                {text : '흡수식냉온수기', router : '#'},
                {text : '터보냉동기', router : '#'},
                {text : '냉각탑', router : '#'},
                {text : '펌프', router : '#'},
                {text : '공조기', router : '#'},
                {text : '전력', router : '#'}
            ] },
            { text: '설비관리', router: 'Water', icon: 'mdi-water-pump', drop : false, subPages: [
                {text : '1', router : '#'},
                {text : '2', router : '#'},
                {text : '3', router : '#'}
            ] },
            { text: '실시간관리', router: 'Pm', icon: 'mdi-dots-hexagon', drop : false, subPages: [
                {text : '1', router : '#'},
                {text : '2', router : '#'},
                {text : '3', router : '#'}
            ] },
            { text: '이력관리', router: 'Dust', icon: 'mdi-dots-hexagon', drop : false, subPages: [
                {text : '데이터이력', router : '#'},
                {text : '프로젝트이력', router : '#'},
                {text : '시뮬레이션 이력', router : '#'},
                {text : '로그 이력', router : '#'}
            ] },
            { text: '시스템관리', router: 'Co2', icon: 'mdi-molecule-co2', drop : false, subPages: [
                {text : '너무 많음..', router : '#'},
                {text : '2', router : '#'},
                {text : '3', router : '#'}
            ] },
        ],
        setting: [
            { text: '환경설정', router: 'Admin', icon: 'mdi-cog-outline' },
        ]
    }),
}
</script>
