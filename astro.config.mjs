import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
  // Deployment Configuration for GitHub Pages
  site: 'https://nevinshine.github.io',
  base: '/research-dossier', 
  
  integrations: [
    starlight({
      title: 'Nevin Lab | Systems Security',
      social: [
        {
          label: 'GitHub',
          href: 'https://github.com/nevinshine',
          icon: 'github',
        },
        {
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/nevin-shine-b403b932b',
          icon: 'linkedin',
        },
      ],
      sidebar: [
        {
          label: '01. The Manifesto',
            link: '/manifesto', 
        },
        {
          label: '02. The Architecture',
          // Manual items list for logical "Research Story" flow
          items: [
              { label: 'Unified Defense Graph', link: '/architecture/unified_map' },
              { label: 'Sentinel-CC', link: '/architecture/sentinel_cc' },
              { label: 'Sentinel Runtime', link: '/architecture/sentinel_runtime' },
              { label: 'Hyperion XDP', link: '/architecture/hyperion' },
              { label: 'Telos Runtime', link: '/architecture/telos' },
          ],
        },
        {
          label: '03. The Engineering',
            autogenerate: { directory: 'engineering' },
        },
        {
          label: '04. The Evidence',
            autogenerate: { directory: 'evidence' },
        },
        {
          label: '05. Lab Notes',
            autogenerate: { directory: 'log' },
        },
      ],
      customCss: [
        // './src/styles/custom.css', 
      ],
    }),
    mermaid(),
  ],
});