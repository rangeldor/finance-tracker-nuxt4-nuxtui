<template>
  <header class="container mx-auto mt-10 flex items-center justify-between">
    <NuxtLink to="/" class="text-Xl font-bold">Finance Trace</NuxtLink>
    <div class="flex items-center justify-center gap-4">
      <ColorModeButton />
      <UDropdownMenu v-if="user" :items="items">
        <UAvatar class="cursor-pointer" :src="url" alt="Avatar" />
      </UDropdownMenu>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { url } = useAvatarUrl()

const userEmail = computed(() => {
  return user.value?.email ? user.value.email : 'Account'
})
const items = ref<DropdownMenuItem[]>([
  [
    {
      label: userEmail.value,
      slot: 'account' as const,
      disabled: true
    }
  ],
  [
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-8-tooth',
      onSelect: () => navigateTo('/settings/profile')
    },
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      color: 'error',
      onSelect: async () => {
        await supabase.auth.signOut()
        return navigateTo('/login')
      }
    }
  ]
])
</script>
