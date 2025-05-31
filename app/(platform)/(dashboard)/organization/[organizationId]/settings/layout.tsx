export const metadata = {
  title: 'Settings',
  description: 'Organization settings',
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full">
      {children}
    </div>
  )
}
