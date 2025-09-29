<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<style>
html {
  scrollbar-color: var(--ui-color-primary-500) transparent;
  scrollbar-width: thin;
}
</style>
