export interface Profile {
  id:                 number;
  name:               string;
  headline:           string;
  bio:                string;
  location:           string;
  email:              string;
  github_url:         string;
  linkedin_url:       string;
  available_for_work: boolean;
}

export type ProjectCategory = 'web_app' | 'api' | 'tool';

export interface Project {
  id:               number;
  title:            string;
  description:      string;
  category:         ProjectCategory;
  category_display: string;
  tech_stack:       string[];
  live_url:         string;
  github_url:       string;
  date_built:       string;
  featured:         boolean;
  is_published?:    boolean;
  order:            number;
  created_at?:      string;
}

export type SkillCategory    = 'frontend' | 'backend' | 'database' | 'tools';
export type SkillProficiency = 'beginner' | 'intermediate' | 'advanced';

export interface Skill {
  id:                  number;
  name:                string;
  category:            SkillCategory;
  category_display:    string;
  proficiency:         SkillProficiency;
  proficiency_display: string;
  order:               number;
}

export interface Experience {
  id:          number;
  role:        string;
  company:     string;
  start_date:  string;
  end_date:    string | null;
  description: string;
  is_current:  boolean;
}

export interface ContactMessage {
  id:           number;
  name:         string;
  email:        string;
  message:      string;
  submitted_at: string;
  is_read:      boolean;
}

export interface PaginatedResponse<T> {
  count:    number;
  next:     string | null;
  previous: string | null;
  results:  T[];
}

export interface ContactPayload {
  name:    string;
  email:   string;
  message: string;
}