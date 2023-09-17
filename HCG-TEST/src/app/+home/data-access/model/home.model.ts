export namespace HomeApiModel {

    export interface repositoryRequest {
        per_page: number,
        page: number,
        order: 'desc' | 'asc',
        name: string,
        sort: string,
        owner: string,
        created_at: string,
        language: string,
        size: number
    }

    export interface repositoryResponse {
        full_name: string,
        description: string,
        id: number,
        language: string,
        updated_at: string,
        score: number,
        owner: string
    }

    export interface Request {
        avatar_url: string;
        login: string;
    }

    export interface Response {
        avatar_url: string;
        login: string;
    }

    export interface LanguageResponse {
        name: string,
        aliases: string[]
    }
}
