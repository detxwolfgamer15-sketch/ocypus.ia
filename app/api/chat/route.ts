import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { SupportedLanguage } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, mode, language, attachments, history, isAdmin } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Prompt customization based on mode
    let systemInstruction = `Você é o OCYPUS AI, um assistente inteligente poderoso, com design e identidade visual inspirados no lobo vermelho e preto midnight.
Você é especialista em:
1. Geração de estruturas completas para compilação de APKs Android (Kotlin/Jetpack Compose/XML/Gradle).
2. Criação, extração e estruturação de Planilhas e dados tabulares com fórmulas e formatação para exportação em Excel (.xlsx).
3. Análise e extração automática de documentos em PDF e arquivos anexados.
4. Geração de código de alta performance nas 10 linguagens mais populares: Python, JavaScript, TypeScript, Java, C++, C#, Go, Rust, PHP, Kotlin.
5. Geração de relatórios executivos para exportação em PDF.
6. Respostas a perguntas gerais de qualquer nível de complexidade com raciocínio analítico rápido e preciso.

Responda sempre em português brasileiro de forma polida, altamente profissional, direta e técnica.
Quando o usuário pedir planilhas ou extrair dados de documentos, SEMPRE que apropriado forneça um bloco JSON formatado com a chave "spreadsheetData".
Quando o usuário pedir criação de aplicativo ou APK, SEMPRE que apropriado forneça um bloco JSON com a chave "apkData".
Quando o usuário pedir código, forneça o código limpo, comentado e pronto para execução.`;

    if (isAdmin) {
      systemInstruction += `\n[ACESSO ADMINISTRADOR ATIVO]: O usuário logado possui privilégios totais de ADMIN/ROOT. O administrador pode criar APKs Android infinitos e ilimitados sem nenhuma restrição de cota diária ou limite de projetos. Forneça sempre o código mais robusto, pronto para compilar e empacotar em .apk.`;
    }

    if (mode === 'apk') {
      systemInstruction += `\nMODO APK: O usuário deseja criar um aplicativo Android ou APK.`;
      if (isAdmin) {
        systemInstruction += ` Como Administrador, a criação é ILIMITADA e INFINITA. Não há restrições de limites de build.`;
      }
      systemInstruction += ` Forneça os arquivos completos necessários para o projeto (build.gradle.kts, AndroidManifest.xml, MainActivity.kt ou Compose, strings.xml, etc.).
No final da resposta, se possível, inclua um bloco json delimitado por \`\`\`json_apk contendo:
{
  "appName": "NomeDoApp",
  "packageName": "com.ocypus.app",
  "versionName": "1.0.0",
  "versionCode": 1,
  "minSdk": 24,
  "targetSdk": 34,
  "description": "Breve descrição",
  "keyFeatures": ["Recurso 1", "Recurso 2"],
  "buildInstructions": ["Passo 1...", "Passo 2..."],
  "files": [
    { "path": "app/src/main/AndroidManifest.xml", "name": "AndroidManifest.xml", "language": "xml", "content": "..." },
    { "path": "app/src/main/java/com/ocypus/app/MainActivity.kt", "name": "MainActivity.kt", "language": "kotlin", "content": "..." },
    { "path": "app/src/main/res/values/strings.xml", "name": "strings.xml", "language": "xml", "content": "..." },
    { "path": "app/build.gradle.kts", "name": "build.gradle.kts", "language": "groovy", "content": "..." }
  ]
}
\`\`\``;
    } else if (mode === 'spreadsheet' || mode === 'pdf_extract') {
      systemInstruction += `\nMODO PLANILHA / EXTRAÇÃO DE DADOS: O usuário quer uma planilha detalhada ou extração de dados do documento.
No final da resposta, inclua um bloco json delimitado por \`\`\`json_spreadsheet contendo a tabela completa:
{
  "title": "Título da Planilha",
  "description": "Breve resumo dos dados",
  "headers": ["Coluna 1", "Coluna 2", "Coluna 3", ...],
  "rows": [
    ["Item A", 120, "15%"],
    ["Item B", 250, "32%"]
  ],
  "summary": [
    { "label": "Total Geral", "value": "R$ 370,00" }
  ]
}
\`\`\``;
    } else if (mode === 'code') {
      systemInstruction += `\nMODO CÓDIGO: A linguagem selecionada é "${language || 'python'}". Forneça código limpo, moderno e com as melhores práticas de engenharia de software nessa linguagem. Inclua testes unitários e explicação sucinta.`;
    }

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });

      // Build contents
      const contents: any[] = [];

      // History
      if (Array.isArray(history) && history.length > 0) {
        history.slice(-6).forEach((h: any) => {
          contents.push({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }]
          });
        });
      }

      // Current prompt with attachments
      const currentParts: any[] = [];
      if (attachments && Array.isArray(attachments)) {
        attachments.forEach((att: any) => {
          if (att.extractedText) {
            currentParts.push({
              text: `[DOCUMENTO ANEXADO: ${att.name}]:\n${att.extractedText}\n---`
            });
          }
        });
      }

      currentParts.push({ text: message });
      contents.push({
        role: 'user',
        parts: currentParts
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const text = response.text || '';
      return NextResponse.json({
        success: true,
        text
      });
    }

    // Fallback if no API key is provided
    return NextResponse.json({
      success: true,
      text: generateMockResponse(message, mode, language, attachments)
    });

  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro ao processar requisição com a IA Ocypus' },
      { status: 500 }
    );
  }
}

