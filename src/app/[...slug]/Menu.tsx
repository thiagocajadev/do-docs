'use client'

import { t } from '@/i18n'
import * as Dialog from '@radix-ui/react-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { usePathname } from 'next/navigation'
import { ComponentProps, useEffect, useState } from 'react'

import { Burger } from './Burger'

export function Menu({ children, ...props }: ComponentProps<typeof Dialog.Content>) {
  const [opened, setOpened] = useState(false)

  // The dialog stays mounted across route changes, so closing it is on us.
  const pathname = usePathname()
  useEffect(() => setOpened(false), [pathname])

  return (
    <Dialog.Root open={opened} onOpenChange={setOpened}>
      <Dialog.Trigger aria-label={t('nav.menu')}>
        <Burger opened={opened} className="lg:hidden" />
      </Dialog.Trigger>
      <Dialog.Content {...props}>
        <VisuallyHidden.Root>
          <Dialog.Title>{t('nav.menu')}</Dialog.Title>
          <Dialog.Description>{t('nav.menuDescription')}</Dialog.Description>
        </VisuallyHidden.Root>
        {children}
      </Dialog.Content>
    </Dialog.Root>
  )
}
