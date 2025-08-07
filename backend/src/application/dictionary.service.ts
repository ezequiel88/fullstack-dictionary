import redisClient from "@/infrastructure/cache/redis.js"
import api from "@/infrastructure/lib/api.js";
import { DictionaryResponse } from "@/infrastructure/types/dictionary.js";

export class DictionaryService {
     static async getWordDictionary(word: string) {
        try {
            const { data } = await api.get<DictionaryResponse>(`/${word}`);
            return data
        } catch (e) {
            throw e;
        }
    }

    static async searchWord(word: string) {
        const cacheKey = `dictionary:word:${word.toLowerCase()}`

        if (redisClient) {
            const cached = await redisClient.get(cacheKey)

            if (cached) {
                return {
                    word: JSON.parse(cached),
                    fromCache: true
                };
            }
        }

        const wordDictionary = await this.getWordDictionary(word);

        if (!wordDictionary) {
            return null;
        }

        if (redisClient) {
            await redisClient.set(cacheKey, JSON.stringify(wordDictionary));
        }

        return {
            word: wordDictionary,
            fromCache: false
        };
    }
}