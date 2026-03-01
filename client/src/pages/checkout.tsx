import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ShoppingBag, CreditCard, ShieldCheck, Truck, Receipt,
  CheckCircle, BookOpen, ArrowLeft, Smartphone, XCircle,
  CheckSquare, Square,
} from "lucide-react";
import { useCart, useCheckout } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { ConfirmDialog } from "@/components/confirm-dialog";

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { data: cartItems = [] } = useCart();
  const checkout = useCheckout();
  const [receipt, setReceipt] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (cartItems.length > 0) {
      setSelectedIds(new Set(cartItems.map((item: any) => item.bookId)));
    }
  }, [cartItems.length]);

  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
    email: user?.email || "",
    address: "",
    city: "",
    paymentMethod: "gcash",
    mobileNumber: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    agreeToTerms: false,
  });

  const selectedItems = cartItems.filter((item: any) => selectedIds.has(item.bookId));
  const total = selectedItems.reduce((sum: number, item: any) => sum + item.book.price, 0);
  const allSelected = cartItems.length > 0 && selectedIds.size === cartItems.length;
  const noneSelected = selectedIds.size === 0;

  const toggleItem = (bookId: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(bookId) ? next.delete(bookId) : next.add(bookId);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(cartItems.map((item: any) => item.bookId)));
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(price / 100);
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const formatCardNumber = (value: string) =>
    value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };
  const formatMobile = (value: string) => value.replace(/\D/g, "").slice(0, 11);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setShowCancelConfirm(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleCancelConfirmed = () => { setShowCancelConfirm(false); setLocation("/"); };

  const [showPayConfirm, setShowPayConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms || selectedItems.length === 0) return;
    setShowPayConfirm(true); // show confirm dialog instead of paying immediately
  };

  const handlePayConfirmed = () => {
    setShowPayConfirm(false);
    checkout.mutate({ bookIds: selectedItems.map((i: any) => i.bookId) } as any, {
      onSuccess: (order: any) => { setReceipt({ ...order, formData }); setShowReceipt(true); },
    });
  };

  if (cartItems.length === 0 && !showReceipt) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center space-y-4">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto" />
          <h2 className="text-2xl font-bold text-muted-foreground">Your cart is empty</h2>
          <p className="text-muted-foreground/70">Add some books before checking out!</p>
          <Button asChild className="rounded-xl mt-2"><Link href="/">Browse Store</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setShowCancelConfirm(true)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-3xl font-bold font-display text-primary">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8">
          <div className="space-y-6">

            {/* Book Selection */}
            <Card className="rounded-2xl border-primary/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <ShoppingBag className="w-5 h-5" /> Select Books to Purchase
                  </CardTitle>
                  <button type="button" onClick={toggleAll}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                    {allSelected ? <><CheckSquare className="w-4 h-4" /> Deselect All</> : <><Square className="w-4 h-4" /> Select All</>}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{selectedIds.size} of {cartItems.length} book{cartItems.length !== 1 ? "s" : ""} selected</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {cartItems.map((item: any) => {
                  const selected = selectedIds.has(item.bookId);
                  return (
                    <div key={item.id} onClick={() => toggleItem(item.bookId)}
                      className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all duration-150 ${selected ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-secondary/20 opacity-60"}`}>
                      <Checkbox checked={selected} onCheckedChange={() => toggleItem(item.bookId)} onClick={e => e.stopPropagation()} className="shrink-0" />
                      <img src={item.book.coverUrl} alt={item.book.title} className="w-12 h-16 object-cover rounded-lg shadow-sm shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm line-clamp-1">{item.book.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.book.author}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.book.genre}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`font-bold text-sm ${selected ? "text-primary" : "text-muted-foreground"}`}>{formatPrice(item.book.price)}</p>
                        {!selected && <p className="text-xs text-muted-foreground">Skipped</p>}
                      </div>
                    </div>
                  );
                })}
                {noneSelected && <p className="text-center text-sm text-destructive font-medium py-2">Please select at least one book to continue.</p>}
              </CardContent>
            </Card>

            {/* Billing */}
            <Card className="rounded-2xl border-primary/10">
              <CardHeader><CardTitle className="flex items-center gap-2 text-primary"><ShieldCheck className="w-5 h-5" /> Billing Information</CardTitle></CardHeader>
              <CardContent>
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" required placeholder="Juan Dela Cruz" className="rounded-xl" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" required placeholder="juan@example.ph" className="rounded-xl" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Billing Address</Label>
                    <Input id="address" required placeholder="123 Mabini St." className="rounded-xl" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City / Province</Label>
                    <Input id="city" required placeholder="Metro Manila" className="rounded-xl" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card className="rounded-2xl border-primary/10">
              <CardHeader><CardTitle className="flex items-center gap-2 text-primary"><CreditCard className="w-5 h-5" /> Payment Method</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[{ id: "gcash", label: "GCash", icon: "💙" }, { id: "maya", label: "Maya", icon: "💚" }, { id: "card", label: "Credit Card", icon: "💳" }].map(method => (
                    <button key={method.id} type="button" onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all flex flex-col items-center gap-1 ${formData.paymentMethod === method.id ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                      <span className="text-xl">{method.icon}</span>{method.label}
                    </button>
                  ))}
                </div>
                {formData.paymentMethod === "gcash" && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <Smartphone className="w-5 h-5 text-blue-500" /><span className="text-sm text-blue-700 font-medium">Enter your GCash registered mobile number</span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gcashNumber">GCash Mobile Number</Label>
                      <Input id="gcashNumber" required placeholder="09XXXXXXXXX" className="rounded-xl" maxLength={11} value={formData.mobileNumber} onChange={e => setFormData({ ...formData, mobileNumber: formatMobile(e.target.value) })} />
                    </div>
                  </div>
                )}
                {formData.paymentMethod === "maya" && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100">
                      <Smartphone className="w-5 h-5 text-green-500" /><span className="text-sm text-green-700 font-medium">Enter your Maya registered mobile number</span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mayaNumber">Maya Mobile Number</Label>
                      <Input id="mayaNumber" required placeholder="09XXXXXXXXX" className="rounded-xl" maxLength={11} value={formData.mobileNumber} onChange={e => setFormData({ ...formData, mobileNumber: formatMobile(e.target.value) })} />
                    </div>
                  </div>
                )}
                {formData.paymentMethod === "card" && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-xl border border-primary/5">
                      <CreditCard className="w-5 h-5 text-primary" /><span className="text-sm font-medium">Enter your card details</span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" required placeholder="1234 5678 9012 3456" className="rounded-xl font-mono" maxLength={19} value={formData.cardNumber} onChange={e => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" required placeholder="JUAN DELA CRUZ" className="rounded-xl uppercase" value={formData.cardName} onChange={e => setFormData({ ...formData, cardName: e.target.value.toUpperCase() })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input id="cardExpiry" required placeholder="MM/YY" className="rounded-xl font-mono" maxLength={5} value={formData.cardExpiry} onChange={e => setFormData({ ...formData, cardExpiry: formatExpiry(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input id="cardCvv" required placeholder="123" className="rounded-xl font-mono" maxLength={3} type="password" value={formData.cardCvv} onChange={e => setFormData({ ...formData, cardCvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox id="terms" checked={formData.agreeToTerms} onCheckedChange={checked => setFormData({ ...formData, agreeToTerms: !!checked })} />
                  <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground leading-snug">I agree to the terms of service and acknowledge that this is a digital purchase with no refunds.</Label>
                </div>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Truck className="w-5 h-5" /></div>
                <div><h4 className="font-bold text-sm">Instant Delivery</h4><p className="text-xs text-muted-foreground">Books added to library instantly</p></div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><ShieldCheck className="w-5 h-5" /></div>
                <div><h4 className="font-bold text-sm">Safe & Secure</h4><p className="text-xs text-muted-foreground">Encrypted transaction</p></div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="rounded-2xl border-primary/10 shadow-lg sticky top-24">
              <CardHeader><CardTitle className="text-lg">Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {selectedItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No books selected</p>
                  ) : selectedItems.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.book.coverUrl} className="w-10 h-14 object-cover rounded-lg shadow-sm shrink-0" alt={item.book.title} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm line-clamp-1">{item.book.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.book.author}</p>
                        <p className="text-sm font-bold mt-0.5 text-primary">{formatPrice(item.book.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {cartItems.length > selectedItems.length && (
                  <div className="text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2">
                    {cartItems.length - selectedItems.length} book{cartItems.length - selectedItems.length !== 1 ? "s" : ""} skipped — still in cart for later
                  </div>
                )}
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({selectedItems.length} book{selectedItems.length !== 1 ? "s" : ""})</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg text-primary">
                    <span>Total</span><span>{formatPrice(total)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Button form="checkout-form" type="submit" className="w-full rounded-xl py-6 text-lg font-bold shadow-xl shadow-primary/20"
                  disabled={!formData.agreeToTerms || checkout.isPending || noneSelected}>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {checkout.isPending ? "Processing..." : noneSelected ? "Select books first" : `Pay ${formatPrice(total)}`}
                </Button>

                {/* Pay confirmation dialog */}
                <ConfirmDialog
                  open={showPayConfirm}
                  onOpenChange={setShowPayConfirm}
                  title="Confirm Payment"
                  description={
                    `You're about to purchase ${selectedItems.length} book${selectedItems.length !== 1 ? "s" : ""} for ${formatPrice(total)}. This action cannot be undone. Proceed with payment?`
                  }
                  confirmLabel={`Pay ${formatPrice(total)}`}
                  cancelLabel="Go Back"
                  onConfirm={handlePayConfirmed}
                />
                <Button variant="ghost" className="w-full rounded-xl text-muted-foreground" onClick={() => setShowCancelConfirm(true)}>
                  <XCircle className="w-4 h-4 mr-2" /> Cancel Payment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><XCircle className="w-5 h-5 text-destructive" /> Cancel your payment?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to cancel? Your cart will be kept but your payment won't be processed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Stay & Continue</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleCancelConfirmed}>Yes, Cancel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600 text-xl"><CheckCircle className="w-6 h-6" /> Purchase Successful!</DialogTitle>
          </DialogHeader>
          {receipt && (
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2 text-primary font-bold"><Receipt className="w-4 h-4" /><span className="text-sm">{receipt.receiptNumber}</span></div>
                <p className="text-xs text-muted-foreground">{formatDate(receipt.createdAt)}</p>
                <p className="text-xs text-muted-foreground">Paid via <span className="font-medium capitalize">{receipt.formData.paymentMethod === "gcash" ? "GCash" : receipt.formData.paymentMethod === "maya" ? "Maya" : "Credit Card"}</span> · {receipt.formData.fullName}</p>
                {receipt.formData.paymentMethod !== "card" && receipt.formData.mobileNumber && <p className="text-xs text-muted-foreground">Mobile: {receipt.formData.mobileNumber}</p>}
                {receipt.formData.paymentMethod === "card" && receipt.formData.cardNumber && <p className="text-xs text-muted-foreground">Card ending in {receipt.formData.cardNumber.replace(/\s/g, "").slice(-4)}</p>}
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {receipt.orderItems?.map((item: any) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img src={item.book.coverUrl} className="w-10 h-14 object-cover rounded-lg shadow-sm shrink-0" alt={item.book.title} />
                    <div className="flex-1 min-w-0"><p className="font-bold text-sm line-clamp-1">{item.book.title}</p><p className="text-xs text-muted-foreground">{item.book.author}</p></div>
                    <span className="text-sm font-bold text-primary shrink-0">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg text-primary"><span>Total Paid</span><span>{formatPrice(receipt.total)}</span></div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="outline" className="rounded-xl" onClick={() => { setShowReceipt(false); setLocation("/orders"); }}><Receipt className="w-4 h-4 mr-2" /> View History</Button>
                <Button className="rounded-xl" onClick={() => { setShowReceipt(false); setLocation("/library"); }}><BookOpen className="w-4 h-4 mr-2" /> My Library</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}