//lib
import { ChangeEvent } from 'react'
import { toast } from 'react-toastify'
import { useMutation } from 'react-query'
import useStore from '../store'

//utils
import { supabase } from '../utils/supabase'

export const useUploadAvatarImg = () => {
  const editedProfile = useStore((state) => state.editedProfile)
  const updateProfile = useStore((state) => state.updateEditedProfile)

  const useMutateUploadAvatarImg = useMutation(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('画像ファイルを選択して下さい!')
      }
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`
      const { error } = await supabase.storage.from('avatars').upload(filePath, file)

      if (error) throw new Error(error.message)
      updateProfile({ ...editedProfile, avatar: filePath })
    },
    {
      onError: (err: any) => {
        toast.error(err.message)
      },
    },
  )
  return { useMutateUploadAvatarImg }
}
