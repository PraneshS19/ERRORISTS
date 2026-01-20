interface TrendCardProps {
  title: string;
  category: string;
  onClick: () => void;
}

export const TrendCard = ({ title, category, onClick }: TrendCardProps) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-full border border-border font-medium hover:scale-105 hover:border-primary hover:shadow-primary transition-all bg-card text-foreground"
    >
      {title}
    </button>
  );
};
