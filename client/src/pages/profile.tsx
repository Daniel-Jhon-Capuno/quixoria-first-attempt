import { useAuth } from "@/hooks/use-auth";
import { Layout } from "@/components/layout";
import { useLibrary } from "@/hooks/use-books";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Book, Trophy, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const { user, isLoading, logout } = useAuth();
  const { data: library } = useLibrary();

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
    window.location.href = "/api/login";
    return null;
  }

  const completedBooks = library?.filter(item => item.progress === 100).length || 0;
  const totalBooks = library?.length || 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10 mb-8 flex flex-col md:flex-row items-center gap-8">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {user.firstName?.[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold font-display text-primary mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-muted-foreground mb-4">{user.email}</p>
              <div className="flex gap-2 justify-center md:justify-start">
                <Button variant="outline" onClick={() => logout()}>Log Out</Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 text-center bg-secondary/30 p-6 rounded-xl">
               <div>
                 <div className="text-3xl font-bold text-primary">{totalBooks}</div>
                 <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Books</div>
               </div>
               <div className="w-px bg-primary/20"></div>
               <div>
                 <div className="text-3xl font-bold text-primary">{completedBooks}</div>
                 <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Read</div>
               </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Reading Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${totalBooks > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                    <h4 className="font-bold text-sm mb-1">First Steps</h4>
                    <p className="text-xs text-muted-foreground">Purchased your first book</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${completedBooks > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                    <h4 className="font-bold text-sm mb-1">Bookworm</h4>
                    <p className="text-xs text-muted-foreground">Finished reading a book</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${totalBooks >= 10 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                    <h4 className="font-bold text-sm mb-1">Collector</h4>
                    <p className="text-xs text-muted-foreground">Owned 10+ books</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Card */}
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
                    {library.slice(0, 3).map(item => (
                      <li key={item.id} className="flex items-center gap-3">
                         <div className="h-12 w-8 bg-muted rounded overflow-hidden flex-shrink-0">
                           <img src={item.book.coverUrl} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium truncate">{item.book.title}</p>
                           <div className="w-full bg-secondary h-1.5 rounded-full mt-1.5">
                             <div 
                               className="bg-primary h-1.5 rounded-full" 
                               style={{ width: `${item.progress}%` }} 
                             />
                           </div>
                         </div>
                         <span className="text-xs font-bold text-primary">{item.progress}%</span>
                      </li>
                    ))}
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
