"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FavoriteItem, HistoryItem, Word, WordDefinition, WordListResponse } from "@/types";
import api from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import WordCard from "@/components/word-card";

import { getHistory } from "@/actions/history";
import { getFavorites, markAsFavorite, removeFavorite } from "@/actions/favorite";
import { showToast } from "@/lib/toast";

export default function Dictionary() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialSearch = searchParams.get("search") ?? "";
    const initialCursor = searchParams.get("cursor") ?? null;

    const [activeTab, setActiveTab] = useState("wordlist");
    const [search, setSearch] = useState(initialSearch);

    const [words, setWords] = useState<Word[]>([]);
    const [word, setWord] = useState<WordDefinition | null>(null);

    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    const [nextCursor, setNextCursor] = useState<string | null>(initialCursor);
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const observerTarget = useRef<HTMLDivElement | null>(null);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const updateURL = useCallback((params: { search?: string; cursor?: string | null }) => {
        const urlParams = new URLSearchParams(window.location.search);
        if (params.search !== undefined) {
            params.search ? urlParams.set("search", params.search) : urlParams.delete("search");
        }
        if (params.cursor !== undefined) {
            params.cursor ? urlParams.set("cursor", params.cursor) : urlParams.delete("cursor");
        }
        router.replace(`?${urlParams.toString()}`);
    }, [router]);

    const fetchWord = useCallback(async (id: string) => {
        try {
            const { data } = await api.get<WordDefinition>(`/entries/en/${id}`);
            setWord(data);
            console.log(data);
        } catch (error) {
            showToast.dictionary.fetchWordError();
            console.error("Erro ao buscar palavra:", error);
        }
    }, []);

    const fetchHistory = useCallback(async () => {
        try {
            const res = await getHistory();
            if (res.success) {
                setHistory(res.data);
                console.log(res.data);
            }
        } catch (error) {
            showToast.history.fetchError();
            console.error("Erro ao buscar histórico:", error);
        }
    }, []);

    const fetchFavorites = useCallback(async () => {
        try {
            const res = await getFavorites();
            if (res.success) {
                console.log(res.data);
                setFavorites(res.data);
            }
        } catch (error) {
            showToast.favorites.fetchError();
            console.error("Erro ao buscar favoritos:", error);
        }
    }, []);

    const markFavorite = useCallback(async (id: string) => {
        try {
            await markAsFavorite(id);
            fetchFavorites();
        } catch (error) {
            showToast.favorites.markError();
            console.error("Erro ao marcar favorito:", error);
        }
    }, []);

    const unmarkFavorite = useCallback(async (id: string) => {
        try {
            await removeFavorite(id);
            fetchFavorites();
        } catch (error) {
            showToast.favorites.removeError();
            console.error("Erro ao desmarcar favorito:", error);
        }
    }, []);

    const fetchWords = useCallback(
        async (cursorToken?: string, append = false, query?: string) => {
            if (loading) return;
            setLoading(true);

            const url =
                query && !cursorToken
                    ? `/entries/en?search=${query}`
                    : cursorToken
                        ? `/entries/en?limit=50&next=${cursorToken}${search.trim() ? `&search=${search.trim()}` : ""}`
                        : "/entries/en?limit=50";

            try {
                const { data } = await api.get<WordListResponse>(url);

                setWords((prev) => (append ? [...prev, ...data.results] : data.results));
                setNextCursor(data.next || null);

                if (!append) {
                    updateURL({ search: query ?? search, cursor: data.next ?? null });
                }
            } catch (error) {
                showToast.dictionary.fetchWordsError();
                console.error("Erro ao buscar palavras:", error);
            } finally {
                setLoading(false);
            }
        },
        [loading, search, updateURL]
    );

    useEffect(() => {
        if (activeTab === "history") {
            fetchHistory();
        }
        if (activeTab === "favorites") {
            fetchFavorites();
        }
    }, [activeTab]);


    // Busca inicial: respeita a URL se houver parâmetros, senão busca padrão
    useEffect(() => {
        if (initialSearch.trim().length > 0) {
            fetchWords(initialCursor || undefined, false, initialSearch.trim());
        } else {
            fetchWords();
        }
    }, []);

    // Busca quando usuário digita (com debounce)
    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            if (search.trim().length > 0) {
                setIsSearching(true);
                fetchWords(undefined, false, search.trim()).finally(() =>
                    setIsSearching(false)
                );
            } else {
                fetchWords();
            }
        }, 500);

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [search]);

    // Scroll infinito
    useEffect(() => {
        const node = observerTarget.current;
        if (!node) return;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && nextCursor && !loading) {
                fetchWords(nextCursor, true);
            }
        }, { root: null, rootMargin: "0px 0px 100px 0px", threshold: 0.5 });

        observer.observe(node);
        return () => observer.disconnect();
    }, [nextCursor, loading, fetchWords]);

    const handleToggleFavorite = (word: WordDefinition) => {
        if (word.isFavorite) {
            setWord((prev) =>
                prev
                    ? { ...prev, isFavorite: false }
                    : prev
            );
            unmarkFavorite(word.id);
        } else {
            setWord((prev) =>
                prev
                    ? { ...prev, isFavorite: true }
                    : prev
            );
            markFavorite(word.id);
        }
    };


    return (
        <div className="container mx-auto max-w-6xl p-4 space-y-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Learning Area */}

                <WordCard word={word} onToggleFavorite={handleToggleFavorite} />

                {/* Word List Sidebar */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="@container/card pt-0">
                        <CardContent className="p-4 md:p-6  pb-2">
                            <Tabs defaultValue="wordlist" value={activeTab} onValueChange={setActiveTab}>
                                <div className="grid grid-cols-3 gap-2">
                                    <TabsList className="col-span-3 md:col-span-2 grid grid-cols-3 h-10">
                                        <TabsTrigger className="px-8" value="wordlist">
                                            Word list
                                        </TabsTrigger>
                                        <TabsTrigger className="px-8" value="history">
                                            History
                                        </TabsTrigger>
                                        <TabsTrigger className="px-8" value="favorites">
                                            Favorites
                                        </TabsTrigger>
                                    </TabsList>
                                    <div className="mt-2 md:mt-0 col-span-3 md:col-span-1 flex items-center">
                                        {activeTab === "wordlist" && (
                                            <Input
                                                type="search"
                                                placeholder="Search words..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="h-10 flex-1 w-full"
                                            />
                                        )}
                                    </div>
                                </div>
                                <TabsContent value="wordlist" className="mt-4">
                                    <ScrollArea className="h-screen max-h-[calc(100vh-400px)]">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">

                                            {
                                                words.length === 0 && !loading ? (
                                                    <div className="col-span-3 text-center text-muted-foreground py-8">
                                                        Not found words
                                                    </div>
                                                )
                                                    :
                                                    words.map((word, index) => (
                                                        <Button
                                                            key={index}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-12 bg-accent font-normal"
                                                            onClick={() => fetchWord(word.id)}
                                                        >
                                                            {word.value}
                                                        </Button>
                                                    ))}
                                        </div>
                                        {loading && (
                                            <div className="py-2 text-center text-muted-foreground">Carregando...</div>
                                        )}
                                        {!isSearching && <div ref={observerTarget} className="h-2" />}
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent value="history" className="mt-4">
                                    <ScrollArea className="h-screen max-h-[calc(100vh-400px)]">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {history.length === 0 ? (
                                                <div className="col-span-3 text-center text-muted-foreground py-8">
                                                    Not found history
                                                </div>
                                            ) : (
                                                history.map((item, index) => (
                                                    <Button
                                                        key={index}
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => fetchWord(item.word.id)}
                                                        className="h-12 bg-accent text-word-button-foreground font-normal"
                                                    >
                                                        {item.word.value}
                                                    </Button>
                                                ))
                                            )}
                                        </div>
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent value="favorites" className="mt-4">
                                    <ScrollArea className="h-screen max-h-[calc(100vh-400px)]">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {favorites.length === 0 ? (
                                                <div className="col-span-3 text-center text-muted-foreground py-8">
                                                    Not found favorites
                                                </div>
                                            ) : (
                                                favorites.map((favorite, index) => (
                                                    <Button
                                                        key={index}
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => fetchWord(favorite.word.id)}
                                                        className="h-12 bg-accent text-word-button-foreground font-normal"
                                                    >
                                                        {favorite.word.value}
                                                    </Button>
                                                ))
                                            )}
                                        </div>
                                    </ScrollArea>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
