<template>
  <NuxtLayout name="error">
    <section
      class="flex min-h-dvh flex-col items-center justify-center text-center"
    >
      <div class="flex max-w-sm flex-col items-center gap-8">
        <p class="text-4xl font-bold">{{ error?.statusCode }}</p>
        <p class="text-xl">Ooops.</p>
        <p class="text-xl text-gray-500 dark:text-gray-400">
          {{ error?.statusMessage }}
        </p>
        <UButton size="lg" @click="handleClearError">
          Voltar para o inicio
        </UButton>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useError, clearError, type NuxtError } from '#app'

// Get the current error from the composable
const rawError = useError() // rawError is Ref<NuxtError | null | undefined>

// Create a computed property to handle null or undefined errors
const error = computed(
  () =>
    rawError.value ||
    ({ statusCode: 500, message: 'Ocorreu um erro inesperado' } as NuxtError)
)

const handleClearError = () => {
  clearError({ redirect: '/' })
}
</script>
