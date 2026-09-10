import { LanguageInfo, SupportedLanguage } from './types';

export const TOP_10_LANGUAGES: LanguageInfo[] = [
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    extension: '.py',
    syntax: 'python'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '⚡',
    extension: '.js',
    syntax: 'javascript'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '🔷',
    extension: '.ts',
    syntax: 'typescript'
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    extension: '.java',
    syntax: 'java'
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: '⚙️',
    extension: '.cpp',
    syntax: 'cpp'
  },
  {
    id: 'csharp',
    name: 'C# (.NET)',
    icon: '🟣',
    extension: '.cs',
    syntax: 'csharp'
  },
  {
    id: 'go',
    name: 'Go (Golang)',
    icon: '🐹',
    extension: '.go',
    syntax: 'go'
  },
  {
    id: 'rust',
    name: 'Rust',
    icon: '🦀',
    extension: '.rs',
    syntax: 'rust'
  },
  {
    id: 'php',
    name: 'PHP',
    icon: '🐘',
    extension: '.php',
    syntax: 'php'
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    icon: '🤖',
    extension: '.kt',
    syntax: 'kotlin'
  }
];

export function getLanguageInfo(id?: string): LanguageInfo {
  const match = TOP_10_LANGUAGES.find(lang => lang.id === id);
  return match || TOP_10_LANGUAGES[0];
}
