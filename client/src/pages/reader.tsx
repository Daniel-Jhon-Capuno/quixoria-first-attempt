import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useBook } from "@/hooks/use-books";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Settings2, 
  ChevronLeft, 
  Type, 
  Sun, 
  AlignJustify,
  Maximize2,
  Minimize2
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const LOREM_IPSUM = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
`;

export default function ReaderPage() {
  const [, params] = useRoute("/reader/:id");
  const [, setLocation] = useLocation();
  const bookId = parseInt(params?.id || "0");
  const { data: book } = useBook(bookId);

  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [theme, setTheme] = useState("sepia"); // sepia, light, dark
  const [fullWidth, setFullWidth] = useState(false);

  const themes = {
    light: { bg: "bg-[#FBEFD7]", text: "text-[#2D1B14]" },
    sepia: { bg: "bg-[#f4ecd8]", text: "text-[#5b4636]" },
    dark: { bg: "bg-[#1a1a1a]", text: "text-[#e0e0e0]" }
  };

  const currentTheme = themes[theme as keyof typeof themes];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${currentTheme.bg}`}>
      {/* Reader Header */}
      <header className="fixed top-0 left-0 right-0 h-14 border-b bg-background/50 backdrop-blur-md flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/library")}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold line-clamp-1">{book?.title || "Reading..."}</h1>
            <p className="text-xs text-muted-foreground">{book?.author}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Reading Preferences</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-8">
                {/* Theme Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Sun className="w-4 h-4" /> Background
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(themes).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`h-10 rounded-lg border-2 transition-all ${
                          theme === t ? "border-primary ring-2 ring-primary/20" : "border-transparent"
                        } ${themes[t as keyof typeof themes].bg} ${themes[t as keyof typeof themes].text} text-xs font-bold capitalize`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Type className="w-4 h-4" /> Font Size
                    </label>
                    <span className="text-xs font-bold bg-secondary px-2 py-0.5 rounded">{fontSize}px</span>
                  </div>
                  <Slider 
                    value={[fontSize]} 
                    min={12} 
                    max={32} 
                    step={1} 
                    onValueChange={([val]) => setFontSize(val)} 
                  />
                </div>

                {/* Line Spacing */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <AlignJustify className="w-4 h-4" /> Spacing
                    </label>
                    <span className="text-xs font-bold bg-secondary px-2 py-0.5 rounded">{lineHeight.toFixed(1)}</span>
                  </div>
                  <Slider 
                    value={[lineHeight * 10]} 
                    min={10} 
                    max={25} 
                    step={1} 
                    onValueChange={([val]) => setLineHeight(val / 10)} 
                  />
                </div>

                {/* Layout Width */}
                <div className="space-y-3">
                   <label className="text-sm font-medium flex items-center gap-2">
                    {fullWidth ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />} Page Width
                  </label>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start font-normal" 
                    onClick={() => setFullWidth(!fullWidth)}
                  >
                    {fullWidth ? "Standard Layout" : "Full Width Layout"}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Reading Content */}
      <main className={`pt-24 pb-20 px-4 mx-auto transition-all duration-500 ${fullWidth ? 'max-w-none px-8 md:px-16 lg:px-32' : 'max-w-2xl'}`}>
        <div 
          className={`font-serif-book leading-relaxed ${currentTheme.text}`}
          style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
        >
          <h2 className="text-3xl font-display font-bold mb-8 text-center">Chapter One</h2>
          {LOREM_IPSUM.split('\n\n').map((para, i) => (
            <p key={i} className="mb-6">{para}</p>
          ))}
          {/* Repeat for length */}
          {LOREM_IPSUM.split('\n\n').map((para, i) => (
            <p key={i} className="mb-6">{para}</p>
          ))}
        </div>
      </main>
    </div>
  );
}
