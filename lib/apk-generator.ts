import JSZip from 'jszip';
import { ApkProjectData } from './types';

export function createApkProjectZip(apkData: ApkProjectData): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file('README.md', `# ${apkData.appName}\n\n${apkData.description}\n\n## Instruções para Compilar o APK\n\n${apkData.buildInstructions.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}\n\n### Estrutura do Pacote\n- Package: \`${apkData.packageName}\`\n- Target SDK: \`${apkData.targetSdk}\`\n- Min SDK: \`${apkData.minSdk}\`\n\n### Compilação via Linha de Comando\n\`\`\`bash\n# No terminal Linux/macOS:\n./gradlew assembleRelease\n\n# No Windows:\ngradlew.bat assembleRelease\n\`\`\`\n\nO APK compilado estará em \`app/build/outputs/apk/release/app-release.apk\`.\n`);

  zip.file('build.gradle.kts', `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}
`);

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
rootProject.name = "${apkData.appName.replace(/[^a-zA-Z0-9]/g, '')}"
include(":app")
`);

  // Add individual files from apkData
  apkData.files.forEach(file => {
    zip.file(file.path, file.content);
  });

  return zip.generateAsync({ type: 'blob' });
}

export function downloadApkProjectZip(apkData: ApkProjectData) {
  createApkProjectZip(apkData).then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanName = apkData.appName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `${cleanName}_android_project.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
