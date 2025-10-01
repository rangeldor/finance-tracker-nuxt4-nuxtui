<template>
  <div>
    <div class="mb-4">
      <UFormField
        label="Current avatar"
        class="w-full"
        help="This would be blank by default"
      >
        <UAvatar :src="url" size="3xl" />
      </UFormField>
    </div>

    <div class="mb-4">
      <UFileUpload
        v-model="avatarFileUpload"
        highlight
        color="neutral"
        layout="list"
        position="inside"
        description="SVG, PNG, JPG, WEBP or GIF"
        label="Drop your image here"
        size="xl"
      />
    </div>

    <UButton
      type="submit"
      color="primary"
      variant="solid"
      label="Save"
      :loading="uploading"
      :disabled="uploading"
      @click="saveAvatar"
    />
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { url } = useAvatarUrl()

const { toastSuccess, toastError } = useAppToast()

const uploading = ref(false)
const avatarFileUpload = ref()

const saveAvatar = async () => {
  const file = avatarFileUpload.value

  if (!file) {
    toastError({ title: 'Select a file to upload first' })
    return
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`

  try {
    uploading.value = true

    const currentAvatarUrl = user?.value?.user_metadata?.avatar_url

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file)

    if (error) throw error

    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName
      }
    })

    if (currentAvatarUrl) {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([currentAvatarUrl])
      if (error) throw error
    }

    avatarFileUpload.value = null

    toastSuccess({
      title: 'Avatar uploaded'
    })
  } catch (error) {
    toastError({
      title: 'Error uploading avatar',
      description: 'Erro details: ' + (error as Error).message
    })
  } finally {
    uploading.value = false
  }
}
</script>
