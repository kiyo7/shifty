//lib
import { useQueryClient, useMutation } from 'react-query'

//utils
import { supabase } from '../../utils/supabase'

//type
import { Profile } from '../../types'

export const useMutateProfile = () => {
  const queryClient = useQueryClient()

  const createProfileMutation = useMutation(
    async (profile: Omit<Profile, 'updated_at' | 'created_at'>) => {
      const { data, error } = await supabase.from('profiles').insert(profile)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        queryClient.setQueryData(['profile'], res[0])
        alert('成功')
      },
      onError: (err: any) => {
        alert(err.message)
      },
    },
  )

  const updateProfileMutation = useMutation(
    async (profile: Omit<Profile, 'updated_at' | 'created_at'>) => {
      const { data, error } = await supabase.from('profiles').update(profile).eq('id', profile.id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        queryClient.setQueryData(['profile'], res[0])
      },
      onError: (err: any) => {
        alert(err.messages)
      },
    },
  )

  return { createProfileMutation, updateProfileMutation }
}
