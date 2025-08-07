declare namespace NodeJS {
    interface ProcessEnv {
        PORT: string;
        JWT_SECRET: string;
        REDIS_URL: string;
        DATABASE_URL: string;
        DICTIONARY_URL: string;
    }
}   