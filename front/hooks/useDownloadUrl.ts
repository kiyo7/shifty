//lib
import { useState, useEffect } from 'react'

//utils
import { supabase } from '../utils/supabase'

export const useDownloadUrl = (filePath: string | undefined, key: 'avatars' | 'groupLogo') => {
  const [isLoading, setIsLoading] = useState(false)
  const [fullUrl, setFullUrl] = useState('')
  const bucketName = key === 'avatars' ? 'avatars' : 'groupLogo'

  useEffect(() => {
    if (filePath) {
      const download = async () => {
        setIsLoading(true)
        const { data, error } = await supabase.storage.from(bucketName).download(filePath)

        if (error) {
          setIsLoading(false)
          throw error
        }
        setFullUrl(URL.createObjectURL(data!))
        setIsLoading(false)
      }
      download()
    }
  }, [bucketName, filePath])

  return { isLoading, fullUrl, setFullUrl }
}
