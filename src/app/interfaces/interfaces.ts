export interface User {
    token: string;
    expiresIn: number;
}

export interface ProjectList {
    result: Project[];
    total: number;
    itemsPerPage: number;
}

export interface Project {
    project_name?: string;
    project_description?: string;
    project_identifier?: string;
    created_at?: string;
    updated_at?: string;
}
