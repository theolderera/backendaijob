export interface KnowledgeResponse {
    tj: string;
    ru: string;
    en: string;
}
export interface KnowledgeItem {
    id: string;
    category: string;
    keywords: string[];
    responses: KnowledgeResponse;
}
export declare const KNOWLEDGE_BASE: KnowledgeItem[];
