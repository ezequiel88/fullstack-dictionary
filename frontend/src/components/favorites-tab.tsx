import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FavoriteItem } from "@/types";

interface FavoritesTabProps {
  favorites: FavoriteItem[];
  onWordClick: (id: string) => void;
}

export default function FavoritesTab({ favorites, onWordClick }: FavoritesTabProps) {
  return (
    <ScrollArea className="h-screen max-h-[calc(100vh-400px)]">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {favorites.length === 0 ? (
          <div className="col-span-3 text-center text-muted-foreground py-8">
            Not found favorites
          </div>
        ) : (
          favorites.map((favorite, index) => (
            favorite.word && (
              <Button
                key={index}
                variant="ghost"
                size="lg"
                onClick={() => onWordClick(favorite.word!.id)}
                className="h-16 bg-accent text-word-button-foreground font-normal text-sm hover:bg-accent/80 transition-colors"
              >
                {favorite.word.value}
              </Button>
            )
          ))
        )}
      </div>
    </ScrollArea>
  );
}