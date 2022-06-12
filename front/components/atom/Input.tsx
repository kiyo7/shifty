//lib
import { Input } from '@supabase/ui'

interface Props {
  type: string
  label: string
  placeholder: string
  icon: JSX.Element
}

export const SInput: React.FC<Props> = ({ type, label, placeholder, icon }) => {
  return (
    <>
      <label className="text-gray-500">{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        icon={icon}
        className="my-2 w-full rounded border py-2 px-3"
      />
    </>
  )
}