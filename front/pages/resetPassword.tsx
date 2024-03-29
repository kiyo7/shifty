//lib
import { IconMail, Button } from '@supabase/ui'
import { Input } from '@mantine/core'
import { NextPage } from 'next'

//hooks
import { useMutateAuth } from '../hooks/mutate/useMutateAuth'

//components
import { Layout } from '../components/organisms/Layout'

const ResetPassword: NextPage = () => {
  const { password, setPassword, resetPassword } = useMutateAuth()
  return (
    <Layout title="パスワード再設定">
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h3 className=" mx-2 font-sans text-2xl text-gray-500">パスワードの再設定</h3>
        <div className="my-10">
          <Input.Wrapper label="新しいパスワード(6文字以上)" className="text-left">
            <Input
              icon={<IconMail />}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value)
              }}
              placeholder="******"
              radius="md"
              value={password}
            />
          </Input.Wrapper>
        </div>
        <div className="m-auto my-8 w-11/12">
          <Button onClick={() => resetPassword.mutate()} block className="rounded-full">
            送信
          </Button>
        </div>
      </div>
    </Layout>
  )
}

export default ResetPassword
