import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { useOrders } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Receipt, ShoppingBag, BookOpen, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useOrders();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(price / 100);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="sm" asChild className="rounded-full">
            <Link href="/"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
          </Button>
          <h1 className="text-3xl font-bold font-display text-primary flex items-center gap-2">
            <Receipt className="w-7 h-7" />
            Purchase History
          </h1>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto" />
            <h2 className="text-xl font-bold text-muted-foreground">No purchases yet</h2>
            <p className="text-muted-foreground/70">Browse the store and buy your first book!</p>
            <Button asChild className="rounded-xl mt-2">
              <Link href="/">Browse Store</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <Card key={order.id} className="rounded-2xl border-primary/10 shadow-sm overflow-hidden">
                <CardHeader className="bg-primary/5 pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-base font-bold text-primary flex items-center gap-2">
                        <Receipt className="w-4 h-4" />
                        {order.receiptNumber}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                        ✓ {order.status}
                      </Badge>
                      <span className="font-bold text-primary text-lg">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {order.orderItems.map((item: any) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img
                        src={item.book.coverUrl}
                        alt={item.book.title}
                        className="w-12 h-16 object-cover rounded-lg shadow-sm shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm line-clamp-1">{item.book.title}</p>
                        <p className="text-xs text-muted-foreground">{item.book.author}</p>
                        <p className="text-sm font-medium text-primary">{formatPrice(item.price)}</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl shrink-0" asChild>
                        <Link href={`/book/${item.bookId}`}>
                          <BookOpen className="w-3 h-3 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-sm text-muted-foreground">{order.orderItems.length} book{order.orderItems.length > 1 ? "s" : ""}</span>
                    <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}