<template>
    <v-overlay :value="loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
        };
    },
    created() {
        setTimeout(() => {
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
        }, 100);
    },
};
</script>

<style>
/* Your component's styles go here */
</style>