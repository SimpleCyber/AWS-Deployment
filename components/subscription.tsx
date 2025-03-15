import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import License from "@/components/license";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { formatAsLicenseKey } from "@/lib/utils";

export default async function Subscription() {
  const session = await auth()

  const customer = await stripe.customers.list({
    email: session?.user?.email || undefined,
    expand: ['data.subscriptions']
  }).then(res => res.data[0]);

  const subscription = customer?.subscriptions?.data[0];

  const currentPlan: Stripe.Product | undefined = subscription && await stripe.products.retrieve(
    subscription.items.data[0].price.product as string
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
        <CardDescription>Your current plan and status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          {subscription?.status === 'active' ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <XCircle className="text-red-500" />
          )}
          <span className="capitalize font-semibold">{subscription?.status || 'Inactive'}</span>
        </div>
        <Badge>{currentPlan?.name || 'Free'}</Badge>
        <License license={formatAsLicenseKey(subscription?.id || '')} />
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">Expires: {subscription?.current_period_end ? new Date(subscription.current_period_end * 1000).toLocaleDateString() : new Date().toLocaleDateString()}</p>
      </CardFooter>
    </Card>
  )
}
