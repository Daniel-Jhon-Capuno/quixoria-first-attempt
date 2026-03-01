import { useState, useEffect, useRef, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { useBook, useUpdateProgress, useLibrary } from "@/hooks/use-books";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings2, ChevronLeft, Type, Sun, AlignJustify,
  Maximize2, Minimize2, Highlighter, Trash2, BookMarked,
  MessageSquare, X,
} from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const BOOK_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.

Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.

Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.

Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.

Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis.

Phasellus lacus. Etiam laoreet quam sed arcu. Phasellus at dui in ligula mollis ultricies. Integer placerat tristique nisl. Praesent augue. Fusce commodo. Vestibulum convallis, lorem a tempus semper, dui dui euismod elit, vitae placerat urna tortor vitae lacus. Nullam aliquet, urna ac semper mollis.

Donec aliquet, tortor sed accumsan bibendum, erat ligula aliquet magna, vitae ornare odio metus a mi. Morbi ac orci et nisl hendrerit mollis. Suspendisse ut massa. Cras nec ante. Pellentesque a nulla. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.`;

const HIGHLIGHT_COLORS = [
  { id: "yellow", label: "Yellow", hex: "#fef08a" },
  { id: "green",  label: "Green",  hex: "#bbf7d0" },
  { id: "blue",   label: "Blue",   hex: "#bfdbfe" },
  { id: "pink",   label: "Pink",   hex: "#fbcfe8" },
  { id: "orange", label: "Orange", hex: "#fed7aa" },
];

interface Highlight {
  id: string;
  text: string;
  color: string;
  note?: string;
}

export default function ReaderPage() {
  const [, params] = useRoute("/reader/:id");
  const [, setLocation] = useLocation();
  const bookId = parseInt(params?.id || "0");
  const { data: book } = useBook(bookId);
  const { data: library } = useLibrary();
  const updateProgress = useUpdateProgress();

  const [fontSize, setFontSize]     = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [theme, setTheme]           = useState("sepia");
  const [fullWidth, setFullWidth]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [savedProgress, setSavedProgress] = useState<number | null>(null);

  const [highlights, setHighlights] = useState<Highlight[]>(() => {
    try {
      const s = localStorage.getItem(`highlights-${bookId}`);
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });

  const [selectedText, setSelectedText]   = useState("");
  const [pendingColor, setPendingColor]   = useState<string | null>(null);
  const [noteText, setNoteText]           = useState("");
  const [showNoteDialog, setShowNoteDialog] = useState(false);

  // For remove confirm
  const [highlightToRemove, setHighlightToRemove] = useState<string | null>(null);

  // For viewing a highlight's note on click
  const [viewingHighlight, setViewingHighlight] = useState<Highlight | null>(null);

  const progressTimer    = useRef<NodeJS.Timeout>();
  const progressRestored = useRef(false);
  const markerRef        = useRef<HTMLDivElement>(null);

  const themes = {
    light: { bg: "#ffffff", text: "#1a1a1a" },
    sepia: { bg: "#f4ecd8", text: "#5b4636" },
    dark:  { bg: "#1a1a1a", text: "#e0e0e0" },
  };
  const currentTheme = themes[theme as keyof typeof themes];
  const libraryItem  = library?.find((item: any) => item.bookId === bookId);

  useEffect(() => {
    if (libraryItem?.readingProgress && !progressRestored.current) {
      progressRestored.current = true;
      const pct = libraryItem.readingProgress;
      setProgress(pct);
      if (pct > 0) {
        setSavedProgress(pct);
        setTimeout(() => {
          const docH = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo(0, (docH * pct) / 100);
        }, 300);
      }
    }
  }, [libraryItem]);

  useEffect(() => {
    localStorage.setItem(`highlights-${bookId}`, JSON.stringify(highlights));
  }, [highlights, bookId]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) return;
    const pct = Math.min(100, Math.round((scrollTop / docH) * 100));
    setProgress(pct);
    if (progressTimer.current) clearTimeout(progressTimer.current);
    progressTimer.current = setTimeout(() => {
      if (libraryItem) updateProgress.mutate({ id: libraryItem.id, progress: pct });
    }, 2000);
  }, [libraryItem, updateProgress]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (progressTimer.current) clearTimeout(progressTimer.current);
    };
  }, [handleScroll]);

  const jumpToMarker = () => {
    markerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleMouseUp = useCallback(() => {
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;
      const text = sel.toString().trim();
      if (text.length >= 2) setSelectedText(text);
    }, 10);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest(".highlight-toolbar")) {
      setSelectedText("");
    }
  }, []);

  // Step 1: user picks a color → open note dialog
  const pickColor = (color: string) => {
    if (!selectedText) return;
    setPendingColor(color);
    setNoteText("");
    setShowNoteDialog(true);
    window.getSelection()?.removeAllRanges();
    setSelectedText("");
  };

  // Step 2: user confirms (with or without a note) → save highlight
  const saveHighlight = () => {
    if (!pendingColor) return;
    setHighlights(prev => [
      ...prev,
      { id: Date.now().toString(), text: selectedText || pendingColor, color: pendingColor, note: noteText.trim() || undefined },
    ]);
    setShowNoteDialog(false);
    setPendingColor(null);
    setNoteText("");
  };

  // When user clicks a highlight in text → show view/remove dialog
  const handleHighlightClick = (h: Highlight) => {
    setViewingHighlight(h);
  };

  const confirmRemove = () => {
    if (!viewingHighlight) return;
    setHighlightToRemove(viewingHighlight.id);
    setViewingHighlight(null);
  };

  const doRemove = () => {
    if (!highlightToRemove) return;
    setHighlights(prev => prev.filter(h => h.id !== highlightToRemove));
    setHighlightToRemove(null);
  };

  // Remove from sidebar list
  const removeFromList = (id: string) => {
    setHighlightToRemove(id);
  };

  const renderText = (text: string): (string | JSX.Element)[] => {
    if (highlights.length === 0) return [text];
    let parts: (string | JSX.Element)[] = [text];
    highlights.forEach(h => {
      const next: (string | JSX.Element)[] = [];
      parts.forEach((part, pi) => {
        if (typeof part !== "string") { next.push(part); return; }
        const idx = part.indexOf(h.text);
        if (idx === -1) { next.push(part); return; }
        if (idx > 0) next.push(part.slice(0, idx));
        next.push(
          <mark
            key={`${h.id}-${pi}`}
            style={{ backgroundColor: HIGHLIGHT_COLORS.find(c => c.id === h.color)?.hex, borderRadius: 3, padding: "1px 2px", cursor: "pointer", position: "relative" }}
            onClick={() => handleHighlightClick(h)}
            title={h.note ? `Note: ${h.note}` : "Click to view or remove"}
          >
            {h.text}
            {h.note && (
              <MessageSquare
                style={{ display: "inline", marginLeft: 3, verticalAlign: "middle", width: 12, height: 12, opacity: 0.6 }}
              />
            )}
          </mark>
        );
        next.push(part.slice(idx + h.text.length));
      });
      parts = next;
    });
    return parts;
  };

  const paragraphs = BOOK_TEXT.split("\n\n").filter(p => p.trim());
  const markerAfterIndex = savedProgress !== null && savedProgress > 0
    ? Math.max(0, Math.floor((savedProgress / 100) * paragraphs.length) - 1)
    : null;
  const hasSelection = selectedText.length > 0;

  // The text that was selected when color was picked (we need to save it before clearing)
  const [capturedText, setCapturedText] = useState("");

  const pickColorFull = (color: string) => {
    if (!selectedText) return;
    setCapturedText(selectedText);
    setPendingColor(color);
    setNoteText("");
    setShowNoteDialog(true);
    window.getSelection()?.removeAllRanges();
    setSelectedText("");
  };

  const saveHighlightFull = () => {
    if (!pendingColor || !capturedText) return;
    setHighlights(prev => [
      ...prev,
      { id: Date.now().toString(), text: capturedText, color: pendingColor, note: noteText.trim() || undefined },
    ]);
    setShowNoteDialog(false);
    setPendingColor(null);
    setNoteText("");
    setCapturedText("");
  };

  return (
    <div
      style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, minHeight: "100vh" }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-40 h-14 border-b flex items-center justify-between px-4 gap-4 backdrop-blur-md"
        style={{ backgroundColor: currentTheme.bg + "ee" }}
      >
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/library")} className="rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold line-clamp-1">{book?.title || "Reading..."}</h1>
            <p className="text-xs opacity-50">{book?.author}</p>
          </div>
        </div>

        {/* Highlight toolbar */}
        <div className="highlight-toolbar flex items-center gap-2 flex-1 justify-center">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 transition-all duration-200 ${
            hasSelection ? "border-primary bg-primary/5 shadow-md scale-105" : "border-border opacity-40"
          }`}>
            <Highlighter className={`w-4 h-4 shrink-0 ${hasSelection ? "text-primary" : "text-muted-foreground"}`} />
            <span className="text-xs font-medium hidden sm:block max-w-[120px] truncate">
              {hasSelection ? `"${selectedText.slice(0, 18)}${selectedText.length > 18 ? "…" : ""}"` : "Select to highlight"}
            </span>
            <div className={`flex items-center gap-1.5 ml-1 transition-all duration-200 ${hasSelection ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
              {HIGHLIGHT_COLORS.map(color => (
                <button
                  key={color.id}
                  onClick={() => pickColorFull(color.id)}
                  disabled={!hasSelection}
                  title={color.label}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-125 disabled:cursor-not-allowed"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {savedProgress !== null && savedProgress > 0 && (
            <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs hidden sm:flex" onClick={jumpToMarker}>
              <BookMarked className="w-3.5 h-3.5" />
              Last read
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full gap-2">
                <Settings2 className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader><SheetTitle>Reading Preferences</SheetTitle></SheetHeader>
              <div className="py-6 space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2"><Sun className="w-4 h-4" /> Background</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(themes) as (keyof typeof themes)[]).map(t => (
                      <button key={t} onClick={() => setTheme(t)}
                        className={`h-12 rounded-xl border-2 text-xs font-bold capitalize transition-all ${theme === t ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
                        style={{ backgroundColor: themes[t].bg, color: themes[t].text }}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2"><Type className="w-4 h-4" /> Font Size</label>
                    <span className="text-xs font-bold bg-secondary px-2 py-0.5 rounded">{fontSize}px</span>
                  </div>
                  <Slider value={[fontSize]} min={12} max={32} step={1} onValueChange={([v]) => setFontSize(v)} />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2"><AlignJustify className="w-4 h-4" /> Line Spacing</label>
                    <span className="text-xs font-bold bg-secondary px-2 py-0.5 rounded">{lineHeight.toFixed(1)}</span>
                  </div>
                  <Slider value={[lineHeight * 10]} min={12} max={28} step={1} onValueChange={([v]) => setLineHeight(v / 10)} />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    {fullWidth ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />} Page Width
                  </label>
                  <Button variant="outline" className="w-full" onClick={() => setFullWidth(!fullWidth)}>
                    {fullWidth ? "Standard Layout" : "Full Width Layout"}
                  </Button>
                </div>

                {/* Highlights list in sidebar */}
                {highlights.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Highlighter className="w-4 h-4" /> My Highlights ({highlights.length})
                    </label>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {highlights.map(h => (
                        <div key={h.id} className="p-2 rounded-lg bg-secondary/50 space-y-1">
                          <div className="flex items-start gap-2">
                            <div className="w-3 h-3 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: HIGHLIGHT_COLORS.find(c => c.id === h.color)?.hex }} />
                            <p className="text-xs flex-1 line-clamp-2 italic">"{h.text}"</p>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-destructive shrink-0" onClick={() => removeFromList(h.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          {h.note && (
                            <p className="text-xs text-muted-foreground pl-5 flex items-start gap-1">
                              <MessageSquare className="w-3 h-3 shrink-0 mt-0.5" />
                              {h.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Content */}
      <main
        className={`pt-20 pb-24 px-6 mx-auto transition-all duration-300 ${fullWidth ? "max-w-none lg:px-32" : "max-w-2xl"}`}
        onMouseUp={handleMouseUp}
      >
        <h2 className="text-3xl font-bold mb-10 text-center">Chapter One</h2>
        {paragraphs.map((para, i) => (
          <div key={i}>
            <p className="mb-6 text-justify" style={{ fontSize: `${fontSize}px`, lineHeight }}>
              {renderText(para.trim())}
            </p>
            {markerAfterIndex === i && (
              <div ref={markerRef} className="relative flex items-center gap-3 my-8 select-none">
                <div className="flex-1 h-px bg-primary/40" />
                <div className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-md shrink-0">
                  <BookMarked className="w-3.5 h-3.5" />
                  You left off here
                </div>
                <div className="flex-1 h-px bg-primary/40" />
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Bottom progress */}
      <div className="fixed bottom-0 left-0 right-0 h-10 border-t flex items-center gap-3 px-4 z-40 backdrop-blur"
        style={{ backgroundColor: currentTheme.bg + "ee" }}>
        <span className="text-xs opacity-40 shrink-0">0%</span>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-black/10">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-bold shrink-0 opacity-70">{progress}%</span>
      </div>

      {/* ── Note Dialog (after picking color) ── */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: HIGHLIGHT_COLORS.find(c => c.id === pendingColor)?.hex }} />
              Add a Note (optional)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="bg-secondary/50 rounded-xl p-3 text-sm italic text-muted-foreground line-clamp-3">
              "{capturedText}"
            </div>
            <Textarea
              placeholder="Write a note or comment about this highlight... (optional)"
              className="rounded-xl resize-none"
              rows={3}
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => { setShowNoteDialog(false); setPendingColor(null); setCapturedText(""); }}>
              Cancel
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={saveHighlightFull}>
              Skip Note
            </Button>
            <Button className="rounded-xl" onClick={saveHighlightFull} disabled={!noteText.trim() && noteText.length > 0}>
              Save Highlight
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── View Highlight Dialog (click on highlight in text) ── */}
      <Dialog open={!!viewingHighlight} onOpenChange={v => !v && setViewingHighlight(null)}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white shadow shrink-0"
                style={{ backgroundColor: HIGHLIGHT_COLORS.find(c => c.id === viewingHighlight?.color)?.hex }} />
              Highlight
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-xl p-3 text-sm italic border" style={{ backgroundColor: HIGHLIGHT_COLORS.find(c => c.id === viewingHighlight?.color)?.hex + "66" }}>
              "{viewingHighlight?.text}"
            </div>
            {viewingHighlight?.note ? (
              <div className="flex items-start gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-xl p-3">
                <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                <p>{viewingHighlight.note}</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center">No note added to this highlight.</p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="destructive" className="rounded-xl gap-2" onClick={confirmRemove}>
              <Trash2 className="w-4 h-4" /> Remove Highlight
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => setViewingHighlight(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Remove Confirm Dialog ── */}
      <AlertDialog open={!!highlightToRemove} onOpenChange={v => !v && setHighlightToRemove(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Highlight?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the highlight{highlights.find(h => h.id === highlightToRemove)?.note ? " and its note" : ""}. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Keep it</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={doRemove}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}