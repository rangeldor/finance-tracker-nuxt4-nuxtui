export const useAppToast = () => {
  const toast = useToast()

  return {
    toastSuccess: ({
      title,
      description = null
    }: {
      title: string
      description?: string | null
    }) => {
      toast.add({
        title,
        description: description ?? undefined,
        icon: 'i-heroicons-check-circle',
        color: 'success'
      })
    },
    toastError: ({
      title,
      description = null
    }: {
      title: string
      description?: string | null
    }) => {
      toast.add({
        title,
        description: description ?? undefined,
        icon: 'i-heroicons-exclamation-circle',
        color: 'error'
      })
    }
  }
}
