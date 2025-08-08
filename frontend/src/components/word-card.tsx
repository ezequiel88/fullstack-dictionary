"use client";

import { useState } from "react";
import { Play, Pause, ArrowLeft, ArrowRight, Heart, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface NormalizedMeaning {
    partOfSpeech: string;
    definition: string;
}
interface NormalizedWord {
    id: string;
    isFavorite: boolean;
    word: string;
    phonetic: string;
    audios: { text?: string; audio: string }[];
    meanings: NormalizedMeaning[];
    synonyms: string[];
}

type Props = {
    word: NormalizedWord | null;
    onToggleFavorite: (word: NormalizedWord) => void;
};

export default function WordCard({ word, onToggleFavorite }: Props) {

    const [playingIndex, setPlayingIndex] = useState<number | null>(null);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
    const [currentMeaningIndex, setCurrentMeaningIndex] = useState(0);

    if (!word?.word) {
        return (
            <div className="space-y-6">
                <Card className="@container/card p-8 h-full">
                    <CardContent className="text-center space-y-8 p-0">
                        <Quote size={100} className="mx-auto opacity-5" />
                        <p className="text-muted-foreground text-lg">
                            Select a word to see its meaning, pronunciation and examples</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handlePlay = (index: number, url: string) => {
        // Se já está tocando o mesmo áudio → parar
        if (playingIndex === index && audioElement) {
            audioElement.pause();
            setAudioElement(null);
            setPlayingIndex(null);
            return;
        }

        // Se outro áudio está tocando → parar
        if (audioElement) {
            audioElement.pause();
        }

        const audio = new Audio(url);
        audio.onended = () => {
            setPlayingIndex(null);
            setAudioElement(null);
        };

        setAudioElement(audio);
        setPlayingIndex(index);
        audio.play().catch(() => {
            setPlayingIndex(null);
            setAudioElement(null);
        });
    };

    const handleNextMeaning = () =>
        setCurrentMeaningIndex((prev) =>
            prev + 1 < word.meanings.length ? prev + 1 : 0
        );
    const handlePreviousMeaning = () =>
        setCurrentMeaningIndex((prev) =>
            prev - 1 >= 0 ? prev - 1 : word.meanings.length - 1
        );

    const currentMeaning = word.meanings[currentMeaningIndex];

    return (
        <div className="space-y-6">
            {/* Word Card */}
            <Card className="@container/card relative">
                <CardContent className="text-center p-0">
                    <h1 className="text-4xl font-bold text-lesson-card-foreground">
                        {word.word}
                    </h1>
                    <p className="text-2xl text-lesson-card-foreground/80 font-medium mt-4">
                        {word.phonetic}
                    </p>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleFavorite(word)}
                        className="rounded-full hover:bg-primary/90 absolute top-2 right-2 z-10"
                    >
                        {word.isFavorite ? <Heart className="size-5" fill="red" strokeWidth={1} /> : <Heart className="size-5" />}
                    </Button>
                </CardContent>
            </Card>


            {/* Audio Player - um botão por áudio */}
            {word.audios.map((audio, index) => (
                <div
                    key={index}
                    className="flex items-center justify-center gap-4 px-6 mt-4"
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePlay(index, audio.audio)}
                        className="w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        {playingIndex === index ? (
                            <Pause className="h-6 w-6" />
                        ) : (
                            <Play className="h-6 w-6" />
                        )}
                    </Button>
                    {audio.text && <span>{audio.text}</span>}
                    <div className="flex-1 max-w-md">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-primary transition-all duration-1000 ${playingIndex === index ? "w-full" : "w-0"
                                    }`}
                            />
                        </div>
                    </div>
                </div>
            ))}

            {/* Meanings Section */}
            {currentMeaning && (
                <Card className="@container/card py-0 mt-6">
                    <CardContent className="p-4 md:p-6 md:pb-2 ">
                        <h2 className="text-xl font-semibold mb-3">
                            {currentMeaning.partOfSpeech || "Meaning"}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            {currentMeaning.definition ?? "No definition"}
                        </p>

                        {word.synonyms.length > 0 && (
                            <>
                                <h2 className="font-semibold mt-4">Synonyms</h2>
                                <p className="text-muted-foreground mb-4">
                                    {word.synonyms.join(", ")}
                                </p>
                            </>
                        )}

                        {word.meanings.length > 1 && (
                            <div className="space-x-4 mt-6 mb-2">
                                <Button
                                    variant="outline"
                                    onClick={handlePreviousMeaning}
                                    className="h-8 w-8 rounded-full"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleNextMeaning}
                                    className="h-8 w-8 rounded-full"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
