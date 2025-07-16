'use client';

import { useLoading } from '@/lib/loading-context';
import { LoadingOverlay } from './ui/loading-overlay';


export default function LoadingOverlayWrapper() {
    const { isLoading } = useLoading();
    return <LoadingOverlay isVisible={isLoading} />;
}
