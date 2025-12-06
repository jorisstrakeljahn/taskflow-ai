export const LoadingSpinner = () => {
  return (
    <div className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-light dark:border-accent-dark"></div>
      <p className="mt-4">Loading tasks...</p>
    </div>
  );
};

