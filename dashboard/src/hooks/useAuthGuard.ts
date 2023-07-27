import { getSavedUser } from '@/utils/localStorage';
import { useRouter } from 'next/router';

export default function useAuthGuard() {
    const router = useRouter();
    const user = getSavedUser();

    if (!user?.access_token) router.push('/login');
}
