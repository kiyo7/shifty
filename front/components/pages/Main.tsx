//lib
import { Divider } from '@mantine/core'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

//hooks
import { useMutateMembers } from '../../hooks/mutate/useMutateMembers'
import { useSubscribeOrganization } from '../../hooks/subscribe/useSubscribeOrganization'

//utils
import { supabase } from '../../utils/supabase'
import useStore from '../../store'

//components
import { Independent } from '../atoms/Independent'
import { OrganizationCard } from '../molecule/OrganizationCard'

//types
import { InviteMember, Organization } from '../../types'

//image
import independent from '../../public/assets/independent.png'

export const Main: React.FC = () => {
  useSubscribeOrganization()

  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [invitingMembers, setInvitingMembers] = useState<InviteMember[]>([])
  const [invitedMembers, setInvitedMembers] = useState<InviteMember[]>([])

  const session = useStore((state) => state.session)

  const { getMembers } = useMutateMembers()

  useEffect(() => {
    const getOrganizationsData = async () => {
      const { data } = await supabase
        .from('organizations')
        .select('*')
        .eq('administrator', session?.user?.id)
        .order('created_at', { ascending: true })
      setOrganizations(data!)
    }

    getOrganizationsData()

    getMembers
      .mutateAsync({ member_id: session?.user?.id!, status: 'Inviting' })
      .then((data) => setInvitingMembers(data))
      .catch(() => toast.error('予期せぬエラーが発生しました'))

    getMembers
      .mutateAsync({ member_id: session?.user?.id!, status: 'Invited' })
      .then((data) => setInvitedMembers(data))
      .catch(() => toast.error('予期せぬエラーが発生しました'))
  }, [])

  if (organizations.length === 0 && invitingMembers.length === 0 && invitedMembers.length === 0)
    return (
      <Independent
        heading="ようこそ"
        tips="グループを作成するか、招待してもらいましょう！"
        img={independent}
      />
    )

  return (
    <div className="w-full">
      <div className="menu rounded-box my-20 w-full bg-base-100 px-10">
        {invitingMembers.length >= 1 && (
          <div>
            <div className="text-md ">
              <span>{invitingMembers.length}つのグループに招待されています</span>
            </div>
            {invitingMembers
              ? invitingMembers?.map((member) => {
                  return (
                    <OrganizationCard
                      key={member.id}
                      id={member.id}
                      groupname={member.organizations.groupname}
                      logo={member.organizations.logo}
                      status={'Inviting'}
                    />
                  )
                })
              : null}
            <div className="m-auto w-11/12 md:w-8/12">
              <Divider my="md" variant="dashed" />
            </div>
          </div>
        )}
        {organizations.length >= 1 && (
          <div className="mt-12">
            <div className="text-md">
              <span>管理しているグループ({organizations.length})</span>
            </div>
            {organizations
              ? organizations?.map((organization) => {
                  return (
                    <OrganizationCard
                      key={organization.id}
                      id={organization.id}
                      groupname={organization.groupname}
                      logo={organization.logo}
                      status={'Admin'}
                    />
                  )
                })
              : null}
            <div className="m-auto w-11/12 md:w-8/12">
              <Divider my="md" variant="dashed" />
            </div>
          </div>
        )}

        {invitedMembers.length >= 1 && (
          <div className="mt-12">
            <div className="text-md">
              <span>所属しているグループ({invitedMembers.length})</span>
            </div>
            {invitedMembers
              ? invitedMembers?.map((member) => {
                  if (member.organizations.administrator !== supabase?.auth?.user()?.id)
                    return (
                      <OrganizationCard
                        key={member.id}
                        id={member.id}
                        groupname={member.organizations.groupname}
                        logo={member.organizations.logo}
                        status={'Invited'}
                      />
                    )
                })
              : null}
            <div className="m-auto w-11/12 md:w-8/12">
              <Divider my="md" variant="dashed" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
