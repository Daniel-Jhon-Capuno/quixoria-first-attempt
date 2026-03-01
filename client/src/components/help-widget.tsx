import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  HelpCircle, X, ChevronDown, ChevronUp,
  BookOpen, ShoppingCart, Highlighter, BookMarked,
  Mail, MessageSquare, Lightbulb, Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FAQS = [
  {
    q: "How do I buy a book?",
    a: "Browse the store, click 'Add to Cart' on any book, then open your cart and click 'Checkout'. Fill in your billing and payment details, then confirm your purchase.",
    icon: <ShoppingCart className="w-4 h-4 text-primary shrink-0" />,
  },
  {
    q: "Where are my purchased books?",
    a: "All purchased books go straight to your Library. Click 'Library' in the navigation bar to find and read them anytime.",
    icon: <BookOpen className="w-4 h-4 text-primary shrink-0" />,
  },
  {
    q: "How does reading progress work?",
    a: "Your progress is saved automatically as you scroll through a book. When you reopen it, a 'You left off here' marker shows exactly where you stopped.",
    icon: <BookMarked className="w-4 h-4 text-primary shrink-0" />,
  },
  {
    q: "How do I highlight text?",
    a: "While reading, select any text with your cursor. The highlight toolbar in the top bar will light up — pick a color to save the highlight. You can also add a personal note to each highlight.",
    icon: <Highlighter className="w-4 h-4 text-primary shrink-0" />,
  },
  {
    q: "Can I remove books from my cart?",
    a: "Yes! Open the cart drawer by clicking the cart icon in the navbar. Each book has a trash icon — click it to remove it from your cart.",
    icon: <ShoppingCart className="w-4 h-4 text-primary shrink-0" />,
  },
  {
    q: "What payment methods are accepted?",
    a: "Quixoria accepts GCash, Maya, and Credit/Debit Cards. All transactions are simulated for demo purposes.",
    icon: <ShoppingCart className="w-4 h-4 text-primary shrink-0" />,
  },
];

const TIPS = [
  { icon: "🔍", tip: "Use the genre filter buttons on the store to browse books by category." },
  { icon: "🎨", tip: "In the reader, open Settings to change the background theme, font size, and line spacing." },
  { icon: "🔖", tip: "The 'Last Read' button in the reader navbar jumps you straight back to your bookmark." },
  { icon: "💬", tip: "Highlights can have notes! After selecting a color, a note dialog will appear." },
  { icon: "📖", tip: "Click any highlight in the text to view its note or remove it." },
  { icon: "🏆", tip: "Check your Profile page to see your reading achievements and stats." },
];

type Tab = "tips" | "faq" | "contact";

export function HelpWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("tips");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const filteredFaqs = FAQS.filter(
    f =>
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: "Message sent! 📬",
      description: "We'll get back to you as soon as possible.",
    });
    setContactForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <>
      {/* Help Panel */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] max-h-[560px] flex flex-col bg-white rounded-2xl shadow-2xl border border-primary/10 overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          {/* Panel Header */}
          <div className="bg-primary px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-primary-foreground">
              <HelpCircle className="w-5 h-5" />
              <span className="font-bold text-lg">Help Center</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-primary-foreground hover:bg-white/20 rounded-full"
              onClick={() => setOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex border-b shrink-0 bg-secondary/30">
            {([
              { id: "tips",    label: "Tips",    icon: <Lightbulb className="w-3.5 h-3.5" /> },
              { id: "faq",     label: "FAQ",     icon: <MessageSquare className="w-3.5 h-3.5" /> },
              { id: "contact", label: "Contact", icon: <Mail className="w-3.5 h-3.5" /> },
            ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-y-auto">

            {/* ── TIPS TAB ── */}
            {tab === "tips" && (
              <div className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Quick Tips for Quixoria</p>
                {TIPS.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-secondary/40 rounded-xl">
                    <span className="text-xl shrink-0">{tip.icon}</span>
                    <p className="text-sm text-foreground leading-snug">{tip.tip}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── FAQ TAB ── */}
            {tab === "faq" && (
              <div className="p-4 space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    className="pl-9 rounded-xl text-sm h-9"
                    value={faqSearch}
                    onChange={e => setFaqSearch(e.target.value)}
                  />
                </div>

                {filteredFaqs.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-6">No questions match your search.</p>
                ) : (
                  filteredFaqs.map((faq, i) => (
                    <div key={i} className="border border-border rounded-xl overflow-hidden">
                      <button
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary/40 transition-colors"
                        onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      >
                        {faq.icon}
                        <span className="flex-1 text-sm font-medium leading-snug">{faq.q}</span>
                        {expandedFaq === i
                          ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                          : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                      </button>
                      {expandedFaq === i && (
                        <div className="px-4 pb-3 pt-1 text-sm text-muted-foreground leading-relaxed border-t bg-secondary/20">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── CONTACT TAB ── */}
            {tab === "contact" && (
              <div className="p-4">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                    <div className="text-4xl">📬</div>
                    <h3 className="font-bold text-primary">Message Sent!</h3>
                    <p className="text-sm text-muted-foreground">Thanks for reaching out. We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <p className="text-xs text-muted-foreground">Have a question or issue? Send us a message and we'll get back to you.</p>
                    <div className="space-y-2">
                      <Label htmlFor="help-name" className="text-xs">Your Name</Label>
                      <Input
                        id="help-name"
                        required
                        placeholder="Juan Dela Cruz"
                        className="rounded-xl h-9 text-sm"
                        value={contactForm.name}
                        onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="help-email" className="text-xs">Email Address</Label>
                      <Input
                        id="help-email"
                        type="email"
                        required
                        placeholder="juan@example.ph"
                        className="rounded-xl h-9 text-sm"
                        value={contactForm.email}
                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="help-message" className="text-xs">Message</Label>
                      <Textarea
                        id="help-message"
                        required
                        placeholder="Describe your issue or question..."
                        className="rounded-xl text-sm resize-none"
                        rows={4}
                        value={contactForm.message}
                        onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full rounded-xl">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`fixed bottom-5 right-4 sm:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 ${
          open
            ? "bg-foreground text-background rotate-0 scale-95"
            : "bg-primary text-primary-foreground hover:scale-110 hover:shadow-2xl hover:shadow-primary/40"
        }`}
        title={open ? "Close Help" : "Help Center"}
      >
        {open ? <X className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
      </button>
    </>
  );
}