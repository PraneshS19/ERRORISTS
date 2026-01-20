export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-12 h-12 border-4 rounded-full animate-spin border-border border-t-primary"></div>
      <p className="mt-4 text-lg text-muted-foreground">Loading trend data...</p>
    </div>
  );
};
