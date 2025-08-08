/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FavoriteItem, HistoryItem, Word, WordDefinition, WordListResponse, WordSearchResponse } from "@/types";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import WordCard from "@/components/word-card";
import WordListTab from "@/components/word-list-tab";
import HistoryTab from "@/components/history-tab";
import FavoritesTab from "@/components/favorites-tab";

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
            const { data } = await api.get<WordSearchResponse>(`/entries/en/${id}`);
            const wordData: WordDefinition = {
                ...data.word,
                id: data.id,
                isFavorite: data.isFavorite
            };
            setWord(wordData);
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
                setFavorites(res.data);
            }
        } catch (error) {
            showToast.favorites.fetchError();
            console.error("Erro ao buscar favoritos:", error);
        }
    }, []);

    const markFavorite = useCallback(async (id: string) => {
        try {
            const result = await markAsFavorite(id);
            if (result.success) {
                fetchFavorites();
                return true;
            } else {
                showToast.favorites.markError();
                console.error("Erro ao marcar favorito:", result.message);
                return false;
            }
        } catch (error) {
            showToast.favorites.markError();
            console.error("Erro ao marcar favorito:", error);
            return false;
        }
    }, []);

    const unmarkFavorite = useCallback(async (id: string) => {
        try {
            const result = await removeFavorite(id);
            if (result.success) {
                fetchFavorites();
                return true;
            } else {
                showToast.favorites.removeError();
                console.error("Erro ao desmarcar favorito:", result.message);
                return false;
            }
        } catch (error) {
            showToast.favorites.removeError();
            console.error("Erro ao desmarcar favorito:", error);
            return false;
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

                // Sempre atualizar a URL com o cursor atual, seja para nova busca ou scroll infinito
                updateURL({ search: query ?? search, cursor: data.next ?? null });
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



    const handleLoadMore = useCallback((cursor: string) => {
        fetchWords(cursor, true);
    }, [fetchWords]);

    const handleToggleFavorite = useCallback(async (wordDef: WordDefinition) => {
        console.log('handleToggleFavorite called with:', { id: wordDef.id, word: wordDef.word, isFavorite: wordDef.isFavorite });
        
        let success = false;
        
        if (wordDef.isFavorite) {
            success = await unmarkFavorite(wordDef.id);
        } else {
            success = await markFavorite(wordDef.id);
        }
        
        // Atualizar o estado da palavra atual apenas se a operação foi bem-sucedida
        if (success && word && word.id === wordDef.id) {
            setWord({ ...word, isFavorite: !wordDef.isFavorite });
        }
    }, [word, markFavorite, unmarkFavorite]);


    return (
        <div className="container mx-auto p-4 space-y-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow">
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
                                            Palavras
                                        </TabsTrigger>
                                        <TabsTrigger className="px-8" value="history">
                                            Histórico
                                        </TabsTrigger>
                                        <TabsTrigger className="px-8" value="favorites">
                                            Favoritos
                                        </TabsTrigger>
                                    </TabsList>
                                    <div className="mt-2 md:mt-0 col-span-3 md:col-span-1 flex items-center">
                                        {activeTab === "wordlist" && (
                                            <Input
                                                type="search"
                                                placeholder="Buscar palavras..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="h-10 flex-1 w-full"
                                            />
                                        )}
                                    </div>
                                </div>
                                <TabsContent value="wordlist" className="mt-4">
                                    <WordListTab
                                        words={words}
                                        loading={loading}
                                        isSearching={isSearching}
                                        nextCursor={nextCursor}
                                        onWordClick={fetchWord}
                                        onLoadMore={handleLoadMore}
                                    />
                                </TabsContent>

                                <TabsContent value="history" className="mt-4">
                                    <HistoryTab
                                        history={history}
                                        onWordClick={fetchWord}
                                    />
                                </TabsContent>

                                <TabsContent value="favorites" className="mt-4">
                                    <FavoritesTab
                                        favorites={favorites}
                                        onWordClick={fetchWord}
                                    />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
