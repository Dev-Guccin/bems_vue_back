<template>
    <v-app id="inspire">
        <v-app-bar app color="white" flat>
            <v-container class="py-0 fill-height">
                <v-avatar class="mr-10" color="grey darken-1" size="32"></v-avatar>
                <v-toolbar-title>4Msys Monitoring System</v-toolbar-title>
                <v-btn v-for="link in links" :key="link" text>
                    {{ link.text }}
                </v-btn>
                <v-responsive max-width="260">
                    <v-text-field dense flat hide-details rounded solo-inverted></v-text-field>
                </v-responsive>
            </v-container>
        </v-app-bar>
        <v-main class="grey lighten-3">
            <v-container>
                <v-row>
                    <v-col cols="2">
                        <v-sheet rounded="lg">
                            <v-list color="transparent">
                                <v-list-item 
                                v-for="item in side" 
                                :key="item.text"
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
                        </v-sheet>
                    </v-col>
    
                    <v-col>
                        <v-sheet min-height="70vh" rounded="lg">
                        <!-- 메인 -->
                        <router-view/>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    data: () => ({
        links: [
            { text: 'Dashboard', router: 'Home' },

        ],
        side: [
            { text: '홈', router: 'Home', icon: 'mdi-home' },
            { text: '온도', router: 'Temperate', icon: 'mdi-thermometer' },
            { text: '습도', router: 'Humid', icon: 'mdi-water-percent' },
            { text: '화재', router: 'Fire', icon: 'mdi-fire' },
            { text: '조명', router: 'Light', icon: 'mdi-lightbulb' },
            { text: '전력', router: 'ElecticPower', icon: 'mdi-flash' },
            { text: '수도', router: 'Water', icon: 'mdi-water-pump' },
            { text: 'pm', router: 'Pm', icon: 'mdi-dots-hexagon' },
            { text: '미세먼지', router: 'Dust', icon: 'mdi-dots-hexagon' },
            { text: '이산화탄소', router: 'Co2', icon: 'mdi-molecule-co2' },
        ],
        setting: [
            { text: '환경설정', router: 'Admin', icon: 'mdi-cog-outline' },
        ]
    }),
}
</script>