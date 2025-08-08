import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoryItem } from "@/types";

interface HistoryTabProps {
  history: HistoryItem[];
  onWordClick: (id: string) => void;
}

export default function HistoryTab({ history, onWordClick }: HistoryTabProps) {
  return (
    <ScrollArea className="h-screen max-h-[calc(100vh-400px)]">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {history.length === 0 ? (
          <div className="col-span-3 text-center text-muted-foreground py-8">
            Not found history
          </div>
        ) : (
          history.map((item, index) => (
            item.word && (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => onWordClick(item.word!.id)}
                className="h-12 bg-accent text-word-button-foreground font-normal"
              >
                {item.word.value}
              </Button>
            )
          ))
        )}
      </div>
    </ScrollArea>
  );
}