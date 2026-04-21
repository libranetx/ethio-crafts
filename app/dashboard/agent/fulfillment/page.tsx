import AgentFulfillment from '@/components/AgentFulfillment'

export const metadata = {
  title: 'Order Fulfillment | Ethio Crafts Agent Dashboard',
  description: 'Manage order shipment status and fulfillment updates',
}

export default function AgentFulfillmentPage() {
  return (
    <main className="bg-white min-h-screen">
      <AgentFulfillment />
    </main>
  )
}
