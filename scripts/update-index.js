#!/usr/bin/env node

/**
 * update-index.js
 * 
 * Scans all .md files in the posts/ directory, extracts YAML front-matter,
 * and generates/updates posts/index.json.
 * 
 * Usage:
 *   node scripts/update-index.js
 * 
 * Requirements: Node.js 16+ (uses fs/path, no external dependencies)
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'posts');
const INDEX_FILE = path.join(POSTS_DIR, 'index.json');

function parseFrontMatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return null;

    const frontMatter = {};
    const lines = match[1].split('\n');

    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;

        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // Handle arrays [item1, item2]
        if (value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
        }
        // Handle quoted strings
        else if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        }

        frontMatter[key] = value;
    }

    return frontMatter;
}

function estimateReadTime(content) {
    // Strip front-matter
    const body = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    const words = body.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min`;
}

function main() {
    console.log('📝 Scanning posts directory...\n');

    if (!fs.existsSync(POSTS_DIR)) {
        console.error('❌ Posts directory not found:', POSTS_DIR);
        process.exit(1);
    }

    const mdFiles = fs.readdirSync(POSTS_DIR)
        .filter(f => f.endsWith('.md'))
        .sort();

    const posts = [];

    for (const file of mdFiles) {
        const filePath = path.join(POSTS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const frontMatter = parseFrontMatter(content);

        if (!frontMatter || !frontMatter.title) {
            console.warn(`⚠️  Skipping ${file} — no valid front-matter found`);
            continue;
        }

        const slug = file.replace('.md', '');

        const post = {
            slug,
            title: frontMatter.title,
            description: frontMatter.description || '',
            date: frontMatter.date || new Date().toISOString().split('T')[0],
            tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : [],
            readTime: frontMatter.readTime || estimateReadTime(content),
            author: frontMatter.author || 'Azeka Consulting',
        };

        posts.push(post);
        console.log(`  ✅ ${slug}`);
        console.log(`     "${post.title}"`);
        console.log(`     Tags: ${post.tags.join(', ')} | ${post.readTime}`);
        console.log('');
    }

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Write index.json
    fs.writeFileSync(INDEX_FILE, JSON.stringify(posts, null, 2), 'utf-8');

    console.log(`\n✨ Done! ${posts.length} articles indexed → posts/index.json`);
}

main();
