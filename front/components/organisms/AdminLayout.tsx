// lib
import { useRouter } from 'next/router'

// hooks
import { useQueryOrganizations } from '../../hooks/query/useQueryOrganizations'

//utils
import useStore from '../../store'

//hooks
import { useSubscribeOrganization } from '../../hooks/subscribe/useSubscribeOrganization'

// components
import Head from 'next/head'
import { Header } from './Header'
import { ManagementContents } from '../molecule/Contents'
import { Navbar } from '../molecule/Navbar'

interface Props {
  children: JSX.Element
  header?: string
  title: string
}

export const AdminLayout: React.FC<Props> = ({ children, header = '', title }) => {
  const currentOrganization = useStore((state) => state.currentOrganization)

  useSubscribeOrganization()

  const id = localStorage.getItem('currentOrganization')

  if (!id) {
    localStorage.setItem('currentOrganization', currentOrganization.id)
  }

  const { data } = useQueryOrganizations()

  const { push } = useRouter()

  if (!data) push('/dashBoard')

  return (
    <>
      <Head>
        <title>Shifty | {title}</title>
      </Head>
      <Header />
      <main className="bg relative min-h-screen text-gray-500">
        <div className="font-sans tracking-widest">
          <article className="w-full">
            <aside className="hidden text-gray-100 lg:absolute lg:-inset-0 lg:block lg:w-60 lg:bg-teal-500">
              <div className="w-ful divider mt-0 items-stretch" />
              <div className="flex justify-center">
                <p className="text-center text-lg">{data?.groupname}</p>
              </div>
              <span className="divider" />
              <ManagementContents ScreenIsSmall={false} />
            </aside>
            <section className="w-full lg:pl-60">
              <p className="pt-10 text-center text-2xl md:text-4xl">{header}</p>
              <div className="mb-28 text-center">{children}</div>
            </section>
          </article>
        </div>
      </main>
      <footer className="fixed bottom-0 w-screen lg:hidden">
        <Navbar />
      </footer>
    </>
  )
}
