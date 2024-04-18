import React from 'react'
import { CaretSortIcon } from "@radix-ui/react-icons"

import { Button } from '@/common/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/common/components/ui/collapsible"

import { UserInfo } from '@/models/user';


interface ProfileInfoProps {
  userInfo: UserInfo;
}

function ProfileInfoComponent({ userInfo }: ProfileInfoProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const infoWrapper = (key: string, text: string) => {
    return <div className="text-black rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
      {key}: {text}
    </div>
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[350px] space-y-2"
    >
      <div className="text-black flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">
          Your profile details
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <CaretSortIcon className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      {infoWrapper("email", userInfo.email)}
      <CollapsibleContent className="space-y-2">
        {infoWrapper("fullname", userInfo.fullname)}
        {infoWrapper("username", userInfo.username)}
        {infoWrapper("role", userInfo.role)}
      </CollapsibleContent>
    </Collapsible>

  )
}

export default ProfileInfoComponent