import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

// Cores do tema
const themeColor = '#007AFF';
const backgroundColor = '#ffffff';

// Função para criar um ícone PNG
async function createIcon(size, outputPath) {
    const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${size}" height="${size}" fill="${backgroundColor}"/>
            <rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.8}" 
                  fill="${themeColor}" rx="${size * 0.15}"/>
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" 
                  font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">G</text>
        </svg>
    `;

    await sharp(Buffer.from(svg))
        .png()
        .resize(size, size)
        .toFile(outputPath);
    
    console.log(`✓ Criado: ${outputPath} (${size}x${size})`);
}

// Criar os ícones
async function generateIcons() {
    const publicDir = resolve(process.cwd(), 'public');
    
    try {
        await createIcon(192, resolve(publicDir, 'icon-192.png'));
        await createIcon(512, resolve(publicDir, 'icon-512.png'));
        console.log('\n✅ Ícones gerados com sucesso!');
    } catch (error) {
        console.error('Erro ao gerar ícones:', error);
        process.exit(1);
    }
}

generateIcons();


