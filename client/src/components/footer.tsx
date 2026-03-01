import { Link } from "wouter";
import { Heart, BookOpen, Mail, Github } from "lucide-react";
import logoImg from "@/assets/logo1.png";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-[#FBEFD7]/60 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3 group">
              <img src={logoImg} alt="Quixoria" className="h-12 w-auto object-contain" />
              <span className="font-display font-bold text-xl text-primary">Quixoria</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your cozy corner for digital reading. Discover, collect, and enjoy great books.
            </p>
            <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500 mx-0.5" />
              <span>for readers</span>
            </div>
          </div>

          {/* Store */}
          <div>
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider mb-4">Store</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Browse All Books", href: "/" },
                { label: "Wishlist",         href: "/wishlist" },
                { label: "My Library",       href: "/library" },
                { label: "Order History",    href: "/orders" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider mb-4">Genres</h4>
            <ul className="space-y-2.5">
              {["Classic", "Dystopian", "Fiction", "Romance", "Fantasy"].map(genre => (
                <li key={genre}>
                  <Link href={`/?search=${genre}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {genre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider mb-4">About</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Quixoria", href: "/about" },
                { label: "Contact Us",    href: "/contact" },
                { label: "Terms of Use",  href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} Quixoria. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Digital books for every reader</span>
            <BookOpen className="w-3.5 h-3.5 text-primary/40" />
          </div>
        </div>
      </div>
    </footer>
  );
}