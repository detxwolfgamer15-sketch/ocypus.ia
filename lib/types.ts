export type SupportedLanguage = 
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'java'
  | 'cpp'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'php'
  | 'kotlin';

export interface LanguageInfo {
  id: SupportedLanguage;
  name: string;
  icon: string;
  extension: string;
  syntax: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  plan: string;
  requestsCount: number;
  createdAt: string;
  status: 'active' | 'blocked';
}

export interface SpreadsheetCell {
  value: string | number;
  formula?: string;
}

export interface SpreadsheetData {
  title: string;
  description?: string;
  headers: string[];
  rows: (string | number)[][];
  summary?: {
    label: string;
    value: string | number;
  }[];
}

export interface ApkFile {
  path: string;
  name: string;
  content: string;
  language: 'kotlin' | 'java' | 'xml' | 'groovy' | 'json';
}

export interface ApkProjectData {
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  minSdk: number;
  targetSdk: number;
  description: string;
  files: ApkFile[];
  buildInstructions: string[];
  keyFeatures: string[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: 'pdf' | 'spreadsheet' | 'code' | 'image';
  dataUrl?: string; // base64
  extractedText?: string;
}

export type AppMode = 'general' | 'apk' | 'spreadsheet' | 'pdf_extract' | 'code' | 'image';

export interface GeneratedImageItem {
  id: string;
  url: string;
  prompt: string;
  aspectRatio?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  mode?: AppMode;
  attachments?: MessageAttachment[];
  language?: SupportedLanguage;
  spreadsheetData?: SpreadsheetData;
  apkData?: ApkProjectData;
  codeSnippets?: {
    language: SupportedLanguage;
    code: string;
    explanation?: string;
  }[];
  generatedImages?: GeneratedImageItem[];
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  category?: 'Hoje' | 'Ontem' | 'Esta Semana' | 'Anteriores';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  action: 'chat' | 'apk_generate' | 'pdf_extract' | 'spreadsheet_export' | 'code_generate' | 'pdf_report';
  tokensUsed: number;
  durationMs: number;
  status: 'success' | 'error';
  details: string;
}

export interface AdminMetrics {
  totalUsers: number;
  totalConversations: number;
  totalRequestsToday: number;
  totalPdfsProcessed: number;
  totalSpreadsheetsGenerated: number;
  totalApksBuilt: number;
  totalTokensUsed: number;
  averageLatencyMs: number;
  systemStatus: 'healthy' | 'warning' | 'degraded';
  languageDistribution: { language: string; count: number; percentage: number }[];
  toolUsageDistribution: { tool: string; count: number; percentage: number }[];
}