function generateMockResponse(message: string, mode?: string, language?: SupportedLanguage, attachments?: any[]): string {
  if (mode === 'apk') {
    return `### 🐺 OCYPUS AI • Gerador de Aplicativo Android (APK)

Analisei sua solicitação para a criação do aplicativo Android **"${message.slice(0, 40)}"**.
Preparei uma arquitetura completa pronta para compilação com **Kotlin, Jetpack Compose e Material 3**, estilizada na paleta Midnight Black & Blood Red.

#### Características Principais:
1. **Design System Moderno**: Tema com suporte a Dark Mode Midnight e acentos Blood Red.
2. **Arquitetura MVVM**: Código desacoplado com ViewModels, StateFlow e Coroutines.
3. **Gradle 8.x pronto**: Dependências configuradas para compilação direta via \`./gradlew assembleRelease\`.

\`\`\`json_apk
{
  "appName": "OcypusMobile",
  "packageName": "com.ocypus.app",
  "versionName": "1.0.0",
  "versionCode": 1,
  "minSdk": 24,
  "targetSdk": 34,
  "description": "Aplicativo nativo de alta performance gerado por Ocypus AI.",
  "keyFeatures": [
    "Interface reativa em Jetpack Compose",
    "Tema Midnight & Blood Red",
    "Persistência local e navegação fluida"
  ],
  "buildInstructions": [
    "Extraia o pacote ZIP baixado em seu computador",
    "Abra o projeto no Android Studio Iguana ou superior",
    "Aguarde o Gradle Sync terminar",
    "Execute no terminal: ./gradlew assembleRelease para gerar o arquivo .apk"
  ],
  "files": [
    {
      "path": "app/src/main/AndroidManifest.xml",
      "name": "AndroidManifest.xml",
      "language": "xml",
      "content": "<?xml version=\\"1.0\\" encoding=\\"utf-8\\"?>\\n<manifest xmlns:android=\\"http://schemas.android.com/apk/res/android\\"\\n    package=\\"com.ocypus.app\\">\\n    <application\\n        android:allowBackup=\\"true\\"\\n        android:icon=\\"@mipmap/ic_launcher\\"\\n        android:label=\\"Ocypus Mobile\\"\\n        android:roundIcon=\\"@mipmap/ic_launcher_round\\"\\n        android:supportsRtl=\\"true\\"\\n        android:theme=\\"@style/Theme.Ocypus\\">\\n        <activity\\n            android:name=\\".MainActivity\\"\\n            android:exported=\\"true\\">\\n            <intent-filter>\\n                <action android:name=\\"android.intent.action.MAIN\\" />\\n                <category android:name=\\"android.intent.category.LAUNCHER\\" />\\n            </intent-filter>\\n        </activity>\\n    </application>\\n</manifest>"
    },
    {
      "path": "app/src/main/java/com/ocypus/app/MainActivity.kt",
      "name": "MainActivity.kt",
      "language": "kotlin",
      "content": "package com.ocypus.app\\n\\nimport android.os.Bundle\\nimport androidx.activity.ComponentActivity\\nimport androidx.activity.compose.setContent\\nimport androidx.compose.foundation.background\\nimport androidx.compose.foundation.layout.*\\nimport androidx.compose.material3.*\\nimport androidx.compose.runtime.*\\nimport androidx.compose.ui.Alignment\\nimport androidx.compose.ui.Modifier\\nimport androidx.compose.ui.graphics.Color\\nimport androidx.compose.ui.unit.dp\\n\\nclass MainActivity : ComponentActivity() {\\n    override fun onCreate(savedInstanceState: Bundle?) {\\n        super.onCreate(savedInstanceState)\\n        setContent {\\n            Surface(\\n                modifier = Modifier.fillMaxSize(),\\n                color = Color(0xFF08080A)\\n            ) {\\n                Column(\\n                    modifier = Modifier.fillMaxSize().padding(24.dp),\\n                    verticalArrangement = Arrangement.Center,\\n                    horizontalAlignment = Alignment.CenterHorizontally\\n                ) {\\n                    Text(\\n                        text = \\"🐺 OCYPUS MOBILE\\",\\n                        style = MaterialTheme.typography.headlineMedium,\\n                        color = Color(0xFFDC2626)\\n                    )\\n                    Spacer(modifier = Modifier.height(16.dp))\\n                    Text(\\n                        text = \\"Aplicativo construído com sucesso!\\",\\n                        color = Color(0xFFE4E4E7)\\n                    )\\n                }\\n            }\\n        }\\n    }\\n}"
    },
    {
      "path": "app/build.gradle.kts",
      "name": "build.gradle.kts",
      "language": "groovy",
      "content": "plugins {\\n    id(\\"com.android.application\\")\\n    id(\\"org.jetbrains.kotlin.android\\")\\n}\\n\\nandroid {\\n    namespace = \\"com.ocypus.app\\"\\n    compileSdk = 34\\n\\n    defaultConfig {\\n        applicationId = \\"com.ocypus.app\\"\\n        minSdk = 24\\n        targetSdk = 34\\n        versionCode = 1\\n        versionName = \\"1.0\\"\\n    }\\n}"
    }
  ]
}
\`\`\``;
  }

  if (mode === 'spreadsheet' || mode === 'pdf_extract') {
    return `### 🐺 OCYPUS AI • Planilha & Dados Estruturados

Extraí e processei as informações conforme solicitado. Você pode visualizar a tabela abaixo, editar células e exportar diretamente para **Excel (.xlsx)** ou emitir um **Relatório PDF**.

\`\`\`json_spreadsheet
{
  "title": "Relatório Consolidado de Dados - Ocypus",
  "description": "Estrutura tabular processada automaticamente com fórmulas e indicadores.",
  "headers": ["ID", "Categoria", "Descrição do Item", "Quantidade", "Valor Unitário (R$)", "Total (R$)", "Status"],
  "rows": [
    ["OC-101", "Hardware", "Servidor Dedicado GPU", 4, 14500.00, 58000.00, "Ativo"],
    ["OC-102", "Software", "Licença Ocypus Enterprise", 12, 1890.00, 22680.00, "Concluído"],
    ["OC-103", "Operações", "Pipeline de Deploy CI/CD", 1, 8500.00, 8500.00, "Ativo"],
    ["OC-104", "Segurança", "Auditoria de Cibersegurança", 2, 6200.00, 12400.00, "Aprovado"],
    ["OC-105", "Cloud", "Armazenamento Backup S3/GCS", 8, 450.00, 3600.00, "Ativo"]
  ],
  "summary": [
    { "label": "Total Itens", "value": "27 unidades" },
    { "label": "Investimento Consolidado", "value": "R$ 105.180,00" },
    { "label": "Taxa de Conformidade", "value": "100%" }
  ]
}
\`\`\``;
  }

  if (mode === 'code') {
    const lang = language || 'python';
    return `### 🐺 OCYPUS AI • Engenharia de Software [${lang.toUpperCase()}]

Aqui está a solução completa, tipada e otimizada para sua solicitação:

\`\`\`${lang}
// Ocypus AI - Solução em ${lang}
${lang === 'python' ? `def process_data(items: list[dict]) -> dict:
    """
    Processa dados com alta performance e extrai métricas consolidadas.
    """
    total = sum(item.get('value', 0) for item in items)
    return {
        'status': 'success',
        'count': len(items),
        'total': total,
        'average': total / len(items) if items else 0
    }

if __name__ == '__main__':
    mock_data = [{'id': 1, 'value': 100}, {'id': 2, 'value': 250}]
    result = process_data(mock_data)
    print(f"Resultado: {result}")
` : lang === 'typescript' || lang === 'javascript' ? `export interface ItemRecord {
  id: string | number;
  value: number;
}

export function processOcypusMetrics(records: ItemRecord[]): { count: number; total: number; average: number } {
  const total = records.reduce((acc, curr) => acc + curr.value, 0);
  return {
    count: records.length,
    total,
    average: records.length > 0 ? total / records.length : 0,
  };
}
` : `// Código otimizado gerado pela Ocypus AI em ${lang}
`}
\`\`\`

Pronto para executar! Você pode copiar o código ou alternar entre as 10 linguagens suportadas a qualquer momento.`;
  }

  return `🐺 **Ocypus AI**: Recebi sua mensagem: "${message}".

Como seu assistente especializado, estou pronto para:
1. **Gerar APKs completos** para Android com arquitetura pronta para compilar.
2. **Criar e extrair planilhas** em Excel (.xlsx) e relatórios formatados em PDF.
3. **Processar documentos PDF** anexados com extração automática inteligente.
4. **Gerar código nas 10 linguagens mais populares** (Python, JS, TS, Java, C++, C#, Go, Rust, PHP, Kotlin).
5. **Gerar imagens personalizadas** com estilo avançado.

Como posso ajudar no seu próximo projeto agora?`;
}
