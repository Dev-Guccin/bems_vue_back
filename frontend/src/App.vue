<template>
    <div>
    <!-- Image and text -->
        <b-navbar variant="dark" type="dark" class="px-3">
            <b-navbar-brand href="#">
            <img src="https://placekitten.com/g/30/30" class="d-inline-block align-top" alt="Kitten">
            4m-Bems
            </b-navbar-brand>
        </b-navbar>
        <b-container fluid class="m-0 p-0">
            <b-row class="">
                <b-col cols="2" class="p-0">
                    <b-nav vertical class="vh-100 ">
                        <v-list color="transparent p-0">
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
                    </b-nav>
                </b-col>
                <b-col>
                    <div>
                        <router-view/> 
                    </div>
                </b-col>
            </b-row>
        </b-container>
        
        <!-- <b-sidebar class="fixed" id="sidebar-1" title="Sidebar" shadow>
        <div class="px-3 py-2">
            <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
            </p>
            <b-img src="https://picsum.photos/500/500/?image=54" fluid thumbnail></b-img>
        </div>
        </b-sidebar> -->

    </div>
</template>
    <!-- <v-app id="inspire">
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
                        메인 -->
                        <!-- <router-view/>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app> --> 

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