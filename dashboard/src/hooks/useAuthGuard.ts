import { getSavedAuth } from '@/utils/localStorage';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function useAuthGuard() {
    const router = useRouter();

    useEffect(() => {
        const auth = getSavedAuth();

        if (!auth?.access_token) router.push('/login');
    }, []);
}
