<template>
  <div class="container mx-auto my-10">
    <div class="grid grid-cols-6 gap-8">
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="col-span-2"
      />
      <div class="col-span-4">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Profile',
      to: '/settings/profile'
    },
    {
      label: 'Avatar',
      to: '/settings/avatar'
    },
    {
      label: 'Settings',
      to: '/settings/settings'
    }
  ]
])
</script>
