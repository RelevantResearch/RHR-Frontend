import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface StatusCardProps {
  title: string;
  count: number;
  description: string;
}

export function StatusCard({ title, count, description }: StatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{count}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
