export const metadata = {
  title: 'Billing',
  description: 'Billing and subscription management',
}

export default function BillingLayout({
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
