import { useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Word } from "@/types";

interface WordListTabProps {
  words: Word[];
  loading: boolean;
  isSearching: boolean;
  nextCursor: string | null;
  onWordClick: (id: string) => void;
  onLoadMore: (cursor: string) => void;
}

export default function WordListTab({
  words,
  loading,
  isSearching,
  nextCursor,
  onWordClick,
  onLoadMore,
}: WordListTabProps) {
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Callback para o intersection observer
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && nextCursor && !loading && !isSearching) {
        onLoadMore(nextCursor);
      }
    },
    [nextCursor, loading, isSearching, onLoadMore]
  );

  // Scroll infinito
  useEffect(() => {
    const node = observerTarget.current;
    if (!node) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px 0px 100px 0px",
      threshold: 0.1,
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleIntersection]); // Dependência do callback

  return (
    <ScrollArea className="h-screen max-h-[calc(100vh-320px)]">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {words.length === 0 && !loading ? (
          <div className="col-span-3 text-center text-muted-foreground py-8">
            Not found words
          </div>
        ) : (
          words.map((word, index) => (
            <Button
              key={index}
              variant="ghost"
              size="lg"
              className="h-16 bg-accent font-normal text-sm hover:bg-accent/80 transition-colors"
              onClick={() => onWordClick(word.id)}
            >
              {word.value}
            </Button>
          ))
        )}
      </div>
      {loading && (
        <div className="py-2 text-center text-muted-foreground">Carregando...</div>
      )}
      {!isSearching && <div ref={observerTarget} className="h-2" />}
    </ScrollArea>
  );
}