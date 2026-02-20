import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useBook, useAddToLibrary } from "@/hooks/use-books";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, CreditCard, ShieldCheck, Truck } from "lucide-react";

export default function CheckoutPage() {
  const [, params] = useRoute("/checkout/:id");
  const [, setLocation] = useLocation();
  const bookId = parseInt(params?.id || "0");
  const { data: book, isLoading } = useBook(bookId);
  const addToLibrary = useAddToLibrary();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    agreeToTerms: false
  });

  if (isLoading) return <Layout>Loading...</Layout>;
  if (!book) return <Layout>Book not found</Layout>;

  const formattedPrice = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(book.price / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) return;
    
    // Simulate successful transaction
    addToLibrary.mutate(bookId, {
      onSuccess: () => {
        setLocation("/library");
      }
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="rounded-full">
            Back
          </Button>
          <h1 className="text-3xl font-bold font-display text-primary">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div className="space-y-8">
            {/* Payment & Shipping Form */}
            <Card className="rounded-2xl border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                  Secure Transaction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        required 
                        placeholder="Juan Dela Cruz"
                        className="rounded-xl"
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        required 
                        placeholder="juan@example.ph"
                        className="rounded-xl"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Billing Address</Label>
                    <Input 
                      id="address" 
                      required 
                      placeholder="123 Mabini St."
                      className="rounded-xl"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City / Province</Label>
                      <Input 
                        id="city" 
                        required 
                        placeholder="Metro Manila"
                        className="rounded-xl"
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                       <Label>Payment Method</Label>
                       <div className="flex gap-2 p-3 bg-secondary/50 rounded-xl border border-primary/5">
                          <CreditCard className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium">Digital Wallet / Credit Card</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 pt-4">
                    <Checkbox 
                      id="terms" 
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: !!checked})}
                    />
                    <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I agree to the terms of service and acknowledge that this is a digital purchase.
                    </Label>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Instant Delivery</h4>
                  <p className="text-xs text-muted-foreground">Digital copy added instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Safe & Secure</h4>
                  <p className="text-xs text-muted-foreground">Encrypted PHP transaction</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl border-primary/10 shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <img src={book.coverUrl} className="w-16 h-24 object-cover rounded-lg shadow-sm" alt={book.title} />
                  <div>
                    <h4 className="font-bold text-sm line-clamp-2">{book.title}</h4>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                    <p className="text-sm font-bold mt-1 text-primary">{formattedPrice}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formattedPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg text-primary">
                    <span>Total</span>
                    <span>{formattedPrice}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  form="checkout-form"
                  type="submit"
                  className="w-full rounded-xl py-6 text-lg font-bold shadow-xl shadow-primary/20"
                  disabled={!formData.agreeToTerms || addToLibrary.isPending}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {addToLibrary.isPending ? "Processing..." : "Confirm Purchase"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
