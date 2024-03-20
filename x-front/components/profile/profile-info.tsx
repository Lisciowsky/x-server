import React from 'react'

import { Button } from '@/components/ui/button'

import { CaretSortIcon } from "@radix-ui/react-icons"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"


import { UserInfo } from '@/models/user';

interface ProfileInfoProps {
  userInfo: UserInfo;
}

function ProfileInfoComponent({ userInfo }: ProfileInfoProps) {
  const [isOpen, setIsOpen] = React.useState(false)

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
      <div className="text-black rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
        email: {userInfo.email}
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="text-black rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
          fullname: {userInfo.fullname}
        </div>
        <div className="text-black rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
          username: {userInfo.username}
        </div>
        <div className="text-black rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
          role: {userInfo.role}
        </div>
      </CollapsibleContent>
    </Collapsible>

  )
}

export default ProfileInfoComponent