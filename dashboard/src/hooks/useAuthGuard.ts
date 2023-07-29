import { getSavedUser } from '@/utils/localStorage';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function useAuthGuard() {
    const router = useRouter();

    useEffect(() => {
        const user = getSavedUser();

        if (!user?.access_token?.length) router.push('/login');
    }, []);
}
