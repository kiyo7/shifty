//lib
import { ErrorBoundary } from 'react-error-boundary'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { Suspense } from 'react'

//hooks
import { useQueryProfile } from '../hooks/query/useQueryProfile'

//utils
import useStore from '../store'

//components
import { Admin } from './Admin'
import { Employee } from './Employee'
import { InitSetting } from './InitSetting'
import { ProfileUpdate } from './ProfileUpdate'
import { Spinner } from './atom/Spinner'

export const DashBoard: React.FC = () => {
  const toggle = useStore((state) => state.toggle)

  const { data } = useQueryProfile()

  return (
    <>
      {toggle ? (
        <ProfileUpdate />
      ) : (
        <ErrorBoundary
          fallback={<ExclamationCircleIcon className="my-5 h-10 w-10 text-pink-500" />}
        >
          <Suspense fallback={<Spinner />}>
            <>{data ? <>{data.isAdmin ? <Admin /> : <Employee />}</> : <InitSetting />}</>
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  )
}
