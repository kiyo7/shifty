//lib
import { CameraIcon, UserGroupIcon } from '@heroicons/react/outline'
import { FormEvent } from 'react'
import { Input } from '@mantine/core'
import { toast } from 'react-toastify'

import { useRouter } from 'next/router'

//utils
import { supabase } from '../../utils/supabase'
import useStore from '../../store'

//hooks
import { useDownloadUrl } from '../../hooks/useDownloadUrl'
import { useMutateMembers } from '../../hooks/mutate/useMutateMembers'
import { useMutateOrganizations } from '../../hooks/mutate/useMutateOrganizations'
import { useUploadGroupImg } from '../../hooks/useUploadGroupImg'

//components
import { ImgUploadButton } from '../atoms/ImgUploadButton'
import { PrimaryButton } from '../atoms/PrimaryButton'
import { SImage } from '../atoms/SImage'
import { Spinner } from '../atoms/Spinner'

export const CreateOrganizations: React.FC = () => {
  const session = useStore((state) => state.session)
  const editedOrganization = useStore((state) => state.editedOrganization)
  const updateEditedOrganization = useStore((state) => state.updateEditedOrganization)

  const { push } = useRouter()

  const { fullUrl: groupLogoUrl, isLoading } = useDownloadUrl(editedOrganization.logo, 'groupLogo')
  const { createOrganizations } = useMutateOrganizations()
  const { addMembers } = useMutateMembers()
  const { useMutateUploadPostImg } = useUploadGroupImg()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await createOrganizations
      .mutateAsync({
        groupname: editedOrganization.groupname,
        logo: editedOrganization.logo,
        administrator: session?.user?.id,
      })
      .then(() => {
        supabase
          .from('organizations')
          .select('*')
          .eq('administrator', session?.user?.id)
          .then((data) => {
            const res = data?.data![data?.data?.length! - 1]
            addMembers.mutate({
              organization_id: res.id,
              member_id: session?.user?.id,
              invitation_status: 'Invited',
            })
          })
      })
      .catch(() => {
        toast.error('エラーやり直してください')
      })

    push('/dashBoard')
  }

  return (
    <div className="card mt-10 border-gray-200">
      <form onSubmit={handleSubmit}>
        <div className="m-auto flex w-screen flex-col items-center">
          <div className="my-8 w-8/12 lg:w-4/12">
            <Input
              icon={<UserGroupIcon className="h-4 text-gray-500" />}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateEditedOrganization({ ...editedOrganization, groupname: e.target.value })
              }
              placeholder="グループ名"
              radius="md"
              value={editedOrganization.groupname}
            />
          </div>
          <figure className="flex flex-col rounded-full hover:cursor-pointer hover:opacity-75">
            {!isLoading ? (
              <ImgUploadButton changeEvent={(e) => useMutateUploadPostImg.mutate(e)}>
                <SImage
                  alt="groupLogo"
                  height={200}
                  img={groupLogoUrl ? groupLogoUrl : undefined}
                  isSetting
                  width={200}
                />
              </ImgUploadButton>
            ) : (
              <Spinner />
            )}
            <CameraIcon className="h-5 text-gray-500" />
          </figure>
        </div>
        <div className="card-body m-auto w-8/12 md:w-4/12 lg:w-3/12">
          <PrimaryButton
            buttonColor="accent"
            buttonText={'作成する'}
            disabled={editedOrganization.groupname === ''}
          />
        </div>
      </form>
    </div>
  )
}
