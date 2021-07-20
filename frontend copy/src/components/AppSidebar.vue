<template>
  <v-card
    class="mx-auto"
    max-width="300"
    tile
  >
    <v-list dense>
      <v-subheader>contents</v-subheader>
      <v-list-item-group
        v-model="selectedItem"
        color="primary"
      >
        <v-list-item
          v-for="(item, i) in items"
          :key="i" router :to="{name: item.router}" exact
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if ="this.$store.getters.getIsAuth == true">
          <v-list-item-icon>
            <v-icon v-text="items1[0].icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="items1[0].text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
  export default {
    data: () => ({
      selectedItem: 1,
      items: [
        { text: '홈', router:'home', icon: 'mdi-home'},
        { text: '온도', router:'temperate', icon: 'mdi-thermometer' },
        { text: '습도',router:'humid', icon: 'mdi-water-percent' },
        { text: '화재',router:'fire', icon: 'mdi-fire' },
        { text: '조명',router:'light', icon: 'mdi-lightbulb' },
        { text: '전력',router:'electicpower', icon: 'mdi-flash' },
        { text: '수도',router:'water', icon: 'mdi-water-pump' },
        { text: 'pm', router:'dust',icon: 'mdi-dots-hexagon' },
        { text: '이산화탄소',router:'co2', icon: 'mdi-molecule-co2' },
      ],
      items1: [
        { text: '환경설정',router:'setting', icon: 'mdi-cog-outline' },
      ]
    }),
  }
</script>