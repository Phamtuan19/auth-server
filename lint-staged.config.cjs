module.exports = {
   '*': () => 'pnpm format:fix',
   '*.(js|jsx|ts|tsx)': () => ['pnpm lint', 'pnpm validate', 'git add .'],
};
