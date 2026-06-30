<script setup>
const studentName = 'Ling Dai'
</script>

<template>
  <section class="my-name">
    <p>New component: MyName.vue</p>
    <h2>Hello, my name is {{ studentName }}</h2>
  </section>
</template>

<style scoped>
.my-name {
  margin-top: 2rem;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background-soft);
}

.my-name p {
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.my-name h2 {
  margin: 0;
  color: hsla(160, 100%, 37%, 1);
  font-size: 1.4rem;
}
</style>
