export const metadata = {
  title: 'Activity',
  description: 'View organization activity',
}

export default function ActivityLayout({
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
