import { defineConfig } from 'unocss';

export default defineConfig({
  preflights: [
    {
      getCSS: ({ theme }) => `
            html  {
                background-color: ${theme.colors?.slate?.[100] ?? 'white'};
                height: 100vh;
            }
        `,
    },
  ],
});
