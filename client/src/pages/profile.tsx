import { useAuth } from "@/hooks/use-auth";
import { Layout } from "@/components/layout";
import { useLibrary } from "@/hooks/use-books";
import { useReadingStreak } from "@/hooks/use-reading-streak";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Book, Trophy, LogOut, Flame, Star, Target } from "lucide-react";
import { Link } from "wouter";
import { ConfirmDialog } from "@/components/confirm-dialog";

export default function Profile() {
  const { user, isLoading, logout } = useAuth();
  const { data: library } = useLibrary();
  const { streak } = useReadingStreak();

  if (isLoading) {
    return (
      <Layout>
        <div className="h-[50vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  const totalBooks      = library?.length || 0;
  const completedBooks  = library?.filter(item => (item.readingProgress ?? 0) >= 100).length || 0;
  const inProgressBooks = library?.filter(item => {
    const p = item.readingProgress ?? 0;
    return p > 0 && p < 100;
  }).length || 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-[#FBEFD7] rounded-3xl p-8 border border-primary/10 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-8">
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl shrink-0">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {user.firstName?.[0] || user.username?.[0] || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold font-display text-primary mb-1">
                {user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.username}
              </h1>
              <p className="text-muted-foreground mb-4">{user.email || "No email set"}</p>
              <div className="flex gap-2 justify-center md:justify-start">
                <ConfirmDialog
                  trigger={
                    <Button variant="outline" className="gap-2 rounded-xl">
                      <LogOut className="w-4 h-4" /> Log Out
                    </Button>
                  }
                  title="Log Out"
                  description="Are you sure you want to log out of your account?"
                  confirmLabel="Log Out"
                  cancelLabel="Stay"
                  variant="destructive"
                  onConfirm={() => logout()}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 text-center bg-white/60 p-6 rounded-2xl border border-primary/10 shrink-0">
              {[
                { label: "Books",   value: totalBooks },
                { label: "Reading", value: inProgressBooks },
                { label: "Done",    value: completedBooks },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-center gap-6">
                  <div>
                    <div className="text-3xl font-black text-primary">{s.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{s.label}</div>
                  </div>
                  {i < arr.length - 1 && <div className="w-px h-10 bg-primary/15" />}
                </div>
              ))}
            </div>
          </div>

          {/* Reading Streak */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: <Flame className="w-6 h-6" />,
                label: "Current Streak",
                value: `${streak.current} day${streak.current !== 1 ? "s" : ""}`,
                sub: streak.current > 0 ? "Keep it up! 🔥" : "Start reading today!",
                color: "text-orange-500 bg-orange-50 border-orange-200",
              },
              {
                icon: <Trophy className="w-6 h-6" />,
                label: "Longest Streak",
                value: `${streak.longest} day${streak.longest !== 1 ? "s" : ""}`,
                sub: "Your personal best",
                color: "text-yellow-600 bg-yellow-50 border-yellow-200",
              },
              {
                icon: <Target className="w-6 h-6" />,
                label: "Completion Rate",
                value: totalBooks > 0 ? `${Math.round((completedBooks / totalBooks) * 100)}%` : "0%",
                sub: `${completedBooks} of ${totalBooks} books finished`,
                color: "text-green-600 bg-green-50 border-green-200",
              },
            ].map(stat => (
              <div key={stat.label} className={`flex items-center gap-4 p-5 rounded-2xl border-2 ${stat.color}`}>
                <div className="shrink-0">{stat.icon}</div>
                <div>
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="text-xs font-bold uppercase tracking-wide opacity-70">{stat.label}</p>
                  <p className="text-xs opacity-60 mt-0.5">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "First Steps 📚", desc: "Purchase your first book", unlocked: totalBooks > 0 },
                    { label: "Bookworm 🐛",    desc: "Finish reading a book",    unlocked: completedBooks > 0 },
                    { label: "Collector 🏆",   desc: "Own 5+ books",             unlocked: totalBooks >= 5 },
                    { label: "Avid Reader 🌟", desc: "Finish 3 books",           unlocked: completedBooks >= 3 },
                  ].map(a => (
                    <div key={a.label} className={`p-4 rounded-xl border-2 ${a.unlocked ? "bg-green-50 border-green-200" : "bg-primary/5 border-primary/10 opacity-50"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm mb-1">{a.label}</h4>
                          <p className="text-xs text-muted-foreground">{a.desc}</p>
                        </div>
                        {a.unlocked && <span className="text-green-600 text-lg">✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Books */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-primary" />
                  Recent Books
                </CardTitle>
              </CardHeader>
              <CardContent>
                {library && library.length > 0 ? (
                  <ul className="space-y-4">
                    {library.slice(0, 4).map(item => {
                      const progress = item.readingProgress ?? 0;
                      return (
                        <li key={item.id} className="flex items-center gap-3">
                          <div className="h-12 w-8 bg-muted rounded overflow-hidden shrink-0">
                            <img src={item.book.coverUrl ?? ""} className="w-full h-full object-cover" alt={item.book.title} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.book.title}</p>
                            <div className="w-full bg-secondary h-1.5 rounded-full mt-1.5 overflow-hidden">
                              <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                          <span className="text-xs font-bold text-primary shrink-0">{progress}%</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-4">No books in library yet.</p>
                    <Button size="sm" asChild>
                      <Link href="/">Browse Store</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}