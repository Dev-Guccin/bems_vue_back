<template>
    <div class="movies">
        <h1>영화 목록</h1>
        <div class="container">
            <div class="outer">
                <div class="inner">
                    <div class="centered" v-for="movie in movies" :key="movie.id"> <img v-bind:src="movie.poster" class="poster">
                        <div> <strong>{{movie.name}}</strong> - <i>{{movie.director}}</i> [{{movie.year}}]
                            <router-link :to="{ name: 'detailmovie', params: { id: movie.id }}">더보기</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
export default { 
    created() { 
        this.$http.get("/movies").then(response => { 
            this.movies = response.data; 
        });
    }, 
    data() { 
        return { 
            movies: [] 
            }; 
        } 
    };
</script>

<style>
 .outer {
     display: table;
     width: 100%;
     height: 100%;
 }

 .inner {
     display: table-cell;
     vertical-align: middle;
     text-align: center;
 }

 .centered {
     position: relative;
     display: inline-block;
     width: 50%;
     padding: 1em;
     font-size: 1.5em;
     /* background: orange; */
     /* color: white; */
 }

 .poster {
     width: 30%;
     height: 40%;
 }
</style>
