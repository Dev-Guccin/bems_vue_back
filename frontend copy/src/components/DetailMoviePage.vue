<template>
    <div>
        <h1>상세 내용</h1>
        <div class="container">
            <div class="outer">
                <div class="inner">
                    <div class="centered"> <img v-bind:src="movie.poster" class="poster">
                        <div> <strong>{{movie.name}}</strong> - <i>{{movie.director}}</i> [{{movie.year}}]
                            <p>{{movie.description}}</p>
                            <router-link :to="{ name: 'movielist' }">돌아가기</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
 /* eslint-disable */
 export default { created: function() { var id = this.$route.params.id;
         this.$http.get(`/movies/${id}`).then(response => { this.movie = response.data[0]; }); }, data: function() { return { movie: {} }; } };
</script>
