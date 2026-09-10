import { Conversation, UserAccount, AuditLog, AdminMetrics } from './types';

export const INITIAL_USER: UserAccount = {
  id: 'usr_admin_01',
  name: 'Detx Wolf (Admin)',
  email: 'detxwolfgamer15@gmail.com',
  role: 'admin',
  plan: 'Enterprise Blood',
  requestsCount: 42,
  createdAt: '2026-09-01',
  status: 'active',
  avatar: '/ocypus_logo.jpg'
};

export const SAMPLE_USERS: UserAccount[] = [
  INITIAL_USER,
  {
    id: 'usr_02',
    name: 'Carlos Oliveira',
    email: 'carlos.dev@techcorp.com',
    role: 'user',
    plan: 'Pro Wolf',
    requestsCount: 128,
    createdAt: '2026-09-03',
    status: 'active'
  },
  {
    id: 'usr_03',
    name: 'Mariana Silva',
    email: 'mariana.financas@empresa.com.br',
    role: 'user',
    plan: 'Enterprise Blood',
    requestsCount: 310,
    createdAt: '2026-09-05',
    status: 'active'
  },
  {
    id: 'usr_04',
    name: 'Roberto Mendes',
    email: 'roberto.mendes@startup.io',
    role: 'user',
    plan: 'Free',
    requestsCount: 15,
    createdAt: '2026-09-08',
    status: 'blocked'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    title: 'Gerador de APK E-commerce',
    createdAt: '2026-09-10T12:00:00.000Z',
    updatedAt: '2026-09-10T12:05:00.000Z',
    category: 'Hoje',
    messages: [
      {
        id: 'msg_1',
        role: 'user',
        content: 'Crie um APK Android para um aplicativo de delivery com tema dark.',
        timestamp: '14:30',
        mode: 'apk'
      },
      {
        id: 'msg_2',
        role: 'assistant',
        content: '🐺 Estrutura do projeto Android APK criada com sucesso! Você pode inspecionar os arquivos Kotlin e o manifesto abaixo ou baixar o ZIP pronto.',
        timestamp: '14:31',
        mode: 'apk',
        apkData: {
          appName: 'OcypusDelivery',
          packageName: 'com.ocypus.delivery',
          versionName: '1.0.0',
          versionCode: 1,
          minSdk: 24,
          targetSdk: 34,
          description: 'Aplicativo de delivery rápido com suporte a geolocalização e pagamentos.',
          keyFeatures: [
            'Interface em Jetpack Compose com tema Midnight & Red',
            'Cardápio dinâmico com navegação fluida',
            'Carrinho de compras reativo com StateFlow',
            'Integração com Google Maps API'
          ],
          buildInstructions: [
            'Extraia o arquivo ZIP do projeto',
            'Abra no Android Studio 2024+',
            'Aguarde a sincronização do Gradle',
            'Compile executando ./gradlew assembleDebug ou assembleRelease'
          ],
          files: [
            {
              path: 'app/src/main/AndroidManifest.xml',
              name: 'AndroidManifest.xml',
              language: 'xml',
              content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.ocypus.delivery">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

    <application
        android:allowBackup="true"
        android:label="Ocypus Delivery"
        android:theme="@style/Theme.OcypusDelivery">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
            },
            {
              path: 'app/src/main/java/com/ocypus/delivery/MainActivity.kt',
              name: 'MainActivity.kt',
              language: 'kotlin',
              content: `package com.ocypus.delivery

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            DeliveryAppTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Color(0xFF08080A)
                ) {
                    DeliveryHomeScreen()
                }
            }
        }
    }
}

@Composable
fun DeliveryHomeScreen() {
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text(
            text = "🐺 OCYPUS DELIVERY",
            style = MaterialTheme.typography.headlineMedium,
            color = Color(0xFFDC2626)
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(text = "Entregas ultrarrápidas ativadas", color = Color.White)
    }
}

@Composable
fun DeliveryAppTheme(content: @Composable () -> Unit) {
    MaterialTheme(content = content)
}`
            },
            {
              path: 'app/build.gradle.kts',
              name: 'build.gradle.kts',
              language: 'groovy',
              content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.ocypus.delivery"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.ocypus.delivery"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}`
            }
          ]
        }
      }
    ]
  },
  {
    id: 'conv_2',
    title: 'Planilha Financeira Q3',
    createdAt: '2026-09-09T14:20:00.000Z',
    updatedAt: '2026-09-09T14:21:00.000Z',
    category: 'Ontem',
    messages: [
      {
        id: 'msg_3',
        role: 'user',
        content: 'Gere uma planilha com previsão de custos operacionais e margem de lucro.',
        timestamp: '14:20',
        mode: 'spreadsheet'
      },
      {
        id: 'msg_4',
        role: 'assistant',
        content: '🐺 Planilha gerada com sucesso! Você pode editar as células diretamente ou exportar para Excel (.xlsx) e Relatório PDF pelos botões abaixo.',
        timestamp: '14:21',
        mode: 'spreadsheet',
        spreadsheetData: {
          title: 'Previsão de Custos e Margem Q3/Q4',
          description: 'Orçamento consolidado das divisões de engenharia e operações.',
          headers: ['Mês', 'Receita Bruta (R$)', 'Custo Servidores (R$)', 'Equipe (R$)', 'Marketing (R$)', 'Lucro Líquido (R$)', 'Margem (%)'],
          rows: [
            ['Julho', 145000, 18500, 52000, 14000, 60500, '41.7%'],
            ['Agosto', 168000, 21000, 52000, 16500, 78500, '46.7%'],
            ['Setembro', 195000, 24500, 56000, 19000, 95500, '49.0%'],
            ['Outubro', 220000, 27000, 58000, 22000, 113000, '51.4%']
          ],
          summary: [
            { label: 'Receita Total Prevista', value: 'R$ 728.000,00' },
            { label: 'Lucro Líquido Acumulado', value: 'R$ 347.500,00' },
            { label: 'Margem Média', value: '47.2%' }
          ]
        }
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_01',
    timestamp: '2026-09-10 14:15:22',
    userEmail: 'detxwolfgamer15@gmail.com',
    action: 'apk_generate',
    tokensUsed: 1450,
    durationMs: 820,
    status: 'success',
    details: 'Gerou estrutura APK OcypusDelivery (Kotlin + Jetpack Compose)'
  },
  {
    id: 'log_02',
    timestamp: '2026-09-10 13:42:10',
    userEmail: 'mariana.financas@empresa.com.br',
    action: 'spreadsheet_export',
    tokensUsed: 890,
    durationMs: 640,
    status: 'success',
    details: 'Exportou planilha Excel (.xlsx) com 24 linhas e fórmulas'
  },
  {
    id: 'log_03',
    timestamp: '2026-09-10 12:30:05',
    userEmail: 'carlos.dev@techcorp.com',
    action: 'code_generate',
    tokensUsed: 620,
    durationMs: 410,
    status: 'success',
    details: 'Gerou script em Rust e Go para parsing concorrente'
  },
  {
    id: 'log_04',
    timestamp: '2026-09-10 11:10:48',
    userEmail: 'detxwolfgamer15@gmail.com',
    action: 'pdf_extract',
    tokensUsed: 2100,
    durationMs: 1250,
    status: 'success',
    details: 'Extração automática de PDF de faturamento com 5 tabelas'
  }
];

export const INITIAL_ADMIN_METRICS: AdminMetrics = {
  totalUsers: 4,
  totalConversations: 12,
  totalRequestsToday: 184,
  totalPdfsProcessed: 48,
  totalSpreadsheetsGenerated: 92,
  totalApksBuilt: 35,
  totalTokensUsed: 342190,
  averageLatencyMs: 680,
  systemStatus: 'healthy',
  languageDistribution: [
    { language: 'Python', count: 45, percentage: 28 },
    { language: 'TypeScript', count: 38, percentage: 24 },
    { language: 'Kotlin', count: 28, percentage: 17 },
    { language: 'Rust', count: 18, percentage: 11 },
    { language: 'Go', count: 14, percentage: 9 },
    { language: 'Outras', count: 17, percentage: 11 }
  ],
  toolUsageDistribution: [
    { tool: 'Planilhas / Excel', count: 92, percentage: 35 },
    { tool: 'Gerador APK', count: 54, percentage: 21 },
    { tool: 'Extração PDF', count: 48, percentage: 18 },
    { tool: 'Engenharia de Código', count: 42, percentage: 16 },
    { tool: 'Imagens IA', count: 26, percentage: 10 }
  ]
};
