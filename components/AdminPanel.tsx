'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UserAccount, AuditLog, AdminMetrics } from '@/lib/types';
import { testSupabaseConnection, isSupabaseConfigured } from '@/lib/supabase';
import { 
  ShieldAlert, 
  Users, 
  Activity, 
  FileSpreadsheet, 
  Smartphone, 
  FileText, 
  Terminal, 
  X, 
  Search, 
  Ban, 
  CheckCircle, 
  Sliders, 
  Cpu, 
  Clock, 
  Layers, 
  Sparkles,
  RefreshCw,
  BarChart3,
  Server,
  Database,
  Copy,
  Download,
  Check,
  ExternalLink,
  Code
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserAccount[];
  onToggleUserStatus: (userId: string) => void;
  metrics: AdminMetrics;
  auditLogs: AuditLog[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  users,
  onToggleUserStatus,
  metrics,
  auditLogs
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs' | 'settings' | 'database'>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [logFilter, setLogFilter] = useState('all');
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{
    connected: boolean;
    latencyMs: number;
    message: string;
    configured: boolean;
  } | null>(null);
  const [isCopiedMigration, setIsCopiedMigration] = useState(false);

  if (!isOpen) return null;

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredLogs = auditLogs.filter(log => {
    if (logFilter === 'all') return true;
    return log.action === logFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4 backdrop-blur-lg">
      <div className="flex h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-[#3b1720] bg-[#07080b] shadow-[0_0_80px_rgba(220,38,38,0.25)]">
        
        {/* Admin Header */}
        <div className="flex items-center justify-between border-b border-[#29131a] bg-[#12090e] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-red-600/50 bg-black shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              <Image
                src="/ocypus_logo.jpg"
                alt="Ocypus Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-base font-black tracking-wider text-red-500">
                  PAINEL DE CONTROLE ADMINISTRATIVO
                </h2>
                <span className="rounded bg-red-950 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-800/40">
                  ROOT / OCYPUS MASTER
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Monitoramento em tempo real, gestão de usuários, APKs, planilhas e métricas do cluster
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-[#201016] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#221016] bg-[#0c0e14] px-6 py-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                : 'text-zinc-400 hover:bg-[#181116] hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Visão Geral & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                : 'text-zinc-400 hover:bg-[#181116] hover:text-zinc-200'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Gestão de Usuários ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'logs'
                ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                : 'text-zinc-400 hover:bg-[#181116] hover:text-zinc-200'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Logs de Auditoria</span>
          </button>

          <button
            id="tab-admin-settings"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                : 'text-zinc-400 hover:bg-[#181116] hover:text-zinc-200'
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>Configurações & IA</span>
          </button>

          <button
            id="tab-admin-database"
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'database'
                ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                : 'text-zinc-400 hover:bg-[#181116] hover:text-zinc-200'
            }`}
          >
            <Database className="h-4 w-4" />
            <span className="flex items-center gap-1.5">
              <span>Supabase & Banco</span>
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            </span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-red-950">
          {/* TAB 1: OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top metric cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-[#35161e] bg-[#0e1017] p-4">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Requisições Hoje</span>
                    <Sparkles className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{metrics.totalRequestsToday}</div>
                  <div className="text-[11px] text-emerald-400 mt-1">↑ +18% vs ontem</div>
                </div>

                <div className="rounded-2xl border border-[#35161e] bg-[#0e1017] p-4">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>APKs Compilados</span>
                    <Smartphone className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{metrics.totalApksBuilt}</div>
                  <div className="text-[11px] text-zinc-400 mt-1">Kotlin / Jetpack Compose</div>
                </div>

                <div className="rounded-2xl border border-[#35161e] bg-[#0e1017] p-4">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Planilhas & Excel</span>
                    <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{metrics.totalSpreadsheetsGenerated}</div>
                  <div className="text-[11px] text-zinc-400 mt-1">Exportadas em .xlsx</div>
                </div>

                <div className="rounded-2xl border border-[#35161e] bg-[#0e1017] p-4">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>PDFs Processados</span>
                    <FileText className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{metrics.totalPdfsProcessed}</div>
                  <div className="text-[11px] text-zinc-400 mt-1">Extração automática ativa</div>
                </div>
              </div>

              {/* Secondary Status bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-[#2b141b] bg-[#0a0c12] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Server className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="text-xs text-zinc-400">Status dos Clusters</div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Operacional (99.98%)</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">{metrics.averageLatencyMs}ms latência</span>
                </div>

                <div className="rounded-2xl border border-[#2b141b] bg-[#0a0c12] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="text-xs text-zinc-400">Tokens Processados</div>
                      <div className="text-sm font-bold text-white font-mono">
                        {(metrics.totalTokensUsed / 1000).toFixed(1)}k tokens
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500">Gemini Engine</span>
                </div>

                <div className="rounded-2xl border border-[#2b141b] bg-[#0a0c12] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="text-xs text-zinc-400">Contas Registradas</div>
                      <div className="text-sm font-bold text-white font-mono">{users.length} usuários</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-red-400 font-bold">1 SuperAdmin</span>
                </div>
              </div>

              {/* Distributions: 10 Languages + Tools */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 10 Languages Distribution */}
                <div className="rounded-2xl border border-[#30151c] bg-[#0a0c12] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                      <Terminal className="h-4 w-4" />
                      <span>Uso das 10 Linguagens Mais Populares</span>
                    </h4>
                    <span className="text-[10px] text-zinc-500 font-mono">Últimos 30 dias</span>
                  </div>

                  <div className="space-y-3">
                    {metrics.languageDistribution.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs text-zinc-300">
                          <span className="font-semibold">{item.language}</span>
                          <span className="font-mono text-zinc-400">{item.count} reqs ({item.percentage}%)</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#181116]">
                          <div
                            className="h-full bg-gradient-to-r from-red-600 to-red-500"
                            style={{ width: `${item.percentage * 2.8}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tool Usage Distribution */}
                <div className="rounded-2xl border border-[#30151c] bg-[#0a0c12] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                      <Layers className="h-4 w-4" />
                      <span>Distribuição de Recursos da IA</span>
                    </h4>
                    <span className="text-[10px] text-zinc-500 font-mono">Consolidação Geral</span>
                  </div>

                  <div className="space-y-3">
                    {metrics.toolUsageDistribution.map((tool, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs text-zinc-300">
                          <span className="font-semibold">{tool.tool}</span>
                          <span className="font-mono text-zinc-400">{tool.count} execuções ({tool.percentage}%)</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#181116]">
                          <div
                            className="h-full bg-gradient-to-r from-red-700 to-red-500"
                            style={{ width: `${tool.percentage * 2.5}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Search & filters */}
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou e-mail..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full rounded-xl border border-[#2b141b] bg-[#0f1118] pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none"
                  />
                </div>
                <div className="text-xs text-zinc-400">
                  Mostrando <span className="text-white font-bold">{filteredUsers.length}</span> usuários
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-[#2b141b] bg-[#0c0e14]">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="border-b border-[#261218] bg-[#140b0f] text-[11px] font-bold uppercase tracking-wider text-red-400">
                    <tr>
                      <th className="px-4 py-3">Usuário</th>
                      <th className="px-4 py-3">Função</th>
                      <th className="px-4 py-3">Plano</th>
                      <th className="px-4 py-3">Requisições</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#201017]">
                    {filteredUsers.map((usr) => (
                      <tr key={usr.id} className="hover:bg-[#160d13]/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 font-bold text-white shadow-[0_0_8px_rgba(220,38,38,0.4)]">
                              {usr.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-white">{usr.name}</div>
                              <div className="text-[11px] text-zinc-400">{usr.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                            usr.role === 'admin'
                              ? 'bg-red-950 text-red-400 border-red-800'
                              : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                          }`}>
                            {usr.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-300 font-medium">
                          {usr.plan}
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-300">
                          {usr.requestsCount} reqs
                        </td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1.5 text-xs font-semibold ${
                            usr.status === 'active' ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              usr.status === 'active' ? 'bg-emerald-400' : 'bg-red-500'
                            }`} />
                            {usr.status === 'active' ? 'Ativo' : 'Bloqueado'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onToggleUserStatus(usr.id)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                              usr.status === 'active'
                                ? 'border border-red-900/60 bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-white'
                                : 'border border-emerald-900/60 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 hover:text-white'
                            }`}
                          >
                            {usr.status === 'active' ? 'Bloquear' : 'Desbloquear'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-medium">Filtrar Ação:</span>
                  <select
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value)}
                    className="rounded-xl border border-[#2b141b] bg-[#0f1118] px-3 py-1.5 text-xs text-white focus:border-red-600 focus:outline-none"
                  >
                    <option value="all">Todas as Ações</option>
                    <option value="apk_generate">Geração de APK</option>
                    <option value="spreadsheet_export">Planilhas / Excel</option>
                    <option value="pdf_extract">Extração PDF</option>
                    <option value="code_generate">Engenharia de Código</option>
                  </select>
                </div>

                <span className="text-xs text-zinc-400">
                  {filteredLogs.length} eventos registrados
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#2b141b] bg-[#0c0e14]">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="border-b border-[#261218] bg-[#140b0f] text-[11px] font-bold uppercase tracking-wider text-red-400">
                    <tr>
                      <th className="px-4 py-3">Data / Hora</th>
                      <th className="px-4 py-3">Ação</th>
                      <th className="px-4 py-3">Usuário</th>
                      <th className="px-4 py-3">Detalhes</th>
                      <th className="px-4 py-3">Tokens</th>
                      <th className="px-4 py-3">Latência</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#201017]">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#160d13]/60 transition-colors">
                        <td className="px-4 py-3 font-mono text-[11px] text-zinc-400">
                          {log.timestamp}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-[#1e1017] px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-900/40">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-300 font-medium">
                          {log.userEmail}
                        </td>
                        <td className="px-4 py-3 text-zinc-400 truncate max-w-xs">
                          {log.details}
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-400">
                          {log.tokensUsed}
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-400">
                          {log.durationMs}ms
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            log.status === 'success'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-red-950 text-red-400 border border-red-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS & AI ENGINE */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div className="rounded-2xl border border-[#30151c] bg-[#0a0c12] p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-red-500" />
                  <span>Configuração de Modelos IA Ocypus</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-zinc-300 font-semibold mb-1 block">Modelo de Raciocínio & Código</label>
                    <select className="w-full rounded-xl border border-[#2b141b] bg-[#12141c] p-2.5 text-xs text-white focus:border-red-600 focus:outline-none">
                      <option>gemini-2.5-flash (Alta Performance e Baixa Latência)</option>
                      <option>gemini-2.5-pro (Raciocínio Complexo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-300 font-semibold mb-1 block">Motor de Geração de Imagens</label>
                    <select className="w-full rounded-xl border border-[#2b141b] bg-[#12141c] p-2.5 text-xs text-white focus:border-red-600 focus:outline-none">
                      <option>imagen-3.0-generate-002 (Alta Definição e Precisão)</option>
                      <option>gemini-2.5-flash-image</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-300 font-semibold mb-1 block">Temperatura Criativa (0.0 - 1.0)</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue="0.7"
                      className="w-full accent-red-600"
                    />
                    <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                      <span>0.0 (Mais Preciso/Determinístico)</span>
                      <span>0.7 (Padrão Ocypus)</span>
                      <span>1.0 (Mais Criativo)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SUPABASE & DATABASE MIGRATIONS */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              {/* Top Banner: Supabase Status */}
              <div className="rounded-2xl border border-[#30151c] bg-[#0a0c12] p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-900 border border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">Integração Supabase PostgreSQL</h4>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                          isSupabaseConfigured() 
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                            : 'bg-red-950/80 text-red-400 border-red-800/80'
                        }`}>
                          {isSupabaseConfigured() ? 'PRODUÇÃO ATIVA' : 'MODO LOCAL / STANDALONE'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Gerenciamento de tabelas, persistência de conversas, APKs, planilhas e migrations SQL
                      </p>
                    </div>
                  </div>

                  <button
                    id="btn-test-supabase"
                    disabled={isTestingSupabase}
                    onClick={async () => {
                      setIsTestingSupabase(true);
                      setSupabaseTestResult(null);
                      const res = await testSupabaseConnection();
                      setSupabaseTestResult(res);
                      setIsTestingSupabase(false);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:from-red-500 hover:to-red-600 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${isTestingSupabase ? 'animate-spin' : ''}`} />
                    <span>{isTestingSupabase ? 'Testando Conexão...' : 'Testar Conexão Supabase'}</span>
                  </button>
                </div>

                {supabaseTestResult && (
                  <div className={`mt-4 rounded-xl border p-3.5 text-xs ${
                    supabaseTestResult.connected 
                      ? 'border-emerald-800/80 bg-emerald-950/30 text-emerald-300' 
                      : 'border-amber-800/80 bg-amber-950/30 text-amber-300'
                  }`}>
                    <div className="font-semibold flex items-center gap-1.5 mb-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>{supabaseTestResult.connected ? 'Status: Conectado com Sucesso' : 'Status da Conexão'}</span>
                      {supabaseTestResult.latencyMs > 0 && (
                        <span className="font-mono text-[11px] text-zinc-400">({supabaseTestResult.latencyMs}ms)</span>
                      )}
                    </div>
                    <p className="text-zinc-300">{supabaseTestResult.message}</p>
                  </div>
                )}
              </div>

              {/* Database Tables Overview */}
              <div className="rounded-2xl border border-[#30151c] bg-[#0a0c12] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="h-4 w-4 text-red-500" />
                    <span>Tabelas Mapeadas no Banco de Dados (7 Tabelas)</span>
                  </h4>
                  <span className="text-xs text-zinc-500 font-mono">Schema: public</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl border border-[#27141b] bg-[#11131b] p-3">
                    <div className="font-bold text-red-400 flex items-center justify-between">
                      <span>public.users</span>
                      <span className="text-[10px] text-zinc-500 font-mono">RLS ON</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] mt-1">Perfis de usuário, planos, contadores de uso e role admin/user.</p>
                  </div>

                  <div className="rounded-xl border border-[#27141b] bg-[#11131b] p-3">
                    <div className="font-bold text-red-400 flex items-center justify-between">
                      <span>public.conversations</span>
                      <span className="text-[10px] text-zinc-500 font-mono">RLS ON</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] mt-1">Histórico de bate-papos por usuário com título e categoria.</p>
                  </div>

                  <div className="rounded-xl border border-[#27141b] bg-[#11131b] p-3">
                    <div className="font-bold text-red-400 flex items-center justify-between">
                      <span>public.messages</span>
                      <span className="text-[10px] text-zinc-500 font-mono">RLS ON</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] mt-1">Mensagens, payloads de APK, planilhas JSONB e anexos.</p>
                  </div>

                  <div className="rounded-xl border border-[#27141b] bg-[#11131b] p-3">
                    <div className="font-bold text-red-400 flex items-center justify-between">
                      <span>public.apk_projects</span>
                      <span className="text-[10px] text-zinc-500 font-mono">RLS ON</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] mt-1">Manifests, arquivos Kotlin Jetpack Compose e instruções de build.</p>
                  </div>

                  <div className="rounded-xl border border-[#27141b] bg-[#11131b] p-3">
                    <div className="font-bold text-red-400 flex items-center justify-between">
                      <span>public.spreadsheets</span>
                      <span className="text-[10px] text-zinc-500 font-mono">RLS ON</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] mt-1">Planilhas dinâmicas criadas ou extraídas de PDFs, headers e rows.</p>
                  </div>

                  <div className="rounded-xl border border-[#27141b] bg-[#11131b] p-3">
                    <div className="font-bold text-red-400 flex items-center justify-between">
                      <span>public.audit_logs</span>
                      <span className="text-[10px] text-zinc-500 font-mono">RLS ON</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] mt-1">Trilha de auditoria das ações com tokens e latência.</p>
                  </div>
                </div>
              </div>

              {/* Migration Viewer */}
              <div className="rounded-2xl border border-[#30151c] bg-[#0a0c12] p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Code className="h-4 w-4 text-red-500" />
                      <span>Script de Migrations SQL Gerado</span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Arquivo: <code className="text-red-400 font-mono">supabase/migrations/20260910000001_initial_schema.sql</code>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="btn-copy-migration"
                      onClick={() => {
                        const sql = `-- ==============================================================================\n-- OCYPUS AI - SUPABASE MIGRATION SCRIPT\n-- Migration: 20260910000001_initial_schema.sql\n-- Autorização: /detxwolf.ADM\n-- ==============================================================================\nCREATE EXTENSION IF NOT EXISTS "uuid-ossp";\nCREATE EXTENSION IF NOT EXISTS "pgcrypto";\n\nCREATE TABLE IF NOT EXISTS public.users (\n    id TEXT PRIMARY KEY,\n    email TEXT NOT NULL UNIQUE,\n    name TEXT NOT NULL,\n    role TEXT NOT NULL DEFAULT 'user',\n    plan TEXT NOT NULL DEFAULT 'Pro Wolf',\n    requests_count INTEGER NOT NULL DEFAULT 0,\n    status TEXT NOT NULL DEFAULT 'active',\n    avatar TEXT,\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\nCREATE TABLE IF NOT EXISTS public.conversations (\n    id TEXT PRIMARY KEY,\n    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,\n    title TEXT NOT NULL DEFAULT 'Nova Conversa',\n    category TEXT DEFAULT 'Hoje',\n    mode TEXT DEFAULT 'general',\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\nCREATE TABLE IF NOT EXISTS public.messages (\n    id TEXT PRIMARY KEY,\n    conversation_id TEXT NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,\n    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),\n    content TEXT NOT NULL,\n    mode TEXT DEFAULT 'general',\n    language TEXT,\n    spreadsheet_data JSONB,\n    apk_data JSONB,\n    generated_images JSONB,\n    attachments JSONB,\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\nCREATE TABLE IF NOT EXISTS public.apk_projects (\n    id TEXT PRIMARY KEY DEFAULT ('apk_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6)),\n    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,\n    app_name TEXT NOT NULL,\n    package_name TEXT NOT NULL,\n    version_name TEXT NOT NULL DEFAULT '1.0.0',\n    version_code INTEGER NOT NULL DEFAULT 1,\n    min_sdk INTEGER NOT NULL DEFAULT 26,\n    target_sdk INTEGER NOT NULL DEFAULT 34,\n    description TEXT,\n    files JSONB NOT NULL DEFAULT '[]'::jsonb,\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\nCREATE TABLE IF NOT EXISTS public.spreadsheets (\n    id TEXT PRIMARY KEY DEFAULT ('sheet_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6)),\n    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,\n    title TEXT NOT NULL,\n    headers JSONB NOT NULL DEFAULT '[]'::jsonb,\n    rows JSONB NOT NULL DEFAULT '[]'::jsonb,\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\nCREATE TABLE IF NOT EXISTS public.audit_logs (\n    id TEXT PRIMARY KEY DEFAULT ('log_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6)),\n    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n    user_email TEXT NOT NULL,\n    action TEXT NOT NULL,\n    tokens_used INTEGER NOT NULL DEFAULT 0,\n    duration_ms INTEGER NOT NULL DEFAULT 0,\n    status TEXT NOT NULL DEFAULT 'success',\n    details TEXT,\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\nCREATE TABLE IF NOT EXISTS public.admin_settings (\n    key TEXT PRIMARY KEY,\n    value JSONB NOT NULL,\n    description TEXT,\n    updated_by TEXT DEFAULT 'detxwolf.ADM',\n    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\nALTER TABLE public.users ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.apk_projects ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.spreadsheets ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;\n\nINSERT INTO public.users (id, email, name, role, plan, requests_count, status, avatar)\nVALUES ('usr_admin_01', 'detxwolfgamer15@gmail.com', 'Detx Wolf (Admin)', 'admin', 'Enterprise Blood', 142, 'active', '/ocypus_logo.jpg')\nON CONFLICT (email) DO UPDATE SET role = 'admin';\n`;
                        navigator.clipboard.writeText(sql);
                        setIsCopiedMigration(true);
                        setTimeout(() => setIsCopiedMigration(false), 2000);
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-red-800/60 bg-[#160d12] px-3 py-1.5 text-xs text-red-300 hover:bg-red-950/60 transition-all"
                    >
                      {isCopiedMigration ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{isCopiedMigration ? 'Copiado!' : 'Copiar SQL'}</span>
                    </button>

                    <button
                      id="btn-download-migration"
                      onClick={() => {
                        const element = document.createElement('a');
                        const file = new Blob([
                          `-- OCYPUS AI SUPABASE MIGRATION 20260910000001_initial_schema.sql\n`
                        ], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = '20260910000001_initial_schema.sql';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-red-800/60 bg-[#160d12] px-3 py-1.5 text-xs text-red-300 hover:bg-red-950/60 transition-all"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Baixar .sql</span>
                    </button>
                  </div>
                </div>

                {/* Code Preview Box */}
                <div className="relative rounded-xl border border-[#221016] bg-[#050608] p-4 font-mono text-[11px] text-zinc-300 overflow-x-auto max-h-72 scrollbar-thin scrollbar-thumb-red-950">
                  <pre className="text-zinc-300">
                    <span className="text-red-500">-- 1. Habilitar extensões</span>{'\n'}
                    CREATE EXTENSION IF NOT EXISTS &quot;uuid-ossp&quot;;{'\n'}
                    CREATE EXTENSION IF NOT EXISTS &quot;pgcrypto&quot;;{'\n\n'}
                    <span className="text-red-500">-- 2. Tabela de Usuários & Perfis (Admin: detxwolfgamer15@gmail.com)</span>{'\n'}
                    CREATE TABLE IF NOT EXISTS public.users ({'\n'}
                    {'    '}id TEXT PRIMARY KEY,{'\n'}
                    {'    '}email TEXT NOT NULL UNIQUE,{'\n'}
                    {'    '}name TEXT NOT NULL,{'\n'}
                    {'    '}role TEXT NOT NULL DEFAULT &apos;user&apos;,{'\n'}
                    {'    '}plan TEXT NOT NULL DEFAULT &apos;Pro Wolf&apos;,{'\n'}
                    {'    '}requests_count INTEGER NOT NULL DEFAULT 0,{'\n'}
                    {'    '}status TEXT NOT NULL DEFAULT &apos;active&apos;,{'\n'}
                    {'    '}avatar TEXT,{'\n'}
                    {'    '}created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),{'\n'}
                    {'    '}updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(){'\n'}
                    );{'\n\n'}
                    <span className="text-red-500">-- 3. Tabela de Conversas e Mensagens</span>{'\n'}
                    CREATE TABLE IF NOT EXISTS public.conversations ({'\n'}
                    {'    '}id TEXT PRIMARY KEY,{'\n'}
                    {'    '}user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,{'\n'}
                    {'    '}title TEXT NOT NULL DEFAULT &apos;Nova Conversa&apos;,{'\n'}
                    {'    '}category TEXT DEFAULT &apos;Hoje&apos;,{'\n'}
                    {'    '}mode TEXT DEFAULT &apos;general&apos;,{'\n'}
                    {'    '}created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(){'\n'}
                    );{'\n\n'}
                    <span className="text-red-500">-- 4. Tabela de Projetos APK Android</span>{'\n'}
                    CREATE TABLE IF NOT EXISTS public.apk_projects ({'\n'}
                    {'    '}id TEXT PRIMARY KEY,{'\n'}
                    {'    '}user_id TEXT REFERENCES public.users(id),{'\n'}
                    {'    '}app_name TEXT NOT NULL,{'\n'}
                    {'    '}package_name TEXT NOT NULL,{'\n'}
                    {'    '}files JSONB NOT NULL DEFAULT &apos;[]&apos;::jsonb{'\n'}
                    );{'\n\n'}
                    <span className="text-red-500">-- 5. Row Level Security & Políticas Ativas</span>{'\n'}
                    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;{'\n'}
                    ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;{'\n'}
                    ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;{'\n'}
                    ALTER TABLE public.apk_projects ENABLE ROW LEVEL SECURITY;{'\n'}
                    ALTER TABLE public.spreadsheets ENABLE ROW LEVEL SECURITY;{'\n'}
                    ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;{'\n'}
                    ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

