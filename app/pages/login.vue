<template>
  <div class="mx-auto max-w-md">
    <UCard
      v-if="!success"
      class="inset-shadow-primary/50 inset-shadow-sm"
      variant="solid"
    >
      <template #header>
        <div class="text-neutral-100">Sign-in to Finance Tracker</div>
      </template>

      <form @submit.prevent="handleLogin">
        <UFormField
          label="Email"
          name="email"
          class="mb-4"
          :required="true"
          help="You will receive an email with the confirmation link"
        >
          <UInput
            v-model="email"
            class="w-full"
            type="email"
            placeholder="Email"
            required
          />
        </UFormField>

        <UButton
          type="submit"
          variant="solid"
          color="primary"
          :loading="pending"
          :disabled="pending"
        >
          Sign-in
        </UButton>
      </form>
    </UCard>

    <UCard v-else>
      <template #header> Email has been sent </template>

      <div class="text-center">
        <p class="mb-4">
          We have sent an email to <strong>{{ email }}</strong> with a link to
          sign-in.
        </p>
        <p><strong>Important:</strong> The link will expire in 5 minutes.</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const success = ref(false)
const email = ref('')
const pending = ref(false)

const supabase = useSupabaseClient()
const { toastError } = useAppToast()

useRedirectIfAuthenticated()

const handleLogin = async () => {
  pending.value = true

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: 'http://localhost:3000/confirm'
      }
    })

    if (error) {
      toastError({
        title: 'Error authenticating',
        description: error.message
      })
    } else {
      success.value = true
    }
  } finally {
    pending.value = false
  }
}
</script>
