//lib
import create from 'zustand'
import { Session } from '@supabase/supabase-js'
import { Profile, EditedProfile } from '../types'

interface State {
  session: Session | null
  setSession: (payload: Session | null) => void
  notice: boolean | null
  setNotice: (payload: boolean | null) => void
  editedProfile: EditedProfile
  updateEditedProfile: (payload: EditedProfile) => void
  resetProfile: () => void
}

const useStore = create<State>((set) => ({
  session: null,
  setSession: (payload) => set({ session: payload }),
  notice: false,
  setNotice: (payload) => set({ notice: payload }),

  editedProfile: { username: '', isAdmin: false, avatar: '', updated_at: '' },
  updateEditedProfile: (payload) =>
    set({
      editedProfile: {
        username: payload.username,
        isAdmin: payload.isAdmin,
        avatar: payload.avatar,
      },
    }),
  resetProfile: () => set({ editedProfile: { username: '', isAdmin: false, avatar: '' } }),
}))

export default useStore