<script>
export default {
    data() {
        return {
            loading: true,
        };
    },
    created() {
        fetch('http://localhost:3001/api/auth/logout', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                this.$router.push('/login');
                console.log('Logout successful');
            } else {
                this.$router.push('/error/internal/');
                console.error('Logout failed');
            }
        })
        .catch(error => {
            // Handle any errors here
            console.error('An error occurred:', error);
        })
        .finally(() => {
            this.loading = false;
        });
    },
};
</script>

<template>
    <div>
        <h1>Saindo... Até mais</h1>
        <div v-if="loading">Carregando...</div>
    </div>
</template>