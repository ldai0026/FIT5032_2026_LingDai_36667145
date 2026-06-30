<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Vue File Structure</template>

    A Vue single-file component usually contains a template block, a script block, and a style block.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>FIT5032 Tooling</template>

    This project is running with Vite, Vue 3, VS Code, and the Vue Official extension.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Component Practice</template>

    I edited HelloWorld and TheWelcome, then added a new MyName component to App.vue.
  </WelcomeItem>
</template>
