import JSZip from 'jszip';
import { ApkProjectData } from './types';

export async function downloadApkProjectZip(apkData: ApkProjectData): Promise<void> {
  try {
    const zip = new JSZip();

    // Readme
    const readmeContent = `# ${apkData.appName}
Pacote: ${apkData.packageName}
Versão: ${apkData.versionName} (Código ${apkData.versionCode})
SDK Mínimo: ${apkData.minSdk} | Target SDK: ${apkData.targetSdk}

## Descrição
${apkData.description}

## Recursos Principais
${apkData.keyFeatures.map(f => `- ${f}`).join('\n')}

## Como Compilar o APK
${apkData.buildInstructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}

### No Terminal:
\`\`\`bash
# Compilar versão de depuração (Debug APK):
./gradlew assembleDebug

# O arquivo APK gerado estará em:
# app/build/outputs/apk/debug/app-debug.apk
\`\`\`

Gerado por Ocypus AI - Sistema de Criação de Aplicativos.
`;
    zip.file('README.md', readmeContent);

    // Add each project file
    apkData.files.forEach(file => {
      zip.file(file.path, file.content);
    });

    // Ensure root gradle files exist if not present
    if (!apkData.files.some(f => f.path === 'build.gradle.kts' || f.path === 'build.gradle')) {
      zip.file('build.gradle.kts', `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}
`);
    }

    if (!apkData.files.some(f => f.path === 'settings.gradle.kts')) {
      zip.file('settings.gradle.kts', `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "${apkData.appName.toLowerCase().replace(/[^a-z0-9]/g, '_')}"
include(":app")
`);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${apkData.appName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_android_project.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao gerar pacote ZIP do APK:', error);
  }
}
