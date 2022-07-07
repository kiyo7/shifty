//lib
import { FormEvent, useState } from 'react'
import Image from 'next/image'
import { IconMail, IconKey } from '@supabase/ui'

//utils
import { useMutateAuth } from '../../hooks/mutate/useMutateAuth'

//components
import { ForgotPasswordModal } from '../organisms/ForgotPasswordModal'
import { SInput } from '../atom/SInput'
import { Spinner } from '../atom/Spinner'

//images
import authPageBG from '../../images/authPageBG.jpg'
import google from '../../images/googleAuth.png'

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  const { email, setEmail, password, setPassword, login, register, googleAuth } = useMutateAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLogin) {
      login.mutate()
    } else {
      register.mutate()
    }
  }

  const googleAuthMutation = async () => {
    googleAuth.mutate()
  }

  if (login.isLoading || register.isLoading || googleAuth.isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div className="relative h-full w-full bg-gray-200 lg:grid lg:grid-cols-2 lg:gap-2">
        <p className="hidden lg:block">
          <Image src={authPageBG} alt="img" />
        </p>
        <div className="w-full">
          <form onSubmit={handleSubmit} className="m-auto w-8/12">
            <div className="mb-10 pt-10 text-center">
              <p className="my-10 font-sans text-3xl text-gray-500 lg:text-4xl">
                {isLogin ? 'ログイン' : '新規登録'}
              </p>
            </div>
            <div>
              <SInput
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="メールアドレス"
                placeholder="example@email.com"
                icon={<IconMail />}
              />
            </div>
            <div>
              <SInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="パスワード (6文字以上)"
                placeholder="******"
                icon={<IconKey />}
              />
            </div>
            <div className="my-6 flex justify-end text-sm">
              <ForgotPasswordModal />
            </div>
            <button
              type="submit"
              disabled={false}
              className="flex w-full justify-center rounded-md bg-green-600 py-2 px-4 text-sm tracking-widest text-white hover:opacity-75 disabled:bg-gray-500 "
            >
              {isLogin ? 'ログイン' : '新規登録'}
            </button>
            <div className="mt-5 flex justify-center">
              <p
                onClick={() => setIsLogin(!isLogin)}
                className="mb-6 cursor-pointer font-sans text-lg font-medium text-indigo-400  hover:text-indigo-700"
              >
                {isLogin ? '新規登録はこちら' : 'ログインはこちら'}
              </p>
            </div>
          </form>
          <div className="m-auto w-8/12">
            <div className="mt-6 mb-3 w-full border border-dashed border-gray-400" />
            <div className="mx-4 font-sans text-sm font-medium  text-gray-500">
              SNSアカウントで登録・ログイン Google認証調整中のためお使いいただけません。
            </div>
            <button
              onClick={googleAuthMutation}
              data-testid="google"
              className="my-8 flex w-full justify-center hover:cursor-pointer hover:opacity-75"
            >
              <Image src={google} alt="google" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
