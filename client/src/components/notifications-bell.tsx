import { useState, useMemo } from "react";
import { Bell, X, Zap, BookOpen, Star, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBooks } from "@/hooks/use-books";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "sale" | "new" | "reminder" | "tip";
  title: string;
  body: string;
  detail: string;
  icon: React.ReactNode;
  href?: string;
  actionLabel?: string;
  time: string;
}

function useNotifications(books: any[] | undefined) {
  return useMemo<Notification[]>(() => {
    const notifs: Notification[] = [
      {
        id: "flash", type: "sale",
        title: "Flash Sale Live!",
        body: "A book is 30% off for the next few hours.",
        detail: "A limited-time Flash Sale is happening right now in the store! One book has been randomly selected and marked down 30% off its original price. The deal resets every 6 hours — check the store banner before time runs out!",
        icon: <Zap className="w-4 h-4 text-yellow-500" />,
        href: "/", actionLabel: "Go to Store", time: "Just now",
      },
      {
        id: "genre", type: "new",
        title: "New Fantasy arrivals",
        body: "Fresh Fantasy picks have been added to the store.",
        detail: "New Fantasy titles have been added to Quixoria! Head to the store and filter by Fantasy to discover the latest additions — from epic sagas to magical adventures, something new is waiting for you.",
        icon: <BookOpen className="w-4 h-4 text-blue-500" />,
        href: "/", actionLabel: "Browse Store", time: "Today",
      },
      {
        id: "tip", type: "tip",
        title: "Reading tip",
        body: "Try reading 20 minutes a day to keep your streak going!",
        detail: "Did you know that reading just 20 minutes a day can significantly improve your vocabulary, focus, and knowledge? Try making it a daily habit — open a book from your library each day to keep your reading streak alive. Even a few pages count!",
        icon: <Star className="w-4 h-4 text-primary" />,
        time: "Yesterday",
      },
      {
        id: "wishlist", type: "reminder",
        title: "Wishlist reminder",
        body: "You have books saved to your wishlist. Ready to buy?",
        detail: "You have books sitting in your wishlist — great taste! Whenever you are ready, head to your Wishlist page to review your saved picks and add them to your cart. Do not let your future reads sit there forever!",
        icon: <ShoppingBag className="w-4 h-4 text-green-500" />,
        href: "/wishlist", actionLabel: "View Wishlist", time: "2 days ago",
      },
    ];

    if (books && books.length > 0) {
      const featured = books[Math.floor(Date.now() / 86400000) % books.length];
      notifs.unshift({
        id: "featured", type: "new",
        title: "Book of the Day updated!",
        body: featured.title + " is today featured pick.",
        detail: "Today Book of the Day is " + featured.title + " by " + featured.author + ". It has been handpicked as our daily spotlight. Check it out on the home page for the full details, description, and rating. A new book is featured every single day!",
        icon: <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />,
        href: "/book/" + featured.id, actionLabel: "View Book", time: "Just now",
      });
    }
    return notifs;
  }, [books]);
}

const typeColors: Record<string, string> = {
  sale: "bg-yellow-50 border-yellow-200",
  new: "bg-blue-50 border-blue-200",
  reminder: "bg-green-50 border-green-200",
  tip: "bg-primary/5 border-primary/20",
};
const typeBg: Record<string, string> = {
  sale: "from-yellow-50 to-amber-50 border-yellow-200",
  new: "from-blue-50 to-sky-50 border-blue-200",
  reminder: "from-green-50 to-emerald-50 border-green-200",
  tip: "from-primary/5 to-primary/10 border-primary/20",
};

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Notification | null>(null);
  const [read, setRead] = useState<Set<string>>(new Set());
  const { data: books } = useBooks();
  const [, setLocation] = useLocation();
  const notifications = useNotifications(books);
  const unread = notifications.filter(n => !read.has(n.id)).length;

  const markAllRead = () => setRead(new Set(notifications.map(n => n.id)));
  const handleClickNotif = (notif: Notification) => { setRead(prev => new Set([...prev, notif.id])); setSelected(notif); };
  const handleAction = (notif: Notification) => { if (notif.href) { setSelected(null); setOpen(false); setLocation(notif.href); } };

  return (
    <div className="relative">
      <button onClick={() => { setOpen(o => !o); setSelected(null); }}
        className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-[10px] font-black rounded-full flex items-center justify-center px-1">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSelected(null); }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }} transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 w-80 z-50 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">

              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.15 }}>
                    <div className="flex items-center gap-2 px-4 py-3 border-b">
                      <button onClick={() => setSelected(null)}
                        className="text-muted-foreground hover:text-foreground p-1 -ml-1 rounded-lg hover:bg-secondary">
                        <ArrowRight className="w-4 h-4 rotate-180" />
                      </button>
                      <span className="font-bold text-sm flex-1">Notification</span>
                      <button onClick={() => { setOpen(false); setSelected(null); }} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className={"m-3 rounded-2xl border-2 bg-gradient-to-br p-5 " + typeBg[selected.type]}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={"w-10 h-10 rounded-full flex items-center justify-center border " + typeColors[selected.type]}>{selected.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm leading-tight">{selected.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{selected.time}</p>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{selected.detail}</p>
                    </div>
                    {selected.href && selected.actionLabel && (
                      <div className="px-3 pb-3">
                        <Button className="w-full rounded-xl" onClick={() => handleAction(selected)}>
                          {selected.actionLabel} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.15 }}>
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-primary" />
                        <span className="font-bold text-sm">Notifications</span>
                        {unread > 0 && <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-bold">{unread} new</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        {unread > 0 && <button onClick={markAllRead} className="text-xs text-primary hover:underline font-medium">Mark all read</button>}
                        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
                      {notifications.map(notif => {
                        const isRead = read.has(notif.id);
                        return (
                          <button key={notif.id} onClick={() => handleClickNotif(notif)}
                            className={"w-full text-left px-4 py-3 hover:bg-secondary/50 transition-colors flex gap-3 items-start" + (!isRead ? " bg-primary/[0.03]" : "")}>
                            <div className={"w-8 h-8 rounded-full flex items-center justify-center shrink-0 border " + typeColors[notif.type]}>{notif.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={"text-xs font-bold leading-tight " + (!isRead ? "text-foreground" : "text-muted-foreground")}>{notif.title}</p>
                                {!isRead && <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-0.5" />}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.body}</p>
                              <p className="text-[10px] text-muted-foreground/60 mt-1">{notif.time}</p>
                            </div>
                            <ArrowRight className="w-3 h-3 text-muted-foreground/40 shrink-0 mt-1" />
                          </button>
                        );
                      })}
                    </div>
                    <div className="px-4 py-2.5 border-t bg-secondary/20 text-center">
                      <p className="text-xs text-muted-foreground">Tap a notification to read more</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}