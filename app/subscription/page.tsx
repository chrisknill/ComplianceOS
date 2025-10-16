import { Shell } from '@/components/layout/Shell'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Check, Zap } from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/stripe'
import { Button } from '@/components/ui/button'

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/signin')
  }

  // In production, fetch actual subscription from database
  const currentPlan = 'FREE'

  return (
    <Shell>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">Choose Your Plan</h1>
          <p className="text-slate-600 mt-2">Select the perfect plan for your organization</p>
          <p className="text-sm text-slate-500 mt-1">Current Plan: <span className="font-semibold">{currentPlan}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => {
            const isCurrent = currentPlan === key
            const isPopular = key === 'PROFESSIONAL'

            return (
              <div
                key={key}
                className={`relative bg-white rounded-lg shadow-lg p-8 ${
                  isPopular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                    <span className="text-slate-600">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <form action="/api/stripe/create-checkout-session" method="POST">
                    <input type="hidden" name="priceId" value={plan.stripePriceId || ''} />
                    <Button 
                      type="submit" 
                      className="w-full"
                      variant={isPopular ? 'default' : 'outline'}
                      disabled={!plan.stripePriceId}
                    >
                      {key === 'FREE' ? 'Downgrade' : 'Upgrade'}
                    </Button>
                  </form>
                )}
              </div>
            )
          })}
        </div>

        <div className="bg-slate-50 rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="font-semibold text-slate-900 mb-4">Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2">Feature</th>
                  <th className="text-center py-2">Free</th>
                  <th className="text-center py-2">Starter</th>
                  <th className="text-center py-2">Professional</th>
                  <th className="text-center py-2">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2">Max Users</td>
                  <td className="text-center">1</td>
                  <td className="text-center">5</td>
                  <td className="text-center">25</td>
                  <td className="text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-2">Documents</td>
                  <td className="text-center">10</td>
                  <td className="text-center">100</td>
                  <td className="text-center">Unlimited</td>
                  <td className="text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-2">PDF Export</td>
                  <td className="text-center">-</td>
                  <td className="text-center">✓</td>
                  <td className="text-center">✓</td>
                  <td className="text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-2">File Uploads</td>
                  <td className="text-center">-</td>
                  <td className="text-center">-</td>
                  <td className="text-center">✓</td>
                  <td className="text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-2">Approval Workflows</td>
                  <td className="text-center">-</td>
                  <td className="text-center">-</td>
                  <td className="text-center">✓</td>
                  <td className="text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-2">API Access</td>
                  <td className="text-center">-</td>
                  <td className="text-center">-</td>
                  <td className="text-center">-</td>
                  <td className="text-center">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center text-sm text-slate-600">
          <p>All plans include ISO 9001, 14001, and 45001 compliance features</p>
          <p className="mt-2">Need a custom plan? <a href="mailto:sales@complianceos.com" className="text-blue-600 hover:underline">Contact us</a></p>
        </div>
      </div>
    </Shell>
  )
}

